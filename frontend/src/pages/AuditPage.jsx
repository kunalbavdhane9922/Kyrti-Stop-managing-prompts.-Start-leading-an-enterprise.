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
import { platformApi } from '../services/platformApi.js';

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
    platformApi.getZKProofs().then(setZkProofs);
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
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div className="audit-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title">Audit & Security Dashboard</h1>
        <p className="page-subtitle">Immutable accountability logs, session monitoring, and zero-knowledge proofs</p>
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
