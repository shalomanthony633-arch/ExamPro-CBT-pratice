export interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Course {
  id: string;
  subject: string;
  icon: string;
  questions: Question[];
  isCustom?: boolean;
}

export interface ExamRecord {
  subject: string;
  icon: string;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  pct: number;
  mode: 'Exam' | 'Practice';
  timeTaken: number;
  date: string;
  time: string;
  ts: number;
}

export interface StudentProfile {
  name: string;
  level: string;
  age: string;
  gender: string;
  matric: string;
  phone: string;
  state: string;
  school: string;
  department: string;
  courses: string[];
}

export interface StreakInfo {
  current: number;
  best: number;
  lastDate: string | null;
}

export interface LeaderboardEntry {
  name: string;
  subject: string;
  icon: string;
  pct: number;
  date: string;
}

export type Page =
  | 'home'
  | 'subject'
  | 'exam'
  | 'results'
  | 'board'
  | 'chat'
  | 'more'
  | 'scan'
  | 'tutor'
  | 'schoolSetup';

export type Theme = 'dark' | 'ash' | 'light';

export interface ScanState {
  selectedCourse: number | null;
  imageBase64: string | null;
  imageMimeType: string | null;
  generatedQuestions: Question[];
  selectedCount: number;
  step: 'course' | 'upload' | 'loading' | 'adjuster' | 'error';
  errorMsg: string;
}

export interface ChatMessage {
  id: string;
  name: string;
  text: string;
  ts: number;
  isMe: boolean;
}

export interface AppState {
  page: Page;
  prevPage: Page | null;
  courses: Course[];
  currentSubjectIndex: number | null;
  history: ExamRecord[];
  profile: StudentProfile;
  streak: StreakInfo;
  leaderboard: Record<string, LeaderboardEntry>;
  examDate: string | null;
  theme: Theme;
  chatMessages: ChatMessage[];
  toast: string | null;
  scanState: ScanState;
  referralCode: string;
  referralUsed: string | null;
}
