import GlassCard from './GlassCard';

interface SubjectCardProps {
  subject: string;
  icon: string;
  count: number;
  onClick: () => void;
}

export default function SubjectCard({ subject, icon, count, onClick }: SubjectCardProps) {
  return (
    <GlassCard onClick={onClick} className="text-center py-5 px-4">
      <div
        className="w-10 h-10 flex items-center justify-center mx-auto mb-2.5 rounded-xl"
        style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.18)',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '20px',
        }}
      >
        {icon}
      </div>
      <div className="text-sm font-bold" style={{ color: '#fff' }}>{subject}</div>
      <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {count} questions
      </div>
    </GlassCard>
  );
}
