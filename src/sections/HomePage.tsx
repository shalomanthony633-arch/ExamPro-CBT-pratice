import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/GlassCard';
import StatBox from '@/components/StatBox';
import SubjectCard from '@/components/SubjectCard';
import StreakPill from '@/components/StreakPill';
import WeakAreaItem from '@/components/WeakAreaItem';
import { BookOpen, TrendingDown, Calendar } from 'lucide-react';

export default function HomePage() {
  const { state, dispatch, navigate } = useApp();

  const { total, avg, best } = useMemo(() => {
    const h = state.history;
    return {
      total: h.length,
      avg: h.length > 0 ? Math.round(h.reduce((s, r) => s + r.pct, 0) / h.length) : 0,
      best: h.length > 0 ? Math.max(...h.map(r => r.pct)) : 0,
    };
  }, [state.history]);

  const weakAreas = useMemo(() => {
    const stats: Record<string, { total: number; sum: number; count: number }> = {};
    state.history.forEach(h => {
      if (!stats[h.subject]) stats[h.subject] = { total: 0, sum: 0, count: 0 };
      stats[h.subject].total++;
      stats[h.subject].sum += h.pct;
      stats[h.subject].count++;
    });
    return Object.entries(stats)
      .map(([subject, d]) => ({ subject, pct: Math.round(d.sum / d.total), count: d.count }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 3);
  }, [state.history]);

  const daysLeft = state.examDate
    ? Math.ceil((new Date(state.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleSubjectClick = (index: number) => {
    dispatch({ type: 'SET_CURRENT_SUBJECT', index });
    navigate('subject');
  };

  return (
    <div className="px-3.5 pt-4 pb-24">
      {/* Hero Card */}
      <GlassCard className="text-center">
        <div className="flex items-center justify-center mb-3.5">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.6))' }}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <h1 className="text-[28px] font-extrabold tracking-tight" style={{ color: '#fff' }}>Lumiq</h1>
        <p className="text-[13px] font-light mt-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Practice past questions. Ace your exams.
        </p>
        <StreakPill current={state.streak.current} best={state.streak.best} />
        {state.profile.school && (
          <div className="flex justify-center mt-3.5">
            <button
              onClick={() => navigate('schoolSetup')}
              className="inline-flex items-center gap-2 rounded-[20px] px-4 py-[7px] text-xs font-bold max-w-[90%] overflow-hidden"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span className="truncate">{state.profile.school}</span>
            </button>
          </div>
        )}
      </GlassCard>

      {/* Exam Countdown Banner */}
      {daysLeft !== null && daysLeft >= 0 && (
        <div
          className="rounded-2xl p-3.5 mb-3.5 flex items-center gap-3.5"
          style={{
            background: daysLeft <= 3 ? 'rgba(239,68,68,0.07)' : 'rgba(99,102,241,0.07)',
            border: `1px solid ${daysLeft <= 3 ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`,
          }}
        >
          <Calendar size={20} style={{ color: daysLeft <= 3 ? '#f87171' : '#a5b4fc', flexShrink: 0 }} />
          <div className="flex-1">
            <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {daysLeft <= 3 ? '⚡ Exam very soon!' : daysLeft <= 7 ? '📢 Exam coming up' : '📅 Exam countdown'}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {new Date(state.examDate!).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[28px] font-extrabold font-mono leading-none" style={{ color: daysLeft <= 3 ? '#f87171' : daysLeft <= 7 ? '#fbbf24' : '#a5b4fc', letterSpacing: '-0.03em' }}>
              {daysLeft}
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>days</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <BookOpen size={14} strokeWidth={2} /> Stats
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatBox value={total} label="Attempts" />
          <StatBox value={avg} label="Average" suffix="%" />
          <StatBox value={best} label="Best" suffix="%" />
        </div>
      </GlassCard>

      {/* Subjects */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <BookOpen size={14} strokeWidth={2} /> Subjects
        </div>
        {state.courses.length === 0 ? (
          <div className="text-center py-6 text-[13px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No courses yet. Go to More to create one.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {state.courses.map((course, i) => (
              <SubjectCard
                key={course.id}
                subject={course.subject}
                icon={course.icon}
                count={course.questions.length}
                onClick={() => handleSubjectClick(i)}
              />
            ))}
          </div>
        )}
      </GlassCard>

      {/* Weak Areas */}
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <TrendingDown size={14} strokeWidth={2} /> Weak Areas
        </div>
        {weakAreas.length === 0 ? (
          <div className="text-center py-6 text-[13px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Take exams to see weak areas.
          </div>
        ) : (
          weakAreas.map(area => (
            <WeakAreaItem key={area.subject} subject={area.subject} pct={area.pct} count={area.count} />
          ))
        )}
      </GlassCard>
    </div>
  );
}
