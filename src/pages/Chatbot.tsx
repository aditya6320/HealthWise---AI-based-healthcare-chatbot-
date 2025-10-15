import React, { useState } from "react";
import { ChatSection } from "@/components/ChatSection";

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          Chat with Your
          <span className="bg-gradient-medical bg-clip-text text-transparent"> AI Health Buddy</span>
        </h2>
        <div className="text-center mb-6">
          <button
            className="bg-medical-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition-colors"
            onClick={() => setShowChat(true)}
            disabled={showChat}
          >
            {showChat ? "Chat Opened" : "Open Chat"}
          </button>
        </div>
        {showChat && (
          <div className="mt-8">
            <ChatSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
