import { motion } from 'framer-motion';

interface OptionButtonProps {
  letter: string;
  text: string;
  state: 'default' | 'selected' | 'correct' | 'wrong' | 'disabled';
  onClick: () => void;
}

const stateStyles = {
  default: {
    bg: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.9)',
    letterBg: 'rgba(255,255,255,0.12)',
    letterBorder: '1px solid rgba(255,255,255,0.3)',
    letterColor: 'rgba(255,255,255,0.7)',
    shadow: '0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.12)',
  },
  selected: {
    bg: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.55)',
    color: '#fff',
    letterBg: 'rgba(255,255,255,0.3)',
    letterBorder: '1px solid rgba(255,255,255,0.6)',
    letterColor: '#fff',
    shadow: '0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.12)',
  },
  correct: {
    bg: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.4)',
    color: '#fff',
    letterBg: 'rgba(34,197,94,0.25)',
    letterBorder: '1px solid rgba(34,197,94,0.5)',
    letterColor: '#fff',
    shadow: 'none',
  },
  wrong: {
    bg: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: 'rgba(255,255,255,0.55)',
    letterBg: 'rgba(239,68,68,0.15)',
    letterBorder: '1px solid rgba(239,68,68,0.4)',
    letterColor: '#f87171',
    shadow: 'none',
  },
  disabled: {
    bg: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.9)',
    letterBg: 'rgba(255,255,255,0.12)',
    letterBorder: '1px solid rgba(255,255,255,0.3)',
    letterColor: 'rgba(255,255,255,0.7)',
    shadow: '0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.12)',
  },
};

export default function OptionButton({ letter, text, state, onClick }: OptionButtonProps) {
  const style = stateStyles[state];
  const isClickable = state === 'default';

  return (
    <motion.button
      className="w-full text-left flex items-start gap-3 rounded-[14px] p-4 relative overflow-hidden"
      style={{
        background: style.bg,
        border: style.border,
        color: style.color,
        boxShadow: style.shadow,
        cursor: isClickable ? 'pointer' : 'default',
        fontSize: '15px',
        fontWeight: 500,
        lineHeight: 1.5,
        wordBreak: 'break-word' as const,
      }}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={isClickable ? onClick : undefined}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold font-mono flex-shrink-0 mt-0.5"
        style={{
          background: style.letterBg,
          border: style.letterBorder,
          color: style.letterColor,
        }}
      >
        {letter}
      </div>
      <span className="flex-1 pt-0.5">{text}</span>
    </motion.button>
  );
}
