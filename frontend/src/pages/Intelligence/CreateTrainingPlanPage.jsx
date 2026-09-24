import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { intelligenceApi } from '../../api/intelligenceApi';
import SportSelection from './components/SportSelection';
import GoalSelection from './components/GoalSelection';
import ScheduleSelection from './components/ScheduleSelection';

export default function CreateTrainingPlanPage() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedGoalIds, setSelectedGoalIds] = useState([]);
  const [daysCapacity, setDaysCapacity] = useState(5);
  const [trainingPeriod, setTrainingPeriod] = useState('1 Week');
  const [restDays, setRestDays] = useState(['Sunday']);
  const [trainingTime, setTrainingTime] = useState('6:00 AM');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadSportsAndGoals() {
      try {
        const [sportsData, goalsData] = await Promise.all([
          intelligenceApi.getSports(),
          intelligenceApi.getGoals(selectedSport?._id)
        ]);

        const uniqueSports = [];
        const seenNames = new Set();
        (sportsData || []).forEach((sport) => {
          const nameLower = (sport.name || '').toLowerCase();
          if (nameLower.includes('custom') || nameLower.includes('other')) return;
          if (!seenNames.has(nameLower)) {
            seenNames.add(nameLower);
            uniqueSports.push(sport);
          }
        });

        setSports(uniqueSports);
        setGoals((goalsData || []).slice(0, 12));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingInitial(false);
      }
    }

    loadSportsAndGoals();
  }, [selectedSport]);

  const handleToggleGoal = (goalId) => {
    setSelectedGoalIds((currentIds) =>
      currentIds.includes(goalId)
        ? currentIds.filter((id) => id !== goalId)
        : [...currentIds, goalId]
    );
  };

  const handleCreatePlan = async (event) => {
    event.preventDefault();
    setGenerating(true);
    try {
      const planDraft = await intelligenceApi.generatePlan({
        sportId: selectedSport?._id || null,
        goalIds: selectedGoalIds,
        trainingPeriod,
        restDays,
        trainingTime
      });
      navigate('/intelligence/result', { state: { planDraft } });
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  if (loadingInitial) {
    return <div className="p-8 text-brand-muted text-sm font-medium">Loading plan manager...</div>;
  }

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <form onSubmit={handleCreatePlan} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-charcoal">Create New Training Plan</h1>
          <button
            type="button"
            onClick={() => navigate('/intelligence/my-plans')}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-accent hover:text-brand-accent-hover"
          >
            <ArrowLeft size={15} /> My Saved Plan
          </button>
        </div>

        <SportSelection
          sports={sports}
          selectedSport={selectedSport}
          onSelectSport={setSelectedSport}
        />
        <GoalSelection
          goals={goals}
          selectedGoalIds={selectedGoalIds}
          onToggleGoal={handleToggleGoal}
        />
        <ScheduleSelection
          daysCapacity={daysCapacity}
          setDaysCapacity={setDaysCapacity}
          trainingPeriod={trainingPeriod}
          setTrainingPeriod={setTrainingPeriod}
          restDays={restDays}
          setRestDays={setRestDays}
          trainingTime={trainingTime}
          setTrainingTime={setTrainingTime}
        />

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={generating}
            className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
          >
            <Sparkles size={16} />
            {generating ? 'Building Schedule...' : 'Build Training Plan'}
          </button>
        </div>
      </form>
    </div>
  );
}
