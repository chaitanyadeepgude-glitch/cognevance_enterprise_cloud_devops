import React, { useState } from 'react';
import { Activity, Bell, CheckCircle2, Gauge, BarChart3, Radio } from 'lucide-react';

export const MonitoringView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'targets' | 'alerts'>('metrics');

  const targets = [
    { job: 'enterprise-devops-app', endpoint: 'http://application:5000/metrics', state: 'UP', scrapeInterval: '15s', lastScrape: '4s ago', duration: '2.4ms' },
    { job: 'prometheus', endpoint: 'http://localhost:9090/metrics', state: 'UP', scrapeInterval: '15s', lastScrape: '6s ago', duration: '1.8ms' },
    { job: 'kubernetes-pods', endpoint: 'http://10.244.1.12:5000/metrics', state: 'UP', scrapeInterval: '15s', lastScrape: '5s ago', duration: '3.1ms' },
  ];

  const alertRules = [
    { name: 'ServiceInstanceDown', expr: 'up{job="enterprise-devops-app"} == 0', duration: '1m', severity: 'critical', state: 'Inactive (Nominal)' },
    { name: 'HighRequestLatency', expr: 'histogram_quantile(0.95, sum(rate(...))) > 0.5', duration: '2m', severity: 'warning', state: 'Inactive (Nominal)' },
    { name: 'ElevatedHttp5xxErrors', expr: 'rate(http_requests_errors_total[5m]) > 0.05', duration: '1m', severity: 'critical', state: 'Inactive (Nominal)' },
    { name: 'KubernetesPodReplicaDeficit', expr: 'kubernetes_active_replicas < 3', duration: '2m', severity: 'warning', state: 'Inactive (Nominal)' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>Observability &amp; Telemetry</span>
          <span aria-hidden="true">·</span>
          <span>Prometheus v2.45</span>
          <span aria-hidden="true">·</span>
          <span>Grafana v10.2</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Prometheus Metrics &amp; Observability Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Automated metric collection, PromQL query analysis, and alert rule evaluations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'metrics', label: 'Telemetry Graphs & Gauges', icon: BarChart3 },
          { id: 'targets', label: 'Scrape Targets (3/3 UP)', icon: Radio },
          { id: 'alerts', label: 'Alertmanager Rules', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-950/80 text-sky-400 border border-sky-800/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Live Telemetry & Gauges */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs text-slate-400">Total Requests</div>
              <div className="text-2xl font-bold font-mono text-white">6,120</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>99.96% Success Rate</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs text-slate-400">P95 Request Latency</div>
              <div className="text-2xl font-bold font-mono text-white">12.8 <span className="text-xs text-slate-400 font-normal">ms</span></div>
              <div className="text-[11px] text-slate-500">P99: 24.1ms · P50: 4.2ms</div>
            </div>

            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs text-slate-400">Process Memory (RSS)</div>
              <div className="text-2xl font-bold font-mono text-white">142.6 <span className="text-xs text-slate-400 font-normal">MB</span></div>
              <div className="text-[11px] text-slate-500">Node Total: 4,096 MB</div>
            </div>

            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs text-slate-400">Scrape Frequency</div>
              <div className="text-2xl font-bold font-mono text-sky-400">15 <span className="text-xs text-slate-400 font-normal">sec</span></div>
              <div className="text-[11px] text-slate-500">Endpoint: /metrics</div>
            </div>
          </div>

          {/* Visual Latency Quantile Breakdown */}
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
            <h2 className="text-base font-semibold text-white">Latency Quantile Profile (PromQL Histogram)</h2>
            <div className="space-y-3">
              {[
                { label: 'P50 (Median)', value: '4.2 ms', pct: 15, color: 'bg-emerald-500' },
                { label: 'P90 (Fast 90%)', value: '8.9 ms', pct: 35, color: 'bg-sky-500' },
                { label: 'P95 (SLA Threshold)', value: '12.8 ms', pct: 50, color: 'bg-indigo-500' },
                { label: 'P99 (Tail Latency)', value: '24.1 ms', pct: 75, color: 'bg-amber-500' },
              ].map((q) => (
                <div key={q.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{q.label}</span>
                    <span className="text-white font-bold">{q.value}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full ${q.color} rounded-full`} style={{ width: `${q.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grafana Information Card */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">Grafana Enterprise Dashboards Pre-Provisioned</h3>
              <p className="text-xs text-slate-400">
                Run <code className="text-sky-300">docker compose up -d</code> to spin up the local Grafana container on port 3001 with auto-loaded Prometheus dashboards.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 shrink-0">
              User: admin · Pass: admin
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scrape Targets */}
      {activeTab === 'targets' && (
        <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
          <h2 className="text-base font-semibold text-white">Prometheus Scrape Targets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-2.5 px-3">Job Name</th>
                  <th className="py-2.5 px-3">Target Endpoint</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Scrape Interval</th>
                  <th className="py-2.5 px-3">Last Scrape</th>
                  <th className="py-2.5 px-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {targets.map((t) => (
                  <tr key={t.endpoint} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-medium text-slate-200">{t.job}</td>
                    <td className="py-3 px-3 text-sky-400">{t.endpoint}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[11px]">
                        {t.state}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{t.scrapeInterval}</td>
                    <td className="py-3 px-3 text-slate-400">{t.lastScrape}</td>
                    <td className="py-3 px-3 text-slate-300">{t.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Alerts */}
      {activeTab === 'alerts' && (
        <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
          <h2 className="text-base font-semibold text-white">Prometheus Alert Rules Status</h2>
          <div className="space-y-3">
            {alertRules.map((alert) => (
              <div key={alert.name} className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{alert.name}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase ${
                      alert.severity === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="font-mono text-slate-400 text-[11px]">{alert.expr}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-500 font-mono text-[11px]">For: {alert.duration}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono text-[11px]">
                    {alert.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
