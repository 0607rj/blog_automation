require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const blogRoutes = require("./routes/blogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { startScheduler } = require("./scheduler/cronScheduler");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:4173",
  "http://localhost:5173",
  "https://hello0123.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Check if origin is localhost or 127.0.0.1 (any port)
    const isLocalhost = origin.startsWith("http://localhost:") || 
                        origin === "http://localhost" ||
                        origin.startsWith("http://127.0.0.1:") ||
                        origin === "http://127.0.0.1";
                        
    if (isLocalhost || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());

// ─── DB Migration Script for Slugs/Excerpts ──────────────────────────────────
const runMigrations = async () => {
  const Blog = require("./models/Blog");
  try {
    const blogsToMigrate = await Blog.find({
      $or: [
        { slug: { $exists: false } },
        { slug: "" },
        { excerpt: { $exists: false } },
        { excerpt: "" }
      ]
    });

    if (blogsToMigrate.length > 0) {
      console.log(`🔄 DB Migration: Found ${blogsToMigrate.length} blogs missing slug or excerpt. Migrating...`);
      let migratedCount = 0;
      for (const blog of blogsToMigrate) {
        let updated = false;
        if (!blog.slug || blog.slug === "") {
          blog.slug = undefined; // Force pre-save hook to generate the slug
          updated = true;
        }
        if (!blog.excerpt || blog.excerpt === "") {
          updated = true;
        }
        if (updated) {
          await blog.save();
          migratedCount++;
        }
      }
      console.log(`✅ DB Migration: Successfully updated ${migratedCount} blogs.`);
    } else {
      console.log("✅ DB Migration: No pending migrations (all blogs have slugs and excerpts).");
    }
  } catch (err) {
    console.error("❌ DB Migration: Failed to migrate existing blogs:", err);
  }
};

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB().then(() => {
  runMigrations();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", blogRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ 
    status: "online", 
    message: "🚀 AccountIQ Autonomous AI Content Intelligence System",
    system: "Production-Level Autonomous AI SEO Content Intelligence",
    features: [
      "Autonomous 15-day content generation",
      "Multi-model AI Intelligence (Powered by Groq)",
      "Location intelligence (Kolkata, Lucknow)",
      "9 hardcoded competitor analysis",
      "7-dimension validation",
      "Self-learning memory system"
    ],
    timestamp: new Date().toISOString()
  });
});

// ─── Start server + scheduler ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🌐 Server listening on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/stats`);
  
  // Start the autonomous scheduler
  startScheduler();
});


