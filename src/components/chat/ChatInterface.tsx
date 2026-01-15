import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, LogOut, Loader2 } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message, ApiResponse } from '@shared/types';
export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const username = useChatStore((s) => s.username);
  const leave = useChatStore((s) => s.leave);
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const res = await fetch('/api/chat/messages');
      const json = await res.json() as ApiResponse<Message[]>;
      return json.data ?? [];
    },
    refetchInterval: 1500,
  });
  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: username, text }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isPending) return;
    sendMessage.mutate(input.trim());
    setInput('');
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background border-x relative">
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <h1 className="font-bold tracking-tight text-xl">Luma</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground hidden sm:inline">Logged in as {username}</span>
          <Button variant="ghost" size="icon" onClick={leave}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>
      <ScrollArea className="flex-1 px-4 py-6">
        {isLoading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm text-muted-foreground">Connecting to the ether...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                timestamp={msg.timestamp}
                isSelf={msg.sender === username}
              />
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>
      <div className="p-4 sm:p-6 bg-gradient-to-t from-background via-background/95 to-transparent">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full bg-secondary border-none focus-visible:ring-2 focus-visible:ring-indigo-600 h-12 px-6 shadow-sm"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || sendMessage.isPending}
            className="rounded-full w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white p-0 shadow-lg transition-transform active:scale-90"
          >
            {sendMessage.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
};