import { apiRequest } from '@/lib/queryClient';

// 타입 정의
export interface Session {
  id: string;
  userId: string;
  username: string;
  createdAt: Date;
  lastActive: Date;
  isActive: boolean;
  ipAddress: string;
  userAgent: string;
}

export interface SessionActivity {
  id: number;
  sessionId: string;
  action: string;
  timestamp: Date;
  details: string;
}

// 사용자 인증 상태 확인 (실제로는 로그인 시스템과 연동)
const isUserAuthenticated = (): boolean => {
  // localStorage에서 인증 토큰이 있는지 확인
  return localStorage.getItem('auth_token') !== null;
};

// API 호출 시 인증 상태에 따른 URL 파라미터 설정
const getApiUrl = (endpoint: string): string => {
  // 인증된 사용자면 authenticated=true 파라미터 추가
  const authenticated = isUserAuthenticated() ? '?authenticated=true' : '';
  return `/api/admin/${endpoint}${authenticated}`;
};

// 관리자 서비스 클래스
export class AdminService {
  // 모든 세션 가져오기
  async getAllSessions(): Promise<Session[]> {
    try {
      const response = await apiRequest('GET', getApiUrl('sessions'));
      const data = await response.json();
      
      // 날짜 필드를 Date 객체로 변환
      return data.map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        lastActive: new Date(session.lastActive)
      }));
    } catch (error) {
      console.error('세션 목록 가져오기 오류:', error);
      // 오류 발생 시 빈 배열 반환
      return [];
    }
  }

  // 특정 세션 가져오기
  async getSessionById(sessionId: string): Promise<Session | null> {
    try {
      const response = await apiRequest('GET', getApiUrl(`sessions/${sessionId}`));
      const data = await response.json();
      
      // 날짜 필드를 Date 객체로 변환
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        lastActive: new Date(data.lastActive)
      };
    } catch (error) {
      console.error(`세션 ID ${sessionId} 가져오기 오류:`, error);
      return null;
    }
  }

  // 세션 활동 내역 가져오기
  async getSessionActivities(sessionId: string): Promise<SessionActivity[]> {
    try {
      const response = await apiRequest('GET', getApiUrl(`sessions/${sessionId}/activities`));
      const data = await response.json();
      
      // 날짜 필드를 Date 객체로 변환
      return data.map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
    } catch (error) {
      console.error(`세션 ID ${sessionId} 활동 내역 가져오기 오류:`, error);
      return [];
    }
  }

  // 세션 종료
  async terminateSession(sessionId: string): Promise<boolean> {
    try {
      const response = await apiRequest('POST', getApiUrl(`sessions/${sessionId}/terminate`));
      const data = await response.json();
      return data.success || false;
    } catch (error) {
      console.error(`세션 ID ${sessionId} 종료 오류:`, error);
      return false;
    }
  }

  // 세션 상태 변경 (활성/비활성)
  async toggleSessionStatus(sessionId: string, active: boolean): Promise<boolean> {
    try {
      const response = await apiRequest('POST', getApiUrl(`sessions/${sessionId}/status`), { active });
      const data = await response.json();
      return data.success || false;
    } catch (error) {
      console.error(`세션 ID ${sessionId} 상태 변경 오류:`, error);
      return false;
    }
  }

  // 로그인 상태 변경 (회원/비회원 모드 전환 - 테스트용)
  setAuthStatus(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      // 실제로는 로그인 프로세스를 통해 토큰을 받아야 함
      localStorage.setItem('auth_token', 'test_token');
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // 현재 로그인 상태 확인
  isAuthenticated(): boolean {
    return isUserAuthenticated();
  }
}

// 싱글톤 인스턴스 생성
export const adminService = new AdminService();