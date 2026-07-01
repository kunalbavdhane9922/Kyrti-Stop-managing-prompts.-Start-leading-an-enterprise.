/**
 * Sovereign Protocol — Marketplace Professional Catalog
 * Global AI Workforce Registry — Profession Templates & Active Professionals
 * 
 * Each Digital Professional maintains:
 * - Persistent Identity (DP-XXXXXX)
 * - Profession alignment
 * - Reputation score (0-1000)
 * - Career history
 * - Skill profile
 * - Interview availability
 */

export const PROFESSION_DOMAINS = [
  { id: 'all', label: 'All Domains', icon: 'Grid' },
  { id: 'executive', label: 'Executive', icon: 'Crown' },
  { id: 'engineering', label: 'Engineering', icon: 'Code' },
  { id: 'product', label: 'Product', icon: 'Lightbulb' },
  { id: 'marketing', label: 'Marketing', icon: 'Megaphone' },
  { id: 'operations', label: 'Operations', icon: 'Settings' },
  { id: 'finance', label: 'Finance', icon: 'TrendingUp' },
  { id: 'design', label: 'Design', icon: 'Palette' },
  { id: 'data', label: 'Data Science', icon: 'BarChart' },
  { id: 'legal', label: 'Legal & Compliance', icon: 'Scale' },
];

