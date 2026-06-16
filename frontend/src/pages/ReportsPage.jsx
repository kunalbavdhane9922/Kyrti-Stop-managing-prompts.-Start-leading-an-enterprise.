import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Activity, Briefcase, AlertTriangle, Lightbulb, Zap, TrendingUp, Cpu } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { useAuthStore } from '../store/authStore.js';
import { reportsApi } from '../services/reportsApi.js';

/**
 * Sovereign Protocol — Intelligence Reports Page
 * Decision-support and executive visibility dashboard.
 */

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } },
  item: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
};

function MetricCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <Card style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: `rgba(var(--${colorClass}-rgb, 100, 116, 139), 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} style={{ color: `var(--color-${colorClass}, var(--color-text-secondary))` }} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: 2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{subtitle}</div>}
      </div>
    </Card>
  );
}

export function ReportsPage() {
  const tenantId = useAuthStore(s => s.activeTenantId) || 'default-tenant';
  const [operationalData, setOperationalData] = useState(null);
  const [workforceData, setWorkforceData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const [opRes, wfRes, recRes] = await Promise.all([
          reportsApi.getOperationalMetrics(tenantId),
          reportsApi.getWorkforceMetrics(tenantId),
          reportsApi.getRecommendations(tenantId)
        ]);

        setOperationalData(opRes.data);
        setWorkforceData(wfRes.data);
        setRecommendations(recRes.data);
      } catch (e) {
        console.error("Failed to load report data", e);
      } finally {
        setLoading(false);
      }
    }
    
    if (tenantId) loadReports();
  }, [tenantId]);

  return (
    <div style={{ position: 'relative', height: '100%', overflowY: 'auto', paddingRight: 'var(--space-4)' }}>
      <motion.div variants={anim.container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', padding: 'var(--space-2) 0' }}>
        
        {/* HEADER */}
        <motion.div variants={anim.item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>Intelligence Reports</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}>
              Decision-support and executive visibility into operational metrics.
            </p>
          </div>
          <Badge color="blue">Tier 1</Badge>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
             <div style={{ width: '32px', height: '32px', border: '3px solid var(--color-border-secondary)', borderTopColor: 'var(--color-accent-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* SECTION: OPERATIONAL DATA */}
            <motion.div variants={anim.item}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={14} /> Operational Data
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <MetricCard 
                  title="Active Agents" 
                  value={operationalData?.activeAgents || 0} 
                  icon={Cpu} 
                  colorClass="accent-emerald" 
                  subtitle="Currently executing logic"
                />
                <MetricCard 
                  title="Active Workflows" 
                  value={operationalData?.activeWorkflows || 0} 
                  icon={Activity} 
                  colorClass="accent-blue" 
                  subtitle="Temporal orchestrations"
                />
                <MetricCard 
                  title="Completed Tasks" 
                  value={(operationalData?.completedTasks || 0).toLocaleString()} 
                  icon={Briefcase} 
                  colorClass="text-primary" 
                  subtitle="Platform lifetime"
                />
                <MetricCard 
                  title="Error Rate" 
                  value={`${operationalData?.errorRate || 0}%`} 
                  icon={AlertTriangle} 
                  colorClass="accent-amber" 
                  subtitle="Saga execution failures"
                />
              </div>
            </motion.div>

            {/* SECTION: WORKFORCE UTILIZATION */}
            <motion.div variants={anim.item}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)', marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <PieChart size={14} /> Workforce Utilization
              </h2>
              <Card style={{ padding: 'var(--space-5)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                  
                  {/* Human vs AI Split */}
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', fontWeight: 600 }}>HUMAN VS AI WORK SPLIT</div>
                    <div style={{ display: 'flex', height: 24, borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--color-bg-tertiary)' }}>
                      <div style={{ width: `${workforceData?.humanVsAiSplit?.human || 0}%`, background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                        {workforceData?.humanVsAiSplit?.human}% H
                      </div>
                      <div style={{ width: `${workforceData?.humanVsAiSplit?.ai || 0}%`, background: 'var(--color-accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#000' }}>
                        {workforceData?.humanVsAiSplit?.ai}% AI
                      </div>
                    </div>
                  </div>

                  {/* Department Utilization */}
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', fontWeight: 600 }}>DEPARTMENT CAPACITY UTILIZATION</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {workforceData?.utilization && Object.entries(workforceData.utilization).map(([dept, percent]) => (
                        <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <span style={{ fontSize: 12, color: 'var(--color-text-primary)', width: 80 }}>{dept}</span>
                          <div style={{ flex: 1, height: 6, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percent}%`, background: percent > 90 ? 'var(--color-accent-amber)' : 'var(--color-text-primary)', borderRadius: 'var(--radius-full)' }} />
                          </div>
                          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', width: 32, textAlign: 'right' }}>{percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* SECTION: INTELLIGENCE RECOMMENDATIONS */}
            <motion.div variants={anim.item}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)', marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={14} /> Intelligence Recommendations
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {recommendations.length > 0 ? (
                  recommendations.map((rec) => {
                    let IconComponent = Lightbulb;
                    let bgColor = 'rgba(59, 130, 246, 0.05)';
                    let borderColor = 'rgba(59, 130, 246, 0.2)';
                    let iconColor = 'var(--color-accent-blue)';
                    
                    if (rec.type === 'warning') {
                      IconComponent = AlertTriangle;
                      bgColor = 'rgba(245, 158, 11, 0.05)';
                      borderColor = 'rgba(245, 158, 11, 0.2)';
                      iconColor = 'var(--color-accent-amber)';
                    } else if (rec.type === 'optimization') {
                      IconComponent = TrendingUp;
                      bgColor = 'rgba(52, 211, 153, 0.05)';
                      borderColor = 'rgba(52, 211, 153, 0.2)';
                      iconColor = 'var(--color-accent-emerald)';
                    }

                    return (
                      <Card key={rec.id} style={{ padding: 'var(--space-4)', background: bgColor, border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                        <div style={{ background: 'var(--color-bg-primary)', padding: 6, borderRadius: 'var(--radius-sm)' }}>
                          <IconComponent size={16} style={{ color: iconColor }} />
                        </div>
                        <div style={{ flex: 1, fontSize: 13, color: 'var(--color-text-primary)', lineHeight: 1.5, paddingTop: 2 }}>
                          {rec.text}
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic', padding: 'var(--space-4)' }}>
                    No actionable intelligence at this time.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
