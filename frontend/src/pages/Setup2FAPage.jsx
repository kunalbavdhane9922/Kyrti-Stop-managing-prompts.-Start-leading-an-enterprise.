import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, Copy, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { authApi } from '../services/authApi.js';
import { Button } from '../components/common/Button.jsx';
import { CopyToClipboard } from '../components/common/CopyToClipboard.jsx';
import { LuxuryFluidBackground } from '../components/spatial/LuxuryFluidBackground.jsx';
import { useAuthStore } from '../store/authStore.js';

export function Setup2FAPage() {
  const navigate = useNavigate();
  const complete2FASetup = useAuthStore(s => s.complete2FASetup);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [code, setCode] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [success, setSuccess] = useState(false);
  
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    async function init() {
      try {
        const response = await authApi.setup2FA();
        const payload = response.data || response; // unwrap { success, data: { ... } }
        setSecret(payload.secret);
        // Generate QR Code locally — nothing leaves the browser
        const url = await QRCode.toDataURL(payload.totpUri);
        setQrCodeUrl(url);
      } catch (err) {
        setError(err.message || 'Failed to initialize 2FA setup');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) return;
    setConfirming(true);
    setError(null);
    try {
      const response = await authApi.confirm2FA({ code });
      const payload = response.data || response;
      setRecoveryCodes(payload.recoveryCodes || []);
      setSuccess(true);
      complete2FASetup(); // Update global auth state to allow bypass of TierGate guard
    } catch (err) {
      setError(err.message || 'Invalid code. Try again.');
    } finally {
      setConfirming(false);
    }
  };

  const handleFinish = () => {
    navigate('/'); // go to dashboard
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-accent-blue)" />
      </div>
    );
  }

  return (
    <div className="login-page">
      <LuxuryFluidBackground />
      <div className="login-container">
        <motion.div 
          className="login-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '600px', width: '100%' }}
        >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-4)' }}>
          <div className="auth-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--color-accent-blue)', padding: 'var(--space-4)', borderRadius: '50%' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)' }}>Secure Your Account</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {success ? '2FA Enabled Successfully' : 'Set up Two-Factor Authentication (TOTP)'}
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {!success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', background: 'var(--color-bg-tertiary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="TOTP QR Code" style={{ width: '200px', height: '200px', background: 'white', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }} />
              ) : (
                <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-md)' }}>
                  <Loader2 className="animate-spin" />
                </div>
              )}
              
              <div style={{ width: '100%', textAlign: 'center' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Or enter this code manually:</p>
                <code style={{ background: 'var(--color-bg-hover)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-primary)', letterSpacing: '2px', userSelect: 'all' }}>
                  {secret}
                </code>
              </div>
            </div>

            <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px', lineHeight: 1.5 }}>
                1. Scan the QR code above with your authenticator app.<br/>
                2. Enter the 6-digit code it generates below to confirm setup.
              </p>
              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--color-accent-blue)' }}>Enter Code to Complete Setup</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    style={{ textAlign: 'center', letterSpacing: '4px', fontSize: 'var(--text-xl)' }}
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" loading={confirming} disabled={code.length !== 6}>
                Verify & Enable 2FA
              </Button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-accent-emerald)', padding: 'var(--space-4)', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={24} />
              <span>Two-Factor Authentication is now active.</span>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Recovery Codes</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Save these codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', background: 'var(--color-bg-tertiary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                {recoveryCodes.map((rc, i) => (
                  <code key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', background: 'var(--color-bg-hover)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', textAlign: 'center', letterSpacing: '1px' }}>
                    {rc}
                  </code>
                ))}
              </div>
            </div>

            <Button variant="primary" onClick={handleFinish} icon={ArrowRight}>
              Continue to Dashboard
            </Button>
          </div>
        )}
        </motion.div>
      </div>
    </div>
  );
}
