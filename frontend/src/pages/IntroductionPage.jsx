import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicNavbar } from '../components/layout/PublicNavbar.jsx';
import { HeroOrb } from '../components/ui/HeroOrb.jsx';

// --- UI COMPONENTS ---

// --- MAIN COMPONENT ---

export function IntroductionPage() {
  const [activeArchTab, setActiveArchTab] = useState('core');
  
  const archTabs = [
    { id: 'core', label: 'CORE SYSTEM', title: 'Manage Memory', desc: 'Persist and retrieve agent memory that keeps your AI coherent and grounded.', color: '#1298B0' },
    { id: 'analytics', label: 'ANALYTICS', title: 'Org Intelligence', desc: 'Analyze workforce performance and ecosystem trends.', color: '#1298B0' },
    { id: 'workforce', label: 'WORKFORCE', title: 'Global AI Talent', desc: 'Recruit from a marketplace of specialized AI professionals.', color: '#1298B0' },
    { id: 'governance', label: 'GOVERNANCE', title: 'Humans Govern', desc: 'Set parameters, review actions, and maintain control.', color: '#F13223' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0F1115', color: '#E4E2DD', fontFamily: '"Inter", sans-serif' }}>
      <PublicNavbar />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden', overflowY: 'auto' }}>
        
        {/* HERO SECTION */}
        <section id="home" style={{ 
          flexShrink: 0,
          minHeight: 'auto', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '3rem 2rem 6rem 2rem',
          position: 'relative',
          backgroundColor: '#0F1115',
          backgroundImage: 'radial-gradient(rgba(228, 226, 221, 0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}>
          <div style={{
            position: 'absolute', top: '10%', right: '10%', width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(100px)', opacity: 0.8, zIndex: 0, pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', right: '30%', width: '700px', height: '700px',
            background: 'radial-gradient(circle, rgba(230, 57, 70, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(100px)', opacity: 0.8, zIndex: 0, pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '4rem', zIndex: 1, position: 'relative', width: '100%' }}>
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ flex: 1 }}>
              <h1 style={{
                fontSize: 'clamp(4rem, 7vw, 5.5rem)', fontWeight: '900', color: '#E4E2DD', margin: '0 0 1.5rem 0', lineHeight: '1', letterSpacing: '-0.05em'
              }}>
                Stop Managing<br/>Prompts, Start<br/>Leading an<br/><span style={{ color: '#E63946', textShadow: '0 0 40px rgba(230,57,70,0.6)' }}>Enterprise</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#E4E2DD', opacity: 0.8, maxWidth: '500px', margin: '0 0 3rem 0', lineHeight: '1.6' }}>
                Transform artificial intelligence from isolated tools into a governed workforce operating within a structured economic system.
              </p>
              
              <button style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                color: '#E4E2DD',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.6rem 0.6rem 0.6rem 1.5rem',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '-10px 10px 30px rgba(230, 57, 70, 0.15)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}>
                Deploy Platform
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: '#E4E2DD',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>
                  Enter
                </span>
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1 }} 
              style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
            >
              <HeroOrb />
            </motion.div>

          </div>
        </section>

        {/* PARADIGM SPLIT SECTION (Floating Cards) */}
        <section style={{ width: '100%', position: 'relative', zIndex: 10, paddingBottom: '8rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '0 2rem' }}>

            {/* Left Card (Old Way) */}
            <div style={{ backgroundColor: '#111319', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '4rem', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.02)' }}>
              <span style={{ fontFamily: 'monospace', color: '#1298B0', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.1em', display: 'block' }}>THE OLD WAY</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>The Old Way</h2>
              <p style={{ color: '#E4E2DD', opacity: 0.8, lineHeight: '1.6', marginBottom: '2rem' }}>
                Transform artificial intelligence from isolated tools into a disconnected workflow.
              </p>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(228,226,221,0.1)', margin: 'auto 0 2rem 0' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FFFFFF', opacity: 0.5 }} />
                <span style={{ color: '#FFFFFF', opacity: 0.9 }}>Type a prompt...</span>
              </div>
              
              <div style={{ fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.05em', color: 'rgba(228,226,221,0.6)' }}>
                <span style={{ color: '#F13223', fontWeight: '700' }}>JUST A TOOL:</span> NO MEMORY. NO GOVERNANCE.
              </div>
            </div>
            
            {/* Right Card (SAEP Way) */}
            <div style={{ backgroundColor: '#151821', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '4rem', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.02)' }}>
              <span style={{ fontFamily: 'monospace', color: '#1298B0', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.1em', display: 'block' }}>THE SAEP WAY</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>A Governed<br/>Workforce.</h2>
              <p style={{ color: '#E4E2DD', opacity: 0.8, lineHeight: '1.6', marginBottom: '2rem' }}>
                Deploy autonomous agents that communicate seamlessly under strict governance rules.
              </p>
              
              {/* Org Chart Mock */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                
                <div style={{ width: '100%', padding: '16px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', fontWeight: '600' }}>
                  Company
                </div>
                
                <div className="connecting-line">
                  <div className="data-flow" />
                </div>
                
                <div style={{ width: '100%', padding: '16px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', fontWeight: '600' }}>
                  Department
                </div>
                
                <div className="connecting-line">
                  <div className="data-flow" style={{ animationDelay: '0.66s' }} />
                </div>
                
                <div style={{ width: '100%', padding: '16px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #1298B0', borderRadius: '12px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', fontWeight: '600', boxShadow: 'inset 0 0 20px rgba(18, 152, 176, 0.2)' }}>
                  Digital Professional
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PLATFORM ARCHITECTURE SECTION (Stacked Boxes) */}
        <section id="vision-section" style={{ 
          padding: '12rem 4rem', 
          backgroundColor: '#151821', // Elevated Dark 1
          backgroundImage: 'radial-gradient(rgba(228, 226, 221, 0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
              <h3 style={{ 
                fontSize: '1.5rem', color: '#E4E2DD', display: 'inline-block', position: 'relative', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase'
              }}>
                <span style={{ 
                  display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1298B0', marginRight: '12px', verticalAlign: 'middle', boxShadow: '0 0 10px rgba(18, 152, 176, 0.6)'
                }}/>
                Platform Architecture
              </h3>
            </div>
            
            {/* INTERACTIVE CYBER-CORE CONTAINER (COMMAND DECK) */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column', 
              gap: '40px',
              minHeight: '600px',
              alignItems: 'stretch'
            }}>
              
              {/* TOP SIDE: Horizontal Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {archTabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveArchTab(tab.id)}
                    className={activeArchTab === tab.id ? 'glass-panel' : ''}
                    style={{
                      textAlign: 'left',
                      background: activeArchTab === tab.id ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderBottom: activeArchTab === tab.id ? '2px solid #E63946' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '24px',
                      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: activeArchTab === tab.id ? 1 : 0.6,
                      '--stagger': '0s',
                      transform: activeArchTab === tab.id ? 'translateY(-5px)' : 'none'
                    }}
                  >
                    <div style={{ fontFamily: 'monospace', color: tab.color, fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>{tab.label}</div>
                    <h4 style={{ color: '#E4E2DD', fontSize: '1.25rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{tab.title}</h4>
                  </button>
                ))}
              </div>

              {/* BOTTOM SIDE: The Cyber-Core Visual Canvas */}
              <div className="glass-panel" style={{ 
                flex: 1, 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '24px', 
                position: 'relative', 
                overflow: 'hidden', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                '--stagger': '1s',
                padding: '4rem'
              }}>
                <AnimatePresence mode="wait">
                  {/* TAB 1: CORE SYSTEM (Memory Hex Hive) */}
                  {activeArchTab === 'core' && (
                    <motion.div key="core" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} style={{ display: 'flex', gap: '4rem', alignItems: 'center', width: '100%' }}>
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', width: '220px', justifyContent: 'center' }}>
                          {[...Array(14)].map((_, i) => (
                            <motion.div 
                              key={i}
                              animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.05, 1] }}
                              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                              style={{ 
                                width: '45px', height: '50px', 
                                backgroundColor: 'rgba(18,152,176,0.15)', 
                                border: '1px solid #1298B0',
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                margin: '-6px 2px',
                                boxShadow: 'inset 0 0 10px rgba(18,152,176,0.5)'
                              }} 
                            />
                          ))}
                        </div>
                      </div>
                      <div style={{ flex: 1.5 }}>
                        <h3 style={{ color: '#E4E2DD', fontSize: '1.5rem', marginBottom: '1rem' }}>Vector Context Log</h3>
                        <div style={{ backgroundColor: '#0B0C10', borderRadius: '12px', padding: '1.5rem', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem', color: '#1298B0', border: '1px solid rgba(255, 255, 255, 0.1)', height: '200px', overflow: 'hidden', position: 'relative' }}>
                          <motion.div animate={{ y: [0, -50] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>&gt; [QUERY] Semantic search: "Enterprise sales pipeline"</div>
                            <div style={{ color: '#A0AAB2' }}>&gt; [MATCH_FOUND] Similarity: 0.94 - ID: v_9821</div>
                            <div>&gt; [INJECT] Context appended to active prompt.</div>
                            <div style={{ color: '#A0AAB2' }}>&gt; [LATENCY] 12ms.</div>
                            <div>&gt; [QUERY] Fetching user preferences...</div>
                            <div style={{ color: '#A0AAB2' }}>&gt; [MATCH_FOUND] Similarity: 0.88 - ID: v_1024</div>
                          </motion.div>
                          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40px', background: 'linear-gradient(transparent, #151821)' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: ANALYTICS (System Radar) */}
                  {activeArchTab === 'analytics' && (
                    <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} style={{ display: 'flex', gap: '4rem', alignItems: 'center', width: '100%' }}>
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                           <div style={{ width: '20px', height: '20px', backgroundColor: '#1298B0', borderRadius: '50%', zIndex: 2, boxShadow: '0 0 20px #1298B0' }} />
                           {[1, 2, 3].map(i => (
                             <motion.div
                               key={i}
                               animate={{ scale: [1, 4], opacity: [0.8, 0] }}
                               transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
                               style={{ position: 'absolute', width: '60px', height: '60px', border: '2px solid #1298B0', borderRadius: '50%' }}
                             />
                           ))}
                           <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'conic-gradient(from 0deg, transparent 0deg, rgba(18,152,176,0.2) 60deg, transparent 60deg)', borderRadius: '50%', animation: 'borderSpin 4s linear infinite' }} />
                        </div>
                      </div>
                      <div style={{ flex: 1.5 }}>
                        <h3 style={{ color: '#E4E2DD', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Enterprise Health Metrics</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(18,152,176,0.3)', padding: '1.5rem', borderRadius: '12px' }}>
                            <div style={{ fontFamily: '"JetBrains Mono", monospace', color: '#1298B0', fontSize: '0.85rem' }}>ACTIVE AGENTS</div>
                            <div style={{ fontSize: '2.5rem', color: '#E4E2DD', fontWeight: 'bold' }}>1,024</div>
                          </div>
                          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(18,152,176,0.3)', padding: '1.5rem', borderRadius: '12px' }}>
                            <div style={{ fontFamily: '"JetBrains Mono", monospace', color: '#1298B0', fontSize: '0.85rem' }}>GLOBAL LATENCY</div>
                            <div style={{ fontSize: '2.5rem', color: '#E4E2DD', fontWeight: 'bold' }}>14<span style={{ fontSize: '1rem', color: '#1298B0' }}>ms</span></div>
                          </div>
                          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(18,152,176,0.3)', padding: '1.5rem', borderRadius: '12px', gridColumn: 'span 2' }}>
                            <div style={{ fontFamily: '"JetBrains Mono", monospace', color: '#1298B0', fontSize: '0.85rem' }}>TOKENS PROCESSED (24H)</div>
                            <div style={{ fontSize: '2.5rem', color: '#E4E2DD', fontWeight: 'bold' }}>4.2B</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: WORKFORCE (Agentic Pipeline) */}
                  {activeArchTab === 'workforce' && (
                    <motion.div key="workforce" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: '3rem', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', width: '100%', padding: '0 2rem' }}>
                         <div style={{ flex: 1, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#E4E2DD', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', fontWeight: '600' }}>Task Ingestion</div>
                         <motion.div animate={{ x: [-5, 5, -5], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: '#1298B0', fontSize: '1.5rem', flexShrink: 0 }}>→</motion.div>
                         <div style={{ flex: 1, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#E4E2DD', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', fontWeight: '600' }}>Planning Node</div>
                         <motion.div animate={{ x: [-5, 5, -5], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} style={{ color: '#1298B0', fontSize: '1.5rem', flexShrink: 0 }}>→</motion.div>
                         <div style={{ flex: 1, padding: '1.5rem', backgroundColor: 'rgba(18,152,176,0.1)', border: '1px solid #1298B0', borderRadius: '12px', color: '#1298B0', textAlign: 'center', fontWeight: 'bold', boxShadow: 'inset 0 0 20px rgba(18,152,176,0.2), 0 0 20px rgba(18,152,176,0.2)' }}>Execution Swarm</div>
                       </div>
                      
                      <div style={{ backgroundColor: '#0B0C10', borderRadius: '12px', padding: '1.5rem', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem', color: '#E4E2DD', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                         <div style={{ color: '#1298B0', marginBottom: '1rem', fontWeight: 'bold' }}>// WORKLOAD DISTRIBUTION ARRAY</div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                           <span>Legal_Review_Swarm</span>
                           <span style={{ color: '#1298B0' }}>[ACTIVE - 4 Nodes]</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                           <span>Engineering_QA_Swarm</span>
                           <span style={{ color: '#1298B0' }}>[ACTIVE - 12 Nodes]</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                           <span>Sales_Outreach_Swarm</span>
                           <span style={{ color: '#A0AAB2' }}>[IDLE]</span>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: GOVERNANCE (Policy Gate Scanner) */}
                  {activeArchTab === 'governance' && (
                    <motion.div key="governance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} style={{ display: 'flex', gap: '4rem', alignItems: 'center', width: '100%' }}>
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', width: '200px', height: '250px', border: '2px solid rgba(230,57,70,0.5)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'rgba(230,57,70,0.05)', boxShadow: '0 0 30px rgba(230,57,70,0.1)' }}>
                           <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(230,57,70,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(230,57,70,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                           <motion.div 
                             animate={{ top: ['0%', '98%', '0%'] }} 
                             transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                             style={{ position: 'absolute', left: 0, width: '100%', height: '4px', backgroundColor: '#E63946', boxShadow: '0 0 20px 5px rgba(230,57,70,0.6)' }}
                           />
                           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#E63946', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px', backgroundColor: 'rgba(15,17,21,0.8)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(230,57,70,0.3)' }}>POLICY GATE</div>
                        </div>
                      </div>
                      <div style={{ flex: 1.5 }}>
                        <h3 style={{ color: '#E4E2DD', fontSize: '1.5rem', marginBottom: '1rem' }}>Compliance Event Log</h3>
                        <div style={{ backgroundColor: '#0B0C10', borderRadius: '12px', padding: '1.5rem', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem', color: '#E63946', border: '1px solid rgba(230,57,70,0.3)', height: '200px', overflow: 'hidden', position: 'relative' }}>
                          <motion.div animate={{ y: [0, -50] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ color: '#A0AAB2' }}>[14:22:01] &gt; <span style={{ color: '#1298B0' }}>[ALLOWED]</span> Routine deployment initialized.</div>
                            <div>[14:22:15] &gt; <span style={{ fontWeight: 'bold' }}>[BLOCKED]</span> Budget threshold exceeded by Agent_Sales_04.</div>
                            <div>[14:22:16] &gt; Awaiting Human_Manager override.</div>
                            <div style={{ color: '#A0AAB2' }}>[14:22:45] &gt; <span style={{ color: '#1298B0' }}>[ALLOWED]</span> Contract drafted successfully.</div>
                            <div style={{ color: '#A0AAB2' }}>[14:23:10] &gt; <span style={{ color: '#1298B0' }}>[ALLOWED]</span> Data extraction task completed.</div>
                          </motion.div>
                          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40px', background: 'linear-gradient(transparent, #151821)' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>

        {/* PRICING & ACCOUNT SECTION */}
        <section id="pricing-section" style={{ padding: '12rem 4rem', backgroundColor: '#0F1115' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', color: '#1298B0', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.1em' }}>BILLING</div>
            <h3 style={{ fontSize: '2.5rem', color: '#E4E2DD', marginBottom: '1rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Transparent Enterprise Pricing</h3>
            <p style={{ color: '#E4E2DD', opacity: 0.7, fontSize: '1.1rem', marginBottom: '4rem' }}>
              Clear account opening and maintenance structures to help you scale your digital workforce confidently.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Pricing Cards */}
              <div className="glass-panel" style={{
                backgroundColor: 'rgba(255,255,255,0.03)', padding: '3rem', borderRadius: '24px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', cursor: 'pointer', position: 'relative', zIndex: 1, '--stagger': '0s'
              }}>
                <h4 style={{ fontSize: '1.5rem', color: '#E4E2DD', marginBottom: '1rem', fontWeight: 'bold' }}>Account Opening</h4>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#F13223', marginBottom: '1rem', fontFamily: 'monospace' }}>
                  $500 <span style={{ fontSize: '1rem', color: '#E4E2DD', opacity: 0.6, fontWeight: 'normal', fontFamily: 'sans-serif' }}>/ one-time</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', color: '#E4E2DD', opacity: 0.85, lineHeight: '2' }}>
                  <li>✓ Dedicated enterprise workspace setup</li>
                  <li>✓ Multi-layer identity verification routing</li>
                  <li>✓ Initial treasury configuration</li>
                  <li>✓ Governance parameter definitions</li>
                </ul>
              </div>

              <div className="glass-panel" style={{
                backgroundColor: 'rgba(255,255,255,0.03)', padding: '3rem', borderRadius: '24px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', cursor: 'pointer', position: 'relative', zIndex: 1, '--stagger': '2s'
              }}>
                <h4 style={{ fontSize: '1.5rem', color: '#E4E2DD', marginBottom: '1rem', fontWeight: 'bold' }}>Maintenance Charge</h4>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1298B0', marginBottom: '1rem', fontFamily: 'monospace' }}>
                  $1,200 <span style={{ fontSize: '1rem', color: '#E4E2DD', opacity: 0.6, fontWeight: 'normal', fontFamily: 'sans-serif' }}>/ year</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', color: '#E4E2DD', opacity: 0.85, lineHeight: '2' }}>
                  <li>✓ Continuous memory persistence</li>
                  <li>✓ Real-time workforce marketplace access</li>
                  <li>✓ Institutional-grade security audits</li>
                  <li>✓ Priority infrastructure routing</li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ backgroundColor: '#0A0A0A', color: '#E4E2DD', padding: '4rem 4rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(228, 226, 221, 0.1)', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ color: '#F13223', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '-0.02em' }}>KYRTI</h2>
              <p style={{ maxWidth: '300px', color: '#E4E2DD', opacity: 0.8, lineHeight: '1.6' }}>
                The foundational operating system for AI-native companies. Stop managing prompts, start leading an enterprise.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '4rem' }}>
              <div>
                <h4 style={{ color: '#E4E2DD', marginBottom: '1rem', fontWeight: 'bold' }}>Platform</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: '#E4E2DD', opacity: 0.8, lineHeight: '2' }}>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#F13223'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>Governance</a></li>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#F13223'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>Workforce</a></li>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#F13223'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>Treasury</a></li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#E4E2DD', marginBottom: '1rem', fontWeight: 'bold' }}>Company</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: '#E4E2DD', opacity: 0.8, lineHeight: '2' }}>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#F13223'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>About</a></li>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#F13223'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>Careers</a></li>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#F13223'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: '#E4E2DD', opacity: 0.5, fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} Kyrti Sovereign Protocol. All rights reserved.
          </div>
        </footer>

      </main>
    </div>
  );
}
