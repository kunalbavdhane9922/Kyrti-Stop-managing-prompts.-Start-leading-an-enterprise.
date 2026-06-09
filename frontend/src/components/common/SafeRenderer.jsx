import { DOMSanitizer } from '../../security/DOMSanitizer.js';
import { PolicyValidator } from '../../security/PolicyValidator.js';

/**
 * Sovereign Protocol — SafeRenderer Component
 * Renders AI-generated content after passing through BOTH
 * the PolicyValidator AND DOMPurify sanitization.
 * This is the ONLY way AI content should be rendered in the UI.
 */
function SafeRenderer({ content, agentId = 'unknown', context = 'display', onViolation }) {
  if (!content) return null;

  // Step 1: Run through policy validator
  const validationResult = PolicyValidator.validateContent(content, agentId, context);

  if (!validationResult.passed) {
    if (onViolation) onViolation(validationResult);
    return (
      <div style={{
        padding: 'var(--space-4)',
        background: 'rgba(244, 63, 94, 0.08)',
        border: '1px solid var(--color-border-danger)',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)',
          color: 'var(--color-accent-rose)', marginBottom: 'var(--space-2)',
        }}>
          Content Blocked — Policy Violation
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          This content has been blocked by the Deterministic Policy Validator.
          A Blocker Report (ID: {validationResult.blockerReportId}) has been generated for human review.
        </p>
      </div>
    );
  }

  // Step 2: Sanitize through DOMPurify
  const sanitizedHtml = DOMSanitizer.sanitize(content);

  return (
    <div
      className="safe-rendered-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-secondary)' }}
    />
  );
}

export { SafeRenderer };
