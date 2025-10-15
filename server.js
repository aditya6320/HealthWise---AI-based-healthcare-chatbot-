const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load .env into process.env (if present)
try {
  require('dotenv').config();
} catch (e) {
  // noop
}

// If dotenv didn't inject GEMINI_API_KEY (some environments or encoding anomalies),
// try a tiny manual parse of .env as a fallback so local development works reliably.
if (!process.env.GEMINI_API_KEY) {
  try {
    const fs = require('fs');
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      // Try utf8 first
      let raw = fs.readFileSync(envPath, { encoding: 'utf8' });
      let lines = raw.split(/\r?\n/);
      let found = false;
      for (const line of lines) {
        const m = line.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)\s*$/);
        if (m) {
          process.env.GEMINI_API_KEY = m[1].trim();
          console.log('Loaded GEMINI_API_KEY from .env (utf8)');
          found = true;
          break;
        }
      }

      // If not found, try reading as UTF-16LE (some editors save .env as UTF-16)
      if (!found) {
        try {
          raw = fs.readFileSync(envPath, { encoding: 'utf16le' });
          lines = raw.split(/\r?\n/);
          for (const line of lines) {
            const m = line.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)\s*$/);
            if (m) {
              process.env.GEMINI_API_KEY = m[1].trim();
              console.log('Loaded GEMINI_API_KEY from .env (utf16le)');
              found = true;
              break;
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }
  } catch (e) {
    // ignore
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(cors());
app.use(express.json());

// Initialize Gemini AI - require GEMINI_API_KEY to be set for security
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set. Please add GEMINI_API_KEY to your environment or .env file and restart the server.');
  // Fail fast to avoid using an embedded key or running without credentials
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(API_KEY);

// Create the model
const model = genAI.getGenerativeModel({ 
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH", 
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
});

// Store conversation history
let conversationHistory = [];

// Health check endpoint
app.get("/api/health", (req, res) => {
  const apiKeyConfigured = !!process.env.GEMINI_API_KEY;
  res.json({ 
    status: "ok", 
    message: "Server is running",
    apiKeyConfigured
  });
});

// Main chat endpoint with real Gemini AI
app.post('/api/chat', async (req, res) => {
  try {
    const { message, resetConversation: resetFlag } = req.body;

    if (resetFlag) {
      conversationHistory = [];
      console.log("Conversation reset.");
      return res.json({ response: "New chat started. I'm ready to help with your health questions." });
    }
    
    const input = (message || "").toString().trim();
    if (!input) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    console.log("Chat request received:", input);
    
    try {
      // Add user message to history
      conversationHistory.push({
        role: "user",
        parts: [{ text: input }]
      });

      // Create chat session with history
      const chat = model.startChat({
        history: conversationHistory.slice(0, -1), // All except the last message
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      // Get response from Gemini
      const result = await chat.sendMessage(input);
      const responseText = result.response.text();
      
      // Add AI response to history
      conversationHistory.push({
        role: "model",
        parts: [{ text: responseText }]
      });

      // Limit history to prevent token overflow
      if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
      }

      console.log("Response sent successfully");
      return res.json({ response: responseText });

    } catch (geminiError) {
      console.error("Gemini API Error:", geminiError);
      
      // Fallback responses for common health questions
      const fallbackResponses = {
        "fever": "For fever, I recommend: 1) Rest and stay hydrated, 2) Take fever-reducing medication if needed, 3) Monitor your temperature, 4) Seek medical attention if fever persists or is very high. Please consult a healthcare professional for proper diagnosis and treatment.",
        "headache": "For headaches: 1) Rest in a quiet, dark room, 2) Apply a cold compress, 3) Stay hydrated, 4) Consider over-the-counter pain relief if appropriate. If headaches are severe or persistent, please see a doctor.",
        "cough": "For cough: 1) Stay hydrated with warm liquids, 2) Use a humidifier, 3) Avoid irritants like smoke, 4) Consider honey for soothing. If cough persists or worsens, consult a healthcare provider.",
        "stomach": "For stomach issues: 1) Eat bland foods, 2) Stay hydrated, 3) Avoid spicy or fatty foods, 4) Rest. If symptoms are severe or persistent, seek medical advice.",
        "sleep": "For better sleep: 1) Maintain a regular sleep schedule, 2) Create a comfortable sleep environment, 3) Avoid screens before bed, 4) Practice relaxation techniques. If sleep problems persist, consider consulting a sleep specialist."
      };

      // Check if input contains keywords for fallback
      const lowerInput = input.toLowerCase();
      let fallbackResponse = "I'm your AI health assistant! I can help with general health questions. For specific medical concerns, please consult with a healthcare professional.";

      for (const [keyword, response] of Object.entries(fallbackResponses)) {
        if (lowerInput.includes(keyword)) {
          fallbackResponse = response;
          break;
        }
      }

      return res.json({ response: fallbackResponse });
    }

  } catch (error) {
    console.error('Error in /api/chat endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request.',
      message: 'An internal server error occurred. Please try again later.'
    });
  }
});

// Streaming chat endpoint - returns a text/event-stream style chunked response
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message, resetConversation: resetFlag } = req.body;

    if (resetFlag) {
      conversationHistory = [];
      console.log("Conversation reset (stream).");
      return res.json({ response: "New chat started. I'm ready to help with your health questions." });
    }

    const input = (message || "").toString().trim();
    if (!input) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Add user message to history
    conversationHistory.push({ role: "user", parts: [{ text: input }] });

    // Set headers for SSE-like chunked response
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();

    console.log('Starting streaming response for:', input);

    try {
      // Create chat session with history (excluding the last user message to avoid duplication)
      const chat = model.startChat({
        history: conversationHistory.slice(0, -1),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      // Some Gemini client libraries provide a streaming API. We'll attempt to use
      // an async iterator `streamResponses()` if available, otherwise fall back
      // to sendMessage and stream the full text at once.

      if (chat.streamResponses) {
        // Stream partial responses as events
        for await (const part of chat.streamResponses(input)) {
          // Each part may contain text or metadata
          const chunk = (part?.response?.text?.() ?? part?.text ?? "");
          if (chunk) {
            // Send as a simple data event
            res.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
          }
        }

        // Retrieve final response text from chat if available
        try {
          const final = await chat.getFinalResponse?.() || null;
          const finalText = final?.response?.text?.() || null;
          if (finalText) {
            // Append final event
            res.write(`data: ${JSON.stringify({ done: true, text: finalText })}\n\n`);
            // Update history
            conversationHistory.push({ role: "model", parts: [{ text: finalText }] });
          }
        } catch (e) {
          // ignore
        }

      } else {
        // Fallback: single response
        const result = await chat.sendMessage(input);
        const responseText = result.response?.text?.();
        if (responseText) {
          // Send the whole response as a single chunk and mark done
          res.write(`data: ${JSON.stringify({ done: true, text: responseText })}\n\n`);
          conversationHistory.push({ role: "model", parts: [{ text: responseText }] });
        }
      }

      // Close the stream
      res.write('event: end\n');
      res.write('\n');
      res.end();

    } catch (geminiError) {
      console.error("Gemini streaming error:", geminiError);
      // On error, send a single fallback message event then end
      const fallback = "I'm your AI health assistant! I can help with general health questions. For specific medical concerns, please consult with a healthcare professional.";
      res.write(`data: ${JSON.stringify({ done: true, text: fallback })}\n\n`);
      res.end();
    }

  } catch (error) {
    console.error('Error in /api/chat/stream endpoint:', error);
    res.status(500).json({ error: 'Failed to process streaming chat request.' });
  }
});

// Static frontend serving - serve built React app
const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));

// SPA Fallback - serve React app for all non-API routes
// Use a middleware that skips any /api routes to avoid path-to-regexp parsing issues
app.use((req, res, next) => {
  // If the request is for the API, pass through to next handlers
  if (req.path && req.path.startsWith('/api')) return next();

  // Otherwise, serve the SPA index file
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) {
      res.status(404).send(`
        <html>
          <head><title>HealthWise AI Buddy</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>🏥 HealthWise AI Buddy</h1>
            <p>Frontend not built yet. Please run:</p>
            <code>npm run build</code>
            <br><br>
            <p>Or start development server:</p>
            <code>npm run dev</code>
          </body>
        </html>
      `);
    }
  });
});

// Server initialization
app.listen(PORT, () => {
  console.log(`🚀 Health Chatbot Server is running on http://localhost:${PORT}`);
  console.log(`✅ Gemini AI is integrated and ready!`);
  console.log(`📱 Open your browser and go to: http://localhost:${PORT}`);
  console.log(`🤖 Start chatting with your AI health assistant!`);
});
