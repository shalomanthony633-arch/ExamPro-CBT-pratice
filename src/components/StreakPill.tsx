interface StreakPillProps {
  current: number;
  best: number;
}

export default function StreakPill({ current, best }: StreakPillProps) {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2 mt-3">
      <div
        className="inline-flex items-center gap-1.5 rounded-[20px] px-4 py-[7px] text-[13px] font-bold"
        style={{
          background: 'rgba(251,146,60,0.14)',
          border: '1px solid rgba(251,146,60,0.32)',
          color: '#fb923c',
        }}
      >
        {current > 0 ? '🔥' : '💤'} {current} day streak
      </div>
      {best > 0 && (
        <div
          className="inline-flex items-center gap-1.5 rounded-[20px] px-3 py-[5px] text-[11px] font-medium"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          Best: {best} 🔥
        </div>
      )}
    </div>
  );
}
