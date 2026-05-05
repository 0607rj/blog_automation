require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Environment Validation ──────────────────────────────────────────────────
if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️  WARNING: GROQ_API_KEY is not defined. AI generation will fail.");
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", blogRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ 
    status: "online", 
    message: "🚀 Blog Automation API is running!",
    timestamp: new Date().toISOString()
  });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🌐 Server listening on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/`);
});

