import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import type { Course } from '@/types';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
}

const COURSE_ICONS = ['📚', '📖', '📝', '🔬', '⚙️', '💼', '💻', '🌍', '⚖️', '🏥', '🌾', '📐', '🎨', '📊', '🔢', '⚡', '🧪', '🌿', '💡', '🎯'];

export default function CreateCourseModal({ isOpen, onClose, onSave }: CreateCourseModalProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const formatted = trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    onSave({
      id: `custom_${Date.now()}`,
      subject: formatted,
      icon: selectedIcon,
      questions: [],
      isCustom: true,
    });
    setName('');
    setSelectedIcon('📚');
    onClose();
  };

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
            className="w-full max-h-[85vh] overflow-y-auto"
            style={{
              background: '#0d1628',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '28px 28px 0 0',
              padding: '24px 20px 40px',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[17px] font-extrabold tracking-tight" style={{ color: '#fff', letterSpacing: '-0.02em' }}>Create Course</div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
              >
                <X size={16} />
              </button>
            </div>
            <div className="text-[13px] mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Custom courses appear on your home screen. Other students won't see them.
            </div>

            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Course Name</div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Engineering Mathematics, GST 101..."
              maxLength={60}
              autoComplete="off"
              className="w-full rounded-xl px-4 py-3 text-[15px] outline-none mb-4 transition-colors"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff' }}
            />

            <div className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Pick an Icon</div>
            <div className="flex flex-wrap gap-2 mb-6">
              {COURSE_ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-xl transition-all"
                  style={{
                    background: selectedIcon === icon ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)',
                    border: selectedIcon === icon ? '1.5px solid rgba(99,102,241,0.6)' : '1.5px solid rgba(255,255,255,0.1)',
                    transform: selectedIcon === icon ? 'scale(1.12)' : 'scale(1)',
                  }}
                >
                  {icon}
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
              <Check size={16} strokeWidth={2.5} /> Save Course
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
