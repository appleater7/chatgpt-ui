export interface ChatMessage {
  id: number;
  content: string;
  sender: 'user' | 'ai';
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
