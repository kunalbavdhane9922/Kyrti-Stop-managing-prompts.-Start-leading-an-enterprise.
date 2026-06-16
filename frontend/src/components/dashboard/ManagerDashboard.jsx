import { motion } from 'framer-motion';
import { Card } from '../../components/common/Card.jsx';
import { Bot, CheckCircle, Clock, AlertCircle, TrendingUp, Zap, Activity, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

const teamData = [
  { name: 'ARIA-7', role: 'Lead Backend', load: 85, status: 'active' },
  { name: 'NEXUS-3', role: 'Frontend Eng', load: 92, status: 'warning' },
  { name: 'HELIX-9', role: 'QA Automation', load: 45, status: 'active' },
  { name: 'ORION-5', role: 'DevOps', load: 15, status: 'idle' }
];

const sprintVelocity = [
  { day: 'Mon', pts: 24 }, { day: 'Tue', pts: 35 }, { day: 'Wed', pts: 18 },
  { day: 'Thu', pts: 42 }, { day: 'Fri', pts: 38 }, { day: 'Sat', pts: 12 }, { day: 'Sun', pts: 5 }
];

export function ManagerDashboard() {
  return (
    <motion.div variants={anim.container} initial="hidden" animate="show" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'minmax(120px, auto) minmax(0, 1fr)',
      gap: 'var(--space-5)',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Metrics Row */}
      <motion.div variants={anim.item}>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-indigo)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="var(--color-accent-indigo)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Team Size</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>4 Agents</div>
          </div>
        </Card>
      </motion.div>
      <motion.div variants={anim.item}>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-emerald)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} color="var(--color-accent-emerald)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Sprint Progress</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>78%</div>
          </div>
        </Card>
      </motion.div>
      <motion.div variants={anim.item}>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-amber)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={24} color="var(--color-accent-amber)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Blocked Tasks</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>2</div>
          </div>
        </Card>
      </motion.div>

      {/* Team Load */}
      <motion.div variants={anim.item} style={{ gridColumn: '1 / 3' }}>
        <Card style={{ height: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Team Load</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1, overflowY: 'auto' }}>
            {teamData.map(agent => (
              <div key={agent.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 3fr', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Bot size={16} color="var(--color-text-muted)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{agent.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{agent.role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Activity size={14} color={agent.load > 80 ? 'var(--color-accent-amber)' : 'var(--color-accent-emerald)'} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{agent.load}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--color-border-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${agent.load}%`, height: '100%', background: agent.load > 90 ? 'var(--color-accent-rose)' : agent.load > 80 ? 'var(--color-accent-amber)' : 'var(--color-accent-emerald)', transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Sprint Velocity */}
      <motion.div variants={anim.item}>
        <Card style={{ height: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Sprint Velocity</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintVelocity} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                <Tooltip cursor={{ fill: 'var(--color-bg-tertiary)' }} contentStyle={{ background: 'var(--color-bg-secondary)', border: 'none', borderRadius: 8 }} />
                <Bar dataKey="pts" radius={[4, 4, 0, 0]}>
                  {sprintVelocity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? 'var(--color-accent-indigo)' : 'var(--color-accent-indigo)88'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
