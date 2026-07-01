import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Fingerprint, Building2, ShieldCheck, Wallet, Check, Shield,
  Lock, Globe, Mail, Users, Upload, Loader2, AlertTriangle,
  RefreshCw, Scan, KeyRound
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { StatusIndicator } from '../components/common/StatusIndicator.jsx';
import { FileUploader } from '../components/common/FileUploader.jsx';
import { CopyToClipboard } from '../components/common/CopyToClipboard.jsx';
import { useIdentityStore } from '../store/identityStore.js';
import { useGovernanceStore } from '../store/governanceStore.js';
import { useWallet } from '../hooks/useWallet.js';
import { platformApi } from '../services/platformApi.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';

// --- Verification Log Lines ---
const LOG_SEQUENCES = {
  humanId: [
    { text: '[SYSTEM]: Initializing ZK-Proof engine...', type: 'system' },
    { text: '[SYSTEM]: Generating ephemeral key pair... [OK]', type: 'ok' },
    { text: '[SYSTEM]: SSO token exchange validated... [OK]', type: 'ok' },
    { text: '[SYSTEM]: 2FA attestation anchored to session', type: 'info' },
    { text: '[SUCCESS]: Human identity sealed', type: 'success' },
  ],
  kyb: [
    { text: '[SYSTEM]: Encrypting document payload (AES-256-GCM)...', type: 'system' },
    { text: '[SYSTEM]: Submitting to Government API Bridge...', type: 'system' },
    { text: '[SYSTEM]: Cross-referencing business registry... [OK]', type: 'ok' },
    { text: '[SYSTEM]: KYB attestation hash generated', type: 'info' },
    { text: '[SUCCESS]: Business entity verified', type: 'success' },
  ],
  dns: [
    { text: '[SYSTEM]: Generating DNS TXT challenge...', type: 'system' },
    { text: '[SYSTEM]: Querying authoritative nameserver...', type: 'system' },
    { text: '[SYSTEM]: TXT record match confirmed... [OK]', type: 'ok' },
    { text: '[SUCCESS]: Domain ownership verified', type: 'success' },
  ],
  email: [
    { text: '[SYSTEM]: Dispatching cryptographic magic link...', type: 'system' },
    { text: '[SYSTEM]: HMAC-SHA256 token validated... [OK]', type: 'ok' },
    { text: '[SYSTEM]: Corporate email domain confirmed', type: 'info' },
    { text: '[SUCCESS]: Email authority sealed', type: 'success' },
  ],
  wallet: [
    { text: '[SYSTEM]: Initializing Web3 provider handshake...', type: 'system' },
    { text: '[SYSTEM]: Requesting EIP-712 typed signature...', type: 'system' },
    { text: '[SYSTEM]: Verifying secp256k1 signature... [OK]', type: 'ok' },
    { text: '[SYSTEM]: Binding wallet to Business ID attestation', type: 'info' },
    { text: '[SUCCESS]: Cryptographic authority anchored', type: 'success' },
  ],
};

// --- VerificationLog Component ---
function VerificationLog({ lines }) {
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [lines]);

  if (!lines || lines.length === 0) return null;

  return (
    <div className="verification-log" ref={logRef}>
      {lines.map((line, i) => (
        <div key={i} className="verification-log-line" style={{ animationDelay: `${i * 300}ms` }}>
          <span className={`log-${line.type}`}>{line.text}</span>
        </div>
      ))}
    </div>
  );
}

// --- ScanOverlay Component ---
function ScanOverlay({ active, label = 'Scanning' }) {
  if (!active) return null;
  return (
    <div className="scan-overlay">
      <div className="scan-line" />
      <span className="scan-label">{label}</span>
    </div>
  );
}

// --- Trust Shield Row ---
const TIERS = [
  { id: 'human', label: 'Human ID', icon: Fingerprint },
  { id: 'business', label: 'Business ID', icon: Building2 },
  { id: 'authority', label: 'Authority', icon: ShieldCheck },
  { id: 'crypto', label: 'Crypto ID', icon: Wallet },
];

