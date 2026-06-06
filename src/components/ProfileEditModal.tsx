import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import type { StudentProfile } from '@/types';

interface ProfileEditModalProps {
  isOpen: boolean;
  profile: StudentProfile;
  onSave: (profile: Partial<StudentProfile>) => void;
  onClose: () => void;
}

const LEVELS = ['100L', '200L', '300L', '400L', '500L', 'ND1', 'ND2', 'HND1', 'HND2'];
const GENDERS = ['Male', 'Female', 'Prefer not to say'];

export default function ProfileEditModal({ isOpen, profile, onSave, onClose }: ProfileEditModalProps) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [matric, setMatric] = useState(profile.matric);
  const [phone, setPhone] = useState(profile.phone);
  const [state, setState] = useState(profile.state);
  const [level, setLevel] = useState(profile.level);
  const [gender, setGender] = useState(profile.gender);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setAge(profile.age);
      setMatric(profile.matric);
      setPhone(profile.phone);
      setState(profile.state);
      setLevel(profile.level);
      setGender(profile.gender);
    }
  }, [isOpen, profile]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), age, matric, phone, state, level, gender });
    onClose();
  };

  const inputClass = "w-full rounded-xl px-4 py-3 text-[15px] outline-none transition-colors focus:border-[rgba(255,255,255,0.5)]";
  const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff' };
  const labelClass = "text-[11px] font-bold uppercase tracking-widest mb-2";
  const labelStyle = { color: 'rgba(255,255,255,0.45)' };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-end"
          style={{ background: 'rgba(3,5,12,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-h-[90vh] overflow-y-auto"
            style={{ background: '#0d1628', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '28px 28px 0 0', padding: '24px 20px 40px' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="text-[17px] font-extrabold" style={{ color: '#fff', letterSpacing: '-0.02em' }}>Edit Profile</div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                <X size={16} />
              </button>
            </div>

            <div className={labelClass} style={labelStyle}>Full Name</div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Adaeze Okonkwo" className={`${inputClass} mb-4`} style={inputStyle} />

            <div className={labelClass} style={labelStyle}>Age</div>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 19" min={10} max={60} className={`${inputClass} mb-4`} style={inputStyle} />

            <div className={labelClass} style={labelStyle}>Matric / Reg Number</div>
            <input type="text" value={matric} onChange={e => setMatric(e.target.value)} placeholder="e.g. YCT/20/04/001" autoCapitalize="characters" className={`${inputClass} mb-4`} style={inputStyle} />

            <div className={labelClass} style={labelStyle}>Phone Number</div>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 08012345678" autoComplete="tel" className={`${inputClass} mb-4`} style={inputStyle} />

            <div className={labelClass} style={labelStyle}>State of Origin</div>
            <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="e.g. Lagos, Ogun, Kano..." className={`${inputClass} mb-4`} style={inputStyle} />

            <div className={labelClass} style={labelStyle}>Academic Level</div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className="px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all"
                  style={{
                    background: level === l ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)',
                    border: level === l ? '1.5px solid rgba(99,102,241,0.6)' : '1.5px solid rgba(255,255,255,0.12)',
                    color: level === l ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className={labelClass} style={labelStyle}>Gender</div>
            <div className="flex gap-2 mb-6">
              {GENDERS.map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className="flex-1 py-3 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: gender === g ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    border: gender === g ? '1.5px solid rgba(99,102,241,0.5)' : '1.5px solid rgba(255,255,255,0.1)',
                    color: gender === g ? '#a5b4fc' : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(168,85,247,0.25))',
                border: '1.5px solid rgba(99,102,241,0.5)',
                color: '#c4b5fd',
                boxShadow: '0 4px 20px rgba(99,102,241,0.2)',
              }}
            >
              <Check size={16} strokeWidth={2.5} /> Save Changes
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
