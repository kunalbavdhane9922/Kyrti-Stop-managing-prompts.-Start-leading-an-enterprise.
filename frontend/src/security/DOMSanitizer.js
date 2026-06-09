/**
 * Sovereign Protocol — DOM Sanitizer
 * Wraps DOMPurify to prevent XSS and Prompt Injection attacks.
 * All AI-generated outputs MUST pass through this before rendering.
 * This prevents malicious scripts embedded in AI responses from executing.
 */

import DOMPurify from 'dompurify';

// Configure DOMPurify with strict defaults
DOMPurify.setConfig({
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div', 'a',
  ],
  ALLOWED_ATTR: ['href', 'title', 'class', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: true,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onsubmit', 'onchange', 'style'],
  ADD_ATTR: ['target'],
});

// Force all links to open in new tab with security attributes
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const DOMSanitizer = {
  /**
   * Sanitizes HTML content, removing all potentially dangerous elements.
   * This is the primary defense against XSS from AI-generated content.
   * 
   * @param {string} dirtyHtml - The unsanitized HTML string
   * @returns {string} The sanitized HTML safe for rendering
   */
  sanitize(dirtyHtml) {
    if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';
    return DOMPurify.sanitize(dirtyHtml);
  },

  /**
   * Sanitizes content and strips ALL HTML, returning plain text.
   * Use this for contexts where no HTML rendering is needed.
   * 
   * @param {string} dirtyText - The unsanitized text
   * @returns {string} Plain text with all HTML removed
   */
  toPlainText(dirtyText) {
    if (!dirtyText || typeof dirtyText !== 'string') return '';
    return DOMPurify.sanitize(dirtyText, { ALLOWED_TAGS: [] });
  },

  /**
   * Checks if content contains potentially dangerous elements.
   * Returns true if the content was modified during sanitization.
   * 
   * @param {string} content - The content to check
   * @returns {boolean} Whether the content contains dangerous elements
   */
  isDangerous(content) {
    if (!content || typeof content !== 'string') return false;
    const sanitized = DOMPurify.sanitize(content);
    return sanitized !== content;
  },

  /**
   * Returns a list of removed elements/attributes from the last sanitization.
   * Useful for audit logging of attempted injection attacks.
   * 
   * @returns {Array} List of removed nodes
   */
  getRemovedElements() {
    return DOMPurify.removed || [];
  },
};

export { DOMSanitizer };
