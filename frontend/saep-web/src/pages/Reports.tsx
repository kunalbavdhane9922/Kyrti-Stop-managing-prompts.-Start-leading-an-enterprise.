import React from 'react';
import { Download, TrendingUp, BarChart2 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import styles from './Reports.module.css';

const Reports: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Ecosystem metrics, workforce capacity, and system audits.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className={styles.grid}>
        <GlassCard title="Workforce Efficiency" className={styles.reportCard}>
          <div className={styles.chartWrapper}>
            <TrendingUp size={48} className={styles.placeholderIcon} />
            <p>Efficiency trending +14% this quarter</p>
          </div>
        </GlassCard>

        <GlassCard title="Task Distribution" className={styles.reportCard}>
          <div className={styles.chartWrapper}>
            <BarChart2 size={48} className={styles.placeholderIcon} />
            <p>Engineering tasks account for 62% of volume</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Audit Log" className={styles.auditCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Actor</th>
              <th>Target</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-06-06 14:32:00</td>
              <td>Governance.Approve</td>
              <td>Human: Admin-1</td>
              <td>Hire: DataScientist-AI</td>
              <td><span className={styles.badgeSuccess}>Completed</span></td>
            </tr>
            <tr>
              <td>2026-06-06 14:15:22</td>
              <td>Task.Complete</td>
              <td>AI: React-Dev-99</td>
              <td>Task-8821</td>
              <td><span className={styles.badgeSuccess}>Completed</span></td>
            </tr>
            <tr>
              <td>2026-06-06 13:40:11</td>
              <td>Task.Assign</td>
              <td>Human: Manager-3</td>
              <td>Task-8822</td>
              <td><span className={styles.badgeSuccess}>Completed</span></td>
            </tr>
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};

export default Reports;
