import { Conversation, ChatMessage } from '../types';

interface InsertConversation {
  title: string;
}

interface InsertMessage {
  content: string;
  sender: 'user' | 'ai';
  conversationId: number;
}

export class ChatService {
  private static CONVERSATIONS_KEY = 'chatgpt_conversations';
  private static MESSAGES_KEY = 'chatgpt_messages';
  private static CURRENT_ID_KEY = 'chatgpt_current_ids';

  constructor() {
    if (!this.loadFromStorage<{ message: number; conversation: number }>(ChatService.CURRENT_ID_KEY)) {
      this.saveToStorage(ChatService.CURRENT_ID_KEY, { message: 1, conversation: 1 });
    }
  }

  getAllConversations(): Conversation[] {
    const conversations = this.loadFromStorage<Conversation[]>(ChatService.CONVERSATIONS_KEY) || [];
    return conversations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getConversation(id: number): Conversation | undefined {
    const conversations = this.loadFromStorage<Conversation[]>(ChatService.CONVERSATIONS_KEY) || [];
    return conversations.find(conv => conv.id === id);
  }

  createConversation(conversation: InsertConversation): Conversation {
    const id = this.generateId('conversation');
    const createdAt = new Date();
    
    const newConversation: Conversation = {
      ...conversation,
      id,
      createdAt
    };
    
    const conversations = this.loadFromStorage<Conversation[]>(ChatService.CONVERSATIONS_KEY) || [];
    conversations.push(newConversation);
    this.saveToStorage(ChatService.CONVERSATIONS_KEY, conversations);
    
    return newConversation;
  }

  deleteConversation(id: number): boolean {
    const conversations = this.loadFromStorage<Conversation[]>(ChatService.CONVERSATIONS_KEY) || [];
    const initialLength = conversations.length;
    
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    this.saveToStorage(ChatService.CONVERSATIONS_KEY, updatedConversations);
    
    const messages = this.loadFromStorage<ChatMessage[]>(ChatService.MESSAGES_KEY) || [];
    const updatedMessages = messages.filter(msg => msg.conversationId !== id);
    this.saveToStorage(ChatService.MESSAGES_KEY, updatedMessages);
    
    return initialLength > updatedConversations.length;
  }

  getMessagesForConversation(conversationId: number): ChatMessage[] {
    const messages = this.loadFromStorage<ChatMessage[]>(ChatService.MESSAGES_KEY) || [];
    return messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  createMessage(message: InsertMessage): ChatMessage {
    const id = this.generateId('message');
    const timestamp = new Date();
    
    const newMessage: ChatMessage = {
      ...message,
      id,
      timestamp
    };
    
    const messages = this.loadFromStorage<ChatMessage[]>(ChatService.MESSAGES_KEY) || [];
    messages.push(newMessage);
    this.saveToStorage(ChatService.MESSAGES_KEY, messages);
    
    return newMessage;
  }

  private generateId(type: 'conversation' | 'message'): number {
    const currentIds = this.loadFromStorage<{ message: number; conversation: number }>(ChatService.CURRENT_ID_KEY) || 
      { message: 1, conversation: 1 };
    
    let id: number;
    if (type === 'conversation') {
      id = currentIds.conversation++;
    } else {
      id = currentIds.message++;
    }
    
    this.saveToStorage(ChatService.CURRENT_ID_KEY, currentIds);
    return id;
  }

  private saveToStorage(key: string, data: any): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private loadFromStorage<T>(key: string): T | null {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return null;
    }
    
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) {
        return null;
      }
      
      const data = JSON.parse(serialized);
      
      if (Array.isArray(data)) {
        return data.map(item => {
          if (item.timestamp && typeof item.timestamp === 'string') {
            const parsedDate = new Date(item.timestamp);
            item.timestamp = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
          }
          if (item.createdAt && typeof item.createdAt === 'string') {
            const parsedDate = new Date(item.createdAt);
            item.createdAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
          }
          return item;
        }) as T;
      } else if (typeof data === 'object' && data !== null) {
        if (data.timestamp && typeof data.timestamp === 'string') {
          const parsedDate = new Date(data.timestamp);
          data.timestamp = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
        }
        if (data.createdAt && typeof data.createdAt === 'string') {
          const parsedDate = new Date(data.createdAt);
          data.createdAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
        }
      }
      
      return data as T;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  initializeWithSampleData(): void {
    if (this.getAllConversations().length === 0) {
      const conversation = this.createConversation({
        title: '샘플 대화'
      });
      
      this.createMessage({
        content: '안녕하세요! ChatGPT에 오신 것을 환영합니다.',
        sender: 'ai',
        conversationId: conversation.id
      });
      
      this.createMessage({
        content: '안녕하세요, 도움이 필요합니다.',
        sender: 'user',
        conversationId: conversation.id
      });
      
      this.createMessage({
        content: '네, 어떤 도움이 필요하신가요? 질문이나 도움이 필요한 내용을 알려주시면 최선을 다해 도와드리겠습니다.',
        sender: 'ai',
        conversationId: conversation.id
      });
    }
  }
}

export const chatService = new ChatService();
