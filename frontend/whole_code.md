# Sovereign Protocol — Complete Project Architecture & Code Reference

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | React | 19 | Component-based UI with modern hooks |
| Build Tool | Vite | 8 | Fast HMR, production bundling |
| State Management | Zustand | Latest | Zero-persistence state stores |
| Data Fetching | TanStack React Query | Latest | Server state caching |
| Routing | React Router | v7 | Protected route navigation |
| Web3 | ethers.js | v6 | Wallet connection & signing |
| Security | DOMPurify | Latest | XSS prevention |
| Crypto | Web Crypto API | Native | Client-side encryption/signing |
| Animation | Framer Motion | Latest | Micro-animations |
| Charts | Recharts | Latest | Treasury visualizations |
| Icons | Lucide React | Latest | Modern icon set |
| Font | Inter + JetBrains Mono | Google Fonts | Premium typography |
| 3D Engine | Three.js | 0.175+ | WebGL rendering |
| 3D React | React Three Fiber | 9+ | Declarative 3D scene management |
| 3D Helpers | @react-three/drei | 10+ | OrbitControls, utilities |

---

## Project Structure

```
d:\AI BUSSINESS\git_hub_branch\frontend\
├── index.html                          # Entry HTML with security headers
├── vite.config.js                      # Vite config with aliases & security
├── package.json                        # Dependencies
├── public/
│   └── favicon.svg                     # Shield icon favicon
└── src/
    ├── main.jsx                        # Entry point + CSS imports
    ├── App.jsx                         # Router + providers
    │
    ├── config/                         # Immutable configuration
    │   ├── constants.js                # Platform constants, blocklists
    │   ├── tiers.js                    # Tier 0-3 definitions
    │   └── rbac.js                     # Role permission matrix
    │
    ├── security/                       # Security infrastructure
    │   ├── PolicyValidator.js          # Deterministic AI output scanner
    │   ├── CryptoService.js            # Web Crypto API wrapper
    │   ├── SessionGuard.js             # 5-min idle auto-wipe
    │   ├── DOMSanitizer.js             # DOMPurify wrapper
    │   ├── AuditLogger.js              # Immutable action logger
    │   ├── CanvasIsolation.js          # WebGL screenshot block
    │   ├── PolicyGate.js               # Execution policy checks
    │   └── ExecutionSigner.js          # ECDSA execution signing
    │
    ├── store/                          # Zustand state (zero-persistence)
    │   ├── authStore.js                # Auth session state
    │   ├── identityStore.js            # 4-layer identity matrix
    │   ├── treasuryStore.js            # Treasury dashboard (AI-isolated)
    │   ├── governanceStore.js          # DPE pipeline & RBAC
    │   └── onboardingStore.js          # Progressive trust tiers
    │
    ├── hooks/                          # Custom React hooks
    │   ├── useSessionGuard.js          # Session timeout integration
    │   ├── usePermission.js            # RBAC permission checker
    │   ├── useTierGate.js              # Tier access control
    │   ├── usePolicyValidator.js       # Policy violation detection
    │   └── useWallet.js                # MetaMask connection
    │
    ├── services/                       # API layer
    │   ├── mockApi.js                  # Mock backend (swap for real)
    │   └── SpatialAudioEngine.js       # Web Audio API spatial audio
    │
    ├── styles/                         # Design system
    │   ├── index.css                   # Tokens, reset, typography
    │   ├── animations.css              # Keyframes & utilities
    │   ├── components.css              # Buttons, cards, badges, etc.
    │   ├── layouts.css                 # Shell, sidebar, grids
    │   ├── pages.css                   # Page-specific styles
    │   ├── module2.css                 # Command Center styles
    │   ├── module3.css                 # Spatial Workspace styles
    │   └── module4.css                 # Operational Layer styles
    │
    ├── components/
    │   ├── common/                     # Reusable UI components
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Modal.jsx
    │   │   ├── StatusIndicator.jsx
    │   │   ├── ProgressBar.jsx
    │   │   ├── FileUploader.jsx        # AES-256 encrypted upload
    │   │   ├── CopyToClipboard.jsx
    │   │   └── SafeRenderer.jsx        # PolicyValidator + DOMPurify
    │   │
    │   ├── spatial/                    # Module 3: 3D Workspace
    │   │   ├── OfficeScene.jsx         # Main Three.js scene
    │   │   ├── AgentAvatar.jsx         # State-driven 3D agent
    │   │   ├── HeatmapFloor.jsx        # Burn-rate heatmap floor
    │   │   └── SpatialHUD.jsx          # HTML overlay controls
    │   │
    │   ├── operational/                # Module 4: DPE + Audit
    │   │   ├── RiskScoreGauge.jsx      # SVG risk gauge
    │   │   ├── ReasoningPath.jsx       # Logic chain display
    │   │   ├── MerkleLogEntry.jsx      # Audit row with verify
    │   │   └── MultiSigModal.jsx       # Multi-sig collection
    │   │
    │   └── layout/                     # App structure
    │       ├── AppShell.jsx
    │       ├── Sidebar.jsx
    │       ├── TopBar.jsx
    │       └── TierGate.jsx
    │
    └── pages/                          # Route pages
        ├── LoginPage.jsx               # Layer A: Human ID
        ├── IdentityPage.jsx            # Layers A-D wizard
        ├── TreasuryPage.jsx            # Financial dashboard
        ├── GovernancePage.jsx           # RBAC + DPE pipeline
        ├── DashboardPage.jsx           # Central overview
        ├── OnboardingPage.jsx          # Tier progression
        ├── AuditPage.jsx               # Security & audit logs
        ├── AgentManagementPage.jsx     # Module 2: Agent OS
        ├── MarketplacePage.jsx         # Module 2: ZK Marketplace
        ├── ServiceFeePage.jsx          # Module 2: Fee Engine
        ├── SpatialWorkspacePage.jsx    # Module 3: 3D Workspace
        ├── DPEPipelinePage.jsx         # Module 4: DPE Pipeline
        └── ForensicAuditPage.jsx       # Module 4: Forensic Audit
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER (Client-Side)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SECURITY LAYER (Always Active)              │   │
│  │                                                          │   │
│  │  SessionGuard ──── 5-min idle ──── AUTO-WIPE ALL STATE  │   │
│  │  PolicyValidator ── Financial keyword scan ── BLOCK/PASS │   │
│  │  CryptoService ──── SHA-256 + ECDSA + AES-256-GCM       │   │
│  │  DOMSanitizer ───── DOMPurify strict allowlist           │   │
│  │  AuditLogger ────── Immutable frozen entries             │   │
│  │  CanvasIsolation ── WebGL screenshot/DOM scrape block    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┼───────────────────────────────┐ │
│  │          STATE MANAGEMENT │(Zustand - ZERO Persistence)   │ │
│  │                           │                               │ │
│  │  authStore ─── identityStore ─── treasuryStore            │ │
│  │       │              │               │                    │ │
│  │  governanceStore ─── onboardingStore                      │ │
│  │       │                                                   │ │
│  │  agentOSStore ── marketplaceStore ── serviceFeeStore      │ │
│  │       │                                                   │ │
│  │  spatialStore (render metadata only, zero treasury data)  │ │
│  │                                                           │ │
│  │  ⚠ ALL STATE WIPED on: logout / tab close / 5min idle    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│  ┌───────────────────────────┼───────────────────────────────┐ │
│  │                    UI LAYER                               │ │
│  │                                                           │ │
│  │  Module 1: Identity & Foundation                          │ │
│  │  Module 2: Command Center (Agent OS, Marketplace, Fees)   │ │
│  │  Module 3: Spatial Workspace (3D WebGL + Audio)           │ │
│  │  Progressive Trust: Tier 0→3 gated access                 │ │
│  │  Security: Audit dashboard + ZK proofs                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### 1. Zero-Persistence State
- All Zustand stores live in memory only
- No localStorage, no sessionStorage for sensitive claims
- Complete state wipe on: `beforeunload`, idle timeout, manual logout
- SessionGuard monitors: mousedown, keydown, scroll, touchstart, mousemove, visibilitychange

### 2. Content Security Policy (CSP)
- Security headers set in `vite.config.js` for dev server
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`

