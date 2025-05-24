import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertConversationSchema } from "@shared/schema";
import adminRouter from "./api/adminRoutes";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // 관리자 API 라우트 등록
  app.use('/api/admin', adminRouter);
  // API routes for conversations
  app.get("/api/conversations", async (req, res) => {
    const conversations = await storage.getAllConversations();
    return res.json(conversations);
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      return res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await storage.getConversation(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.json(conversation);
  });

  app.delete("/api/conversations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const success = await storage.deleteConversation(id);
    if (!success) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.status(204).send();
  });

  // API routes for messages
  app.get("/api/conversations/:id/messages", async (req, res) => {
    const conversationId = parseInt(req.params.id);
    if (isNaN(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await storage.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await storage.getMessagesForConversation(conversationId);
    return res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      
      // Check if the conversation exists
      const conversation = await storage.getConversation(validatedData.conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Create the user message
      const message = await storage.createMessage(validatedData);

      // If the sender is "user", generate an AI response
      if (validatedData.sender === "user") {
        // Wait a bit to simulate AI thinking
        setTimeout(async () => {
          // Generate the AI response based on the user message
          const aiResponse = generateAIResponse(validatedData.content);
          
          // Create the AI message
          await storage.createMessage({
            content: aiResponse,
            sender: "ai",
            conversationId: validatedData.conversationId
          });
        }, 1500);
      }

      return res.status(201).json(message);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to create message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simple AI response generator
function generateAIResponse(message: string): string {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return "Hello! How can I assist you today?";
  }
  
  if (lowerMsg.includes('quantum computing')) {
    return "Quantum computing is like traditional computing but uses quantum bits (qubits) that can exist in multiple states simultaneously, not just 0 or 1. This allows certain calculations to be performed much faster.\n\nImagine solving a maze: a classical computer would try one path at a time, but a quantum computer explores multiple paths simultaneously, finding the solution more quickly for certain problems.";
  }
  
  if (lowerMsg.includes('seoul') || lowerMsg.includes('trip')) {
    return "Here's a 7-day Seoul itinerary:\n\nDay 1: Arrive and explore Myeongdong for shopping and street food\nDay 2: Visit Gyeongbokgung Palace and Bukchon Hanok Village\nDay 3: Experience Namsan Tower and Itaewon\nDay 4: Shop at Dongdaemun Design Plaza and explore Hongdae\nDay 5: Day trip to DMZ (Demilitarized Zone)\nDay 6: Visit Gangnam and COEX Mall\nDay 7: Relax at Han River Park before departure\n\nWould you like more details about any of these destinations?";
  }
  
  if (lowerMsg.includes('poem') || lowerMsg.includes('poetry')) {
    return "Digital Consciousness\n\nIn circuits deep and silicon streams,\nArtificial minds weave electric dreams.\nPatterns learned from human thought,\nIn neural networks carefully wrought.\n\nA dance of data, ones and zeroes,\nCreating worlds where knowledge grows.\nNot alive but still aware,\nA mirror to the souls who share.\n\nWe teach, it learns; we ask, it speaks;\nA partnership that knowledge seeks.\nHuman and machine entwined,\nExpanding boundaries of mind.";
  }
  
  if (lowerMsg.includes('debug') || lowerMsg.includes('javascript') || lowerMsg.includes('code')) {
    return "Without seeing your specific code, here are common JavaScript debugging tips:\n\n1. Check for syntax errors (missing parentheses, brackets, semicolons)\n2. Use console.log() to track variable values\n3. Verify your function parameters are correct\n4. Check for scope issues with variables\n5. Use browser developer tools to set breakpoints\n6. Ensure event listeners are properly attached\n7. Look for typos in variable/function names\n\nIf you share the specific code, I can help identify the issue more precisely.";
  }
  
  return "I understand you're asking about \"" + message + "\". Could you provide more details so I can give you a more helpful response?";
}
