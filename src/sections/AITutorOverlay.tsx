import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const botResponses = [
  'That\'s a great question! Let me break it down for you... 📚',
  'Think of it this way: the key concept here is understanding the fundamentals first.',
  'Here\'s a helpful tip: try to relate this to something you already know! 💡',
  'Many students find this tricky at first. The best approach is to practice with past questions.',
  'Great progress! Keep challenging yourself with harder questions. 🌟',
  'Let me explain this step by step... The first thing to understand is the core principle.',
  'You\'re on the right track! Consider reviewing the explanation for this topic.',
  'Pro tip: Create mnemonics to help remember key concepts! 🧠',
  'The answer depends on understanding the context. Let me clarify...',
  'Excellent question! This is exactly the kind of thinking that leads to exam success.',
];

export default function AITutorOverlay() {
  const { state, dispatch, navigate } = useApp();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.chatMessages, isThinking]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || text.length > 500) return;

    const myName = state.profile.name || 'Student';
    const msg = {
      id: `tutor_${Date.now()}`,
      name: myName,
      text,
      ts: Date.now(),
      isMe: true,
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: msg });
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const response = {
        id: `tutor_${Date.now() + 1}`,
        name: 'Lumiq AI Tutor',
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        ts: Date.now() + 1,
        isMe: false,
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', message: response });
      setIsThinking(false);
    }, 1500 + Math.random() * 1000);
  };

  const close = () => navigate('home');
  const tutorMessages = state.chatMessages.filter(m => m.id.startsWith('tutor_'));

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
        <h2 className="text-[17px] font-extrabold tracking-tight" style={{ color: '#fff' }}>🤖 AI Tutor</h2>
        <button onClick={close} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <X size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
        </button>
      </div>

      {/* Context Bar */}
      <div className="px-5 py-3" style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
          💡 Ask me anything about your subjects
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {tutorMessages.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-4">🤖</div>
            <div className="text-base font-bold mb-2" style={{ color: '#fff' }}>Hi, I'm your AI Tutor!</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Ask me anything about your subjects. I'm here to help you understand concepts better.
            </div>
          </div>
        )}
        {tutorMessages.map(msg => {
          const initials = (msg.name || '?').slice(0, 2).toUpperCase();
          return (
            <div key={msg.id} className={`flex gap-2.5 items-start ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                style={{
                  background: msg.isMe ? 'rgba(255,255,255,0.12)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                }}
              >
                {msg.isMe ? initials : '🤖'}
              </div>
              <div className="max-w-[75%]">
                {!msg.isMe && <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#a5b4fc' }}>Lumiq AI Tutor</div>}
                <div
                  className="rounded-[14px] px-3.5 py-2.5 text-[13px] leading-relaxed"
                  style={{
                    background: msg.isMe ? 'rgba(255,255,255,0.12)' : 'rgba(99,102,241,0.12)',
                    border: `1px solid ${msg.isMe ? 'rgba(255,255,255,0.25)' : 'rgba(99,102,241,0.3)'}`,
                    color: 'rgba(255,255,255,0.9)',
                    borderTopRightRadius: msg.isMe ? '4px' : undefined,
                    borderTopLeftRadius: !msg.isMe ? '4px' : undefined,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        {isThinking && (
          <div className="flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="text-xs">🤖</span>
            </div>
            <div className="rounded-[14px] px-3.5 py-2.5" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#a5b4fc', animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#a5b4fc', animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#a5b4fc', animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(4,6,15,0.5)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask the AI Tutor..."
            maxLength={500}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
          />
          <button
            onClick={sendMessage}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
