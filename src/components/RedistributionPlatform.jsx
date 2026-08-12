import React from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  CornerDownRight,
  GitCompare,
  Landmark,
  ShieldCheck,
  Send,
  Truck,
  User
} from 'lucide-react';

export const RedistributionPlatform = () => {
  const { currentRole, redistributions, approveRedistribution, allHospitals } = useOxyTrack();

  const isStateLevelUser = currentRole === 'STATE_HEALTH' || currentRole === 'SYSTEM_ADMIN';
  const isDmoUser = currentRole === 'DISTRICT_OFFICER';

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-md shadow-sky-100/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 shadow-2xs">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Inter-Hospital Oxygen Sharing & Transfer Hub</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Transfers excess oxygen supply from surplus hospitals to nearby hospitals facing a shortage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-sky-50 text-sky-800 px-3.5 py-1.5 rounded-full border border-sky-200 flex items-center gap-1.5 font-bold shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            Intra-District: DMO Approval Only
          </span>
          <span className="text-xs font-mono bg-purple-50 text-purple-800 px-3.5 py-1.5 rounded-full border border-purple-200 flex items-center gap-1.5 font-bold shadow-2xs">
            <Landmark className="w-3.5 h-3.5 text-purple-600" />
            Inter-District: State Govt Approval Only
          </span>
        </div>
      </div>

      {/* Governance Explainer Callout */}
      <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-purple-950 flex items-start gap-3 shadow-2xs">
        <Landmark className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block text-purple-900">Transfer Governance Jurisdiction Rules:</span>
          <p className="mt-0.5 text-slate-700 font-medium leading-relaxed">
            • <strong>Intra-District Transfers</strong> (within the same district) are authorized exclusively by the <strong>District Medical Officer (DMO)</strong>.<br/>
            • <strong>Inter-District Transfers</strong> (cross-district boundaries, e.g. Ernakulam ➔ Thiruvananthapuram) are requested by the DMO and authorized exclusively by the <strong>State Health Department (State Govt)</strong>.
          </p>
        </div>
      </div>

      {/* Sharing Proposals */}
      <div className="space-y-4">
        {redistributions.map(prop => {
          const isApproved = prop.status === 'APPROVED_IN_TRANSIT';

          // Resolve districts
          const fromHosp = (allHospitals || []).find(h => h.id === prop.fromHospitalId) || {};
          const toHosp = (allHospitals || []).find(h => h.id === prop.toHospitalId) || {};

          const fromDist = prop.fromDistrict || fromHosp.district || (prop.fromHospitalName.includes('Ernakulam') ? 'Ernakulam' : 'Thiruvananthapuram');
          const toDist = prop.toDistrict || toHosp.district || (prop.toHospitalName.includes('Trivandrum') ? 'Thiruvananthapuram' : 'Thiruvananthapuram');

          const isInterDistrict = fromDist !== toDist || prop.transferScope === 'INTER_DISTRICT';

          // Strict Jurisdiction Approval permissions logic:
          // Intra-District ➔ ONLY DMO can approve.
          // Inter-District ➔ ONLY State Health Dept can approve.
          const canApprove = isApproved
            ? false
            : isInterDistrict
            ? isStateLevelUser // Only State Health Dept / System Admin can approve Inter-District
            : isDmoUser; // Only DMO can approve Intra-District

          return (
            <div
              key={prop.id}
              className={`clinical-panel rounded-3xl p-6 border shadow-md shadow-sky-100/40 transition-all ${
                isApproved
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : isInterDistrict
                  ? 'border-purple-200 bg-purple-50/20'
                  : 'border-sky-100 bg-white'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-sky-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      Oxygen Transfer Proposal #{prop.id}
                    </h3>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-black border ${
                      isInterDistrict ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-blue-100 text-blue-900 border-blue-300'
                    }`}>
                      {isInterDistrict ? '🏛️ Inter-District Transfer (State Auth Required)' : '📍 Intra-District Transfer (DMO Auth Only)'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-600 font-mono font-extrabold block mt-1">
                    Route: <strong className="text-purple-900">{fromDist}</strong> ➔ <strong className="text-blue-900">{toDist}</strong>
                  </span>
                </div>

                <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold ${
                  isApproved
                    ? 'tag-normal'
                    : isInterDistrict
                    ? 'bg-purple-100 text-purple-900 border border-purple-200 font-black'
                    : 'tag-warning'
                }`}>
                  {isApproved
                    ? '✅ TRANSFER APPROVED & IN TRANSIT'
                    : isInterDistrict
                    ? '🏛️ PENDING STATE GOVT APPROVAL'
                    : '⚡ PENDING DMO DISPATCH'}
                </span>
              </div>

              {/* Surplus vs Deficit Card */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                
                {/* Donor */}
                <div className="md:col-span-3 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Surplus Hospital (Donor - {fromDist})
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">{prop.fromHoursRemaining}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{prop.fromHospitalName}</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Has surplus stock. Reallocating {prop.suggestedTransferVolume.toLocaleString()} L will not affect local patient care.
                  </p>
                </div>

                {/* Arrow */}
                <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
                  <div className="p-3.5 rounded-full bg-sky-50 border border-sky-200 text-sky-600 shadow-md shadow-sky-500/10">
                    <ArrowRight className="w-5 h-5 hidden md:block text-blue-600" />
                    <CornerDownRight className="w-5 h-5 md:hidden text-blue-600" />
                  </div>
                  <span className="text-[11px] font-extrabold text-sky-700 mt-2 font-mono">
                    Transfer {prop.suggestedTransferVolume.toLocaleString()} L
                  </span>
                </div>

                {/* Recipient */}
                <div className="md:col-span-3 p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-rose-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Deficit Hospital (Recipient - {toDist})
                    </span>
                    <span className="text-xs font-extrabold text-rose-700">{prop.toHoursRemaining}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{prop.toHospitalName}</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Low oxygen reserve. Receiving {prop.suggestedTransferVolume.toLocaleString()} L extends oxygen availability by <strong className="text-emerald-700 font-extrabold">+6.0 hours</strong>.
                  </p>
                </div>

              </div>

              {/* Logistics Footer */}
              <div className="mt-6 pt-4 border-t border-sky-100 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-slate-700 font-medium">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Truck className="w-4 h-4 text-sky-600" />
                      Vehicle: <strong className="text-slate-900">{prop.recommendedTransport}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Est. Transit: <strong className="text-slate-900">{prop.estimatedTransitTime}</strong>
                    </span>
                  </div>
                  {prop.driverInfo && (
                    <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 font-semibold">
                      <User className="w-3.5 h-3.5 text-emerald-600" /> {prop.driverInfo}
                    </p>
                  )}
                </div>

                {/* Approval Buttons with Strict Jurisdiction Scoping */}
                {isApproved ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-4 py-2 rounded-full border border-emerald-300 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Transfer Authorized • Tanker En Route
                  </div>
                ) : canApprove ? (
                  <button
                    onClick={() => approveRedistribution(prop.id)}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isInterDistrict ? '🏛️ Approve Inter-District Transfer (State Auth)' : '✅ Approve & Dispatch Tanker (DMO Authorized)'}
                  </button>
                ) : isInterDistrict && isDmoUser ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] text-purple-900 font-black bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-300">
                      🏛️ Inter-District Transfer: Requires State Health Dept Authorization
                    </span>
                    <button
                      onClick={() => approveRedistribution(prop.id)}
                      className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Inter-District Request to State Govt
                    </button>
                  </div>
                ) : !isInterDistrict && isStateLevelUser ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                    📍 Intra-District Transfer (Managed & Authorized by DMO {fromDist})
                  </div>
                ) : (
                  <button
                    onClick={() => approveRedistribution(prop.id)}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Approve Transfer
                  </button>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
