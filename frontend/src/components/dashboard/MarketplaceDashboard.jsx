import { motion } from 'framer-motion';
import { Card } from '../../components/common/Card.jsx';
import { Network, TrendingUp, Users, Zap, Briefcase, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

const supplyDemandData = [
  { month: 'Jan', demand: 1200, supply: 900 }, { month: 'Feb', demand: 1400, supply: 1100 },
  { month: 'Mar', demand: 1800, supply: 1300 }, { month: 'Apr', demand: 2400, supply: 1800 },
  { month: 'May', demand: 2800, supply: 2200 }, { month: 'Jun', demand: 3500, supply: 2900 }
];

const topProfessions = [
  { name: 'Backend Engineer', count: 1240, growth: '+18%' },
  { name: 'QA Automation', count: 890, growth: '+24%' },
  { name: 'Financial Analyst', count: 650, growth: '+12%' },
  { name: 'Marketing Agent', count: 520, growth: '+31%' }
];

export function MarketplaceDashboard() {
  return (
    <motion.div variants={anim.container} initial="hidden" animate="show" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'auto minmax(0, 1fr)',
      gap: 'var(--space-5)',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Top Metrics */}
      <motion.div variants={anim.item} style={{ gridColumn: 'span 4', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-blue)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Network size={24} color="var(--color-accent-blue)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Protocols</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>18</div>
          </div>
        </Card>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-emerald)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="var(--color-accent-emerald)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Global Workforce</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>2.9k</div>
          </div>
        </Card>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-cyan)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} color="var(--color-accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Employed</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>2.1k</div>
          </div>
        </Card>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-indigo)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} color="var(--color-accent-indigo)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Ecosystem Growth</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>+18.5%</div>
          </div>
        </Card>
      </motion.div>

      {/* Chart */}
      <motion.div variants={anim.item} style={{ gridColumn: 'span 3' }}>
        <Card style={{ height: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Workforce Supply vs Demand</h3>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>6-month trailing data</div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                <span style={{ width: 10, height: 3, borderRadius: 2, background: 'var(--color-accent-indigo)' }} /> Demand
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                <span style={{ width: 10, height: 3, borderRadius: 2, background: 'var(--color-accent-cyan)' }} /> Supply
              </span>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supplyDemandData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent-indigo)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-accent-indigo)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent-cyan)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-accent-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                <Tooltip cursor={{ stroke: 'var(--color-border-secondary)' }} contentStyle={{ background: 'var(--color-bg-secondary)', border: 'none', borderRadius: 8 }} />
                <Area type="monotone" dataKey="demand" stroke="var(--color-accent-indigo)" strokeWidth={2} fill="url(#gDemand)" dot={false} />
                <Area type="monotone" dataKey="supply" stroke="var(--color-accent-cyan)" strokeWidth={2} fill="url(#gSupply)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Top Professions */}
      <motion.div variants={anim.item}>
        <Card style={{ height: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Top Professions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
            {topProfessions.map((prof, i) => (
              <div key={prof.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)' }}>{prof.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{prof.count} active</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Badge variant="success" style={{ fontSize: 10 }}>{prof.growth}</Badge>
                  <ChevronRight size={14} color="var(--color-text-muted)" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" style={{ marginTop: 'var(--space-4)' }}>View Marketplace Catalog</Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
