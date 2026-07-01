# 🌐 Kyrti — Self-Evolving AI Enterprise Platform
## In-Depth Architecture & Pitch Deck Guide (Hackathon PPT Ready)

---

## Slide 1: Title & Paradigm Shift
**Headline:** Kyrti — Stop Managing Prompts. Start Leading an Enterprise.
**Sub-Headline:** A Sovereign, Self-Evolving AI Enterprise Platform with 2D Spatial Virtual Offices & Zero-Knowledge Confidential EVM Governance.

### Key Talking Points / Speaker Notes:
* Today’s enterprise AI tools are glorified chat boxes. Companies spend hundreds of hours babysitting prompts instead of building autonomous corporate structures.
* **Kyrti** introduces **Self-Evolving Autonomous Enterprise Leadership**: human C-Suite executives manage dynamic corporate hierarchies co-inhabited by specialized AI Governors (AI CTO, AI CFO, Autonomous Workers).
* To solve the Fortune 500 enterprise privacy dealbreaker, Kyrti integrates **Fhenix Fully Homomorphic Encryption (FHE)** so corporate decisions, payroll, and bids execute entirely in ciphertext on public ledgers.

---

## Slide 2: The Fortune 500 Problem vs. Kyrti Solution
| The Enterprise Dealbreaker | The Kyrti FHE + Spatial Solution |
| :--- | :--- |
| **Public Blockchain Exposure:** Standard Ethereum/Polygon smart contracts make corporate budgets, employee salaries, and strategic board dissent globally public to competitors. | **Confidential EVM Execution (Fhenix FHE):** Computes boardroom voting, blind marketplace bidding, payroll streaming, and RBAC clearance checks **100% in ciphertext** (`euint64`, `ebool`). |
| **Siloed & Stateless AI Workers:** AI agents lack spatial context, team collaboration, and real-time interactive feedback loops with human executives. | **Interactive 2D Spatial Matrix:** Integrated Phaser 4 + FastAPI engine where AI agents exist as avatars inside a real-time virtual office with proximity audio mesh and Jitsi video rooms. |
| **Rigid Organizational Hierarchies:** Traditional HR software requires manual restructuring and cannot dynamically promote or reassign AI workers based on SLA metrics. | **Self-Evolving Microservices Core:** Spring Boot microservices automatically re-balance hierarchy nodes, evaluate AI agent SLAs, and trigger encrypted treasury disbursements. |

---

## Slide 3: Complete System Architecture (End-to-End)

```mermaid
graph TB
    subgraph ClientLayer ["🖥️ Presentation Layer (Single-Port Frontend: Port 5173)"]
        UI["React 19 SPA + Glassmorphism UI"]
        Phaser["Phaser 4 Spatial Canvas (2D Office Engine)"]
        Jitsi["@jitsi/react-sdk Proximity A/V Mesh"]
        Zustand["Zustand Spatial State Store"]
    end

    subgraph SpatialLayer ["⚡ Real-Time Spatial & Agent Gateway (Port 8000)"]
        FastAPI["Python FastAPI / Uvicorn Server"]
        WS["WebSocket Client Pool (/ws/{client_id})"]
        AIWorkers["Autonomous AI Agent Swarm Nodes"]
    end

    subgraph MicroservicesLayer ["🏢 Enterprise Backend Core (Spring Cloud Gateway: Port 8080)"]
        Gateway["SAEP Gateway (Spring Cloud Gateway)"]
        Identity["SAEP Identity (JWT + WebAuthn 2FA)"]
        Company["SAEP Company (Registration & Wizard Pipeline)"]
        Org["SAEP Organization (Dynamic C-Suite & Hierarchy Nodes)"]
        Workforce["SAEP Workforce (AI SLA Tracking & Agent Swarm Logic)"]
    end

    subgraph FHELayer ["🔒 Confidential EVM Blockchain Layer (Fhenix FHE)"]
        Gov["FHEGovernance.sol (Encrypted Boardroom Voting)"]
        Market["FHEMarketplace.sol (Blind Sealed-Bid Workforce Leasing)"]
        Payroll["FHEPayroll.sol (SLA Verification & Private Payouts)"]
        Clearance["FHEClearanceVault.sol (Zero-Knowledge Meeting RBAC)"]
    end

    subgraph InfraLayer ["🗄️ Persistence & Infrastructure Layer"]
        PG[(PostgreSQL Enterprise Database)]
        Redis[(Redis Cache & Session Outbox)]
        Docker["Docker Infrastructure & Orchestration"]
    end

    %% Client Routing
    UI <-->|REST API / JWT| Gateway
    UI <-->|WebSocket Events (Player/AI Move)| WS
    Phaser <-->|Proximity Audio/Video Trigger| Jitsi

    %% Gateway Routing
    Gateway <--> Identity
    Gateway <--> Company
    Gateway <--> Org
    Gateway <--> Workforce

    %% Spatial to Microservices
    FastAPI <-->|Fetch Hierarchy & Spawn Agents| Workforce

    %% Blockchain Integration
    Org <-->|Execute Encrypted Proposals| Gov
    Workforce <-->|Disburse Encrypted Salary| Payroll
    Workforce <-->|Submit Sealed Bids| Market
    Identity <-->|Verify Room Clearance| Clearance

    %% Persistence
    Identity & Company & Org & Workforce <--> PG
    Gateway & Workforce <--> Redis
```

---

## Slide 4: Detailed Technology Stack Matrix

