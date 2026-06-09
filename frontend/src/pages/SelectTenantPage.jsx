import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button.jsx';
import { authApi } from '../services/authApi.js';
import { CryptoService } from '../security/CryptoService.js';
import { useAuthStore } from '../store/authStore.js';
import { useIdentityStore } from '../store/identityStore.js';
import { useOnboardingStore } from '../store/onboardingStore.js';
import { LuxuryFluidBackground } from '../components/spatial/LuxuryFluidBackground.jsx';

function SelectTenantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantSelectionToken = location.state?.tenantSelectionToken;
  const availableTenants = location.state?.availableTenants || [];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const login = useAuthStore(s => s.login);
  const completeLayerA = useIdentityStore(s => s.completeLayerA);
  const setCurrentTier = useOnboardingStore(s => s.setCurrentTier);

  if (!tenantSelectionToken) {
    navigate('/login');
    return null;
  }

  const handleSelectTenant = async (tenantId) => {
    setLoading(true); setError(null);
    try {
      const fingerprint = await CryptoService.generateSessionFingerprint();
      // Even if tenantId is null (default workspace), we proceed
      const result = await authApi.selectTenant({ tenantSelectionToken, tenantId, fingerprint });
      
      login({
        ...result.data.user,
        sessionFingerprint: fingerprint,
        provider: 'email',
        twoFactorVerified: true,
        tenantId
      });

      completeLayerA('email');
      setCurrentTier(0);
      
      // Redirect to setup 2FA if not enabled, otherwise dashboard
      if (!result.data.user.twoFactorEnabled) {
        navigate('/setup-2fa');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Tenant selection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <LuxuryFluidBackground />
      <div className="login-container">
        <motion.div className="login-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="login-header">
            <div className="login-logo"><Building2 size={24} color="#FFF" /></div>
            <h1 className="login-title">Select Workspace</h1>
            <p className="login-subtitle">Choose your active enterprise tenant</p>
          </div>

          <div className="login-form login-card-bubble">
            {error && <div className="input-error-text">{error}</div>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableTenants.map(t => (
                <Button key={t.id} variant="secondary" loading={loading} onClick={() => handleSelectTenant(t.id)} fullWidth>
                  {t.name}
                </Button>
              ))}
              
              {availableTenants.length === 0 && (
                <Button variant="primary" loading={loading} onClick={() => handleSelectTenant(null)} fullWidth>
                  Continue to Personal Workspace
                </Button>
              )}
            </div>
            
            <Button variant="ghost" onClick={() => navigate('/login')} fullWidth style={{ marginTop: '16px' }}>Cancel</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export { SelectTenantPage };
