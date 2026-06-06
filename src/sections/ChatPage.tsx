import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.chatMessages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || text.length > 500) return;

    const myName = state.profile.name || 'Anonymous';
    const msg = {
      id: `msg_${Date.now()}`,
      name: myName,
      text,
      ts: Date.now(),
      isMe: true,
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: msg });
    setInput('');

    // Simulate a bot response
    setTimeout(() => {
      const responses = [
        'Great question! Keep studying! 📚',
        'You got this! 💪',
        'Practice makes perfect! 🎯',
        'That\'s a tough one - review the explanation! 🔍',
        'Keep pushing, you\'re doing great! 🌟',
      ];
      const botMsg = {
        id: `msg_${Date.now() + 1}`,
        name: 'Lumiq Bot',
        text: responses[Math.floor(Math.random() * responses.length)],
        ts: Date.now() + 1,
        isMe: false,
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', message: botMsg });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] px-3.5 pt-4">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col gap-2.5 pb-4"
        style={{ minHeight: '180px' }}
      >
        {state.chatMessages.length === 0 && (
          <div className="text-center py-10 text-[13px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Start a conversation with your study group!
          </div>
        )}
        {state.chatMessages.map(msg => {
          const initials = (msg.name || '?').slice(0, 2).toUpperCase();
          const time = new Date(msg.ts).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
          return (
            <div key={msg.id} className={`flex gap-2 items-start ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              <div
                className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-extrabold flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
              >
                {initials}
              </div>
              <div className="max-w-[75%]">
                {!msg.isMe && (
                  <div className="text-[10px] font-semibold mb-[3px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{msg.name}</div>
                )}
                <div
                  className="rounded-[14px] px-3.5 py-2 text-[13px] leading-relaxed"
                  style={{
                    background: msg.isMe ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${msg.isMe ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)'}`,
                    color: 'rgba(255,255,255,0.9)',
                    borderTopRightRadius: msg.isMe ? '4px' : undefined,
                    borderTopLeftRadius: !msg.isMe ? '4px' : undefined,
                  }}
                >
                  {msg.text}
                </div>
                <div className={`text-[10px] mt-[3px] ${msg.isMe ? 'text-right' : ''}`} style={{ color: 'rgba(255,255,255,0.22)' }}>{time}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex gap-2 pb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Message the class..."
          maxLength={500}
          className="flex-1 rounded-xl px-3.5 py-3 text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
        />
        <button
          onClick={sendMessage}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
