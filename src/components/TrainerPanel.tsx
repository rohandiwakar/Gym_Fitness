import React, { useState } from 'react';
import { Member, Trainer, WorkoutPlan, DietPlan } from '../types';
import { Calendar, ChevronRight, MessageSquare, Plus, Award, CheckCircle, BarChart2 } from 'lucide-react';

interface TrainerPanelProps {
  members: Member[];
  trainers: Trainer[];
  trainerId?: string;
  onCreateWorkout: () => void;
  onCreateDiet: () => void;
}

export default function TrainerPanel({ members, trainers, trainerId = 't1', onCreateWorkout, onCreateDiet }: TrainerPanelProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  
  // Custom Chat Simulator
  const [activeChatMember, setActiveChatMember] = useState<Member | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [chats, setChats] = useState<{ sender: 'coach' | 'member'; text: string; time: string }[]>([
    { sender: 'member', text: 'Hey Coach! Quick question, is it normal if my hamstrings are still sore from the deadlift set?', time: '09:12 AM' },
    { sender: 'coach', text: 'Hey! Yes, that is completely normal. Ensure dynamic quad stretches and focus on hydration today.', time: '09:15 AM' },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatMember) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats([...chats, { sender: 'coach', text: typedMessage, time }]);
    setTypedMessage('');

    // Quick mock response trigger
    setTimeout(() => {
      setChats(prev => [...prev, {
        sender: 'member',
        text: 'Awesome, thanks coach! See you in flat bench session tomorrow.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
  };

  const currentTrainer = trainers.find(t => t.id === trainerId) || trainers[0];
  const trainerMembers = members.filter(m => m.assignedTrainerId === trainerId);

  return (
    <div className="flex flex-col h-full bg-[#111508]/85 text-[#e2e4cf] overflow-y-auto px-5 pt-4 pb-24 font-sans select-none relative z-10">
      
      {/* Header section */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-[#abd600] uppercase tracking-widest font-mono">DASHBOARD OVERVIEW</p>
        <h2 className="text-2xl font-bold font-mono text-white tracking-tight">Welcome {currentTrainer?.name || 'Coach'}</h2>
      </div>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3.5 mt-5">
        <div className="bg-[#1e2113]/35 border border-white/5 border-l-4 border-l-[#cbd63c] p-4 rounded-xl flex flex-col justify-between h-28">
          <p className="text-[10px] uppercase font-bold text-[#c4c9ac]/60">Assigned Members</p>
          <span className="text-2xl font-extrabold font-mono text-white">24</span>
        </div>
        <div className="bg-[#1e2113]/35 border border-white/5 border-l-4 border-l-orange-400 p-4 rounded-xl flex flex-col justify-between h-28">
          <p className="text-[10px] uppercase font-bold text-[#c4c9ac]/60">Plans Due Today</p>
          <span className="text-2xl font-extrabold font-mono text-white">3</span>
        </div>
        <div className="bg-[#1e2113]/35 border border-white/5 border-l-4 border-l-red-500 p-4 rounded-xl flex flex-col justify-between h-28 col-span-2 md:col-span-1">
          <p className="text-[10px] uppercase font-bold text-[#c4c9ac]/60">Pending Reviews</p>
          <span className="text-2xl font-extrabold font-mono text-white">5</span>
        </div>
      </section>

      {/* Action quick shortcut maps */}
      <section className="grid grid-cols-2 gap-3 mt-4">
        <button 
          onClick={onCreateWorkout}
          className="py-3 bg-[#cbd63c]/10 border border-[#abd600]/30 hover:bg-[#abd600] hover:text-[#111508] rounded-xl text-xs font-bold transition-all text-[#abd600]"
        >
          + Create Workout Plan
        </button>
        <button 
          onClick={onCreateDiet}
          className="py-3 bg-[#cbd63c]/10 border border-[#abd600]/30 hover:bg-[#abd600] hover:text-[#111508] rounded-xl text-xs font-bold transition-all text-[#abd600]"
        >
          + Design Diet Sheet
        </button>
      </section>

      {/* Session schedule timeline */}
      <section className="mt-6 space-y-3">
        <div className="flex justify-between items-end">
          <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider">Today's Sessions</h3>
          <span className="text-xs text-[#abd600] cursor-pointer hover:underline">View Calendar</span>
        </div>

        <div className="space-y-2">
          <div className="bg-[#1e2113]/40 border border-white/5 p-3 rounded-xl flex items-center justify-between group hover:bg-[#333627]/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center border-r border-[#444933]/30 pr-3 font-mono">
                <span className="text-xs font-bold text-[#abd600]">09:00</span>
                <span className="text-[9px] text-[#c4c9ac]/50 uppercase">AM</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Sarah Johnson</p>
                <p className="text-[10px] text-[#c4c9ac]/65">HIIT Interval Gainer • Studio A</p>
              </div>
            </div>
            <button className="p-1 px-2.5 bg-[#cbd63c]/10 text-[#abd600] rounded hover:bg-[#abd600] hover:text-[#111508] text-[9px] uppercase font-mono font-bold transition-all">
              Load Posture
            </button>
          </div>

          <div className="bg-[#1e2113]/40 border border-white/5 p-3 rounded-xl flex items-center justify-between group hover:bg-[#333627]/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center border-r border-[#444933]/30 pr-3 font-mono">
                <span className="text-xs font-bold text-[#abd600]">11:30</span>
                <span className="text-[9px] text-[#c4c9ac]/50 uppercase">AM</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Mike Ross</p>
                <p className="text-[10px] text-[#c4c9ac]/65">Strength and Form Squeeze • Main Ring</p>
              </div>
            </div>
            <button className="p-1 px-2.5 bg-[#cbd63c]/10 text-[#abd600] rounded hover:bg-[#abd600] hover:text-[#111508] text-[9px] uppercase font-mono font-bold transition-all">
              Load Posture
            </button>
          </div>
        </div>
      </section>

      {/* Active members matrix horizontally scrollable list */}
      <section className="mt-6 space-y-3">
        <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider text-left">Active Members matrix</h3>
        
        {/* Horizontal scroll grid */}
        <div className="flex overflow-x-auto gap-3.5 pb-2 -mx-4 px-4 scrollbar-none">
          {trainerMembers.map((m) => (
            <div 
              key={m.id}
              className="bg-[#1e2113]/30 border border-white/10 rounded-2xl p-4 min-w-[230px] flex flex-col justify-between space-y-4 hover:border-[#abd600]/25 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <img src={m.photoUrl} className="w-10 h-10 object-cover border border-[#444933]/50 rounded-xl" alt={m.fullName} />
                <div className="text-left shrink-0">
                  <p className="text-xs font-bold text-white">{m.fullName}</p>
                  <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full ${m.status === 'Active' ? 'bg-[#abd600]/15 text-[#abd600]' : 'bg-orange-500/15 text-orange-400'}`}>
                    {m.id === 'm1' || m.id === 'm2' ? 'On Track' : 'Plateau'}
                  </span>
                </div>
              </div>

              {/* Progress Weight Tracker */}
              <div className="bg-[#111508] p-2.5 rounded-lg border border-[#444933]/10 text-left">
                <div className="flex justify-between items-center text-[9px] text-[#c4c9ac]/70">
                  <span>Goal: {m.id === 'm1' ? 'Endure' : m.id === 'm2' ? 'Weight Loss' : 'Lean Bulk'}</span>
                  <span className="font-mono">75%</span>
                </div>
                <div className="w-full bg-[#333627] h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[#abd600] h-full rounded-full" style={{ width: m.id === 'm1' ? '75%' : m.id === 'm2' ? '40%' : '90%' }}></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveChatMember(m)}
                  className="flex-1 py-2 bg-[#cbd63c]/15 text-[#abd600] hover:bg-[#abd600] hover:text-[#111508] font-bold text-[10px] rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Speak
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded modal coach-athlete secure chat link */}
      {activeChatMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setActiveChatMember(null)} className="absolute inset-0 bg-[#0c0f04]/90 backdrop-blur-md"></div>
          <div className="relative bg-[#1e2113] border border-[#cbd63c]/35 w-full max-w-sm rounded-2xl overflow-hidden flex flex-col h-[75vh] shadow-2xl">
            
            {/* Chat header */}
            <div className="p-3 bg-[#111508] border-b border-[#cbd63c]/20 flex items-center gap-2 text-left">
              <img src={activeChatMember.photoUrl} className="w-10 h-10 object-cover rounded-full border border-[#cbd63c]/20" alt="" />
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{activeChatMember.fullName}</h4>
                <p className="text-[10px] text-[#abd600] uppercase font-mono font-bold tracking-wider">Coach Secure Link</p>
              </div>
            </div>

            {/* Chat list window */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#111508]/40">
              {chats.map((ch, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col max-w-[80%] ${ch.sender === 'coach' ? 'ml-auto items-end' : 'items-start'}`}
                >
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${ch.sender === 'coach' ? 'bg-[#abd600] text-[#111508] rounded-tr-none text-right font-semibold' : 'bg-[#282b1d] text-[#e2e4cf] rounded-tl-none text-left'}`}>
                    <p>{ch.text}</p>
                  </div>
                  <span className="text-[8px] text-[#8e9379] mt-0.5">{ch.time}</span>
                </div>
              ))}
            </div>

            {/* Chat input form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#1a1d10] border-t border-[#444933]/30 flex gap-2shrink-0">
              <input 
                type="text" 
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type dynamic advice..."
                className="flex-1 bg-[#111508] border border-[#cbd63c]/15 px-3 py-2 text-xs rounded-xl text-white outline-none focus:border-[#abd600]"
              />
              <button 
                type="submit"
                className="bg-[#abd600] text-[#111508] p-2 hover:bg-[#cbd63c] px-4 rounded-xl text-xs font-bold transition-all uppercase"
              >
                Send
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
