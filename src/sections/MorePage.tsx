import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/GlassCard';
import CollapsibleSection from '@/components/CollapsibleSection';
import ProfileCard from '@/components/ProfileCard';
import ProfileEditModal from '@/components/ProfileEditModal';
import CreateCourseModal from '@/components/CreateCourseModal';
import ReferralCard from '@/components/ReferralCard';
import FeatureLock from '@/components/FeatureLock';
import CourseProgressItem from '@/components/CourseProgressItem';
import ExamRecordItem from '@/components/ExamRecordItem';
import {
  BookOpen, BarChart3, Clock, FileDown, Wifi,
  MessageSquare, HelpCircle, Settings,
  Trash2, CreditCard, LogOut, GraduationCap, Sun, CheckCircle,
  Activity, TrendingUp, Share2
} from 'lucide-react';

export default function MorePage() {
  const { state, dispatch, navigate, showToast } = useApp();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showCreateCourse, setShowCreateCourse] = useState(false);

  // AI Study Prescription
  const prescription = useMemo(() => {
    const stats: Record<string, { sum: number; count: number }> = {};
    state.history.forEach(h => {
      if (!stats[h.subject]) stats[h.subject] = { sum: 0, count: 0 };
      stats[h.subject].sum += h.pct;
      stats[h.subject].count++;
    });
    const subjects = Object.entries(stats)
      .map(([subject, d]) => ({ subject, pct: Math.round(d.sum / d.count), count: d.count }))
      .sort((a, b) => a.pct - b.pct);
    const weakest = subjects[0];
    const advice = weakest
      ? `Focus on ${weakest.subject} - your average is ${weakest.pct}%. Spend extra time reviewing past questions in this area.`
      : 'Take more exams to get personalized study recommendations.';
    return { subjects, advice };
  }, [state.history]);

  // Exam Score Predictor
  const prediction = useMemo(() => {
    const recent = state.history.slice(-10);
    if (recent.length === 0) return null;
    const weights = recent.map((_, i) => i + 1);
    const totalWeight = weights.reduce((s, w) => s + w, 0);
    const weightedAvg = Math.round(
      recent.reduce((s, h, i) => s + h.pct * weights[i], 0) / totalWeight
    );
    const trend = recent.length >= 2
      ? recent[recent.length - 1].pct - recent[0].pct
      : 0;
    return {
      score: weightedAvg,
      confidence: Math.min(95, 50 + recent.length * 5),
      trend,
      sessions: recent.length,
    };
  }, [state.history]);

  // Course progress
  const courseProgress = useMemo(() => {
    return state.courses
      .filter(c => c.questions.length > 0)
      .map(c => {
        const sHist = state.history.filter(h => h.subject === c.subject);
        const covered = sHist.length > 0
          ? Math.min(100, Math.round((sHist.reduce((a, b) => a + b.total, 0) / Math.max(c.questions.length, 1)) * 100))
          : 0;
        const avgPct = sHist.length > 0 ? Math.round(sHist.reduce((a, b) => a + b.pct, 0) / sHist.length) : 0;
        return { subject: c.subject, icon: c.icon, covered, avgPct, attempts: sHist.length };
      });
  }, [state.courses, state.history]);

  // Days left
  const daysLeft = state.examDate
    ? Math.ceil((new Date(state.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleSaveProfile = (profile: Partial<typeof state.profile>) => {
    dispatch({ type: 'SET_PROFILE', profile });
    showToast('Profile saved!');
  };

  const handleCreateCourse = (course: typeof state.courses[0]) => {
    dispatch({ type: 'ADD_COURSE', course });
    showToast(`Course "${course.subject}" created!`);
  };

  const handleDeleteCourse = (subject: string) => {
    if (!confirm(`Delete "${subject}"?`)) return;
    dispatch({ type: 'REMOVE_COURSE', subject });
    showToast('Course deleted');
  };

  const handleSaveExamDate = () => {
    const input = document.getElementById('exam-date-input') as HTMLInputElement;
    if (!input?.value) {
      showToast('Pick a date first');
      return;
    }
    dispatch({ type: 'SET_EXAM_DATE', date: input.value });
    showToast('📅 Exam date saved!');
  };

  const handleClearExamDate = () => {
    dispatch({ type: 'SET_EXAM_DATE', date: null });
  };

  const handleClearHistory = () => {
    if (!confirm('Clear all history?')) return;
    dispatch({ type: 'CLEAR_HISTORY' });
    showToast('History cleared');
  };

  const handleSignOut = () => {
    if (!confirm('Sign out and clear all data?')) return;
    const keys = Object.keys(localStorage).filter(k => k.startsWith('lumiq_'));
    keys.forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  const toggleTheme = () => {
    const next = state.theme === 'dark' ? 'ash' : state.theme === 'ash' ? 'light' : 'dark';
    dispatch({ type: 'SET_THEME', theme: next });
    showToast(`Theme: ${next}`);
  };

  const isPremium = false; // Placeholder for subscription check

  return (
    <div className="px-3.5 pt-4 pb-24">
      {/* Profile Card */}
      <ProfileCard
        profile={state.profile}
        onEdit={() => setShowProfileEdit(true)}
        onChangeSchool={() => navigate('schoolSetup')}
      />

      {/* My Courses */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <BookOpen size={14} strokeWidth={2} /> My Courses
        </div>
        {state.courses.length === 0 ? (
          <div className="text-center py-4 text-[13px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No courses yet. Create one below.
          </div>
        ) : (
          state.courses.map(c => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-xl p-3 mb-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate" style={{ color: '#fff' }}>{c.subject}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {c.questions.length} questions {c.isCustom && <span style={{ color: '#a5b4fc' }}>· Custom</span>}
                </div>
              </div>
              {c.isCustom && (
                <button
                  onClick={() => handleDeleteCourse(c.subject)}
                  className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
        <button
          onClick={() => setShowCreateCourse(true)}
          className="w-full flex items-center justify-center gap-2 mt-2 py-3 rounded-xl text-sm font-bold"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1.5px dashed rgba(99,102,241,0.35)', color: '#a5b4fc' }}
        >
          <BookOpen size={16} strokeWidth={2.5} /> Create New Course
        </button>
      </GlassCard>

      {/* AI Study Prescription */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <CheckCircle size={14} strokeWidth={2} /> AI Study Prescription
        </div>
        {prescription.subjects.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-7 h-7 rounded-full border-[3px] border-t-[#6366f1] animate-spin" style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
            <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Analysing your performance...</span>
          </div>
        ) : (
          <div>
            {prescription.subjects.map(s => (
              <div key={s.subject} className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <div className="text-[13px] font-bold" style={{ color: '#fff' }}>{s.subject}</div>
                  <div className="h-1.5 rounded-sm overflow-hidden mt-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-sm transition-all" style={{ width: `${s.pct}%`, background: s.pct >= 70 ? '#4ade80' : s.pct >= 50 ? '#fbbf24' : '#f87171' }} />
                  </div>
                </div>
                <span className="text-xs font-bold font-mono w-10 text-right" style={{ color: s.pct >= 70 ? '#4ade80' : s.pct >= 50 ? '#fbbf24' : '#f87171' }}>{s.pct}%</span>
              </div>
            ))}
            <div className="mt-3 rounded-xl p-3 text-[13px] leading-relaxed" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
              {prescription.advice}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Exam Score Predictor */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Activity size={14} strokeWidth={2} /> Exam Score Predictor
        </div>
        {!prediction ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-7 h-7 rounded-full border-[3px] animate-spin" style={{ borderColor: 'rgba(245,158,11,0.2)', borderTopColor: '#f59e0b' }} />
            <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Crunching your data...</span>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative w-[100px] h-[100px] mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={prediction.score >= 70 ? '#4ade80' : prediction.score >= 50 ? '#fbbf24' : '#f87171'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(prediction.score / 100) * 264} 264`}
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold font-mono" style={{ color: '#fff' }}>{prediction.score}%</span>
                <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>predicted</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="block text-lg font-extrabold font-mono" style={{ color: '#fff' }}>{prediction.confidence}%</span>
                <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>confidence</span>
              </div>
              <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="block text-lg font-extrabold font-mono" style={{ color: prediction.trend >= 0 ? '#4ade80' : '#f87171' }}>
                  {prediction.trend >= 0 ? '↗' : '↘'} {Math.abs(prediction.trend)}%
                </span>
                <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>trend</span>
              </div>
            </div>
            <div className="text-xs leading-relaxed rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)' }}>
              Based on {prediction.sessions} recent session{prediction.sessions !== 1 ? 's' : ''}. {prediction.score >= 70 ? 'You\'re on track for excellence!' : prediction.score >= 50 ? 'Consistent practice will improve your score.' : 'Focus on weak areas to boost your predicted score.'}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Course Progress */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <BarChart3 size={14} strokeWidth={2} /> Course Progress
        </div>
        {courseProgress.length === 0 ? (
          <div className="text-center py-4 text-[13px]" style={{ color: 'rgba(255,255,255,0.28)' }}>Take exams to track progress.</div>
        ) : (
          courseProgress.map(c => (
            <CourseProgressItem key={c.subject} {...c} />
          ))
        )}
      </GlassCard>

      {/* Exam Countdown */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Clock size={14} strokeWidth={2} /> Exam Countdown
        </div>
        {daysLeft !== null && daysLeft >= 0 ? (
          <div className="flex items-center gap-4 py-1 mb-3">
            <div className="text-center min-w-[52px]">
              <div className="text-[44px] font-extrabold font-mono leading-none tracking-tight" style={{ color: '#fff' }}>{daysLeft}</div>
              <div className="text-[9px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>days left</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold" style={{ color: '#fff' }}>{daysLeft <= 3 ? 'Exam very soon!' : daysLeft <= 7 ? 'Exam coming up!' : 'Countdown active'}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {state.examDate && new Date(state.examDate).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs mb-2.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Set your exam date to track the countdown on the home screen.
          </div>
        )}
        <div className="flex gap-2">
          <input
            id="exam-date-input"
            type="date"
            defaultValue={state.examDate || ''}
            min={new Date().toISOString().split('T')[0]}
            className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff' }}
          />
          <button
            onClick={handleSaveExamDate}
            className="px-4 py-2.5 rounded-xl text-xs font-bold flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
          >
            Save
          </button>
        </div>
        {state.examDate && (
          <button
            onClick={handleClearExamDate}
            className="w-full mt-2 py-2 rounded-xl text-[11px] font-bold"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
          >
            Clear date
          </button>
        )}
      </GlassCard>

      {/* PDF Downloads */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <FileDown size={14} strokeWidth={2} /> Download PDF
        </div>
        {!isPremium && (
          <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 mb-3 text-xs" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)', color: 'rgba(16,185,129,0.85)' }}>
            <FileDown size={14} strokeWidth={2} /> Upgrade to Semester to unlock PDF downloads
          </div>
        )}
        {state.courses.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl p-3 mb-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', cursor: isPremium ? 'pointer' : 'default', opacity: isPremium ? 1 : 0.45 }}
            onClick={() => isPremium && showToast('PDF download feature coming soon!')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)', fontSize: '16px' }}>{c.icon}</div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{c.subject}</div>
                <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.questions.length} questions</div>
              </div>
            </div>
            <FileDown size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </div>
        ))}
      </GlassCard>

      {/* Offline Mode */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Wifi size={14} strokeWidth={2} /> Offline Mode
        </div>
        <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 mb-2" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <Wifi size={18} strokeWidth={2} style={{ color: '#10b981' }} />
          <div className="flex-1">
            <div className="text-xs font-bold" style={{ color: '#6ee7b7' }}>Offline mode active</div>
            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {state.courses.reduce((t, c) => t + c.questions.length, 0)} questions cached
            </div>
          </div>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: navigator.onLine ? '#4ade80' : '#fbbf24' }} />
        </div>
        <div className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Questions are automatically cached when you're online. All questions are available offline.
        </div>
      </GlassCard>

      {/* Refer & Earn */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Share2 size={14} strokeWidth={2} /> Refer & Earn
        </div>
        <ReferralCard />
      </GlassCard>

      {/* Premium Features */}
      <GlassCard>
        <FeatureLock featureName="👥 Peer Tutoring" />
      </GlassCard>
      <GlassCard>
        <FeatureLock featureName="⚔️ Live CBT Battles" />
      </GlassCard>
      <GlassCard>
        <FeatureLock featureName="👨‍👩‍👧 Parent Dashboard" />
      </GlassCard>
      <GlassCard>
        <FeatureLock featureName="💬 WhatsApp Practice Bot" />
      </GlassCard>

      {/* History */}
      <CollapsibleSection title="History" icon={TrendingUp}>
        {state.history.length === 0 ? (
          <div className="text-center py-4 text-[13px]" style={{ color: 'rgba(255,255,255,0.28)' }}>No exams taken yet.</div>
        ) : (
          state.history.sort((a, b) => b.ts - a.ts).slice(0, 20).map((h, i) => (
            <ExamRecordItem key={i} record={h} />
          ))
        )}
      </CollapsibleSection>

      {/* Help & Support */}
      <CollapsibleSection title="Help & Support" icon={HelpCircle}>
        {/* Intro */}
        <div className="flex items-start gap-2.5 rounded-xl p-3.5 mb-3.5" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.16)' }}>
          <span className="text-xl flex-shrink-0 mt-0.5">👋</span>
          <div>
            <div className="text-[13px] font-bold mb-0.5" style={{ color: '#fff' }}>We're here to help</div>
            <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>Having trouble? Reach out directly — we reply fast.</div>
          </div>
        </div>

        {/* WhatsApp */}
        <a
          href="https://wa.me/2348143895403?text=Hi%2C%20I%20need%20help%20with%20Lumiq"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-2.5 no-underline transition-colors"
          style={{ background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.22)', color: 'inherit' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)' }}>
            <MessageSquare size={20} style={{ color: '#25d366' }} />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-bold" style={{ color: '#25d366' }}>Chat on WhatsApp</div>
            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>+234 814 389 5403</div>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:shalomegiga@gmail.com?subject=Lumiq%20Support"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-3.5 no-underline"
          style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', color: 'inherit' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-bold" style={{ color: '#a5b4fc' }}>Send an Email</div>
            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>shalomegiga@gmail.com</div>
          </div>
        </a>

        {/* FAQ */}
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Common Questions</div>
        {[
          { icon: '💳', q: 'Payment not working?', a: 'Message us on WhatsApp with your email.' },
          { icon: '📚', q: 'How do I add more courses?', a: 'Go to More → Create New Course.' },
          { icon: '🔑', q: 'Forgot my account?', a: 'Send us your registered email via WhatsApp.' },
          { icon: '📄', q: 'How do I download PDFs?', a: 'Upgrade to Semester plan for PDF downloads.' },
        ].map((faq, i) => (
          <details key={i} className="rounded-xl px-3.5 py-3 mb-2 cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <summary className="flex items-center gap-2 text-xs font-bold list-none" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <span className="text-base">{faq.icon}</span>
              <span className="flex-1">{faq.q}</span>
            </summary>
            <div className="text-xs leading-relaxed mt-2 pt-2" style={{ color: 'rgba(255,255,255,0.45)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {faq.a}
            </div>
          </details>
        ))}
      </CollapsibleSection>

      {/* Settings */}
      <CollapsibleSection title="Settings" icon={Settings}>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => navigate('schoolSetup')}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          >
            <GraduationCap size={14} strokeWidth={2} /> Change School
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          >
            <Sun size={14} strokeWidth={2} /> Toggle Theme
          </button>
        </div>
        <button
          onClick={handleClearHistory}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold mb-2"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
        >
          <Trash2 size={14} strokeWidth={2} /> Clear History
        </button>
        <button
          onClick={() => showToast('Subscription management coming soon!')}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold mb-2"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
        >
          <CreditCard size={14} strokeWidth={2} /> Manage Subscription
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-2xl text-sm font-bold"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.25)', color: '#f87171' }}
        >
          <LogOut size={16} strokeWidth={2.5} /> Sign Out
        </button>
      </CollapsibleSection>

      {/* Modals */}
      <ProfileEditModal
        isOpen={showProfileEdit}
        profile={state.profile}
        onSave={handleSaveProfile}
        onClose={() => setShowProfileEdit(false)}
      />
      <CreateCourseModal
        isOpen={showCreateCourse}
        onSave={handleCreateCourse}
        onClose={() => setShowCreateCourse(false)}
      />
    </div>
  );
}
