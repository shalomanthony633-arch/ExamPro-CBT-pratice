interface QuestionDotsProps {
  total: number;
  current: number;
  answers: (number | null)[];
  onDotClick: (index: number) => void;
}

export default function QuestionDots({ total, current, answers, onDotClick }: QuestionDotsProps) {
  return (
    <div className="flex flex-wrap gap-1 mb-3.5">
      {Array.from({ length: total }, (_, i) => {
        const isCurrent = i === current;
        const isDone = answers[i] !== null;
        return (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-150"
            style={{
              background: isCurrent ? 'rgba(99,102,241,0.3)' : isDone ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
              border: isCurrent ? '1px solid rgba(99,102,241,0.6)' : isDone ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.12)',
              color: isCurrent ? '#fff' : isDone ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
              boxShadow: isCurrent ? '0 0 12px rgba(99,102,241,0.3)' : 'none',
              backdropFilter: 'blur(8px)',
            }}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
