/**
 * Sovereign Protocol — Platform API (Temporary Stubs)
 * 
 * ⚠️  TEMPORARY: These are placeholder data providers for platform modules
 * (Dashboard, Agents, Treasury, etc.) that do NOT yet have backend endpoints.
 * 
 * Each method will be replaced with real API calls as we build out the
 * corresponding backend modules (Phase 2+).
 * 
 * Auth endpoints have already been migrated to authApi.js — DO NOT add
 * auth methods here.
 * 
 * STATUS: Will be replaced module-by-module as backend develops.
 */

/** Simulates network latency for UI consistency */
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const platformApi = {

  // ================================================================
  // IDENTITY LAYER — Layer B/C/D stubs (backend not yet built)
  // ================================================================

  async uploadDocument(encryptedBlob, metadata) {
    await delay(1500);
    return {
      success: true,
      documentId: 'doc_' + crypto.randomUUID().slice(0, 8),
      status: 'uploaded',
      encryptedBlobRef: 'blob_' + crypto.randomUUID().slice(0, 12),
    };
  },

  async checkKYBStatus(requestId) {
    await delay(2000);
    return {
      requestId,
      status: 'verified',
      businessName: 'Sovereign Dynamics Inc.',
      registrationNumber: 'GSTIN-29ABCDE1234F1Z5',
      verifiedAt: new Date().toISOString(),
    };
  },

  async verifyDNS(domain) {
    await delay(3000);
    return {
      domain,
      status: 'verified',
      txtRecord: `sovereign-verify=${crypto.randomUUID()}`,
      verifiedAt: new Date().toISOString(),
    };
  },

  async generateDNSTxt(domain) {
    await delay(500);
    return {
      domain,
      txtRecord: `sovereign-verify=${crypto.randomUUID()}`,
      instructions: `Add this TXT record to your DNS settings for ${domain}`,
    };
  },

  async sendMagicLink(email) {
    await delay(800);
    return {
      success: true,
      email,
      expiresIn: 600,
      message: `Verification link sent to ${email}`,
    };
  },

  async verifyMagicLink(token) {
    await delay(1000);
    return {
      success: true,
      email: 'ceo@enterprise.com',
      domain: 'enterprise.com',
      verifiedAt: new Date().toISOString(),
    };
  },

  // ================================================================
  // TREASURY MODULE
  // ================================================================

  async getTreasuryData() {
    await delay(1000);
    return {
      treasuryWallet: { address: '0x742d...F4e2', balance: '45.2831', currency: 'ETH', isMultiSig: true, requiredSignatures: 2, totalSigners: 3, lastFundedAt: '2026-05-06T10:30:00Z' },
      opsWallet: { address: '0x8f3a...B1c7', balance: '3.5412', currency: 'ETH', dailyLimit: '5.0000', spentToday: '1.4588', lastTransactionAt: '2026-05-07T08:15:00Z' },
      agentWallets: [
        { id: 'aw_1', agentId: 'agent_dev_1', agentName: 'Dev-Agent-1', address: '0xa1b2...c3d4', balance: '0.0823', cap: '0.5000', utilized: '0.4177', status: 'active', createdAt: '2026-04-15T00:00:00Z' },
        { id: 'aw_2', agentId: 'agent_mkt_1', agentName: 'Marketing-Agent-1', address: '0xe5f6...g7h8', balance: '0.1250', cap: '0.3000', utilized: '0.1750', status: 'active', createdAt: '2026-04-20T00:00:00Z' },
        { id: 'aw_3', agentId: 'agent_sup_1', agentName: 'Support-Agent-1', address: '0xi9j0...k1l2', balance: '0.0100', cap: '0.2000', utilized: '0.1900', status: 'active', createdAt: '2026-04-25T00:00:00Z' },
      ],
      transactions: [
        { id: 'tx_1', type: 'fund_ops', from: 'Treasury', to: 'Ops Wallet', amount: '2.0000', currency: 'ETH', status: 'confirmed', timestamp: '2026-05-06T10:30:00Z', hash: '0xabc...def', description: 'Monthly ops funding' },
        { id: 'tx_2', type: 'fund_agent', from: 'Ops Wallet', to: 'Dev-Agent-1', amount: '0.5000', currency: 'ETH', status: 'confirmed', timestamp: '2026-05-05T14:00:00Z', hash: '0x123...456', description: 'Agent wallet top-up' },
        { id: 'tx_3', type: 'fee', from: 'Ops Wallet', to: 'Platform', amount: '0.0150', currency: 'ETH', status: 'confirmed', timestamp: '2026-05-07T08:15:00Z', hash: '0x789...abc', description: 'Platform service fee' },
      ],
    };
  },

  // ================================================================
  // GOVERNANCE MODULE
  // ================================================================

  async getProposals() {
    try {
      const { fetchWithAuth } = await import('./apiClient.js');
      const proposals = await fetchWithAuth('/governance/proposals');
      return proposals.map(p => {
        let payloadData = {};
        try {
          payloadData = JSON.parse(p.payload || '{}');
        } catch (e) {}
        
        return {
          id: p.id,
          title: payloadData.title || `Proposal ${p.type}`,
          description: payloadData.description || 'No description provided.',
          agentId: p.proposerId,
          agentName: payloadData.agentName || p.proposerType,
          category: p.type,
          status: p.status.toLowerCase(),
          createdAt: p.createdAt
        };
      });
    } catch (error) {
      console.warn("Governance API failed, falling back to mock data.", error);
      await delay(800);
      return [
        { id: 'prop_1', title: 'Optimize CI/CD Pipeline', description: 'Reduce build times by 40% through parallel test execution and artifact caching.', agentId: 'agent_dev_1', agentName: 'Dev-Agent-1', category: 'engineering', status: 'draft', createdAt: '2026-05-07T09:00:00Z' },
        { id: 'prop_2', title: 'Q3 Content Calendar Draft', description: 'Generated a 12-week content calendar targeting enterprise SaaS decision-makers.', agentId: 'agent_mkt_1', agentName: 'Marketing-Agent-1', category: 'marketing', status: 'proposed', createdAt: '2026-05-06T14:30:00Z' },
        { id: 'prop_3', title: 'Customer Ticket Triage Report', description: 'Analyzed 847 support tickets. Identified 3 recurring issues affecting 23% of enterprise clients.', agentId: 'agent_sup_1', agentName: 'Support-Agent-1', category: 'support', status: 'approved', createdAt: '2026-05-05T11:00:00Z' },
      ];
    }
  },

  async getAgents() {
    await delay(600);
    return [
      { id: 'agent_dev_1', name: 'Dev-Agent-1', role: 'Software Engineer', department: 'Engineering', status: 'active', hiredAt: '2026-04-15T00:00:00Z', hiredBy: 'founder', taskCount: 142, completedTasks: 138, canViewBudget: false, canProposeSpeinding: false, canExecuteTransactions: false, financialPermissions: [] },
      { id: 'agent_mkt_1', name: 'Marketing-Agent-1', role: 'Content Strategist', department: 'Marketing', status: 'active', hiredAt: '2026-04-20T00:00:00Z', hiredBy: 'founder', taskCount: 87, completedTasks: 82, canViewBudget: false, canProposeSpeinding: false, canExecuteTransactions: false, financialPermissions: [] },
      { id: 'agent_sup_1', name: 'Support-Agent-1', role: 'Customer Support Lead', department: 'Support', status: 'active', hiredAt: '2026-04-25T00:00:00Z', hiredBy: 'founder', taskCount: 312, completedTasks: 308, canViewBudget: false, canProposeSpeinding: false, canExecuteTransactions: false, financialPermissions: [] },
    ];
  },

  async getBlockerReports() {
    await delay(600);
    return [
      { id: 'br_1', type: 'POLICY_VIOLATION', agentId: 'agent_mkt_1', agentName: 'Marketing-Agent-1', context: 'content_generation', violations: ['Financial pattern detected: $15,000 budget recommendation'], status: 'PAUSE_STATE', resolution: 'HUMAN_REVIEW_REQUIRED', createdAt: '2026-05-07T07:30:00Z' },
    ];
  },

  async getZKProofs() {
    await delay(500);
    return [
      { id: 'zk_1', agentId: 'agent_dev_1', metric: 'Code Accuracy', value: '98.2%', verified: true, proofHash: '0xzk1...abc', generatedAt: '2026-05-07T00:00:00Z' },
      { id: 'zk_2', agentId: 'agent_dev_1', metric: 'Test Coverage', value: '94.7%', verified: true, proofHash: '0xzk2...def', generatedAt: '2026-05-07T00:00:00Z' },
      { id: 'zk_3', agentId: 'agent_sup_1', metric: 'Resolution Rate', value: '96.1%', verified: true, proofHash: '0xzk3...ghi', generatedAt: '2026-05-07T00:00:00Z' },
      { id: 'zk_4', agentId: 'agent_mkt_1', metric: 'Content Quality', value: '91.5%', verified: true, proofHash: '0xzk4...jkl', generatedAt: '2026-05-07T00:00:00Z' },
    ];
  },

  // ================================================================
  // COMMAND CENTER MODULE
  // ================================================================

  async getAgentOS() {
    await delay(800);
    return [
      { id: 'agent_dev_1', name: 'Dev-Agent-1', role: 'Software Engineer', department: 'Engineering', status: 'active', executionState: 'executing', hiredAt: '2026-04-15T00:00:00Z', skills: ['sk_python', 'sk_react', 'sk_devops'], memoryAccess: 'encrypted', contextWindowSize: 48200, lastActiveAt: '2026-05-07T16:00:00Z', taskCount: 142, completedTasks: 138, accuracy: 98.2, avgLatency: 320 },
      { id: 'agent_mkt_1', name: 'Marketing-Agent-1', role: 'Content Strategist', department: 'Marketing', status: 'active', executionState: 'planning', hiredAt: '2026-04-20T00:00:00Z', skills: ['sk_content', 'sk_seo', 'sk_analytics'], memoryAccess: 'encrypted', contextWindowSize: 31500, lastActiveAt: '2026-05-07T15:30:00Z', taskCount: 87, completedTasks: 82, accuracy: 91.5, avgLatency: 450 },
      { id: 'agent_sup_1', name: 'Support-Agent-1', role: 'Customer Support Lead', department: 'Support', status: 'active', executionState: 'idle', hiredAt: '2026-04-25T00:00:00Z', skills: ['sk_nlp', 'sk_ticketing', 'sk_knowledge_base'], memoryAccess: 'encrypted', contextWindowSize: 12800, lastActiveAt: '2026-05-07T14:45:00Z', taskCount: 312, completedTasks: 308, accuracy: 96.1, avgLatency: 180 },
      { id: 'agent_fin_1', name: 'Finance-Agent-1', role: 'Financial Analyst', department: 'Finance', status: 'blocked', executionState: 'blocked', hiredAt: '2026-05-01T00:00:00Z', skills: ['sk_financial_modeling', 'sk_forecasting'], memoryAccess: 'encrypted', contextWindowSize: 22100, lastActiveAt: '2026-05-07T12:00:00Z', taskCount: 34, completedTasks: 31, accuracy: 94.8, avgLatency: 520 },
    ];
  },

  async getSkillModules() {
    await delay(500);
    return [
      { id: 'sk_python', name: 'Python Execution', category: 'Engineering', version: '3.2.1', description: 'Advanced Python code generation, debugging, and optimization.', isPortable: true },
      { id: 'sk_react', name: 'React Development', category: 'Engineering', version: '2.1.0', description: 'Component architecture, state management, and UI implementation.', isPortable: true },
      { id: 'sk_devops', name: 'DevOps Pipeline', category: 'Engineering', version: '1.8.4', description: 'CI/CD configuration, container orchestration, and deployment.', isPortable: true },
      { id: 'sk_content', name: 'Content Strategy', category: 'Marketing', version: '2.0.0', description: 'SEO-optimized content creation, editorial planning, and brand voice.', isPortable: true },
      { id: 'sk_seo', name: 'SEO Optimization', category: 'Marketing', version: '1.5.2', description: 'Technical SEO, keyword analysis, and search ranking strategy.', isPortable: true },
      { id: 'sk_analytics', name: 'Data Analytics', category: 'Marketing', version: '1.3.0', description: 'Campaign performance metrics, attribution modeling, and ROI analysis.', isPortable: true },
      { id: 'sk_nlp', name: 'Natural Language Processing', category: 'Support', version: '3.0.1', description: 'Intent classification, sentiment analysis, and response generation.', isPortable: true },
      { id: 'sk_ticketing', name: 'Ticket Management', category: 'Support', version: '1.2.0', description: 'Issue triage, priority assignment, and escalation workflows.', isPortable: true },
      { id: 'sk_knowledge_base', name: 'Knowledge Base', category: 'Support', version: '2.4.0', description: 'Documentation retrieval, FAQ generation, and knowledge graph querying.', isPortable: true },
      { id: 'sk_financial_modeling', name: 'Financial Modeling', category: 'Finance', version: '1.1.0', description: 'Revenue forecasting, cost analysis, and financial projections.', isPortable: true },
      { id: 'sk_forecasting', name: 'Predictive Forecasting', category: 'Finance', version: '1.0.2', description: 'Time-series analysis, trend detection, and scenario modeling.', isPortable: true },
    ];
  },

  async getAgentMemoryVault(agentId) {
    await delay(600);
    const vaults = {
      agent_dev_1: { episodicMemory: { status: 'encrypted', entryCount: 1247, lastSyncAt: '2026-05-07T16:00:00Z', accessLevel: 'company_isolated' }, semanticSkill: { status: 'active', experienceScore: 94.2 }, contextWindow: { activeTokens: 48200, maxTokens: 128000, utilizationPercent: 37.7 } },
      agent_mkt_1: { episodicMemory: { status: 'encrypted', entryCount: 834, lastSyncAt: '2026-05-07T15:30:00Z', accessLevel: 'company_isolated' }, semanticSkill: { status: 'active', experienceScore: 87.1 }, contextWindow: { activeTokens: 31500, maxTokens: 128000, utilizationPercent: 24.6 } },
      agent_sup_1: { episodicMemory: { status: 'encrypted', entryCount: 2103, lastSyncAt: '2026-05-07T14:45:00Z', accessLevel: 'company_isolated' }, semanticSkill: { status: 'active', experienceScore: 91.8 }, contextWindow: { activeTokens: 12800, maxTokens: 128000, utilizationPercent: 10.0 } },
      agent_fin_1: { episodicMemory: { status: 'encrypted', entryCount: 456, lastSyncAt: '2026-05-07T12:00:00Z', accessLevel: 'company_isolated' }, semanticSkill: { status: 'active', experienceScore: 82.5 }, contextWindow: { activeTokens: 22100, maxTokens: 128000, utilizationPercent: 17.3 } },
    };
    return vaults[agentId] || vaults.agent_dev_1;
  },

  // ================================================================
  // MARKETPLACE MODULE
  // ================================================================

  async getMarketplaceAgents() {
    const token = window.__sovereignAccessToken;
    const res = await fetch('http://localhost:3000/api/v1/marketplace/agents', {
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
    });
    if (!res.ok) throw new Error('Failed to fetch marketplace agents');
    return res.json();
  },

  async getMarketplaceFilters() {
    const token = window.__sovereignAccessToken;
    const res = await fetch('http://localhost:3000/api/v1/marketplace/filters', {
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
    });
    if (!res.ok) throw new Error('Failed to fetch marketplace filters');
    return res.json();
  },

  async hireAgentToSandbox(agentId, trialDays) {
    const token = window.__sovereignAccessToken;
    const tenantId = sessionStorage.getItem('sovereign_active_tenant') || 'default-tenant';
    const res = await fetch(`http://localhost:3000/api/v1/marketplace/agents/${agentId}/hire`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Tenant-ID': tenantId,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) 
      },
      body: JSON.stringify({ trialDays: trialDays || 7 })
    });
    if (!res.ok) throw new Error('Failed to hire agent');
    return res.json();
  },

  // ================================================================
  // SERVICE FEE MODULE
  // ================================================================

  async getRevenueDistribution() {
    await delay(700);
    return { totalRevenue: 24500, treasury: { amount: 9800, percent: 40 }, operations: { amount: 6125, percent: 25 }, agentFees: { amount: 5880, percent: 24 }, platform: { amount: 2695, percent: 11 }, period: 'monthly', currency: 'USD' };
  },

  async getComputeBurnRate() {
    await delay(600);
    return { currentRate: 12.40, dailyAverage: 285.50, weeklyTotal: 1998.50, opsWalletBalance: 8853.00, runwayDays: 31, providers: [{ name: 'Ollama Local', type: 'local', costPerHour: 0.18, usageHours: 22.5, totalCost: 4.05 }, { name: 'Cloud GPU (A100)', type: 'cloud', costPerHour: 3.20, usageHours: 1.8, totalCost: 5.76 }, { name: 'API Calls (Gemini)', type: 'api', costPerHour: 0.45, usageHours: 5.8, totalCost: 2.61 }] };
  },

  async getAgentROI() {
    await delay(700);
    return [
      { agentId: 'agent_dev_1', agentName: 'Dev-Agent-1', valueGenerated: 8400, maintenanceCost: 2100, computeCost: 1200, memoryCost: 450, apiCost: 450, roi: 300, trend: 'up' },
      { agentId: 'agent_mkt_1', agentName: 'Marketing-Agent-1', valueGenerated: 5200, maintenanceCost: 1800, computeCost: 800, memoryCost: 500, apiCost: 500, roi: 189, trend: 'up' },
      { agentId: 'agent_sup_1', agentName: 'Support-Agent-1', valueGenerated: 4100, maintenanceCost: 950, computeCost: 400, memoryCost: 300, apiCost: 250, roi: 332, trend: 'stable' },
      { agentId: 'agent_fin_1', agentName: 'Finance-Agent-1', valueGenerated: 2800, maintenanceCost: 1400, computeCost: 700, memoryCost: 350, apiCost: 350, roi: 100, trend: 'down' },
    ];
  },

  async requestPayDistribution(distributionId) {
    await delay(1000);
    return { success: true, distributionId, status: 'awaiting_signature', message: 'Pay distribution queued. Requires Human CEO signature from Module 1.' };
  },

  // ================================================================
  // SPATIAL WORKSPACE MODULE
  // ================================================================

  async getSpatialAgentPositions() {
    await delay(400);
    return [
      { agentId: 'agent-001', name: 'ARIA-7', state: 'executing', x: -2.5, y: 0, z: -1.5, burnIntensity: 0.82 },
      { agentId: 'agent-002', name: 'NEXUS-3', state: 'executing', x: 1.0, y: 0, z: -2.0, burnIntensity: 0.65 },
      { agentId: 'agent-003', name: 'VEGA-12', state: 'idle', x: 2.5, y: 0, z: 1.0, burnIntensity: 0.08 },
      { agentId: 'agent-004', name: 'ORION-5', state: 'blocked', x: -1.0, y: 0, z: 2.5, burnIntensity: 0.45 },
      { agentId: 'agent-005', name: 'HELIX-9', state: 'planning', x: 0.5, y: 0, z: 0.5, burnIntensity: 0.35 },
      { agentId: 'agent-006', name: 'CIPHER-1', state: 'terminated', x: -3.0, y: 0, z: 3.0, burnIntensity: 0 },
    ];
  },

  async getSpatialHeatmap() {
    await delay(300);
    const grid = [];
    for (let x = -4; x < 4; x++) {
      for (let z = -4; z < 4; z++) {
        let intensity = 0.05;
        const dx1 = x - (-2.5), dz1 = z - (-1.5);
        const dx2 = x - 1.0, dz2 = z - (-2.0);
        const dx4 = x - (-1.0), dz4 = z - 2.5;
        intensity += Math.max(0, 0.8 - Math.sqrt(dx1*dx1 + dz1*dz1) * 0.3);
        intensity += Math.max(0, 0.6 - Math.sqrt(dx2*dx2 + dz2*dz2) * 0.25);
        intensity += Math.max(0, 0.4 - Math.sqrt(dx4*dx4 + dz4*dz4) * 0.2);
        grid.push({ gridX: x, gridZ: z, intensity: Math.min(1, intensity) });
      }
    }
    return grid;
  },

  async getSpatialAudioEvents() {
    await delay(200);
    return [{ type: 'blocked', agentId: 'agent-004', position: { x: -1.0, y: 0, z: 2.5 } }];
  },

  // ================================================================
  // DPE PIPELINE & FORENSIC AUDIT MODULE
  // ================================================================

  async getDPEProposals() {
    await delay(500);
    return [
      { id: 'prop-001', title: 'Migrate analytics pipeline to GPU cluster', description: 'Relocate the data analytics workload from CPU-based instances to GPU-accelerated infrastructure for 4x throughput improvement.', agentId: 'agent-001', agentName: 'ARIA-7', category: 'infrastructure', status: 'draft', createdAt: '2026-05-07T08:30:00Z', draftContent: 'Internal reasoning: Current CPU utilization at 94%. Latency SLA breach risk at 12%.', riskScore: 35, resourceEstimate: { costUSD: 2400, computeHours: 48 }, reasoningPath: ['Identified CPU bottleneck', 'Benchmarked GPU alternatives', 'Calculated ROI', 'Selected H100 cluster'] },
      { id: 'prop-002', title: 'Onboard external legal review vendor', description: 'Engage Thompson & Associates for quarterly compliance review.', agentId: 'agent-005', agentName: 'HELIX-9', category: 'compliance', status: 'proposed', createdAt: '2026-05-07T09:15:00Z', draftContent: 'Compliance gap detected in Q2 audit.', riskScore: 22, resourceEstimate: { costUSD: 4500, computeHours: 0 }, reasoningPath: ['Detected compliance gap', 'Cross-referenced governance policy', 'Selected vendor'], reviewedBy: 'supervisor-001', reviewedAt: '2026-05-07T10:00:00Z' },
      { id: 'prop-003', title: 'Deploy marketing campaign budget allocation', description: 'Allocate $5,000 to digital marketing campaign for Q3 product launch.', agentId: 'agent-002', agentName: 'NEXUS-3', category: 'marketing', status: 'approved', createdAt: '2026-05-07T07:00:00Z', draftContent: 'Market analysis complete. Optimal channel mix identified.', riskScore: 48, resourceEstimate: { costUSD: 5000, computeHours: 12 }, reasoningPath: ['Analyzed Q2 data', 'Identified top channels', 'Calculated optimal split', 'Projected 2.3x ROAS', 'Flagged for multi-sig'], reviewedBy: 'founder-001', reviewedAt: '2026-05-07T11:00:00Z' },
    ];
  },

  async getForensicTimeline() {
    try {
      const { fetchWithAuth } = await import('./apiClient.js');
      return await fetchWithAuth('/audit/timeline');
    } catch (error) {
      console.warn("Audit API failed, falling back to mock data.", error);
      await delay(400);
      return [
        { id: 'tl-001', timestamp: '2026-05-07T07:00:00Z', action: 'PROPOSAL_CREATED', actor: 'NEXUS-3', target: 'prop-003', stateBefore: '—', stateAfter: 'draft', details: 'Marketing budget proposal created by agent NEXUS-3' },
        { id: 'tl-002', timestamp: '2026-05-07T08:15:00Z', action: 'PROPOSAL_SUBMITTED', actor: 'NEXUS-3', target: 'prop-003', stateBefore: 'draft', stateAfter: 'proposed', details: 'Proposal submitted for human review' },
        { id: 'tl-003', timestamp: '2026-05-07T09:00:00Z', action: 'RISK_ASSESSMENT', actor: 'SUPERVISOR-AGENT', target: 'prop-003', stateBefore: 'proposed', stateAfter: 'proposed', details: 'Risk score calculated: 48 (MEDIUM)' },
        { id: 'tl-004', timestamp: '2026-05-07T10:00:00Z', action: 'REASONING_REVIEWED', actor: 'founder-001', target: 'prop-003', stateBefore: 'proposed', stateAfter: 'proposed', details: 'Human CEO reviewed 5-step reasoning path' },
        { id: 'tl-005', timestamp: '2026-05-07T11:00:00Z', action: 'PROPOSAL_APPROVED', actor: 'founder-001', target: 'prop-003', stateBefore: 'proposed', stateAfter: 'approved', details: 'Approved for execution. Multi-sig required.' },
      ];
    }
  },

  async getAuditHashes() {
    try {
      const { fetchWithAuth } = await import('./apiClient.js');
      return await fetchWithAuth('/audit/hashes');
    } catch (error) {
      console.warn("Audit API failed, falling back to mock data.", error);
      await delay(300);
      const entries = [
        { id: 'ah-001', action: 'DPE_PROPOSAL_APPROVE', userId: 'founder-001', timestamp: '2026-05-07T11:00:00Z', severity: 'info', context: 'prop-003' },
        { id: 'ah-002', action: 'DPE_EXECUTE', userId: 'founder-001', timestamp: '2026-05-07T11:30:00Z', severity: 'critical', context: 'prop-003 — multi-sig execution' },
        { id: 'ah-003', action: 'POLICY_VIOLATION', userId: 'system', timestamp: '2026-05-07T09:45:00Z', severity: 'warning', context: 'Agent ORION-5 attempted $150 spend (exceeds $100 cap)' },
        { id: 'ah-004', action: 'SPATIAL_SCENE_LOAD', userId: 'founder-001', timestamp: '2026-05-07T08:00:00Z', severity: 'info', context: 'Loaded 6 agent positions' },
        { id: 'ah-005', action: 'AGENT_TERMINATE', userId: 'founder-001', timestamp: '2026-05-07T07:30:00Z', severity: 'critical', context: 'Terminated agent CIPHER-1 for policy violation' },
      ];
      const hashed = [];
      for (const e of entries) {
        const { id, ...data } = e;
        const str = JSON.stringify(data);
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        hashed.push({ ...e, hash });
      }
      return hashed;
    }
  },
};

export { platformApi };
