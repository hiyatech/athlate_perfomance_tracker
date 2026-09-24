import React from 'react';
import Card from '../../../components/Card';
import ChipSelector from '../../../components/ChipSelector';

export default function ScheduleSelection({
  daysCapacity,
  setDaysCapacity,
  trainingPeriod,
  setTrainingPeriod,
  restDays,
  setRestDays,
  trainingTime,
  setTrainingTime
}) {
  const periodOptions = ['1 Week', '15 Days', '1 Month', 'Custom'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeOptions = ['6:00 AM', '7:30 AM', '4:30 PM', '6:00 PM', '8:00 PM'];

  return (
    <Card title="3. Program Parameters" subtitle="Set your program period, available days capacity, recovery days, and training time.">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-brand-charcoal block mb-1">
            Available Days Per Week Capacity: <span className="text-brand-accent font-bold">{daysCapacity} Days</span>
          </label>
          <input
            type="range"
            min="1"
            max="7"
            value={daysCapacity}
            onChange={(event) => setDaysCapacity(Number(event.target.value))}
            className="w-full accent-brand-accent cursor-pointer mt-2"
          />
        </div>

        <ChipSelector
          label="Program Period"
          options={periodOptions}
          selected={trainingPeriod}
          onSelect={setTrainingPeriod}
        />
        <ChipSelector
          label="Rest & Recovery Days"
          options={weekDays}
          selected={restDays}
          onSelect={setRestDays}
          multi={true}
        />
        <ChipSelector
          label="Preferred Daily Training Time"
          options={timeOptions}
          selected={trainingTime}
          onSelect={setTrainingTime}
        />
      </div>
    </Card>
  );
}
