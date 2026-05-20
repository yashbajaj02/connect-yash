import { AnimatePresence, motion } from 'framer-motion';

export type ToastMessage = {
  id: number;
  text: string;
  tone?: 'success' | 'error' | 'info';
};

export function Toasts({ messages }: { messages: ToastMessage[] }) {
  return (
    <div className="fixed right-4 top-24 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            className="glass rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white"
          >
            <span
              className={
                message.tone === 'error'
                  ? 'text-rose-400'
                  : message.tone === 'success'
                    ? 'text-aurora'
                    : 'text-cyber'
              }
            >
              {message.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
