/**
 * Sovereign Protocol — useTierGate Hook
 * Enforces progressive trust access control on routes and features.
 * Prevents users from accessing features above their verified tier.
 */

import { useMemo } from 'react';
import { useOnboardingStore } from '../store/onboardingStore.js';
import { useIdentityStore } from '../store/identityStore.js';
import { getTierById } from '../config/tiers.js';

export function useTierGate() {
  const currentTierId = useOnboardingStore(s => s.currentTierId);
  const isSandboxMode = useOnboardingStore(s => s.isSandboxMode);
  const completedLayers = useIdentityStore(s => s.completedLayers);

  const currentTier = useMemo(() => getTierById(currentTierId), [currentTierId]);

  /**
   * Checks if the user can access a specific tier level.
   * @param {number} requiredTierId - The minimum tier required
   * @returns {boolean}
   */
  const canAccessTier = (requiredTierId) => currentTierId >= requiredTierId;

  /**
   * Checks if a specific feature is unlocked.
   * @param {string} feature - Feature name
   * @returns {boolean}
   */
  const isFeatureUnlocked = (feature) => {
    switch (feature) {
      case 'treasury': return currentTier.hasTreasury;
      case 'governance': return currentTier.hasGovernance;
      case 'agents': return currentTier.maxAgents > 0;
      case 'realExecution': return currentTier.hasRealExecution;
      case 'multiSig': return currentTierId >= 3;
      case 'compliance': return currentTierId >= 3;
      default: return false;
    }
  };

  return {
    currentTierId,
    currentTier,
    isSandboxMode,
    completedLayers,
    canAccessTier,
    isFeatureUnlocked,
    maxAgents: currentTier.maxAgents,
  };
}
