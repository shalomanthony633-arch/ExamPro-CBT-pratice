import { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
}

export default function ScoreRing({ score, size = 120 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = score >= 70 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171';
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div
      className="relative mx-auto mb-3.5 flex items-center justify-center flex-col"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        border: `2px solid ${color}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 30px rgba(0,0,0,0.15)`,
      }}
    >
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox="0 0 120 120"
      >
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="text-[26px] font-extrabold font-mono" style={{ color }}>{score}%</span>
      <span className="text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>SCORE</span>
    </div>
  );
}
