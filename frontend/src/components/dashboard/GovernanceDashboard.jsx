import { motion } from 'framer-motion';
import { Card } from '../../components/common/Card.jsx';
import { ShieldCheck, FileSignature, Scale, AlertTriangle, Eye, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/common/Button.jsx';

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

const audits = [
  { id: 'AUD-010', action: 'Update Organization Policy', actor: 'Ecosystem Council', time: '10m ago', risk: 'Low' },
  { id: 'AUD-011', action: 'Approve New Profession: Quantum Dev', actor: 'Marketplace Board', time: '1h ago', risk: 'Medium' },
  { id: 'AUD-012', action: 'Revoke API Key for External Tenant', actor: 'Security System', time: '3h ago', risk: 'High' }
];

export function GovernanceDashboard() {
  return (
    <motion.div variants={anim.container} initial="hidden" animate="show" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'auto minmax(0, 1fr)',
      gap: 'var(--space-5)',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Top Stats */}
      <motion.div variants={anim.item} style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-indigo)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={24} color="var(--color-accent-indigo)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Policies</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>124</div>
          </div>
        </Card>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-emerald)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} color="var(--color-accent-emerald)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Compliance Status</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-accent-emerald)' }}>100%</div>
          </div>
        </Card>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-amber)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSignature size={24} color="var(--color-accent-amber)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Pending Approvals</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>12</div>
          </div>
        </Card>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-rose)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={24} color="var(--color-accent-rose)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Security Alerts</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>0</div>
          </div>
        </Card>
      </motion.div>

      {/* Audit Log */}
      <motion.div variants={anim.item} style={{ gridColumn: 'span 2' }}>
        <Card style={{ height: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Ecosystem Audit Stream</h3>
            <Button variant="ghost" size="sm" icon={Eye}>View All</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1, overflowY: 'auto' }}>
            {audits.map(audit => (
              <div key={audit.id} style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr 1fr', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)' }}>{audit.id}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)' }}>{audit.action}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{audit.actor}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: audit.risk === 'High' ? 'var(--color-accent-rose)' : audit.risk === 'Medium' ? 'var(--color-accent-amber)' : 'var(--color-text-muted)' }}>{audit.risk}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{audit.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* HITL Escalations */}
      <motion.div variants={anim.item}>
        <Card style={{ height: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <AlertTriangle size={18} color="var(--color-accent-amber)" />
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Global Escalations</h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', textAlign: 'center' }}>
            <ShieldCheck size={32} color="var(--color-accent-emerald)" style={{ marginBottom: 'var(--space-3)' }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>All Clear</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>No ecosystem-level blockers require human intervention.</div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
