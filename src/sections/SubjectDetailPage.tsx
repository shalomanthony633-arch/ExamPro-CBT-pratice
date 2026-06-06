import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/GlassCard';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function SubjectDetailPage() {
  const { state, navigate, dispatch } = useApp();
  const [selectedCount, setSelectedCount] = useState(0);

  const course = state.currentSubjectIndex !== null ? state.courses[state.currentSubjectIndex] : null;

  const countOptions = useMemo(() => {
    if (!course) return [];
    const total = course.questions.length;
    return [10, 20, 30, 40, 50, 60, 80, 100, 150, 200, 300].filter(n => n <= total);
  }, [course]);

  const wrongAnswers = useMemo(() => {
    if (!course || state.currentSubjectIndex === null) return [];
    // Get wrong answers from history for this subject
    return state.history
      .filter(h => h.subject === course.subject && h.wrong > 0)
      .slice(0, 5);
  }, [course, state.history, state.currentSubjectIndex]);

  if (!course) {
    return (
      <div className="px-3.5 pt-4 pb-24 text-center">
        <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Course not found</div>
        <button onClick={() => navigate('home')} className="mt-4 text-sm font-bold" style={{ color: '#a5b4fc' }}>← Back to Home</button>
      </div>
    );
  }

  const startExam = (_practice: boolean) => {
    if (selectedCount === 0) return;
    dispatch({ type: 'NAVIGATE', page: 'exam' });
  };

  const estimatedMins = Math.ceil(selectedCount * 1.5);

  return (
    <div className="px-3.5 pt-4 pb-24">
      <GlassCard>
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', color: 'rgba(255,255,255,0.9)', fontSize: '24px' }}
          >
            {course.icon}
          </div>
          <div>
            <div className="text-xl font-extrabold" style={{ color: '#fff' }}>{course.subject}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{course.questions.length} questions available</div>
          </div>
        </div>

        {/* Question Count */}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          How many questions?
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {countOptions.map(n => (
            <button
              key={n}
              onClick={() => setSelectedCount(n)}
              className="flex-1 min-w-[52px] py-2.5 px-1.5 rounded-xl text-[13px] font-bold transition-all"
              style={{
                background: selectedCount === n ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                border: selectedCount === n ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
                color: selectedCount === n ? '#fff' : 'rgba(255,255,255,0.7)',
              }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setSelectedCount(course.questions.length)}
            className="flex-1 min-w-[52px] py-2.5 px-1.5 rounded-xl text-[13px] font-bold transition-all"
            style={{
              background: selectedCount === course.questions.length ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
              border: selectedCount === course.questions.length ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
              color: selectedCount === course.questions.length ? '#fff' : 'rgba(255,255,255,0.7)',
            }}
          >
            All<br /><span className="text-[10px] opacity-60">{course.questions.length}</span>
          </button>
        </div>
        {selectedCount > 0 && (
          <div className="text-center text-[13px] mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span className="text-white font-bold">{selectedCount} questions selected</span> · {estimatedMins} mins estimated
          </div>
        )}

        {/* Mode Selection */}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Choose Mode
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => startExam(false)}
            disabled={selectedCount === 0}
            className="rounded-[18px] p-5 text-center transition-all disabled:opacity-40 disabled:pointer-events-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.11)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.14)',
            }}
          >
            <div className="text-3xl mb-2.5">⏱️</div>
            <div className="text-sm font-bold" style={{ color: '#fff' }}>Exam Mode</div>
            <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Timed · Results at end</div>
          </button>
          <button
            onClick={() => startExam(true)}
            disabled={selectedCount === 0}
            className="rounded-[18px] p-5 text-center transition-all disabled:opacity-40 disabled:pointer-events-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.11)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.14)',
            }}
          >
            <div className="text-3xl mb-2.5">📖</div>
            <div className="text-sm font-bold" style={{ color: '#fff' }}>Practice</div>
            <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>No timer · Instant answer</div>
          </button>
        </div>

        {/* Wrong Review */}
        {wrongAnswers.length > 0 && (
          <button
            className="w-full rounded-[18px] p-5 text-center mb-4 transition-all"
            style={{
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            <RotateCcw size={24} className="mx-auto mb-2" style={{ color: '#f87171' }} />
            <div className="text-sm font-bold" style={{ color: '#fff' }}>Wrong Review</div>
            <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{wrongAnswers.reduce((s, w) => s + w.wrong, 0)} wrong answers to revisit</div>
          </button>
        )}

        {/* Back */}
        <button
          onClick={() => navigate('home')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> Back
        </button>
      </GlassCard>
    </div>
  );
}