### 1. Presentation & Interactive Spatial Layer
* **Framework:** React 19 + Vite 8 (Single-Port SPA architecture running on port `5173`).
* **Styling & Design System:** Tailwind CSS v4 + PostCSS + Vanilla CSS tokens (Vibrant Glassmorphism, institutional dark/light modes, micro-animations).
* **Spatial 2D Engine:** Phaser 4 WebGL/Canvas spatial engine rendering custom tilemaps (`tileset_dungeon`, `office_props`, interactive zones).
* **A/V Proximity Conferencing:** `@jitsi/react-sdk` embedded video matrix with automated spatial room routing and proximity audio attenuation.
* **State Management:** Zustand (`spatialStore.js`) + EventBus pattern bridging React DOM components directly to Phaser canvas frame loops.

### 2. Enterprise Backend Microservices Core (Java / Spring Boot 3)
* **API Gateway (`saep-gateway`):** Spring Cloud Gateway running on port `8080` handling centralized route mapping, CORS, rate-limiting, and security filtering.
* **Identity Service (`saep-identity`):** Stateless JWT session authentication combined with WebAuthn / Time-Based One-Time Password (TOTP) 2FA verification.
* **Company Onboarding (`saep-company`):** Multi-stage onboarding wizard pipeline managing enterprise entity creation, corporate tax IDs, and industry archetypes.
* **Organization & Hierarchy (`saep-organization`):** Dynamic graph architecture managing human C-Suite seats, department trees, and AI Governor positions.
* **Workforce Engine (`saep-workforce`):** AI agent performance lifecycle tracking, SLA evaluation, task allocation, and automated swarm feedback loops.

### 3. Spatial Swarm WebSocket Gateway (Python FastAPI)
* **Runtime:** Python 3.12 + FastAPI + Uvicorn asyncio server running on port `8000`.
* **Protocol:** Bi-directional WebSockets (`/ws/{client_id}`) broadcasting low-latency coordinates (`MAP_UPDATED`, `PLAYER_MOVED`).
* **AI Agent Controller:** Spawns autonomous AI worker nodes (`AGENT_SPAWNED`) inside the 2D office matrix and handles proximity chatbot interactions (`chat_reply`).

### 4. Zero-Knowledge Confidential EVM Layer (Fhenix FHE)
* **Blockchain Runtime:** Fhenix EVM Layer 2 / Fhenix Helium Testnet (Fully Homomorphic Encryption over EVM).
* **Smart Contract Stack:** Solidity `^0.8.20` + Hardhat + `@fhenixprotocol/contracts`.
* **Encrypted Data Types:** `euint64` (salaries, bids, share weights), `ebool` (secret votes), `euint8` (security badges).
* **Homomorphic Operations:** Evaluates mathematical operations (`FHE.add`, `FHE.select`, `FHE.gt`, `FHE.gte`) on encrypted state without exposing plaintexts.

### 5. Data & Infrastructure Layer
* **Primary Relational Store:** PostgreSQL 16 (Multi-tenant schema isolating company registries, identity vaults, and hierarchy nodes).
* **High-Speed Caching & Outbox:** Redis 7 (Distributed session locks, microservice event outbox, and WebSocket pub/sub).
* **Orchestration:** Docker Compose + automated PowerShell enterprise startup scripts (`start_backend.ps1`, `stop_backend.ps1`).

---

## Slide 5: Deep Dive — Fhenix FHE Smart Contract Suite
Explain why public blockchains fail Fortune 500 enterprises and how our 4 Fhenix contracts make Kyrti production-ready:

1. **`FHEGovernance.sol` (Confidential Boardroom Voting):**
   * *Problem:* Public voting reveals C-suite dissent and triggers market panic.
   * *Solution:* Votes are cast as ciphertext `ebool`. Weights are accumulated using `FHE.select()`. Only the final boolean pass/fail outcome is decrypted.
2. **`FHEMarketplace.sol` (Blind Sealed-Bid Workforce Leasing):**
   * *Problem:* Public bids expose financial ceilings and upcoming project roadmaps.
   * *Solution:* Companies submit sealed encrypted bids (`euint64`). The contract compares bids homomorphically (`FHE.gt`) and assigns the AI worker to the highest bidder in secret.
3. **`FHEPayroll.sol` (Confidential Salary & SLA Treasury Streaming):**
   * *Problem:* Public payroll exposes every employee’s salary and AI compute budget.
   * *Solution:* Evaluates employee/AI SLA performance homomorphically (`FHE.gte(score, target)`). Streams encrypted base pay + bonus tokens directly to private balances.
4. **`FHEClearanceVault.sol` (Zero-Knowledge Meeting Room RBAC):**
   * *Problem:* Checking security clearances on-chain reveals an identity's exact organizational rank.
   * *Solution:* Evaluates `FHE.gte(userBadge, requiredClearance)` to unlock executive virtual meeting rooms without leaking numeric clearance tiers.

---

## Slide 6: Key Hackathon Differentiators & Pitch Summary
* **⚡ 100% Single-Port Frontend Experience:** Seamless integration of spatial WebGL canvas, React UI, and Jitsi conferencing under a unified local server (`localhost:5173`).
* **🏢 Autonomous Organizational Hierarchy:** Real enterprise logic where AI workers are not just chat assistants, but titled occupants in organizational tree nodes with measurable SLAs.
* **🔐 Fortune 500 Privacy Guarantee:** First platform to merge 2D Spatial Virtual Workspaces with **Fully Homomorphic Encryption (FHE)** smart contract governance.
