import { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useTimer } from '@/hooks/useTimer';
import GlassCard from '@/components/GlassCard';
import TimerPill from '@/components/TimerPill';
import QuestionDots from '@/components/QuestionDots';
import OptionButton from '@/components/OptionButton';

export default function ExamPage() {
  const { state, dispatch, navigate } = useApp();
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof state.courses[0]['questions']>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [isPractice, setIsPractice] = useState(true);
  const [examStart, setExamStart] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const course = state.currentSubjectIndex !== null ? state.courses[state.currentSubjectIndex] : null;

  const { formatted, isWarning, isDanger, stop } = useTimer(
    shuffledQuestions.length * 90,
    () => finishExam()
  );

  // Initialize exam
  useEffect(() => {
    if (!course || state.currentSubjectIndex === null) {
      navigate('home');
      return;
    }

    // Get the selected count from navigation state or default
    const urlParams = new URLSearchParams(window.location.search);
    const countParam = urlParams.get('count');
    const count = countParam ? parseInt(countParam) : course.questions.length;

    const allQ = [...course.questions];
    for (let i = allQ.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQ[i], allQ[j]] = [allQ[j], allQ[i]];
    }
    const selected = count < allQ.length ? allQ.slice(0, count) : allQ;

    setShuffledQuestions(selected);
    setAnswers(new Array(selected.length).fill(null));
    setCurrentQ(0);
    setIsPractice(true); // Default to practice
    setExamStart(Date.now());
    setShowExplanation(false);
  }, [course, state.currentSubjectIndex]);

  const finishExam = useCallback(() => {
    stop();
    if (!course) return;

    const timeTaken = Math.round((Date.now() - examStart) / 1000);
    let correct = 0, wrong = 0, skipped = 0;

    shuffledQuestions.forEach((q, i) => {
      if (answers[i] === null) skipped++;
      else if (answers[i] === q.answer) correct++;
      else wrong++;
    });

    const pct = Math.round((correct / shuffledQuestions.length) * 100);
    const now = new Date();

    const record = {
      subject: course.subject,
      icon: course.icon,
      correct,
      wrong,
      skipped,
      total: shuffledQuestions.length,
      pct,
      mode: isPractice ? 'Practice' as const : 'Exam' as const,
      timeTaken,
      date: now.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      ts: Date.now(),
    };

    dispatch({ type: 'ADD_HISTORY', record });
    dispatch({ type: 'UPDATE_STREAK' });
    dispatch({ type: 'UPDATE_LEADERBOARD', record });
    dispatch({ type: 'NAVIGATE', page: 'results' });
  }, [shuffledQuestions, answers, course, examStart, isPractice, stop, dispatch]);

  const selectAnswer = (optionIndex: number) => {
    if (!isPractice && answers[currentQ] !== null) return;

    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);

    if (isPractice) {
      setShowExplanation(true);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        if (currentQ < shuffledQuestions.length - 1) {
          setShowExplanation(false);
          setCurrentQ(q => q + 1);
        }
      }, 1500);
    } else {
      if (currentQ < shuffledQuestions.length - 1) {
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = setTimeout(() => {
          setCurrentQ(q => q + 1);
        }, 500);
      }
    }
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= shuffledQuestions.length) return;
    setShowExplanation(false);
    setCurrentQ(index);
  };

  const pct = shuffledQuestions.length > 0 ? Math.round((currentQ / shuffledQuestions.length) * 100) : 0;
  const answeredCount = answers.filter(a => a !== null).length;
  const allAnswered = answers.every(a => a !== null);
  const isLast = currentQ === shuffledQuestions.length - 1;
  const question = shuffledQuestions[currentQ];

  if (!question || !course) return null;

  const getOptionState = (optionIndex: number): 'default' | 'selected' | 'correct' | 'wrong' | 'disabled' => {
    const selected = answers[currentQ];
    if (selected === null) return 'default';
    if (!isPractice) {
      if (optionIndex === selected) return 'selected';
      return 'disabled';
    }
    if (optionIndex === question.answer) return 'correct';
    if (optionIndex === selected && selected !== question.answer) return 'wrong';
    return 'disabled';
  };

  return (
    <div className="px-3.5 pt-4 pb-24">
      <GlassCard>
        {/* Top Info */}
        <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
          <div>
            <div className="text-[15px] font-bold" style={{ color: '#fff' }}>{course.subject}</div>
            <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {isPractice ? '📖 Practice' : '⏱️ Exam'} · {shuffledQuestions.length} questions
            </div>
          </div>
          {!isPractice && <TimerPill formatted={formatted} isWarning={isWarning} isDanger={isDanger} />}
        </div>

        {/* Progress */}
        <div className="h-1 rounded-sm overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-sm transition-all duration-300"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
          />
        </div>
        <div className="text-[11px] text-right mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Q{currentQ + 1}/{shuffledQuestions.length} · {answeredCount} answered
        </div>

        {/* Question Dots */}
        <QuestionDots total={shuffledQuestions.length} current={currentQ} answers={answers} onDotClick={goToQuestion} />

        {/* Question */}
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Question {currentQ + 1}
        </div>
        <div className="text-[17px] font-semibold leading-relaxed mb-5" style={{ color: '#fff' }}>
          {question.q}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-1.5">
          {question.options.map((opt, i) => (
            <OptionButton
              key={i}
              letter={['A', 'B', 'C', 'D'][i]}
              text={opt}
              state={getOptionState(i)}
              onClick={() => selectAnswer(i)}
            />
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && isPractice && answers[currentQ] !== null && (
          <div
            className="mt-3 rounded-[14px] p-3.5 text-sm leading-relaxed"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: 'rgba(255,255,255,0.85)' }}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>💡 Explanation</div>
            {question.explanation}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-2 mt-3.5 justify-between">
          <button
            onClick={() => goToQuestion(currentQ - 1)}
            disabled={currentQ === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          >
            ← Prev
          </button>
          <div className="flex gap-1.5">
            {(isLast || allAnswered) && (
              <button
                onClick={finishExam}
                className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              >
                Submit ✓
              </button>
            )}
            {!isLast && (
              <button
                onClick={() => goToQuestion(currentQ + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
