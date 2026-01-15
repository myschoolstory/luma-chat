import { Hono } from "hono";
import { Env } from './core-utils';
import type { Message, ApiResponse } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/chat/messages', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getMessages();
        return c.json({ success: true, data } satisfies ApiResponse<Message[]>);
    });
    app.post('/api/chat/messages', async (c) => {
        const body = await c.req.json() as { sender: string; text: string };
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.addMessage(body.sender, body.text);
        return c.json({ success: true, data } satisfies ApiResponse<Message[]>);
    });
}