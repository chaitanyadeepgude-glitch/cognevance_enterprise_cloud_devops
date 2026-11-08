import React, { useState } from 'react';
import { FolderTree, Download, FileCode, Copy, Check, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { PROJECT_FILES, ProjectFile } from '../data/projectFiles';
import { downloadProjectZip } from '../utils/zipExporter';

export const ProjectFilesView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'application', label: 'Application' },
    { id: 'terraform', label: 'Terraform' },
    { id: 'kubernetes', label: 'Kubernetes' },
    { id: 'monitoring', label: 'Monitoring' },
    { id: 'cicd', label: 'CI/CD' },
    { id: 'scripts', label: 'Scripts' },
    { id: 'root', label: 'Root Config' },
  ];

  const filteredFiles = categoryFilter === 'all'
    ? PROJECT_FILES
    : PROJECT_FILES.filter(f => f.category === categoryFilter);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadProgress(10);
      await downloadProjectZip((progress) => setDownloadProgress(Math.round(progress)));
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("ZIP creation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const copyContent = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header and 1-Click ZIP Banner */}
      <div className="p-6 bg-gradient-to-r from-sky-950/60 via-slate-900/80 to-slate-900 border border-sky-800/60 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium mb-1">
              <span>GitHub-Ready Repository Artifact</span>
              <span aria-hidden="true">·</span>
              <span>Complete Level 3 File Tree</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Project Repository &amp; 1-Click ZIP Export
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Inspect all source files, manifests, and IaC blueprints in the browser, or download the entire Git-ready project archive ready to push to your GitHub account or execute locally in Minikube/Kind.
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2.5 px-5 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-all shadow-md shadow-sky-950/60 cursor-pointer disabled:opacity-50 shrink-0 w-fit"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Bundling ZIP ({downloadProgress}%)...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Archive Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Complete Project (.ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isSelected = categoryFilter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-sky-950/80 border-sky-600 text-sky-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* File Tree Explorer & Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File List */}
        <div className="lg:col-span-1 space-y-1 max-h-[600px] overflow-y-auto pr-1">
          {filteredFiles.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-950/70 border-sky-600 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-mono truncate">{file.path}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 pl-5.5 truncate">
                  {file.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-3 p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-mono text-sky-400">{selectedFile.path}</div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>
            <button
              onClick={copyContent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer w-fit"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Code"}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#06080F] border border-slate-800 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto max-h-[520px] leading-relaxed whitespace-pre">
            {selectedFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
