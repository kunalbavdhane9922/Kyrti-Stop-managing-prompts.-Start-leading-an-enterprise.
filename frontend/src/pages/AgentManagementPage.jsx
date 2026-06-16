import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, Bot, Cpu, Lock, Unlock, Database,
  Zap, XCircle, Activity, ChevronRight, Crown, Users, Terminal
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { Button } from '../components/common/Button.jsx';
import { platformApi } from '../services/platformApi.js';
import { useAgentOSStore } from '../store/agentOSStore.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { useAuthStore } from '../store/authStore.js';
import { usePermission } from '../hooks/usePermission.js';

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

function AgentManagementPage() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draggedAgentId, setDraggedAgentId] = useState(null);
  
  const { agents, selectedAgentId, memoryVaults, detachmentState, setAgents, setMemoryVault, selectAgent, promoteAgent, initiateDetachment, cancelDetachment, confirmDetachment } = useAgentOSStore();
  const user = useAuthStore(s => s.user);
  const { can } = usePermission();

  useEffect(() => {
    if (dataLoaded) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [agentData] = await Promise.all([ platformApi.getAgentOS() ]);
        // Only set if empty
        if (useAgentOSStore.getState().agents.length === 0) {
          setAgents(agentData);
          for (const agent of agentData) {
            const vault = await platformApi.getAgentMemoryVault(agent.id);
            setMemoryVault(agent.id, vault);
          }
        }
        if (agentData.length > 0 && !selectedAgentId) selectAgent(agentData[0].id);
        setDataLoaded(true);
      } catch (e) { /* mock */ }
      setLoading(false);
    };
    loadData();
  }, [dataLoaded, selectedAgentId, setAgents, setMemoryVault, selectAgent, setLoading]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const selectedVault = selectedAgentId ? memoryVaults[selectedAgentId] : null;

  /* Drag and Drop Logic */
  const handleDragStart = (e, agentId) => {
    setDraggedAgentId(agentId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetTier) => {
    e.preventDefault();
    if (!draggedAgentId) return;
    const agent = agents.find(a => a.id === draggedAgentId);
    if (agent && agent.tier !== targetTier) {
      promoteAgent(agent.id, targetTier);
      AuditLogger.log({
        action: 'AGENT_PROMOTION',
        details: `Agent ${agent.id} promoted/demoted to Tier ${targetTier}`,
      });
    }
    setDraggedAgentId(null);
  };

  const handleConfirmDetach = () => {
    confirmDetachment();
    AuditLogger.log({
      action: AUDIT_ACTIONS.AGENT_DETACHMENT,
      agentId: detachmentState.targetAgentId,
      userId: user?.id,
      context: 'org_structure',
      details: 'Agent memory wiped and cryptographic access revoked',
    });
  };

  const showDetachModal = detachmentState.isActive && detachmentState.confirmationStep === 1;

  const tiers = [
    { level: 1, title: 'Tier 1: Executive Directors', model: 'GPT-4o', budget: 'Unlimited', icon: Crown, color: 'var(--color-accent-gold)' },
    { level: 2, title: 'Tier 2: Senior Managers', model: 'Llama-3-70B', budget: '$10k/day', icon: Users, color: 'var(--color-accent-blue)' },
    { level: 3, title: 'Tier 3: Execution Specialists', model: 'Llama-3-8B', budget: '$1k/day', icon: Terminal, color: 'var(--color-text-secondary)' },
  ];

  return (
    <>
      <motion.div variants={anim.container} initial="hidden" animate="show" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 340px',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        gap: 'var(--space-5)',
        height: '100%',
        overflow: 'hidden',
        padding: 'var(--space-2) 0',
      }}>

        {/* ═══ ROW 0: HEADER ═══ */}
        <motion.div variants={anim.item} style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>Digital Org Structure</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}>
              Chain of command, resource allocation, and instant model upgrades
            </p>
          </div>
          <Badge color="blue" icon={Bot}>{agents.filter(a => a.status === 'active').length} Active Agents</Badge>
        </motion.div>

        {/* ═══ ROW 1 COL 1: DYNAMIC ORG CHART ═══ */}
        <motion.div variants={anim.item} style={{ minHeight: 0, overflowY: 'auto', paddingRight: 'var(--space-2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {tiers.map(tier => {
              const tierAgents = agents.filter(a => a.tier === tier.level);
              
              return (
                <div key={tier.level} style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Tier Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                    <div style={{ padding: '6px', background: 'var(--color-bg-secondary)', border: `1px solid var(--color-border-primary)`, borderRadius: 'var(--radius-md)' }}>
                      <tier.icon size={16} style={{ color: tier.color }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{tier.title}</h3>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', display: 'flex', gap: 'var(--space-3)' }}>
                        <span>Model: {tier.model}</span>
                        <span>Authority: {tier.budget}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dropzone Area */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, tier.level)}
                    style={{
                      minHeight: 120,
                      background: 'var(--color-bg-secondary)',
                      border: `1px dashed var(--color-border-primary)`,
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-4)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                      gap: 'var(--space-4)',
                      transition: 'background 0.2s',
                    }}
                  >
                    {tierAgents.length === 0 ? (
                      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', fontSize: 12 }}>
                        Drag agents here to assign
                      </div>
                    ) : tierAgents.map(agent => {
                      const isActive = selectedAgentId === agent.id;
                      
                      return (
                        <div
                          key={agent.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, agent.id)}
                          onClick={() => selectAgent(agent.id)}
                          style={{
                            background: isActive ? 'var(--color-bg-primary)' : 'var(--color-bg-tertiary)',
                            border: `1px solid ${isActive ? tier.color : 'var(--color-border-secondary)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-3)',
                            cursor: 'grab',
                            boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)' }}>{agent.name}</div>
                            <Badge color={agent.status === 'active' ? 'emerald' : 'rose'}>{agent.status}</Badge>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 8 }}>{agent.role}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-muted)' }}>
                            <span>{agent.department}</span>
                            <span>{agent.executionState.toUpperCase()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ ROW 1 COL 2: AGENT DOSSIER ═══ */}
        <motion.div variants={anim.item} style={{ minHeight: 0 }}>
          {selectedAgent ? (
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-4) var(--space-5)', overflowY: 'auto' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{selectedAgent.name}</h2>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{selectedAgent.role}</div>
              </div>

              {/* Specs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border-secondary)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Cognitive Core</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedAgent.model}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border-secondary)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Context Window</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)' }}>{(selectedAgent.contextWindowSize / 1000).toFixed(0)}k Tokens</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border-secondary)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Execution Accuracy</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--color-accent-emerald)' }}>{selectedAgent.accuracy}%</span>
                </div>
              </div>

              {/* Memory Vault Context */}
              {selectedVault && (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                    <Database size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                    Cryptographic Memory
                  </h3>
                  <div style={{ background: 'var(--color-bg-tertiary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Status</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: selectedVault.episodicMemory.status === 'encrypted' ? 'var(--color-accent-emerald)' : 'var(--color-accent-rose)' }}>
                        {selectedVault.episodicMemory.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Entries</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-secondary)' }}>{selectedVault.episodicMemory.entryCount.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Utilization</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-secondary)' }}>{selectedVault.contextWindow.utilizationPercent}%</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: 'var(--color-bg-secondary)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${selectedVault.contextWindow.utilizationPercent}%`, background: 'var(--color-accent-blue)' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Kill Switch */}
              <div style={{ marginTop: 'auto' }}>
                {can('canWipeAgentMemory') && selectedAgent.status === 'active' ? (
                  <div style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-accent-rose)', marginBottom: 8, fontWeight: 600, fontSize: 12 }}>
                      <ShieldAlert size={14} /> Authority Revocation
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                      Instantly wipe this agent's episodic memory and revoke all cryptographic vault access. Irreversible.
                    </p>
                    <Button variant="danger" size="sm" onClick={() => initiateDetachment(selectedAgent.id)} style={{ width: '100%' }}>
                      Revoke Access
                    </Button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 12 }}>
                    <XCircle size={20} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                    Access Revoked / Terminated
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
              Select an agent to view dossier
            </Card>
          )}
        </motion.div>

      </motion.div>

      {/* Detachment Confirmation Modal */}
      <Modal
        isOpen={showDetachModal}
        onClose={cancelDetachment}
        title="Confirm Authority Revocation"
      >
        <div style={{ padding: 'var(--space-4)', background: 'rgba(244,63,94,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244,63,94,0.2)', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-accent-rose)', fontWeight: 600, marginBottom: 8 }}>
            <ShieldAlert size={18} /> Irreversible Action
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            The agent's episodic memory will be cryptographically orphaned. All system access will be terminated.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <Button variant="secondary" onClick={cancelDetachment}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDetach}>Confirm Revocation</Button>
        </div>
      </Modal>
    </>
  );
}

export { AgentManagementPage };
