import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { intelligenceApi } from '../../api/intelligenceApi';
import { Sparkles, Save, Plus, Trash2, ArrowLeft, CheckCircle2, Moon, Dumbbell } from 'lucide-react';

export default function RecommendedPlanPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get plan draft passed from route state
  const planDraft = location.state?.planDraft;

  const [schedule, setSchedule] = useState(planDraft?.planData || {});
  const [exercisePool, setExercisePool] = useState([]);
  const [saving, setSaving] = useState(false);

  // Per-day "Add Exercise" inline form state
  const [activeAddDay, setActiveAddDay] = useState(null);
  const [selectedExId, setSelectedExId] = useState('');
  const [newSets, setNewSets] = useState(3);
  const [newReps, setNewReps] = useState(10);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    async function loadExercisePool() {
      try {
        const pool = await intelligenceApi.getExercises();
        setExercisePool(pool);
        if (pool && pool.length > 0) {
          setSelectedExId(pool[0]._id);
        }
      } catch (err) {
        console.error('Failed to load exercise pool:', err);
      }
    }
    loadExercisePool();
  }, []);

  if (!planDraft) {
    return (
      <div className="p-8 max-w-4xl space-y-6">
        <div className="bg-white border border-brand-border rounded-card p-8 text-center space-y-4">
          <Dumbbell className="mx-auto text-brand-muted" size={48} />
          <h2 className="text-xl font-bold text-brand-charcoal">No Generated Plan Found</h2>
          <p className="text-xs text-brand-muted max-w-md mx-auto">
            Please fill out your target goal and preferences first to generate a customized training program.
          </p>
          <button
            onClick={() => navigate('/intelligence')}
            className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Plan Builder
          </button>
        </div>
      </div>
    );
  }

  // Remove exercise from a specific day
  const handleRemoveExercise = (day, exIndex) => {
    const updated = { ...schedule };
    if (Array.isArray(updated[day])) {
      updated[day] = updated[day].filter((_, i) => i !== exIndex);
      setSchedule(updated);
    }
  };

  // Toggle rest day for a day
  const handleToggleRestDay = (day) => {
    const updated = { ...schedule };
    if (updated[day] === 'Rest' || !Array.isArray(updated[day])) {
      updated[day] = [];
    } else {
      updated[day] = 'Rest';
    }
    setSchedule(updated);
  };

  // Open inline add exercise form for a day
  const handleOpenAddForm = (day) => {
    setActiveAddDay(day);
    if (exercisePool.length > 0) {
      setSelectedExId(exercisePool[0]._id);
    }
    setNewSets(3);
    setNewReps(10);
  };

  // Submit adding an exercise to a specific day
  const handleAddExerciseToDay = (day) => {
    if (!selectedExId) return;
    const targetEx = exercisePool.find((ex) => ex._id === selectedExId);
    if (!targetEx) return;

    const newExObj = {
      exerciseId: targetEx._id,
      name: targetEx.name,
      sets: Number(newSets) || 3,
      reps: Number(newReps) || 10,
      duration: '0'
    };

    const updated = { ...schedule };
    if (!Array.isArray(updated[day])) {
      updated[day] = [newExObj];
    } else {
      updated[day] = [...updated[day], newExObj];
    }

    setSchedule(updated);
    setActiveAddDay(null);
  };

  // Save final plan and navigate to Today's Workout (/training)
  const handleSaveAndActivatePlan = async () => {
    setSaving(true);
    try {
      const finalPayload = {
        ...planDraft,
        planData: schedule
      };
      await intelligenceApi.savePlan(finalPayload);
      // Navigate immediately to Today's Workout
      navigate('/training');
    } catch (err) {
      console.error('Failed to save plan:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/intelligence')}
          className="flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-charcoal transition-all"
        >
          <ArrowLeft size={16} /> Back to Generator
        </button>
      </div>

      {/* Days Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {daysOfWeek.map((day) => {
          const dayContent = schedule[day];
          const isRest = dayContent === 'Rest';
          const exercisesList = Array.isArray(dayContent) ? dayContent : [];

          return (
            <div
              key={day}
              className={`p-4 rounded-xl border transition-all ${
                isRest ? 'bg-stone-50 border-dashed border-stone-300' : 'bg-white border-brand-border shadow-sm'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                <span className="font-bold text-sm text-brand-charcoal">{day}</span>
              </div>

              {isRest ? (
                <div className="flex items-center gap-2 py-4 text-xs text-stone-500 italic">
                  <Moon size={16} /> Recovery & Rest Day
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Exercise List */}
                  {exercisesList.length === 0 ? (
                    <div className="text-xs text-brand-muted italic py-2">No exercises added for {day}.</div>
                  ) : (
                    exercisesList.map((ex, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-brand-charcoal">{ex.name}</div>
                          <div className="text-[11px] text-brand-muted font-semibold mt-0.5">
                            {ex.sets} sets × {ex.reps} reps
                          </div>
                        </div>
                        {/* Per-row DELETE button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(day, idx)}
                          title="Delete exercise"
                          className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))
                  )}

                  {/* Inline Add Exercise Form or + Add Exercise Button */}
                  {activeAddDay === day ? (
                    <div className="bg-brand-accent-light/40 border border-brand-accent/30 p-3 rounded-lg text-xs space-y-2">
                      <div className="font-bold text-brand-charcoal">Add Exercise to {day}</div>
                      <div>
                        <label className="text-[10px] font-semibold text-brand-muted block mb-1">Select Exercise</label>
                        <select
                          value={selectedExId}
                          onChange={(e) => setSelectedExId(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-brand-border rounded-md font-semibold text-xs text-brand-charcoal"
                        >
                          {exercisePool.map((ex) => (
                            <option key={ex._id} value={ex._id}>
                              {ex.name} ({ex.category || 'General'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold text-brand-muted block mb-0.5">Sets</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={newSets}
                            onChange={(e) => setNewSets(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-brand-border rounded-md font-semibold text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-brand-muted block mb-0.5">Reps</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={newReps}
                            onChange={(e) => setNewReps(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-brand-border rounded-md font-semibold text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveAddDay(null)}
                          className="px-3 py-1 text-xs font-semibold text-brand-muted hover:text-brand-charcoal"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddExerciseToDay(day)}
                          className="px-3 py-1 bg-brand-accent text-white font-bold rounded-md text-xs hover:bg-brand-accent-hover"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenAddForm(day)}
                      className="w-full py-2 border border-dashed border-stone-300 hover:border-brand-accent text-brand-muted hover:text-brand-accent text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                    >
                      <Plus size={14} /> Add Exercise
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Save Action Button */}
      <div className="flex justify-end pt-4 pb-8">
        <button
          type="button"
          onClick={handleSaveAndActivatePlan}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving Plan...' : 'Save Plan'}
        </button>
      </div>
    </div>
  );
}
