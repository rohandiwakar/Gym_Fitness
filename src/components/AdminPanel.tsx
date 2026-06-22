import React, { useState } from 'react';
import { Member, Trainer, AttendanceRecord, PaymentRecord, MembershipPlan } from '../types';
import { PlusCircle, Search, Trash2, Edit3, ShieldAlert, Award, FileText, Download, Check, Sparkles, UserCheck, Bolt } from 'lucide-react';

interface AdminPanelProps {
  members: Member[];
  trainers: Trainer[];
  payments: PaymentRecord[];
  activeTab: string;
  onUpdateMembers: (m: Member[]) => void;
  onTriggerScanner: () => void;
  onSavePayment: (pay: PaymentRecord) => void;
}

export default function AdminPanel({
  members,
  trainers,
  payments,
  activeTab,
  onUpdateMembers,
  onTriggerScanner,
  onSavePayment,
}: AdminPanelProps) {
  // Database views
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form states for creating a new member
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newHeight, setNewHeight] = useState('175 cm');
  const [newWeight, setNewWeight] = useState(75);
  const [newAddress, setNewAddress] = useState('');
  const [newEmergName, setNewEmergName] = useState('');
  const [newEmergRelation, setNewEmergRelation] = useState('');
  const [newEmergPhone, setNewEmergPhone] = useState('');
  const [newPlanId, setNewPlanId] = useState('p1');
  const [newTrainerId, setNewTrainerId] = useState('t1');

  // Sparkline/Billing simulators
  const [showBillingModal, setShowAddBilling] = useState(false);
  const [billingName, setBillingName] = useState('');
  const [billingAmount, setBillingAmount] = useState(150);
  const [billingPlan, setBillingPlan] = useState('Basic Monthly');

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const joiningDate = new Date().toISOString().split('T')[0];
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // +30 days

    const created: Member = {
      id: `m_${Date.now()}`,
      fullName: newName,
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6pzy_HUHtMg7herJueDrYtwE6SLDawpWFis-nk0iuDa09vlrv9zJlkYwbUF7wqcz82_NwfQXr0T2rVSqv2M7B3FTRZn4-yumQZI1LXF-mwiAyA-Nz1qCreg1HQPDC28ZvNJrs3TRjxBfPJk0RZ5CF0ahQwebMif8s93dM8lmFkZJDM6oJPJ-GxRUUFscXKMqpPM0tg7jV9zvyoM5QtoK6evA63TPcusO0NQhgBglXfeoEssE0ZhEZUftzNuLsKGUiFFu9nIVOiY0', // default avatar
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@gymflow.com`,
      gender: newGender,
      dob: '1996-01-01',
      height: newHeight || '180 cm',
      weight: newWeight,
      bmi: Number((newWeight / 3.24).toFixed(1)), // dummy height scale bmi
      weightHistory: [{ date: 'May 01', weight: newWeight }],
      address: newAddress || '842 Broadway, New York, NY',
      emergencyName: newEmergName || 'Emergency contact',
      emergencyRelation: newEmergRelation || 'Spouse',
      emergencyPhone: newEmergPhone || '+1 (555) 000-0112',
      planId: newPlanId,
      joiningDate,
      expiryDate,
      assignedTrainerId: newTrainerId,
      status: 'Active',
    };

    onUpdateMembers([...members, created]);
    setShowAddForm(false);
    
    // Add transaction payment record too
    onSavePayment({
      id: `pay_${Date.now()}`,
      memberName: created.fullName,
      planName: newPlanId === 'p1' ? 'Pro Performance Annual' : newPlanId === 'p2' ? 'Elite Plan' : 'Basic Monthly',
      amount: newPlanId === 'p1' ? 1200 : newPlanId === 'p2' ? 650 : 150,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Paid',
    });

    // Reset fields
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
  };

  const handleUpdateStatus = (memberId: string, status: 'Active' | 'Expired' | 'Suspended') => {
    const updated = members.map(m => m.id === memberId ? { ...m, status } : m);
    onUpdateMembers(updated);
    if (selectedMember && selectedMember.id === memberId) {
      setSelectedMember({ ...selectedMember, status });
    }
  };

  const handleDeleteMember = (memberId: string) => {
    onUpdateMembers(members.filter(m => m.id !== memberId));
    setSelectedMember(null);
  };

  const handleDownloadInvoice = (pay: PaymentRecord) => {
    const invoiceContent = `
=========================================
          GYMFLOW INVOICE RECEIPT
=========================================
Invoice ID: INV-${pay.id.toUpperCase()}
Date: ${pay.date}
Status: ${pay.status.toUpperCase()}
-----------------------------------------
BILL TO:
Client: ${pay.memberName}
Facility Location: GymFlow NYC Elite Hub
-----------------------------------------
DESCRIPTION:
Plan Purchased: ${pay.planName}
Access Level: Full Gym Studio, Kinetic Areas
Price: $${pay.amount.toFixed(2)}
Tax (0%): $0.00
-----------------------------------------
TOTAL AMOUNT PAID: $${pay.amount.toFixed(2)}
=========================================
  Thank you for choosing GymFlow NYC Hub!
=========================================
    `;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_GymFlow_${pay.memberName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddCustomPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingName.trim()) return;

    onSavePayment({
      id: `custom_${Date.now()}`,
      memberName: billingName,
      planName: billingPlan,
      amount: billingAmount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Paid',
    });

    setShowAddBilling(false);
    setBillingName('');
  };

  return (
    <div className="flex flex-col h-full bg-[#111508]/80 text-[#e2e4cf] overflow-y-auto px-5 pt-4 pb-24 font-sans select-none relative z-10">
      
      {activeTab === 'Dashboard' ? (
        <div className="space-y-6">
          {/* Top greeting dashboard */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-mono text-[#abd600] tracking-tight">Command Center</h2>
            <p className="text-xs text-[#c4c9ac]/60">Studio health dashboard & check-in triggers.</p>
          </div>

          {/* Metric Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#1e2113]/35 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-[#c4c9ac]/60 tracking-wider">Total Members</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">452</span>
                <span className="text-[10px] font-bold text-[#abd600] tracking-wide">+12%</span>
              </div>
            </div>

            <div className="bg-[#1e2113]/35 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-[#c4c9ac]/60 tracking-wider">Active Members</span>
              <span className="text-2xl font-bold font-mono text-white">388</span>
              <div className="w-full h-1 bg-[#1a1d10] rounded-full overflow-hidden">
                <div className="bg-[#abd600] h-full w-[85%]"></div>
              </div>
            </div>

            <div className="bg-[#1e2113]/35 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase font-bold text-[#c4c9ac]/60 tracking-wider">Revenue (MTD)</span>
              <span className="text-2xl font-bold font-mono text-[#abd600]">$12,500</span>
              <div className="flex items-end gap-1 h-6">
                <div className="w-full bg-[#abd600]/20 h-4 rounded-t-sm"></div>
                <div className="w-full bg-[#abd600]/40 h-6 rounded-t-sm"></div>
                <div className="w-full bg-[#abd600]/80 h-3 rounded-t-sm"></div>
                <div className="w-full bg-[#abd600] h-5 rounded-t-sm"></div>
              </div>
            </div>

            {/* Glowing Bolt attendance checker */}
            <div 
              onClick={onTriggerScanner}
              className="bg-[#abd600] hover:bg-[#cbd63c] hover:scale-[1.02] p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden cursor-pointer transition-all shadow-[0_4px_15px_rgba(171,214,0,0.3)] group"
            >
              <span className="text-[10px] uppercase font-mono font-bold text-[#111508]/80 tracking-wider">Live Check-ins</span>
              <span className="text-2xl font-extrabold font-mono text-[#111508]">45</span>
              <span className="text-[10px] font-bold text-[#111508]/70 hover:underline">Mark attendance</span>
              <div className="absolute -right-1 -bottom-1 opacity-20 group-hover:scale-110 transition-transform">
                <Bolt className="w-16 h-16 text-[#111508] shrink-0 fill-current" />
              </div>
            </div>
          </div>

          {/* Quick Actions grid button panel */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setShowAddForm(true)}
              className="py-3 bg-[#1e2113]/40 border border-[#cbd63c]/15 rounded-xl text-center text-xs font-bold hover:bg-[#abd600] hover:text-[#111508] transition-all"
            >
              Add Member
            </button>
            <button 
              onClick={onTriggerScanner}
              className="py-3 bg-[#1e2113]/40 border border-[#cbd63c]/15 rounded-xl text-center text-xs font-bold hover:bg-[#abd600] hover:text-[#111508] transition-all"
            >
              Scan Member
            </button>
            <button 
              onClick={() => setShowAddBilling(true)}
              className="py-3 bg-[#1e2113]/40 border border-[#cbd63c]/15 rounded-xl text-center text-xs font-bold hover:bg-[#abd600] hover:text-[#111508] transition-all"
            >
              Issue Invoice
            </button>
          </div>

          {/* Dynamic data sheets grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Expirie warnings list */}
            <div className="space-y-3">
              <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Plan Expiries</span>
                <span className="text-xs text-[#abd600] font-normal hover:underline cursor-pointer">Live monitor</span>
              </h3>
              <div className="space-y-2">
                {members.filter(m => m.status === 'Expired' || m.id === 'm3').slice(0, 3).map((m) => (
                  <div key={m.id} className="bg-[#1e2113]/25 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#111508] border border-[#cbd63c]/20 flex items-center justify-center font-bold text-[#abd600]">
                        {m.fullName[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{m.fullName}</p>
                        <p className="text-[10px] text-[#c4c9ac]/60">Assigned Plan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {m.status === 'Expired' ? (
                        <p className="text-xs text-red-400 font-bold">Expired</p>
                      ) : (
                        <p className="text-xs text-amber-500 font-bold">Due in 2 days</p>
                      )}
                      <p className="text-[9px] text-[#c4c9ac]/50">{m.expiryDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payments list ledger and receipts download selector */}
            <div className="space-y-3">
              <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Recent Payments</span>
                <span className="text-xs text-[#abd600] font-normal hover:underline cursor-pointer" onClick={() => setShowAddBilling(true)}>New billing</span>
              </h3>
              <div className="space-y-2">
                {payments.slice(0, 3).map((p) => (
                  <div key={p.id} className="bg-[#1e2113]/25 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#abd600]/15 flex items-center justify-center text-[#abd600]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{p.memberName}</p>
                        <p className="text-[10px] text-[#c4c9ac]/60 truncate max-w-[120px]">{p.planName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-white">${p.amount}</span>
                        <p className={`text-[9px] font-mono tracking-wider font-bold ${p.status === 'Paid' ? 'text-[#abd600]' : 'text-amber-500'}`}>{p.status}</p>
                      </div>
                      <button 
                        onClick={() => handleDownloadInvoice(p)}
                        className="p-1 px-2.5 bg-[#abd600]/15 hover:bg-[#abd600] text-[#abd600] hover:text-[#111508] rounded transition-all"
                        title="Download invoice text"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* System Announcement wide image card */}
          <div className="relative w-full h-36 rounded-2xl overflow-hidden mt-6">
            <img 
              className="w-full h-full object-cover brightness-40 filter contrast-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuANg-OJuE3-GHcWrOsSgNnPZlVl2vaLZ1gEOc0YrmfAxN1DAad1zXXX80qc81kbwxVST2GPqWUP2AwssS2hSTJ3wd-I2plRVgG3_FsaFELbfZR10zRp42VA6sa7twxGC04ktM9xIUihsZtxZNfRHpTQwQcFpw3CHmafOY56N3U9JXmfZfhI064y2ff2MhDje-wHpwoa-2q1-cSwguq9MG28vPopwCBL9-nPmUbJEY1f0E_m2S69xuPoPDFU_Q1gNGoW-rygqbA6xQc" 
              alt="Gym systems"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111508] to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <p className="text-[10px] text-[#abd600] font-mono font-bold uppercase tracking-wider mb-0.5">Performance update</p>
              <h4 className="text-sm font-bold text-white">Mobile attendance checks with auto invoice pipelines are online.</h4>
            </div>
          </div>

        </div>
      ) : (
        /* Members Tab */
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            <div>
              <h2 className="text-xl font-bold font-mono text-[#abd600] uppercase tracking-tight">Members Matrix</h2>
              <p className="text-xs text-[#c4c9ac]/60">Create, archive, and assign trainer profiles.</p>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-[#cbd63c]/10 text-[#abd600] border border-[#abd600]/30 hover:bg-[#abd600] hover:text-[#111508] p-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4.5 h-4.5" /> Add Member
            </button>
          </div>

          {/* Search bar and Filters */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9379] w-4.5 h-4.5" />
              <input 
                type="text"
                placeholder="Search name/credentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e2113] border-0 border-b border-[#444933]/50 focus:border-[#abd600] focus:ring-0 text-xs py-3 pl-9 rounded-t-lg text-white"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1e2113] border-none rounded-lg text-xs p-2 text-white"
            >
              <option value="All">All status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Member mapping grid list */}
          <div className="space-y-3">
            {filteredMembers.map((m) => (
              <div 
                key={m.id}
                className="bg-[#1e2113]/30 border border-white/5 rounded-xl p-3 flex justify-between items-center group hover:border-[#cbd63c]/20 transition-all text-left"
              >
                <div 
                  onClick={() => setSelectedMember(m)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <img src={m.photoUrl} className="w-10 h-10 rounded-full object-cover border border-[#cbd63c]/20 shrink-0" alt={m.fullName} />
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate max-w-[120px]">{m.fullName}</h4>
                      <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${m.status === 'Active' ? 'bg-[#abd600]/15 text-[#abd600]' : 'bg-red-500/15 text-red-500'}`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#c4c9ac]/70 mt-0.5">{m.phone} • {m.email}</p>
                    <p className="text-[9px] text-[#8e9379] mt-0.5 uppercase tracking-wide">Joined: {m.joiningDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => setSelectedMember(m)}
                    className="p-1.5 bg-[#cbd63c]/10 text-white rounded hover:bg-[#cbd63c]/20 transition-all font-mono text-[9px] uppercase font-bold"
                  >
                    Load File
                  </button>
                  <button 
                    onClick={() => handleDeleteMember(m.id)}
                    className="p-2 text-[#c4c9ac] hover:text-red-400 opacity-40 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issuing Billing prompt form popup */}
      {showBillingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddBilling(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>
          <div className="relative bg-[#1e2113] border border-[#cbd63c]/35 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h3 className="font-mono text-base font-bold text-white border-b border-[#444933]/25 pb-2 mb-4 uppercase">Issue Client Invoice</h3>
            
            <form onSubmit={handleAddCustomPayment} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#c4c9ac] block mb-1">MEMBER NAME</label>
                <input 
                  type="text"
                  required
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  placeholder="e.g. Rachel Green"
                  className="w-full bg-[#1a1d10] border border-[#444933]/50 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#c4c9ac] block mb-1">PLAN ARCHIVE</label>
                  <select 
                    value={billingPlan}
                    onChange={(e) => setBillingPlan(e.target.value)}
                    className="w-full bg-[#1a1d10] border border-[#444933]/50 rounded-xl px-3 py-2 text-xs text-white focus:bg-[#1a1d10]"
                  >
                    <option>Pro Performance Annual</option>
                    <option>Elite Plan</option>
                    <option>Basic Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#c4c9ac] block mb-1">AMOUNT ($)</label>
                  <input 
                    type="number"
                    min={1}
                    value={billingAmount}
                    onChange={(e) => setBillingAmount(Number(e.target.value))}
                    className="w-full bg-[#1a1d10] border border-[#444933]/50 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowAddBilling(false)}
                  className="flex-1 py-2.5 bg-[#333627] text-white rounded-xl hover:bg-[#444933] font-bold"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#abd600] text-[#111508] rounded-xl hover:bg-[#cbd63c] font-bold"
                >
                  Post Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Creation dialog panel */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddForm(false)} className="absolute inset-0 bg-[#0c0f04]/85 backdrop-blur-md"></div>
          <div className="relative bg-[#1e2113] border border-[#abd600]/30 rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
            <h3 className="font-mono text-base font-bold text-white uppercase border-b border-[#cbd63c]/20 pb-2 mb-4">Admit New Member</h3>
            
            <form onSubmit={handleCreateMember} className="space-y-3.5 text-left">
              <div>
                <label className="text-[9px] uppercase font-bold text-[#c4c9ac] block mb-1">Full Name</label>
                <input 
                  type="text" required value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Joey Tribbiani"
                  className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[9px] uppercase font-bold text-[#c4c9ac] block mb-1">Phone Number</label>
                  <input 
                    type="text" required value={newPhone} onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (555) 100-2023"
                    className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-[#c4c9ac] block mb-1">Weight (kg)</label>
                  <input 
                    type="number" value={newWeight} onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold text-[#c4c9ac] block mb-1">Email ID</label>
                <input 
                  type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="joey@friends.net"
                  className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[9px] uppercase font-bold text-[#c4c9ac] block mb-1">Assigned Plan</label>
                  <select 
                    value={newPlanId} onChange={(e) => setNewPlanId(e.target.value)}
                    className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="p1">Pro Performance Annual</option>
                    <option value="p2">Elite Plan</option>
                    <option value="p3">Basic Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-[#c4c9ac] block mb-1">Assign Coach</label>
                  <select 
                    value={newTrainerId} onChange={(e) => setNewTrainerId(e.target.value)}
                    className="w-full bg-[#1a1d10] border border-[#444933]/45 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2 text-xs">
                <button 
                  type="button" onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 bg-[#333627] text-white hover:bg-[#444933] rounded-xl font-bold"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#abd600] text-[#111508] hover:bg-[#cbd63c] rounded-xl font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Member dossier file card overlay details */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedMember(null)} className="absolute inset-0 bg-[#0c0f04]/90 backdrop-blur-md"></div>
          <div className="relative bg-[#1e2113] border border-[#abd600]/30 rounded-2xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto block shadow-2xl text-left">
            
            <div className="flex items-center gap-3.5 border-b border-[#cbd63c]/20 pb-4 mb-4 shrink-0">
              <img src={selectedMember.photoUrl} className="w-16 h-16 object-cover rounded-xl border border-[#cbd63c]/40" alt={selectedMember.fullName} />
              <div>
                <h3 className="text-xl font-bold text-white font-mono">{selectedMember.fullName}</h3>
                <span className="text-[10px] uppercase font-bold bg-[#abd600]/10 text-[#abd600] px-2.5 py-0.5 rounded border border-[#abd600]/20">
                  {selectedMember.planId === 'p1' ? 'Platinum Member' : 'Standard Tier'}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <p className="text-[9px] uppercase font-bold text-[#c4c9ac]/60">Physical Metrics</p>
                  <p className="text-white font-mono mt-0.5">{selectedMember.height} • {selectedMember.weight} kg</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-[#c4c9ac]/60">Computed Body BMI</p>
                  <p className="text-white mt-0.5">{selectedMember.bmi} <span className="text-[10px] text-[#abd600]">Normal</span></p>
                </div>
              </div>

              <div>
                <p className="text-[9px] uppercase font-bold text-[#c4c9ac]/60">Email & Contact</p>
                <p className="text-white font-medium mt-0.5">{selectedMember.email}</p>
                <p className="text-white font-mono mt-0.5">{selectedMember.phone}</p>
              </div>

              <div className="bg-[#1a1d10] p-3 rounded-lg border border-white/5">
                <p className="text-[9px] uppercase font-bold text-[#cbd63c] mb-1">Emergency contact (spouse/sibling)</p>
                <p className="text-white font-bold">{selectedMember.emergencyName} ({selectedMember.emergencyRelation})</p>
                <p className="text-[#c4c9ac] font-mono mt-0.5">{selectedMember.emergencyPhone}</p>
              </div>

              <div className="bg-[#1a1d10] p-3 rounded-lg border border-white/5">
                <p className="text-[9px] uppercase font-bold text-[#cbd63c] mb-1">Membership Plan</p>
                <p className="text-white font-bold">{selectedMember.planId === 'p1' ? 'Pro Performance Annual' : 'Basic Monthly'}</p>
                <p className="text-[#c4c9ac]/80 mt-1">Expiry Date: {selectedMember.expiryDate}</p>
              </div>

              {/* Status togglers and block triggers */}
              <div className="pt-2 border-t border-[#444933]/20 flex gap-2">
                <button 
                  onClick={() => handleUpdateStatus(selectedMember.id, 'Active')}
                  className="flex-1 py-2 bg-[#cbd63c]/10 text-[#abd600] rounded hover:bg-[#abd600] hover:text-[#111508] transition-all font-bold text-[10px] uppercase font-mono tracking-wider text-center"
                >
                  Activate
                </button>
                <button 
                  onClick={() => handleUpdateStatus(selectedMember.id, 'Suspended')}
                  className="flex-1 py-2 bg-red-400/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition-all font-bold text-[10px] uppercase font-mono tracking-wider text-center"
                >
                  Suspend
                </button>
              </div>
            </div>

            <button 
              onClick={() => setSelectedMember(null)}
              className="mt-6 w-full py-3 bg-[#333627] hover:bg-[#abd600] hover:text-[#111508] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-widest"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
