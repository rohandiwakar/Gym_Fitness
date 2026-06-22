import React, { useState } from 'react';
import { Member, WorkoutPlan, DietPlan, AttendanceRecord } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, User, Clock, QrCode, ClipboardList, Apple, Droplet, ArrowRight, Check, Award, Compass, Heart, Flame, ShieldCheck } from 'lucide-react';

interface MemberPanelProps {
  member: Member;
  workoutPlans: WorkoutPlan[];
  dietPlans: DietPlan[];
  attendance: AttendanceRecord[];
  onLogWeight: (w: number) => void;
}

export default function MemberPanel({ member, workoutPlans, dietPlans, attendance, onLogWeight }: MemberPanelProps) {
  const [activeTab, setActiveTab] = useState<'hub' | 'workout' | 'nutrition' | 'profile'>('hub');
  
  // Member states
  const [waterCount, setWaterCount] = useState(3);
  const [weightInput, setWeightInput] = useState('');
  const [loggedWeightOk, setLoggedWeightOk] = useState(false);

  // Filter plans assigned to this member or standard presets
  const assignedWorkout = workoutPlans.find(p => p.id === 'p1' || p.id === member.planId) || workoutPlans[0];
  const assignedDiet = dietPlans.find(d => d.id === 'd1' || d.goal === 'Muscle Gain') || dietPlans[0];

  const handleTrackWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0) return;

    onLogWeight(w);
    setLoggedWeightOk(true);
    setWeightInput('');
    setTimeout(() => setLoggedWeightOk(false), 2000);
  };

  const formattedChartData = member.weightHistory.map(item => ({
    name: item.date,
    weight: item.weight,
  }));

  return (
    <div className="flex flex-col h-full bg-[#111508]/85 text-[#e2e4cf] overflow-y-auto px-5 pt-4 pb-24 font-sans select-none relative z-10">
      
      {/* Visual Header greeting */}
      <header className="flex justify-between items-center mb-5">
        <div className="text-left shrink-0">
          <p className="text-[10px] font-mono font-bold text-[#abd600] uppercase tracking-widest">Athlete Dashboard</p>
          <span className="text-2xl font-bold font-mono text-white">Hey, {member.fullName.split(' ')[0]}</span>
        </div>
        <img 
          onClick={() => setActiveTab('profile')} 
          src={member.photoUrl} 
          className="w-11 h-11 object-cover rounded-full border-2 border-[#abd600] cursor-pointer" 
          alt={member.fullName} 
        />
      </header>

      {/* Selector Navigation Bar */}
      <nav className="flex bg-[#1a1d10] p-1 rounded-xl mb-4 shrink-0">
        <button 
          onClick={() => setActiveTab('hub')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wide font-mono transition-all ${activeTab === 'hub' ? 'bg-[#333627] text-[#abd600]' : 'text-[#c4c9ac]/60'}`}
        >
          Hub
        </button>
        <button 
          onClick={() => setActiveTab('workout')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wide font-mono transition-all ${activeTab === 'workout' ? 'bg-[#333627] text-[#abd600]' : 'text-[#c4c9ac]/60'}`}
        >
          Routine
        </button>
        <nav-item
          onClick={() => setActiveTab('nutrition')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wide font-mono transition-all text-center cursor-pointer ${activeTab === 'nutrition' ? 'bg-[#333627] text-[#abd600]' : 'text-[#c4c9ac]/60'}`}
        >
          Diet
        </nav-item>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wide font-mono transition-all ${activeTab === 'profile' ? 'bg-[#333627] text-[#abd600]' : 'text-[#c4c9ac]/60'}`}
        >
          ID
        </button>
      </nav>

      {activeTab === 'hub' && (
        <div className="space-y-6">
          {/* Bento metrics boards */}
          <section className="grid grid-cols-2 gap-3.5">
            
            {/* BMI calculations */}
            <div className="bg-[#1e2113]/35 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 text-left">
              <span className="text-[10px] uppercase font-bold text-[#c4c9ac]/60">Body Fat Indicator</span>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl font-bold font-mono text-white">14.2%</span>
                <span className="text-[10px] text-[#abd600] font-bold">Lean</span>
              </div>
              <p className="text-[9px] text-[#8e9379] font-mono uppercase tracking-wide">BMI: {member.bmi} Optimal</p>
            </div>

            {/* Quick water consumption tracker */}
            <div className="bg-[#1e2113]/35 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 text-left">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-[#c4c9ac]/60">Water Budget</span>
                <Droplet className="w-4 h-4 text-cyan-400 shrink-0" />
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold font-mono text-cyan-400">{waterCount}</span>
                <span className="text-xs text-[#c4c9ac]/60">/ 8 Cups</span>
              </div>
              <button 
                onClick={() => setWaterCount(prev => Math.min(prev + 1, 8))}
                className="w-full py-1 text-[10px] uppercase font-bold text-center bg-[#abd600]/10 text-[#abd600] rounded hover:bg-[#abd600] hover:text-[#111508] transition-all"
              >
                Log One Cup
              </button>
            </div>

          </section>

          {/* Weight graph sparkline */}
          <section className="bg-[#1e2113]/40 border border-white/5 p-4 rounded-2xl">
            <header className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-xs uppercase font-bold text-white tracking-widest flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#abd600]" /> Absolute Weight Sparkline (kg)
              </h3>
              <form onSubmit={handleTrackWeight} className="flex gap-1">
                <input 
                  type="number" 
                  step="0.1" 
                  value={weightInput} 
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="74.5"
                  className="bg-[#111508] border border-[#cbd63c]/15 rounded px-2 py-0.5 text-xs text-white w-14 outline-none"
                />
                <button type="submit" className="p-1 bg-[#abd600] text-[#111508] rounded text-[10px] font-bold hover:brightness-110">Log</button>
              </form>
            </header>

            {/* Simulated mini area graph using Recharts */}
            <div className="h-32 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#8e9379" fontSize={9} />
                  <YAxis fontSize={9} stroke="#8e9379" domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1d10', border: '1px solid #444933', borderRadius: '8px', fontSize: 10, color: '#e2e4cf' }} />
                  <Area type="monotone" dataKey="weight" stroke="#abd600" fillOpacity={0.15} fill="url(#colorWeight)" strokeWidth={2} />
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#abd600" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#abd600" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {loggedWeightOk && <p className="text-[10px] text-[#abd600] text-center mt-2 animate-pulse uppercase tracking-wider font-bold">In-body weight logged successfully</p>}
          </section>

          {/* Boutique fitness classes countdown module */}
          <section className="space-y-3">
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider text-left">Recommended Classes</h3>
            
            <div className="bg-[#1e2113]/30 border border-[#abd600]/15 p-4 rounded-xl flex justify-between items-center text-left relative overflow-hidden group">
              <div>
                <span className="text-[8px] font-mono font-bold bg-[#cbd63c]/20 text-[#abd600] px-2.5 py-0.5 rounded-full border border-[#abd600]/20 uppercase">Sprint Cardio</span>
                <h4 className="text-sm font-bold text-white mt-1.5 leading-tight">V02 Max Sprint Challenge</h4>
                <p className="text-[10px] text-[#c4c9ac]/60 mt-0.5">High-intensity cardiovascular stress sets with coach.</p>
                <div className="flex items-center gap-1 text-[9px] text-[#abd600] mt-1 font-mono font-bold">
                  <Clock className="w-3 h-3" /> STARTS IN 15 MINUTES
                </div>
              </div>
              <button 
                onClick={() => alert('Spot secured! GymFlow calendar updated.')}
                className="bg-[#abd600] text-[#111508] p-2.5 px-3 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all text-center uppercase shrink-0"
              >
                Join
              </button>
            </div>
          </section>

        </div>
      )}

      {/* Routine list tab view */}
      {activeTab === 'workout' && (
        <div className="space-y-4">
          <div className="text-left">
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">{assignedWorkout.name}</h3>
            <p className="text-xs text-[#c4c9ac]/70">Target Strategy Focus: {assignedWorkout.goal} ({assignedWorkout.durationWeeks} Weeks)</p>
          </div>

          <div className="space-y-3">
            {assignedWorkout.exercises.map((ex, idx) => (
              <div key={idx} className="bg-[#1e2113]/30 border border-white/5 p-4 rounded-xl flex items-center justify-between text-left group hover:border-[#cbd63c]/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${ex.bgImage})` }}></div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{ex.exerciseName}</h4>
                    <p className="text-[10px] text-[#c4c9ac]/65 mt-0.5 uppercase tracking-wider font-mono">{ex.category}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-[#abd600] font-mono">{ex.sets} Sets x {ex.reps} Reps</p>
                  <p className="text-[9px] text-[#8e9379] font-mono">Rest: {ex.restSeconds}s</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1a1d10] p-4 rounded-2xl text-center space-y-1.5 border border-[#cbd63c]/15">
            <Award className="w-6 h-6 text-[#abd600] mx-auto" />
            <h4 className="font-mono text-xs uppercase font-bold text-[#abd600] tracking-wider">Coach Assigned Checklist</h4>
            <p className="text-[10px] text-[#c4c9ac]/80 select-none">Warm up with mobility stretches for 8-10 minutes prior to first set.</p>
          </div>
        </div>
      )}

      {/* Nutrition meal grid tab view */}
      {activeTab === 'nutrition' && (
        <div className="space-y-4">
          <div className="text-left border-b border-[#444933]/20 pb-3">
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">{assignedDiet.name}</h3>
            <p className="text-xs text-[#c4c9ac]/70">Nutritional Focus Profile: {assignedDiet.goal}</p>
          </div>

          <div className="space-y-3">
            {assignedDiet.meals.map((item, idx) => (
              <div key={idx} className="bg-[#1e2113]/30 border border-white/15 p-4 rounded-xl flex justify-between items-start text-left">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{item.mealName}</h4>
                    <span className="text-[9px] font-mono bg-[#333627] text-[#c4c9ac] px-2 py-0.5 rounded-lg">{item.time}</span>
                  </div>
                  <p className="text-xs text-[#c4c9ac]/70 mt-1">{item.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#cbd63c] font-mono">{item.calories} <span className="text-[9px] uppercase font-bold">kcal</span></span>
                  <div className="text-[9px] font-mono text-[#8e9379] space-y-0.5 mt-1 uppercase">
                    <p>P: {item.protein}g</p>
                    <p>C: {item.carbs}g</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile ID Card QR Code tab view */}
      {activeTab === 'profile' && (
        <div className="space-y-6 flex flex-col items-center justify-center py-4">
          
          {/* Neon Member Pass */}
          <div className="w-full max-w-sm bg-[#1e2113] border border-[#cbd63c]/35 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#abd600]/10 rounded-full blur-2xl"></div>
            
            <header className="flex justify-between items-center mb-5 font-mono">
              <span className="text-xs font-bold text-[#abd600] uppercase tracking-wide">GymFlow Studio Pass</span>
              <ShieldCheck className="w-5 h-5 text-[#abd600]" />
            </header>

            <img src={member.photoUrl} className="w-20 h-20 rounded-xl object-cover border-2 border-[#abd600] mx-auto mb-4" alt="" />
            
            <h3 className="text-xl font-bold font-mono text-white tracking-tight">{member.fullName}</h3>
            <p className="text-xs text-[#c4c9ac]/60 uppercase tracking-widest font-mono mt-0.5">MEMBER PASS ID: {member.id.toUpperCase()}</p>
            
            <div className="my-6 p-4 bg-white rounded-2xl w-40 h-40 mx-auto flex items-center justify-center shadow-xl">
              <QrCode className="w-32 h-32 text-[#111508] shrink-0" />
            </div>

            <p className="text-[11px] text-[#abd600] font-bold tracking-widest uppercase mb-1">SCAN AT ENTRANCE RADAR</p>
            <p className="text-[10px] text-[#c4c9ac]/70">This temporary key authenticates gate terminals live.</p>

            <button 
              onClick={() => alert('Access credentials code saved to camera roll.')}
              className="mt-6 w-full py-3 bg-[#cbd63c]/15 text-[#abd600] hover:bg-[#abd600] hover:text-[#111508] text-xs font-bold rounded-xl transition-all uppercase tracking-wide"
            >
              Export Pass PNG
            </button>
          </div>

          {/* Historical Log check list */}
          <div className="w-full max-w-sm">
            <h4 className="font-mono text-xs font-bold uppercase text-[#abd600] tracking-widest mb-3 text-left">Entrance logs (This month)</h4>
            <div className="space-y-2">
              {attendance.slice(0, 3).map((a, i) => (
                <div key={i} className="bg-[#1e2113]/30 border border-white/5 p-2.5 rounded-xl flex items-center justify-between text-xs text-left">
                  <div>
                    <p className="text-white font-medium">Entrance Verified</p>
                    <p className="text-[10px] text-[#c4c9ac]/60">{a.timestamp}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8.5px] font-bold bg-[#cbd63c]/20 text-[#abd600]">SUCCESS</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
