import React from 'react';
import Card from '../../../components/Card';
import { Trophy } from 'lucide-react';

export default function SportSelection({ sports, selectedSport, onSelectSport }) {
  return (
    <Card title="1. Select Sport (Optional)" subtitle="Choose a sport to filter sport-specific drills, or skip for general training.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sports.map((sport) => {
          const isSelected = selectedSport?._id === sport._id;
          return (
            <div
              key={sport._id}
              onClick={() => onSelectSport(isSelected ? null : sport)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-brand-accent-light/50 border-brand-accent shadow-sm'
                  : 'bg-white border-brand-border hover:border-brand-accent/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={14} className={isSelected ? 'text-brand-accent' : 'text-brand-muted'} />
                <h4 className="font-bold text-xs text-brand-charcoal truncate">{sport.name}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
