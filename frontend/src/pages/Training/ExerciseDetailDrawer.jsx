import React from 'react';
import Modal from '../../components/Modal';
import { Dumbbell, Target, AlertTriangle } from 'lucide-react';

export default function ExerciseDetailDrawer({ isOpen, onClose, exercise }) {
  if (!exercise) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={exercise.name || 'Exercise Details'}>
      <div className="space-y-4 text-xs">
        <div className="flex gap-2">
          <span className="bg-brand-accent-light text-brand-accent font-semibold px-2.5 py-1 rounded-full">
            {exercise.sport}
          </span>
          <span className="bg-stone-100 text-brand-charcoal font-semibold px-2.5 py-1 rounded-full border border-brand-border">
            {exercise.goalType}
          </span>
        </div>

        <div>
          <h4 className="font-bold text-brand-charcoal text-sm mb-1">Target Muscle Group</h4>
          <p className="text-brand-muted font-medium flex items-center gap-1.5">
            <Target size={14} className="text-brand-accent" /> {exercise.targetMuscle}
          </p>
        </div>

        <div>
          <h4 className="font-bold text-brand-charcoal text-sm mb-1">Execution Instructions</h4>
          <p className="bg-stone-50 border border-brand-border p-3 rounded-xl text-stone-700 leading-relaxed">
            {exercise.instructions || 'No specific instructions provided.'}
          </p>
        </div>

        {exercise.excludeIfInjury && exercise.excludeIfInjury.length > 0 && (
          <div>
            <h4 className="font-bold text-red-600 text-xs mb-1 flex items-center gap-1">
              <AlertTriangle size={14} /> Excluded For Injury Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {exercise.excludeIfInjury.map((tag) => (
                <span key={tag} className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