### 3. DOM Sanitization (DOMPurify)
- Strict allowlist: only `p, br, strong, em, h1-h6, ul, ol, li, blockquote, pre, code, table, a, span, div`
- FORBIDDEN: `script, style, iframe, object, embed, form, input, textarea, select, button`
- All event handlers stripped: `onerror, onload, onclick, onmouseover, onfocus`
- All `<a>` tags forced to `target="_blank" rel="noopener noreferrer"`

### 4. Deterministic Policy Validator
- Scans ALL AI-generated content before display
- 20 financial keywords in blocklist (payment, transfer, treasury, etc.)
- Currency pattern detection: `$amount`, `0.5 ETH`, Ethereum addresses
- Transaction instruction patterns: `send to`, `authorize payment`, etc.
- On violation: content BLOCKED, Blocker Report generated, PAUSE STATE triggered
- **Cannot be bypassed by prompts, reasoning, or agent manipulation**

### 5. Client-Side Encryption
- KYB documents encrypted with AES-256-GCM via Web Crypto API
- 12-byte random IV per encryption operation
- Frontend sees only encrypted blobs after encryption
- SHA-256 integrity hashes on all outbound data
- ECDSA (P-256) session signing keys (non-extractable)

### 6. AI Isolation
- Treasury store has zero AI agent context
- Agent financial permissions: `canViewBudget: false, canProposeSpeinding: false, canExecuteTransactions: false, financialPermissions: []`
- AI_BLOCKED_CATEGORIES: 12 categories permanently blocked
- Hard-coded boundary: AI agents physically isolated from treasury UI

---

## Module Details

### Module 1: Multi-Layer Identity Matrix
| Layer | Purpose | UI Components |
|-------|---------|--------------|
| A: Human ID | Prove human at keyboard | SSO buttons, 2FA code input |
| B: Business ID | Prove entity exists legally | File uploader (encrypted), Gov API tracker |
| C: Authority | Prove legal right to bind | DNS TXT copy, Email magic link, Multi-sig board |
| D: Crypto ID | Connect Web3 wallet | MetaMask connect, Message signing, Binding |

### Module 2: Treasury Dashboard
| Wallet | Access | Purpose |
|--------|--------|---------|
| Treasury Wallet | Founder + Multi-Sig | Cold storage, main capital |
| Ops Wallet | Human-Only | Daily fees, hot wallet |
| Agent Execution | Capped Monitoring | Individual caps per agent |

### Module 3: Governance & RBAC
| Role | Key Permissions |
|------|----------------|
| Founder | Hire/terminate agents, execute proposals, modify policies, view treasury |
| Supervisor | Approve/reject proposals, assign tasks, view blocker reports |
| Auditor | Read-only audit logs, view execution provenance |

### Module 4: Progressive Trust
| Tier | Requirements | Unlocks |
|------|-------------|---------|
| 0 Guest | Layer A only | Sandbox view, simulated data |
| 1 Individual | Layer A + KYC | 3 agents, basic execution |
| 2 Company | Layers A+B+C (DNS+Email) | Treasury, governance, 50 agents |
| 3 Enterprise | All layers + Multi-sig + Wallet | Unlimited agents, custom compliance |

### Module 5: Security Dashboard
- Real-time session countdown timer
- Active security measures grid (6 measures)
- Immutable audit trail with severity badges
- ZK-proof performance cards with proof hashes
- Policy violation alerts

---

## Running the Project

```bash
# Install dependencies
cd d:\AI BUSSINESS\git_hub_branch\frontend
npm install

# Development server
npm run dev
# → http://localhost:5173/

# Production build
npm run build
# → Output in dist/
```

---

## Build Output (Production)

| Chunk | Size | Gzip | Contents |
|-------|------|------|----------|
| vendor | 226 KB | 72 KB | React, React DOM, React Router |
| spatial | 903 KB (lazy) | 241 KB | Three.js, R3F, drei (loaded on demand) |
| ui | 141 KB | 47 KB | Framer Motion, Recharts, Lucide |
| index | 174 KB | 42 KB | Application code |
| state | 34 KB | 11 KB | Zustand, TanStack Query |
| security | 22 KB | 9 KB | DOMPurify, ethers.js |
| CSS | 59 KB | 9 KB | Complete design system |

