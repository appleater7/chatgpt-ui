import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { mockApiService } from "../services/mockApiService";

const USE_LOCAL_STORAGE = true;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

class MockResponse {
  private _data: any;
  private _status: number;
  private _statusText: string;
  private _ok: boolean;

  constructor(data: any, status = 200, statusText = 'OK') {
    this._data = data;
    this._status = status;
    this._statusText = statusText;
    this._ok = status >= 200 && status < 300;
  }

  get ok() {
    return this._ok;
  }

  get status() {
    return this._status;
  }

  get statusText() {
    return this._statusText;
  }

  async json() {
    return this._data;
  }

  async text() {
    return JSON.stringify(this._data);
  }
}

async function mockApiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const urlParts = url.split('/');
  const resource = urlParts[2]; // e.g., 'conversations', 'messages'
  const id = urlParts[3] ? parseInt(urlParts[3]) : undefined;
  const subResource = urlParts[4]; // e.g., 'messages' in '/api/conversations/:id/messages'

  try {
    if (resource === 'conversations') {
      if (method === 'GET') {
        if (id !== undefined) {
          const conversation = await mockApiService.getConversation(id);
          if (!conversation) {
            return new MockResponse({ message: 'Conversation not found' }, 404, 'Not Found') as unknown as Response;
          }
          return new MockResponse(conversation) as unknown as Response;
        } else if (subResource === 'messages') {
          const messages = await mockApiService.getMessages(id!);
          return new MockResponse(messages) as unknown as Response;
        } else {
          const conversations = await mockApiService.getConversations();
          return new MockResponse(conversations) as unknown as Response;
        }
      } else if (method === 'POST') {
        const conversation = await mockApiService.createConversation(data as any);
        return new MockResponse(conversation, 201, 'Created') as unknown as Response;
      } else if (method === 'DELETE' && id !== undefined) {
        const success = await mockApiService.deleteConversation(id);
        if (!success) {
          return new MockResponse({ message: 'Conversation not found' }, 404, 'Not Found') as unknown as Response;
        }
        return new MockResponse(null, 204, 'No Content') as unknown as Response;
      }
    } else if (resource === 'messages') {
      if (method === 'POST') {
        const message = await mockApiService.createMessage(data as any);
        return new MockResponse(message, 201, 'Created') as unknown as Response;
      }
    }

    return new MockResponse({ message: 'Not implemented' }, 501, 'Not Implemented') as unknown as Response;
  } catch (error) {
    console.error('Error in mock API request:', error);
    return new MockResponse({ message: 'Internal server error' }, 500, 'Internal Server Error') as unknown as Response;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (USE_LOCAL_STORAGE) {
    return mockApiRequest(method, url, data);
  }
  
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    if (USE_LOCAL_STORAGE) {
      const url = queryKey[0] as string;
      const urlParts = url.split('/');
      const resource = urlParts[2];
      const id = urlParts[3] ? parseInt(urlParts[3]) : undefined;
      const subResource = urlParts[4];

      if (resource === 'conversations') {
        if (id !== undefined && subResource === 'messages') {
          return await mockApiService.getMessages(id);
        } else if (id !== undefined) {
          return await mockApiService.getConversation(id);
        } else {
          return await mockApiService.getConversations();
        }
      }
      
      console.warn(`Query not implemented for localStorage: ${url}`);
      return null;
    }
    
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
