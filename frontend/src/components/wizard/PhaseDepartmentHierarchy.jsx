import React, { useEffect, useState } from 'react';
import { useWizard } from './WizardShell.jsx';
import { Network, Plus, Trash2, ChevronDown, ChevronUp, Users, User, Bot } from 'lucide-react';
import { Button } from '../common/Button.jsx';

const LEADERSHIP_ROLES = ['VP', 'Director', 'Senior Manager', 'Manager'];
const SENIORITY_LEVELS = ['Senior', 'Mid', 'Junior', 'Intern'];

function createTeam(deptName) {
  return {
    id: crypto.randomUUID(),
    name: '',
    headcount: SENIORITY_LEVELS.map(s => ({ seniority: s, count: 0 })),
  };
}

function createLeader(deptName) {
  return {
    id: crypto.randomUUID(),
    role: '',
    customRole: '',
    occupantType: 'HUMAN',
    name: '',
    email: '',
    reportingTo: '',
  };
}

function guessReportingTo(deptName, executives) {
  const map = {
    'Engineering': 'CTO',
    'Product': 'CPO',
    'Marketing': 'CMO',
    'Sales': 'CRO',
    'Human Resources': 'CHRO',
    'Finance': 'CFO',
    'Operations': 'COO',
    'Legal': 'CLO',
    'Security': 'CISO',
    'Information Technology': 'CIO',
  };
  const targetRole = map[deptName];
  if (targetRole) {
    const exec = executives.find(e => e.role === targetRole);
    if (exec) return exec.id;
  }
  const ceo = executives.find(e => e.role === 'CEO');
  return ceo ? ceo.id : '';
}

export function PhaseDepartmentHierarchy() {
  const { wizardData, updateData, registerValidator } = useWizard();
  const departments = wizardData.departments;
  const hierarchy = wizardData.hierarchy;
  const [expandedDept, setExpandedDept] = useState({});

  // Initialize hierarchy for new departments
  useEffect(() => {
    const updated = { ...hierarchy };
    let changed = false;
    departments.forEach(d => {
      if (!updated[d.name]) {
        updated[d.name] = { leaders: [], teams: [] };
        changed = true;
      }
    });
    // Remove hierarchy entries for removed departments
    Object.keys(updated).forEach(key => {
      if (!departments.find(d => d.name === key)) {
        delete updated[key];
        changed = true;
      }
    });
    if (changed) updateData('hierarchy', updated);
  }, [departments]);

  useEffect(() => {
    registerValidator(5, () => {
      for (const dept of departments) {
        const h = hierarchy[dept.name];
        if (!h) continue;

        // ── Validate leaders ──
        for (let i = 0; i < h.leaders.length; i++) {
          const leader = h.leaders[i];
          if (!leader.role) return `${dept.name}: Leader ${i + 1} — Role is required`;
          if (leader.role === 'CUSTOM' && !leader.customRole.trim()) {
            return `${dept.name}: Leader ${i + 1} — Custom role title is required`;
          }
        }

        // ── Validate teams ──
        for (let i = 0; i < h.teams.length; i++) {
          if (!h.teams[i].name.trim()) {
            return `${dept.name}: Team ${i + 1} needs a name`;
          }
        }
      }

      // ── Cross-phase validation: total positions vs declared employee count ──
      const declaredCount = parseInt(wizardData.company.employeeCount, 10) || 0;
      if (declaredCount > 0) {
        let totalPositions = 0;

        // Count board members
        totalPositions += wizardData.boardMembers.length;

        // Count executives
        totalPositions += wizardData.executives.length;

        // Count department leaders + team headcount
        for (const dept of departments) {
          const h = hierarchy[dept.name];
          if (!h) continue;
          totalPositions += h.leaders.length;
          h.teams.forEach(team => {
            team.headcount.forEach(hc => {
              totalPositions += hc.count;
            });
          });
        }

        if (totalPositions !== declaredCount) {
          const diff = declaredCount - totalPositions;
          if (totalPositions > declaredCount) {
            return `Total positions in your hierarchy (${totalPositions}) exceeds the declared employee count (${declaredCount}) from Phase 1. You have ${Math.abs(diff)} position(s) too many. Please reduce headcount or increase the employee count in Company Registration.`;
          } else {
            return `Total positions in your hierarchy (${totalPositions}) is less than the declared employee count (${declaredCount}) from Phase 1. You still need to allocate ${diff} more position(s). Please add more team members or adjust the employee count in Company Registration.`;
          }
        }
      }

      return null;
    });
  }, [registerValidator, departments, hierarchy, wizardData]);

  const updateHierarchy = (deptName, data) => {
    updateData('hierarchy', { ...hierarchy, [deptName]: data });
  };

  const addLeader = (deptName) => {
    const h = hierarchy[deptName] || { leaders: [], teams: [] };
    const reportingTo = guessReportingTo(deptName, wizardData.executives);
    updateHierarchy(deptName, { ...h, leaders: [...h.leaders, { ...createLeader(deptName), reportingTo }] });
  };

  const removeLeader = (deptName, id) => {
    const h = hierarchy[deptName];
    updateHierarchy(deptName, { ...h, leaders: h.leaders.filter(l => l.id !== id) });
  };

  const updateLeader = (deptName, id, field, value) => {
    const h = hierarchy[deptName];
    updateHierarchy(deptName, {
      ...h,
      leaders: h.leaders.map(l => l.id === id ? { ...l, [field]: value } : l),
    });
  };

  const addTeam = (deptName) => {
    const h = hierarchy[deptName] || { leaders: [], teams: [] };
    updateHierarchy(deptName, { ...h, teams: [...h.teams, createTeam(deptName)] });
  };

  const removeTeam = (deptName, id) => {
    const h = hierarchy[deptName];
    updateHierarchy(deptName, { ...h, teams: h.teams.filter(t => t.id !== id) });
  };

  const updateTeamName = (deptName, id, name) => {
    const h = hierarchy[deptName];
    updateHierarchy(deptName, {
      ...h,
      teams: h.teams.map(t => t.id === id ? { ...t, name } : t),
    });
  };

  const updateTeamHeadcount = (deptName, teamId, seniority, count) => {
    const h = hierarchy[deptName];
    updateHierarchy(deptName, {
      ...h,
      teams: h.teams.map(t => {
        if (t.id !== teamId) return t;
        return {
          ...t,
          headcount: t.headcount.map(hc =>
            hc.seniority === seniority ? { ...hc, count: Math.max(0, parseInt(count) || 0) } : hc
          ),
        };
      }),
    });
  };

  const toggleDept = (name) => {
    setExpandedDept(p => ({ ...p, [name]: !p[name] }));
  };

  if (departments.length === 0) {
    return (
      <div className="wiz-phase">
        <div className="wiz-phase-header">
          <Network size={24} className="wiz-phase-icon" />
          <div>
            <h2 className="wiz-phase-title">Department Hierarchy</h2>
            <p className="wiz-phase-desc">No departments selected. Go back to Phase 4 and select departments first.</p>
          </div>
        </div>
      </div>
    );
  }

  const reportingOptions = [
    ...wizardData.boardMembers.map(b => ({
      value: b.id,
      label: `Board: ${b.position}`,
    })),
    ...wizardData.executives.map(e => ({
      value: e.id,
      label: `Exec: ${e.isCustom ? e.customTitle : e.role}`,
    }))
  ];

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <Network size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">Department Hierarchy Designer</h2>
          <p className="wiz-phase-desc">
            For each department, define leadership positions and teams. For each team, specify headcount by seniority level.
          </p>
        </div>
      </div>

      <div className="wiz-info-note">
        Everything you define here is fully editable after launch from the Company Management page.
      </div>

      {departments.map(dept => {
        const h = hierarchy[dept.name] || { leaders: [], teams: [] };
        const isOpen = expandedDept[dept.name] !== false;
        const totalPeople = h.teams.reduce((sum, t) => sum + t.headcount.reduce((s, hc) => s + hc.count, 0), 0);

        return (
          <div key={dept.name} className="wiz-dept-section">
            <div className="wiz-dept-section-header" onClick={() => toggleDept(dept.name)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="wiz-dept-section-name">{dept.name}</span>
                <span className="wiz-dept-section-meta">
                  {h.leaders.length} leaders · {h.teams.length} teams · {totalPeople} people
                </span>
              </div>
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {isOpen && (
              <div className="wiz-dept-section-body">
                {/* Leadership */}
                <div className="wiz-subsection">
                  <h4 className="wiz-subsection-title">Leadership</h4>
                  {h.leaders.map((leader, li) => (
                    <div key={leader.id} className="wiz-inline-card">
                      <div className="wiz-grid-4">
                        <div className="wiz-field">
                          <label className="wiz-label-sm">Role</label>
                          <select className="wiz-input-sm" value={leader.role}
                            onChange={e => updateLeader(dept.name, leader.id, 'role', e.target.value)}>
                            <option value="">Select...</option>
                            {LEADERSHIP_ROLES.map(r => <option key={r} value={r}>{r} {dept.name}</option>)}
                            <option value="CUSTOM">Custom Role</option>
                          </select>
                        </div>
                        {leader.role === 'CUSTOM' && (
                          <div className="wiz-field">
                            <label className="wiz-label-sm">Custom Title</label>
                            <input className="wiz-input-sm" value={leader.customRole} placeholder="Title"
                              onChange={e => updateLeader(dept.name, leader.id, 'customRole', e.target.value)} />
                          </div>
                        )}
                        <div className="wiz-field" style={{ gridColumn: leader.role === 'CUSTOM' ? 'span 2' : 'span 3' }}>
                          <label className="wiz-label-sm">Reporting To</label>
                          <select className="wiz-input-sm" value={leader.reportingTo}
                            onChange={e => updateLeader(dept.name, leader.id, 'reportingTo', e.target.value)}>
                            <option value="">None / Top Level</option>
                            {reportingOptions.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </div>
                        {/* Occupant Type */}
                        <div className="wiz-field" style={{ gridColumn: 'span 4' }}>
                          <label className="wiz-label-sm">Occupant Type</label>
                          <div className="wiz-radio-group wiz-radio-group--horizontal">
                            <label className={`wiz-radio-pill ${leader.occupantType === 'HUMAN' ? 'wiz-radio-pill--selected' : ''}`}>
                              <input type="radio" checked={leader.occupantType === 'HUMAN'}
                                onChange={() => updateLeader(dept.name, leader.id, 'occupantType', 'HUMAN')} />
                              <User size={14} /> <span>Human</span>
                            </label>
                            <label className={`wiz-radio-pill wiz-radio-pill--ai ${leader.occupantType === 'AI_VACANT' ? 'wiz-radio-pill--selected' : ''}`}>
                              <input type="radio" checked={leader.occupantType === 'AI_VACANT'}
                                onChange={() => updateLeader(dept.name, leader.id, 'occupantType', 'AI_VACANT')} />
                              <Bot size={14} /> <span>AI (Vacant)</span>
                            </label>
                          </div>
                        </div>
                        {leader.occupantType === 'HUMAN' && (
                          <>
                            <div className="wiz-field" style={{ gridColumn: 'span 2' }}>
                              <label className="wiz-label-sm">Name <span className="wiz-optional">(Optional)</span></label>
                              <input className="wiz-input-sm" value={leader.name} placeholder="Name"
                                onChange={e => updateLeader(dept.name, leader.id, 'name', e.target.value)} />
                            </div>
                            <div className="wiz-field" style={{ gridColumn: 'span 2' }}>
                              <label className="wiz-label-sm">Email <span className="wiz-optional">(Optional)</span></label>
                              <input className="wiz-input-sm" value={leader.email} placeholder="Email"
                                onChange={e => updateLeader(dept.name, leader.id, 'email', e.target.value)} />
                            </div>
                          </>
                        )}
                      </div>
                      <button className="wiz-icon-btn wiz-icon-btn--danger" onClick={() => removeLeader(dept.name, leader.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" onClick={() => addLeader(dept.name)} icon={Plus}>
                    Add Leadership Position
                  </Button>
                </div>

                {/* Teams */}
                <div className="wiz-subsection">
                  <h4 className="wiz-subsection-title">Teams</h4>
                  {h.teams.map((team, ti) => {
                    const teamTotal = team.headcount.reduce((s, hc) => s + hc.count, 0);
                    return (
                      <div key={team.id} className="wiz-team-card">
                        <div className="wiz-team-card-header">
                          <div className="wiz-field" style={{ flex: 1, marginBottom: 0 }}>
                            <input className="wiz-input-sm" value={team.name} placeholder="e.g. Frontend, Backend, DevOps"
                              onChange={e => updateTeamName(dept.name, team.id, e.target.value)} />
                          </div>
                          <span className="wiz-team-total"><Users size={12} /> {teamTotal}</span>
                          <button className="wiz-icon-btn wiz-icon-btn--danger" onClick={() => removeTeam(dept.name, team.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="wiz-headcount-row">
                          {team.headcount.map(hc => (
                            <div key={hc.seniority} className="wiz-headcount-item">
                              <label className="wiz-label-sm">{hc.seniority}</label>
                              <input className="wiz-input-sm wiz-input-number" type="number" min="0"
                                value={hc.count || ''}
                                placeholder="0"
                                onChange={e => updateTeamHeadcount(dept.name, team.id, hc.seniority, e.target.value)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <Button variant="secondary" size="sm" onClick={() => addTeam(dept.name)} icon={Plus}>
                    Add Team
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
