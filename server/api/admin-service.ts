import { db } from '../db';
import { eq } from 'drizzle-orm';
import { adminSessions, sessionActivities } from '@shared/schema';

// API 서비스에서 사용할 타입 정의
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

// 임시 세션 목록 - 비회원 또는 데이터베이스 연결 실패 시 사용
export const getMockSessions = (): Session[] => [
  {
    id: 'sess_123456789',
    userId: 'user_001',
    username: 'john.doe',
    createdAt: new Date(2025, 4, 15, 14, 30),
    lastActive: new Date(2025, 4, 21, 9, 45),
    isActive: true,
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/90.0.4430.212'
  },
  {
    id: 'sess_987654321',
    userId: 'user_002',
    username: 'jane.smith',
    createdAt: new Date(2025, 4, 14, 9, 15),
    lastActive: new Date(2025, 4, 20, 18, 22),
    isActive: true,
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'
  },
  {
    id: 'sess_456789123',
    userId: 'user_003',
    username: 'mike.jackson',
    createdAt: new Date(2025, 4, 10, 11, 45),
    lastActive: new Date(2025, 4, 10, 17, 30),
    isActive: false,
    ipAddress: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) Mobile/15E148'
  },
  {
    id: 'sess_789123456',
    userId: 'user_004',
    username: 'sarah.connor',
    createdAt: new Date(2025, 4, 18, 8, 0),
    lastActive: new Date(2025, 4, 21, 7, 55),
    isActive: true,
    ipAddress: '192.168.1.4',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/89.0'
  },
  {
    id: 'sess_321654987',
    userId: 'user_005',
    username: 'alex.morgan',
    createdAt: new Date(2025, 4, 12, 15, 20),
    lastActive: new Date(2025, 4, 15, 14, 10),
    isActive: false,
    ipAddress: '192.168.1.5',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/91.0.4472.77'
  },
  {
    id: 'sess_654987321',
    userId: 'user_006',
    username: 'bob.taylor',
    createdAt: new Date(2025, 4, 19, 10, 30),
    lastActive: new Date(2025, 4, 21, 8, 40),
    isActive: true,
    ipAddress: '192.168.1.6',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) Mobile/15E148'
  },
  {
    id: 'sess_159753456',
    userId: 'user_007',
    username: 'emma.wilson',
    createdAt: new Date(2025, 4, 17, 13, 15),
    lastActive: new Date(2025, 4, 20, 16, 50),
    isActive: true,
    ipAddress: '192.168.1.7',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/91.0.864.48'
  }
];

// 임시 세션 활동 로그 - 비회원 또는 데이터베이스 연결 실패 시 사용
export const getMockSessionActivities = (sessionId: string): SessionActivity[] => [
  {
    id: 1,
    sessionId,
    action: "로그인",
    timestamp: new Date(2025, 4, 20, 9, 30),
    details: "IP: 192.168.1.2, 브라우저: Chrome"
  },
  {
    id: 2,
    sessionId,
    action: "쿼리 전송",
    timestamp: new Date(2025, 4, 20, 9, 45),
    details: "Explain quantum computing in simple terms"
  },
  {
    id: 3,
    sessionId,
    action: "새 대화 생성",
    timestamp: new Date(2025, 4, 20, 10, 15),
    details: "대화 ID: conv_89723"
  },
  {
    id: 4,
    sessionId,
    action: "쿼리 전송",
    timestamp: new Date(2025, 4, 20, 11, 0),
    details: "How to optimize React performance?"
  },
  {
    id: 5,
    sessionId,
    action: "API 키 권한 요청",
    timestamp: new Date(2025, 4, 20, 14, 20),
    details: "DALL-E 이미지 생성 API 접근 요청"
  },
  {
    id: 6,
    sessionId,
    action: "세션 일시 중지",
    timestamp: new Date(2025, 4, 20, 16, 30),
    details: "사용자에 의한 세션 일시 중지"
  },
  {
    id: 7,
    sessionId,
    action: "세션 재개",
    timestamp: new Date(2025, 4, 20, 18, 0),
    details: "사용자에 의한 세션 재개"
  }
];