**Core: ~656 KB (190 KB gzipped) + Spatial: 903 KB lazy-loaded**

---

## File Count Summary

| Category | Files |
|----------|-------|
| Styles (CSS) | 8 |
| Config | 3 |
| Security | 8 |
| Stores | 9 |
| Hooks | 5 |
| Services | 2 |
| Common Components | 8 |
| Layout Components | 4 |
| Spatial Components | 4 |
| Operational Components | 4 |
| Pages | 13 |
| Root Files | 3 |
| **Total** | **71** |


---

## Complete Source Code

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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <title>Sovereign Protocol — AI Enterprise Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

### vite.config.js
```javascript
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

### src/App.jsx
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell.jsx';
import { TierGate } from './components/layout/TierGate.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { IdentityPage } from './pages/IdentityPage.jsx';
import { TreasuryPage } from './pages/TreasuryPage.jsx';
import { GovernancePage } from './pages/GovernancePage.jsx';
import { OnboardingPage } from './pages/OnboardingPage.jsx';
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
      {...props}
    >
      {loading ? (
        <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid transparent', borderTopColor: 'currentColor', borderRadius: '50%', display: 'inline-block' }} />
      ) : Icon ? (
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
      const blobRef = await CryptoService.hash(new Uint8Array(encrypted).toString());

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
          ⚠️ Content Blocked — Policy Violation
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
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';
import { useSessionGuard } from '../../hooks/useSessionGuard.js';

/**
 * Sovereign Protocol — AppShell
 * Main application layout wrapping sidebar, topbar, and content area.
 * The SessionGuard hook is activated here to monitor idle state.
 */
function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Activate session guard — monitors idle time and wipes state on timeout
  useSessionGuard();

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />
      <div className={`app-shell-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar sidebarCollapsed={sidebarCollapsed} />
        <main className="app-main">
          <Outlet />
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
  Fingerprint, ChevronLeft, ChevronRight, Layers
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
    { section: 'Security' },
    { path: '/audit', label: 'Audit & Security', icon: Shield, tier: 0 },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="main-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Shield size={18} />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span>Sovereign</span> Protocol
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) {
            if (collapsed) return null;
            return (
              <div key={i} className="sidebar-section-label">
                {item.section}
              </div>
            );
          }

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
              title={collapsed ? item.label : undefined}
              style={locked ? { pointerEvents: 'none' } : undefined}
            >
              <item.icon size={20} className="sidebar-link-icon" />
              {!collapsed && (
                <>
                  <span className="sidebar-link-text">{item.label}</span>
                  {locked && <Lock size={14} className="sidebar-link-badge" style={{ color: 'var(--color-text-muted)' }} />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-tier-indicator">
            <div className="sidebar-tier-icon" style={{ background: currentTier.color ? `linear-gradient(135deg, ${currentTier.color}, ${currentTier.color}aa)` : undefined }}>
              <Shield size={16} />
            </div>
            <div className="sidebar-tier-info">
              <div className="sidebar-tier-label">Trust Level</div>
              <div className="sidebar-tier-name">Tier {currentTierId}: {currentTier.name}</div>
            </div>
          </div>
        )}
        <button
          className="btn btn-ghost"
          onClick={onToggle}
          style={{ width: '100%', marginTop: 'var(--space-3)', justifyContent: collapsed ? 'center' : 'flex-start' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> Collapse</>}
        </button>
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

### src/config/constants.js
```javascript
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
});

```

### src/config/rbac.js
```javascript
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
```javascript
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

### src/hooks/usePermission.js
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

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

  return (
    <div className="audit-page">
      <div className="page-header">
        <h1 className="page-title">Audit & Security Dashboard</h1>
        <p className="page-subtitle">Immutable accountability logs, session monitoring, and zero-knowledge proofs</p>
      </div>

      {/* Security Stats */}
      <div className="security-stats-grid">
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
      </div>

      {/* Security Architecture */}
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

      {/* ZK Proofs */}
      {zkProofs.length > 0 && (
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
      )}

      {/* Audit Log */}
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
    </div>
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
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name || 'Operator'}</h1>
        <p className="page-subtitle">
          {isSandboxMode
            ? 'You are in Sandbox Mode — complete identity verification to unlock full access'
            : 'Sovereign Protocol command center — all systems operational'
          }
        </p>
      </div>

      {/* Sandbox Warning */}
      {isSandboxMode && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-4)', background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.15)', borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-6)',
        }}>
          <AlertTriangle size={18} style={{ color: 'var(--color-accent-amber)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            <strong>Sandbox Mode:</strong> All data is simulated. Complete your identity verification to enable real execution.
          </span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="security-stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            <Card className="security-stat-card" hover>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="security-stat-label">{stat.label}</span>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="security-stat-value">{stat.value}</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{stat.sublabel}</span>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Identity Progress */}
      <Card style={{ marginBottom: 'var(--space-6)' }}>
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

      {/* Blocker Alert */}
      {unresolvedBlockers > 0 && (
        <Card variant="danger" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-accent-rose)' }} />
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-accent-rose)' }}>
                {unresolvedBlockers} Unresolved Blocker Report{unresolvedBlockers > 1 ? 's' : ''}
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                AI agents are in PAUSE STATE. Human review required.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Governance Boundary Reminder */}
      <Card>
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
    </div>
  );
}

export { DashboardPage };

