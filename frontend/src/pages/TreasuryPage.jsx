import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Landmark, Wallet, ShieldAlert, Activity, Cpu, Circle,
  ArrowDownRight, ArrowUpRight, ArrowDownToLine, Key
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { useTreasuryStore } from '../store/treasuryStore.js';
import { platformApi } from '../services/platformApi.js';

/**
 * Sovereign Protocol — Treasury Page (Redesign)
 * "Capital Allocation Command Center"
 */

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

/* ── Metric Tile ── */
function MetricTile({ label, value, sub, icon: Icon, color, prefix = '' }) {
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
          <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', marginRight: 2 }}>{prefix}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 700, color: color || 'var(--color-text-primary)', lineHeight: 1.1 }}>{value}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)' }}>{sub}</span>
        </div>
      </Card>
    </motion.div>
  );
}

function TreasuryPage() {
  const {
    treasuryWallet, opsWallet, agentWallets,
    transactions, isLoading,
    setTreasuryWallet, setOpsWallet, setAgentWallets,
    addTransaction, setLoading,
  } = useTreasuryStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await platformApi.getTreasuryData();
        setTreasuryWallet(data.treasuryWallet);
        setOpsWallet(data.opsWallet);
        setAgentWallets(data.agentWallets);
        if (useTreasuryStore.getState().transactions.length === 0) {
          data.transactions.forEach(tx => addTransaction(tx));
        }
        setLoaded(true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [loaded, setTreasuryWallet, setOpsWallet, setAgentWallets, addTransaction, setLoading]);

  /* Derived Metrics */
  const totalReserves = useMemo(() => {
    const t = parseFloat(treasuryWallet.balance || 0);
    const o = parseFloat(opsWallet.balance || 0);
    const a = agentWallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0);
    return t + o + a;
  }, [treasuryWallet, opsWallet, agentWallets]);

  const agentExposure = useMemo(() => agentWallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0), [agentWallets]);
  const agentUtilized = useMemo(() => agentWallets.reduce((sum, w) => sum + parseFloat(w.utilized || 0), 0), [agentWallets]);
  
  const opsSpent = parseFloat(opsWallet.spentToday || 0);
  const opsLimit = parseFloat(opsWallet.dailyLimit || 1);
  const opsPct = Math.min(100, (opsSpent / opsLimit) * 100);

  return (
      <motion.div variants={anim.container} initial="hidden" animate="show" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gridTemplateRows: 'auto auto minmax(0, 1fr)',
        gap: 'var(--space-5)',
        height: '100%',
        overflow: 'hidden',
        padding: 'var(--space-2) 0',
      }}>

        {/* ═══ ROW 0: HEADER ═══ */}
        <motion.div variants={anim.item} style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>Capital Allocation</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}>
              Role-separated treasury management — AI agents isolated
            </p>
          </div>
          <Badge color="rose" icon={ShieldAlert}>AI Isolated</Badge>
        </motion.div>

        {/* ═══ ROW 1: KPIs ═══ */}
        <MetricTile
          label="Total Capital Reserves" value={totalReserves.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} prefix="Ξ"
          sub="Combined across all wallets" icon={Landmark} color="var(--color-accent-blue)"
        />
        <MetricTile
          label="Ops Velocity (24h)" value={`${opsPct.toFixed(1)}%`}
          sub={`${opsSpent.toFixed(2)} / ${opsLimit.toFixed(2)} ETH limit used`} icon={Activity} color="var(--color-accent-emerald)"
        />
        <MetricTile
          label="Agent Exposure" value={agentExposure.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} prefix="Ξ"
          sub={`${agentUtilized.toFixed(4)} ETH utilized out of deployed`} icon={Cpu} color="var(--color-accent-amber)"
        />

        {/* ═══ ROW 2 COL 1: CAPITAL VAULTS ═══ */}
        <motion.div variants={anim.item} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minHeight: 0, overflowY: 'auto', paddingRight: 4 }}>
          
          {/* Cold Storage */}
          <Card style={{ flexShrink: 0, border: '1px solid var(--color-border-primary)', background: 'var(--color-bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Landmark size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Cold Storage</span>
              </div>
              <Badge color="blue">Multi-Sig</Badge>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {parseFloat(treasuryWallet.balance || 0).toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>ETH</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4, padding: '4px 8px', background: 'var(--color-bg-tertiary)', borderRadius: 4, display: 'inline-block' }}>
                {treasuryWallet.address || '0x4f...a89b'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <Key size={14} style={{ color: 'var(--color-text-muted)' }} />
              <div style={{ flex: 1, fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {treasuryWallet.requiredSignatures} of {treasuryWallet.totalSigners} signatures required
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: treasuryWallet.totalSigners || 3 }).map((_, i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i < (treasuryWallet.requiredSignatures || 2) ? 'var(--color-accent-blue)' : 'var(--color-border-primary)' }} />
                ))}
              </div>
            </div>

            <Button variant="secondary" size="sm" icon={ArrowDownToLine} style={{ width: '100%', marginTop: 'var(--space-4)' }}>Fund Ops Wallet</Button>
          </Card>

          {/* Hot Wallet */}
          <Card style={{ flexShrink: 0, border: '1px solid var(--color-border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Wallet size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Hot Ops Wallet</span>
              </div>
              <Badge color="emerald">Human Authority</Badge>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {parseFloat(opsWallet.balance || 0).toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>ETH</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4, padding: '4px 8px', background: 'var(--color-bg-tertiary)', borderRadius: 4, display: 'inline-block' }}>
                {opsWallet.address || '0x9a...b12c'}
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              <span>Daily Limit</span>
              <span>{opsSpent.toFixed(2)} / {opsLimit.toFixed(2)} ETH</span>
            </div>
            <div style={{ width: '100%', height: 4, background: 'var(--color-bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${opsPct}%`, height: '100%', background: opsPct > 80 ? 'var(--color-accent-rose)' : 'var(--color-accent-emerald)', borderRadius: 2 }} />
            </div>
          </Card>
        </motion.div>

        {/* ═══ ROW 2 COL 2: AGENT ALLOCATIONS ═══ */}
        <motion.div variants={anim.item} style={{ minHeight: 0 }}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-4) var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexShrink: 0 }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Agent Executions</h3>
              <Badge color="amber">Individually Capped</Badge>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingRight: 4 }}>
              {agentWallets.map(w => {
                const ut = parseFloat(w.utilized || 0);
                const cap = parseFloat(w.cap || 1);
                const pct = Math.min(100, (ut / cap) * 100);
                const isOver = pct >= 90;
                
                return (
                  <div key={w.id} style={{
                    padding: 'var(--space-3)',
                    background: isOver ? 'rgba(245,158,11,0.04)' : 'var(--color-bg-tertiary)',
                    border: `1px solid ${isOver ? 'var(--color-border-warning)' : 'var(--color-border-primary)'}`,
                    borderRadius: 'var(--radius-md)',
                    flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: w.status === 'active' ? 'var(--color-accent-emerald)' : 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{w.agentName}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {parseFloat(w.balance || 0).toFixed(4)} ETH
                      </div>
                    </div>
                    
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      {w.address}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--font-mono)', color: isOver ? 'var(--color-accent-amber)' : 'var(--color-text-muted)', marginBottom: 4 }}>
                      <span>Utilized</span>
                      <span>{ut.toFixed(2)} / {cap.toFixed(2)}</span>
                    </div>
                    <div style={{ width: '100%', height: 3, background: isOver ? 'rgba(245,158,11,0.1)' : 'var(--color-border-primary)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: isOver ? 'var(--color-accent-amber)' : 'var(--color-accent-emerald)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* ═══ ROW 2 COL 3: IMMUTABLE LEDGER ═══ */}
        <motion.div variants={anim.item} style={{ minHeight: 0 }}>
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-4) var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexShrink: 0 }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Immutable Ledger</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)' }}>Real-time</span>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {transactions.slice().sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map((tx, i) => {
                  const isIncoming = tx.to === opsWallet.address || tx.to === treasuryWallet.address; // simplistic check
                  return (
                    <div key={tx.id} style={{
                      display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) 0',
                      borderBottom: i < transactions.length - 1 ? '1px solid var(--color-border-secondary)' : 'none'
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {tx.type.includes('fund') ? <ArrowDownRight size={14} style={{ color: 'var(--color-accent-emerald)' }} /> : <ArrowUpRight size={14} style={{ color: 'var(--color-text-muted)' }} />}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {tx.type.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {tx.amount} ETH
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-muted)' }}>
                            {new Date(tx.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 600, color: tx.status === 'confirmed' ? 'var(--color-accent-emerald)' : 'var(--color-accent-amber)' }}>
                            {tx.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                          {tx.from.slice(0,6)}...{tx.from.slice(-4)} → {tx.to.slice(0,6)}...{tx.to.slice(-4)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

      </motion.div>
  );
}

export { TreasuryPage };
