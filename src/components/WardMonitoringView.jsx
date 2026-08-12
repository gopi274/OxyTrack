import React, { useState } from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  Building2,
  ChevronRight,
  Sliders,
  UserCheck
} from 'lucide-react';

export const WardMonitoringView = () => {
  const { currentHospital, wards, updateWardFlow } = useOxyTrack();
  const [editingWardId, setEditingWardId] = useState(null);
  const [tempFlow, setTempFlow] = useState(0);

  const handleStartEdit = (ward) => {
    setEditingWardId(ward.id);
    setTempFlow(ward.consumptionRate);
  };

  const handleSaveEdit = (wardId) => {
    updateWardFlow(wardId, Number(tempFlow));
    setEditingWardId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-md shadow-sky-100/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">🏥 Ward-Level Oxygen Usage & Valve Controls</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-mono font-bold">
              Hospital → Building → Floor → Ward
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor real-time oxygen usage across wards and adjust pipeline valve flow settings.
          </p>
        </div>

        {/* Hierarchy Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-700 bg-sky-50/70 px-4 py-2 rounded-full border border-sky-100 font-bold">
          <span className="text-sky-700 font-extrabold">{currentHospital.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Main & Specialty Blocks</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800">5 Wards Connected</span>
        </div>
      </div>

      {/* Ward Telemetry Table */}
      <div className="clinical-panel rounded-3xl p-6 border border-sky-100 bg-white shadow-md shadow-sky-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-sky-50/40">
                <th className="py-3.5 px-4 rounded-l-2xl">Hospital Ward</th>
                <th className="py-3.5 px-4">Location & On-Duty Staff</th>
                <th className="py-3.5 px-4">Patients & Vents</th>
                <th className="py-3.5 px-4">Pipeline Pressure</th>
                <th className="py-3.5 px-4">Current Usage Rate</th>
                <th className="py-3.5 px-4">24h Variance</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right rounded-r-2xl">Valve Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50 text-xs">
              {wards.map(w => {
                const variance = Math.round(((w.consumptionRate - w.previous24hAvg) / w.previous24hAvg) * 100);
                const isSpike = variance > 20;

                return (
                  <tr key={w.id} className="hover:bg-sky-50/40 transition-colors">
                    {/* Ward Name */}
                    <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className={`p-2 rounded-2xl ${
                        w.status === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                        w.status === 'WARNING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-sm font-extrabold text-slate-900">{w.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-semibold">ID: {w.id}</span>
                      </div>
                    </td>

                    {/* Location & Duty Staff */}
                    <td className="py-4 px-4 text-slate-800">
                      <span className="block font-bold">{w.building} ({w.floor})</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                        <UserCheck className="w-3 h-3 text-sky-600" /> {w.headNurse}
                      </span>
                    </td>

                    {/* Patients & Ventilators */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-extrabold text-slate-900 text-sm">{w.patientsCount}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-extrabold">Patients</span>
                        </div>
                        {w.ventilatorsInUse > 0 && (
                          <div className="pl-3 border-l border-sky-100">
                            <span className="block font-extrabold text-rose-600 text-sm">{w.ventilatorsInUse}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-extrabold">Vents</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Pipeline Pressure */}
                    <td className="py-4 px-4">
                      <span className={`font-mono font-extrabold text-sm ${w.pipelinePressure < 4.2 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {w.pipelinePressure} bar
                      </span>
                      <span className="block text-[9px] text-slate-400 font-medium">Normal: 4.2-4.5</span>
                    </td>

                    {/* Flow Rate */}
                    <td className="py-4 px-4">
                      {editingWardId === w.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tempFlow}
                            onChange={e => setTempFlow(e.target.value)}
                            className="w-20 px-2.5 py-1 bg-white border border-sky-400 text-slate-900 rounded-xl font-mono text-xs shadow-2xs"
                          />
                          <button
                            onClick={() => handleSaveEdit(w.id)}
                            className="px-2.5 py-1 bg-sky-600 text-white rounded-xl text-[10px] font-bold shadow-2xs"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-extrabold text-sky-600">{w.consumptionRate}</span>
                          <span className="text-[10px] text-slate-400 font-bold">L/hr</span>
                        </div>
                      )}
                    </td>

                    {/* 24h Variance */}
                    <td className="py-4 px-4">
                      <span className={`font-extrabold text-xs ${
                        variance > 0 ? 'text-rose-600' : 'text-emerald-700'
                      }`}>
                        {variance > 0 ? `+${variance}%` : `${variance}%`}
                      </span>
                      {isSpike && (
                        <span className="block text-[9px] text-rose-600 font-extrabold uppercase">
                          ⚠️ Surge Alert
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold ${
                        w.status === 'CRITICAL' ? 'tag-critical' :
                        w.status === 'WARNING' ? 'tag-warning' :
                        'tag-normal'
                      }`}>
                        {w.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleStartEdit(w)}
                        className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50 text-slate-700 font-extrabold text-[11px] border border-sky-200 transition-colors flex items-center gap-1.5 ml-auto shadow-2xs"
                      >
                        <Sliders className="w-3.5 h-3.5 text-sky-600" />
                        Adjust Valve
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
