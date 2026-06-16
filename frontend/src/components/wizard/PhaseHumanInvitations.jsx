import React, { useMemo, useEffect } from 'react';
import { useWizard } from './WizardShell.jsx';
import { Mail, User, Send } from 'lucide-react';

/**
 * Phase 9 — Human Invitations
 * Lists all human-assigned positions and lets the user review invitation details.
 * Actual email sending happens after the enterprise is launched.
 */
export function PhaseHumanInvitations() {
  const { wizardData, registerValidator } = useWizard();

  // Gather all human-assigned nodes
  const humanNodes = useMemo(() => {
    const nodes = [];

    wizardData.boardMembers.forEach(m => {
      if (m.personType === 'HUMAN' && m.name) {
        nodes.push({
          id: m.id,
          position: m.position || 'Board Member',
          name: m.name,
          email: m.email,
          category: 'Board of Directors',
        });
      }
    });

    wizardData.executives.forEach(ex => {
      if (ex.occupantType === 'HUMAN' && ex.name) {
        nodes.push({
          id: ex.id,
          position: ex.isCustom ? ex.customTitle : ex.role,
          name: ex.name,
          email: ex.email,
          category: 'Executive Leadership',
        });
      }
    });

    wizardData.departments.forEach(dept => {
      const h = wizardData.hierarchy[dept.name];
      if (!h) return;
      h.leaders.forEach(l => {
        if (l.name) {
          const role = l.role === 'CUSTOM' ? l.customRole : `${l.role} ${dept.name}`;
          nodes.push({
            id: l.id,
            position: role,
            name: l.name,
            email: l.email,
            category: dept.name,
          });
        }
      });
    });

    return nodes;
  }, [wizardData]);

  // Find duplicate emails
  const duplicateEmails = useMemo(() => {
    const counts = {};
    humanNodes.forEach(n => {
      const e = n.email?.trim().toLowerCase();
      if (e) {
        counts[e] = (counts[e] || 0) + 1;
      }
    });
    const duplicates = new Set();
    Object.entries(counts).forEach(([e, count]) => {
      if (count > 1) duplicates.add(e);
    });
    return duplicates;
  }, [humanNodes]);

  useEffect(() => {
    registerValidator(9, () => {
      if (duplicateEmails.size > 0) {
        return "Duplicate email addresses detected. Each human must have a unique email address to log in. Please go back to previous phases to correct the duplicates highlighted below.";
      }
      return null;
    });
  }, [registerValidator, duplicateEmails]);

  return (
    <div className="wiz-phase">
      <div className="wiz-phase-header">
        <Mail size={24} className="wiz-phase-icon" />
        <div>
          <h2 className="wiz-phase-title">Human Invitations</h2>
          <p className="wiz-phase-desc">
            Review all human-assigned positions. Invitation emails will be sent after you launch your enterprise.
          </p>
        </div>
      </div>

      <div className="wiz-info-note">
        <Send size={14} />
        <span>Invitations will be sent automatically after launch. You can also send invitations manually from the Company Management page at any time.</span>
      </div>

      {humanNodes.length === 0 ? (
        <div className="wiz-empty-state">
          <User size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p>No human positions assigned yet.</p>
          <p style={{ fontSize: 13, opacity: 0.6 }}>Go back to previous phases to assign humans to positions.</p>
        </div>
      ) : (
        <div className="wiz-invite-list">
          <div className="wiz-invite-header-row">
            <span>Position</span>
            <span>Name</span>
            <span>Email</span>
            <span>Department</span>
            <span>Status</span>
          </div>
          {humanNodes.map(node => {
            const isDuplicate = node.email && duplicateEmails.has(node.email.trim().toLowerCase());
            return (
              <div key={node.id} className="wiz-invite-row" style={isDuplicate ? { border: '1px solid var(--error)', backgroundColor: 'rgba(255, 68, 68, 0.05)' } : {}}>
                <span className="wiz-invite-position">{node.position}</span>
                <span className="wiz-invite-name">{node.name}</span>
                <span className="wiz-invite-email" style={isDuplicate ? { color: 'var(--error)', fontWeight: 600 } : {}}>{node.email || '—'}</span>
                <span className="wiz-invite-dept">{node.category}</span>
                <span className="wiz-invite-status">
                  {isDuplicate ? (
                    <span style={{ color: 'var(--error)', fontSize: '12px', fontWeight: 600 }}>Duplicate Email</span>
                  ) : (
                    <>
                      <span className="wiz-status-dot wiz-status-dot--pending" />
                      Pending Launch
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="wiz-summary-bar">
        <div className="wiz-summary-item">
          <User size={14} /> <strong>{humanNodes.length}</strong> invitations to send
        </div>
        <div className="wiz-summary-item">
          <strong>{humanNodes.filter(n => n.email).length}</strong> with email addresses
        </div>
      </div>
    </div>
  );
}
