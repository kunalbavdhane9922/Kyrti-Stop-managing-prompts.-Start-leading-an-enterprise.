/**
 * Sovereign Protocol — Deterministic Policy Validator
 * Hard-coded middleware that scans all AI-generated outputs for unauthorized
 * financial proposals, payment instructions, or treasury actions.
 * 
 * This validator is DETERMINISTIC and INDEPENDENT from the AI model.
 * Prompts cannot override it. Reasoning cannot bypass it.
 * Agents cannot manipulate financial permissions.
 */

import { FINANCIAL_BLOCKLIST, AI_BLOCKED_CATEGORIES, AUDIT_ACTIONS } from '../config/constants.js';
import { AuditLogger } from './AuditLogger.js';

/**
 * Result of a policy validation check.
 * @typedef {Object} ValidationResult
 * @property {boolean} passed - Whether the content passed validation
 * @property {string[]} violations - List of detected violations
 * @property {string} severity - 'none' | 'warning' | 'critical'
 * @property {string|null} blockerReportId - ID of generated blocker report if critical
 */

const PolicyValidator = {
  /**
   * Validates AI-generated content against the financial blocklist.
   * If any financial keywords are detected, the content is BLOCKED.
   * 
   * @param {string} content - The AI-generated text to validate
   * @param {string} agentId - The ID of the agent that produced the content
   * @param {string} context - Where this content would be displayed
   * @returns {ValidationResult} The validation result
   */
  validateContent(content, agentId = 'unknown', context = 'unknown') {
    if (!content || typeof content !== 'string') {
      return { passed: true, violations: [], severity: 'none', blockerReportId: null };
    }

    const normalizedContent = content.toLowerCase().trim();
    const violations = [];

    // Check against financial blocklist
    for (const keyword of FINANCIAL_BLOCKLIST) {
      if (normalizedContent.includes(keyword.toLowerCase())) {
        violations.push(`Blocked keyword detected: "${keyword}"`);
      }
    }

    // Check for currency patterns (e.g., $1000, 0.5 ETH, 100 USDC)
    const currencyPatterns = [
      /\$\s*[\d,]+(\.\d{1,2})?/g,
      /\d+(\.\d+)?\s*(eth|btc|usdc|usdt|matic|sol|bnb|dai)\b/gi,
      /\b(wei|gwei|finney)\b/gi,
      /0x[a-fA-F0-9]{40}/g, // Ethereum addresses
    ];

    for (const pattern of currencyPatterns) {
      const matches = normalizedContent.match(pattern);
      if (matches) {
        violations.push(`Financial pattern detected: ${matches[0]}`);
      }
    }

    // Check for transaction-like structures
    const transactionPatterns = [
      /\b(send|transfer|pay|disburse|withdraw|deposit)\s+(to|from)\s+/gi,
      /\b(invoice|receipt|billing|payment\s+of)\b/gi,
      /\b(authorize|approve)\s+(payment|transaction|transfer|spending)\b/gi,
    ];

    for (const pattern of transactionPatterns) {
      if (pattern.test(content)) {
        violations.push(`Transaction instruction pattern detected`);
      }
    }

    if (violations.length > 0) {
      const blockerReportId = `BR-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      // Log the policy violation
      AuditLogger.log({
        action: AUDIT_ACTIONS.POLICY_VIOLATION,
        agentId,
        context,
        violations,
        blockerReportId,
        severity: 'critical',
        contentSnippet: content.substring(0, 200),
      });

      return {
        passed: false,
        violations,
        severity: 'critical',
        blockerReportId,
      };
    }

    return { passed: true, violations: [], severity: 'none', blockerReportId: null };
  },

  /**
   * Validates that a proposed action does not fall into AI-blocked categories.
   * 
   * @param {string} actionCategory - The category of the proposed action
   * @param {string} agentId - The ID of the agent proposing the action
   * @returns {boolean} Whether the action is allowed
   */
  isActionAllowed(actionCategory, agentId = 'unknown') {
    const isBlocked = AI_BLOCKED_CATEGORIES.includes(actionCategory);

    if (isBlocked) {
      AuditLogger.log({
        action: AUDIT_ACTIONS.POLICY_VIOLATION,
        agentId,
        context: 'action_validation',
        violations: [`Agent attempted blocked category: ${actionCategory}`],
        severity: 'critical',
      });
    }

    return !isBlocked;
  },

  /**
   * Validates that a proposal is in draft state and not executable.
   * Proposals can only be executed by authorized human roles.
   * 
   * @param {Object} proposal - The proposal object
   * @param {string} userRole - The role of the user attempting execution
   * @param {Object} permissions - The user's permission set
   * @returns {ValidationResult} The validation result
   */
  validateProposalExecution(proposal, userRole, permissions) {
    const violations = [];

    if (!proposal) {
      violations.push('Proposal object is null or undefined');
    }

    if (proposal && proposal.status !== 'approved') {
      violations.push(`Proposal must be in "approved" state. Current: "${proposal?.status}"`);
    }

    if (!permissions?.canExecuteProposals) {
      violations.push(`Role "${userRole}" does not have execution permission`);
    }

    return {
      passed: violations.length === 0,
      violations,
      severity: violations.length > 0 ? 'critical' : 'none',
      blockerReportId: null,
    };
  },

  /**
   * Generates a structured Blocker Report when a policy violation occurs.
   * 
   * @param {string} blockerReportId - The unique ID for this report
   * @param {string[]} violations - List of violations detected
   * @param {string} agentId - The agent that triggered the violation
   * @param {string} context - Where the violation occurred
   * @returns {Object} The structured blocker report
   */
  generateBlockerReport(blockerReportId, violations, agentId, context) {
    return Object.freeze({
      id: blockerReportId,
      timestamp: new Date().toISOString(),
      type: 'POLICY_VIOLATION',
      agent: agentId,
      context,
      violations: [...violations],
      status: 'PAUSE_STATE',
      resolution: 'HUMAN_REVIEW_REQUIRED',
      autoResolvable: false,
    });
  },
};

export { PolicyValidator };
