import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Question } from '@/types';

export default function ScanOverlay() {
  const { state, navigate, dispatch, showToast } = useApp();
  const [step, setStep] = useState<'course' | 'upload' | 'loading' | 'adjuster' | 'error'>('course');
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedCount, setSelectedCount] = useState(3);
  const [errorMsg] = useState('');

  const handleSelectCourse = (idx: number) => {
    setSelectedCourseIdx(idx);
    setStep('upload');
  };

  const handleFileUpload = () => {
    setStep('loading');
    // Simulate AI generation
    const steps = [
      'Reading your PDF...',
      'Understanding the topic...',
      'Writing questions...',
      'Almost done...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        // Generate sample questions
        const sampleQs: Question[] = [
          { q: 'What is the primary focus of this topic?', options: ['Understanding core concepts', 'Memorizing dates', 'Learning vocabulary', 'Practicing calculations'], answer: 0, explanation: 'The primary focus is understanding core concepts.' },
          { q: 'Which approach is most effective for mastering this material?', options: ['Rote memorization', 'Active practice and review', 'Reading once', 'Group discussion only'], answer: 1, explanation: 'Active practice and review is the most effective approach.' },
          { q: 'What is a common mistake students make when studying this topic?', options: ['Studying too much', 'Skipping fundamentals', 'Taking too many notes', 'Asking questions'], answer: 1, explanation: 'Skipping fundamentals is a common mistake.' },
          { q: 'How can you best prepare for an exam on this topic?', options: ['Cramming the night before', 'Regular review and practice', 'Reading the textbook once', 'Focusing only on hard topics'], answer: 1, explanation: 'Regular review and practice is the best preparation method.' },
          { q: 'What is the key takeaway from this material?', options: ['Specific dates and names', 'Understanding principles and applications', 'Memorizing formulas', 'Copying notes'], answer: 1, explanation: 'Understanding principles and applications is the key takeaway.' },
        ];
        setGeneratedQuestions(sampleQs);
        setSelectedCount(Math.min(5, sampleQs.length));
        setStep('adjuster');
      }
    }, 1200);
  };

  const handleStartPractice = () => {
    if (selectedCourseIdx === null) return;
    navigate('subject');
    dispatch({ type: 'SET_CURRENT_SUBJECT', index: selectedCourseIdx });
    showToast(`${selectedCount} questions ready!`);
    dispatch({ type: 'NAVIGATE', page: 'home' });
  };

  const close = () => navigate('home');

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex flex-col"
      style={{ background: 'rgba(4,6,15,0.96)', backdropFilter: 'blur(20px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-5 h-[54px]" style={{ background: 'rgba(4,6,15,0.85)', borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}>
        <h2 className="text-[17px] font-extrabold tracking-tight" style={{ color: '#fff' }}>📄 Scan to Questions</h2>
        <button onClick={close} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <X size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {step === 'course' && (
          <div>
            <h3 className="text-[13px] font-bold mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Select a course</h3>
            {state.courses.map((c, i) => (
              <button
                key={c.id}
                onClick={() => handleSelectCourse(i)}
                className="w-full flex items-center gap-3 rounded-xl p-3.5 mb-2 text-left"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>{c.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold" style={{ color: '#fff' }}>{c.subject}</div>
                  <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.questions.length} questions</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'upload' && (
          <div>
            <h3 className="text-[13px] font-bold mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>Upload PDF or Photo</h3>
            <button
              onClick={handleFileUpload}
              className="w-full rounded-2xl p-6 mb-3 text-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(245,158,11,0.3)', color: 'rgba(255,255,255,0.6)' }}
            >
              <div className="text-3xl mb-2">📁</div>
              <div className="text-sm font-bold" style={{ color: '#fff' }}>Upload PDF</div>
              <div className="text-[11px] mt-1">Click to browse files</div>
            </button>
            <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Or take a photo</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleFileUpload}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="text-2xl mb-1">📸</div>
                <div className="text-xs font-bold" style={{ color: '#fff' }}>Take Photo</div>
              </button>
              <button
                onClick={handleFileUpload}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="text-2xl mb-1">🖼️</div>
                <div className="text-xs font-bold" style={{ color: '#fff' }}>Choose Photo</div>
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-12 h-12 rounded-full border-[3px] animate-spin mb-6" style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
            <div className="text-base font-bold mb-2" style={{ color: '#fff' }}>Analysing your material...</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>This may take a moment</div>
            <div className="w-full max-w-[280px] h-1 rounded-sm mt-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-sm animate-pulse" style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', width: '60%' }} />
            </div>
          </div>
        )}

        {step === 'adjuster' && (
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-extrabold mb-1" style={{ color: '#fff' }}>Questions Generated!</h3>
            <div className="text-[13px] mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {generatedQuestions.length} questions from your material
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setSelectedCount(Math.max(3, selectedCount - 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              >
                -
              </button>
              <span className="text-[28px] font-extrabold font-mono w-12" style={{ color: '#fff' }}>{selectedCount}</span>
              <button
                onClick={() => setSelectedCount(Math.min(generatedQuestions.length, selectedCount + 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              >
                +
              </button>
            </div>
            <button
              onClick={handleStartPractice}
              className="w-full py-4 rounded-2xl text-base font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}
            >
              Start Practice Session
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center">
            <div className="text-5xl mb-4">😕</div>
            <h3 className="text-xl font-extrabold mb-2" style={{ color: '#fff' }}>Something went wrong</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>{errorMsg || 'Could not generate questions.'}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setStep('upload')} className="py-3 rounded-xl text-sm font-bold" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>Try Again</button>
              <button onClick={close} className="py-3 rounded-xl text-sm font-bold" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>Go Back</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
