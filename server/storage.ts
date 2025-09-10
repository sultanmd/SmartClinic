import { type User, type InsertUser, type Doctor, type InsertDoctor, type Clinic, type InsertClinic, type Appointment, type InsertAppointment, type TelemedicineSession, type InsertTelemedicineSession, type ChatMessage, type InsertChatMessage, type MedicalNews, type InsertMedicalNews, type AiConversation, type InsertAiConversation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Doctor operations
  getAllDoctors(): Promise<Doctor[]>;
  getDoctorsByClinic(clinicId: string): Promise<Doctor[]>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;

  // Clinic operations
  createClinic(clinic: InsertClinic): Promise<Clinic>;

  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment>;

  // Telemedicine session operations
  createTelemedicineSession(session: InsertTelemedicineSession): Promise<TelemedicineSession>;
  updateTelemedicineSession(id: string, updates: Partial<TelemedicineSession>): Promise<TelemedicineSession>;

  // Chat message operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;

  // Medical news operations
  getMedicalNews(): Promise<MedicalNews[]>;
  createMedicalNews(news: InsertMedicalNews): Promise<MedicalNews>;

  // AI conversation operations
  createAiConversation(conversation: InsertAiConversation): Promise<AiConversation>;
  getAiConversationsByUser(userId: string): Promise<AiConversation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private doctors: Map<string, Doctor>;
  private clinics: Map<string, Clinic>;
  private appointments: Map<string, Appointment>;
  private telemedicineSessions: Map<string, TelemedicineSession>;
  private chatMessages: Map<string, ChatMessage>;
  private medicalNews: Map<string, MedicalNews>;
  private aiConversations: Map<string, AiConversation>;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.clinics = new Map();
    this.appointments = new Map();
    this.telemedicineSessions = new Map();
    this.chatMessages = new Map();
    this.medicalNews = new Map();
    this.aiConversations = new Map();

    // Initialize with some sample medical news
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleNews: MedicalNews[] = [
      {
        id: randomUUID(),
        title: "Latest Breakthrough in Heart Disease Treatment",
        summary: "Researchers have discovered a new minimally invasive procedure that significantly reduces recovery time for cardiac patients.",
        content: "Full article content here...",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop",
        source: "Medical Journal",
        publishedAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "New Guidelines for Diabetes Management",
        summary: "Updated recommendations from the American Diabetes Association for improved patient outcomes.",
        content: "Full article content here...",
        imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop",
        source: "ADA",
        publishedAt: new Date(),
      }
    ];

    sampleNews.forEach(news => this.medicalNews.set(news.id, news));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      avatar: insertUser.avatar || null,
      phone: insertUser.phone || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Doctor operations
  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctorsByClinic(clinicId: string): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(doctor => doctor.clinicId === clinicId);
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = randomUUID();
    const doctor: Doctor = { 
      ...insertDoctor, 
      id,
      clinicId: insertDoctor.clinicId || null,
      experience: insertDoctor.experience || null,
      fee: insertDoctor.fee || null,
      rating: insertDoctor.rating || null,
      availability: insertDoctor.availability || null
    };
    this.doctors.set(id, doctor);
    return doctor;
  }

  // Clinic operations
  async createClinic(insertClinic: InsertClinic): Promise<Clinic> {
    const id = randomUUID();
    const clinic: Clinic = { 
      ...insertClinic, 
      id,
      address: insertClinic.address || null,
      description: insertClinic.description || null,
      phone: insertClinic.phone || null
    };
    this.clinics.set(id, clinic);
    return clinic;
  }

  // Appointment operations
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      duration: insertAppointment.duration || null,
      clinicId: insertAppointment.clinicId || null,
      notes: insertAppointment.notes || null,
      sessionNotes: insertAppointment.sessionNotes || null,
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.patientId === patientId
    );
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.doctorId === doctorId
    );
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    const updatedAppointment = { ...appointment, ...updates };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Telemedicine session operations
  async createTelemedicineSession(insertSession: InsertTelemedicineSession): Promise<TelemedicineSession> {
    const id = randomUUID();
    const session: TelemedicineSession = { 
      ...insertSession, 
      id,
      startedAt: null,
      endedAt: null
    };
    this.telemedicineSessions.set(id, session);
    return session;
  }

  async updateTelemedicineSession(id: string, updates: Partial<TelemedicineSession>): Promise<TelemedicineSession> {
    const session = this.telemedicineSessions.get(id);
    if (!session) {
      throw new Error("Telemedicine session not found");
    }
    const updatedSession = { ...session, ...updates };
    this.telemedicineSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Chat message operations
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      sessionId: insertMessage.sessionId || null,
      timestamp: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
  }

  // Medical news operations
  async getMedicalNews(): Promise<MedicalNews[]> {
    return Array.from(this.medicalNews.values())
      .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime());
  }

  async createMedicalNews(insertNews: InsertMedicalNews): Promise<MedicalNews> {
    const id = randomUUID();
    const news: MedicalNews = { 
      ...insertNews, 
      id,
      summary: insertNews.summary || null,
      content: insertNews.content || null,
      imageUrl: insertNews.imageUrl || null,
      source: insertNews.source || null,
      publishedAt: new Date()
    };
    this.medicalNews.set(id, news);
    return news;
  }

  // AI conversation operations
  async createAiConversation(insertConversation: InsertAiConversation): Promise<AiConversation> {
    const id = randomUUID();
    const conversation: AiConversation = { 
      ...insertConversation, 
      id,
      messages: insertConversation.messages || null,
      createdAt: new Date()
    };
    this.aiConversations.set(id, conversation);
    return conversation;
  }

  async getAiConversationsByUser(userId: string): Promise<AiConversation[]> {
    return Array.from(this.aiConversations.values())
      .filter(conversation => conversation.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }
}

export const storage = new MemStorage();
