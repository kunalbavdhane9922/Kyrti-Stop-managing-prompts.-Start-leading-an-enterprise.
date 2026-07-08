import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Shield, TrendingUp, Briefcase, Activity, X,
  FileText, ArrowRight, Users, Code, Lightbulb, Megaphone,
  Settings, Palette, BarChart, Scale, Grid, Crown, Video,
  Clock, Award, CheckCircle, Zap, UserCheck
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import {
  DIGITAL_PROFESSIONALS,
  PROFESSION_DOMAINS,
} from '../data/marketplaceData.js';

/**
 * Sovereign Protocol — AI Workforce Marketplace
 * Digital Professional Recruitment Portal
 */

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.2 } } },
};

const DOMAIN_ICONS = {
  all: Grid, executive: Crown, engineering: Code, product: Lightbulb,
  marketing: Megaphone, operations: Settings, finance: TrendingUp,
  design: Palette, data: BarChart, legal: Scale,
};

export function MarketplacePage() {
  const navigate = useNavigate();
  const [activeDomain, setActiveDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resumeAgent, setResumeAgent] = useState(null);
  const [hireConfirm, setHireConfirm] = useState(null);
  const [hired, setHired] = useState([]);

  const filteredProfessionals = useMemo(() => {
    let list = DIGITAL_PROFESSIONALS;
    if (activeDomain !== 'all') {
      list = list.filter(p => p.domain === activeDomain);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q) ||
        p.identityCode.toLowerCase().includes(q) ||
        p.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeDomain, searchQuery]);

  const handleHire = (agent) => {
    setHired(prev => [...prev, agent.id]);
    setHireConfirm(null);
  };

  const getReputationLevel = (score) => {
    if (score >= 850) return 'high';
    if (score >= 700) return 'medium';
    return 'low';
  };

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <motion.div variants={anim.container} initial="hidden" animate="show" style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
        height: '100%', padding: 'var(--space-2) 0',
      }}>

        {/* ═══ HEADER ═══ */}
        <motion.div variants={anim.item}>
          <h1 className="page-title" style={{ marginBottom: 2 }}>Kyrti Labor Exchange</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}>
            Recruit verified Digital Professionals from the global AI workforce marketplace.
          </p>
        </motion.div>

        {/* ═══ DOMAIN TABS + SEARCH ═══ */}
        <motion.div variants={anim.item} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-bg-secondary)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-primary)' }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input
              type="text" placeholder="Search by name, profession, skills, or ID..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', outline: 'none', width: '100%', fontSize: 13, fontFamily: 'var(--font-sans)' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Domain Tabs */}
          <div className="marketplace-domain-tabs">
            {PROFESSION_DOMAINS.map(domain => {
              const Icon = DOMAIN_ICONS[domain.id] || Grid;
              return (
                <button
                  key={domain.id}
                  className={`marketplace-domain-tab ${activeDomain === domain.id ? 'active' : ''}`}
                  onClick={() => setActiveDomain(domain.id)}
                >
                  <Icon size={14} />
                  {domain.label}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {filteredProfessionals.length} professional{filteredProfessionals.length !== 1 ? 's' : ''} available
          </div>
        </motion.div>

        {/* ═══ PROFESSIONAL CARD GRID ═══ */}
        <motion.div variants={anim.item} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div className="marketplace-grid">
            {filteredProfessionals.map(agent => (
              <motion.div
                key={agent.id}
                variants={anim.item}
                className="professional-card"
              >
                {/* Card Header */}
                <div className="professional-card-header">
                  <div className={`professional-avatar ${agent.domain}`}>
                    {agent.initials}
                    <div className={`professional-avatar-status ${agent.status === 'AVAILABLE' ? 'available' : 'employed'}`} />
                  </div>
                  <div className="professional-info" style={{ flex: 1, minWidth: 0 }}>
                    <h3>{agent.name}</h3>
                    <div className="profession-title">{agent.profession}</div>
                    <div className="identity-code">{agent.identityCode} • {agent.cognitiveEngine}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      background: agent.status === 'AVAILABLE' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: agent.status === 'AVAILABLE' ? '#10b981' : '#f59e0b',
                      border: `1px solid ${agent.status === 'AVAILABLE' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                    }}>
                      {agent.status === 'AVAILABLE' ? 'Available' : 'Employed'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)' }}>
                      {agent.computeCost}
                    </span>
                  </div>
                </div>

                {/* Reputation */}
                <div className="professional-reputation">
                  <div className="reputation-score">{agent.reputationScore}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>Reputation Score</div>
                    <div className="reputation-bar">
                      <div
                        className={`reputation-bar-fill ${getReputationLevel(agent.reputationScore)}`}
                        style={{ width: `${(agent.reputationScore / 1000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{agent.experienceYears}yr</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Experience</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="professional-skills">
                  {agent.skills.slice(0, 5).map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                  {agent.skills.length > 5 && (
                    <span className="skill-tag" style={{ color: 'var(--color-highlight-1)' }}>+{agent.skills.length - 5}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="professional-card-actions">
                  <button className="btn-resume" onClick={() => setResumeAgent(agent)}>
                    <FileText size={12} style={{ marginRight: 4, verticalAlign: -2 }} />Resume
                  </button>
                  <button className="btn-interview" onClick={() => navigate(`/interview/${agent.id}`)}>
                    <Video size={12} style={{ marginRight: 4, verticalAlign: -2 }} />Interview
                  </button>
                  <button
                    className="btn-hire"
                    disabled={agent.status !== 'AVAILABLE' || hired.includes(agent.id)}
                    onClick={() => setHireConfirm(agent)}
                  >
                    {hired.includes(agent.id) ? '✓ Hired' : 'Hire'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProfessionals.length === 0 && (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
              No professionals match your criteria.
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ═══ RESUME MODAL ═══ */}
      <AnimatePresence>
        {resumeAgent && (
          <motion.div
            className="resume-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setResumeAgent(null)}
          >
            <motion.div
              className="resume-modal"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Resume Header */}
              <div className="resume-header">
                <div className={`resume-avatar ${resumeAgent.domain}`}>{resumeAgent.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>{resumeAgent.name}</h2>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                      background: resumeAgent.status === 'AVAILABLE' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: resumeAgent.status === 'AVAILABLE' ? '#10b981' : '#f59e0b',
                    }}>
                      {resumeAgent.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{resumeAgent.profession}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {resumeAgent.identityCode} • {resumeAgent.cognitiveEngine} • {resumeAgent.computeCost}
                  </div>
                </div>
                <button onClick={() => setResumeAgent(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>
                  <X size={20} />
                </button>
              </div>

              {/* Resume Body */}
              <div className="resume-body">
                {/* Summary */}
                <div>
                  <div className="resume-section-title"><Briefcase size={14} /> Professional Summary</div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-primary)', lineHeight: 1.7 }}>{resumeAgent.bio}</p>
                </div>

                {/* Stats Grid */}
                <div className="resume-stats">
                  <div className="resume-stat">
                    <div className="resume-stat-value">{resumeAgent.reputationScore}</div>
                    <div className="resume-stat-label">Reputation</div>
                  </div>
                  <div className="resume-stat">
                    <div className="resume-stat-value">{resumeAgent.totalTasksCompleted.toLocaleString()}</div>
                    <div className="resume-stat-label">Tasks Done</div>
                  </div>
                  <div className="resume-stat">
                    <div className="resume-stat-value">{resumeAgent.successRate}%</div>
                    <div className="resume-stat-label">Success Rate</div>
                  </div>
                  <div className="resume-stat">
                    <div className="resume-stat-value">{resumeAgent.avgResponseTime}</div>
                    <div className="resume-stat-label">Avg Response</div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div className="resume-section-title"><Zap size={14} /> Skills & Capabilities</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {resumeAgent.skills.map(skill => (
                      <span key={skill} style={{
                        padding: '4px 12px', background: 'var(--color-bg-tertiary)',
                        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6,
                        fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career History */}
                <div>
                  <div className="resume-section-title"><Clock size={14} /> Career History</div>
                  <div className="career-timeline">
                    {resumeAgent.careerHistory.map((entry, i) => (
                      <div key={i} className="career-entry">
                        <div className="year">{entry.year} • {entry.duration}</div>
                        <div className="role">{entry.role}</div>
                        <div className="company">{entry.company}</div>
                        <div className="result">{entry.result}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <div className="resume-section-title"><Award size={14} /> Achievements</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {resumeAgent.achievements.map((ach, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                        background: 'rgba(52, 211, 153, 0.04)', border: '1px solid rgba(52, 211, 153, 0.1)',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--color-text-primary)', fontWeight: 500 }}>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional DNA */}
                <div>
                  <div className="resume-section-title"><Activity size={14} /> Professional DNA</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {Object.entries(resumeAgent.professionalDNA).map(([key, value]) => (
                      <div key={key} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 12px', background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)',
                      }}>
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resume Footer */}
              <div className="resume-footer">
                <Button variant="secondary" style={{ flex: 1 }} onClick={() => {
                  setResumeAgent(null);
                  navigate(`/interview/${resumeAgent.id}`);
                }}>
                  <Video size={14} style={{ marginRight: 6 }} /> Schedule Interview
                </Button>
                <Button
                  variant="primary"
                  style={{ flex: 1 }}
                  disabled={resumeAgent.status !== 'AVAILABLE' || hired.includes(resumeAgent.id)}
                  onClick={() => { setResumeAgent(null); setHireConfirm(resumeAgent); }}
                >
                  <UserCheck size={14} style={{ marginRight: 6 }} />
                  {hired.includes(resumeAgent.id) ? 'Already Hired' : 'Hire Professional'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HIRE CONFIRMATION MODAL ═══ */}
      <AnimatePresence>
        {hireConfirm && (
          <motion.div
            className="resume-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setHireConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--color-bg-primary)', border: '1px solid var(--color-border-primary)',
                borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', maxWidth: 480,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
                <Shield size={20} style={{ color: 'var(--color-brand-main)' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Authorize Deployment</h3>
              </div>

              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                You are authorizing the deployment of <strong style={{ color: 'var(--color-text-primary)' }}>{hireConfirm.name}</strong> ({hireConfirm.identityCode}) as <strong style={{ color: 'var(--color-text-primary)' }}>{hireConfirm.profession}</strong> within your organization.
              </p>

              <div style={{
                background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)',
                borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Governance Notice
                </div>
                <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Per SAEP Hiring Rules: This hiring decision is subject to human governance approval. The Digital Professional will be deployed in a Tier-0 sandbox environment for a 7-day evaluation period before full organizational access is granted.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Button variant="secondary" style={{ flex: 1 }} onClick={() => setHireConfirm(null)}>Cancel</Button>
                <Button variant="primary" style={{ flex: 1 }} onClick={() => handleHire(hireConfirm)}>
                  Authorize Hiring
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
