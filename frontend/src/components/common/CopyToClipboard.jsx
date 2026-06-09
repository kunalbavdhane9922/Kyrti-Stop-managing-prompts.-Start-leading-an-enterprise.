import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Sovereign Protocol — CopyToClipboard Component
 * Used for DNS TXT record verification and hash display.
 */
function CopyToClipboard({ text, label, mono = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for insecure contexts
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {label && <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: 'var(--space-2)' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-md)',
      }}>
        <code style={{
          flex: 1, fontSize: 'var(--text-sm)',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          color: 'var(--color-text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          userSelect: 'all',
        }}>
          {text}
        </code>
        <button
          className="btn btn-ghost btn-icon"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
          style={{ width: 32, height: 32, padding: 4, flexShrink: 0 }}
        >
          {copied ? <Check size={16} style={{ color: 'var(--color-accent-emerald)' }} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

export { CopyToClipboard };
