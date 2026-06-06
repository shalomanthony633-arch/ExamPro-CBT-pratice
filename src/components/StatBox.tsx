import { useCountUp } from '@/hooks/useCountUp';

interface StatBoxProps {
  value: number;
  label: string;
  suffix?: string;
}

export default function StatBox({ value, label, suffix = '' }: StatBoxProps) {
  const count = useCountUp(value);

  return (
    <div
      className="relative overflow-hidden text-center rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
      />
      <span className="block text-[22px] font-extrabold tracking-tight font-mono" style={{ color: '#fff' }}>
        {count}{suffix}
      </span>
      <span className="block text-[9px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {label}
      </span>
    </div>
  );
}
