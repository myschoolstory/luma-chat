import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
interface MessageBubbleProps {
  sender: string;
  text: string;
  timestamp: number;
  isSelf: boolean;
}
export const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text, timestamp, isSelf }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex flex-col mb-4 max-w-[80%]",
        isSelf ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div className="flex items-center gap-2 mb-1 px-1">
        {!isSelf && <span className="text-xs font-semibold text-foreground/70">{sender}</span>}
        <span className="text-[10px] text-muted-foreground">
          {format(timestamp, 'HH:mm')}
        </span>
      </div>
      <div
        className={cn(
          "px-4 py-2.5 rounded-2xl shadow-sm break-words",
          isSelf 
            ? "bg-indigo-600 text-white rounded-tr-none" 
            : "bg-secondary text-secondary-foreground rounded-tl-none"
        )}
      >
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
};