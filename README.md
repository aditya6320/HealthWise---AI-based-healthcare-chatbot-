# 🏥 HealthWise AI Buddy - Complete Healthcare Assistant

A comprehensive healthcare assistant application with AI-powered health guidance, hospital finder, and symptom analysis.

## 🚀 **QUICK START - 3 WAYS TO RUN**

### **Option 1: One-Click Start (Easiest)**
```bash
# Double-click this file:
start-project.bat
```

### **Option 2: Development Mode**
```bash
# Terminal 1 - Backend (Chatbot API)
npm run server

# Terminal 2 - Frontend (React App)
npm run dev
```

### **Option 3: Production Mode**
```bash
# Build and start production server
npm run build
npm run start
```

## 📱 **Access Points**
- **Frontend**: http://localhost:5173 (React development)
- **Production**: http://localhost:3001 (Built app + API)
- **API Health**: http://localhost:3001/api/health
- **Chat API**: http://localhost:3001/api/chat

## ✨ **Features**
- **🤖 AI Health Assistant**: Powered by Google Gemini AI
- **🏥 Hospital Finder**: Locate nearby medical facilities
- **🔍 Symptom Analysis**: AI-powered health assessments
- **👤 User Authentication**: Secure login/registration
- **💬 Real-time Chat**: Instant AI responses
- **📱 Responsive Design**: Works on all devices

## 🛠️ **Tech Stack**
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: Google Gemini API (Pre-configured)
- **Database**: Supabase (PostgreSQL)
- **UI**: Radix UI components

## 📋 **Available Scripts**
- `npm run dev` - Start React development server
- `npm run build` - Build for production
- `npm run server` - Start backend server
- `npm run start` - Start production server
- `npm run preview` - Preview production build

## 🎯 **How to Use**

### **1. Start the Project**
Choose any of the 3 options above.

### **2. Access the Application**
- **Development**: http://localhost:5173
- **Production**: http://localhost:3001

### **3. Use the Features**
- **Chat with AI**: Ask health questions and get instant responses
- **Find Hospitals**: Locate nearby medical facilities
- **Analyze Symptoms**: Get AI-powered health guidance
- **User Account**: Create account and manage profile

## 🔧 **Configuration**

### **Environment Variables (Optional)**
The project includes a pre-configured API key for immediate use. For production, create a `.env` file:

```
GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **API Endpoints**
- `GET /api/health` - Check server status
- `POST /api/chat` - Send messages to AI
- `GET /` - Serve React application

## 📁 **Project Structure**
```
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and configs
│   └── hooks/             # Custom React hooks
├── dist/                  # Built React app
├── public/                # Static files
├── server.js              # Backend API server
├── start-project.bat      # Easy startup script
└── package.json           # Dependencies and scripts
```

## 🚨 **Troubleshooting**

### **Common Issues & Solutions**

1. **Port conflicts**: Make sure ports 3001 and 5173 are available
2. **Build errors**: Run `npm install` to ensure all dependencies are installed
3. **API errors**: Check that the server is running on port 3001
4. **Module errors**: The project uses CommonJS, not ES modules

### **Quick Fixes**
```bash
# If you see module errors:
npm install

# If ports are busy:
# Kill processes using ports 3001 and 5173
# Or change ports in vite.config.ts and server.js

# If build fails:
npm run build
```

## 🎉 **What's Working**
- ✅ **Complete React App**: All HealthWise components
- ✅ **Working Chatbot**: Real-time AI health assistant
- ✅ **Hospital Finder**: Medical facility locator
- ✅ **Symptom Analysis**: AI-powered health assessments
- ✅ **User Authentication**: Login/registration system
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Production Ready**: Built and optimized

## 📄 **License**
MIT License

---

## 🚀 **Ready to Use!**

Your complete HealthWise AI Buddy project is now clean, optimized, and fully functional! 

**Just run `start-project.bat` or use the manual commands above to get started!** 🎉