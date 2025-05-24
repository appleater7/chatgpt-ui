import React, { ReactNode, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  BarChart2, 
  Shield, 
  Bell, 
  Menu, 
  X
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminMenuItems = [
    { 
      label: '대시보드', 
      href: '/admin', 
      icon: <BarChart2 size={20} /> 
    },
    { 
      label: '세션 관리', 
      href: '/admin/sessions', 
      icon: <Shield size={20} /> 
    },
    { 
      label: '사용자 관리', 
      href: '/admin/users', 
      icon: <Users size={20} /> 
    },
    { 
      label: '대화 관리', 
      href: '/admin/conversations', 
      icon: <MessageSquare size={20} /> 
    },
    { 
      label: '알림 설정', 
      href: '/admin/notifications', 
      icon: <Bell size={20} /> 
    },
    { 
      label: '시스템 설정', 
      href: '/admin/settings', 
      icon: <Settings size={20} /> 
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* 모바일 토글 버튼 */}
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* 사이드바 */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out z-40",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-bold text-lg">ChatGPT 관리자</h1>
          </div>
          
          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-2">메뉴</div>
            <nav className="space-y-1">
              {adminMenuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer",
                      location === item.href && "bg-accent/50 text-accent-foreground font-medium"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.label === '알림 설정' && (
                      <Badge className="ml-auto" variant="default">3</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/admin-avatar.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">관리자</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <header className="border-b border-border p-4 bg-card flex items-center justify-between h-16">
          <div>
            <h2 className="text-xl font-bold">관리자 대시보드</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={toggleTheme} title="테마 변경">
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </Button>
            <Button variant="outline" size="icon" title="알림">
              <Bell size={20} />
            </Button>
          </div>
        </header>

        <main className="h-[calc(100vh-4rem)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;