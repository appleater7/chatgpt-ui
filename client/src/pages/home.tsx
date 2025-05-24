import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import ChatHeader from '@/components/ChatHeader';
import Sidebar from '@/components/Sidebar';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import { featureCards, sampleQuestions } from '@/data/sampleMessages';
import { ChatMessage, Conversation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Home: React.FC = () => {
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Fetch messages for the current conversation
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/conversations', currentConversationId, 'messages'],
    enabled: currentConversationId !== null,
  });

  // Create a new conversation
  const createConversation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest('POST', '/api/conversations', { title });
      return response.json();
    },
    onSuccess: (data: Conversation) => {
      setCurrentConversationId(data.id);
      setShowWelcomeScreen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create a new conversation',
        variant: 'destructive',
      });
      console.error('Error creating conversation:', error);
    },
  });

  // Send a new message
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!currentConversationId) {
        throw new Error('No active conversation');
      }
      
      setIsTyping(true);
      
      const response = await apiRequest('POST', '/api/messages', {
        content,
        sender: 'user',
        conversationId: currentConversationId,
      });
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the messages query to refetch the messages
      queryClient.invalidateQueries({ 
        queryKey: ['/api/conversations', currentConversationId, 'messages'] 
      });
      
      // Set a timeout to simulate the AI typing, then fetch again
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/conversations', currentConversationId, 'messages'] 
        });
        setIsTyping(false);
      }, 2000);
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      console.error('Error sending message:', error);
    },
  });

  // Handle starting a new chat
  const handleNewChat = () => {
    setCurrentConversationId(null);
    setShowWelcomeScreen(true);
    // On mobile, close sidebar when starting a new chat
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Handle selecting an existing conversation
  const handleSelectConversation = (id: number) => {
    setCurrentConversationId(id);
    setShowWelcomeScreen(false);
    // On mobile, close sidebar when selecting a conversation
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = (content: string) => {
    if (showWelcomeScreen) {
      // Create a new conversation if we're on the welcome screen
      createConversation.mutate(`Chat ${new Date().toLocaleString()}`);
    }
    
    if (currentConversationId) {
      sendMessage.mutate(content);
    } else {
      // Wait for createConversation to finish and set the ID before sending
      createConversation.mutate(`Chat ${new Date().toLocaleString()}`);
      // The message will be sent after the conversation is created
      setTimeout(() => {
        if (currentConversationId) {
          sendMessage.mutate(content);
        }
      }, 300);
    }
  };

  // Handle clicking a sample question
  const handleSampleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isSidebarOpen && (
        <Sidebar 
          onNewChat={handleNewChat} 
          onSelectConversation={handleSelectConversation}
          currentConversationId={currentConversationId}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          onNewChat={handleNewChat} 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto bg-background" id="chat-container">
          {showWelcomeScreen ? (
            <WelcomeScreen 
              featureCards={featureCards}
              sampleQuestions={sampleQuestions}
              onSampleQuestionClick={handleSampleQuestionClick}
            />
          ) : (
            <ChatMessages 
              messages={messages} 
              isTyping={isTyping}
            />
          )}
        </main>
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          isDisabled={sendMessage.isPending || createConversation.isPending}
        />
      </div>
    </div>
  );
};

export default Home;
