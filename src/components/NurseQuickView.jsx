import React, { useState } from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  CheckCircle2,
  Clock,
  Droplets,
  Gauge,
  Plus,
  QrCode,
  ShieldAlert,
  Stethoscope,
  X
} from 'lucide-react';

export const NurseQuickView = ({ onOpenReplenishmentModal }) => {
  const { currentUser, currentHospital, cylinders, updateCylinderPressure } = useOxyTrack();

  const nurseCylinders = cylinders.length > 0 ? cylinders : [
    { id: 'OXY-10293', type: 'D-Type Cylinder (47L)', currentPressureBar: 145, status: 'FILLED', location: 'ICU Reserve' },
    { id: 'OXY-10294', type: 'D-Type Cylinder (47L)', currentPressureBar: 140, status: 'IN_USE', location: 'ICU Manifold Bank' },
    { id: 'OXY-10295', type: 'B-Type Portable Cylinder', currentPressureBar: 138, status: 'FILLED', location: 'Transport Bay' },
    { id: 'OXY-10297', type: 'Liquid Cryogenic Cylinder', currentPressureBar: 16.5, status: 'IN_USE', location: 'Auxiliary Bay' }
  ];

  const [selectedCylinderId, setSelectedCylinderId] = useState(nurseCylinders[0]?.id || 'OXY-10294');
  const activeCylinder = nurseCylinders.find(c => c.id === selectedCylinderId) || nurseCylinders[0];

  const [tempPressure, setTempPressure] = useState(activeCylinder?.currentPressureBar || 140);
  const [saveToast, setSaveToast] = useState('');

  // Sync temp pressure when selecting another cylinder
  const handleSelectCylinder = (cyl) => {
    setSelectedCylinderId(cyl.id);
    setTempPressure(cyl.currentPressureBar);
  };

  const handlePresetLevel = (bar) => {
    setTempPressure(bar);
  };

  const handleSaveCylinder = () => {
    if (activeCylinder) {
      updateCylinderPressure(activeCylinder.id, Number(tempPressure));
      setSaveToast(`Updated ${activeCylinder.id} oxygen pressure to ${tempPressure} bar!`);
      setTimeout(() => setSaveToast(''), 3000);
    }
  };

  const calculatePercent = (bar) => {
    const maxBar = activeCylinder?.capacityLiters > 10000 ? 20 : 150;
    return Math.min(100, Math.round((bar / maxBar) * 100));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Nurse Header */}
      <div className="prohealth-panel p-6 bg-white border border-sky-200/80 shadow-md shadow-sky-100/50 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-md shadow-blue-500/10">
            <Stethoscope className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Hello, {currentUser?.name || 'Nurse'} 👋
              </h2>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold border border-blue-200">
                On-Duty Nurse
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Duty Station: <strong className="text-slate-900 font-extrabold">{currentHospital.name}</strong> (Ward ICU)
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Hospital Stock</span>
          <span className="text-xs font-extrabold text-blue-600 font-mono">{nurseCylinders.length} Ward Cylinders</span>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          {saveToast}
        </div>
      )}

      {/* 2 Primary Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Action 1: Select Cylinder & Update Oxygen Level */}
        <div className="prohealth-panel rounded-3xl p-6 border border-sky-200/80 bg-white shadow-xl shadow-sky-100/50 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              1. Update Particular Cylinder Oxygen Level
            </h3>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold">
              Cylinder Duty
            </span>
          </div>

          {/* Cylinder Selector Cards */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-700 block">Select Ward Cylinder to Update:</span>
            <div className="grid grid-cols-2 gap-2">
              {nurseCylinders.slice(0, 4).map(cyl => {
                const isSelected = selectedCylinderId === cyl.id;
                return (
                  <button
                    key={cyl.id}
                    type="button"
                    onClick={() => handleSelectCylinder(cyl)}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-slate-900 shadow-md shadow-blue-500/10 font-bold'
                        : 'bg-white border-sky-200 hover:bg-sky-50/50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold font-mono text-[11px] flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5 text-blue-600" />
                        {cyl.id}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${
                        cyl.currentPressureBar > 90 ? 'bg-emerald-500' : cyl.currentPressureBar > 30 ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-1">{cyl.currentPressureBar} bar remaining</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Cylinder Level Gauge Card */}
          {activeCylinder && (
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-900 font-mono">Cylinder: {activeCylinder.id}</span>
                <span className="text-[10px] font-extrabold text-blue-700 bg-white px-3 py-0.5 rounded-full border border-sky-200">
                  {activeCylinder.type.split(' ')[0]}
                </span>
              </div>

              <div className="text-center py-2">
                <span className="text-4xl font-black text-blue-600 font-mono tracking-tight">{tempPressure}</span>
                <span className="text-sm font-extrabold text-blue-700 ml-1.5">bar</span>
                <span className="block text-[11px] text-slate-500 font-medium mt-0.5">
                  (~{calculatePercent(tempPressure)}% Remaining Oxygen)
                </span>
              </div>

              {/* Fast Presets */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handlePresetLevel(145)}
                  className="py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200 transition-all"
                >
                  🟢 Full
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetLevel(75)}
                  className="py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-700 font-extrabold text-[10px] border border-amber-200 transition-all"
                >
                  🟡 Half
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetLevel(30)}
                  className="py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-[10px] border border-rose-200 transition-all"
                >
                  🔴 Low
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetLevel(0)}
                  className="py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-[10px] border border-slate-300 transition-all"
                >
                  ❌ Empty
                </button>
              </div>

              {/* Pressure Range Slider */}
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="1"
                  value={tempPressure}
                  onChange={e => setTempPressure(Number(e.target.value))}
                  className="w-full h-3 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveCylinder}
                className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Cylinder Oxygen Level
              </button>

            </div>
          )}

        </div>

        {/* Action 2: Request Oxygen Cylinders / Refill */}
        <div className="prohealth-panel rounded-3xl p-6 border border-sky-200/80 bg-white shadow-xl shadow-sky-100/50 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                2. Request Oxygen Cylinders / Refill
              </h3>
              <span className="text-[10px] font-bold px-3 py-0.5 rounded-full tag-critical">
                Urgent Action
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium mt-4 leading-relaxed">
              If cylinder oxygen levels run low or your ward requires additional oxygen cylinders, tap below to send an immediate refill requisition to hospital administration and district supply team.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-900 font-extrabold">Current Reserve Status:</span>
                <span className="font-extrabold text-rose-700">{currentHospital.estimatedHours}h Remaining</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Hospital LMO tank & reserve levels are monitored in real time. Request additional cylinders early.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenReplenishmentModal}
            className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-sm shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95"
          >
            <ShieldAlert className="w-5 h-5" />
            Request Oxygen Cylinders / Refill
          </button>
        </div>

      </div>

    </div>
  );
};
