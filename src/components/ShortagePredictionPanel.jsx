import React, { useState } from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import { calculateAIPrediction } from '../utils/aiPredictionEngine';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Clock,
  Droplets,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Truck,
  Zap
} from 'lucide-react';

export const ShortagePredictionPanel = ({ onOpenReplenishmentModal }) => {
  const { currentHospital, triggerSimulatedSpike } = useOxyTrack();
  const [demandTimeframe, setDemandTimeframe] = useState('12h'); // 6h | 12h | 24h

  // Run AI Oxygen Demand Prediction Engine
  const aiData = calculateAIPrediction(currentHospital);

  const getDemandValue = () => {
    switch (demandTimeframe) {
      case '6h':
        return { val: aiData.predictedRequirement6h, label: 'Next 6 Hours Demand' };
      case '24h':
        return { val: aiData.predictedRequirement24h, label: 'Next 24 Hours Demand' };
      default:
        return { val: aiData.predictedRequirement12h, label: 'Next 12 Hours Demand' };
    }
  };

  const currentDemandObj = getDemandValue();

  return (
    <div className="space-y-6">

      {/* Header Banner with AI Badge */}
      <div className="bg-white p-6 rounded-3xl border border-sky-200/80 shadow-md shadow-sky-100/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 shadow-2xs">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                AI Oxygen Demand Prediction & Early Warning System
              </h2>
              <span className="text-[10px] px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-extrabold border border-purple-200">
                Neural Demand Model
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Calculates future oxygen demand using telemetry flow, ICU load, peak time multipliers, and supplier delivery lead time.
            </p>
          </div>
        </div>

        <button
          onClick={triggerSimulatedSpike}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold transition-all hover:scale-[1.02] shadow-2xs"
        >
          <Zap className="w-4 h-4 text-rose-600" />
          Simulate ICU Surge (+42%)
        </button>
      </div>

      {/* CLEAR & HIGHLY VISIBLE AUTOMATIC HOSPITAL-WIDE OXYGEN SHORTAGE WARNING BANNER */}
      {aiData.insufficientBeforeRefill && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-xl shadow-rose-500/30 border border-rose-400 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5 max-w-2xl">
            <div className="p-3 rounded-2xl bg-white/20 text-white shrink-0 mt-0.5">
              <AlertOctagon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-rose-100">
                  🚨 AUTOMATIC HOSPITAL-WIDE OXYGEN SHORTAGE WARNING
                </span>
                <span className="text-[10px] bg-white text-rose-700 px-2.5 py-0.5 rounded-full font-black">
                  HIGH PRIORITY
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1 leading-tight">
                Oxygen Supply Will Be Insufficient Before Next Refill Delivery Arrives!
              </h3>
              <p className="text-xs opacity-95 mt-1 font-medium leading-relaxed">
                Current oxygen reserve ({aiData.currentStock.toLocaleString()} L) will deplete in ~{aiData.hoursToDepletion} hours. Tanker delivery lead time is <strong>{aiData.supplierLeadTime} hours</strong>. 
                Oxygen will become insufficient at point <strong>{aiData.insufficientHourPoint}</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
            <span className="text-xs text-rose-100 font-extrabold">
              Recommended Action: <strong className="text-white underline">{aiData.recommendedOrderTime}</strong>
            </span>
            <button
              onClick={onOpenReplenishmentModal}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-rose-50 text-rose-700 font-black text-xs shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Order Emergency Refill Now
            </button>
          </div>
        </div>
      )}

      {/* 6 KEY REQUIRED AI METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Metric 1: Current Oxygen Stock */}
        <div className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Current Oxygen Stock</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900">{aiData.currentStock.toLocaleString()}</span>
              <span className="text-xs font-extrabold text-blue-600">Liters</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">LMO Main Storage Tank Level</span>
          </div>
        </div>

        {/* Metric 2: Current Consumption Rate */}
        <div className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Current Flow Rate</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-purple-700">{aiData.currentRate}</span>
              <span className="text-xs font-extrabold text-purple-600">L/hr</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">Real-time Telemetry Sensor Rate</span>
          </div>
        </div>

        {/* Metric 3: Predicted Consumption Rate */}
        <div className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">AI Predicted Rate</span>
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-purple-900">{aiData.predictedConsumptionRate}</span>
              <span className="text-xs font-extrabold text-purple-700">L/hr</span>
            </div>
            <span className="text-[11px] text-purple-700 font-bold block mt-1">Adjusted for Peak Time & ICU Load</span>
          </div>
        </div>

        {/* Metric 4: Estimated Time Until Shortage */}
        <div className={`prohealth-panel rounded-3xl p-5 border shadow-md ${
          aiData.aiRiskLevel === 'CRITICAL' ? 'border-rose-200 bg-rose-50/40 shadow-rose-100/50' : 'border-sky-200/80 bg-white shadow-sky-100/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Time Until Shortage</span>
            <div className={`p-2.5 rounded-2xl border ${
              aiData.aiRiskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-3xl font-extrabold ${aiData.aiRiskLevel === 'CRITICAL' ? 'text-rose-600' : 'text-emerald-600'}`}>
              ~{aiData.hoursToDepletion} Hours
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">Supplier Lead Time: {aiData.supplierLeadTime}h</span>
          </div>
        </div>

        {/* Metric 5: Predicted Requirement (6h / 12h / 24h) */}
        <div className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Predicted Oxygen Requirement</span>
            <div className="flex items-center gap-1 bg-sky-50 p-1 rounded-full border border-sky-200">
              {['6h', '12h', '24h'].map(t => (
                <button
                  key={t}
                  onClick={() => setDemandTimeframe(t)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all ${
                    demandTimeframe === t ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-blue-900">{currentDemandObj.val.toLocaleString()}</span>
              <span className="text-xs font-extrabold text-blue-600">Liters</span>
            </div>
            <span className="text-[11px] text-slate-500 font-bold block mt-1">{currentDemandObj.label}</span>
          </div>
        </div>

        {/* Metric 6: AI Risk Level Badge */}
        <div className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40 flex flex-col justify-between">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">AI Risk Level</span>
          <div className="my-2">
            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black shadow-xs ${
              aiData.aiRiskLevel === 'CRITICAL' ? 'tag-critical text-rose-700' :
              aiData.aiRiskLevel === 'WARNING' ? 'tag-warning text-amber-800' : 'tag-normal text-emerald-800'
            }`}>
              {aiData.aiRiskLevel === 'CRITICAL' && '🔴 CRITICAL RISK'}
              {aiData.aiRiskLevel === 'WARNING' && '🟡 WARNING RISK'}
              {aiData.aiRiskLevel === 'NORMAL' && '🟢 NORMAL RISK'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Order Refill: <strong className="text-slate-900 font-extrabold">{aiData.recommendedOrderTime}</strong>
          </span>
        </div>

      </div>

      {/* SIMPLE AI PREDICTION GRAPH (CURRENT CONSUMPTION VS PREDICTED FUTURE CONSUMPTION) */}
      <div className="prohealth-panel rounded-3xl p-6 border border-sky-200/80 bg-white shadow-xl shadow-sky-100/50 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sky-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              AI 24-Hour Oxygen Reserve & Demand Forecast Graph
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Shows remaining oxygen stock vs safety buffer threshold. Red marker highlights the exact point where oxygen becomes insufficient.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-extrabold">
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-3 h-3 rounded-full bg-blue-600" /> Predicted Oxygen Stock (L)
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-3 h-3 rounded-full bg-rose-500" /> Safety Delivery Buffer ({aiData.supplierLeadTime}h Lead Time)
            </span>
          </div>
        </div>

        {/* Graph Canvas */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={aiData.timeline} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPredictedStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontWeight={600} />
              <YAxis stroke="#64748b" fontSize={11} fontWeight={600} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#bfdbfe', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.15)' }}
              />
              {/* Highlight Insufficient Point Reference Line */}
              <ReferenceLine x={aiData.insufficientHourPoint} stroke="#dc2626" strokeDasharray="4 4" label={{ value: `⚠️ Insufficient Point (${aiData.insufficientHourPoint})`, fill: '#dc2626', fontSize: 11, fontWeight: 800, position: 'top' }} />

              <Area type="monotone" dataKey="predictedStock" stroke="#2563eb" fillOpacity={1} fill="url(#colorPredictedStock)" strokeWidth={3} name="Predicted Stock (L)" />
              <Area type="monotone" dataKey="safetyThresholdLimit" stroke="#dc2626" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" name="Safety Lead Time Buffer (L)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Point of Oxygen Insufficiency: <strong className="text-rose-700 font-extrabold">{aiData.insufficientHourPoint}</strong></span>
          </div>
          <span className="text-slate-500 font-medium">
            Supplier Delivery Lead Time: <strong className="text-slate-900 font-extrabold">{aiData.supplierLeadTime} Hours</strong> (Inox Air Products)
          </span>
        </div>
      </div>

    </div>
  );
};
