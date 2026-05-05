# 🖋️ The Manuscript — AI-Powered Personal Publication

A sophisticated, minimalist blog automation system. 

**🚀 Live Links:**
- **Frontend (Netlify):** [https://hello0123.netlify.app/](https://hello0123.netlify.app/)
- **Backend (Render):** [https://blog-automation-1-afvy.onrender.com](https://blog-automation-1-afvy.onrender.com)

![Design Preview](https://img.shields.io/badge/Design-Minimalist-stone)

![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![AI](https://img.shields.io/badge/AI-Groq--LLaMA3-orange)
![Database](https://img.shields.io/badge/Database-MongoDB--Atlas-brightgreen)

---

## ✨ Features

- **Editorial Design**: A premium reading experience with high-end typography (`Crimson Pro` & `Plus Jakarta Sans`).
- **Human-Like Writing**: Powered by Groq, generating simple, conversational, and honest content (400–500 words).
- **Drafting Desk**: A distraction-free "New Post" interface with Title and Focus fields.
- **Intelligent Auto-Tagging**: The AI automatically determines the best category (Culture, Tech, Life, etc.) for your post.
- **Archive Search**: Real-time filtering to find your stories by title or content instantly.
- **Automated Workflow**: Generate → Write → Categorize → Save. All in one click.

---

## 📁 Project Structure

```
blog_automation/
├── backend/
│   ├── agent/blogAgent.js       # Core AI logic (Human-tone prompt)
│   ├── routes/blogRoutes.js     # API Endpoints
│   ├── models/Blog.js           # Database Schema
│   └── .env                     # Database & API Keys
└── frontend/
    ├── src/
    │   ├── api.js               # Centralized API utility
    │   ├── App.jsx              # Main Feed & Layout
    │   └── components/
    │       ├── BlogCard.jsx     # Editorial Card Design
    │       └── GenerateForm.jsx # Minimalist Writing Desk
    └── .env                     # Frontend Config
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

Create a `.env` file in the **frontend** folder:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 2. Launch Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```
*The app usually runs on [http://localhost:3000](http://localhost:3000) or [http://localhost:3002](http://localhost:3002).*

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4.
- **Backend**: Node.js, Express.
- **Database**: MongoDB Atlas (Mongoose).
- **Inference**: Groq SDK (LLaMA 3.3 70B).

---

## 🔒 Security
Sensitive information like API keys and database strings are protected using `.env` files, which are listed in the `.gitignore` to prevent accidental public exposure.

---
*Created with focus on simplicity and elegance.*
