interface TimerPillProps {
  formatted: string;
  isWarning: boolean;
  isDanger: boolean;
}

export default function TimerPill({ formatted, isWarning, isDanger }: TimerPillProps) {
  const baseStyle = 'font-extrabold font-mono text-[22px] tracking-wider px-[18px] py-2.5 rounded-[14px] border';
  const normalStyle = 'bg-[rgba(0,0,0,0.3)] border-[rgba(255,255,255,0.4)] text-white';
  const warningStyle = 'bg-[rgba(245,158,11,0.15)] border-[rgba(245,158,11,0.4)] text-[#fbbf24]';
  const dangerStyle = 'bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.4)] text-[#f87171]';

  return (
    <div
      className={`${baseStyle} ${isDanger ? dangerStyle : isWarning ? warningStyle : normalStyle}`}
      style={isDanger ? { animation: 'tpulse 0.5s infinite' } : isWarning ? { animation: 'tpulse 1s infinite' } : undefined}
    >
      {formatted}
    </div>
  );
}
