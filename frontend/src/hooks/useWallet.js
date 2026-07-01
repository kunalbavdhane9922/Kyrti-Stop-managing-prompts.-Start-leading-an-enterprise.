/**
 * Sovereign Protocol — useWallet Hook
 * Manages Web3 wallet connections for Layer D (Cryptographic ID).
 * Wallets are authorized by Layer C, NOT the other way around.
 */

import { useState, useCallback } from 'react';
import { useIdentityStore } from '../store/identityStore.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../config/constants.js';

export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const bindWallet = useIdentityStore(s => s.bindWallet);
  const layerD = useIdentityStore(s => s.layerD);

  /**
   * Connects to MetaMask and requests account access.
   * Does NOT bind the wallet — binding requires Layer C authorization.
   */
  const connectWallet = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      if (!window.ethereum) {
        throw new Error('No Web3 wallet detected. Please install MetaMask.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet.');
      }

      AuditLogger.log({
        action: AUDIT_ACTIONS.WALLET_CONNECT,
        details: { address: accounts[0], provider: 'MetaMask' },
      });

      setIsConnecting(false);
      return { address: accounts[0], provider: 'MetaMask' };
    } catch (err) {
      const message = err.code === 4001
        ? 'Wallet connection rejected by user.'
        : err.message || 'Failed to connect wallet.';
      setError(message);
      setIsConnecting(false);
      return null;
    }
  }, []);

  /**
   * Signs a binding message to prove wallet ownership.
   * This cryptographically links the wallet to the Business ID.
   * 
   * @param {string} address - The wallet address
   * @param {string} businessId - The verified Business ID
   */
  const signBindingMessage = useCallback(async (address, businessId) => {
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('No Web3 wallet detected.');
      }

      const message = JSON.stringify({
        action: 'BIND_WALLET_TO_BUSINESS',
        walletAddress: address,
        businessId: businessId,
        platform: 'Kyrti',
        timestamp: new Date().toISOString(),
        nonce: crypto.randomUUID(),
      });

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Bind the wallet in the identity store
      bindWallet({
        address,
        provider: 'MetaMask',
        signature,
      });

      AuditLogger.log({
        action: AUDIT_ACTIONS.WALLET_BIND,
        details: { address, businessId },
      });

      return { address, signature, message };
    } catch (err) {
      const message = err.code === 4001
        ? 'Signing rejected by user.'
        : err.message || 'Failed to sign binding message.';
      setError(message);
      return null;
    }
  }, [bindWallet]);

  /**
   * Gets the current chain ID from the connected wallet.
   */
  const getChainId = useCallback(async () => {
    if (!window.ethereum) return null;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    } catch {
      return null;
    }
  }, []);

  return {
    connectWallet,
    signBindingMessage,
    getChainId,
    isConnecting,
    error,
    isConnected: layerD.status === 'verified',
    walletAddress: layerD.walletAddress,
  };
}
