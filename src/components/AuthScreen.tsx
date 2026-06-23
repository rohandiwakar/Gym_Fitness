import React, { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, Sparkles, UserCheck } from 'lucide-react';
import { Role, Member, Trainer } from '../types';

interface AuthScreenProps {
  members: Member[];
  trainers: Trainer[];
  onLoginSuccess: (role: Role, name: string, userId: string) => void;
}

export default function AuthScreen({ members, trainers, onLoginSuccess }: AuthScreenProps) {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [emailInput, setEmailInput] = useState('admin@gymflow.com');
  const [phoneInput, setPhoneInput] = useState('+1 (555) 000-0012');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('Admin'); // Default admin
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickRoleSelect = (r: Role) => {
    setSelectedRole(r);
    setErrorMessage('');
    if (r === 'Admin') {
      setEmailInput('admin@gymflow.com');
      setPasswordInput('password123');
      setAuthMethod('email');
    } else if (r === 'Trainer') {
      setEmailInput('marcus@gymflow.com'); // t1 is Coach Marcus (marcus@gymflow.com)
      setPasswordInput('password123');
      setAuthMethod('email');
    } else {
      setEmailInput('alex.morgan@gymflow.com'); // m1 is Alex Morgan
      setPasswordInput('password123');
      setAuthMethod('email');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetLogin = authMethod === 'email' ? emailInput.trim().toLowerCase() : phoneInput.trim();
    
    // 1. Check Admin credentials
    if (targetLogin === 'admin@gymflow.com' || targetLogin === 'admin') {
      if (passwordInput === 'password123') {
        onLoginSuccess('Admin', 'GymFlow Admin', 'admin_id');
        return;
      } else {
        setErrorMessage('Invalid administrator password.');
        return;
      }
    }

    // 2. Check Trainer credentials
    // Search the trainers list. Default trainers can be logged in via their names/emails.
    const foundTrainer = trainers.find(t => {
      const specEmail = t.name.toLowerCase().split(' ')[1] + '@gymflow.com'; // Marcus -> marcus@gymflow.com
      const genEmail = t.name.toLowerCase().replace(/\s+/g, '') + '@gymflow.com';
      return t.contactDetails.includes(targetLogin) || specEmail === targetLogin || genEmail === targetLogin || t.name.toLowerCase() === targetLogin;
    });

    if (foundTrainer) {
      if (passwordInput === 'password123') {
        onLoginSuccess('Trainer', foundTrainer.name, foundTrainer.id);
        return;
      } else {
        setErrorMessage('Invalid trainer password.');
        return;
      }
    }

    // 3. Check Member credentials
    const foundMember = members.find(m => {
      return m.email.toLowerCase() === targetLogin || m.phone.includes(targetLogin) || m.fullName.toLowerCase() === targetLogin;
    });

    if (foundMember) {
      if (passwordInput === 'password123') {
        onLoginSuccess('Member', foundMember.fullName, foundMember.id);
        return;
      } else {
        setErrorMessage('Invalid member password.');
        return;
      }
    }

    setErrorMessage('No account associated with these credentials.');
  };

  return (
    <div className="relative min-h-[#700px] h-full flex flex-col items-center justify-center p-6 text-[#e2e4cf] font-sans select-none">
      {/* Background simulated cover art with dramatic shadows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111508] via-black/55 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-black/55 z-10"></div>
        <img 
          className="w-full h-full object-cover grayscale brightness-35 filter contrast-125 transition-transform duration-[20s] hover:scale-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBajXBMcIWeVI2-lotH9vEXBkGNkaJk5ZykLm2UDXecWxK8FPBED6ZTo1A4N4XxThbP2TnRC-UfbCa3rO2FoabyZYUsKIFvVgPhNT6Knm44V4oyGipUeb7LR1ys6VP_oqcbbYTA8qoEPICS3ikPgRYK6BwZv_TBYFUQCmkAQ1vuDYyy6ZA-tLVJwl9Ldt-sjXmfj_FqGCJvKlNxOWWabPa7KQHZS0qGqcVwPamC4ZZ6dutGYb43tpn9Mh7ur0dXLiAJsubS1SlYe9k" 
          alt="Elite Gym boutique details"
        />
      </div>

      {/* Brand Label */}
      <div className="relative z-10 text-center mb-6 mt-4">
        <h1 className="text-4xl font-extrabold font-mono tracking-tight text-[#abd600] flex items-center justify-center gap-1.5 drop-shadow-[0_4px_10px_rgba(171,214,0,0.2)]">
          GymFlow
        </h1>
        <p className="text-2xl font-semibold text-white tracking-widest uppercase text-[10px] mt-1 text-[#c4c9ac]/80">
          Elite Performance Hub
        </p>
      </div>

      {/* Glass card box */}
      <div className="relative z-10 bg-[#111508]/85 border border-white/5 p-6 rounded-2xl w-full max-w-sm backdrop-blur-2xl shadow-2xl flex flex-col animate-[fadeIn_0.5s_ease-out]">
        
        <header className="mb-5 text-center">
          <h2 className="text-xl font-bold font-mono text-white mb-0.5">Welcome Back</h2>
          <p className="text-xs text-[#c4c9ac]/70">Enter code credentials to load your dashboard schedules.</p>
        </header>

        {/* Guest selector for quick visual test maps! */}
        <div className="p-2 mb-4 bg-[#1a1d10] border border-[#cbd63c]/10 rounded-xl">
          <label className="text-[9px] uppercase font-extrabold text-[#abd600] tracking-wider block mb-1 text-center">Quick Demo Switcher</label>
          <div className="grid grid-cols-3 gap-1">
            {['Admin', 'Trainer', 'Member'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleQuickRoleSelect(r as Role)}
                className={`py-1 text-[10px] uppercase font-bold rounded-lg transition-all ${selectedRole === r ? 'bg-[#cbd63c]/20 text-[#abd600] border border-[#abd600]/30' : 'text-[#c4c9ac]/60 hover:text-white'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Display Error Message if any */}
        {errorMessage && (
          <div className="mb-4 p-2.5 bg-red-950/60 border border-red-500/30 text-red-400 text-xs rounded-xl font-mono text-center animate-pulse">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Toggle selectors */}
        <div className="flex bg-[#1a1d10]/90 rounded-lg p-1 mb-5">
          <button 
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2 text-xs font-bold rounded-md uppercase tracking-wider font-mono transition-all ${authMethod === 'email' ? 'bg-[#333627] text-[#abd600]' : 'text-[#c4c9ac]/60 hover:text-white'}`}
          >
            Email
          </button>
          <button 
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 py-2 text-xs font-bold rounded-md uppercase tracking-wider font-mono transition-all ${authMethod === 'phone' ? 'bg-[#333627] text-[#abd600]' : 'text-[#c4c9ac]/60 hover:text-white'}`}
          >
            Phone
          </button>
        </div>

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authMethod === 'email' ? (
            <div>
              <label className="text-[10px] text-[#c4c9ac]/60 uppercase tracking-widest block mb-1.5 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9379] w-4.5 h-4.5" />
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#333627]/40 border-0 border-b-2 border-[#444933]/60 focus:border-[#abd600] focus:ring-0 text-sm py-3.5 pl-10 rounded-t-xl transition-all"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[10px] text-[#c4c9ac]/60 uppercase tracking-widest block mb-1.5 font-bold">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9379] w-4.5 h-4.5" />
                <input 
                  type="text" 
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-[#333627]/40 border-0 border-b-2 border-[#444933]/60 focus:border-[#abd600] focus:ring-0 text-sm py-3.5 pl-10 rounded-t-xl transition-all"
                />
              </div>
            </div>
          )}

          {/* Password element */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-bold select-none">
              <label className="text-[10px] text-[#c4c9ac]/60 uppercase tracking-widest">Password</label>
              <a href="#forgot" className="text-[10px] text-amber-500 hover:brightness-110 uppercase tracking-wider">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9379] w-4.5 h-4.5" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#333627]/40 border-0 border-b-2 border-[#444933]/60 focus:border-[#abd600] focus:ring-0 text-sm py-3.5 pl-10 pr-10 rounded-t-xl transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9379] hover:text-[#e2e4cf]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-[#abd600] text-[#111508] font-bold rounded-xl uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_24px_rgba(171,214,0,0.3)] text-xs mt-3 flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" /> Enter the Arena
          </button>
        </form>

        <div className="flex items-center my-4 font-mono select-none">
          <div className="flex-1 h-[1px] bg-[#444933]/25"></div>
          <span className="px-3 text-[10px] text-[#c4c9ac]/60">OR SIGN IN WITH</span>
          <div className="flex-1 h-[1px] bg-[#444933]/25"></div>
        </div>

        {/* Social login buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4 select-none">
          <button 
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#444933]/40 hover:bg-[#333627]/40 hover:border-white/10 transition-all font-semibold text-xs text-white"
          >
            Google
          </button>
          <button 
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#444933]/40 hover:bg-[#333627]/40 hover:border-white/10 transition-all font-semibold text-xs text-white"
          >
            Facebook
          </button>
        </div>

        {/* Footer sign up */}
        <footer className="text-center mt-2 border-t border-[#444933]/15 pt-3.5 select-none">
          <p className="text-xs text-[#c4c9ac]/70">
            Don't have an gym ticket?{' '}
            <span 
              onClick={() => {
                alert('Join request forwarded to Frontdesk administrator.');
              }}
              className="text-[#abd600] hover:underline transition-all cursor-pointer font-bold"
            >
              Join GymFlow
            </span>
          </p>
        </footer>

      </div>

      <div className="relative z-10 text-center mt-6 max-w-xs px-2">
        <p className="text-[10px] text-[#8e9379] leading-relaxed uppercase tracking-wider font-mono">
          By signing in, you agree to our Terms of Performance and Privacy Protocol.
        </p>
      </div>

    </div>
  );
}
