# Sovereign AI Enterprise Protocol (SAEP)

An advanced, microservices-based enterprise platform integrating distributed AI agents, workforce management, memory graphs, and governance.

## 🚀 Quick Start (One-Click Setup)

SAEP features an automated enterprise bootstrapper that provisions the infrastructure, compiles the backend microservices, and sets up the frontend environment.

Open a PowerShell terminal as Administrator and run:

```powershell
.\setup.ps1
```

**What the setup script does:**
1. Validates your environment (Java, Node.js, Docker).
2. Provisions the distributed infrastructure via Docker Compose.
3. Compiles 14 Spring Boot microservices using the bundled Maven Wrapper.
4. Installs all React frontend dependencies.

> **Note:** If any prerequisites are missing, the setup script will alert you.

---

## 📋 System Requirements

To run SAEP locally, ensure you have the following installed:

- **OS:** Windows 10/11 (with WSL2 enabled)
- **Java:** JDK 17 or higher
- **Node.js:** v18 LTS or higher
- **Docker:** Docker Desktop (Ensure the Docker daemon is running)

---

## 🏃‍♂️ Running the Application

After running `setup.ps1` successfully, you can start the application:

### 1. Start the Backend Microservices
Open a PowerShell terminal and run the backend startup script:
```powershell
.\scripts\start_backend.ps1
```
*This will launch the core Spring Boot services (Gateway, Identity, Company, Workforce, etc.).*

### 2. Start the Frontend UI
Open a **new** terminal window and run:
```powershell
cd frontend
npm run dev
```
*The React Dashboard will be available at `http://localhost:5173` (or the port specified in your console).*

---

## 🏗️ Project Architecture

The repository is structured as a clean, enterprise monorepo:

```text
/
├── backend/                # Spring Boot Microservices
│   ├── services/           # Core domains (identity, company, workforce, memory, etc.)
│   └── shared/             # Shared libraries (common, outbox-starter)
├── frontend/               # React UI Dashboard
├── infrastructure/         # Docker, Monitoring, and Orchestration
│   ├── docker/             # docker-compose.yml and database configs
│   └── monitoring/         # Grafana dashboards and Prometheus alerts
├── scripts/                # Automation and operational scripts
└── docs/                   # Architectural decisions and deployment guides
```

## 🛠️ Infrastructure Stack

The `setup.ps1` script automatically spins up the following infrastructure containers:
- **PostgreSQL**: Primary relational database.
- **Kafka / Zookeeper**: Event streaming and messaging backbone.
- **Redis**: Distributed caching.
- **Neo4j**: Graph database for AI memory relationships.
- **Qdrant**: Vector database for AI embeddings.
- **Ollama**: Local LLM execution.
- **Prometheus & Grafana**: Telemetry and system monitoring.
- **Zipkin**: Distributed request tracing.

## 🛑 Stopping the Application

To cleanly shut down the backend services, run:
```powershell
.\scripts\stop_backend.ps1
```

To stop and remove the Docker infrastructure, run:
```powershell
cd infrastructure\docker
docker compose down
```
