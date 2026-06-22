import React, { useState } from 'react';
import { DietPlan } from '../types';
import { INITIAL_DIETS } from '../mockData';
import { ArrowLeft, Plus, Trash2, CheckCircle, Apple } from 'lucide-react';

interface DietCreatorProps {
  onSaveDiet: (diet: DietPlan) => void;
  onClose?: () => void;
}

export default function DietCreator({ onSaveDiet, onClose }: DietCreatorProps) {
  const [dietName, setDietName] = useState('');
  const [goal, setGoal] = useState<'Weight Loss' | 'Muscle Gain' | 'Maintenance'>('Muscle Gain');
  const [meals, setMeals] = useState<{
    mealName: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    time: string;
  }[]>([
    {
      mealName: 'Protein Power Bowl',
      description: 'Warm pulled chicken breast over brown rice bed and steamed broccoli crowns.',
      calories: 540,
      protein: 42,
      carbs: 55,
      fats: 12,
      time: '12:30 PM',
    },
  ]);

  const [toast, setToast] = useState('');

  // Form states for creating general meals
  const [mealName, setMealName] = useState('');
  const [mealDesc, setMealDesc] = useState('');
  const [calories, setCalories] = useState(300);
  const [protein, setProtein] = useState(25);
  const [carbs, setCarbs] = useState(30);
  const [fats, setFats] = useState(8);
  const [mealTime, setMealTime] = useState('08:00 AM');
  const [showMealForm, setShowMealForm] = useState(false);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    setMeals([...meals, {
      mealName,
      description: mealDesc || 'Balanced performance nutrition combo.',
      calories,
      protein,
      carbs,
      fats,
      time: mealTime,
    }]);

    setShowMealForm(false);
    // Reset
    setMealName('');
    setMealDesc('');
    setCalories(300);
    setProtein(25);
    setCarbs(30);
    setFats(8);
  };

  const handleRemoveMeal = (idx: number) => {
    setMeals(meals.filter((_, i) => i !== idx));
  };

  const handleSaveDiet = () => {
    if (!dietName.trim()) {
      setToast('Please set a name for this diet plan.');
      setTimeout(() => setToast(''), 2000);
      return;
    }

    if (meals.length === 0) {
      setToast('Diet plan requires at least one scheduled meal block.');
      setTimeout(() => setToast(''), 2000);
      return;
    }

    const completedPlan: DietPlan = {
      id: `d-${Date.now()}`,
      name: dietPlanNameClean(dietName),
      goal,
      meals,
    };

    onSaveDiet(completedPlan);
    setDietName('');
    setMeals([]);

    setToast('Diet plan archived and ready in performance files!');
    setTimeout(() => {
      setToast('');
      if (onClose) onClose();
    }, 1500);
  };

  const dietPlanNameClean = (name: string): string => {
    return name.trim();
  };

  const totalCalories = meals.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = meals.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = meals.reduce((sum, item) => sum + item.carbs, 0);
  const totalFats = meals.reduce((sum, item) => sum + item.fats, 0);

  return (
    <div className="absolute inset-0 bg-[#111508] text-[#e2e4cf] z-40 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#111508]/90 backdrop-blur-md border-b border-[#444933]/30 h-16 flex justify-between items-center px-4 shrink-0">
        <div className="flex items-center gap-4">
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-[#333627] rounded-full text-[#c4c9ac] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-bold font-mono text-[#abd600] tracking-tight">New Diet Blueprint</h1>
        </div>
      </header>

      {/* Main Content scroll window */}
      <main className="flex-grow overflow-y-auto px-5 py-6 space-y-6">
        
        {/* Detail setting boards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1e2113]/40 border border-white/5 p-5 rounded-2xl">
            <label className="text-xs uppercase font-bold text-[#abd600] font-mono block mb-1">Diet Title</label>
            <input 
              type="text"
              value={dietName}
              onChange={(e) => setDietName(e.target.value)}
              placeholder="e.g. Strict Shred Gainer"
              className="w-full bg-[#1a1d10] border border-[#444933]/50 focus:border-[#abd600] focus:ring-1 focus:ring-[#abd600]/30 rounded-xl px-4 py-3 text-sm text-white"
            />
          </div>

          <div className="bg-[#1e2113]/40 border border-white/5 p-5 rounded-2xl flex flex-col justify-center">
            <label className="text-xs uppercase font-bold text-[#abd600] font-mono block mb-1">Diet Focus Goal</label>
            <select 
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full bg-[#1a1d10] border border-[#444933]/50 focus:border-[#abd600] rounded-xl px-4 py-3 text-sm text-white"
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </section>

        {/* Nutritional Dashboard */}
        <section className="bg-[#1a1d10]/80 border border-[#cbd63c]/15 p-5 rounded-2xl text-center">
          <h3 className="text-xs uppercase font-bold text-[#abd600] font-mono tracking-widest mb-4">Total Net Daily Nutrition</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-[#111508] p-3 rounded-xl border border-white/5">
              <span className="text-xs text-[#c4c9ac]/80 select-none">Calories</span>
              <p className="text-xl font-extrabold text-[#abd600] mt-1">{totalCalories} <span className="text-[10px] uppercase font-mono">kcal</span></p>
            </div>
            <div className="bg-[#111508] p-3 rounded-xl border border-white/5">
              <span className="text-xs text-[#c4c9ac]/80 select-none">protein</span>
              <p className="text-xl font-extrabold text-white mt-1">{totalProtein}g</p>
            </div>
            <div className="bg-[#111508] p-3 rounded-xl border border-white/5">
              <span className="text-xs text-[#c4c9ac]/80 select-none">carbs</span>
              <p className="text-xl font-extrabold text-white mt-1">{totalCarbs}g</p>
            </div>
            <div className="bg-[#111508] p-3 rounded-xl border border-white/5">
              <span className="text-xs text-[#c4c9ac]/80 select-none">fats</span>
              <p className="text-xl font-extrabold text-white mt-1">{totalFats}g</p>
            </div>
          </div>
        </section>

        {/* Meal cards stack */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-mono text-white">Meals Pipeline</h3>
              <p className="text-xs text-[#c4c9ac]/60">Archive daily food schedules below.</p>
            </div>
            <button 
              onClick={() => setShowMealForm(true)}
              className="flex items-center gap-1.5 bg-[#cbd63c]/10 text-[#abd600] border border-[#abd600]/30 hover:bg-[#abd600] hover:text-[#111508] px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" /> Add Meal
            </button>
          </div>

          <div className="space-y-3">
            {meals.map((item, idx) => (
              <div key={idx} className="bg-[#1e2113]/30 border border-white/5 p-4 rounded-xl flex justify-between items-center group hover:border-[#abd600]/25 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#abd600]/15 flex items-center justify-center text-[#abd600] shrink-0 mt-0.5">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{item.mealName}</h4>
                      <span className="text-[10px] font-mono bg-[#333627] text-[#c4c9ac] px-2 py-0.5 rounded-lg">{item.time}</span>
                    </div>
                    <p className="text-xs text-[#c4c9ac]/70 mt-1">{item.description}</p>
                    <div className="flex gap-4 text-[10px] font-mono text-[#8e9379] uppercase tracking-wide mt-2">
                      <span>{item.calories} kcal</span>
                      <span>P: {item.protein}g</span>
                      <span>C: {item.carbs}g</span>
                      <span>F: {item.fats}g</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemoveMeal(idx)}
                  className="p-2 text-[#c4c9ac] hover:text-red-400 opacity-60 group-hover:opacity-100 transition-all"
                  title="Remove meal block"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Floating Save controls footer */}
      <footer className="shrink-0 p-4 border-t border-[#444933]/25 bg-[#111508] flex items-center justify-between z-10 select-none">
        <div>
          <p className="text-[10px] text-[#c4c9ac]/60 uppercase tracking-widest font-mono">Archive Volume</p>
          <span className="text-sm font-bold text-white">{meals.length} Scheduled Daily Meals</span>
        </div>
        <button 
          onClick={handleSaveDiet}
          className="bg-[#abd600] text-[#111508] hover:bg-[#cbd63c] px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider active:scale-95 transition-all w-48 text-center"
        >
          Save Diet
        </button>
      </footer>

      {/* Nested Add Meal Dialog form pop up */}
      {showMealForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowMealForm(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>
          <div className="relative bg-[#1e2113] border border-[#cbd63c]/30 rounded-2xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <h3 className="font-mono text-lg font-bold text-white border-b border-[#444933]/20 pb-2 mb-4 uppercase">Integrate Meal</h3>
            
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-[#c4c9ac] block mb-1">Meal Title</label>
                <input 
                  type="text"
                  required
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="e.g. Scrambled Whites Side Salad"
                  className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-bold text-[#c4c9ac] block mb-1">Time scheduled</label>
                  <input 
                    type="text"
                    required
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    placeholder="e.g. 05:30 PM"
                    className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-[#c4c9ac] block mb-1">Total Calories</label>
                  <input 
                    type="number"
                    min={1}
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {/* Macro configuration sliders */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#1a1d10] p-2 rounded-xl border border-white/5">
                  <label className="text-[9px] uppercase font-bold text-[#c4c9ac] block mb-1">Protein (g)</label>
                  <input 
                    type="number"
                    min={0}
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="bg-transparent border-none p-0 w-full text-center text-xs text-white font-bold"
                  />
                </div>
                <div className="bg-[#1a1d10] p-2 rounded-xl border border-white/5">
                  <label className="text-[9px] uppercase font-bold text-[#c4c9ac] block mb-1">Carbs (g)</label>
                  <input 
                    type="number"
                    min={0}
                    value={carbs}
                    onChange={(e) => setCarbs(Number(e.target.value))}
                    className="bg-transparent border-none p-0 w-full text-center text-xs text-white font-bold"
                  />
                </div>
                <div className="bg-[#1a1d10] p-2 rounded-xl border border-white/5">
                  <label className="text-[9px] uppercase font-bold text-[#c4c9ac] block mb-1">Fats (g)</label>
                  <input 
                    type="number"
                    min={0}
                    value={fats}
                    onChange={(e) => setFats(Number(e.target.value))}
                    className="bg-transparent border-none p-0 w-full text-center text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-[#c4c9ac] block mb-1">Meal Description</label>
                <textarea 
                  rows={2}
                  value={mealDesc}
                  onChange={(e) => setMealDesc(e.target.value)}
                  placeholder="Detail food portions and general spices suggestions..."
                  className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-2 text-sm text-white focus:ring-[#abd600]"
                />
              </div>

              <div className="flex gap-2 pt-2 text-xs font-bold">
                <button 
                  type="button" 
                  onClick={() => setShowMealForm(false)}
                  className="flex-1 py-2.5 bg-[#333627] text-white hover:bg-[#444933] rounded-xl transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#abd600] text-[#111508] hover:bg-[#cbd63c] rounded-xl transition-all"
                >
                  Inject Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast alert system */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1e2113] border border-[#cbd63c]/35 px-6 py-3 rounded-xl text-center shadow-lg animate-bounce text-sm font-bold text-[#abd600] flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}
