import React, { useState } from 'react';
import { Exercise, WorkoutPlan } from '../types';
import { INITIAL_EXERCISES } from '../mockData';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, CheckCircle } from 'lucide-react';
import AIPromptButton from './AIPromptButton';

interface WorkoutCreatorProps {
  onSavePlan: (plan: WorkoutPlan) => void;
  onClose?: () => void;
}

export default function WorkoutCreator({ onSavePlan, onClose }: WorkoutCreatorProps) {
  const [planName, setPlanName] = useState('');
  const [goal, setGoal] = useState('Muscle Gain');
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [selectedExercises, setSelectedExercises] = useState<{
    id: string;
    name: string;
    bgImage: string;
    category: string;
    sets: number;
    reps: string;
    restSeconds: number;
  }[]>([
    {
      id: 'e1',
      name: 'Barbell Back Squat',
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4qgpnmj_a2oQn9QDCI64KmsuugPXWcuoztPAhGcZeQFCRZzbjp-v4yWtFWHqc15LDCc2zdzdIXNy1EIVUby8ZgwuhVqrsm7DBnaoSO-Eg-NzeOwEGJPFuiy_2vwPKVu9C8jySHrkXvN5w3Sdm03QDJBxHagFpnmjfY1WRf3Qw5C4asmtsOfFmKjiPM6KZoBLNHL8I4O7oP2GaTvUNjHBvtEIzyYhqVgyMO2CFpQG7IoINE2k6XPFpn5q5lKQxeFadPQLsM_dxWB0',
      category: 'Legs',
      sets: 4,
      reps: '8-12',
      restSeconds: 90,
    },
  ]);

  const [selectedExercisesModalOpen, setSelectedExercisesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddExerciseFromLibrary = (ex: Exercise) => {
    // Check if ya already have it
    if (selectedExercises.some(item => item.id === ex.id)) {
      setToastMessage('Exercise already integrated in current routine lineup.');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    const newEntry = {
      id: ex.id,
      name: ex.name,
      bgImage: ex.bgImage,
      category: ex.category,
      sets: 3,
      reps: '10',
      restSeconds: 60,
    };

    setSelectedExercises([...selectedExercises, newEntry]);
    setSelectedExercisesModalOpen(false);
  };

  const handleRemoveExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter(item => item.id !== id));
  };

  const handleFieldChange = (idx: number, field: string, value: any) => {
    const copy = [...selectedExercises];
    copy[idx] = { ...copy[idx], [field]: value };
    setSelectedExercises(copy);
  };

  const handleSave = () => {
    if (!planName.trim()) {
      setToastMessage('Please enter a descriptive plan name.');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    if (selectedExercises.length === 0) {
      setToastMessage('Workout requires at least one exercise block.');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    const newPlan: WorkoutPlan = {
      id: `work_${Date.now()}`,
      name: planName,
      goal,
      durationWeeks,
      exercises: selectedExercises.map(item => ({
        exerciseId: item.id,
        exerciseName: item.name,
        sets: item.sets,
        reps: item.reps,
        restSeconds: item.restSeconds,
        bgImage: item.bgImage,
        category: item.category,
      })),
    };

    onSavePlan(newPlan);
    setPlanName('');
    setSelectedExercises([]);
    
    setToastMessage('Workout plan saved to secure index ledger!');
    setTimeout(() => {
      setToastMessage('');
      if (onClose) onClose();
    }, 1500);
  };

  const handleAIGeneratedWorkout = (plan: any) => {
    setPlanName(plan.name || 'AI Strength Blueprint');
    setGoal(plan.goal || 'Muscle Gain');
    setDurationWeeks(plan.durationWeeks || 8);
    if (plan.exercises && plan.exercises.length > 0) {
      setSelectedExercises(plan.exercises);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#111508] text-[#e2e4cf] z-40 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#111508]/90 backdrop-blur-md border-b border-[#444933]/30 h-16 flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-[#333627] rounded-full text-[#c4c9ac] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-bold font-mono text-[#abd600] tracking-tight">New Workout Plan</h1>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#abd600] text-[#111508] px-5 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-all shadow-[0_0_15px_rgba(171,214,0,0.35)]"
        >
          Save
        </button>
      </header>

      {/* Primary Scroll Content */}
      <main className="flex-1 mt-16 overflow-y-auto px-5 py-6 space-y-6">
        {/* Gemini AI Assistant Block */}
        <section className="bg-[#1e2113]/55 border border-[#cbd63c]/15 p-4 rounded-xl">
          <p className="text-[10px] uppercase font-mono font-bold text-[#abd600] tracking-widest mb-1.5 text-left">Gemini AI Assistant</p>
          <AIPromptButton 
            type="workout" 
            onSuccess={handleAIGeneratedWorkout} 
          />
        </section>

        {/* Metadata section (Bento Style) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-[#1e2113]/40 border border-white/5 p-6 rounded-xl flex flex-col justify-end min-h-[140px] relative overflow-hidden group">
            <label className="text-xs font-bold text-[#abd600] uppercase tracking-widest mb-1">Plan Title</label>
            <input 
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-[#444933] text-2xl font-bold focus:outline-none focus:border-[#abd600] w-full py-1 text-white placeholder:text-[#c4c9ac]/30" 
              placeholder="e.g. Strength Progression v2" 
              type="text"
            />
          </div>

          <div className="bg-[#1e2113]/40 border border-white/5 p-5 rounded-xl space-y-4">
            <div>
              <label className="text-xs font-bold text-[#abd600] uppercase tracking-widest block mb-2">Target Goal</label>
              <select 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#282b1d] border-none rounded-lg p-2.5 text-sm text-[#e2e4cf] focus:ring-2 focus:ring-[#abd600]"
              >
                <option>Muscle Gain</option>
                <option>Fat Loss</option>
                <option>Endurance</option>
                <option>Powerlifting</option>
              </select>
            </div>
            <div>
              <label className="text-label-sm text-[#abd600] uppercase tracking-widest block mb-2">Duration</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="bg-[#282b1d] border-none rounded-lg p-2.5 text-sm w-20 text-center text-white focus:ring-2 focus:ring-[#abd600]"
                />
                <span className="text-on-surface-variant text-sm">Weeks Total</span>
              </div>
            </div>
          </div>
        </section>

        {/* Exercise List */}
        <section className="space-y-4">
          <div class="flex justify-between items-end">
            <div class="space-y-1">
              <h2 class="text-xl font-bold font-mono text-primary-fixed-dim">EXERCISE ROUTINE</h2>
              <p class="text-xs text-[#c4c9ac]/60">Customize sets, repetitions, and rest periods.</p>
            </div>
            <button 
              onClick={() => setSelectedExercisesModalOpen(true)}
              className="flex items-center gap-1 bg-[#1e2113] text-[#abd600] border border-[#abd600]/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#abd600] hover:text-[#111508] transition-all"
            >
              + Add Exercise
            </button>
          </div>

          <div className="space-y-3">
            {selectedExercises.map((ex, index) => (
              <div key={ex.id + '-' + index} className="bg-[#1e2113]/30 border border-white/5 rounded-xl overflow-hidden flex flex-col md:flex-row group transition-all hover:border-[#abd600]/20">
                
                {/* Image Cover */}
                <div className="w-full md:w-36 h-24 md:h-auto bg-[#0c0f04] relative shrink-0">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${ex.bgImage})` }}></div>
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <span className="text-white font-bold font-mono text-sm uppercase">{ex.category}</span>
                  </div>
                </div>

                {/* Exercise Controls */}
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{ex.name}</h4>
                      <p className="text-[10px] text-[#c4c9ac]/60 uppercase font-mono tracking-widest mt-0.5">Sequence Rank: #{index + 1}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button className="p-1.5 text-[#c4c9ac] hover:text-[#abd600] transition-colors cursor-grab" title="Drag to reorder">
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleRemoveExercise(ex.id)}
                        className="p-1.5 text-[#c4c9ac] hover:text-red-400 transition-colors"
                        title="Remove segment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Input parameters */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-[#1a1d10] p-1.5 rounded-lg border border-[#444933]/10">
                      <label className="text-[9px] uppercase font-bold text-[#c4c9ac] tracking-wide mb-1 block">Sets</label>
                      <input 
                        type="number"
                        min={1}
                        max={10}
                        value={ex.sets}
                        onChange={(e) => handleFieldChange(index, 'sets', Number(e.target.value))}
                        className="bg-transparent border-none p-0 w-full text-xs font-bold focus:ring-0 text-white"
                      />
                    </div>
                    <div className="bg-[#1a1d10] p-1.5 rounded-lg border border-[#444933]/10">
                      <label className="text-[9px] uppercase font-bold text-[#c4c9ac] tracking-wide mb-1 block">Reps</label>
                      <input 
                        type="text"
                        value={ex.reps}
                        onChange={(e) => handleFieldChange(index, 'reps', e.target.value)}
                        className="bg-transparent border-none p-0 w-full text-xs font-bold focus:ring-0 text-white"
                      />
                    </div>
                    <div className="bg-[#1a1d10] p-1.5 rounded-lg border border-[#444933]/10">
                      <label className="text-[9px] uppercase font-bold text-[#c4c9ac] tracking-wide mb-1 block">Rest (s)</label>
                      <input 
                        type="number"
                        min={0}
                        step={10}
                        value={ex.restSeconds}
                        onChange={(e) => handleFieldChange(index, 'restSeconds', Number(e.target.value))}
                        className="bg-transparent border-none p-0 w-full text-xs font-bold focus:ring-0 text-white"
                      />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating total display */}
      <footer className="shrink-0 p-4 border-t border-[#444933]/25 bg-[#111508] shadow-2xl flex items-center justify-between z-10 select-none">
        <div>
          <p className="text-[10px] text-[#c4c9ac]/60 uppercase tracking-widest font-mono">Assigned Volume</p>
          <span className="text-base font-bold text-[#abd600]">{selectedExercises.length} Total Exercises</span>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#abd600] text-[#111508] px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all w-48 text-center"
        >
          Save Plan
        </button>
      </footer>

      {/* Library Selection Modal Box */}
      {selectedExercisesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setSelectedExercisesModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="relative bg-[#1a1d10] border border-[#abd600]/30 rounded-2xl w-full max-w-lg max-h-[75vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#444933]/30 flex justify-between items-center text-white font-mono uppercase bg-[#111508]">
              <span className="text-sm font-bold tracking-tight">Pick Movement</span>
              <button 
                onClick={() => setSelectedExercisesModalOpen(false)}
                className="text-xs uppercase hover:underline text-[#abd600]"
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {INITIAL_EXERCISES.map((ex) => {
                const inserted = selectedExercises.some(item => item.id === ex.id);
                return (
                  <div 
                    key={ex.id}
                    onClick={() => !inserted && handleAddExerciseFromLibrary(ex)}
                    className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 transition-all text-left ${inserted ? 'opacity-40 cursor-not-allowed bg-transparent' : 'cursor-pointer hover:bg-[#333627]/30 hover:border-[#abd600]/20'}`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#0c0f04] bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${ex.bgImage})` }}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{ex.name}</p>
                      <p className="text-xs text-[#c4c9ac]/70">{ex.category} • {ex.difficulty}</p>
                    </div>
                    {inserted ? (
                      <span className="text-[10px] uppercase font-bold text-indigo-400">Added</span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-[#abd600]">Inject</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1e2113] border border-[#cbd63c]/30 px-6 py-3 rounded-xl text-center shadow-lg animate-bounce">
          <p className="text-sm font-bold text-[#abd600] flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5" /> {toastMessage}
          </p>
        </div>
      )}
    </div>
  );
}

// Extra state wrappers to bundle values correctly
const useInputStates = () => {
  const [selectedExercisesModalOpen, setSelectedExercisesModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [goal, setGoal] = useState('Muscle Gain');
  const [durationWeeks, setDurationWeeks] = useState(8);

  return {
    selectedExercisesModalOpen,
    setSelectedExercisesModalOpen,
    planName,
    setPlanName,
    goal,
    setGoal,
    durationWeeks,
    setDurationWeeks,
  };
};

const handleSaveEdit = () => {
  alert("Confirm changes");
};
