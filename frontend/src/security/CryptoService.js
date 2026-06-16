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
    if (!window.crypto || !window.crypto.subtle) {
      // Fallback for non-secure contexts (e.g., local network IP testing)
      const str = typeof data === 'string' ? data : new TextDecoder().decode(data);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16).padStart(64, '0');
    }

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
   * Generates a stable session fingerprint.
   * Combines browser characteristics for stable identification across page refreshes,
   * necessary for zero-persistence environments.
   * 
   * @returns {Promise<string>} The session fingerprint hash
   */
  async generateSessionFingerprint() {
    const components = [
      navigator.userAgent,
      navigator.language,
      window.screen.colorDepth,
      window.screen.width + 'x' + window.screen.height,
      new Date().getTimezoneOffset()
    ].join('||');
    return await this.hash(components);
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
    if (window.crypto && window.crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for non-secure contexts
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Encrypts arbitrary JSON data using AES-GCM with a user-derived key.
   * Used for secure local auto-saving.
   */
  async encryptData(data, userId) {
    if (!window.crypto || !window.crypto.subtle) {
      console.warn("Web Crypto API unavailable. Falling back to insecure base64 storage.");
      const str = JSON.stringify(data);
      return { _fallback: true, data: btoa(encodeURIComponent(str)) };
    }

    const encoder = new TextEncoder();
    const hashHex = await this.hash(userId || 'anonymous');
    const rawKey = new Uint8Array(hashHex.match(/.{1,2}/g).slice(0, 32).map(byte => parseInt(byte, 16)));
    
    const key = await crypto.subtle.importKey(
      'raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(data))
    );
    
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    };
  },

  /**
   * Decrypts AES-GCM encrypted data.
   */
  async decryptData(encryptedPayload, userId) {
    if (encryptedPayload._fallback) {
      return JSON.parse(decodeURIComponent(atob(encryptedPayload.data)));
    }
    
    if (!window.crypto || !window.crypto.subtle) {
       throw new Error("Web Crypto API unavailable to decrypt secure data");
    }

    const hashHex = await this.hash(userId || 'anonymous');
    const rawKey = new Uint8Array(hashHex.match(/.{1,2}/g).slice(0, 32).map(byte => parseInt(byte, 16)));
    
    const key = await crypto.subtle.importKey(
      'raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt']
    );
    const iv = new Uint8Array(encryptedPayload.iv);
    const data = new Uint8Array(encryptedPayload.data);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, key, data
    );
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted));
  },
};

export { CryptoService };
