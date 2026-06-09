/**
 * Sovereign Protocol — usePolicyValidator Hook
 * React hook wrapping the deterministic PolicyValidator for component use.
 * Triggers pause state and blocker reports on policy violations.
 */

import { useState, useCallback } from 'react';
import { PolicyValidator } from '../security/PolicyValidator.js';
import { useGovernanceStore } from '../store/governanceStore.js';

export function usePolicyValidator() {
  const [isPaused, setIsPaused] = useState(false);
  const [activeBlocker, setActiveBlocker] = useState(null);
  const addBlockerReport = useGovernanceStore(s => s.addBlockerReport);

  /**
   * Validates AI content and triggers pause state if violations found.
   * @param {string} content - AI-generated content to validate
   * @param {string} agentId - Agent that produced the content
   * @param {string} context - Display context
   * @returns {import('../security/PolicyValidator.js').ValidationResult}
   */
  const validate = useCallback((content, agentId, context) => {
    const result = PolicyValidator.validateContent(content, agentId, context);

    if (!result.passed) {
      const blockerReport = PolicyValidator.generateBlockerReport(
        result.blockerReportId,
        result.violations,
        agentId,
        context
      );
      addBlockerReport(blockerReport);
      setIsPaused(true);
      setActiveBlocker(blockerReport);
    }

    return result;
  }, [addBlockerReport]);

  /**
   * Checks if an action category is allowed for an agent.
   */
  const isActionAllowed = useCallback((category, agentId) => {
    return PolicyValidator.isActionAllowed(category, agentId);
  }, []);

  /**
   * Clears the pause state after human review.
   */
  const clearPause = useCallback(() => {
    setIsPaused(false);
    setActiveBlocker(null);
  }, []);

  return { validate, isActionAllowed, isPaused, activeBlocker, clearPause };
}
