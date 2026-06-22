import React, { useState } from 'react';
import { Exercise } from '../types';
import { INITIAL_EXERCISES } from '../mockData';
import { Search, Flame, Award, ShieldAlert, CircleCheck, Info, Sparkles, PlusCircle } from 'lucide-react';

interface ExerciseLibraryProps {
  onAddExerciseToActivePlan?: (exercise: Exercise) => void;
  onClose?: () => void;
}

export default function ExerciseLibrary({ onAddExerciseToActivePlan, onClose }: ExerciseLibraryProps) {
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Bodies');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New exercise states
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Chest');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Pro'>('Intermediate');
  const [newEquipment, setNewEquipment] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const categories = ['All Bodies', 'Chest', 'Back', 'Legs', 'Core', 'Cardio', 'Functional'];

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ex.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Bodies' || ex.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim()) return;

    const added: Exercise = {
      id: `custom_${Date.now()}`,
      name: newName,
      category: newCategory,
      difficulty: newDifficulty,
      equipment: newEquipment || 'Bodyweight',
      description: newDesc,
      benefits: ['Promotes focused muscle engagement.', 'Improves active stabilization.'],
      mistakes: ['Hastened reps without full core engagement.', 'Excessive weight selection breaking kinetic postures.'],
      postureGuide: ['Maintain balanced feet spread.', 'Active core bracing.'],
      instructions: ['Configure standard weights.', 'Breathe out on peak resistance contraction.'],
      safetyTips: ['Step down cleanly if control wavers.'],
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbXqiJrcttkH2FHb-LbGrmxlG2gWu5qgwSLum4PdN8p6Rk2nAXkb2pz045d8BgMGjEv6-ilwoaVNIOnJj5IMZfApDUmNFjZ-gW_Q8ebvwTgWPLm3CYQr9x9ZG33EKbOrv9Nuf7IRoH1X69oiDI3TJmP77mthS1mxAeP-6b-uGVVOV1GIk9vplernuIwnDAY1o7mu9N6oeShdQg1vaYa_5gQQLXE8W4PJovg4Ut2HyWOsYOm85DiqTbh7NnKmQHHy82LcxbJ1sWub8',
    };

    setExercises([...exercises, added]);
    setShowAddForm(false);
    // Reset values
    setNewName('');
    setNewDesc('');
    setNewEquipment('');
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Intermediate': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'Advanced': return 'bg-[#abd600]/15 text-[#abd600] border-[#abd600]/30';
      default: return 'bg-red-500/15 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111508] text-[#e2e4cf] overflow-y-auto px-5 pt-4 pb-20 select-none">
      
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold font-mono text-[#abd600] mb-0.5">Exercise Library</h2>
        <p className="text-xs text-[#c4c9ac]/60">Master physical kinematics with structured guidelines.</p>
      </div>

      {/* Search Input */}
      <div className="relative group mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e9379] w-4.5 h-4.5" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search (e.g. Bench squat, Dumbbells)..."
          className="w-full bg-[#1a1d10] border-0 border-b-2 border-[#444933] focus:border-[#abd600] focus:ring-0 text-sm py-3.5 pl-11 rounded-t-xl transition-all"
        />
      </div>

      {/* Categories chips horizontal scroll bar */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-[#abd600] text-[#111508] border-[#abd653]' 
                : 'bg-[#333627]/30 text-[#c4c9ac] border-[#444933]/50 hover:bg-[#333627]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Primary list bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.map((ex) => (
          <div 
            key={ex.id}
            className="flex flex-col bg-[#1e2113]/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-[#abd600]/30 transition-all transition-transform duration-300 hover:scale-[1.01]"
          >
            {/* Visual Cover */}
            <div 
              className="relative h-44 bg-cover bg-center shrink-0 cursor-pointer"
              onClick={() => setSelectedExercise(ex)}
              style={{ backgroundImage: `url(${ex.bgImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#111508] via-transparent to-transparent opacity-80"></div>
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${getDifficultyColor(ex.difficulty)}`}>
                  {ex.difficulty}
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 
                    onClick={() => setSelectedExercise(ex)}
                    className="font-mono text-base font-bold text-white hover:text-[#abd600] cursor-pointer transition-colors"
                  >
                    {ex.name}
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[#abd600]/80 bg-[#abd600]/10 px-2 py-0.5 rounded-lg border border-[#abd600]/20">
                    {ex.category}
                  </span>
                </div>
                <p className="text-xs text-[#c4c9ac]/70 mt-1 line-clamp-2 leading-relaxed">{ex.description}</p>
                <p className="text-[10px] font-mono text-[#8e9379] mt-2 uppercase tracking-wide">REQUIRED: {ex.equipment}</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedExercise(ex)}
                  className="flex-1 py-2 bg-[#333627] hover:bg-[#444933] text-white text-xs font-semibold rounded-lg transition-all"
                >
                  View Details
                </button>
                {onAddExerciseToActivePlan && (
                  <button 
                    onClick={() => onAddExerciseToActivePlan(ex)}
                    className="px-3 bg-[#abd600] hover:bg-[#cbd63c] text-[#111508] rounded-lg transition-all flex items-center justify-center"
                    title="Add to workout routine gainer"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Custom exercise creator block */}
        <div 
          onClick={() => setShowAddForm(true)}
          className="border-2 border-dashed border-[#444933]/50 hover:border-[#abd600]/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all bg-[#1a1d10]/20 hover:bg-[#1e2113]/30 min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#1e2113] hover:scale-105 transition-transform flex items-center justify-center text-[#abd600] border border-white/5 mb-3">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h4 className="font-mono text-base font-bold text-[#e2e4cf] mb-1">Create Custom Exercise</h4>
          <p className="text-xs text-[#c4c9ac]/60 max-w-[200px]">Draft custom compound movements into your private schedule logs.</p>
        </div>
      </div>

      {/* Creation form modal overlay slider */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddForm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
          <div className="relative bg-[#1e2113] border border-[#444933] rounded-2xl w-full max-w-md p-6 overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto">
            <h3 className="font-mono text-xl font-bold text-white mb-4 border-b border-[#444933]/30 pb-2">Add Compound Exercise</h3>
            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-[#c4c9ac] block mb-1">Exercise Name</label>
                <input 
                  type="text" 
                  required
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Incline DB Squeeze Fly"
                  className="w-full bg-[#1a1d10] border border-[#444933]/30 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-bold text-[#c4c9ac] block mb-1">Category</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#1a1d10] border border-[#444933]/30 rounded-xl px-3 py-2 text-sm text-white focus:bg-[#1a1d10]"
                  >
                    <option>Chest</option>
                    <option>Back</option>
                    <option>Legs</option>
                    <option>Core</option>
                    <option>Cardio</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-[#c4c9ac] block mb-1">Difficulty</label>
                  <select 
                    value={newDifficulty} 
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full bg-[#1a1d10] border border-[#444933]/30 rounded-xl px-3 py-2 text-sm text-white focus:bg-[#1a1d10]"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Pro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-[#c4c9ac] block mb-1">Required Equipment</label>
                <input 
                  type="text" 
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  placeholder="e.g. Inclined Bench, Dumbbells"
                  className="w-full bg-[#1a1d10] border border-[#444933]/30 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-[#c4c9ac] block mb-1">Kinetic Overview Description</label>
                <textarea 
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detail proper muscular tension patterns during active repetitions..."
                  className="w-full bg-[#1a1d10] border border-[#444933]/30 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 bg-[#333627] text-white hover:bg-[#444933] rounded-xl text-xs font-bold transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#abd600] text-[#111508] hover:bg-[#cbd63c] rounded-xl text-xs font-bold transition-all"
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Step-by-Step Exercise Info Dialog Overlay */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedExercise(null)} className="absolute inset-0 bg-[#0c0f04]/90 backdrop-blur-md"></div>
          <div className="relative bg-[#1e2113] border border-[#abd600]/30 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto overflow-hidden shadow-2xl p-6 font-sans">
            <h3 className="font-mono text-2xl font-bold text-white mb-1 tracking-tight text-[#abd600]">{selectedExercise.name}</h3>
            <span className="inline-block bg-[#cbd63c]/10 text-[#abd600] uppercase text-[10px] font-bold px-3 py-0.5 rounded-full border border-[#abd600]/20 mb-4">{selectedExercise.category} • {selectedExercise.difficulty}</span>

            <div className="space-y-5">
              <div className="bg-[#1a1d10] p-4 rounded-xl border border-white/5">
                <p className="text-xs text-[#c4c9ac] leading-relaxed italic">"{selectedExercise.description}"</p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-[#abd600]">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="font-mono font-bold uppercase tracking-wider">EQUIPMENT REQUIRED: {selectedExercise.equipment}</span>
                </div>
              </div>

              {/* Steps Instructions */}
              <div>
                <h4 className="text-xs font-bold uppercase text-[#abd600] font-mono tracking-widest mb-1.5 flex items-center gap-1.5">
                  <CircleCheck className="w-4 h-4 text-[#abd600]" /> Correct Posture & Guide
                </h4>
                <ol className="list-decimal pl-4 text-xs text-[#c4c9ac]/90 space-y-1 leading-relaxed">
                  {selectedExercise.postureGuide.map((p, idx) => <li key={idx}>{p}</li>)}
                </ol>
              </div>

              {/* Instructions steps */}
              <div>
                <h4 className="text-xs font-bold uppercase text-[#abd600] font-mono tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#abd600]" /> Instructions
                </h4>
                <ul className="list-disc pl-4 text-xs text-[#c4c9ac]/90 space-y-1 leading-relaxed">
                  {selectedExercise.instructions.map((ins, idx) => <li key={idx}>{ins}</li>)}
                </ul>
              </div>

              {/* Rookie mistakes check board */}
              <div>
                <h4 className="text-xs font-bold uppercase text-amber-400 font-mono tracking-widest mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" /> Common Mistakes
                </h4>
                <ul className="list-disc pl-4 text-xs text-amber-200/80 space-y-1">
                  {selectedExercise.mistakes.map((m, idx) => <li key={idx}>{m}</li>)}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-xs font-bold uppercase text-[#abd600] font-mono tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#abd600]" /> Muscular Benefits
                </h4>
                <ul className="list-disc pl-4 text-xs text-[#c4c9ac]/90 space-y-1">
                  {selectedExercise.benefits.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              </div>
            </div>

            <button 
              onClick={() => setSelectedExercise(null)}
              className="mt-6 w-full py-3 bg-[#333627] hover:bg-[#abd600] hover:text-[#111508] text-white text-xs font-bold tracking-wider rounded-xl transition-all uppercase"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
