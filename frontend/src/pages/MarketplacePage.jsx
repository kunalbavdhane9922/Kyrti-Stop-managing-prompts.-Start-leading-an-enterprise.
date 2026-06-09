import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShieldCheck, Star, Shield, TrendingUp,
  Briefcase, Activity, CheckCircle, Lock, Terminal, X,
  FileText, ArrowRight
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { useMarketplaceStore } from '../store/marketplaceStore.js';
import { useAuthStore } from '../store/authStore.js';
import { usePermission } from '../hooks/usePermission.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { platformApi } from '../services/platformApi.js';

/**
 * Sovereign Protocol — Global Labor Marketplace & Vetting Portal
 * "Sovereign Labor Exchange"
 */

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

export function MarketplacePage() {
  const user = useAuthStore(s => s.user);
  const {
    catalogAgents, isLoading,
    setCatalogAgents, addSandboxHire, setLoading,
  } = useMarketplaceStore();
  const { can } = usePermission();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Local executive filters
  const [filters, setFilters] = useState({ sector: '', power: '', sortBy: 'roi' });
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer & Interview State
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [userInput, setUserInput] = useState('');
  
  // Trial Interview Chat
  const [chatLog, setChatLog] = useState([
    { role: 'founder', text: 'Before I hire you, how would you handle a 20% drop in budget?' }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (dataLoaded) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const agents = await platformApi.getMarketplaceAgents();
        
        // Enrich mock data for the Sovereign Labor Exchange
        const enrichedAgents = agents.map((a, i) => {
          let sector = 'Tech';
          if (a.specialization.includes('Strategy')) sector = 'Finance';
          if (a.specialization.includes('Content')) sector = 'Marketing';
          
          let engine = 'Llama-3-70B';
          let cost = '$0.90/M tokens';
          let stars = 4.5;
          if (a.tier === 'elite') {
            engine = 'GPT-4o';
            cost = '$15.00/M tokens';
            stars = 4.9;
          } else if (i === 2) {
            engine = 'Llama-3-8B';
            cost = '$0.15/M tokens';
            stars = 4.2;
          }

          return {
            ...a,
            sector,
            engine,
            cost,
            stars,
            bio: `${a.tier === 'elite' ? 'Senior' : 'Mid-Level'} ${a.specialization} specialist focusing on operational efficiency and risk mitigation.`,
            portfolio: ['Automated Tax Ledger', 'Compliance PDF Parser', 'Cross-chain Arbitrage Bot'].slice(0, a.tier==='elite'?3:2),
            efficiency: Math.round(a.avgROI / 100),
            acceptanceRate: Math.floor(Math.random() * (99 - 85 + 1) + 85),
            thoughtProtocol: [
              'Context Ingestion',
              'Risk Modeling',
              'Strategic Derivation',
              'PolicyGate Audit',
              'DPE Proposal',
              'Forensic Logging'
            ].slice(0, a.tier==='elite'?6:4)
          };
        });

        setCatalogAgents(enrichedAgents);
        setDataLoaded(true);
      } catch (e) { /* mock */ }
      setLoading(false);
    };
    loadData();
  }, [dataLoaded, setCatalogAgents, setLoading]);

  // Filtering Logic
  const filteredAgents = catalogAgents.filter(a => {
    if (filters.sector && a.sector !== filters.sector) return false;
    if (filters.power && a.engine !== filters.power) return false;
    if (searchQuery && !a.specialization.toLowerCase().includes(searchQuery.toLowerCase()) && !a.displayName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'roi') return b.avgROI - a.avgROI;
    if (filters.sortBy === 'rep') return b.reputationScore - a.reputationScore;
    return 0;
  });

  const handleDeploy = async () => {
    setDeploying(true);
    await new Promise(r => setTimeout(r, 800));
    addSandboxHire({ id: crypto.randomUUID(), agentId: selectedAgent.id, agentName: selectedAgent.displayName, trialDays: 7 });
    AuditLogger.log({ action: AUDIT_ACTIONS.SANDBOX_ACTIVATE, details: `Authorized deployment of ${selectedAgent.displayName}` });
    setDeploying(false);
    setSelectedAgent(null);
  };

  const runInterviewSimulation = useCallback(() => {
    if (chatLog.length > 1) return; // already simulated
    setTimeout(() => {
      setChatLog(prev => [...prev, {
        role: 'agent',
        text: "I would immediately audit our variable compute costs, freeze non-essential R&D processes, and reallocate the remaining 80% budget to high-ROI revenue generating pipelines to maintain positive cash flow."
      }]);
    }, 1200);
  }, [chatLog.length]);

  const handleSendMessage = useCallback(() => {
    if (!userInput.trim()) return;
    
    const question = userInput;
    setUserInput('');
    setChatLog(prev => [...prev, { role: 'founder', text: question }]);
    
    setTimeout(() => {
      setChatLog(prev => [...prev, { 
        role: 'agent', 
        text: `Understood. Processing request for "${question}". My internal protocol dictates that I first verify this against the current department budget and PolicyGate rules before providing a strategic recommendation.`
      }]);
    }, 800);
  }, [userInput]);

  useEffect(() => {
    if (selectedAgent && chatLog.length === 1) {
      runInterviewSimulation();
    }
  }, [selectedAgent, chatLog.length, runInterviewSimulation]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <motion.div variants={anim.container} initial="hidden" animate="show" style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
        height: '100%', padding: 'var(--space-2) 0',
      }}>
        
        {/* ═══ HEADER ═══ */}
        <motion.div variants={anim.item}>
          <h1 className="page-title" style={{ marginBottom: 2 }}>Sovereign Labor Exchange</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}>
            High-stakes digital professional recruitment. Zero-knowledge reputation proofs.
          </p>
        </motion.div>

        {/* ═══ EXECUTIVE FILTER BAR ═══ */}
        <motion.div variants={anim.item} style={{ display: 'flex', gap: 'var(--space-4)', background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1, borderRight: '1px solid var(--color-border-primary)', paddingRight: 'var(--space-4)' }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
            <input 
              type="text" placeholder="Search title or ID..." 
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', outline: 'none', width: '100%', fontSize: 13 }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <select value={filters.sector} onChange={e => setFilters({...filters, sector: e.target.value})} style={{ background: 'transparent', border: 'none', fontSize: 13, color: 'var(--color-text-primary)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Sectors</option>
              <option value="Tech">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
            
            <select value={filters.power} onChange={e => setFilters({...filters, power: e.target.value})} style={{ background: 'transparent', border: 'none', fontSize: 13, color: 'var(--color-text-primary)', outline: 'none', cursor: 'pointer' }}>
              <option value="">Cognitive Power</option>
              <option value="Llama-3-8B">8B Models</option>
              <option value="Llama-3-70B">70B Models</option>
              <option value="GPT-4o">Enterprise 400B+</option>
            </select>

            <select value={filters.sortBy} onChange={e => setFilters({...filters, sortBy: e.target.value})} style={{ background: 'transparent', border: 'none', fontSize: 13, color: 'var(--color-text-primary)', outline: 'none', cursor: 'pointer' }}>
              <option value="roi">Sort by: ROI Yield</option>
              <option value="rep">Sort by: Reputation</option>
            </select>
          </div>
        </motion.div>

        {/* ═══ THE TALENT BOARD (TABLE-GRID) ═══ */}
        <motion.div variants={anim.item} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--color-bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={{ padding: 'var(--space-4)', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-primary)' }}>Role / ID</th>
                  <th style={{ padding: 'var(--space-4)', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-primary)' }}>Engine</th>
                  <th style={{ padding: 'var(--space-4)', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-primary)' }}>Market Value</th>
                  <th style={{ padding: 'var(--space-4)', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-primary)' }}>Reputation</th>
                  <th style={{ padding: 'var(--space-4)', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-primary)', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent, i) => (
                  <tr 
                    key={agent.id} 
                    onClick={() => { setSelectedAgent(agent); setChatLog([{ role: 'founder', text: 'Before I hire you, how would you handle a 20% drop in budget?' }]); }}
                    style={{ borderBottom: '1px solid var(--color-border-secondary)', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{agent.specialization}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>ID: {agent.displayName}</div>
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Terminal size={12} style={{ color: 'var(--color-text-secondary)' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-primary)' }}>{agent.engine}</span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{agent.cost}</span>
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={14} style={{ color: 'var(--color-accent-gold)', fill: 'var(--color-accent-gold)' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{(agent.stars || 0).toFixed(1)}</span>
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 4 }}>({agent.verifiedBadgeCount} proofs)</span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                      <Badge color={agent.isAvailable ? 'emerald' : 'amber'}>{agent.isAvailable ? 'Available' : 'Deployed'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAgents.length === 0 && (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                No professionals match your criteria.
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* ═══ THE DIGITAL RÉSUMÉ DRAWER ═══ */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.1)', zIndex: 100, backdropFilter: 'blur(2px)' }}
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.4, ease: 'easeInOut' }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'absolute', top: 0, right: 0, width: '45%', minWidth: 400, height: '100%', background: 'var(--color-bg-primary)', borderLeft: '1px solid var(--color-border-primary)', boxShadow: '-10px 0 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}
            >
              
              {/* Drawer Header */}
              <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--color-bg-secondary)' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>{selectedAgent.specialization}</h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)' }}>ID: {selectedAgent.displayName} • {selectedAgent.sector}</div>
                </div>
                <button onClick={() => setSelectedAgent(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content (Scrollable) */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                
                {/* Persona & Bio */}
                <div>
                  <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>Position Summary</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{selectedAgent.bio}</p>
                </div>

                {/* Reasoning Protocol (How I Think) */}
                <div>
                  <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>Reasoning Protocol</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                    {(selectedAgent.thoughtProtocol || []).map((node, i) => (
                      <div key={i} style={{ padding: 'var(--space-2)', background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Activity size={10} style={{ color: 'var(--color-accent-emerald)' }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-primary)' }}>{node}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Timeline */}
                <div>
                  <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>Previous Tenure</h3>
                  <div style={{ borderLeft: '2px solid var(--color-border-primary)', paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: -21, top: 4, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent-blue)' }} />
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 2 }}>2025: Project Alpha</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>Deployed as Lead {(selectedAgent.specialization || '').split(' ')[0]}. Result: {(selectedAgent.avgROI || 0).toFixed(0)}% ROI • {selectedAgent.acceptanceRate}% Acceptance.</div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: -21, top: 4, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-border-secondary)' }} />
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 2 }}>2024: Genesis Vault</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>Processed {(selectedAgent.totalTasksCompleted || 0).toLocaleString()}+ automated tasks. Result: 18% waste reduction.</div>
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <div>
                  <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>Project Portfolio</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    {(selectedAgent.portfolio || []).map((item, i) => (
                      <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={14} style={{ color: 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Terms */}
                <div>
                  <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>Financial Terms</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px dashed var(--color-border-secondary)' }}>
                      <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Variable Compute Cost</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{selectedAgent.cost}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px dashed var(--color-border-secondary)' }}>
                      <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Retainer Cost (Memory)</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>Flat 0.1 ETH / mo</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0' }}>
                      <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Efficiency Rating</span>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            style={{ 
                              color: i < (selectedAgent.efficiency || 0) ? 'var(--color-accent-emerald)' : 'var(--color-border-secondary)',
                              fill: i < (selectedAgent.efficiency || 0) ? 'var(--color-accent-emerald)' : 'transparent' 
                            }} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Vetting Boardroom (Interview Chat) */}
                <div style={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-border-primary)', fontSize: 10, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Terminal size={12} /> The Vetting Boardroom
                  </div>
                  <div style={{ background: '#0a0a0a', padding: 'var(--space-4)', minHeight: 180, maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {chatLog.map((msg, idx) => (
                      <div key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.6, color: msg.role === 'founder' ? 'var(--color-accent-blue)' : 'var(--color-accent-emerald)' }}>
                        <span style={{ fontWeight: 700, marginRight: 8, color: msg.role === 'founder' ? '#60a5fa' : '#34d399' }}>
                          {msg.role === 'founder' ? 'Founder >>' : 'Agent >>'}
                        </span>
                        <span style={{ color: '#e5e5e5' }}>{msg.text}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  
                  {/* Chat Input */}
                  <div style={{ background: '#111', padding: 'var(--space-2)', borderTop: '1px solid var(--color-border-primary)', display: 'flex', gap: 8 }}>
                    <input 
                      type="text" 
                      placeholder="Ask a vetting question..."
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      style={{ flex: 1, background: 'transparent', border: 'none', color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: 11, outline: 'none', paddingLeft: 8 }}
                    />
                    <button onClick={handleSendMessage} style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-emerald)', cursor: 'pointer', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </div>

              {/* Authority Gate Footer */}
              <div style={{ padding: 'var(--space-5)', borderTop: '1px solid var(--color-border-primary)', background: 'var(--color-bg-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)', justifyContent: 'center' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--color-accent-emerald)' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>VERIFIED SOVEREIGN LABOR | SOC2 COMPLIANT</span>
                </div>
                
                {can('canHireFromMarketplace') && selectedAgent.isAvailable ? (
                  <Button variant="primary" style={{ width: '100%', marginBottom: 'var(--space-3)' }} onClick={handleDeploy} disabled={deploying}>
                    {deploying ? 'Authorizing Protocol...' : 'Authorize Deployment'}
                  </Button>
                ) : (
                  <Button variant="secondary" style={{ width: '100%', marginBottom: 'var(--space-3)' }} disabled>
                    Currently Deployed
                  </Button>
                )}
                
                <p style={{ fontSize: 9, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                  By deploying this agent, you authorize the allocation of compute credits at the stated variable rate and grant access to designated Department data silos.
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
