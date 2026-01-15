export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}
export interface ChatState {
  messages: Message[];
}
export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}