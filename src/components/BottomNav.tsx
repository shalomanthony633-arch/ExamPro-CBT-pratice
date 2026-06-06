import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import type { Page } from '@/types';
import { Home, Trophy, FileText, MessageCircle, MoreHorizontal } from 'lucide-react';

const navItems: { page: Page; icon: typeof Home; label: string }[] = [
  { page: 'home', icon: Home, label: 'Home' },
  { page: 'board', icon: Trophy, label: 'Board' },
  { page: 'scan', icon: FileText, label: 'Scan' },
  { page: 'chat', icon: MessageCircle, label: 'Chat' },
  { page: 'more', icon: MoreHorizontal, label: 'More' },
];

export default function BottomNav() {
  const { state, navigate } = useApp();

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-[100]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className="flex items-center p-2 gap-1 rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 32px rgba(0,0,0,0.12)',
        }}
      >
        {navItems.map((item) => {
          const isActive = state.page === item.page;
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl transition-colors min-h-[56px]"
              style={{
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(99,102,241,0.15)' : 'none',
              }}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span
                className="text-[9px] font-semibold uppercase tracking-wider transition-all duration-200"
                style={{
                  maxHeight: isActive ? '20px' : '0px',
                  opacity: isActive ? 1 : 0,
                  overflow: 'hidden',
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
