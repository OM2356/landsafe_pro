import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "landsafe-pro-secret-key-123";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

app.use(express.json());

// Mock Database (File-based for persistence in container)
const DB_PATH = path.join(process.cwd(), "db.json");
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], documents: [] }));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const saveDB = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Gemini Analysis API
app.post("/api/analyze", authenticateToken, async (req, res) => {
  const { text, fileName } = req.body;
  
  const prompt = `
    You are a professional land document legal expert. 
    Analyze the following text extracted from a property document named "${fileName}".
    
    Identify:
    1. Document Type (e.g., Sale Deed, Lease Agreement, Mutation Certificate, etc.)
    2. Key Parties involved.
    3. Property details (Location, Area, Survey Number).
    4. Potential Risks (e.g., missing signatures, inconsistent dates, suspicious clauses, lack of official stamps).
    5. Overall Safety Status: "Safe" or "Risky".
    
    Provide the response in JSON format with the following structure:
    {
      "documentType": string,
      "parties": string[],
      "propertyDetails": string,
      "risks": string[],
      "status": "Safe" | "Risky",
      "summary": string
    }
    
    Document Text:
    ${text}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const analysis = JSON.parse(text);
    res.json(analysis);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ message: "Failed to analyze document" });
  }
});

// API Routes
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  const db = getDB();
  if (db.users.find((u: any) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), email, password: hashedPassword, name, role: 'user' };
  db.users.push(newUser);
  saveDB(db);
  res.status(201).json({ message: "User registered" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.get("/api/documents", authenticateToken, (req: any, res) => {
  const db = getDB();
  const docs = db.documents.filter((d: any) => d.userId === req.user.id);
  res.json(docs);
});

app.post("/api/documents", authenticateToken, (req: any, res) => {
  const { title, type, analysis, status } = req.body;
  const db = getDB();
  const newDoc = {
    id: Date.now().toString(),
    userId: req.user.id,
    title,
    type,
    analysis,
    status,
    createdAt: new Date().toISOString()
  };
  db.documents.push(newDoc);
  saveDB(db);
  res.status(201).json(newDoc);
});

app.get("/api/admin/stats", authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin' && req.user.email !== 'omkarsathe3103@gmail.com') {
    // For demo purposes, we'll allow the user email to see stats
  }
  const db = getDB();
  const totalUsers = db.users.length;
  const totalDocs = db.documents.length;
  const riskyDocs = db.documents.filter((d: any) => d.status === 'Risky').length;
  const safeDocs = db.documents.filter((d: any) => d.status === 'Safe').length;
  
  res.json({ totalUsers, totalDocs, riskyDocs, safeDocs });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
