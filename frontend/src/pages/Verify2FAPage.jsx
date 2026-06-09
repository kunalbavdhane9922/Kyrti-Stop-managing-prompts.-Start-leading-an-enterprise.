import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button.jsx';
import { authApi } from '../services/authApi.js';
import { CryptoService } from '../security/CryptoService.js';
import { LuxuryFluidBackground } from '../components/spatial/LuxuryFluidBackground.jsx';

function Verify2FAPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const partialToken = location.state?.partialToken;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [twoFaCode, setTwoFaCode] = useState(['', '', '', '', '', '']);
  const [trustDevice, setTrustDevice] = useState(false);

  if (!partialToken) {
    navigate('/login');
    return null;
  }

  const handle2FAInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...twoFaCode];
    newCode[index] = value.slice(-1);
    setTwoFaCode(newCode);

    if (value && index < 5) {
      const next = document.getElementById(`2fa-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handle2FAKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !twoFaCode[index] && index > 0) {
      const prev = document.getElementById(`2fa-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerify = async () => {
    const codeStr = twoFaCode.join('');
    if (codeStr.length < 6) return;
    
    setLoading(true); setError(null);
    try {
      const fingerprint = await CryptoService.generateSessionFingerprint();
      const result = await authApi.verify2FA({ partialToken, code: codeStr, trustDevice, fingerprint });
      
      if (result.data.requiresTenantSelection) {
        navigate('/select-tenant', { state: { tenantSelectionToken: result.data.tenantSelectionToken, availableTenants: result.data.availableTenants } });
      }
    } catch (err) {
      setError(err.message || 'Verification failed.');
      setTwoFaCode(['', '', '', '', '', '']);
      document.getElementById('2fa-0')?.focus();
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
            <div className="login-logo"><Shield size={24} color="#FFF" /></div>
            <h1 className="login-title">Security Check</h1>
          </div>

          <div className="login-form login-card-bubble">
            {error && <div className="input-error-text">{error}</div>}
            <div className="login-security-note">
              <Lock size={16} style={{color: 'var(--color-accent-amber)'}} />
              <span>Enter the 6-digit code from your authenticator app.</span>
            </div>
            <div className="login-2fa">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <input
                  key={i} id={`2fa-${i}`} className="login-2fa-input"
                  type="text" maxLength={1} value={twoFaCode[i]}
                  onChange={e => handle2FAInput(i, e.target.value)}
                  onKeyDown={e => handle2FAKeyDown(i, e)}
                  disabled={loading}
                />
              ))}
            </div>
            
            <div style={{ marginBottom: '24px' }}></div>

            <Button variant="primary" loading={loading} fullWidth onClick={handleVerify}>Verify Code</Button>
            <Button variant="ghost" onClick={() => navigate('/login')} fullWidth>Cancel</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export { Verify2FAPage };
