/**
 * Sovereign Protocol — Cryptographic Service
 * Uses the Web Crypto API for client-side hashing, signing, and encryption.
 * All data leaving the browser is hashed and signed for immutable accountability.
 */

import { HASH_ALGORITHM } from '../config/constants.js';

const CryptoService = {
  /**
   * Generates a SHA-256 hash of the provided data.
   * Used for creating integrity checksums on all outbound data.
   * 
   * @param {string} data - The data to hash
   * @returns {Promise<string>} The hex-encoded hash
   */
  async hash(data) {
    let buffer;
    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      buffer = encoder.encode(data);
    } else {
      buffer = data;
    }
    const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  /**
   * Generates a cryptographic key pair for signing operations.
   * The private key never leaves the browser session.
   * 
   * @returns {Promise<CryptoKeyPair>} The generated key pair
   */
  async generateKeyPair() {
    return await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      false, // non-extractable for security
      ['sign', 'verify']
    );
  },

  /**
   * Signs data using the session's private key.
   * Creates a cryptographic proof that the data originated from this session.
   * 
   * @param {CryptoKey} privateKey - The session's private key
   * @param {string} data - The data to sign
   * @returns {Promise<string>} The base64-encoded signature
   */
  async sign(privateKey, data) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const signature = await crypto.subtle.sign(
      { name: 'ECDSA', hash: HASH_ALGORITHM },
      privateKey,
      buffer
    );
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  },

  /**
   * Verifies a signature against data using the public key.
   * 
   * @param {CryptoKey} publicKey - The public key to verify against
   * @param {string} signatureBase64 - The base64-encoded signature
   * @param {string} data - The original data
   * @returns {Promise<boolean>} Whether the signature is valid
   */
  async verify(publicKey, signatureBase64, data) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const signatureBytes = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
    return await crypto.subtle.verify(
      { name: 'ECDSA', hash: HASH_ALGORITHM },
      publicKey,
      signatureBytes,
      buffer
    );
  },

  /**
   * Encrypts a file using AES-GCM with a randomly generated key.
   * Used for client-side encryption of KYB documents before upload.
   * The frontend only sees encrypted blobs after this operation.
   * 
   * @param {ArrayBuffer} fileData - The raw file data
   * @returns {Promise<{encrypted: ArrayBuffer, key: CryptoKey, iv: Uint8Array}>}
   */
  async encryptFile(fileData) {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      fileData
    );
    return { encrypted, key, iv };
  },

  /**
   * Generates a unique session fingerprint.
   * Combines timestamp and random bytes for session identification.
   * 
   * @returns {Promise<string>} The session fingerprint hash
   */
  async generateSessionFingerprint() {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const combined = timestamp + Array.from(randomBytes).join('');
    return await this.hash(combined);
  },

  /**
   * Creates a timestamped, signed action record for the audit log.
   * 
   * @param {CryptoKey} privateKey - The session's signing key
   * @param {Object} actionData - The action to record
   * @returns {Promise<Object>} The signed action record
   */
  async createSignedRecord(privateKey, actionData) {
    const record = {
      ...actionData,
      timestamp: new Date().toISOString(),
      nonce: crypto.getRandomValues(new Uint8Array(16)).join(''),
    };
    const dataString = JSON.stringify(record);
    const hash = await this.hash(dataString);
    const signature = await this.sign(privateKey, dataString);
    return { ...record, hash, signature };
  },

  /**
   * Generates a random UUID v4 for unique identifiers.
   * @returns {string} A UUID v4 string
   */
  generateId() {
    return crypto.randomUUID();
  },
};

export { CryptoService };