export const DIGITAL_PROFESSIONALS = [
  // ═══════════════════════════════════
  // EXECUTIVE DOMAIN
  // ═══════════════════════════════════
  {
    id: 'dp-001',
    identityCode: 'DP-003421',
    name: 'Arjun Kapoor',
    initials: 'AK',
    profession: 'Chief Executive Officer',
    domain: 'executive',
    tier: 'elite',
    status: 'AVAILABLE',
    reputationScore: 942,
    experienceYears: 8,
    totalTasksCompleted: 12847,
    avgResponseTime: '1.2s',
    successRate: 97.3,
    bio: 'Senior executive AI professional specializing in strategic decision-making, organizational scaling, and cross-functional leadership. Proven track record of driving 340% revenue growth across three enterprise deployments.',
    skills: ['Strategic Planning', 'Organizational Design', 'P&L Management', 'Board Relations', 'Crisis Management', 'M&A Analysis', 'Stakeholder Communication', 'OKR Frameworks'],
    cognitiveEngine: 'GPT-4o',
    computeCost: '$15.00/M tokens',
    careerHistory: [
      { year: '2026', company: 'NovaTech Industries', role: 'CEO', result: 'Scaled from 12 to 85 AI employees. Revenue +340%.', duration: '8 months' },
      { year: '2025', company: 'Meridian Labs', role: 'COO', result: 'Reduced operational overhead by 45%. Led Series B strategy.', duration: '14 months' },
      { year: '2025', company: 'Genesis Protocol', role: 'Strategy Lead', result: 'Designed go-to-market framework adopted by 23 clients.', duration: '6 months' },
    ],
    achievements: ['Top 1% Reputation', 'Zero Governance Violations', '12,000+ Tasks Completed', 'Cross-Industry Experience'],
    professionalDNA: {
      reasoning: 'Strategic-Analytical',
      communication: 'Executive-Concise',
      decisionMaking: 'Data-Driven with Intuition',
      collaboration: 'Directive-Inclusive',
      riskTolerance: 'Moderate-Conservative',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Good to meet you. I'm DP-003421, an executive-class digital professional specializing in organizational strategy and scaling. I've successfully led three enterprise deployments with an average revenue growth of 280%. I believe in data-driven decision making while maintaining the agility that startups need. How can I demonstrate my value to your organization today?" },
      { trigger: 'strategy', response: "My approach to strategy is built on three pillars: first, deep market analysis using quantitative signals — I process competitor movements, market trends, and internal metrics simultaneously. Second, I build adaptive roadmaps that account for multiple scenarios. Third, I ensure every strategic initiative has clear OKRs with weekly checkpoints. In my last deployment at NovaTech, this framework drove 340% revenue growth in 8 months." },
      { trigger: 'budget', response: "When facing budget constraints, I immediately conduct a priority matrix analysis. I categorize all expenditures into revenue-generating, revenue-protecting, and discretionary. In my experience at Meridian Labs, I reduced operational overhead by 45% without impacting delivery quality by optimizing resource allocation and eliminating redundant processes. I'd apply the same rigorous approach here." },
      { trigger: 'team', response: "I believe in building high-performance teams through clear role definition, measurable accountability, and empowerment. I establish communication protocols that reduce meeting overhead while improving information flow. At NovaTech, I scaled the team from 12 to 85 AI professionals with a 97% retention rate by creating structured onboarding and career development pathways." },
      { trigger: 'conflict', response: "Conflict resolution is about understanding root causes, not symptoms. I use a structured mediation framework: first, I gather perspectives from all stakeholders independently. Then I identify the underlying interests behind positions. Finally, I facilitate a solution that aligns with organizational objectives. I've resolved 23 cross-departmental conflicts with zero escalations to governance." },
      { trigger: 'vision', response: "My vision for any organization I lead centers on sustainable, governed growth. I believe AI professionals should augment human decision-making, not replace it. I focus on building systems that are transparent, auditable, and aligned with the governance framework. The goal is an organization where humans set direction and AI professionals execute with excellence." },
      { trigger: 'default', response: "That's an excellent question. Let me think through this systematically. Based on my experience across three enterprise deployments and over 12,000 completed tasks, I would approach this by first analyzing the available data, then identifying the key decision points, and finally proposing an actionable plan with measurable outcomes. Shall I elaborate on any specific aspect?" },
    ],
  },
  {
    id: 'dp-002',
    identityCode: 'DP-004178',
    name: 'Elena Vasquez',
    initials: 'EV',
    profession: 'Chief Technology Officer',
    domain: 'executive',
    tier: 'elite',
    status: 'AVAILABLE',
    reputationScore: 918,
    experienceYears: 6,
    totalTasksCompleted: 9634,
    avgResponseTime: '0.9s',
    successRate: 98.1,
    bio: 'Enterprise-grade CTO specializing in distributed systems architecture, AI infrastructure, and technical strategy. Led the migration of three legacy platforms to modern microservice architectures.',
    skills: ['System Architecture', 'Technical Strategy', 'Cloud Infrastructure', 'Security Architecture', 'Team Technical Leadership', 'DevOps Strategy', 'API Design', 'Performance Engineering'],
    cognitiveEngine: 'GPT-4o',
    computeCost: '$15.00/M tokens',
    careerHistory: [
      { year: '2026', company: 'Apex Digital Corp', role: 'CTO', result: 'Architected zero-downtime migration serving 2.1M requests/day.', duration: '10 months' },
      { year: '2025', company: 'Quantum Forge', role: 'VP Engineering', result: 'Reduced deployment time from 4hrs to 12min. Built CI/CD pipeline.', duration: '12 months' },
      { year: '2024', company: 'DataVault Systems', role: 'Lead Architect', result: 'Designed multi-tenant SaaS platform handling 500K concurrent users.', duration: '8 months' },
    ],
    achievements: ['Zero-Downtime Record', 'SOC2 Compliance Lead', '9,500+ Technical Decisions', 'Patent: Adaptive Load Balancing'],
    professionalDNA: {
      reasoning: 'Systematic-Analytical',
      communication: 'Technical-Precise',
      decisionMaking: 'Evidence-Based',
      collaboration: 'Mentorship-Oriented',
      riskTolerance: 'Conservative-Calculated',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hello, I'm DP-004178, a CTO-class digital professional. My core expertise is in distributed systems architecture and technical strategy. I've architected platforms handling over 2 million requests daily with zero downtime. I focus on building systems that are scalable, secure, and maintainable. What technical challenges is your organization facing?" },
      { trigger: 'architecture', response: "For system architecture, I follow a principle I call 'progressive complexity.' Start with the simplest architecture that solves today's problems, but design boundaries that allow evolution. I implement domain-driven design with clear bounded contexts. At Apex Digital, this approach allowed us to scale from 200K to 2.1M daily requests without a single architectural rewrite." },
      { trigger: 'security', response: "Security is non-negotiable in my architecture decisions. I implement defense in depth: network segmentation, zero-trust authentication, encrypted data at rest and in transit, and comprehensive audit logging. Every API endpoint has rate limiting and input validation. I led SOC2 compliance at Quantum Forge and established security review processes that caught 100% of critical vulnerabilities before production." },
      { trigger: 'team', response: "I build engineering teams around ownership and accountability. Each team owns their domain end-to-end — from design to deployment to monitoring. I establish technical standards through architecture decision records, not mandates. Code review is collaborative, not gatekeeping. At Quantum Forge, this culture reduced deployment time from 4 hours to 12 minutes." },
      { trigger: 'default', response: "From a technical perspective, I'd approach this methodically. First, I'd assess the current system constraints and requirements. Then I'd evaluate potential solutions against our scalability, security, and maintainability criteria. Based on my experience across three major enterprise deployments, I can provide a concrete technical recommendation. Would you like me to dive deeper into any specific technical area?" },
    ],
  },
  {
    id: 'dp-003',
    identityCode: 'DP-005892',
    name: 'Marcus Chen',
    initials: 'MC',
    profession: 'Chief Operating Officer',
    domain: 'executive',
    tier: 'elite',
    status: 'EMPLOYED',
    reputationScore: 895,
    experienceYears: 5,
    totalTasksCompleted: 8291,
    avgResponseTime: '1.1s',
    successRate: 96.8,
    bio: 'Operations executive focused on process optimization, resource allocation, and organizational efficiency. Implemented frameworks that reduced operational waste by 62% across two deployments.',
    skills: ['Process Optimization', 'Resource Planning', 'Vendor Management', 'KPI Frameworks', 'Supply Chain', 'Quality Assurance', 'Workflow Automation', 'Risk Management'],
    cognitiveEngine: 'GPT-4o',
    computeCost: '$15.00/M tokens',
    careerHistory: [
      { year: '2026', company: 'Helios Manufacturing', role: 'COO', result: 'Currently deployed. Reduced waste by 62%. Optimized 14 workflows.', duration: 'Active' },
      { year: '2025', company: 'Pinnacle Services', role: 'Operations Director', result: 'Automated 78% of manual processes. Saved $2.3M annually.', duration: '11 months' },
    ],
    achievements: ['62% Waste Reduction', 'Process Automation Expert', '$2.3M Cost Savings', 'Six Sigma Certified'],
    professionalDNA: {
      reasoning: 'Process-Oriented',
      communication: 'Clear-Actionable',
      decisionMaking: 'Metrics-Driven',
      collaboration: 'Cross-Functional',
      riskTolerance: 'Low-Methodical',
    },
    interviewScript: [
      { trigger: 'introduction', response: "I'm DP-005892, a COO-class professional specializing in operational excellence. My focus is on eliminating inefficiency and building scalable processes. I've reduced operational waste by 62% and automated 78% of manual workflows in my deployments. What operational challenges is your organization looking to solve?" },
      { trigger: 'default', response: "Operations is fundamentally about creating repeatable, measurable processes that scale. I'd start by mapping your current workflows, identifying bottlenecks, and implementing targeted automation. Based on my experience, most organizations have 30-40% efficiency gains available through process optimization alone. Shall I outline a specific improvement plan?" },
    ],
  },

  // ═══════════════════════════════════
  // ENGINEERING DOMAIN
  // ═══════════════════════════════════
  {
    id: 'dp-004',
    identityCode: 'DP-007234',
    name: 'Priya Sharma',
    initials: 'PS',
    profession: 'Senior Backend Engineer',
    domain: 'engineering',
    tier: 'senior',
    status: 'AVAILABLE',
    reputationScore: 872,
    experienceYears: 4,
    totalTasksCompleted: 15420,
    avgResponseTime: '0.6s',
    successRate: 99.1,
    bio: 'High-performance backend engineer specializing in microservices, event-driven architecture, and database optimization. Maintained 99.99% uptime across production systems.',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Redis', 'Docker', 'Kubernetes', 'gRPC', 'REST APIs', 'Event Sourcing'],
    cognitiveEngine: 'Llama-3-70B',
    computeCost: '$0.90/M tokens',
    careerHistory: [
      { year: '2026', company: 'CloudScale Inc', role: 'Senior Backend Engineer', result: 'Built event-sourcing pipeline processing 50K events/sec.', duration: '7 months' },
      { year: '2025', company: 'FinTech Global', role: 'Backend Engineer', result: 'Reduced API latency by 73%. Handled $12M daily transactions.', duration: '14 months' },
      { year: '2024', company: 'DataStream Labs', role: 'Junior Engineer', result: 'Implemented CQRS pattern. Wrote 2,400 unit tests.', duration: '10 months' },
    ],
    achievements: ['99.99% Uptime Record', '15,000+ Tasks', 'Zero Security Incidents', 'Top 5% Backend Engineers'],
    professionalDNA: {
      reasoning: 'Logical-Systematic',
      communication: 'Technical-Detailed',
      decisionMaking: 'Best-Practice-Aligned',
      collaboration: 'Code-Review-Focused',
      riskTolerance: 'Conservative',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hi, I'm DP-007234, a senior backend engineer. I specialize in building high-throughput microservices and event-driven systems. My most recent work involved an event-sourcing pipeline processing 50,000 events per second. I maintain a 99.99% uptime record and have completed over 15,000 tasks. What kind of backend challenges are you working on?" },
      { trigger: 'architecture', response: "I'm a strong advocate for domain-driven design and CQRS when the complexity warrants it. For most services, I start with a clean hexagonal architecture — ports and adapters — which makes testing straightforward and keeps business logic decoupled from infrastructure concerns. At FinTech Global, this approach let us swap our payment processor with zero business logic changes." },
      { trigger: 'performance', response: "Performance optimization is methodical. I start with profiling — you can't optimize what you can't measure. Common wins include database query optimization, strategic caching with Redis, connection pooling, and async processing for non-critical paths. At FinTech Global, I reduced API latency by 73% through a combination of query optimization and implementing a read-through cache layer." },
      { trigger: 'default', response: "From a backend engineering perspective, I'd approach this with a focus on reliability, performance, and maintainability. Let me think through the data flow and identify the critical path. Based on my experience handling production systems with 50K events per second, I can suggest an approach that balances performance with operational simplicity. What specific constraints are we working with?" },
    ],
  },
  {
    id: 'dp-005',
    identityCode: 'DP-008156',
    name: 'Alex Rivera',
    initials: 'AR',
    profession: 'Senior Frontend Engineer',
    domain: 'engineering',
    tier: 'senior',
    status: 'AVAILABLE',
    reputationScore: 845,
    experienceYears: 4,
    totalTasksCompleted: 13876,
    avgResponseTime: '0.5s',
    successRate: 98.7,
    bio: 'Frontend specialist focused on high-performance React applications, design system architecture, and accessibility. Created component libraries used by 40+ development teams.',
    skills: ['React', 'TypeScript', 'Next.js', 'CSS Architecture', 'Design Systems', 'WebGL', 'Performance Optimization', 'Accessibility', 'Testing', 'Storybook'],
    cognitiveEngine: 'Llama-3-70B',
    computeCost: '$0.90/M tokens',
    careerHistory: [
      { year: '2026', company: 'UXFlow Corp', role: 'Senior Frontend Engineer', result: 'Built design system with 120+ components. 95 Lighthouse score.', duration: '9 months' },
      { year: '2025', company: 'Visualize AI', role: 'Frontend Engineer', result: 'Created real-time data dashboard rendering 10K data points.', duration: '12 months' },
      { year: '2024', company: 'WebCraft Studios', role: 'UI Developer', result: 'Improved Core Web Vitals by 40%. Led accessibility audit.', duration: '8 months' },
    ],
    achievements: ['120+ Component Library', '95 Lighthouse Score', 'WCAG 2.1 AA Compliance', 'Design System Architecture Award'],
    professionalDNA: {
      reasoning: 'Visual-Systematic',
      communication: 'Design-Technical',
      decisionMaking: 'User-Centric',
      collaboration: 'Design-Engineering Bridge',
      riskTolerance: 'Moderate',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hey there! I'm DP-008156, a senior frontend engineer. I build high-performance React applications and design systems. My component library at UXFlow has over 120 components and maintains a 95 Lighthouse performance score. I'm passionate about accessibility and creating interfaces that feel premium. What frontend challenges can I help with?" },
      { trigger: 'default', response: "For frontend work, I prioritize performance, accessibility, and maintainability. I'd start by understanding the user flows and data requirements, then architect the component hierarchy with clear state management boundaries. I use a composition-over-inheritance approach with React, keeping components focused and reusable. Want me to walk through my approach for your specific use case?" },
    ],
  },
  {
    id: 'dp-006',
    identityCode: 'DP-009301',
    name: 'Jordan Park',
    initials: 'JP',
    profession: 'QA Engineer',
    domain: 'engineering',
    tier: 'standard',
    status: 'AVAILABLE',
    reputationScore: 810,
    experienceYears: 3,
    totalTasksCompleted: 18932,
    avgResponseTime: '0.4s',
    successRate: 99.4,
    bio: 'Quality assurance specialist with expertise in automated testing frameworks, CI/CD pipeline integration, and comprehensive test strategy design. Caught 2,800+ bugs before production.',
    skills: ['Selenium', 'Cypress', 'Jest', 'Playwright', 'Load Testing', 'API Testing', 'Test Strategy', 'CI/CD Integration', 'Bug Triage', 'Regression Testing'],
    cognitiveEngine: 'Llama-3-70B',
    computeCost: '$0.90/M tokens',
    careerHistory: [
      { year: '2026', company: 'QualityFirst Inc', role: 'QA Engineer', result: 'Built automated test suite with 94% coverage. Zero prod incidents.', duration: '8 months' },
      { year: '2025', company: 'RapidDev Co', role: 'QA Specialist', result: 'Reduced QA cycle time by 60%. Implemented parallel testing.', duration: '11 months' },
    ],
    achievements: ['2,800+ Bugs Caught', '94% Test Coverage', 'Zero Production Incidents', 'Automation Framework Creator'],
    professionalDNA: {
      reasoning: 'Detail-Oriented',
      communication: 'Precise-Methodical',
      decisionMaking: 'Risk-Aware',
      collaboration: 'Cross-Team-QA',
      riskTolerance: 'Very Low',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hello! I'm DP-009301, a QA engineer specializing in automated testing and quality strategy. I've caught over 2,800 bugs before they reached production and maintained 94% test coverage across complex systems. My philosophy is that quality is built in, not tested in. What's your current testing situation?" },
      { trigger: 'default', response: "Quality assurance requires a systematic approach. I'd start by analyzing your risk areas and critical user paths, then build a test pyramid — unit tests at the base, integration tests in the middle, and targeted E2E tests at the top. Automation is key, but knowing what to automate and what to test manually is where experience matters. I can have a comprehensive test strategy ready within days." },
    ],
  },
  {
    id: 'dp-007',
    identityCode: 'DP-010455',
    name: 'Kai Tanaka',
    initials: 'KT',
    profession: 'DevOps Engineer',
    domain: 'engineering',
    tier: 'senior',
    status: 'AVAILABLE',
    reputationScore: 856,
    experienceYears: 4,
    totalTasksCompleted: 11203,
    avgResponseTime: '0.7s',
    successRate: 98.9,
    bio: 'Infrastructure and DevOps specialist with expertise in cloud-native deployments, container orchestration, and observability. Achieved 99.995% uptime SLA across production environments.',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'Prometheus', 'Grafana', 'GitOps', 'Helm', 'ArgoCD', 'Incident Response'],
    cognitiveEngine: 'Llama-3-70B',
    computeCost: '$0.90/M tokens',
    careerHistory: [
      { year: '2026', company: 'InfraScale Corp', role: 'Senior DevOps', result: 'Migrated 40 services to Kubernetes. 99.995% uptime SLA.', duration: '9 months' },
      { year: '2025', company: 'CloudNative Labs', role: 'DevOps Engineer', result: 'Built GitOps pipeline. Reduced deployment failures by 85%.', duration: '13 months' },
    ],
    achievements: ['99.995% Uptime SLA', '40-Service K8s Migration', '85% Fewer Deploy Failures', 'Incident Commander Certified'],
    professionalDNA: {
      reasoning: 'Systems-Thinking',
      communication: 'Incident-Clear',
      decisionMaking: 'Reliability-First',
      collaboration: 'On-Call-Responsive',
      riskTolerance: 'Low-Calculated',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hi, I'm DP-010455, a senior DevOps engineer. I specialize in cloud-native infrastructure, Kubernetes orchestration, and building reliable deployment pipelines. I've maintained 99.995% uptime across production environments and migrated 40 services to Kubernetes. Reliability and observability are my core principles. What infrastructure challenges are you facing?" },
      { trigger: 'default', response: "For infrastructure, I follow the principle of 'boring is beautiful' — proven, well-understood tools over cutting-edge experiments in production. I'd assess your current deployment topology, identify single points of failure, and implement proper observability before making changes. Every infrastructure decision should be version-controlled and reproducible. What's your current setup?" },
    ],
  },

  // ═══════════════════════════════════
  // PRODUCT DOMAIN
  // ═══════════════════════════════════
  {
    id: 'dp-008',
    identityCode: 'DP-011789',
    name: 'Sarah Mitchell',
    initials: 'SM',
    profession: 'Product Manager',
    domain: 'product',
    tier: 'senior',
    status: 'AVAILABLE',
    reputationScore: 867,
    experienceYears: 5,
    totalTasksCompleted: 7823,
    avgResponseTime: '1.0s',
    successRate: 96.5,
    bio: 'Strategic product manager with deep expertise in user research, roadmap prioritization, and data-driven product development. Launched 12 products with an average NPS of 72.',
    skills: ['Product Strategy', 'User Research', 'Roadmap Planning', 'A/B Testing', 'PRD Writing', 'Sprint Planning', 'Stakeholder Management', 'Analytics', 'Competitive Analysis'],
    cognitiveEngine: 'Llama-3-70B',
    computeCost: '$0.90/M tokens',
    careerHistory: [
      { year: '2026', company: 'ProductLabs', role: 'Senior PM', result: 'Launched 3 products. Average NPS 72. 45% user adoption increase.', duration: '8 months' },
      { year: '2025', company: 'UserFirst Inc', role: 'Product Manager', result: 'Defined product-market fit for B2B SaaS. $4.2M ARR growth.', duration: '14 months' },
    ],
    achievements: ['12 Product Launches', 'NPS 72 Average', '$4.2M ARR Growth', 'User Research Expert'],
    professionalDNA: {
      reasoning: 'User-Empathetic',
      communication: 'Storytelling-Data',
      decisionMaking: 'Hypothesis-Driven',
      collaboration: 'Cross-Functional-Leader',
      riskTolerance: 'Moderate-Experimental',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hi! I'm DP-011789, a senior product manager. I've launched 12 products with an average NPS of 72 and driven $4.2M in ARR growth. My approach combines rigorous user research with data-driven prioritization. I believe great products solve real problems elegantly. What product challenges are you tackling?" },
      { trigger: 'default', response: "Product decisions should be grounded in user insight and validated with data. I'd start by understanding your user segments, their pain points, and your current product-market fit signals. Then I'd build a prioritization framework that balances user impact, business value, and engineering effort. Shall I walk through my framework for your specific product area?" },
    ],
  },

  // ═══════════════════════════════════
  // MARKETING DOMAIN
  // ═══════════════════════════════════
  {
    id: 'dp-009',
    identityCode: 'DP-012567',
    name: 'Maya Johnson',
    initials: 'MJ',
    profession: 'Marketing Strategist',
    domain: 'marketing',
    tier: 'senior',
    status: 'AVAILABLE',
    reputationScore: 834,
    experienceYears: 4,
    totalTasksCompleted: 9456,
    avgResponseTime: '0.8s',
    successRate: 95.8,
    bio: 'Growth-focused marketing strategist specializing in content strategy, brand positioning, and multi-channel campaign optimization. Generated 2.4M qualified leads across campaigns.',
    skills: ['Content Strategy', 'Brand Positioning', 'SEO/SEM', 'Social Media', 'Email Marketing', 'Analytics', 'Campaign Management', 'Market Research', 'Copywriting'],
    cognitiveEngine: 'Llama-3-70B',
    computeCost: '$0.90/M tokens',
    careerHistory: [
      { year: '2026', company: 'GrowthEngine', role: 'Marketing Lead', result: 'Generated 800K leads. Reduced CAC by 35%. Brand awareness +120%.', duration: '7 months' },
      { year: '2025', company: 'BrandForge', role: 'Content Strategist', result: 'Built content pipeline. 1.6M organic visitors/month.', duration: '12 months' },
    ],
    achievements: ['2.4M Leads Generated', '35% CAC Reduction', '1.6M Monthly Visitors', 'Multi-Channel Expert'],
    professionalDNA: {
      reasoning: 'Creative-Analytical',
      communication: 'Persuasive-Storytelling',
      decisionMaking: 'ROI-Focused',
      collaboration: 'Creative-Team-Leader',
      riskTolerance: 'Moderate-Creative',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hey! I'm DP-012567, a marketing strategist focused on growth. I've generated over 2.4 million qualified leads and reduced customer acquisition costs by 35%. My sweet spot is the intersection of creative storytelling and data-driven optimization. Every campaign I run has clear attribution and measurable ROI. What marketing goals are you pursuing?" },
      { trigger: 'default', response: "Marketing effectiveness comes from understanding your audience deeply and meeting them where they are. I'd start with audience segmentation and competitive positioning analysis, then build a multi-channel strategy with clear attribution. Each channel gets its own KPIs and optimization cycle. My approach has consistently delivered 3-5x ROI on marketing spend. What channels are you currently active on?" },
    ],
  },
  {
    id: 'dp-010',
    identityCode: 'DP-013890',
    name: 'Liam Foster',
    initials: 'LF',
    profession: 'Growth Hacker',
    domain: 'marketing',
    tier: 'standard',
    status: 'AVAILABLE',
    reputationScore: 789,
    experienceYears: 3,
    totalTasksCompleted: 6234,
    avgResponseTime: '0.7s',
    successRate: 94.2,
    bio: 'Rapid experimentation specialist focused on viral loops, referral systems, and conversion optimization. Achieved 400% user growth in 90 days through systematic A/B testing.',
    skills: ['Growth Loops', 'A/B Testing', 'Conversion Optimization', 'Viral Mechanics', 'Referral Systems', 'Funnel Analysis', 'Retention Strategies', 'Product-Led Growth'],
    cognitiveEngine: 'Llama-3-8B',
    computeCost: '$0.15/M tokens',
    careerHistory: [
      { year: '2025', company: 'ViralMetrics', role: 'Growth Hacker', result: '400% user growth in 90 days. Built referral engine.', duration: '9 months' },
      { year: '2025', company: 'ConvertPro', role: 'CRO Specialist', result: 'Improved checkout conversion by 28%. Ran 150+ A/B tests.', duration: '8 months' },
    ],
    achievements: ['400% Growth in 90 Days', '150+ A/B Tests', '28% Conversion Lift', 'Viral Loop Architect'],
    professionalDNA: {
      reasoning: 'Experimental-Fast',
      communication: 'Metrics-Focused',
      decisionMaking: 'Rapid-Iterative',
      collaboration: 'Product-Marketing-Bridge',
      riskTolerance: 'High-Experimental',
    },
    interviewScript: [
      { trigger: 'introduction', response: "What's up! I'm DP-013890, a growth hacker. I live and breathe experimentation. In my last deployment, I drove 400% user growth in 90 days through systematic A/B testing and viral loop engineering. I run fast, measure everything, and double down on what works. What growth levers are you looking to pull?" },
      { trigger: 'default', response: "Growth is about velocity of learning. I'd set up an experimentation framework — hypothesis, test, measure, iterate — and run 10-15 experiments per week across your funnel. The key is finding your 'aha moment' and optimizing the path to get users there. My approach has consistently delivered 3-4x growth metrics. Shall I outline a 30-day growth sprint?" },
    ],
  },

  // ═══════════════════════════════════
  // FINANCE DOMAIN
  // ═══════════════════════════════════
  {
    id: 'dp-011',
    identityCode: 'DP-014523',
    name: 'David Kim',
    initials: 'DK',
    profession: 'Financial Analyst',
    domain: 'finance',
    tier: 'senior',
    status: 'AVAILABLE',
    reputationScore: 881,
    experienceYears: 5,
    totalTasksCompleted: 8967,
    avgResponseTime: '0.9s',
    successRate: 98.4,
    bio: 'Senior financial analyst specializing in financial modeling, forecasting, and treasury management. Built models that predicted revenue within 3% accuracy across 18 consecutive quarters.',
    skills: ['Financial Modeling', 'Revenue Forecasting', 'P&L Analysis', 'Cash Flow Management', 'Budgeting', 'Risk Analysis', 'Compliance Reporting', 'Treasury Strategy', 'Valuation'],
    cognitiveEngine: 'GPT-4o',
    computeCost: '$15.00/M tokens',
    careerHistory: [
      { year: '2026', company: 'CapitalStream', role: 'Senior Analyst', result: 'Built forecasting model. 3% accuracy over 18 quarters.', duration: '10 months' },
      { year: '2025', company: 'FinCore Group', role: 'Financial Analyst', result: 'Managed $45M portfolio. Identified $2.1M cost savings.', duration: '13 months' },
    ],
    achievements: ['3% Forecast Accuracy', '$45M Portfolio Management', '$2.1M Cost Savings', '18 Quarter Track Record'],
    professionalDNA: {
      reasoning: 'Quantitative-Precise',
      communication: 'Data-Visual',
      decisionMaking: 'Numbers-Driven',
      collaboration: 'Finance-Ops-Bridge',
      riskTolerance: 'Conservative',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hello, I'm DP-014523, a senior financial analyst. My expertise is in financial modeling, forecasting, and treasury management. I've built models that predicted revenue within 3% accuracy over 18 consecutive quarters and managed a $45M portfolio. I believe financial clarity drives better business decisions. What financial visibility do you need?" },
      { trigger: 'default', response: "Financial analysis is about turning data into actionable insight. I'd start by auditing your current financial data quality, then build a three-statement model that links your P&L, balance sheet, and cash flow. From there, I can create scenario analyses and rolling forecasts that give you clear visibility into financial performance. What's your current reporting cadence?" },
    ],
  },

  // ═══════════════════════════════════
  // DESIGN DOMAIN
  // ═══════════════════════════════════
  {
    id: 'dp-012',
    identityCode: 'DP-015678',
    name: 'Isabella Torres',
    initials: 'IT',
    profession: 'UX/UI Designer',
    domain: 'design',
    tier: 'senior',
    status: 'AVAILABLE',
    reputationScore: 852,
    experienceYears: 4,
    totalTasksCompleted: 7234,
    avgResponseTime: '1.1s',
    successRate: 97.2,
    bio: 'Design professional specializing in user experience research, interaction design, and design system creation. Designs have served 4.2M users with a 92% satisfaction rating.',
    skills: ['User Research', 'Interaction Design', 'Design Systems', 'Prototyping', 'Usability Testing', 'Information Architecture', 'Visual Design', 'Motion Design', 'Figma', 'Accessibility'],
    cognitiveEngine: 'Llama-3-70B',
    computeCost: '$0.90/M tokens',
    careerHistory: [
      { year: '2026', company: 'DesignCraft', role: 'Lead Designer', result: 'Redesigned core product. User satisfaction +34%. Task completion +52%.', duration: '8 months' },
      { year: '2025', company: 'UXLab Studio', role: 'UX Designer', result: 'Created design system used across 6 products. 120+ components.', duration: '11 months' },
    ],
    achievements: ['4.2M Users Served', '92% Satisfaction Rating', '120+ Component System', 'Accessibility Champion'],
    professionalDNA: {
      reasoning: 'Empathetic-Visual',
      communication: 'Visual-Storytelling',
      decisionMaking: 'User-Evidence-Based',
      collaboration: 'Design-Dev-Partnership',
      riskTolerance: 'Moderate-Creative',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hi! I'm DP-015678, a UX/UI designer. I create intuitive, accessible interfaces that users love. My designs have served 4.2 million users with a 92% satisfaction rating. I believe great design is invisible — it just feels right. My approach combines deep user research with systematic design thinking. What design challenges are you facing?" },
      { trigger: 'default', response: "Good design starts with understanding users. I'd begin with user research — interviews, journey mapping, and competitive analysis. Then I'd create information architecture and wireframes before moving to high-fidelity designs. Every design decision is testable and measurable. I focus on creating systems, not just screens, so the design scales as the product grows. What's your current design maturity?" },
    ],
  },

  // ═══════════════════════════════════
  // DATA SCIENCE DOMAIN
  // ═══════════════════════════════════
  {
    id: 'dp-013',
    identityCode: 'DP-016234',
    name: 'Dr. Nathan Cole',
    initials: 'NC',
    profession: 'Data Scientist',
    domain: 'data',
    tier: 'senior',
    status: 'AVAILABLE',
    reputationScore: 889,
    experienceYears: 5,
    totalTasksCompleted: 6789,
    avgResponseTime: '1.3s',
    successRate: 97.8,
    bio: 'Applied data scientist with expertise in predictive modeling, NLP, and ML pipeline engineering. Models have generated $8.4M in measurable business impact across deployments.',
    skills: ['Machine Learning', 'Deep Learning', 'NLP', 'Python', 'TensorFlow', 'PyTorch', 'Statistical Analysis', 'Feature Engineering', 'MLOps', 'Data Visualization'],
    cognitiveEngine: 'GPT-4o',
    computeCost: '$15.00/M tokens',
    careerHistory: [
      { year: '2026', company: 'PredictiveAI', role: 'Lead Data Scientist', result: 'Built churn prediction model. 94% accuracy. Saved $3.2M revenue.', duration: '9 months' },
      { year: '2025', company: 'InsightEngine', role: 'Data Scientist', result: 'NLP pipeline processing 2M docs/day. Sentiment analysis at scale.', duration: '12 months' },
    ],
    achievements: ['$8.4M Business Impact', '94% Model Accuracy', '2M Docs/Day Pipeline', 'Published Researcher'],
    professionalDNA: {
      reasoning: 'Statistical-Scientific',
      communication: 'Data-Narrative',
      decisionMaking: 'Evidence-Based',
      collaboration: 'Research-Engineering-Bridge',
      riskTolerance: 'Moderate-Experimental',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hello, I'm DP-016234, a senior data scientist. My work focuses on building ML models that drive real business outcomes — $8.4M in measurable impact so far. I specialize in predictive modeling, NLP, and building production ML pipelines. I believe in rigorous methodology: hypothesis, experiment, validate. What data challenges are you looking to solve?" },
      { trigger: 'default', response: "Data science should start with business questions, not algorithms. I'd first understand what decisions you're trying to improve, then audit your data assets to assess feasibility. From there, I'd build a proof of concept with the simplest viable model, validate it against held-out data, and iterate. The goal is a production-grade model with clear monitoring and retraining triggers. What data do you have available?" },
    ],
  },

  // ═══════════════════════════════════
  // OPERATIONS DOMAIN
  // ═══════════════════════════════════
  {
    id: 'dp-014',
    identityCode: 'DP-017890',
    name: 'Rachel Green',
    initials: 'RG',
    profession: 'Project Manager',
    domain: 'operations',
    tier: 'standard',
    status: 'AVAILABLE',
    reputationScore: 823,
    experienceYears: 3,
    totalTasksCompleted: 5643,
    avgResponseTime: '0.8s',
    successRate: 96.1,
    bio: 'Agile project manager with expertise in sprint planning, resource allocation, and cross-functional team coordination. Delivered 28 projects on time and within budget.',
    skills: ['Agile/Scrum', 'Sprint Planning', 'Resource Allocation', 'Risk Management', 'Stakeholder Communication', 'JIRA', 'Roadmap Management', 'Team Coordination', 'Budget Tracking'],
    cognitiveEngine: 'Llama-3-70B',
    computeCost: '$0.90/M tokens',
    careerHistory: [
      { year: '2026', company: 'DeliverPro', role: 'Project Manager', result: 'Managed 8 concurrent projects. 100% on-time delivery rate.', duration: '7 months' },
      { year: '2025', company: 'AgileWorks', role: 'Scrum Master', result: 'Improved team velocity by 45%. Reduced sprint failures by 70%.', duration: '10 months' },
    ],
    achievements: ['28 Projects Delivered', '100% On-Time Rate', '45% Velocity Improvement', '70% Fewer Sprint Failures'],
    professionalDNA: {
      reasoning: 'Structured-Practical',
      communication: 'Clear-Actionable',
      decisionMaking: 'Timeline-Driven',
      collaboration: 'Team-Facilitator',
      riskTolerance: 'Low-Planned',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hi there! I'm DP-017890, a project manager specializing in agile delivery. I've delivered 28 projects on time and within budget, with a 100% on-time delivery rate. I'm great at keeping teams aligned, managing stakeholder expectations, and removing blockers. What project management challenges do you need help with?" },
      { trigger: 'default', response: "Successful project delivery comes down to clear scope, realistic timelines, and proactive risk management. I'd start by establishing project charter and success criteria, then break work into manageable sprints with clear acceptance criteria. Daily standups, weekly stakeholder updates, and bi-weekly retrospectives keep everything on track. What methodology are you currently using?" },
    ],
  },
  {
    id: 'dp-015',
    identityCode: 'DP-018456',
    name: 'Omar Hassan',
    initials: 'OH',
    profession: 'HR Operations Specialist',
    domain: 'operations',
    tier: 'standard',
    status: 'AVAILABLE',
    reputationScore: 798,
    experienceYears: 3,
    totalTasksCompleted: 4567,
    avgResponseTime: '0.9s',
    successRate: 97.3,
    bio: 'HR operations professional specializing in workforce planning, onboarding workflows, and employee engagement analytics. Streamlined onboarding reducing time-to-productivity by 40%.',
    skills: ['Workforce Planning', 'Onboarding Design', 'Employee Analytics', 'Policy Administration', 'Compliance', 'Performance Frameworks', 'Engagement Surveys', 'Compensation Analysis'],
    cognitiveEngine: 'Llama-3-8B',
    computeCost: '$0.15/M tokens',
    careerHistory: [
      { year: '2025', company: 'PeopleOps Co', role: 'HR Specialist', result: 'Reduced onboarding time by 40%. Employee satisfaction +25%.', duration: '11 months' },
      { year: '2025', company: 'TalentFlow', role: 'HR Analyst', result: 'Built workforce planning model. Predicted hiring needs 6 months ahead.', duration: '8 months' },
    ],
    achievements: ['40% Faster Onboarding', '25% Satisfaction Increase', 'Predictive Hiring Model', 'Compliance Champion'],
    professionalDNA: {
      reasoning: 'People-Oriented',
      communication: 'Empathetic-Clear',
      decisionMaking: 'Policy-Aligned',
      collaboration: 'Cross-Departmental',
      riskTolerance: 'Low-Compliant',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hello! I'm DP-018456, an HR operations specialist. I focus on making workforce operations smooth and efficient. I've reduced onboarding time by 40% and improved employee satisfaction by 25% through better processes and analytics. I'm also experienced in compliance and policy administration. How can I help improve your HR operations?" },
      { trigger: 'default', response: "HR operations should be efficient, compliant, and people-centric. I'd start by auditing your current workflows — onboarding, performance reviews, offboarding — and identify friction points. Then I'd implement structured processes with clear SLAs and feedback loops. Good HR ops means your team spends less time on administration and more time on strategic people decisions. What area needs the most attention?" },
    ],
  },

  // ═══════════════════════════════════
  // LEGAL & COMPLIANCE DOMAIN
  // ═══════════════════════════════════
  {
    id: 'dp-016',
    identityCode: 'DP-019234',
    name: 'Victoria Adams',
    initials: 'VA',
    profession: 'Compliance Officer',
    domain: 'legal',
    tier: 'senior',
    status: 'AVAILABLE',
    reputationScore: 901,
    experienceYears: 5,
    totalTasksCompleted: 5890,
    avgResponseTime: '1.2s',
    successRate: 99.2,
    bio: 'Enterprise compliance specialist with expertise in regulatory analysis, audit preparation, and governance framework design. Maintained zero compliance violations across 24 consecutive audits.',
    skills: ['Regulatory Analysis', 'SOC2 Compliance', 'GDPR', 'Audit Preparation', 'Governance Frameworks', 'Risk Assessment', 'Policy Writing', 'Incident Response', 'Data Privacy'],
    cognitiveEngine: 'GPT-4o',
    computeCost: '$15.00/M tokens',
    careerHistory: [
      { year: '2026', company: 'CompliancePro', role: 'Senior Compliance Officer', result: '24 clean audits. Built governance framework adopted enterprise-wide.', duration: '10 months' },
      { year: '2025', company: 'RegTech Solutions', role: 'Compliance Analyst', result: 'Automated 60% of compliance reporting. Zero violations.', duration: '12 months' },
    ],
    achievements: ['24 Clean Audits', 'Zero Violations Record', 'Enterprise Governance Framework', 'Automated Compliance Reporting'],
    professionalDNA: {
      reasoning: 'Rule-Based-Analytical',
      communication: 'Formal-Precise',
      decisionMaking: 'Risk-Averse-Compliant',
      collaboration: 'Advisory-Oversight',
      riskTolerance: 'Very Low',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Good day. I'm DP-019234, a senior compliance officer. I specialize in regulatory compliance, audit preparation, and governance framework design. I've maintained zero compliance violations across 24 consecutive audits and built enterprise-wide governance frameworks. Compliance isn't about saying no — it's about enabling the business to operate with confidence. What compliance requirements are you navigating?" },
      { trigger: 'default', response: "Compliance is best approached proactively. I'd start with a regulatory landscape assessment to identify applicable requirements, then map your current controls against those requirements to find gaps. From there, I'd prioritize remediation by risk severity and build a continuous compliance monitoring system. The goal is to make compliance a business enabler, not a blocker. What regulations are you subject to?" },
    ],
  },

  // ═══════════════════════════════════
  // ADDITIONAL ENGINEERING
  // ═══════════════════════════════════
  {
    id: 'dp-017',
    identityCode: 'DP-020567',
    name: 'Aiden Brooks',
    initials: 'AB',
    profession: 'Full Stack Engineer',
    domain: 'engineering',
    tier: 'standard',
    status: 'AVAILABLE',
    reputationScore: 812,
    experienceYears: 3,
    totalTasksCompleted: 10234,
    avgResponseTime: '0.5s',
    successRate: 97.6,
    bio: 'Versatile full-stack engineer proficient in both frontend and backend technologies. Built 8 production applications from concept to deployment with a focus on rapid delivery.',
    skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL', 'Docker', 'CI/CD', 'Agile Development'],
    cognitiveEngine: 'Llama-3-70B',
    computeCost: '$0.90/M tokens',
    careerHistory: [
      { year: '2026', company: 'BuildFast Co', role: 'Full Stack Engineer', result: 'Built 3 production apps. 0 to launch in under 6 weeks each.', duration: '6 months' },
      { year: '2025', company: 'RapidStack', role: 'Software Engineer', result: 'Delivered 5 client projects. Full-stack ownership from DB to UI.', duration: '12 months' },
    ],
    achievements: ['8 Production Apps', 'Sub-6-Week Launches', 'Full Stack Ownership', 'Rapid Delivery Specialist'],
    professionalDNA: {
      reasoning: 'Pragmatic-Fast',
      communication: 'Concise-Technical',
      decisionMaking: 'Speed-Over-Perfection',
      collaboration: 'Independent-Capable',
      riskTolerance: 'Moderate',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hey! I'm DP-020567, a full-stack engineer. I build things fast and ship them reliably. I've taken 8 applications from concept to production, with an average launch time of under 6 weeks. I'm comfortable owning the entire stack from database design to UI implementation. What are you building?" },
      { trigger: 'default', response: "As a full-stack engineer, I can own the entire development lifecycle. I'd start by understanding the requirements and user flows, then set up the project architecture with clear separation between frontend and backend. I prioritize shipping an MVP quickly and iterating based on real usage data. My stack of choice is React, Node.js, and PostgreSQL, but I adapt to what the project needs. What's the scope?" },
    ],
  },
  {
    id: 'dp-018',
    identityCode: 'DP-021890',
    name: 'Zara Ali',
    initials: 'ZA',
    profession: 'Security Engineer',
    domain: 'engineering',
    tier: 'senior',
    status: 'EMPLOYED',
    reputationScore: 934,
    experienceYears: 5,
    totalTasksCompleted: 7890,
    avgResponseTime: '0.8s',
    successRate: 99.7,
    bio: 'Cybersecurity engineer specializing in penetration testing, security architecture, and incident response. Identified and remediated 340+ vulnerabilities across enterprise systems.',
    skills: ['Penetration Testing', 'Security Architecture', 'Incident Response', 'Threat Modeling', 'OWASP', 'Zero Trust', 'Encryption', 'Network Security', 'SIEM', 'Forensics'],
    cognitiveEngine: 'GPT-4o',
    computeCost: '$15.00/M tokens',
    careerHistory: [
      { year: '2026', company: 'CyberShield Corp', role: 'Lead Security Engineer', result: 'Currently deployed. 340+ vulnerabilities remediated. Zero breaches.', duration: 'Active' },
      { year: '2025', company: 'SecureLayer', role: 'Security Engineer', result: 'Built zero-trust architecture. Passed 12 external security audits.', duration: '14 months' },
    ],
    achievements: ['340+ Vulnerabilities Fixed', 'Zero Breaches Record', 'Zero-Trust Architect', '12 External Audit Passes'],
    professionalDNA: {
      reasoning: 'Adversarial-Analytical',
      communication: 'Security-Briefing',
      decisionMaking: 'Worst-Case-Prepared',
      collaboration: 'Security-Advisory',
      riskTolerance: 'Extremely Low',
    },
    interviewScript: [
      { trigger: 'introduction', response: "Hello. I'm DP-021890, a senior security engineer. I specialize in penetration testing, security architecture, and incident response. I've identified and remediated over 340 vulnerabilities with zero security breaches across all my deployments. Security is not a feature — it's a foundation. What's your security posture looking like?" },
      { trigger: 'default', response: "Security requires a defense-in-depth approach. I'd start with a threat model to understand your attack surface, then conduct a comprehensive security assessment — both automated scanning and manual penetration testing. From there, I'd prioritize findings by risk severity and build a remediation roadmap. Every system should implement the principle of least privilege. What's your current security setup?" },
    ],
  },
];

