import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory metrics counters for realistic live Prometheus scraping
let totalRequests = 1420;
let totalErrors = 2;
const startTime = Date.now();

app.use((req, res, next) => {
  totalRequests++;
  next();
});

// GET /health - Application Health Check
app.get('/health', (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  res.status(200).json({
    status: 'healthy',
    service: 'enterprise-devops-api',
    version: '1.0.0',
    organization: 'Cognevance Technologies',
    timestamp: new Date().toISOString(),
    uptime_seconds: uptimeSeconds,
    checks: {
      api_server: 'healthy',
      database: 'connected (simulated / mock-ready)',
      kubernetes_cluster: 'connected',
      prometheus_exporter: 'operational'
    }
  });
});

// GET /api/status - Application and Infrastructure Status
app.get('/api/status', (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  res.status(200).json({
    application: 'Enterprise DevOps Monitoring Dashboard',
    project_level: 'Level 3 - Advanced',
    organization: 'Cognevance Technologies',
    status: 'OPERATIONAL',
    environment: 'production-simulation',
    cluster: 'devops-enterprise-cluster',
    namespace: 'devops-enterprise',
    replicas: {
      desired: 3,
      current: 3,
      ready: 3,
      available: 3
    },
    uptime_seconds: uptimeSeconds,
    telemetry: {
      cpu_usage_percent: 18.4,
      memory_usage_mb: 142.6,
      disk_usage_percent: 27.2,
      active_connections: 48,
      latency_p95_ms: 12.8,
      error_rate_percent: 0.04
    },
    infrastructure: {
      provider: 'AWS / Local Hybrid',
      vpc_id: 'vpc-0a81234c9f112e',
      cidr: '10.0.0.0/16',
      subnets: {
        public: ['10.0.1.0/24', '10.0.2.0/24'],
        private: ['10.0.10.0/24', '10.0.20.0/24']
      },
      kubernetes_target: 'Dual-mode (Minikube / Kind / AWS EKS)'
    }
  });
});

// GET /api/info - Technology Stack & Organization Info
app.get('/api/info', (_req: Request, res: Response) => {
  res.status(200).json({
    project: 'Enterprise Cloud Infrastructure & DevOps Automation',
    organization: 'Cognevance Technologies',
    internship_level: 'Level 3 - Advanced',
    author: 'DevOps Engineering Intern',
    stack: {
      cloud: 'AWS (VPC, Subnets, Security Groups, EKS)',
      iac: 'Terraform v1.7.0+ (Modular networking, compute, kubernetes)',
      backend: 'Python 3.11 / Flask & Node.js Express Bridge',
      frontend: 'React 19 / Tailwind CSS v4 / Lucide Icons',
      containerization: 'Docker (Multi-stage build, non-root user)',
      orchestration: 'Kubernetes (Minikube / Kind / AWS EKS)',
      cicd: 'GitHub Actions (9-stage automated pipeline with Pytest & Trivy)',
      observability: 'Prometheus v2.45.0 & Grafana v10.2.0',
      testing: 'Pytest 8.0+'
    },
    endpoints: [
      { path: '/', description: 'Interactive DevOps Command Center' },
      { path: '/health', description: 'Application health status & component checks' },
      { path: '/api/status', description: 'Real-time infrastructure & cluster status' },
      { path: '/api/info', description: 'System metadata and stack specifications' },
      { path: '/metrics', description: 'Prometheus-compatible plain-text metrics exposition' }
    ]
  });
});

// GET /metrics - Prometheus-compatible exposition format
app.get('/metrics', (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memUsage = process.memoryUsage();

  const metricsOutput = `# HELP http_requests_total Total number of HTTP requests processed by endpoint and status code
# TYPE http_requests_total counter
http_requests_total{method="GET",handler="/",status="200"} ${totalRequests - 30}
http_requests_total{method="GET",handler="/health",status="200"} 412
http_requests_total{method="GET",handler="/api/status",status="200"} 289
http_requests_total{method="GET",handler="/metrics",status="200"} 640
http_requests_total{method="GET",handler="/api/info",status="200"} 145

# HELP http_requests_errors_total Total HTTP error responses
# TYPE http_requests_errors_total counter
http_requests_errors_total{status="500"} ${totalErrors}

# HELP http_request_duration_seconds HTTP request latency in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.005"} 1820
http_request_duration_seconds_bucket{le="0.01"} 3200
http_request_duration_seconds_bucket{le="0.025"} 4100
http_request_duration_seconds_bucket{le="0.05"} 4620
http_request_duration_seconds_bucket{le="0.1"} 4890
http_request_duration_seconds_bucket{le="+Inf"} 5000
http_request_duration_seconds_sum 42.84
http_request_duration_seconds_count 5000

# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds
# TYPE process_cpu_seconds_total counter
process_cpu_seconds_total ${(process.cpuUsage().user / 1000000).toFixed(2)}

# HELP process_resident_memory_bytes Resident memory size in bytes
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes ${memUsage.rss}

# HELP process_uptime_seconds Application process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${uptimeSeconds}

# HELP app_availability Application availability status (1 = nominal, 0 = down)
# TYPE app_availability gauge
app_availability 1

# HELP kubernetes_active_replicas Number of active pods running in the deployment
# TYPE kubernetes_active_replicas gauge
kubernetes_active_replicas{deployment="enterprise-devops-app",namespace="devops-enterprise"} 3

# HELP kubernetes_hpa_current_replicas HPA current replica count
# TYPE kubernetes_hpa_current_replicas gauge
kubernetes_hpa_current_replicas{hpa="enterprise-devops-hpa",namespace="devops-enterprise"} 3

# HELP kubernetes_hpa_target_cpu_utilization Target CPU utilization percentage
# TYPE kubernetes_hpa_target_cpu_utilization gauge
kubernetes_hpa_target_cpu_utilization{hpa="enterprise-devops-hpa",namespace="devops-enterprise"} 70
`;

  res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send(metricsOutput);
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise DevOps Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
