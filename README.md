# 🤖 BlogAgent AI — AI-Powered Blog Automation System

A full-stack AI agent that generates blog posts using **OpenAI GPT-4o-mini** and automatically saves them to **MongoDB** — zero manual steps.

---

## 📁 Folder Structure

```
blog_automation/
├── backend/
│   ├── agent/
│   │   └── blogAgent.js       ← Core AI agent (generate → save → return)
│   ├── config/
│   │   └── db.js              ← MongoDB connection
│   ├── models/
│   │   └── Blog.js            ← Mongoose schema
│   ├── routes/
│   │   └── blogRoutes.js      ← Express routes
│   ├── server.js              ← Entry point
│   ├── package.json
│   └── .env                   ← 🔑 Your secrets go here
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── BlogCard.jsx
    │   │   └── GenerateForm.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── vite.config.js
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (`mongod`) _or_ a [MongoDB Atlas](https://cloud.mongodb.com) URI
- **OpenAI API Key** — [get one here](https://platform.openai.com/api-keys)

---

## 🚀 Setup & Run

### 1. Configure Environment Variables

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog_automation
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Start the Backend

```bash
cd backend
npm install       # only needed once
npm run dev       # uses nodemon for hot-reload
```

The API will be available at **http://localhost:5000**

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install       # only needed once
npm run dev
```

The UI will be available at **http://localhost:3000**

---

## 🔌 API Reference

### `POST /api/generate-blog`

Triggers the AI agent to generate and auto-save a blog post.

**Request Body:**
```json
{ "category": "Technology" }
```

**Response:**
```json
{
  "success": true,
  "blog": {
    "_id": "...",
    "title": "...",
    "content": "...",
    "summary": "...",
    "category": "Technology",
    "createdAt": "2026-05-04T..."
  }
}
```

---

### `GET /api/blogs`

Returns all saved blogs, newest first.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "blogs": [ ... ]
}
```

---

## 🧠 How the Agent Works

```
User enters category
       ↓
POST /api/generate-blog
       ↓
blogAgent(category)
   ├── Step 1: Call OpenAI GPT-4o-mini with structured prompt
   ├── Step 2: Parse JSON response (title, content, summary)
   └── Step 3: Auto-save to MongoDB → return saved document
       ↓
Frontend receives blog → immediately adds to UI list
```

---

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Backend   | Node.js + Express       |
| Database  | MongoDB + Mongoose      |
| AI        | OpenAI GPT-4o-mini      |
| Frontend  | React + Vite            |
| Styling   | Tailwind CSS v4         |
| HTTP      | Axios                   |
