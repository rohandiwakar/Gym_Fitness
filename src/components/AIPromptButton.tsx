import React, { useState } from 'react';
import { Sparkles, X, Activity, Cpu, CheckCircle } from 'lucide-react';

interface AIPromptButtonProps {
  type: 'workout' | 'diet';
  onSuccess: (plan: any) => void;
}

export default function AIPromptButton({ type, onSuccess }: AIPromptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  // Workout form states
  const [workoutGoal, setWorkoutGoal] = useState('Muscle Gain');
  const [workoutLevel, setWorkoutLevel] = useState('Intermediate');
  const [workoutCategory, setWorkoutCategory] = useState('Full Body');
  const [workoutDuration, setWorkoutDuration] = useState(8);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Diet form states
  const [dietGoal, setDietGoal] = useState<'Weight Loss' | 'Muscle Gain' | 'Maintenance'>('Muscle Gain');
  const [dietCalories, setDietCalories] = useState(2200);
  const [dietProtein, setDietProtein] = useState(150);
  const [dietRestriction, setDietRestriction] = useState('None');

  const steps = [
    'Initializing connection to Gemini AI...',
    'Analyzing target athletic parameters...',
    'Synthesizing sports nutrition matrices...',
    'Assembling exercise routines & loading parameters...',
    'Finalizing biomechanical safety audits...'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Rotate through realistic status statements for wow effect!
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStep(steps[stepIndex]);
    }, 1800);

    try {
      const endpoint = type === 'workout' ? '/api/generate-workout' : '/api/generate-diet';
      const bodyData = type === 'workout' 
        ? {
            goal: workoutGoal,
            durationWeeks: workoutDuration,
            fitnessLevel: workoutLevel,
            focusCategory: workoutCategory,
            extraNotes: workoutNotes
          }
        : {
            goal: dietGoal,
            dailyCalories: dietCalories,
            targetProtein: dietProtein,
            dietaryRestrictions: dietRestriction
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      clearInterval(interval);
      setLoading(false);
      setIsOpen(false);
      onSuccess(data.plan);

    } catch (err: any) {
      clearInterval(interval);
      setLoading(false);
      console.error(err);
      setError(err.message || 'Connection timeout. Please verify backend service.');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-3 bg-[#cbd63c]/20 border border-[#abd600]/40 rounded-xl text-xs font-bold text-[#abd600] flex items-center justify-center gap-2 hover:bg-[#abd600] hover:text-[#111508] transition-all hover:scale-[1.02] shadow-md"
      >
        <Sparkles className="w-4 h-4 shrink-0 fill-current animate-pulse" />
        Generate Dynamic Plan with Gemini AI
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e2113] border border-[#cbd63c]/25 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col relative animate-[zoomIn_0.25s_ease-out]">
            
            {/* Header */}
            <header className="p-5 border-b border-[#444933]/30 flex justify-between items-center bg-[#111508]/60">
              <span className="font-mono text-xs font-bold text-[#abd600] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4.5 h-4.5 text-[#abd600]" /> Gemini AI Lab
              </span>
              <button 
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#333627] rounded-full text-[#c4c9ac]/80 hover:text-white transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </header>

            {loading ? (
              /* Loading Spinner View */
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#abd600]/10 border-t-[#abd600] animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-[#abd600] absolute animate-ping" />
                </div>
                <div className="space-y-1.5 select-none">
                  <p className="text-sm font-bold text-white font-mono uppercase tracking-wide">Designing Matrix</p>
                  <p className="text-xs text-[#c4c9ac]/80 leading-relaxed font-mono transition-all duration-300 min-h-[36px] px-4">
                    {loadingStep}
                  </p>
                </div>
                <div className="w-full bg-[#111508] h-1 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#cbd63c] to-[#abd600] h-full w-[65%] animate-[pulse_1.5s_infinite]"></div>
                </div>
              </div>
            ) : (
              /* Form View */
              <form onSubmit={handleGenerate} className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                {error && (
                  <div className="p-3 bg-red-950/45 border border-red-500/30 text-red-400 text-xs rounded-xl font-mono">
                    ⚠️ Error: {error}
                  </div>
                )}

                {type === 'workout' ? (
                  /* Workout AI form */
                  <div className="space-y-3.5 text-left">
                    <div>
                      <label className="text-[10px] uppercase font-mono font-bold text-[#c4c9ac]/60 block mb-1">Target Goal</label>
                      <select 
                        value={workoutGoal} 
                        onChange={(e) => setWorkoutGoal(e.target.value)}
                        className="w-full bg-[#111508] border border-[#444933]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#abd600] focus:ring-0"
                      >
                        <option>Muscle Gain</option>
                        <option>Weight Loss</option>
                        <option>Cardio & HIIT</option>
                        <option>Athletic Strength</option>
                        <option>General Fitness</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-[#c4c9ac]/60 block mb-1">Fitness Level</label>
                        <select 
                          value={workoutLevel} 
                          onChange={(e) => setWorkoutLevel(e.target.value)}
                          className="w-full bg-[#111508] border border-[#444933]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#abd600] focus:ring-0"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                          <option>Elite Athlete</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-[#c4c9ac]/60 block mb-1">Split Category</label>
                        <select 
                          value={workoutCategory} 
                          onChange={(e) => setWorkoutCategory(e.target.value)}
                          className="w-full bg-[#111508] border border-[#444933]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#abd600] focus:ring-0"
                        >
                          <option>Full Body</option>
                          <option>Chest/Triceps</option>
                          <option>Back/Biceps</option>
                          <option>Legs</option>
                          <option>Shoulders/Core</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] uppercase font-mono font-bold text-[#c4c9ac]/60">Split Duration</label>
                        <span className="text-[10px] font-mono text-[#abd600] font-bold">{workoutDuration} Weeks</span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="16" 
                        value={workoutDuration} 
                        onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                        className="w-full accent-[#abd600]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono font-bold text-[#c4c9ac]/60 block mb-1">Trainer Guidance Notes</label>
                      <input 
                        type="text"
                        placeholder="e.g. no barbell work, home workout etc."
                        value={workoutNotes}
                        onChange={(e) => setWorkoutNotes(e.target.value)}
                        className="w-full bg-[#111508] border border-[#444933]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#abd600] focus:ring-0"
                      />
                    </div>
                  </div>
                ) : (
                  /* Diet AI Form */
                  <div className="space-y-3.5 text-left">
                    <div>
                      <label className="text-[10px] uppercase font-mono font-bold text-[#c4c9ac]/60 block mb-1">Dietary Target</label>
                      <select 
                        value={dietGoal} 
                        onChange={(e) => setDietGoal(e.target.value as any)}
                        className="w-full bg-[#111508] border border-[#444933]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#abd600] focus:ring-0"
                      >
                        <option value="Muscle Gain">Muscle Gain (Bulking)</option>
                        <option value="Weight Loss">Weight Loss (Shredding)</option>
                        <option value="Maintenance">Maintenance (Lean)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-[#c4c9ac]/60 block mb-1">Target Calories</label>
                        <input 
                          type="number" 
                          value={dietCalories} 
                          onChange={(e) => setDietCalories(Number(e.target.value))}
                          className="w-full bg-[#111508] border border-[#444933]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#abd600] focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-[#c4c9ac]/60 block mb-1">Target Protein (g)</label>
                        <input 
                          type="number" 
                          value={dietProtein} 
                          onChange={(e) => setDietProtein(Number(e.target.value))}
                          className="w-full bg-[#111508] border border-[#444933]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#abd600] focus:ring-0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono font-bold text-[#c4c9ac]/60 block mb-1">Dietary Restrictions</label>
                      <select 
                        value={dietRestriction} 
                        onChange={(e) => setDietRestriction(e.target.value)}
                        className="w-full bg-[#111508] border border-[#444933]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#abd600] focus:ring-0"
                      >
                        <option>None</option>
                        <option>Vegetarian</option>
                        <option>Vegan</option>
                        <option>Keto</option>
                        <option>Gluten Free</option>
                        <option>Lactose Free</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-[#abd600] text-[#111508] font-bold rounded-xl uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_24px_rgba(171,214,0,0.3)] text-xs mt-3 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4.5 h-4.5 fill-current" /> Consult Gemini Advisor
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
