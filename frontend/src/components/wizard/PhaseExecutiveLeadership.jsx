import React, { useEffect, useState } from 'react';
import { useWizard } from './WizardShell.jsx';
import { Crown, Plus, Trash2, User, Bot, ChevronDown, ChevronUp } from 'lucide-react';

const CSUITE_ROLES = [
  { key: 'CEO', label: 'CEO — Chief Executive Officer' },
  { key: 'COO', label: 'COO — Chief Operating Officer' },
  { key: 'CTO', label: 'CTO — Chief Technology Officer' },
  { key: 'CFO', label: 'CFO — Chief Financial Officer' },
  { key: 'CMO', label: 'CMO — Chief Marketing Officer' },
  { key: 'CPO', label: 'CPO — Chief Product Officer' },
  { key: 'CHRO', label: 'CHRO — Chief Human Resources Officer' },
  { key: 'CIO', label: 'CIO — Chief Information Officer' },
  { key: 'CSO', label: 'CSO — Chief Strategy Officer' },
  { key: 'CLO', label: 'CLO — Chief Legal Officer' },
];

function createExecutive(role = '', isCustom = false) {
  return {
    id: crypto.randomUUID(),
    role: role,
    customTitle: '',
    isCustom,
    occupantType: 'HUMAN',
    name: '',
    email: '',
    title: role,
    reportingTo: '',
  };
}

