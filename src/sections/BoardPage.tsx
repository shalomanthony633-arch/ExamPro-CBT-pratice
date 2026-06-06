import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/GlassCard';

export default function BoardPage() {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.profile.name || '');

  const entries = useMemo(() => {
    return Object.values(state.leaderboard)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 20);
  }, [state.leaderboard]);

  const saveName = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch({ type: 'SET_PROFILE', profile: { name: trimmed } });
    // Rebuild leaderboard with new name
    state.history.forEach(h => {
      dispatch({ type: 'UPDATE_LEADERBOARD', record: h });
    });
  };

  const rankBadge = (i: number) => {
    if (i === 0) return { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)', label: '🥇' };
    if (i === 1) return { bg: 'rgba(156,163,175,0.15)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.3)', label: '🥈' };
    if (i === 2) return { bg: 'rgba(180,120,60,0.15)', color: '#d97706', border: '1px solid rgba(180,120,60,0.3)', label: '🥉' };
    return { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.15)', label: `${i + 1}` };
  };

  const scoreColor = (pct: number) => pct >= 70 ? '#4ade80' : pct >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div className="px-3.5 pt-4 pb-24">
      <GlassCard>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] mb-3.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          🏆 Leaderboard
        </div>

        {/* Name Input */}
        <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Your name on the board</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Shant A."
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff' }}
            />
            <button
              onClick={saveName}
              className="px-5 py-2.5 rounded-xl text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
            >
              Save
            </button>
          </div>
        </div>

        {/* Entries */}
        {entries.length === 0 ? (
          <div className="text-center py-8 text-[13px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
            No scores yet.<br />Complete an exam to appear here!
          </div>
        ) : (
          entries.map((e, i) => {
            const rank = rankBadge(i);
            const isMe = e.name === state.profile.name;
            return (
              <div
                key={`${e.name}-${e.subject}-${i}`}
                className="flex items-center gap-3 rounded-xl p-3 mb-2"
                style={{
                  background: isMe ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isMe ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                  style={{ background: rank.bg, color: rank.color, border: rank.border }}
                >
                  {rank.label}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {e.name}{isMe && <span className="text-[10px] ml-1" style={{ color: '#a5b4fc' }}>(You)</span>}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {e.icon} {e.subject} · {e.date}
                  </div>
                </div>
                <div className="text-xl font-extrabold font-mono flex-shrink-0" style={{ color: scoreColor(e.pct) }}>
                  {e.pct}%
                </div>
              </div>
            );
          })
        )}
      </GlassCard>
    </div>
  );
}
