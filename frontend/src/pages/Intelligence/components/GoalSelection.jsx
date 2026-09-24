import React from 'react';
import Card from '../../../components/Card';
import { Target } from 'lucide-react';

export default function GoalSelection({ goals, selectedGoalIds, onToggleGoal }) {
  return (
    <Card title="2. Select Performance Goals (Optional)" subtitle="Select one or more targets for your training program.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {goals.map((goal) => {
          const isSelected = selectedGoalIds.includes(goal._id);
          return (
            <div
              key={goal._id}
              onClick={() => onToggleGoal(goal._id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-brand-accent-light/50 border-brand-accent shadow-sm'
                  : 'bg-white border-brand-border hover:border-brand-accent/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target size={14} className={isSelected ? 'text-brand-accent' : 'text-brand-muted'} />
                <span className="font-bold text-xs text-brand-charcoal">{goal.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
