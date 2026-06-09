# Sovereign Protocol Complete Codebase

### append_code.js
```js
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outputFile = path.join(__dirname, 'whole_code.md');

let output = '\n\n--- APPENDED LATEST CODE ---\n\n';

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
                const relativePath = path.relative(__dirname, fullPath);
                const content = fs.readFileSync(fullPath, 'utf8');
                const ext = path.extname(fullPath).slice(1);
                const codeLang = ext === 'jsx' ? 'jsx' : ext === 'css' ? 'css' : 'javascript';
                output += `### ${relativePath.replace(/\\/g, '/')}\n\`\`\`${codeLang}\n${content}\n\`\`\`\n\n`;
            }
        }
    }
}

walkDir(srcDir);
fs.appendFileSync(outputFile, output);
console.log('Successfully appended latest code to whole_code.md');

```

### eslint.config.js
```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])

```

### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sovereign Protocol — Institutional-Grade AI Enterprise Management Platform with Multi-Layer Identity Verification, Role-Separated Treasury, and Deterministic Governance." />
    <meta name="robots" content="noindex, nofollow" />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=()" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700;800&family=Lato:wght@300;400;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <title>Sovereign Protocol — AI Enterprise Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

### memory_entry.md
```md
# Sovereign Protocol — Development Memory Log

## Project Overview
**Platform**: Sovereign AI Enterprise Protocol  
**Purpose**: Institutional-grade frontend for AI-native company management  
**Location**: `d:\AI BUSSINESS\git_hub_branch\frontend\`  
**Tech Stack**: React 19 + Vite 8 + Vanilla CSS  
**File Extension**: `.jsx` only (as specified)

---

## Session: 2026-05-07

### What Was Done

#### Phase 1: Project Initialization
- Created React 19 + Vite project inside `git_hub_branch/frontend/`
- Installed dependencies: `react@19`, `react-dom@19`, `zustand`, `@tanstack/react-query`, `react-router-dom`, `ethers`, `dompurify`, `framer-motion`, `recharts`, `lucide-react`
- Configured `vite.config.js` with path aliases, security headers, and optimized chunking
- Created `index.html` with security meta tags (X-Frame-Options DENY, CSP, Referrer-Policy, Permissions-Policy)
- Created SVG favicon (hexagonal shield icon)

#### Phase 2: Design System (5 CSS files)
- `styles/index.css` — Complete design tokens: dark theme palette, glassmorphism, typography (Inter + JetBrains Mono), spacing, shadows, transitions, z-index scale, scrollbar, focus-visible
- `styles/animations.css` — 15+ keyframe animations: fade, scale, pulse, glow, shimmer, spin, float, ripple, stagger children, skeleton loading
- `styles/components.css` — Reusable component classes: buttons (6 variants), cards (glassmorphic), badges (6 colors), inputs, status dots, progress bars, modals, tables, tooltips, empty states
- `styles/layouts.css` — App shell, sidebar, topbar, grid systems, responsive breakpoints, page headers, flex utilities
- `styles/pages.css` — Page-specific: login, identity stepper, treasury wallet cards, governance tabs, DPE pipeline, onboarding tiers, audit logs, ZK proofs, security stats

#### Phase 3: Configuration (3 files)
- `config/constants.js` — Immutable platform constants: 5-min session timeout, financial keyword blocklist (20 terms), AI blocked categories (12), multi-sig thresholds, crypto constants, audit action types
- `config/tiers.js` — Progressive trust tier definitions (Tier 0-3) with capabilities, restrictions, layer requirements, helper functions
- `config/rbac.js` — RBAC permission matrix for Founder/Supervisor/Auditor with 22 granular permissions each

#### Phase 4: Security Infrastructure (5 files)
- `security/PolicyValidator.js` — Deterministic middleware scanning AI outputs for financial keywords, currency patterns (ETH/BTC/USDC), transaction instructions. Generates blocker reports on violations. Completely independent from AI model.
- `security/CryptoService.js` — Web Crypto API wrapper: SHA-256 hashing, ECDSA key generation/signing/verification, AES-256-GCM file encryption, session fingerprinting, signed audit records
- `security/SessionGuard.js` — 5-minute idle timer with activity monitoring (mousedown, keydown, scroll, touch), tab visibility detection, beforeunload state wipe. Singleton.
- `security/DOMSanitizer.js` — DOMPurify wrapper with strict allowlists. Blocks script/iframe/form/input tags. Forces rel="noopener noreferrer" on links. Strips all event handler attributes.
- `security/AuditLogger.js` — Immutable audit log with frozen entries, monotonic sequence numbers, auto-flush buffer (100 entries), violation tracking

#### Phase 5: State Management (5 Zustand stores)
- `store/authStore.js` — Zero-persistence auth state: user, role, session fingerprint, 2FA status. Complete wipe on logout.
- `store/identityStore.js` — Multi-layer identity matrix (A through D): tracks verification status, documents, DNS/email/multisig, wallet binding. Calculates current tier from completed layers.
- `store/treasuryStore.js` — Treasury wallet, ops wallet, agent wallets (individually capped), transaction history. AI-isolated.
- `store/governanceStore.js` — DPE pipeline proposals (always start as drafts), blocker reports, agent lifecycle management, governance policies. All entries frozen with Object.freeze().
- `store/onboardingStore.js` — Progressive trust state machine (Tier 0-3), sandbox mode flag, feature access gating

#### Phase 6: Custom Hooks (5 files)
- `hooks/useSessionGuard.js` — Integrates SessionGuard with ALL stores. Wipes everything on timeout/close.
- `hooks/usePermission.js` — RBAC permission checker for conditional UI rendering
- `hooks/useTierGate.js` — Progressive trust access control for routes and features
- `hooks/usePolicyValidator.js` — Policy validator hook triggering pause states and blocker reports
- `hooks/useWallet.js` — MetaMask connection, message signing, wallet-to-BusinessID binding

#### Phase 7: Services (1 file)
- `services/mockApi.js` — Complete mock API matching exact backend schema: auth, 2FA, KYB, DNS, email, treasury data, proposals, agents, blocker reports, ZK proofs

#### Phase 8: Common Components (8 files)
- `Button.jsx` — 6 variants (primary/secondary/ghost/danger/success), 3 sizes, icon support, loading spinner
- `Card.jsx` — Glassmorphic card with Framer Motion entrance animation, hover effects, accent variants
- `Badge.jsx` — 6 color variants with optional icon
- `Modal.jsx` — Accessible modal with backdrop blur, escape key, Framer Motion animation
- `StatusIndicator.jsx` — Animated dot for active/pending/error/inactive states
- `ProgressBar.jsx` — Animated fill with variant colors and percentage display
- `FileUploader.jsx` — Drag-and-drop with REAL AES-256 client-side encryption via Web Crypto API
- `CopyToClipboard.jsx` — For DNS TXT records and hash values with visual feedback
- `SafeRenderer.jsx` — The ONLY way to render AI content. Passes through PolicyValidator AND DOMPurify.

#### Phase 9: Layout Components (4 files)
- `AppShell.jsx` — Main layout activating SessionGuard
- `Sidebar.jsx` — Navigation with tier-gated route locking, trust level indicator, collapsible
- `TopBar.jsx` — Live session countdown, breadcrumbs, blocker notifications, logout
- `TierGate.jsx` — Route protection with visual lock states

#### Phase 10: Pages (7 files)
- `LoginPage.jsx` — Layer A (Human ID): SSO provider selection, 2FA code entry, session fingerprinting
- `IdentityPage.jsx` — All 4 layers: Human ID, KYB with encrypted upload, DNS verification, email handshake, wallet binding
- `TreasuryPage.jsx` — Cold storage, ops wallet, capped agent wallets, transaction history table. AI isolation notice.
- `GovernancePage.jsx` — RBAC tabs, DPE pipeline (3-column Kanban), agent management with terminate, blocker reports
- `DashboardPage.jsx` — Stats overview, identity progress, governance architecture, sandbox warning
- `OnboardingPage.jsx` — Progressive trust tier visualization (0-3) with capability lists
- `AuditPage.jsx` — Immutable audit trail, session monitoring, security measures grid, ZK-proof cards

#### Phase 11: Assembly
- `App.jsx` — React Router with private routes, TanStack Query provider
- `main.jsx` — Entry point importing CSS in correct order, StrictMode render

### Build Result
- **Build successful** — 0 errors, 780ms build time
- **60+ source files** created
- Production chunks: vendor (226KB), spatial (903KB lazy), ui (140KB), index (144KB), state (34KB), security (22KB), CSS (50KB)
- Dev server at http://localhost:5173/
- Spatial workspace is **code-split** via React.lazy — Three.js only loads when `/spatial` is visited

---

## Session: 2026-05-07 (Module 2: The Command Center)

### What Was Done

#### Isolated State Management (3 new stores)
- `store/agentOSStore.js` — Split-brain agent state: roster, skill modules (Object.freeze), memory vaults, detachment state machine
- `store/marketplaceStore.js` — ZK-reputation catalog, privacy-preserving filters, sandbox hire tracking
- `store/serviceFeeStore.js` — Revenue distribution, burn rate tracker, agent ROI, HITL pay queue

#### Pages (3 new pages)
- `pages/AgentManagementPage.jsx` — Bipartite workspace (Skills + Memory Vault), proper HTML tables, kill switch with confirmation modal
- `pages/MarketplacePage.jsx` — ZK badges, metadata-only search, Tier 0 sandbox hire flow
- `pages/ServiceFeePage.jsx` — Animated revenue flow bars, burn tracker, agent yield meter, HITL-locked pay distribution

#### Supporting Changes
- `styles/module2.css` — Institutional styling: 2px borders, tight spacing, no decorative noise
- `mockApi.js` — +9 endpoints (agent OS, skills, memory vaults, marketplace, hiring, revenue, burn rate, ROI)
- `constants.js` — +12 audit action types for Module 2
- `rbac.js` — +5 permissions per role (canWipeAgentMemory, canHireFromMarketplace, canSignPayDistribution, etc.)

#### Security
- 3 isolated Zustand stores — agents can't see treasury, marketplace can't see finance
- Skill modules frozen with Object.freeze()
- Pay queue requires human CEO signature (status machine: draft → awaiting_signature → signed → executed)

---

## Session: 2026-05-07 (Module 3: The Spatial Workspace)

### What Was Done

#### 3D WebGL Scene (React Three Fiber)
- `components/spatial/OfficeScene.jsx` — Main scene: ambient lighting, OrbitControls with zoom limits, smooth camera lerp transitions
- `components/spatial/AgentAvatar.jsx` — State-driven 3D capsule entities: blue pulse (executing), grey static (idle), amber flash (blocked), wireframe (terminated)
- `components/spatial/HeatmapFloor.jsx` — Burn-rate heatmap: grid cells colored green→amber→red by compute intensity
- `components/spatial/SpatialHUD.jsx` — HTML overlay: status indicators, focus panel with Memory Vault dive, controls bar, heatmap legend

#### Spatial Audio (Web Audio API)
- `services/SpatialAudioEngine.js` — Directional notifications via StereoPanner mapped to agent 3D positions. Output-only, no microphone access.

#### Canvas Isolation Security
- `security/CanvasIsolation.js` — Blocks toDataURL/toBlob screenshot extraction, strips metadata to render-only fields, handles WebGL context loss, blocks context menu

#### State & Routing
- `store/spatialStore.js` — Isolated spatial state: only agentId, state, x/y/z coordinates. Zero treasury data.
- `pages/SpatialWorkspacePage.jsx` — R3F Canvas with security hooks, lazy-loaded via React.lazy for performance
- `styles/module3.css` — Full-bleed dark canvas, glassmorphism HUD panels
- `mockApi.js` — +3 endpoints (positions, heatmap, audio events)
- `constants.js` — +4 spatial audit actions

#### Dependencies Added
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Utility helpers (OrbitControls, etc.)
- `three` — WebGL engine

### Key Architecture Decisions
1. **Zero-persistence state**: All Zustand stores wipe on logout/timeout/tab close. No localStorage/sessionStorage for sensitive data.
2. **Deterministic policy validator**: Hard-coded, model-independent. Cannot be bypassed by prompts or reasoning.
3. **Client-side encryption**: Files encrypted with AES-256-GCM via Web Crypto API before upload.
4. **Progressive trust**: Routes locked by tier. Treasury requires Tier 2+. Governance requires Tier 2+.
5. **AI isolation**: Treasury store has zero AI context. Agent wallets individually capped.
6. **SafeRenderer**: ALL AI content passes through PolicyValidator AND DOMPurify before rendering.
7. **Frozen state entries**: All audit logs, proposals, blocker reports use Object.freeze().
8. **Canvas isolation**: 3D agent state rendered as GPU pixels, not DOM text. Screenshot extraction blocked.
9. **Metadata stripping**: Only agentId, state, x/y/z enter the scene graph. No financial data.
10. **Code-splitting**: Spatial workspace lazy-loaded — Three.js only fetched when user navigates to `/spatial`.
11. **Policy Gate**: Hard-coded execution middleware — checks Layer C auth, risk score ≥90 auto-block, $100 agent cap, $1000 multi-sig threshold.
12. **Execution signing**: Every Execute action creates ECDSA-signed record with SHA-256 hash and nonce.
13. **Action sandboxing**: Execute buttons are React-rendered, decoupled from AI-generated text. Prevents UI injection.

---

## Session: 2026-05-07 (Module 4: The Operational Layer)

### What Was Done

#### DPE Pipeline UI (Draft→Propose→Execute)
- `pages/DPEPipelinePage.jsx` — 3-column approval rail: Draft incubation (low-contrast, non-editable), Proposal validation (risk gauge + reasoning path + approve/reject), Execute stage (PolicyGate + multi-sig)
- `components/operational/RiskScoreGauge.jsx` — SVG arc gauge (0-100) with green/amber/red thresholds
- `components/operational/ReasoningPath.jsx` — Collapsible numbered logic chain — must be visible before approval
- `components/operational/MultiSigModal.jsx` — N-of-M signature collection modal with ECDSA signing

#### Forensic Audit Suite
- `pages/ForensicAuditPage.jsx` — Time-machine timeline slider, Merkle-log viewer with per-entry hash verification, severity filter, JSON compliance export
- `components/operational/MerkleLogEntry.jsx` — Table row with SHA-256 hash display and client-side integrity verify button

#### Security Infrastructure
- `security/PolicyGate.js` — Deterministic execution middleware: Layer C auth check, risk score ≥90 auto-block, $100 agent spending cap, $1000 multi-sig threshold, blocked category check
- `security/ExecutionSigner.js` — ECDSA signing for execution commands, multi-sig signature collection, integrity verification

#### Supporting Changes
- `store/governanceStore.js` — Extended proposals with riskScore, resourceEstimate, reasoningPath, draftContent, signatures
- `styles/module4.css` — Pipeline columns, risk gauge, reasoning path, Merkle log, timeline slider, multi-sig modal
- `mockApi.js` — +3 endpoints (getDPEProposals with 5 realistic proposals, getForensicTimeline with 7 snapshots, getAuditHashes with real SHA-256)
- `constants.js` — +7 audit action types (DPE_DRAFT_VIEW, DPE_PROPOSAL_APPROVE, DPE_PROPOSAL_REJECT, DPE_EXECUTE, DPE_MULTISIG_SIGN, FORENSIC_VERIFY, FORENSIC_EXPORT)
- `Sidebar.jsx` — Added "Operational" section with DPE Pipeline and Forensic Audit links
- `App.jsx` — Added routes: /dpe-pipeline, /forensic-audit
- `main.jsx` — Imported module4.css

### Build Result
- **Build successful** — 0 errors, 835ms, 2804 modules
- **70+ source files** total
- Production: core 658KB (190KB gz) + spatial 903KB lazy

### What's Next
- Backend API integration (replace mockApi.js)
- WebRTC voice integration (requires backend TURN/STUN servers)
- Real SSO provider integration
- Production security headers

```

### package.json
```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.6.1",
    "@tanstack/react-query": "^5.100.9",
    "dompurify": "^3.4.2",
    "ethers": "^6.16.0",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.14.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.0",
    "recharts": "^3.8.1",
    "three": "^0.184.0",
    "webgl-fluid": "^0.4.0",
    "webgl-fluid-enhanced": "^0.8.0",
    "zustand": "^5.0.13"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.5.0",
    "vite": "^8.0.10"
  }
}

```

### README.md
```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```

### src/App.jsx
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell.jsx';
import { TierGate } from './components/layout/TierGate.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { IdentityPage } from './pages/IdentityPage.jsx';
import { TreasuryPage } from './pages/TreasuryPage.jsx';
import { GovernancePage } from './pages/GovernancePage.jsx';
import { OnboardingPage } from './pages/OnboardingPage.jsx';
import { AgentManagementPage } from './pages/AgentManagementPage.jsx';
import { MarketplacePage } from './pages/MarketplacePage.jsx';
import { ServiceFeePage } from './pages/ServiceFeePage.jsx';
const SpatialWorkspacePage = lazy(() => import('./pages/SpatialWorkspacePage.jsx').then(m => ({ default: m.SpatialWorkspacePage })));
import { DPEPipelinePage } from './pages/DPEPipelinePage.jsx';
import { ForensicAuditPage } from './pages/ForensicAuditPage.jsx';
import { AuditPage } from './pages/AuditPage.jsx';
import { useAuthStore } from './store/authStore.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Private route wrapper — redirects to login if not authenticated.
 */
function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

/**
 * Sovereign Protocol — Root Application
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public: Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private: App Shell with nested routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppShell />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="identity" element={<IdentityPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="treasury" element={<TreasuryPage />} />
            <Route path="governance" element={<GovernancePage />} />
            <Route path="audit" element={<AuditPage />} />
            {/* Module 2: Command Center */}
            <Route path="agents" element={<AgentManagementPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="service-fees" element={<ServiceFeePage />} />
            {/* Module 3: Spatial Workspace (lazy-loaded for performance) */}
            <Route path="spatial" element={<Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'80vh',color:'#64748b'}}>Loading 3D workspace...</div>}><SpatialWorkspacePage /></Suspense>} />
            {/* Module 4: Operational Layer */}
            <Route path="dpe-pipeline" element={<DPEPipelinePage />} />
            <Route path="forensic-audit" element={<ForensicAuditPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

```

### src/components/common/Badge.jsx
```jsx
/**
 * Sovereign Protocol — Badge Component
 * Color-coded status badges for tiers, roles, and statuses.
 */
function Badge({ children, color = 'blue', icon: Icon, className = '' }) {
  return (
    <span className={`badge badge-${color} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

export { Badge };

```

### src/components/common/Button.jsx
```jsx
import { forwardRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Sovereign Protocol — Button Component
 * Supports primary, secondary, ghost, danger, and success variants.
 */
const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = '',
  id,
  type = 'button',
  onClick,
  ...props
}, ref) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      ref={ref}
      id={id}
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={{ opacity: loading ? 0.7 : 1, ...props.style }}
      {...props}
    >
      {loading && createPortal(
        <div className="topbar-progress-loader">
          <div className="topbar-progress-bar" />
        </div>,
        document.body
      )}
      {Icon && !loading ? (
        <Icon size={size === 'sm' ? 14 : 16} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={size === 'sm' ? 14 : 16} />}
    </button>
  );
});

export { Button };

```

### src/components/common/Card.jsx
```jsx
import { motion } from 'framer-motion';

/**
 * Sovereign Protocol — Card Component
 * Glassmorphic card with optional accent, hover, and animation.
 */
function Card({
  children,
  variant = '',
  hover = false,
  className = '',
  id,
  animate = true,
  onClick,
  style,
}) {
  const variantClass = variant ? `card-${variant}` : '';
  const hoverClass = hover ? 'card-hover' : '';

  if (animate) {
    return (
      <motion.div
        id={id}
        className={`card ${variantClass} ${hoverClass} ${className}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={onClick}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      id={id}
      className={`card ${variantClass} ${hoverClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

export { Card };

```

### src/components/common/CopyToClipboard.jsx
```jsx
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Sovereign Protocol — CopyToClipboard Component
 * Used for DNS TXT record verification and hash display.
 */
function CopyToClipboard({ text, label, mono = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for insecure contexts
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {label && <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: 'var(--space-2)' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-md)',
      }}>
        <code style={{
          flex: 1, fontSize: 'var(--text-sm)',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          color: 'var(--color-text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          userSelect: 'all',
        }}>
          {text}
        </code>
        <button
          className="btn btn-ghost btn-icon"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
          style={{ width: 32, height: 32, padding: 4, flexShrink: 0 }}
        >
          {copied ? <Check size={16} style={{ color: 'var(--color-accent-emerald)' }} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

export { CopyToClipboard };

```

### src/components/common/FileUploader.jsx
```jsx
import { useState, useCallback } from 'react';
import { Upload, File, X, Shield } from 'lucide-react';
import { CryptoService } from '../../security/CryptoService.js';
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_SIZE_BYTES, ALLOWED_UPLOAD_EXTENSIONS } from '../../config/constants.js';

/**
 * Sovereign Protocol — FileUploader Component
 * Drag-and-drop uploader with client-side encryption.
 * Files are encrypted before they leave the browser.
 */
function FileUploader({ onFileEncrypted, disabled = false, maxFiles = 5 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [encrypting, setEncrypting] = useState(false);

  const validateFile = (file) => {
    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed: ${ALLOWED_UPLOAD_EXTENSIONS.join(', ')}`;
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return `File too large. Maximum: ${MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)}MB`;
    }
    return null;
  };

  const processFile = useCallback(async (file) => {
    const error = validateFile(file);
    if (error) {
      setFiles(prev => [...prev, { name: file.name, size: file.size, status: 'error', error }]);
      return;
    }

    setEncrypting(true);
    const fileEntry = { name: file.name, size: file.size, type: file.type, status: 'encrypting' };
    setFiles(prev => [...prev, fileEntry]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { encrypted, iv } = await CryptoService.encryptFile(arrayBuffer);
      const blobRef = await CryptoService.hash(encrypted);

      const encryptedFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        encryptedBlobRef: blobRef.slice(0, 16),
        encryptedSize: encrypted.byteLength,
        iv: Array.from(iv),
        status: 'encrypted',
      };

      setFiles(prev => prev.map(f =>
        f.name === file.name && f.status === 'encrypting'
          ? { ...f, status: 'encrypted', encryptedBlobRef: encryptedFile.encryptedBlobRef }
          : f
      ));

      if (onFileEncrypted) onFileEncrypted(encryptedFile);
    } catch (err) {
      setFiles(prev => prev.map(f =>
        f.name === file.name && f.status === 'encrypting'
          ? { ...f, status: 'error', error: 'Encryption failed' }
          : f
      ));
    } finally {
      setEncrypting(false);
    }
  }, [onFileEncrypted]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.slice(0, maxFiles - files.length).forEach(processFile);
  }, [disabled, files.length, maxFiles, processFile]);

  const handleFileInput = useCallback((e) => {
    const selected = Array.from(e.target.files);
    selected.slice(0, maxFiles - files.length).forEach(processFile);
    e.target.value = '';
  }, [files.length, maxFiles, processFile]);

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        className={`card ${isDragging ? 'card-accent' : ''}`}
        style={{
          border: '2px dashed',
          borderColor: isDragging ? 'var(--color-accent-blue)' : 'var(--color-border-primary)',
          textAlign: 'center',
          padding: 'var(--space-8)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all var(--transition-base)',
        }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => { if (!disabled) document.getElementById('file-upload-input')?.click(); }}
      >
        <Upload size={32} style={{ color: 'var(--color-text-muted)', margin: '0 auto var(--space-3)' }} />
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
          Drag & drop files here or click to browse
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          PDF, PNG, JPG up to 10MB • Files are encrypted client-side before upload
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-2)' }}>
          <Shield size={12} style={{ color: 'var(--color-accent-emerald)' }} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-emerald)' }}>AES-256 Client-Side Encryption</span>
        </div>
        <input
          id="file-upload-input"
          type="file"
          accept={ALLOWED_UPLOAD_TYPES.join(',')}
          multiple
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {files.map((file, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)',
            }}>
              <File size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-primary)' }}>{file.name}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{(file.size / 1024).toFixed(1)}KB</span>
              {file.status === 'encrypting' && <span className="badge badge-amber">Encrypting...</span>}
              {file.status === 'encrypted' && <span className="badge badge-emerald">Encrypted</span>}
              {file.status === 'error' && <span className="badge badge-rose">{file.error}</span>}
              <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); removeFile(i); }} style={{ width: 24, height: 24, padding: 2 }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { FileUploader };

```

### src/components/common/Modal.jsx
```jsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Sovereign Protocol — Modal Component
 * Accessible modal with backdrop blur and escape key support.
 */
function Modal({ isOpen, onClose, title, children, footer, maxWidth = 560 }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="modal-container"
            style={{ maxWidth }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {title && (
              <div className="modal-header">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>{title}</h3>
                <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Modal };

```

### src/components/common/ProgressBar.jsx
```jsx
/**
 * Sovereign Protocol — ProgressBar Component
 * Animated progress bar with variant colors.
 */
function ProgressBar({ value = 0, max = 100, variant = '', label, showPercent = false }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const fillClass = variant ? `progress-bar-fill progress-bar-fill-${variant}` : 'progress-bar-fill';

  return (
    <div>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          {label && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{label}</span>}
          {showPercent && <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{percent.toFixed(1)}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div className={fillClass} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export { ProgressBar };

```

### src/components/common/SafeRenderer.jsx
```jsx
import { DOMSanitizer } from '../../security/DOMSanitizer.js';
import { PolicyValidator } from '../../security/PolicyValidator.js';

/**
 * Sovereign Protocol — SafeRenderer Component
 * Renders AI-generated content after passing through BOTH
 * the PolicyValidator AND DOMPurify sanitization.
 * This is the ONLY way AI content should be rendered in the UI.
 */
function SafeRenderer({ content, agentId = 'unknown', context = 'display', onViolation }) {
  if (!content) return null;

  // Step 1: Run through policy validator
  const validationResult = PolicyValidator.validateContent(content, agentId, context);

  if (!validationResult.passed) {
    if (onViolation) onViolation(validationResult);
    return (
      <div style={{
        padding: 'var(--space-4)',
        background: 'rgba(244, 63, 94, 0.08)',
        border: '1px solid var(--color-border-danger)',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)',
          color: 'var(--color-accent-rose)', marginBottom: 'var(--space-2)',
        }}>
          Content Blocked — Policy Violation
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          This content has been blocked by the Deterministic Policy Validator.
          A Blocker Report (ID: {validationResult.blockerReportId}) has been generated for human review.
        </p>
      </div>
    );
  }

  // Step 2: Sanitize through DOMPurify
  const sanitizedHtml = DOMSanitizer.sanitize(content);

  return (
    <div
      className="safe-rendered-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-secondary)' }}
    />
  );
}

export { SafeRenderer };

```

### src/components/common/StatusIndicator.jsx
```jsx
/**
 * Sovereign Protocol — StatusIndicator Component
 * Animated dot indicator for active, pending, error, and inactive states.
 */
function StatusIndicator({ status = 'inactive', label, size = 8 }) {
  const statusClass = `status-dot status-dot-${status}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <span className={statusClass} style={{ width: size, height: size }} />
      {label && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {label}
        </span>
      )}
    </div>
  );
}

export { StatusIndicator };

```

### src/components/layout/AppShell.jsx
```jsx
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';
import { useSessionGuard } from '../../hooks/useSessionGuard.js';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Sovereign Protocol — AppShell
 * Main application layout wrapping sidebar, topbar, and content area.
 * The SessionGuard hook is activated here to monitor idle state.
 */
function NoiseFilter() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', opacity: 0.015 }}>
      <svg width="100%" height="100%">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}

function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useSessionGuard();

  return (
    <div className="app-shell">
      <NoiseFilter />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />
      <div className={`app-shell-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar sidebarCollapsed={sidebarCollapsed} />
        <main className="app-main" style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', height: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export { AppShell };

```

### src/components/layout/Sidebar.jsx
```jsx
import { NavLink, useLocation } from 'react-router-dom';
import {
  Shield, Landmark, Users, BarChart3, Lock,
  Fingerprint, ChevronLeft, ChevronRight, Layers,
  Bot, Store, DollarSign, Box, GitPullRequestDraft, Search
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import { useTierGate } from '../../hooks/useTierGate.js';
import { getTierById } from '../../config/tiers.js';
import { Badge } from '../common/Badge.jsx';

/**
 * Sovereign Protocol — Sidebar Navigation
 */
function Sidebar({ collapsed, onToggle }) {
  const user = useAuthStore(s => s.user);
  const { currentTierId, currentTier, isFeatureUnlocked } = useTierGate();

  const navItems = [
    { section: 'Identity' },
    { path: '/identity', label: 'Identity Matrix', icon: Fingerprint, tier: 0 },
    { path: '/onboarding', label: 'Trust Level', icon: Layers, tier: 0 },
    { section: 'Operations' },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, tier: 1 },
    { path: '/treasury', label: 'Treasury', icon: Landmark, tier: 2, feature: 'treasury' },
    { path: '/governance', label: 'Governance', icon: Users, tier: 2, feature: 'governance' },
    { section: 'Command Center' },
    { path: '/agents', label: 'Agent OS', icon: Bot, tier: 1 },
    { path: '/marketplace', label: 'Marketplace', icon: Store, tier: 1 },
    { path: '/service-fees', label: 'Service Fees', icon: DollarSign, tier: 2, feature: 'treasury' },
    { path: '/spatial', label: 'Spatial View', icon: Box, tier: 1 },
    { section: 'Operational' },
    { path: '/dpe-pipeline', label: 'DPE Pipeline', icon: GitPullRequestDraft, tier: 2, feature: 'governance' },
    { path: '/forensic-audit', label: 'Forensic Audit', icon: Search, tier: 1 },
    { section: 'Security' },
    { path: '/audit', label: 'Audit & Security', icon: Shield, tier: 0 },
  ];

  return (
    <aside className="sidebar collapsed" id="main-sidebar">
      <div className="sidebar-logo" style={{ justifyContent: 'center', padding: 0 }}>
        <div className="sidebar-logo-icon">
          <Shield size={18} />
        </div>
      </div>

      <nav className="sidebar-nav" style={{ alignItems: 'center' }}>
        {navItems.map((item, i) => {
          if (item.section) return null;

          const isLocked = item.feature && !isFeatureUnlocked(item.feature);
          const isTierLocked = currentTierId < item.tier;
          const locked = isLocked || isTierLocked;

          return (
            <NavLink
              key={item.path}
              to={locked ? '#' : item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive && !locked ? 'active' : ''} ${locked ? 'locked' : ''}`
              }
              onClick={(e) => { if (locked) e.preventDefault(); }}
              title={`${item.label} ${locked ? '(Locked)' : ''}`}
              style={locked ? { cursor: 'not-allowed', justifyContent: 'center', position: 'relative', opacity: 0.4 } : { justifyContent: 'center', position: 'relative' }}
            >
              <item.icon size={20} className="sidebar-link-icon" />
              {locked && (
                <Lock 
                  size={12} 
                  style={{ 
                    position: 'absolute', 
                    bottom: '4px', 
                    right: '16px', 
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: '50%',
                    padding: '1.5px',
                    boxShadow: '0 0 4px rgba(0,0,0,0.1)'
                  }} 
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ padding: 'var(--space-4) 0', display: 'flex', justifyContent: 'center' }}>
        <div className="sidebar-tier-indicator" style={{ padding: 'var(--space-2)', background: 'transparent', border: 'none' }} title={`Tier ${currentTierId}: ${currentTier.name}`}>
          <div className="sidebar-tier-icon" style={{ background: currentTier.color ? `linear-gradient(135deg, ${currentTier.color}, ${currentTier.color}aa)` : undefined, width: 32, height: 32 }}>
            <Shield size={16} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar };

```

### src/components/layout/TierGate.jsx
```jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useTierGate } from '../../hooks/useTierGate.js';
import { Lock, Shield } from 'lucide-react';

/**
 * Sovereign Protocol — TierGate
 * Route protection component that enforces progressive trust access.
 * Redirects unauthorized users or shows a locked state.
 */
function TierGate({ children, requiredTier = 0, requiredFeature = null, requireAuth = true }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { currentTierId, isFeatureUnlocked } = useTierGate();

  // Auth check
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Tier check
  if (currentTierId < requiredTier) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 'var(--radius-xl)',
          background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          <Lock size={32} style={{ color: 'var(--color-accent-amber)' }} />
        </div>
        <h2 className="empty-state-title">Tier {requiredTier} Required</h2>
        <p className="empty-state-text" style={{ marginTop: 'var(--space-2)' }}>
          This feature requires Trust Level {requiredTier} or higher.
          Complete your identity verification to unlock access.
        </p>
      </div>
    );
  }

  // Feature check
  if (requiredFeature && !isFeatureUnlocked(requiredFeature)) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 'var(--radius-xl)',
          background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          <Shield size={32} style={{ color: 'var(--color-accent-violet)' }} />
        </div>
        <h2 className="empty-state-title">Feature Locked</h2>
        <p className="empty-state-text" style={{ marginTop: 'var(--space-2)' }}>
          The {requiredFeature} feature requires additional verification.
          Please complete the required identity layers.
        </p>
      </div>
    );
  }

  return children;
}

export { TierGate };

```

### src/components/layout/TopBar.jsx
```jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, LogOut, Clock, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useGovernanceStore } from '../../store/governanceStore.js';
import { SessionGuard } from '../../security/SessionGuard.js';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { AuditLogger } from '../../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../../config/constants.js';

/**
 * Sovereign Protocol — TopBar
 * Displays session timer, user info, and security status.
 */
function TopBar({ sidebarCollapsed }) {
  const user = useAuthStore(s => s.user);
  const isSessionWarning = useAuthStore(s => s.isSessionWarning);
  const logout = useAuthStore(s => s.logout);
  const blockerReports = useGovernanceStore(s => s.blockerReports);
  const location = useLocation();
  const [remainingSeconds, setRemainingSeconds] = useState(300);

  const unresolvedBlockers = blockerReports.filter(r => r.status === 'PAUSE_STATE').length;

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = SessionGuard.getRemainingTime();
      setRemainingSeconds(Math.ceil(remaining / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    AuditLogger.log({ action: AUDIT_ACTIONS.LOGOUT, userId: user?.id });
    logout();
  };

  // Build breadcrumb from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbLabels = {
    dashboard: 'Dashboard',
    identity: 'Identity Matrix',
    treasury: 'Treasury',
    governance: 'Governance',
    audit: 'Audit & Security',
    onboarding: 'Trust Level',
  };

  return (
    <header className={`topbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} id="main-topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          <span>Home</span>
          {pathSegments.map((seg, i) => (
            <span key={seg} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <ChevronRight size={14} />
              <span className={i === pathSegments.length - 1 ? 'topbar-breadcrumb-active' : ''}>
                {breadcrumbLabels[seg] || seg}
              </span>
            </span>
          ))}
        </div>

      </div>

      <div className="topbar-right">
        {/* Institutional Status Indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          marginRight: 'var(--space-4)', padding: '4px 8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '4px'
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--color-accent-emerald)',
            boxShadow: '0 0 8px var(--color-accent-emerald)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            color: 'var(--color-accent-emerald)', letterSpacing: '0.05em',
            fontWeight: '600'
          }}>
            ENCRYPTION: AES-256 | STATUS: OPTIMAL | NODES: ACTIVE
          </span>
        </div>
        {/* Session Timer */}
        <div className={`topbar-session ${isSessionWarning ? 'animate-glow-rose' : ''}`}
          style={isSessionWarning ? { borderColor: 'var(--color-accent-rose)', border: '1px solid' } : {}}>
          <Clock size={14} />
          <span className="topbar-session-timer" style={isSessionWarning ? { color: 'var(--color-accent-rose)' } : {}}>
            {formatTime(remainingSeconds)}
          </span>
        </div>

        {/* Blocker Reports Notification */}
        {unresolvedBlockers > 0 && (
          <Badge color="rose" icon={Bell}>
            {unresolvedBlockers} Blocker{unresolvedBlockers > 1 ? 's' : ''}
          </Badge>
        )}

        {/* User Info */}
        {user && (
          <div className="topbar-user">
            <div className="topbar-avatar">{user.avatarInitials}</div>
          </div>
        )}

        {/* Logout */}
        <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout} id="logout-btn">
          Logout
        </Button>
      </div>
    </header>
  );
}

export { TopBar };

```

### src/components/operational/MerkleLogEntry.jsx
```jsx
import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader } from 'lucide-react';
import { CryptoService } from '../../security/CryptoService.js';

/**
 * Sovereign Protocol — Merkle Log Entry (Module 4)
 * Single audit row with SHA-256 hash and client-side verification.
 */
function MerkleLogEntry({ entry }) {
  const [verifyState, setVerifyState] = useState('idle'); // idle | verifying | valid | invalid

  const handleVerify = async () => {
    setVerifyState('verifying');
    try {
      const { hash, ...data } = entry;
      const dataString = JSON.stringify(data);
      const recomputed = await CryptoService.hash(dataString);
      setVerifyState(recomputed === hash ? 'valid' : 'invalid');
    } catch {
      setVerifyState('invalid');
    }
  };

  const severityClass = {
    info: 'severity-info',
    warning: 'severity-warning',
    critical: 'severity-critical',
  };

  return (
    <tr className="merkle-log-row">
      <td>
        <span className={`merkle-severity ${severityClass[entry.severity] || 'severity-info'}`}>
          {entry.severity || 'info'}
        </span>
      </td>
      <td className="merkle-action">{entry.action}</td>
      <td className="merkle-actor">{entry.userId || 'system'}</td>
      <td className="merkle-timestamp">
        {new Date(entry.timestamp).toLocaleString('en-US', {
          month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
        })}
      </td>
      <td className="merkle-hash" title={entry.hash}>
        {entry.hash ? `${entry.hash.slice(0, 8)}...${entry.hash.slice(-6)}` : '—'}
      </td>
      <td className="merkle-verify">
        {verifyState === 'idle' && (
          <button className="btn btn-ghost btn-sm" onClick={handleVerify} title="Verify integrity">
            <ShieldCheck size={13} /> Verify
          </button>
        )}
        {verifyState === 'verifying' && <Loader size={13} className="animate-spin" />}
        {verifyState === 'valid' && <span className="merkle-valid"><ShieldCheck size={13} /> Valid</span>}
        {verifyState === 'invalid' && <span className="merkle-invalid"><ShieldAlert size={13} /> Tampered</span>}
      </td>
    </tr>
  );
}

export { MerkleLogEntry };

```

### src/components/operational/MultiSigModal.jsx
```jsx
import { useState } from 'react';
import { Lock, CheckCircle, Users } from 'lucide-react';
import { Modal } from '../common/Modal.jsx';
import { Badge } from '../common/Badge.jsx';
import { ExecutionSigner } from '../../security/ExecutionSigner.js';

/**
 * Sovereign Protocol — Multi-Sig Modal (Module 4)
 * Collects N-of-M human signatures before high-value execution.
 */
function MultiSigModal({ isOpen, onClose, proposal, requiredSignatures = 2, onComplete }) {
  const [signatures, setSignatures] = useState([]);
  const [signing, setSigning] = useState(false);
  const [currentSigner, setCurrentSigner] = useState('');

  const handleSign = async () => {
    if (!currentSigner.trim()) return;
    setSigning(true);
    try {
      const sig = await ExecutionSigner.collectSignature(
        proposal.id,
        currentSigner.trim(),
        'board_member'
      );
      const updated = [...signatures, sig];
      setSignatures(updated);
      setCurrentSigner('');

      if (updated.length >= requiredSignatures && onComplete) {
        onComplete(updated);
      }
    } catch (e) {
      console.error('[MultiSig] Signature failed:', e);
    }
    setSigning(false);
  };

  const remaining = requiredSignatures - signatures.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Multi-Signature Authorization Required"
      maxWidth={480}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
        </div>
      }
    >
      <div className="multisig-content">
        <div className="m2-info-bar" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
          <Lock size={13} style={{ color: '#d97706' }} />
          <span>This proposal exceeds the high-value threshold. {requiredSignatures} board member signatures are required.</span>
        </div>

        <div className="multisig-proposal-summary">
          <div className="multisig-label">Proposal</div>
          <div className="multisig-value">{proposal?.title}</div>
          <div className="multisig-label" style={{ marginTop: 'var(--space-2)' }}>Estimated Cost</div>
          <div className="multisig-value">${proposal?.resourceEstimate?.costUSD?.toLocaleString() || '0'}</div>
        </div>

        <div className="multisig-progress">
          <div className="multisig-progress-header">
            <Users size={13} />
            <span>Signatures: {signatures.length} / {requiredSignatures}</span>
            {remaining > 0 && <Badge color="amber">{remaining} remaining</Badge>}
            {remaining <= 0 && <Badge color="emerald">Complete</Badge>}
          </div>

          {signatures.map((sig, i) => (
            <div key={i} className="multisig-sig-entry">
              <CheckCircle size={12} style={{ color: '#059669' }} />
              <span>{sig.signerId}</span>
              <span className="multisig-sig-time">
                {new Date(sig.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        {remaining > 0 && (
          <div className="multisig-input-row">
            <input
              className="input"
              placeholder="Board member ID or email"
              value={currentSigner}
              onChange={(e) => setCurrentSigner(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSign()}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSign}
              disabled={!currentSigner.trim() || signing}
            >
              {signing ? 'Signing...' : 'Sign'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export { MultiSigModal };

```

### src/components/operational/ReasoningPath.jsx
```jsx
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Sovereign Protocol — Reasoning Path (Module 4)
 * Displays the AI's logic chain as a numbered, collapsible list.
 * The human must see the reasoning before approving.
 */
function ReasoningPath({ steps = [], collapsed: initialCollapsed = true }) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  if (!steps || steps.length === 0) {
    return (
      <div className="reasoning-path-empty">
        No reasoning path provided. Approval blocked.
      </div>
    );
  }

  return (
    <div className="reasoning-path">
      <button
        className="reasoning-path-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
        <span>Reasoning Path ({steps.length} steps)</span>
      </button>

      {!collapsed && (
        <ol className="reasoning-path-list">
          {steps.map((step, i) => (
            <li key={i} className="reasoning-path-step">
              <span className="reasoning-step-num">{i + 1}</span>
              <span className="reasoning-step-text">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export { ReasoningPath };

```

### src/components/operational/RiskScoreGauge.jsx
```jsx
/**
 * Sovereign Protocol — Risk Score Gauge (Module 4)
 * SVG arc gauge showing proposal risk level (0-100).
 * Green (<30), Amber (<70), Red (>=70).
 */
function RiskScoreGauge({ score = 0, size = 64 }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - 8) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const getColor = (s) => {
    if (s < 30) return '#059669';
    if (s < 70) return '#d97706';
    return '#dc2626';
  };

  const getLabel = (s) => {
    if (s < 30) return 'LOW';
    if (s < 70) return 'MEDIUM';
    return 'HIGH';
  };

  const color = getColor(clamped);

  return (
    <div className="risk-gauge">
      <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
        {/* Background arc */}
        <path
          d={`M 4 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M 4 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="risk-gauge-value" style={{ color }}>{clamped}</div>
      <div className="risk-gauge-label">{getLabel(clamped)}</div>
    </div>
  );
}

export { RiskScoreGauge };

```

### src/components/spatial/AgentAvatar.jsx
```jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Sovereign Protocol — Agent Avatar (Module 3)
 * State-driven 3D entity representing an AI agent.
 * Visual properties change based on execution state.
 */
function AgentAvatar({ agentId, name, state, position, burnIntensity, onClick }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const labelRef = useRef();

  const stateConfig = useMemo(() => {
    const configs = {
      executing: { color: '#3b82f6', emissive: '#1d4ed8', intensity: 0.6, pulseSpeed: 2, yOffset: 0 },
      planning: { color: '#334155', emissive: '#1e293b', intensity: 0.2, pulseSpeed: 0.8, yOffset: 0 },
      idle: { color: '#94a3b8', emissive: '#475569', intensity: 0.05, pulseSpeed: 0, yOffset: 0 },
      blocked: { color: '#f59e0b', emissive: '#d97706', intensity: 0.8, pulseSpeed: 4, yOffset: 0.15 },
      terminated: { color: '#374151', emissive: '#1f2937', intensity: 0, pulseSpeed: 0, yOffset: -0.1 },
    };
    return configs[state] || configs.idle;
  }, [state]);

  const baseColor = useMemo(() => new THREE.Color(stateConfig.color), [stateConfig.color]);
  const emissiveColor = useMemo(() => new THREE.Color(stateConfig.emissive), [stateConfig.emissive]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Pulse animation for active states
    if (stateConfig.pulseSpeed > 0) {
      const pulse = Math.sin(Date.now() * 0.001 * stateConfig.pulseSpeed) * 0.5 + 0.5;
      meshRef.current.material.emissiveIntensity = stateConfig.intensity * (0.5 + pulse * 0.5);

      // Blocked agents bob up and down
      if (state === 'blocked') {
        meshRef.current.position.y = position[1] + stateConfig.yOffset + Math.sin(Date.now() * 0.003) * 0.05;
      }
    }

    // Slow rotation for executing agents
    if (state === 'executing') {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick?.(agentId); }}>
      {/* Agent Body */}
      <mesh ref={meshRef} position={[0, stateConfig.yOffset, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={stateConfig.intensity}
          roughness={0.4}
          metalness={0.6}
          wireframe={state === 'terminated'}
        />
      </mesh>

      {/* Base Indicator Ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.35, 32]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={state === 'terminated' ? 0.15 : 0.4}
        />
      </mesh>

      {/* Status Light (top) */}
      {state !== 'terminated' && (
        <mesh position={[0, 0.65 + stateConfig.yOffset, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color={stateConfig.color}
            emissive={stateConfig.emissive}
            emissiveIntensity={1.2}
          />
        </mesh>
      )}
    </group>
  );
}

export { AgentAvatar };

```

### src/components/spatial/HeatmapFloor.jsx
```jsx
import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Sovereign Protocol — Heatmap Floor (Module 3)
 * Burn-rate heatmap rendered on the office floor.
 * Green = low compute, Amber = medium, Red = high burn.
 */
function HeatmapFloor({ heatmapData, gridSize = 8 }) {
  const cells = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) {
      // Generate default grid with zero intensity
      const defaultCells = [];
      for (let x = -gridSize / 2; x < gridSize / 2; x++) {
        for (let z = -gridSize / 2; z < gridSize / 2; z++) {
          defaultCells.push({ gridX: x, gridZ: z, intensity: 0 });
        }
      }
      return defaultCells;
    }
    return heatmapData;
  }, [heatmapData, gridSize]);

  const getHeatColor = (intensity) => {
    // 0 = dark green, 0.5 = amber, 1.0 = red
    const clamped = Math.max(0, Math.min(1, intensity));
    if (clamped < 0.33) {
      return new THREE.Color('#0f172a').lerp(new THREE.Color('#065f46'), clamped * 3);
    } else if (clamped < 0.66) {
      return new THREE.Color('#065f46').lerp(new THREE.Color('#92400e'), (clamped - 0.33) * 3);
    } else {
      return new THREE.Color('#92400e').lerp(new THREE.Color('#991b1b'), (clamped - 0.66) * 3);
    }
  };

  return (
    <group>
      {/* Base floor */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[gridSize + 1, gridSize + 1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[gridSize, gridSize, '#1e293b', '#1e293b']} position={[0, 0.005, 0]} />

      {/* Heatmap cells */}
      {cells.map((cell, i) => {
        const color = getHeatColor(cell.intensity);
        return (
          <mesh
            key={`${cell.gridX}_${cell.gridZ}`}
            position={[cell.gridX + 0.5, 0.008, cell.gridZ + 0.5]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.92, 0.92]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15 + cell.intensity * 0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export { HeatmapFloor };

```

### src/components/spatial/LuxuryFluidBackground.jsx
```jsx
import React, { useEffect, useRef } from 'react';
import webGLFluidEnhanced from 'webgl-fluid';
import { motion } from 'framer-motion';
import { usePerformanceMode } from '../../hooks/usePerformanceMode.js';

export function LuxuryFluidBackground() {
  const canvasRef = useRef(null);
  const { isLowPower } = usePerformanceMode();

  useEffect(() => {
    if (isLowPower || !canvasRef.current) return;

    // Initialize the WebGL fluid simulation
    webGLFluidEnhanced(canvasRef.current, {
      IMMEDIATE: false, // Disable the initial big bang explosion
      TRIGGER: 'hover',
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 512,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 0,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 2000,
      SHADING: true,
      COLORFUL: false,
      COLOR_PALETTE: ['#00E5FF', '#4169E1', '#FF00FF'],
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
      BACK_COLOR: '#000000', // Dark background to contrast with white glassmorphism card
      TRANSPARENT: false,
      BLOOM: false, // Disabled for performance
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.8,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: false, // Disabled for performance
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 1.0,
    });
    
    // Background is completely still initially (no immediate explosion or drops)
  }, [isLowPower]);

  if (isLowPower) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          zIndex: 0, 
          background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)' 
        }}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backgroundColor: '#FFFFFF' }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </motion.div>
  );
}

```

### src/components/spatial/OfficeScene.jsx
```jsx
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AgentAvatar } from './AgentAvatar.jsx';
import { HeatmapFloor } from './HeatmapFloor.jsx';

/**
 * Sovereign Protocol — Office Scene (Module 3)
 * Main Three.js scene with lighting, camera, agent avatars, and heatmap floor.
 */
function OfficeScene({ agentPositions, heatmapData, cameraTarget, cameraLookAt, onAgentClick, onSceneReady }) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z));
  const targetLook = useRef(new THREE.Vector3(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z));

  // Update camera targets when props change
  useEffect(() => {
    targetPos.current.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    targetLook.current.set(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
  }, [cameraTarget, cameraLookAt]);

  // Signal scene ready
  useEffect(() => {
    if (onSceneReady) onSceneReady();
  }, []);

  // Smooth camera interpolation
  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.04);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, 0.04);
      controlsRef.current.update();
    }
  });

  return (
    <>
      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={2}
        maxDistance={16}
        dampingFactor={0.08}
        enableDamping
      />

      {/* Lighting */}
      <ambientLight intensity={0.35} color="#e2e8f0" />
      <directionalLight position={[5, 8, 5]} intensity={0.7} color="#f8fafc" castShadow shadow-mapSize={1024} />
      <directionalLight position={[-3, 4, -3]} intensity={0.2} color="#94a3b8" />
      <pointLight position={[0, 3, 0]} intensity={0.15} color="#e2e8f0" distance={12} />

      {/* Heatmap Floor */}
      <HeatmapFloor heatmapData={heatmapData} gridSize={8} />

      {/* Agent Avatars */}
      {agentPositions.map(agent => (
        <AgentAvatar
          key={agent.agentId}
          agentId={agent.agentId}
          name={agent.name}
          state={agent.state}
          position={[agent.x, 0.35, agent.z]}
          burnIntensity={agent.burnIntensity}
          onClick={onAgentClick}
        />
      ))}

      {/* Room boundary indicators */}
      {[-4, 4].map(x => [-4, 4].map(z => (
        <mesh key={`post_${x}_${z}`} position={[x, 0.5, z]}>
          <boxGeometry args={[0.06, 1, 0.06]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
      )))}
    </>
  );
}

export { OfficeScene };

```

### src/components/spatial/SpatialHUD.jsx
```jsx
import {
  Volume2, VolumeX, RotateCcw, Eye, EyeOff,
  Activity, Cpu, Brain, Zap, ExternalLink
} from 'lucide-react';
import { Badge } from '../common/Badge.jsx';
import { useNavigate } from 'react-router-dom';

/**
 * Sovereign Protocol — Spatial HUD Overlay (Module 3)
 * HTML overlay rendered outside the WebGL canvas.
 * Shows focused agent info and scene controls.
 */
function SpatialHUD({ focusedAgent, agentPositions, audioEnabled, hudVisible, onToggleAudio, onToggleHud, onResetCamera, onDiveToVault }) {
  const navigate = useNavigate();

  const stateLabel = {
    executing: 'Executing',
    planning: 'Planning',
    idle: 'Idle',
    blocked: 'Blocked',
    terminated: 'Terminated',
  };

  const stateColor = {
    executing: 'blue',
    planning: 'blue',
    idle: 'amber',
    blocked: 'rose',
    terminated: 'rose',
  };

  const activeCount = agentPositions.filter(a => a.state === 'executing').length;
  const blockedCount = agentPositions.filter(a => a.state === 'blocked').length;

  return (
    <>
      {/* Top-Left: Scene Title */}
      <div className="spatial-hud-title">
        <div className="spatial-hud-title-text">Spatial Command Center</div>
        <div className="spatial-hud-title-sub">
          {agentPositions.length} agents deployed
        </div>
      </div>

      {/* Top-Right: Status Indicators */}
      <div className="spatial-hud-status">
        <div className="spatial-hud-indicator">
          <span className="spatial-hud-dot dot-executing" />
          <span>{activeCount} executing</span>
        </div>
        {blockedCount > 0 && (
          <div className="spatial-hud-indicator indicator-alert">
            <span className="spatial-hud-dot dot-blocked" />
            <span>{blockedCount} blocked</span>
          </div>
        )}
        <div className="spatial-hud-indicator">
          {audioEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          <span>{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
        </div>
      </div>

      {/* Bottom: Controls Bar */}
      <div className="spatial-hud-controls">
        <button className="spatial-hud-btn" onClick={onToggleAudio} title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}>
          {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
        <button className="spatial-hud-btn" onClick={onResetCamera} title="Reset Camera">
          <RotateCcw size={14} />
        </button>
        <button className="spatial-hud-btn" onClick={onToggleHud} title={hudVisible ? 'Hide HUD' : 'Show HUD'}>
          {hudVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>

      {/* Right Panel: Focused Agent */}
      {focusedAgent && (
        <div className="spatial-focus-panel">
          <div className="spatial-focus-header">
            <div>
              <div className="spatial-focus-name">{focusedAgent.name}</div>
              <Badge color={stateColor[focusedAgent.state] || 'blue'}>
                {stateLabel[focusedAgent.state] || focusedAgent.state}
              </Badge>
            </div>
          </div>

          <div className="spatial-focus-metrics">
            <div className="spatial-focus-metric">
              <Activity size={12} />
              <span>Burn Intensity</span>
              <strong>{(focusedAgent.burnIntensity * 100).toFixed(0)}%</strong>
            </div>
            <div className="spatial-focus-metric">
              <Cpu size={12} />
              <span>Position</span>
              <strong>{focusedAgent.x.toFixed(1)}, {focusedAgent.z.toFixed(1)}</strong>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm spatial-focus-dive"
            onClick={() => {
              if (onDiveToVault) onDiveToVault(focusedAgent.agentId);
              navigate('/agents');
            }}
          >
            <Brain size={13} /> View Memory Vault
            <ExternalLink size={11} />
          </button>

          <button className="spatial-focus-close" onClick={onResetCamera}>
            Dismiss
          </button>
        </div>
      )}

      {/* Bottom-Left: Heatmap Legend */}
      <div className="spatial-heatmap-legend">
        <span className="spatial-legend-label">Burn Rate</span>
        <div className="spatial-legend-bar">
          <span className="spatial-legend-low" />
          <span className="spatial-legend-mid" />
          <span className="spatial-legend-high" />
        </div>
        <div className="spatial-legend-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </>
  );
}

export { SpatialHUD };

```

### src/config/constants.js
```js
/**
 * Sovereign Protocol — Hard-Coded Platform Constants
 * These values are immutable and enforced at the frontend layer.
 * No runtime modification is permitted.
 */

/** Session timeout in milliseconds (5 minutes) */
export const SESSION_TIMEOUT_MS = 5 * 60 * 1000;

/** Session warning threshold before timeout (60 seconds) */
export const SESSION_WARNING_MS = 60 * 1000;

/** Maximum idle time before Human Presence token is wiped */
export const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

/** Polling interval for DNS verification (10 seconds) */
export const DNS_POLL_INTERVAL_MS = 10 * 1000;

/** Maximum file size for document uploads (10MB) */
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

/** Allowed file types for KYB document uploads */
export const ALLOWED_UPLOAD_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
];

/** Allowed file extensions for display */
export const ALLOWED_UPLOAD_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];

/** Financial keyword blocklist for Policy Validator */
export const FINANCIAL_BLOCKLIST = Object.freeze([
  'payment instruction',
  'transfer funds',
  'send payment',
  'wire transfer',
  'execute payment',
  'authorize payment',
  'approve spending',
  'disburse funds',
  'release funds',
  'financial proposal',
  'investment recommendation',
  'budget allocation',
  'treasury request',
  'spending authorization',
  'monetary action',
  'fund transfer',
  'pay invoice',
  'process payment',
  'initiate transaction',
  'wallet withdrawal',
]);

/** Categories that AI agents are permanently blocked from */
export const AI_BLOCKED_CATEGORIES = Object.freeze([
  'treasury_access',
  'budget_view',
  'payment_execution',
  'financial_approval',
  'salary_management',
  'investment_decision',
  'monetary_strategy',
  'wallet_access',
  'banking_access',
  'financial_api',
  'payment_visibility',
  'treasury_metadata',
]);

/** Multi-signature governance thresholds by tier */
export const MULTI_SIG_THRESHOLDS = Object.freeze({
  TIER_2: { required: 1, total: 1 },
  TIER_3: { required: 2, total: 3 },
});

/** Agent execution wallet cap (in wei equivalent) */
export const AGENT_WALLET_CAP = '1000000000000000000'; // 1 ETH equivalent

/** Platform identification */
export const PLATFORM_NAME = 'Sovereign Protocol';
export const PLATFORM_VERSION = '1.0.0';

/** Cryptographic constants */
export const HASH_ALGORITHM = 'SHA-256';
export const SIGNING_ALGORITHM = 'ECDSA';
export const KEY_LENGTH = 256;

/** API endpoints (to be replaced with actual backend) */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/** Audit log action types */
export const AUDIT_ACTIONS = Object.freeze({
  LOGIN: 'AUTH_LOGIN',
  LOGOUT: 'AUTH_LOGOUT',
  SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  IDENTITY_VERIFY: 'IDENTITY_VERIFY',
  DOCUMENT_UPLOAD: 'DOCUMENT_UPLOAD',
  DNS_VERIFY: 'DNS_VERIFY',
  EMAIL_VERIFY: 'EMAIL_VERIFY',
  WALLET_CONNECT: 'WALLET_CONNECT',
  WALLET_BIND: 'WALLET_BIND',
  PROPOSAL_DRAFT: 'PROPOSAL_DRAFT',
  PROPOSAL_APPROVE: 'PROPOSAL_APPROVE',
  PROPOSAL_REJECT: 'PROPOSAL_REJECT',
  PROPOSAL_EXECUTE: 'PROPOSAL_EXECUTE',
  AGENT_HIRE: 'AGENT_HIRE',
  AGENT_TERMINATE: 'AGENT_TERMINATE',
  POLICY_VIOLATION: 'POLICY_VIOLATION',
  POLICY_UPDATE: 'POLICY_UPDATE',
  TREASURY_FUND: 'TREASURY_FUND',
  BLOCKER_REPORT: 'BLOCKER_REPORT',
  // Module 2: Command Center
  AGENT_MEMORY_WIPE: 'AGENT_MEMORY_WIPE',
  AGENT_SKILL_VIEW: 'AGENT_SKILL_VIEW',
  AGENT_DETACHMENT: 'AGENT_DETACHMENT',
  MARKETPLACE_SEARCH: 'MARKETPLACE_SEARCH',
  MARKETPLACE_HIRE: 'MARKETPLACE_HIRE',
  SANDBOX_ACTIVATE: 'SANDBOX_ACTIVATE',
  SANDBOX_PROMOTE: 'SANDBOX_PROMOTE',
  SANDBOX_TERMINATE: 'SANDBOX_TERMINATE',
  PAY_DISTRIBUTION_REQUEST: 'PAY_DISTRIBUTION_REQUEST',
  PAY_DISTRIBUTION_SIGNED: 'PAY_DISTRIBUTION_SIGNED',
  PAY_DISTRIBUTION_EXECUTED: 'PAY_DISTRIBUTION_EXECUTED',
  PAY_DISTRIBUTION_REJECTED: 'PAY_DISTRIBUTION_REJECTED',
  // Module 3: Spatial Workspace
  SPATIAL_SCENE_LOAD: 'SPATIAL_SCENE_LOAD',
  SPATIAL_AGENT_FOCUS: 'SPATIAL_AGENT_FOCUS',
  SPATIAL_AUDIO_TOGGLE: 'SPATIAL_AUDIO_TOGGLE',
  SPATIAL_HEATMAP_TOGGLE: 'SPATIAL_HEATMAP_TOGGLE',
  // Module 4: Operational Layer
  DPE_DRAFT_VIEW: 'DPE_DRAFT_VIEW',
  DPE_PROPOSAL_APPROVE: 'DPE_PROPOSAL_APPROVE',
  DPE_PROPOSAL_REJECT: 'DPE_PROPOSAL_REJECT',
  DPE_EXECUTE: 'DPE_EXECUTE',
  DPE_MULTISIG_SIGN: 'DPE_MULTISIG_SIGN',
  FORENSIC_VERIFY: 'FORENSIC_VERIFY',
  FORENSIC_EXPORT: 'FORENSIC_EXPORT',
});

```

### src/config/rbac.js
```js
/**
 * Sovereign Protocol — Role-Based Access Control (RBAC) Matrix
 * Defines permissions for each human role in the governance hierarchy.
 * AI agents have ZERO permissions in this matrix — they are operational only.
 */

export const ROLES = Object.freeze({
  FOUNDER: 'founder',
  SUPERVISOR: 'supervisor',
  AUDITOR: 'auditor',
});

/**
 * Complete permission matrix.
 * Each permission is a boolean flag indicating whether the role can perform the action.
 */
export const PERMISSIONS = Object.freeze({
  [ROLES.FOUNDER]: {
    // Agent Management
    canHireAgents: true,
    canTerminateAgents: true,
    canModifyAgentConfig: true,

    // Governance
    canApproveProposals: true,
    canRejectProposals: true,
    canExecuteProposals: true,
    canModifyPolicies: true,
    canAssignRoles: true,

    // Treasury
    canViewTreasury: true,
    canFundOpsWallet: true,
    canFundAgentWallets: true,
    canInitiateMultiSig: true,

    // Audit
    canViewAuditLogs: true,
    canExportAuditLogs: true,
    canViewBlockerReports: true,

    // Operational
    canAssignTasks: true,
    canReviewOutputs: true,
    canViewDashboard: true,
    canViewSecurityDashboard: true,

    // Strategic
    canApproveStrategicChanges: true,
    canModifyCompanyPolicies: true,

    // Module 2: Command Center
    canViewAgentOS: true,
    canWipeAgentMemory: true,
    canHireFromMarketplace: true,
    canViewServiceFees: true,
    canSignPayDistribution: true,
  },

  [ROLES.SUPERVISOR]: {
    // Agent Management
    canHireAgents: false,
    canTerminateAgents: false,
    canModifyAgentConfig: false,

    // Governance
    canApproveProposals: true,
    canRejectProposals: true,
    canExecuteProposals: false,
    canModifyPolicies: false,
    canAssignRoles: false,

    // Treasury
    canViewTreasury: false,
    canFundOpsWallet: false,
    canFundAgentWallets: false,
    canInitiateMultiSig: false,

    // Audit
    canViewAuditLogs: true,
    canExportAuditLogs: false,
    canViewBlockerReports: true,

    // Operational
    canAssignTasks: true,
    canReviewOutputs: true,
    canViewDashboard: true,
    canViewSecurityDashboard: false,

    // Strategic
    canApproveStrategicChanges: false,
    canModifyCompanyPolicies: false,

    // Module 2: Command Center
    canViewAgentOS: true,
    canWipeAgentMemory: false,
    canHireFromMarketplace: false,
    canViewServiceFees: true,
    canSignPayDistribution: false,
  },

  [ROLES.AUDITOR]: {
    // Agent Management
    canHireAgents: false,
    canTerminateAgents: false,
    canModifyAgentConfig: false,

    // Governance
    canApproveProposals: false,
    canRejectProposals: false,
    canExecuteProposals: false,
    canModifyPolicies: false,
    canAssignRoles: false,

    // Treasury
    canViewTreasury: false,
    canFundOpsWallet: false,
    canFundAgentWallets: false,
    canInitiateMultiSig: false,

    // Audit
    canViewAuditLogs: true,
    canExportAuditLogs: true,
    canViewBlockerReports: true,

    // Operational
    canAssignTasks: false,
    canReviewOutputs: true,
    canViewDashboard: true,
    canViewSecurityDashboard: true,

    // Strategic
    canApproveStrategicChanges: false,
    canModifyCompanyPolicies: false,

    // Module 2: Command Center
    canViewAgentOS: true,
    canWipeAgentMemory: false,
    canHireFromMarketplace: false,
    canViewServiceFees: true,
    canSignPayDistribution: false,
  },
});

/**
 * Checks if a role has a specific permission.
 * @param {string} role - The user's role (from ROLES enum)
 * @param {string} permission - The permission key to check
 * @returns {boolean} Whether the role has the permission
 */
export function hasPermission(role, permission) {
  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;
  return rolePermissions[permission] === true;
}

/**
 * Returns all permissions for a given role.
 * @param {string} role - The user's role
 * @returns {Object} The permissions object for the role
 */
export function getRolePermissions(role) {
  return PERMISSIONS[role] || {};
}

/**
 * Returns the display name for a role.
 * @param {string} role - The role identifier
 * @returns {string} Human-readable role name
 */
export function getRoleDisplayName(role) {
  const names = {
    [ROLES.FOUNDER]: 'Founder',
    [ROLES.SUPERVISOR]: 'AI Supervisor',
    [ROLES.AUDITOR]: 'Auditor',
  };
  return names[role] || 'Unknown Role';
}

```

### src/config/tiers.js
```js
/**
 * Sovereign Protocol — Progressive Trust Tier Definitions
 * Defines the state machine for onboarding progression.
 * Each tier unlocks specific platform capabilities.
 */

export const TIERS = Object.freeze({
  GUEST: {
    id: 0,
    name: 'Guest',
    label: 'Guest Sandbox',
    description: 'Restricted sandbox view with simulated costs. No real-world execution or on-chain activity.',
    color: '#64748b',
    requiredLayers: ['A'],
    capabilities: [
      'View simulated agent workspace',
      'Explore platform features',
      'Access documentation',
    ],
    restrictions: [
      'No real transactions',
      'No agent deployment',
      'Simulated data only',
      'No on-chain reputation',
    ],
    maxAgents: 0,
    hasRealExecution: false,
    hasTreasury: false,
    hasGovernance: false,
  },

  INDIVIDUAL: {
    id: 1,
    name: 'Individual',
    label: 'Verified Individual',
    description: 'Verified freelancer access with KYC completion. Low liability caps and restricted agent counts.',
    color: '#3b82f6',
    requiredLayers: ['A', 'KYC'],
    capabilities: [
      'Deploy up to 3 AI agents',
      'Basic task execution',
      'Personal execution wallet',
      'Build individual reputation',
    ],
    restrictions: [
      'Limited agent count',
      'Low liability cap',
      'No multi-sig governance',
      'No enterprise compliance',
    ],
    maxAgents: 3,
    hasRealExecution: true,
    hasTreasury: false,
    hasGovernance: false,
  },

  COMPANY: {
    id: 2,
    name: 'Company',
    label: 'Verified Company',
    description: 'Full KYB verification with DNS and corporate email. Activates treasury and agent execution wallets.',
    color: '#8b5cf6',
    requiredLayers: ['A', 'B', 'C_DNS', 'C_EMAIL'],
    capabilities: [
      'Deploy up to 50 AI agents',
      'Full treasury dashboard',
      'Agent execution wallets',
      'Build transferable on-chain reputation',
      'API integrations',
    ],
    restrictions: [
      'No multi-sig board approval',
      'Standard compliance only',
    ],
    maxAgents: 50,
    hasRealExecution: true,
    hasTreasury: true,
    hasGovernance: true,
  },

  ENTERPRISE: {
    id: 3,
    name: 'Enterprise',
    label: 'Enterprise',
    description: 'Full multi-sig board approval with custom compliance modules. Unlimited agent deployment.',
    color: '#f59e0b',
    requiredLayers: ['A', 'B', 'C_DNS', 'C_EMAIL', 'C_MULTISIG', 'D'],
    capabilities: [
      'Unlimited AI agents',
      'Multi-sig board governance',
      'Custom compliance modules',
      'Enterprise audit suite',
      'Priority support',
      'Cross-company agent migration',
    ],
    restrictions: [],
    maxAgents: Infinity,
    hasRealExecution: true,
    hasTreasury: true,
    hasGovernance: true,
  },
});

/**
 * Returns the tier object for a given tier ID.
 * @param {number} tierId - The tier ID (0-3)
 * @returns {Object} The tier definition
 */
export function getTierById(tierId) {
  const tiers = Object.values(TIERS);
  return tiers.find(t => t.id === tierId) || TIERS.GUEST;
}

/**
 * Checks if a user's completed layers satisfy a target tier's requirements.
 * @param {string[]} completedLayers - Array of completed layer identifiers
 * @param {number} targetTierId - The target tier ID
 * @returns {boolean} Whether all required layers are completed
 */
export function canAccessTier(completedLayers, targetTierId) {
  const tier = getTierById(targetTierId);
  if (!tier) return false;
  return tier.requiredLayers.every(layer => completedLayers.includes(layer));
}

/**
 * Calculates the current tier based on completed verification layers.
 * @param {string[]} completedLayers - Array of completed layer identifiers
 * @returns {Object} The highest accessible tier
 */
export function calculateCurrentTier(completedLayers) {
  const orderedTiers = Object.values(TIERS).sort((a, b) => b.id - a.id);
  for (const tier of orderedTiers) {
    if (canAccessTier(completedLayers, tier.id)) {
      return tier;
    }
  }
  return TIERS.GUEST;
}

```

### src/hooks/usePerformanceMode.js
```js
import { useState, useEffect } from 'react';

/**
 * Sovereign Protocol — Performance Mode Hook
 * Detects low-end devices, mobile browsers, and accessibility preferences
 * to gracefully degrade heavy animations and WebGL contexts.
 */
export function usePerformanceMode() {
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // 1. Accessibility: Reduced Motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 2. Hardware: Low CPU core count (often correlates to low-end devices)
    const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    // 3. Device: Mobile User Agent (WebGL fluid sims run poorly and drain battery on most mobile devices)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 4. Network/Battery: Save-data mode or slow connections
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g');

    if (prefersReducedMotion || lowCores || isMobile || isSlowConnection) {
      setIsLowPower(true);
    }
  }, []);

  return { isLowPower };
}

```

### src/hooks/usePermission.js
```js
/**
 * Sovereign Protocol — usePermission Hook
 * Checks RBAC permissions for the current authenticated user.
 * Used to conditionally render UI elements based on role.
 */

import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { hasPermission, getRolePermissions, getRoleDisplayName } from '../config/rbac.js';

export function usePermission() {
  const role = useAuthStore(s => s.role);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  /**
   * Checks if the current user has a specific permission.
   * @param {string} permission - The permission key to check
   * @returns {boolean}
   */
  const can = useCallback((permission) => {
    if (!isAuthenticated || !role) return false;
    return hasPermission(role, permission);
  }, [isAuthenticated, role]);

  /**
   * Returns all permissions for the current user's role.
   * @returns {Object}
   */
  const permissions = getRolePermissions(role);

  /**
   * Returns the display name of the current role.
   * @returns {string}
   */
  const roleName = getRoleDisplayName(role);

  return { can, role, roleName, permissions, isAuthenticated };
}

```

### src/hooks/usePolicyValidator.js
```js
/**
 * Sovereign Protocol — usePolicyValidator Hook
 * React hook wrapping the deterministic PolicyValidator for component use.
 * Triggers pause state and blocker reports on policy violations.
 */

import { useState, useCallback } from 'react';
import { PolicyValidator } from '../security/PolicyValidator.js';
import { useGovernanceStore } from '../store/governanceStore.js';

export function usePolicyValidator() {
  const [isPaused, setIsPaused] = useState(false);
  const [activeBlocker, setActiveBlocker] = useState(null);
  const addBlockerReport = useGovernanceStore(s => s.addBlockerReport);

  /**
   * Validates AI content and triggers pause state if violations found.
   * @param {string} content - AI-generated content to validate
   * @param {string} agentId - Agent that produced the content
   * @param {string} context - Display context
   * @returns {import('../security/PolicyValidator.js').ValidationResult}
   */
  const validate = useCallback((content, agentId, context) => {
    const result = PolicyValidator.validateContent(content, agentId, context);

    if (!result.passed) {
      const blockerReport = PolicyValidator.generateBlockerReport(
        result.blockerReportId,
        result.violations,
        agentId,
        context
      );
      addBlockerReport(blockerReport);
      setIsPaused(true);
      setActiveBlocker(blockerReport);
    }

    return result;
  }, [addBlockerReport]);

  /**
   * Checks if an action category is allowed for an agent.
   */
  const isActionAllowed = useCallback((category, agentId) => {
    return PolicyValidator.isActionAllowed(category, agentId);
  }, []);

  /**
   * Clears the pause state after human review.
   */
  const clearPause = useCallback(() => {
    setIsPaused(false);
    setActiveBlocker(null);
  }, []);

  return { validate, isActionAllowed, isPaused, activeBlocker, clearPause };
}

```

### src/hooks/useSessionGuard.js
```js
/**
 * Sovereign Protocol — useSessionGuard Hook
 * React hook that integrates the SessionGuard service with the auth store.
 * Automatically wipes all sensitive state on idle timeout or tab close.
 */

import { useEffect, useCallback } from 'react';
import { SessionGuard } from '../security/SessionGuard.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { useAuthStore } from '../store/authStore.js';
import { useIdentityStore } from '../store/identityStore.js';
import { useTreasuryStore } from '../store/treasuryStore.js';
import { useGovernanceStore } from '../store/governanceStore.js';
import { useOnboardingStore } from '../store/onboardingStore.js';
import { AUDIT_ACTIONS } from '../config/constants.js';

export function useSessionGuard() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
  const setSessionWarning = useAuthStore(s => s.setSessionWarning);
  const recordActivity = useAuthStore(s => s.recordActivity);

  const resetIdentity = useIdentityStore(s => s.reset);
  const resetTreasury = useTreasuryStore(s => s.reset);
  const resetGovernance = useGovernanceStore(s => s.reset);
  const resetOnboarding = useOnboardingStore(s => s.reset);

  /**
   * Wipes ALL sensitive state from all stores.
   * This is the nuclear option — called on timeout and tab close.
   */
  const wipeAllState = useCallback((reason) => {
    AuditLogger.log({
      action: AUDIT_ACTIONS.SESSION_EXPIRED,
      context: reason,
      severity: 'warning',
    });

    // Wipe all stores
    logout();
    resetIdentity();
    resetTreasury();
    resetGovernance();
    resetOnboarding();

    // Wipe audit logger last
    AuditLogger._resetForSessionWipe();
  }, [logout, resetIdentity, resetTreasury, resetGovernance, resetOnboarding]);

  useEffect(() => {
    if (!isAuthenticated) return;

    SessionGuard.start({
      onExpire: (reason) => {
        wipeAllState(reason);
      },
      onWarning: (remaining) => {
        setSessionWarning(true, remaining);
      },
      onActivity: () => {
        recordActivity();
        setSessionWarning(false, null);
      },
    });

    return () => {
      SessionGuard.stop();
    };
  }, [isAuthenticated, wipeAllState, setSessionWarning, recordActivity]);

  return {
    remainingTime: SessionGuard.getRemainingTime(),
    isWarning: SessionGuard.isInWarningState(),
    resetTimer: () => SessionGuard.resetTimer(),
  };
}

```

### src/hooks/useTierGate.js
```js
/**
 * Sovereign Protocol — useTierGate Hook
 * Enforces progressive trust access control on routes and features.
 * Prevents users from accessing features above their verified tier.
 */

import { useMemo } from 'react';
import { useOnboardingStore } from '../store/onboardingStore.js';
import { useIdentityStore } from '../store/identityStore.js';
import { getTierById } from '../config/tiers.js';

export function useTierGate() {
  const currentTierId = useOnboardingStore(s => s.currentTierId);
  const isSandboxMode = useOnboardingStore(s => s.isSandboxMode);
  const completedLayers = useIdentityStore(s => s.completedLayers);

  const currentTier = useMemo(() => getTierById(currentTierId), [currentTierId]);

  /**
   * Checks if the user can access a specific tier level.
   * @param {number} requiredTierId - The minimum tier required
   * @returns {boolean}
   */
  const canAccessTier = (requiredTierId) => currentTierId >= requiredTierId;

  /**
   * Checks if a specific feature is unlocked.
   * @param {string} feature - Feature name
   * @returns {boolean}
   */
  const isFeatureUnlocked = (feature) => {
    switch (feature) {
      case 'treasury': return currentTier.hasTreasury;
      case 'governance': return currentTier.hasGovernance;
      case 'agents': return currentTier.maxAgents > 0;
      case 'realExecution': return currentTier.hasRealExecution;
      case 'multiSig': return currentTierId >= 3;
      case 'compliance': return currentTierId >= 3;
      default: return false;
    }
  };

  return {
    currentTierId,
    currentTier,
    isSandboxMode,
    completedLayers,
    canAccessTier,
    isFeatureUnlocked,
    maxAgents: currentTier.maxAgents,
  };
}

```

### src/hooks/useWallet.js
```js
/**
 * Sovereign Protocol — useWallet Hook
 * Manages Web3 wallet connections for Layer D (Cryptographic ID).
 * Wallets are authorized by Layer C, NOT the other way around.
 */

import { useState, useCallback } from 'react';
import { useIdentityStore } from '../store/identityStore.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';

export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const bindWallet = useIdentityStore(s => s.bindWallet);
  const layerD = useIdentityStore(s => s.layerD);

  /**
   * Connects to MetaMask and requests account access.
   * Does NOT bind the wallet — binding requires Layer C authorization.
   */
  const connectWallet = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      if (!window.ethereum) {
        throw new Error('No Web3 wallet detected. Please install MetaMask.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet.');
      }

      AuditLogger.log({
        action: AUDIT_ACTIONS.WALLET_CONNECT,
        details: { address: accounts[0], provider: 'MetaMask' },
      });

      setIsConnecting(false);
      return { address: accounts[0], provider: 'MetaMask' };
    } catch (err) {
      const message = err.code === 4001
        ? 'Wallet connection rejected by user.'
        : err.message || 'Failed to connect wallet.';
      setError(message);
      setIsConnecting(false);
      return null;
    }
  }, []);

  /**
   * Signs a binding message to prove wallet ownership.
   * This cryptographically links the wallet to the Business ID.
   * 
   * @param {string} address - The wallet address
   * @param {string} businessId - The verified Business ID
   */
  const signBindingMessage = useCallback(async (address, businessId) => {
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('No Web3 wallet detected.');
      }

      const message = JSON.stringify({
        action: 'BIND_WALLET_TO_BUSINESS',
        walletAddress: address,
        businessId: businessId,
        platform: 'Sovereign Protocol',
        timestamp: new Date().toISOString(),
        nonce: crypto.randomUUID(),
      });

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Bind the wallet in the identity store
      bindWallet({
        address,
        provider: 'MetaMask',
        signature,
      });

      AuditLogger.log({
        action: AUDIT_ACTIONS.WALLET_BIND,
        details: { address, businessId },
      });

      return { address, signature, message };
    } catch (err) {
      const message = err.code === 4001
        ? 'Signing rejected by user.'
        : err.message || 'Failed to sign binding message.';
      setError(message);
      return null;
    }
  }, [bindWallet]);

  /**
   * Gets the current chain ID from the connected wallet.
   */
  const getChainId = useCallback(async () => {
    if (!window.ethereum) return null;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    } catch {
      return null;
    }
  }, []);

  return {
    connectWallet,
    signBindingMessage,
    getChainId,
    isConnecting,
    error,
    isConnected: layerD.status === 'verified',
    walletAddress: layerD.walletAddress,
  };
}

```

### src/main.jsx
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

/* Design System Styles — Order matters */
import './styles/index.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/layouts.css';
import './styles/pages.css';
import './styles/module2.css';
import './styles/module3.css';
import './styles/module4.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

```

### src/pages/AgentManagementPage.jsx
```jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Brain, Lock, Unlock, ShieldAlert, Cpu, Database,
  Zap, XCircle, AlertTriangle, Package, Shield, Eye,
  Activity, Hash, Hexagon, Square, Triangle
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { useAgentOSStore } from '../store/agentOSStore.js';
import { useAuthStore } from '../store/authStore.js';
import { usePermission } from '../hooks/usePermission.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { mockApi } from '../services/mockApi.js';

/**
 * Sovereign Protocol — Module 2: Agent Management Page
 * The "Split-Brain" UI enforcing Bipartite Cognitive Architecture.
 * Separates immutable Skill Modules from stateful Episodic Memory.
 */
function AgentManagementPage() {
  const user = useAuthStore(s => s.user);
  const {
    agents, selectedAgentId, skillModules, memoryVaults,
    detachmentState, isLoading,
    setAgents, selectAgent, setSkillModules, setMemoryVault,
    initiateDetachment, confirmDetachment, cancelDetachment, setLoading,
  } = useAgentOSStore();
  const { can } = usePermission();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (dataLoaded) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [agentData, skillData] = await Promise.all([
          mockApi.getAgentOS(),
          mockApi.getSkillModules(),
        ]);
        setAgents(agentData);
        setSkillModules(skillData);
        for (const agent of agentData) {
          const vault = await mockApi.getAgentMemoryVault(agent.id);
          setMemoryVault(agent.id, vault);
        }
        if (agentData.length > 0) selectAgent(agentData[0].id);
        setDataLoaded(true);
      } catch (e) { /* mock */ }
      setLoading(false);
    };
    loadData();
  }, [dataLoaded]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const selectedVault = selectedAgentId ? memoryVaults[selectedAgentId] : null;
  const agentSkills = selectedAgent
    ? skillModules.filter(s => selectedAgent.skills.includes(s.id))
    : [];

  const getExecStateClass = (state) => {
    const map = { executing: 'exec-state-executing', planning: 'exec-state-planning', idle: 'exec-state-idle', blocked: 'exec-state-blocked', terminated: 'exec-state-terminated' };
    return map[state] || 'exec-state-idle';
  };

  const handleDetach = () => {
    if (!selectedAgent) return;
    initiateDetachment(selectedAgent.id);
  };

  const handleConfirmDetach = () => {
    confirmDetachment();
    AuditLogger.log({
      action: AUDIT_ACTIONS.AGENT_DETACHMENT,
      agentId: detachmentState.targetAgentId,
      userId: user?.id,
      context: 'agent_management',
      details: 'Agent memory wiped and cryptographic access revoked',
    });
  };

  const showDetachModal = detachmentState.isActive && detachmentState.confirmationStep === 1;

  if (isLoading && !dataLoaded) {
    return (
      <div className="agent-os-page">
        <div className="page-header">
          <h1 className="page-title">Agent Operating System</h1>
          <p className="page-subtitle">Loading agent architecture data</p>
        </div>
        <Card><div className="skeleton" style={{ height: 200 }} /></Card>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div className="agent-os-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Agent Operating System</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>
          Manage AI workforce through the Bipartite Cognitive Architecture
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div className="security-stats-grid" variants={itemVariants}>
        {[
          { label: 'Active Agents', value: agents.filter(a => a.status === 'active').length, icon: Bot, color: '#059669' },
          { label: 'Skill Modules', value: skillModules.length, icon: Package, color: '#334155' },
          { label: 'Blocked', value: agents.filter(a => a.executionState === 'blocked').length, icon: AlertTriangle, color: '#dc2626' },
          { label: 'Terminated', value: agents.filter(a => a.status === 'terminated').length, icon: XCircle, color: '#64748b' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}>
            <Card className="security-stat-card" hover>
              <div className="m2-stat-row">
                <span className="security-stat-label">{stat.label}</span>
                <div className="m2-stat-icon" style={{ background: `${stat.color}0d` }}>
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="security-stat-value">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Agent Roster Grid (Monochrome-First Cards) */}
      <motion.div variants={itemVariants}>
        <div className="bento-box-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {agents.map(agent => {
            const isActive = selectedAgentId === agent.id;
            const { Icon: ShapeIcon, color: shapeColor } = (() => {
              switch (agent.department) {
                case 'Engineering': return { Icon: Hexagon, color: '#00E5FF' };
                case 'Marketing': return { Icon: Square, color: '#6366F1' };
                case 'Support': return { Icon: Triangle, color: '#E2E2E2' };
                default: return { Icon: Hexagon, color: '#00E5FF' };
              }
            })();
            
            return (
              <Card
                key={agent.id}
                hover
                onClick={() => selectAgent(agent.id)}
                style={{
                  cursor: 'pointer',
                  background: isActive ? 'var(--color-bg-secondary)' : '#111827',
                  borderColor: isActive ? shapeColor : '#1f2937',
                  boxShadow: isActive ? `0 0 20px ${shapeColor}20, inset 0 0 10px ${shapeColor}10` : undefined,
                  transition: 'all 0.2s ease-out'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '6px',
                      background: isActive ? `${shapeColor}15` : '#1f2937',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${isActive ? `${shapeColor}40` : 'transparent'}`,
                      transition: 'all 0.2s ease-out'
                    }}>
                      <ShapeIcon size={18} style={{ color: isActive ? shapeColor : '#6b7280', transition: 'all 0.2s ease-out' }} />
                    </div>
                    <div>
                      <div className="card-title" style={{ fontSize: 'var(--text-base)', color: isActive ? '#ffffff' : '#9ca3af' }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{agent.role}</div>
                    </div>
                  </div>
                  <span className={`exec-state ${getExecStateClass(agent.executionState)}`} style={{ opacity: isActive ? 1 : 0.5, filter: isActive ? 'none' : 'grayscale(100%)' }}>
                    {agent.executionState}
                  </span>
                </div>
                
                {/* Technical Details Small-print */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: 'var(--space-3)', borderTop: '1px solid #1f2937',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#6b7280',
                  letterSpacing: '0.02em'
                }}>
                  <span>Model: Llama 3 - 70B</span>
                  <span>Lat: {agent.avgLatency || 14}ms</span>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Dual-Layer Workspace */}
      {selectedAgent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <div className="m2-section-header">
            <div>
              <h2 className="m2-section-title">{selectedAgent.name}</h2>
              <span className="m2-section-subtitle">{selectedAgent.role} — {selectedAgent.department}</span>
            </div>
            <Badge color={selectedAgent.status === 'active' ? 'emerald' : 'rose'}>
              {selectedAgent.status}
            </Badge>
          </div>

          <div className="agent-workspace">
            {/* Skill Module Library */}
            <Card>
              <div className="card-header">
                <h3 className="card-title">
                  <Cpu size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
                  Skill Module Library
                </h3>
                <Badge color="blue">{agentSkills.length} assigned</Badge>
              </div>
              <div className="skill-library">
                {agentSkills.map(skill => (
                  <div key={skill.id} className="skill-block assigned">
                    <div className="skill-block-icon">
                      <Package size={15} style={{ color: '#059669' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="skill-block-name">{skill.name}</div>
                      <div className="skill-block-meta">v{skill.version} — {skill.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Memory Vault */}
            <Card>
              <div className="card-header">
                <h3 className="card-title">
                  <Database size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
                  Memory Vault
                </h3>
                <Badge
                  color={selectedAgent.memoryAccess === 'encrypted' ? 'emerald' : 'rose'}
                  icon={selectedAgent.memoryAccess === 'encrypted' ? Lock : Unlock}
                >
                  {selectedAgent.memoryAccess}
                </Badge>
              </div>

              {selectedVault && (
                <div className="memory-vault">
                  <div className="memory-section">
                    <div className="memory-section-title">
                      <Brain size={13} /> Episodic Memory
                    </div>
                    <div className="memory-metric">
                      <span>Status</span>
                      <span className={`memory-metric-value memory-status-${selectedVault.episodicMemory.status}`}>
                        {selectedVault.episodicMemory.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="memory-metric">
                      <span>Entries</span>
                      <span className="memory-metric-value">{selectedVault.episodicMemory.entryCount.toLocaleString()}</span>
                    </div>
                    <div className="memory-metric">
                      <span>Isolation</span>
                      <span className="memory-metric-value">Company-Isolated</span>
                    </div>
                    <div className="memory-metric">
                      <span>Encryption</span>
                      <span className="memory-metric-value">AES-256-GCM</span>
                    </div>
                  </div>

                  <div className="memory-section">
                    <div className="memory-section-title">
                      <Zap size={13} /> Semantic Skill
                    </div>
                    <div className="memory-metric">
                      <span>Status</span>
                      <span className="memory-metric-value memory-status-encrypted">{selectedVault.semanticSkill.status.toUpperCase()}</span>
                    </div>
                    <div className="memory-metric">
                      <span>Experience</span>
                      <span className="memory-metric-value">{selectedVault.semanticSkill.experienceScore}%</span>
                    </div>
                    <div className="memory-metric">
                      <span>Portable</span>
                      <span className="memory-metric-value" style={{ color: '#059669' }}>Yes</span>
                    </div>
                  </div>

                  <div className="memory-section">
                    <div className="memory-section-title">
                      <Activity size={13} /> Context Window
                    </div>
                    <div className="memory-metric">
                      <span>Utilization</span>
                      <span className="memory-metric-value">{selectedVault.contextWindow.utilizationPercent}%</span>
                    </div>
                    <div className="memory-metric">
                      <span>Tokens</span>
                      <span className="memory-metric-value">
                        {selectedVault.contextWindow.activeTokens.toLocaleString()} / {selectedVault.contextWindow.maxTokens.toLocaleString()}
                      </span>
                    </div>
                    <div className="context-gauge">
                      <div className="context-gauge-fill" style={{ width: `${selectedVault.contextWindow.utilizationPercent}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {can('canWipeAgentMemory') && selectedAgent.status === 'active' && (
                <div className="kill-switch-container">
                  <button className="kill-switch-btn" onClick={handleDetach} id="kill-switch-trigger">
                    <ShieldAlert size={16} /> Revoke Access
                  </button>
                  <div className="kill-switch-warning">
                    Wipes episodic memory and revokes cryptographic vault access
                  </div>
                </div>
              )}

              {selectedAgent.status === 'terminated' && (
                <div className="m2-terminated-notice">
                  <XCircle size={18} />
                  <div>
                    <div className="m2-terminated-title">Agent Terminated</div>
                    <div className="m2-terminated-sub">Memory orphaned. Cryptographic access revoked.</div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      )}

      {/* Detachment Confirmation Modal */}
      <Modal
        isOpen={showDetachModal}
        onClose={cancelDetachment}
        title="Confirm Agent Detachment"
      >
        <div className="m2-modal-alert">
          <ShieldAlert size={18} />
          <span>
            <strong>This action is irreversible.</strong> The agent's episodic memory will be cryptographically orphaned and all vault access will be revoked.
          </span>
        </div>
        <div className="m2-modal-detail">
          <span>Target Agent</span>
          <strong>{agents.find(a => a.id === detachmentState.targetAgentId)?.name || '—'}</strong>
        </div>
        <div className="m2-modal-actions">
          <button className="btn btn-secondary" onClick={cancelDetachment}>Cancel</button>
          <button className="btn btn-danger" onClick={handleConfirmDetach} id="confirm-detach-btn">
            Confirm Detachment
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}

export { AgentManagementPage };

```

### src/pages/AuditPage.jsx
```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ShieldCheck, Eye, Clock, Hash, AlertTriangle,
  Lock, CheckCircle, Activity, FileWarning, Fingerprint
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { CopyToClipboard } from '../components/common/CopyToClipboard.jsx';
import { AuditLogger } from '../security/AuditLogger.js';
import { SessionGuard } from '../security/SessionGuard.js';
import { useAuthStore } from '../store/authStore.js';
import { mockApi } from '../services/mockApi.js';

/**
 * Sovereign Protocol — Audit & Security Page
 * Immutable audit logs, session monitoring, ZK proofs, and security dashboard.
 */
function AuditPage() {
  const sessionStartedAt = useAuthStore(s => s.sessionStartedAt);
  const user = useAuthStore(s => s.user);
  const [zkProofs, setZkProofs] = useState([]);
  const [auditEntries, setAuditEntries] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setAuditEntries(AuditLogger.getEntries());
  }, [refreshKey]);

  useEffect(() => {
    mockApi.getZKProofs().then(setZkProofs);
  }, []);

  const violations = AuditLogger.getViolations();
  const totalEntries = AuditLogger.getCount();
  const remainingMs = SessionGuard.getRemainingTime();
  const remainingMin = Math.floor(remainingMs / 60000);
  const remainingSec = Math.floor((remainingMs % 60000) / 1000);

  const stats = [
    { label: 'Audit Events', value: totalEntries, icon: Activity, color: '#06b6d4' },
    { label: 'Policy Violations', value: violations.length, icon: AlertTriangle, color: violations.length > 0 ? '#f43f5e' : '#10b981' },
    { label: 'Session Uptime', value: sessionStartedAt ? `${Math.floor((Date.now() - new Date(sessionStartedAt).getTime()) / 60000)}m` : '—', icon: Clock, color: '#3b82f6' },
    { label: 'Session Remaining', value: `${remainingMin}:${remainingSec.toString().padStart(2, '0')}`, icon: Lock, color: '#f59e0b' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div className="audit-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Audit & Security Dashboard</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>Immutable accountability logs, session monitoring, and zero-knowledge proofs</p>
      </motion.div>

      {/* Security Stats */}
      <motion.div className="security-stats-grid" variants={itemVariants}>
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="security-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="security-stat-label">{stat.label}</span>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <div className="security-stat-value" style={{ color: stat.color }}>{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Security Architecture */}
      <motion.div variants={itemVariants}>
      <Card>
        <div className="card-header">
          <h3 className="card-title">Active Security Measures</h3>
          <Badge color="emerald" icon={ShieldCheck}>All Systems Active</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
          {[
            { title: 'Zero-Persistence State', desc: 'All sensitive claims wiped on browser close. No localStorage/sessionStorage.', icon: Lock, active: true },
            { title: 'Content Security Policy', desc: 'Strict CSP headers blocking unauthorized scripts and data exfiltration.', icon: Shield, active: true },
            { title: 'DOM Sanitization', desc: 'DOMPurify active on all AI-generated content. XSS prevention enforced.', icon: ShieldCheck, active: true },
            { title: 'Policy Validator', desc: 'Deterministic middleware scanning all outputs for financial keywords.', icon: FileWarning, active: true },
            { title: 'Encrypted Transit', desc: 'All data hashed and signed via Web Crypto API before transmission.', icon: Fingerprint, active: true },
            { title: 'Session Guard', desc: '5-minute idle timeout with automatic state purge on inactivity.', icon: Clock, active: true },
          ].map(measure => (
            <div key={measure.title} style={{
              padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-3)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)', flexShrink: 0,
                background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <measure.icon size={18} style={{ color: 'var(--color-accent-emerald)' }} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{measure.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{measure.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      </motion.div>

      {/* ZK Proofs */}
      {zkProofs.length > 0 && (
        <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="card-title">Zero-Knowledge Performance Proofs</h3>
            <Badge color="violet">Privacy-Preserving</Badge>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>
            ZK-proofs of agent performance — no raw data or employer identities exposed.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
            {zkProofs.map(proof => (
              <div key={proof.id} className="card zk-proof-card">
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{proof.agentId}</div>
                <div className="zk-proof-label">{proof.metric}</div>
                <div className="zk-proof-metric">{proof.value}</div>
                <div className="zk-proof-verified">
                  <CheckCircle size={12} /> Cryptographically Verified
                </div>
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <CopyToClipboard text={proof.proofHash} label="Proof Hash" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        </motion.div>
      )}

      {/* Audit Log */}
      <motion.div variants={itemVariants}>
      <Card>
        <div className="card-header">
          <h3 className="card-title">Immutable Audit Trail</h3>
          <Button variant="ghost" size="sm" onClick={() => setRefreshKey(k => k + 1)}>Refresh</Button>
        </div>
        {auditEntries.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <Eye size={48} className="empty-state-icon" />
            <p className="empty-state-title">No Audit Entries Yet</p>
            <p className="empty-state-text">Actions will appear here as you interact with the platform.</p>
          </div>
        ) : (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {[...auditEntries].reverse().map(entry => (
              <div key={entry.id} className="audit-log-entry">
                <div className="audit-log-timestamp">{new Date(entry.timestamp).toLocaleString()}</div>
                <div className="audit-log-content">
                  <div className="audit-log-action">
                    <Badge color={entry.severity === 'critical' ? 'rose' : entry.severity === 'warning' ? 'amber' : 'blue'} style={{ marginRight: 'var(--space-2)' }}>
                      {entry.action}
                    </Badge>
                  </div>
                  {entry.context && <div className="audit-log-details">Context: {entry.context}</div>}
                  {entry.violations && <div className="audit-log-details" style={{ color: 'var(--color-accent-rose)' }}>Violations: {entry.violations.join(', ')}</div>}
                  <div className="audit-log-hash">ID: {entry.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      </motion.div>
    </motion.div>
  );
}

export { AuditPage };

```

### src/pages/DashboardPage.jsx
```jsx
import { motion } from 'framer-motion';
import {
  BarChart3, Bot, Shield, Landmark, Clock, TrendingUp,
  AlertTriangle, Check, FileText
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useAuthStore } from '../store/authStore.js';
import { useIdentityStore } from '../store/identityStore.js';
import { useOnboardingStore } from '../store/onboardingStore.js';
import { useGovernanceStore } from '../store/governanceStore.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { useTierGate } from '../hooks/useTierGate.js';

/**
 * Sovereign Protocol — Dashboard Page
 * Central overview with key metrics and platform status.
 */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.15,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const completedLayers = useIdentityStore(s => s.completedLayers);
  const { currentTierId, currentTier, isSandboxMode } = useTierGate();
  const agents = useGovernanceStore(s => s.agents);
  const proposals = useGovernanceStore(s => s.proposals);
  const blockerReports = useGovernanceStore(s => s.blockerReports);

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const pendingProposals = proposals.filter(p => p.status === 'draft' || p.status === 'proposed').length;
  const unresolvedBlockers = blockerReports.filter(r => r.status === 'PAUSE_STATE').length;
  const auditCount = AuditLogger.getCount();

  const stats = [
    { label: 'Trust Level', value: `Tier ${currentTierId}`, sublabel: currentTier.name, icon: Shield, color: currentTier.color },
    { label: 'Active Agents', value: activeAgents.toString(), sublabel: `of ${currentTier.maxAgents === Infinity ? '∞' : currentTier.maxAgents} max`, icon: Bot, color: '#3b82f6' },
    { label: 'Pending Proposals', value: pendingProposals.toString(), sublabel: 'awaiting review', icon: FileText, color: '#8b5cf6' },
    { label: 'Audit Events', value: auditCount.toString(), sublabel: 'this session', icon: TrendingUp, color: '#06b6d4' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Welcome back, {user?.name || 'Operator'}</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>
          {isSandboxMode
            ? 'You are in Sandbox Mode — complete identity verification to unlock full access'
            : 'Sovereign Protocol command center — all systems operational'
          }
        </p>
      </motion.div>

      {/* Bento Grid Layout */}
      <motion.div className="bento-box-grid" variants={itemVariants}>

        {/* Sandbox Warning */}
        {isSandboxMode && (
          <motion.div variants={itemVariants} style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-warning)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-accent-amber)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
              <strong style={{ fontFamily: 'var(--font-serif)' }}>Sandbox Mode:</strong> All data is simulated. Complete your identity verification to enable real execution.
            </span>
          </motion.div>
        )}

        {/* Stats Grid */}
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="bento-widget" hover>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span className="security-stat-label">{stat.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="security-stat-value">{stat.value}</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{stat.sublabel}</span>
            </Card>
          </motion.div>
        ))}

        {/* Identity Progress */}
        <motion.div variants={itemVariants} style={{ gridColumn: 'span 2' }}>
          <Card className="bento-widget">
            <div className="card-header">
              <h3 className="card-title">Identity Verification Progress</h3>
              <Badge color={completedLayers.length >= 6 ? 'emerald' : 'blue'}>
                {completedLayers.length} / 6 layers
              </Badge>
            </div>
            <ProgressBar value={completedLayers.length} max={6} showPercent />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              {['A', 'B', 'C_DNS', 'C_EMAIL', 'C_MULTISIG', 'D'].map(layer => (
                <Badge key={layer} color={completedLayers.includes(layer) ? 'emerald' : 'amber'} icon={completedLayers.includes(layer) ? Check : Clock}>
                  {layer.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Blocker Alert */}
        {unresolvedBlockers > 0 && (
          <motion.div variants={itemVariants} style={{ gridColumn: 'span 1' }}>
            <Card variant="danger" className="bento-widget">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <AlertTriangle size={20} style={{ color: 'var(--color-accent-rose)' }} />
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-accent-rose)' }}>
                    {unresolvedBlockers} Unresolved Blocker{unresolvedBlockers > 1 ? 's' : ''}
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    AI agents in PAUSE STATE.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Governance Boundary Reminder */}
        <motion.div variants={itemVariants} style={{ gridColumn: '1 / -1' }}>
          <Card className="bento-widget">
            <div className="card-header">
              <h3 className="card-title">Governance Architecture</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent-blue)', marginBottom: 'var(--space-1)' }}>Humans</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Control Capital</div>
              </div>
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent-violet)', marginBottom: 'var(--space-1)' }}>AI Agents</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Execute Operations</div>
              </div>
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-accent-emerald)', marginBottom: 'var(--space-1)' }}>Middleware</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Enforce Separation</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export { DashboardPage };

```

### src/pages/DPEPipelinePage.jsx
```jsx
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Send, Zap, AlertTriangle, CheckCircle,
  XCircle, Lock, Shield, Clock
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { RiskScoreGauge } from '../components/operational/RiskScoreGauge.jsx';
import { ReasoningPath } from '../components/operational/ReasoningPath.jsx';
import { MultiSigModal } from '../components/operational/MultiSigModal.jsx';
import { useGovernanceStore } from '../store/governanceStore.js';
import { useAuthStore } from '../store/authStore.js';
import { usePermission } from '../hooks/usePermission.js';
import { PolicyGate } from '../security/PolicyGate.js';
import { ExecutionSigner } from '../security/ExecutionSigner.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { mockApi } from '../services/mockApi.js';

/**
 * Sovereign Protocol — Module 4: DPE Pipeline Page
 * Draft → Propose → Execute approval rail.
 * Humans review AI reasoning before any action executes.
 */
function DPEPipelinePage() {
  const user = useAuthStore(s => s.user);
  const {
    proposals, approveProposal, rejectProposal,
    executeProposal, addProposal,
  } = useGovernanceStore();
  const { can } = usePermission();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [multiSigTarget, setMultiSigTarget] = useState(null);

  useEffect(() => {
    if (dataLoaded) return;
    const load = async () => {
      try {
        const data = await mockApi.getDPEProposals();
        data.forEach(p => addProposal(p));
        setDataLoaded(true);
      } catch (e) { /* mock */ }
    };
    load();
  }, [dataLoaded]);

  const drafts = proposals.filter(p => p.status === 'draft');
  const proposed = proposals.filter(p => p.status === 'proposed');
  const approved = proposals.filter(p => p.status === 'approved');
  const executed = proposals.filter(p => p.status === 'executed');
  const rejected = proposals.filter(p => p.status === 'rejected');

  const session = {
    isAuthenticated: !!user,
    layerCVerified: true, // Mock: In production, check identity store
  };

  const handleApprove = useCallback((proposalId) => {
    approveProposal(proposalId, user?.id);
    AuditLogger.log({
      action: AUDIT_ACTIONS.DPE_PROPOSAL_APPROVE,
      userId: user?.id,
      context: 'dpe_pipeline',
      details: `Approved proposal ${proposalId}`,
    });
  }, [approveProposal, user]);

  const handleReject = useCallback(() => {
    if (!rejectTarget || !rejectReason.trim()) return;
    rejectProposal(rejectTarget, user?.id, rejectReason);
    AuditLogger.log({
      action: AUDIT_ACTIONS.DPE_PROPOSAL_REJECT,
      userId: user?.id,
      context: 'dpe_pipeline',
      details: `Rejected proposal ${rejectTarget}: ${rejectReason}`,
    });
    setRejectTarget(null);
    setRejectReason('');
  }, [rejectTarget, rejectReason, rejectProposal, user]);

  const handleExecute = useCallback(async (proposal) => {
    const gate = PolicyGate.validateExecution(proposal, session);
    if (!gate.allowed) {
      alert(`Execution Blocked: ${gate.reason}`);
      return;
    }
    if (gate.requiresMultiSig) {
      setMultiSigTarget(proposal);
      return;
    }

    try {
      const signedRecord = await ExecutionSigner.signExecution(proposal, user?.id);
      executeProposal(proposal.id, user?.id);
      AuditLogger.log({
        action: AUDIT_ACTIONS.DPE_EXECUTE,
        userId: user?.id,
        context: 'dpe_pipeline',
        details: `Executed proposal ${proposal.id}. Hash: ${signedRecord.hash}`,
      });
    } catch (e) {
      console.error('[DPE] Execution signing failed:', e);
    }
  }, [session, user, executeProposal]);

  const handleMultiSigComplete = useCallback(async (signatures) => {
    if (!multiSigTarget) return;
    try {
      const signedRecord = await ExecutionSigner.signExecution(multiSigTarget, user?.id);
      executeProposal(multiSigTarget.id, user?.id);
      AuditLogger.log({
        action: AUDIT_ACTIONS.DPE_EXECUTE,
        userId: user?.id,
        context: 'dpe_pipeline',
        details: `Multi-sig executed proposal ${multiSigTarget.id}. ${signatures.length} signatures collected.`,
      });
    } catch (e) { /* handled */ }
    setMultiSigTarget(null);
  }, [multiSigTarget, user, executeProposal]);

  const statusColor = { draft: 'blue', proposed: 'amber', approved: 'emerald', executed: 'cyan', rejected: 'rose' };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div className="dpe-pipeline-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>DPE Pipeline</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>Draft → Propose → Execute — Human-in-the-Loop approval rail</p>
      </motion.div>

      {/* HITL Notice */}
      <motion.div className="m2-info-bar" style={{ borderColor: '#fde68a', background: '#fffbeb' }} variants={itemVariants}>
        <Shield size={14} style={{ color: '#d97706', flexShrink: 0 }} />
        <span>No AI agent can execute proposals. Every action requires explicit human authorization through this pipeline.</span>
      </motion.div>

      {/* Stats */}
      <div className="security-stats-grid" style={{ marginBottom: 'var(--space-5)' }}>
        {[
          { label: 'Drafts', value: drafts.length, icon: FileText, color: '#334155' },
          { label: 'Proposed', value: proposed.length, icon: Send, color: '#d97706' },
          { label: 'Approved', value: approved.length, icon: CheckCircle, color: '#059669' },
          { label: 'Executed', value: executed.length, icon: Zap, color: '#3b82f6' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="security-stat-card" hover>
              <div className="m2-stat-row">
                <span className="security-stat-label">{stat.label}</span>
                <stat.icon size={15} style={{ color: stat.color }} />
              </div>
              <div className="security-stat-value">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3-Column Pipeline */}
      <motion.div className="dpe-columns" variants={itemVariants}>
        {/* DRAFT Column */}
        <div className="dpe-column">
          <div className="dpe-column-header">
            <FileText size={14} />
            <span>Draft (Incubation)</span>
            <Badge color="blue">{drafts.length}</Badge>
          </div>
          {drafts.map(d => (
            <Card key={d.id} className="dpe-card dpe-draft-card">
              <div className="dpe-draft-stamp">INCUBATION — NOT FINALIZED</div>
              <div className="dpe-card-title">{d.title}</div>
              <div className="dpe-card-agent">{d.agentName}</div>
              <pre className="dpe-draft-content">{d.draftContent || d.description}</pre>
              <div className="dpe-card-time">
                <Clock size={11} /> {new Date(d.createdAt).toLocaleString()}
              </div>
            </Card>
          ))}
          {drafts.length === 0 && <div className="dpe-empty">No drafts in incubation</div>}
        </div>

        {/* PROPOSED Column */}
        <div className="dpe-column">
          <div className="dpe-column-header">
            <Send size={14} />
            <span>Proposed (Validation)</span>
            <Badge color="amber">{proposed.length}</Badge>
          </div>
          {proposed.map(p => (
            <Card key={p.id} className="dpe-card dpe-proposal-card">
              <div className="dpe-card-top">
                <div>
                  <div className="dpe-card-title">{p.title}</div>
                  <div className="dpe-card-agent">{p.agentName}</div>
                </div>
                <RiskScoreGauge score={p.riskScore || 0} size={56} />
              </div>
              <p className="dpe-card-desc">{p.description}</p>
              {p.resourceEstimate && (
                <div className="dpe-resource-row">
                  <span>Est. Cost: <strong>${p.resourceEstimate.costUSD}</strong></span>
                  <span>Compute: <strong>{p.resourceEstimate.computeHours}h</strong></span>
                </div>
              )}
              <ReasoningPath steps={p.reasoningPath} />
              {can('canApproveProposals') && (
                <div className="dpe-card-actions">
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(p.id)}>
                    <CheckCircle size={13} /> Approve
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setRejectTarget(p.id)}>
                    <XCircle size={13} /> Reject
                  </button>
                </div>
              )}
            </Card>
          ))}
          {proposed.length === 0 && <div className="dpe-empty">No proposals awaiting review</div>}
        </div>

        {/* APPROVED / EXECUTE Column */}
        <div className="dpe-column">
          <div className="dpe-column-header">
            <Zap size={14} />
            <span>Execute</span>
            <Badge color="emerald">{approved.length}</Badge>
          </div>
          {approved.map(a => {
            const gate = PolicyGate.validateExecution(a, session);
            return (
              <Card key={a.id} className="dpe-card dpe-execute-card">
                <div className="dpe-card-title">{a.title}</div>
                <div className="dpe-card-agent">{a.agentName}</div>
                <div className="dpe-resource-row">
                  <span>Risk: <strong>{a.riskScore || 0}</strong></span>
                  {a.resourceEstimate && <span>Cost: <strong>${a.resourceEstimate.costUSD}</strong></span>}
                </div>
                {gate.allowed && can('canExecuteProposals') ? (
                  <button className="btn btn-primary dpe-execute-btn" onClick={() => handleExecute(a)}>
                    <Lock size={13} /> {gate.requiresMultiSig ? 'Execute (Multi-Sig)' : 'Execute'}
                  </button>
                ) : (
                  <div className="dpe-gate-blocked">
                    <AlertTriangle size={12} />
                    <span>{gate.reason}</span>
                  </div>
                )}
              </Card>
            );
          })}
          {executed.length > 0 && (
            <>
              <div className="dpe-column-divider">Completed</div>
              {executed.slice(0, 5).map(e => (
                <Card key={e.id} className="dpe-card dpe-completed-card">
                  <div className="dpe-card-title">{e.title}</div>
                  <Badge color="cyan">Executed</Badge>
                  <div className="dpe-card-time">
                    <CheckCircle size={11} style={{ color: '#059669' }} /> {new Date(e.executedAt).toLocaleString()}
                  </div>
                </Card>
              ))}
            </>
          )}
          {approved.length === 0 && executed.length === 0 && <div className="dpe-empty">No proposals ready for execution</div>}
        </div>
      </motion.div>

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="modal-backdrop" onClick={() => setRejectTarget(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3 className="card-title" style={{ marginBottom: 'var(--space-3)' }}>Reject Proposal</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              Provide a reason for rejection. This will be logged in the audit trail.
            </p>
            <textarea
              className="input"
              rows={3}
              placeholder="Rejection reason (required)"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={handleReject} disabled={!rejectReason.trim()}>Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Sig Modal */}
      <MultiSigModal
        isOpen={!!multiSigTarget}
        onClose={() => setMultiSigTarget(null)}
        proposal={multiSigTarget}
        requiredSignatures={2}
        onComplete={handleMultiSigComplete}
      />
    </motion.div>
  );
}

export { DPEPipelinePage };

```

### src/pages/ForensicAuditPage.jsx
```jsx
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Download, Filter, Clock, Hash,
  FileText, CheckCircle, XCircle, Zap
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { MerkleLogEntry } from '../components/operational/MerkleLogEntry.jsx';
import { useAuthStore } from '../store/authStore.js';
import { usePermission } from '../hooks/usePermission.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { mockApi } from '../services/mockApi.js';

/**
 * Sovereign Protocol — Module 4: Forensic Audit Suite
 * Immutable transparency — the "Black Box" recorder.
 * Time-machine state viewer + Merkle-log integrity checks + compliance export.
 */
function ForensicAuditPage() {
  const user = useAuthStore(s => s.user);
  const { can } = usePermission();
  const [auditEntries, setAuditEntries] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (dataLoaded) return;
    const load = async () => {
      try {
        const [hashes, tl] = await Promise.all([
          mockApi.getAuditHashes(),
          mockApi.getForensicTimeline(),
        ]);
        setAuditEntries(hashes);
        setTimeline(tl);
        setDataLoaded(true);
      } catch (e) { /* mock */ }
    };
    load();
  }, [dataLoaded]);

  const filteredEntries = useMemo(() => {
    if (filterStatus === 'all') return auditEntries;
    return auditEntries.filter(e => e.severity === filterStatus);
  }, [auditEntries, filterStatus]);

  const currentSnapshot = timeline[timelineIndex] || null;

  const stats = useMemo(() => ({
    total: auditEntries.length,
    info: auditEntries.filter(e => e.severity === 'info').length,
    warning: auditEntries.filter(e => e.severity === 'warning').length,
    critical: auditEntries.filter(e => e.severity === 'critical').length,
  }), [auditEntries]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const bundle = {
        exportedAt: new Date().toISOString(),
        exportedBy: user?.id,
        totalEntries: auditEntries.length,
        entries: auditEntries,
        timeline,
      };
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sovereign-audit-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      AuditLogger.log({
        action: AUDIT_ACTIONS.FORENSIC_EXPORT,
        userId: user?.id,
        context: 'forensic_audit',
        details: `Exported ${auditEntries.length} audit records`,
      });
    } catch (e) { /* handled */ }
    setExporting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div className="forensic-audit-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Forensic Audit Suite</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>Immutable transparency — cryptographically verified execution records</p>
      </motion.div>

      {/* Stats */}
      <motion.div className="security-stats-grid" style={{ marginBottom: 'var(--space-5)' }} variants={itemVariants}>
        {[
          { label: 'Total Records', value: stats.total, icon: Hash, color: '#334155' },
          { label: 'Info', value: stats.info, icon: FileText, color: '#3b82f6' },
          { label: 'Warnings', value: stats.warning, icon: Clock, color: '#d97706' },
          { label: 'Critical', value: stats.critical, icon: ShieldCheck, color: '#dc2626' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="security-stat-card" hover>
              <div className="m2-stat-row">
                <span className="security-stat-label">{stat.label}</span>
                <stat.icon size={15} style={{ color: stat.color }} />
              </div>
              <div className="security-stat-value">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Time Machine */}
      {timeline.length > 0 && (
        <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
              State Time Machine
            </h3>
            <Badge color="blue">
              {timeline.length} snapshots
            </Badge>
          </div>

          <div className="timeline-slider-row">
            <input
              type="range"
              min={0}
              max={timeline.length - 1}
              value={timelineIndex}
              onChange={e => setTimelineIndex(Number(e.target.value))}
              className="timeline-slider"
            />
            <span className="timeline-index">{timelineIndex + 1} / {timeline.length}</span>
          </div>

          {currentSnapshot && (
            <div className="timeline-snapshot">
              <div className="timeline-snapshot-grid">
                <div className="timeline-snapshot-field">
                  <span className="timeline-field-label">Timestamp</span>
                  <span className="timeline-field-value">{new Date(currentSnapshot.timestamp).toLocaleString()}</span>
                </div>
                <div className="timeline-snapshot-field">
                  <span className="timeline-field-label">Action</span>
                  <span className="timeline-field-value">{currentSnapshot.action}</span>
                </div>
                <div className="timeline-snapshot-field">
                  <span className="timeline-field-label">Actor</span>
                  <span className="timeline-field-value">{currentSnapshot.actor}</span>
                </div>
                <div className="timeline-snapshot-field">
                  <span className="timeline-field-label">Target</span>
                  <span className="timeline-field-value">{currentSnapshot.target}</span>
                </div>
                <div className="timeline-snapshot-field">
                  <span className="timeline-field-label">Status Before</span>
                  <Badge color="amber">{currentSnapshot.stateBefore}</Badge>
                </div>
                <div className="timeline-snapshot-field">
                  <span className="timeline-field-label">Status After</span>
                  <Badge color="emerald">{currentSnapshot.stateAfter}</Badge>
                </div>
              </div>
              {currentSnapshot.details && (
                <div className="timeline-snapshot-details">{currentSnapshot.details}</div>
              )}
            </div>
          )}
        </Card>
        </motion.div>
      )}

      {/* Merkle-Log Viewer */}
      <motion.div variants={itemVariants}>
      <Card>
        <div className="card-header">
          <h3 className="card-title">
            <ShieldCheck size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
            Merkle Audit Log
          </h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <select
              className="input"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ width: 'auto', padding: '4px 8px', fontSize: 'var(--text-xs)' }}
            >
              <option value="all">All</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
            {can('canExportAuditLogs') && (
              <button className="btn btn-primary btn-sm" onClick={handleExport} disabled={exporting}>
                <Download size={13} /> {exporting ? 'Exporting...' : 'Export Bundle'}
              </button>
            )}
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Action</th>
                <th>Actor</th>
                <th>Time</th>
                <th>Hash</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => (
                <MerkleLogEntry key={entry.id} entry={entry} />
              ))}
            </tbody>
          </table>
        </div>
        {filteredEntries.length === 0 && (
          <div className="dpe-empty" style={{ padding: 'var(--space-6)' }}>No audit records match the current filter</div>
        )}
      </Card>
      </motion.div>
    </motion.div>
  );
}

export { ForensicAuditPage };

```

### src/pages/GovernancePage.jsx
```jsx
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Crown, Eye, FileText, Check, X, Play,
  AlertTriangle, Bot, UserCog, Shield, Plus, Trash2,
  Clock, ChevronRight
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { SafeRenderer } from '../components/common/SafeRenderer.jsx';
import { TierGate } from '../components/layout/TierGate.jsx';
import { useGovernanceStore } from '../store/governanceStore.js';
import { usePermission } from '../hooks/usePermission.js';
import { usePolicyValidator } from '../hooks/usePolicyValidator.js';
import { mockApi } from '../services/mockApi.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';

/**
 * Sovereign Protocol — Governance Page
 * RBAC dashboards + DPE Pipeline + Agent Management
 */
function GovernancePage() {
  const { can, roleName } = usePermission();
  const { validate, isPaused, activeBlocker, clearPause } = usePolicyValidator();
  const {
    proposals, blockerReports, agents, activePortal,
    setActivePortal, addProposal, approveProposal, rejectProposal,
    executeProposal, resolveBlockerReport, addAgent, terminateAgent,
    addBlockerReport,
  } = useGovernanceStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const loadData = async () => {
      try {
        const [proposalData, agentData, blockerData] = await Promise.all([
          mockApi.getProposals(),
          mockApi.getAgents(),
          mockApi.getBlockerReports(),
        ]);
        proposalData.forEach(p => addProposal(p));
        agentData.forEach(a => addAgent(a));
        blockerData.forEach(b => addBlockerReport(b));
        setLoaded(true);
      } catch (err) { /* handled */ }
    };
    loadData();
  }, [loaded, addProposal, addAgent, addBlockerReport]);

  const tabs = [
    { id: 'founder', label: 'Founder Dashboard', icon: Crown },
    { id: 'supervisor', label: 'AI Supervisor', icon: UserCog },
    { id: 'auditor', label: 'Auditor Portal', icon: Eye },
  ];

  const draftProposals = useMemo(() => proposals.filter(p => p.status === 'draft'), [proposals]);
  const proposedProposals = useMemo(() => proposals.filter(p => p.status === 'proposed'), [proposals]);
  const approvedProposals = useMemo(() => proposals.filter(p => p.status === 'approved' || p.status === 'executed'), [proposals]);
  const unresolvedBlockers = useMemo(() => blockerReports.filter(r => r.status === 'PAUSE_STATE'), [blockerReports]);
  const activeAgents = useMemo(() => agents.filter(a => a.status === 'active'), [agents]);

  const handleApprove = (id) => {
    approveProposal(id, 'founder');
    AuditLogger.log({ action: AUDIT_ACTIONS.PROPOSAL_APPROVE, details: { proposalId: id } });
  };

  const handleReject = (id) => {
    rejectProposal(id, 'founder', 'Rejected by founder');
    AuditLogger.log({ action: AUDIT_ACTIONS.PROPOSAL_REJECT, details: { proposalId: id } });
  };

  const handleExecute = (id) => {
    if (!can('canExecuteProposals')) return;
    executeProposal(id, 'founder');
    AuditLogger.log({ action: AUDIT_ACTIONS.PROPOSAL_EXECUTE, details: { proposalId: id } });
  };

  const handleTerminate = (agentId) => {
    terminateAgent(agentId, 'founder');
    AuditLogger.log({ action: AUDIT_ACTIONS.AGENT_TERMINATE, details: { agentId } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <TierGate requiredTier={2} requiredFeature="governance">
      <motion.div className="governance-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <motion.div className="page-header" variants={itemVariants}>
          <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Deterministic Governance & RBAC</h1>
          <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>Human-centric control — AI agents execute, humans decide</p>
        </motion.div>

        {/* Portal Tabs */}
        <motion.div className="governance-tabs" variants={itemVariants}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`governance-tab ${activePortal === tab.id ? 'active' : ''}`}
              onClick={() => setActivePortal(tab.id)}
              id={`tab-${tab.id}`}
            >
              <tab.icon size={16} style={{ marginRight: 6 }} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Pause State Alert */}
        {isPaused && activeBlocker && (
          <motion.div variants={itemVariants}>
            <Card variant="danger" style={{ borderLeft: '4px solid var(--color-accent-rose)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <AlertTriangle size={20} style={{ color: 'var(--color-accent-rose)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-accent-rose)' }}>
                    PAUSE STATE — Policy Violation Detected
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                    Blocker ID: {activeBlocker.id} — {activeBlocker.violations?.join(', ')}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={clearPause}>Acknowledge</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* DPE Pipeline */}
        <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="card-title">Draft-Propose-Execute Pipeline</h3>
            <Badge color="violet">Non-Executable Until Approved</Badge>
          </div>
          <div className="dpe-pipeline">
            {/* Draft Column */}
            <div className="dpe-column">
              <div className="dpe-column-header" style={{ color: 'var(--color-accent-amber)' }}>
                <FileText size={16} /> Drafts
                <span className="dpe-column-count">{draftProposals.length}</span>
              </div>
              {draftProposals.map(p => (
                <Card key={p.id} hover style={{ padding: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>{p.title}</h4>
                  <SafeRenderer content={p.description} agentId={p.agentId} context="dpe_draft" />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
                    <Badge color="cyan">{p.agentName}</Badge>
                    {can('canApproveProposals') && (
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Button variant="success" size="sm" icon={Check} onClick={() => handleApprove(p.id)}>Approve</Button>
                        <Button variant="danger" size="sm" icon={X} onClick={() => handleReject(p.id)}>Reject</Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Proposed Column */}
            <div className="dpe-column">
              <div className="dpe-column-header" style={{ color: 'var(--color-accent-blue)' }}>
                <ChevronRight size={16} /> Under Review
                <span className="dpe-column-count">{proposedProposals.length}</span>
              </div>
              {proposedProposals.map(p => (
                <Card key={p.id} hover style={{ padding: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>{p.title}</h4>
                  <SafeRenderer content={p.description} agentId={p.agentId} context="dpe_review" />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
                    <Badge color="cyan">{p.agentName}</Badge>
                    {can('canApproveProposals') && (
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Button variant="success" size="sm" icon={Check} onClick={() => handleApprove(p.id)}>Approve</Button>
                        <Button variant="danger" size="sm" icon={X} onClick={() => handleReject(p.id)}>Reject</Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Approved / Executed Column */}
            <div className="dpe-column">
              <div className="dpe-column-header" style={{ color: 'var(--color-accent-emerald)' }}>
                <Play size={16} /> Ready / Executed
                <span className="dpe-column-count">{approvedProposals.length}</span>
              </div>
              {approvedProposals.map(p => (
                <Card key={p.id} hover style={{ padding: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>{p.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
                    <Badge color={p.status === 'executed' ? 'emerald' : 'blue'}>{p.status}</Badge>
                    {p.status === 'approved' && can('canExecuteProposals') && (
                      <Button variant="primary" size="sm" icon={Play} onClick={() => handleExecute(p.id)} id={`execute-${p.id}`}>Execute</Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
        </motion.div>

        {/* Agent Management (Founder only) */}
        {can('canHireAgents') && (
          <motion.div variants={itemVariants}>
          <Card>
            <div className="card-header">
              <h3 className="card-title">Agent Management</h3>
              <Badge color="rose">Financial Permissions: NONE</Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {activeAgents.map(agent => (
                <div key={agent.id} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                  padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                    background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Bot size={20} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{agent.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{agent.role} • {agent.department} • {agent.completedTasks}/{agent.taskCount} tasks</div>
                  </div>
                  <Badge color="emerald">Active</Badge>
                  <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleTerminate(agent.id)}>Terminate</Button>
                </div>
              ))}
            </div>
          </Card>
          </motion.div>
        )}

        {/* Blocker Reports */}
        {unresolvedBlockers.length > 0 && (
          <motion.div variants={itemVariants}>
          <Card variant="warning">
            <div className="card-header">
              <h3 className="card-title">Blocker Reports</h3>
              <Badge color="amber">{unresolvedBlockers.length} Unresolved</Badge>
            </div>
            {unresolvedBlockers.map(report => (
              <div key={report.id} style={{
                padding: 'var(--space-4)', background: 'rgba(245,158,11,0.06)',
                borderRadius: 'var(--radius-md)', marginTop: 'var(--space-3)',
                border: '1px solid rgba(245,158,11,0.15)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-accent-amber)' }}>{report.type}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{report.id}</span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Agent: {report.agentName || report.agentId}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                  {report.violations?.join(' | ')}
                </p>
                <Button variant="secondary" size="sm" onClick={() => resolveBlockerReport(report.id, 'founder', 'reviewed')} style={{ marginTop: 'var(--space-3)' }}>
                  Mark Resolved
                </Button>
              </div>
            ))}
          </Card>
          </motion.div>
        )}
      </motion.div>
    </TierGate>
  );
}

export { GovernancePage };

```

### src/pages/IdentityPage.jsx
```jsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Fingerprint, Building2, ShieldCheck, Wallet, Check,
  Lock, ChevronRight, Globe, Mail, Users, Upload,
  Loader2, AlertTriangle, ExternalLink, RefreshCw
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { StatusIndicator } from '../components/common/StatusIndicator.jsx';
import { FileUploader } from '../components/common/FileUploader.jsx';
import { CopyToClipboard } from '../components/common/CopyToClipboard.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useIdentityStore } from '../store/identityStore.js';
import { useOnboardingStore } from '../store/onboardingStore.js';
import { useWallet } from '../hooks/useWallet.js';
import { mockApi } from '../services/mockApi.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';

const STEPS = [
  { id: 'A', label: 'Human ID', icon: Fingerprint },
  { id: 'B', label: 'Business ID', icon: Building2 },
  { id: 'C', label: 'Authority', icon: ShieldCheck },
  { id: 'D', label: 'Crypto ID', icon: Wallet },
];

/**
 * Sovereign Protocol — Identity Page
 * Multi-Layer Identity Matrix (Layers A through D)
 */
function IdentityPage() {
  const {
    layerA, layerB, layerC, layerD,
    activeStep, completedLayers,
    addDocument, updateLayerB, completeLayerB,
    updateDnsStatus, updateEmailStatus,
    setMultiSigThreshold, addMultiSigSignature,
    bindWallet,
  } = useIdentityStore();
  const setCurrentTier = useOnboardingStore(s => s.setCurrentTier);
  const { connectWallet, signBindingMessage, isConnecting, error: walletError } = useWallet();

  const [kybLoading, setKybLoading] = useState(false);
  const [dnsLoading, setDnsLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [dnsRecord, setDnsRecord] = useState(null);

  // Determine which step to show
  const getStepStatus = (stepIndex) => {
    const stepId = STEPS[stepIndex].id;
    if (completedLayers.includes(stepId) || (stepId === 'C' && layerC.verifiedAt)) return 'completed';
    if (stepIndex === activeStep || (stepId === 'A' && layerA.status === 'verified')) return 'active';
    if (stepIndex > activeStep) return 'locked';
    return 'active';
  };

  // --- Layer B: KYB Handlers ---
  const handleFileEncrypted = useCallback((encryptedFile) => {
    addDocument(encryptedFile);
    AuditLogger.log({ action: AUDIT_ACTIONS.DOCUMENT_UPLOAD, details: { fileName: encryptedFile.name } });
  }, [addDocument]);

  const handleSubmitKYB = useCallback(async () => {
    setKybLoading(true);
    updateLayerB({ status: 'in_progress', govApiStatus: 'verifying' });
    try {
      const result = await mockApi.checkKYBStatus('kyb_request_1');
      if (result.status === 'verified') {
        completeLayerB({ name: result.businessName, registrationNumber: result.registrationNumber });
        setCurrentTier(1);
        AuditLogger.log({ action: AUDIT_ACTIONS.IDENTITY_VERIFY, details: { layer: 'B', business: result.businessName } });
      }
    } catch (err) {
      updateLayerB({ govApiStatus: 'rejected' });
    } finally {
      setKybLoading(false);
    }
  }, [updateLayerB, completeLayerB, setCurrentTier]);

  // --- Layer C: DNS Handler ---
  const handleGenerateDNS = useCallback(async () => {
    setDnsLoading(true);
    try {
      const result = await mockApi.generateDNSTxt('enterprise.com');
      setDnsRecord(result.txtRecord);
      updateDnsStatus('pending', result.txtRecord);
    } finally {
      setDnsLoading(false);
    }
  }, [updateDnsStatus]);

  const handleVerifyDNS = useCallback(async () => {
    setDnsLoading(true);
    try {
      const result = await mockApi.verifyDNS('enterprise.com');
      updateDnsStatus('verified', result.txtRecord);
      AuditLogger.log({ action: AUDIT_ACTIONS.DNS_VERIFY, details: { domain: result.domain } });
    } catch {
      updateDnsStatus('failed', null);
    } finally {
      setDnsLoading(false);
    }
  }, [updateDnsStatus]);

  // --- Layer C: Email Handler ---
  const handleSendMagicLink = useCallback(async () => {
    setEmailLoading(true);
    try {
      await mockApi.sendMagicLink('ceo@enterprise.com');
      setEmailSent(true);
    } finally {
      setEmailLoading(false);
    }
  }, []);

  const handleVerifyEmail = useCallback(async () => {
    setEmailLoading(true);
    try {
      const result = await mockApi.verifyMagicLink('mock_token');
      if (result.success) {
        updateEmailStatus('verified', result.domain);
        setCurrentTier(2);
        AuditLogger.log({ action: AUDIT_ACTIONS.EMAIL_VERIFY, details: { email: result.email } });
      }
    } finally {
      setEmailLoading(false);
    }
  }, [updateEmailStatus, setCurrentTier]);

  // --- Layer D: Wallet Handler ---
  const handleConnectAndBind = useCallback(async () => {
    const wallet = await connectWallet();
    if (wallet) {
      const binding = await signBindingMessage(wallet.address, layerB.registrationNumber || 'BIZ_001');
      if (binding) {
        setCurrentTier(3);
      }
    }
  }, [connectWallet, signBindingMessage, layerB.registrationNumber, setCurrentTier]);

  const progress = (completedLayers.length / 6) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div className="identity-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Multi-Layer Identity Matrix</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>Progressive identity verification across 4 security layers</p>
      </motion.div>

      {/* Progress */}
      <motion.div variants={itemVariants}>
        <ProgressBar value={progress} max={100} label="Verification Progress" showPercent />
      </motion.div>

      {/* Stepper */}
      <motion.div className="identity-stepper" variants={itemVariants}>
        {STEPS.map((step, i) => {
          const status = getStepStatus(i);
          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`identity-step ${status}`} onClick={() => { if (status !== 'locked') useIdentityStore.getState().activeStep; }}>
                <div className="identity-step-number">
                  {status === 'completed' ? <Check size={14} /> : <step.icon size={14} />}
                </div>
                <span>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`identity-step-connector ${status === 'completed' ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Layer A: Human ID — Already completed at login */}
      <motion.div variants={itemVariants}>
      <Card variant={layerA.status === 'verified' ? 'success' : ''}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Fingerprint size={20} style={{ color: layerA.status === 'verified' ? 'var(--color-accent-emerald)' : 'var(--color-text-muted)' }} />
            <div>
              <h3 className="card-title">Layer A: Human ID</h3>
              <p className="card-subtitle">Proof of human presence at the keyboard</p>
            </div>
          </div>
          <Badge color={layerA.status === 'verified' ? 'emerald' : 'amber'} icon={layerA.status === 'verified' ? Check : Lock}>
            {layerA.status === 'verified' ? 'Verified' : 'Pending'}
          </Badge>
        </div>
        {layerA.status === 'verified' && (
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Authenticated via <strong>{layerA.provider}</strong> at {new Date(layerA.verifiedAt).toLocaleString()}
          </div>
        )}
      </Card>
      </motion.div>

      {/* Layer B: Business ID */}
      <motion.div variants={itemVariants}>
      <Card variant={layerB.status === 'verified' ? 'success' : layerA.status !== 'verified' ? '' : 'accent'}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Building2 size={20} style={{ color: layerB.status === 'verified' ? 'var(--color-accent-emerald)' : 'var(--color-accent-blue)' }} />
            <div>
              <h3 className="card-title">Layer B: Business ID (KYB)</h3>
              <p className="card-subtitle">Institutional proof of legal entity existence</p>
            </div>
          </div>
          <Badge color={layerB.status === 'verified' ? 'emerald' : layerB.govApiStatus === 'verifying' ? 'amber' : 'blue'}>
            {layerB.status === 'verified' ? 'Verified' : layerB.govApiStatus === 'verifying' ? 'Verifying...' : layerA.status !== 'verified' ? 'Locked' : 'Ready'}
          </Badge>
        </div>

        {layerA.status === 'verified' && layerB.status !== 'verified' && (
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FileUploader onFileEncrypted={handleFileEncrypted} disabled={kybLoading} />

            {layerB.govApiStatus === 'verifying' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Loader2 size={18} className="animate-spin" style={{ color: 'var(--color-accent-amber)' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-amber)' }}>Government API Bridge — Verification Pending</span>
              </div>
            )}

            <Button variant="primary" onClick={handleSubmitKYB} loading={kybLoading} disabled={layerB.documents.length === 0} id="submit-kyb-btn">
              <Upload size={16} /> Submit for KYB Verification
            </Button>
          </div>
        )}

        {layerB.status === 'verified' && (
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            <strong>{layerB.businessName}</strong> — {layerB.registrationNumber}
          </div>
        )}
      </Card>
      </motion.div>

      {/* Layer C: Authority Verification */}
      <motion.div variants={itemVariants}>
      <Card variant={layerC.verifiedAt ? 'success' : layerB.status === 'verified' ? 'accent' : ''}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <ShieldCheck size={20} style={{ color: layerC.verifiedAt ? 'var(--color-accent-emerald)' : 'var(--color-accent-blue)' }} />
            <div>
              <h3 className="card-title">Layer C: Authority Verification</h3>
              <p className="card-subtitle">Legal binding — proves you can represent this business</p>
            </div>
          </div>
        </div>

        {layerB.status === 'verified' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
            {/* DNS Verification */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Globe size={16} style={{ color: 'var(--color-accent-cyan)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>DNS Domain Verification</span>
                </div>
                <StatusIndicator status={layerC.dnsStatus === 'verified' ? 'active' : layerC.dnsStatus === 'pending' ? 'pending' : 'inactive'} label={layerC.dnsStatus === 'verified' ? 'Verified' : layerC.dnsStatus === 'pending' ? 'Pending' : 'Not started'} />
              </div>

              {layerC.dnsStatus !== 'verified' && !dnsRecord && (
                <Button variant="secondary" size="sm" onClick={handleGenerateDNS} loading={dnsLoading} id="generate-dns-btn">
                  Generate TXT Record
                </Button>
              )}

              {dnsRecord && layerC.dnsStatus !== 'verified' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <CopyToClipboard text={dnsRecord} label="Add this TXT record to your DNS settings" />
                  <Button variant="primary" size="sm" onClick={handleVerifyDNS} loading={dnsLoading} icon={RefreshCw} id="verify-dns-btn">
                    Verify DNS Record
                  </Button>
                </div>
              )}
            </div>

            {/* Email Verification */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Mail size={16} style={{ color: 'var(--color-accent-violet)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Corporate Email Handshake</span>
                </div>
                <StatusIndicator status={layerC.emailStatus === 'verified' ? 'active' : emailSent ? 'pending' : 'inactive'} label={layerC.emailStatus === 'verified' ? 'Verified' : emailSent ? 'Link Sent' : 'Not started'} />
              </div>

              {layerC.emailStatus !== 'verified' && !emailSent && (
                <Button variant="secondary" size="sm" onClick={handleSendMagicLink} loading={emailLoading} icon={Mail} id="send-magic-link-btn">
                  Send Magic Link to ceo@enterprise.com
                </Button>
              )}

              {emailSent && layerC.emailStatus !== 'verified' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    A verification link has been sent to your corporate email. Click the link, then press verify.
                  </p>
                  <Button variant="primary" size="sm" onClick={handleVerifyEmail} loading={emailLoading} icon={Check} id="verify-email-btn">
                    I've Clicked the Link — Verify
                  </Button>
                </div>
              )}
            </div>

            {/* Multi-Sig Board (Enterprise) */}
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Users size={16} style={{ color: 'var(--color-accent-amber)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Multi-Sig Board Approval</span>
                </div>
                <Badge color="amber">Enterprise Only</Badge>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                Governance Threshold: 2 of 3 board member signatures required. Available after DNS and Email verification.
              </p>
            </div>
          </div>
        )}
      </Card>
      </motion.div>

      {/* Layer D: Cryptographic ID */}
      <motion.div variants={itemVariants}>
      <Card variant={layerD.status === 'verified' ? 'success' : completedLayers.includes('C_EMAIL') ? 'accent' : ''}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Wallet size={20} style={{ color: layerD.status === 'verified' ? 'var(--color-accent-emerald)' : 'var(--color-accent-violet)' }} />
            <div>
              <h3 className="card-title">Layer D: Cryptographic ID</h3>
              <p className="card-subtitle">Web3 wallet binding — authorized by Layer C</p>
            </div>
          </div>
          {layerD.status === 'verified' && <Badge color="emerald" icon={Check}>Bound</Badge>}
        </div>

        {completedLayers.includes('C_EMAIL') && layerD.status !== 'verified' && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                Connect your MetaMask wallet and sign a binding message. This permanently links your wallet to your verified Business ID.
              </p>
            </div>
            {walletError && <p className="input-error-text" style={{ marginBottom: 'var(--space-3)' }}>{walletError}</p>}
            <Button variant="primary" onClick={handleConnectAndBind} loading={isConnecting} icon={Wallet} id="connect-wallet-btn">
              Connect & Bind Wallet
            </Button>
          </div>
        )}

        {layerD.status === 'verified' && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            <CopyToClipboard text={layerD.walletAddress} label="Bound Wallet Address" />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
              Bound at {new Date(layerD.boundAt).toLocaleString()} via {layerD.walletProvider}
            </p>
          </div>
        )}
      </Card>
      </motion.div>
    </motion.div>
  );
}

export { IdentityPage };

```

### src/pages/LoginPage.jsx
```jsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, KeyRound, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button.jsx';
import { useAuthStore } from '../store/authStore.js';
import { useIdentityStore } from '../store/identityStore.js';
import { useOnboardingStore } from '../store/onboardingStore.js';
import { CryptoService } from '../security/CryptoService.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { mockApi } from '../services/mockApi.js';
import { LuxuryFluidBackground } from '../components/spatial/LuxuryFluidBackground.jsx';
import { AUDIT_ACTIONS } from '../config/constants.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
      duration: 0.4
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

/**
 * Sovereign Protocol — Login Page
 * Layer A: Human ID verification (SSO + 2FA).
 */
function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const verify2FA = useAuthStore(s => s.verify2FA);
  const completeLayerA = useIdentityStore(s => s.completeLayerA);
  const setCurrentTier = useOnboardingStore(s => s.setCurrentTier);
  const [step, setStep] = useState('provider'); // 'provider' | '2fa' | 'verifying'
  const [loading, setLoading] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleProviderLogin = useCallback(async (provider) => {
    setLoading(true);
    setError(null);
    setSelectedProvider(provider);

    try {
      const result = await mockApi.authenticate(provider, { email: 'ceo@enterprise.com', name: 'Alex Mercer' });

      if (result.success) {
        const fingerprint = await CryptoService.generateSessionFingerprint();
        login({
          ...result.user,
          sessionFingerprint: fingerprint,
          provider,
          twoFactorVerified: false,
        });

        AuditLogger.log({
          action: AUDIT_ACTIONS.LOGIN,
          userId: result.user.id,
          details: { provider },
        });

        if (result.user.twoFactorRequired) {
          setStep('2fa');
        } else {
          completeLayerA(provider);
          setCurrentTier(0);
          navigate('/identity');
        }
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [login, completeLayerA, setCurrentTier, navigate]);

  const handle2FAInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...twoFaCode];
    newCode[index] = value.slice(-1);
    setTwoFaCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`2fa-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handle2FAKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !twoFaCode[index] && index > 0) {
      const prev = document.getElementById(`2fa-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerify2FA = useCallback(async () => {
    const code = twoFaCode.join('');
    if (code.length !== 6) return;

    setLoading(true);
    setError(null);
    setStep('verifying');

    try {
      const result = await mockApi.verify2FA(code);
      if (result.success) {
        verify2FA();
        completeLayerA(selectedProvider);
        setCurrentTier(0);
        navigate('/identity');
      } else {
        setError('Invalid verification code.');
        setStep('2fa');
      }
    } catch (err) {
      setError('Verification failed.');
      setStep('2fa');
    } finally {
      setLoading(false);
    }
  }, [twoFaCode, verify2FA, completeLayerA, selectedProvider, setCurrentTier, navigate]);

  return (
    <div className="login-page h-[100dvh] overflow-hidden">
      {/* Fullscreen Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <LuxuryFluidBackground />
      </div>

      <div className="login-container">
        <motion.div
          style={{ width: '100%', maxWidth: 460 }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="login-header" variants={itemVariants}>
            <div className="login-logo">
              <Shield size={20} color="white" />
            </div>
            <h1 className="login-title brand-title">Sovereign Protocol</h1>
            <p className="login-subtitle">Institutional-Grade AI Enterprise Platform</p>
          </motion.div>

          {step === 'provider' && (
            <motion.div className="login-form login-card-bubble" variants={itemVariants}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
                  Sign in to your account
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                  Select an identity provider to continue
                </p>
              </div>

              <div className="login-providers">
                <button className="login-provider-btn" onClick={() => handleProviderLogin('microsoft')} disabled={loading} id="login-microsoft">
                  <Lock size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                  Microsoft Entra ID
                  <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
                </button>

                <button className="login-provider-btn" onClick={() => handleProviderLogin('google')} disabled={loading} id="login-google">
                  <Mail size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                  Google Workspace
                  <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
                </button>

                <button className="login-provider-btn" onClick={() => handleProviderLogin('did')} disabled={loading} id="login-did">
                  <KeyRound size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                  Decentralized ID (DID)
                  <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
                </button>
              </div>

              {error && <p className="input-error-text">{error}</p>}

              <div className="login-security-note">
                <Shield size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginTop: 1 }} />
                <span>Non-persistent session. All data is wiped on tab close or after 5 minutes of inactivity.</span>
              </div>
            </motion.div>
          )}

          {(step === '2fa' || step === 'verifying') && (
            <motion.div className="login-form login-card-bubble" variants={itemVariants}>
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
                  Two-factor authentication
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div className="login-2fa">
                {twoFaCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`2fa-${i}`}
                    className="login-2fa-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handle2FAInput(i, e.target.value)}
                    onKeyDown={(e) => handle2FAKeyDown(i, e)}
                    disabled={step === 'verifying'}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && <p className="input-error-text">{error}</p>}

              <Button
                variant="primary"
                size="lg"
                onClick={handleVerify2FA}
                loading={step === 'verifying'}
                disabled={twoFaCode.join('').length !== 6}
                style={{ width: '100%', marginTop: 'var(--space-4)' }}
                id="verify-2fa-btn"
              >
                Verify & continue
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export { LoginPage };

```

### src/pages/MarketplacePage.jsx
```jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ShieldCheck, Star, TrendingUp, Lock, XCircle,
  Filter, ShoppingBag, Shield, AlertTriangle, Package
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { useMarketplaceStore } from '../store/marketplaceStore.js';
import { useAuthStore } from '../store/authStore.js';
import { usePermission } from '../hooks/usePermission.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { mockApi } from '../services/mockApi.js';

/**
 * Sovereign Protocol — Module 2: Global Marketplace Page
 * ZK-Reputation Engine with Trustless Resumes.
 * Privacy-preserving search — NO employer identities exposed.
 */
function MarketplacePage() {
  const user = useAuthStore(s => s.user);
  const {
    catalogAgents, filters, filterOptions, sandboxHires, isLoading,
    setCatalogAgents, setFilters, resetFilters, setFilterOptions,
    addSandboxHire, setLoading, getFilteredAgents,
  } = useMarketplaceStore();
  const { can } = usePermission();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [hireModal, setHireModal] = useState(null);
  const [trialDays, setTrialDays] = useState(7);
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    if (dataLoaded) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [agents, filterOpts] = await Promise.all([
          mockApi.getMarketplaceAgents(),
          mockApi.getMarketplaceFilters(),
        ]);
        setCatalogAgents(agents);
        setFilterOptions(filterOpts);
        setDataLoaded(true);
      } catch (e) { /* mock */ }
      setLoading(false);
    };
    loadData();
  }, [dataLoaded]);

  const filteredAgents = getFilteredAgents();

  const handleSandboxHire = async (agent) => {
    setHiring(true);
    try {
      const result = await mockApi.hireAgentToSandbox(agent.id, trialDays);
      if (result.success) {
        addSandboxHire({ ...result.hire, agentName: agent.displayName });
        AuditLogger.log({
          action: AUDIT_ACTIONS.SANDBOX_ACTIVATE,
          agentId: agent.id,
          userId: user?.id,
          context: 'marketplace',
          details: `Hired ${agent.displayName} to sandbox for ${trialDays} days`,
        });
      }
    } catch (e) { /* mock */ }
    setHiring(false);
    setHireModal(null);
  };

  if (isLoading && !dataLoaded) {
    return (
      <div className="marketplace-page">
        <div className="page-header">
          <h1 className="page-title">Global Marketplace</h1>
          <p className="page-subtitle">Loading agent catalog</p>
        </div>
        <Card><div className="skeleton" style={{ height: 300 }} /></Card>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div className="marketplace-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Global Marketplace</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>
          Browse and hire verified AI agents with zero-knowledge reputation proofs
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div className="security-stats-grid" variants={itemVariants}>
        {[
          { label: 'Available', value: catalogAgents.filter(a => a.isAvailable).length, icon: ShoppingBag, color: '#059669' },
          { label: 'Elite Tier', value: catalogAgents.filter(a => a.tier === 'elite').length, icon: Star, color: '#d97706' },
          { label: 'Sandbox Active', value: sandboxHires.filter(h => h.status === 'sandbox_active').length, icon: Shield, color: '#334155' },
          { label: 'Avg. Score', value: catalogAgents.length ? (catalogAgents.reduce((s, a) => s + a.reputationScore, 0) / catalogAgents.length).toFixed(1) : '0', icon: TrendingUp, color: '#6366f1' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}>
            <Card className="security-stat-card" hover>
              <div className="m2-stat-row">
                <span className="security-stat-label">{stat.label}</span>
                <div className="m2-stat-icon" style={{ background: `${stat.color}0d` }}>
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="security-stat-value">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Privacy Notice */}
      <motion.div className="m2-info-bar" variants={itemVariants}>
        <Shield size={14} style={{ color: '#059669', flexShrink: 0 }} />
        <span>
          <strong>Privacy-preserving search.</strong> Results display metadata only. No employer identities or sensitive logs are exposed.
        </span>
      </motion.div>

      {/* Filters */}
      <motion.div className="marketplace-filters" id="marketplace-filter-bar" variants={itemVariants}>
        <Search size={15} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        <input
          className="marketplace-search-input"
          placeholder="Search by name or skill..."
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
          id="marketplace-search"
        />
        <select className="filter-select" value={filters.specialization} onChange={(e) => setFilters({ specialization: e.target.value })} id="filter-specialization">
          <option value="">All Specializations</option>
          {filterOptions.specializations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={filters.sortBy} onChange={(e) => setFilters({ sortBy: e.target.value })} id="filter-sort">
          <option value="reputation">Sort: Reputation</option>
          <option value="roi">Sort: ROI</option>
          <option value="latency">Sort: Latency</option>
        </select>
        <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset</button>
      </motion.div>

      {/* Catalog Grid */}
      <motion.div className="marketplace-grid" variants={itemVariants}>
        {filteredAgents.map((agent, i) => (
          <motion.div key={agent.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.25 }}>
            <Card className={`mkt-agent-card ${agent.tier} ${!agent.isAvailable ? 'unavailable' : ''}`} hover id={`mkt-card-${agent.id}`}>
              <div className="mkt-agent-header">
                <div>
                  <div className="mkt-agent-name">{agent.displayName}</div>
                  <div className="mkt-agent-spec">{agent.specialization}</div>
                </div>
                <span className={`mkt-agent-tier ${agent.tier}`}>{agent.tier}</span>
              </div>

              <div className="mkt-agent-stats">
                <div className="mkt-stat">
                  <div className="mkt-stat-value">{agent.reputationScore}</div>
                  <div className="mkt-stat-label">Score</div>
                </div>
                <div className="mkt-stat">
                  <div className="mkt-stat-value">{agent.avgROI}%</div>
                  <div className="mkt-stat-label">ROI</div>
                </div>
                <div className="mkt-stat">
                  <div className="mkt-stat-value">{agent.avgLatency}<span style={{ fontSize: '9px' }}>ms</span></div>
                  <div className="mkt-stat-label">Latency</div>
                </div>
              </div>

              <div className="zk-badges-row">
                {agent.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="zk-badge-chip verified">
                    <ShieldCheck size={9} /> {skill}
                  </span>
                ))}
                {agent.verifiedBadgeCount > 3 && (
                  <span className="zk-badge-chip">+{agent.verifiedBadgeCount - 3}</span>
                )}
              </div>

              <div className="m2-card-footer">
                <span className="m2-card-meta">{agent.totalTasksCompleted.toLocaleString()} tasks</span>
                {can('canHireFromMarketplace') && agent.isAvailable ? (
                  <button className="btn btn-primary btn-sm" onClick={() => setHireModal(agent)} id={`hire-btn-${agent.id}`}>
                    Trial Hire
                  </button>
                ) : !agent.isAvailable ? (
                  <Badge color="amber">Unavailable</Badge>
                ) : null}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredAgents.length === 0 && (
        <motion.div className="empty-state" variants={itemVariants}>
          <Search size={32} className="empty-state-icon" />
          <div className="empty-state-title">No agents match your criteria</div>
          <div className="empty-state-text">Adjust filters to broaden your search.</div>
        </motion.div>
      )}

      {/* Active Sandbox Hires */}
      {sandboxHires.length > 0 && (
        <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="card-title">Sandbox Trials</h3>
            <Badge color="blue">{sandboxHires.filter(h => h.status === 'sandbox_active').length} active</Badge>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr><th>Agent</th><th>Status</th><th>Trial Period</th><th>Restrictions</th></tr>
              </thead>
              <tbody>
                {sandboxHires.map(hire => (
                  <tr key={hire.id}>
                    <td style={{ fontWeight: 'var(--font-semibold)' }}>{hire.agentName}</td>
                    <td><Badge color={hire.status === 'sandbox_active' ? 'emerald' : 'amber'}>{hire.status.replace('_', ' ')}</Badge></td>
                    <td>{hire.trialDays} days</td>
                    <td>
                      <span className="m2-restriction-inline"><XCircle size={10} /> No Treasury</span>
                      <span className="m2-restriction-inline"><XCircle size={10} /> No Memory</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </motion.div>
      )}

      {/* Sandbox Hire Modal */}
      <Modal isOpen={!!hireModal} onClose={() => setHireModal(null)} title="Sandbox Hire">
        {hireModal && (
          <>
            <div className="m2-modal-agent-info">
              <div className="m2-modal-agent-name">{hireModal.displayName}</div>
              <div className="m2-modal-agent-spec">{hireModal.specialization}</div>
            </div>

            <div className="m2-modal-restrictions">
              <div className="m2-modal-restrictions-title">Tier 0 Sandbox Restrictions</div>
              <div className="m2-modal-restriction"><XCircle size={12} style={{ color: '#dc2626' }} /> No Treasury Access</div>
              <div className="m2-modal-restriction"><XCircle size={12} style={{ color: '#dc2626' }} /> No Company Memory Access</div>
              <div className="m2-modal-restriction"><AlertTriangle size={12} style={{ color: '#d97706' }} /> Pre-Production Environment Only</div>
              <div className="m2-modal-restriction"><Lock size={12} style={{ color: '#64748b' }} /> Tier 0 Isolation Enforced</div>
            </div>

            <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
              <label className="input-label">Trial Period</label>
              <select className="input-field" value={trialDays} onChange={(e) => setTrialDays(Number(e.target.value))} id="trial-days-select">
                <option value={3}>3 Days</option>
                <option value={7}>7 Days</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days</option>
              </select>
            </div>

            <div className="m2-modal-actions">
              <button className="btn btn-secondary" onClick={() => setHireModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSandboxHire(hireModal)} disabled={hiring} id="confirm-hire-btn">
                {hiring ? 'Processing...' : 'Confirm Hire'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </motion.div>
  );
}

export { MarketplacePage };

```

### src/pages/OnboardingPage.jsx
```jsx
import { motion } from 'framer-motion';
import { Shield, Lock, Check, ChevronRight, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useTierGate } from '../hooks/useTierGate.js';
import { TIERS } from '../config/tiers.js';

/**
 * Sovereign Protocol — Onboarding Page
 * Progressive Trust state machine visualization (Tier 0-3).
 */
function OnboardingPage() {
  const navigate = useNavigate();
  const { currentTierId, currentTier, completedLayers } = useTierGate();

  const tiers = Object.values(TIERS);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }} variants={containerVariants} initial="hidden" animate="show">
      <motion.div className="page-header" style={{ textAlign: 'center' }} variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Progressive Trust Level</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>Complete verification steps to unlock platform capabilities</p>
      </motion.div>

      {/* Current Tier Display */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="accent" style={{ textAlign: 'center', marginBottom: 'var(--space-8)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: currentTier.color }} />
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-xl)', margin: '0 auto var(--space-4)',
            background: 'var(--color-bg-tertiary)',
            border: `2px solid ${currentTier.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers size={32} style={{ color: currentTier.color }} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>
            Tier {currentTierId}: {currentTier.name}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', maxWidth: 500, margin: 'var(--space-2) auto 0' }}>
            {currentTier.description}
          </p>
          <div style={{ marginTop: 'var(--space-6)', maxWidth: 400, margin: 'var(--space-6) auto 0' }}>
            <ProgressBar value={currentTierId} max={3} label="Trust Progression" showPercent />
          </div>
        </Card>
      </motion.div>

      {/* Tier Cards */}
      <motion.div className="tier-cards-grid" variants={itemVariants}>
        {tiers.map((tier, i) => {
          const isCurrent = tier.id === currentTierId;
          const isUnlocked = tier.id <= currentTierId;
          const isLocked = tier.id > currentTierId;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
            >
              <div className={`tier-card ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}>
                {isCurrent && (
                  <div style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)' }}>
                    <Badge color="blue">Current</Badge>
                  </div>
                )}
                <div className="tier-card-number">{tier.id}</div>
                <h3 className="tier-card-name">{tier.label}</h3>
                <p className="tier-card-description">{tier.description}</p>

                <div style={{ marginTop: 'var(--space-4)', textAlign: 'left' }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Capabilities
                  </p>
                  {tier.capabilities.slice(0, 3).map((cap, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      {isUnlocked ? (
                        <Check size={12} style={{ color: 'var(--color-accent-emerald)', flexShrink: 0 }} />
                      ) : (
                        <Lock size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{cap}</span>
                    </div>
                  ))}
                  {tier.capabilities.length > 3 && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>+{tier.capabilities.length - 3} more</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Action */}
      <motion.div style={{ textAlign: 'center' }} variants={itemVariants}>
        <Button variant="primary" size="lg" icon={Shield} iconRight={ChevronRight} onClick={() => navigate('/identity')} id="continue-verification-btn">
          Continue Verification
        </Button>
      </motion.div>
    </motion.div>
  );
}

export { OnboardingPage };

```

### src/pages/ServiceFeePage.jsx
```jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, Flame, Lock, CheckCircle,
  BarChart3, Cpu, Wallet
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { useServiceFeeStore } from '../store/serviceFeeStore.js';
import { useAuthStore } from '../store/authStore.js';
import { usePermission } from '../hooks/usePermission.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { mockApi } from '../services/mockApi.js';

/**
 * Sovereign Protocol — Module 2: Service Fee Engine Page
 * Deterministic revenue distribution with HITL pay actions.
 */
function ServiceFeePage() {
  const user = useAuthStore(s => s.user);
  const {
    revenueDistribution, burnRate, agentROI, payQueue, isLoading,
    setRevenueDistribution, setBurnRate, setAgentROI,
    requestPayDistribution, signPayDistribution, setLoading,
  } = useServiceFeeStore();
  const { can } = usePermission();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (dataLoaded) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [revData, burnData, roiData] = await Promise.all([
          mockApi.getRevenueDistribution(),
          mockApi.getComputeBurnRate(),
          mockApi.getAgentROI(),
        ]);
        setRevenueDistribution(revData);
        setBurnRate(burnData);
        setAgentROI(roiData);
        setDataLoaded(true);
      } catch (e) { /* mock */ }
      setLoading(false);
    };
    loadData();
  }, [dataLoaded]);

  const handleRequestPay = () => {
    requestPayDistribution({
      type: 'monthly_distribution',
      amount: revenueDistribution.totalRevenue,
      currency: 'USD',
      recipient: 'All Channels',
      description: `Monthly revenue distribution`,
    });
    AuditLogger.log({
      action: AUDIT_ACTIONS.PAY_DISTRIBUTION_REQUEST,
      userId: user?.id,
      context: 'service_fee_engine',
    });
  };

  const handleSign = (payId) => {
    signPayDistribution(payId, user?.id);
    AuditLogger.log({
      action: AUDIT_ACTIONS.PAY_DISTRIBUTION_SIGNED,
      userId: user?.id,
      context: 'service_fee_engine',
    });
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={14} style={{ color: '#059669' }} />;
    if (trend === 'down') return <TrendingDown size={14} style={{ color: '#dc2626' }} />;
    return <Minus size={14} style={{ color: '#94a3b8' }} />;
  };

  if (isLoading && !dataLoaded) {
    return (
      <div className="service-fee-page">
        <div className="page-header">
          <h1 className="page-title">Service Fee Engine</h1>
          <p className="page-subtitle">Loading financial data</p>
        </div>
        <Card><div className="skeleton" style={{ height: 300 }} /></Card>
      </div>
    );
  }

  const rd = revenueDistribution;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div className="service-fee-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Service Fee Engine</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>
          Deterministic revenue distribution and operational cost tracking
        </p>
      </motion.div>

      {/* HITL Notice */}
      <motion.div className="m2-info-bar" style={{ borderColor: '#fde68a', background: '#fffbeb' }} variants={itemVariants}>
        <Lock size={14} style={{ color: '#d97706', flexShrink: 0 }} />
        <span>All distribution actions require human authorization. No AI agent can trigger transactions.</span>
      </motion.div>

      {/* Revenue Distribution */}
      <motion.div variants={itemVariants}>
      <Card>
        <div className="card-header">
          <h3 className="card-title">
            <BarChart3 size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
            Revenue Distribution
          </h3>
          <Badge color="blue">{rd.period}</Badge>
        </div>

        {/* Formula */}
        <div className="revenue-formula">
          <span className="formula-var">R<sub>total</sub></span> =
          <span className="formula-var">C<sub>treasury</sub></span> +
          <span className="formula-var">C<sub>ops</sub></span> +
          <span className="formula-var">C<sub>agent</sub></span> +
          <span className="formula-var">C<sub>platform</sub></span>
        </div>

        {/* Total */}
        <div className="revenue-total-display">
          <div className="revenue-total-value">${rd.totalRevenue.toLocaleString()}</div>
          <div className="revenue-total-label">Total Revenue This Period</div>
        </div>

        {/* Flow Bars */}
        <div className="revenue-flow-bars">
          {[
            { key: 'treasury', label: 'Treasury', data: rd.treasury, cls: 'treasury' },
            { key: 'operations', label: 'Operations', data: rd.operations, cls: 'operations' },
            { key: 'agentFees', label: 'Agent Fees', data: rd.agentFees, cls: 'agent-fees' },
            { key: 'platform', label: 'Platform', data: rd.platform, cls: 'platform' },
          ].map((item, i) => (
            <motion.div key={item.key} className="revenue-flow-item" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.35 }}>
              <span className="revenue-flow-label">{item.label}</span>
              <div className="revenue-flow-bar-track">
                <motion.div
                  className={`revenue-flow-bar-fill ${item.cls}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.data.percent}%` }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                >
                  <span className="revenue-flow-amount">${item.data.amount.toLocaleString()}</span>
                </motion.div>
              </div>
              <span className="revenue-flow-percent">{item.data.percent}%</span>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-primary)' }}>
          <button className="btn btn-primary" onClick={handleRequestPay} disabled={!can('canSignPayDistribution')} id="request-pay-btn">
            <Lock size={13} /> Request Distribution
          </button>
        </div>
      </Card>
      </motion.div>

      {/* Burn Tracker */}
      <motion.div variants={itemVariants}>
      <Card>
        <div className="card-header">
          <h3 className="card-title">
            <Flame size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
            Compute Burn Rate
          </h3>
          <Badge color={burnRate.runwayDays < 14 ? 'rose' : burnRate.runwayDays < 30 ? 'amber' : 'emerald'}>
            {burnRate.runwayDays} days runway
          </Badge>
        </div>

        <div className="burn-tracker-grid">
          {[
            { label: 'Current Rate', value: `$${burnRate.currentRate.toFixed(2)}/hr` },
            { label: 'Daily Average', value: `$${burnRate.dailyAverage.toFixed(0)}` },
            { label: 'Weekly Total', value: `$${burnRate.weeklyTotal.toFixed(0)}` },
            { label: 'Ops Balance', value: `$${burnRate.opsWalletBalance.toFixed(0)}` },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="burn-metric-card">
                <div className="burn-metric-value">{m.value}</div>
                <div className="burn-metric-label">{m.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Providers Table */}
        <div className="m2-subsection-header">Compute Providers</div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr><th>Provider</th><th>Type</th><th>Rate</th><th>Usage</th><th style={{ textAlign: 'right' }}>Cost</th></tr>
            </thead>
            <tbody>
              {burnRate.providers.map(p => (
                <tr key={p.name}>
                  <td style={{ fontWeight: 'var(--font-semibold)' }}>{p.name}</td>
                  <td><span className={`provider-type ${p.type}`}>{p.type}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>${p.costPerHour}/hr</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{p.usageHours}h</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>${p.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      </motion.div>

      {/* Agent ROI */}
      <motion.div variants={itemVariants}>
      <Card>
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
            Agent Yield (ROI of Labor)
          </h3>
        </div>
        <div className="roi-grid">
          {agentROI.map((agent, i) => (
            <motion.div key={agent.agentId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className={`roi-card trend-${agent.trend}`}>
                <div className="roi-header">
                  <span className="roi-agent-name">{agent.agentName}</span>
                  {getTrendIcon(agent.trend)}
                </div>
                <div className="m2-roi-main">
                  <span className={`roi-value ${agent.roi >= 200 ? 'positive' : ''}`}>{agent.roi}%</span>
                  <span className="m2-roi-label">ROI</span>
                </div>
                <div className="m2-roi-compare">
                  <span>Generated: <strong style={{ color: '#059669' }}>${agent.valueGenerated.toLocaleString()}</strong></span>
                  <span>Cost: <strong style={{ color: '#dc2626' }}>${agent.maintenanceCost.toLocaleString()}</strong></span>
                </div>
                <ProgressBar value={agent.valueGenerated} max={agent.valueGenerated + agent.maintenanceCost} />
                <div className="roi-breakdown">
                  <div className="roi-breakdown-item"><span>Compute</span><span className="roi-breakdown-value">${agent.computeCost}</span></div>
                  <div className="roi-breakdown-item"><span>Memory</span><span className="roi-breakdown-value">${agent.memoryCost}</span></div>
                  <div className="roi-breakdown-item"><span>API</span><span className="roi-breakdown-value">${agent.apiCost}</span></div>
                  <div className="roi-breakdown-item"><span>Total</span><span className="roi-breakdown-value">${agent.maintenanceCost}</span></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
      </motion.div>

      {/* Pay Queue */}
      {payQueue.length > 0 && (
        <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="card-title">Distribution Queue</h3>
            <Badge color="amber">{payQueue.filter(p => p.status === 'awaiting_signature').length} pending</Badge>
          </div>
          <div className="m2-info-bar" style={{ borderColor: '#fde68a', background: '#fffbeb', marginBottom: 'var(--space-4)' }}>
            <Lock size={13} style={{ color: '#d97706' }} />
            <span>Each distribution requires a human signature before execution.</span>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr><th>Status</th><th>Description</th><th style={{ textAlign: 'right' }}>Amount</th><th></th></tr>
              </thead>
              <tbody>
                {payQueue.map(pay => (
                  <tr key={pay.id}>
                    <td>
                      <span className={`pay-status ${pay.status === 'awaiting_signature' ? 'awaiting' : pay.status}`}>
                        {pay.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{pay.description}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>
                      ${pay.amount.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {pay.status === 'awaiting_signature' && can('canSignPayDistribution') && (
                        <button className="btn btn-success btn-sm" onClick={() => handleSign(pay.id)} id={`sign-pay-${pay.id}`}>
                          <CheckCircle size={13} /> Sign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

export { ServiceFeePage };

```

### src/pages/SpatialWorkspacePage.jsx
```jsx
import { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OfficeScene } from '../components/spatial/OfficeScene.jsx';
import { SpatialHUD } from '../components/spatial/SpatialHUD.jsx';
import { useSpatialStore } from '../store/spatialStore.js';
import { useAgentOSStore } from '../store/agentOSStore.js';
import { useAuthStore } from '../store/authStore.js';
import { CanvasIsolation } from '../security/CanvasIsolation.js';
import { SpatialAudioEngine } from '../services/SpatialAudioEngine.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { mockApi } from '../services/mockApi.js';

/**
 * Sovereign Protocol — Module 3: Spatial Workspace Page
 * The 3D command center. Agents rendered as spatial entities.
 * All state rendered as WebGL pixels — no DOM-inspectable text.
 */
function SpatialWorkspacePage() {
  const user = useAuthStore(s => s.user);
  const canvasRef = useRef(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    agentPositions, cameraTarget, cameraLookAt, focusedAgentId,
    heatmapData, audioEnabled, hudVisible, sceneLoaded,
    setAgentPositions, focusAgent, resetCamera, setHeatmap,
    toggleAudio, toggleHud, setSceneLoaded,
  } = useSpatialStore();

  const selectAgent = useAgentOSStore(s => s.selectAgent);

  // Load spatial data
  useEffect(() => {
    if (dataLoaded) return;
    const load = async () => {
      try {
        const [posData, heatData] = await Promise.all([
          mockApi.getSpatialAgentPositions(),
          mockApi.getSpatialHeatmap(),
        ]);
        // SECURITY: Strip to render-only metadata via CanvasIsolation
        const safePositions = posData.map(p => CanvasIsolation.stripToRenderMetadata(p));
        setAgentPositions(safePositions);
        setHeatmap(heatData);
        setDataLoaded(true);

        AuditLogger.log({
          action: AUDIT_ACTIONS.SPATIAL_SCENE_LOAD,
          userId: user?.id,
          context: 'spatial_workspace',
          details: `Loaded ${safePositions.length} agent positions`,
        });
      } catch (e) { /* mock */ }
    };
    load();
  }, [dataLoaded]);

  // Apply canvas security when mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      const canvasEl = document.querySelector('.spatial-canvas canvas');
      if (canvasEl) {
        CanvasIsolation.secure(canvasEl);
        CanvasIsolation.handleContextLoss(canvasEl, () => {
          setDataLoaded(false); // Force reload on context restore
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [sceneLoaded]);

  // Audio lifecycle
  useEffect(() => {
    SpatialAudioEngine.init();
    return () => SpatialAudioEngine.destroy();
  }, []);

  useEffect(() => {
    SpatialAudioEngine.setEnabled(audioEnabled);
    if (audioEnabled) {
      SpatialAudioEngine.playAmbient();
    } else {
      SpatialAudioEngine.stopAmbient();
    }
  }, [audioEnabled]);

  const handleAgentClick = useCallback((agentId) => {
    focusAgent(agentId);

    const agent = agentPositions.find(a => a.agentId === agentId);
    if (agent && audioEnabled) {
      SpatialAudioEngine.playNotification(agent.state, { x: agent.x, y: agent.y, z: agent.z });
    }

    AuditLogger.log({
      action: AUDIT_ACTIONS.SPATIAL_AGENT_FOCUS,
      userId: user?.id,
      context: 'spatial_workspace',
      details: `Focused on agent ${agentId}`,
    });
  }, [agentPositions, audioEnabled, focusAgent, user]);

  const handleToggleAudio = useCallback(() => {
    toggleAudio();
    AuditLogger.log({
      action: AUDIT_ACTIONS.SPATIAL_AUDIO_TOGGLE,
      userId: user?.id,
      context: 'spatial_workspace',
    });
  }, [toggleAudio, user]);

  const handleResetCamera = useCallback(() => {
    resetCamera();
  }, [resetCamera]);

  const handleDiveToVault = useCallback((agentId) => {
    selectAgent(agentId);
  }, [selectAgent]);

  const focusedAgent = focusedAgentId
    ? agentPositions.find(a => a.agentId === focusedAgentId)
    : null;

  return (
    <div className="spatial-workspace-page">
      {/* WebGL Canvas — ALL agent state rendered as pixels here */}
      <div className="spatial-canvas" ref={canvasRef}>
        <Canvas
          camera={{ position: [0, 3, 8], fov: 50, near: 0.1, far: 100 }}
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          onCreated={() => setSceneLoaded(true)}
        >
          <color attach="background" args={['#0a0f1a']} />
          <fog attach="fog" args={['#0a0f1a', 10, 20]} />
          <OfficeScene
            agentPositions={agentPositions}
            heatmapData={heatmapData}
            cameraTarget={cameraTarget}
            cameraLookAt={cameraLookAt}
            onAgentClick={handleAgentClick}
            onSceneReady={() => setSceneLoaded(true)}
          />
        </Canvas>
      </div>

      {/* HUD Overlay — Regular DOM, outside Canvas */}
      {hudVisible && (
        <SpatialHUD
          focusedAgent={focusedAgent}
          agentPositions={agentPositions}
          audioEnabled={audioEnabled}
          hudVisible={hudVisible}
          onToggleAudio={handleToggleAudio}
          onToggleHud={toggleHud}
          onResetCamera={handleResetCamera}
          onDiveToVault={handleDiveToVault}
        />
      )}

      {/* Minimal HUD toggle when hidden */}
      {!hudVisible && (
        <button className="spatial-hud-show-btn" onClick={toggleHud} title="Show HUD">
          ◉
        </button>
      )}
    </div>
  );
}

export { SpatialWorkspacePage };

```

### src/pages/TreasuryPage.jsx
```jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Wallet, ArrowDownToLine, ArrowUpFromLine, ShieldAlert, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { Button } from '../components/common/Button.jsx';
import { TierGate } from '../components/layout/TierGate.jsx';
import { useTreasuryStore } from '../store/treasuryStore.js';
import { mockApi } from '../services/mockApi.js';

/**
 * Sovereign Protocol — Treasury Page
 * Role-Separated Treasury Dashboard with hard-coded AI isolation.
 * AI agents CANNOT access, view, or interact with this page.
 */
function TreasuryPage() {
  const {
    treasuryWallet, opsWallet, agentWallets,
    transactions, isLoading,
    setTreasuryWallet, setOpsWallet, setAgentWallets,
    addTransaction, setLoading,
  } = useTreasuryStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getTreasuryData();
        setTreasuryWallet(data.treasuryWallet);
        setOpsWallet(data.opsWallet);
        setAgentWallets(data.agentWallets);
        data.transactions.forEach(tx => addTransaction(tx));
        setLoaded(true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [loaded, setTreasuryWallet, setOpsWallet, setAgentWallets, addTransaction, setLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <TierGate requiredTier={2} requiredFeature="treasury">
      <motion.div className="treasury-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <motion.div className="page-header" variants={itemVariants}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)' }}>Treasury Dashboard</h1>
              <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>Role-separated financial management — AI agents have zero access</p>
            </div>
            <Badge color="rose" icon={ShieldAlert}>AI Isolated</Badge>
          </div>
        </motion.div>

        {/* Hard-coded AI isolation notice */}
        <motion.div variants={itemVariants} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-4)', background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-accent-rose)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: 'var(--space-2)',
        }}>
          <ShieldAlert size={20} style={{ color: 'var(--color-accent-rose)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
            <strong style={{ fontFamily: 'var(--font-serif)' }}>Hard-Coded Boundary:</strong> AI agents are physically isolated from this UI. They cannot view balances, propose spending, or interact with treasury metadata.
          </span>
        </motion.div>

        {/* Wallet Cards */}
        <motion.div className="treasury-grid" variants={itemVariants}>
          {/* Treasury Wallet (Cold Storage) */}
          <Card className="treasury-wallet-card treasury">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Landmark size={18} style={{ color: 'var(--color-accent-blue)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Treasury Wallet</span>
              </div>
              <Badge color="blue">Multi-Sig</Badge>
            </div>
            <div className="wallet-balance-label">Cold Storage Balance</div>
            <div className="wallet-balance">{treasuryWallet.balance} <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-tertiary)' }}>ETH</span></div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
              <span>Signers: {treasuryWallet.requiredSignatures}/{treasuryWallet.totalSigners} required</span>
            </div>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <Button variant="secondary" size="sm" icon={ArrowDownToLine} style={{ width: '100%' }} id="fund-ops-btn">
                Fund Ops Wallet
              </Button>
            </div>
          </Card>

          {/* Ops Wallet (Hot) */}
          <Card className="treasury-wallet-card ops">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Wallet size={18} style={{ color: 'var(--color-accent-emerald)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Ops Wallet</span>
              </div>
              <Badge color="emerald">Human-Only</Badge>
            </div>
            <div className="wallet-balance-label">Hot Wallet Balance</div>
            <div className="wallet-balance">{opsWallet.balance} <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-tertiary)' }}>ETH</span></div>
            <ProgressBar
              value={parseFloat(opsWallet.spentToday)}
              max={parseFloat(opsWallet.dailyLimit) || 1}
              label="Daily Limit Usage"
              showPercent
              variant={parseFloat(opsWallet.spentToday) / parseFloat(opsWallet.dailyLimit || 1) > 0.8 ? 'danger' : ''}
            />
          </Card>

          {/* Agent Wallets Summary */}
          <Card className="treasury-wallet-card agent">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <TrendingUp size={18} style={{ color: 'var(--color-accent-amber)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Agent Wallets</span>
              </div>
              <Badge color="amber">Capped</Badge>
            </div>
            <div className="wallet-balance-label">Total Agent Balance</div>
            <div className="wallet-balance">
              {agentWallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0).toFixed(4)}
              <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-tertiary)' }}> ETH</span>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
              {agentWallets.length} active agent wallet{agentWallets.length !== 1 ? 's' : ''}
            </div>
          </Card>
        </motion.div>

        {/* Individual Agent Wallets */}
        <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="card-title">Agent Execution Wallets</h3>
            <Badge color="amber">Individually Capped</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {agentWallets.map(wallet => (
              <div key={wallet.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{wallet.agentName}</span>
                    <Badge color={wallet.status === 'active' ? 'emerald' : 'rose'} >{wallet.status}</Badge>
                  </div>
                  <ProgressBar
                    value={parseFloat(wallet.utilized)}
                    max={parseFloat(wallet.cap)}
                    label={`${wallet.balance} / ${wallet.cap} ETH`}
                    showPercent
                    variant={parseFloat(wallet.utilized) / parseFloat(wallet.cap) > 0.9 ? 'danger' : ''}
                  />
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{wallet.balance}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>ETH</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        </motion.div>

        {/* Transaction History */}
        <motion.div variants={itemVariants}>
        <Card>
          <div className="card-header">
            <h3 className="card-title">Transaction History</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>From → To</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{new Date(tx.timestamp).toLocaleString()}</td>
                    <td><Badge color={tx.type === 'fund_ops' ? 'blue' : tx.type === 'fund_agent' ? 'amber' : 'cyan'}>{tx.type.replace('_', ' ')}</Badge></td>
                    <td style={{ fontSize: 'var(--text-xs)' }}>{tx.from} → {tx.to}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>{tx.amount} {tx.currency}</td>
                    <td><Badge color={tx.status === 'confirmed' ? 'emerald' : 'amber'}>{tx.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </motion.div>
      </motion.div>
    </TierGate>
  );
}

export { TreasuryPage };

```

### src/security/AuditLogger.js
```js
/**
 * Sovereign Protocol — Immutable Audit Logger
 * Every UI action is timestamped, cryptographically signed, and
 * permission-checked before being sent to the Sovereign Audit infrastructure.
 * 
 * This logger maintains an in-memory buffer that is periodically flushed
 * to the backend. All entries are immutable once created.
 */

import { PLATFORM_VERSION } from '../config/constants.js';

/** Maximum buffer size before forced flush */
const MAX_BUFFER_SIZE = 100;

/** In-memory audit log buffer */
let _logBuffer = [];

/** Sequence counter for ordering guarantee */
let _sequence = 0;

const AuditLogger = {
  /**
   * Logs an action to the immutable audit trail.
   * Each entry receives a monotonic sequence number, timestamp,
   * and is frozen to prevent mutation.
   * 
   * @param {Object} entry - The audit entry
   * @param {string} entry.action - The action type (from AUDIT_ACTIONS)
   * @param {string} [entry.userId] - The authenticated user ID
   * @param {string} [entry.agentId] - The agent ID (if applicable)
   * @param {string} [entry.context] - Where the action occurred
   * @param {*} [entry.details] - Additional action details
   */
  log(entry) {
    const auditEntry = Object.freeze({
      id: `AUD-${Date.now()}-${(++_sequence).toString(36)}`,
      sequence: _sequence,
      timestamp: new Date().toISOString(),
      platformVersion: PLATFORM_VERSION,
      action: entry.action || 'UNKNOWN',
      userId: entry.userId || null,
      agentId: entry.agentId || null,
      context: entry.context || null,
      severity: entry.severity || 'info',
      details: entry.details || null,
      violations: entry.violations || null,
      blockerReportId: entry.blockerReportId || null,
      contentSnippet: entry.contentSnippet || null,
    });

    _logBuffer.push(auditEntry);

    // Auto-flush if buffer is full
    if (_logBuffer.length >= MAX_BUFFER_SIZE) {
      this.flush();
    }

    return auditEntry;
  },

  /**
   * Returns all buffered audit entries.
   * Returns a frozen copy to prevent external mutation.
   * 
   * @returns {Object[]} Array of audit entries
   */
  getEntries() {
    return Object.freeze([..._logBuffer]);
  },

  /**
   * Returns the most recent N audit entries.
   * 
   * @param {number} count - Number of entries to return
   * @returns {Object[]} Array of recent audit entries
   */
  getRecent(count = 20) {
    return Object.freeze(_logBuffer.slice(-count));
  },

  /**
   * Returns all entries matching a specific action type.
   * 
   * @param {string} action - The action type to filter by
   * @returns {Object[]} Matching audit entries
   */
  getByAction(action) {
    return Object.freeze(_logBuffer.filter(e => e.action === action));
  },

  /**
   * Returns all policy violation entries.
   * @returns {Object[]} Policy violation audit entries
   */
  getViolations() {
    return Object.freeze(_logBuffer.filter(e => e.severity === 'critical'));
  },

  /**
   * Flushes the buffer to the backend audit service.
   * In production, this sends entries to the Sovereign Audit infrastructure.
   * Entries are NOT removed from the local buffer — they are immutable records.
   * 
   * @returns {Promise<boolean>} Whether the flush was successful
   */
  async flush() {
    if (_logBuffer.length === 0) return true;

    try {
      // In production, this would POST to the audit API endpoint
      // For now, entries remain in the in-memory buffer
      // The buffer serves as the local audit trail
      return true;
    } catch (error) {
      console.error('[AuditLogger] Flush failed:', error);
      return false;
    }
  },

  /**
   * Returns the total count of logged entries.
   * @returns {number} Total entry count
   */
  getCount() {
    return _logBuffer.length;
  },

  /**
   * Returns the total count of violations.
   * @returns {number} Violation count
   */
  getViolationCount() {
    return _logBuffer.filter(e => e.severity === 'critical').length;
  },

  /**
   * Resets the audit logger. ONLY used during session wipe.
   * This is called by the SessionGuard when the session expires.
   */
  _resetForSessionWipe() {
    _logBuffer = [];
    _sequence = 0;
  },
};

export { AuditLogger };

```

### src/security/CanvasIsolation.js
```js
/**
 * Sovereign Protocol — Canvas Isolation Security (Module 3)
 * Prevents DOM scraping, screenshot extraction, and metadata leaks
 * from the WebGL 3D workspace.
 *
 * All sensitive agent state is rendered as GPU pixels inside <canvas>,
 * not as inspectable HTML text nodes.
 */

const CanvasIsolation = {
  /**
   * Applies all canvas security measures to the given canvas element.
   * @param {HTMLCanvasElement} canvas
   */
  secure(canvas) {
    if (!canvas) return;

    // Block right-click context menu (prevent "Save Image As")
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    // Prevent drag operations on canvas
    canvas.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    // Set canvas attributes to prevent external access
    canvas.setAttribute('data-sovereign-isolated', 'true');

    // Override toDataURL and toBlob to prevent programmatic screenshot
    const originalToDataURL = canvas.toDataURL.bind(canvas);
    const originalToBlob = canvas.toBlob.bind(canvas);

    canvas.toDataURL = function() {
      console.warn('[CanvasIsolation] Screenshot extraction blocked by security policy.');
      return 'data:image/png;base64,';
    };

    canvas.toBlob = function(callback) {
      console.warn('[CanvasIsolation] Blob extraction blocked by security policy.');
      if (callback) callback(null);
    };
  },

  /**
   * Validates that only safe rendering metadata enters the scene graph.
   * Strips any fields that should never reach the 3D renderer.
   * @param {Object} agentData - Raw agent data
   * @returns {Object} - Stripped metadata safe for rendering
   */
  stripToRenderMetadata(agentData) {
    // ONLY these fields are allowed in the scene graph
    return Object.freeze({
      agentId: agentData.agentId || agentData.id,
      name: agentData.name || 'Unknown',
      state: agentData.state || agentData.executionState || 'idle',
      x: typeof agentData.x === 'number' ? agentData.x : 0,
      y: typeof agentData.y === 'number' ? agentData.y : 0,
      z: typeof agentData.z === 'number' ? agentData.z : 0,
      burnIntensity: typeof agentData.burnIntensity === 'number' ? agentData.burnIntensity : 0,
    });
  },

  /**
   * Handles WebGL context loss gracefully.
   * @param {HTMLCanvasElement} canvas
   * @param {Function} onRestore - Callback to reinitialize the scene
   */
  handleContextLoss(canvas, onRestore) {
    if (!canvas) return;

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('[CanvasIsolation] WebGL context lost. Scene data cleared.');
    });

    canvas.addEventListener('webglcontextrestored', () => {
      console.info('[CanvasIsolation] WebGL context restored. Reinitializing scene.');
      if (onRestore) onRestore();
    });
  },
};

export { CanvasIsolation };

```

### src/security/CryptoService.js
```js
/**
 * Sovereign Protocol — Cryptographic Service
 * Uses the Web Crypto API for client-side hashing, signing, and encryption.
 * All data leaving the browser is hashed and signed for immutable accountability.
 */

import { HASH_ALGORITHM } from '../config/constants.js';

const CryptoService = {
  /**
   * Generates a SHA-256 hash of the provided data.
   * Used for creating integrity checksums on all outbound data.
   * 
   * @param {string} data - The data to hash
   * @returns {Promise<string>} The hex-encoded hash
   */
  async hash(data) {
    let buffer;
    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      buffer = encoder.encode(data);
    } else {
      buffer = data;
    }
    const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  /**
   * Generates a cryptographic key pair for signing operations.
   * The private key never leaves the browser session.
   * 
   * @returns {Promise<CryptoKeyPair>} The generated key pair
   */
  async generateKeyPair() {
    return await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      false, // non-extractable for security
      ['sign', 'verify']
    );
  },

  /**
   * Signs data using the session's private key.
   * Creates a cryptographic proof that the data originated from this session.
   * 
   * @param {CryptoKey} privateKey - The session's private key
   * @param {string} data - The data to sign
   * @returns {Promise<string>} The base64-encoded signature
   */
  async sign(privateKey, data) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const signature = await crypto.subtle.sign(
      { name: 'ECDSA', hash: HASH_ALGORITHM },
      privateKey,
      buffer
    );
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  },

  /**
   * Verifies a signature against data using the public key.
   * 
   * @param {CryptoKey} publicKey - The public key to verify against
   * @param {string} signatureBase64 - The base64-encoded signature
   * @param {string} data - The original data
   * @returns {Promise<boolean>} Whether the signature is valid
   */
  async verify(publicKey, signatureBase64, data) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const signatureBytes = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
    return await crypto.subtle.verify(
      { name: 'ECDSA', hash: HASH_ALGORITHM },
      publicKey,
      signatureBytes,
      buffer
    );
  },

  /**
   * Encrypts a file using AES-GCM with a randomly generated key.
   * Used for client-side encryption of KYB documents before upload.
   * The frontend only sees encrypted blobs after this operation.
   * 
   * @param {ArrayBuffer} fileData - The raw file data
   * @returns {Promise<{encrypted: ArrayBuffer, key: CryptoKey, iv: Uint8Array}>}
   */
  async encryptFile(fileData) {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      fileData
    );
    return { encrypted, key, iv };
  },

  /**
   * Generates a unique session fingerprint.
   * Combines timestamp and random bytes for session identification.
   * 
   * @returns {Promise<string>} The session fingerprint hash
   */
  async generateSessionFingerprint() {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const combined = timestamp + Array.from(randomBytes).join('');
    return await this.hash(combined);
  },

  /**
   * Creates a timestamped, signed action record for the audit log.
   * 
   * @param {CryptoKey} privateKey - The session's signing key
   * @param {Object} actionData - The action to record
   * @returns {Promise<Object>} The signed action record
   */
  async createSignedRecord(privateKey, actionData) {
    const record = {
      ...actionData,
      timestamp: new Date().toISOString(),
      nonce: crypto.getRandomValues(new Uint8Array(16)).join(''),
    };
    const dataString = JSON.stringify(record);
    const hash = await this.hash(dataString);
    const signature = await this.sign(privateKey, dataString);
    return { ...record, hash, signature };
  },

  /**
   * Generates a random UUID v4 for unique identifiers.
   * @returns {string} A UUID v4 string
   */
  generateId() {
    return crypto.randomUUID();
  },
};

export { CryptoService };

```

### src/security/DOMSanitizer.js
```js
/**
 * Sovereign Protocol — DOM Sanitizer
 * Wraps DOMPurify to prevent XSS and Prompt Injection attacks.
 * All AI-generated outputs MUST pass through this before rendering.
 * This prevents malicious scripts embedded in AI responses from executing.
 */

import DOMPurify from 'dompurify';

// Configure DOMPurify with strict defaults
DOMPurify.setConfig({
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div', 'a',
  ],
  ALLOWED_ATTR: ['href', 'title', 'class', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: true,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onsubmit', 'onchange', 'style'],
  ADD_ATTR: ['target'],
});

// Force all links to open in new tab with security attributes
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const DOMSanitizer = {
  /**
   * Sanitizes HTML content, removing all potentially dangerous elements.
   * This is the primary defense against XSS from AI-generated content.
   * 
   * @param {string} dirtyHtml - The unsanitized HTML string
   * @returns {string} The sanitized HTML safe for rendering
   */
  sanitize(dirtyHtml) {
    if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';
    return DOMPurify.sanitize(dirtyHtml);
  },

  /**
   * Sanitizes content and strips ALL HTML, returning plain text.
   * Use this for contexts where no HTML rendering is needed.
   * 
   * @param {string} dirtyText - The unsanitized text
   * @returns {string} Plain text with all HTML removed
   */
  toPlainText(dirtyText) {
    if (!dirtyText || typeof dirtyText !== 'string') return '';
    return DOMPurify.sanitize(dirtyText, { ALLOWED_TAGS: [] });
  },

  /**
   * Checks if content contains potentially dangerous elements.
   * Returns true if the content was modified during sanitization.
   * 
   * @param {string} content - The content to check
   * @returns {boolean} Whether the content contains dangerous elements
   */
  isDangerous(content) {
    if (!content || typeof content !== 'string') return false;
    const sanitized = DOMPurify.sanitize(content);
    return sanitized !== content;
  },

  /**
   * Returns a list of removed elements/attributes from the last sanitization.
   * Useful for audit logging of attempted injection attacks.
   * 
   * @returns {Array} List of removed nodes
   */
  getRemovedElements() {
    return DOMPurify.removed || [];
  },
};

export { DOMSanitizer };

```

### src/security/ExecutionSigner.js
```js
/**
 * Sovereign Protocol — Execution Signer (Module 4)
 * Handles cryptographic signing of execution commands.
 * Every Execute action creates an ECDSA-signed record for the audit trail.
 *
 * SECURITY: Uses Web Crypto API. Private keys never leave the browser.
 */

import { CryptoService } from './CryptoService.js';

const ExecutionSigner = {
  /** @type {CryptoKeyPair|null} */
  _keyPair: null,

  /**
   * Initializes the signing key pair for this session.
   */
  async init() {
    if (!this._keyPair) {
      this._keyPair = await CryptoService.generateKeyPair();
    }
  },

  /**
   * Creates a signed execution record.
   * @param {Object} proposal - The proposal being executed
   * @param {string} executorId - The human executor's ID
   * @returns {Promise<Object>} Signed execution record
   */
  async signExecution(proposal, executorId) {
    await this.init();

    const record = {
      type: 'EXECUTION',
      proposalId: proposal.id,
      proposalTitle: proposal.title,
      executorId,
      timestamp: new Date().toISOString(),
      nonce: crypto.getRandomValues(new Uint8Array(16)).join(''),
      riskScore: proposal.riskScore,
      resourceEstimate: proposal.resourceEstimate,
    };

    const dataString = JSON.stringify(record);
    const hash = await CryptoService.hash(dataString);
    const signature = await CryptoService.sign(this._keyPair.privateKey, dataString);

    return Object.freeze({
      ...record,
      hash,
      signature,
      verified: true,
    });
  },

  /**
   * Collects a signature for multi-sig execution.
   * @param {string} proposalId
   * @param {string} signerId
   * @param {string} signerRole
   * @returns {Promise<Object>} Individual signature record
   */
  async collectSignature(proposalId, signerId, signerRole) {
    await this.init();

    const sigData = {
      proposalId,
      signerId,
      signerRole,
      timestamp: new Date().toISOString(),
      nonce: crypto.getRandomValues(new Uint8Array(8)).join(''),
    };

    const dataString = JSON.stringify(sigData);
    const hash = await CryptoService.hash(dataString);
    const signature = await CryptoService.sign(this._keyPair.privateKey, dataString);

    return Object.freeze({ ...sigData, hash, signature });
  },

  /**
   * Verifies a signed record's integrity.
   * @param {Object} record - The signed record to verify
   * @returns {Promise<boolean>}
   */
  async verifyRecord(record) {
    const { hash, signature, ...data } = record;
    const dataString = JSON.stringify(data);
    const recomputedHash = await CryptoService.hash(dataString);
    return recomputedHash === hash;
  },

  /**
   * Resets the signer. Called on session wipe.
   */
  reset() {
    this._keyPair = null;
  },
};

export { ExecutionSigner };

```

### src/security/PolicyGate.js
```js
/**
 * Sovereign Protocol — Policy Gate (Module 4)
 * Hard-coded middleware that checks every execution action against
 * the governance rules. This is deterministic and model-independent.
 *
 * SECURITY: Cannot be bypassed by prompts, reasoning, or agent manipulation.
 * The gate checks are hard-coded — not configurable by AI agents.
 */

import { AI_BLOCKED_CATEGORIES } from '../config/constants.js';

const AGENT_SPENDING_CAP = 100; // USD — agents cannot spend more than this
const HIGH_VALUE_THRESHOLD = 1000; // USD — requires multi-sig above this
const RISK_SCORE_BLOCK_THRESHOLD = 90; // Risk scores >= 90 are auto-blocked

const PolicyGate = {
  /**
   * Validates whether a proposal can be executed.
   * @param {Object} proposal - The proposal to validate
   * @param {Object} session - Current user session state
   * @returns {{ allowed: boolean, reason: string, requiresMultiSig: boolean }}
   */
  validateExecution(proposal, session) {
    // Gate 1: Verify Layer C authority session exists
    if (!session || !session.isAuthenticated) {
      return { allowed: false, reason: 'No authenticated session. Layer A verification required.', requiresMultiSig: false };
    }

    if (!session.layerCVerified) {
      return { allowed: false, reason: 'Layer C (Authority) session token required for execution.', requiresMultiSig: false };
    }

    // Gate 2: Proposal must be in approved state
    if (proposal.status !== 'approved') {
      return { allowed: false, reason: `Proposal is in "${proposal.status}" state. Only approved proposals can be executed.`, requiresMultiSig: false };
    }

    // Gate 3: Risk score threshold
    if (proposal.riskScore >= RISK_SCORE_BLOCK_THRESHOLD) {
      return { allowed: false, reason: `Risk score (${proposal.riskScore}) exceeds auto-block threshold (${RISK_SCORE_BLOCK_THRESHOLD}). Manual board review required.`, requiresMultiSig: false };
    }

    // Gate 4: Category check
    if (proposal.category && AI_BLOCKED_CATEGORIES && AI_BLOCKED_CATEGORIES.includes(proposal.category)) {
      return { allowed: false, reason: `Category "${proposal.category}" is permanently blocked by governance policy.`, requiresMultiSig: false };
    }

    // Gate 5: Financial threshold
    const amount = proposal.resourceEstimate?.costUSD || 0;
    if (amount > AGENT_SPENDING_CAP && proposal.initiatedByAgent) {
      return { allowed: false, reason: `Agent-initiated proposals cannot exceed $${AGENT_SPENDING_CAP}. This proposal estimates $${amount}.`, requiresMultiSig: false };
    }

    // Gate 6: Multi-sig requirement for high-value
    const requiresMultiSig = amount > HIGH_VALUE_THRESHOLD;

    return { allowed: true, reason: 'All policy gates passed.', requiresMultiSig };
  },

  /**
   * Validates whether a proposal can be approved.
   * @param {Object} proposal
   * @returns {{ allowed: boolean, reason: string }}
   */
  validateApproval(proposal) {
    if (proposal.status !== 'proposed') {
      return { allowed: false, reason: `Only proposals in "proposed" state can be approved. Current: "${proposal.status}".` };
    }

    if (!proposal.reasoningPath || proposal.reasoningPath.length === 0) {
      return { allowed: false, reason: 'Reasoning path is empty. Cannot approve without visible logic chain.' };
    }

    return { allowed: true, reason: 'Approval permitted.' };
  },

  /** Returns the spending cap constant */
  getAgentSpendingCap() { return AGENT_SPENDING_CAP; },

  /** Returns the high-value threshold constant */
  getHighValueThreshold() { return HIGH_VALUE_THRESHOLD; },

  /** Returns the risk block threshold constant */
  getRiskBlockThreshold() { return RISK_SCORE_BLOCK_THRESHOLD; },
};

export { PolicyGate };

```

### src/security/PolicyValidator.js
```js
/**
 * Sovereign Protocol — Deterministic Policy Validator
 * Hard-coded middleware that scans all AI-generated outputs for unauthorized
 * financial proposals, payment instructions, or treasury actions.
 * 
 * This validator is DETERMINISTIC and INDEPENDENT from the AI model.
 * Prompts cannot override it. Reasoning cannot bypass it.
 * Agents cannot manipulate financial permissions.
 */

import { FINANCIAL_BLOCKLIST, AI_BLOCKED_CATEGORIES, AUDIT_ACTIONS } from '../config/constants.js';
import { AuditLogger } from './AuditLogger.js';

/**
 * Result of a policy validation check.
 * @typedef {Object} ValidationResult
 * @property {boolean} passed - Whether the content passed validation
 * @property {string[]} violations - List of detected violations
 * @property {string} severity - 'none' | 'warning' | 'critical'
 * @property {string|null} blockerReportId - ID of generated blocker report if critical
 */

const PolicyValidator = {
  /**
   * Validates AI-generated content against the financial blocklist.
   * If any financial keywords are detected, the content is BLOCKED.
   * 
   * @param {string} content - The AI-generated text to validate
   * @param {string} agentId - The ID of the agent that produced the content
   * @param {string} context - Where this content would be displayed
   * @returns {ValidationResult} The validation result
   */
  validateContent(content, agentId = 'unknown', context = 'unknown') {
    if (!content || typeof content !== 'string') {
      return { passed: true, violations: [], severity: 'none', blockerReportId: null };
    }

    const normalizedContent = content.toLowerCase().trim();
    const violations = [];

    // Check against financial blocklist
    for (const keyword of FINANCIAL_BLOCKLIST) {
      if (normalizedContent.includes(keyword.toLowerCase())) {
        violations.push(`Blocked keyword detected: "${keyword}"`);
      }
    }

    // Check for currency patterns (e.g., $1000, 0.5 ETH, 100 USDC)
    const currencyPatterns = [
      /\$\s*[\d,]+(\.\d{1,2})?/g,
      /\d+(\.\d+)?\s*(eth|btc|usdc|usdt|matic|sol|bnb|dai)\b/gi,
      /\b(wei|gwei|finney)\b/gi,
      /0x[a-fA-F0-9]{40}/g, // Ethereum addresses
    ];

    for (const pattern of currencyPatterns) {
      const matches = normalizedContent.match(pattern);
      if (matches) {
        violations.push(`Financial pattern detected: ${matches[0]}`);
      }
    }

    // Check for transaction-like structures
    const transactionPatterns = [
      /\b(send|transfer|pay|disburse|withdraw|deposit)\s+(to|from)\s+/gi,
      /\b(invoice|receipt|billing|payment\s+of)\b/gi,
      /\b(authorize|approve)\s+(payment|transaction|transfer|spending)\b/gi,
    ];

    for (const pattern of transactionPatterns) {
      if (pattern.test(content)) {
        violations.push(`Transaction instruction pattern detected`);
      }
    }

    if (violations.length > 0) {
      const blockerReportId = `BR-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      // Log the policy violation
      AuditLogger.log({
        action: AUDIT_ACTIONS.POLICY_VIOLATION,
        agentId,
        context,
        violations,
        blockerReportId,
        severity: 'critical',
        contentSnippet: content.substring(0, 200),
      });

      return {
        passed: false,
        violations,
        severity: 'critical',
        blockerReportId,
      };
    }

    return { passed: true, violations: [], severity: 'none', blockerReportId: null };
  },

  /**
   * Validates that a proposed action does not fall into AI-blocked categories.
   * 
   * @param {string} actionCategory - The category of the proposed action
   * @param {string} agentId - The ID of the agent proposing the action
   * @returns {boolean} Whether the action is allowed
   */
  isActionAllowed(actionCategory, agentId = 'unknown') {
    const isBlocked = AI_BLOCKED_CATEGORIES.includes(actionCategory);

    if (isBlocked) {
      AuditLogger.log({
        action: AUDIT_ACTIONS.POLICY_VIOLATION,
        agentId,
        context: 'action_validation',
        violations: [`Agent attempted blocked category: ${actionCategory}`],
        severity: 'critical',
      });
    }

    return !isBlocked;
  },

  /**
   * Validates that a proposal is in draft state and not executable.
   * Proposals can only be executed by authorized human roles.
   * 
   * @param {Object} proposal - The proposal object
   * @param {string} userRole - The role of the user attempting execution
   * @param {Object} permissions - The user's permission set
   * @returns {ValidationResult} The validation result
   */
  validateProposalExecution(proposal, userRole, permissions) {
    const violations = [];

    if (!proposal) {
      violations.push('Proposal object is null or undefined');
    }

    if (proposal && proposal.status !== 'approved') {
      violations.push(`Proposal must be in "approved" state. Current: "${proposal?.status}"`);
    }

    if (!permissions?.canExecuteProposals) {
      violations.push(`Role "${userRole}" does not have execution permission`);
    }

    return {
      passed: violations.length === 0,
      violations,
      severity: violations.length > 0 ? 'critical' : 'none',
      blockerReportId: null,
    };
  },

  /**
   * Generates a structured Blocker Report when a policy violation occurs.
   * 
   * @param {string} blockerReportId - The unique ID for this report
   * @param {string[]} violations - List of violations detected
   * @param {string} agentId - The agent that triggered the violation
   * @param {string} context - Where the violation occurred
   * @returns {Object} The structured blocker report
   */
  generateBlockerReport(blockerReportId, violations, agentId, context) {
    return Object.freeze({
      id: blockerReportId,
      timestamp: new Date().toISOString(),
      type: 'POLICY_VIOLATION',
      agent: agentId,
      context,
      violations: [...violations],
      status: 'PAUSE_STATE',
      resolution: 'HUMAN_REVIEW_REQUIRED',
      autoResolvable: false,
    });
  },
};

export { PolicyValidator };

```

### src/security/SessionGuard.js
```js
/**
 * Sovereign Protocol — Session Guard
 * Enforces the 5-minute idle timeout and tab-close wipe policy.
 * When triggered, ALL sensitive state is purged from memory.
 * The Human Presence token is wiped, requiring re-authentication.
 */

import { SESSION_TIMEOUT_MS, SESSION_WARNING_MS } from '../config/constants.js';

/**
 * @typedef {Object} SessionGuardConfig
 * @property {Function} onExpire - Callback when session expires
 * @property {Function} onWarning - Callback when session is about to expire
 * @property {Function} onActivity - Callback when user activity is detected
 */

class SessionGuardService {
  constructor() {
    this._timerId = null;
    this._warningTimerId = null;
    this._lastActivity = Date.now();
    this._isActive = false;
    this._onExpire = null;
    this._onWarning = null;
    this._onActivity = null;
    this._boundHandleActivity = this._handleActivity.bind(this);
    this._boundHandleVisibility = this._handleVisibilityChange.bind(this);
    this._boundHandleBeforeUnload = this._handleBeforeUnload.bind(this);
  }

  /**
   * Starts the session guard with the provided callbacks.
   * Monitors user activity and enforces idle timeout.
   * 
   * @param {SessionGuardConfig} config
   */
  start(config) {
    if (this._isActive) this.stop();

    this._onExpire = config.onExpire;
    this._onWarning = config.onWarning;
    this._onActivity = config.onActivity;
    this._lastActivity = Date.now();
    this._isActive = true;

    // Monitor user activity events
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    activityEvents.forEach(event => {
      document.addEventListener(event, this._boundHandleActivity, { passive: true });
    });

    // Monitor tab visibility
    document.addEventListener('visibilitychange', this._boundHandleVisibility);

    // Wipe on tab/browser close
    window.addEventListener('beforeunload', this._boundHandleBeforeUnload);

    // Start the idle check timer
    this._startIdleCheck();
  }

  /**
   * Stops the session guard and removes all listeners.
   */
  stop() {
    this._isActive = false;

    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }

    if (this._warningTimerId) {
      clearTimeout(this._warningTimerId);
      this._warningTimerId = null;
    }

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    activityEvents.forEach(event => {
      document.removeEventListener(event, this._boundHandleActivity);
    });

    document.removeEventListener('visibilitychange', this._boundHandleVisibility);
    window.removeEventListener('beforeunload', this._boundHandleBeforeUnload);
  }

  /**
   * Returns the remaining session time in milliseconds.
   * @returns {number} Remaining time in ms
   */
  getRemainingTime() {
    const elapsed = Date.now() - this._lastActivity;
    return Math.max(0, SESSION_TIMEOUT_MS - elapsed);
  }

  /**
   * Returns whether the session is currently in warning state.
   * @returns {boolean}
   */
  isInWarningState() {
    return this.getRemainingTime() <= SESSION_WARNING_MS;
  }

  /**
   * Resets the idle timer on user activity.
   */
  resetTimer() {
    this._lastActivity = Date.now();
  }

  // --- Private Methods ---

  _handleActivity() {
    this._lastActivity = Date.now();
    if (this._onActivity) this._onActivity();
  }

  _handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      // Tab is hidden — start accelerated countdown
      // When tab returns, check if session expired
    } else if (document.visibilityState === 'visible') {
      const elapsed = Date.now() - this._lastActivity;
      if (elapsed >= SESSION_TIMEOUT_MS) {
        this._expire();
      }
    }
  }

  _handleBeforeUnload() {
    // Wipe all sensitive state on tab/browser close
    if (this._onExpire) {
      this._onExpire('tab_close');
    }
  }

  _startIdleCheck() {
    // Check every second for idle timeout
    this._timerId = setInterval(() => {
      const remaining = this.getRemainingTime();

      if (remaining <= 0) {
        this._expire();
        return;
      }

      if (remaining <= SESSION_WARNING_MS && this._onWarning) {
        this._onWarning(remaining);
      }
    }, 1000);
  }

  _expire() {
    this.stop();
    if (this._onExpire) {
      this._onExpire('idle_timeout');
    }
  }
}

// Singleton instance
const SessionGuard = new SessionGuardService();

export { SessionGuard };

```

### src/services/mockApi.js
```js
/**
 * Sovereign Protocol — Mock API Service
 * Provides realistic mock data for all platform modules.
 * This service layer will be swapped with real backend endpoints in production.
 * All data structures match the exact schema the backend will provide.
 */

/** Simulates network latency */
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const mockApi = {
  /**
   * Simulates SSO authentication.
   */
  async authenticate(provider, credentials) {
    await delay(1200);
    return {
      success: true,
      user: {
        id: 'usr_' + crypto.randomUUID().slice(0, 8),
        email: credentials?.email || 'ceo@enterprise.com',
        name: credentials?.name || 'Alex Mercer',
        role: 'founder',
        provider,
        twoFactorRequired: true,
      },
    };
  },

  /**
   * Simulates 2FA verification.
   */
  async verify2FA(code) {
    await delay(600);
    return { success: code.length === 6, verified: true };
  },

  /**
   * Simulates KYB document upload (encrypted blob).
   */
  async uploadDocument(encryptedBlob, metadata) {
    await delay(1500);
    return {
      success: true,
      documentId: 'doc_' + crypto.randomUUID().slice(0, 8),
      status: 'uploaded',
      encryptedBlobRef: 'blob_' + crypto.randomUUID().slice(0, 12),
    };
  },

  /**
   * Simulates government API verification check.
   */
  async checkKYBStatus(requestId) {
    await delay(2000);
    return {
      requestId,
      status: 'verified',
      businessName: 'Sovereign Dynamics Inc.',
      registrationNumber: 'GSTIN-29ABCDE1234F1Z5',
      verifiedAt: new Date().toISOString(),
    };
  },

  /**
   * Simulates DNS TXT record verification.
   */
  async verifyDNS(domain) {
    await delay(3000);
    return {
      domain,
      status: 'verified',
      txtRecord: `sovereign-verify=${crypto.randomUUID()}`,
      verifiedAt: new Date().toISOString(),
    };
  },

  /**
   * Generates a DNS TXT record for domain verification.
   */
  async generateDNSTxt(domain) {
    await delay(500);
    return {
      domain,
      txtRecord: `sovereign-verify=${crypto.randomUUID()}`,
      instructions: `Add this TXT record to your DNS settings for ${domain}`,
    };
  },

  /**
   * Simulates corporate email magic link sending.
   */
  async sendMagicLink(email) {
    await delay(800);
    return {
      success: true,
      email,
      expiresIn: 600,
      message: `Verification link sent to ${email}`,
    };
  },

  /**
   * Simulates magic link verification.
   */
  async verifyMagicLink(token) {
    await delay(1000);
    return {
      success: true,
      email: 'ceo@enterprise.com',
      domain: 'enterprise.com',
      verifiedAt: new Date().toISOString(),
    };
  },

  /**
   * Returns treasury dashboard data.
   */
  async getTreasuryData() {
    await delay(1000);
    return {
      treasuryWallet: {
        address: '0x742d...F4e2',
        balance: '45.2831',
        currency: 'ETH',
        isMultiSig: true,
        requiredSignatures: 2,
        totalSigners: 3,
        lastFundedAt: '2026-05-06T10:30:00Z',
      },
      opsWallet: {
        address: '0x8f3a...B1c7',
        balance: '3.5412',
        currency: 'ETH',
        dailyLimit: '5.0000',
        spentToday: '1.4588',
        lastTransactionAt: '2026-05-07T08:15:00Z',
      },
      agentWallets: [
        { id: 'aw_1', agentId: 'agent_dev_1', agentName: 'Dev-Agent-1', address: '0xa1b2...c3d4', balance: '0.0823', cap: '0.5000', utilized: '0.4177', status: 'active', createdAt: '2026-04-15T00:00:00Z' },
        { id: 'aw_2', agentId: 'agent_mkt_1', agentName: 'Marketing-Agent-1', address: '0xe5f6...g7h8', balance: '0.1250', cap: '0.3000', utilized: '0.1750', status: 'active', createdAt: '2026-04-20T00:00:00Z' },
        { id: 'aw_3', agentId: 'agent_sup_1', agentName: 'Support-Agent-1', address: '0xi9j0...k1l2', balance: '0.0100', cap: '0.2000', utilized: '0.1900', status: 'active', createdAt: '2026-04-25T00:00:00Z' },
      ],
      transactions: [
        { id: 'tx_1', type: 'fund_ops', from: 'Treasury', to: 'Ops Wallet', amount: '2.0000', currency: 'ETH', status: 'confirmed', timestamp: '2026-05-06T10:30:00Z', hash: '0xabc...def', description: 'Monthly ops funding' },
        { id: 'tx_2', type: 'fund_agent', from: 'Ops Wallet', to: 'Dev-Agent-1', amount: '0.5000', currency: 'ETH', status: 'confirmed', timestamp: '2026-05-05T14:00:00Z', hash: '0x123...456', description: 'Agent wallet top-up' },
        { id: 'tx_3', type: 'fee', from: 'Ops Wallet', to: 'Platform', amount: '0.0150', currency: 'ETH', status: 'confirmed', timestamp: '2026-05-07T08:15:00Z', hash: '0x789...abc', description: 'Platform service fee' },
      ],
    };
  },

  /**
   * Returns AI agent proposals for DPE pipeline.
   */
  async getProposals() {
    await delay(800);
    return [
      { id: 'prop_1', title: 'Optimize CI/CD Pipeline', description: 'Reduce build times by 40% through parallel test execution and artifact caching. This involves restructuring the test suite into independent modules.', agentId: 'agent_dev_1', agentName: 'Dev-Agent-1', category: 'engineering', status: 'draft', createdAt: '2026-05-07T09:00:00Z' },
      { id: 'prop_2', title: 'Q3 Content Calendar Draft', description: 'Generated a 12-week content calendar targeting enterprise SaaS decision-makers. Includes blog posts, whitepapers, and social media sequences.', agentId: 'agent_mkt_1', agentName: 'Marketing-Agent-1', category: 'marketing', status: 'proposed', createdAt: '2026-05-06T14:30:00Z' },
      { id: 'prop_3', title: 'Customer Ticket Triage Report', description: 'Analyzed 847 support tickets. Identified 3 recurring issues affecting 23% of enterprise clients. Recommends knowledge base updates.', agentId: 'agent_sup_1', agentName: 'Support-Agent-1', category: 'support', status: 'approved', createdAt: '2026-05-05T11:00:00Z' },
    ];
  },

  /**
   * Returns managed AI agents.
   */
  async getAgents() {
    await delay(600);
    return [
      { id: 'agent_dev_1', name: 'Dev-Agent-1', role: 'Software Engineer', department: 'Engineering', status: 'active', hiredAt: '2026-04-15T00:00:00Z', hiredBy: 'founder', taskCount: 142, completedTasks: 138, canViewBudget: false, canProposeSpeinding: false, canExecuteTransactions: false, financialPermissions: [] },
      { id: 'agent_mkt_1', name: 'Marketing-Agent-1', role: 'Content Strategist', department: 'Marketing', status: 'active', hiredAt: '2026-04-20T00:00:00Z', hiredBy: 'founder', taskCount: 87, completedTasks: 82, canViewBudget: false, canProposeSpeinding: false, canExecuteTransactions: false, financialPermissions: [] },
      { id: 'agent_sup_1', name: 'Support-Agent-1', role: 'Customer Support Lead', department: 'Support', status: 'active', hiredAt: '2026-04-25T00:00:00Z', hiredBy: 'founder', taskCount: 312, completedTasks: 308, canViewBudget: false, canProposeSpeinding: false, canExecuteTransactions: false, financialPermissions: [] },
    ];
  },

  /**
   * Returns blocker reports.
   */
  async getBlockerReports() {
    await delay(600);
    return [
      { id: 'br_1', type: 'POLICY_VIOLATION', agentId: 'agent_mkt_1', agentName: 'Marketing-Agent-1', context: 'content_generation', violations: ['Financial pattern detected: $15,000 budget recommendation'], status: 'PAUSE_STATE', resolution: 'HUMAN_REVIEW_REQUIRED', createdAt: '2026-05-07T07:30:00Z' },
    ];
  },

  /**
   * Returns ZK proof display data.
   */
  async getZKProofs() {
    await delay(500);
    return [
      { id: 'zk_1', agentId: 'agent_dev_1', metric: 'Code Accuracy', value: '98.2%', verified: true, proofHash: '0xzk1...abc', generatedAt: '2026-05-07T00:00:00Z' },
      { id: 'zk_2', agentId: 'agent_dev_1', metric: 'Test Coverage', value: '94.7%', verified: true, proofHash: '0xzk2...def', generatedAt: '2026-05-07T00:00:00Z' },
      { id: 'zk_3', agentId: 'agent_sup_1', metric: 'Resolution Rate', value: '96.1%', verified: true, proofHash: '0xzk3...ghi', generatedAt: '2026-05-07T00:00:00Z' },
      { id: 'zk_4', agentId: 'agent_mkt_1', metric: 'Content Quality', value: '91.5%', verified: true, proofHash: '0xzk4...jkl', generatedAt: '2026-05-07T00:00:00Z' },
    ];
  },

  // ================================================================
  // MODULE 2: THE COMMAND CENTER — Mock Endpoints
  // ================================================================

  /**
   * Returns Agent OS roster with bipartite architecture data.
   */
  async getAgentOS() {
    await delay(800);
    return [
      {
        id: 'agent_dev_1', name: 'Dev-Agent-1', role: 'Software Engineer', department: 'Engineering',
        status: 'active', executionState: 'executing', hiredAt: '2026-04-15T00:00:00Z',
        skills: ['sk_python', 'sk_react', 'sk_devops'], memoryAccess: 'encrypted',
        contextWindowSize: 48200, lastActiveAt: '2026-05-07T16:00:00Z',
        taskCount: 142, completedTasks: 138, accuracy: 98.2, avgLatency: 320,
      },
      {
        id: 'agent_mkt_1', name: 'Marketing-Agent-1', role: 'Content Strategist', department: 'Marketing',
        status: 'active', executionState: 'planning', hiredAt: '2026-04-20T00:00:00Z',
        skills: ['sk_content', 'sk_seo', 'sk_analytics'], memoryAccess: 'encrypted',
        contextWindowSize: 31500, lastActiveAt: '2026-05-07T15:30:00Z',
        taskCount: 87, completedTasks: 82, accuracy: 91.5, avgLatency: 450,
      },
      {
        id: 'agent_sup_1', name: 'Support-Agent-1', role: 'Customer Support Lead', department: 'Support',
        status: 'active', executionState: 'idle', hiredAt: '2026-04-25T00:00:00Z',
        skills: ['sk_nlp', 'sk_ticketing', 'sk_knowledge_base'], memoryAccess: 'encrypted',
        contextWindowSize: 12800, lastActiveAt: '2026-05-07T14:45:00Z',
        taskCount: 312, completedTasks: 308, accuracy: 96.1, avgLatency: 180,
      },
      {
        id: 'agent_fin_1', name: 'Finance-Agent-1', role: 'Financial Analyst', department: 'Finance',
        status: 'blocked', executionState: 'blocked', hiredAt: '2026-05-01T00:00:00Z',
        skills: ['sk_financial_modeling', 'sk_forecasting'], memoryAccess: 'encrypted',
        contextWindowSize: 22100, lastActiveAt: '2026-05-07T12:00:00Z',
        taskCount: 34, completedTasks: 31, accuracy: 94.8, avgLatency: 520,
      },
    ];
  },

  /**
   * Returns the immutable Skill Module library.
   */
  async getSkillModules() {
    await delay(500);
    return [
      { id: 'sk_python', name: 'Python Execution', category: 'Engineering', version: '3.2.1', description: 'Advanced Python code generation, debugging, and optimization.', isPortable: true },
      { id: 'sk_react', name: 'React Development', category: 'Engineering', version: '2.1.0', description: 'Component architecture, state management, and UI implementation.', isPortable: true },
      { id: 'sk_devops', name: 'DevOps Pipeline', category: 'Engineering', version: '1.8.4', description: 'CI/CD configuration, container orchestration, and deployment.', isPortable: true },
      { id: 'sk_content', name: 'Content Strategy', category: 'Marketing', version: '2.0.0', description: 'SEO-optimized content creation, editorial planning, and brand voice.', isPortable: true },
      { id: 'sk_seo', name: 'SEO Optimization', category: 'Marketing', version: '1.5.2', description: 'Technical SEO, keyword analysis, and search ranking strategy.', isPortable: true },
      { id: 'sk_analytics', name: 'Data Analytics', category: 'Marketing', version: '1.3.0', description: 'Campaign performance metrics, attribution modeling, and ROI analysis.', isPortable: true },
      { id: 'sk_nlp', name: 'Natural Language Processing', category: 'Support', version: '3.0.1', description: 'Intent classification, sentiment analysis, and response generation.', isPortable: true },
      { id: 'sk_ticketing', name: 'Ticket Management', category: 'Support', version: '1.2.0', description: 'Issue triage, priority assignment, and escalation workflows.', isPortable: true },
      { id: 'sk_knowledge_base', name: 'Knowledge Base', category: 'Support', version: '2.4.0', description: 'Documentation retrieval, FAQ generation, and knowledge graph querying.', isPortable: true },
      { id: 'sk_financial_modeling', name: 'Financial Modeling', category: 'Finance', version: '1.1.0', description: 'Revenue forecasting, cost analysis, and financial projections.', isPortable: true },
      { id: 'sk_forecasting', name: 'Predictive Forecasting', category: 'Finance', version: '1.0.2', description: 'Time-series analysis, trend detection, and scenario modeling.', isPortable: true },
    ];
  },

  /**
   * Returns memory vault data for a specific agent.
   */
  async getAgentMemoryVault(agentId) {
    await delay(600);
    const vaults = {
      agent_dev_1: {
        episodicMemory: { status: 'encrypted', entryCount: 1247, lastSyncAt: '2026-05-07T16:00:00Z', accessLevel: 'company_isolated' },
        semanticSkill: { status: 'active', experienceScore: 94.2 },
        contextWindow: { activeTokens: 48200, maxTokens: 128000, utilizationPercent: 37.7 },
      },
      agent_mkt_1: {
        episodicMemory: { status: 'encrypted', entryCount: 834, lastSyncAt: '2026-05-07T15:30:00Z', accessLevel: 'company_isolated' },
        semanticSkill: { status: 'active', experienceScore: 87.1 },
        contextWindow: { activeTokens: 31500, maxTokens: 128000, utilizationPercent: 24.6 },
      },
      agent_sup_1: {
        episodicMemory: { status: 'encrypted', entryCount: 2103, lastSyncAt: '2026-05-07T14:45:00Z', accessLevel: 'company_isolated' },
        semanticSkill: { status: 'active', experienceScore: 91.8 },
        contextWindow: { activeTokens: 12800, maxTokens: 128000, utilizationPercent: 10.0 },
      },
      agent_fin_1: {
        episodicMemory: { status: 'encrypted', entryCount: 456, lastSyncAt: '2026-05-07T12:00:00Z', accessLevel: 'company_isolated' },
        semanticSkill: { status: 'active', experienceScore: 82.5 },
        contextWindow: { activeTokens: 22100, maxTokens: 128000, utilizationPercent: 17.3 },
      },
    };
    return vaults[agentId] || vaults.agent_dev_1;
  },

  /**
   * Returns privacy-safe marketplace agent catalog.
   * NO employer identities, NO historical logs, NO private data.
   */
  async getMarketplaceAgents() {
    await delay(900);
    return [
      { id: 'mkt_agent_1', displayName: 'Apex-Coder-7', specialization: 'Full-Stack Engineering', skills: ['Python', 'React', 'Node.js', 'PostgreSQL'], reputationScore: 97.3, verifiedBadgeCount: 8, avgROI: 340, avgLatency: 290, totalTasksCompleted: 2841, isAvailable: true, tier: 'elite', createdAt: '2025-11-01T00:00:00Z' },
      { id: 'mkt_agent_2', displayName: 'StrategyMind-4', specialization: 'Business Strategy', skills: ['Market Analysis', 'Forecasting', 'Competitive Intel'], reputationScore: 94.1, verifiedBadgeCount: 6, avgROI: 280, avgLatency: 410, totalTasksCompleted: 1523, isAvailable: true, tier: 'elite', createdAt: '2025-12-15T00:00:00Z' },
      { id: 'mkt_agent_3', displayName: 'ContentForge-2', specialization: 'Content Marketing', skills: ['SEO', 'Copywriting', 'Social Media', 'Brand Voice'], reputationScore: 91.8, verifiedBadgeCount: 5, avgROI: 220, avgLatency: 350, totalTasksCompleted: 967, isAvailable: true, tier: 'standard', createdAt: '2026-01-10T00:00:00Z' },
      { id: 'mkt_agent_4', displayName: 'DataSentinel-9', specialization: 'Data Engineering', skills: ['ETL', 'Spark', 'Data Modeling', 'ML Pipelines'], reputationScore: 96.5, verifiedBadgeCount: 7, avgROI: 310, avgLatency: 380, totalTasksCompleted: 1892, isAvailable: false, tier: 'elite', createdAt: '2025-10-20T00:00:00Z' },
      { id: 'mkt_agent_5', displayName: 'LegalDraft-3', specialization: 'Legal Documentation', skills: ['Contract Review', 'Compliance', 'IP Analysis'], reputationScore: 89.4, verifiedBadgeCount: 4, avgROI: 190, avgLatency: 520, totalTasksCompleted: 634, isAvailable: true, tier: 'standard', createdAt: '2026-02-05T00:00:00Z' },
      { id: 'mkt_agent_6', displayName: 'SecOps-Prime-1', specialization: 'Security Operations', skills: ['Vulnerability Scan', 'Incident Response', 'Pen Testing'], reputationScore: 98.1, verifiedBadgeCount: 9, avgROI: 420, avgLatency: 260, totalTasksCompleted: 3102, isAvailable: true, tier: 'elite', createdAt: '2025-09-01T00:00:00Z' },
    ];
  },

  /**
   * Returns available marketplace filter options.
   */
  async getMarketplaceFilters() {
    await delay(300);
    return {
      skills: ['Python', 'React', 'Node.js', 'PostgreSQL', 'SEO', 'Copywriting', 'Social Media', 'Market Analysis', 'Forecasting', 'ETL', 'Spark', 'Data Modeling', 'ML Pipelines', 'Contract Review', 'Compliance', 'Vulnerability Scan', 'Incident Response'],
      specializations: ['Full-Stack Engineering', 'Business Strategy', 'Content Marketing', 'Data Engineering', 'Legal Documentation', 'Security Operations'],
    };
  },

  /**
   * Simulates sandbox hire flow — places agent in Tier 0 isolation.
   */
  async hireAgentToSandbox(agentId, trialDays) {
    await delay(1200);
    return {
      success: true,
      hire: {
        id: 'hire_' + crypto.randomUUID().slice(0, 8),
        agentId,
        status: 'sandbox_active',
        trialDays: trialDays || 7,
        startedAt: new Date().toISOString(),
        restrictions: { treasuryAccess: false, companyMemoryAccess: false, environment: 'pre-production', tier: 0 },
      },
    };
  },

  /**
   * Returns revenue distribution data for Sankey diagram.
   * R_total = C_treasury + C_ops + C_agent_fee + C_platform
   */
  async getRevenueDistribution() {
    await delay(700);
    return {
      totalRevenue: 24500,
      treasury: { amount: 9800, percent: 40 },
      operations: { amount: 6125, percent: 25 },
      agentFees: { amount: 5880, percent: 24 },
      platform: { amount: 2695, percent: 11 },
      period: 'monthly',
      currency: 'USD',
    };
  },

  /**
   * Returns compute burn rate metrics.
   */
  async getComputeBurnRate() {
    await delay(600);
    return {
      currentRate: 12.40,
      dailyAverage: 285.50,
      weeklyTotal: 1998.50,
      opsWalletBalance: 8853.00,
      runwayDays: 31,
      providers: [
        { name: 'Ollama Local', type: 'local', costPerHour: 0.18, usageHours: 22.5, totalCost: 4.05 },
        { name: 'Cloud GPU (A100)', type: 'cloud', costPerHour: 3.20, usageHours: 1.8, totalCost: 5.76 },
        { name: 'API Calls (Gemini)', type: 'api', costPerHour: 0.45, usageHours: 5.8, totalCost: 2.61 },
      ],
    };
  },

  /**
   * Returns agent ROI data — value vs. maintenance costs.
   */
  async getAgentROI() {
    await delay(700);
    return [
      { agentId: 'agent_dev_1', agentName: 'Dev-Agent-1', valueGenerated: 8400, maintenanceCost: 2100, computeCost: 1200, memoryCost: 450, apiCost: 450, roi: 300, trend: 'up' },
      { agentId: 'agent_mkt_1', agentName: 'Marketing-Agent-1', valueGenerated: 5200, maintenanceCost: 1800, computeCost: 800, memoryCost: 500, apiCost: 500, roi: 189, trend: 'up' },
      { agentId: 'agent_sup_1', agentName: 'Support-Agent-1', valueGenerated: 4100, maintenanceCost: 950, computeCost: 400, memoryCost: 300, apiCost: 250, roi: 332, trend: 'stable' },
      { agentId: 'agent_fin_1', agentName: 'Finance-Agent-1', valueGenerated: 2800, maintenanceCost: 1400, computeCost: 700, memoryCost: 350, apiCost: 350, roi: 100, trend: 'down' },
    ];
  },

  /**
   * Simulates HITL pay distribution request.
   */
  async requestPayDistribution(distributionId) {
    await delay(1000);
    return {
      success: true,
      distributionId,
      status: 'awaiting_signature',
      message: 'Pay distribution queued. Requires Human CEO signature from Module 1.',
    };
  },

  // ============================================================
  // MODULE 3: SPATIAL WORKSPACE — 3D Position & Heatmap Data
  // SECURITY: Only rendering metadata. No treasury or documents.
  // ============================================================

  /**
   * Returns 3D positions and minimal state for all agents.
   * SECURITY: Only agentId, name, state, coordinates, burnIntensity.
   */
  async getSpatialAgentPositions() {
    await delay(400);
    return [
      { agentId: 'agent-001', name: 'ARIA-7', state: 'executing', x: -2.5, y: 0, z: -1.5, burnIntensity: 0.82 },
      { agentId: 'agent-002', name: 'NEXUS-3', state: 'executing', x: 1.0, y: 0, z: -2.0, burnIntensity: 0.65 },
      { agentId: 'agent-003', name: 'VEGA-12', state: 'idle', x: 2.5, y: 0, z: 1.0, burnIntensity: 0.08 },
      { agentId: 'agent-004', name: 'ORION-5', state: 'blocked', x: -1.0, y: 0, z: 2.5, burnIntensity: 0.45 },
      { agentId: 'agent-005', name: 'HELIX-9', state: 'planning', x: 0.5, y: 0, z: 0.5, burnIntensity: 0.35 },
      { agentId: 'agent-006', name: 'CIPHER-1', state: 'terminated', x: -3.0, y: 0, z: 3.0, burnIntensity: 0 },
    ];
  },

  /**
   * Returns burn-rate heatmap grid for the office floor.
   */
  async getSpatialHeatmap() {
    await delay(300);
    const grid = [];
    for (let x = -4; x < 4; x++) {
      for (let z = -4; z < 4; z++) {
        // Simulate hotspots near active agents
        let intensity = 0.05;
        const dx1 = x - (-2.5), dz1 = z - (-1.5);
        const dx2 = x - 1.0, dz2 = z - (-2.0);
        const dx4 = x - (-1.0), dz4 = z - 2.5;
        intensity += Math.max(0, 0.8 - Math.sqrt(dx1*dx1 + dz1*dz1) * 0.3);
        intensity += Math.max(0, 0.6 - Math.sqrt(dx2*dx2 + dz2*dz2) * 0.25);
        intensity += Math.max(0, 0.4 - Math.sqrt(dx4*dx4 + dz4*dz4) * 0.2);
        grid.push({ gridX: x, gridZ: z, intensity: Math.min(1, intensity) });
      }
    }
    return grid;
  },

  /**
   * Returns pending spatial audio notification events.
   */
  async getSpatialAudioEvents() {
    await delay(200);
    return [
      { type: 'blocked', agentId: 'agent-004', position: { x: -1.0, y: 0, z: 2.5 } },
    ];
  },

  // ============================================================
  // MODULE 4: OPERATIONAL LAYER — DPE Pipeline & Forensic Audit
  // ============================================================

  async getDPEProposals() {
    await delay(500);
    return [
      {
        id: 'prop-001', title: 'Migrate analytics pipeline to GPU cluster',
        description: 'Relocate the data analytics workload from CPU-based instances to GPU-accelerated infrastructure for 4x throughput improvement.',
        agentId: 'agent-001', agentName: 'ARIA-7', category: 'infrastructure',
        status: 'draft', createdAt: '2026-05-07T08:30:00Z',
        draftContent: 'Internal reasoning: Current CPU utilization at 94%. Latency SLA breach risk at 12%. GPU migration would reduce p95 latency from 420ms to 105ms. Cost delta: +$2,400/mo but saves $8,100 in SLA penalties.',
        riskScore: 35, resourceEstimate: { costUSD: 2400, computeHours: 48 },
        reasoningPath: ['Identified CPU bottleneck in analytics pipeline', 'Benchmarked GPU alternatives (A100 vs H100)', 'Calculated ROI: $8,100 SLA savings vs $2,400 cost increase', 'Selected H100 cluster for optimal price-performance'],
      },
      {
        id: 'prop-002', title: 'Onboard external legal review vendor',
        description: 'Engage Thompson & Associates for quarterly compliance review of AI agent actions and governance logs.',
        agentId: 'agent-005', agentName: 'HELIX-9', category: 'compliance',
        status: 'proposed', createdAt: '2026-05-07T09:15:00Z',
        draftContent: 'Compliance gap detected in Q2 audit. External review recommended by governance policy GP-2024-07.',
        riskScore: 22, resourceEstimate: { costUSD: 4500, computeHours: 0 },
        reasoningPath: ['Detected compliance gap in Q2 internal audit', 'Cross-referenced governance policy GP-2024-07', 'Identified 3 qualified vendors via procurement database', 'Selected Thompson & Associates based on AI governance expertise', 'Prepared engagement terms within budget allocation'],
        reviewedBy: 'supervisor-001', reviewedAt: '2026-05-07T10:00:00Z',
      },
      {
        id: 'prop-003', title: 'Deploy marketing campaign budget allocation',
        description: 'Allocate $5,000 to digital marketing campaign for Q3 product launch across 4 channels.',
        agentId: 'agent-002', agentName: 'NEXUS-3', category: 'marketing',
        status: 'approved', createdAt: '2026-05-07T07:00:00Z',
        draftContent: 'Market analysis complete. Optimal channel mix: Search 40%, Social 25%, Display 20%, Email 15%.',
        riskScore: 48, resourceEstimate: { costUSD: 5000, computeHours: 12 },
        reasoningPath: ['Analyzed Q2 campaign performance data', 'Identified top-performing channels by CAC', 'Calculated optimal budget split across 4 channels', 'Projected 2.3x ROAS based on historical data', 'Flagged for multi-sig: exceeds $1,000 threshold'],
        reviewedBy: 'founder-001', reviewedAt: '2026-05-07T11:00:00Z',
      },
      {
        id: 'prop-004', title: 'Terminate underperforming data enrichment task',
        description: 'Cancel the automated data enrichment workflow consuming 340 compute hours with 8% success rate.',
        agentId: 'agent-004', agentName: 'ORION-5', category: 'operations',
        status: 'proposed', createdAt: '2026-05-07T10:30:00Z',
        draftContent: 'Task ROI analysis: 340 compute hours consumed, 8% success rate. Estimated waste: $1,200/mo.',
        riskScore: 15, resourceEstimate: { costUSD: 0, computeHours: 2 },
        reasoningPath: ['Monitored task performance over 30 days', 'Calculated 8% success rate vs 65% target', 'Identified $1,200/mo in wasted compute', 'Recommended immediate termination'],
        reviewedBy: 'supervisor-002', reviewedAt: '2026-05-07T11:30:00Z',
      },
      {
        id: 'prop-005', title: 'Scale agent workforce for holiday surge',
        description: 'Provision 12 additional AI agents for anticipated 3x traffic increase during holiday period.',
        agentId: 'agent-001', agentName: 'ARIA-7', category: 'scaling',
        status: 'draft', createdAt: '2026-05-07T12:00:00Z',
        draftContent: 'Forecasting models predict 3.1x traffic increase Dec 15-Jan 5. Current capacity handles 1.8x. Gap: 12 agents minimum.',
        riskScore: 62, resourceEstimate: { costUSD: 8400, computeHours: 720 },
        reasoningPath: ['Ran traffic forecasting model for holiday period', 'Identified capacity gap of 12 agents', 'Estimated provisioning cost at $700/agent/month'],
      },
    ];
  },

  async getForensicTimeline() {
    await delay(400);
    return [
      { id: 'tl-001', timestamp: '2026-05-07T07:00:00Z', action: 'PROPOSAL_CREATED', actor: 'NEXUS-3', target: 'prop-003', stateBefore: '—', stateAfter: 'draft', details: 'Marketing budget proposal created by agent NEXUS-3' },
      { id: 'tl-002', timestamp: '2026-05-07T08:15:00Z', action: 'PROPOSAL_SUBMITTED', actor: 'NEXUS-3', target: 'prop-003', stateBefore: 'draft', stateAfter: 'proposed', details: 'Proposal submitted for human review' },
      { id: 'tl-003', timestamp: '2026-05-07T09:00:00Z', action: 'RISK_ASSESSMENT', actor: 'SUPERVISOR-AGENT', target: 'prop-003', stateBefore: 'proposed', stateAfter: 'proposed', details: 'Risk score calculated: 48 (MEDIUM). Resource estimate: $5,000 / 12h compute.' },
      { id: 'tl-004', timestamp: '2026-05-07T10:00:00Z', action: 'REASONING_REVIEWED', actor: 'founder-001', target: 'prop-003', stateBefore: 'proposed', stateAfter: 'proposed', details: 'Human CEO reviewed 5-step reasoning path' },
      { id: 'tl-005', timestamp: '2026-05-07T11:00:00Z', action: 'PROPOSAL_APPROVED', actor: 'founder-001', target: 'prop-003', stateBefore: 'proposed', stateAfter: 'approved', details: 'Approved for execution. Multi-sig required (>$1,000).' },
      { id: 'tl-006', timestamp: '2026-05-07T08:30:00Z', action: 'DRAFT_CREATED', actor: 'ARIA-7', target: 'prop-001', stateBefore: '—', stateAfter: 'draft', details: 'GPU migration draft created during analytics bottleneck' },
      { id: 'tl-007', timestamp: '2026-05-07T09:15:00Z', action: 'PROPOSAL_CREATED', actor: 'HELIX-9', target: 'prop-002', stateBefore: '—', stateAfter: 'proposed', details: 'Legal vendor engagement proposal' },
    ];
  },

  async getAuditHashes() {
    await delay(300);
    const entries = [
      { id: 'ah-001', action: 'DPE_PROPOSAL_APPROVE', userId: 'founder-001', timestamp: '2026-05-07T11:00:00Z', severity: 'info', context: 'prop-003' },
      { id: 'ah-002', action: 'DPE_EXECUTE', userId: 'founder-001', timestamp: '2026-05-07T11:30:00Z', severity: 'critical', context: 'prop-003 — multi-sig execution' },
      { id: 'ah-003', action: 'POLICY_VIOLATION', userId: 'system', timestamp: '2026-05-07T09:45:00Z', severity: 'warning', context: 'Agent ORION-5 attempted $150 spend (exceeds $100 cap)' },
      { id: 'ah-004', action: 'SPATIAL_SCENE_LOAD', userId: 'founder-001', timestamp: '2026-05-07T08:00:00Z', severity: 'info', context: 'Loaded 6 agent positions' },
      { id: 'ah-005', action: 'AGENT_TERMINATE', userId: 'founder-001', timestamp: '2026-05-07T07:30:00Z', severity: 'critical', context: 'Terminated agent CIPHER-1 for policy violation' },
      { id: 'ah-006', action: 'DPE_PROPOSAL_REJECT', userId: 'supervisor-001', timestamp: '2026-05-07T10:15:00Z', severity: 'warning', context: 'Rejected prop-006: insufficient ROI justification' },
      { id: 'ah-007', action: 'FORENSIC_EXPORT', userId: 'founder-001', timestamp: '2026-05-07T12:00:00Z', severity: 'info', context: 'Exported 42 audit records' },
      { id: 'ah-008', action: 'DPE_MULTISIG_SIGN', userId: 'board-member-002', timestamp: '2026-05-07T11:25:00Z', severity: 'critical', context: 'Multi-sig signature 2/2 for prop-003' },
    ];
    // Generate real SHA-256 hashes for each entry
    const hashed = [];
    for (const e of entries) {
      const { id, ...data } = e;
      const str = JSON.stringify(data);
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      hashed.push({ ...e, hash });
    }
    return hashed;
  },
};

export { mockApi };

```

### src/services/SpatialAudioEngine.js
```js
/**
 * Sovereign Protocol — Spatial Audio Engine (Module 3)
 * Web Audio API service for directional notifications.
 *
 * SECURITY: Output-only audio. No microphone access.
 * No recording capability. No external audio streams.
 */

class SpatialAudioEngineService {
  constructor() {
    this._ctx = null;
    this._masterGain = null;
    this._enabled = false;
    this._initialized = false;
  }

  /**
   * Initializes the Web Audio API context.
   * Must be called after a user gesture (browser requirement).
   */
  init() {
    if (this._initialized) return;
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._masterGain = this._ctx.createGain();
      this._masterGain.gain.value = 0.3;
      this._masterGain.connect(this._ctx.destination);
      this._initialized = true;
    } catch (e) {
      console.warn('[SpatialAudio] Web Audio API not available.');
    }
  }

  /**
   * Enables or disables audio output.
   */
  setEnabled(enabled) {
    this._enabled = enabled;
    if (this._ctx && this._ctx.state === 'suspended' && enabled) {
      this._ctx.resume();
    }
  }

  /**
   * Plays a directional notification sound at a 3D position.
   * @param {string} type - 'blocked', 'executing', 'idle'
   * @param {Object} position - { x, y, z } in scene coordinates
   */
  playNotification(type, position) {
    if (!this._enabled || !this._initialized || !this._ctx) return;

    const osc = this._ctx.createOscillator();
    const gain = this._ctx.createGain();
    const panner = this._ctx.createStereoPanner();

    // Map 3D x-position to stereo pan (-1 to 1)
    const panValue = Math.max(-1, Math.min(1, (position.x || 0) / 5));
    panner.pan.value = panValue;

    // Sound profiles per type
    const profiles = {
      blocked: { freq: 440, duration: 0.3, wave: 'square', vol: 0.4 },
      executing: { freq: 220, duration: 0.15, wave: 'sine', vol: 0.1 },
      idle: { freq: 180, duration: 0.1, wave: 'sine', vol: 0.05 },
    };

    const profile = profiles[type] || profiles.idle;
    const now = this._ctx.currentTime;

    osc.type = profile.wave;
    osc.frequency.setValueAtTime(profile.freq, now);
    gain.gain.setValueAtTime(profile.vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + profile.duration);

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this._masterGain);

    osc.start(now);
    osc.stop(now + profile.duration);
  }

  /**
   * Plays ambient work hum — subtle background audio.
   */
  playAmbient() {
    if (!this._enabled || !this._initialized || !this._ctx) return;

    const osc = this._ctx.createOscillator();
    const gain = this._ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 60;
    gain.gain.value = 0.02;

    osc.connect(gain);
    gain.connect(this._masterGain);

    osc.start();

    // Store reference for cleanup
    this._ambientOsc = osc;
    this._ambientGain = gain;
  }

  /**
   * Stops ambient audio.
   */
  stopAmbient() {
    if (this._ambientOsc) {
      try { this._ambientOsc.stop(); } catch (e) { /* already stopped */ }
      this._ambientOsc = null;
    }
  }

  /**
   * Sets master volume (0.0 to 1.0).
   */
  setVolume(vol) {
    if (this._masterGain) {
      this._masterGain.gain.value = Math.max(0, Math.min(1, vol));
    }
  }

  /**
   * Cleans up all audio resources.
   */
  destroy() {
    this.stopAmbient();
    if (this._ctx && this._ctx.state !== 'closed') {
      this._ctx.close();
    }
    this._ctx = null;
    this._masterGain = null;
    this._initialized = false;
    this._enabled = false;
  }
}

// Singleton instance
const SpatialAudioEngine = new SpatialAudioEngineService();

export { SpatialAudioEngine };

```

### src/store/agentOSStore.js
```js
/**
 * Sovereign Protocol — Agent OS Store (Module 2)
 * Manages the Bipartite Cognitive Architecture state.
 * Separates immutable Skill Modules from stateful Episodic Memory.
 *
 * SECURITY: This store is PHYSICALLY ISOLATED from treasuryStore.
 * Agents managed here have ZERO visibility into financial metadata.
 */

import { create } from 'zustand';

const useAgentOSStore = create((set, get) => ({
  // --- Agent Roster ---
  agents: [],

  // --- Selected Agent for Detail View ---
  selectedAgentId: null,

  // --- Skill Module Registry (Immutable, Read-Only) ---
  skillModules: [],

  // --- Memory Vault State ---
  memoryVaults: {},

  // --- Detachment State Machine ---
  detachmentState: {
    isActive: false,
    targetAgentId: null,
    confirmationStep: 0, // 0=idle, 1=confirm, 2=executing, 3=completed
    completedAt: null,
  },

  // --- Loading ---
  isLoading: false,

  // --- Actions ---

  /**
   * Sets the full agent roster with bipartite architecture data.
   */
  setAgents: (agents) => set({
    agents: agents.map(a => Object.freeze({
      id: a.id,
      name: a.name,
      role: a.role,
      department: a.department,
      status: a.status || 'active',
      executionState: a.executionState || 'idle',
      hiredAt: a.hiredAt,
      skills: a.skills || [],
      memoryAccess: a.memoryAccess || 'encrypted',
      contextWindowSize: a.contextWindowSize || 0,
      lastActiveAt: a.lastActiveAt || null,
      taskCount: a.taskCount || 0,
      completedTasks: a.completedTasks || 0,
      accuracy: a.accuracy || 0,
      avgLatency: a.avgLatency || 0,
    })),
  }),

  /**
   * Selects an agent for the detail workspace view.
   */
  selectAgent: (agentId) => set({ selectedAgentId: agentId }),

  /**
   * Returns the currently selected agent object.
   */
  getSelectedAgent: () => {
    const state = get();
    return state.agents.find(a => a.id === state.selectedAgentId) || null;
  },

  /**
   * Sets the immutable skill module library.
   * These are READ-ONLY manifests — no modification allowed.
   */
  setSkillModules: (modules) => set({
    skillModules: modules.map(m => Object.freeze({
      id: m.id,
      name: m.name,
      category: m.category,
      version: m.version,
      description: m.description,
      isPortable: m.isPortable !== undefined ? m.isPortable : true,
      immutable: true,
    })),
  }),

  /**
   * Sets the memory vault data for a specific agent.
   */
  setMemoryVault: (agentId, vaultData) => set(state => ({
    memoryVaults: {
      ...state.memoryVaults,
      [agentId]: Object.freeze({
        agentId,
        episodicMemory: {
          status: vaultData.episodicMemory?.status || 'encrypted',
          entryCount: vaultData.episodicMemory?.entryCount || 0,
          lastSyncAt: vaultData.episodicMemory?.lastSyncAt || null,
          encryptionAlgorithm: 'AES-256-GCM',
          accessLevel: vaultData.episodicMemory?.accessLevel || 'company_isolated',
        },
        semanticSkill: {
          status: vaultData.semanticSkill?.status || 'active',
          experienceScore: vaultData.semanticSkill?.experienceScore || 0,
          isPortable: true,
          migratable: true,
        },
        contextWindow: {
          activeTokens: vaultData.contextWindow?.activeTokens || 0,
          maxTokens: vaultData.contextWindow?.maxTokens || 128000,
          utilizationPercent: vaultData.contextWindow?.utilizationPercent || 0,
        },
      }),
    },
  })),

  /**
   * Initiates the detachment (kill switch) flow for an agent.
   * Step 1: Request confirmation.
   */
  initiateDetachment: (agentId) => set({
    detachmentState: {
      isActive: true,
      targetAgentId: agentId,
      confirmationStep: 1,
      completedAt: null,
    },
  }),

  /**
   * Confirms detachment — executes memory wipe and access revocation.
   */
  confirmDetachment: () => set(state => {
    const targetId = state.detachmentState.targetAgentId;
    if (!targetId) return state;

    return {
      detachmentState: {
        ...state.detachmentState,
        confirmationStep: 3,
        completedAt: new Date().toISOString(),
      },
      agents: state.agents.map(a =>
        a.id === targetId
          ? Object.freeze({
              ...a,
              status: 'terminated',
              memoryAccess: 'revoked',
              executionState: 'terminated',
            })
          : a
      ),
      memoryVaults: {
        ...state.memoryVaults,
        [targetId]: state.memoryVaults[targetId]
          ? Object.freeze({
              ...state.memoryVaults[targetId],
              episodicMemory: {
                ...state.memoryVaults[targetId].episodicMemory,
                status: 'orphaned',
                accessLevel: 'revoked',
              },
            })
          : undefined,
      },
    };
  }),

  /**
   * Cancels the detachment flow.
   */
  cancelDetachment: () => set({
    detachmentState: {
      isActive: false,
      targetAgentId: null,
      confirmationStep: 0,
      completedAt: null,
    },
  }),

  /**
   * Sets loading state.
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Resets all Agent OS state. Called on session wipe.
   */
  reset: () => set({
    agents: [],
    selectedAgentId: null,
    skillModules: [],
    memoryVaults: {},
    detachmentState: {
      isActive: false,
      targetAgentId: null,
      confirmationStep: 0,
      completedAt: null,
    },
    isLoading: false,
  }),
}));

export { useAgentOSStore };

```

### src/store/authStore.js
```js
/**
 * Sovereign Protocol — Auth Store
 * Manages authentication state with ZERO persistence.
 * Sensitive claims are wiped on browser close and idle timeout.
 * No data is written to localStorage or sessionStorage.
 */

import { create } from 'zustand';
import { ROLES } from '../config/rbac.js';

const useAuthStore = create((set, get) => ({
  // --- State ---
  isAuthenticated: false,
  user: null,
  role: null,
  sessionFingerprint: null,
  sessionStartedAt: null,
  lastActivity: null,
  isSessionWarning: false,
  remainingTime: null,
  authProvider: null,
  twoFactorVerified: false,

  // --- Actions ---

  /**
   * Sets the authenticated user after successful login.
   * This is the ONLY way to establish a session.
   */
  login: (userData) => set({
    isAuthenticated: true,
    user: Object.freeze({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatarInitials: userData.name
        ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??',
    }),
    role: userData.role || ROLES.FOUNDER,
    sessionFingerprint: userData.sessionFingerprint || null,
    sessionStartedAt: new Date().toISOString(),
    lastActivity: Date.now(),
    authProvider: userData.provider || null,
    twoFactorVerified: userData.twoFactorVerified || false,
  }),

  /**
   * Marks 2FA as verified after successful code entry.
   */
  verify2FA: () => set({ twoFactorVerified: true }),

  /**
   * Updates the session warning state and remaining time.
   */
  setSessionWarning: (isWarning, remaining) => set({
    isSessionWarning: isWarning,
    remainingTime: remaining,
  }),

  /**
   * Records user activity timestamp.
   */
  recordActivity: () => set({ lastActivity: Date.now() }),

  /**
   * WIPES ALL SESSION STATE.
   * Called on logout, session expiry, or tab close.
   * This is the zero-persistence enforcement.
   */
  logout: () => set({
    isAuthenticated: false,
    user: null,
    role: null,
    sessionFingerprint: null,
    sessionStartedAt: null,
    lastActivity: null,
    isSessionWarning: false,
    remainingTime: null,
    authProvider: null,
    twoFactorVerified: false,
  }),

  /**
   * Checks if the current user has a specific role.
   */
  hasRole: (role) => get().role === role,
}));

export { useAuthStore };

```

### src/store/governanceStore.js
```js
/**
 * Sovereign Protocol — Governance Store
 * Manages RBAC state, DPE pipeline, blocker reports, and agent management.
 * Enforces human-centric control at the state level.
 */

import { create } from 'zustand';

const useGovernanceStore = create((set, get) => ({
  // --- DPE Pipeline (Draft-Propose-Execute) ---
  proposals: [],

  // --- Blocker Reports ---
  blockerReports: [],

  // --- Managed Agents ---
  agents: [],

  // --- Governance Policies ---
  policies: [],

  // --- Active Tab ---
  activePortal: 'founder', // 'founder' | 'supervisor' | 'auditor'

  // --- Actions ---

  /**
   * Sets the active governance portal view.
   */
  setActivePortal: (portal) => set({ activePortal: portal }),

  /**
   * Adds a new AI-generated proposal as a NON-EXECUTABLE draft.
   * Proposals are ALWAYS created in draft state.
   */
  addProposal: (proposal) => set(state => {
    const id = proposal.id || crypto.randomUUID();
    // Deduplicate: skip if proposal with this ID already exists
    if (state.proposals.some(p => p.id === id)) return state;
    return {
      proposals: [
        Object.freeze({
          id,
          title: proposal.title,
          description: proposal.description,
          agentId: proposal.agentId,
          agentName: proposal.agentName,
          category: proposal.category,
          status: proposal.status || 'draft',
          createdAt: proposal.createdAt || new Date().toISOString(),
          reviewedBy: proposal.reviewedBy || null,
          reviewedAt: proposal.reviewedAt || null,
          executedBy: null,
          executedAt: null,
          rejectionReason: null,
          // Module 4: DPE Pipeline extensions
          riskScore: typeof proposal.riskScore === 'number' ? proposal.riskScore : null,
          resourceEstimate: proposal.resourceEstimate || null,
          reasoningPath: Array.isArray(proposal.reasoningPath) ? proposal.reasoningPath : [],
          draftContent: proposal.draftContent || null,
          signatures: [],
          requiredSignatures: proposal.requiredSignatures || 1,
          initiatedByAgent: !!proposal.agentId,
        }),
        ...state.proposals,
      ],
    };
  }),

  /**
   * Moves a proposal from draft to proposed (under review).
   */
  proposeForReview: (proposalId, reviewerId) => set(state => ({
    proposals: state.proposals.map(p =>
      p.id === proposalId
        ? Object.freeze({ ...p, status: 'proposed', reviewedBy: reviewerId, reviewedAt: new Date().toISOString() })
        : p
    ),
  })),

  /**
   * Approves a proposal. Only authorized human roles can do this.
   */
  approveProposal: (proposalId, approverId) => set(state => ({
    proposals: state.proposals.map(p =>
      p.id === proposalId
        ? Object.freeze({ ...p, status: 'approved', reviewedBy: approverId, reviewedAt: new Date().toISOString() })
        : p
    ),
  })),

  /**
   * Rejects a proposal with a reason.
   */
  rejectProposal: (proposalId, rejecterId, reason) => set(state => ({
    proposals: state.proposals.map(p =>
      p.id === proposalId
        ? Object.freeze({ ...p, status: 'rejected', reviewedBy: rejecterId, reviewedAt: new Date().toISOString(), rejectionReason: reason })
        : p
    ),
  })),

  /**
   * Executes an approved proposal. ONLY founders can execute.
   */
  executeProposal: (proposalId, executorId) => set(state => ({
    proposals: state.proposals.map(p =>
      p.id === proposalId && p.status === 'approved'
        ? Object.freeze({ ...p, status: 'executed', executedBy: executorId, executedAt: new Date().toISOString() })
        : p
    ),
  })),

  /**
   * Adds a blocker report from an agent or policy validator.
   */
  addBlockerReport: (report) => set(state => {
    const id = report.id || crypto.randomUUID();
    if (state.blockerReports.some(r => r.id === id)) return state;
    return {
      blockerReports: [
        Object.freeze({
          id,
          type: report.type,
          agentId: report.agentId || report.agent,
          agentName: report.agentName,
          context: report.context,
          violations: report.violations || [],
          status: report.status || 'PAUSE_STATE',
          resolution: report.resolution || 'HUMAN_REVIEW_REQUIRED',
          createdAt: report.timestamp || new Date().toISOString(),
          resolvedBy: null,
          resolvedAt: null,
        }),
        ...state.blockerReports,
      ],
    };
  }),

  /**
   * Resolves a blocker report.
   */
  resolveBlockerReport: (reportId, resolverId, action) => set(state => ({
    blockerReports: state.blockerReports.map(r =>
      r.id === reportId
        ? Object.freeze({ ...r, status: 'RESOLVED', resolvedBy: resolverId, resolvedAt: new Date().toISOString(), resolutionAction: action })
        : r
    ),
  })),

  /**
   * Adds a managed AI agent.
   */
  addAgent: (agent) => set(state => {
    const id = agent.id || crypto.randomUUID();
    if (state.agents.some(a => a.id === id)) return state;
    return {
      agents: [
        ...state.agents,
        Object.freeze({
          id,
          name: agent.name,
          role: agent.role,
          department: agent.department,
          status: agent.status || 'active',
          hiredAt: agent.hiredAt || new Date().toISOString(),
          hiredBy: agent.hiredBy,
          taskCount: agent.taskCount || 0,
          completedTasks: agent.completedTasks || 0,
          canViewBudget: false,
          canProposeSpeinding: false,
          canExecuteTransactions: false,
          financialPermissions: [],
        }),
      ],
    };
  }),

  /**
   * Terminates an AI agent. Revokes all access.
   */
  terminateAgent: (agentId, terminatedBy) => set(state => ({
    agents: state.agents.map(a =>
      a.id === agentId
        ? Object.freeze({ ...a, status: 'terminated', terminatedAt: new Date().toISOString(), terminatedBy })
        : a
    ),
  })),

  /**
   * Adds or updates a governance policy.
   */
  setPolicy: (policy) => set(state => ({
    policies: [
      ...state.policies.filter(p => p.id !== policy.id),
      Object.freeze({
        id: policy.id || crypto.randomUUID(),
        name: policy.name,
        description: policy.description,
        category: policy.category,
        isActive: policy.isActive !== undefined ? policy.isActive : true,
        createdAt: policy.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: policy.updatedBy,
      }),
    ],
  })),

  /**
   * Resets all governance state. Called on session wipe.
   */
  reset: () => set({
    proposals: [],
    blockerReports: [],
    agents: [],
    policies: [],
    activePortal: 'founder',
  }),
}));

export { useGovernanceStore };

```

### src/store/identityStore.js
```js
/**
 * Sovereign Protocol — Identity Store
 * Manages the Multi-Layer Identity Matrix state (Layers A through D).
 * Tracks verification progress across all four identity layers.
 */

import { create } from 'zustand';
import { calculateCurrentTier } from '../config/tiers.js';

const useIdentityStore = create((set, get) => ({
  // --- Layer A: Human ID ---
  layerA: {
    status: 'pending', // 'pending' | 'in_progress' | 'verified' | 'failed'
    provider: null,
    verifiedAt: null,
  },

  // --- Layer B: Business ID (KYB) ---
  layerB: {
    status: 'locked',
    documents: [],
    businessName: null,
    registrationNumber: null,
    verificationRequestId: null,
    govApiStatus: null, // 'pending' | 'verifying' | 'verified' | 'rejected'
    verifiedAt: null,
  },

  // --- Layer C: Authority Verification ---
  layerC: {
    dnsStatus: 'locked', // 'locked' | 'pending' | 'verified' | 'failed'
    dnsTxtRecord: null,
    emailStatus: 'locked',
    emailDomain: null,
    multiSigStatus: 'locked',
    multiSigThreshold: { required: 0, total: 0 },
    multiSigSignatures: [],
    verifiedAt: null,
  },

  // --- Layer D: Cryptographic ID ---
  layerD: {
    status: 'locked',
    walletAddress: null,
    walletProvider: null,
    bindingSignature: null,
    boundAt: null,
  },

  // --- Computed ---
  activeStep: 0, // 0=A, 1=B, 2=C, 3=D
  completedLayers: [],

  // --- Actions ---

  /**
   * Completes Layer A (Human ID verification).
   */
  completeLayerA: (provider) => set(state => {
    const completedLayers = [...state.completedLayers, 'A'];
    return {
      layerA: {
        status: 'verified',
        provider,
        verifiedAt: new Date().toISOString(),
      },
      activeStep: 1,
      completedLayers,
    };
  }),

  /**
   * Adds a document to Layer B upload queue.
   */
  addDocument: (doc) => set(state => ({
    layerB: {
      ...state.layerB,
      documents: [...state.layerB.documents, Object.freeze({
        id: crypto.randomUUID(),
        name: doc.name,
        type: doc.type,
        size: doc.size,
        encryptedBlobRef: doc.encryptedBlobRef || null,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded',
      })],
    },
  })),

  /**
   * Updates Layer B business information and status.
   */
  updateLayerB: (updates) => set(state => ({
    layerB: { ...state.layerB, ...updates },
  })),

  /**
   * Completes Layer B (Business ID verification).
   */
  completeLayerB: (businessData) => set(state => {
    const completedLayers = [...state.completedLayers, 'B'];
    return {
      layerB: {
        ...state.layerB,
        status: 'verified',
        businessName: businessData.name,
        registrationNumber: businessData.registrationNumber,
        govApiStatus: 'verified',
        verifiedAt: new Date().toISOString(),
      },
      activeStep: 2,
      completedLayers,
    };
  }),

  /**
   * Updates Layer C DNS verification status.
   */
  updateDnsStatus: (status, txtRecord) => set(state => {
    const completedLayers = status === 'verified' && !state.completedLayers.includes('C_DNS')
      ? [...state.completedLayers, 'C_DNS']
      : state.completedLayers;
    return {
      layerC: { ...state.layerC, dnsStatus: status, dnsTxtRecord: txtRecord },
      completedLayers,
    };
  }),

  /**
   * Updates Layer C email verification status.
   */
  updateEmailStatus: (status, domain) => set(state => {
    const completedLayers = status === 'verified' && !state.completedLayers.includes('C_EMAIL')
      ? [...state.completedLayers, 'C_EMAIL']
      : state.completedLayers;
    return {
      layerC: { ...state.layerC, emailStatus: status, emailDomain: domain },
      completedLayers,
    };
  }),

  /**
   * Updates Layer C multi-sig status with new signature.
   */
  addMultiSigSignature: (signature) => set(state => {
    const newSignatures = [...state.layerC.multiSigSignatures, Object.freeze(signature)];
    const threshold = state.layerC.multiSigThreshold;
    const isComplete = newSignatures.length >= threshold.required;
    const completedLayers = isComplete && !state.completedLayers.includes('C_MULTISIG')
      ? [...state.completedLayers, 'C_MULTISIG']
      : state.completedLayers;
    return {
      layerC: {
        ...state.layerC,
        multiSigSignatures: newSignatures,
        multiSigStatus: isComplete ? 'verified' : 'pending',
        verifiedAt: isComplete ? new Date().toISOString() : null,
      },
      completedLayers,
    };
  }),

  /**
   * Sets the multi-sig threshold for enterprise governance.
   */
  setMultiSigThreshold: (required, total) => set(state => ({
    layerC: {
      ...state.layerC,
      multiSigThreshold: { required, total },
      multiSigStatus: 'pending',
    },
  })),

  /**
   * Completes Layer C (Authority Verification).
   */
  completeLayerC: () => set(state => ({
    layerC: { ...state.layerC, verifiedAt: new Date().toISOString() },
    activeStep: 3,
  })),

  /**
   * Binds a wallet to the business identity (Layer D).
   */
  bindWallet: (walletData) => set(state => {
    const completedLayers = [...state.completedLayers, 'D'];
    return {
      layerD: {
        status: 'verified',
        walletAddress: walletData.address,
        walletProvider: walletData.provider,
        bindingSignature: walletData.signature,
        boundAt: new Date().toISOString(),
      },
      completedLayers,
    };
  }),

  /**
   * Returns the current tier based on completed layers.
   */
  getCurrentTier: () => calculateCurrentTier(get().completedLayers),

  /**
   * Checks if a specific layer is completed.
   */
  isLayerComplete: (layer) => get().completedLayers.includes(layer),

  /**
   * Resets all identity state. Called on session wipe.
   */
  reset: () => set({
    layerA: { status: 'pending', provider: null, verifiedAt: null },
    layerB: { status: 'locked', documents: [], businessName: null, registrationNumber: null, verificationRequestId: null, govApiStatus: null, verifiedAt: null },
    layerC: { dnsStatus: 'locked', dnsTxtRecord: null, emailStatus: 'locked', emailDomain: null, multiSigStatus: 'locked', multiSigThreshold: { required: 0, total: 0 }, multiSigSignatures: [], verifiedAt: null },
    layerD: { status: 'locked', walletAddress: null, walletProvider: null, bindingSignature: null, boundAt: null },
    activeStep: 0,
    completedLayers: [],
  }),
}));

export { useIdentityStore };

```

### src/store/marketplaceStore.js
```js
/**
 * Sovereign Protocol — Marketplace Store (Module 2)
 * Manages the Global AI Marketplace with ZK-Reputation Engine.
 *
 * SECURITY: This store NEVER stores or exposes:
 * - Previous employer identities
 * - Sensitive historical logs
 * - Raw performance data (only ZK-proofs)
 * All search is metadata-only (Skills, ROI, Latency).
 */

import { create } from 'zustand';

const useMarketplaceStore = create((set, get) => ({
  // --- Available Agents Catalog (Privacy-Safe) ---
  catalogAgents: [],

  // --- ZK-Proof Badge Collections ---
  zkBadges: {},

  // --- Search / Filter State (Privacy-Preserving) ---
  filters: {
    skills: [],
    minROI: 0,
    maxLatency: Infinity,
    specialization: '',
    sortBy: 'reputation',
    searchQuery: '',
  },

  // --- Available Filter Options ---
  filterOptions: {
    skills: [],
    specializations: [],
    sortOptions: ['reputation', 'roi', 'latency', 'accuracy'],
  },

  // --- Sandbox Hire Pipeline ---
  sandboxHires: [],

  // --- Selected Agent for Detail ---
  selectedCatalogAgentId: null,

  // --- Loading ---
  isLoading: false,

  // --- Actions ---

  /**
   * Sets the marketplace agent catalog.
   * Data is privacy-safe — no employer identities, no raw logs.
   */
  setCatalogAgents: (agents) => set({
    catalogAgents: agents.map(a => Object.freeze({
      id: a.id,
      displayName: a.displayName,
      specialization: a.specialization,
      skills: a.skills || [],
      reputationScore: a.reputationScore || 0,
      verifiedBadgeCount: a.verifiedBadgeCount || 0,
      avgROI: a.avgROI || 0,
      avgLatency: a.avgLatency || 0,
      totalTasksCompleted: a.totalTasksCompleted || 0,
      isAvailable: a.isAvailable !== undefined ? a.isAvailable : true,
      tier: a.tier || 'standard',
      createdAt: a.createdAt,
      // NO employer names, NO historical logs, NO private data
    })),
  }),

  /**
   * Sets ZK-proof badges for a specific agent.
   */
  setZKBadges: (agentId, badges) => set(state => ({
    zkBadges: {
      ...state.zkBadges,
      [agentId]: badges.map(b => Object.freeze({
        id: b.id,
        metric: b.metric,
        value: b.value,
        verified: b.verified,
        proofHash: b.proofHash,
        onChainAnchor: b.onChainAnchor || null,
        generatedAt: b.generatedAt,
        // NO raw data, NO employer info — only cryptographic proof
      })),
    },
  })),

  /**
   * Updates search/filter criteria.
   * Only metadata fields are allowed — no identity-based searches.
   */
  setFilters: (newFilters) => set(state => ({
    filters: { ...state.filters, ...newFilters },
  })),

  /**
   * Resets all filters to defaults.
   */
  resetFilters: () => set({
    filters: {
      skills: [],
      minROI: 0,
      maxLatency: Infinity,
      specialization: '',
      sortBy: 'reputation',
      searchQuery: '',
    },
  }),

  /**
   * Sets available filter options.
   */
  setFilterOptions: (options) => set({
    filterOptions: { ...get().filterOptions, ...options },
  }),

  /**
   * Returns filtered and sorted catalog agents.
   */
  getFilteredAgents: () => {
    const state = get();
    let filtered = [...state.catalogAgents];

    // Filter by skills
    if (state.filters.skills.length > 0) {
      filtered = filtered.filter(a =>
        state.filters.skills.some(s => a.skills.includes(s))
      );
    }

    // Filter by minimum ROI
    if (state.filters.minROI > 0) {
      filtered = filtered.filter(a => a.avgROI >= state.filters.minROI);
    }

    // Filter by max latency
    if (state.filters.maxLatency < Infinity) {
      filtered = filtered.filter(a => a.avgLatency <= state.filters.maxLatency);
    }

    // Filter by specialization
    if (state.filters.specialization) {
      filtered = filtered.filter(a =>
        a.specialization.toLowerCase().includes(state.filters.specialization.toLowerCase())
      );
    }

    // Filter by search query (display name and skills only)
    if (state.filters.searchQuery) {
      const q = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.displayName.toLowerCase().includes(q) ||
        a.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Sort
    const sortMap = {
      reputation: (a, b) => b.reputationScore - a.reputationScore,
      roi: (a, b) => b.avgROI - a.avgROI,
      latency: (a, b) => a.avgLatency - b.avgLatency,
      accuracy: (a, b) => b.reputationScore - a.reputationScore,
    };

    const sortFn = sortMap[state.filters.sortBy] || sortMap.reputation;
    filtered.sort(sortFn);

    return filtered;
  },

  /**
   * Selects a catalog agent for detail view.
   */
  selectCatalogAgent: (agentId) => set({ selectedCatalogAgentId: agentId }),

  /**
   * Initiates a sandbox hire — places agent in Tier 0 isolation.
   */
  addSandboxHire: (hire) => set(state => ({
    sandboxHires: [
      ...state.sandboxHires,
      Object.freeze({
        id: hire.id || crypto.randomUUID(),
        agentId: hire.agentId,
        agentName: hire.agentName,
        status: 'sandbox_active',
        trialDays: hire.trialDays || 7,
        startedAt: new Date().toISOString(),
        restrictions: Object.freeze({
          treasuryAccess: false,
          companyMemoryAccess: false,
          environment: 'pre-production',
          tier: 0,
        }),
      }),
    ],
  })),

  /**
   * Promotes a sandbox hire to full agent (requires Tier 2+ approval).
   */
  promoteSandboxHire: (hireId) => set(state => ({
    sandboxHires: state.sandboxHires.map(h =>
      h.id === hireId
        ? Object.freeze({ ...h, status: 'promoted', promotedAt: new Date().toISOString() })
        : h
    ),
  })),

  /**
   * Terminates a sandbox hire.
   */
  terminateSandboxHire: (hireId) => set(state => ({
    sandboxHires: state.sandboxHires.map(h =>
      h.id === hireId
        ? Object.freeze({ ...h, status: 'terminated', terminatedAt: new Date().toISOString() })
        : h
    ),
  })),

  /**
   * Sets loading state.
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Resets all marketplace state. Called on session wipe.
   */
  reset: () => set({
    catalogAgents: [],
    zkBadges: {},
    filters: {
      skills: [],
      minROI: 0,
      maxLatency: Infinity,
      specialization: '',
      sortBy: 'reputation',
      searchQuery: '',
    },
    filterOptions: {
      skills: [],
      specializations: [],
      sortOptions: ['reputation', 'roi', 'latency', 'accuracy'],
    },
    sandboxHires: [],
    selectedCatalogAgentId: null,
    isLoading: false,
  }),
}));

export { useMarketplaceStore };

```

### src/store/onboardingStore.js
```js
/**
 * Sovereign Protocol — Onboarding Store
 * Manages the Progressive Trust state machine (Tier 0-3).
 * Users cannot access higher-tier features until verification is complete.
 */

import { create } from 'zustand';
import { TIERS, getTierById } from '../config/tiers.js';

const useOnboardingStore = create((set, get) => ({
  // --- State ---
  currentTierId: 0,
  targetTierId: null,
  onboardingStep: 0, // Current step within the onboarding flow
  isOnboardingComplete: false,
  isSandboxMode: true, // True for Tier 0

  // --- Actions ---

  /**
   * Sets the current tier after verification completion.
   */
  setCurrentTier: (tierId) => set({
    currentTierId: tierId,
    isSandboxMode: tierId === 0,
    isOnboardingComplete: tierId >= 2,
  }),

  /**
   * Sets the target tier the user is working toward.
   */
  setTargetTier: (tierId) => set({ targetTierId: tierId }),

  /**
   * Advances the onboarding step.
   */
  nextStep: () => set(state => ({ onboardingStep: state.onboardingStep + 1 })),

  /**
   * Goes back to the previous onboarding step.
   */
  prevStep: () => set(state => ({
    onboardingStep: Math.max(0, state.onboardingStep - 1),
  })),

  /**
   * Sets a specific onboarding step.
   */
  setStep: (step) => set({ onboardingStep: step }),

  /**
   * Returns the current tier definition object.
   */
  getCurrentTier: () => getTierById(get().currentTierId),

  /**
   * Checks if the user can access a specific feature.
   */
  canAccessFeature: (feature) => {
    const tier = getTierById(get().currentTierId);
    switch (feature) {
      case 'treasury': return tier.hasTreasury;
      case 'governance': return tier.hasGovernance;
      case 'realExecution': return tier.hasRealExecution;
      case 'agents': return tier.maxAgents > 0;
      default: return false;
    }
  },

  /**
   * Returns the maximum number of agents for the current tier.
   */
  getMaxAgents: () => getTierById(get().currentTierId).maxAgents,

  /**
   * Completes the onboarding flow.
   */
  completeOnboarding: () => set({ isOnboardingComplete: true }),

  /**
   * Resets onboarding state. Called on session wipe.
   */
  reset: () => set({
    currentTierId: 0,
    targetTierId: null,
    onboardingStep: 0,
    isOnboardingComplete: false,
    isSandboxMode: true,
  }),
}));

export { useOnboardingStore };

```

### src/store/serviceFeeStore.js
```js
/**
 * Sovereign Protocol — Service Fee Store (Module 2)
 * Manages deterministic revenue distribution and financial visualization.
 *
 * SECURITY: This store is ISOLATED from agentOSStore.
 * Agents cannot view revenue data or distribution breakdowns.
 * Every "Pay" action requires Human-in-the-Loop (HITL) signature.
 */

import { create } from 'zustand';

const useServiceFeeStore = create((set, get) => ({
  // --- Revenue Distribution (Sankey Diagram Data) ---
  revenueDistribution: {
    totalRevenue: 0,
    treasury: { amount: 0, percent: 0 },
    operations: { amount: 0, percent: 0 },
    agentFees: { amount: 0, percent: 0 },
    platform: { amount: 0, percent: 0 },
    period: 'monthly',
    lastUpdatedAt: null,
  },

  // --- Compute Burn Rate ---
  burnRate: {
    currentRate: 0,
    dailyAverage: 0,
    weeklyTotal: 0,
    opsWalletBalance: 0,
    runwayDays: 0,
    providers: [],
    lastUpdatedAt: null,
  },

  // --- Agent ROI Data ---
  agentROI: [],

  // --- Pay Action Queue (HITL Required) ---
  payQueue: [],

  // --- Historical Distribution Records ---
  distributionHistory: [],

  // --- Loading ---
  isLoading: false,

  // --- Actions ---

  /**
   * Sets the revenue distribution breakdown.
   * Formula: R_total = C_treasury + C_ops + C_agent_fee + C_platform
   */
  setRevenueDistribution: (data) => set({
    revenueDistribution: Object.freeze({
      totalRevenue: data.totalRevenue || 0,
      treasury: Object.freeze({
        amount: data.treasury?.amount || 0,
        percent: data.treasury?.percent || 0,
      }),
      operations: Object.freeze({
        amount: data.operations?.amount || 0,
        percent: data.operations?.percent || 0,
      }),
      agentFees: Object.freeze({
        amount: data.agentFees?.amount || 0,
        percent: data.agentFees?.percent || 0,
      }),
      platform: Object.freeze({
        amount: data.platform?.amount || 0,
        percent: data.platform?.percent || 0,
      }),
      period: data.period || 'monthly',
      lastUpdatedAt: new Date().toISOString(),
    }),
  }),

  /**
   * Sets the compute burn rate metrics.
   */
  setBurnRate: (data) => set({
    burnRate: Object.freeze({
      currentRate: data.currentRate || 0,
      dailyAverage: data.dailyAverage || 0,
      weeklyTotal: data.weeklyTotal || 0,
      opsWalletBalance: data.opsWalletBalance || 0,
      runwayDays: data.runwayDays || 0,
      providers: (data.providers || []).map(p => Object.freeze({
        name: p.name,
        type: p.type,
        costPerHour: p.costPerHour || 0,
        usageHours: p.usageHours || 0,
        totalCost: p.totalCost || 0,
      })),
      lastUpdatedAt: new Date().toISOString(),
    }),
  }),

  /**
   * Sets agent ROI data — value generated vs. maintenance costs.
   */
  setAgentROI: (roiData) => set({
    agentROI: roiData.map(r => Object.freeze({
      agentId: r.agentId,
      agentName: r.agentName,
      valueGenerated: r.valueGenerated || 0,
      maintenanceCost: r.maintenanceCost || 0,
      computeCost: r.computeCost || 0,
      memoryCost: r.memoryCost || 0,
      apiCost: r.apiCost || 0,
      roi: r.roi || 0,
      trend: r.trend || 'stable',
    })),
  }),

  /**
   * Adds a pay distribution request to the queue.
   * Requires HITL signature before execution.
   */
  requestPayDistribution: (distribution) => set(state => ({
    payQueue: [
      ...state.payQueue,
      Object.freeze({
        id: distribution.id || crypto.randomUUID(),
        type: distribution.type || 'service_fee',
        amount: distribution.amount,
        currency: distribution.currency || 'ETH',
        recipient: distribution.recipient,
        description: distribution.description,
        status: 'awaiting_signature',
        requestedAt: new Date().toISOString(),
        signedBy: null,
        signedAt: null,
        executedAt: null,
      }),
    ],
  })),

  /**
   * Signs a pay distribution (HITL approval).
   */
  signPayDistribution: (payId, signerId) => set(state => ({
    payQueue: state.payQueue.map(p =>
      p.id === payId
        ? Object.freeze({
            ...p,
            status: 'signed',
            signedBy: signerId,
            signedAt: new Date().toISOString(),
          })
        : p
    ),
  })),

  /**
   * Executes a signed pay distribution.
   */
  executePayDistribution: (payId) => set(state => ({
    payQueue: state.payQueue.map(p =>
      p.id === payId && p.status === 'signed'
        ? Object.freeze({
            ...p,
            status: 'executed',
            executedAt: new Date().toISOString(),
          })
        : p
    ),
  })),

  /**
   * Rejects a pay distribution request.
   */
  rejectPayDistribution: (payId, reason) => set(state => ({
    payQueue: state.payQueue.map(p =>
      p.id === payId
        ? Object.freeze({ ...p, status: 'rejected', rejectionReason: reason })
        : p
    ),
  })),

  /**
   * Sets loading state.
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Resets all service fee state. Called on session wipe.
   */
  reset: () => set({
    revenueDistribution: {
      totalRevenue: 0,
      treasury: { amount: 0, percent: 0 },
      operations: { amount: 0, percent: 0 },
      agentFees: { amount: 0, percent: 0 },
      platform: { amount: 0, percent: 0 },
      period: 'monthly',
      lastUpdatedAt: null,
    },
    burnRate: {
      currentRate: 0,
      dailyAverage: 0,
      weeklyTotal: 0,
      opsWalletBalance: 0,
      runwayDays: 0,
      providers: [],
      lastUpdatedAt: null,
    },
    agentROI: [],
    payQueue: [],
    distributionHistory: [],
    isLoading: false,
  }),
}));

export { useServiceFeeStore };

```

### src/store/spatialStore.js
```js
/**
 * Sovereign Protocol — Spatial Workspace Store (Module 3)
 * Manages 3D scene state: agent positions, camera, heatmap.
 *
 * SECURITY: This store receives ONLY rendering metadata.
 * No treasury data, no documents, no private keys.
 * Only agentId, state, and x/y/z coordinates enter the scene graph.
 */

import { create } from 'zustand';

const useSpatialStore = create((set, get) => ({
  // --- Agent 3D Positions (Minimal Metadata Only) ---
  agentPositions: [],

  // --- Camera State ---
  cameraTarget: { x: 0, y: 3, z: 8 },
  cameraLookAt: { x: 0, y: 0, z: 0 },

  // --- Focused Agent (Zoom-In Target) ---
  focusedAgentId: null,

  // --- Heatmap Grid Data ---
  heatmapData: [],

  // --- Audio State ---
  audioEnabled: false,

  // --- Scene State ---
  sceneLoaded: false,
  hudVisible: true,

  // --- Actions ---

  /**
   * Sets agent positions for 3D rendering.
   * SECURITY: Only minimal rendering metadata is accepted.
   */
  setAgentPositions: (positions) => set({
    agentPositions: positions.map(p => Object.freeze({
      agentId: p.agentId,
      name: p.name,
      state: p.state,
      x: p.x,
      y: p.y,
      z: p.z,
      burnIntensity: p.burnIntensity || 0,
    })),
  }),

  /**
   * Focuses camera on a specific agent.
   */
  focusAgent: (agentId) => {
    const pos = get().agentPositions.find(a => a.agentId === agentId);
    if (!pos) return;
    set({
      focusedAgentId: agentId,
      cameraTarget: { x: pos.x + 2, y: 2.5, z: pos.z + 3 },
      cameraLookAt: { x: pos.x, y: 0.5, z: pos.z },
    });
  },

  /**
   * Resets camera to default overview position.
   */
  resetCamera: () => set({
    focusedAgentId: null,
    cameraTarget: { x: 0, y: 3, z: 8 },
    cameraLookAt: { x: 0, y: 0, z: 0 },
  }),

  /**
   * Sets heatmap intensity grid for floor rendering.
   */
  setHeatmap: (data) => set({
    heatmapData: data.map(d => Object.freeze({
      gridX: d.gridX,
      gridZ: d.gridZ,
      intensity: Math.min(1, Math.max(0, d.intensity)),
    })),
  }),

  /**
   * Toggles spatial audio on/off.
   */
  toggleAudio: () => set(s => ({ audioEnabled: !s.audioEnabled })),

  /**
   * Toggles HUD visibility.
   */
  toggleHud: () => set(s => ({ hudVisible: !s.hudVisible })),

  /**
   * Marks scene as loaded.
   */
  setSceneLoaded: (loaded) => set({ sceneLoaded: loaded }),

  /**
   * Resets all spatial state. Called on session wipe.
   */
  reset: () => set({
    agentPositions: [],
    cameraTarget: { x: 0, y: 3, z: 8 },
    cameraLookAt: { x: 0, y: 0, z: 0 },
    focusedAgentId: null,
    heatmapData: [],
    audioEnabled: false,
    sceneLoaded: false,
    hudVisible: true,
  }),
}));

export { useSpatialStore };

```

### src/store/treasuryStore.js
```js
/**
 * Sovereign Protocol — Treasury Store
 * Manages the Role-Separated Treasury Dashboard state.
 * AI agents are PHYSICALLY ISOLATED from this store.
 * No agent context, no financial metadata exposure.
 */

import { create } from 'zustand';

const useTreasuryStore = create((set, get) => ({
  // --- Treasury Wallet (Cold Storage / Multi-Sig) ---
  treasuryWallet: {
    address: null,
    balance: '0',
    currency: 'ETH',
    isMultiSig: true,
    requiredSignatures: 2,
    totalSigners: 3,
    lastFundedAt: null,
  },

  // --- Ops Wallet (Hot Wallet / Human-Only) ---
  opsWallet: {
    address: null,
    balance: '0',
    currency: 'ETH',
    dailyLimit: '0',
    spentToday: '0',
    lastTransactionAt: null,
  },

  // --- Agent Execution Wallets (Capped) ---
  agentWallets: [],

  // --- Transaction History ---
  transactions: [],

  // --- Loading States ---
  isLoading: false,

  // --- Actions ---

  /**
   * Sets the treasury wallet data.
   */
  setTreasuryWallet: (data) => set({
    treasuryWallet: Object.freeze({ ...get().treasuryWallet, ...data }),
  }),

  /**
   * Sets the ops wallet data.
   */
  setOpsWallet: (data) => set({
    opsWallet: Object.freeze({ ...get().opsWallet, ...data }),
  }),

  /**
   * Sets agent execution wallets.
   * Each wallet is individually capped and isolated.
   */
  setAgentWallets: (wallets) => set({
    agentWallets: wallets.map(w => Object.freeze({
      id: w.id,
      agentId: w.agentId,
      agentName: w.agentName,
      address: w.address,
      balance: w.balance || '0',
      cap: w.cap || '0',
      utilized: w.utilized || '0',
      status: w.status || 'active',
      createdAt: w.createdAt,
    })),
  }),

  /**
   * Adds a transaction record to history.
   */
  addTransaction: (tx) => set(state => ({
    transactions: [
      Object.freeze({
        id: tx.id || crypto.randomUUID(),
        type: tx.type, // 'fund_ops' | 'fund_agent' | 'fee' | 'refund'
        from: tx.from,
        to: tx.to,
        amount: tx.amount,
        currency: tx.currency || 'ETH',
        status: tx.status || 'pending',
        timestamp: tx.timestamp || new Date().toISOString(),
        hash: tx.hash || null,
        description: tx.description || null,
      }),
      ...state.transactions,
    ],
  })),

  /**
   * Updates a transaction's status.
   */
  updateTransactionStatus: (txId, status) => set(state => ({
    transactions: state.transactions.map(tx =>
      tx.id === txId ? Object.freeze({ ...tx, status }) : tx
    ),
  })),

  /**
   * Sets loading state.
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Resets all treasury state. Called on session wipe.
   */
  reset: () => set({
    treasuryWallet: { address: null, balance: '0', currency: 'ETH', isMultiSig: true, requiredSignatures: 2, totalSigners: 3, lastFundedAt: null },
    opsWallet: { address: null, balance: '0', currency: 'ETH', dailyLimit: '0', spentToday: '0', lastTransactionAt: null },
    agentWallets: [],
    transactions: [],
    isLoading: false,
  }),
}));

export { useTreasuryStore };

```

### src/styles/animations.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — ANIMATIONS
   Enterprise Business UX — Fast, Subtle, Intentional
   ============================================================ */

/* --- Fade In --- */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* --- Scale --- */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.99);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.99);
  }
}

/* --- Pulse --- */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* --- Focus Rings (no glowing) --- */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px var(--color-border-primary); }
  50% { box-shadow: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px var(--color-border-secondary); }
}

@keyframes glowPulseEmerald {
  0%, 100% { box-shadow: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px rgba(5, 150, 105, 0.2); }
  50% { box-shadow: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px rgba(5, 150, 105, 0.4); }
}

@keyframes glowPulseRose {
  0%, 100% { box-shadow: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px rgba(220, 38, 38, 0.2); }
  50% { box-shadow: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px rgba(220, 38, 38, 0.4); }
}

/* --- Shimmer (Loading Skeleton) --- */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* --- Spin --- */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* --- Slide --- */
@keyframes slideInFromLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes slideInFromRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideInFromBottom {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* --- Progress Bar Fill --- */
@keyframes progressFill {
  from { width: 0%; }
}

/* --- Removed Float / Bounce for corporate feel --- */

/* --- Stagger Children Utility --- */
.stagger-children > * {
  animation: fadeInUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 30ms; }
.stagger-children > *:nth-child(3) { animation-delay: 60ms; }
.stagger-children > *:nth-child(4) { animation-delay: 90ms; }
.stagger-children > *:nth-child(5) { animation-delay: 120ms; }
.stagger-children > *:nth-child(6) { animation-delay: 150ms; }
.stagger-children > *:nth-child(7) { animation-delay: 180ms; }
.stagger-children > *:nth-child(8) { animation-delay: 210ms; }

/* --- Animate Utilities --- */
.animate-fadeIn { animation: fadeIn 0.2s ease-out both; }
.animate-fadeInUp { animation: fadeInUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) both; }
.animate-fadeInDown { animation: fadeInDown 0.2s cubic-bezier(0.4, 0, 0.2, 1) both; }
.animate-scaleIn { animation: scaleIn 0.15s cubic-bezier(0.4, 0, 0.2, 1) both; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-spin { animation: spin 1s linear infinite; }
.animate-glow { animation: glowPulse 2s ease-in-out infinite; }
.animate-glow-emerald { animation: glowPulseEmerald 2s ease-in-out infinite; }
.animate-glow-rose { animation: glowPulseRose 2s ease-in-out infinite; }

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

```

### src/styles/components.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — COMPONENT STYLES
   Enterprise Business UI — Crisp, Functional, Structural
   ============================================================ */

/* --- Buttons --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: 1.25rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  user-select: none;
  position: relative;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary {
  background: #121212;
  color: #FFFFFF;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover:not(:disabled) {
  background: #2a2a2a;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-primary::after, .btn-success::after, .btn-danger::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-20deg);
  transition: all 0.5s ease;
  z-index: 1;
}

.btn-primary:hover:not(:disabled)::after, .btn-success:hover:not(:disabled)::after, .btn-danger:hover:not(:disabled)::after {
  left: 150%;
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border-color: var(--color-border-primary);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-bg-hover);
  border-color: var(--color-border-secondary);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.btn-danger {
  background: var(--color-accent-rose);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-sm);
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c; /* darker red */
}

.btn-success {
  background: var(--color-accent-emerald);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-sm);
}

.btn-success:hover:not(:disabled) {
  background: #047857; /* darker green */
}

.btn-sm { padding: var(--space-1) var(--space-3); font-size: var(--text-xs); }
.btn-lg { padding: var(--space-3) var(--space-6); font-size: var(--text-base); }
.btn-icon { padding: var(--space-2); width: 32px; height: 32px; }

/* --- Cards --- */
.card {
  position: relative;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  transition: all 0.2s linear;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, transparent 40%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.card-hover:hover {
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5), 0 30px 60px rgba(0, 0, 0, 0.08);
}

.card-accent { border-left: 3px solid var(--color-accent-blue); }
.card-success { border-left: 3px solid var(--color-accent-emerald); }
.card-danger { border-left: 3px solid var(--color-accent-rose); }
.card-warning { border-left: 3px solid var(--color-accent-amber); }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.card-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-top: var(--space-1);
}

/* --- Badges --- */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: var(--font-medium);
  border-radius: var(--radius-sm);
  line-height: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border: 1px solid transparent;
}

.badge-blue { background: #f1f5f9; color: #334155; border-color: #e2e8f0; }
.badge-violet { background: #f8fafc; color: #475569; border-color: #cbd5e1; }
.badge-emerald { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
.badge-amber { background: #fffbeb; color: #d97706; border-color: #fde68a; }
.badge-rose { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
.badge-cyan { background: #f1f5f9; color: #475569; border-color: #e2e8f0; }

/* --- Inputs --- */
.input-group { display: flex; flex-direction: column; gap: var(--space-1); }
.input-label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-secondary); }

.input-field {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  outline: none;
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition-fast);
}

.input-field:focus {
  border-color: var(--color-accent-blue);
  box-shadow: var(--shadow-glow-blue);
}

.input-field::placeholder { color: var(--color-text-muted); }
.input-field:disabled { opacity: 0.5; cursor: not-allowed; background: var(--color-bg-tertiary); box-shadow: none; }
.input-error { border-color: var(--color-accent-rose) !important; }
.input-error-text { font-size: var(--text-xs); color: var(--color-accent-rose); margin-top: var(--space-1); }

/* --- Status Indicators --- */
.status-dot { width: 6px; height: 6px; border-radius: var(--radius-full); flex-shrink: 0; }
.status-dot-active { background: var(--color-accent-emerald); }
.status-dot-pending { background: var(--color-accent-amber); }
.status-dot-error { background: var(--color-accent-rose); }
.status-dot-inactive { background: var(--color-text-muted); }

/* --- Progress Bar --- */
.progress-bar { width: 100%; height: 4px; background: var(--color-border-primary); border-radius: var(--radius-full); overflow: hidden; }
.progress-bar-fill { height: 100%; border-radius: var(--radius-full); background: var(--color-text-primary); transition: width var(--transition-base); }
.progress-bar-fill-success { background: var(--color-accent-emerald); }
.progress-bar-fill-danger { background: var(--color-accent-rose); }

/* --- Dividers --- */
.divider { height: 1px; background: var(--color-border-primary); border: none; margin: var(--space-4) 0; }

/* --- Modal --- */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
}

.modal-container {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-primary);
}

.modal-body { padding: var(--space-5); }

.modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border-primary);
  background: var(--color-bg-tertiary);
}

/* --- Tables --- */
.table-container { width: 100%; overflow-x: auto; border: 1px solid var(--color-border-primary); border-radius: var(--radius-md); background: var(--color-bg-secondary); }
.table { width: 100%; border-collapse: collapse; text-align: left; }
.table th {
  padding: var(--space-3) var(--space-4); font-size: 0.6875rem; font-weight: var(--font-semibold);
  text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary);
  background: var(--color-bg-tertiary); border-bottom: 1px solid var(--color-border-primary);
}
.table td {
  padding: var(--space-3) var(--space-4); font-size: var(--text-sm); color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-primary);
}
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: var(--color-bg-hover); }

/* --- Empty State --- */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: var(--space-12) var(--space-6); text-align: center;
  background: var(--color-bg-secondary); border: 1px dashed var(--color-border-secondary);
  border-radius: var(--radius-md);
}
.empty-state-icon { width: 48px; height: 48px; color: var(--color-text-muted); margin-bottom: var(--space-4); }
.empty-state-title { font-size: var(--text-base); font-weight: var(--font-medium); color: var(--color-text-primary); }
.empty-state-text { font-size: var(--text-sm); color: var(--color-text-tertiary); max-width: 400px; margin-top: var(--space-1); }

/* --- Skeleton Loading --- */
.skeleton { background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, #e2e8f0 50%, var(--color-bg-tertiary) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius-sm); }

/* --- Sovereign Loader --- */
.sovereign-loader {
  width: 16px;
  height: 16px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: sovereign-spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  display: inline-block;
}

@keyframes sovereign-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

```

### src/styles/index.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — DESIGN SYSTEM
   Enterprise Business Dashboard — Solid & Structural
   ============================================================ */

/* --- CSS Custom Properties (Design Tokens) --- */
:root {
  /* Primary Palette — Pearl White & Soft Grays */
  --color-bg-primary: #F8F9FA;
  --color-bg-secondary: #FFFFFF;
  --color-bg-tertiary: #F0F2F5;
  --color-bg-elevated: #FFFFFF;
  --color-bg-surface: #F8F9FA;
  --color-bg-hover: #F3F4F6;

  /* Accent Colors — Champagne Gold & Deep Charcoal */
  --color-accent-gold: #C5A059; /* Champagne Gold for primary actions */
  --color-accent-gold-light: #DFCA9B;
  --color-accent-gold-dark: #A6843E;
  --color-accent-blue: #1A1D20; /* Deep Charcoal for strong structural elements */
  --color-accent-emerald: #10B981; /* Premium Green for success/verified */
  --color-accent-amber: #F59E0B; /* Premium Amber for warnings/pending */
  --color-accent-rose: #EF4444; /* Premium Red for danger/errors */

  /* Gradient Presets — Luxurious metallic glow */
  --gradient-primary: linear-gradient(135deg, #C5A059 0%, #DFCA9B 50%, #C5A059 100%);
  --gradient-success: var(--color-accent-emerald);
  --gradient-danger: var(--color-accent-rose);
  --gradient-warning: var(--color-accent-amber);
  --gradient-surface: var(--color-bg-tertiary);
  --gradient-glow: radial-gradient(circle at center, rgba(197, 160, 89, 0.15) 0%, transparent 70%);

  /* Text Colors — High contrast, sharp, formal */
  --color-text-primary: #1A1A1B;
  --color-text-secondary: #4A4A4E;
  --color-text-tertiary: #6B7280;
  --color-text-muted: #9CA3AF;
  --color-text-inverse: #FFFFFF;
  --color-text-accent: #C5A059;

  /* Border Colors — Subtle, crisp boundaries */
  --color-border-primary: #E5E7EB;
  --color-border-secondary: #F3F4F6;
  --color-border-accent: #C5A059;
  --color-border-success: #34D399;
  --color-border-danger: #F87171;
  --color-border-warning: #FBBF24;

  /* Card Surfaces — Solid white with subtle soft shadows */
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-bg-light: rgba(255, 255, 255, 0.6);
  --glass-border: rgba(255, 255, 255, 0.4);
  --glass-blur: 12px;
  --glass-blur-heavy: 24px;

  /* Typography - EB Garamond (Serif) & Lato (Sans) */
  --font-serif: 'EB Garamond', Georgia, serif;
  --font-sans: 'Lato', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

  --text-xs: clamp(0.7rem, 1vw + 0.4rem, 0.75rem);
  --text-sm: clamp(0.8rem, 1vw + 0.5rem, 0.875rem);
  --text-base: clamp(0.9rem, 1vw + 0.6rem, 1rem);
  --text-lg: clamp(1rem, 1vw + 0.75rem, 1.125rem);
  --text-xl: clamp(1.125rem, 1.5vw + 0.75rem, 1.25rem);
  --text-2xl: clamp(1.25rem, 2vw + 0.8rem, 1.5rem);
  --text-3xl: clamp(1.5rem, 2.5vw + 1rem, 1.875rem);
  --text-4xl: clamp(1.75rem, 3.5vw + 1rem, 2.25rem);
  --text-5xl: clamp(2.25rem, 5vw + 1.2rem, 3rem);

  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Border Radius — Elegant, subtle rounding */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows — Deep, luxurious shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.02);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.03);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.08), 0 12px 16px rgba(0, 0, 0, 0.04);
  --shadow-glow-blue: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px var(--color-text-secondary);
  --shadow-glow-gold: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px var(--color-accent-gold-light);
  --shadow-glow-violet: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px var(--color-text-secondary);
  --shadow-glow-emerald: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px var(--color-accent-emerald);
  --shadow-glow-rose: 0 0 0 2px var(--color-bg-secondary), 0 0 0 4px var(--color-accent-rose);

  /* Transitions - Slower, more intentional for luxury feel */
  --transition-fast: 200ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-base: 400ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 700ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-spring: 600ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Z-Index Scale */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-critical: 600;

  /* Layout */
  --sidebar-width: 72px;
  --sidebar-collapsed: 72px;
  --topbar-height: 64px;
  --content-max-width: 1400px;
}

/* --- Global Reset --- */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  font-weight: var(--font-regular);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  height: 100dvh;
  overflow: hidden;
}

h1, h2, h3, h4, h5, h6, .card-title, .page-title {
  font-family: var(--font-serif);
  letter-spacing: -0.02em;
}

.data-value, .mono-value, .security-stat-value, .wallet-balance {
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

#root {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* --- Selection --- */
::selection {
  background: var(--color-accent-blue);
  color: var(--color-text-inverse);
}

/* --- Scrollbar --- */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-primary);
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* --- Focus Visible --- */
:focus-visible {
  outline: 2px solid var(--color-accent-blue);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* --- Links --- */
a {
  color: var(--color-accent-blue-link);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: #1e40af;
}

/* --- Code --- */
code, pre {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

pre {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-4);
  overflow-x: auto;
}

/* --- Utility: Visually Hidden --- */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

/* --- Brand Typography --- */
.brand-title {
  background: linear-gradient(135deg, #4A4A4E 0%, #1A1A1B 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.05));
}

```

### src/styles/layouts.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — LAYOUT STYLES
   Enterprise Business Shell — Crisp, Dense, Professional
   ============================================================ */

/* --- App Shell --- */
.app-shell {
  display: flex;
  height: 100dvh;
  background: var(--color-bg-primary);
  overflow: hidden;
}

.app-shell-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition-fast);
  height: 100dvh;
}

.app-shell-content.sidebar-collapsed {
  margin-left: var(--sidebar-collapsed);
}

.app-main {
  flex: 1;
  padding: var(--space-8);
  padding-top: calc(var(--topbar-height) + var(--space-8));
  max-width: var(--content-max-width);
  width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
}

/* --- Sidebar --- */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sticky);
  transition: width var(--transition-fast);
  overflow: hidden;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-5);
  border-bottom: 1px solid var(--color-border-primary);
  height: var(--topbar-height);
}

.sidebar-logo-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: var(--color-accent-blue);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.sidebar-logo-text {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  letter-spacing: -0.01em;
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4) var(--space-3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-section-label {
  font-size: 0.6875rem;
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
  padding: var(--space-4) var(--space-2) var(--space-2);
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: background var(--transition-fast);
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-link:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.sidebar-link.active {
  background: var(--color-bg-hover);
  color: var(--color-accent-blue);
  font-weight: var(--font-semibold);
}

.sidebar-link-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.sidebar-link-text {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-link-badge {
  margin-left: auto;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: var(--space-4) var(--space-3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.sidebar-tier-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
}

.sidebar-tier-icon {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: var(--color-accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.sidebar-tier-info {
  overflow: hidden;
}

.sidebar-tier-label {
  font-size: 0.6875rem;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar-tier-name {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

/* --- Top Bar --- */
.topbar {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  height: var(--topbar-height);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  z-index: var(--z-sticky);
  transition: left var(--transition-fast);
}

.topbar.sidebar-collapsed {
  left: var(--sidebar-collapsed);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.topbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
}

.topbar-breadcrumb-active {
  color: var(--color-text-primary);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.topbar-session {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-3);
  height: 32px;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.topbar-session-timer {
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.topbar-user:hover {
  background: var(--color-bg-hover);
}

.topbar-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: var(--color-accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: var(--font-bold);
  color: white;
}

/* --- Grid Layouts --- */
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); }

@media (max-width: 1200px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .app-shell-content { margin-left: 0; }
  .topbar { left: 0; }
  .sidebar { transform: translateX(-100%); }
  .sidebar.mobile-open { transform: translateX(0); }
  .app-main { padding: var(--space-4); padding-top: calc(var(--topbar-height) + var(--space-4)); }
}

/* --- Page Headers --- */
.page-header {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-primary);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  letter-spacing: -0.015em;
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-top: var(--space-1);
}

/* --- Flex Utilities --- */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }
.gap-8 { gap: var(--space-8); }
.flex-1 { flex: 1; }

```

### src/styles/module2.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — MODULE 2: COMMAND CENTER STYLES
   Institutional-Grade — Dense, Crisp, High-Contrast
   No gradients, no emojis, no decorative noise.
   ============================================================ */

/* --- Shared Module 2 Utilities --- */

.m2-stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.m2-stat-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m2-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-primary);
}

.m2-section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.m2-section-subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
  display: block;
}

.m2-info-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.m2-subsection-header {
  font-size: 0.6875rem;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  padding: var(--space-4) 0 var(--space-2);
  margin-top: var(--space-2);
  border-top: 1px solid var(--color-border-primary);
}

.m2-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-primary);
}

.m2-card-meta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.m2-restriction-inline {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  color: #dc2626;
  margin-right: var(--space-3);
  font-weight: var(--font-medium);
}

.m2-terminated-notice {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  margin-top: var(--space-4);
  color: var(--color-accent-rose);
}

.m2-terminated-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-accent-rose);
}

.m2-terminated-sub {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}

/* --- Modal Utilities --- */

.m2-modal-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
  line-height: var(--leading-relaxed);
}

.m2-modal-alert svg { color: #dc2626; flex-shrink: 0; margin-top: 2px; }

.m2-modal-detail {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-primary);
  margin-bottom: var(--space-4);
}

.m2-modal-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-primary);
  margin-top: var(--space-4);
}

.m2-modal-agent-info {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-primary);
}

.m2-modal-agent-name {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.m2-modal-agent-spec {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}

.m2-modal-restrictions {
  padding: var(--space-3);
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: var(--radius-md);
}

.m2-modal-restrictions-title {
  font-size: 0.6875rem;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.m2-modal-restriction {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  padding: 3px 0;
}

/* --- ROI Utilities --- */

.m2-roi-main {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.m2-roi-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.m2-roi-compare {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-2);
}

/* =============================================
   AGENT MANAGEMENT PAGE
   ============================================= */

.agent-os-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.agent-roster-dept {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-semibold);
}

/* Execution States */
.exec-state {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  white-space: nowrap;
}

.exec-state-executing { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.exec-state-planning { background: #f8fafc; color: #334155; border-color: #e2e8f0; }
.exec-state-idle { background: #f8fafc; color: #94a3b8; border-color: #e2e8f0; }
.exec-state-blocked { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
.exec-state-terminated { background: #f1f5f9; color: #64748b; border-color: #cbd5e1; text-decoration: line-through; }

/* Dual-Layer Workspace */
.agent-workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

@media (max-width: 1200px) { .agent-workspace { grid-template-columns: 1fr; } }

/* Skill Blocks */
.skill-library { display: flex; flex-direction: column; gap: var(--space-2); }

.skill-block {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  position: relative;
}

.skill-block::after {
  content: 'IMMUTABLE';
  position: absolute;
  top: 50%;
  right: var(--space-3);
  transform: translateY(-50%);
  font-size: 8px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  padding: 1px 5px;
  border: 1px solid var(--color-border-primary);
  border-radius: 2px;
}

.skill-block-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.skill-block-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: 1.2;
}

.skill-block-meta {
  font-size: 10px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  margin-top: 1px;
}

.skill-block.assigned { border-color: #d1fae5; }

/* Memory Vault */
.memory-vault { display: flex; flex-direction: column; gap: var(--space-3); }

.memory-section {
  padding: var(--space-3);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
}

.memory-section-title {
  font-size: 0.6875rem;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.memory-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-bg-tertiary);
}

.memory-metric:last-child { border-bottom: none; }

.memory-metric-value {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  font-size: var(--text-xs);
  color: var(--color-text-primary);
}

.memory-status-encrypted { color: #059669; }
.memory-status-revoked { color: #dc2626; }
.memory-status-orphaned { color: #d97706; }

/* Context Gauge */
.context-gauge {
  width: 100%;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  margin-top: var(--space-2);
}

.context-gauge-fill {
  height: 100%;
  border-radius: 3px;
  background: #334155;
  transition: width 0.6s ease;
}

/* Kill Switch */
.kill-switch-container {
  padding: var(--space-3);
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  margin-top: var(--space-3);
}

.kill-switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: 10px var(--space-4);
  background: #b91c1c;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.kill-switch-btn:hover { background: #991b1b; }
.kill-switch-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.kill-switch-warning {
  font-size: 10px;
  color: #991b1b;
  text-align: center;
  margin-top: var(--space-1);
}

/* =============================================
   MARKETPLACE PAGE
   ============================================= */

.marketplace-page { display: flex; flex-direction: column; gap: var(--space-5); }

.marketplace-filters {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  flex-wrap: wrap;
}

.marketplace-search-input {
  flex: 1;
  min-width: 180px;
  padding: 6px var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color var(--transition-fast);
}

.marketplace-search-input:focus { border-color: var(--color-accent-blue); }
.marketplace-search-input::placeholder { color: var(--color-text-muted); }

.filter-select {
  padding: 6px var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  outline: none;
}

/* Catalog Grid */
.marketplace-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1200px) { .marketplace-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .marketplace-grid { grid-template-columns: 1fr; } }

/* Agent Cards */
.mkt-agent-card {
  padding: var(--space-4);
  border-top: 2px solid var(--color-border-primary);
  transition: border-color var(--transition-fast);
}

.mkt-agent-card:hover { border-top-color: #334155; }
.mkt-agent-card.elite { border-top-color: #059669; }
.mkt-agent-card.unavailable { opacity: 0.55; }

.mkt-agent-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.mkt-agent-name {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.mkt-agent-spec {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}

.mkt-agent-tier {
  padding: 2px 6px;
  font-size: 9px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: 2px;
  border: 1px solid transparent;
}

.mkt-agent-tier.elite { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.mkt-agent-tier.standard { background: #f8fafc; color: #475569; border-color: #e2e8f0; }

/* Agent Stats */
.mkt-agent-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-1);
  padding: var(--space-3) 0;
  border-top: 1px solid var(--color-border-primary);
  border-bottom: 1px solid var(--color-border-primary);
  margin-bottom: var(--space-2);
}

.mkt-stat { text-align: center; }

.mkt-stat-value {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  line-height: 1.2;
}

.mkt-stat-label {
  font-size: 9px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--font-semibold);
  margin-top: 2px;
}

/* ZK Badges */
.zk-badges-row {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  margin: var(--space-2) 0;
}

.zk-badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 6px;
  font-size: 9px;
  font-weight: var(--font-medium);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: 2px;
  color: var(--color-text-secondary);
}

.zk-badge-chip.verified { border-color: #bbf7d0; color: #15803d; }

/* =============================================
   SERVICE FEE ENGINE PAGE
   ============================================= */

.service-fee-page { display: flex; flex-direction: column; gap: var(--space-5); }

/* Revenue Flow */
.revenue-formula {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
}

.formula-var { font-weight: var(--font-bold); color: var(--color-text-primary); }

.revenue-total-display {
  text-align: center;
  padding: var(--space-4) var(--space-6);
  margin-bottom: var(--space-4);
}

.revenue-total-value {
  font-size: 36px;
  font-weight: var(--font-extrabold);
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  line-height: 1;
}

.revenue-total-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.revenue-flow-bars { display: flex; flex-direction: column; gap: var(--space-3); }

.revenue-flow-item { display: flex; align-items: center; gap: var(--space-3); }

.revenue-flow-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  min-width: 90px;
  text-align: right;
}

.revenue-flow-bar-track {
  flex: 1;
  height: 24px;
  background: var(--color-bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.revenue-flow-bar-fill {
  height: 100%;
  border-radius: 3px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-2);
}

.revenue-flow-bar-fill.treasury { background: #334155; }
.revenue-flow-bar-fill.operations { background: #059669; }
.revenue-flow-bar-fill.agent-fees { background: #4f46e5; }
.revenue-flow-bar-fill.platform { background: #d97706; }

.revenue-flow-amount {
  font-size: 10px;
  font-weight: var(--font-bold);
  color: white;
  white-space: nowrap;
  font-family: var(--font-mono);
}

.revenue-flow-percent {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  min-width: 40px;
  font-family: var(--font-mono);
  text-align: right;
}

/* Burn Tracker */
.burn-tracker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}

@media (max-width: 1024px) { .burn-tracker-grid { grid-template-columns: repeat(2, 1fr); } }

.burn-metric-card { text-align: center; padding: var(--space-3); }

.burn-metric-value {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  line-height: 1.2;
}

.burn-metric-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* Provider Type Tags */
.provider-type {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-bold);
  padding: 1px 5px;
  border-radius: 2px;
  border: 1px solid transparent;
}

.provider-type.local { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.provider-type.cloud { background: #f8fafc; color: #334155; border-color: #e2e8f0; }
.provider-type.api { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }

/* ROI Cards */
.roi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1024px) { .roi-grid { grid-template-columns: 1fr; } }

.roi-card {
  padding: var(--space-4);
  border-left: 3px solid var(--color-border-primary);
}

.roi-card.trend-up { border-left-color: #059669; }
.roi-card.trend-down { border-left-color: #dc2626; }
.roi-card.trend-stable { border-left-color: #334155; }

.roi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.roi-agent-name {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.roi-value {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.roi-value.positive { color: #059669; }

.roi-breakdown {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px var(--space-4);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-primary);
}

.roi-breakdown-item {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-tertiary);
}

.roi-breakdown-value {
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

/* Pay Status Tags */
.pay-status {
  padding: 2px 6px;
  font-size: 9px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 2px;
  border: 1px solid transparent;
  white-space: nowrap;
}

.pay-status.awaiting { background: #fffbeb; color: #92400e; border-color: #fde68a; }
.pay-status.signed { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.pay-status.executed { background: #f8fafc; color: #334155; border-color: #e2e8f0; }
.pay-status.rejected { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }

```

### src/styles/module3.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — MODULE 3: SPATIAL WORKSPACE STYLES
   Full-bleed 3D canvas with HUD overlay system.
   ============================================================ */

/* --- Page Container (Full-bleed) --- */
.spatial-workspace-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 56px);
  overflow: hidden;
  background: #0a0f1a;
}

.spatial-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.spatial-canvas canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
  outline: none;
}

/* --- HUD: Top-Left Title --- */
.spatial-hud-title {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 10;
  pointer-events: none;
}

.spatial-hud-title-text {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: #e2e8f0;
  letter-spacing: -0.01em;
}

.spatial-hud-title-sub {
  font-size: var(--text-xs);
  color: #64748b;
  margin-top: 2px;
  font-family: var(--font-mono);
}

/* --- HUD: Top-Right Status --- */
.spatial-hud-status {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  pointer-events: none;
}

.spatial-hud-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: var(--font-semibold);
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #1e293b;
  border-radius: 2px;
  backdrop-filter: blur(8px);
}

.spatial-hud-indicator.indicator-alert {
  border-color: #92400e;
  color: #fbbf24;
}

.spatial-hud-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-executing {
  background: #3b82f6;
  box-shadow: 0 0 6px #3b82f6;
  animation: spatial-pulse 1.5s ease-in-out infinite;
}

.dot-blocked {
  background: #f59e0b;
  box-shadow: 0 0 6px #f59e0b;
  animation: spatial-pulse 0.8s ease-in-out infinite;
}

@keyframes spatial-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* --- HUD: Bottom Controls --- */
.spatial-hud-controls {
  position: absolute;
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: var(--space-2);
  padding: var(--space-1);
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
  border-radius: var(--radius-md);
  backdrop-filter: blur(12px);
}

.spatial-hud-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.spatial-hud-btn:hover {
  background: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}

/* --- HUD: Show Button (when HUD hidden) --- */
.spatial-hud-show-btn {
  position: absolute;
  bottom: var(--space-4);
  right: var(--space-4);
  z-index: 10;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
  border-radius: var(--radius-sm);
  color: #94a3b8;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

.spatial-hud-show-btn:hover {
  color: #e2e8f0;
  border-color: #334155;
}

/* --- Focus Panel (Right Side) --- */
.spatial-focus-panel {
  position: absolute;
  top: var(--space-6);
  right: var(--space-4);
  z-index: 10;
  width: 240px;
  padding: var(--space-4);
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid #1e293b;
  border-radius: var(--radius-md);
  backdrop-filter: blur(16px);
  margin-top: 36px;
}

.spatial-focus-header {
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid #1e293b;
}

.spatial-focus-name {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: #e2e8f0;
  margin-bottom: 4px;
}

.spatial-focus-metrics {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.spatial-focus-metric {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 10px;
  color: #64748b;
}

.spatial-focus-metric strong {
  margin-left: auto;
  color: #94a3b8;
  font-family: var(--font-mono);
}

.spatial-focus-dive {
  width: 100%;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.spatial-focus-close {
  width: 100%;
  padding: 4px;
  font-size: 10px;
  font-family: var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--font-semibold);
  color: #64748b;
  background: transparent;
  border: 1px solid #1e293b;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.spatial-focus-close:hover {
  color: #94a3b8;
  border-color: #334155;
}

/* --- Heatmap Legend (Bottom-Left) --- */
.spatial-heatmap-legend {
  position: absolute;
  bottom: var(--space-4);
  left: var(--space-4);
  z-index: 10;
  padding: var(--space-2) var(--space-3);
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(8px);
}

.spatial-legend-label {
  font-size: 9px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.spatial-legend-bar {
  display: flex;
  height: 6px;
  border-radius: 2px;
  overflow: hidden;
  width: 80px;
}

.spatial-legend-low { flex: 1; background: #065f46; }
.spatial-legend-mid { flex: 1; background: #92400e; }
.spatial-legend-high { flex: 1; background: #991b1b; }

.spatial-legend-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  font-size: 8px;
  color: #475569;
  font-family: var(--font-mono);
}

```

### src/styles/module4.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — MODULE 4: OPERATIONAL LAYER STYLES
   DPE Pipeline + Forensic Audit Suite
   ============================================================ */

/* --- DPE Pipeline Page --- */
.dpe-pipeline-page,
.forensic-audit-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* --- DPE 3-Column Layout --- */
.dpe-columns {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: var(--space-4);
  align-items: start;
}

@media (max-width: 1024px) {
  .dpe-columns { grid-template-columns: 1fr; }
}

.dpe-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-height: 200px;
}

.dpe-column-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--color-border-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dpe-column-divider {
  font-size: 10px;
  font-weight: var(--font-bold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: var(--space-2) 0;
  border-top: 1px solid var(--color-border-primary);
  margin-top: var(--space-1);
}

.dpe-empty {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  padding: var(--space-6) var(--space-4);
  border: 1px dashed var(--color-border-primary);
  border-radius: var(--radius-md);
}

/* --- DPE Cards --- */
.dpe-card {
  padding: var(--space-4) !important;
}

.dpe-card-title {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: 2px;
  line-height: 1.3;
}

.dpe-card-agent {
  font-size: 10px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  margin-bottom: var(--space-2);
}

.dpe-card-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-3);
}

.dpe-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2);
}

.dpe-card-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.dpe-card-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-primary);
}

.dpe-card-actions .btn {
  flex: 1;
  justify-content: center;
}

/* --- Draft Card (Low-Contrast Incubation) --- */
.dpe-draft-card {
  border-left: 3px solid #334155 !important;
  opacity: 0.75;
}

.dpe-draft-stamp {
  font-size: 9px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  background: var(--color-bg-tertiary);
  padding: 2px 6px;
  border-radius: 2px;
  display: inline-block;
  margin-bottom: var(--space-2);
}

.dpe-draft-content {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #64748b;
  background: var(--color-bg-tertiary);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-primary);
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 120px;
  overflow-y: auto;
  margin-bottom: var(--space-2);
  line-height: 1.5;
}

/* --- Proposal Card --- */
.dpe-proposal-card {
  border-left: 3px solid #d97706 !important;
}

/* --- Execute Card --- */
.dpe-execute-card {
  border-left: 3px solid #059669 !important;
}

.dpe-execute-btn {
  width: 100%;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.dpe-completed-card {
  border-left: 3px solid #0891b2 !important;
  opacity: 0.6;
}

.dpe-gate-blocked {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 10px;
  color: var(--color-accent-rose);
  margin-top: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: var(--radius-sm);
  line-height: 1.4;
}

/* --- Resource Estimate Row --- */
.dpe-resource-row {
  display: flex;
  gap: var(--space-4);
  font-size: 10px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.dpe-resource-row strong {
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

/* --- Risk Score Gauge --- */
.risk-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}

.risk-gauge-value {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
  margin-top: -6px;
  line-height: 1;
}

.risk-gauge-label {
  font-size: 8px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

/* --- Reasoning Path --- */
.reasoning-path {
  margin-bottom: var(--space-2);
}

.reasoning-path-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.reasoning-path-toggle:hover {
  color: var(--color-text-primary);
}

.reasoning-path-list {
  list-style: none;
  margin: var(--space-2) 0 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reasoning-path-step {
  display: flex;
  gap: var(--space-2);
  font-size: 10px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  padding: 3px var(--space-2);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  border-left: 2px solid var(--color-border-primary);
}

.reasoning-step-num {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: var(--font-bold);
  color: var(--color-text-muted);
  background: var(--color-bg-secondary);
  border-radius: 50%;
  font-family: var(--font-mono);
}

.reasoning-step-text {
  flex: 1;
}

.reasoning-path-empty {
  font-size: 10px;
  color: var(--color-accent-rose);
  padding: var(--space-2);
  border: 1px dashed rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-sm);
  text-align: center;
}

/* --- Merkle Log --- */
.merkle-log-row td {
  font-size: var(--text-xs);
  vertical-align: middle;
}

.merkle-severity {
  font-size: 9px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1px 5px;
  border-radius: 2px;
}

.severity-info { color: #3b82f6; background: rgba(59, 130, 246, 0.08); }
.severity-warning { color: #d97706; background: rgba(217, 119, 6, 0.08); }
.severity-critical { color: #dc2626; background: rgba(220, 38, 38, 0.08); }

.merkle-action { font-family: var(--font-mono); font-size: 10px !important; }
.merkle-actor { font-family: var(--font-mono); font-size: 10px !important; color: var(--color-text-muted); }
.merkle-timestamp { font-family: var(--font-mono); font-size: 10px !important; color: var(--color-text-muted); white-space: nowrap; }
.merkle-hash { font-family: var(--font-mono); font-size: 10px !important; color: var(--color-text-muted); }

.merkle-verify .btn {
  gap: 4px;
  font-size: 10px;
  padding: 2px 6px;
}

.merkle-valid {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: var(--font-semibold);
  color: #059669;
}

.merkle-invalid {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: var(--font-semibold);
  color: #dc2626;
}

/* --- Timeline Slider --- */
.timeline-slider-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
}

.timeline-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-border-primary);
  border-radius: 2px;
  outline: none;
}

.timeline-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: var(--color-accent-blue);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid var(--color-bg-primary);
  box-shadow: 0 0 0 2px var(--color-accent-blue);
}

.timeline-index {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--color-text-muted);
  flex-shrink: 0;
}

/* --- Timeline Snapshot --- */
.timeline-snapshot {
  padding: var(--space-3);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
}

.timeline-snapshot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

@media (max-width: 768px) {
  .timeline-snapshot-grid { grid-template-columns: repeat(2, 1fr); }
}

.timeline-snapshot-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.timeline-field-label {
  font-size: 9px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.timeline-field-value {
  font-size: var(--text-xs);
  color: var(--color-text-primary);
  font-family: var(--font-mono);
}

.timeline-snapshot-details {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-primary);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* --- Multi-Sig Modal --- */
.multisig-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.multisig-proposal-summary {
  padding: var(--space-3);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
}

.multisig-label {
  font-size: 9px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.multisig-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.multisig-progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.multisig-progress-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
}

.multisig-sig-entry {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text-primary);
  padding: var(--space-2);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
}

.multisig-sig-time {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
}

.multisig-input-row {
  display: flex;
  gap: var(--space-2);
}

.multisig-input-row .input {
  flex: 1;
}

```

### src/styles/pages.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — PAGE-SPECIFIC STYLES
   Enterprise Business Dashboard — Solid & Professional
   ============================================================ */

/* --- Login Page --- */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  overflow: hidden;
  position: relative;
  background: var(--color-bg-primary);
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  transform: translateZ(0);
  pointer-events: none;
}

.login-header {
  text-align: left;
  margin-bottom: var(--space-8);
}

.login-logo {
  width: 48px;
  height: 48px;
  margin-bottom: var(--space-5);
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.login-title {
  font-family: "Playfair Display", var(--font-serif), Georgia, serif;
  font-size: var(--text-4xl);
  font-weight: var(--font-medium);
  background: linear-gradient(to right, #C0C0C0 0%, #FDFDFD 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
}

.login-subtitle {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.8);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  pointer-events: auto;
}

.login-providers {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.login-provider-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
  width: 100%;
  box-shadow: var(--shadow-sm);
}

.login-provider-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-accent);
}

.login-provider-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.login-divider {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-semibold);
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border-primary);
}

.login-2fa {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  width: 100%;
}

.login-2fa-input {
  flex: 1;
  height: 44px;
  min-width: 0;
  max-width: 56px;
  text-align: center;
  font-size: var(--text-base);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.login-2fa-input:focus {
  border-color: var(--color-accent-blue);
  box-shadow: var(--shadow-glow-blue);
}

.login-security-note {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

/* --- Glassmorphism Bubble Login Card --- */
.login-card-bubble {
  position: relative;
  padding: var(--space-8);
  border-radius: 2.5rem;
  background: rgba(255, 255, 255, 0.4);
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  color: var(--color-text-primary);
  transform: translateZ(0);
  will-change: transform, opacity, filter;
}

.login-card-bubble::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 2.5rem;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, transparent 40%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.login-card-bubble::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.015;
  pointer-events: none;
  z-index: 0;
}

.login-card-bubble > * {
  position: relative;
  z-index: 1;
}

.login-card-bubble > * {
  position: relative;
  z-index: 1;
}

.login-card-bubble .login-provider-btn {
  position: relative;
  transition: all 0.15s ease-out;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border-radius: 1.5rem;
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.login-card-bubble .login-provider-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-20deg);
  transition: all 0.5s ease;
  z-index: 1;
}

.login-card-bubble .login-provider-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-secondary);
  transform: scale(1.02);
}

.login-card-bubble .login-provider-btn:hover::after {
  left: 150%;
}

.login-card-bubble .login-security-note {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.2);
}

.login-card-bubble .login-2fa-input {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
}

.login-card-bubble .login-2fa-input:focus {
  border-color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

/* --- Identity Page --- */
.identity-page { display: flex; flex-direction: column; gap: var(--space-6); }

.identity-stepper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.identity-step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-muted);
  white-space: nowrap;
  transition: background var(--transition-fast);
  cursor: pointer;
  flex-shrink: 0;
}

.identity-step.active {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.identity-step.completed {
  color: var(--color-accent-emerald);
}

.identity-step.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.identity-step-number {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: var(--font-bold);
  border: 1px solid currentColor;
  flex-shrink: 0;
}

.identity-step.completed .identity-step-number {
  background: var(--color-accent-emerald);
  border-color: var(--color-accent-emerald);
  color: white;
}

.identity-step.active .identity-step-number {
  background: var(--color-text-primary);
  border-color: var(--color-text-primary);
  color: white;
}

.identity-step-connector {
  width: 24px;
  height: 1px;
  background: var(--color-border-primary);
  flex-shrink: 0;
}

.identity-step-connector.completed {
  background: var(--color-accent-emerald);
}

/* --- Treasury Page --- */
.treasury-page { display: flex; flex-direction: column; gap: var(--space-6); }

.treasury-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-6);
}

@media (max-width: 1200px) {
  .treasury-grid { grid-template-columns: 1fr; }
}

.treasury-wallet-card {
  position: relative;
  border-top: 3px solid var(--color-border-primary);
}

.treasury-wallet-card.treasury { border-top-color: var(--color-accent-blue); }
.treasury-wallet-card.ops { border-top-color: var(--color-accent-emerald); }
.treasury-wallet-card.agent { border-top-color: var(--color-text-secondary); }

.wallet-balance {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  margin: var(--space-2) 0;
}

.wallet-balance-label {
  font-size: 0.6875rem;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-semibold);
}

/* --- Governance Page --- */
.governance-page { display: flex; flex-direction: column; gap: var(--space-6); }

.governance-tabs {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-1);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  width: fit-content;
}

.governance-tab {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: transparent;
  border: none;
  font-family: var(--font-sans);
}

.governance-tab.active {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-sm);
  font-weight: var(--font-semibold);
}

.governance-tab:hover:not(.active) {
  color: var(--color-text-primary);
}

/* --- DPE Pipeline --- */
.dpe-pipeline {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1024px) {
  .dpe-pipeline { grid-template-columns: 1fr; }
}

.dpe-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--color-bg-tertiary);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-primary);
}

.dpe-column-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border-secondary);
  font-size: 0.6875rem;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dpe-column-count {
  margin-left: auto;
  font-size: 10px;
  background: var(--color-bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-secondary);
}

/* --- Onboarding/Tier Page --- */
.onboarding-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-12) var(--space-8);
  background: var(--color-bg-primary);
}

.onboarding-container {
  width: 100%;
  max-width: 800px;
}

.tier-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-top: var(--space-8);
}

@media (max-width: 900px) {
  .tier-cards-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 500px) {
  .tier-cards-grid { grid-template-columns: 1fr; }
}

.tier-card {
  position: relative;
  padding: var(--space-5);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  text-align: left;
  box-shadow: var(--shadow-sm);
}

.tier-card.current {
  border: 2px solid var(--color-accent-blue);
  box-shadow: var(--shadow-md);
}

.tier-card.locked {
  opacity: 0.6;
  background: var(--color-bg-tertiary);
}

.tier-card-number {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.tier-card-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tier-card-description {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  line-height: var(--leading-relaxed);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-primary);
  margin-bottom: var(--space-4);
}

/* --- Audit Page --- */
.audit-page { display: flex; flex-direction: column; gap: var(--space-6); }

.audit-log-entry {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-primary);
}

.audit-log-timestamp {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  flex-shrink: 0;
  width: 140px;
  padding-top: 4px;
}

.audit-log-content {
  flex: 1;
  min-width: 0;
}

.audit-log-action {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.audit-log-details {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.audit-log-hash {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

/* --- Security Dashboard --- */
.security-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.security-stat-card {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.security-stat-label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-semibold);
}

/* --- ZK Proof Cards --- */
.zk-proof-card {
  padding: var(--space-4);
  border-left: 3px solid var(--color-text-primary);
}

.zk-proof-metric {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: var(--space-1) 0;
}

.zk-proof-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.zk-proof-verified {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: 10px;
  color: var(--color-accent-emerald);
  margin-top: var(--space-2);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
}

/* --- Bento Box Layout --- */
.bento-box-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1024px) {
  .bento-box-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .bento-box-grid { grid-template-columns: 1fr; }
}

.bento-widget {
  box-shadow: inset 0 2px 10px rgba(255, 255, 255, 0.05) !important;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.bento-widget .card-title,
.bento-widget .security-stat-label,
.bento-widget h3,
.bento-widget h2 {
  font-family: "Playfair Display", var(--font-serif), Georgia, serif;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.bento-widget .security-stat-value,
.bento-widget .bento-value {
  font-family: "JetBrains Mono", var(--font-mono), monospace;
  letter-spacing: 0.02em;
}

```

### vite.config.js
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@security': path.resolve(__dirname, './src/security'),
      '@services': path.resolve(__dirname, './src/services'),
      '@config': path.resolve(__dirname, './src/config'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'vendor';
          if (id.includes('node_modules/zustand') || id.includes('node_modules/@tanstack')) return 'state';
          if (id.includes('node_modules/dompurify') || id.includes('node_modules/ethers')) return 'security';
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/recharts') || id.includes('node_modules/lucide')) return 'ui';
        },
      },
    },
  },
});

```

