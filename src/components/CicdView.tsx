import React, { useState } from 'react';
import { Play, CheckCircle2, Loader2, GitCommit, ShieldCheck, Terminal, Copy, Check } from 'lucide-react';
import { PROJECT_FILES } from '../data/projectFiles';

interface Stage {
  id: number;
  name: string;
  desc: string;
  logs: string;
}

export const CicdView: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(9); // 9 = all finished by default
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const stages: Stage[] = [
    {
      id: 1,
      name: "Source Code Checkout",
      desc: "actions/checkout@v4 retrieves commit SHA and submodules",
      logs: `Syncing repository cognevance-devops to ref refs/heads/main
Fetching submodules
Commit 7a8f12c "feat: upgrade prometheus histograms and multi-AZ terraform modules"
Checkout completed in 1.4s`
    },
    {
      id: 2,
      name: "Setup Python 3.11 Runtime",
      desc: "actions/setup-python@v5 configures Python environment and pip cache",
      logs: `Setting up Python 3.11.8...
Resolved from toolcache
Pip caching enabled for application/requirements.txt
Installed wheel and setuptools`
    },
    {
      id: 3,
      name: "Automated Pytest & Coverage",
      desc: "Runs unit & integration test suite with 80% coverage threshold",
      logs: `============================= test session starts ==============================
platform linux -- Python 3.11.8, pytest-8.0.2, pluggy-1.4.0
rootdir: /app/application
collected 6 items

tests/test_app.py::test_index_route PASSED                                [ 16%]
tests/test_app.py::test_health_check PASSED                               [ 33%]
tests/test_app.py::test_api_status PASSED                                 [ 50%]
tests/test_app.py::test_api_info PASSED                                   [ 66%]
tests/test_app.py::test_metrics_exposition PASSED                         [ 83%]
tests/test_app.py::test_404_error_handler PASSED                           [100%]

---------- coverage: platform linux, python 3.11.8 -----------
Name                  Stmts   Miss  Cover
-----------------------------------------
app/__init__.py          14      0   100%
app/config.py            18      1    94%
app/metrics.py           19      0   100%
app/routes.py            28      2    92%
-----------------------------------------
TOTAL                    79      3    96%

============================== 6 passed in 0.42s ===============================`
    },
    {
      id: 4,
      name: "Code & Manifest Validation",
      desc: "Python bytecode compilation and YAML schema check",
      logs: `Compiling Python source files...
python -m py_compile application/app/*.py
Zero syntax errors detected.
YAML schema verified for 8 Kubernetes manifests.`
    },
    {
      id: 5,
      name: "Docker Multi-Stage Build",
      desc: "Builds minimal runtime container image with non-root appuser",
      logs: `[+] Building 3.2s (14/14) FINISHED
 => [internal] load build definition from Dockerfile
 => [stage-1 1/5] FROM docker.io/library/python:3.11-slim
 => [builder 2/3] RUN pip install --user -r requirements.txt
 => [stage-1 3/5] RUN groupadd -g 10001 appgroup && useradd -u 10001 -g appgroup appuser
 => [stage-1 4/5] COPY --from=builder /root/.local /home/appuser/.local
 => [stage-1 5/5] COPY app/ ./app
 => naming to docker.io/cognevance/enterprise-devops-app:latest
Image size: 142 MB (Stripped compiler tools)`
    },
    {
      id: 6,
      name: "Trivy Container Security Scan",
      desc: "Scans OS packages and libraries for CVE vulnerabilities",
      logs: `2026-11-08T09:32:00.000Z INFO Vulnerability scanning cognevance/enterprise-devops-app:latest...
2026-11-08T09:32:01.000Z INFO Number of language-specific files: 1
2026-11-08T09:32:01.000Z INFO Detecting Python vulnerabilities...

Target: /home/appuser/app/requirements.txt
Total: 0 (CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0)

Target: OS packages (Debian 12.5)
Total: 0 (CRITICAL: 0, HIGH: 0)
Security Gate: PASSED (0 Critical Vulnerabilities)`
    },
    {
      id: 7,
      name: "Container Registry Publish",
      desc: "Pushes immutable tagged image to Docker Hub / Amazon ECR",
      logs: `Logging into registry with GitHub Secrets DOCKERHUB_TOKEN...
Pushing tag cognevance/enterprise-devops-app:7a8f12c
Pushing tag cognevance/enterprise-devops-app:latest
Digest: sha256:4b19283f...
Status: Image is up to date for docker.io/cognevance/enterprise-devops-app:latest`
    },
    {
      id: 8,
      name: "Kubernetes Cluster Rollout",
      desc: "Applies manifests to namespace devops-enterprise",
      logs: `namespace/devops-enterprise unchanged
serviceaccount/devops-app-sa unchanged
configmap/enterprise-devops-config configured
secret/enterprise-devops-secret unchanged
deployment.apps/enterprise-devops-app configured
service/enterprise-devops-svc unchanged
horizontalpodautoscaler.autoscaling/enterprise-devops-hpa unchanged`
    },
    {
      id: 9,
      name: "Deployment Verification & Health",
      desc: "Verifies rolling update status and probes /health endpoint",
      logs: `Waiting for deployment "enterprise-devops-app" rollout to finish: 1 of 3 updated replicas are available...
Waiting for deployment "enterprise-devops-app" rollout to finish: 2 of 3 updated replicas are available...
deployment "enterprise-devops-app" successfully rolled out.

Probing HTTP Health Target:
GET http://enterprise-devops-svc.devops-enterprise.svc.cluster.local:5000/health
Response: 200 OK {"status": "healthy"}
Zero-defect deployment verified.`
    }
  ];

  const triggerPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStage(1);
    setSelectedStageIndex(0);

    let stage = 1;
    const interval = setInterval(() => {
      stage++;
      if (stage > 9) {
        clearInterval(interval);
        setIsRunning(false);
        setCurrentStage(9);
      } else {
        setCurrentStage(stage);
        setSelectedStageIndex(stage - 1);
      }
    }, 1200);
  };

  const copyWorkflow = () => {
    const content = PROJECT_FILES.find(f => f.path.includes('ci-cd.yml'))?.content || '';
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>CI/CD Automation</span>
            <span aria-hidden="true">·</span>
            <span>GitHub Actions Workflow</span>
            <span aria-hidden="true">·</span>
            <span>9 Automated Stages</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Enterprise CI/CD Automation Pipeline
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated testing, security scanning, container packaging, and zero-downtime Kubernetes deployment.
          </p>
        </div>

        <button
          onClick={triggerPipeline}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-all shadow-sm shadow-sky-950/50 cursor-pointer disabled:opacity-50 shrink-0 w-fit"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running Stage {currentStage} / 9...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Trigger Pipeline Run</span>
            </>
          )}
        </button>
      </div>

      {/* 9 Stages Visual Progression Grid */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-base font-semibold text-white">Pipeline Execution Stages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {stages.map((stage, idx) => {
            const isCompleted = currentStage > stage.id || (!isRunning && currentStage === 9);
            const isCurrent = isRunning && currentStage === stage.id;
            const isSelected = selectedStageIndex === idx;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageIndex(idx)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'ring-1 ring-sky-500 border-sky-600 bg-sky-950/40'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">0{stage.id}</span>
                  {isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-slate-700" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200 line-clamp-2 leading-tight">
                    {stage.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {isCurrent ? 'Running...' : isCompleted ? 'Success' : 'Queued'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Log Viewer */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs text-slate-400 font-mono">
              Stage {stages[selectedStageIndex].id} Execution Logs
            </div>
            <h3 className="text-base font-semibold text-white">
              {stages[selectedStageIndex].name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{stages[selectedStageIndex].desc}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              Exit Code: 0 (Success)
            </span>
          </div>
        </div>

        <pre className="p-4 bg-[#06080F] border border-slate-800 rounded-lg text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-72 leading-relaxed whitespace-pre">
          {stages[selectedStageIndex].logs}
        </pre>
      </div>

      {/* GitHub Workflow YAML Reference */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Workflow Configuration (.github/workflows/ci-cd.yml)</h3>
            <p className="text-xs text-slate-400">Complete pipeline definition with Trivy vulnerability scanning.</p>
          </div>
          <button
            onClick={copyWorkflow}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Workflow"}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#06080F] border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-60 leading-relaxed whitespace-pre">
          {PROJECT_FILES.find(f => f.path.includes('ci-cd.yml'))?.content}
        </pre>
      </div>
    </div>
  );
};
