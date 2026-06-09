/**
 * Sovereign Protocol — Identity Store
 * Manages the Multi-Layer Identity Matrix state (Layers A through D).
 * Tracks verification progress across all four identity layers.
 */

import { create } from 'zustand';
import { calculateCurrentTier } from '../config/tiers.js';

const useIdentityStore = create((set, get) => ({
  // --- Layer A: Human ID ---
  layerA: {
    status: 'pending', // 'pending' | 'in_progress' | 'verified' | 'failed'
    provider: null,
    verifiedAt: null,
  },

  // --- Layer B: Business ID (KYB) ---
  layerB: {
    status: 'locked',
    documents: [],
    businessName: null,
    registrationNumber: null,
    verificationRequestId: null,
    govApiStatus: null, // 'pending' | 'verifying' | 'verified' | 'rejected'
    verifiedAt: null,
  },

  // --- Layer C: Authority Verification ---
  layerC: {
    dnsStatus: 'locked', // 'locked' | 'pending' | 'verified' | 'failed'
    dnsTxtRecord: null,
    emailStatus: 'locked',
    emailDomain: null,
    multiSigStatus: 'locked',
    multiSigThreshold: { required: 0, total: 0 },
    multiSigSignatures: [],
    verifiedAt: null,
  },

  // --- Layer D: Cryptographic ID ---
  layerD: {
    status: 'locked',
    walletAddress: null,
    walletProvider: null,
    bindingSignature: null,
    boundAt: null,
  },

  // --- Computed ---
  activeStep: 0, // 0=A, 1=B, 2=C, 3=D
  completedLayers: [],

  // --- Actions ---

  /**
   * Completes Layer A (Human ID verification).
   */
  completeLayerA: (provider) => set(state => {
    const completedLayers = [...state.completedLayers, 'A'];
    return {
      layerA: {
        status: 'verified',
        provider,
        verifiedAt: new Date().toISOString(),
      },
      activeStep: 1,
      completedLayers,
    };
  }),

  /**
   * Adds a document to Layer B upload queue.
   */
  addDocument: (doc) => set(state => ({
    layerB: {
      ...state.layerB,
      documents: [...state.layerB.documents, Object.freeze({
        id: crypto.randomUUID(),
        name: doc.name,
        type: doc.type,
        size: doc.size,
        encryptedBlobRef: doc.encryptedBlobRef || null,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded',
      })],
    },
  })),

  /**
   * Updates Layer B business information and status.
   */
  updateLayerB: (updates) => set(state => ({
    layerB: { ...state.layerB, ...updates },
  })),

  /**
   * Completes Layer B (Business ID verification).
   */
  completeLayerB: (businessData) => set(state => {
    const completedLayers = [...state.completedLayers, 'B'];
    return {
      layerB: {
        ...state.layerB,
        status: 'verified',
        businessName: businessData.name,
        registrationNumber: businessData.registrationNumber,
        govApiStatus: 'verified',
        verifiedAt: new Date().toISOString(),
      },
      activeStep: 2,
      completedLayers,
    };
  }),

  /**
   * Updates Layer C DNS verification status.
   */
  updateDnsStatus: (status, txtRecord) => set(state => {
    const completedLayers = status === 'verified' && !state.completedLayers.includes('C_DNS')
      ? [...state.completedLayers, 'C_DNS']
      : state.completedLayers;
    return {
      layerC: { ...state.layerC, dnsStatus: status, dnsTxtRecord: txtRecord },
      completedLayers,
    };
  }),

  /**
   * Updates Layer C email verification status.
   */
  updateEmailStatus: (status, domain) => set(state => {
    const completedLayers = status === 'verified' && !state.completedLayers.includes('C_EMAIL')
      ? [...state.completedLayers, 'C_EMAIL']
      : state.completedLayers;
    return {
      layerC: { ...state.layerC, emailStatus: status, emailDomain: domain },
      completedLayers,
    };
  }),

  /**
   * Updates Layer C multi-sig status with new signature.
   */
  addMultiSigSignature: (signature) => set(state => {
    const newSignatures = [...state.layerC.multiSigSignatures, Object.freeze(signature)];
    const threshold = state.layerC.multiSigThreshold;
    const isComplete = newSignatures.length >= threshold.required;
    const completedLayers = isComplete && !state.completedLayers.includes('C_MULTISIG')
      ? [...state.completedLayers, 'C_MULTISIG']
      : state.completedLayers;
    return {
      layerC: {
        ...state.layerC,
        multiSigSignatures: newSignatures,
        multiSigStatus: isComplete ? 'verified' : 'pending',
        verifiedAt: isComplete ? new Date().toISOString() : null,
      },
      completedLayers,
    };
  }),

  /**
   * Sets the multi-sig threshold for enterprise governance.
   */
  setMultiSigThreshold: (required, total) => set(state => ({
    layerC: {
      ...state.layerC,
      multiSigThreshold: { required, total },
      multiSigStatus: 'pending',
    },
  })),

  /**
   * Completes Layer C (Authority Verification).
   */
  completeLayerC: () => set(state => ({
    layerC: { ...state.layerC, verifiedAt: new Date().toISOString() },
    activeStep: 3,
  })),

  /**
   * Binds a wallet to the business identity (Layer D).
   */
  bindWallet: (walletData) => set(state => {
    const completedLayers = [...state.completedLayers, 'D'];
    return {
      layerD: {
        status: 'verified',
        walletAddress: walletData.address,
        walletProvider: walletData.provider,
        bindingSignature: walletData.signature,
        boundAt: new Date().toISOString(),
      },
      completedLayers,
    };
  }),

  /**
   * Returns the current tier based on completed layers.
   */
  getCurrentTier: () => calculateCurrentTier(get().completedLayers),

  /**
   * Checks if a specific layer is completed.
   */
  isLayerComplete: (layer) => get().completedLayers.includes(layer),

  /**
   * Resets all identity state. Called on session wipe.
   */
  reset: () => set({
    layerA: { status: 'pending', provider: null, verifiedAt: null },
    layerB: { status: 'locked', documents: [], businessName: null, registrationNumber: null, verificationRequestId: null, govApiStatus: null, verifiedAt: null },
    layerC: { dnsStatus: 'locked', dnsTxtRecord: null, emailStatus: 'locked', emailDomain: null, multiSigStatus: 'locked', multiSigThreshold: { required: 0, total: 0 }, multiSigSignatures: [], verifiedAt: null },
    layerD: { status: 'locked', walletAddress: null, walletProvider: null, bindingSignature: null, boundAt: null },
    activeStep: 0,
    completedLayers: [],
  }),
}));

export { useIdentityStore };
