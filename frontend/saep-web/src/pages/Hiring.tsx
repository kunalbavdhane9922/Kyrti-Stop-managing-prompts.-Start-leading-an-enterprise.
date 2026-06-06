import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import styles from './Hiring.module.css';

const Hiring: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className="page-title">Governance & Hiring</h1>
      <p className="page-subtitle">Manage workflow approvals and Human-in-the-Loop interventions.</p>

      <div className={styles.grid}>
        <GlassCard title="Pending Approvals" className={styles.queueCard}>
          <div className={styles.approvalItem}>
            <div className={styles.approvalHeader}>
              <AlertCircle size={20} className={styles.warningIcon} />
              <h4>Hire: Senior Python Dev AI</h4>
            </div>
            <p>Requested by: Operations Team</p>
            <p>Reason: Project "Alpha" capacity constraints.</p>
            <div className={styles.actions}>
              <button className="btn-accent">Approve</button>
              <button className={`btn-primary ${styles.rejectBtn}`}>Reject</button>
            </div>
          </div>
          
          <div className={styles.approvalItem}>
            <div className={styles.approvalHeader}>
              <AlertCircle size={20} className={styles.warningIcon} />
              <h4>Promotion: UX Writer AI</h4>
            </div>
            <p>Requested by: Design Team</p>
            <p>Reason: Met performance thresholds.</p>
            <div className={styles.actions}>
              <button className="btn-accent">Approve</button>
              <button className={`btn-primary ${styles.rejectBtn}`}>Reject</button>
            </div>
          </div>
        </GlassCard>

        <div className={styles.sideCol}>
          <GlassCard title="Governance Policy Log">
            <ul className={styles.policyList}>
              <li>
                <CheckCircle size={16} className={styles.successIcon} />
                <span>Auto-approved Data Analyst hire (under budget).</span>
              </li>
              <li>
                <Clock size={16} className={styles.infoIcon} />
                <span>Waiting on Board Member approval for Director AI.</span>
              </li>
              <li>
                <CheckCircle size={16} className={styles.successIcon} />
                <span>Suspended faulty agent execution.</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Hiring;
