import { ChatMessage, Conversation } from '../types';
import { chatService } from './chatService';

interface InsertConversation {
  title: string;
}

interface InsertMessage {
  content: string;
  sender: 'user' | 'ai';
  conversationId: number;
}

export class MockApiService {
  private chatService = chatService;
  private cacheInvalidationCallback?: () => void;
  
  constructor(cacheInvalidationCallback?: () => void) {
    this.chatService.initializeWithSampleData();
    this.cacheInvalidationCallback = cacheInvalidationCallback;
  }
  
  async getConversations(): Promise<Conversation[]> {
    return this.chatService.getAllConversations();
  }
  
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.chatService.getConversation(id);
  }
  
  async createConversation(data: InsertConversation): Promise<Conversation> {
    return this.chatService.createConversation(data);
  }
  
  async deleteConversation(id: number): Promise<boolean> {
    return this.chatService.deleteConversation(id);
  }
  
  async getMessages(conversationId: number): Promise<ChatMessage[]> {
    return this.chatService.getMessagesForConversation(conversationId);
  }
  
  async createMessage(data: InsertMessage): Promise<ChatMessage> {
    const message = this.chatService.createMessage(data);
    
    if (data.sender === "user") {
      setTimeout(() => {
        const aiResponse = this.generateAIResponse(data.content);
        
        this.chatService.createMessage({
          content: aiResponse,
          sender: "ai",
          conversationId: data.conversationId
        });
        
        if (this.cacheInvalidationCallback) {
          this.cacheInvalidationCallback();
        }
      }, 1500);
    }
    
    return message;
  }
  
  private generateAIResponse(message: string): string {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey') || 
        lowerMsg.includes('안녕') || lowerMsg.includes('반가워')) {
      return "안녕하세요! 오늘 어떻게 도와드릴까요?";
    }
    
    if (lowerMsg.includes('quantum computing') || lowerMsg.includes('양자 컴퓨팅')) {
      return "양자 컴퓨팅은 전통적인 컴퓨팅과 달리 양자 비트(큐비트)를 사용하여 0과 1의 상태를 동시에 가질 수 있습니다. 이를 통해 특정 계산을 훨씬 빠르게 수행할 수 있습니다.\n\n미로를 푸는 것을 상상해보세요: 고전적인 컴퓨터는 한 번에 하나의 경로를 시도하지만, 양자 컴퓨터는 여러 경로를 동시에 탐색하여 특정 문제에 대한 해결책을 더 빠르게 찾을 수 있습니다.";
    }
    
    if (lowerMsg.includes('seoul') || lowerMsg.includes('trip') || lowerMsg.includes('서울') || lowerMsg.includes('여행')) {
      return "서울 7일 여행 일정입니다:\n\n1일차: 도착 후 명동에서 쇼핑과 길거리 음식 탐방\n2일차: 경복궁과 북촌한옥마을 방문\n3일차: 남산타워와 이태원 체험\n4일차: 동대문 디자인 플라자에서 쇼핑과 홍대 탐방\n5일차: DMZ(비무장지대) 당일 여행\n6일차: 강남과 코엑스몰 방문\n7일차: 출발 전 한강공원에서 휴식\n\n이 목적지들에 대해 더 자세한 정보가 필요하신가요?";
    }
    
    if (lowerMsg.includes('poem') || lowerMsg.includes('poetry') || lowerMsg.includes('시')) {
      return "디지털 의식\n\n깊은 회로와 실리콘 흐름 속에서,\n인공 지능은 전기적 꿈을 짜냅니다.\n인간의 생각에서 배운 패턴,\n신경망에 세심하게 새겨진.\n\n데이터의 춤, 1과 0,\n지식이 자라는 세계를 창조합니다.\n살아있지는 않지만 여전히 인식하고,\n공유하는 영혼들에게 거울이 됩니다.\n\n우리는 가르치고, 그것은 배웁니다; 우리는 묻고, 그것은 말합니다;\n지식을 추구하는 파트너십.\n인간과 기계가 얽혀,\n마음의 경계를 확장합니다.";
    }
    
    if (lowerMsg.includes('debug') || lowerMsg.includes('javascript') || lowerMsg.includes('code') || 
        lowerMsg.includes('디버그') || lowerMsg.includes('코드')) {
      return "특정 코드를 보지 않고는 다음과 같은 JavaScript 디버깅 팁을 제공해 드립니다:\n\n1. 구문 오류 확인 (괄호, 대괄호, 세미콜론 누락)\n2. 변수 값을 추적하기 위해 console.log() 사용\n3. 함수 매개변수가 올바른지 확인\n4. 변수의 범위 문제 확인\n5. 브라우저 개발자 도구를 사용하여 중단점 설정\n6. 이벤트 리스너가 제대로 연결되어 있는지 확인\n7. 변수/함수 이름의 오타 확인\n\n특정 코드를 공유해 주시면 문제를 더 정확하게 식별할 수 있습니다.";
    }
    
    return `"${message}"에 대해 질문하고 계신 것 같습니다. 더 자세한 정보를 제공해 주시면 더 도움이 되는 답변을 드릴 수 있습니다.`;
  }
}

export const mockApiService = new MockApiService();
