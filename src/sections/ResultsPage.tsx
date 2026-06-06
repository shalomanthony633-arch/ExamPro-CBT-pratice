import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/GlassCard';
import ScoreRing from '@/components/ScoreRing';
import ExamRecordItem from '@/components/ExamRecordItem';

export default function ResultsPage() {
  const { state, navigate } = useApp();

  const lastRecord = state.history[state.history.length - 1];

  const { grade, gradeColor, message } = useMemo(() => {
    if (!lastRecord) return { grade: 'F', gradeColor: '#f87171', message: 'Keep practising!' };
    const pct = lastRecord.pct;
    const grade = pct >= 70 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 45 ? 'D' : 'F';
    const color = pct >= 70 ? '#4ade80' : pct >= 50 ? '#fbbf24' : '#f87171';
    const msg = pct >= 70 ? 'Excellent work! 🎉' : pct >= 50 ? 'Good effort, keep going! 💪' : "Keep practising, you'll get there! 📚";
    return { grade, gradeColor: color, message: msg };
  }, [lastRecord]);

  if (!lastRecord) {
    return (
      <div className="px-3.5 pt-4 pb-24 text-center">
        <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>No results found</div>
        <button onClick={() => navigate('home')} className="mt-4 text-sm font-bold" style={{ color: '#a5b4fc' }}>← Home</button>
      </div>
    );
  }

  const mins = Math.floor(lastRecord.timeTaken / 60);
  const secs = lastRecord.timeTaken % 60;

  return (
    <div className="px-3.5 pt-4 pb-24">
      <GlassCard className="text-center">
        <ScoreRing score={lastRecord.pct} />
        <div className="text-xl font-extrabold mb-1" style={{ color: gradeColor }}>Grade {grade}</div>
        <div className="text-[13px] font-light mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{message}</div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="block text-xl font-extrabold font-mono" style={{ color: '#4ade80' }}>{lastRecord.correct}</span>
            <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Correct</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="block text-xl font-extrabold font-mono" style={{ color: '#f87171' }}>{lastRecord.wrong}</span>
            <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Wrong</span>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="block text-xl font-extrabold font-mono" style={{ color: '#fbbf24' }}>{lastRecord.skipped}</span>
            <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Skipped</span>
          </div>
        </div>

        <div className="text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {lastRecord.subject} · {lastRecord.mode} · {mins}m {secs}s
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => navigate('subject')}
            className="py-3 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
          >
            🔄 Try Again
          </button>
          <button
            onClick={() => navigate('home')}
            className="py-3 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          >
            🏠 Home
          </button>
        </div>

        {/* Share */}
        <button
          onClick={() => {
            const msg = `🎯 Lumiq Result\n\n📚 ${lastRecord.subject}\n\n${lastRecord.pct}% - Grade ${grade}\n${lastRecord.correct}/${lastRecord.total} correct`;
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
          }}
          className="w-full py-3 rounded-xl text-sm font-bold mb-6"
          style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}
        >
          📤 Share Score on WhatsApp
        </button>

        {/* Review */}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3 text-left" style={{ color: 'rgba(255,255,255,0.5)' }}>
          📋 Full Review
        </div>
        <div className="text-left">
          {state.history.slice(-1).map((h, hi) => (
            <ExamRecordItem key={hi} record={h} />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
