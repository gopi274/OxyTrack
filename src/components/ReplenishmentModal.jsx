import React, { useState } from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Droplets,
  Send,
  ShieldAlert,
  Sparkles,
  Truck,
  X
} from 'lucide-react';

export const ReplenishmentModal = ({ isOpen, onClose }) => {
  const { currentHospital, currentUser, submitReplenishmentRequest } = useOxyTrack();

  const [volume, setVolume] = useState(4500);
  const [priority, setPriority] = useState('EMERGENCY_RED');
  const [breakdown, setBreakdown] = useState('1 LMO Cryogenic Tanker (3,000 L) + 15 D-Type Cylinders');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = reason.trim() || 'High ICU patient load & reserve depletion expected within 8 hours.';
    
    submitReplenishmentRequest({
      volume: Number(volume),
      priority,
      breakdown,
      reason: finalReason
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReason('');
      onClose();
    }, 1800);
  };

  const handleReasonPreset = (presetText) => {
    setReason(presetText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="prohealth-panel w-full max-w-lg rounded-3xl p-6 border border-sky-200 bg-white shadow-2xl relative space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Hospital Oxygen Refill Requisition</h3>
              <p className="text-xs text-slate-500 font-medium">Submit official oxygen supply order to District Medical Officer (DMO)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sky-50 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h4 className="text-lg font-extrabold text-slate-900">Requisition Sent to District Authority!</h4>
            <p className="text-xs text-slate-600 font-medium">
              Order successfully submitted by <strong>{currentUser?.name}</strong>. Requisition routed to District Medical Officer (DMO) dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Auto-populated Hospital Card */}
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 text-sm">{currentHospital.name}</span>
                <span className="px-3 py-0.5 rounded-full tag-critical text-[10px] font-extrabold">
                  🔴 Low Oxygen Stock
                </span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium text-[11px]">
                <span>District: <strong className="text-slate-900">{currentHospital.district}</strong></span>
                <span>Current Reserve: <strong className="text-blue-700 font-extrabold">{currentHospital.availableOxygen.toLocaleString()} L</strong></span>
                <span>Depletion: <strong className="text-rose-700 font-extrabold">{currentHospital.estimatedHours} Hours</strong></span>
              </div>
            </div>

            {/* Required Volume */}
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">Required Oxygen Volume (Liters)</label>
              <div className="relative">
                <input
                  type="number"
                  value={volume}
                  onChange={e => setVolume(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-sm focus:border-blue-600 outline-none"
                  required
                />
                <span className="absolute right-3 top-3 text-[10px] text-slate-400 font-bold uppercase">Liters</span>
              </div>
            </div>

            {/* Supply Type & Breakdown Dropdown */}
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">Supply Type & Breakdown</label>
              <select
                value={breakdown}
                onChange={e => setBreakdown(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:border-blue-600 outline-none"
              >
                <option value="1 LMO Cryogenic Tanker (3,000 L) + 15 D-Type Cylinders">1 LMO Cryogenic Tanker (3,000 L) + 15 D-Type Cylinders</option>
                <option value="2 LMO Cryogenic Tankers (6,000 L)">2 LMO Cryogenic Tankers (6,000 L)</option>
                <option value="30 High-Pressure D-Type Cylinders (210,000 L)">30 High-Pressure D-Type Cylinders (210,000 L)</option>
                <option value="15 Portable B-Type Ambulatory Cylinders">15 Portable B-Type Ambulatory Cylinders</option>
              </select>
            </div>

            {/* Emergency Priority Level */}
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">Emergency Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:border-blue-600 outline-none"
              >
                <option value="EMERGENCY_RED">🔴 Emergency Red (Urgent - Under 8 hours depletion)</option>
                <option value="PRIORITY_YELLOW">🟡 Priority Yellow (Moderate - 8 to 16 hours depletion)</option>
                <option value="ROUTINE_GREEN">🟢 Routine Green (Standard stock replenishment)</option>
              </select>
            </div>

            {/* Justification / Reason (Added by the Role) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-700 font-extrabold">
                  Requisition Justification / Medical Reason
                </label>
                <span className="text-[10px] text-blue-600 font-bold">Entered by: {currentUser?.name}</span>
              </div>
              
              <textarea
                rows={2}
                placeholder="Type reason here (e.g. ICU patient surge, tank pressure drop)..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:border-blue-600 outline-none placeholder-slate-400"
              />

              {/* Quick Preset Buttons for Reason */}
              <div className="mt-1.5 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Quick Presets:</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => handleReasonPreset('High ICU patient load & reserve depletion expected within 8 hours.')}
                    className="px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-blue-700 border border-sky-200 text-[10px] font-bold transition-all"
                  >
                    ⚡ ICU High Patient Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReasonPreset('High-flow oxygen demand surge in ICU & Emergency wards.')}
                    className="px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-blue-700 border border-sky-200 text-[10px] font-bold transition-all"
                  >
                    ⚡ High-Flow Demand Surge
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReasonPreset('Routine oxygen stock replenishment for upcoming surgical schedule.')}
                    className="px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-blue-700 border border-sky-200 text-[10px] font-bold transition-all"
                  >
                    ⚡ Surgical Schedule Refill
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-sky-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-xs shadow-md shadow-rose-500/25 flex items-center gap-2 hover:scale-[1.01] transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Requisition to DMO
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
