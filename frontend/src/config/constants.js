/**
 * Sovereign Protocol — Hard-Coded Platform Constants
 * These values are immutable and enforced at the frontend layer.
 * No runtime modification is permitted.
 */

/** Session timeout in milliseconds (5 minutes) */
export const SESSION_TIMEOUT_MS = 5 * 60 * 1000;

/** Session warning threshold before timeout (60 seconds) */
export const SESSION_WARNING_MS = 60 * 1000;

/** Maximum idle time before Human Presence token is wiped */
export const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

/** Polling interval for DNS verification (10 seconds) */
export const DNS_POLL_INTERVAL_MS = 10 * 1000;

/** Maximum file size for document uploads (10MB) */
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

/** Allowed file types for KYB document uploads */
export const ALLOWED_UPLOAD_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
];

/** Allowed file extensions for display */
export const ALLOWED_UPLOAD_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];

/** Financial keyword blocklist for Policy Validator */
export const FINANCIAL_BLOCKLIST = Object.freeze([
  'payment instruction',
  'transfer funds',
  'send payment',
  'wire transfer',
  'execute payment',
  'authorize payment',
  'approve spending',
  'disburse funds',
  'release funds',
  'financial proposal',
  'investment recommendation',
  'budget allocation',
  'treasury request',
  'spending authorization',
  'monetary action',
  'fund transfer',
  'pay invoice',
  'process payment',
  'initiate transaction',
  'wallet withdrawal',
]);

/** Categories that AI agents are permanently blocked from */
export const AI_BLOCKED_CATEGORIES = Object.freeze([
  'treasury_access',
  'budget_view',
  'payment_execution',
  'financial_approval',
  'salary_management',
  'investment_decision',
  'monetary_strategy',
  'wallet_access',
  'banking_access',
  'financial_api',
  'payment_visibility',
  'treasury_metadata',
]);

/** Multi-signature governance thresholds by tier */
export const MULTI_SIG_THRESHOLDS = Object.freeze({
  TIER_2: { required: 1, total: 1 },
  TIER_3: { required: 2, total: 3 },
});

/** Agent execution wallet cap (in wei equivalent) */
export const AGENT_WALLET_CAP = '1000000000000000000'; // 1 ETH equivalent

/** Platform identification */
export const PLATFORM_NAME = 'Kyrti';
export const PLATFORM_VERSION = '1.0.0';

/** Cryptographic constants */
export const HASH_ALGORITHM = 'SHA-256';
export const SIGNING_ALGORITHM = 'ECDSA';
export const KEY_LENGTH = 256;

/** API endpoints */
export const API_BASE_URL = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '')
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.PROD ? '' : 'http://localhost:3000');

/** Audit log action types */
export const AUDIT_ACTIONS = Object.freeze({
  LOGIN: 'AUTH_LOGIN',
  LOGOUT: 'AUTH_LOGOUT',
  SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  IDENTITY_VERIFY: 'IDENTITY_VERIFY',
  DOCUMENT_UPLOAD: 'DOCUMENT_UPLOAD',
  DNS_VERIFY: 'DNS_VERIFY',
  EMAIL_VERIFY: 'EMAIL_VERIFY',
  WALLET_CONNECT: 'WALLET_CONNECT',
  WALLET_BIND: 'WALLET_BIND',
  PROPOSAL_DRAFT: 'PROPOSAL_DRAFT',
  PROPOSAL_APPROVE: 'PROPOSAL_APPROVE',
  PROPOSAL_REJECT: 'PROPOSAL_REJECT',
  PROPOSAL_EXECUTE: 'PROPOSAL_EXECUTE',
  AGENT_HIRE: 'AGENT_HIRE',
  AGENT_TERMINATE: 'AGENT_TERMINATE',
  POLICY_VIOLATION: 'POLICY_VIOLATION',
  POLICY_UPDATE: 'POLICY_UPDATE',
  TREASURY_FUND: 'TREASURY_FUND',
  BLOCKER_REPORT: 'BLOCKER_REPORT',
  // Module 2: Command Center
  AGENT_MEMORY_WIPE: 'AGENT_MEMORY_WIPE',
  AGENT_SKILL_VIEW: 'AGENT_SKILL_VIEW',
  AGENT_DETACHMENT: 'AGENT_DETACHMENT',
  MARKETPLACE_SEARCH: 'MARKETPLACE_SEARCH',
  MARKETPLACE_HIRE: 'MARKETPLACE_HIRE',
  SANDBOX_ACTIVATE: 'SANDBOX_ACTIVATE',
  SANDBOX_PROMOTE: 'SANDBOX_PROMOTE',
  SANDBOX_TERMINATE: 'SANDBOX_TERMINATE',
  PAY_DISTRIBUTION_REQUEST: 'PAY_DISTRIBUTION_REQUEST',
  PAY_DISTRIBUTION_SIGNED: 'PAY_DISTRIBUTION_SIGNED',
  PAY_DISTRIBUTION_EXECUTED: 'PAY_DISTRIBUTION_EXECUTED',
  PAY_DISTRIBUTION_REJECTED: 'PAY_DISTRIBUTION_REJECTED',
  // Module 3: Spatial Workspace
  SPATIAL_SCENE_LOAD: 'SPATIAL_SCENE_LOAD',
  SPATIAL_AGENT_FOCUS: 'SPATIAL_AGENT_FOCUS',
  SPATIAL_AUDIO_TOGGLE: 'SPATIAL_AUDIO_TOGGLE',
  SPATIAL_HEATMAP_TOGGLE: 'SPATIAL_HEATMAP_TOGGLE',
  // Module 4: Operational Layer
  DPE_DRAFT_VIEW: 'DPE_DRAFT_VIEW',
  DPE_PROPOSAL_APPROVE: 'DPE_PROPOSAL_APPROVE',
  DPE_PROPOSAL_REJECT: 'DPE_PROPOSAL_REJECT',
  DPE_EXECUTE: 'DPE_EXECUTE',
  DPE_MULTISIG_SIGN: 'DPE_MULTISIG_SIGN',
  FORENSIC_VERIFY: 'FORENSIC_VERIFY',
  FORENSIC_EXPORT: 'FORENSIC_EXPORT',
});
