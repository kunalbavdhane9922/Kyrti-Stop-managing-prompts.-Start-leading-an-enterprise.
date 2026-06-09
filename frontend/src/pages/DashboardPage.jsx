import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Flame, Target, Zap,
  AlertTriangle, Check, X, MessageSquare,
  Bot, Briefcase, Scale, Cpu, DollarSign, Circle,
  ArrowUpRight, ArrowDownRight, Clock, Users, ShieldCheck, RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { useAuthStore } from '../store/authStore.js';
import { useGovernanceStore } from '../store/governanceStore.js';
import { useServiceFeeStore } from '../store/serviceFeeStore.js';
import { useTierGate } from '../hooks/useTierGate.js';
import { platformApi } from '../services/platformApi.js';

/**
 * Sovereign Protocol — Executive Briefing
 * "The War Room" — single-viewport command center.
 */

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

/* ── 24h sparkline data ── */
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

/* ── Mini chart tooltip ── */
function MiniTip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  return (
    <div style={{ background: '#1a1a1b', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
      ${payload[0].value.toLocaleString()}
    </div>
  );
}

/* ── Full chart tooltip ── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', borderRadius: 6, padding: '8px 12px', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
          {p.name}: ${p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

/* ── Metric Tile ── */
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
            <div style={{ width: 72, height: 36 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs><linearGradient id={`sp-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={sparkColor} stopOpacity={0.3} /><stop offset="100%" stopColor={sparkColor} stopOpacity={0} /></linearGradient></defs>
                  <Tooltip content={<MiniTip />} />
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

/* ── P&L data ── */
function genPnL() {
  const d = [];
  let p = 380, s = 160;
  for (let h = 0; h < 24; h++) {
    p += (Math.random() - 0.35) * 55;
    s += (Math.random() - 0.45) * 20;
    p = Math.max(150, p); s = Math.max(60, Math.min(s, p * 0.65));
    d.push({ hour: `${String(h).padStart(2, '0')}:00`, revenue: Math.round(p), cost: Math.round(s) });
  }
  return d;
}

/* ═══════════════ MAIN COMPONENT ═══════════════ */
function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const { isSandboxMode } = useTierGate();
  const proposals = useGovernanceStore(s => s.proposals);
  const blockerReports = useGovernanceStore(s => s.blockerReports);
  const burnRate = useServiceFeeStore(s => s.burnRate);
  const agentROI = useServiceFeeStore(s => s.agentROI);
  const setBurnRate = useServiceFeeStore(s => s.setBurnRate);
  const setAgentROI = useServiceFeeStore(s => s.setAgentROI);

  const pnlData = useMemo(genPnL, []);
  const burnSparkline = useMemo(() => genSparkline(285, 0.45), []);
  const yieldSparkline = useMemo(() => genSparkline(520, 0.35), []);

  useEffect(() => {
    platformApi.getComputeBurnRate().then(setBurnRate);
    platformApi.getAgentROI().then(setAgentROI);
    platformApi.getBlockerReports().then(reports => {
      if (useGovernanceStore.getState().blockerReports.length === 0)
        reports.forEach(r => useGovernanceStore.setState(s => ({ blockerReports: [...s.blockerReports, r] })));
    });
  }, []);

  /* Computed financials */
  const totalValue = agentROI.reduce((s, a) => s + a.valueGenerated, 0);
  const totalCost = agentROI.reduce((s, a) => s + a.maintenanceCost + a.computeCost, 0);
  const netYield = totalValue - totalCost;
  const dailyBurn = burnRate.dailyAverage || 285.50;
  const budgetCap = burnRate.opsWalletBalance || 8853;
  const budgetUsed = burnRate.weeklyTotal || 1998.50;
  const budgetPct = budgetCap > 0 ? Math.round((budgetUsed / budgetCap) * 100) : 0;
  const activeAgents = agentROI.length;

  /* HITL items */
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

  /* Departments */
  const depts = [
    { name: 'Engineering', head: 'ARIA-7', perf: 97, icon: Cpu, status: 'active' },
    { name: 'Marketing', head: 'NEXUS-3', perf: 91, icon: Users, status: 'active' },
    { name: 'Legal', head: 'HELIX-9', perf: 88, icon: Scale, status: 'active' },
    { name: 'Finance', head: 'ORION-5', perf: 64, icon: DollarSign, status: 'blocked' },
  ];

  /* Calendar */
  const events = [
    { t: '09:00', title: 'Engineering Stand-up', kind: 'sync', kColor: 'var(--color-accent-cyan)' },
    { t: '10:30', title: 'CEO Morning Brief', kind: 'exec', kColor: 'var(--color-accent-gold)' },
    { t: '14:00', title: 'Budget Conflict', kind: 'alert', kColor: 'var(--color-accent-amber)' },
    { t: '16:00', title: 'EOD Performance', kind: 'exec', kColor: 'var(--color-accent-gold)' },
  ];

  const greeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';

  return (
    <motion.div variants={anim.container} initial="hidden" animate="show" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gridTemplateRows: 'auto auto minmax(0, 1fr) minmax(0, 1fr)',
      gap: 'var(--space-5)',
      height: '100%',
      overflow: 'hidden',
      padding: 'var(--space-2) 0',
    }}>

      {/* ═══ ROW 0: HEADER ═══ */}
      <motion.div variants={anim.item} style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 2 }}>Good {greeting}, {user?.name?.split(' ')[0] || 'Operator'}</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}>
            {isSandboxMode ? 'Sandbox Mode — simulated data' : 'Your AI workforce is operational'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </motion.div>


      {/* ═══ ROW 1: FOUR KPI TILES ═══ */}
      <MetricTile
        label="Daily Burn" value={`$${dailyBurn.toFixed(0)}`} sub={`$${(burnRate.currentRate || 12.4).toFixed(2)}/hr`}
        icon={Flame} trend="down" trendVal="4.2%" color="#EF4444"
        sparkData={burnSparkline} sparkColor="#EF4444"
      />
      <MetricTile
        label="Net Yield" value={`$${(netYield / 1000).toFixed(1)}k`} sub={`${totalCost > 0 ? Math.round((netYield / totalCost) * 100) : 0}% ROI`}
        icon={TrendingUp} trend="up" trendVal="12.8%" color="#10B981"
        sparkData={yieldSparkline} sparkColor="#10B981"
      />
      <MetricTile
        label="Budget Used" value={`${budgetPct}%`} sub={`$${(budgetUsed/1000).toFixed(1)}k of $${(budgetCap/1000).toFixed(1)}k`}
        icon={Target} color="#2563EB"
      />
      <MetricTile
        label="Active Agents" value={activeAgents.toString()} sub={`${hitlItems.length} pending action${hitlItems.length !== 1 ? 's' : ''}`}
        icon={Bot} color="var(--color-accent-gold)"
      />

      {/* ═══ ROW 2-3 LEFT: P&L CHART (spans 3 cols, 2 rows) ═══ */}
      <motion.div variants={anim.item} style={{ gridColumn: 'span 3', gridRow: 'span 2', minHeight: 0 }}>
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexShrink: 0 }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>Revenue vs. Cost</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)' }}>24-hour rolling window</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                <span style={{ width: 10, height: 3, borderRadius: 2, background: '#2563EB' }} /> Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                <span style={{ width: 10, height: 3, borderRadius: 2, background: '#94a3b8', opacity: 0.5 }} /> Cost
              </span>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pnlData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: '#9ca3af' }} axisLine={false} tickLine={false} interval={3} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={2} fill="url(#gRev)" dot={false} />
                <Area type="monotone" dataKey="cost" name="Cost" stroke="#94a3b8" strokeWidth={1.5} fill="url(#gCost)" dot={false} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* ═══ ROW 2 RIGHT: SCHEDULE ═══ */}
      <motion.div variants={anim.item} style={{ minHeight: 0 }}>
        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-4) var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', flexShrink: 0 }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Schedule</h3>
            <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 4 }}>
            {events.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', padding: '6px 0', borderBottom: i < events.length - 1 ? '1px solid var(--color-border-secondary)' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 8, paddingTop: 5, flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.kColor }} />
                  {i < events.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--color-border-secondary)', marginTop: 3 }} />}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: e.kColor, fontWeight: 700 }}>{e.t}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>{e.title}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ═══ ROW 3 RIGHT: ACTION ITEMS + DEPARTMENTS ═══ */}
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
            {/* HITL alerts inline */}
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

export { DashboardPage };
