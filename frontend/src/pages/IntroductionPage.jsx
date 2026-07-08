import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { HeroOrb } from '../components/ui/HeroOrb.jsx';
import { 
  ArrowRight, 
  Bot, 
  Shield, 
  Cpu, 
  Activity, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  User, 
  DollarSign, 
  Layers, 
  Eye, 
  Star,
  Users,
  Lock,
  Workflow,
  Database,
  Network,
  Terminal,
  Server
} from 'lucide-react';

export function IntroductionPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  
  // Navigation & Scroll
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // State for Workflows Tabs
  const [activeWorkflow, setActiveWorkflow] = useState('creation');
  
  // State for FAQ Accordion
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleCTAClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const projectDetails = {
    principles: [
      { title: "Humans Govern", desc: "Humans always possess final authority over ownership, hiring, promotions, terminations, financial transfers, and legal accountability." },
      { title: "AI Operates", desc: "AI professionals execute business processes, analyze metrics, generate forecasts, and draft agreements within strict guardrails." }
    ],
    architecture: [
      { num: "01", title: "Product Layer", desc: "Manages company workspace lifecycle, organization departments, and CEO dashboard routing." },
      { num: "02", title: "Governance Layer", desc: "Enforces human spending limits, approval hierarchies, and company-wide voting." },
      { num: "03", title: "Marketplace Layer", desc: "Hosts the public catalog of AI professions where companies recruit specialized digital talent." },
      { num: "04", title: "Workforce Layer", desc: "Handles agent employment, career histories, skill ratings, and role promotions." },
      { num: "05", title: "Memory Layer", desc: "Coordinates graph memory (Neo4j) and vector context embeddings (Qdrant) for long-term recall." },
      { num: "06", title: "Communication Layer", desc: "Powers human-agent meetings, chat workspace communication channels, and automated reports." },
      { num: "07", title: "Security Layer", desc: "Ensures rigid multi-tenant isolation, 2FA authorization keys, and secret credential protection." },
      { num: "08", title: "Intelligence Layer", desc: "Tracks workforce analytics, system capability evolution, and marketplace demands." },
      { num: "09", title: "Infrastructure Layer", desc: "Deploys databases, event brokers, and container instances for continuous execution." },
      { num: "10", title: "Audit Layer", desc: "Constructs immutable compliance logs and trace trails tracking every single agent action." }
    ],
    stack: [
      { name: "PostgreSQL", category: "Relational DB", desc: "Stores company structures, departments, user profiles, and static configurations." },
      { name: "Kafka & Zookeeper", category: "Event Broker", desc: "Orchestrates microservices coordination, asynchronous messaging, and state events." },
      { name: "Neo4j", category: "Graph DB", desc: "Builds context relationship maps for agent knowledge retention and personal memories." },
      { name: "Qdrant", category: "Vector DB", desc: "Saves high-dimensional embeddings for fast semantic lookup and memory recall." },
      { name: "Ollama", category: "LLM Runner", desc: "Runs open-weights LLMs locally (e.g. llama3) to execute agent tasks securely on CPU." },
      { name: "Redis", category: "Cache Store", desc: "Speeds up authorization lookups, handles 2FA codes, and maintains session states." },
      { name: "Temporal", category: "Workflow Engine", desc: "Coordinates long-running, multi-step agent actions with reliable retry guarantees." },
      { name: "Zipkin", category: "Distributed Tracing", desc: "Traces HTTP call latencies and request paths across microservice boundaries." },
      { name: "Prometheus & Grafana", category: "Observability", desc: "Monitors CPU loads, network throughput, and dashboard performance metrics." }
    ]
  };

  const faqData = [
    {
      q: "What is the Kyrti AI Enterprise Protocol?",
      a: "Kyrti is an advanced, microservices-based operating system designed to run human-governed companies using AI-native Digital Professionals. Instead of isolated chatbots, Kyrti builds a structured digital workforce executing business tasks under human authority."
    },
    {
      q: "How does the 'Humans Govern, AI Operates' model work?",
      a: "Humans always retain ultimate legal and financial control. AI agents can analyze documents, write code, or draft budgets, but they cannot authorize spending, transfer funds, hire/fire peers, or modify company governance without human signature approvals."
    },
    {
      q: "How is agent memory persistent and isolated?",
      a: "Kyrti uses a dual Graph (Neo4j) and Vector (Qdrant) structure. Memory is divided into personal memory, company memory, and profession memory. Strict database-level tenant isolation ensures company secrets never transfer between organizations."
    },
    {
      q: "What infrastructure runs Kyrti locally?",
      a: "The protocol runs inside Docker. It leverages PostgreSQL for relations, Redis for caching, Kafka for streaming, Neo4j/Qdrant for semantic graph memory, Ollama for local LLM runs, and Temporal for workflow orchestration."
    }
  ];

  // Helper motion variants for section entries
  const revealVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } }
  };

  return (
    <div style={{ 
      backgroundColor: '#141413', 
      color: '#FBF9F5', 
      fontFamily: '"Inter", sans-serif', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Background Radial Brand Glows */}
      <div style={{
        position: 'absolute', top: '5%', left: '10%', width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(255, 92, 0, 0.15) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '45%', right: '5%', width: '800px', height: '800px',
        background: 'radial-gradient(circle, rgba(232, 148, 58, 0.12) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '80%', left: '20%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(212, 132, 46, 0.1) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(110px)', pointerEvents: 'none', zIndex: 0
      }} />

      {/* HEADER / HORIZONTAL NAVBAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(20, 20, 19, 0.85)',
        borderBottom: '1px solid rgba(255, 92, 0, 0.15)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1.1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div 
            onClick={() => scrollToSection('hero')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <img src="/main_logo.png" alt="Kyrti" style={{ width: '130px', height: 'auto', objectFit: 'contain' }} />
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2.2rem' }}>
            {['Architecture', 'Ecosystem Stack', 'Workflows', 'FAQs'].map((tab, i) => (
              <button 
                key={i}
                onClick={() => scrollToSection(tab === 'Ecosystem Stack' ? 'stack' : tab.toLowerCase())} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#C4C0B8', 
                  fontSize: '0.92rem', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  transition: 'color 0.2s' 
                }}
                onMouseOver={e => e.currentTarget.style.color = '#FF5C00'}
                onMouseOut={e => e.currentTarget.style.color = '#C4C0B8'}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Auth CTA */}
          <div>
            <button 
              onClick={handleCTAClick}
              style={{
                backgroundColor: '#FF5C00',
                border: '1px solid #FF5C00',
                padding: '0.6rem 1.4rem',
                borderRadius: '99px',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(255, 92, 0, 0.35)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#E8943A';
                e.currentTarget.style.borderColor = '#E8943A';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 92, 0, 0.5)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#FF5C00';
                e.currentTarget.style.borderColor = '#FF5C00';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 92, 0, 0.35)';
              }}
            >
              {isAuthenticated ? 'Enter Portal' : 'Access Portal'}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        
        {/* HERO SECTION */}
        <section id="hero" style={{ 
          padding: '5.5rem 0 3rem 0', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center' 
        }}>
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 92, 0, 0.12)',
              border: '1px solid rgba(255, 92, 0, 0.35)',
              padding: '6px 16px',
              borderRadius: '99px',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#FF5C00',
              marginBottom: '2rem',
              boxShadow: '0 0 20px rgba(255, 92, 0, 0.2)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5C00', display: 'inline-block' }} />
            Kyrti AI Enterprise Platform
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
              fontWeight: '900',
              lineHeight: '1.1',
              letterSpacing: '-1.5px',
              maxWidth: '880px',
              margin: '0 auto 1.5rem auto',
              color: '#FBF9F5'
            }}
          >
            Stop managing prompts.<br/>
            <span style={{
              background: 'linear-gradient(135deg, #FF5C00, #E8943A, #D4842E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Start leading an enterprise.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)',
              color: '#C4C0B8',
              lineHeight: '1.65',
              maxWidth: '720px',
              margin: '0 auto 2.5rem auto'
            }}
          >
            An advanced, microservices-based enterprise operating system. Run collaborative AI workforce swarms under immutable compliance tracing and strict human governance.
          </motion.p>

          {/* Call to Action Button */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <button
              onClick={handleCTAClick}
              style={{
                backgroundColor: '#FF5C00',
                color: '#FFFFFF',
                border: 'none',
                padding: '1rem 2.2rem',
                borderRadius: '99px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 25px rgba(255, 92, 0, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#E8943A';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 92, 0, 0.55)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#FF5C00';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 92, 0, 0.4)';
              }}
            >
              Launch Portal
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => scrollToSection('architecture')}
              style={{
                backgroundColor: 'rgba(255, 92, 0, 0.1)',
                color: '#E8943A',
                border: '1px solid rgba(232, 148, 58, 0.35)',
                padding: '1rem 2rem',
                borderRadius: '99px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 92, 0, 0.2)';
                e.currentTarget.style.borderColor = '#FF5C00';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 92, 0, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(232, 148, 58, 0.35)';
              }}
            >
              Explore Architecture
            </button>
          </motion.div>
        </section>

        {/* HERO ORB INTERACTIVE VISUALIZATION */}
        <section style={{ padding: '2rem 0 4rem 0' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{
              background: 'linear-gradient(135deg, rgba(34, 32, 30, 0.8), rgba(26, 26, 26, 0.95))',
              border: '1px solid rgba(255, 92, 0, 0.25)',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 92, 0, 0.15)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#E8943A', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Interactive Swarm Simulation
              </span>
            </div>
            <HeroOrb />
          </motion.div>
        </section>

        {/* MOCKUP PORTAL PREVIEW (WARM BRAND THEME) */}
        <section style={{ padding: '2rem 0 5rem 0' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 92, 0, 0.25), rgba(232, 148, 58, 0.1))',
              border: '1px solid rgba(255, 92, 0, 0.3)',
              borderRadius: '22px',
              padding: '10px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 35px rgba(255, 92, 0, 0.2)',
              maxWidth: '980px',
              margin: '0 auto'
            }}
          >
            {/* Inner Dashboard Frame */}
            <div style={{
              background: '#1A1A1A',
              borderRadius: '16px',
              height: '460px',
              overflow: 'hidden',
              display: 'flex',
              border: '1px solid rgba(255, 92, 0, 0.2)'
            }}>
              
              {/* Sidebar */}
              <div style={{
                width: '180px',
                borderRight: '1px solid rgba(255, 92, 0, 0.15)',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                background: '#141413'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#FF5C00', boxShadow: '0 0 10px #FF5C00' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '-0.3px', color: '#FBF9F5' }}>Kyrti Portal</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {[
                    { label: 'Overview', active: true },
                    { label: 'Treasury' },
                    { label: 'Workforce Swarms' },
                    { label: 'Governance Policy' },
                    { label: 'Compliance Ledger' },
                    { label: 'Spatial Office' }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        color: item.active ? '#FF5C00' : '#C4C0B8',
                        backgroundColor: item.active ? 'rgba(255, 92, 0, 0.15)' : 'transparent',
                        borderLeft: item.active ? '3px solid #FF5C00' : 'none'
                      }}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Panel */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: '#1A1A1A'
              }}>
                
                {/* Top Bar */}
                <div style={{
                  padding: '0.9rem 1.4rem',
                  borderBottom: '1px solid rgba(255, 92, 0, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#141413'
                }}>
                  <span style={{ fontSize: '0.78rem', color: '#C4C0B8', fontWeight: '600' }}>
                    Kyrti Core: <span style={{ color: '#FF5C00', fontWeight: '700' }}>Active Swarm Ready</span>
                  </span>
                  
                  {/* Operator Label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 92, 0, 0.1)', padding: '4px 10px', borderRadius: '99px', border: '1px solid rgba(255, 92, 0, 0.25)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF5C00', boxShadow: '0 0 6px #FF5C00' }} />
                    <span style={{ fontSize: '0.75rem', color: '#E8943A', fontWeight: '700' }}>Operator Portal</span>
                  </div>
                </div>

                {/* Simulated Content Area */}
                <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1, overflow: 'hidden', backgroundColor: '#1F1D1A' }}>
                  
                  {/* Mini Cards Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
                    <div style={{ background: '#1A1A1A', border: '1px solid rgba(255, 92, 0, 0.2)', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <div style={{ fontSize: '0.65rem', color: '#C4C0B8', fontWeight: '700', letterSpacing: '0.5px' }}>ACTIVE AGENTS</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FBF9F5', marginTop: '4px' }}>14 / 16</div>
                    </div>
                    <div style={{ background: '#1A1A1A', border: '1px solid rgba(255, 92, 0, 0.35)', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 4px 12px rgba(255, 92, 0, 0.15)' }}>
                      <div style={{ fontSize: '0.65rem', color: '#E8943A', fontWeight: '700', letterSpacing: '0.5px' }}>TREASURY BALANCE</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FF5C00', marginTop: '4px' }}>$142,500.00</div>
                    </div>
                    <div style={{ background: '#1A1A1A', border: '1px solid rgba(255, 92, 0, 0.2)', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <div style={{ fontSize: '0.65rem', color: '#C4C0B8', fontWeight: '700', letterSpacing: '0.5px' }}>COMPLIANCE SCORE</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#E8943A', marginTop: '4px' }}>100% SECURE</div>
                    </div>
                  </div>

                  {/* Chart and Activity Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.2rem', flex: 1, minHeight: 0 }}>
                    
                    {/* Simulated Graph */}
                    <div style={{ background: '#1A1A1A', border: '1px solid rgba(255, 92, 0, 0.2)', borderRadius: '12px', padding: '12px 16px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#FBF9F5', marginBottom: '0.85rem' }}>Task Processing Efficiency</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1, paddingBottom: '2px' }}>
                        {[60, 45, 80, 55, 90, 70, 85, 40, 95, 75].map((val, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '8%' }}>
                            <div style={{
                              width: '100%',
                              height: `${val * 1.1}px`,
                              background: idx === 8 ? 'linear-gradient(to top, #FF5C00, #E8943A)' : 'rgba(255, 92, 0, 0.2)',
                              borderRadius: '4px',
                              boxShadow: idx === 8 ? '0 0 12px #FF5C00' : 'none'
                            }} />
                            <span style={{ fontSize: '0.55rem', color: '#C4C0B8' }}>M{idx+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Simulated Live Ledger */}
                    <div style={{ background: '#1A1A1A', border: '1px solid rgba(255, 92, 0, 0.2)', borderRadius: '12px', padding: '12px 16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#FBF9F5', marginBottom: '0.7rem' }}>Live Compliance Log</div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.65rem', fontFamily: 'monospace' }}>
                        <div style={{ borderBottom: '1px solid rgba(255, 92, 0, 0.1)', paddingBottom: '4px' }}>
                          <span style={{ color: '#FF5C00', fontWeight: '800' }}>[OK]</span> Agent_Legal reviewed SAEP contract.
                        </div>
                        <div style={{ borderBottom: '1px solid rgba(255, 92, 0, 0.1)', paddingBottom: '4px' }}>
                          <span style={{ color: '#E8943A', fontWeight: '800' }}>[WARN]</span> Agent_Devops threshold set to 95%.
                        </div>
                        <div style={{ borderBottom: '1px solid rgba(255, 92, 0, 0.1)', paddingBottom: '4px' }}>
                          <span style={{ color: '#FF5C00', fontWeight: '800' }}>[OK]</span> Identity 2FA verified: admin@kyrti.
                        </div>
                        <div>
                          <span style={{ color: '#D4842E', fontWeight: '800' }}>[INFO]</span> Payout via Treasury gateway.
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        </section>

        {/* CORE PHILOSOPHY (Humans Govern, AI Operates) */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          style={{ padding: '5rem 0', borderTop: '1px solid rgba(255, 92, 0, 0.15)' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 32, 30, 0.85), rgba(26, 26, 26, 0.95))',
            border: '1px solid rgba(255, 92, 0, 0.25)',
            borderRadius: '20px',
            padding: '3.5rem 3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '2px' }}>Core Philosophy</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: '900', marginTop: '0.6rem', letterSpacing: '-0.5px', color: '#FBF9F5', lineHeight: '1.2' }}>
                Humans Govern.<br/>
                <span style={{ color: '#E8943A' }}>AI Operates.</span>
              </h2>
              <p style={{ color: '#C4C0B8', fontSize: '1rem', lineHeight: '1.7', marginTop: '1.2rem' }}>
                Kyrti aligns autonomous agent swarms with company directives by maintaining rigid operational guardrails between digital execution and human administrative authority.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              {projectDetails.principles.map((pr, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 92, 0, 0.18)',
                    border: '1px solid #FF5C00',
                    color: '#FF5C00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    boxShadow: '0 0 12px rgba(255, 92, 0, 0.3)'
                  }}>✓</div>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: '750', color: '#FBF9F5' }}>{pr.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#C4C0B8', lineHeight: '1.6' }}>{pr.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 10 ARCHITECTURAL LAYERS */}
        <motion.section 
          id="architecture" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          style={{ padding: '6rem 0', borderTop: '1px solid rgba(255, 92, 0, 0.15)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '2px' }}>Structural Blueprint</span>
            <h2 style={{ fontSize: '2.8rem', fontWeight: '900', marginTop: '0.5rem', letterSpacing: '-0.8px', color: '#FBF9F5' }}>The Ten Major Layers</h2>
            <p style={{ color: '#C4C0B8', maxWidth: '650px', margin: '0.75rem auto 0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
              A full-featured operating environment providing complete multi-tenant isolation, execution coordination, and immutable audit logs.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.6rem'
          }}>
            {projectDetails.architecture.map((layer, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, borderColor: '#FF5C00', boxShadow: '0 15px 35px rgba(255, 92, 0, 0.2)' }}
                transition={{ duration: 0.25 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 32, 30, 0.7), rgba(26, 26, 26, 0.9))',
                  border: '1px solid rgba(255, 92, 0, 0.18)',
                  borderRadius: '16px',
                  padding: '1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  cursor: 'default',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#FF5C00', fontWeight: '800', background: 'rgba(255, 92, 0, 0.12)', padding: '4px 10px', borderRadius: '6px' }}>
                    LAYER {layer.num}
                  </span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF5C00', boxShadow: '0 0 8px #FF5C00' }} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FBF9F5', margin: 0 }}>{layer.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#C4C0B8', lineHeight: '1.6', margin: 0 }}>{layer.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* INFRASTRUCTURE STACK COMPONENTS */}
        <motion.section 
          id="stack" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          style={{ padding: '6rem 0', borderTop: '1px solid rgba(255, 92, 0, 0.15)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '2px' }}>Infrastructure Stack</span>
            <h2 style={{ fontSize: '2.8rem', fontWeight: '900', marginTop: '0.5rem', letterSpacing: '-0.8px', color: '#FBF9F5' }}>Ecosystem Technologies</h2>
            <p style={{ color: '#C4C0B8', maxWidth: '650px', margin: '0.75rem auto 0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Kyrti harnesses industry-standard databases, caches, and event streams inside secure, isolated local Docker containers.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.6rem'
          }}>
            {projectDetails.stack.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, borderColor: '#FF5C00', boxShadow: '0 15px 35px rgba(255, 92, 0, 0.2)' }}
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 32, 30, 0.7), rgba(26, 26, 26, 0.9))',
                  border: '1px solid rgba(255, 92, 0, 0.18)',
                  borderRadius: '16px',
                  padding: '1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#E8943A', backgroundColor: 'rgba(232, 148, 58, 0.15)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(232, 148, 58, 0.3)' }}>
                    {service.category}
                  </span>
                  <Database size={18} color="#FF5C00" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FBF9F5', margin: 0 }}>{service.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#C4C0B8', lineHeight: '1.6', margin: 0 }}>{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PLATFORM WORKFLOWS */}
        <motion.section 
          id="workflows" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          style={{ padding: '6rem 0', borderTop: '1px solid rgba(255, 92, 0, 0.15)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '2px' }}>Operational Pipelines</span>
            <h2 style={{ fontSize: '2.8rem', fontWeight: '900', marginTop: '0.5rem', letterSpacing: '-0.8px', color: '#FBF9F5' }}>Core Platform Workflows</h2>
            <p style={{ color: '#C4C0B8', maxWidth: '650px', margin: '0.75rem auto 0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Inspect how interactions transition securely between human commands and AI swarm executions.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            maxWidth: '920px',
            margin: '0 auto'
          }}>
            {/* Workflows Selector */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px',
              background: 'rgba(34, 32, 30, 0.8)',
              padding: '8px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 92, 0, 0.25)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
            }}>
              {[
                { id: 'creation', label: 'Company Creation', icon: Layers },
                { id: 'hiring', label: 'Hiring Workflow', icon: Users },
                { id: 'task', label: 'Task Execution', icon: Workflow }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkflow(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px 10px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    color: activeWorkflow === tab.id ? '#FFFFFF' : '#C4C0B8',
                    background: activeWorkflow === tab.id ? 'linear-gradient(135deg, #FF5C00, #E8943A)' : 'transparent',
                    boxShadow: activeWorkflow === tab.id ? '0 4px 15px rgba(255, 92, 0, 0.4)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Workflow Window Content */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 32, 30, 0.85), rgba(26, 26, 26, 0.95))',
              border: '1px solid rgba(255, 92, 0, 0.25)',
              borderRadius: '20px',
              padding: '2.8rem',
              minHeight: '240px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}>
              <AnimatePresence mode="wait">
                {activeWorkflow === 'creation' && (
                  <motion.div
                    key="creation"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
                  >
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FBF9F5', margin: 0 }}>Company Workspace Initialization</h3>
                    <p style={{ color: '#C4C0B8', lineHeight: '1.7', margin: 0, fontSize: '1.02rem' }}>
                      The workflow starts when a Human Operator sets up a Company Profile. The portal deploys corporate governance rules, configures the Relational DB mapping, initializes department settings, and starts the workforce allocation routines.
                    </p>
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '0.6rem', fontSize: '0.85rem', color: '#FF5C00', fontFamily: 'monospace', fontWeight: '700', alignItems: 'center' }}>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Human Creates Company</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Verification Check</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Namespace Created</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Departments Setup</span>
                    </div>
                  </motion.div>
                )}

                {activeWorkflow === 'hiring' && (
                  <motion.div
                    key="hiring"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
                  >
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FBF9F5', margin: 0 }}>Digital Professional Recruitment</h3>
                    <p style={{ color: '#C4C0B8', lineHeight: '1.7', margin: 0, fontSize: '1.02rem' }}>
                      Humans search the public Marketplace for specific AI professions (such as CEO, CTO, Backend, Frontend, and QA engineers). Operators can interview AI applicants in the visual Interview Room, negotiate credits, and approve structural employments.
                    </p>
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '0.6rem', fontSize: '0.85rem', color: '#FF5C00', fontFamily: 'monospace', fontWeight: '700', alignItems: 'center' }}>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Search Marketplace</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Interview Room Check</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Human Approval Signature</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Employment Initiated</span>
                    </div>
                  </motion.div>
                )}

                {activeWorkflow === 'task' && (
                  <motion.div
                    key="task"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
                  >
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FBF9F5', margin: 0 }}>Task Execution and Swarm Processing</h3>
                    <p style={{ color: '#C4C0B8', lineHeight: '1.7', margin: 0, fontSize: '1.02rem' }}>
                      Once a task is created, a Planning Node breaks it down. The task is assigned to an Execution Swarm of AI professionals. Agents complete tasks using memory lookup, verify outputs through a QA node, and request final human approval when complete.
                    </p>
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '0.6rem', fontSize: '0.85rem', color: '#FF5C00', fontFamily: 'monospace', fontWeight: '700', alignItems: 'center' }}>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Task Ingested</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Planning Node Breakdown</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Swarm Execution</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>QA Verification</span>
                      <span>→</span>
                      <span style={{ background: 'rgba(255, 92, 0, 0.12)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255, 92, 0, 0.3)' }}>Human Signoff</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* FAQ ACCORDION SECTION */}
        <motion.section 
          id="faqs" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          style={{ padding: '6rem 0', borderTop: '1px solid rgba(255, 92, 0, 0.15)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '2px' }}>Support</span>
            <h2 style={{ fontSize: '2.8rem', fontWeight: '900', marginTop: '0.5rem', letterSpacing: '-0.8px', color: '#FBF9F5' }}>Frequently Asked Questions</h2>
            <p style={{ color: '#C4C0B8', maxWidth: '650px', margin: '0.75rem auto 0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Find quick answers to operations, safety controls, and registry details.
            </p>
          </div>

          <div style={{
            maxWidth: '780px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem'
          }}>
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid rgba(255, 92, 0, 0.2)',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(34, 32, 30, 0.8), rgba(26, 26, 26, 0.9))',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '1.4rem 1.8rem',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: '#FBF9F5',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: '750' }}>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp size={20} color="#FF5C00" />
                  ) : (
                    <ChevronDown size={20} color="#C4C0B8" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div style={{
                        padding: '0 1.8rem 1.6rem 1.8rem',
                        fontSize: '0.95rem',
                        color: '#C4C0B8',
                        lineHeight: '1.7',
                        borderTop: '1px solid rgba(255, 92, 0, 0.12)',
                        paddingTop: '1.2rem'
                      }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>

        {/* BOTTOM CTA GRADIENT SECTION */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          style={{ padding: '3rem 0 6rem 0' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #FF5C00, #E8943A, #D4842E)',
            borderRadius: '24px',
            padding: '4.5rem 3.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(255, 92, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#FFFFFF', marginBottom: '1.2rem', letterSpacing: '-0.8px', lineHeight: '1.15' }}>
                Let AI take the busy work off your team's plate.
              </h2>
              <p style={{ color: '#FFFFFF', opacity: 0.95, fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                Deploy your digital workforce swarm, define governance parameters, and start running a state-of-the-art AI-native enterprise.
              </p>
              
              <button
                onClick={handleCTAClick}
                style={{
                  backgroundColor: '#1A1A1A',
                  color: '#FF5C00',
                  border: '2px solid #1A1A1A',
                  padding: '1rem 2.4rem',
                  borderRadius: '99px',
                  fontSize: '1rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#1A1A1A';
                  e.currentTarget.style.borderColor = '#1A1A1A';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
                }}
              >
                Launch Portal Now
              </button>
            </div>
          </div>
        </motion.section>

      </main>

      {/* FOOTER */}
      <footer style={{ 
        backgroundColor: '#141413', 
        borderTop: '1px solid rgba(255, 92, 0, 0.18)',
        padding: '4.5rem 0 3.5rem 0',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '3rem',
            marginBottom: '4.5rem'
          }}>
            
            {/* Branding column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '340px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/main_logo.png" alt="Kyrti" style={{ width: '120px', height: 'auto', objectFit: 'contain' }} />
              </div>
              <p style={{ fontSize: '0.9rem', color: '#C4C0B8', lineHeight: '1.65', margin: 0 }}>
                Foundational operating system for autonomous digital enterprises. Deploy custom AI workforce agents under immutable ledger monitoring and corporate governance.
              </p>
            </div>

            {/* Links columns */}
            <div style={{ display: 'flex', gap: '6rem', flexWrap: 'wrap' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#FF5C00', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                  {["Governance", "Workforce Swarms", "Treasury", "Spatial Office", "Compliance Ledger"].map((item, idx) => (
                    <a key={idx} href="#" style={{ color: '#C4C0B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#FF5C00'} onMouseOut={e => e.currentTarget.style.color = '#C4C0B8'}>{item}</a>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#FF5C00', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Company</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                  {["About Us", "Ecosystem Blog", "Developer SDK", "Careers", "Contact"].map((item, idx) => (
                    <a key={idx} href="#" style={{ color: '#C4C0B8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#FF5C00'} onMouseOut={e => e.currentTarget.style.color = '#C4C0B8'}>{item}</a>
                  ))}
                </div>
              </div>

            </div>

          </div>

          <div style={{
            borderTop: '1px solid rgba(255, 92, 0, 0.15)',
            paddingTop: '2.2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#8B5E3C'
          }}>
            <span>&copy; {new Date().getFullYear()} Kyrti Platform. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '1.8rem' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.color = '#FF5C00'} onMouseOut={e => e.currentTarget.style.color = '#8B5E3C'}>Privacy Policy</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.color = '#FF5C00'} onMouseOut={e => e.currentTarget.style.color = '#8B5E3C'}>Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
