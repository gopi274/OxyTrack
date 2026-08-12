import React, { useState } from 'react';
import { useOxyTrack, DEMO_USERS } from '../context/OxyTrackContext';
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from 'lucide-react';

export const LoginPage = () => {
  const { login } = useOxyTrack();

  const [email, setEmail] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState(DEMO_USERS[0].role);

  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setSelectedRole(user.role);
    login(user.email, 'demo-pass', user.role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/90 via-sky-50 to-indigo-100/80 text-slate-900 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Background Soft Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left: Branding & Feature Overview (5 cols) */}
        <div className="lg:col-span-5 prohealth-panel rounded-3xl p-8 border border-blue-100 bg-white/90 shadow-xl shadow-blue-100/60 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Shield className="w-6 h-6 fill-white/20" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Oxy<span className="text-blue-600">Track</span>
                </h1>
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block">
                  Medical Oxygen Intelligence
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-6 leading-relaxed font-medium">
              Enterprise IoT medical oxygen telemetry, depletion forecasting, automated replenishment requisitions & inter-hospital supply redistribution.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-slate-900 block">Role-Based Access Control (RBAC)</span>
                <span className="text-slate-500 text-[11px] font-medium">Strict role scoping for Staff, Admins, DMOs & State Officers</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-2.5">
              <Sparkles className="w-4.5 h-4.5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-slate-900 block">Depletion Forecast Engine</span>
                <span className="text-slate-500 text-[11px] font-medium">AI shortage forecasting & probabilistic leak diagnostics</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-bold">
            Department of Health & Family Welfare • Government of Kerala
          </div>
        </div>

        {/* Right: Authentication Form & Quick Role Presets (7 cols) */}
        <div className="lg:col-span-7 prohealth-panel rounded-3xl p-8 border border-blue-100 bg-white/90 shadow-xl shadow-blue-100/60 space-y-6">
          
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Portal Sign In</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Select demo account preset or enter your credentials</p>
          </div>

          {/* Quick Login Presets Bar */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              ⚡ 1-Click Quick Demo Sign In:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_USERS.map(u => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                    email === u.email
                      ? 'bg-blue-50 border-blue-500 text-slate-900 shadow-md shadow-blue-500/10 font-bold'
                      : 'bg-white border-slate-200 hover:bg-sky-50/50 text-slate-700 font-medium'
                  }`}
                >
                  <div>
                    <span className="font-extrabold block text-[11px] text-slate-900">{u.name}</span>
                    <span className="text-[10px] text-blue-600 font-bold">{u.badge}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                </button>
              ))}
            </div>
          </div>

          <hr className="border-blue-100" />

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:border-blue-600 font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-extrabold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:border-blue-600 font-mono font-bold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <KeyRound className="w-4 h-4" />
              Sign In to OxyTrack Portal
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
