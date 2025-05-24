import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the message table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // "user" or "ai"
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  conversationId: integer("conversation_id").notNull(),
});

// Define the conversation table
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define the session table for admin functionality
export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  username: varchar("username").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActive: timestamp("last_active").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  ipAddress: varchar("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
});

// Define the session activity table for logging user actions
export const sessionActivities = pgTable("session_activities", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull(),
  action: varchar("action").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  details: text("details"),
});

// Create insert schemas
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertAdminSessionSchema = createInsertSchema(adminSessions).omit({
  createdAt: true,
  lastActive: true,
});

export const insertSessionActivitySchema = createInsertSchema(sessionActivities).omit({
  id: true,
  timestamp: true,
});

// Create types for insert operations
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type InsertSessionActivity = z.infer<typeof insertSessionActivitySchema>;

// Create types for select operations
export type Message = typeof messages.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
export type SessionActivity = typeof sessionActivities.$inferSelect;

// Define a user-friendly message type for the frontend
export const messageSchema = z.object({
  id: z.number(),
  content: z.string(),
  sender: z.enum(["user", "ai"]),
  timestamp: z.date(),
  conversationId: z.number(),
});

export type UserFriendlyMessage = z.infer<typeof messageSchema>;
