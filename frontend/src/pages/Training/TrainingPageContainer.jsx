import React from 'react';
import TodaysTrainingTab from './TodaysTrainingTab';
import { Activity } from 'lucide-react';

export default function TrainingPageContainer() {
  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-accent-light text-brand-accent flex items-center justify-center">
          <Activity size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Today's Workout</h1>
          <p className="text-sm text-brand-muted">Complete today's drills and record your workout progress.</p>
        </div>
      </div>

      <TodaysTrainingTab />
    </div>
  );
}
