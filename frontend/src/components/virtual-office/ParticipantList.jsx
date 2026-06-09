/**
 * Sovereign Virtual Office — Participant List
 */
import { useVirtualOfficeStore } from '../../store/virtualOfficeStore.js';

export function ParticipantList() {
  const { remotePlayers, participantListOpen, toggleParticipants, localPlayer } = useVirtualOfficeStore();

  if (!participantListOpen) return null;

  const players = Object.values(remotePlayers);
  const online = players.filter(p => p.status !== 'away' && p.status !== 'busy');
  const away = players.filter(p => p.status === 'away' || p.status === 'busy');

  return (
    <div className="vo-participants-panel">
      <div className="vo-panel-header">
        <span>Participants ({players.length + 1})</span>
        <button className="vo-panel-close" onClick={toggleParticipants}>✕</button>
      </div>
      <div className="vo-participants-list">
        {/* Local player */}
        <div className="vo-participant-item self">
          <div className={`vo-status-dot ${localPlayer.status}`} />
          <span className="vo-participant-name">{localPlayer.displayName || 'You'}</span>
          <span className="vo-participant-tag">You</span>
        </div>
        {/* Online */}
        {online.map(p => (
          <div key={p.userId} className="vo-participant-item">
            <div className={`vo-status-dot ${p.status || 'online'}`} />
            <span className="vo-participant-name">{p.displayName}</span>
          </div>
        ))}
        {/* Away/Busy */}
        {away.length > 0 && (
          <>
            <div className="vo-participants-divider">Away / Busy</div>
            {away.map(p => (
              <div key={p.userId} className="vo-participant-item dimmed">
                <div className={`vo-status-dot ${p.status}`} />
                <span className="vo-participant-name">{p.displayName}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
