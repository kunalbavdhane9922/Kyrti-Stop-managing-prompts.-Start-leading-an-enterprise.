/**
 * Sovereign Protocol — Policy Gate (Module 4)
 * Hard-coded middleware that checks every execution action against
 * the governance rules. This is deterministic and model-independent.
 *
 * SECURITY: Cannot be bypassed by prompts, reasoning, or agent manipulation.
 * The gate checks are hard-coded — not configurable by AI agents.
 */

import { AI_BLOCKED_CATEGORIES } from '../config/constants.js';

const AGENT_SPENDING_CAP = 100; // USD — agents cannot spend more than this
const HIGH_VALUE_THRESHOLD = 1000; // USD — requires multi-sig above this
const RISK_SCORE_BLOCK_THRESHOLD = 90; // Risk scores >= 90 are auto-blocked

const PolicyGate = {
  /**
   * Validates whether a proposal can be executed.
   * @param {Object} proposal - The proposal to validate
   * @param {Object} session - Current user session state
   * @returns {{ allowed: boolean, reason: string, requiresMultiSig: boolean }}
   */
  validateExecution(proposal, session) {
    // Gate 1: Verify Layer C authority session exists
    if (!session || !session.isAuthenticated) {
      return { allowed: false, reason: 'No authenticated session. Layer A verification required.', requiresMultiSig: false };
    }

    if (!session.layerCVerified) {
      return { allowed: false, reason: 'Layer C (Authority) session token required for execution.', requiresMultiSig: false };
    }

    // Gate 2: Proposal must be in approved state
    if (proposal.status !== 'approved') {
      return { allowed: false, reason: `Proposal is in "${proposal.status}" state. Only approved proposals can be executed.`, requiresMultiSig: false };
    }

    // Gate 3: Risk score threshold
    if (proposal.riskScore >= RISK_SCORE_BLOCK_THRESHOLD) {
      return { allowed: false, reason: `Risk score (${proposal.riskScore}) exceeds auto-block threshold (${RISK_SCORE_BLOCK_THRESHOLD}). Manual board review required.`, requiresMultiSig: false };
    }

    // Gate 4: Category check
    if (proposal.category && AI_BLOCKED_CATEGORIES && AI_BLOCKED_CATEGORIES.includes(proposal.category)) {
      return { allowed: false, reason: `Category "${proposal.category}" is permanently blocked by governance policy.`, requiresMultiSig: false };
    }

    // Gate 5: Financial threshold
    const amount = proposal.resourceEstimate?.costUSD || 0;
    if (amount > AGENT_SPENDING_CAP && proposal.initiatedByAgent) {
      return { allowed: false, reason: `Agent-initiated proposals cannot exceed $${AGENT_SPENDING_CAP}. This proposal estimates $${amount}.`, requiresMultiSig: false };
    }

    // Gate 6: Multi-sig requirement for high-value
    const requiresMultiSig = amount > HIGH_VALUE_THRESHOLD;

    return { allowed: true, reason: 'All policy gates passed.', requiresMultiSig };
  },

  /**
   * Validates whether a proposal can be approved.
   * @param {Object} proposal
   * @returns {{ allowed: boolean, reason: string }}
   */
  validateApproval(proposal) {
    if (proposal.status !== 'proposed') {
      return { allowed: false, reason: `Only proposals in "proposed" state can be approved. Current: "${proposal.status}".` };
    }

    if (!proposal.reasoningPath || proposal.reasoningPath.length === 0) {
      return { allowed: false, reason: 'Reasoning path is empty. Cannot approve without visible logic chain.' };
    }

    return { allowed: true, reason: 'Approval permitted.' };
  },

  /** Returns the spending cap constant */
  getAgentSpendingCap() { return AGENT_SPENDING_CAP; },

  /** Returns the high-value threshold constant */
  getHighValueThreshold() { return HIGH_VALUE_THRESHOLD; },

  /** Returns the risk block threshold constant */
  getRiskBlockThreshold() { return RISK_SCORE_BLOCK_THRESHOLD; },
};

export { PolicyGate };