function TrustTierRow({ completedLayers, layerA, layerB, layerC, layerD }) {
  const isVerified = (id) => {
    if (id === 'human') return layerA.status === 'verified';
    if (id === 'business') return layerB.status === 'verified';
    if (id === 'authority') return layerC.verifiedAt || (layerC.emailStatus === 'verified' && layerC.dnsStatus === 'verified');
    if (id === 'crypto') return layerD.status === 'verified';
    return false;
  };

  return (
    <motion.div className="trust-tier-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
      {TIERS.map((tier, i) => (
        <div key={tier.id} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`trust-shield ${isVerified(tier.id) ? 'verified' : ''}`}>
            <div className="trust-shield-icon">
              <Shield size={22} />
            </div>
            <span className="trust-shield-label">{tier.label}</span>
          </div>
          {i < TIERS.length - 1 && (
            <div className={`trust-shield-connector ${isVerified(tier.id) ? 'active' : ''}`} />
          )}
        </div>
      ))}
    </motion.div>
  );
}

// --- Main Page ---
function IdentityPage() {
  const {
    layerA, layerB, layerC, layerD,
    completedLayers, addDocument, updateLayerB, completeLayerB,
    updateDnsStatus, updateEmailStatus,
    setMultiSigThreshold, addMultiSigSignature, bindWallet,
  } = useIdentityStore();
  const resetGovernance = useGovernanceStore(s => s.reset);
  const resetIdentity = useIdentityStore(s => s.reset);
  const { connectWallet, signBindingMessage, isConnecting, error: walletError } = useWallet();

  const [kybLoading, setKybLoading] = useState(false);
  const [dnsLoading, setDnsLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [dnsRecord, setDnsRecord] = useState(null);

  // Scan + Log states
  const [scanningModule, setScanningModule] = useState(null);
  const [logLines, setLogLines] = useState({ a: [], b: [], c: [] });

  const runScanSequence = useCallback((module, logKey, sequence, callback) => {
    setScanningModule(module);
    setTimeout(() => {
      setScanningModule(null);
      // Populate log lines one by one
      sequence.forEach((line, i) => {
        setTimeout(() => {
          setLogLines(prev => ({ ...prev, [logKey]: [...(prev[logKey] || []), line] }));
        }, i * 350);
      });
      // Execute the actual callback after logs finish
      setTimeout(callback, sequence.length * 350 + 200);
    }, 2000);
  }, []);

  // Pre-populate humanId log if already verified
  useEffect(() => {
    if (layerA.status === 'verified' && logLines.a.length === 0) {
      setLogLines(prev => ({ ...prev, a: LOG_SEQUENCES.humanId }));
    }
  }, [layerA.status]);

  // --- Handlers ---
  const handleFileEncrypted = useCallback((encryptedFile) => {
    addDocument(encryptedFile);
    AuditLogger.log({ action: AUDIT_ACTIONS.DOCUMENT_UPLOAD, details: { fileName: encryptedFile.name } });
  }, [addDocument]);

  const handleSealProtocol = useCallback(async () => {
    setKybLoading(true);
    updateLayerB({ status: 'in_progress', govApiStatus: 'verifying' });
    runScanSequence('a', 'a', LOG_SEQUENCES.kyb, async () => {
      try {
        const result = await platformApi.checkKYBStatus('kyb_request_1');
        if (result.status === 'verified') {
          completeLayerB({ name: result.businessName, registrationNumber: result.registrationNumber });
          AuditLogger.log({ action: AUDIT_ACTIONS.IDENTITY_VERIFY, details: { layer: 'B', business: result.businessName } });
        }
      } catch (err) { updateLayerB({ govApiStatus: 'rejected' }); }
      finally { setKybLoading(false); }
    });
  }, [updateLayerB, completeLayerB, runScanSequence]);

  const handleGenerateDNS = useCallback(async () => {
    setDnsLoading(true);
    try {
      const result = await platformApi.generateDNSTxt('enterprise.com');
      setDnsRecord(result.txtRecord);
      updateDnsStatus('pending', result.txtRecord);
    } finally { setDnsLoading(false); }
  }, [updateDnsStatus]);

  const handleVerifyDNS = useCallback(async () => {
    setDnsLoading(true);
    runScanSequence('b', 'b', LOG_SEQUENCES.dns, async () => {
      try {
        const result = await platformApi.verifyDNS('enterprise.com');
        updateDnsStatus('verified', result.txtRecord);
        AuditLogger.log({ action: AUDIT_ACTIONS.DNS_VERIFY, details: { domain: result.domain } });
      } catch { updateDnsStatus('failed', null); }
      finally { setDnsLoading(false); }
    });
  }, [updateDnsStatus, runScanSequence]);

  const handleSendMagicLink = useCallback(async () => {
    setEmailLoading(true);
    try { await platformApi.sendMagicLink('ceo@enterprise.com'); setEmailSent(true); }
    finally { setEmailLoading(false); }
  }, []);

  const handleVerifyEmail = useCallback(async () => {
    setEmailLoading(true);
    runScanSequence('b', 'b', LOG_SEQUENCES.email, async () => {
      try {
        const result = await platformApi.verifyMagicLink('mock_token');
        if (result.success) {
          updateEmailStatus('verified', result.domain);
          AuditLogger.log({ action: AUDIT_ACTIONS.EMAIL_VERIFY, details: { email: result.email } });
        }
      } finally { setEmailLoading(false); }
    });
  }, [updateEmailStatus, runScanSequence]);

  const handleAnchorCrypto = useCallback(async () => {
    runScanSequence('c', 'c', LOG_SEQUENCES.wallet, async () => {
      const wallet = await connectWallet();
      if (wallet) {
        await signBindingMessage(wallet.address, layerB.registrationNumber || 'BIZ_001');
      }
    });
  }, [connectWallet, signBindingMessage, layerB.registrationNumber, runScanSequence]);

  const handleRevocation = useCallback(() => {
    if (window.confirm('KYRTI REVOCATION\n\nThis will permanently destroy all AI episodic memory and revoke all identity attestations.\n\nThis action cannot be undone. Proceed?')) {
      resetIdentity();
      resetGovernance();
    }
  }, [resetIdentity, resetGovernance]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div className="clearance-portal" variants={containerVariants} initial="hidden" animate="show">
      {/* Header */}
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title" style={{ fontSize: 'var(--text-4xl)' }}>Security Clearance Portal</h1>
        <p className="page-subtitle" style={{ fontSize: 'var(--text-lg)' }}>Institutional-Grade Identity Verification Matrix</p>
      </motion.div>

      {/* Trust Tier Shields */}
      <TrustTierRow completedLayers={completedLayers} layerA={layerA} layerB={layerB} layerC={layerC} layerD={layerD} />

      {/* Three-Pillar Bento Grid */}
      <motion.div className="clearance-bento" variants={itemVariants}>

        {/* MODULE A: Sovereign Human ID (left, full height) */}
        <motion.div className="clearance-module module-a" variants={itemVariants}>
          <ScanOverlay active={scanningModule === 'a'} label="Sealing Protocol" />
          <div className="clearance-module-header">
            <div className="clearance-module-eyebrow">Module A</div>
            <h2 className="clearance-module-title">Kyrti Human ID</h2>
            <p className="clearance-module-subtitle">Individual KYC & Biometric Authority</p>
          </div>

          {/* SSO Status */}
          <div className="clearance-section">
            <div className="clearance-section-header">
              <div className="clearance-section-title">
                <Fingerprint size={16} style={{ color: layerA.status === 'verified' ? 'var(--color-accent-emerald)' : 'var(--color-text-muted)' }} />
                SSO Authentication
              </div>
              {layerA.status === 'verified' && (
                <span className="clearance-verified-badge"><Check size={10} /> Sealed</span>
              )}
            </div>
            {layerA.status === 'verified' ? (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                Authenticated via <strong>{layerA.provider}</strong> at <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{new Date(layerA.verifiedAt).toLocaleString()}</span>
              </div>
            ) : (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Awaiting SSO authentication...</p>
            )}
          </div>

          {/* KYB Section */}
          <div className="clearance-section">
            <div className="clearance-section-header">
              <div className="clearance-section-title">
                <Building2 size={16} style={{ color: layerB.status === 'verified' ? 'var(--color-accent-emerald)' : 'var(--color-accent-gold)' }} />
                Business Verification (KYB)
              </div>
              {layerB.status === 'verified' && (
                <span className="clearance-verified-badge"><Check size={10} /> Sealed</span>
              )}
            </div>

            {layerA.status === 'verified' && layerB.status !== 'verified' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <FileUploader onFileEncrypted={handleFileEncrypted} disabled={kybLoading} />
                {layerB.govApiStatus === 'verifying' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'rgba(245,158,11,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <Loader2 size={14} className="animate-spin" style={{ color: 'var(--color-accent-amber)' }} />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-amber)' }}>Government API Bridge — Verification Pending</span>
                  </div>
                )}
                <Button variant="primary" onClick={handleSealProtocol} loading={kybLoading} disabled={layerB.documents.length === 0} id="seal-protocol-btn">
                  <Scan size={16} /> Seal Protocol
                </Button>
              </div>
            )}

            {layerB.status === 'verified' && (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <strong>{layerB.businessName}</strong> — <span style={{ fontFamily: 'var(--font-mono)' }}>{layerB.registrationNumber}</span>
              </div>
            )}

            {layerA.status !== 'verified' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                <Lock size={12} /> Complete SSO authentication to unlock
              </div>
            )}
          </div>

          <VerificationLog lines={logLines.a} />
        </motion.div>

        {/* MODULE B: Corporate Legal Entity (top-right) */}
        <motion.div className="clearance-module" variants={itemVariants}>
          <ScanOverlay active={scanningModule === 'b'} label="Verifying Authority" />
          <div className="clearance-module-header">
            <div className="clearance-module-eyebrow">Module B</div>
            <h2 className="clearance-module-title">Corporate Legal Entity</h2>
            <p className="clearance-module-subtitle">KYB & Institutional Registration</p>
          </div>

          {/* DNS Verification */}
          <div className="clearance-section">
            <div className="clearance-section-header">
              <div className="clearance-section-title">
                <Globe size={16} style={{ color: 'var(--color-accent-gold)' }} />
                DNS Domain Verification
              </div>
              <StatusIndicator status={layerC.dnsStatus === 'verified' ? 'active' : layerC.dnsStatus === 'pending' ? 'pending' : 'inactive'} label={layerC.dnsStatus === 'verified' ? 'Verified' : layerC.dnsStatus === 'pending' ? 'Pending' : 'Awaiting'} />
            </div>

            {layerB.status === 'verified' && layerC.dnsStatus !== 'verified' && !dnsRecord && (
              <Button variant="secondary" size="sm" onClick={handleGenerateDNS} loading={dnsLoading} id="generate-dns-btn">Generate TXT Record</Button>
            )}
            {dnsRecord && layerC.dnsStatus !== 'verified' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <CopyToClipboard text={dnsRecord} label="Add this TXT record to your DNS" />
                <Button variant="primary" size="sm" onClick={handleVerifyDNS} loading={dnsLoading} icon={RefreshCw} id="verify-dns-btn">Anchor Identity</Button>
              </div>
            )}
            {layerB.status !== 'verified' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                <Lock size={12} /> Complete KYB to unlock
              </div>
            )}
          </div>

          {/* Email Verification */}
          <div className="clearance-section">
            <div className="clearance-section-header">
              <div className="clearance-section-title">
                <Mail size={16} style={{ color: 'var(--color-accent-gold)' }} />
                Corporate Email Handshake
              </div>
              <StatusIndicator status={layerC.emailStatus === 'verified' ? 'active' : emailSent ? 'pending' : 'inactive'} label={layerC.emailStatus === 'verified' ? 'Verified' : emailSent ? 'Link Sent' : 'Awaiting'} />
            </div>

            {layerB.status === 'verified' && layerC.emailStatus !== 'verified' && !emailSent && (
              <Button variant="secondary" size="sm" onClick={handleSendMagicLink} loading={emailLoading} icon={Mail} id="send-magic-link-btn">Send Magic Link</Button>
            )}
            {emailSent && layerC.emailStatus !== 'verified' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Verification link dispatched to corporate email. Click the link, then seal.</p>
                <Button variant="primary" size="sm" onClick={handleVerifyEmail} loading={emailLoading} icon={Check} id="verify-email-btn">Anchor Identity</Button>
              </div>
            )}
          </div>

          {/* Multi-Sig */}
          <div className="clearance-section">
            <div className="clearance-section-header">
              <div className="clearance-section-title">
                <Users size={16} style={{ color: 'var(--color-accent-amber)' }} />
                Multi-Sig Board Approval
              </div>
              <Badge color="amber">Enterprise</Badge>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              Governance Threshold: 2 of 3 board member signatures required. Available after DNS and Email verification.
            </p>
          </div>

          <VerificationLog lines={logLines.b} />
        </motion.div>

        {/* MODULE C: Cryptographic Authority (bottom-right) */}
        <motion.div className="clearance-module" variants={itemVariants}>
          <ScanOverlay active={scanningModule === 'c'} label="Anchoring Authority" />
          <div className="clearance-module-header">
            <div className="clearance-module-eyebrow">Module C</div>
            <h2 className="clearance-module-title">Cryptographic Authority</h2>
            <p className="clearance-module-subtitle">DID / Wallet / Multi-Sig Anchoring</p>
          </div>

          <div className="clearance-section">
            <div className="clearance-section-header">
              <div className="clearance-section-title">
                <KeyRound size={16} style={{ color: layerD.status === 'verified' ? 'var(--color-accent-emerald)' : 'var(--color-accent-gold)' }} />
                Web3 Wallet Binding
              </div>
              {layerD.status === 'verified' && (
                <span className="clearance-verified-badge"><Check size={10} /> Anchored</span>
              )}
            </div>

            {completedLayers.includes('C_EMAIL') && layerD.status !== 'verified' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Connect your wallet and sign a binding message. This permanently links your wallet to your verified Business ID.
                </p>
                {walletError && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-rose)' }}>{walletError}</p>}
                <Button variant="primary" onClick={handleAnchorCrypto} loading={isConnecting} icon={Wallet} id="anchor-crypto-btn">
                  Anchor Cryptographic Authority
                </Button>
              </div>
            )}

            {layerD.status === 'verified' && (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <CopyToClipboard text={layerD.walletAddress} label="Bound Wallet Address" />
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>
                  Bound at {new Date(layerD.boundAt).toLocaleString()} via {layerD.walletProvider}
                </p>
              </div>
            )}

            {!completedLayers.includes('C_EMAIL') && layerD.status !== 'verified' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                <Lock size={12} /> Complete Authority Verification to unlock
              </div>
            )}
          </div>

          <VerificationLog lines={logLines.c} />
        </motion.div>
      </motion.div>

      {/* Kyrti Revocation */}
      <motion.div className="revocation-section" variants={itemVariants}>
        <div className="revocation-card">
          <h3 className="revocation-title">Kyrti Revocation</h3>
          <p className="revocation-subtitle">Emergency Protocol — Instant Memory Wipe</p>
          <button className="revocation-btn" onClick={handleRevocation} id="revocation-btn">
            <AlertTriangle size={16} />
            Initiate Kyrti Revocation
          </button>
          <p className="revocation-warning">
            This action will permanently destroy all AI episodic memory and revoke all identity attestations.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export { IdentityPage };
