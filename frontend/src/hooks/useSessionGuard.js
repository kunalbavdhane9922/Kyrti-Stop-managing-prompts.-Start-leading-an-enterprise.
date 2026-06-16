/**
 * Sovereign Protocol — useSessionGuard Hook
 * React hook that integrates the SessionGuard service with the auth store.
 * Automatically wipes all sensitive state on idle timeout or tab close.
 */

import { useEffect, useCallback } from 'react';
import { SessionGuard } from '../security/SessionGuard.js';
import { AuditLogger } from '../security/AuditLogger.js';
import { useAuthStore } from '../store/authStore.js';
import { useIdentityStore } from '../store/identityStore.js';
import { useTreasuryStore } from '../store/treasuryStore.js';
import { useGovernanceStore } from '../store/governanceStore.js';
import { AUDIT_ACTIONS } from '../config/constants.js';

export function useSessionGuard() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
  const setSessionWarning = useAuthStore(s => s.setSessionWarning);
  const recordActivity = useAuthStore(s => s.recordActivity);

  const resetIdentity = useIdentityStore(s => s.reset);
  const resetTreasury = useTreasuryStore(s => s.reset);
  const resetGovernance = useGovernanceStore(s => s.reset);

  /**
   * Wipes ALL sensitive state from all stores.
   * This is the nuclear option — called on timeout and tab close.
   */
  const wipeAllState = useCallback((reason) => {
    AuditLogger.log({
      action: AUDIT_ACTIONS.SESSION_EXPIRED,
      context: reason,
      severity: 'warning',
    });

    // Wipe all stores
    logout();
    resetIdentity();
    resetTreasury();
    resetGovernance();

    // Wipe audit logger last
    AuditLogger._resetForSessionWipe();
  }, [logout, resetIdentity, resetTreasury, resetGovernance]);

  useEffect(() => {
    if (!isAuthenticated) return;

    SessionGuard.start({
      onExpire: (reason) => {
        wipeAllState(reason);
      },
      onWarning: (remaining) => {
        setSessionWarning(true, remaining);
      },
      onActivity: () => {
        recordActivity();
        setSessionWarning(false, null);
      },
    });

    return () => {
      SessionGuard.stop();
    };
  }, [isAuthenticated, wipeAllState, setSessionWarning, recordActivity]);

  return {
    remainingTime: SessionGuard.getRemainingTime(),
    isWarning: SessionGuard.isInWarningState(),
    resetTimer: () => SessionGuard.resetTimer(),
  };
}
