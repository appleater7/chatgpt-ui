import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/components/AdminLayout';
import SessionDetailModal from '@/components/SessionDetailModal';
import { Search, RefreshCw, Info, X, Loader2 } from 'lucide-react';
import { adminService, type Session, type SessionActivity } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

const AdminSessionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const itemsPerPage = 5;
  const { toast } = useToast();

  // 로그인 상태 초기화
  useEffect(() => {
    setIsAuthenticated(adminService.isAuthenticated());
  }, []);

  // API에서 세션 목록 가져오기
  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-sessions', isAuthenticated],
    queryFn: async () => {
      return await adminService.getAllSessions();
    }
  });

  // 선택한 세션의 활동 내역 가져오기
  const { data: sessionActivities = [], isLoading: isLoadingActivities } = useQuery({
    queryKey: ['session-activities', selectedSession?.id],
    queryFn: async () => {
      if (!selectedSession) return [];
      return await adminService.getSessionActivities(selectedSession.id);
    },
    enabled: !!selectedSession
  });

  // 검색 필터링
  const filteredSessions = sessions.filter(session => 
    session.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.ipAddress.includes(searchTerm)
  );

  // 페이지네이션
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 세션 상세 정보 모달 열기
  const handleOpenSessionDetail = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  // 세션 상세 정보 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 세션 종료 처리
  const handleTerminateSession = async (sessionId: string) => {
    setIsLoggingIn(true);
    try {
      const success = await adminService.terminateSession(sessionId);
      if (success) {
        toast({
          title: "세션 종료 완료",
          description: "세션이 성공적으로 종료되었습니다.",
        });
        await refetch();
      } else {
        toast({
          title: "세션 종료 실패",
          description: "세션 종료 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "세션 종료 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 인증 상태 토글 (로그인/로그아웃 시뮬레이션)
  const handleAuthToggle = (checked: boolean) => {
    setIsLoggingIn(true);
    
    setTimeout(() => {
      adminService.setAuthStatus(checked);
      setIsAuthenticated(checked);
      refetch();
      
      toast({
        title: checked ? "로그인 완료" : "로그아웃 완료",
        description: checked 
          ? "이제 실제 데이터베이스 연결을 사용합니다." 
          : "이제 샘플 데이터를 사용합니다.",
      });
      
      setIsLoggingIn(false);
    }, 1000); // 로그인/로그아웃 시뮬레이션 딜레이
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">세션 관리</h1>
            {isLoggingIn ? (
              <div className="flex items-center space-x-2 text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{isAuthenticated ? '로그아웃 중...' : '로그인 중...'}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm">샘플 데이터</span>
                <Switch
                  checked={isAuthenticated}
                  onCheckedChange={handleAuthToggle}
                  aria-label="데이터 소스 전환"
                />
                <span className="text-sm">실제 데이터</span>
                <Badge 
                  variant={isAuthenticated ? "default" : "secondary"}
                  className="ml-2"
                >
                  {isAuthenticated ? '회원 모드' : '비회원 모드'}
                </Badge>
              </div>
            )}
          </div>
          <Button 
            onClick={() => refetch()} 
            className="flex items-center gap-2"
            disabled={isLoggingIn}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>새로고침</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="사용자 이름, 세션 ID 또는 IP 주소로 검색..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading || isLoggingIn}
            />
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">상태</TableHead>
                <TableHead>세션 ID</TableHead>
                <TableHead>사용자</TableHead>
                <TableHead>IP 주소</TableHead>
                <TableHead>생성 일시</TableHead>
                <TableHead>마지막 활동</TableHead>
                <TableHead className="w-[100px]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : currentSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                currentSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Badge variant={session.isActive ? "default" : "destructive"}>
                        {session.isActive ? '활성' : '비활성'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {session.id}
                    </TableCell>
                    <TableCell>{session.username}</TableCell>
                    <TableCell>{session.ipAddress}</TableCell>
                    <TableCell>
                      {format(session.createdAt, 'yyyy-MM-dd HH:mm')}
                    </TableCell>
                    <TableCell>
                      {format(session.lastActive, 'yyyy-MM-dd HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="세션 종료"
                          onClick={() => handleTerminateSession(session.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="상세 정보"
                          onClick={() => handleOpenSessionDetail(session)}
                        >
                          <Info className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 */}
        {filteredSessions.length > itemsPerPage && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* 세션 상세 정보 모달 */}
        <SessionDetailModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          session={selectedSession}
          activities={sessionActivities}
          isLoadingActivities={isLoadingActivities}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSessionsPage;