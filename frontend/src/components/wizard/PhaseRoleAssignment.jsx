import React, { useEffect, useMemo } from 'react';
import { useWizard } from './WizardShell.jsx';
import { UserCheck, User, Bot, Briefcase } from 'lucide-react';

/**
 * Phase 6 — Role Assignment
 * Shows every node in the hierarchy and lets the user assign Human / AI (Vacant) / Vacant.
 * Builds a flat list of all roles from board members, executives, dept leaders, and teams.
 */
export function PhaseRoleAssignment() {
  const { wizardData, updateData, registerValidator } = useWizard();

  // Build the full node list from previous phases
  const allNodes = useMemo(() => {
    const nodes = [];

    // Board members
    wizardData.boardMembers.forEach(m => {
      nodes.push({
        sourceType: 'board',
        sourceId: m.id,
        title: m.position || 'Board Member',
        occupantType: m.personType === 'HUMAN' ? 'HUMAN' : 'AI_VACANT',
        name: m.name,
        category: 'Board of Directors',
      });
    });

    // Executives
    wizardData.executives.forEach(ex => {
      nodes.push({
        sourceType: 'executive',
        sourceId: ex.id,
        title: ex.isCustom ? ex.customTitle : ex.role,
        occupantType: ex.occupantType === 'HUMAN' ? 'HUMAN' : 'AI_VACANT',
        name: ex.name,
        category: 'Executive Leadership',
      });
    });

    // Department leaders and teams
    wizardData.departments.forEach(dept => {
      const h = wizardData.hierarchy[dept.name];
      if (!h) return;

      h.leaders.forEach(l => {
        const role = l.role === 'CUSTOM' ? l.customRole : `${l.role} ${dept.name}`;
        nodes.push({
          sourceType: 'dept_leader',
          sourceId: l.id,
          title: role,
          occupantType: l.name ? 'HUMAN' : 'VACANT',
          name: l.name,
          category: dept.name,
        });
      });

      h.teams.forEach(team => {
        if (!team.name) return;
        team.headcount.forEach(hc => {
          if (hc.count <= 0) return;
          nodes.push({
            sourceType: 'team_group',
            sourceId: `${team.id}-${hc.seniority}`,
            title: `${hc.seniority} ${team.name}`,
            occupantType: 'VACANT',
            name: '',
            category: dept.name,
            groupCount: hc.count,
          });
        });
      });
    });

    return nodes;
  }, [wizardData.boardMembers, wizardData.executives, wizardData.departments, wizardData.hierarchy]);

  // Group by category
  const grouped = useMemo(() => {
    const groups = {};
    allNodes.forEach(n => {
      if (!groups[n.category]) groups[n.category] = [];
      groups[n.category].push(n);
    });
    return groups;
  }, [allNodes]);

  useEffect(() => {
    registerValidator(6, () => null); // No strict validation — user can leave assignments
  }, [registerValidator]);

  const getIcon = (type) => {
    if (type === 'HUMAN') return <User size={14} className="wiz-role-icon--human" />;
    if (type === 'AI_VACANT') return <Bot size={14} className="wiz-role-icon--ai" />;
    return <Briefcase size={14} className="wiz-role-icon--vacant" />;
  };

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <UserCheck size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">Role Assignment Overview</h2>
          <p className="wiz-phase-desc">
            Review all positions in your organization. Assignments are based on what you defined in previous phases.
            You can update any assignment after launch from the Company Management page.
          </p>
        </div>
      </div>

      <div className="wiz-info-note">
        This is a read-only summary of the hierarchy you built. To change assignments, go back to the relevant phase.
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="wiz-empty-state">
          No positions defined yet. Go back and add board members, executives, or department teams.
        </div>
      )}

      {Object.entries(grouped).map(([category, nodes]) => (
        <div key={category} className="wiz-section">
          <h3 className="wiz-section-title">{category}</h3>
          <div className="wiz-role-table">
            <div className="wiz-role-table-header">
              <span>Position</span>
              <span>Type</span>
              <span>Assigned To</span>
              <span>Count</span>
            </div>
            {nodes.map((n, i) => (
              <div key={n.sourceId + i} className="wiz-role-table-row">
                <span className="wiz-role-title">{n.title}</span>
                <span className="wiz-role-type">
                  {getIcon(n.occupantType)}
                  <span className={`wiz-occupant-badge wiz-occupant-badge--${n.occupantType === 'HUMAN' ? 'human' : n.occupantType === 'AI_VACANT' ? 'ai' : 'vacant'}`}>
                    {n.occupantType === 'HUMAN' ? 'Human' : n.occupantType === 'AI_VACANT' ? 'AI (Vacant)' : 'Vacant'}
                  </span>
                </span>
                <span className="wiz-role-name">{n.name || '—'}</span>
                <span className="wiz-role-count">{n.groupCount || 1}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="wiz-summary-bar">
        <div className="wiz-summary-item">
          <User size={14} /> <strong>{allNodes.filter(n => n.occupantType === 'HUMAN').length}</strong> Human
        </div>
        <div className="wiz-summary-item">
          <Bot size={14} /> <strong>{allNodes.filter(n => n.occupantType === 'AI_VACANT').length}</strong> AI (Vacant)
        </div>
        <div className="wiz-summary-item">
          <Briefcase size={14} /> <strong>{allNodes.filter(n => n.occupantType === 'VACANT').length}</strong> Vacant
        </div>
        <div className="wiz-summary-item">
          <strong>{allNodes.reduce((s, n) => s + (n.groupCount || 1), 0)}</strong> Total Positions
        </div>
      </div>
    </div>
  );
}
