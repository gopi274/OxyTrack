import React from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  ChevronRight,
  Landmark,
  MapPin
} from 'lucide-react';

export const StateCommandCenter = ({ onSelectTab }) => {
  const { setSelectedHospitalId } = useOxyTrack();

  // Exactly 30 Demo Hospitals distributed across ALL 14 Districts of Kerala
  const totalHospitals = 30;
  const hospitalsNormal = 21;
  const hospitalsWarning = 6;
  const hospitalsCritical = 3;
  const totalOxygenAvailable = 169300;
  const totalConsumptionRate = 11450;

  const districtSummary = [
    { district: 'Thiruvananthapuram', total: 4, normal: 2, warning: 1, critical: 1, stock: 22500 },
    { district: 'Ernakulam', total: 4, normal: 2, warning: 1, critical: 1, stock: 24100 },
    { district: 'Kozhikode', total: 3, normal: 2, warning: 0, critical: 1, stock: 18200 },
    { district: 'Thrissur', total: 3, normal: 2, warning: 1, critical: 0, stock: 16400 },
    { district: 'Kottayam', total: 2, normal: 1, warning: 1, critical: 0, stock: 11900 },
    { district: 'Palakkad', total: 2, normal: 2, warning: 0, critical: 0, stock: 12800 },
    { district: 'Malappuram', total: 2, normal: 2, warning: 0, critical: 0, stock: 13500 },
    { district: 'Kollam', total: 2, normal: 1, warning: 1, critical: 0, stock: 9800 },
    { district: 'Alappuzha', total: 2, normal: 2, warning: 0, critical: 0, stock: 10200 },
    { district: 'Kannur', total: 2, normal: 2, warning: 0, critical: 0, stock: 11400 },
    { district: 'Pathanamthitta', total: 1, normal: 1, warning: 0, critical: 0, stock: 5600 },
    { district: 'Idukki', total: 1, normal: 1, warning: 0, critical: 0, stock: 4800 },
    { district: 'Wayanad', total: 1, normal: 1, warning: 0, critical: 0, stock: 4200 },
    { district: 'Kasaragod', total: 1, normal: 0, warning: 1, critical: 0, stock: 3900 }
  ];

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-sky-200/80 shadow-md shadow-sky-100/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 shadow-2xs">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">State Oxygen Command Dashboard</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Overview of oxygen availability, hospital risk levels, and consumption across all 14 districts in Kerala.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-sky-50/70 px-4 py-2 rounded-full border border-sky-200 text-slate-700 font-bold">
          <span className="text-purple-700 font-extrabold">State: Kerala</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-extrabold">14 Districts</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-700 font-black">30 Demo Hospitals</span>
        </div>
      </div>

      {/* State Metric Cards (30 Hospitals Total) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40 prohealth-card-hover">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Demo Government Hospitals</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{totalHospitals}</span>
            <span className="text-xs font-extrabold text-purple-700">Hospitals</span>
          </div>
          <div className="mt-4 pt-3 border-t border-sky-100 flex justify-between text-[11px] font-extrabold">
            <span className="text-emerald-700">{hospitalsNormal} Normal</span>
            <span className="text-amber-700">{hospitalsWarning} Warning</span>
            <span className="text-rose-700">{hospitalsCritical} Critical</span>
          </div>
        </div>

        <div className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40 prohealth-card-hover">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Statewide Oxygen Reserve</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-blue-600">{totalOxygenAvailable.toLocaleString()}</span>
            <span className="text-xs font-extrabold text-blue-600">Liters</span>
          </div>
          <div className="mt-4 pt-3 border-t border-sky-100 flex justify-between text-[11px] text-slate-500 font-medium">
            <span>State Quota Met:</span>
            <span className="font-extrabold text-slate-800">94.2%</span>
          </div>
        </div>

        <div className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40 prohealth-card-hover">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">State Consumption Rate</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-purple-600">{totalConsumptionRate.toLocaleString()}</span>
            <span className="text-xs font-extrabold text-purple-600">L/hr</span>
          </div>
          <div className="mt-4 pt-3 border-t border-sky-100 flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Est. Autonomy:</span>
            <span className="font-extrabold text-emerald-700">14.8 Hours</span>
          </div>
        </div>

        <div className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40 prohealth-card-hover">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Action Priority Districts</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-rose-600">3</span>
            <span className="text-xs font-extrabold text-rose-600">Districts</span>
          </div>
          <div className="mt-4 pt-3 border-t border-sky-100 flex justify-between text-[11px] text-slate-500 font-medium">
            <span>High Risk Priority:</span>
            <span className="font-extrabold text-rose-700">Thiruvananthapuram</span>
          </div>
        </div>

      </div>

      {/* District Table - All 14 Districts of Kerala */}
      <div className="prohealth-panel rounded-3xl p-6 border border-sky-200/80 bg-white shadow-md shadow-sky-100/50 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">District Oxygen Availability Summary</h3>
            <p className="text-xs text-slate-500 font-medium">Overview of oxygen stock and hospital risk levels across all 14 districts in Kerala (30 demo hospitals total)</p>
          </div>
          <button
            onClick={() => onSelectTab('map')}
            className="px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-extrabold transition-colors shadow-2xs"
          >
            Open Statewide Map
          </button>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto pr-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-sky-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-sky-50/90 backdrop-blur-md">
                <th className="py-3.5 px-4 rounded-l-2xl">District</th>
                <th className="py-3.5 px-4">Hospitals</th>
                <th className="py-3.5 px-4">🟢 Normal</th>
                <th className="py-3.5 px-4">🟡 Warning</th>
                <th className="py-3.5 px-4">🔴 Critical</th>
                <th className="py-3.5 px-4">Available Oxygen</th>
                <th className="py-3.5 px-4 text-right rounded-r-2xl">District Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50 text-xs font-medium">
              {districtSummary.map(d => (
                <tr key={d.district} className="hover:bg-sky-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    {d.district}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-800">{d.total}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">{d.normal}</td>
                  <td className="py-3.5 px-4 font-extrabold text-amber-700">{d.warning}</td>
                  <td className="py-3.5 px-4 font-extrabold text-rose-700">{d.critical}</td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-blue-700 text-sm">{d.stock.toLocaleString()} L</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectTab('map')}
                      className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50 text-slate-700 font-extrabold text-[11px] border border-sky-200 transition-colors shadow-2xs"
                    >
                      View District Map →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
