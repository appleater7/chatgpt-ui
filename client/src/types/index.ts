export interface ChatMessage {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  conversationId: number;
}

export interface Conversation {
  id: number;
  title: string;
  createdAt: Date;
}

export interface SampleQuestion {
  text: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
}
