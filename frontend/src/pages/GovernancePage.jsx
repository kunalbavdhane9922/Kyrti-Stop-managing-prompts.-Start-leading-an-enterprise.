import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Check, X, Play, AlertTriangle, Bot,
  Shield, Trash2, Clock, ChevronRight, Scale, ShieldAlert,
  Activity, Users
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { SafeRenderer } from '../components/common/SafeRenderer.jsx';
import { TierGate } from '../components/layout/TierGate.jsx';
import { useGovernanceStore } from '../store/governanceStore.js';
import { usePermission } from '../hooks/usePermission.js';
import { usePolicyValidator } from '../hooks/usePolicyValidator.js';
import { platformApi } from '../services/platformApi.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';

/**
 * Sovereign Protocol — Governance Page (Redesign)
 * "The Policy Engine"
 */

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

/* ── Metric Tile ── */
function MetricTile({ label, value, sub, icon: Icon, color }) {
  return (
    <motion.div variants={anim.item}>
      <Card hover style={{ padding: 'var(--space-4) var(--space-5)', height: '100%', transition: 'box-shadow 0.4s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} style={{ color }} />
          </div>
        </div>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 700, color: color || 'var(--color-text-primary)', lineHeight: 1.1 }}>{value}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)' }}>{sub}</span>
        </div>
      </Card>
    </motion.div>
  );
}

