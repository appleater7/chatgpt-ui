import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types';
import { format } from 'date-fns';
import { User, Bot } from 'lucide-react';
import TypingIndicator from './TypingIndicator';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when typing starts/stops
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Message animation variants
  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  if (messages.length === 0 && !isTyping) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={`py-6 px-4 ${
              message.sender === 'user' 
                ? 'bg-dark-primary dark:bg-dark-primary' 
                : 'bg-dark-secondary dark:bg-dark-secondary'
            }`}
          >
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' ? 'bg-accent' : 'bg-green-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">
                  {message.sender === 'user' ? 'You' : 'ChatGPT'}
                </div>
                <div className="mt-1 whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp && !isNaN(new Date(message.timestamp).getTime()) 
                    ? format(message.timestamp, 'h:mm a') 
                    : 'Invalid time'}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="py-6 px-4 bg-dark-secondary dark:bg-dark-secondary"
          >
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="font-medium">
                  ChatGPT
                </div>
                <TypingIndicator />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
