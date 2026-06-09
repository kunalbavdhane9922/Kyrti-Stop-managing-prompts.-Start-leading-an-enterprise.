import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader } from 'lucide-react';
import { CryptoService } from '../../security/CryptoService.js';

/**
 * Sovereign Protocol — Merkle Log Entry (Module 4)
 * Single audit row with SHA-256 hash and client-side verification.
 */
function MerkleLogEntry({ entry }) {
  const [verifyState, setVerifyState] = useState('idle'); // idle | verifying | valid | invalid

  const handleVerify = async () => {
    setVerifyState('verifying');
    try {
      const { hash, ...data } = entry;
      const dataString = JSON.stringify(data);
      const recomputed = await CryptoService.hash(dataString);
      setVerifyState(recomputed === hash ? 'valid' : 'invalid');
    } catch {
      setVerifyState('invalid');
    }
  };

  const severityClass = {
    info: 'severity-info',
    warning: 'severity-warning',
    critical: 'severity-critical',
  };

  return (
    <tr className="merkle-log-row">
      <td>
        <span className={`merkle-severity ${severityClass[entry.severity] || 'severity-info'}`}>
          {entry.severity || 'info'}
        </span>
      </td>
      <td className="merkle-action">{entry.action}</td>
      <td className="merkle-actor">{entry.userId || 'system'}</td>
      <td className="merkle-timestamp">
        {new Date(entry.timestamp).toLocaleString('en-US', {
          month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
        })}
      </td>
      <td className="merkle-hash" title={entry.hash}>
        {entry.hash ? `${entry.hash.slice(0, 8)}...${entry.hash.slice(-6)}` : '—'}
      </td>
      <td className="merkle-verify">
        {verifyState === 'idle' && (
          <button className="btn btn-ghost btn-sm" onClick={handleVerify} title="Verify integrity">
            <ShieldCheck size={13} /> Verify
          </button>
        )}
        {verifyState === 'verifying' && <Loader size={13} className="animate-spin" />}
        {verifyState === 'valid' && <span className="merkle-valid"><ShieldCheck size={13} /> Valid</span>}
        {verifyState === 'invalid' && <span className="merkle-invalid"><ShieldAlert size={13} /> Tampered</span>}
      </td>
    </tr>
  );
}

export { MerkleLogEntry };
