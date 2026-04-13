// CEO Schedule data for Work Calendar
export const ceoScheduleYear = 2024;
export const ceoScheduleMonth = 5; // June (0-indexed, so 5 = June)

// Calendar events for the CEO
export const ceoEvents = [
  // Monday, June 10
  {
    id: 'event-001',
    title: 'WWDC',
    date: '2024-06-10',
    startTime: '10:00',
    endTime: '11:00',
    category: 'conference',
    color: '#4CAF50', // green
  },
  // Tuesday, June 11
  {
    id: 'event-002',
    title: 'Brunch at Bobby\'s',
    date: '2024-06-11',
    startTime: '10:30',
    endTime: '11:30',
    category: 'personal',
    color: '#F4A261',
  },
  {
    id: 'event-003',
    title: 'App Clips Consultation',
    date: '2024-06-11',
    startTime: '12:00',
    endTime: '14:00',
    category: 'meeting',
    color: '#F4A261',
  },
  // Wednesday, June 12
  {
    id: 'event-004',
    title: 'Swift Labs',
    date: '2024-06-12',
    startTime: '11:00',
    endTime: '12:00',
    category: 'workshop',
    color: '#0099FF', // light blue
  },
  {
    id: 'event-005',
    title: 'Accessibility Lab',
    date: '2024-06-12',
    startTime: '14:00',
    endTime: '16:00',
    category: 'workshop',
    color: '#0099FF',
  },
  // Thursday, June 13 (highlighted as today)
  {
    id: 'event-006',
    title: 'Morning Run',
    date: '2024-06-13',
    startTime: '09:00',
    endTime: '10:00',
    category: 'personal',
    color: '#F4A261',
  },
  {
    id: 'event-007',
    title: 'Team Meeting',
    date: '2024-06-13',
    startTime: '10:00',
    endTime: '11:00',
    category: 'meeting',
    color: '#F4A261',
  },
  {
    id: 'event-008',
    title: 'ARKit Consultation',
    date: '2024-06-13',
    startTime: '12:00',
    endTime: '13:30',
    category: 'meeting',
    color: '#E8B4FF', // light purple
  },
  // Friday, June 14
  {
    id: 'event-009',
    title: 'Design Consultation Lab',
    date: '2024-06-14',
    startTime: '11:00',
    endTime: '12:30',
    category: 'meeting',
    color: '#0099FF',
  },
  {
    id: 'event-010',
    title: 'UX Writing Consultation',
    date: '2024-06-14',
    startTime: '13:00',
    endTime: '14:00',
    category: 'meeting',
    color: '#0099FF',
  },
  {
    id: 'event-011',
    title: 'Team Meeting',
    date: '2024-06-14',
    startTime: '15:00',
    endTime: '16:00',
    category: 'meeting',
    color: '#F4A261',
  },
  // Saturday, June 15
  {
    id: 'event-012',
    title: 'Meet at the Ferry',
    date: '2024-06-15',
    startTime: '11:00',
    endTime: '12:00',
    category: 'personal',
    color: '#4CAF50',
  },
  {
    id: 'event-013',
    title: 'SF City Tour',
    date: '2024-06-15',
    startTime: '12:00',
    endTime: '15:00',
    category: 'personal',
    color: '#4CAF50',
  },
  // Sunday, June 16
  {
    id: 'event-014',
    title: 'Check-in',
    date: '2024-06-16',
    startTime: '13:55',
    endTime: '14:15',
    category: 'meeting',
    color: '#0099FF',
  },
];

// Team members for the "Meet with" section
export const teamMembers = [
  {
    id: 'member-001',
    name: 'Kevin Bateman',
    email: 'kbateman@sparkmail.com',
    initials: 'KB',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop',
  },
  {
    id: 'member-002',
    name: 'Savannah Nguyen',
    email: 'email@sparkmail.com',
    initials: 'SN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop',
  },
];

// Upcoming meeting details
export const nextMeeting = {
  id: 'event-007',
  title: 'Team Meeting',
  date: '2024-06-13',
  startTime: '10:00',
  endTime: '11:00',
  timeUntil: '15 minutes',
  image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=80&fit=crop',
};
