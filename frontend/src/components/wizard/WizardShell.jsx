import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ArrowRight, ArrowLeft, Rocket, Check, AlertCircle, SkipForward, AlertTriangle } from 'lucide-react';
import { CryptoService } from '../../security/CryptoService.js';
import { useAuthStore } from '../../store/authStore.js';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';

/* ─── Wizard Context ─── */
const WizardContext = createContext(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside WizardShell');
  return ctx;
}

/* ─── Phase definitions ─── */
export const PHASE_DEFS = [
  { id: 1, title: 'Company Registration', subtitle: 'Basic legal & identity details' },
  { id: 2, title: 'Board of Directors', subtitle: 'Governance structure' },
  { id: 3, title: 'Executive Leadership', subtitle: 'C-Suite & custom executives' },
  { id: 4, title: 'Department Builder', subtitle: 'Select & create departments' },
  { id: 5, title: 'Dept. Hierarchy', subtitle: 'Teams & headcount' },
  { id: 6, title: 'Role Assignment', subtitle: 'Human / AI / Vacant' },
  { id: 7, title: 'Permission Matrix', subtitle: 'Access controls' },
  { id: 8, title: 'Org Chart Preview', subtitle: 'Visual structure' },
  { id: 9, title: 'Human Invitations', subtitle: 'Invite team members' },
  { id: 10, title: 'AI Recruitment', subtitle: 'Optional — configure later' },
];

const TOTAL = PHASE_DEFS.length;

/* ─── Animations ─── */
const pageVariants = {
  enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0, filter: 'blur(4px)' }),
  center: { x: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0, filter: 'blur(4px)', transition: { duration: 0.2 } }),
};

