import { Lock } from 'lucide-react';

interface FeatureLockProps {
  featureName: string;
  planRequired?: string;
}

export default function FeatureLock({ featureName, planRequired = 'Semester' }: FeatureLockProps) {
  return (
    <div className="text-center py-6">
      <div className="text-3xl mb-3">🔒</div>
      <div className="text-sm font-bold mb-1.5" style={{ color: '#fff' }}>{featureName}</div>
      <div className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
        Upgrade to {planRequired} plan to unlock this feature
      </div>
      <button
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
        }}
      >
        <Lock size={12} strokeWidth={2.5} /> Upgrade to {planRequired}
      </button>
    </div>
  );
}
