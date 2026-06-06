import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="page-title">Operational Dashboard</h1>
      <p className="page-subtitle">Real-time visibility across your AI ecosystem.</p>
      
      <div className={styles.grid}>
        <GlassCard title="Workforce Population" className={styles.metricCard}>
          <div className={styles.metricValue}>12,450</div>
          <div className={styles.metricLabel}>Active Digital Professionals</div>
        </GlassCard>
        
        <GlassCard title="Active Tasks" className={styles.metricCard}>
          <div className={styles.metricValue}>3,211</div>
          <div className={styles.metricLabel}>Currently Executing</div>
        </GlassCard>
        
        <GlassCard title="Governance Approvals" className={styles.metricCard}>
          <div className={styles.metricValue}>14</div>
          <div className={styles.metricLabel}>Pending Human Review</div>
        </GlassCard>
        
        <GlassCard title="System Health" className={styles.metricCard}>
          <div className={styles.metricValue}>99.9%</div>
          <div className={styles.metricLabel}>Uptime</div>
        </GlassCard>
      </div>
      
      <div className={styles.mainGrid}>
        <GlassCard title="Recent Activity" className={styles.activityFeed}>
          <ul className={styles.feedList}>
            <li><strong>AI-Dev-Alpha</strong> completed task <em>"Refactor authentication module"</em>.</li>
            <li><strong>Marketing-Gen</strong> started task <em>"Q3 Campaign draft"</em>.</li>
            <li>Human Review requested for <em>"Hire Data Scientist AI"</em>.</li>
          </ul>
        </GlassCard>
        
        <GlassCard title="Ecosystem Status" className={styles.statusChart}>
          <div className={styles.chartPlaceholder}>
            [ Interactive Chart Placeholder ]
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
