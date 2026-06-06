import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from '@/context/AppContext';
import AmbientOrbs from '@/components/AmbientOrbs';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';
import HomePage from '@/sections/HomePage';
import SubjectDetailPage from '@/sections/SubjectDetailPage';
import ExamPage from '@/sections/ExamPage';
import ResultsPage from '@/sections/ResultsPage';
import BoardPage from '@/sections/BoardPage';
import ChatPage from '@/sections/ChatPage';
import MorePage from '@/sections/MorePage';
import ScanOverlay from '@/sections/ScanOverlay';
import SchoolSetup from '@/sections/SchoolSetup';
import AITutorOverlay from '@/sections/AITutorOverlay';
import './App.css';

function AppContent() {
  const { state } = useApp();
  const { toast } = state;

  const renderPage = () => {
    switch (state.page) {
      case 'home':
        return <HomePage key="home" />;
      case 'subject':
        return <SubjectDetailPage key="subject" />;
      case 'exam':
        return <ExamPage key="exam" />;
      case 'results':
        return <ResultsPage key="results" />;
      case 'board':
        return <BoardPage key="board" />;
      case 'chat':
        return <ChatPage key="chat" />;
      case 'more':
        return <MorePage key="more" />;
      default:
        return <HomePage key="home-default" />;
    }
  };

  const showNav = ['home', 'board', 'chat', 'more'].includes(state.page);

  return (
    <div className="min-h-screen relative" style={{ background: '#04060f' }}>
      <AmbientOrbs />

      {/* Main Content */}
      <div className="relative z-[1] max-w-[600px] mx-auto min-h-screen flex flex-col" style={{ background: 'rgba(4,6,15,0.4)', backdropFilter: 'blur(80px)' }}>
        <TopBar />

        <main className="flex-1" style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {showNav && <BottomNav />}
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {state.page === 'scan' && <ScanOverlay key="scan" />}
        {state.page === 'schoolSetup' && <SchoolSetup key="schoolSetup" />}
        {state.page === 'tutor' && <AITutorOverlay key="tutor" />}
      </AnimatePresence>

      {/* Toast */}
      <Toast message={toast} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
