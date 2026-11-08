/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MainDashboard } from './components/MainDashboard';
import { InfrastructureView } from './components/InfrastructureView';
import { KubernetesView } from './components/KubernetesView';
import { MonitoringView } from './components/MonitoringView';
import { CicdView } from './components/CicdView';
import { DocumentationView } from './components/DocumentationView';
import { ProjectFilesView } from './components/ProjectFilesView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <MainDashboard onNavigate={setActiveTab} />}
        {activeTab === 'infrastructure' && <InfrastructureView />}
        {activeTab === 'kubernetes' && <KubernetesView />}
        {activeTab === 'monitoring' && <MonitoringView />}
        {activeTab === 'cicd' && <CicdView />}
        {activeTab === 'docs' && <DocumentationView />}
        {activeTab === 'files' && <ProjectFilesView />}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A11] py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 Cognevance Technologies · Level 3 Advanced Cloud &amp; DevOps Internship Project
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>AWS</span>
            <span aria-hidden="true">·</span>
            <span>Terraform</span>
            <span aria-hidden="true">·</span>
            <span>Docker</span>
            <span aria-hidden="true">·</span>
            <span>Kubernetes</span>
            <span aria-hidden="true">·</span>
            <span>Prometheus</span>
            <span aria-hidden="true">·</span>
            <span>Grafana</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