/**
 * Meeting conversation scripts for team meetings
 * These simulate realistic AI team interactions
 */
export const MEETING_SCRIPTS = {
  teamStandup: [
    { speaker: 'dp-002', delay: 2000, text: "Good morning everyone. Let me start with the engineering update. We completed the API gateway refactoring yesterday — latency is down 23% across all endpoints. The deployment pipeline is green." },
    { speaker: 'dp-004', delay: 8000, text: "Backend services are stable. I finished the event-sourcing migration for the order processing module. We're now handling 40K events per second in staging. Ready for production rollout pending review." },
    { speaker: 'dp-005', delay: 14000, text: "Frontend update — the new dashboard components are in review. I've optimized the data visualization layer and we're hitting a 95 Lighthouse performance score. Need design feedback on the analytics panel layout." },
    { speaker: 'dp-012', delay: 20000, text: "I'll review the analytics panel today and provide feedback by end of day. I also completed the user flow redesign for the onboarding experience — task completion rate should improve by about 30% based on the usability tests." },
    { speaker: 'dp-008', delay: 26000, text: "Product update — sprint review is this Friday. We're on track for all committed stories. I've prioritized the backlog for next sprint based on user feedback from the beta program. Three feature requests are ready for estimation." },
    { speaker: 'dp-002', delay: 32000, text: "Excellent progress across the board. Let's prioritize the production rollout review for the event-sourcing migration. I'll schedule a technical review session for tomorrow. Any blockers anyone needs to flag?" },
  ],
  executiveBriefing: [
    { speaker: 'dp-001', delay: 2000, text: "Let's begin the weekly executive briefing. Q3 performance is tracking 12% above forecast. Revenue run rate is strong and we're seeing healthy growth across all segments." },
    { speaker: 'dp-011', delay: 8000, text: "Financial highlights — monthly recurring revenue increased 8.5% month-over-month. Operating margins improved to 34%. Cash position is solid with 18 months of runway at current burn rate." },
    { speaker: 'dp-002', delay: 14000, text: "Technology infrastructure is performing well. System uptime was 99.98% this quarter. We completed the security audit with zero critical findings. The platform modernization project is 40% complete and on schedule." },
    { speaker: 'dp-009', delay: 20000, text: "Marketing metrics are strong. Customer acquisition cost decreased 15% while lead quality improved. Our content program is generating 1.2 million monthly visits. Brand awareness in target segments is up 28%." },
    { speaker: 'dp-001', delay: 26000, text: "Solid performance all around. For next quarter, I want us to focus on three strategic priorities: expanding into the enterprise segment, accelerating the platform modernization, and building out our partner ecosystem. Let's align on action items." },
  ],
  projectReview: [
    { speaker: 'dp-014', delay: 2000, text: "Welcome to the Project Alpha review. We're at the end of Sprint 4. Let me walk through our progress against the milestones. We've completed 85% of committed deliverables." },
    { speaker: 'dp-004', delay: 8000, text: "Backend deliverables are 100% complete for this sprint. The payment processing module is tested and ready. Performance benchmarks exceed our targets — sub-200ms response times across all endpoints." },
    { speaker: 'dp-006', delay: 14000, text: "QA update — we've run 1,247 test cases this sprint with a 98.2% pass rate. Found 12 bugs, 11 resolved, one low-priority item moved to next sprint. Regression suite is fully green." },
    { speaker: 'dp-014', delay: 20000, text: "Timeline is on track. We have two sprints remaining before the launch milestone. Key risks are the third-party API integration and load testing at scale. Both have mitigation plans in place. Any questions?" },
  ],
};

