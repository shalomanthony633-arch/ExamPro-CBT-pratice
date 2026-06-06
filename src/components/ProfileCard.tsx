import type { StudentProfile } from '@/types';
import { Pencil, GraduationCap } from 'lucide-react';

interface ProfileCardProps {
  profile: StudentProfile;
  onEdit: () => void;
  onChangeSchool: () => void;
}

export default function ProfileCard({ profile, onEdit, onChangeSchool }: ProfileCardProps) {
  const initials = profile.name
    ? profile.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const infoItems = [
    { label: 'School', value: profile.school },
    { label: 'Department', value: profile.department },
    { label: 'Age', value: profile.age },
    { label: 'Gender', value: profile.gender },
    { label: 'Matric No.', value: profile.matric },
    { label: 'State', value: profile.state },
  ];

  return (
    <div className="rounded-[22px] overflow-hidden mb-3.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)' }}>
      {/* Profile Hero */}
      <div
        className="px-5 py-5"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.08))',
          borderBottom: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-[60px] h-[60px] rounded-[20px] flex items-center justify-center text-[22px] font-extrabold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.25))',
              border: '1.5px solid rgba(99,102,241,0.5)',
              color: '#c4b5fd',
              fontFamily: "'DM Mono', monospace",
              boxShadow: '0 4px 16px rgba(99,102,241,0.2)',
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-extrabold tracking-tight truncate" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
              {profile.name || <span className="text-[15px] font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>No name set</span>}
            </div>
            {profile.level && (
              <div
                className="inline-flex items-center gap-1 rounded-[20px] px-2.5 py-[3px] mt-1.5 text-[11px] font-bold"
                style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
              >
                {profile.level}
              </div>
            )}
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl flex-shrink-0 transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.7)' }}
          >
            <Pencil size={12} strokeWidth={2.5} /> Edit
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {infoItems.map(({ label, value }) => (
            <div key={label} className="rounded-[13px] p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-[3px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</div>
              <div className="text-[11px] font-semibold leading-snug" style={{ color: value ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)' }}>
                {value || 'Not set'}
              </div>
            </div>
          ))}
          {profile.phone && (
            <div className="col-span-2 rounded-[13px] p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-[3px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Phone</div>
              <div className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{profile.phone}</div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 text-[13px] font-bold py-2.5 rounded-xl transition-colors"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}
          >
            Edit Profile
          </button>
          <button
            onClick={onChangeSchool}
            className="flex-1 flex items-center justify-center gap-1 text-[13px] font-bold py-2.5 rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.6)' }}
          >
            <GraduationCap size={13} strokeWidth={2.5} /> Change School
          </button>
        </div>
      </div>
    </div>
  );
}
