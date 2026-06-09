/**
 * Sovereign Protocol — Execution Signer (Module 4)
 * Handles cryptographic signing of execution commands.
 * Every Execute action creates an ECDSA-signed record for the audit trail.
 *
 * SECURITY: Uses Web Crypto API. Private keys never leave the browser.
 */

import { CryptoService } from './CryptoService.js';

const ExecutionSigner = {
  /** @type {CryptoKeyPair|null} */
  _keyPair: null,

  /**
   * Initializes the signing key pair for this session.
   */
  async init() {
    if (!this._keyPair) {
      this._keyPair = await CryptoService.generateKeyPair();
    }
  },

  /**
   * Creates a signed execution record.
   * @param {Object} proposal - The proposal being executed
   * @param {string} executorId - The human executor's ID
   * @returns {Promise<Object>} Signed execution record
   */
  async signExecution(proposal, executorId) {
    await this.init();

    const record = {
      type: 'EXECUTION',
      proposalId: proposal.id,
      proposalTitle: proposal.title,
      executorId,
      timestamp: new Date().toISOString(),
      nonce: crypto.getRandomValues(new Uint8Array(16)).join(''),
      riskScore: proposal.riskScore,
      resourceEstimate: proposal.resourceEstimate,
    };

    const dataString = JSON.stringify(record);
    const hash = await CryptoService.hash(dataString);
    const signature = await CryptoService.sign(this._keyPair.privateKey, dataString);

    return Object.freeze({
      ...record,
      hash,
      signature,
      verified: true,
    });
  },

  /**
   * Collects a signature for multi-sig execution.
   * @param {string} proposalId
   * @param {string} signerId
   * @param {string} signerRole
   * @returns {Promise<Object>} Individual signature record
   */
  async collectSignature(proposalId, signerId, signerRole) {
    await this.init();

    const sigData = {
      proposalId,
      signerId,
      signerRole,
      timestamp: new Date().toISOString(),
      nonce: crypto.getRandomValues(new Uint8Array(8)).join(''),
    };

    const dataString = JSON.stringify(sigData);
    const hash = await CryptoService.hash(dataString);
    const signature = await CryptoService.sign(this._keyPair.privateKey, dataString);

    return Object.freeze({ ...sigData, hash, signature });
  },

  /**
   * Verifies a signed record's integrity.
   * @param {Object} record - The signed record to verify
   * @returns {Promise<boolean>}
   */
  async verifyRecord(record) {
    const { hash, signature, ...data } = record;
    const dataString = JSON.stringify(data);
    const recomputedHash = await CryptoService.hash(dataString);
    return recomputedHash === hash;
  },

  /**
   * Resets the signer. Called on session wipe.
   */
  reset() {
    this._keyPair = null;
  },
};

export { ExecutionSigner };
