import React, { useState } from 'react';
import { OxyTrackProvider, useOxyTrack } from './context/OxyTrackContext';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { HospitalDashboard } from './components/HospitalDashboard';
import { ShortagePredictionPanel } from './components/ShortagePredictionPanel';
import { WardMonitoringView } from './components/WardMonitoringView';
import { ConsumptionAnalytics } from './components/ConsumptionAnalytics';
import { DigitalInventoryQR } from './components/DigitalInventoryQR';
import { RedistributionPlatform } from './components/RedistributionPlatform';
import { DistrictStateMap } from './components/DistrictStateMap';
import { StateCommandCenter } from './components/StateCommandCenter';
import { SystemAdminControls } from './components/SystemAdminControls';
import { NurseQuickView } from './components/NurseQuickView';
import { ReplenishmentModal } from './components/ReplenishmentModal';

function MainApp() {
  const { currentUser, currentRole } = useOxyTrack();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isReplenishOpen, setIsReplenishOpen] = useState(false);

  // Sync default active tab when role changes
  React.useEffect(() => {
    switch (currentRole) {
      case 'HOSPITAL_STAFF':
        setActiveTab('nurse');
        break;
      case 'HOSPITAL_ADMIN':
        setActiveTab('dashboard');
        break;
      case 'DISTRICT_OFFICER':
        setActiveTab('map');
        break;
      case 'STATE_HEALTH':
        setActiveTab('state');
        break;
      case 'SYSTEM_ADMIN':
        setActiveTab('system');
        break;
      default:
        setActiveTab('dashboard');
    }
  }, [currentRole]);

  // If not authenticated, render Login Page
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/90 via-sky-50 to-indigo-100/80 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-8">
      
      {/* Role Switcher Bar */}
      <RoleSwitcherBar />

      {/* Main Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'nurse' && (
          <NurseQuickView onOpenReplenishmentModal={() => setIsReplenishOpen(true)} />
        )}
        {activeTab === 'dashboard' && (
          <HospitalDashboard onOpenReplenishmentModal={() => setIsReplenishOpen(true)} />
        )}
        {activeTab === 'shortage' && (
          <ShortagePredictionPanel onOpenReplenishmentModal={() => setIsReplenishOpen(true)} />
        )}
        {activeTab === 'wards' && <WardMonitoringView />}
        {activeTab === 'analytics' && <ConsumptionAnalytics />}
        {activeTab === 'inventory' && <DigitalInventoryQR />}
        {activeTab === 'redistribution' && <RedistributionPlatform />}
        {activeTab === 'requisitions' && <RedistributionPlatform />}
        {activeTab === 'map' && (
          <DistrictStateMap onOpenReplenishmentModal={() => setIsReplenishOpen(true)} />
        )}
        {activeTab === 'state' && <StateCommandCenter onSelectTab={setActiveTab} />}
        {activeTab === 'system' && <SystemAdminControls />}
      </main>

      {/* Footer */}
      <footer className="mt-8 bg-white/80 backdrop-blur-md border-t border-sky-100 py-4 text-center text-xs text-slate-600 shadow-sm max-w-7xl mx-auto rounded-full w-full">
        <div className="px-6 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">OxyTrack © 2026 — Smart Hospital & State Oxygen Management Platform</span>
          <span className="font-mono text-[11px] text-slate-500 font-bold">
            🟢 Session Active ({currentUser.name}) • Signal 99.4%
          </span>
        </div>
      </footer>

      {/* Replenishment Requisition Modal */}
      <ReplenishmentModal
        isOpen={isReplenishOpen}
        onClose={() => setIsReplenishOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <OxyTrackProvider>
      <MainApp />
    </OxyTrackProvider>
  );
}
