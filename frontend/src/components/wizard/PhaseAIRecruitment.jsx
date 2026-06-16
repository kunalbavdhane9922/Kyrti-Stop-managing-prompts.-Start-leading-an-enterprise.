import React, { useMemo, useEffect } from 'react';
import { useWizard } from './WizardShell.jsx';
import { Bot, SkipForward, Info } from 'lucide-react';

/**
 * Phase 10 — AI Recruitment (OPTIONAL)
 * Lists all AI-vacant positions. This phase is completely optional.
 * AI recruitment can be configured after launch from the Company Management page.
 */
export function PhaseAIRecruitment() {
  const { wizardData, registerValidator } = useWizard();

  useEffect(() => {
    registerValidator(10, () => null); // No validation — this phase is optional
  }, [registerValidator]);

  // Gather all AI-vacant nodes across the entire org
  const aiNodes = useMemo(() => {
    const nodes = [];

    // Board members
    wizardData.boardMembers.forEach(m => {
      if (m.personType === 'AI_VACANT') {
        nodes.push({
          id: m.id,
          position: m.position || 'Board Member',
          category: 'Board of Directors',
          type: 'board',
        });
      }
    });

    // Executives
    wizardData.executives.forEach(ex => {
      if (ex.occupantType === 'AI_VACANT') {
        nodes.push({
          id: ex.id,
          position: ex.isCustom ? ex.customTitle : ex.role,
          category: 'Executive Leadership',
          type: 'executive',
        });
      }
    });

    // Department leaders
    wizardData.departments.forEach(dept => {
      const h = wizardData.hierarchy[dept.name];
      if (!h) return;

      h.leaders.forEach(l => {
        if (l.occupantType === 'AI_VACANT') {
          const role = l.role === 'CUSTOM' ? l.customRole : `${l.role} ${dept.name}`;
          nodes.push({
            id: l.id,
            position: role,
            category: dept.name,
            type: 'dept_leader',
          });
        }
      });

      // Team positions (all vacant by default — awaiting recruitment)
      h.teams.forEach(team => {
        if (!team.name) return;
        team.headcount.forEach(hc => {
          if (hc.count > 0) {
            nodes.push({
              id: `${team.id}-${hc.seniority}`,
              position: `${hc.seniority} ${team.name}`,
              category: dept.name,
              type: 'team_position',
              count: hc.count,
            });
          }
        });
      });
    });

    return nodes;
  }, [wizardData]);

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <Bot size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">AI Recruitment</h2>
          <p className="wiz-phase-desc">
            Review positions marked for AI recruitment.
          </p>
        </div>
      </div>

      {/* Optional Notice */}
      <div className="wiz-optional-banner">
        <div className="wiz-optional-banner-icon">
          <Info size={20} />
        </div>
        <div>
          <strong>This step is completely optional.</strong>
          <p>
            AI recruitment can be configured at any time after your enterprise is launched
            from the Company Management page. You can safely skip this step and launch now
            using the "Skip & Launch" button below.
          </p>
        </div>
      </div>

      {aiNodes.length === 0 ? (
        <div className="wiz-empty-state">
          <Bot size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p>No AI positions defined.</p>
          <p style={{ fontSize: 13, opacity: 0.6 }}>
            All positions are assigned to humans or left vacant.
            You can add AI positions later from the Company Management page.
          </p>
        </div>
      ) : (
        <>
          <div className="wiz-section">
            <h3 className="wiz-section-title">AI-Designated Positions ({aiNodes.reduce((s, n) => s + (n.count || 1), 0)} total)</h3>
            <div className="wiz-ai-position-list">
              {aiNodes.map(node => (
                <div key={node.id} className="wiz-ai-position-card">
                  <div className="wiz-ai-position-icon">
                    <Bot size={20} />
                  </div>
                  <div className="wiz-ai-position-info">
                    <span className="wiz-ai-position-title">
                      {node.position}
                      {node.count > 1 && <span style={{ color: '#F13223', fontWeight: 700, marginLeft: 6 }}>×{node.count}</span>}
                    </span>
                    <span className="wiz-ai-position-cat">{node.category}</span>
                  </div>
                  <div className="wiz-ai-position-status">
                    <span className="wiz-status-dot wiz-status-dot--unassigned" />
                    Unassigned
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="wiz-info-note">
            <Bot size={14} />
            <span>
              After launch, you will see a "Recruit AI" button next to each AI position
              on the Company Management page. The AI Agent Marketplace will be available
              for recruiting autonomous agents into these positions.
            </span>
          </div>
        </>
      )}
    </div>
  );
}
