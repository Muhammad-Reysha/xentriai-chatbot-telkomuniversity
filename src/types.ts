export type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
};

export type ChatSession = {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
};
