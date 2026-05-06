# 🖋️ The Manuscript — AI-Powered Personal Publication

A professional-grade, minimalist blog automation system that turns rough ideas into polished, human-centric narratives. Built with a focus on speed, aesthetics, and intelligence.

**🚀 Live Links:**
- **Frontend (Netlify):** [https://hello0123.netlify.app/](https://hello0123.netlify.app/)
- **Backend (Render):** [https://blog-automation-1-afvy.onrender.com](https://blog-automation-1-afvy.onrender.com)

![Design Preview](https://img.shields.io/badge/Design-Premium--Stone-stone)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![AI](https://img.shields.io/badge/AI-Groq--LLaMA--3.1-orange)
![Database](https://img.shields.io/badge/Database-MongoDB--Atlas-brightgreen)

---

## ✨ Features

### 🧠 Intelligent Drafting Studio
- **Real-Time Streaming**: Watch your story being written word-by-word with a live typing animation (powered by Server-Sent Events).
- **Custom Categorization**: Explicitly choose a category or let the AI brain decide the best fit based on your topic.
- **Dynamic Creation**: New categories are created on-the-fly and automatically added to your global archive filters.
- **Human-Centric Narratives**: Powered by Groq Llama 3.1, generating long-form, honest, and conversational content.

### 📚 Editorial Experience
- **Auto-Tagging**: Every story is automatically tagged with 4-5 relevant keywords for better searchability.
- **Reading Time Estimation**: Automatic word-count analysis to show readers the estimated time commitment.
- **Smart Related Stories**: Automatically suggests 3 related articles from the same category at the bottom of every page.
- **Interactive Ratings**: Engagement system allowing users to Like or Dislike stories.

### 🛠️ Developer Excellence
- **Dynamic URL Switching**: Zero-config deployment. The frontend automatically detects if it's running locally or on Render and switches API URLs instantly.
- **Marker-Based Parsing**: Robust plain-text marker system (`[BEGIN_CONTENT]`, `[END_CONTENT]`) to eliminate JSON parsing errors common in AI applications.
- **Premium UI**: Built with Tailwind CSS, featuring glassmorphism, smooth CSS transitions, and magazine-style typography.

---

## 📁 Project Structure

```
blog_automation/
├── backend/
│   ├── agent/blogAgent.js       # AI "Brain" logic with unique marker system
│   ├── routes/blogRoutes.js     # API & SSE Streaming Endpoints
│   ├── models/Blog.js           # Mongoose Schema with Tags and Ratings
│   └── server.js                # Express config with dynamic CORS
└── frontend/
    ├── src/
    │   ├── api.js               # Smart URL-detecting Axios instance
    │   ├── App.jsx              # Routing & Global Category Filters
    │   └── components/
    │       ├── BlogCard.jsx     # Magazine-style card design
    │       ├── BlogDetail.jsx   # Article view with Related Posts & Tags
    │       └── GenerateForm.jsx # Drafting desk with Live Streaming UI
```

---

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the **backend** folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
GROQ_API_KEY=your_groq_api_key
```

### 2. Launch Backend
```bash
cd backend
npm install
node server.js
```

### 3. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Framer Motion (Transitions).
- **Backend**: Node.js, Express, MongoDB Atlas (Mongoose).
- **AI Brain**: Groq SDK (LLaMA 3.1 8B Instant).
- **Real-time**: Server-Sent Events (SSE) for word-by-word streaming.

---

## 🔒 Security & Performance
- **Environment Safety**: Sensitive API keys and database strings are fully protected via `.env`.
- **API Optimization**: Aggressive cleaning of AI output to remove markdown artifacts and ensure a clean production UI.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

---
*Created for the modern author — Elegant, Intelligent, and Fast.*
