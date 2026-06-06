import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import type { Course, ExamRecord, StudentProfile, StreakInfo, LeaderboardEntry, Page, Theme, ChatMessage } from '@/types';
import { getDemoCourses, defaultProfile } from '@/lib/demoData';

interface AppState {
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
  referralCode: string;
  referralUsed: string | null;
}

type Action =
  | { type: 'NAVIGATE'; page: Page }
  | { type: 'GO_BACK' }
  | { type: 'SET_COURSES'; courses: Course[] }
  | { type: 'ADD_COURSE'; course: Course }
  | { type: 'REMOVE_COURSE'; subject: string }
  | { type: 'SET_CURRENT_SUBJECT'; index: number | null }
  | { type: 'ADD_HISTORY'; record: ExamRecord }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_PROFILE'; profile: Partial<StudentProfile> }
  | { type: 'UPDATE_STREAK' }
  | { type: 'UPDATE_LEADERBOARD'; record: ExamRecord }
  | { type: 'SET_EXAM_DATE'; date: string | null }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'ADD_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_REFERRAL_CODE'; code: string }
  | { type: 'SET_REFERRAL_USED'; code: string }
  | { type: 'LOAD_STATE'; state: Partial<AppState> };

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = window.localStorage.getItem(`lumiq_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function getInitialState(): AppState {
  const savedCourses = loadFromStorage<Course[]>('courses', []);
  const courses = savedCourses.length > 0 ? savedCourses : getDemoCourses();

  return {
    page: 'home',
    prevPage: null,
    courses,
    currentSubjectIndex: null,
    history: loadFromStorage<ExamRecord[]>('history', []),
    profile: loadFromStorage<StudentProfile>('profile', { ...defaultProfile }),
    streak: loadFromStorage<StreakInfo>('streak', { current: 0, best: 0, lastDate: null }),
    leaderboard: loadFromStorage<Record<string, LeaderboardEntry>>('leaderboard', {}),
    examDate: loadFromStorage<string | null>('examDate', null),
    theme: loadFromStorage<Theme>('theme', 'dark'),
    chatMessages: loadFromStorage<ChatMessage[]>('chatMessages', []),
    toast: null,
    referralCode: loadFromStorage<string>('referralCode', ''),
    referralUsed: loadFromStorage<string | null>('referralUsed', null),
  };
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, prevPage: state.page, page: action.page };
    case 'GO_BACK':
      return { ...state, page: state.prevPage ?? 'home', prevPage: null };
    case 'SET_COURSES':
      return { ...state, courses: action.courses };
    case 'ADD_COURSE': {
      const exists = state.courses.some(c => c.subject.toLowerCase() === action.course.subject.toLowerCase());
      if (exists) return state;
      const newCourses = [...state.courses, action.course];
      localStorage.setItem('lumiq_courses', JSON.stringify(newCourses));
      return { ...state, courses: newCourses };
    }
    case 'REMOVE_COURSE': {
      const newCourses = state.courses.filter(c => c.subject !== action.subject);
      localStorage.setItem('lumiq_courses', JSON.stringify(newCourses));
      return { ...state, courses: newCourses };
    }
    case 'SET_CURRENT_SUBJECT':
      return { ...state, currentSubjectIndex: action.index };
    case 'ADD_HISTORY': {
      const newHistory = [...state.history, action.record];
      localStorage.setItem('lumiq_history', JSON.stringify(newHistory));
      return { ...state, history: newHistory };
    }
    case 'CLEAR_HISTORY':
      localStorage.removeItem('lumiq_history');
      return { ...state, history: [] };
    case 'SET_PROFILE': {
      const newProfile = { ...state.profile, ...action.profile };
      localStorage.setItem('lumiq_profile', JSON.stringify(newProfile));
      return { ...state, profile: newProfile };
    }
    case 'UPDATE_STREAK': {
      const today = new Date().toISOString().split('T')[0];
      const data = state.streak;
      if (data.lastDate === today) return state;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const current = data.lastDate === yesterday ? (data.current || 0) + 1 : 1;
      const best = Math.max(current, data.best || 0);
      const newStreak = { current, best, lastDate: today };
      localStorage.setItem('lumiq_streak', JSON.stringify(newStreak));
      return { ...state, streak: newStreak };
    }
    case 'UPDATE_LEADERBOARD': {
      const name = state.profile.name || 'Student';
      if (!name) return state;
      const key = `${name}|${action.record.subject}`;
      const lb = { ...state.leaderboard };
      if (!lb[key] || action.record.pct > lb[key].pct) {
        lb[key] = {
          name,
          subject: action.record.subject,
          icon: action.record.icon,
          pct: action.record.pct,
          date: action.record.date,
        };
      }
      localStorage.setItem('lumiq_leaderboard', JSON.stringify(lb));
      return { ...state, leaderboard: lb };
    }
    case 'SET_EXAM_DATE':
      if (action.date) {
        localStorage.setItem('lumiq_examDate', action.date);
      } else {
        localStorage.removeItem('lumiq_examDate');
      }
      return { ...state, examDate: action.date };
    case 'SET_THEME': {
      localStorage.setItem('lumiq_theme', action.theme);
      document.body.classList.remove('light', 'ash');
      if (action.theme === 'light') document.body.classList.add('light');
      else if (action.theme === 'ash') document.body.classList.add('ash');
      return { ...state, theme: action.theme };
    }
    case 'ADD_CHAT_MESSAGE': {
      const msgs = [...state.chatMessages, action.message].slice(-100);
      localStorage.setItem('lumiq_chatMessages', JSON.stringify(msgs));
      return { ...state, chatMessages: msgs };
    }
    case 'SHOW_TOAST':
      return { ...state, toast: action.message };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'SET_REFERRAL_CODE': {
      localStorage.setItem('lumiq_referralCode', action.code);
      return { ...state, referralCode: action.code };
    }
    case 'SET_REFERRAL_USED': {
      localStorage.setItem('lumiq_referralUsed', action.code);
      return { ...state, referralUsed: action.code };
    }
    case 'LOAD_STATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  navigate: (page: Page) => void;
  goBack: () => void;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    document.body.classList.remove('light', 'ash');
    if (state.theme === 'light') document.body.classList.add('light');
    else if (state.theme === 'ash') document.body.classList.add('ash');
  }, [state.theme]);

  const navigate = useCallback((page: Page) => {
    dispatch({ type: 'NAVIGATE', page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  const showToast = useCallback((message: string) => {
    dispatch({ type: 'SHOW_TOAST', message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 2500);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, navigate, goBack, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