export function PhaseExecutiveLeadership() {
  const { wizardData, updateData, registerValidator } = useWizard();
  const executives = wizardData.executives;
  const boardMembers = wizardData.boardMembers;
  const [expanded, setExpanded] = useState({});

  // Track which C-Suite roles are selected
  const selectedRoles = executives.filter(e => !e.isCustom).map(e => e.role);

  useEffect(() => {
    registerValidator(3, () => {
      // ── Rule 1: At least one executive required ──
      if (executives.length === 0) return 'Add at least one executive position';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // ── Rule 2: Individual field validation ──
      for (let i = 0; i < executives.length; i++) {
        const ex = executives[i];
        const label = ex.isCustom ? (ex.customTitle || `Custom #${i + 1}`) : ex.role;
        if (!ex.isCustom && !ex.role) return `Executive ${i + 1}: Role is required`;
        if (ex.isCustom && !ex.customTitle.trim()) return `Custom Executive ${i + 1}: Title is required`;
        if (ex.occupantType === 'HUMAN') {
          if (!ex.name.trim()) return `${label}: Name is required`;
          if (!ex.email.trim()) return `${label}: Email is required`;
          if (!emailRegex.test(ex.email.trim())) return `${label}: Invalid email format`;
        }
      }

      // ── Rule 3: CEO must be HUMAN if the role exists ──
      const ceo = executives.find(e => !e.isCustom && e.role === 'CEO');
      if (ceo && ceo.occupantType !== 'HUMAN') {
        return 'The CEO must be a Human. This is the highest executive authority and cannot be delegated to AI.';
      }

      // ── Rule 4: At least one human executive (independent of board) ──
      const hasHumanExec = executives.some(e => e.occupantType === 'HUMAN');
      if (!hasHumanExec) {
        return 'At least one Executive must be a Human to retain enterprise control.';
      }

      // ── Rule 5: AI executives must report to someone (not self-governing) ──
      for (const ex of executives) {
        if (ex.occupantType === 'AI_VACANT' && ex.role !== 'CEO') {
          const effectiveReportingTo = (!ex.isCustom && ex.role !== 'CEO' && ceo) ? ceo.id : ex.reportingTo;
          
          if (!effectiveReportingTo) {
            const label = ex.isCustom ? ex.customTitle : ex.role;
            return `${label}: AI positions must have a reporting supervisor assigned.`;
          }
          // Verify reporting target is a HUMAN (not another AI exec)
          const reportTarget = executives.find(e => e.id === effectiveReportingTo);
          if (reportTarget && reportTarget.occupantType === 'AI_VACANT') {
            const label = ex.isCustom ? ex.customTitle : ex.role;
            const targetLabel = reportTarget.isCustom ? reportTarget.customTitle : reportTarget.role;
            return `${label}: AI cannot report to another AI (${targetLabel}). A Human must supervise AI positions.`;
          }
        }
      }

      // ── Rule 6: Production-grade hierarchy - All chiefs must report to CEO ──
      const otherChiefs = executives.filter(e => !e.isCustom && e.role !== 'CEO');
      if (otherChiefs.length > 0) {
        if (!ceo) {
          return 'A CEO is required to establish the executive hierarchy when other C-Suite officers are present.';
        }
      }

      return null;
    });
  }, [registerValidator, executives, boardMembers]);

  const toggleRole = (roleKey) => {
    if (selectedRoles.includes(roleKey)) {
      updateData('executives', executives.filter(e => e.role !== roleKey || e.isCustom));
    } else {
      updateData('executives', [...executives, createExecutive(roleKey)]);
    }
  };

  const addCustom = () => {
    updateData('executives', [...executives, createExecutive('', true)]);
  };

  const removeExec = (id) => {
    updateData('executives', executives.filter(e => e.id !== id));
  };

  const updateExec = (id, field, value) => {
    updateData('executives', executives.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Build reporting-to options from current board and executives
  const reportingOptions = [
    ...boardMembers.map(b => ({
      value: b.id,
      label: `Board: ${b.position}`,
      type: 'BOARD'
    })),
    ...executives.map(e => ({
      value: e.id,
      label: e.isCustom ? e.customTitle : e.role,
      type: 'EXEC'
    }))
  ];

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <Crown size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">Executive Leadership</h2>
          <p className="wiz-phase-desc">
            Select C-Suite positions and define who fills them. You can also add custom executive roles.
          </p>
        </div>
      </div>

      {/* C-Suite Checkboxes */}
      <div className="wiz-section">
        <h3 className="wiz-section-title">C-Suite Selection</h3>
        <div className="wiz-checkbox-grid">
          {CSUITE_ROLES.map(role => (
            <label key={role.key}
              className={`wiz-checkbox-option ${selectedRoles.includes(role.key) ? 'wiz-checkbox-option--selected' : ''}`}>
              <input type="checkbox" checked={selectedRoles.includes(role.key)}
                onChange={() => toggleRole(role.key)} />
              <span>{role.label}</span>
            </label>
          ))}
        </div>
        <button className="wiz-btn wiz-btn--add" style={{ marginTop: 12 }} onClick={addCustom}>
          <Plus size={16} /> Add Custom Executive Role
        </button>
      </div>

      {/* Executive Details */}
      {executives.length > 0 && (
        <div className="wiz-section">
          <h3 className="wiz-section-title">Executive Details</h3>
          <div className="wiz-dynamic-list">
            {executives.map((ex, idx) => {
              const label = ex.isCustom ? (ex.customTitle || 'Custom Role') : ex.role;
              const isOpen = expanded[ex.id] !== false; // default open

              return (
                <div key={ex.id} className="wiz-dynamic-card">
                  <div className="wiz-dynamic-card-header wiz-dynamic-card-header--clickable"
                    onClick={() => toggleExpand(ex.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="wiz-dynamic-card-num">#{idx + 1}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
                      <span className={`wiz-occupant-badge wiz-occupant-badge--${ex.occupantType === 'HUMAN' ? 'human' : 'ai'}`}>
                        {ex.occupantType === 'HUMAN' ? 'Human' : 'AI Vacant'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="wiz-icon-btn wiz-icon-btn--danger" onClick={e => { e.stopPropagation(); removeExec(ex.id); }}>
                        <Trash2 size={14} />
                      </button>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="wiz-dynamic-card-body">
                      {/* Custom title input */}
                      {ex.isCustom && (
                        <div className="wiz-field">
                          <label className="wiz-label">Executive Title</label>
                          <input className="wiz-input" value={ex.customTitle} placeholder="e.g. Chief Innovation Officer"
                            onChange={e => updateExec(ex.id, 'customTitle', e.target.value)} />
                        </div>
                      )}

                      {/* Occupant Type */}
                      <div className="wiz-field">
                        <label className="wiz-label">Occupant Type</label>
                        <div className="wiz-radio-group wiz-radio-group--horizontal">
                          <label className={`wiz-radio-pill ${ex.occupantType === 'HUMAN' ? 'wiz-radio-pill--selected' : ''}`}>
                            <input type="radio" checked={ex.occupantType === 'HUMAN'}
                              onChange={() => updateExec(ex.id, 'occupantType', 'HUMAN')} />
                            <User size={14} /> <span>Human</span>
                          </label>
                          <label className={`wiz-radio-pill wiz-radio-pill--ai ${ex.occupantType === 'AI_VACANT' ? 'wiz-radio-pill--selected' : ''}`}>
                            <input type="radio" checked={ex.occupantType === 'AI_VACANT'}
                              onChange={() => updateExec(ex.id, 'occupantType', 'AI_VACANT')} />
                            <Bot size={14} /> <span>AI (Vacant)</span>
                          </label>
                        </div>
                      </div>

                      {ex.occupantType === 'HUMAN' && (
                        <div className="wiz-grid-2">
                          <div className="wiz-field">
                            <label className="wiz-label">Full Name</label>
                            <input className="wiz-input" value={ex.name} placeholder="Name"
                              onChange={e => updateExec(ex.id, 'name', e.target.value)} />
                          </div>
                          <div className="wiz-field">
                            <label className="wiz-label">Email</label>
                            <input className="wiz-input" type="email" value={ex.email} placeholder="email@company.com"
                              onChange={e => updateExec(ex.id, 'email', e.target.value)} />
                          </div>
                        </div>
                      )}

                      {ex.occupantType === 'AI_VACANT' && (
                        <div className="wiz-ai-note">
                          <Bot size={16} />
                          <span>Position reserved — AI recruitment can be configured after your enterprise is launched.</span>
                        </div>
                      )}

                      {/* Reporting To */}
                      <div className="wiz-grid-2">
                        <div className="wiz-field">
                          <label className="wiz-label">
                            Reporting To {ex.occupantType === 'HUMAN' ? <span className="wiz-optional">(Optional)</span> : ''}
                          </label>
                          {(!ex.isCustom && ex.role !== 'CEO') ? (
                            <select className="wiz-select" value={wizardData.executives.find(e => !e.isCustom && e.role === 'CEO')?.id || ''} disabled>
                              <option value={wizardData.executives.find(e => !e.isCustom && e.role === 'CEO')?.id || ''}>
                                {wizardData.executives.find(e => !e.isCustom && e.role === 'CEO') ? 'CEO — Chief Executive Officer' : 'CEO (Required)'}
                              </option>
                            </select>
                          ) : (
                            <select className="wiz-select" value={ex.reportingTo}
                              onChange={e => updateExec(ex.id, 'reportingTo', e.target.value)}>
                              {(!ex.isCustom && ex.role === 'CEO') ? (
                                <>
                                  <option value="">Collective Board of Directors</option>
                                  {reportingOptions.filter(o => o.type === 'BOARD').map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <option value="">None / Collective Board</option>
                                  {reportingOptions.filter(o => o.value !== ex.id).map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                  ))}
                                </>
                              )}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
