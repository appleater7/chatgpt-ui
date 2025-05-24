import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Folder, 
  ChevronDown, 
  ChevronRight,
  PenSquare,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNewChat: () => void;
  onSelectConversation: (id: number) => void;
  currentConversationId: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  onSelectConversation,
  currentConversationId
}) => {
  const [isChatsOpen, setIsChatsOpen] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
  });

  // Delete conversation
  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/conversations/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete conversation.",
        variant: "destructive",
      });
      console.error('Error deleting conversation:', error);
    },
  });

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    deleteConversationMutation.mutate(id);
  };

  return (
    <div className="h-full w-64 bg-dark-secondary dark:bg-dark-secondary border-r border-dark-border dark:border-dark-border flex flex-col p-2">
      {/* New Chat Button */}
      <Button 
        onClick={onNewChat}
        className="w-full justify-start gap-2 bg-dark-tertiary dark:bg-dark-tertiary hover:bg-accent hover:text-white text-foreground dark:text-dark-text mb-2"
      >
        <Plus size={16} />
        <span>New chat</span>
      </Button>

      {/* Chats Section */}
      <div className="mb-2">
        <div 
          className="flex items-center p-2 hover:bg-dark-tertiary dark:hover:bg-dark-tertiary rounded cursor-pointer"
          onClick={() => setIsChatsOpen(!isChatsOpen)}
        >
          {isChatsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <div className="flex items-center gap-2 ml-1">
            <MessageSquare size={16} />
            <span className="font-medium">Chats</span>
          </div>
        </div>

        {isChatsOpen && (
          <div className="ml-2 space-y-1 mt-1">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "flex items-center justify-between group p-2 rounded cursor-pointer hover:bg-dark-tertiary dark:hover:bg-dark-tertiary",
                  currentConversationId === conversation.id && "bg-dark-tertiary dark:bg-dark-tertiary"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare size={14} />
                  <span className="truncate text-sm">{conversation.title}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded hover:bg-dark-primary">
                    <PenSquare size={14} />
                  </button>
                  <button 
                    className="p-1 rounded hover:bg-dark-primary"
                    onClick={(e) => handleDelete(e, conversation.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-sm text-muted-foreground p-2">No conversations yet</div>
            )}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div>
        <div 
          className="flex items-center p-2 hover:bg-dark-tertiary dark:hover:bg-dark-tertiary rounded cursor-pointer"
          onClick={() => setIsProjectsOpen(!isProjectsOpen)}
        >
          {isProjectsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <div className="flex items-center gap-2 ml-1">
            <Folder size={16} />
            <span className="font-medium">Projects</span>
          </div>
        </div>

        {isProjectsOpen && (
          <div className="ml-2 space-y-1 mt-1">
            <div className="flex items-center gap-2 p-2 rounded hover:bg-dark-tertiary dark:hover:bg-dark-tertiary cursor-pointer">
              <Folder size={14} />
              <span className="text-sm">Personal Projects</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-dark-tertiary dark:hover:bg-dark-tertiary cursor-pointer">
              <Folder size={14} />
              <span className="text-sm">Work Projects</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-dark-tertiary dark:hover:bg-dark-tertiary cursor-pointer">
              <Folder size={14} />
              <span className="text-sm">Learning Projects</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <div className="text-xs p-2 text-muted-foreground border-t border-dark-border dark:border-dark-border pt-2">
          Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
        </div>
      </div>
    </div>
  );
};

export default Sidebar;