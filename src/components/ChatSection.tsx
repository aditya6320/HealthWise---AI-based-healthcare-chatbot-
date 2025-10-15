import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Heart, Shield, Zap } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const initialMessage: Message = {
  id: "1",
  text: "Hello! I'm your AI health assistant powered by Gemini. How can I help you today?",
  sender: "ai",
  timestamp: new Date(),
};

// Gemini API configuration
const API_KEY = "AIzaSyA-faC3lnwpQOh0JepehQXAs3exQop9-bU"; // ← replace this with your real key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

// Conversation history for Gemini API
let conversationHistory: { role: string; parts: { text: string }[] }[] = [];

export const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: inputValue, sender: "user", timestamp: new Date() };
    setMessages((p) => [...p, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Add user message to Gemini conversation history
    conversationHistory.push({ role: "user", parts: [{ text: inputValue }] });

    const systemPrompt = `
You are "Health Companion", a friendly AI health chatbot.
You are NOT a doctor — always remind the user of this when they ask for treatment or diagnosis.
Give short, clear answers in simple language.
If user mentions an emergency, tell them to contact a doctor immediately.
`;

    try {
      // First try using Gemini API directly
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: conversationHistory,
          systemInstruction: { parts: [{ text: systemPrompt }] },
        }),
      });

      const data = await response.json();
      console.log("Gemini API response:", data);

      if (response.ok && data?.candidates?.length > 0) {
        const botText = data.candidates[0].content.parts[0].text;
        const aiMessageId = (Date.now() + 1).toString();
        setMessages((p) => [...p, { id: aiMessageId, text: botText, sender: "ai", timestamp: new Date() }]);
        conversationHistory.push({ role: "model", parts: [{ text: botText }] });
        setIsTyping(false);
        return;
      }
      
      // If Gemini API fails, fall back to the original implementation
      const streamRes = await fetch(`/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!streamRes.ok) throw new Error("Streaming endpoint returned error");

      const aiMessageId = (Date.now() + 1).toString();
      setMessages((p) => [...p, { id: aiMessageId, text: "", sender: "ai", timestamp: new Date() }]);

      const reader = streamRes.body?.getReader();
      if (!reader) throw new Error("ReadableStream not supported");
      const decoder = new TextDecoder();
      let partial = "";

      const appendToAI = (delta: string) => {
        partial += delta;
        setMessages((p) => p.map((m) => (m.id === aiMessageId ? { ...m, text: partial } : m)));
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const events = chunk.split(/\n\n/).filter(Boolean);
        for (const ev of events) {
          const line = ev.trim();
          const dataLine = line.startsWith("data:") ? line.slice(5).trim() : line;
          try {
            const parsed: any = JSON.parse(dataLine);
            if (parsed.delta) appendToAI(parsed.delta);
            else if (parsed.done && parsed.text) {
              const remainder = parsed.text.startsWith(partial) ? parsed.text.slice(partial.length) : parsed.text;
              if (remainder) appendToAI(remainder);
            }
          } catch (e) {
            appendToAI(dataLine);
          }
        }
      }

      setIsTyping(false);
      setMessages((p) => p.map((m) => (m.text === "" && m.sender === "ai" ? { ...m, timestamp: new Date() } : m)));
    } catch (err) {
      console.error("Streaming failed, falling back to non-streaming API", err);
      try {
        const fallback = await fetch(`/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: inputValue }),
        });
        if (!fallback.ok) throw new Error("Fallback endpoint failed");
        const data = await fallback.json();
        setMessages((p) => [...p, { id: (Date.now() + 2).toString(), text: data.response || "", sender: "ai", timestamp: new Date() }]);
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
        setMessages((p) => [...p, { id: (Date.now() + 3).toString(), text: "I'm sorry, I encountered an error processing your request. Please check if the server is running at http://localhost:3001 and try again.", sender: "ai", timestamp: new Date() }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between bg-primary p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary-foreground" />
          <h3 className="text-lg font-medium text-primary-foreground">Health Assistant</h3>
        </div>
        <div className="flex space-x-2">
          <Sparkles className="h-5 w-5 text-primary-foreground opacity-80" />
          <Heart className="h-5 w-5 text-primary-foreground opacity-80" />
          <Shield className="h-5 w-5 text-primary-foreground opacity-80" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              <div className={`p-1 rounded-full ${message.sender === "user" ? "bg-primary" : "bg-muted"}`}>
                {message.sender === "user" ? <User className="h-6 w-6 text-primary-foreground" /> : <Bot className="h-6 w-6" />}
              </div>
              <div className={`p-3 rounded-lg ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your health question..." className="flex-1" disabled={isTyping} />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          <Zap className="inline h-3 w-3 mr-1" />
          Powered by Gemini AI. For informational purposes only, not medical advice.
        </p>
      </div>
    </Card>
  );
};