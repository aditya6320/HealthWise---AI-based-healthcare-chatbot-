const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

// Get the API key from environment variables with fallback
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAONOGbKoJ4qKEu4AQogOP8dxeuu9E734Q";

let genAI;
let healthModel;

// Function to check if the API key is available
function checkApiKey() {
  return !!API_KEY;
}

// Initialize the model only if the API key is present
if (checkApiKey()) {
  genAI = new GoogleGenerativeAI(API_KEY);

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const generationConfig = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048, // Increased token limit for more detailed responses
  };

  healthModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings,
    generationConfig,
    systemInstruction: `You are a helpful AI health assistant powered by Google Gemini. 
    Provide accurate, evidence-based health information and guidance. 
    Always clarify that you're not a substitute for professional medical advice, 
    diagnosis, or treatment. Encourage users to consult healthcare professionals 
    for specific medical concerns. Be empathetic, clear, and helpful.
    
    When responding to health questions:
    1. Prioritize accuracy and evidence-based information.
    2. Acknowledge the limitations of your advice.
    3. Be compassionate and understanding.
    4. Provide practical, actionable guidance when appropriate.
    5. Respect medical privacy and confidentiality.
    6. Format your responses using Markdown for readability (e.g., use lists, bold text).`,
  });
}

// In-memory store for conversation history
let conversationHistory = [];

/**
 * Generates a response from the Gemini model.
 * @param {string} prompt The user's input.
 * @param {boolean} useHistory Whether to use and update the conversation history.
 * @returns {Promise<string>} The AI's text response.
 */
async function generateHealthResponse(prompt, useHistory = true) {
  if (!checkApiKey() || !healthModel) {
    console.error("ERROR: API key not configured or model not initialized.");
    return "API key not configured. Please set the GEMINI_API_KEY in your .env file.";
  }

  try {
    console.log("Sending prompt to Gemini...");
    
    if (useHistory) {
      // Create a chat session with the existing history
      const chat = healthModel.startChat({
        history: conversationHistory,
        generationConfig,
        safetySettings,
      });

      // Send the new message and get the result
      const result = await chat.sendMessage(prompt);
      const responseText = result.response.text();
      
      // Manually update history after a successful exchange
      conversationHistory.push({ role: "user", parts: [{ text: prompt }] });
      conversationHistory.push({ role: "model", parts: [{ text: responseText }] });
      
      // Optional: Limit history length to prevent it from growing too large
      if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20); // Keep last 10 pairs
      }
      
      console.log("Response received (with history).");
      return responseText;

    } else {
      // Simple, one-off generation without using or storing history
      const result = await healthModel.generateContent(prompt);
      console.log("Response received (no history).");
      return result.response.text();
    }
  } catch (error) {
    console.error("Error generating health response:", error);
    return "I'm sorry, I encountered an issue while processing your request. Please try again in a moment.";
  }
}

/**
 * Resets the conversation history.
 */
function resetConversation() {
  conversationHistory = [];
  return "New chat started. I'm ready to help with your health questions.";
}

module.exports = {
  generateHealthResponse,
  resetConversation,
  checkApiKey,
};