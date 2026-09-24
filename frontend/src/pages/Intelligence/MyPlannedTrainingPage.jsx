import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { intelligenceApi } from '../../api/intelligenceApi';
import { Calendar, CheckCircle2, Clock, Trash2, Play, Eye, Edit3, Save, Moon } from 'lucide-react';

export default function MyPlannedTrainingPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanModal, setSelectedPlanModal] = useState(null);
  const [editingPlanModal, setEditingPlanModal] = useState(null);
  const [editableSchedule, setEditableSchedule] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await intelligenceApi.getPlans();
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePlan = async (planId) => {
    try {
      await intelligenceApi.activatePlan(planId);
      loadPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this training program?')) return;
    try {
      await intelligenceApi.deletePlan(planId);
      if (selectedPlanModal?._id === planId) setSelectedPlanModal(null);
      if (editingPlanModal?._id === planId) setEditingPlanModal(null);
      loadPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditModal = (plan) => {
    setEditingPlanModal(plan);
    setEditableSchedule(JSON.parse(JSON.stringify(plan.planData || {})));
  };

  const handleUpdateSetsReps = (day, exIndex, field, value) => {
    const updated = { ...editableSchedule };
    if (Array.isArray(updated[day])) {
      const exList = [...updated[day]];
      exList[exIndex] = {
        ...exList[exIndex],
        [field]: Number(value) || value
      };
      updated[day] = exList;
      setEditableSchedule(updated);
    }
  };

  const handleToggleRestDay = (day) => {
    const updated = { ...editableSchedule };
    if (updated[day] === 'Rest') {
      updated[day] = [
        { exerciseId: 'custom', name: 'Bodyweight Push-ups', sets: 3, reps: 15, duration: '0' }
      ];
    } else {
      updated[day] = 'Rest';
    }
    setEditableSchedule(updated);
  };

  const handleSaveEdit = async () => {
    if (!editingPlanModal) return;
    setSavingEdit(true);
    try {
      await intelligenceApi.updatePlan(editingPlanModal._id, {
        planData: editableSchedule
      });
      setEditingPlanModal(null);
      loadPlans();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) return <div className="p-8 text-brand-muted text-sm font-medium">Loading your saved plans...</div>;

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">My Saved Plan</h1>
        </div>

        <button
          type="button"
          onClick={() => navigate('/intelligence')}
          className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
        >
          + Build New Training Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar size={40} className="mx-auto text-brand-muted mb-3" />
          <h3 className="font-bold text-base text-brand-charcoal">No Saved Plans Found</h3>
          <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto mb-4">
            Click below to build a new training program using our goal selector and AI schedule engine.
          </p>
          <button
            type="button"
            onClick={() => navigate('/intelligence')}
            className="bg-brand-accent text-white font-bold px-5 py-2.5 rounded-xl text-xs"
          >
            Build First Plan
          </button>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const isActive = plan.status === 'active';
            const progress = plan.completionPercentage || 0;

            return (
              <Card key={plan._id} className={`transition-all ${isActive ? 'border-brand-accent shadow-sm bg-brand-accent-light/10' : 'hover:border-brand-border'}`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-xs px-2.5 py-0.5 rounded-full uppercase ${
                        isActive ? 'bg-brand-accent text-white' : 'bg-stone-100 text-stone-600 border border-brand-border'
                      }`}>
                        {plan.status}
                      </span>
                      <h3 className="font-bold text-base text-brand-charcoal">
                        {plan.sportId?.name || 'General Athletic'} Training Program
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-brand-muted">
                      <span className="flex items-center gap-1"><Clock size={14} /> {plan.trainingPeriod}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> Time: {plan.trainingTime}</span>
                      <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 max-w-md pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-brand-charcoal">
                        <span>
                          Plan Execution Progress · {plan.completedExercises || 0} of {plan.totalExercises || 0} exercises
                        </span>
                        <span className="text-brand-accent">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-stone-200/80 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    {plan.goalIds && plan.goalIds.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {plan.goalIds.map((g) => (
                          <span key={g._id || g} className="bg-stone-100 border border-brand-border text-brand-charcoal text-[11px] font-semibold px-2 py-0.5 rounded-md">
                            {g.name || 'Goal'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedPlanModal(plan)}
                      className="p-2 rounded-xl text-brand-muted hover:text-brand-charcoal hover:bg-stone-100 border border-brand-border"
                      title="View Schedule"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(plan)}
                      className="p-2 rounded-xl text-brand-muted hover:text-brand-charcoal hover:bg-stone-100 border border-brand-border"
                      title="Edit Schedule"
                    >
                      <Edit3 size={16} />
                    </button>

                    {!isActive && (
                      <button
                        onClick={() => handleActivatePlan(plan._id)}
                        className="flex items-center gap-1 text-xs font-bold text-brand-accent bg-brand-accent-light px-3 py-1.5 rounded-xl border border-brand-accent/20 hover:bg-brand-accent hover:text-white transition-colors"
                        title="Set Active"
                      >
                        <Play size={14} /> Set Active
                      </button>
                    )}

                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 border border-brand-border"
                      title="Delete Plan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* VIEW PLAN DETAILS MODAL */}
      {selectedPlanModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-card border border-brand-border p-6 max-w-2xl w-full space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div>
                <h3 className="font-bold text-base text-brand-charcoal">
                  {selectedPlanModal.sportId?.name || 'General Athletic'} Schedule Details
                </h3>
                <p className="text-xs text-brand-muted">Period: {selectedPlanModal.trainingPeriod} | Time: {selectedPlanModal.trainingTime}</p>
              </div>
              <button onClick={() => setSelectedPlanModal(null)} className="text-stone-400 hover:text-brand-charcoal font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3">
              {Object.keys(selectedPlanModal.planData || {}).map((day) => {
                const dayContent = selectedPlanModal.planData[day];
                const isRest = dayContent === 'Rest' || !Array.isArray(dayContent);

                return (
                  <div key={day} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-brand-charcoal mb-1">
                      <span>{day}</span>
                      {isRest && <span className="text-stone-500 font-normal italic">Rest Day</span>}
                    </div>

                    {!isRest && (
                      <div className="space-y-1 pl-2 border-l-2 border-brand-accent mt-2">
                        {dayContent.map((ex, idx) => (
                          <div key={idx} className="flex items-center justify-between text-brand-charcoal">
                            <span className="font-medium">{ex.name}</span>
                            <span className="text-brand-muted font-semibold">{ex.sets} sets × {ex.reps} reps</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-brand-border">
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="bg-brand-accent text-white font-bold px-5 py-2 rounded-xl text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PLAN SCHEDULE MODAL */}
      {editingPlanModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-card border border-brand-border p-6 max-w-3xl w-full space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div>
                <h3 className="font-bold text-base text-brand-charcoal">
                  Edit Schedule: {editingPlanModal.sportId?.name || 'General Athletic'}
                </h3>
                <p className="text-xs text-brand-muted">Modify daily drill sets, reps, or toggle rest days.</p>
              </div>
              <button onClick={() => setEditingPlanModal(null)} className="text-stone-400 hover:text-brand-charcoal font-bold text-sm">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {daysOfWeek.map((day) => {
                const dayContent = editableSchedule[day];
                const isRest = dayContent === 'Rest' || !Array.isArray(dayContent) || dayContent.length === 0;

                return (
                  <div key={day} className={`p-3 rounded-xl border text-xs space-y-2 ${isRest ? 'bg-stone-50 border-dashed border-stone-300' : 'bg-white border-brand-border'}`}>
                    <div className="flex items-center justify-between font-bold text-brand-charcoal pb-1 border-b border-stone-100">
                      <span>{day}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleRestDay(day)}
                        className="text-[11px] text-brand-accent font-semibold underline"
                      >
                        {isRest ? 'Set Workout' : 'Set Rest'}
                      </button>
                    </div>

                    {isRest ? (
                      <p className="text-[11px] text-stone-500 italic py-2">Scheduled Rest</p>
                    ) : (
                      <div className="space-y-2">
                        {dayContent.map((ex, idx) => (
                          <div key={idx} className="bg-stone-50 p-2 rounded-lg border border-stone-200 space-y-1">
                            <span className="font-bold text-brand-charcoal block truncate">{ex.name}</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-brand-muted font-semibold block">Sets</label>
                                <input
                                  type="number"
                                  value={ex.sets || 3}
                                  onChange={(e) => handleUpdateSetsReps(day, idx, 'sets', e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-brand-border rounded font-semibold text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-brand-muted font-semibold block">Reps</label>
                                <input
                                  type="number"
                                  value={ex.reps || 10}
                                  onChange={(e) => handleUpdateSetsReps(day, idx, 'reps', e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-brand-border rounded font-semibold text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-brand-border">
              <button
                onClick={() => setEditingPlanModal(null)}
                className="px-4 py-2 text-xs font-semibold text-brand-muted hover:text-brand-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="flex items-center gap-1.5 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold px-6 py-2 rounded-xl text-xs shadow-sm disabled:opacity-50"
              >
                <Save size={14} />
                {savingEdit ? 'Saving Changes...' : 'Save Updated Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
