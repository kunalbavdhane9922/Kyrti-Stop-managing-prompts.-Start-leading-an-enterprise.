import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Clock, ChevronRight, Video, Store, Calendar, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useGovernanceStore } from '../../store/governanceStore.js';
import { useMeetingStore } from '../../store/meetingStore.js';
import { SessionGuard } from '../../security/SessionGuard.js';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { AuditLogger } from '../../security/AuditLogger.js';
import { AUDIT_ACTIONS } from '../../config/constants.js';

/**
 * Sovereign Protocol — TopBar
 * Displays session timer, user info, security status, and meeting notifications.
 */
function TopBar({ sidebarCollapsed }) {
  const user = useAuthStore(s => s.user);
  const isSessionWarning = useAuthStore(s => s.isSessionWarning);
  const logout = useAuthStore(s => s.logout);
  const blockerReports = useGovernanceStore(s => s.blockerReports);
  const location = useLocation();
  const navigate = useNavigate();
  const [remainingSeconds, setRemainingSeconds] = useState(300);

  // Meeting notifications
  const notifications = useMeetingStore(s => s.notifications);
  const showNotifications = useMeetingStore(s => s.showNotifications);
  const toggleNotifications = useMeetingStore(s => s.toggleNotifications);
  const closeNotifications = useMeetingStore(s => s.closeNotifications);
  const markNotificationRead = useMeetingStore(s => s.markNotificationRead);
  const markAllRead = useMeetingStore(s => s.markAllRead);
  const unreadCount = notifications.filter(n => !n.read).length;
  const dropdownRef = useRef(null);

  const unresolvedBlockers = blockerReports.filter(r => r.status === 'PAUSE_STATE').length;

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = SessionGuard.getRemainingTime();
      setRemainingSeconds(Math.ceil(remaining / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeNotifications();
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, closeNotifications]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    AuditLogger.log({ action: AUDIT_ACTIONS.LOGOUT, userId: user?.id });
    logout();
  };

  const handleNotificationAction = (notif) => {
    markNotificationRead(notif.id);
    closeNotifications();
    if (notif.meetingId) {
      navigate(`/meeting-room/${notif.meetingId}`);
    } else if (notif.type === 'marketplace') {
      navigate('/marketplace');
    }
  };

  // Build breadcrumb from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbLabels = {
    dashboard: 'Dashboard',
    identity: 'Identity Matrix',
    treasury: 'Treasury',
    governance: 'Governance',
    audit: 'Audit & Security',
    onboarding: 'Trust Level',
    marketplace: 'Marketplace',
    meetings: 'Meetings',
    'meeting-room': 'Meeting Room',
    interview: 'Interview Room',
  };

  return (
    <header className={`topbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} id="main-topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          <span>Home</span>
          {pathSegments.map((seg, i) => (
            <span key={seg} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <ChevronRight size={14} />
              <span className={i === pathSegments.length - 1 ? 'topbar-breadcrumb-active' : ''}>
                {breadcrumbLabels[seg] || seg}
              </span>
            </span>
          ))}
        </div>

      </div>

      <div className="topbar-right">
        {/* Institutional Status Indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          marginRight: 'var(--space-4)', padding: '4px 8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '4px'
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--color-accent-emerald)',
            boxShadow: '0 0 8px var(--color-accent-emerald)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            color: 'var(--color-accent-emerald)', letterSpacing: '0.05em',
            fontWeight: '600'
          }}>
            ENCRYPTION: AES-256 | STATUS: OPTIMAL | NODES: ACTIVE
          </span>
        </div>

        {/* Meeting Notifications Bell */}
        <div className="notification-bell-wrapper" ref={dropdownRef}>
          <button className="notification-bell" onClick={toggleNotifications}>
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllRead}>Mark all read</button>
                )}
              </div>
              <div className="notification-list">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`notification-item ${!notif.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationAction(notif)}
                  >
                    <div className={`notification-icon ${notif.type.includes('meeting') ? 'meeting' : 'marketplace'}`}>
                      {notif.type.includes('meeting') ? <Video size={16} /> : <Store size={16} />}
                    </div>
                    <div className="notification-content">
                      <h5>{notif.title}</h5>
                      <p>{notif.subtitle}</p>
                      <span className="time">{notif.time}</span>
                    </div>
                    <button
                      className="notification-action"
                      onClick={(e) => { e.stopPropagation(); handleNotificationAction(notif); }}
                    >
                      {notif.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Session Timer */}
        <div className={`topbar-session ${isSessionWarning ? 'animate-glow-rose' : ''}`}
          style={isSessionWarning ? { borderColor: 'var(--color-accent-rose)', border: '1px solid' } : {}}>
          <Clock size={14} />
          <span className="topbar-session-timer" style={isSessionWarning ? { color: 'var(--color-accent-rose)' } : {}}>
            {formatTime(remainingSeconds)}
          </span>
        </div>

        {/* Blocker Reports Notification */}
        {unresolvedBlockers > 0 && (
          <Badge color="rose" icon={Bell}>
            {unresolvedBlockers} Blocker{unresolvedBlockers > 1 ? 's' : ''}
          </Badge>
        )}

        {/* User Info */}
        {user && (
          <div className="topbar-user">
            <div className="topbar-avatar">{user.avatarInitials}</div>
          </div>
        )}

        {/* Logout */}
        <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout} id="logout-btn">
          Logout
        </Button>
      </div>
    </header>
  );
}

export { TopBar };
