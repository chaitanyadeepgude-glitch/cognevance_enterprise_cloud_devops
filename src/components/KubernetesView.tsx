import React, { useState } from 'react';
import { Box, Layers, Terminal, Copy, Check, Plus, Minus } from 'lucide-react';
import { PROJECT_FILES } from '../data/projectFiles';

export const KubernetesView: React.FC = () => {
  const [selectedManifest, setSelectedManifest] = useState<string>('deployment.yaml');
  const [activeKubectlCmd, setActiveKubectlCmd] = useState<string>('get-pods');
  const [replicaCount, setReplicaCount] = useState<number>(3);
  const [copied, setCopied] = useState<boolean>(false);

  const manifestMap: Record<string, string> = {
    'deployment.yaml': PROJECT_FILES.find(f => f.path.includes('deployment.yaml'))?.content || '',
    'service.yaml': PROJECT_FILES.find(f => f.path.includes('service.yaml'))?.content || '',
    'hpa.yaml': PROJECT_FILES.find(f => f.path.includes('hpa.yaml'))?.content || '',
    'namespace.yaml': `apiVersion: v1\nkind: Namespace\nmetadata:\n  name: devops-enterprise\n  labels:\n    name: devops-enterprise\n    organization: cognevance-technologies`,
    'configmap.yaml': `apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: enterprise-devops-config\n  namespace: devops-enterprise\ndata:\n  FLASK_ENV: "production"\n  LOG_LEVEL: "INFO"\n  PORT: "5000"`,
    'secret.yaml.example': `apiVersion: v1\nkind: Secret\nmetadata:\n  name: enterprise-devops-secret\n  namespace: devops-enterprise\ntype: Opaque\ndata:\n  SECRET_KEY: ZGV2b3BzLXByb2R1Y3Rpb24tc2VjcmV0LWtleS0yMDI2`,
    'ingress.yaml': `apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: enterprise-devops-ingress\n  namespace: devops-enterprise\nspec:\n  rules:\n    - host: devops.local\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: enterprise-devops-svc\n                port:\n                  number: 5000`,
    'serviceaccount.yaml': `apiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: devops-app-sa\n  namespace: devops-enterprise\nautomountServiceAccountToken: false`
  };

  const kubectlOutputs: Record<string, string> = {
    'get-nodes': `$ kubectl get nodes -o wide
NAME           STATUS   ROLES           AGE   VERSION   INTERNAL-IP   OS-IMAGE             KERNEL-VERSION
kind-control   Ready    control-plane   3d    v1.29.2   172.18.0.2    Ubuntu 22.04.3 LTS   5.15.0-generic
kind-worker-1  Ready    <none>          3d    v1.29.2   172.18.0.3    Ubuntu 22.04.3 LTS   5.15.0-generic
kind-worker-2  Ready    <none>          3d    v1.29.2   172.18.0.4    Ubuntu 22.04.3 LTS   5.15.0-generic`,

    'get-pods': `$ kubectl get pods -n devops-enterprise -o wide
NAME                                     READY   STATUS    RESTARTS   AGE     IP            NODE
enterprise-devops-app-7984f7b6d-a19c     1/1     Running   0          2h14m   10.244.1.12   kind-worker-1
enterprise-devops-app-7984f7b6d-b84e     1/1     Running   0          2h14m   10.244.2.18   kind-worker-2
enterprise-devops-app-7984f7b6d-c23f     1/1     Running   0          2h14m   10.244.1.15   kind-worker-1`,

    'get-deployments': `$ kubectl get deployments -n devops-enterprise
NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
enterprise-devops-app   ${replicaCount}/${replicaCount}     ${replicaCount}            ${replicaCount}           2h14m`,

    'get-svc': `$ kubectl get svc -n devops-enterprise
NAME                    TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
enterprise-devops-svc   NodePort   10.96.142.201   <none>        5000:30080/TCP   2h14m`,

    'get-hpa': `$ kubectl get hpa -n devops-enterprise
NAME                    REFERENCE                          TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
enterprise-devops-hpa   Deployment/enterprise-devops-app   cpu: 18%/70%    2         10        ${replicaCount}          2h14m`,

    'describe-pod': `$ kubectl describe pod -l app=enterprise-devops-app -n devops-enterprise
Name:             enterprise-devops-app-7984f7b6d-a19c
Namespace:        devops-enterprise
Node:             kind-worker-1/172.18.0.3
Labels:           app=enterprise-devops-app, tier=backend
Status:           Running
IP:               10.244.1.12
Containers:
  devops-monitoring-app:
    Container ID:   containerd://e98bc192...
    Image:          cognevance/enterprise-devops-app:1.0.0
    Port:           5000/TCP
    State:          Running (Started 2 hours ago)
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     500m
      memory:  512Mi
    Requests:
      cpu:     100m
      memory:  128Mi
    Liveness:     http-get http://:5000/health delay=15s timeout=3s period=10s #success=1 #failure=3
    Readiness:    http-get http://:5000/health delay=5s timeout=2s period=5s #success=1 #failure=2
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  2h    default-scheduler  Successfully assigned devops-enterprise/enterprise-devops-app-7984f7b6d-a19c to kind-worker-1
  Normal  Pulled     2h    kubelet            Container image "cognevance/enterprise-devops-app:1.0.0" already present on machine
  Normal  Created    2h    kubelet            Created container devops-monitoring-app
  Normal  Started    2h    kubelet            Started container devops-monitoring-app`,

    'logs': `$ kubectl logs -l app=enterprise-devops-app -n devops-enterprise --tail=10
{"timestamp": "2026-11-08 09:30:12", "level": "INFO", "logger": "enterprise_devops", "message": "Worker spawned PID 41"}
{"timestamp": "2026-11-08 09:30:15", "level": "INFO", "logger": "enterprise_devops", "message": "Liveness probe succeeded: GET /health HTTP 200"}
{"timestamp": "2026-11-08 09:30:20", "level": "INFO", "logger": "enterprise_devops", "message": "Readiness probe succeeded: GET /health HTTP 200"}
{"timestamp": "2026-11-08 09:30:25", "level": "INFO", "logger": "enterprise_devops", "message": "Prometheus scraped metrics at /metrics [200 OK]"}
{"timestamp": "2026-11-08 09:30:30", "level": "INFO", "logger": "enterprise_devops", "message": "Telemetry nominal - active threads 2, RSS 142MB"}`
  };

  const copyManifest = () => {
    navigator.clipboard.writeText(manifestMap[selectedManifest]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>Container Orchestration</span>
          <span aria-hidden="true">·</span>
          <span>Dual-Mode: Minikube &amp; Kind Supported</span>
          <span aria-hidden="true">·</span>
          <span>AWS EKS Ready</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Kubernetes Workloads &amp; Manifest Controller
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Declarative Kubernetes configurations with rolling updates, autoscaling, and health probes.
        </p>
      </div>

      {/* Dynamic Replica Scaling Simulator */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">Interactive Pod Replicas Simulator</h2>
            <p className="text-xs text-slate-400">
              Simulate dynamic Horizontal Pod Autoscaler (HPA) or manual scaling (`kubectl scale`).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReplicaCount(Math.max(2, replicaCount - 1))}
              disabled={replicaCount <= 2}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-lg font-bold text-sky-400 px-3">
              {replicaCount} <span className="text-xs font-normal text-slate-400">Replicas</span>
            </span>
            <button
              onClick={() => setReplicaCount(Math.min(10, replicaCount + 1))}
              disabled={replicaCount >= 10}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Pod Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {Array.from({ length: replicaCount }).map((_, i) => (
            <div key={i} className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-300 font-medium">pod-{i + 1}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-500 font-mono">10.244.{1 + (i % 2)}.{10 + i}</div>
              <div className="text-[11px] text-emerald-400 font-medium">Ready (1/1)</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive kubectl Terminal */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-sky-400" />
          <div>
            <h2 className="text-base font-semibold text-white">kubectl Command Runner</h2>
            <p className="text-xs text-slate-400">Execute validation queries against the Kubernetes cluster.</p>
          </div>
        </div>

        {/* Command Quick Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: 'get-pods', label: 'kubectl get pods' },
            { id: 'get-deployments', label: 'kubectl get deployments' },
            { id: 'get-svc', label: 'kubectl get svc' },
            { id: 'get-hpa', label: 'kubectl get hpa' },
            { id: 'get-nodes', label: 'kubectl get nodes' },
            { id: 'describe-pod', label: 'kubectl describe pod' },
            { id: 'logs', label: 'kubectl logs' },
          ].map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => setActiveKubectlCmd(cmd.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all border cursor-pointer ${
                activeKubectlCmd === cmd.id
                  ? 'bg-sky-600 border-sky-500 text-white shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cmd.label}
            </button>
          ))}
        </div>

        {/* Output */}
        <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#06080F]">
          <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400">
            Cluster Context: devops-enterprise-cluster · Namespace: devops-enterprise
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-80 leading-relaxed whitespace-pre">
            {kubectlOutputs[activeKubectlCmd]}
          </pre>
        </div>
      </div>

      {/* Manifest Viewer */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-semibold text-white">Declarative Manifest Inspector</h2>
              <p className="text-xs text-slate-400">Verified YAML manifests located in /kubernetes</p>
            </div>
          </div>

          <button
            onClick={copyManifest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer w-fit"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy YAML"}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(manifestMap).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedManifest(m)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all border cursor-pointer ${
                selectedManifest === m
                  ? 'bg-sky-950/80 border-sky-600 text-sky-300'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* YAML Display */}
        <pre className="p-4 bg-[#06080F] border border-slate-800 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto max-h-80 leading-relaxed whitespace-pre">
          {manifestMap[selectedManifest]}
        </pre>
      </div>
    </div>
  );
};
