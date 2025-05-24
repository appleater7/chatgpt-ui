import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDisabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isDisabled) return;
    
    onSendMessage(message);
    setMessage('');
    
    // Reset height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t dark:border-dark-border border-light-border p-4">
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT..."
            className="w-full py-3 px-4 pr-12 border border-dark-border dark:border-dark-border rounded-lg bg-dark-tertiary dark:bg-dark-tertiary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            rows={1}
            disabled={isDisabled}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!message.trim() || isDisabled}
            className="absolute right-3 bottom-3 text-accent hover:text-accent-hover transition-colors duration-200 disabled:opacity-40 disabled:hover:text-accent"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-xs mt-2 text-center opacity-70">
          ChatGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
