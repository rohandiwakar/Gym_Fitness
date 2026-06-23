import { useState, useEffect } from 'react';
import { Role, Member, Trainer, Exercise, WorkoutPlan, DietPlan, AttendanceRecord, PaymentRecord, GymNotification } from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_TRAINERS, 
  INITIAL_EXERCISES, 
  INITIAL_WORKOUTS, 
  INITIAL_DIETS, 
  INITIAL_ATTENDANCE, 
  INITIAL_PAYMENTS, 
  INITIAL_NOTIFICATIONS 
} from './mockData';

// Subcomponents import
import KineticShader from './components/KineticShader';
import AuthScreen from './components/AuthScreen';
import QRScanner from './components/QRScanner';
import ExerciseLibrary from './components/ExerciseLibrary';
import WorkoutCreator from './components/WorkoutCreator';
import DietCreator from './components/DietCreator';
import AdminPanel from './components/AdminPanel';
import TrainerPanel from './components/TrainerPanel';
import MemberPanel from './components/MemberPanel';

import { 
  Wifi, 
  Battery, 
  Signal, 
  Bell, 
  LogOut, 
  Smartphone, 
  QrCode, 
  Dumbbell, 
  CheckCircle,
  Menu,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export default function App() {
  // System State Management
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'mobile'>(() => {
    return (localStorage.getItem('gymflow_layout_mode') as 'desktop' | 'mobile') || 'desktop';
  });

  const [userRole, setUserRole] = useState<Role | null>(() => {
    return (localStorage.getItem('gymflow_user_role') as Role | null) || null;
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('gymflow_user_name') || '';
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('gymflow_current_user_id') || '';
  });
  
  // Data State Management (Propagates downstream)
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('gymflow_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    const saved = localStorage.getItem('gymflow_trainers');
    return saved ? JSON.parse(saved) : INITIAL_TRAINERS;
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('gymflow_exercises');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => {
    const saved = localStorage.getItem('gymflow_workout_plans');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
  });

  const [dietPlans, setDietPlans] = useState<DietPlan[]>(() => {
    const saved = localStorage.getItem('gymflow_diet_plans');
    return saved ? JSON.parse(saved) : INITIAL_DIETS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('gymflow_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('gymflow_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [notifications, setNotifications] = useState<GymNotification[]>(() => {
    const saved = localStorage.getItem('gymflow_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // LocalStorage sync effects
  useEffect(() => {
    localStorage.setItem('gymflow_layout_mode', layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('gymflow_user_role', userRole);
      localStorage.setItem('gymflow_user_name', userName);
      localStorage.setItem('gymflow_current_user_id', currentUserId);
    } else {
      localStorage.removeItem('gymflow_user_role');
      localStorage.removeItem('gymflow_user_name');
      localStorage.removeItem('gymflow_current_user_id');
    }
  }, [userRole, userName, currentUserId]);

  useEffect(() => {
    localStorage.setItem('gymflow_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('gymflow_trainers', JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem('gymflow_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('gymflow_workout_plans', JSON.stringify(workoutPlans));
  }, [workoutPlans]);

  useEffect(() => {
    localStorage.setItem('gymflow_diet_plans', JSON.stringify(dietPlans));
  }, [dietPlans]);

  useEffect(() => {
    localStorage.setItem('gymflow_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('gymflow_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('gymflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Layout navigation states
  const [adminTab, setAdminTab] = useState<'Dashboard' | 'Members'>('Dashboard');
  const [showScanner, setShowScanner] = useState(false);
  const [showExerciseLib, setShowExerciseLib] = useState(false);
  const [activeCreator, setActiveCreator] = useState<'none' | 'workout' | 'diet'>('none');
  const [showNotifications, setShowNotifications] = useState(false);

  // Alert/Toast states
  const [notificationToast, setNotificationToast] = useState('');

  // Handle new check in triggers from QR code scanner simulator
  const handleAddNewAttendance = (record: AttendanceRecord) => {
    setAttendance([record, ...attendance]);
    
    // Add real notification alert 
    const systemNotice: GymNotification = {
      id: `notice_${Date.now()}`,
      title: 'Entrance Event',
      message: `${record.memberName} verified check-in credentials.`,
      timestamp: 'Just now',
      unread: true,
      category: 'CHECK_IN'
    };
    setNotifications([systemNotice, ...notifications]);
    setNotificationToast(`${record.memberName} checked in successfully!`);
    setTimeout(() => setNotificationToast(''), 3000);
  };

  // Add customized workout plan
  const handleSaveWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlans([plan, ...workoutPlans]);
    
    // Dispatch system notice
    const notice: GymNotification = {
      id: `notice_${Date.now()}`,
      title: 'Workout Blueprint Archived',
      message: `${plan.name} has been verified and registered for ${plan.goal}.`,
      timestamp: 'Just now',
      unread: true,
      category: 'SYSTEM'
    };
    setNotifications([notice, ...notifications]);
    setActiveCreator('none');
  };

  // Add diet chart blueprint
  const handleSaveDietPlan = (diet: DietPlan) => {
    setDietPlans([diet, ...dietPlans]);
    
    // Dispatch system notice
    const notice: GymNotification = {
      id: `notice_${Date.now()}`,
      title: 'Nutrition Diet Archived',
      message: `${diet.name} nutrition matrix logged.`,
      timestamp: 'Just now',
      unread: true,
      category: 'SYSTEM'
    };
    setNotifications([notice, ...notifications]);
    setActiveCreator('none');
  };

  const handleUpdateWeight = (new_w: number) => {
    const updated = members.map(m => {
      if (m.id === currentUserId) {
        const historyCopy = [...m.weightHistory, { date: 'Today', weight: new_w }];
        return { ...m, weight: new_w, weightHistory: historyCopy };
      }
      return m;
    });
    setMembers(updated);
  };

  const handleMarkNoticesRead = () => {
    const cleared = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(cleared);
  };

  const currentMemberObj = members.find(m => m.id === currentUserId) || members.find(m => m.id === 'm1') || members[0];

  return (
    <div className="relative min-h-screen bg-[#070903] text-[#e2e4cf] overflow-hidden flex flex-col items-center justify-center py-4 px-2 sm:py-8">
      {/* Dynamic kinetic aesthetic background pattern in workspace */}
      <KineticShader opacity={userRole === null ? 0.8 : 0.45} />

      {/* Layout mode switcher control header */}
      <div className="mb-4 z-50 bg-[#1a1d10]/95 border border-[#444933]/50 px-4 py-1.5 rounded-full flex items-center gap-4 text-xs backdrop-blur-md shadow-2xl">
        <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-[#abd600]">Layout Preview:</span>
        <div className="flex bg-[#111508] rounded-lg p-0.5 border border-[#444933]/25">
          <button
            onClick={() => setLayoutMode('desktop')}
            className={`px-3 py-1 text-[10px] uppercase font-bold font-mono tracking-wider rounded-md transition-all ${layoutMode === 'desktop' ? 'bg-[#cbd63c] text-[#111508]' : 'text-[#c4c9ac]/60 hover:text-white'}`}
          >
            💻 Widescreen Dashboard
          </button>
          <button
            onClick={() => setLayoutMode('mobile')}
            className={`px-3 py-1 text-[10px] uppercase font-bold font-mono tracking-wider rounded-md transition-all ${layoutMode === 'mobile' ? 'bg-[#cbd63c] text-[#111508]' : 'text-[#c4c9ac]/60 hover:text-white'}`}
          >
            📱 Mobile Frame
          </button>
        </div>
      </div>

      {/* Primary Mockup Shell framing */}
      <div 
        id="gymflow-frame-wrapper"
        className={`w-full bg-[#111508]/95 border border-[#444933]/40 flex flex-col overflow-hidden shadow-[0_24px_56px_rgba(0,0,0,0.85)] relative transition-all duration-300 ${
          layoutMode === 'mobile' 
            ? 'max-w-[420px] h-[840px] rounded-[44px]' 
            : 'max-w-[1240px] w-[95%] h-[90vh] rounded-3xl'
        }`}
      >
        
        {/* Device screen notch simulator bar */}
        {layoutMode === 'mobile' && (
          <header className="h-10 bg-[#111508] shrink-0 flex justify-between items-center px-6 text-[11px] font-bold font-mono tracking-wide border-b border-white/5 z-50 select-none">
            <time className="text-white">09:41</time>
            <div className="w-24 h-4.5 bg-[#000000] rounded-full absolute left-1/2 -translate-x-1/2 border border-white/5 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#cbd63c]/30 animate-pulse"></span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80">
              <Signal className="w-3.5 h-3.5 shrink-0" />
              <Wifi className="w-3.5 h-3.5 shrink-0" />
              <Battery className="w-4.5 h-4.5 shrink-0 text-[#abd600]" />
            </div>
          </header>
        )}

        {/* Dynamic App Brand Header bar (Only visible when user has authenticated) */}
        {userRole && (
          <header className="h-14 bg-[#111508]/85 backdrop-blur-md border-b border-[#444933]/20 flex justify-between items-center px-4 shrink-0 z-30 select-none">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold font-mono tracking-tight text-[#abd600] flex items-center gap-1">
                <Zap className="w-4 h-4 fill-current text-[#abd600]" /> GymFlow
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-white/5 text-[#c4c9ac] px-2 py-0.5 rounded border border-[#444933]/20">
                {userRole}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) handleMarkNoticesRead();
                }}
                className="p-2 hover:bg-[#333627]/40 rounded-full text-[#c4c9ac] hover:text-[#abd600] transition-colors relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </button>

              {/* Logout button */}
              <button 
                onClick={() => {
                  setUserRole(null);
                  setUserName('');
                }}
                className="p-2 hover:bg-red-500/10 rounded-full text-[#c4c9ac] hover:text-red-400 transition-colors"
                title="Log Out of GymFlow"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </header>
        )}

        {/* Dynamic viewport panel container */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-[#111508]/30">
          
          {userRole === null ? (
            <AuthScreen 
              members={members}
              trainers={trainers}
              onLoginSuccess={(role, name, userId) => {
                setUserRole(role);
                setUserName(name);
                setCurrentUserId(userId);
                
                // Welcome notification Dispatcher
              const welcomeNotice: GymNotification = {
                id: `notice_${Date.now()}`,
                title: 'Session Started',
                message: `Authenticated successfully as ${name}. Welcome back.`,
                timestamp: 'Just now',
                unread: true,
                category: 'SYSTEM'
              };
              setNotifications([welcomeNotice, ...notifications]);
            }} />
          ) : (
            /* Authenticated layouts */
            <>
              {/* Overlay drawers/screens (Scanner, Creators, Library) */}
              
              {showScanner && (
                <QRScanner 
                  members={members}
                  onAddAttendance={handleAddNewAttendance}
                  onClose={() => setShowScanner(false)}
                />
              )}

              {showExerciseLib && (
                <div className="absolute inset-0 bg-[#111508] z-40 flex flex-col pt-16">
                  <header className="fixed top-0 left-0 right-0 z-50 bg-[#111508]/90 backdrop-blur-md border-b border-[#444933]/30 h-16 flex justify-between items-center px-4">
                    <span className="text-sm font-bold font-mono text-[#abd600] uppercase tracking-wider">Exercise Database</span>
                    <button onClick={() => setShowExerciseLib(false)} className="text-xs uppercase hover:underline text-[#abd600] font-bold">Done</button>
                  </header>
                  <ExerciseLibrary onClose={() => setShowExerciseLib(false)} />
                </div>
              )}

              {activeCreator === 'workout' && (
                <WorkoutCreator 
                  onSavePlan={handleSaveWorkoutPlan}
                  onClose={() => setActiveCreator('none')}
                />
              )}

              {activeCreator === 'diet' && (
                <DietCreator 
                  onSaveDiet={handleSaveDietPlan}
                  onClose={() => setActiveCreator('none')}
                />
              )}

              {/* Primary Role dashboards mapping */}
              {userRole === 'Admin' && (
                <AdminPanel 
                  members={members}
                  trainers={trainers}
                  payments={payments}
                  activeTab={adminTab}
                  onUpdateMembers={setMembers}
                  onTriggerScanner={() => setShowScanner(true)}
                  onSavePayment={(pay) => setPayments([pay, ...payments])}
                />
              )}

              {userRole === 'Trainer' && (
                <TrainerPanel 
                  members={members}
                  trainers={trainers}
                  trainerId={currentUserId}
                  onCreateWorkout={() => setActiveCreator('workout')}
                  onCreateDiet={() => setActiveCreator('diet')}
                />
              )}

              {userRole === 'Member' && (
                <MemberPanel 
                  member={currentMemberObj}
                  workoutPlans={workoutPlans}
                  dietPlans={dietPlans}
                  attendance={attendance}
                  onLogWeight={handleUpdateWeight}
                />
              )}

              {/* Notification center bottom sheet slide-up tray overlay */}
              {showNotifications && (
                <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm">
                  <div className="absolute bottom-0 left-0 right-0 bg-[#1e2113] border-t border-[#cbd63c]/25 rounded-t-3xl max-h-[70%] flex flex-col overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out]">
                    <div className="w-12 h-1 bg-[#444933] rounded-full mx-auto my-3 shrink-0"></div>
                    <div className="px-5 pb-3 border-b border-[#444933]/20 flex justify-between items-center shrink-0">
                      <span className="font-mono text-base font-bold text-white uppercase tracking-tight">Active Warning Alerts</span>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-[#abd600] font-bold uppercase hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                      {notifications.map((n) => (
                        <div key={n.id} className="bg-[#111508]/60 border border-white/5 p-3.5 rounded-xl text-left relative overflow-hidden">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-xs font-bold text-[#abd600]">{n.title}</h4>
                            <span className="text-[8px] text-[#8e9379] font-mono">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#c4c9ac]/90 leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Floating dynamic status toast */}
          {notificationToast && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#1e2113] border border-[#abd600]/30 px-5 py-3 rounded-2xl z-50 text-center shadow-2xl animate-fade-in flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#abd600] shrink-0" />
              <span className="text-xs font-bold text-white uppercase tracking-wide font-mono">{notificationToast}</span>
            </div>
          )}

        </div>

        {/* Global Admin Selector Footer navigation bar (Visible for Admin layouts only) */}
        {userRole === 'Admin' && (
          <footer className="h-16 bg-[#111508] border-t border-[#444933]/20 flex justify-around items-center shrink-0 z-30 select-none pb-2">
            <button 
              onClick={() => setAdminTab('Dashboard')}
              className={`flex flex-col items-center justify-center w-20 h-full transition-all ${adminTab === 'Dashboard' ? 'text-[#abd600]' : 'text-[#c4c9ac]/50 hover:text-white'}`}
            >
              <Zap className="w-5 h-5" />
              <span className="text-[9px] uppercase font-mono tracking-widest font-bold mt-1">Control</span>
            </button>
            
            <button 
              onClick={() => setShowScanner(true)}
              className="w-12 h-12 bg-[#abd600] text-[#111508] rounded-full flex items-center justify-center -translate-y-4 shadow-[0_4px_16px_rgba(171,214,0,0.4)] active:scale-95 transition-all text-center"
              title="Launch scan reader"
            >
              <QrCode className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setAdminTab('Members')}
              className={`flex flex-col items-center justify-center w-20 h-full transition-all ${adminTab === 'Members' ? 'text-[#abd600]' : 'text-[#c4c9ac]/50 hover:text-white'}`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-[9px] uppercase font-mono tracking-widest font-bold mt-1">Database</span>
            </button>
          </footer>
        )}

        {/* Standard Trainer global bottom menu */}
        {userRole === 'Trainer' && (
          <footer className="h-16 bg-[#111508] border-t border-[#444933]/20 flex justify-around items-center shrink-0 z-30 select-none pb-2">
            <button 
              onClick={() => setShowExerciseLib(true)}
              className="flex flex-col items-center justify-center w-24 h-full text-[#c4c9ac]/50 hover:text-[#abd600] transition-colors"
            >
              <Dumbbell className="w-5 h-5 text-[#abd600]" />
              <span className="text-[9px] uppercase font-mono tracking-widest font-bold mt-1 text-[#abd600]/80">Exercise Lib</span>
            </button>
            <div className="text-[10px] font-mono text-[#8e9379] uppercase font-bold tracking-widest">
              Coach Active Session
            </div>
            <button 
              onClick={() => {
                const notice: GymNotification = {
                  id: `notice_${Date.now()}`,
                  title: 'Broadcasting Alert',
                  message: 'Announcement successfully targeted to all trainee profiles.',
                  timestamp: 'Just now',
                  unread: true,
                  category: 'ANNOUNCEMENT'
                };
                setNotifications([notice, ...notifications]);
                setNotificationToast('Announcement broadcasted!');
                setTimeout(() => setNotificationToast(''), 2000);
              }}
              className="flex flex-col items-center justify-center w-24 h-full text-[#c4c9ac]/50 hover:text-[#abd600] transition-colors"
            >
              <zap-btn className="w-5 h-5 text-amber-400">⚡</zap-btn>
              <span className="text-[9px] uppercase font-mono tracking-widest font-bold mt-1 text-amber-500">Announce</span>
            </button>
          </footer>
        )}

        {/* Interactive mock navigation info footer panel block */}
        {layoutMode === 'mobile' && (
          <footer className="h-4 bg-[#111508] shrink-0 border-t border-white/5 flex items-center justify-center pb-2 select-none z-30">
            <div className="w-28 h-1 bg-[#444933]/40 rounded-full"></div>
          </footer>
        )}

      </div>

    </div>
  );
}