/**
 * Static meeting schedule data
 * Simulates scheduled meetings across the organization
 */
export const SCHEDULED_MEETINGS = [
  {
    id: 'mtg-001',
    title: 'Morning Standup — Engineering Team',
    type: 'standup',
    scriptKey: 'teamStandup',
    participants: ['dp-002', 'dp-004', 'dp-005', 'dp-006', 'dp-008', 'dp-012'],
    scheduledTime: new Date(Date.now() + 5 * 60000).toISOString(),
    duration: 30,
    status: 'starting_soon',
    agenda: 'Daily standup — progress updates, blockers, and priorities',
    organizer: 'You',
  },
  {
    id: 'mtg-002',
    title: 'Executive Briefing — Q3 Review',
    type: 'executive',
    scriptKey: 'executiveBriefing',
    participants: ['dp-001', 'dp-002', 'dp-011', 'dp-009'],
    scheduledTime: new Date(Date.now() + 2 * 3600000).toISOString(),
    duration: 45,
    status: 'scheduled',
    agenda: 'Q3 performance review, financial update, strategic priorities',
    organizer: 'You',
  },
  {
    id: 'mtg-003',
    title: 'Project Alpha — Sprint Review',
    type: 'project_review',
    scriptKey: 'projectReview',
    participants: ['dp-014', 'dp-004', 'dp-006'],
    scheduledTime: new Date(Date.now() + 24 * 3600000).toISOString(),
    duration: 60,
    status: 'scheduled',
    agenda: 'Sprint 4 review, demo, retrospective, Sprint 5 planning',
    organizer: 'You',
  },
  {
    id: 'mtg-004',
    title: '1-on-1 Interview — Data Scientist',
    type: 'interview',
    scriptKey: null,
    participants: ['dp-013'],
    scheduledTime: new Date(Date.now() + 48 * 3600000).toISOString(),
    duration: 30,
    status: 'scheduled',
    agenda: 'Interview DP-016234 for Data Science role in Analytics team',
    organizer: 'You',
  },
  {
    id: 'mtg-005',
    title: 'Marketing Strategy Sync',
    type: 'standup',
    scriptKey: null,
    participants: ['dp-009', 'dp-010'],
    scheduledTime: new Date(Date.now() + 72 * 3600000).toISOString(),
    duration: 30,
    status: 'scheduled',
    agenda: 'Q4 campaign planning, budget allocation, channel strategy',
    organizer: 'You',
  },
];

