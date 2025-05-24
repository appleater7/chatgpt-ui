import { Router } from 'express';
import { adminService } from './admin-service';

const adminRouter = Router();

// 인증 여부 확인 함수 (실제로는 세션/토큰 검증해야 함)
const checkAuthentication = (req: any): boolean => {
  // 예시용 간단한 구현: 쿼리 파라미터로 authenticated=true가 전달되면 인증된 것으로 간주
  return req.query.authenticated === 'true';
};

// 모든 세션 목록 가져오기
adminRouter.get('/sessions', async (req, res) => {
  try {
    const isAuthenticated = checkAuthentication(req);
    const sessions = await adminService.getAllSessions(isAuthenticated);
    res.json(sessions);
  } catch (error) {
    console.error('세션 목록 가져오기 오류:', error);
    res.status(500).json({ error: '세션 목록을 가져오는 중 오류가 발생했습니다.' });
  }
});

// 특정 세션 정보 가져오기
adminRouter.get('/sessions/:id', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const isAuthenticated = checkAuthentication(req);
    const session = await adminService.getSessionById(sessionId, isAuthenticated);
    
    if (!session) {
      return res.status(404).json({ error: '세션을 찾을 수 없습니다.' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('세션 정보 가져오기 오류:', error);
    res.status(500).json({ error: '세션 정보를 가져오는 중 오류가 발생했습니다.' });
  }
});

// 세션 활동 내역 가져오기
adminRouter.get('/sessions/:id/activities', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const isAuthenticated = checkAuthentication(req);
    const activities = await adminService.getSessionActivities(sessionId, isAuthenticated);
    res.json(activities);
  } catch (error) {
    console.error('세션 활동 내역 가져오기 오류:', error);
    res.status(500).json({ error: '세션 활동 내역을 가져오는 중 오류가 발생했습니다.' });
  }
});

// 세션 종료
adminRouter.post('/sessions/:id/terminate', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const isAuthenticated = checkAuthentication(req);
    
    if (!isAuthenticated) {
      return res.status(401).json({ error: '인증되지 않은 사용자입니다.' });
    }
    
    const success = await adminService.terminateSession(sessionId, isAuthenticated);
    
    if (!success) {
      return res.status(400).json({ error: '세션을 종료할 수 없습니다.' });
    }
    
    res.json({ success: true, message: '세션이 성공적으로 종료되었습니다.' });
  } catch (error) {
    console.error('세션 종료 오류:', error);
    res.status(500).json({ error: '세션 종료 중 오류가 발생했습니다.' });
  }
});

// 세션 상태 변경 (활성/비활성)
adminRouter.post('/sessions/:id/status', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { active } = req.body;
    const isAuthenticated = checkAuthentication(req);
    
    if (!isAuthenticated) {
      return res.status(401).json({ error: '인증되지 않은 사용자입니다.' });
    }
    
    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: '유효하지 않은 상태 값입니다.' });
    }
    
    const success = await adminService.toggleSessionStatus(sessionId, active, isAuthenticated);
    
    if (!success) {
      return res.status(400).json({ error: '세션 상태를 변경할 수 없습니다.' });
    }
    
    res.json({ 
      success: true, 
      message: `세션이 성공적으로 ${active ? '활성화' : '비활성화'}되었습니다.` 
    });
  } catch (error) {
    console.error('세션 상태 변경 오류:', error);
    res.status(500).json({ error: '세션 상태 변경 중 오류가 발생했습니다.' });
  }
});

export default adminRouter;