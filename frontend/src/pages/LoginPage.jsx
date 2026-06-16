import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, KeyRound, ArrowRight, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/common/Button.jsx';
import { useAuthStore } from '../store/authStore.js';
import { useIdentityStore } from '../store/identityStore.js';
import { CryptoService } from '../security/CryptoService.js';
import { authApi } from '../services/authApi.js';
import { LuxuryFluidBackground } from '../components/spatial/LuxuryFluidBackground.jsx';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1, duration: 0.4 } } };
const itemVariants = { hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' }, visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };
const formTransition = { initial: { opacity: 0, y: 12, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }, exit: { opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.3 } } };

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const emailRef = useRef(null);
  const nameRef = useRef(null);

  // Auto-focus the first input when mode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'login' && emailRef.current) emailRef.current.focus();
      if (mode === 'register' && nameRef.current) nameRef.current.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [mode]);

  const login = useAuthStore(s => s.login);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const fingerprint = await CryptoService.generateSessionFingerprint();
      const result = await authApi.login({ email: email.trim(), password, fingerprint });

      if (result.data.requires2FA) {
        sessionStorage.setItem('sovereign_partial_token', result.data.partialToken);
        navigate('/verify-2fa', { state: { partialToken: result.data.partialToken } });
      } else if (result.data.requiresTenantSelection) {
        const availableTenants = result.data.availableTenants || [];
        const tenantId = availableTenants.length > 0 ? availableTenants[0].id : null;
        const selResult = await authApi.selectTenant({ 
          tenantSelectionToken: result.data.tenantSelectionToken, 
          tenantId, 
          fingerprint 
        });
        
        login({
          ...selResult.data.user,
          sessionFingerprint: fingerprint,
          provider: 'email',
          twoFactorVerified: true,
          tenantId
        });
        useIdentityStore.getState().completeLayerA('email');
        
        if (!tenantId) {
          navigate('/create-workspace');
        } else if (!selResult.data.user.twoFactorEnabled) {
          navigate('/setup-2fa');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate, login]);

  const calculatePasswordStrength = (pass) => {
    let score = 0; const requirements = [];
    if (pass.length >= 8) score += 1; else requirements.push("8+ characters");
    if (/[A-Z]/.test(pass)) score += 1; else requirements.push("1 uppercase letter");
    if (/[a-z]/.test(pass)) score += 1; else requirements.push("1 lowercase letter");
    if (/[0-9]/.test(pass)) score += 1; else requirements.push("1 number");
    if (/[^A-Za-z0-9]/.test(pass)) score += 1; else requirements.push("1 special symbol");
    return { score, requirements };
  };

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccessMsg(null);
    const emailTrimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(emailTrimmed)) { setError("Valid email required."); setLoading(false); return; }
    const { score, requirements } = calculatePasswordStrength(password);
    if (score < 5) { setError(`Too weak: ${requirements.join(', ')}`); setLoading(false); return; }

    try {
      await authApi.register({ email: emailTrimmed, password, name: name.trim() });
      setSuccessMsg('Account created successfully. Please log in.');
      setMode('login'); setPassword('');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally { setLoading(false); }
  }, [email, password, name]);

  return (
    <div className="login-page">
      <LuxuryFluidBackground />
      <div className="login-container">
        <motion.div className="login-content" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="login-header">
            <div className="login-logo"><Shield size={24} color="#FFF" /></div>
            <h1 className="login-title">Sovereign Protocol</h1>
            <p className="login-subtitle">Enterprise Authority Access</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.form key="login" variants={formTransition} initial="initial" animate="animate" exit="exit" className="login-form login-card-bubble" onSubmit={handleLogin}>
                {error && <div className="input-error-text">{error}</div>}
                {successMsg && <div style={{color: 'var(--color-accent-emerald)', fontSize: '12px'}}>{successMsg}</div>}
                <div className="login-input-group">
                  <label className="login-input-label"><Mail size={14} /> Email</label>
                  <input ref={emailRef} className="login-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
                </div>
                <div className="login-input-group">
                  <label className="login-input-label"><KeyRound size={14} /> Password</label>
                  <div style={{position: 'relative'}}>
                    <input className="login-input" type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)'}}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" variant="primary" loading={loading} iconRight={LogIn} fullWidth>Authenticate</Button>
                <div className="login-divider"><span>OR</span></div>
                <Button type="button" variant="ghost" onClick={() => setMode('register')} fullWidth>Create new account</Button>
              </motion.form>
            )}

            {mode === 'register' && (
              <motion.form key="register" variants={formTransition} initial="initial" animate="animate" exit="exit" className="login-form login-card-bubble" onSubmit={handleRegister}>
                {error && <div className="input-error-text">{error}</div>}
                <div className="login-input-group">
                  <label className="login-input-label"><UserPlus size={14} /> Full Name</label>
                  <input ref={nameRef} className="login-input" type="text" required value={name} onChange={e => setName(e.target.value)} disabled={loading} autoComplete="name" />
                </div>
                <div className="login-input-group">
                  <label className="login-input-label"><Mail size={14} /> Email</label>
                  <input className="login-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
                </div>
                <div className="login-input-group">
                  <label className="login-input-label"><KeyRound size={14} /> Password</label>
                  <input className="login-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
                  <div style={{ height: '28px', marginTop: '4px' }}>
                  {password.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '4px' }}>
                        {[1, 2, 3, 4, 5].map(level => {
                          const { score } = calculatePasswordStrength(password);
                          let color = 'var(--color-bg-tertiary)';
                          if (score >= level) {
                            if (score <= 2) color = 'var(--color-accent-rose)';
                            else if (score <= 4) color = 'var(--color-accent-amber)';
                            else color = 'var(--color-accent-emerald)';
                          }
                          return <div key={level} style={{ flex: 1, background: color, borderRadius: '2px', transition: 'background 0.3s' }} />;
                        })}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
                <Button type="submit" variant="primary" loading={loading} iconRight={ArrowRight} fullWidth>Register</Button>
                <Button type="button" variant="ghost" onClick={() => setMode('login')} fullWidth>Back to Login</Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export { LoginPage };