function GovernancePage() {
  const { can } = usePermission();
  const { isPaused, activeBlocker, clearPause } = usePolicyValidator();
  const {
    proposals, blockerReports, agents,
    addProposal, approveProposal, rejectProposal,
    executeProposal, resolveBlockerReport, addAgent, terminateAgent,
    addBlockerReport,
  } = useGovernanceStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const loadData = async () => {
      try {
        const [proposalData, agentData, blockerData] = await Promise.all([
          platformApi.getProposals(),
          platformApi.getAgents(),
          platformApi.getBlockerReports(),
        ]);
        if (useGovernanceStore.getState().proposals.length === 0) {
          proposalData.forEach(p => addProposal(p));
          agentData.forEach(a => addAgent(a));
          blockerData.forEach(b => addBlockerReport(b));
        }
        setLoaded(true);
      } catch (err) { /* handled */ }
    };
    loadData();
  }, [loaded, addProposal, addAgent, addBlockerReport]);

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

  return (
    <TierGate requiredTier={2} requiredFeature="governance">
      <motion.div variants={anim.container} initial="hidden" animate="show" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gridTemplateRows: 'auto auto minmax(0, 1fr)',
        gap: 'var(--space-5)',
        height: '100%',
        overflow: 'hidden',
        padding: 'var(--space-2) 0',
      }}>

        {/* ═══ ROW 0: HEADER ═══ */}
        <motion.div variants={anim.item} style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>Deterministic Governance</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}>
              Human-centric control — AI agents execute, humans decide
            </p>
          </div>
          {isPaused ? (
            <Badge color="rose" icon={ShieldAlert}>SYSTEM PAUSED</Badge>
          ) : (
            <Badge color="emerald" icon={Shield}>Optimal</Badge>
          )}
        </motion.div>

        {/* ═══ ROW 1: KPIs ═══ */}
        <MetricTile
          label="Total Proposals" value={proposals.length.toString()}
          sub="Lifetime pipeline volume" icon={FileText} color="var(--color-accent-blue)"
        />
        <MetricTile
          label="Awaiting Approval" value={proposedProposals.length.toString()}
          sub="Requires founder signature" icon={Clock} color="var(--color-accent-amber)"
        />
        <MetricTile
          label="Active Agents" value={activeAgents.length.toString()}
          sub="Operational digital workforce" icon={Users} color="var(--color-accent-cyan)"
        />
        <MetricTile
          label="Security Posture" value={isPaused ? 'PAUSE STATE' : 'Optimal'}
          sub={isPaused ? `${unresolvedBlockers.length} unhandled violations` : 'Zero active blockers'}
          icon={isPaused ? AlertTriangle : Check} color={isPaused ? 'var(--color-accent-rose)' : 'var(--color-accent-emerald)'}
        />

        {/* ═══ ROW 2 COL 1-3: DPE KANBAN BOARD ═══ */}
        <motion.div variants={anim.item} style={{ gridColumn: 'span 3', minHeight: 0 }}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>Draft-Propose-Execute Pipeline</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)' }}>Strict linear execution logic</span>
              </div>
              <Badge color="violet">Non-Executable Until Approved</Badge>
            </div>
            
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-4)', minHeight: 0 }}>
              
              {/* Column 1: Drafts */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Drafts</span>
                  <Badge color="default">{draftProposals.length}</Badge>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {draftProposals.map(p => (
                    <div key={p.id} style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-primary)' }}>{p.title}</h4>
                      <SafeRenderer content={p.description} agentId={p.agentId} context="dpe_draft" />
                      <div style={{ marginTop: 12, borderTop: '1px dashed var(--color-border-secondary)', paddingTop: 12 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-muted)' }}>AGENT: {p.agentName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Under Review */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Under Review</span>
                  <Badge color="blue">{proposedProposals.length}</Badge>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {proposedProposals.map(p => (
                    <div key={p.id} style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-accent-blue)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', boxShadow: '0 0 0 1px rgba(59,130,246,0.1) inset' }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-primary)' }}>{p.title}</h4>
                      <SafeRenderer content={p.description} agentId={p.agentId} context="dpe_review" />
                      <div style={{ marginTop: 12, borderTop: '1px dashed var(--color-border-secondary)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-muted)' }}>AGENT: {p.agentName}</span>
                        {can('canApproveProposals') && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Button variant="success" size="sm" icon={Check} onClick={() => handleApprove(p.id)} style={{ flex: 1, padding: '4px 8px', fontSize: 11 }}>Approve</Button>
                            <Button variant="danger" size="sm" icon={X} onClick={() => handleReject(p.id)} style={{ flex: 1, padding: '4px 8px', fontSize: 11 }}>Reject</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Executed */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ready / Executed</span>
                  <Badge color="emerald">{approvedProposals.length}</Badge>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {approvedProposals.map(p => (
                    <div key={p.id} style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{p.title}</h4>
                        <Badge color={p.status === 'executed' ? 'emerald' : 'blue'} style={{ flexShrink: 0 }}>{p.status}</Badge>
                      </div>
                      <div style={{ marginTop: 12, borderTop: '1px dashed var(--color-border-secondary)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-muted)' }}>AGENT: {p.agentName}</span>
                        {p.status === 'approved' && can('canExecuteProposals') && (
                          <Button variant="primary" size="sm" icon={Play} onClick={() => handleExecute(p.id)} style={{ width: '100%', fontSize: 11 }}>Execute Now</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Card>
        </motion.div>

        {/* ═══ ROW 2 COL 4: POLICY & WORKFORCE CONTROL ═══ */}
        <motion.div variants={anim.item} style={{ minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', height: '100%' }}>
            
            {/* Blocker Reports (Top Half) */}
            <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--space-4) var(--space-5)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexShrink: 0 }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Policy Violations</h3>
                <Badge color={unresolvedBlockers.length > 0 ? 'rose' : 'emerald'}>{unresolvedBlockers.length}</Badge>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingRight: 4 }}>
                {unresolvedBlockers.length === 0 ? (
                  <div style={{ padding: 'var(--space-6) 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 12 }}>
                    <Shield size={24} style={{ margin: '0 auto var(--space-2)', opacity: 0.4 }} />
                    No active policy violations.
                  </div>
                ) : unresolvedBlockers.map(report => (
                  <div key={report.id} style={{
                    padding: 'var(--space-3)', background: 'rgba(244,63,94,0.04)',
                    border: '1px solid var(--color-accent-rose)', borderRadius: 'var(--radius-md)', flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-accent-rose)', textTransform: 'uppercase' }}>{report.type.replace(/_/g, ' ')}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-muted)' }}>{report.id.slice(0, 8)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                      Agent: <span style={{ fontFamily: 'var(--font-mono)' }}>{report.agentName || report.agentId}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
                      {report.violations?.join(' | ')}
                    </div>
                    <Button variant="danger" size="sm" onClick={() => resolveBlockerReport(report.id, 'founder', 'reviewed')} style={{ width: '100%', fontSize: 10, padding: '4px' }}>
                      Acknowledge & Resolve
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Agent Roster (Bottom Half) */}
            {can('canHireAgents') && (
              <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--space-4) var(--space-5)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexShrink: 0 }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Agent Roster</h3>
                  <Badge color="cyan">No Exec Rights</Badge>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingRight: 4 }}>
                  {activeAgents.map(agent => (
                    <div key={agent.id} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                      padding: '8px', background: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)',
                      flexShrink: 0
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border-secondary)' }}>
                        <Bot size={14} style={{ color: 'var(--color-text-secondary)' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-muted)' }}>{agent.department}</div>
                      </div>
                      <button 
                        onClick={() => handleTerminate(agent.id)}
                        title="Terminate Agent"
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-rose)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
          </div>
        </motion.div>

      </motion.div>
    </TierGate>
  );
}

export { GovernancePage };