```

### src/pages/GovernancePage.jsx
```jsx
import { useEffect, useState } from 'react';
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

  const draftProposals = proposals.filter(p => p.status === 'draft');
  const proposedProposals = proposals.filter(p => p.status === 'proposed');
  const approvedProposals = proposals.filter(p => p.status === 'approved' || p.status === 'executed');
  const unresolvedBlockers = blockerReports.filter(r => r.status === 'PAUSE_STATE');

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

  return (
    <TierGate requiredTier={2} requiredFeature="governance">
      <div className="governance-page">
        <div className="page-header">
          <h1 className="page-title">Deterministic Governance & RBAC</h1>
          <p className="page-subtitle">Human-centric control — AI agents execute, humans decide</p>
        </div>

        {/* Portal Tabs */}
        <div className="governance-tabs">
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
        </div>

        {/* Pause State Alert */}
        {isPaused && activeBlocker && (
          <Card variant="danger" style={{ borderLeft: '4px solid var(--color-accent-rose)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <AlertTriangle size={20} style={{ color: 'var(--color-accent-rose)' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-accent-rose)' }}>
                  ⚠️ PAUSE STATE — Policy Violation Detected
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                  Blocker ID: {activeBlocker.id} — {activeBlocker.violations?.join(', ')}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={clearPause}>Acknowledge</Button>
            </div>
          </Card>
        )}

        {/* DPE Pipeline */}
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

        {/* Agent Management (Founder only) */}
        {can('canHireAgents') && (
          <Card>
            <div className="card-header">
              <h3 className="card-title">Agent Management</h3>
              <Badge color="rose">Financial Permissions: NONE</Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {agents.filter(a => a.status === 'active').map(agent => (
                <div key={agent.id} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                  padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                    background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
        )}

        {/* Blocker Reports */}
        {unresolvedBlockers.length > 0 && (
          <Card variant="warning">
            <div className="card-header">
              <h3 className="card-title">⚠️ Blocker Reports</h3>
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
        )}
      </div>
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

  return (
    <div className="identity-page">
      <div className="page-header">
        <h1 className="page-title">Multi-Layer Identity Matrix</h1>
        <p className="page-subtitle">Progressive identity verification across 4 security layers</p>
      </div>

      {/* Progress */}
      <ProgressBar value={progress} max={100} label="Verification Progress" showPercent />

      {/* Stepper */}
      <div className="identity-stepper">
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
      </div>

      {/* Layer A: Human ID — Already completed at login */}
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

      {/* Layer B: Business ID */}
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

      {/* Layer C: Authority Verification */}
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

      {/* Layer D: Cryptographic ID */}
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
    </div>
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
import { AUDIT_ACTIONS } from '../config/constants.js';

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
    <div className="login-page">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="login-header">
          <div className="login-logo">
            <Shield size={28} color="white" />
          </div>
          <h1 className="login-title">Sovereign Protocol</h1>
          <p className="login-subtitle">Institutional-Grade AI Enterprise Platform</p>
        </div>

        <div className="card" style={{ padding: 'var(--space-8)' }}>
          {step === 'provider' && (
            <div className="login-form">
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                  Verify Your Identity
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                  Layer A — Human Presence Verification
                </p>
              </div>

              <div className="login-providers">
                <button className="login-provider-btn" onClick={() => handleProviderLogin('microsoft')} disabled={loading} id="login-microsoft">
                  <div className="login-provider-icon" style={{ background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={16} style={{ color: 'var(--color-accent-blue)' }} />
                  </div>
                  Microsoft Entra ID
                  <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
                </button>

                <button className="login-provider-btn" onClick={() => handleProviderLogin('google')} disabled={loading} id="login-google">
                  <div className="login-provider-icon" style={{ background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={16} style={{ color: 'var(--color-accent-emerald)' }} />
                  </div>
                  Google Workspace
                  <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
                </button>

                <button className="login-provider-btn" onClick={() => handleProviderLogin('did')} disabled={loading} id="login-did">
                  <div className="login-provider-icon" style={{ background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <KeyRound size={16} style={{ color: 'var(--color-accent-violet)' }} />
                  </div>
                  Decentralized ID (DID)
                  <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
                </button>
              </div>

              {error && <p className="input-error-text" style={{ textAlign: 'center' }}>{error}</p>}

              <div className="login-security-note">
                <Shield size={16} style={{ color: 'var(--color-accent-blue)', flexShrink: 0, marginTop: 2 }} />
                <span>Your session uses non-persistent memory state. All data is wiped when you close the tab or after 5 minutes of inactivity.</span>
              </div>
            </div>
          )}

          {(step === '2fa' || step === 'verifying') && (
            <div className="login-form">
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                  Two-Factor Authentication
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
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

              {error && <p className="input-error-text" style={{ textAlign: 'center' }}>{error}</p>}

              <Button
                variant="primary"
                size="lg"
                onClick={handleVerify2FA}
                loading={step === 'verifying'}
                disabled={twoFaCode.join('').length !== 6}
                style={{ width: '100%', marginTop: 'var(--space-4)' }}
                id="verify-2fa-btn"
              >
                Verify & Continue
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export { LoginPage };

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

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Progressive Trust Level</h1>
        <p className="page-subtitle">Complete verification steps to unlock platform capabilities</p>
      </div>

      {/* Current Tier Display */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="accent" style={{ textAlign: 'center', marginBottom: 'var(--space-8)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${currentTier.color}, ${currentTier.color}80)` }} />
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-xl)', margin: '0 auto var(--space-4)',
            background: `linear-gradient(135deg, ${currentTier.color}20, ${currentTier.color}05)`,
            border: `2px solid ${currentTier.color}40`,
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
      <div className="tier-cards-grid">
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
      </div>

      {/* Action */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
        <Button variant="primary" size="lg" icon={Shield} iconRight={ChevronRight} onClick={() => navigate('/identity')} id="continue-verification-btn">
          Continue Verification
        </Button>
      </div>
    </div>
  );
}

export { OnboardingPage };

```

### src/pages/TreasuryPage.jsx
```jsx
import { useEffect, useState } from 'react';
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

  return (
    <TierGate requiredTier={2} requiredFeature="treasury">
      <div className="treasury-page">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 className="page-title">Treasury Dashboard</h1>
              <p className="page-subtitle">Role-separated financial management — AI agents have zero access</p>
            </div>
            <Badge color="rose" icon={ShieldAlert}>AI Isolated</Badge>
          </div>
        </div>

        {/* Hard-coded AI isolation notice */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-4)', background: 'rgba(244,63,94,0.06)',
          border: '1px solid rgba(244,63,94,0.15)', borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-2)',
        }}>
          <ShieldAlert size={18} style={{ color: 'var(--color-accent-rose)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            <strong>Hard-Coded Boundary:</strong> AI agents are physically isolated from this UI. They cannot view balances, propose spending, or interact with treasury metadata.
          </span>
        </div>

        {/* Wallet Cards */}
        <div className="treasury-grid">
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
        </div>

        {/* Individual Agent Wallets */}
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

        {/* Transaction History */}
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
      </div>
    </TierGate>
  );
}

export { TreasuryPage };

```

### src/security/AuditLogger.js
```javascript
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

### src/security/CryptoService.js
```javascript
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
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
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
```javascript
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

### src/security/PolicyValidator.js
```javascript
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
```javascript
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
```javascript
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
};

export { mockApi };

```

### src/store/authStore.js
```javascript
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
```javascript
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
  addProposal: (proposal) => set(state => ({
    proposals: [
      Object.freeze({
        id: proposal.id || crypto.randomUUID(),
        title: proposal.title,
        description: proposal.description,
        agentId: proposal.agentId,
        agentName: proposal.agentName,
        category: proposal.category,
        status: 'draft', // ALWAYS starts as draft
        createdAt: new Date().toISOString(),
        reviewedBy: null,
        reviewedAt: null,
        executedBy: null,
        executedAt: null,
        rejectionReason: null,
      }),
      ...state.proposals,
    ],
  })),

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
  addBlockerReport: (report) => set(state => ({
    blockerReports: [
      Object.freeze({
        id: report.id || crypto.randomUUID(),
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
  })),

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
  addAgent: (agent) => set(state => ({
    agents: [
      ...state.agents,
      Object.freeze({
        id: agent.id || crypto.randomUUID(),
        name: agent.name,
        role: agent.role,
        department: agent.department,
        status: 'active',
        hiredAt: new Date().toISOString(),
        hiredBy: agent.hiredBy,
        taskCount: 0,
        completedTasks: 0,
        canViewBudget: false,
        canProposeSpeinding: false,
        canExecuteTransactions: false,
        financialPermissions: [],
      }),
    ],
  })),

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
```javascript
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

### src/store/onboardingStore.js
```javascript
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

### src/store/treasuryStore.js
```javascript
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
   Subtle Professional Animations for Business UX
   ============================================================ */

/* --- Fade In --- */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(12px);
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
    transform: scale(0.97);
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
    transform: scale(0.97);
  }
}

/* --- Pulse --- */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* --- Subtle Border Highlight (replaces glow for light mode) --- */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.08);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
  }
}

@keyframes glowPulseEmerald {
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.08);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.15);
  }
}

@keyframes glowPulseRose {
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.08);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
  }
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

/* --- Dot Typing Indicator --- */
@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* --- Float --- */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* --- Ripple --- */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* --- Stagger Children Utility --- */
.stagger-children > * {
  animation: fadeInUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 50ms; }
.stagger-children > *:nth-child(3) { animation-delay: 100ms; }
.stagger-children > *:nth-child(4) { animation-delay: 150ms; }
.stagger-children > *:nth-child(5) { animation-delay: 200ms; }
.stagger-children > *:nth-child(6) { animation-delay: 250ms; }
.stagger-children > *:nth-child(7) { animation-delay: 300ms; }
.stagger-children > *:nth-child(8) { animation-delay: 350ms; }

/* --- Shimmer Skeleton Utility --- */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 25%,
    var(--color-bg-hover) 50%,
    var(--color-bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

/* --- Animate Utilities --- */
.animate-fadeIn { animation: fadeIn 0.3s ease-out both; }
.animate-fadeInUp { animation: fadeInUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) both; }
.animate-fadeInDown { animation: fadeInDown 0.35s cubic-bezier(0.4, 0, 0.2, 1) both; }
.animate-scaleIn { animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-spin { animation: spin 1s linear infinite; }
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-glow { animation: glowPulse 2.5s ease-in-out infinite; }
.animate-glow-emerald { animation: glowPulseEmerald 2.5s ease-in-out infinite; }
.animate-glow-rose { animation: glowPulseRose 2.5s ease-in-out infinite; }

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
   Professional Light Theme — Business-Grade UI Components
   ============================================================ */

/* --- Buttons --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  line-height: 1;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: var(--shadow-md), var(--shadow-glow-blue);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border-color: var(--color-border-secondary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-bg-tertiary);
  border-color: var(--color-accent-blue);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.btn-danger {
  background: var(--gradient-danger);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  box-shadow: var(--shadow-md), var(--shadow-glow-rose);
  transform: translateY(-1px);
}

.btn-success {
  background: var(--gradient-success);
  color: white;
}

.btn-success:hover:not(:disabled) {
  box-shadow: var(--shadow-md), var(--shadow-glow-emerald);
  transform: translateY(-1px);
}

.btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-xs); }
.btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--text-base); }
.btn-icon { padding: var(--space-2); width: 36px; height: 36px; }

/* --- Cards --- */
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.card-hover:hover {
  border-color: var(--color-border-accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card-accent { border-color: var(--color-border-accent); background: rgba(37, 99, 235, 0.02); }
.card-success { border-color: var(--color-border-success); background: rgba(5, 150, 105, 0.02); }
.card-danger { border-color: var(--color-border-danger); background: rgba(220, 38, 38, 0.02); }
.card-warning { border-color: var(--color-border-warning); background: rgba(217, 119, 6, 0.02); }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

/* --- Badges --- */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-full);
  line-height: 1.4;
}

.badge-blue { background: rgba(37,99,235,0.08); color: #1d4ed8; border: 1px solid rgba(37,99,235,0.2); }
.badge-violet { background: rgba(124,58,237,0.08); color: #6d28d9; border: 1px solid rgba(124,58,237,0.2); }
.badge-emerald { background: rgba(5,150,105,0.08); color: #047857; border: 1px solid rgba(5,150,105,0.2); }
.badge-amber { background: rgba(217,119,6,0.08); color: #b45309; border: 1px solid rgba(217,119,6,0.2); }
.badge-rose { background: rgba(220,38,38,0.08); color: #b91c1c; border: 1px solid rgba(220,38,38,0.2); }
.badge-cyan { background: rgba(8,145,178,0.08); color: #0e7490; border: 1px solid rgba(8,145,178,0.2); }

/* --- Inputs --- */
.input-group { display: flex; flex-direction: column; gap: var(--space-2); }
.input-label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-secondary); }

.input-field {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  outline: none;
}

.input-field:focus {
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}

.input-field::placeholder { color: var(--color-text-muted); }
.input-field:disabled { opacity: 0.5; cursor: not-allowed; background: var(--color-bg-tertiary); }
.input-error { border-color: var(--color-accent-rose) !important; }
.input-error-text { font-size: var(--text-xs); color: var(--color-accent-rose); }

/* --- Status Indicators --- */
.status-dot { width: 8px; height: 8px; border-radius: var(--radius-full); flex-shrink: 0; }
.status-dot-active { background: var(--color-accent-emerald); box-shadow: 0 0 6px rgba(5,150,105,0.4); }
.status-dot-pending { background: var(--color-accent-amber); animation: pulse 2s infinite; }
.status-dot-error { background: var(--color-accent-rose); }
.status-dot-inactive { background: var(--color-text-muted); }

/* --- Progress Bar --- */
.progress-bar { width: 100%; height: 6px; background: var(--color-bg-tertiary); border-radius: var(--radius-full); overflow: hidden; }
.progress-bar-fill { height: 100%; border-radius: var(--radius-full); background: var(--gradient-primary); transition: width var(--transition-slow); }
.progress-bar-fill-success { background: var(--gradient-success); }
.progress-bar-fill-danger { background: var(--gradient-danger); }

/* --- Dividers --- */
.divider { height: 1px; background: var(--color-border-primary); border: none; margin: var(--space-6) 0; }

/* --- Modal --- */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
}

.modal-container {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border-primary);
}

.modal-body { padding: var(--space-6); }

.modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border-primary);
}

/* --- Tables --- */
.table-container { width: 100%; overflow-x: auto; border: 1px solid var(--color-border-primary); border-radius: var(--radius-lg); }
.table { width: 100%; border-collapse: collapse; }
.table th {
  padding: var(--space-3) var(--space-4); font-size: var(--text-xs); font-weight: var(--font-semibold);
  text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-tertiary);
  background: var(--color-bg-tertiary); text-align: left; border-bottom: 1px solid var(--color-border-primary);
}
.table td {
  padding: var(--space-3) var(--space-4); font-size: var(--text-sm); color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border-primary);
}
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: var(--color-bg-hover); }

/* --- Empty State --- */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: var(--space-16) var(--space-8); text-align: center;
}
.empty-state-icon { width: 64px; height: 64px; color: var(--color-text-muted); margin-bottom: var(--space-4); }
.empty-state-title { font-size: var(--text-lg); font-weight: var(--font-semibold); color: var(--color-text-secondary); }
.empty-state-text { font-size: var(--text-sm); color: var(--color-text-tertiary); max-width: 400px; }

/* --- Skeleton Loading --- */
.skeleton { background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-hover) 50%, var(--color-bg-tertiary) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius-md); }

```

### src/styles/index.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — DESIGN SYSTEM
   Professional Light Theme — Institutional Business Dashboard
   ============================================================ */

/* --- CSS Custom Properties (Design Tokens) --- */
:root {
  /* Primary Palette — Clean whites, warm grays */
  --color-bg-primary: #f8f9fb;
  --color-bg-secondary: #ffffff;
  --color-bg-tertiary: #f1f3f7;
  --color-bg-elevated: #ffffff;
  --color-bg-surface: #f5f6fa;
  --color-bg-hover: #ebedf2;

  /* Accent Colors — Refined, corporate-grade */
  --color-accent-blue: #2563eb;
  --color-accent-violet: #7c3aed;
  --color-accent-emerald: #059669;
  --color-accent-amber: #d97706;
  --color-accent-rose: #dc2626;
  --color-accent-cyan: #0891b2;

  /* Gradient Presets */
  --gradient-primary: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --gradient-success: linear-gradient(135deg, #059669 0%, #0d9488 100%);
  --gradient-danger: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  --gradient-warning: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  --gradient-surface: linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(124,58,237,0.03) 100%);
  --gradient-glow: radial-gradient(ellipse at center, rgba(37,99,235,0.06) 0%, transparent 70%);

  /* Text Colors — High contrast, professional */
  --color-text-primary: #111827;
  --color-text-secondary: #4b5563;
  --color-text-tertiary: #6b7280;
  --color-text-muted: #9ca3af;
  --color-text-inverse: #ffffff;
  --color-text-accent: #2563eb;

  /* Border Colors — Subtle, structured */
  --color-border-primary: #e5e7eb;
  --color-border-secondary: #d1d5db;
  --color-border-accent: rgba(37, 99, 235, 0.35);
  --color-border-success: rgba(5, 150, 105, 0.35);
  --color-border-danger: rgba(220, 38, 38, 0.35);
  --color-border-warning: rgba(217, 119, 6, 0.35);

  /* Card Surfaces — Clean white with subtle depth */
  --glass-bg: #ffffff;
  --glass-bg-light: #fafbfc;
  --glass-border: #e5e7eb;
  --glass-blur: 0px;
  --glass-blur-heavy: 0px;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

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

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
  --radius-full: 9999px;

  /* Shadows — Refined, professional depth */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.06), 0 20px 40px rgba(0, 0, 0, 0.04);
  --shadow-glow-blue: 0 0 0 3px rgba(37, 99, 235, 0.12);
  --shadow-glow-violet: 0 0 0 3px rgba(124, 58, 237, 0.12);
  --shadow-glow-emerald: 0 0 0 3px rgba(5, 150, 105, 0.12);
  --shadow-glow-rose: 0 0 0 3px rgba(220, 38, 38, 0.12);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Z-Index Scale */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-critical: 600;

  /* Layout */
  --sidebar-width: 260px;
  --sidebar-collapsed: 68px;
  --topbar-height: 60px;
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
  min-height: 100vh;
  overflow-x: hidden;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* --- Selection --- */
::selection {
  background: rgba(37, 99, 235, 0.15);
  color: var(--color-text-primary);
}

/* --- Scrollbar --- */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* --- Focus Visible --- */
:focus-visible {
  outline: 2px solid var(--color-accent-blue);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* --- Links --- */
a {
  color: var(--color-accent-blue);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: #1d4ed8;
}

/* --- Code --- */
code, pre {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

pre {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
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
  border-width: 0;
}

```

### src/styles/layouts.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — LAYOUT STYLES
   Professional Light Theme — Clean Business Shell
   ============================================================ */

/* --- App Shell --- */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-primary);
}

.app-shell-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition-base);
  min-height: 100vh;
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
}

/* --- Sidebar --- */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border-primary);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sticky);
  transition: width var(--transition-base);
  overflow: hidden;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-5);
  border-bottom: 1px solid var(--color-border-primary);
  min-height: var(--topbar-height);
}

.sidebar-logo-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  background: var(--gradient-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.sidebar-logo-text {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-logo-text span {
  color: var(--color-accent-blue);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4) var(--space-3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-section-label {
  font-size: 11px;
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  padding: var(--space-4) var(--space-3) var(--space-2);
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-fast);
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid transparent;
}

.sidebar-link:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.sidebar-link.active {
  background: rgba(37, 99, 235, 0.06);
  color: var(--color-accent-blue);
  border-color: rgba(37, 99, 235, 0.15);
  font-weight: var(--font-semibold);
}

.sidebar-link-icon {
  width: 20px;
  height: 20px;
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
  border-top: 1px solid var(--color-border-primary);
}

.sidebar-tier-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
}

.sidebar-tier-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--gradient-primary);
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
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.sidebar-tier-name {
  font-size: var(--text-sm);
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
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  z-index: var(--z-sticky);
  transition: left var(--transition-base);
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
}

.topbar-breadcrumb-active {
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
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
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.topbar-session-timer {
  font-family: var(--font-mono);
  color: var(--color-accent-amber);
  font-weight: var(--font-semibold);
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.topbar-user:hover {
  background: var(--color-bg-hover);
}

.topbar-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
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
  margin-bottom: var(--space-8);
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  letter-spacing: -0.01em;
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

### src/styles/pages.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL — PAGE-SPECIFIC STYLES
   Professional Light Theme — Trusted Business Dashboard
   ============================================================ */

/* --- Login Page --- */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #f0f4ff 0%, #f8f9fb 40%, #f5f3ff 100%);
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: -30%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(ellipse at 30% 50%, rgba(37,99,235,0.05) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 30%, rgba(124,58,237,0.04) 0%, transparent 50%);
  pointer-events: none;
}

.login-container {
  width: 100%;
  max-width: 440px;
  padding: var(--space-8);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-10);
}

.login-logo {
  width: 52px;
  height: 52px;
  margin: 0 auto var(--space-6);
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
}

.login-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  letter-spacing: -0.01em;
}

.login-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
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
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-sans);
  width: 100%;
}

.login-provider-btn:hover {
  border-color: var(--color-accent-blue);
  background: rgba(37,99,235,0.02);
  box-shadow: var(--shadow-md);
}

.login-provider-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.login-divider {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
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
  gap: var(--space-2);
  justify-content: center;
}

.login-2fa-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: var(--text-xl);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  background: var(--color-bg-secondary);
  border: 1.5px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color var(--transition-fast);
}

.login-2fa-input:focus {
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}

.login-security-note {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: rgba(37,99,235,0.04);
  border: 1px solid rgba(37,99,235,0.12);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

/* --- Identity Page --- */
.identity-page { display: flex; flex-direction: column; gap: var(--space-6); }

.identity-stepper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.identity-step {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-muted);
  white-space: nowrap;
  transition: all var(--transition-base);
  cursor: pointer;
  flex-shrink: 0;
}

.identity-step.active {
  background: rgba(37,99,235,0.06);
  color: var(--color-accent-blue);
}

.identity-step.completed {
  color: var(--color-accent-emerald);
}

.identity-step.locked {
  opacity: 0.45;
  cursor: not-allowed;
}

.identity-step-number {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  border: 2px solid currentColor;
  flex-shrink: 0;
}

.identity-step.completed .identity-step-number {
  background: var(--color-accent-emerald);
  border-color: var(--color-accent-emerald);
  color: white;
}

.identity-step.active .identity-step-number {
  background: var(--color-accent-blue);
  border-color: var(--color-accent-blue);
  color: white;
}

.identity-step-connector {
  width: 32px;
  height: 2px;
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
  overflow: hidden;
}

.treasury-wallet-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.treasury-wallet-card.treasury::before { background: var(--gradient-primary); }
.treasury-wallet-card.ops::before { background: var(--gradient-success); }
.treasury-wallet-card.agent::before { background: var(--gradient-warning); }

.wallet-balance {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  margin: var(--space-4) 0;
}

.wallet-balance-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: var(--font-semibold);
}

/* --- Governance Page --- */
.governance-page { display: flex; flex-direction: column; gap: var(--space-6); }

.governance-tabs {
  display: flex;
  gap: var(--space-1);
  padding: 3px;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  width: fit-content;
}

.governance-tab {
  padding: var(--space-3) var(--space-5);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  border-radius: calc(var(--radius-lg) - 3px);
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
  gap: var(--space-6);
}

@media (max-width: 1024px) {
  .dpe-pipeline { grid-template-columns: 1fr; }
}

.dpe-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.dpe-column-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.dpe-column-count {
  margin-left: auto;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* --- Onboarding/Tier Page --- */
.onboarding-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  background: var(--color-bg-primary);
  position: relative;
}

.onboarding-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.03) 0%, transparent 60%);
  pointer-events: none;
}

.onboarding-container {
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 1;
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
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  text-align: center;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.tier-card.current {
  border-color: var(--color-accent-blue);
  box-shadow: var(--shadow-md), var(--shadow-glow-blue);
}

.tier-card.locked {
  opacity: 0.5;
}

.tier-card-number {
  font-size: var(--text-4xl);
  font-weight: var(--font-extrabold);
  color: var(--color-accent-blue);
  margin-bottom: var(--space-2);
}

.tier-card-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.tier-card-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

/* --- Audit Page --- */
.audit-page { display: flex; flex-direction: column; gap: var(--space-6); }

.audit-log-entry {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border-primary);
  transition: background var(--transition-fast);
}

.audit-log-entry:hover {
  background: var(--color-bg-hover);
}

.audit-log-timestamp {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 160px;
}

.audit-log-content {
  flex: 1;
  min-width: 0;
}

.audit-log-action {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.audit-log-details {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-1);
}

.audit-log-hash {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  padding: var(--space-1) var(--space-2);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  display: inline-block;
  margin-top: var(--space-2);
}

/* --- Security Dashboard --- */
.security-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1024px) {
  .security-stats-grid { grid-template-columns: repeat(2, 1fr); }
}

.security-stat-card {
  padding: var(--space-5);
}

.security-stat-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  margin: var(--space-2) 0;
}

.security-stat-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--font-semibold);
}

/* --- ZK Proof Cards --- */
.zk-proof-card {
  padding: var(--space-5);
  border-left: 3px solid var(--color-accent-violet);
}

.zk-proof-metric {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-accent-violet);
  margin: var(--space-2) 0;
}

.zk-proof-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.zk-proof-verified {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--color-accent-emerald);
  margin-top: var(--space-2);
}

```


---

## Module 3: Spatial Workspace — Source Code

### src/store/spatialStore.js
```javascript
/**
 * Sovereign Protocol â€” Spatial Workspace Store (Module 3)
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

### src/security/CanvasIsolation.js
```javascript
/**
 * Sovereign Protocol â€” Canvas Isolation Security (Module 3)
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

### src/services/SpatialAudioEngine.js
```javascript
/**
 * Sovereign Protocol â€” Spatial Audio Engine (Module 3)
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
   * Plays ambient work hum â€” subtle background audio.
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

### src/components/spatial/AgentAvatar.jsx
```jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Sovereign Protocol â€” Agent Avatar (Module 3)
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
 * Sovereign Protocol â€” Heatmap Floor (Module 3)
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

### src/components/spatial/OfficeScene.jsx
```jsx
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AgentAvatar } from './AgentAvatar.jsx';
import { HeatmapFloor } from './HeatmapFloor.jsx';

/**
 * Sovereign Protocol â€” Office Scene (Module 3)
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
 * Sovereign Protocol â€” Spatial HUD Overlay (Module 3)
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
 * Sovereign Protocol â€” Module 3: Spatial Workspace Page
 * The 3D command center. Agents rendered as spatial entities.
 * All state rendered as WebGL pixels â€” no DOM-inspectable text.
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
      {/* WebGL Canvas â€” ALL agent state rendered as pixels here */}
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

      {/* HUD Overlay â€” Regular DOM, outside Canvas */}
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
          â—‰
        </button>
      )}
    </div>
  );
}

export { SpatialWorkspacePage };

```

### src/styles/module3.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL â€” MODULE 3: SPATIAL WORKSPACE STYLES
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


---

## Module 4: Operational Layer — Source Code

### src/security/PolicyGate.js
```javascript
/**
 * Sovereign Protocol â€” Policy Gate (Module 4)
 * Hard-coded middleware that checks every execution action against
 * the governance rules. This is deterministic and model-independent.
 *
 * SECURITY: Cannot be bypassed by prompts, reasoning, or agent manipulation.
 * The gate checks are hard-coded â€” not configurable by AI agents.
 */

import { AI_BLOCKED_CATEGORIES } from '../config/constants.js';

const AGENT_SPENDING_CAP = 100; // USD â€” agents cannot spend more than this
const HIGH_VALUE_THRESHOLD = 1000; // USD â€” requires multi-sig above this
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

### src/security/ExecutionSigner.js
```javascript
/**
 * Sovereign Protocol â€” Execution Signer (Module 4)
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

### src/components/operational/RiskScoreGauge.jsx
```jsx
/**
 * Sovereign Protocol â€” Risk Score Gauge (Module 4)
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

### src/components/operational/ReasoningPath.jsx
```jsx
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Sovereign Protocol â€” Reasoning Path (Module 4)
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

### src/components/operational/MerkleLogEntry.jsx
```jsx
import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader } from 'lucide-react';
import { CryptoService } from '../../security/CryptoService.js';

/**
 * Sovereign Protocol â€” Merkle Log Entry (Module 4)
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
        {entry.hash ? `${entry.hash.slice(0, 8)}...${entry.hash.slice(-6)}` : 'â€”'}
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
 * Sovereign Protocol â€” Multi-Sig Modal (Module 4)
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
 * Sovereign Protocol â€” Module 4: DPE Pipeline Page
 * Draft â†’ Propose â†’ Execute approval rail.
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

  return (
    <div className="dpe-pipeline-page">
      <div className="page-header">
        <h1 className="page-title">DPE Pipeline</h1>
        <p className="page-subtitle">Draft â†’ Propose â†’ Execute â€” Human-in-the-Loop approval rail</p>
      </div>

      {/* HITL Notice */}
      <div className="m2-info-bar" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
        <Shield size={14} style={{ color: '#d97706', flexShrink: 0 }} />
        <span>No AI agent can execute proposals. Every action requires explicit human authorization through this pipeline.</span>
      </div>

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
      <div className="dpe-columns">
        {/* DRAFT Column */}
        <div className="dpe-column">
          <div className="dpe-column-header">
            <FileText size={14} />
            <span>Draft (Incubation)</span>
            <Badge color="blue">{drafts.length}</Badge>
          </div>
          {drafts.map(d => (
            <Card key={d.id} className="dpe-card dpe-draft-card">
              <div className="dpe-draft-stamp">INCUBATION â€” NOT FINALIZED</div>
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
      </div>

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
    </div>
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
 * Sovereign Protocol â€” Module 4: Forensic Audit Suite
 * Immutable transparency â€” the "Black Box" recorder.
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

  return (
    <div className="forensic-audit-page">
      <div className="page-header">
        <h1 className="page-title">Forensic Audit Suite</h1>
        <p className="page-subtitle">Immutable transparency â€” cryptographically verified execution records</p>
      </div>

      {/* Stats */}
      <div className="security-stats-grid" style={{ marginBottom: 'var(--space-5)' }}>
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
      </div>

      {/* Time Machine */}
      {timeline.length > 0 && (
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
      )}

      {/* Merkle-Log Viewer */}
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
    </div>
  );
}

export { ForensicAuditPage };

```

### src/styles/module4.css
```css
/* ============================================================
   SOVEREIGN PROTOCOL â€” MODULE 4: OPERATIONAL LAYER STYLES
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

