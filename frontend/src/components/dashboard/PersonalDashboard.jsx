import { motion } from 'framer-motion';
import { Card } from '../../components/common/Card.jsx';
import { Target, CheckCircle, TrendingUp, Award, BookOpen, Clock, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, YAxis } from 'recharts';

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
};

const repData = [
  { month: 'Jan', score: 820 }, { month: 'Feb', score: 845 }, { month: 'Mar', score: 840 },
  { month: 'Apr', score: 890 }, { month: 'May', score: 915 }, { month: 'Jun', score: 938 }
];

const myTasks = [
  { id: 'T-8821', title: 'Optimize API Gateway Routing', status: 'in-progress', eta: '2h' },
  { id: 'T-8843', title: 'Implement Redis Session Cache', status: 'in-progress', eta: '4h' },
  { id: 'T-8899', title: 'Refactor Auth Middleware', status: 'pending', eta: '1d' }
];

export function PersonalDashboard() {
  return (
    <motion.div variants={anim.container} initial="hidden" animate="show" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'auto minmax(0, 1fr)',
      gap: 'var(--space-5)',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Profile Metrics */}
      <motion.div variants={anim.item} style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-gold)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} color="var(--color-accent-gold)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Reputation Score</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>938</div>
          </div>
        </Card>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-emerald)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color="var(--color-accent-emerald)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Tasks Completed</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>142</div>
          </div>
        </Card>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-cyan)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} color="var(--color-accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Quality Rating</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>98.4%</div>
          </div>
        </Card>
        <Card style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-indigo)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="var(--color-accent-indigo)" />
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Skill Level</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>L4 Senior</div>
          </div>
        </Card>
      </motion.div>

      {/* Task List */}
      <motion.div variants={anim.item} style={{ gridColumn: 'span 2' }}>
        <Card style={{ height: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Current Workload</h3>
            <span style={{ fontSize: 12, color: 'var(--color-accent-emerald)', fontWeight: 600, background: 'var(--color-accent-emerald)22', padding: '4px 8px', borderRadius: 12 }}>On Track</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1, overflowY: 'auto' }}>
            {myTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.status === 'in-progress' ? 'var(--color-accent-cyan)' : 'var(--color-text-muted)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)' }}>{task.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{task.id}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Clock size={14} color="var(--color-text-muted)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}>{task.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Reputation Trend */}
      <motion.div variants={anim.item}>
        <Card style={{ height: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Reputation Growth</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={repData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                <YAxis domain={['dataMin - 20', 'dataMax + 20']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                <Tooltip cursor={{ stroke: 'var(--color-border-secondary)' }} contentStyle={{ background: 'var(--color-bg-secondary)', border: 'none', borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="var(--color-accent-gold)" strokeWidth={3} dot={{ fill: 'var(--color-bg-primary)', strokeWidth: 2, r: 4, stroke: 'var(--color-accent-gold)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
