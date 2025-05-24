import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Clock,
  XCircle,
  Shield,
  MapPin,
  Monitor,
  History,
  CheckCircle2,
  Loader2
} from 'lucide-react';

import { type Session, type SessionActivity } from '@/services/adminService';

interface SessionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session | null;
  activities?: SessionActivity[];
  isLoadingActivities?: boolean;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  open,
  onOpenChange,
  session,
  activities = [],
  isLoadingActivities = false
}) => {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            세션 상세 정보
          </DialogTitle>
          <DialogDescription>
            세션 ID: <span className="font-mono">{session.id}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">세션 정보</TabsTrigger>
            <TabsTrigger value="activity">활동 내역</TabsTrigger>
            <TabsTrigger value="management">세션 관리</TabsTrigger>
          </TabsList>
          
          {/* 세션 상세 정보 탭 */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">상태</h3>
                  <Badge variant={session.isActive ? "default" : "destructive"}>
                    {session.isActive ? '활성' : '비활성'}
                  </Badge>
                </div>
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">사용자 정보</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div>
                      <p className="text-xs text-muted-foreground">사용자 ID</p>
                      <p className="font-mono text-sm">{session.userId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">사용자명</p>
                      <p className="text-sm">{session.username}</p>
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">시간 정보</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div>
                      <p className="text-xs text-muted-foreground">생성 일시</p>
                      <p className="text-sm">{format(session.createdAt, 'yyyy-MM-dd HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">마지막 활동</p>
                      <p className="text-sm">{format(session.lastActive, 'yyyy-MM-dd HH:mm')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">접속 위치</span>
                  </div>
                  <div className="pl-6">
                    <p className="text-xs text-muted-foreground">IP 주소</p>
                    <p className="text-sm font-mono">{session.ipAddress}</p>
                    <p className="text-xs text-muted-foreground mt-2">위치</p>
                    <p className="text-sm">서울특별시, 대한민국 (추정)</p>
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">기기 정보</span>
                  </div>
                  <div className="pl-6">
                    <p className="text-xs text-muted-foreground">브라우저</p>
                    <p className="text-sm">{session.userAgent}</p>
                    <p className="text-xs text-muted-foreground mt-2">운영체제</p>
                    <p className="text-sm">
                      {session.userAgent.includes('Windows') ? 'Windows' : 
                       session.userAgent.includes('Mac') ? 'macOS' : 
                       session.userAgent.includes('iPhone') || session.userAgent.includes('iPad') ? 'iOS' :
                       session.userAgent.includes('Linux') ? 'Linux' : '기타'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* 활동 내역 탭 */}
          <TabsContent value="activity">
            <div className="space-y-6">
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b">
                  <h3 className="font-medium">최근 활동 기록</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y">
                  {isLoadingActivities ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">활동 내역을 불러오는 중...</span>
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <p>활동 내역이 없습니다.</p>
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="px-4 py-3 hover:bg-muted/50">
                        <div className="flex justify-between">
                          <span className="font-medium">{activity.action}</span>
                          <span className="text-sm text-muted-foreground">
                            {format(activity.timestamp, 'yyyy-MM-dd HH:mm:ss')}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{activity.details}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {activities.length > 0 && (
                <div className="flex justify-center">
                  <Button variant="outline">이전 활동 더 보기</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* 세션 관리 탭 */}
          <TabsContent value="management" className="space-y-6">
            <div className="border rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">세션 종료</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  이 세션을 강제로 종료합니다. 사용자는 다시 로그인해야 합니다.
                </p>
              </div>
              <Button variant="destructive" className="sm:self-end">
                <XCircle className="h-4 w-4 mr-2" />
                세션 종료
              </Button>
            </div>
            
            <div className="border rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">세션 일시 중지</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  세션을 일시적으로 중지합니다. 사용자는 서비스를 이용할 수 없지만 세션은 유지됩니다.
                </p>
              </div>
              <Button variant="outline" className="sm:self-end">
                <History className="h-4 w-4 mr-2" />
                일시 중지
              </Button>
            </div>
            
            <div className="border rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">정상 세션으로 표시</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  이 세션을 검증된 정상 세션으로 표시합니다. 보안 검사를 우회합니다.
                </p>
              </div>
              <Button variant="outline" className="sm:self-end">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                정상 표시
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailModal;