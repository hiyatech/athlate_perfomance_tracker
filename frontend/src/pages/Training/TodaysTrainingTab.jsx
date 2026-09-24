import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { trainingApi } from '../../api/trainingApi';
import { Calendar, CheckCircle2, Moon, Clock, Play, Pause, RotateCcw, Award, FileText } from 'lucide-react';

export default function TodaysTrainingTab() {
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [markingId, setMarkingId] = useState(null);

  // Per-exercise timer states e.g. { [exId]: { seconds: 60, isRunning: false } }
  const [timers, setTimers] = useState({});
  const [logNotes, setLogNotes] = useState({});

  useEffect(() => {
    loadToday();
  }, []);

  // Timer interval countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const updated = { ...prevTimers };
        let changed = false;

        Object.keys(updated).forEach((exId) => {
          const t = updated[exId];
          if (t && t.isRunning && t.seconds > 0) {
            updated[exId] = { ...t, seconds: t.seconds - 1 };
            changed = true;

            if (t.seconds - 1 === 0) {
              updated[exId].isRunning = false;
              alert(`⏰ Timer complete for drill! Great effort!`);
            }
          }
        });

        return changed ? updated : prevTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadToday = async () => {
    try {
      const data = await trainingApi.getToday();
      setTodayData(data);

      // Initialize exercise timers
      if (data && data.exercises) {
        const initTimers = {};
        data.exercises.forEach((ex) => {
          const secs = parseInt(ex.duration) || 60;
          initTimers[ex._id] = { seconds: secs, initialSeconds: secs, isRunning: false };
        });
        setTimers(initTimers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTimer = (exId) => {
    setTimers((prev) => ({
      ...prev,
      [exId]: { ...prev[exId], isRunning: true }
    }));
  };

  const handlePauseTimer = (exId) => {
    setTimers((prev) => ({
      ...prev,
      [exId]: { ...prev[exId], isRunning: false }
    }));
  };

  const handleResetTimer = (exId) => {
    setTimers((prev) => ({
      ...prev,
      [exId]: { ...prev[exId], isRunning: false, seconds: prev[exId]?.initialSeconds || 60 }
    }));
  };

  const handleMarkDone = async (item) => {
    if (item.isDone || markingId) return;

    setMsg('');
    const noteText = logNotes[item._id] || '';
    setMarkingId(item._id);
    try {
      const res = await trainingApi.logWorkout(item.exerciseId || item._id, {
        plannedTrainingId: todayData.plan._id,
        exerciseName: item.name,
        dayName: todayData.dayName,
        actualSets: item.sets || 3,
        actualReps: item.reps || 10,
        actualTime: item.unitType === 'duration' ? (parseInt(item.duration) || 60) : 0,
        note: noteText
      });
      setMsg(res.log?.isPersonalBest ? '🎉 Personal Best Recorded!' : `Completed: ${item.name}!`);
      await loadToday();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update workout status.');
    } finally {
      setMarkingId(null);
    }
  };

  if (loading) return <div className="p-8 text-brand-muted text-sm font-medium">Loading today's workout schedule...</div>;

  if (!todayData || !todayData.plan) {
    return (
      <Card className="text-center py-12">
        <Calendar size={40} className="mx-auto text-brand-muted mb-3" />
        <h3 className="font-bold text-base text-brand-charcoal">No Active Training Program Found</h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto mb-4">
          Go to Goal & Training Plan in the sidebar to build and activate your training schedule.
        </p>
      </Card>
    );
  }

  const { dayName, isRest, exercises } = todayData;
  const completedCount = exercises.filter(e => e.isDone).length;

  return (
    <div className="space-y-6">
      {msg && (
        <div className="bg-brand-accent-light text-brand-accent font-semibold p-3.5 rounded-xl text-xs border border-brand-accent/20 flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="font-bold text-brand-accent hover:opacity-80">✕</button>
        </div>
      )}

      {/* Day Banner */}
      <div className="flex items-center justify-between bg-white border border-brand-border p-5 rounded-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-accent-light text-brand-accent flex items-center justify-center font-bold text-sm">
            {dayName.slice(0, 3)}
          </div>
          <div>
            <h3 className="font-bold text-base text-brand-charcoal">{dayName} Workout Schedule</h3>
            <p className="text-xs text-brand-muted">Program: {todayData.plan.trainingPeriod || '1 Week'} | Preferred Time: {todayData.plan.trainingTime}</p>
          </div>
        </div>

        {isRest ? (
          <span className="flex items-center gap-1.5 bg-stone-100 text-stone-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-brand-border">
            <Moon size={14} /> Scheduled Rest Day
          </span>
        ) : (
          <span className="flex items-center gap-1.5 bg-brand-accent-light text-brand-accent px-3.5 py-1.5 rounded-full text-xs font-bold border border-brand-accent/20">
            <CheckCircle2 size={14} /> {completedCount} of {exercises.length} Drills Done
          </span>
        )}
      </div>

      {/* Exercises List */}
      {isRest ? (
        <Card className="text-center py-10">
          <Moon size={40} className="mx-auto text-brand-muted mb-3" />
          <h4 className="font-bold text-base text-brand-charcoal">Rest & Recovery Day</h4>
          <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
            Take today off from heavy loading to replenish glycogen stores and rebuild muscular fibers.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {exercises.map((item, idx) => {
            const timerState = timers[item._id] || { seconds: parseInt(item.duration) || 60, isRunning: false };
            const isDurationBased = item.unitType === 'duration' || (item.duration && item.duration !== '0');

            return (
              <Card key={item._id || idx} className={`transition-all ${item.isDone ? 'bg-stone-50/80 border-stone-200' : 'hover:border-brand-accent/40'}`}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-brand-charcoal">{item.name}</h4>
                        {item.isDone && (
                          <span className="flex items-center gap-1 bg-brand-accent text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 size={12} /> Marked Done
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-muted leading-relaxed">
                        <strong className="text-brand-charcoal">How to perform:</strong> {item.instructions || 'Perform with proper form, core engaged, and steady breathing.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMarkDone(item)}
                        disabled={item.isDone || markingId === item._id}
                        className={`flex items-center gap-1 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm ${
                          item.isDone
                            ? 'bg-emerald-100 text-emerald-700 cursor-default'
                            : markingId === item._id
                              ? 'bg-brand-accent/60 text-white cursor-wait'
                            : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        {item.isDone ? 'Completed' : markingId === item._id ? 'Saving...' : 'Mark as Done'}
                      </button>
                    </div>
                  </div>

                  {/* Metrics & Countdown Timer Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-3 text-xs font-semibold text-brand-charcoal">
                      <span className="bg-stone-100 px-3 py-1 rounded-lg border border-brand-border">
                        Target: {item.sets || 3} sets × {item.reps || 10} reps
                      </span>
                    </div>

                    {/* Per-Exercise Countdown Timer */}
                    {isDurationBased && (
                      <div className="flex items-center gap-2 bg-stone-100 px-3 py-1 rounded-xl border border-brand-border">
                        <Clock size={14} className="text-brand-accent" />
                        <span className="font-mono font-bold text-sm text-brand-charcoal min-w-[40px]">
                          {Math.floor(timerState.seconds / 60)}:{(timerState.seconds % 60).toString().padStart(2, '0')}
                        </span>

                        {timerState.isRunning ? (
                          <button
                            type="button"
                            onClick={() => handlePauseTimer(item._id)}
                            className="p-1 text-amber-600 hover:bg-amber-100 rounded-lg"
                            title="Pause Timer"
                          >
                            <Pause size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartTimer(item._id)}
                            className="p-1 text-brand-accent hover:bg-brand-accent-light rounded-lg"
                            title="Start Countdown"
                          >
                            <Play size={14} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleResetTimer(item._id)}
                          className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
                          title="Reset Timer"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Workout Review / Note Input */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <FileText size={12} className="text-brand-muted" />
                      <input
                        type="text"
                        value={logNotes[item._id] || ''}
                        onChange={(e) => setLogNotes({ ...logNotes, [item._id]: e.target.value })}
                        placeholder="Add a short note or review (how did this drill feel?)..."
                        className="flex-1 px-3 py-1.5 bg-stone-50 border border-brand-border rounded-xl text-xs text-brand-charcoal focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
