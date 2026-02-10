export enum View {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  LECTURES = 'LECTURES',
  LECTURE_DETAIL = 'LECTURE_DETAIL',
  SCHEDULE = 'SCHEDULE',
  QUIZ = 'QUIZ',
  SETTINGS = 'SETTINGS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  avatarUrl: string;
}

export interface Lecture {
  id: string;
  title: string;
  course: string;
  date: string;
  status: 'Processing' | 'Ready' | 'AI Generating';
  progress?: number;
  type: 'PDF' | 'DOCX' | 'MP3' | 'VIDEO';
  description?: string;
}

export interface ScheduledItem {
  id: string;
  title: string;
  time: string;
  type: 'LECTURE' | 'QUIZ' | 'REVIEW' | 'GROUP';
  status: 'UPCOMING' | 'DONE' | 'IN_PROGRESS';
  course: string;
}
