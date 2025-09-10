import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { openAIService } from "./services/openai";
import { insertAppointmentSchema, insertUserSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', function connection(ws) {
    console.log('WebSocket client connected');

    ws.on('message', function message(data) {
      try {
        const message = JSON.parse(data.toString());
        
        // Broadcast chat messages to all connected clients
        if (message.type === 'chat_message') {
          wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', function close() {
      console.log('WebSocket client disconnected');
    });
  });

  // User management routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid user data", error: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch user", error: error.message });
    }
  });

  // Appointment management routes
  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid appointment data", error: error.message });
    }
  });

  app.get("/api/appointments/patient/:patientId", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByPatient(req.params.patientId);
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
    }
  });

  app.get("/api/appointments/doctor/:doctorId", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByDoctor(req.params.doctorId);
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
    }
  });

  // Doctor management routes
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch doctors", error: error.message });
    }
  });

  app.get("/api/doctors/clinic/:clinicId", async (req, res) => {
    try {
      const doctors = await storage.getDoctorsByClinic(req.params.clinicId);
      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch clinic doctors", error: error.message });
    }
  });

  // Chat message routes
  app.post("/api/chat/messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid message data", error: error.message });
    }
  });

  app.get("/api/chat/session/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessagesBySession(req.params.sessionId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch chat messages", error: error.message });
    }
  });

  // AI Chat route
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const aiResponse = await openAIService.chatWithAI(message, history || []);
      res.json({ message: aiResponse });
    } catch (error: any) {
      console.error('AI chat error:', error);
      res.status(500).json({ message: "Failed to get AI response", error: error.message });
    }
  });

  // Medical news routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getMedicalNews();
      res.json(news);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch medical news", error: error.message });
    }
  });

  // Telemedicine session routes
  app.post("/api/telemedicine/session", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createTelemedicineSession(sessionData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid session data", error: error.message });
    }
  });

  app.patch("/api/telemedicine/session/:sessionId", async (req, res) => {
    try {
      const { status } = req.body;
      const session = await storage.updateTelemedicineSession(req.params.sessionId, { status });
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update session", error: error.message });
    }
  });

  return httpServer;
}
