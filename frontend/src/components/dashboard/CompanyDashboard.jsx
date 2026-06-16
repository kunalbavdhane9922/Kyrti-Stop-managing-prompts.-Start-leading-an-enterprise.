import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Bot, Users, Scale, Cpu, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight, Briefcase, Award, Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useGovernanceStore } from '../../store/governanceStore.js';
import { useServiceFeeStore } from '../../store/serviceFeeStore.js';
import { platformApi } from '../../services/platformApi.js';

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

function genSparkline(base, drift, count = 24) {
  const d = [];
  let v = base;
  for (let i = 0; i < count; i++) {
    v += (Math.random() - drift) * base * 0.08;
    v = Math.max(base * 0.4, v);
    d.push({ h: `${i}:00`, v: Math.round(v) });
  }
  return d;
}

function MiniTip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  return (
    <div style={{ background: '#1a1a1b', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
      ${payload[0].value.toLocaleString()}
    </div>
  );
}

function HiringTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', borderRadius: 6, padding: '8px 12px', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color || 'var(--color-text-primary)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
          {p.name}: {p.value} hired
        </div>
      ))}
    </div>
  );
}

function MetricTile({ label, value, sub, icon: Icon, trend, trendVal, color, sparkData, sparkColor }) {
  return (
    <motion.div variants={anim.item}>
      <Card hover style={{ padding: 'var(--space-4) var(--space-5)', transition: 'box-shadow 0.4s ease', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 700, color: color || 'var(--color-text-primary)', lineHeight: 1.1 }}>{value}</div>
          </div>
          {sparkData ? (
            <div style={{ width: 72, height: 36, minWidth: 72, minHeight: 36 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs><linearGradient id={`sp-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={sparkColor} stopOpacity={0.3} /><stop offset="100%" stopColor={sparkColor} stopOpacity={0} /></linearGradient></defs>
                  <Tooltip content={<MiniTip />} cursor={false} />
                  <Area type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={1.5} fill={`url(#sp-${label})`} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={15} style={{ color }} />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {trend && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 600, color: trend === 'up' ? 'var(--color-accent-emerald)' : 'var(--color-accent-rose)' }}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{trendVal}
            </span>
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)' }}>{sub}</span>
        </div>
      </Card>
    </motion.div>
  );
}

function genHiringActivity() {
  const d = [];
  for (let m = 1; m <= 6; m++) {
    d.push({ month: `Month ${m}`, hires: Math.floor(Math.random() * 15) + 5 });
  }
  return d;
}

export function CompanyDashboard() {
  const proposals = useGovernanceStore(s => s.proposals);
  const blockerReports = useGovernanceStore(s => s.blockerReports);
  const burnRate = useServiceFeeStore(s => s.burnRate);
  const agentROI = useServiceFeeStore(s => s.agentROI);
  const setBurnRate = useServiceFeeStore(s => s.setBurnRate);
  const setAgentROI = useServiceFeeStore(s => s.setAgentROI);

  const hiringData = useMemo(genHiringActivity, []);
  const repSparkline = useMemo(() => genSparkline(850, -0.2), []);
  const growthSparkline = useMemo(() => genSparkline(100, -0.4), []);

  useEffect(() => {
    platformApi.getComputeBurnRate().then(setBurnRate);
    platformApi.getAgentROI().then(setAgentROI);
    platformApi.getBlockerReports().then(reports => {
      if (useGovernanceStore.getState().blockerReports.length === 0)
        reports.forEach(r => useGovernanceStore.setState(s => ({ blockerReports: [...s.blockerReports, r] })));
    });
  }, []);

  const workforceSize = 248;
  const openPositions = 14;
  const companyReputation = 942;
  const operationalScore = 98.4;

  const hitlItems = useMemo(() => {
    const items = [];
    proposals.filter(p => p.status === 'proposed' || p.status === 'draft').forEach(p =>
      items.push({ id: p.id, type: 'proposal', title: p.title, agent: p.agentName, time: p.createdAt })
    );
    blockerReports.filter(r => r.status === 'PAUSE_STATE').forEach(r =>
      items.push({ id: r.id, type: 'blocker', title: `${r.type.replace(/_/g, ' ')}`, agent: r.agentName, time: r.createdAt })
    );
    return items.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [proposals, blockerReports]);

  const depts = [
    { name: 'Engineering', head: 'ARIA-7', perf: 97, icon: Cpu, status: 'active' },
    { name: 'Marketing', head: 'NEXUS-3', perf: 91, icon: Users, status: 'active' },
    { name: 'Legal', head: 'HELIX-9', perf: 88, icon: Scale, status: 'active' },
    { name: 'Finance', head: 'ORION-5', perf: 64, icon: DollarSign, status: 'blocked' },
  ];

  const professionDistribution = [
    { role: 'Backend Dev', count: 86, color: 'var(--color-accent-indigo)' },
    { role: 'Frontend Dev', count: 54, color: 'var(--color-accent-cyan)' },
    { role: 'Data Scientist', count: 42, color: 'var(--color-accent-emerald)' },
    { role: 'QA Analyst', count: 35, color: 'var(--color-accent-amber)' },
    { role: 'Product Manager', count: 31, color: 'var(--color-accent-rose)' },
  ];

  return (
    <motion.div variants={anim.container} initial="hidden" animate="show" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gridTemplateRows: 'auto minmax(0, 1fr) minmax(0, 1fr)',
      gap: 'var(--space-5)',
      height: '100%',
      overflow: 'hidden',
    }}>
      <MetricTile
        label="Workforce Size" value={workforceSize.toString()} sub="+12% this quarter"
        icon={Users} trend="up" trendVal="12%" color="var(--color-accent-indigo)"
        sparkData={growthSparkline} sparkColor="var(--color-accent-indigo)"
      />
      <MetricTile
        label="Company Reputation" value={companyReputation.toString()} sub="Top 5% in Ecosystem"
        icon={Award} trend="up" trendVal="24pts" color="var(--color-accent-gold)"
        sparkData={repSparkline} sparkColor="var(--color-accent-gold)"
      />
      <MetricTile
        label="Open Positions" value={openPositions.toString()} sub="Hiring Pipeline Active"
        icon={Briefcase} color="var(--color-accent-emerald)"
      />
      <MetricTile
        label="Operational Metrics" value={`${operationalScore}%`} sub="Overall Platform Efficiency"
        icon={Activity} color="var(--color-accent-cyan)"
      />

      {/* Profession Distribution & Hiring Activity */}
      <motion.div variants={anim.item} style={{ gridColumn: 'span 3', gridRow: 'span 2', minHeight: 0 }}>
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexShrink: 0 }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>Hiring Activity</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)' }}>6-month trailing additions</span>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip content={<HiringTip />} cursor={{ fill: 'var(--color-bg-tertiary)' }} />
                <Bar dataKey="hires" name="Hires" radius={[4, 4, 0, 0]}>
                  {hiringData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--color-accent-emerald)" opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Profession Distribution */}
      <motion.div variants={anim.item} style={{ minHeight: 0 }}>
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-4) var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', flexShrink: 0 }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Profession Distribution</h3>
            <Briefcase size={14} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingRight: 4 }}>
            {professionDistribution.map((prof, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{prof.role}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)' }}>{prof.count}</div>
                </div>
                <div style={{ width: '100%', height: 4, background: 'var(--color-border-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${(prof.count / workforceSize) * 100}%`, height: '100%', background: prof.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={anim.item} style={{ minHeight: 0 }}>
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-4) var(--space-5)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', flexShrink: 0 }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Workforce</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingRight: 4 }}>
            {depts.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '6px var(--space-2)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-tertiary)', flexShrink: 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: d.status === 'blocked' ? 'var(--color-accent-amber)' : 'var(--color-accent-emerald)', boxShadow: d.status === 'blocked' ? 'none' : '0 0 6px var(--color-accent-emerald)' }} />
                <d.icon size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{d.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-muted)' }}>{d.head}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: d.perf < 70 ? 'var(--color-accent-amber)' : 'var(--color-text-primary)' }}>{d.perf}%</div>
              </div>
            ))}
            {hitlItems.length > 0 && (
              <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-warning)', background: 'rgba(245,158,11,0.04)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                  <AlertTriangle size={12} style={{ color: 'var(--color-accent-amber)' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-accent-amber)' }}>{hitlItems.length} Pending</span>
                </div>
                {hitlItems.slice(0, 2).map(item => (
                  <div key={item.id} style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Bot size={10} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" style={{ marginTop: 4, width: '100%', fontSize: 10 }}>Review All →</Button>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
