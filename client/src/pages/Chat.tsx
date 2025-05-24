import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { Message, ChatMessage } from "@/types";
import { chatService } from "../../services/chatService";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      let conversations = await chatService.getAllConversations();

      if (conversations.length === 0) {
        await chatService.initializeWithSampleData();
        conversations = await chatService.getAllConversations();
        if (conversations.length === 0) {
          console.error("Failed to load conversations even after initialization.");
          // Optionally, display an empty chat or a specific message to the user
          return;
        }
      }

      const firstConversation = conversations[0];
      setCurrentConversationId(firstConversation.id); // Set currentConversationId
      const chatMessages = await chatService.getMessagesForConversation(firstConversation.id);

      const transformedMessages: Message[] = chatMessages.map((chatMessage: ChatMessage) => ({
        id: chatMessage.id.toString(),
        role: chatMessage.sender === 'ai' ? 'assistant' : 'user',
        content: chatMessage.content,
        timestamp: chatMessage.timestamp.toISOString(),
      }));

      setMessages(transformedMessages);
    };

    loadMessages();
  }, []);

  const handleSendMessage = async (content: string) => {
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    let conversationIdToUse = currentConversationId;

    if (!conversationIdToUse) {
      const newConversation = await chatService.createConversation({ title: 'New Conversation' });
      setCurrentConversationId(newConversation.id);
      conversationIdToUse = newConversation.id;
    }

    if (conversationIdToUse) {
      await chatService.createMessage({
        content: userMessage.content,
        sender: 'user',
        conversationId: conversationIdToUse,
      });
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // AI 응답 메시지 추가
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.message || "응답을 받지 못했습니다.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      if (conversationIdToUse) {
        await chatService.createMessage({
          content: aiMessage.content,
          sender: 'ai',
          conversationId: conversationIdToUse,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // 에러 메시지 추가
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "죄송합니다. 메시지를 처리하는 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      if (conversationIdToUse) {
        // Also save error messages if needed, or decide how to handle them
        await chatService.createMessage({
          content: errorMessage.content,
          sender: 'ai', // Or 'system' if you want to differentiate
          conversationId: conversationIdToUse,
        });
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto" id="chat-container">
        <ChatMessages messages={messages} isTyping={isTyping} />
      </main>
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default Chat;
