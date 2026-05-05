# 🧩 Project Deep-Dive: The Manuscript

This document provides a detailed technical explanation of every function and integration point in the project. Use this to prepare for technical walkthroughs.

---

## 🏗️ 1. Backend Architecture (Node.js & Express)

The backend acts as the orchestrator, managing data and communicating with the AI.

### **A. Server Setup (`server.js`)**
- **Purpose**: Initializes the application and listens for incoming requests.
- **Key Implementation**:
    - **CORS**: Configured to specifically allow your Netlify URL, ensuring secure browser communication.
    - **Environment Validation**: Added logic to check for `MONGO_URI` and `GROQ_API_KEY` on startup to prevent silent crashes.

### **B. AI Logic (`agent/blogAgent.js`)**
- **The Function**: `blogAgent(category, description, userTitle)`
- **How it works**: 
    - It creates a **System Prompt** that defines the AI's "personality" (Simple, human-toned).
    - It uses the **Groq SDK** to run the LLaMA 3.3 model.
    - **JSON Enforcement**: It forces the AI to return data in a specific JSON format (`{title, content, summary, category}`) so the frontend can display it easily.
    - **Automatic Saving**: After generation, it immediately creates a new database record using the `Blog` model and saves it.

### **C. API Endpoints (`routes/blogRoutes.js`)**
- **`POST /generate-blog`**: The entry point for the frontend. It triggers the `blogAgent`.
- **`GET /blogs`**: Retrieves all articles from MongoDB, sorted by `createdAt: -1` so the newest posts appear first.

### **D. Database Schema (`models/Blog.js`)**
- Defines the data structure. Every blog entry is guaranteed to have a Title, Content, Summary, and Category.

---

## ⚛️ 2. Frontend Architecture (React & Vite)

The frontend provides a minimalist, "distraction-free" interface.

### **A. Centralized API (`src/api.js`)**
- Uses **Axios** with a `baseURL` driven by environment variables. This means you only change the URL in one place (`.env`) to switch between Local and Production.

### **B. The Main Feed (`App.jsx`)**
- **State Management**: Uses `useState` to store the list of blogs.
- **Lifecycle**: Uses `useEffect` to fetch the blogs list as soon as the user opens the site.

### **C. The Writing Desk (`components/GenerateForm.jsx`)**
- **Input Handling**: Captures the user's title and description.
- **Loading UI**: Includes logic to disable the button and show a "Writing..." state so the user knows the AI is working.

---

## 🔄 3. Integration Flow (The "Happy Path")

1.  **Frontend**: User types a topic and clicks "Generate."
2.  **Communication**: Axios sends a `POST` request to the Render backend.
3.  **Inference**: The backend sends the prompt to **Groq**.
4.  **Persistence**: The AI response is parsed and saved to **MongoDB Atlas**.
5.  **UI Sync**: The backend returns the new blog object; React adds it to the top of the `blogs` state array, and the UI re-renders instantly.

---

## 💬 4. Technical Q&A for Interviews

**Q: Why use a "System Prompt" in the agent?**  
*A: To ensure consistency. It prevents the AI from being "too smart" or using bullet points, keeping the blog tone simple and human.*

**Q: How did you handle deployment errors?**  
*A: I implemented custom error logging in `db.js` and `server.js` to catch missing environment variables and database connection issues early.*

**Q: Why did you separate the AI logic into an "Agent" folder?**  
*A: For **Separation of Concerns**. The routes should only handle HTTP requests, while the AI logic (the agent) handles the heavy lifting of content creation.*
