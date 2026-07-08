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
import { platformApi } from '../services/platformApi.js';

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
          platformApi.getAuditHashes(),
          platformApi.getForensicTimeline(),
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
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div className="forensic-audit-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title">Forensic Audit Suite</h1>
        <p className="page-subtitle">Immutable transparency — cryptographically verified execution records</p>
      </motion.div>

      {/* Stats */}
      <motion.div className="security-stats-grid" style={{ marginBottom: 'var(--space-5)' }} variants={itemVariants}>
        {[
          { label: 'Total Records', value: stats.total, icon: Hash, color: '#334155' },
          { label: 'Info', value: stats.info, icon: FileText, color: '#FF5C00' },
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
