import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "@/types";
import { format } from "date-fns";
import { User, Bot } from "lucide-react";
import TypingIndicator from "./TypingIndicator";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

const formatTime = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return format(new Date(), "HH:mm");
    }
    return format(date, "HH:mm");
  } catch (error) {
    return format(new Date(), "HH:mm");
  }
};

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when typing starts/stops
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Message animation variants
  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  if (messages.length === 0 && !isTyping) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={cn(
              "py-6 px-4",
              message.role === "user" ? "bg-background" : "bg-muted/30"
            )}
          >
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user" ? "bg-blue-500" : "bg-green-500"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>

              <div className="flex-1">
                <div className="font-medium text-foreground mb-1">
                  {message.role === "user" ? "You" : "ChatGPT"}
                </div>
                <div className="text-foreground whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {formatTime(message.timestamp)}
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
            className="py-6 px-4 bg-muted/30"
          >
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>

              <div className="flex-1">
                <div className="font-medium text-foreground">ChatGPT</div>
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
