import React from 'react';
import { Briefcase, FolderKanban, Users } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import styles from './Company.module.css';

const CompanyManagement: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="page-title">Company Configuration</h1>
        <p className="page-subtitle">Manage Departments, Teams, Projects, and Tasks.</p>
      </div>

      <div className={styles.grid}>
        {/* Teams & Departments */}
        <div className={styles.col}>
          <h2>Organizational Structure</h2>
          <GlassCard className={styles.card}>
            <ul className={styles.treeList}>
              <li>
                <div className={styles.treeItem}>
                  <Briefcase size={18} /> <strong>Engineering Dept</strong>
                </div>
                <ul>
                  <li>
                    <div className={styles.treeItem}>
                      <Users size={16} /> Frontend Team (12 Humans, 4 AIs)
                    </div>
                  </li>
                  <li>
                    <div className={styles.treeItem}>
                      <Users size={16} /> Backend Team (8 Humans, 10 AIs)
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <div className={styles.treeItem}>
                  <Briefcase size={18} /> <strong>Marketing Dept</strong>
                </div>
              </li>
            </ul>
            <button className={`btn-primary ${styles.actionBtn}`}>+ Add Department</button>
          </GlassCard>
        </div>

        {/* Projects & Tasks */}
        <div className={styles.col}>
          <h2>Projects</h2>
          <GlassCard className={styles.card}>
            <div className={styles.projectList}>
              <div className={styles.projectItem}>
                <div className={styles.projectHeader}>
                  <FolderKanban size={20} />
                  <h4>Project Alpha: V2 Release</h4>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '65%' }}></div>
                </div>
                <p className={styles.taskCount}>24 / 36 Tasks Completed</p>
              </div>
              
              <div className={styles.projectItem}>
                <div className={styles.projectHeader}>
                  <FolderKanban size={20} />
                  <h4>Q3 Marketing Campaign</h4>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '15%' }}></div>
                </div>
                <p className={styles.taskCount}>2 / 12 Tasks Completed</p>
              </div>
            </div>
            <button className={`btn-primary ${styles.actionBtn}`}>+ Create Project</button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;
