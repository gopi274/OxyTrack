import React, { useState } from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  Bell,
  Building,
  AlertOctagon,
  AlertTriangle,
  X,
  User,
  LogOut,
  Shield,
  Stethoscope,
  Heart
} from 'lucide-react';

export const Header = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    currentRole,
    logout,
    selectedHospitalId,
    setSelectedHospitalId,
    hospitals,
    activeAlerts,
    dismissAlert
  } = useOxyTrack();

  const [showAlertMenu, setShowAlertMenu] = useState(false);

  const getNavTabs = () => {
    switch (currentRole) {
      case 'HOSPITAL_STAFF':
        return [
          { id: 'nurse', label: '👩‍⚕️ Nurse Duty Station' }
        ];
      case 'HOSPITAL_ADMIN':
        return [
          { id: 'dashboard', label: 'Oxygen Status' },
          { id: 'shortage', label: 'Shortage Forecast' },
          { id: 'wards', label: 'Ward Flow' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'inventory', label: 'Cylinder Stock' }
        ];
      case 'DISTRICT_OFFICER':
        return [
          { id: 'map', label: 'District Map' },
          { id: 'redistribution', label: 'Hospital Sharing' },
          { id: 'analytics', label: 'Reports' }
        ];
      case 'STATE_HEALTH':
        return [
          { id: 'state', label: 'State Dashboard' },
          { id: 'map', label: 'Statewide Map' },
          { id: 'redistribution', label: 'Redistribution' },
          { id: 'analytics', label: 'State Analytics' }
        ];
      case 'SYSTEM_ADMIN':
        return [
          { id: 'system', label: 'IoT Sensors' },
          { id: 'inventory', label: 'Cylinder Registry' },
          { id: 'dashboard', label: 'Hospital Preview' },
          { id: 'analytics', label: 'System Logs' }
        ];
      default:
        return [{ id: 'dashboard', label: 'Dashboard' }];
    }
  };

  const navTabs = getNavTabs();

  return (
    <header className="bg-white/90 backdrop-blur-md border border-blue-100/80 sticky top-0 z-40 my-3 max-w-7xl mx-auto rounded-full shadow-lg shadow-blue-100/50">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        
        {/* ProHealth Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-none tracking-tight">
              Oxy<span className="text-blue-600">Track</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
              Medical Oxygen Portal
            </span>
          </div>
        </div>

        {/* ProHealth Centered Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-bold transition-all relative py-1 ${
                  isActive
                    ? 'text-blue-600 font-extrabold'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Pills */}
        <div className="flex items-center gap-3">
          
          {/* Hospital Switcher Dropdown Pill */}
          {(currentRole === 'HOSPITAL_ADMIN' || currentRole === 'SYSTEM_ADMIN') && (
            <div className="flex items-center gap-1.5 bg-blue-50/80 px-3.5 py-1.5 rounded-full border border-blue-100 text-xs">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <select
                value={selectedHospitalId}
                onChange={e => setSelectedHospitalId(e.target.value)}
                className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer text-xs"
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id} className="bg-white text-slate-800">
                    {h.name} ({h.status === 'CRITICAL' ? '🔴 Critical' : h.status === 'WARNING' ? '🟡 Warning' : '🟢 Normal'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ProHealth Doctor / Nurse Avatar Pill */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-slate-900 block text-[11px] leading-tight">{currentUser.name}</span>
                <span className="text-[9px] text-blue-600 font-bold block leading-tight">{currentUser.title}</span>
              </div>
              <button
                onClick={logout}
                className="ml-1 text-slate-400 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ProHealth Action Pill Button (Notification Bell) */}
          <div className="relative">
            <button
              onClick={() => setShowAlertMenu(!showAlertMenu)}
              className="relative p-2.5 rounded-full bg-blue-50 border border-blue-100 hover:bg-blue-100/80 text-blue-600 transition-colors shadow-2xs"
              title="Alert Notifications"
            >
              <Bell className="w-4 h-4 text-blue-600" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showAlertMenu && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl p-4 shadow-2xl shadow-blue-200/50 border border-blue-100 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-blue-50">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Oxygen Telemetry Alerts ({activeAlerts.length})
                  </div>
                  <button
                    onClick={() => setShowAlertMenu(false)}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 mt-3 pr-1">
                  {activeAlerts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                      No active alerts. All systems operational.
                    </div>
                  ) : (
                    activeAlerts.map(alert => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-2xl border text-xs relative ${
                          alert.type === 'DANGER'
                            ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                            : alert.type === 'WARNING'
                            ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                            : 'bg-blue-50/80 border-blue-200 text-blue-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-extrabold text-[11px] flex items-center gap-1.5">
                            {alert.type === 'DANGER' ? <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                            {alert.title}
                          </h4>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] opacity-90 mt-1 leading-snug font-medium">{alert.message}</p>
                        <span className="block text-[9px] opacity-60 mt-1 font-mono text-right font-semibold">{alert.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-blue-50/60 border-t border-blue-100 text-xs rounded-b-3xl">
        {navTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-full shrink-0 font-bold ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
