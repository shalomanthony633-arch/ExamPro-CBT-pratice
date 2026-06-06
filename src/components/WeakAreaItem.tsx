interface WeakAreaItemProps {
  subject: string;
  pct: number;
  count: number;
}

export default function WeakAreaItem({ subject, pct, count }: WeakAreaItemProps) {
  const color = pct >= 70 ? '#4ade80' : pct >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div className="rounded-xl p-3.5 mb-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
      <div className="text-[13px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{subject}</div>
      <div className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {count} attempt{count > 1 ? 's' : ''}
      </div>
      <div className="h-1 rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="text-[11px] font-bold text-right mt-1 font-mono" style={{ color }}>{pct}% avg</div>
    </div>
  );
}
