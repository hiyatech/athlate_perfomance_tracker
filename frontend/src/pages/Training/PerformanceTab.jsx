import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import ChartWidget from '../../components/ChartWidget';
import { performanceApi } from '../../api/performanceApi';
import { Trophy, Flame, Activity, Smile, Frown, Meh, Award, TrendingUp } from 'lucide-react';

export default function PerformanceTab() {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [moodTrend, setMoodTrend] = useState({ tough: 0, okay: 0, strong: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPerformanceData() {
      try {
        const [sum, monthly, mood] = await Promise.all([
          performanceApi.getSummary(),
          performanceApi.getMonthlySessions(),
          performanceApi.getMoodTrend()
        ]);
        setSummary(sum);
        setMonthlyData(monthly);
        setMoodTrend(mood);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPerformanceData();
  }, []);

  if (loading) return <div className="p-8 text-brand-muted text-sm font-medium">Loading performance analytics...</div>;

  const totalMoods = (moodTrend.tough || 0) + (moodTrend.okay || 0) + (moodTrend.strong || 0);
  const pbList = summary?.personalBestsList || [];

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-accent-light text-brand-accent flex items-center justify-center">
          <TrendingUp size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Performance</h1>
          <p className="text-sm text-brand-muted">Review completed workouts, personal bests, growth, and workout mood.</p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-accent-light text-brand-accent flex items-center justify-center font-bold">
            <Activity size={22} />
          </div>
          <div>
            <p className="text-xs text-brand-muted font-medium">Total Workouts Logged</p>
            <h3 className="text-xl font-bold text-brand-charcoal">{summary?.totalWorkoutsLogged || 0}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Trophy size={22} />
          </div>
          <div>
            <p className="text-xs text-brand-muted font-medium">Personal Bests Set</p>
            <h3 className="text-xl font-bold text-brand-charcoal">{summary?.personalBestsCount || 0}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Flame size={22} />
          </div>
          <div>
            <p className="text-xs text-brand-muted font-medium">Total Volume Lifted</p>
            <h3 className="text-xl font-bold text-brand-charcoal">{(summary?.totalWeightLifted || 0).toLocaleString()} kg</h3>
          </div>
        </Card>
      </div>

      {/* Personal Best Breakdown Highlights */}
      {pbList.length > 0 && (
        <Card title="Exercise Personal Best Records" subtitle="Highest weight & repetitions achieved per drill.">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {pbList.map((pb, idx) => (
              <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-brand-charcoal truncate">{pb.exerciseName}</span>
                  <Award size={16} className="text-amber-600 shrink-0" />
                </div>
                <p className="text-sm font-bold text-amber-700">
                  {pb.actualWeight > 0 ? `${pb.actualWeight} kg` : `${pb.actualReps} reps`}
                </p>
                <p className="text-[10px] text-brand-muted">
                  Recorded: {new Date(pb.loggedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Exercise Growth & Mood Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ChartWidget
            type="bar"
            title="Monthly Completed Sessions"
            subtitle="Completed training days across the last 4 months."
            data={monthlyData}
            xKey="month"
            yKey="sessions"
            label="Completed sessions"
          />
        </div>

        {/* Mood Distribution Breakdown */}
        <Card title="Workout Energy & Mood Breakdown" subtitle="Distribution of workout intensity ratings.">
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-emerald-600"><Smile size={14} /> Strong</span>
                <span>{moodTrend.strong || 0} sessions</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${totalMoods > 0 ? ((moodTrend.strong || 0) / totalMoods) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-amber-600"><Meh size={14} /> Okay</span>
                <span>{moodTrend.okay || 0} sessions</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${totalMoods > 0 ? ((moodTrend.okay || 0) / totalMoods) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-rose-600"><Frown size={14} /> Tough</span>
                <span>{moodTrend.tough || 0} sessions</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${totalMoods > 0 ? ((moodTrend.tough || 0) / totalMoods) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
