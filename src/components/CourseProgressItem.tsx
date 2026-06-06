interface CourseProgressItemProps {
  subject: string;
  covered: number;
  avgPct: number;
  attempts: number;
  icon: string;
}

export default function CourseProgressItem({ subject, covered, avgPct, attempts, icon }: CourseProgressItemProps) {
  const color = covered >= 80 ? '#4ade80' : covered >= 40 ? '#fbbf24' : '#60a5fa';

  return (
    <div className="rounded-xl p-3.5 mb-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)', fontSize: '14px' }}>
          {icon}
        </div>
        <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{subject}</span>
      </div>
      <div className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {attempts} attempt{attempts !== 1 ? 's' : ''} · {avgPct > 0 ? `${avgPct}% avg` : 'Not started'}
      </div>
      <div className="h-1 rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${covered}%`, background: color }} />
      </div>
      <div className="text-[11px] font-bold text-right mt-1 font-mono" style={{ color }}>{covered}% covered</div>
    </div>
  );
}
