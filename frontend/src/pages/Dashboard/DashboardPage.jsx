import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import ProgressRing from '../../components/ProgressRing';
import ChartWidget from '../../components/ChartWidget';
import { dashboardApi } from '../../api/dashboardApi';
import { Activity, Calendar, CheckCircle2, Moon, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [weeklyGoal, setWeeklyGoal] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [weekCalendar, setWeekCalendar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [goal, growth, cal] = await Promise.all([
          dashboardApi.getWeeklyGoal(),
          dashboardApi.getOverallGrowth(),
          dashboardApi.getWeekCalendar()
        ]);
        setWeeklyGoal(goal);
        setGrowthData(growth.weeklyActivity || []);
        setWeekCalendar(cal || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-brand-muted text-sm font-medium">Loading athlete dashboard...</div>;

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      {/* Real 7-Day Week Calendar Grid */}
      <Card title="Current Week Schedule & Completion" subtitle="Mon - Sun real execution tracker based on logged workouts.">
        <div className="grid grid-cols-7 gap-2 pt-2">
          {weekCalendar.map((day, idx) => {
            let bgClass = 'bg-stone-50 border-brand-border text-brand-muted';
            let statusText = 'Upcoming';

            if (day.status === 'completed') {
              bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold';
              statusText = 'Completed';
            } else if (day.status === 'rest') {
              bgClass = 'bg-stone-100 border-stone-200 text-stone-500';
              statusText = 'Rest Day';
            } else if (day.status === 'today') {
              bgClass = 'bg-brand-accent-light/60 border-brand-accent text-brand-accent font-bold';
              statusText = 'Today';
            } else if (day.status === 'missed') {
              bgClass = 'bg-rose-50 border-rose-200 text-rose-600';
              statusText = 'Missed';
            }

            return (
              <div key={idx} className={`p-3 rounded-xl border text-center space-y-1 ${bgClass}`}>
                <p className="text-xs font-bold uppercase">{day.dayName}</p>
                <div className="flex items-center justify-center py-1">
                  {day.status === 'completed' && <CheckCircle2 size={18} />}
                  {day.status === 'rest' && <Moon size={18} />}
                  {day.status === 'today' && <Activity size={18} />}
                  {day.status === 'missed' && <AlertCircle size={18} />}
                  {day.status === 'upcoming' && <Calendar size={18} />}
                </div>
                <p className="text-[10px] font-semibold">{statusText}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Progress Ring & Growth Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Weekly Target Progress" subtitle="Target sessions completed this week.">
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <ProgressRing percentage={weeklyGoal?.percentage || 0} size={130} strokeWidth={10} />
            <div className="text-center">
              <p className="text-sm font-bold text-brand-charcoal">
                {weeklyGoal?.completedDays || 0} of {weeklyGoal?.targetDays || 4} Sessions
              </p>
              <p className="text-xs text-brand-muted">Target: {weeklyGoal?.targetDays || 4} days per week</p>
            </div>
          </div>
        </Card>

        <div className="md:col-span-2">
          <ChartWidget
            type="bar"
            title="This Month's Weekly Completed Exercises"
            subtitle="Completed exercise tasks for each week of the current month."
            data={growthData}
            xKey="week"
            yKey="completedTasks"
            label="Completed exercises"
          />
        </div>
      </div>
    </div>
  );
}
