import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Initialize Gemini AI client safely
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API endpoints FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", hasAi: !!ai });
  });

  // Chat/Generate MCP templates or queries
  app.post("/api/mcp-assist", async (req, res) => {
    try {
      const { prompt, language = "fa", mode = "explain" } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!ai) {
        return res.status(503).json({
          error: "Gemini API client is not initialized. Please verify your GEMINI_API_KEY in the Secrets settings."
        });
      }

      let systemInstruction = "";
      if (mode === "generate") {
        systemInstruction = `You are an expert Model Context Protocol (MCP) server architect. 
Your task is to generate complete, high-quality, production-ready, and well-commented code for a custom MCP server.
User wants to build an MCP Server for: "${prompt}".
Please provide:
1. A brief overview of the implementation.
2. The complete code (preferably in TypeScript or Python as requested, defaulting to TypeScript/Node.js).
3. The configuration needed to load this server inside Claude Desktop or another MCP client.

Respond in ${language === "fa" ? "Persian/Farsi" : "English"}. Make the code blocks clean and easy to copy. Use standard Markdown.`;
      } else {
        systemInstruction = `You are an expert on Model Context Protocol (MCP) and LLM application integrations. 
Answer the user's question about MCP servers. 
The current user language is ${language === "fa" ? "Persian (Farsi)" : "English"}. 
Make sure your explanation is accurate, clear, and utilizes visual metaphors if possible. 
Provide technical depth about standard transport protocols (Stdio, SSE), JSON-RPC 2.0 communication, resources, tools, and prompts.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("Error in /api/mcp-assist:", error);
      res.status(500).json({ error: error.message || "An error occurred during generation" });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
