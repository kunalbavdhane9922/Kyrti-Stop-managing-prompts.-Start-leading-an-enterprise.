import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Users, Video, Plus, ChevronRight,
  Phone, Briefcase, Star, ArrowRight
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { useMeetingStore } from '../store/meetingStore.js';
import {
  DIGITAL_PROFESSIONALS,
  getParticipantNames,
} from '../data/marketplaceData.js';

/**
 * Sovereign Protocol — Meeting Schedule
 * Schedule and manage meetings with AI Digital Professionals
 */

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.2 } } },
};

const DOMAIN_COLORS = {
  executive: '#FF5C00', engineering: '#1298B0', product: '#f59e0b',
  marketing: '#a855f7', operations: '#10b981', finance: '#06b6d4',
  design: '#ec4899', data: '#6366f1', legal: '#78716c',
};

export function MeetingSchedulePage() {
  const navigate = useNavigate();
  const meetings = useMeetingStore(s => s.meetings);
  const addMeeting = useMeetingStore(s => s.addMeeting);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'standup',
    participants: [],
    datetime: '',
    duration: 30,
    agenda: '',
  });

  const formatMeetingTime = (isoTime) => {
    const d = new Date(isoTime);
    const now = new Date();
    const diff = d - now;

    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (diff < 0) return { time, date: 'Ended', relative: 'Past' };
    if (diff < 3600000) return { time, date: 'Today', relative: `In ${Math.ceil(diff / 60000)} min` };
    if (diff < 86400000) return { time, date: 'Today', relative: `In ${Math.ceil(diff / 3600000)} hrs` };
    if (diff < 172800000) return { time, date: 'Tomorrow', relative: 'Tomorrow' };
    return {
      time,
      date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      relative: d.toLocaleDateString([], { weekday: 'short' }),
    };
  };

  const handleSchedule = () => {
    if (!formData.title || !formData.datetime || formData.participants.length === 0) return;
    addMeeting({
      title: formData.title,
      type: formData.type,
      scriptKey: null,
      participants: formData.participants,
      scheduledTime: new Date(formData.datetime).toISOString(),
      duration: formData.duration,
      agenda: formData.agenda,
    });
    setShowScheduleForm(false);
    setFormData({ title: '', type: 'standup', participants: [], datetime: '', duration: 30, agenda: '' });
  };

  const handleJoinMeeting = (meeting) => {
    if (meeting.type === 'interview' && meeting.participants.length === 1) {
      navigate(`/interview/${meeting.participants[0]}`);
    } else {
      navigate(`/meeting-room/${meeting.id}`);
    }
  };

  const toggleParticipant = (id) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(id)
        ? prev.participants.filter(p => p !== id)
        : [...prev.participants, id],
    }));
  };

  const sortedMeetings = [...meetings].sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));

  return (
    <motion.div variants={anim.container} initial="hidden" animate="show" style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
      height: '100%', padding: 'var(--space-2) 0',
    }}>
      {/* Header */}
      <motion.div variants={anim.item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 2 }}>Meeting Schedule</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)' }}>
            Schedule and join meetings with your AI workforce.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowScheduleForm(!showScheduleForm)}>
          <Plus size={14} style={{ marginRight: 6 }} /> Schedule Meeting
        </Button>
      </motion.div>

      {/* Schedule Form */}
      {showScheduleForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          className="schedule-form"
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
            New Meeting
          </div>
          <div className="schedule-form-grid">
            <div className="schedule-form-field">
              <label>Meeting Title</label>
              <input
                type="text" placeholder="e.g., Engineering Standup"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="schedule-form-field">
              <label>Meeting Type</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="standup">Team Standup</option>
                <option value="executive">Executive Briefing</option>
                <option value="interview">Interview</option>
                <option value="project_review">Project Review</option>
              </select>
            </div>
            <div className="schedule-form-field">
              <label>Date & Time</label>
              <input
                type="datetime-local"
                value={formData.datetime}
                onChange={e => setFormData({ ...formData, datetime: e.target.value })}
              />
            </div>
            <div className="schedule-form-field">
              <label>Duration (minutes)</label>
              <select value={formData.duration} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
            <div className="schedule-form-field" style={{ gridColumn: '1 / -1' }}>
              <label>Agenda</label>
              <textarea
                rows={2} placeholder="Meeting agenda..."
                value={formData.agenda}
                onChange={e => setFormData({ ...formData, agenda: e.target.value })}
              />
            </div>
            <div className="schedule-form-field" style={{ gridColumn: '1 / -1' }}>
              <label>Select AI Participants</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {DIGITAL_PROFESSIONALS.filter(p => p.status === 'AVAILABLE').map(p => (
                  <button
                    key={p.id}
                    onClick={() => toggleParticipant(p.id)}
                    style={{
                      padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s',
                      border: `1px solid ${formData.participants.includes(p.id) ? 'var(--color-highlight-1)' : 'var(--color-border-primary)'}`,
                      background: formData.participants.includes(p.id) ? 'rgba(18,152,176,0.1)' : 'var(--color-bg-tertiary)',
                      color: formData.participants.includes(p.id) ? 'var(--color-highlight-1)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {p.initials} • {p.profession.split(' ').slice(-2).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowScheduleForm(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSchedule} disabled={!formData.title || !formData.datetime || formData.participants.length === 0}>
              Schedule Meeting
            </Button>
          </div>
        </motion.div>
      )}

      {/* Meetings List */}
      <motion.div variants={anim.item} style={{ flex: 1, overflowY: 'auto' }}>
        <div className="meetings-upcoming">
          {sortedMeetings.map(meeting => {
            const timeInfo = formatMeetingTime(meeting.scheduledTime);
            const participants = getParticipantNames(meeting.participants);
            const isStartingSoon = meeting.status === 'starting_soon';

            return (
              <div key={meeting.id} className="meeting-card" onClick={() => handleJoinMeeting(meeting)}>
                {/* Time */}
                <div className="meeting-card-time">
                  <div className="time">{timeInfo.time}</div>
                  <div className="date">{timeInfo.date}</div>
                </div>

                <div className="meeting-card-divider" />

                {/* Info */}
                <div className="meeting-card-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h4>{meeting.title}</h4>
                    <span className={`meeting-type-badge ${meeting.type}`}>{meeting.type.replace('_', ' ')}</span>
                  </div>
                  <div className="agenda">{meeting.agenda}</div>
                  <div className="meeting-card-participants" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {participants.map((p, i) => (
                      <div
                        key={p.id}
                        className="meeting-card-participant"
                        style={{ background: DOMAIN_COLORS[DIGITAL_PROFESSIONALS.find(dp => dp.id === p.id)?.domain] || '#3c4043' }}
                        title={`${p.name} — ${p.profession}`}
                      >
                        {p.initials}
                      </div>
                    ))}
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 8 }}>
                      {participants.map(p => p.name.split(' ')[0]).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="meeting-card-actions">
                  {isStartingSoon ? (
                    <span className="meeting-status-badge starting_soon">● Starting Soon</span>
                  ) : (
                    <span className="meeting-status-badge scheduled">{timeInfo.relative}</span>
                  )}
                  <Button
                    variant={isStartingSoon ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleJoinMeeting(meeting); }}
                  >
                    <Video size={12} style={{ marginRight: 4 }} />
                    {isStartingSoon ? 'Join Now' : 'Join'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {sortedMeetings.length === 0 && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
            No meetings scheduled. Click "Schedule Meeting" to create one.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
