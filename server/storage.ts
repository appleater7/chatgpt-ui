import { 
  messages, type Message, type InsertMessage,
  conversations, type Conversation, type InsertConversation
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesForConversation(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Conversation operations
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  deleteConversation(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private conversations: Map<number, Conversation>;
  private messageCurrentId: number;
  private conversationCurrentId: number;

  constructor() {
    this.messages = new Map();
    this.conversations = new Map();
    this.messageCurrentId = 1;
    this.conversationCurrentId = 1;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesForConversation(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const timestamp = new Date();
    const message: Message = { 
      ...insertMessage, 
      id,
      timestamp
    };
    this.messages.set(id, message);
    return message;
  }

  // Conversation operations
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationCurrentId++;
    const createdAt = new Date();
    const conversation: Conversation = { 
      ...insertConversation, 
      id,
      createdAt 
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async deleteConversation(id: number): Promise<boolean> {
    if (!this.conversations.has(id)) {
      return false;
    }
    
    // Delete the conversation
    this.conversations.delete(id);
    
    // Delete all messages in the conversation
    const messagesToDelete = Array.from(this.messages.values())
      .filter(message => message.conversationId === id)
      .map(message => message.id);
    
    messagesToDelete.forEach(messageId => {
      this.messages.delete(messageId);
    });
    
    return true;
  }
}

export const storage = new MemStorage();
