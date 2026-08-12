import React, { useState } from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  HOURLY_ANALYTICS,
  DAILY_ANALYTICS,
  WEEKLY_ANALYTICS,
  MONTHLY_ANALYTICS
} from '../data/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  Clock,
  TrendingUp
} from 'lucide-react';

export const ConsumptionAnalytics = () => {
  const { currentHospital } = useOxyTrack();
  const [timeRange, setTimeRange] = useState('HOURLY'); // HOURLY | DAILY | WEEKLY | MONTHLY

  // Dynamic Dataset & Metadata Selector
  const getAnalyticsConfig = () => {
    switch (timeRange) {
      case 'DAILY':
        return {
          title: 'Daily Department Oxygen Consumption (KL/day)',
          subtitle: 'Past 7-day cumulative bulk consumption trends (Mon - Sun)',
          unit: 'KL',
          data: DAILY_ANALYTICS,
          comparisonTitle: 'Daily Average vs Today\'s Usage (KL)',
          barData: [
            { ward: 'ICU Block B', current: 7.9, baseline: 7.0, spike: '+12.8%' },
            { ward: 'HDU Ward', current: 4.9, baseline: 4.4, spike: '+11.3%' },
            { ward: 'Casualty & EMG', current: 3.3, baseline: 3.0, spike: '+10.0%' },
            { ward: 'General Ward', current: 2.3, baseline: 2.1, spike: '+9.5%' },
            { ward: 'Pediatric Care', current: 1.5, baseline: 1.4, spike: '+7.1%' }
          ]
        };
      case 'WEEKLY':
        return {
          title: 'Weekly Ward Bulk Oxygen Volume (KL/week)',
          subtitle: 'Past 4-week department volume progression (Week 1 - Week 4)',
          unit: 'KL',
          data: WEEKLY_ANALYTICS,
          comparisonTitle: 'Weekly Total Volume vs Monthly Baseline (KL)',
          barData: [
            { ward: 'ICU Block B', current: 51.2, baseline: 46.5, spike: '+10.1%' },
            { ward: 'HDU Ward', current: 33.0, baseline: 30.5, spike: '+8.1%' },
            { ward: 'Casualty & EMG', current: 22.5, baseline: 20.2, spike: '+11.3%' },
            { ward: 'General Ward', current: 15.0, baseline: 14.1, spike: '+6.3%' },
            { ward: 'Pediatric Care', current: 9.8, baseline: 9.2, spike: '+6.5%' }
          ]
        };
      case 'MONTHLY':
        return {
          title: 'Monthly Statewide Department Volume (KL/month)',
          subtitle: 'Past 6-month seasonal clinical load trends (March - August)',
          unit: 'KL',
          data: MONTHLY_ANALYTICS,
          comparisonTitle: 'Monthly Bulk Volume vs Historical Standard (KL)',
          barData: [
            { ward: 'ICU Block B', current: 225, baseline: 195, spike: '+15.3%' },
            { ward: 'HDU Ward', current: 150, baseline: 132, spike: '+13.6%' },
            { ward: 'Casualty & EMG', current: 98, baseline: 86, spike: '+13.9%' },
            { ward: 'General Ward', current: 68, baseline: 60, spike: '+13.3%' },
            { ward: 'Pediatric Care', current: 42, baseline: 38, spike: '+10.5%' }
          ]
        };
      default: // HOURLY
        return {
          title: 'Hourly Ward Oxygen Flow Rate (L/hr)',
          subtitle: '24-hour real-time consumption trend curves today (00:00 - 21:00)',
          unit: 'L/hr',
          data: HOURLY_ANALYTICS,
          comparisonTitle: 'Current Hourly Rate vs 24h Baseline Average (L/hr)',
          barData: [
            { ward: 'ICU Block B', current: 320, baseline: 225, spike: '+42.2%' },
            { ward: 'HDU Ward', current: 180, baseline: 175, spike: '+2.8%' },
            { ward: 'Casualty & EMG', current: 140, baseline: 138, spike: '+1.4%' },
            { ward: 'General Ward', current: 90, baseline: 92, spike: '-2.1%' },
            { ward: 'Pediatric Care', current: 60, baseline: 58, spike: '+3.4%' }
          ]
        };
    }
  };

  const config = getAnalyticsConfig();

  return (
    <div className="space-y-6">

      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-md shadow-sky-100/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            📈 Oxygen Consumption Reports & Usage Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            View hourly, daily, weekly, and monthly oxygen consumption trends and usage reports.
          </p>
        </div>

        {/* Dynamic Timeframe Selector Pills */}
        <div className="flex items-center gap-1.5 bg-sky-50/70 p-1.5 rounded-full border border-sky-100 text-xs">
          {['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-full font-extrabold text-xs transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Spike Banner */}
      <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-4 text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-amber-900 block text-sm">
              ⚠️ High Consumption Surge Detected in ICU Block B ({timeRange})
            </span>
            <p className="text-amber-800 mt-0.5 font-medium">
              ICU oxygen usage registered a <strong className="text-rose-700 font-extrabold">+42.2% surge</strong> against baseline reference standards.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-white px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-600 font-bold shadow-2xs">
          Timeframe: {timeRange} View
        </span>
      </div>

      {/* Main Area Chart: Dynamic Dataset */}
      <div className="clinical-panel rounded-3xl p-6 border border-sky-100 bg-white shadow-md shadow-sky-100/50 space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-sky-100 gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{config.title}</h3>
            <p className="text-xs text-slate-500 font-medium">{config.subtitle}</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-sky-700"><span className="w-3 h-3 rounded-full bg-sky-500" /> ICU Block B</span>
            <span className="flex items-center gap-1.5 text-purple-700"><span className="w-3 h-3 rounded-full bg-purple-500" /> HDU</span>
            <span className="flex items-center gap-1.5 text-emerald-700"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Emergency</span>
            <span className="flex items-center gap-1.5 text-amber-700"><span className="w-3 h-3 rounded-full bg-amber-500" /> General</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={config.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorICU" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontWeight={600} />
              <YAxis stroke="#64748b" fontSize={11} fontWeight={600} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e0f2fe', borderRadius: '16px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.1)' }}
              />
              <Area type="monotone" dataKey="ICU" stroke="#0284c7" fillOpacity={1} fill="url(#colorICU)" strokeWidth={2.5} name={`ICU (${config.unit})`} />
              <Area type="monotone" dataKey="HDU" stroke="#a855f7" fillOpacity={0} strokeWidth={2} name={`HDU (${config.unit})`} />
              <Area type="monotone" dataKey="Emergency" stroke="#10b981" fillOpacity={0} strokeWidth={2} name={`Emergency (${config.unit})`} />
              <Area type="monotone" dataKey="General" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} name={`General (${config.unit})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Dynamic Ward Comparison */}
      <div className="clinical-panel rounded-3xl p-6 border border-sky-100 bg-white shadow-md shadow-sky-100/50 space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">{config.comparisonTitle}</h3>
          <p className="text-xs text-slate-500 font-medium">Department consumption comparison against historical baseline</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={config.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="ward" stroke="#64748b" fontSize={11} fontWeight={600} />
              <YAxis stroke="#64748b" fontSize={11} fontWeight={600} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e0f2fe', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.1)' }}
              />
              <Bar dataKey="baseline" fill="#94a3b8" name={`Baseline Average (${config.unit})`} radius={[6, 6, 0, 0]} />
              <Bar dataKey="current" fill="#0284c7" name={`Recorded Volume (${config.unit})`} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
