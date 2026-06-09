/**
 * Sovereign Protocol — Onboarding Store
 * Manages the Progressive Trust state machine (Tier 0-3).
 * Users cannot access higher-tier features until verification is complete.
 */

import { create } from 'zustand';
import { TIERS, getTierById } from '../config/tiers.js';

const useOnboardingStore = create((set, get) => ({
  // --- State ---
  currentTierId: 0,
  targetTierId: null,
  onboardingStep: 0, // Current step within the onboarding flow
  isOnboardingComplete: false,
  isSandboxMode: true, // True for Tier 0

  // --- Actions ---

  /**
   * Sets the current tier after verification completion.
   */
  setCurrentTier: (tierId) => set({
    currentTierId: tierId,
    isSandboxMode: tierId === 0,
    isOnboardingComplete: tierId >= 2,
  }),

  /**
   * Sets the target tier the user is working toward.
   */
  setTargetTier: (tierId) => set({ targetTierId: tierId }),

  /**
   * Advances the onboarding step.
   */
  nextStep: () => set(state => ({ onboardingStep: state.onboardingStep + 1 })),

  /**
   * Goes back to the previous onboarding step.
   */
  prevStep: () => set(state => ({
    onboardingStep: Math.max(0, state.onboardingStep - 1),
  })),

  /**
   * Sets a specific onboarding step.
   */
  setStep: (step) => set({ onboardingStep: step }),

  /**
   * Returns the current tier definition object.
   */
  getCurrentTier: () => getTierById(get().currentTierId),

  /**
   * Checks if the user can access a specific feature.
   */
  canAccessFeature: (feature) => {
    const tier = getTierById(get().currentTierId);
    switch (feature) {
      case 'treasury': return tier.hasTreasury;
      case 'governance': return tier.hasGovernance;
      case 'realExecution': return tier.hasRealExecution;
      case 'agents': return tier.maxAgents > 0;
      default: return false;
    }
  },

  /**
   * Returns the maximum number of agents for the current tier.
   */
  getMaxAgents: () => getTierById(get().currentTierId).maxAgents,

  /**
   * Completes the onboarding flow.
   */
  completeOnboarding: () => set({ isOnboardingComplete: true }),

  /**
   * Resets onboarding state. Called on session wipe.
   */
  reset: () => set({
    currentTierId: 0,
    targetTierId: null,
    onboardingStep: 0,
    isOnboardingComplete: false,
    isSandboxMode: true,
  }),
}));

export { useOnboardingStore };
