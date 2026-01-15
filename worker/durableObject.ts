import { DurableObject } from "cloudflare:workers";
import type { Message } from '@shared/types';
export class GlobalDurableObject extends DurableObject {
    private readonly MAX_MESSAGES = 50;
    async getMessages(): Promise<Message[]> {
      const messages = (await this.ctx.storage.get<Message[]>("chat_messages")) || [];
      return messages;
    }
    async addMessage(sender: string, text: string): Promise<Message[]> {
      const messages = await this.getMessages();
      const newMessage: Message = {
        id: crypto.randomUUID(),
        sender,
        text,
        timestamp: Date.now(),
      };
      const updatedMessages = [...messages, newMessage].slice(-this.MAX_MESSAGES);
      await this.ctx.storage.put("chat_messages", updatedMessages);
      return updatedMessages;
    }
    // Keeping boilerplate methods for compatibility if needed, though chat is primary
    async getCounterValue(): Promise<number> {
      return (await this.ctx.storage.get<number>("counter_value")) || 0;
    }
    async increment(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get<number>("counter_value")) || 0;
      value += amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
}