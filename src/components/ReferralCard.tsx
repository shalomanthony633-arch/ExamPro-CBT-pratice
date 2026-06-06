import { useState } from 'react';
import { Copy } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ReferralCard() {
  const { state, dispatch, showToast } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [claimMsg, setClaimMsg] = useState('');

  const copyCode = () => {
    const code = state.referralCode || generateCode();
    navigator.clipboard?.writeText(code).then(() => showToast('Code copied!')).catch(() => showToast(code));
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const code = 'REF-' + Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    dispatch({ type: 'SET_REFERRAL_CODE', code });
    return code;
  };

  const claimCode = () => {
    const code = inputCode.trim().toUpperCase();
    if (!/^REF-[A-Z0-9]{5}$/.test(code)) {
      setClaimMsg('Invalid code format');
      return;
    }
    if (code === (state.referralCode || '')) {
      setClaimMsg("Can't use your own code!");
      return;
    }
    if (state.referralUsed) {
      setClaimMsg('You already claimed a referral bonus!');
      return;
    }
    dispatch({ type: 'SET_REFERRAL_USED', code });
    setClaimMsg('Bonus claimed!');
    showToast('Referral bonus applied!');
  };

  const code = state.referralCode || generateCode();

  return (
    <div>
      <div
        className="rounded-[14px] p-3.5 mb-3"
        style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)' }}
      >
        <div className="text-[11px] mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Your referral code
        </div>
        <div className="text-[22px] font-extrabold font-mono tracking-wider mb-2.5" style={{ color: '#fff' }}>
          {code}
        </div>
        <button
          onClick={copyCode}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <Copy size={14} strokeWidth={2} /> Copy Code
        </button>
      </div>
      <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Have a friend's code?</div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputCode}
          onChange={e => setInputCode(e.target.value)}
          placeholder="REF-XXXXX"
          maxLength={9}
          className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.22)',
            color: '#fff',
            textTransform: 'uppercase',
          }}
        />
        <button
          onClick={claimCode}
          className="px-5 py-2.5 rounded-xl text-xs font-bold flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
          }}
        >
          Claim
        </button>
      </div>
      {claimMsg && (
        <div className="text-xs mt-2" style={{ color: claimMsg.includes('Invalid') || claimMsg.includes("Can't") || claimMsg.includes('already') ? '#f87171' : '#4ade80' }}>
          {claimMsg}
        </div>
      )}
    </div>
  );
}