/* ─── Main Shell ─── */
export function WizardShell({ children, onSubmit, loading }) {
  const [phase, setPhase] = useState(1);
  const [highestPhase, setHighestPhase] = useState(1);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState(null);
  const [launchAlert, setLaunchAlert] = useState(null);
  const stepsRef = useRef(null);

  // All wizard data lives here
  const [wizardData, setWizardData] = useState({
    // Phase 1 — Company Registration
    company: {
      name: '', domain: '', legalName: '', industry: '', companyType: 'Private Limited',
      registrationNumber: '', taxNumber: '', hqCountry: '', hqState: '', hqCity: '', hqAddress: '',
      employeeCount: '', revenueRange: '', growthStage: 'Startup',
    },
    // Phase 2 — Board of Directors
    boardMembers: [],
    // Phase 3 — Executive Leadership
    executives: [],
    // Phase 4 — Departments
    departments: [],
    // Phase 5 — Department Hierarchy (teams & positions per department)
    hierarchy: {},
    // Phase 6 — Role Assignments (merged into nodes)
    // Phase 7 — Permissions
    permissions: [],
    // Phase 9 — Invitations
    invitations: [],
  });

  const user = useAuthStore(state => state.user);

  const draftLoadedForUser = useRef(null);
  const [isReadyToSave, setIsReadyToSave] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const activeUserId = user?.id || 'anonymous';
    if (draftLoadedForUser.current === activeUserId) return;

    async function loadDraft() {
      const stored = localStorage.getItem('sovereign_wizard_draft');
      if (stored) {
        try {
          const decrypted = await CryptoService.decryptData(JSON.parse(stored), activeUserId);
          if (decrypted && decrypted.company) {
            setWizardData(decrypted);
          }
        } catch (e) {
          console.warn('Could not restore wizard draft', e);
        }
      }
      draftLoadedForUser.current = activeUserId;
      setIsReadyToSave(true);
    }
    loadDraft();
  }, [user?.id]);

  // Auto-save draft
  useEffect(() => {
    if (!isReadyToSave) return;
    const activeUserId = user?.id || 'anonymous';
    
    async function saveDraft() {
      try {
        const encrypted = await CryptoService.encryptData(wizardData, activeUserId);
        localStorage.setItem('sovereign_wizard_draft', JSON.stringify(encrypted));
      } catch (e) {
        console.warn('Failed to auto-save draft', e);
      }
    }
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [wizardData, user?.id, isReadyToSave]);

  // Validation registry — each phase component registers its validator
  const validatorsRef = useRef({});

  const registerValidator = useCallback((phaseId, fn) => {
    validatorsRef.current[phaseId] = fn;
  }, []);

  const updateData = useCallback((key, value) => {
    setWizardData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateCompanyField = useCallback((field, value) => {
    setWizardData(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value },
    }));
  }, []);



  const goNext = useCallback(() => {
    setError(null);
    const validator = validatorsRef.current[phase];
    if (validator) {
      const err = validator();
      if (err) { setError(err); return; }
    }
    
    setDirection(1);
    setPhase(p => Math.min(p + 1, TOTAL));
    setHighestPhase(prev => Math.max(prev, phase + 1));
  }, [phase]);

  const goPrev = useCallback(() => {
    setError(null);
    setDirection(-1);
    setPhase(p => Math.max(p - 1, 1));
  }, []);

  const goToPhase = useCallback((p) => {
    setError(null);
    setDirection(p > phase ? 1 : -1);
    setPhase(p);
  }, [phase]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    // Validate all phases before allowing launch
    for (let i = 1; i <= TOTAL; i++) {
      const validator = validatorsRef.current[i];
      if (validator) {
        const err = validator();
        if (err) {
          setError(`Phase ${i}: ${err}`);
          setLaunchAlert({ phase: i, message: err });
          setDirection(i > phase ? 1 : -1);
          setPhase(i);
          return;
        }
      }
    }


    if (onSubmit) {
      // Clear draft on submit
      localStorage.removeItem('sovereign_wizard_draft');
      try {
        await onSubmit(wizardData, setPhase);
      } catch (err) {
        setError(err.message || 'An error occurred during submission.');
        setLaunchAlert({ phase: 'Submission', message: err.message || 'Network error.' });
      }
    }
  }, [onSubmit, wizardData, phase]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (phase === TOTAL) {
        handleSubmit();
      } else {
        goNext();
      }
    }
  }, [phase, goNext, handleSubmit]);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const handleNativeWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleNativeWheel);
  }, []);

  const progressPercent = ((highestPhase - 1) / (TOTAL - 1)) * 100;
  const currentDef = PHASE_DEFS.find(p => p.id === phase);

  const ctx = {
    phase, direction, wizardData, error,
    updateData, updateCompanyField, registerValidator,
    goNext, goPrev, goToPhase,
    setError, handleKeyDown,
  };

  // Render the correct child phase
  const phaseChildren = React.Children.toArray(children);
  const activeChild = phaseChildren[phase - 1] || null;

  return (
    <WizardContext.Provider value={ctx}>
      <div className="wizard-page" onKeyDown={handleKeyDown}>
        <div className="wizard-container">
          <div className="wizard-card">
            {/* Header */}
            <div className="wizard-header">
              <div className="wizard-header-left">
                <img src="/main_logo.png" alt="Kyrti" style={{ width: '40px', height: '40px', objectFit: 'contain', marginRight: '8px' }} />
                <div>
                  <h1 className="wizard-title">Enterprise Initialization</h1>
                  <p className="wizard-subtitle">{currentDef?.subtitle}</p>
                </div>
              </div>
              <div className="wizard-phase-badge">
                {phase} / {TOTAL}
              </div>
            </div>

            {/* Progress */}
            <div className="wizard-progress-track">
              <motion.div
                className="wizard-progress-fill"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Step dots */}
            <div className="wizard-steps" ref={stepsRef}>
              {PHASE_DEFS.map((p) => (
                <div
                  key={p.id}
                  className={`wizard-step ${phase === p.id ? 'wizard-step--active' : ''}`}
                  onClick={() => goToPhase(p.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="wizard-step-dot">
                    {p.id}
                  </div>
                  <span className="wizard-step-label">{p.title}</span>
                </div>
              ))}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="wizard-error-banner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase Content */}
            <div className="wizard-body">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={phase}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="wizard-phase-wrapper"
                >
                  {activeChild}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="wizard-footer">
              <button
                className="wizard-btn wizard-btn--secondary"
                onClick={goPrev}
                disabled={phase === 1}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="wizard-footer-right">
                {/* Phase 10 (AI Recruitment) now only has the main Launch button, making the fields optional inside the phase itself */}

                {phase < TOTAL ? (
                  <button className="wizard-btn wizard-btn--primary" onClick={goNext}>
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    className="wizard-btn wizard-btn--launch"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="wizard-spinner" />
                        Launching...
                      </>
                    ) : (
                      <>
                        <Rocket size={16} /> Launch Enterprise
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Launch Validation Alert Modal */}
      <Modal 
        isOpen={!!launchAlert} 
        onClose={() => setLaunchAlert(null)}
        title="Enterprise Launch Blocked"
        maxWidth={480}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="primary" onClick={() => setLaunchAlert(null)}>Acknowledge</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--error)' }}>
            <AlertTriangle size={24} />
            <span style={{ fontWeight: 600 }}>Validation Error Detected</span>
          </div>
          <p>The system cannot compile the organizational payload because mandatory information is missing.</p>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <strong>Phase {launchAlert?.phase}:</strong> {launchAlert?.message}
          </div>
          <p style={{ fontSize: '14px' }}>You have been navigated to the phase where the error occurred. Please complete the missing requirements to proceed with the launch.</p>
        </div>
      </Modal>
    </WizardContext.Provider>
  );
}
