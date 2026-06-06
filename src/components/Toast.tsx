import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-[90px] left-1/2 -translate-x-1/2 z-[9999] pointer-events-none whitespace-nowrap"
          style={{
            background: 'rgba(20,20,40,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
