import { useState } from 'react';
import { Lock, CheckCircle, Users } from 'lucide-react';
import { Modal } from '../common/Modal.jsx';
import { Badge } from '../common/Badge.jsx';
import { ExecutionSigner } from '../../security/ExecutionSigner.js';

/**
 * Sovereign Protocol — Multi-Sig Modal (Module 4)
 * Collects N-of-M human signatures before high-value execution.
 */
function MultiSigModal({ isOpen, onClose, proposal, requiredSignatures = 2, onComplete }) {
  const [signatures, setSignatures] = useState([]);
  const [signing, setSigning] = useState(false);
  const [currentSigner, setCurrentSigner] = useState('');

  const handleSign = async () => {
    if (!currentSigner.trim()) return;
    setSigning(true);
    try {
      const sig = await ExecutionSigner.collectSignature(
        proposal.id,
        currentSigner.trim(),
        'board_member'
      );
      const updated = [...signatures, sig];
      setSignatures(updated);
      setCurrentSigner('');

      if (updated.length >= requiredSignatures && onComplete) {
        onComplete(updated);
      }
    } catch (e) {
      console.error('[MultiSig] Signature failed:', e);
    }
    setSigning(false);
  };

  const remaining = requiredSignatures - signatures.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Multi-Signature Authorization Required"
      maxWidth={480}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
        </div>
      }
    >
      <div className="multisig-content">
        <div className="m2-info-bar" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
          <Lock size={13} style={{ color: '#d97706' }} />
          <span>This proposal exceeds the high-value threshold. {requiredSignatures} board member signatures are required.</span>
        </div>

        <div className="multisig-proposal-summary">
          <div className="multisig-label">Proposal</div>
          <div className="multisig-value">{proposal?.title}</div>
          <div className="multisig-label" style={{ marginTop: 'var(--space-2)' }}>Estimated Cost</div>
          <div className="multisig-value">${proposal?.resourceEstimate?.costUSD?.toLocaleString() || '0'}</div>
        </div>

        <div className="multisig-progress">
          <div className="multisig-progress-header">
            <Users size={13} />
            <span>Signatures: {signatures.length} / {requiredSignatures}</span>
            {remaining > 0 && <Badge color="amber">{remaining} remaining</Badge>}
            {remaining <= 0 && <Badge color="emerald">Complete</Badge>}
          </div>

          {signatures.map((sig, i) => (
            <div key={i} className="multisig-sig-entry">
              <CheckCircle size={12} style={{ color: '#059669' }} />
              <span>{sig.signerId}</span>
              <span className="multisig-sig-time">
                {new Date(sig.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        {remaining > 0 && (
          <div className="multisig-input-row">
            <input
              className="input"
              placeholder="Board member ID or email"
              value={currentSigner}
              onChange={(e) => setCurrentSigner(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSign()}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSign}
              disabled={!currentSigner.trim() || signing}
            >
              {signing ? 'Signing...' : 'Sign'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export { MultiSigModal };
