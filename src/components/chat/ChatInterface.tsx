import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, LogOut, Loader2, Sparkles } from 'lucide-react';
import { useChatStore } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message, ApiResponse } from '@shared/types';
import { toast } from 'sonner';
export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = useChatStore((s) => s.user);
  const token = useChatStore((s) => s.token);
  const logout = useChatStore((s) => s.logout);
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/chat/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        logout();
        throw new Error('Session expired');
      }
      const json = await res.json() as ApiResponse<Message[]>;
      return json.data ?? [];
    },
    refetchInterval: 2000,
    enabled: !!token,
  });
  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text }),
      });
      if (res.status === 401) {
        logout();
        throw new Error('Session expired');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send message');
    }
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
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-none">Luma Chat</h1>
            <p className="text-[10px] text-muted-foreground mt-1">Private Encrypted Log</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold">{user?.username}</span>
            <span className="text-[10px] text-muted-foreground">Session Active</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>
      <ScrollArea className="flex-1 px-4 py-6">
        {isLoading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm text-muted-foreground">Retrieving history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-40">
            <Sparkles className="w-12 h-12 mb-4 text-indigo-400" />
            <p className="text-sm">Start your private conversation</p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                timestamp={msg.timestamp}
                isSelf={true} // In private logs, sender is always self or system
              />
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>
      <div className="p-4 sm:p-6 bg-gradient-to-t from-background via-background/95 to-transparent">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 rounded-2xl bg-secondary/50 border-none focus-visible:ring-2 focus-visible:ring-indigo-600 h-12 px-6 shadow-inner"
          />
          <Button
            type="submit"
            disabled={!input.trim() || sendMessage.isPending}
            className="rounded-2xl w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white p-0 shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            {sendMessage.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
};