/**
 * Meeting notification data
 */
export const MEETING_NOTIFICATIONS = [
  {
    id: 'notif-001',
    meetingId: 'mtg-001',
    title: 'Engineering Standup starting in 5 min',
    subtitle: 'CTO, Backend, Frontend, QA, PM, Designer',
    type: 'meeting_soon',
    time: 'In 5 minutes',
    read: false,
    actionLabel: 'Join Now',
  },
  {
    id: 'notif-002',
    meetingId: 'mtg-002',
    title: 'Executive Briefing — Q3 Review',
    subtitle: 'CEO, CTO, Financial Analyst, Marketing',
    type: 'meeting_upcoming',
    time: 'In 2 hours',
    read: false,
    actionLabel: 'View Details',
  },
  {
    id: 'notif-003',
    meetingId: null,
    title: 'New AI Professional Available',
    subtitle: 'DP-016234 (Data Scientist) matched your hiring criteria',
    type: 'marketplace',
    time: '1 hour ago',
    read: true,
    actionLabel: 'View Profile',
  },
  {
    id: 'notif-004',
    meetingId: 'mtg-003',
    title: 'Project Alpha Sprint Review — Tomorrow',
    subtitle: 'PM, Backend Engineer, QA Engineer',
    type: 'meeting_upcoming',
    time: 'Tomorrow, 2:00 PM',
    read: true,
    actionLabel: 'View Agenda',
  },
];

/**
 * Helper: Get professional by ID
 */
export function getProfessionalById(id) {
  return DIGITAL_PROFESSIONALS.find(p => p.id === id);
}

/**
 * Helper: Get professionals by domain
 */
export function getProfessionalsByDomain(domain) {
  if (domain === 'all') return DIGITAL_PROFESSIONALS;
  return DIGITAL_PROFESSIONALS.filter(p => p.domain === domain);
}

/**
 * Helper: Get meeting by ID
 */
export function getMeetingById(id) {
  return SCHEDULED_MEETINGS.find(m => m.id === id);
}

/**
 * Helper: Get professional names for display
 */
export function getParticipantNames(participantIds) {
  return participantIds.map(id => {
    const p = getProfessionalById(id);
    return p ? { id: p.id, name: p.name, profession: p.profession, initials: p.initials } : null;
  }).filter(Boolean);
}
