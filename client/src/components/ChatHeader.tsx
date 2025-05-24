import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Plus, Menu } from 'lucide-react';

interface ChatHeaderProps {
  onNewChat: () => void;
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onNewChat, 
  toggleSidebar,
  isSidebarOpen 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b dark:border-dark-border border-light-border py-2 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        {/* Sidebar menu toggle (on mobile/smaller screens) */}
        {toggleSidebar && (
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="mr-1 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {/* ChatGPT Logo */}
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h1 className="font-semibold text-lg hidden sm:block">ChatGPT</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          onClick={onNewChat}
          className="bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">New Chat</span>
        </Button>
        
        <Button 
          onClick={toggleTheme}
          variant="ghost" 
          size="icon"
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-dark-tertiary dark:hover:bg-dark-tertiary transition-colors"
        >
          {theme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
