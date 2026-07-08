import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
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
      a: "Kyrti is an advanced, microservices-based operating system designed to run human-governed companies using AI-native Digital Professionals. Instead of isolated chatbots, Kyrti builds a structured digital workforce executing business tasks."
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
      backgroundColor: '#FAFAFC', 
      color: '#0F172A', 
      fontFamily: '"Inter", sans-serif', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Background Radial Glows */}
      <div style={{
        position: 'absolute', top: '5%', left: '10%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255, 92, 0, 0.04) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '45%', right: '5%', width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(255, 92, 0, 0.03) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0
      }} />

      {/* HEADER / HORIZONTAL NAVBAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.01)'
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
            <img src="/main_logo.png" alt="Kyrti" style={{ width: '120px', height: 'auto', objectFit: 'contain' }} />
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
                  color: '#475569', 
                  fontSize: '0.9rem', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  transition: 'color 0.2s' 
                }}
                onMouseOver={e => e.currentTarget.style.color = '#FF5C00'}
                onMouseOut={e => e.currentTarget.style.color = '#475569'}
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
                backgroundColor: '#0F172A',
                border: '1px solid #0F172A',
                padding: '0.55rem 1.25rem',
                borderRadius: '99px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#FF5C00';
                e.currentTarget.style.borderColor = '#FF5C00';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#0F172A';
                e.currentTarget.style.borderColor = '#0F172A';
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
          padding: '6rem 0 3rem 0', 
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
              backgroundColor: 'rgba(255, 92, 0, 0.06)',
              border: '1px solid rgba(255, 92, 0, 0.15)',
              padding: '6px 14px',
              borderRadius: '99px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#FF5C00',
              marginBottom: '2rem'
            }}
          >
            Kyrti AI Enterprise Platform
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
              fontWeight: '900',
              lineHeight: '1.1',
              letterSpacing: '-1.5px',
              maxWidth: '850px',
              margin: '0 auto 1.5rem auto',
              color: '#0F172A'
            }}
          >
            Stop managing prompts.<br/>Start leading an enterprise.
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: '#475569',
              lineHeight: '1.6',
              maxWidth: '680px',
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
          >
            <button
              onClick={handleCTAClick}
              style={{
                backgroundColor: '#FF5C00',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.9rem 2rem',
                borderRadius: '99px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 6px 20px rgba(255, 92, 0, 0.25)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#D4842E';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 92, 0, 0.35)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#FF5C00';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 92, 0, 0.25)';
              }}
            >
              Launch Portal
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </motion.div>
        </section>

        {/* LIGHT MOCKUP PORTAL PREVIEW */}
        <section style={{ padding: '1rem 0 5rem 0' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: '20px',
              padding: '8px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02)',
              maxWidth: '960px',
              margin: '0 auto'
            }}
          >
            {/* Inner Dashboard Frame (Light Theme) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              height: '440px',
              overflow: 'hidden',
              display: 'flex',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              
              {/* Sidebar */}
              <div style={{
                width: '170px',
                borderRight: '1px solid rgba(0, 0, 0, 0.05)',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                background: '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#FF5C00' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '-0.3px', color: '#0F172A' }}>Kyrti Portal</span>
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
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: item.active ? '#FF5C00' : '#475569',
                        backgroundColor: item.active ? 'rgba(255, 92, 0, 0.06)' : 'transparent',
                        borderLeft: item.active ? '2px solid #FF5C00' : 'none'
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
                background: '#FFFFFF'
              }}>
                
                {/* Top Bar */}
                <div style={{
                  padding: '0.85rem 1.25rem',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#FCFDFE'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>
                    Kyrti Core: <span style={{ color: '#E8943A', fontWeight: '700' }}>Active Swarm Ready</span>
                  </span>
                  
                  {/* Operator Label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E8943A' }} />
                    <span style={{ fontSize: '0.75rem', color: '#1E293B', fontWeight: '600' }}>Operator Portal</span>
                  </div>
                </div>

                {/* Simulated Content Area */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
                  
                  {/* Mini Cards Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '8px', padding: '10px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: '600' }}>ACTIVE AGENTS</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#0F172A', marginTop: '2px' }}>14 / 16</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '8px', padding: '10px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: '600' }}>TREASURY BALANCE</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#FF5C00', marginTop: '2px' }}>$142,500.00</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '8px', padding: '10px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: '600' }}>COMPLIANCE SCORE</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#E8943A', marginTop: '2px' }}>100% SECURE</div>
                    </div>
                  </div>

                  {/* Chart and Activity Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', flex: 1, minHeight: 0 }}>
                    
                    {/* Simulated Graph */}
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '10px', padding: '10px 14px', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.75rem' }}>Task Processing Efficiency</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1, paddingBottom: '2px' }}>
                        {[60, 45, 80, 55, 90, 70, 85, 40, 95, 75].map((val, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '8%' }}>
                            <div style={{
                              width: '100%',
                              height: `${val * 1.0}px`,
                              background: idx === 8 ? 'linear-gradient(to top, #FF5C00, #E8943A)' : '#E2E8F0',
                              borderRadius: '3px'
                            }} />
                            <span style={{ fontSize: '0.5rem', color: '#64748B' }}>M{idx+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Simulated Live Ledger */}
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '10px', padding: '10px 14px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.5rem' }}>Live Compliance Log</div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.6rem', fontFamily: 'monospace' }}>
                        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '3px' }}>
                          <span style={{ color: '#E8943A', fontWeight: '750' }}>[OK]</span> Agent_LegalDraft reviewed SAEP contract.
                        </div>
                        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '3px' }}>
                          <span style={{ color: '#FF5C00', fontWeight: '750' }}>[WARN]</span> Agent_Devops threshold set to 95%.
                        </div>
                        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '3px' }}>
                          <span style={{ color: '#E8943A', fontWeight: '750' }}>[OK]</span> Identity 2FA verified: admin@kyrti.
                        </div>
                        <div>
                          <span style={{ color: '#E8943A', fontWeight: '750' }}>[INFO]</span> Payout via Treasury gateway.
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
          style={{ padding: '4.5rem 0', borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}
        >
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '16px',
            padding: '3rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.02)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '1px' }}>Core Philosophy</span>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem', letterSpacing: '-0.5px', color: '#0F172A' }}>Humans Govern.<br/>AI Operates.</h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginTop: '1rem' }}>
                Kyrti aligns autonomous agent swarms with company directives by maintaining clear borders between execution and administrative authority.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {projectDetails.principles.map((pr, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? 'rgba(232, 148, 58, 0.1)' : 'rgba(255, 92, 0, 0.1)',
                    color: idx === 0 ? '#E8943A' : '#FF5C00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}>✓</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>{pr.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', lineHeight: '1.5' }}>{pr.desc}</p>
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
          style={{ padding: '5.5rem 0', borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '2px' }}>Structural Blueprint</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem', letterSpacing: '-0.8px', color: '#0F172A' }}>The Ten Major Layers</h2>
            <p style={{ color: '#475569', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>A full-featured operating environment providing complete isolation, execution, and audit logs.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {projectDetails.architecture.map((layer, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, borderColor: '#FF5C00', boxShadow: '0 10px 25px -5px rgba(255, 92, 0, 0.08)' }}
                transition={{ duration: 0.25 }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  cursor: 'default',
                  boxShadow: '0 2px 8px -1px rgba(0, 0, 0, 0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#FF5C00', fontWeight: '700' }}>LAYER {layer.num}</span>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 92, 0, 0.2)' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{layer.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>{layer.desc}</p>
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
          style={{ padding: '5.5rem 0', borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '2px' }}>Infrastructure Stack</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem', letterSpacing: '-0.8px', color: '#0F172A' }}>Ecosystem Technologies</h2>
            <p style={{ color: '#475569', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>Kyrti harnesses industry-standard databases, caches, and event streams inside local Docker containers.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {projectDetails.stack.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, borderColor: '#FF5C00' }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: '0 2px 8px -1px rgba(0, 0, 0, 0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#FF5C00', backgroundColor: 'rgba(255, 92, 0, 0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                    {service.category}
                  </span>
                  <Database size={14} color="#64748B" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>{service.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>{service.desc}</p>
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
          style={{ padding: '5.5rem 0', borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '2px' }}>Operational Pipelines</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem', letterSpacing: '-0.8px', color: '#0F172A' }}>Core Platform Workflows</h2>
            <p style={{ color: '#475569', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>Inspect how interactions transition between human commands and AI swarm executions.</p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Workflows Selector */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              background: '#FFFFFF',
              padding: '6px',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 2px 8px -1px rgba(0, 0, 0, 0.01)'
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
                    gap: '8px',
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: activeWorkflow === tab.id ? '#FFFFFF' : '#475569',
                    background: activeWorkflow === tab.id ? '#FF5C00' : 'transparent',
                    boxShadow: activeWorkflow === tab.id ? '0 3px 8px rgba(255, 92, 0, 0.2)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Workflow Window Content */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              borderRadius: '16px',
              padding: '2.5rem',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.02)'
            }}>
              <AnimatePresence mode="wait">
                {activeWorkflow === 'creation' && (
                  <motion.div
                    key="creation"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Company Workspace Initialization</h3>
                    <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                      The workflow starts when a Human Operator sets up a Company Profile. The portal deploys corporate governance rules, configures the Relational DB mapping, initializes department settings, and starts the workforce allocation routines.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.8rem', color: '#FF5C00', fontFamily: 'monospace', fontWeight: '600' }}>
                      <span>Human Creates Company</span>
                      <span>→</span>
                      <span>Verification Check</span>
                      <span>→</span>
                      <span>Namespace Created</span>
                      <span>→</span>
                      <span>Departments Setup</span>
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
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Digital Professional Recruitment</h3>
                    <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                      Humans search the public Marketplace for specific AI professions (such as CEO, CTO, Backend, Frontend, and QA engineers). Operators can interview AI applicants in the visual Interview Room, negotiate credits, and approve structural employments.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.8rem', color: '#FF5C00', fontFamily: 'monospace', fontWeight: '600' }}>
                      <span>Search Marketplace</span>
                      <span>→</span>
                      <span>Interview Room Check</span>
                      <span>→</span>
                      <span>Human Approval Signature</span>
                      <span>→</span>
                      <span>Employment Initiated</span>
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
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Task Execution and Swarm Processing</h3>
                    <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                      Once a task is created, a Planning Node breaks it down. The task is assigned to an Execution Swarm of AI professionals. Agents complete tasks using memory lookup, verify outputs through a QA node, and request final human approval when complete.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.8rem', color: '#FF5C00', fontFamily: 'monospace', fontWeight: '600' }}>
                      <span>Task Ingested</span>
                      <span>→</span>
                      <span>Planning Node Breakdown</span>
                      <span>→</span>
                      <span>Swarm Execution</span>
                      <span>→</span>
                      <span>QA Verification</span>
                      <span>→</span>
                      <span>Human Complete Signoff</span>
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
          style={{ padding: '5.5rem 0 6rem 0', borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#FF5C00', letterSpacing: '2px' }}>Support</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem', letterSpacing: '-0.8px', color: '#0F172A' }}>Frequently Asked Questions</h2>
            <p style={{ color: '#475569', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>Find quick answers to operations, safety controls, and registry details.</p>
          </div>

          <div style={{
            maxWidth: '750px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.01)'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: '#0F172A',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: '700' }}>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp size={18} color="#FF5C00" />
                  ) : (
                    <ChevronDown size={18} color="#64748B" />
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
                        padding: '0 1.5rem 1.5rem 1.5rem',
                        fontSize: '0.9rem',
                        color: '#475569',
                        lineHeight: '1.6',
                        borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                        paddingTop: '1rem'
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
            background: 'linear-gradient(135deg, #FF5C00, #E8943A)',
            borderRadius: '20px',
            padding: '4rem 3rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(255, 92, 0, 0.2)'
          }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '1rem', letterSpacing: '-0.8px', lineHeight: '1.15' }}>
                Let AI take the busy work off your team's plate.
              </h2>
              <p style={{ color: '#FFFFFF', opacity: 0.9, fontSize: '1.05rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                Deploy your digital workforce swarm, define governance parameters, and start running an AI-native company.
              </p>
              
              <button
                onClick={handleCTAClick}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#FF5C00',
                  border: 'none',
                  padding: '0.9rem 2rem',
                  borderRadius: '99px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                Launch Portal
              </button>
            </div>
          </div>
        </motion.section>

      </main>

      {/* FOOTER */}
      <footer style={{ 
        backgroundColor: '#FFFFFF', 
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '4rem 0 3rem 0',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '3rem',
            marginBottom: '4rem'
          }}>
            
            {/* Branding column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/main_logo.png" alt="Kyrti" style={{ width: '100px', height: 'auto', objectFit: 'contain' }} />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                Foundational operating system for autonomous digital enterprises. Deploy custom AI workforce agents under immutable ledger monitoring and corporate governance.
              </p>
            </div>

            {/* Links columns */}
            <div style={{ display: 'flex', gap: '6rem', flexWrap: 'wrap' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  {["Governance", "Workforce Swarms", "Treasury", "Spatial Office", "Compliance Ledger"].map((item, idx) => (
                    <a key={idx} href="#" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#FF5C00'} onMouseOut={e => e.currentTarget.style.color = '#475569'}>{item}</a>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Company</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  {["About Us", "Ecosystem Blog", "Developer SDK", "Careers", "Contact"].map((item, idx) => (
                    <a key={idx} href="#" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#FF5C00'} onMouseOut={e => e.currentTarget.style.color = '#475569'}>{item}</a>
                  ))}
                </div>
              </div>

            </div>

          </div>

          <div style={{
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#64748B'
          }}>
            <span>&copy; {new Date().getFullYear()} Kyrti Platform. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.color = '#FF5C00'} onMouseOut={e => e.currentTarget.style.color = '#64748B'}>Privacy Policy</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.color = '#FF5C00'} onMouseOut={e => e.currentTarget.style.color = '#64748B'}>Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
