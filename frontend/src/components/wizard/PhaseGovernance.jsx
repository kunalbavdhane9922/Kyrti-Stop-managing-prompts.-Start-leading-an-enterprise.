import React, { useEffect, useState } from 'react';
import { useWizard } from './WizardShell.jsx';
import { Users, Plus, Trash2, User, Bot } from 'lucide-react';
import { Button } from '../common/Button.jsx';

const BOARD_POSITIONS = [
  'Chairman',
  'Vice Chairman',
  'Independent Director',
  'Executive Director',
  'Non-Executive Director',
];

function createMember() {
  return {
    id: crypto.randomUUID(),
    position: '',
    personType: 'HUMAN', // HUMAN | AI_VACANT
    name: '',
    email: '',
    phone: '',
  };
}

export function PhaseGovernance() {
  const { wizardData, updateData, registerValidator } = useWizard();
  const members = wizardData.boardMembers;

  useEffect(() => {
    registerValidator(2, () => {
      // ── Rule 1: At least one board member required ──
      if (members.length === 0) return 'At least one Board Member is required to establish governance.';

      // ── Rule 2: At least one HUMAN board member (Human Supremacy Principle) ──
      const hasHuman = members.some(m => m.personType === 'HUMAN');
      if (!hasHuman) return 'At least one Board Member must be a Human. AI cannot solely govern an enterprise.';

      // ── Rule 3: Individual field validation ──
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const positionCounts = {};

      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m.position) return `Board Member ${i + 1}: Position is required`;

        // Track duplicate positions
        positionCounts[m.position] = (positionCounts[m.position] || 0) + 1;

        if (m.personType === 'HUMAN') {
          if (!m.name.trim()) return `Board Member ${i + 1} (${m.position}): Name is required`;
          if (!m.email.trim()) return `Board Member ${i + 1} (${m.position}): Email is required`;
          if (!emailRegex.test(m.email.trim())) return `Board Member ${i + 1} (${m.position}): Invalid email format`;
        }
      }

      // Chairman/Vice Chairman uniqueness constraints removed per user request.

      return null;
    });
  }, [registerValidator, members]);

  const addMember = () => {
    updateData('boardMembers', [...members, createMember()]);
  };

  const removeMember = (id) => {
    updateData('boardMembers', members.filter(m => m.id !== id));
  };

  const updateMember = (id, field, value) => {
    updateData('boardMembers', members.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <Users size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">Board of Directors</h2>
          <p className="wiz-phase-desc">
            Define your governance structure. Add board members and specify whether each position
            is filled by a human or reserved for future AI recruitment.
          </p>
        </div>
      </div>

      <div className="wiz-info-note">
        No board members are auto-created. You define each position manually.
        {members.length === 0 && ' Click "Add Board Member" to begin.'}
      </div>

      {/* Board Members List */}
      <div className="wiz-dynamic-list">
        {members.map((m, idx) => (
          <div key={m.id} className="wiz-dynamic-card">
            <div className="wiz-dynamic-card-header">
              <span className="wiz-dynamic-card-num">#{idx + 1}</span>
              <button className="wiz-icon-btn wiz-icon-btn--danger" onClick={() => removeMember(m.id)}>
                <Trash2 size={14} />
              </button>
            </div>

            {/* Position select */}
            <div className="wiz-field">
              <label className="wiz-label">Position</label>
              <select className="wiz-select" value={m.position}
                onChange={e => updateMember(m.id, 'position', e.target.value)}>
                <option value="">Select position...</option>
                {BOARD_POSITIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Person Type */}
            <div className="wiz-field">
              <label className="wiz-label">Person Type</label>
              <div className="wiz-radio-group wiz-radio-group--horizontal">
                <label className={`wiz-radio-pill ${m.personType === 'HUMAN' ? 'wiz-radio-pill--selected' : ''}`}>
                  <input type="radio" checked={m.personType === 'HUMAN'}
                    onChange={() => updateMember(m.id, 'personType', 'HUMAN')} />
                  <User size={14} /> <span>Human</span>
                </label>
                <label className={`wiz-radio-pill wiz-radio-pill--ai ${m.personType === 'AI_VACANT' ? 'wiz-radio-pill--selected' : ''}`}>
                  <input type="radio" checked={m.personType === 'AI_VACANT'}
                    onChange={() => updateMember(m.id, 'personType', 'AI_VACANT')} />
                  <Bot size={14} /> <span>AI Position (Vacant)</span>
                </label>
              </div>
            </div>

            {/* Human fields */}
            {m.personType === 'HUMAN' && (
              <div className="wiz-grid-3">
                <div className="wiz-field">
                  <label className="wiz-label">Full Name</label>
                  <input className="wiz-input" value={m.name} placeholder="Name"
                    onChange={e => updateMember(m.id, 'name', e.target.value)} />
                </div>
                <div className="wiz-field">
                  <label className="wiz-label">Email</label>
                  <input className="wiz-input" type="email" value={m.email} placeholder="email@company.com"
                    onChange={e => updateMember(m.id, 'email', e.target.value)} />
                </div>
                <div className="wiz-field">
                  <label className="wiz-label">Phone <span className="wiz-optional">(Optional)</span></label>
                  <input className="wiz-input" type="tel" value={m.phone} placeholder="+91 XXXXX XXXXX"
                    onChange={e => updateMember(m.id, 'phone', e.target.value)} />
                </div>
              </div>
            )}

            {/* AI Vacant note */}
            {m.personType === 'AI_VACANT' && (
              <div className="wiz-ai-note">
                <Bot size={16} />
                <span>This position is reserved. AI recruitment can be configured after your enterprise is launched.</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={addMember} icon={Plus}>
        Add Board Member
      </Button>
    </div>
  );
}
