import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import type { SystemHealth as SystemHealthType } from '../../../../../packages/shared/types';
import { 
  IoHardwareChipOutline, 
  IoServerOutline, 
  IoPulseOutline, 
  IoSparklesOutline, 
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';

export const SystemHealth: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [health, setHealth] = useState<SystemHealthType | null>(null);

  useEffect(() => {
    async function loadHealth() {
      try {
        setLoading(true);
        const data = await API.systemHealth.get();
        setHealth(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHealth();
  }, []);

  if (loading || !health) {
    return (
      <div className="p-8 text-center text-slate-400 font-bold text-xs animate-pulse">
        Polling StackPilot Business OS Telemetry...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <IoHardwareChipOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">System Infrastructure Health</h1>
            <p className="text-xs text-slate-500 font-medium">Real-time status of APIs, Database, Storage, Email Queues & AI Tokens.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-black">
          <IoCheckmarkCircleOutline size={16} />
          <span>All Services Operational</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Server API Latency</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">{health.apiLatencyMs} ms</h3>
            <span className="text-xs font-bold text-emerald-600">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Production Node Server: {health.serverStatus}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Database Cluster Status</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">{health.dbStatus}</h3>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">MongoDB Primary Replica Set</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Storage Consumption</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">{health.storageUsedGb} GB</h3>
            <span className="text-xs font-bold text-slate-500">/ {health.storageMaxGb} GB</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(health.storageUsedGb / health.storageMaxGb) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Active User Sessions</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">{health.activeSessions}</h3>
            <span className="text-xs font-bold text-emerald-600">Online</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">SSO Authenticated sessions</p>
        </div>
      </div>

      {/* AI Token & License Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <IoSparklesOutline size={20} />
            <h3 className="text-sm font-black uppercase tracking-wider">AI Engine Token Telemetry</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Tokens Generated Today:</span>
              <span className="font-mono font-bold text-emerald-400">{health.aiTokenCountToday.toLocaleString()} tokens</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Daily Quota Limit:</span>
              <span className="font-mono font-bold text-slate-200">500,000 tokens</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900">
            <IoServerOutline size={20} className="text-emerald-600" />
            <h3 className="text-sm font-black uppercase tracking-wider">Enterprise License Info</h3>
          </div>
          <div className="space-y-2 text-xs font-medium">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Plan Tier:</span>
              <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">Enterprise Commercial</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Days Remaining:</span>
              <span className="font-extrabold text-slate-900">{health.licenseDaysRemaining} Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
