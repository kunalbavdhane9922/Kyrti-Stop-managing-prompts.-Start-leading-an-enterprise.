import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Users, FileText, Building2 } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={`glass-nav ${styles.navbar}`}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>SAEP Protocol</span>
        </div>
        
        <div className={styles.navLinks}>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <LayoutDashboard size={20} className={styles.icon} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/marketplace" 
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <Store size={20} className={styles.icon} />
            <span>Marketplace</span>
          </NavLink>
          
          <NavLink 
            to="/hiring" 
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <Users size={20} className={styles.icon} />
            <span>Hiring</span>
          </NavLink>

          <NavLink 
            to="/company" 
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <Building2 size={20} className={styles.icon} />
            <span>Company</span>
          </NavLink>
          
          <NavLink 
            to="/reports" 
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <FileText size={20} className={styles.icon} />
            <span>Reports</span>
          </NavLink>
        </div>
        
        <div className={styles.profileContainer}>
          <div className={styles.avatar}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
