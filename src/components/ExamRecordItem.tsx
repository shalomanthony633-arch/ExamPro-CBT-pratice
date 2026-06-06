import type { ExamRecord } from '@/types';

interface ExamRecordItemProps {
  record: ExamRecord;
}

export default function ExamRecordItem({ record }: ExamRecordItemProps) {
  const scoreColor = record.pct >= 70 ? '#4ade80' : record.pct >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div
      className="flex items-center justify-between rounded-xl p-3.5 mb-2"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }}
    >
      <div>
        <div className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {record.icon} {record.subject}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {record.mode} · {record.date} · {record.correct}/{record.total}
        </div>
      </div>
      <span className="text-[22px] font-extrabold font-mono" style={{ color: scoreColor }}>
        {record.pct}%
      </span>
    </div>
  );
}
