import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useChatStore } from '@/lib/store';
import { Onboarding } from '@/components/chat/Onboarding';
import { ChatInterface } from '@/components/chat/ChatInterface';
export function HomePage() {
  const hasJoined = useChatStore((s) => s.hasJoined);
  return (
    <div className="relative min-h-screen bg-background font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full" />
      </div>
      <ThemeToggle />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {!hasJoined ? (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Onboarding />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Toaster richColors position="top-center" />
    </div>
  );
}