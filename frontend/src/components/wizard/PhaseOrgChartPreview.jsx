import React, { useMemo, useEffect } from 'react';
import { useWizard } from './WizardShell.jsx';
import { GitBranch, User, Bot, Briefcase, Users } from 'lucide-react';

/**
 * Phase 8 — Org Chart Preview
 * Visual tree representation of the entire hierarchy built in phases 2–7.
 * Grouped positions shown as single blocks with count.
 */
export function PhaseOrgChartPreview() {
  const { wizardData, registerValidator } = useWizard();

  useEffect(() => {
    registerValidator(8, () => null);
  }, [registerValidator]);

  // Build tree structure
  const tree = useMemo(() => {
    const root = { title: wizardData.company.name || 'Your Company', type: 'ROOT', children: [] };

    // Board
    if (wizardData.boardMembers.length > 0) {
      const board = { title: 'Board of Directors', type: 'GROUP', nodeType: 'BOARD', children: [] };
      wizardData.boardMembers.forEach(m => {
        board.children.push({
          title: m.position || 'Board Member',
          type: m.personType === 'HUMAN' ? 'HUMAN' : 'AI_VACANT',
          name: m.name,
          children: [],
        });
      });
      root.children.push(board);
    }

    // Executives
    const execMap = {};
    wizardData.executives.forEach(ex => {
      const title = ex.isCustom ? ex.customTitle : ex.role;
      execMap[ex.id] = {
        title,
        type: ex.occupantType === 'HUMAN' ? 'HUMAN' : 'AI_VACANT',
        name: ex.name,
        reportingTo: ex.reportingTo,
        children: [],
        id: ex.id,
      };
    });

    // Build exec reporting tree
    const execRoots = [];
    Object.values(execMap).forEach(exec => {
      if (exec.reportingTo && execMap[exec.reportingTo]) {
        execMap[exec.reportingTo].children.push(exec);
      } else {
        execRoots.push(exec);
      }
    });
    execRoots.forEach(e => root.children.push(e));

    // Departments under executives or root
    wizardData.departments.forEach(dept => {
      const h = wizardData.hierarchy[dept.name];
      if (!h) return;

      const deptNode = { title: dept.name, type: 'DEPT', children: [] };

      // Leaders
      h.leaders.forEach(l => {
        const role = l.role === 'CUSTOM' ? l.customRole : `${l.role}`;
        deptNode.children.push({
          title: role,
          type: l.name ? 'HUMAN' : 'VACANT',
          name: l.name,
          children: [],
        });
      });

      // Teams
      h.teams.forEach(team => {
        if (!team.name) return;
        const teamNode = { title: team.name, type: 'TEAM', children: [] };
        team.headcount.forEach(hc => {
          if (hc.count > 0) {
            teamNode.children.push({
              title: `${hc.seniority}`,
              type: 'GROUP_POSITION',
              count: hc.count,
              children: [],
            });
          }
        });
        deptNode.children.push(teamNode);
      });

      root.children.push(deptNode);
    });

    return root;
  }, [wizardData]);

  const getIcon = (type) => {
    if (type === 'HUMAN') return <User size={12} className="tree-icon tree-icon--human" />;
    if (type === 'AI_VACANT') return <Bot size={12} className="tree-icon tree-icon--ai" />;
    if (type === 'DEPT') return <Briefcase size={12} className="tree-icon tree-icon--dept" />;
    if (type === 'TEAM') return <Users size={12} className="tree-icon tree-icon--team" />;
    if (type === 'GROUP_POSITION') return <Users size={12} className="tree-icon tree-icon--group" />;
    return <GitBranch size={12} className="tree-icon" />;
  };

  const renderNode = (node, depth = 0) => (
    <div key={node.title + depth + Math.random()} className="tree-node" style={{ marginLeft: depth * 24 }}>
      <div className={`tree-node-content tree-node-content--${node.type?.toLowerCase() || 'default'}`}>
        {getIcon(node.type)}
        <span className="tree-node-title">{node.title}</span>
        {node.name && <span className="tree-node-name">— {node.name}</span>}
        {node.count > 1 && <span className="tree-node-count">×{node.count}</span>}
        {node.type === 'AI_VACANT' && <span className="tree-node-badge tree-node-badge--ai">AI Vacant</span>}
        {node.type === 'VACANT' && <span className="tree-node-badge tree-node-badge--vacant">Vacant</span>}
      </div>
      {node.children && node.children.map((child, i) => renderNode(child, depth + 1))}
    </div>
  );

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <GitBranch size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">Organization Chart Preview</h2>
          <p className="wiz-phase-desc">
            Review your complete organizational structure. After launch, this becomes a fully interactive
            drag-and-drop org chart on the Company Management page.
          </p>
        </div>
      </div>

      <div className="wiz-info-note">
        This is a preview. The full visual org chart with drag-and-drop, re-parenting, and editing
        will be available on the Company Management page after you launch.
      </div>

      <div className="wiz-org-tree">
        {renderNode(tree)}
      </div>
    </div>
  );
}
