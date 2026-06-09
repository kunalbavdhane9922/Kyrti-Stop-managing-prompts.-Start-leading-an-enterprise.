import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Sovereign Protocol — Reasoning Path (Module 4)
 * Displays the AI's logic chain as a numbered, collapsible list.
 * The human must see the reasoning before approving.
 */
function ReasoningPath({ steps = [], collapsed: initialCollapsed = true }) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  if (!steps || steps.length === 0) {
    return (
      <div className="reasoning-path-empty">
        No reasoning path provided. Approval blocked.
      </div>
    );
  }

  return (
    <div className="reasoning-path">
      <button
        className="reasoning-path-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
        <span>Reasoning Path ({steps.length} steps)</span>
      </button>

      {!collapsed && (
        <ol className="reasoning-path-list">
          {steps.map((step, i) => (
            <li key={i} className="reasoning-path-step">
              <span className="reasoning-step-num">{i + 1}</span>
              <span className="reasoning-step-text">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export { ReasoningPath };
