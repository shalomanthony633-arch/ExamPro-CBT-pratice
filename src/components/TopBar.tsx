import { useApp } from '@/context/AppContext';
import { Sun, Moon, Cloud } from 'lucide-react';

export default function TopBar() {
  const { state, dispatch } = useApp();
  const displayName = state.profile.name ? state.profile.name.split(' ')[0] : 'Student';

  const toggleTheme = () => {
    const next = state.theme === 'dark' ? 'ash' : state.theme === 'ash' ? 'light' : 'dark';
    dispatch({ type: 'SET_THEME', theme: next });
  };

  const themeIcon = state.theme === 'light'
    ? <Sun size={18} strokeWidth={2.5} />
    : state.theme === 'ash'
    ? <Cloud size={18} strokeWidth={2.5} />
    : <Moon size={18} strokeWidth={2.5} />;

  return (
    <div
      className="sticky top-0 z-[100] flex items-center justify-between px-5 h-[54px]"
      style={{
        background: 'rgba(4,6,15,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-2 text-[19px] font-extrabold tracking-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        Lumiq
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-1 transition-transform active:scale-85"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          aria-label="Toggle theme"
        >
          {themeIcon}
        </button>
        <div
          className="text-[11px] font-semibold px-3.5 py-[5px] rounded-[20px]"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {displayName}
        </div>
      </div>
    </div>
  );
}
