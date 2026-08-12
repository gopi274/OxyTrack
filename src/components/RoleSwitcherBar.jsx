import React from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  Building2,
  Stethoscope,
  MapPin,
  Landmark,
  Sliders,
  Settings,
  Lock,
  Play,
  Pause
} from 'lucide-react';

export const RoleSwitcherBar = () => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    isEvaluatorMode,
    setIsEvaluatorMode,
    isSimulating,
    setIsSimulating,
    triggerSimulatedSpike,
    triggerPressureDrop,
    resetTelemetryToNormal
  } = useOxyTrack();

  const roles = [
    { id: 'HOSPITAL_STAFF', name: 'Nurse', icon: Stethoscope },
    { id: 'HOSPITAL_ADMIN', name: 'Hospital Admin', icon: Building2 },
    { id: 'DISTRICT_OFFICER', name: 'District Officer (DMO)', icon: MapPin },
    { id: 'STATE_HEALTH', name: 'State Health Dept', icon: Landmark },
    { id: 'SYSTEM_ADMIN', name: 'Technical Admin', icon: Sliders }
  ];

  return (
    <div className="bg-sky-100/80 backdrop-blur-md border-b border-sky-200 px-4 py-2 text-xs text-sky-950 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Active Role & Evaluator Mode Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          
          <button
            onClick={() => setIsEvaluatorMode(!isEvaluatorMode)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold border transition-all ${
              isEvaluatorMode
                ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-xs'
                : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50 shadow-2xs'
            }`}
            title="Toggle demo mode to switch role views for testing"
          >
            <Settings className="w-3.5 h-3.5 text-amber-600" />
            {isEvaluatorMode ? 'Demo Role Switcher: ON' : 'Switch Role View'}
          </button>

          {isEvaluatorMode ? (
            <div className="flex items-center gap-1 flex-wrap">
              {roles.map(r => {
                const Icon = r.icon;
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setCurrentRole(r.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-sky-800 hover:bg-sky-50 border border-sky-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-sky-500" />
                    {r.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[11px] text-sky-900 font-extrabold bg-white px-4 py-1.5 rounded-full border border-sky-200 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Logged in as: <strong className="text-blue-900 font-black">{currentUser?.name}</strong></span>
              <span className="text-sky-300">•</span>
              <span className="text-blue-600 font-bold">{currentUser?.badge}</span>
            </div>
          )}

        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border shadow-2xs ${
              isSimulating
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 text-emerald-600" /> : <Play className="w-3.5 h-3.5 text-amber-600" />}
            {isSimulating ? 'Live Updates On' : 'Live Updates Paused'}
          </button>

          <div className="flex items-center gap-1.5 pl-2 border-l border-sky-200">
            <span className="text-[10px] text-sky-700 uppercase font-extrabold tracking-wider">Test Demo:</span>
            <button
              onClick={triggerSimulatedSpike}
              className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-[10px] font-extrabold transition-colors shadow-2xs"
            >
              Test ICU Spike
            </button>
            <button
              onClick={triggerPressureDrop}
              className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-[10px] font-extrabold transition-colors shadow-2xs"
            >
              Test Pipe Leak
            </button>
            <button
              onClick={resetTelemetryToNormal}
              className="px-3 py-1 rounded-full bg-white text-sky-800 border border-sky-200 hover:bg-sky-50 text-[10px] font-extrabold transition-colors shadow-2xs"
            >
              Reset Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
