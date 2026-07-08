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
import { platformApi } from '../services/platformApi.js';

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
        const data = await platformApi.getDPEProposals();
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
      transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div className="dpe-pipeline-page" variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title">DPE Pipeline</h1>
        <p className="page-subtitle">Draft → Propose → Execute — Human-in-the-Loop approval rail</p>
      </motion.div>

      {/* HITL Notice */}
      <motion.div className="m2-info-bar" style={{ borderColor: 'rgba(212, 132, 46, 0.2)', background: 'rgba(212, 132, 46, 0.08)' }} variants={itemVariants}>
        <Shield size={14} style={{ color: '#D4842E', flexShrink: 0 }} />
        <span>No AI agent can execute proposals. Every action requires explicit human authorization through this pipeline.</span>
      </motion.div>

      {/* Stats */}
      <div className="security-stats-grid" style={{ marginBottom: 'var(--space-5)' }}>
        {[
          { label: 'Drafts', value: drafts.length, icon: FileText, color: '#334155' },
          { label: 'Proposed', value: proposed.length, icon: Send, color: '#D4842E' },
          { label: 'Approved', value: approved.length, icon: CheckCircle, color: '#E8943A' },
          { label: 'Executed', value: executed.length, icon: Zap, color: '#FF5C00' },
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
                    <CheckCircle size={11} style={{ color: '#E8943A' }} /> {new Date(e.executedAt).toLocaleString()}
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
