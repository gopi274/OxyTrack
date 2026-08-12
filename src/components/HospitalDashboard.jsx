import React from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  Activity,
  AlertOctagon,
  Clock,
  Droplets,
  HeartPulse,
  Radio,
  ShieldAlert,
  Stethoscope,
  Building,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Heart,
  TrendingUp
} from 'lucide-react';

export const HospitalDashboard = ({ onOpenReplenishmentModal }) => {
  const { currentHospital, sensors } = useOxyTrack();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full tag-critical text-xs font-extrabold shadow-xs">
            🔴 CRITICAL OXYGEN SHORTAGE
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full tag-warning text-xs font-extrabold shadow-xs">
            🟡 WARNING: HIGH CONSUMPTION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full tag-normal text-xs font-extrabold shadow-xs">
            🟢 NORMAL STOCK
          </span>
        );
    }
  };

  const formatHours = (decimalHours) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const capacityPercent = Math.round((currentHospital.availableOxygen / currentHospital.capacity) * 100);

  return (
    <div className="space-y-8">
      
      {/* ProHealth Hero Section */}
      <div className="relative pt-4 pb-2">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Text & ProHealth Title */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Small Badge Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-extrabold shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
              State Medical Oxygen Telemetry Platform
            </div>

            {/* ProHealth Signature Large Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
              Making Oxygen <span className="text-blue-600">Reliable</span> and <span className="text-blue-600">Accessible</span>
            </h1>

            <p className="text-base text-slate-600 font-medium max-w-xl leading-relaxed">
              Real-time IoT telemetry monitoring, AI early depletion forecasting, and automated replenishment for <strong>{currentHospital.name}</strong>.
            </p>

            {/* Action Buttons (Exact ProHealth Style) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenReplenishmentModal}
                className="btn-prohealth-primary px-7 py-3 text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                <ShieldAlert className="w-4 h-4" />
                Request Oxygen Refill <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                <UserCheck className="w-4 h-4 text-blue-600" />
                CMO: {currentHospital.contactPerson}
              </div>
            </div>

          </div>

          {/* Right Column: Hospital Status Snapshot Card */}
          <div className="lg:col-span-5">
            <div className="prohealth-panel p-6 bg-white border border-blue-100 shadow-xl shadow-blue-100/60 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-blue-50">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">{currentHospital.name}</h3>
                    <span className="text-[11px] text-slate-500 font-semibold">{currentHospital.district} District</span>
                  </div>
                </div>
                {getStatusBadge(currentHospital.status)}
              </div>

              {/* Floating Gauge Summary */}
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-extrabold block">LMO Tank Reserve</span>
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentHospital.availableOxygen.toLocaleString()} L</span>
                  </div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    capacityPercent < 25 ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {capacityPercent}% Tank Level
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[10px] uppercase font-bold">Supplier</span>
                    <span className="font-extrabold text-slate-800 truncate block mt-0.5">{currentHospital.lmoSupplier}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[10px] uppercase font-bold">ICU Occupancy</span>
                    <span className="font-extrabold text-rose-600 block mt-0.5">{currentHospital.icuOccupancy}% (38 Beds)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ProHealth 3 Stat Summary Bar */}
        <div className="mt-8 prohealth-panel bg-white p-5 shadow-xl shadow-blue-100/50 border border-blue-100/80">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-100 text-center gap-4">
            
            <div className="py-2 px-4">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">
                {currentHospital.availableOxygen.toLocaleString()} <span className="text-sm font-bold text-blue-600">Liters</span>
              </span>
              <span className="text-xs font-bold text-slate-500 mt-1 block">Current Available Stock</span>
            </div>

            <div className="py-2 px-4">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">
                {currentHospital.consumptionRate} <span className="text-sm font-bold text-purple-600">L/hr</span>
              </span>
              <span className="text-xs font-bold text-slate-500 mt-1 block">Hospital Oxygen Flow Rate</span>
            </div>

            <div className="py-2 px-4">
              <span className={`text-3xl font-extrabold tracking-tight block ${
                currentHospital.estimatedHours < 8 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {formatHours(currentHospital.estimatedHours)}
              </span>
              <span className="text-xs font-bold text-slate-500 mt-1 block">Estimated Time-to-Depletion</span>
            </div>

          </div>
        </div>

      </div>

      {/* ProHealth 4 Main Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        
        {/* ProHealth Card 1: Oxygen Reserve */}
        <div className="prohealth-panel p-6 bg-white border border-blue-100/80 shadow-xl shadow-blue-100/40 text-center prohealth-card-hover flex flex-col items-center justify-between space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-md shadow-blue-500/10">
            <Droplets className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Main LMO Reserve</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Cryogenic tank level monitoring and volume tracking.
            </p>
          </div>
          <div className="w-full pt-3 border-t border-blue-50 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Volume:</span>
            <span className="text-blue-600 text-sm">{currentHospital.availableOxygen.toLocaleString()} L</span>
          </div>
        </div>

        {/* ProHealth Card 2: Consumption Rate */}
        <div className="prohealth-panel p-6 bg-white border border-blue-100/80 shadow-xl shadow-blue-100/40 text-center prohealth-card-hover flex flex-col items-center justify-between space-y-4">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-md shadow-purple-500/10">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Clinical Demand</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Real-time hourly consumption across ICU and emergency wards.
            </p>
          </div>
          <div className="w-full pt-3 border-t border-purple-50 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Flow Rate:</span>
            <span className="text-purple-600 text-sm">{currentHospital.consumptionRate} L/hr</span>
          </div>
        </div>

        {/* ProHealth Card 3: Autonomy Countdown */}
        <div className="prohealth-panel p-6 bg-white border border-blue-100/80 shadow-xl shadow-blue-100/40 text-center prohealth-card-hover flex flex-col items-center justify-between space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-md shadow-emerald-500/10">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Depletion Window</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              AI calculated time remaining before reserve exhaustion.
            </p>
          </div>
          <div className="w-full pt-3 border-t border-emerald-50 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Remaining:</span>
            <span className="text-emerald-600 text-sm">{formatHours(currentHospital.estimatedHours)}</span>
          </div>
        </div>

        {/* ProHealth Card 4: Active Sources */}
        <div className="prohealth-panel p-6 bg-white border border-blue-100/80 shadow-xl shadow-blue-100/40 text-center prohealth-card-hover flex flex-col items-center justify-between space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-md shadow-blue-500/10">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Active Gas Sources</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              LMO tank, PSA generator plant, and cylinder manifolds.
            </p>
          </div>
          <div className="w-full pt-3 border-t border-blue-50 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Connected:</span>
            <span className="text-blue-600 text-sm">{currentHospital.activeSources} Sources</span>
          </div>
        </div>

      </div>

      {/* Live Sensors Block in ProHealth Styling */}
      <div className="prohealth-panel p-6 border border-blue-100 bg-white shadow-xl shadow-blue-100/50 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-blue-100">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              <Radio className="w-5 h-5 text-blue-600" />
              Automated Telemetry Sensor Instruments
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Sensors continuously stream tank level, line pressure, flow rate, and gas purity data to OxyTrack.
            </p>
          </div>
          <span className="text-xs text-blue-800 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 font-mono font-bold shadow-2xs">
            Gateway Node: GH-TVM-GW-04 (Online)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sensors.map(s => {
            const isCritical = s.status === 'CRITICAL';
            const isWarning = s.status === 'WARNING';
            return (
              <div
                key={s.id}
                className={`p-5 rounded-2xl border transition-all shadow-xs ${
                  isCritical
                    ? 'bg-rose-50/70 border-rose-200'
                    : isWarning
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-blue-50/30 border-blue-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-900 truncate max-w-[170px]" title={s.name}>
                    {s.name}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    isCritical ? 'tag-critical' : isWarning ? 'tag-warning' : 'tag-normal'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 mb-3 font-semibold">{s.type}</p>

                <div className="space-y-2 text-xs">
                  {s.levelPercent !== undefined && (
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                      <span className="text-slate-500 font-medium">Tank Level:</span>
                      <span className="font-extrabold text-slate-900 text-sm">{s.levelPercent}% ({s.volumeLiters}L)</span>
                    </div>
                  )}

                  {s.pressureBar !== undefined && (
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                      <span className="text-slate-500 font-medium">Pressure:</span>
                      <span className={`font-extrabold text-sm ${s.pressureBar < 3.5 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {s.pressureBar} bar
                      </span>
                    </div>
                  )}

                  {s.flowRateLhr !== undefined && (
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                      <span className="text-slate-500 font-medium">Flow Rate:</span>
                      <span className="font-extrabold text-blue-600 text-sm">{s.flowRateLhr} L/hr</span>
                    </div>
                  )}

                  {s.purityPercent !== undefined && (
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                      <span className="text-slate-500 font-medium">O2 Purity:</span>
                      <span className="font-extrabold text-emerald-600 text-sm">{s.purityPercent}%</span>
                    </div>
                  )}
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-blue-100 flex items-center justify-between text-[10px] text-slate-400 font-mono font-semibold">
                  <span>Battery: {s.batteryLevel}%</span>
                  <span>{s.signalQuality}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
