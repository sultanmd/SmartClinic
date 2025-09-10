import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().$type<"patient" | "doctor" | "clinic">(),
  avatar: text("avatar"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const doctors = pgTable("doctors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  specialty: text("specialty").notNull(),
  experience: integer("experience"),
  fee: integer("fee"),
  rating: integer("rating").default(0),
  availability: jsonb("availability").$type<{[key: string]: string[]}>(),
  clinicId: varchar("clinic_id").references(() => clinics.id),
});

export const clinics = pgTable("clinics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  description: text("description"),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  doctorId: varchar("doctor_id").notNull().references(() => doctors.id),
  clinicId: varchar("clinic_id").references(() => clinics.id),
  date: timestamp("date").notNull(),
  duration: integer("duration").default(30),
  status: text("status").notNull().$type<"scheduled" | "completed" | "cancelled" | "in_progress">(),
  type: text("type").notNull().$type<"in_person" | "telemedicine">(),
  notes: text("notes"),
  sessionNotes: text("session_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const telemedicineSessions = pgTable("telemedicine_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appointmentId: varchar("appointment_id").notNull().references(() => appointments.id),
  roomId: text("room_id").notNull(),
  status: text("status").notNull().$type<"waiting" | "active" | "ended">(),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => telemedicineSessions.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const medicalNews = pgTable("medical_news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"),
  imageUrl: text("image_url"),
  source: text("source"),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const aiConversations = pgTable("ai_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  messages: jsonb("messages").$type<Array<{role: string, content: string, timestamp: string}>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

export const insertClinicSchema = createInsertSchema(clinics).omit({
  id: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertTelemedicineSessionSchema = createInsertSchema(telemedicineSessions).omit({
  id: true,
  startedAt: true,
  endedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertMedicalNewsSchema = createInsertSchema(medicalNews).omit({
  id: true,
  publishedAt: true,
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Clinic = typeof clinics.$inferSelect;
export type InsertClinic = z.infer<typeof insertClinicSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type TelemedicineSession = typeof telemedicineSessions.$inferSelect;
export type InsertTelemedicineSession = z.infer<typeof insertTelemedicineSessionSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type MedicalNews = typeof medicalNews.$inferSelect;
export type InsertMedicalNews = z.infer<typeof insertMedicalNewsSchema>;
export type AiConversation = typeof aiConversations.$inferSelect;
export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;