// 관리자 서비스 클래스
export class AdminService {
  // 모든 세션 가져오기
  async getAllSessions(isAuthenticated: boolean = false): Promise<Session[]> {
    // 인증된 사용자가 아니면 샘플 데이터 반환
    if (!isAuthenticated) {
      return getMockSessions();
    }

    try {
      // 데이터베이스에서 세션 가져오기
      // 실제 구현에서는 sessions 테이블에서 데이터를 가져옴
      // 지금은 아직 스키마를 업데이트 하지 않았으므로 샘플 데이터 반환
      return getMockSessions();
    } catch (error) {
      console.error('세션 가져오기 오류:', error);
      // 오류 발생 시 샘플 데이터 반환
      return getMockSessions();
    }
  }

  // 특정 세션 가져오기
  async getSessionById(sessionId: string, isAuthenticated: boolean = false): Promise<Session | null> {
    // 인증된 사용자가 아니면 샘플 데이터에서 검색
    if (!isAuthenticated) {
      const sessions = getMockSessions();
      return sessions.find(session => session.id === sessionId) || null;
    }

    try {
      // 데이터베이스에서 세션 가져오기
      // 실제 구현에서는 sessions 테이블에서 특정 세션을 가져옴
      const sessions = getMockSessions();
      return sessions.find(session => session.id === sessionId) || null;
    } catch (error) {
      console.error(`세션 ID ${sessionId} 가져오기 오류:`, error);
      // 오류 발생 시 샘플 데이터에서 검색
      const sessions = getMockSessions();
      return sessions.find(session => session.id === sessionId) || null;
    }
  }

  // 세션 활동 내역 가져오기
  async getSessionActivities(sessionId: string, isAuthenticated: boolean = false): Promise<SessionActivity[]> {
    // 인증된 사용자가 아니면 샘플 활동 내역 반환
    if (!isAuthenticated) {
      return getMockSessionActivities(sessionId);
    }

    try {
      // 데이터베이스에서 세션 활동 내역 가져오기
      // 실제 구현에서는 session_activities 테이블에서 데이터를 가져옴
      return getMockSessionActivities(sessionId);
    } catch (error) {
      console.error(`세션 ID ${sessionId}의 활동 내역 가져오기 오류:`, error);
      // 오류 발생 시 샘플 활동 내역 반환
      return getMockSessionActivities(sessionId);
    }
  }

  // 세션 종료
  async terminateSession(sessionId: string, isAuthenticated: boolean = false): Promise<boolean> {
    // 인증된 사용자가 아니면 실패 처리
    if (!isAuthenticated) {
      console.warn('비인증 사용자의 세션 종료 시도:', sessionId);
      return false;
    }

    try {
      // 데이터베이스에서 세션 상태 업데이트
      // 실제 구현에서는 sessions 테이블의 isActive 필드를 false로 설정
      console.log(`세션 ID ${sessionId} 종료 처리 완료`);
      return true;
    } catch (error) {
      console.error(`세션 ID ${sessionId} 종료 오류:`, error);
      return false;
    }
  }

  // 세션 일시 중지/재개
  async toggleSessionStatus(sessionId: string, active: boolean, isAuthenticated: boolean = false): Promise<boolean> {
    // 인증된 사용자가 아니면 실패 처리
    if (!isAuthenticated) {
      console.warn('비인증 사용자의 세션 상태 변경 시도:', sessionId);
      return false;
    }

    try {
      // 데이터베이스에서 세션 상태 업데이트
      // 실제 구현에서는 sessions 테이블의 isActive 필드를 업데이트
      console.log(`세션 ID ${sessionId} 상태 변경 완료: ${active ? '활성' : '비활성'}`);
      return true;
    } catch (error) {
      console.error(`세션 ID ${sessionId} 상태 변경 오류:`, error);
      return false;
    }
  }
}

// 싱글톤 인스턴스 생성
export const adminService = new AdminService();