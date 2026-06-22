import React, { useState } from 'react';
import { Member, AttendanceRecord } from '../types';
import { INITIAL_ATTENDANCE } from '../mockData';
import { Camera, Flashlight, PlusCircle, CheckCircle, Bell, ArrowLeft, MoreVertical } from 'lucide-react';

interface QRScannerProps {
  members: Member[];
  onAddAttendance: (record: AttendanceRecord) => void;
  onClose?: () => void;
}

export default function QRScanner({ members, onAddAttendance, onClose }: QRScannerProps) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [scannedMember, setScannedMember] = useState<Member | null>(null);
  const [recentScans, setRecentScans] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [manualInput, setManualInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScanMember = (member: Member) => {
    // Sound/Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      memberPhoto: member.photoUrl,
      planName: 'Pro Performance Annual', // default placeholder
      timestamp,
      status: 'SUCCESS',
    };

    setScannedMember(member);
    setConfirmationOpen(true);
    setRecentScans([newRecord, ...recentScans]);
    onAddAttendance(newRecord);
  };

  const triggerMockScan = () => {
    // pick a random member
    if (members.length === 0) return;
    const randomMember = members[Math.floor(Math.random() * members.length)];
    handleScanMember(randomMember);
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const query = manualInput.toLowerCase().trim();
    const found = members.find(
      m => m.fullName.toLowerCase().includes(query) || m.phone.includes(query) || m.email.toLowerCase().includes(query)
    );

    if (found) {
      setErrorMessage('');
      setManualInput('');
      handleScanMember(found);
    } else {
      setErrorMessage('Member not found with matched credential.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#111508] text-[#e2e4cf] z-40 flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center w-full px-5 h-16 bg-[#111508]/90 backdrop-blur-md border-b border-[#444933]/30 shrink-0">
        <div className="flex items-center gap-3">
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-[#333627] rounded-full text-[#abd600] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <span className="text-xl font-bold font-mono text-[#abd600] tracking-tight">GymFlow Code Scanner</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFlashlightOn(!flashlightOn)}
            className={`p-2 rounded-full transition-all ${flashlightOn ? 'bg-[#abd600] text-[#111508]' : 'bg-[#333627] text-[#c4c9ac] hover:bg-[#444933]'}`}
            title="Toggle Flashlight"
          >
            <Flashlight className="w-5 h-5" />
          </button>
          <button className="p-2 bg-[#333627] text-[#abd600] hover:bg-[#444933] rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <div className="flex-1 relative flex flex-col">
        {/* Background Simulated Camera Feed */}
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-60" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMNbNhR47hWRrf3Mug-_ZDlZ1i6ZG6X0Tcb-z3TSfabk1bD4bMu4Kye0j5k0aNaErwIWsBMXpw7LqI5VuqSIGaV7OWaXMN0spGPrJeE7V5ywjWiu9Xa6da4QebykLjzNISg43b-Dyoypuw-c1GVwYje0dkvCG2ksAM0v8vK0jBWCSbPwb2j4L-W95TrJYyEeKaaOy8JqzsFfw3mD2yXhaO6uGzp0qbC901Y_m4tsregWUi_itifSm1SZOKZX1TFvdr-xOrkZZdKUU" 
            alt="Gym Entrance Feed"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111508]/40 via-transparent to-[#111508]/90"></div>
          {flashlightOn && (
            <div className="absolute inset-0 bg-white/10 pointer-events-none mix-blend-overlay"></div>
          )}
        </div>

        {/* Live Interface Layout */}
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 pb-20">
          <div className="text-center mb-6 max-w-xs">
            <h2 className="text-2xl font-bold font-mono text-white mb-2 tracking-tight">Scan Member QR Code</h2>
            <p className="text-sm text-[#c4c9ac]/80 select-none">Align code perfectly within the scanning viewport area guidelines</p>
          </div>

          {/* Scanner Grid Reticle */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#abd600] rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#abd600] rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#abd600] rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#abd600] rounded-br-lg"></div>
            
            {/* Red laser line animation */}
            <div className="absolute left-1 right-1 h-0.5 bg-[#abd600] opacity-80 shadow-[0_0_12px_#abd600] animate-[bounce_3s_infinite]" style={{ top: '35%' }}></div>
            
            {/* Inner semi-opaque glass target */}
            <div className="w-full h-full bg-white/5 border border-white/10 rounded-lg backdrop-blur-[1px]"></div>
          </div>

          <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
            {/* Simulation button */}
            <button 
              onClick={triggerMockScan}
              className="w-full py-3.5 bg-[#abd600] text-[#111508] font-bold rounded-full uppercase tracking-wider shadow-[0_4px_24px_rgba(171,214,0,0.3)] hover:brightness-110 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" /> Simulate Scan
            </button>

            {/* Manual input form */}
            <form onSubmit={handleManualCheckIn} className="relative mt-2">
              <input 
                type="text"
                placeholder="Enter email or phone..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full bg-[#1e2113]/85 border border-[#444933]/50 focus:border-[#abd600] focus:ring-1 focus:ring-[#abd600]/30 rounded-full px-4 py-2.5 text-sm text-[#e2e4cf] placeholder-[#c4c9ac]/40"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#cbd63c]/20 text-[#abd600] hover:bg-[#abd600] hover:text-[#111508] rounded-full transition-all"
                title="Manual check-in"
              >
                <PlusCircle className="w-4.5 h-4.5" />
              </button>
            </form>
            {errorMessage && (
              <p className="text-xs text-red-400 text-center select-none">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Swipe Handle bottom sheet tray area */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1a1d10]/95 backdrop-blur-xl border-t border-[#444933]/30 rounded-t-3xl max-h-56 overflow-y-auto px-5 py-4 pb-2 z-20 shadow-2xl">
          <div className="w-12 h-1 bg-[#444933]/60 rounded-full mx-auto mb-3"></div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-tight">Recent Attendance Ledger</h3>
            <span className="text-xs text-[#abd600] tracking-wider select-none font-bold uppercase">LIVE SCAN FEED</span>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {recentScans.map((r, i) => (
              <div key={r.id + i} className="flex items-center gap-3 p-2 bg-[#282b1d]/60 rounded-xl border border-white/5">
                <img 
                  className="w-9 h-9 rounded-full object-cover shrink-0" 
                  src={r.memberPhoto} 
                  alt={r.memberName}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{r.memberName}</p>
                  <p className="text-[10px] text-[#c4c9ac]/60">Check-in at {r.timestamp}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#cbd63c]/20 text-[#abd600]">SUCCESS</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Success Modal Pop-UP Overlay */}
      {confirmationOpen && scannedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div 
            onClick={() => setConfirmationOpen(false)}
            className="absolute inset-0 bg-[#0c0f04]/85 backdrop-blur-md"
          ></div>
          <div className="relative w-full max-w-sm bg-[#1e2113] border border-[#cbd63c]/30 p-6 rounded-3xl text-center shadow-[0_24px_48px_rgba(0,0,0,0.6)] animate-[zoomIn_0.3s_ease-out]">
            <div className="mb-4 relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-[#abd600]/25 rounded-full animate-ping"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#abd600] p-0.5">
                <img 
                  className="w-full h-full object-cover rounded-full" 
                  src={scannedMember.photoUrl} 
                  alt={scannedMember.fullName}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#abd600] text-[#111508] w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#1e2113]">
                <CheckCircle className="w-5 h-5 font-bold" />
              </div>
            </div>

            <h3 className="text-xl font-bold font-mono text-[#abd600] mb-0.5">Check-in Successful</h3>
            <p className="text-base text-white font-bold mb-4">{scannedMember.fullName}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-6 text-left">
              <div className="bg-[#1a1d10] p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-[#c4c9ac]/60 uppercase tracking-wider mb-0.5">Membership</p>
                <p className="text-xs font-bold text-white">PLATINUM</p>
              </div>
              <div className="bg-[#1a1d10] p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-[#c4c9ac]/60 uppercase tracking-wider mb-0.5">Status</p>
                <p className="text-xs font-bold text-[#abd600]">ACTIVE</p>
              </div>
            </div>

            <button 
              onClick={() => setConfirmationOpen(false)}
              className="w-full py-3 bg-[#abd600] text-[#111508] rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-wide"
            >
              Continue Scanning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
