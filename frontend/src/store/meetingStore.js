/**
 * Sovereign Protocol — Meeting & Notification Store
 * Manages meeting state, scheduling, and real-time notifications.
 */

import { create } from 'zustand';
import {
  SCHEDULED_MEETINGS,
  MEETING_NOTIFICATIONS,
} from '../data/marketplaceData.js';

const useMeetingStore = create((set, get) => ({
  // Scheduled meetings
  meetings: SCHEDULED_MEETINGS.map(m => ({ ...m })),

  // Notifications
  notifications: MEETING_NOTIFICATIONS.map(n => ({ ...n })),

  // Active meeting state
  activeMeeting: null,
  isMeetingActive: false,

  // Notification panel visibility
  showNotifications: false,

  // Actions
  toggleNotifications: () => set(state => ({
    showNotifications: !state.showNotifications,
  })),

  closeNotifications: () => set({ showNotifications: false }),

  markNotificationRead: (id) => set(state => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),

  markAllRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
  })),

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },

  startMeeting: (meetingId) => {
    const meeting = get().meetings.find(m => m.id === meetingId);
    if (meeting) {
      set({
        activeMeeting: { ...meeting, startedAt: new Date().toISOString() },
        isMeetingActive: true,
      });
    }
  },

  endMeeting: () => set({
    activeMeeting: null,
    isMeetingActive: false,
  }),

  addMeeting: (meeting) => set(state => ({
    meetings: [...state.meetings, {
      id: `mtg-${Date.now()}`,
      status: 'scheduled',
      organizer: 'You',
      ...meeting,
    }],
  })),

  reset: () => set({
    meetings: SCHEDULED_MEETINGS.map(m => ({ ...m })),
    notifications: MEETING_NOTIFICATIONS.map(n => ({ ...n })),
    activeMeeting: null,
    isMeetingActive: false,
    showNotifications: false,
  }),
}));

export { useMeetingStore };
