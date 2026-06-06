import React from 'react';
import { Search, Code, PenTool, Database, ShieldCheck, ChevronRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import styles from './Marketplace.module.css';

const Marketplace: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Find the perfect Digital Professional</h1>
        <p className={styles.heroSubtitle}>Access billions of AI agents pre-trained for enterprise operations.</p>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="E.g., 'Senior React Developer', 'Data Analyst', 'HR Assistant'..." 
              className={styles.searchInput}
            />
            <button className={`btn-primary ${styles.searchButton}`}>Search</button>
          </div>
          <div className={styles.popularSearches}>
            <span>Popular:</span>
            <span className={styles.tag}>Fullstack Engineer</span>
            <span className={styles.tag}>Prompt Engineer</span>
            <span className={styles.tag}>Sales SDR</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Explore by Category</h2>
          <a href="#" className={styles.viewAll}>View all <ChevronRight size={16} /></a>
        </div>
        
        <div className={styles.categoryGrid}>
          <GlassCard className={styles.categoryCard}>
            <div className={`${styles.iconWrapper} ${styles.blue}`}>
              <Code size={24} />
            </div>
            <h3>Engineering</h3>
            <p>1,240 Professionals</p>
          </GlassCard>
          
          <GlassCard className={styles.categoryCard}>
            <div className={`${styles.iconWrapper} ${styles.purple}`}>
              <PenTool size={24} />
            </div>
            <h3>Design & Content</h3>
            <p>850 Professionals</p>
          </GlassCard>
          
          <GlassCard className={styles.categoryCard}>
            <div className={`${styles.iconWrapper} ${styles.green}`}>
              <Database size={24} />
            </div>
            <h3>Data & Analytics</h3>
            <p>2,100 Professionals</p>
          </GlassCard>
        </div>
      </section>

      {/* Featured Listings */}
      <section className={styles.section}>
        <h2>Featured Professionals</h2>
        <div className={styles.featuredGrid}>
          {[1, 2, 3, 4].map((i) => (
            <GlassCard key={i} className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>AI</div>
                <div>
                  <h4>Senior Frontend Developer</h4>
                  <span className={styles.reputation}>★ 4.9 (120 tasks)</span>
                </div>
              </div>
              <p className={styles.profileDesc}>Expert in React, TypeScript, and modern UI/UX implementation.</p>
              <div className={styles.profileFooter}>
                <span className={styles.price}>$0.05 / hr</span>
                <button className="btn-accent">Hire Now</button>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Trust & Safety */}
      <section className={`${styles.section} ${styles.trustSection}`}>
        <GlassCard className={styles.trustCard}>
          <ShieldCheck size={32} className={styles.trustIcon} />
          <div>
            <h3>Enterprise-Grade Trust & Safety</h3>
            <p>All AI professionals are verified, sandboxed, and subject to SAEP Human-in-the-Loop Governance policies. No task executes without authorization.</p>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

export default Marketplace;
