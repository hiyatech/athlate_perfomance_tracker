import React, { useState } from 'react';
import Card from './Card';
import { Dumbbell, CheckCircle2, Plus, Clock, Trophy, Flame } from 'lucide-react';

export default function ExerciseCard({ item, onLog }) {
  const [showLogModal, setShowLogModal] = useState(false);
  const [actualSets, setActualSets] = useState(item.sets || 3);
  const [actualReps, setActualReps] = useState(item.reps || 10);
  const [actualWeight, setActualWeight] = useState(0);
  const [actualTime, setActualTime] = useState(0);
  const [mood, setMood] = useState('okay');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onLog(item.exerciseId || item._id, {
        exerciseName: item.name,
        actualSets: Number(actualSets),
        actualReps: Number(actualReps),
        actualWeight: Number(actualWeight),
        actualTime: Number(actualTime),
        mood,
        note
      });
      setShowLogModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="transition-all hover:border-brand-accent/40">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 flex-1 pr-4">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-brand-charcoal">{item.name}</h4>
            {item.isDone && (
              <span className="flex items-center gap-1 bg-brand-accent-light text-brand-accent font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Logged Today
              </span>
            )}
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">{item.instructions || 'Perform with controlled speed and proper alignment.'}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-brand-charcoal">
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-brand-border">
              Target: {item.sets || 3} sets × {item.reps || 10} reps
            </span>
            {item.unitType === 'duration' && (
              <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-brand-border flex items-center gap-1">
                <Clock size={12} /> {item.duration || '60s'}
              </span>
            )}
            <span className="text-[10px] uppercase font-bold text-brand-muted bg-stone-50 px-2 py-0.5 rounded border border-brand-border">
              {item.difficulty || 'Intermediate'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowLogModal(true)}
          className={`flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm shrink-0 ${
            item.isDone
              ? 'bg-stone-100 text-brand-charcoal border border-brand-border hover:bg-stone-200'
              : 'bg-brand-accent hover:bg-brand-accent-hover text-white'
          }`}
        >
          {item.isDone ? 'Log Again' : 'Log Workout'}
        </button>
      </div>

      {/* WORKOUT LOGGING MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-card border border-brand-border p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="font-bold text-base text-brand-charcoal">Log Workout Performance</h3>
              <button onClick={() => setShowLogModal(false)} className="text-stone-400 hover:text-brand-charcoal font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmitLog} className="space-y-4">
              <div>
                <p className="text-xs font-bold text-brand-charcoal">{item.name}</p>
                <p className="text-[11px] text-brand-muted">Record actual performance data achieved today.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-brand-charcoal block mb-1">Actual Sets</label>
                  <input
                    type="number"
                    min="1"
                    value={actualSets}
                    onChange={(e) => setActualSets(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-charcoal block mb-1">Actual Reps</label>
                  <input
                    type="number"
                    min="1"
                    value={actualReps}
                    onChange={(e) => setActualReps(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-brand-charcoal block mb-1">Weight Lifted (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={actualWeight}
                    onChange={(e) => setActualWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-charcoal block mb-1">Duration (sec)</label>
                  <input
                    type="number"
                    min="0"
                    value={actualTime}
                    onChange={(e) => setActualTime(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl font-semibold text-xs text-brand-charcoal"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">How did this set feel? (Mood)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['tough', 'okay', 'strong'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        mood === m
                          ? 'bg-brand-accent-light border-brand-accent text-brand-accent'
                          : 'bg-stone-50 border-brand-border text-brand-muted'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">Athlete Notes (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Form notes, feeling, energy level..."
                  className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl text-xs text-brand-charcoal"
                  rows="2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-brand-muted hover:text-brand-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving Log...' : 'Save Workout Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
