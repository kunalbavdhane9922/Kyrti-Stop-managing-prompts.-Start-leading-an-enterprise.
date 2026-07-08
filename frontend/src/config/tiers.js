/**
 * Sovereign Protocol — Progressive Trust Tier Definitions
 * Defines the state machine for onboarding progression.
 * Each tier unlocks specific platform capabilities.
 */

export const TIERS = Object.freeze({
  GUEST: {
    id: 0,
    name: 'Guest',
    label: 'Guest Sandbox',
    description: 'Restricted sandbox view with simulated costs. No real-world execution or on-chain activity.',
    color: '#64748b',
    requiredLayers: ['A'],
    capabilities: [
      'View simulated agent workspace',
      'Explore platform features',
      'Access documentation',
    ],
    restrictions: [
      'No real transactions',
      'No agent deployment',
      'Simulated data only',
      'No on-chain reputation',
    ],
    maxAgents: 0,
    hasRealExecution: false,
    hasTreasury: false,
    hasGovernance: false,
  },

  INDIVIDUAL: {
    id: 1,
    name: 'Individual',
    label: 'Verified Individual',
    description: 'Verified freelancer access with KYC completion. Low liability caps and restricted agent counts.',
    color: '#E8943A',
    requiredLayers: ['A', 'KYC'],
    capabilities: [
      'Deploy up to 3 AI agents',
      'Basic task execution',
      'Personal execution wallet',
      'Build individual reputation',
    ],
    restrictions: [
      'Limited agent count',
      'Low liability cap',
      'No multi-sig governance',
      'No enterprise compliance',
    ],
    maxAgents: 3,
    hasRealExecution: true,
    hasTreasury: false,
    hasGovernance: false,
  },

  COMPANY: {
    id: 2,
    name: 'Company',
    label: 'Verified Company',
    description: 'Full KYB verification with DNS and corporate email. Activates treasury and agent execution wallets.',
    color: '#D4842E',
    requiredLayers: ['A', 'B', 'C_DNS', 'C_EMAIL'],
    capabilities: [
      'Deploy up to 50 AI agents',
      'Full treasury dashboard',
      'Agent execution wallets',
      'Build transferable on-chain reputation',
      'API integrations',
    ],
    restrictions: [
      'No multi-sig board approval',
      'Standard compliance only',
    ],
    maxAgents: 50,
    hasRealExecution: true,
    hasTreasury: true,
    hasGovernance: true,
  },

  ENTERPRISE: {
    id: 3,
    name: 'Enterprise',
    label: 'Enterprise',
    description: 'Full multi-sig board approval with custom compliance modules. Unlimited agent deployment.',
    color: '#FF5C00',
    requiredLayers: ['A', 'B', 'C_DNS', 'C_EMAIL', 'C_MULTISIG', 'D'],
    capabilities: [
      'Unlimited AI agents',
      'Multi-sig board governance',
      'Custom compliance modules',
      'Enterprise audit suite',
      'Priority support',
      'Cross-company agent migration',
    ],
    restrictions: [],
    maxAgents: Infinity,
    hasRealExecution: true,
    hasTreasury: true,
    hasGovernance: true,
  },
});

/**
 * Returns the tier object for a given tier ID.
 * @param {number} tierId - The tier ID (0-3)
 * @returns {Object} The tier definition
 */
export function getTierById(tierId) {
  const tiers = Object.values(TIERS);
  return tiers.find(t => t.id === tierId) || TIERS.GUEST;
}

/**
 * Checks if a user's completed layers satisfy a target tier's requirements.
 * @param {string[]} completedLayers - Array of completed layer identifiers
 * @param {number} targetTierId - The target tier ID
 * @returns {boolean} Whether all required layers are completed
 */
export function canAccessTier(completedLayers, targetTierId) {
  const tier = getTierById(targetTierId);
  if (!tier) return false;
  return tier.requiredLayers.every(layer => completedLayers.includes(layer));
}

/**
 * Calculates the current tier based on completed verification layers.
 * @param {string[]} completedLayers - Array of completed layer identifiers
 * @returns {Object} The highest accessible tier
 */
export function calculateCurrentTier(completedLayers) {
  const orderedTiers = Object.values(TIERS).sort((a, b) => b.id - a.id);
  for (const tier of orderedTiers) {
    if (canAccessTier(completedLayers, tier.id)) {
      return tier;
    }
  }
  return TIERS.GUEST;
}
