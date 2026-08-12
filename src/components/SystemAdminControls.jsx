import React, { useState } from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  Cpu,
  ShieldCheck,
  Sliders,
  Zap
} from 'lucide-react';

export const SystemAdminControls = () => {
  const { isSimulating, setIsSimulating } = useOxyTrack();
  const [sensitivity, setSensitivity] = useState(85);
  const [pingRate, setPingRate] = useState(2);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-sky-200/80 shadow-md shadow-sky-100/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            ⚙️ System Administrator IoT & Telemetry Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Telemetry stream pings, sampling rates, and AI anomaly detection sensitivity thresholds
          </p>
        </div>

        <span className="text-xs font-mono bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full border border-blue-200 font-bold shadow-2xs">
          Role: System Administrator (Superuser)
        </span>
      </div>

      {/* Telemetry Stream Settings Panel (Full Width) */}
      <div className="prohealth-panel rounded-3xl p-6 border border-sky-200/80 bg-white shadow-md shadow-sky-100/50 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            IoT Telemetry Stream Settings
          </h3>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Telemetry Signal: 99.4% (Port 8883)
          </span>
        </div>

        <div className="space-y-6 text-xs">
          {/* Stream Enable Toggle */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Real-time Telemetry Stream Tick</span>
              <span className="text-xs text-slate-500 font-medium">Continuous telemetry stream ping</span>
            </div>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-5 py-2 rounded-full font-extrabold text-xs shadow-2xs transition-all hover:scale-105 ${
                isSimulating ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isSimulating ? '🟢 Stream Enabled' : '🟡 Stream Paused'}
            </button>
          </div>

          {/* Ping Rate */}
          <div className="p-4 rounded-2xl bg-white border border-sky-200 space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-slate-800 font-extrabold text-xs">
                Telemetry Sampling Rate
              </label>
              <span className="text-sm font-mono font-black text-blue-600 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
                {pingRate} seconds
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={pingRate}
              onChange={e => setPingRate(e.target.value)}
              className="w-full cursor-pointer accent-blue-600 h-2 bg-sky-100 rounded-lg appearance-none"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Determines how frequently hardware transducers transmit pressure and flow rate data points.
            </p>
          </div>

          {/* Anomaly Model Sensitivity */}
          <div className="p-4 rounded-2xl bg-white border border-sky-200 space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-slate-800 font-extrabold text-xs">
                AI Anomaly Model Sensitivity Threshold
              </label>
              <span className="text-sm font-mono font-black text-rose-600 bg-rose-50 px-3 py-0.5 rounded-full border border-rose-200">
                {sensitivity}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={sensitivity}
              onChange={e => setSensitivity(e.target.value)}
              className="w-full cursor-pointer accent-rose-600 h-2 bg-rose-100 rounded-lg appearance-none"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Controls sensitivity for auto-detecting pipeline micro-leaks and HFNC consumption surges.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
