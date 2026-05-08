import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const PIPELINE_STEPS = [
  { icon: "👤", label: "Persona Agent",   desc: "Identifies buyer persona, pain points, emotions & search intent" },
  { icon: "🔍", label: "Research Agent",  desc: "Finds trending keywords, topic clusters & AI search queries" },
  { icon: "⚔️", label: "Competitor Agent", desc: "Detects content gaps & outranking opportunities" },
  { icon: "🧠", label: "Memory Agent",    desc: "Retrieves past strategies from MongoDB — avoids repetition" },
  { icon: "🎯", label: "Orchestrator",    desc: "Combines all insights into a precise content blueprint" },
  { icon: "✍️", label: "Blog Generator",  desc: "Writes SEO-optimized, audience-specific, human-like content" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Real-Time SSE Streaming",
    desc: "Watch your blog appear word-by-word via Server-Sent Events. No loading spinner — the content types itself live.",
    tag: "Backend · EventSource API",
  },
  {
    icon: "🤖",
    title: "Multi-Agent AI Pipeline",
    desc: "6 specialized AI agents collaborate in sequence before a single word is written. Each agent passes intelligence to the next.",
    tag: "LLaMA 3.1 · Groq · Orchestration",
  },
  {
    icon: "🧠",
    title: "Long-Term Memory",
    desc: "MongoDB persists every blog title, keyword, and strategy. The Memory Agent reads this history to avoid ever repeating content.",
    tag: "MongoDB · Context Persistence",
  },
  {
    icon: "📂",
    title: "Dynamic Category System",
    desc: "Categories are auto-detected by AI and created on the fly if they don't exist. Browse the archive by any category instantly.",
    tag: "Mongoose · distinct()",
  },
  {
    icon: "🏷️",
    title: "Auto-Tagging System",
    desc: "The AI automatically extracts 4–5 relevant keyword tags per blog for searchability and discoverability.",
    tag: "AI Extraction · Marker Parsing",
  },
  {
    icon: "🌐",
    title: "Dynamic URL Detection",
    desc: "The app auto-detects whether it's running locally or on production and switches the API URL accordingly — zero manual config.",
    tag: "window.location · Vite Env",
  },
  {
    icon: "🔗",
    title: "Related Content Engine",
    desc: "Every blog article shows 3 related posts from the same category — fetched in a single optimized MongoDB query.",
    tag: "MongoDB · Category Filtering",
  },
  {
    icon: "👍",
    title: "Like & Dislike System",
    desc: "Readers can react to posts. MongoDB's $inc operator handles atomic counter updates with zero race conditions.",
    tag: "PATCH · $inc · REST API",
  },
];

// ─── Constants removed for cleaner UI ───

export default function Home() {
  const [blogCount, setBlogCount] = useState("...");
  const [categoryCount, setCategoryCount] = useState("...");
  const [activeStep, setActiveStep] = useState(0);

  // Animate through pipeline steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % PIPELINE_STEPS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Fetch live stats
  useEffect(() => {
    api.get("/blogs").then(res => {
      const blogs = res.data.blogs || [];
      setBlogCount(blogs.length);
      const cats = new Set(blogs.map(b => b.category).filter(Boolean));
      setCategoryCount(cats.size);
    }).catch(() => {});
  }, []);

  return (
    <div className="bg-white text-stone-900">

      {/* ════════════════════════════════════════
          SECTION 1: HERO
          ════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-50 rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="max-w-5xl space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 bg-stone-100 px-5 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-stone-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-600">
              The Manuscript Studio
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">
            Where Writing <br />
            Begins to <span className="text-stone-300 italic serif font-normal">Feel.</span>
          </h1>

          <p className="text-xl md:text-2xl text-stone-500 leading-relaxed max-w-3xl mx-auto font-medium serif">
            An autonomous editorial marketing engine. 6 specialized agents collaborate to 
            understand your audience, research trends, analyze competitors — then write 
            content that <em>actually ranks.</em>
          </p>

          {/* Live Stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 py-8 border-t border-b border-stone-100">
            <div className="text-center">
              <p className="text-5xl font-black text-stone-900">{blogCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">Blogs Generated</p>
            </div>
            <div className="w-px h-12 bg-stone-100" />
            <div className="text-center">
              <p className="text-5xl font-black text-stone-900">{categoryCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">Categories</p>
            </div>
            <div className="w-px h-12 bg-stone-100" />
            <div className="text-center">
              <p className="text-5xl font-black text-stone-900">6</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">AI Agents</p>
            </div>
            <div className="w-px h-12 bg-stone-100" />
            <div className="text-center">
              <p className="text-5xl font-black text-stone-900">∞</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">Memory Context</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/pipeline"
              className="bg-purple-600 text-white px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-200 hover:-translate-y-1 active:scale-95"
            >
              Create New Blog
            </Link>
            <Link
              to="/blogs"
              className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Explore Archive
            </Link>
            <button
              onClick={() => document.getElementById("pipeline-section").scrollIntoView({ behavior: "smooth" })}
              className="border-2 border-stone-200 text-stone-900 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:border-stone-900 transition-all"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2: ANIMATED PIPELINE PREVIEW
          ════════════════════════════════════════ */}
      <section id="pipeline-section" className="py-40 bg-stone-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-4">The Architecture</p>
            <h2 className="text-4xl md:text-6xl font-bold serif mb-6">6 Agents. One Perfect Blog.</h2>
            <p className="text-stone-500 serif text-xl max-w-2xl mx-auto">
              Unlike simple prompt-response AI tools, every blog goes through a full 
              intelligence pipeline before a single word is written.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Animated steps */}
            <div className="space-y-3">
              {PIPELINE_STEPS.map((step, idx) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-5 p-5 rounded-2xl transition-all duration-500 ${
                    idx === activeStep
                      ? "bg-white shadow-lg border border-purple-100 scale-[1.02]"
                      : idx < activeStep
                      ? "bg-emerald-50 border border-emerald-100 opacity-80"
                      : "bg-white border border-stone-100 opacity-50"
                  }`}
                >
                  <span className="text-2xl">{step.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-stone-900 text-sm">{step.label}</p>
                    <p className="text-xs text-stone-500 serif leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < activeStep && (
                    <span className="text-emerald-500 font-bold text-sm flex-shrink-0">✓</span>
                  )}
                  {idx === activeStep && (
                    <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Explanation panel */}
            <div className="bg-stone-900 rounded-[2.5rem] p-12 text-white flex flex-col justify-between">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                  Why Multi-Agent?
                </p>
                <h3 className="text-3xl font-bold serif italic leading-relaxed">
                  "Single-prompt AI generates generic content. Multi-agent AI generates{" "}
                  <span className="text-stone-300">strategic</span> content."
                </h3>
              </div>
              <div className="mt-10 space-y-4 text-sm text-stone-400 serif">
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5">→</span>
                  <span>Each agent has ONE job and ONE context — no confusion</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5">→</span>
                  <span>Every agent passes enriched context to the next</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5">→</span>
                  <span>The final blog has 5 layers of intelligence baked in</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5">→</span>
                  <span>Memory agent ensures zero repetition across all generations</span>
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-stone-800">
                <Link
                  to="/pipeline"
                  className="inline-block bg-purple-600 text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-purple-700 transition-all"
                >
                  Try the Pipeline →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3: FEATURES GRID (8 features)
          ════════════════════════════════════════ */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-4">Platform Features</p>
            <h2 className="text-4xl md:text-6xl font-bold serif">Built for Production.</h2>
            <p className="text-stone-500 serif text-xl max-w-2xl mx-auto mt-6">
              Every feature was designed, built, and debugged from scratch — no low-code tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group bg-stone-50 hover:bg-white border border-stone-100 hover:border-stone-200 hover:shadow-xl rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-white border border-stone-200 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-stone-900 mb-3">{f.title}</h3>
                <p className="text-stone-500 serif text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 4: THE NARRATIVE SOUL
          ════════════════════════════════════════ */}
      <section className="py-40 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-4">The Editorial Soul</p>
             <h2 className="text-4xl md:text-6xl font-bold serif">Narrative over Perspective.</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="space-y-6 p-10 bg-stone-50 rounded-[2.5rem] hover:shadow-xl transition-all border border-stone-100">
              <div className="text-3xl">🌿</div>
              <h4 className="font-bold text-stone-900 text-xl">Human Nuance</h4>
              <p className="text-sm text-stone-500 serif leading-relaxed">
                We capture the subtle emotional triggers that turn a casual reader into a lifelong follower. 
                Intelligence meets intuition.
              </p>
            </div>
            <div className="space-y-6 p-10 bg-stone-50 rounded-[2.5rem] hover:shadow-xl transition-all border border-stone-100">
              <div className="text-3xl">🕯️</div>
              <h4 className="font-bold text-stone-900 text-xl">Atmospheric Tone</h4>
              <p className="text-sm text-stone-500 serif leading-relaxed">
                Every blog is crafted to maintain a consistent, high-end editorial tone that reflects 
                your brand's authority and sophistication.
              </p>
            </div>
            <div className="space-y-6 p-10 bg-stone-50 rounded-[2.5rem] hover:shadow-xl transition-all border border-stone-100">
              <div className="text-3xl">📖</div>
              <h4 className="font-bold text-stone-900 text-xl">Lasting Narrative</h4>
              <p className="text-sm text-stone-500 serif leading-relaxed">
                We don't just generate content; we build a cohesive collection of thoughts that 
                matures and grows alongside your brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 5: FINAL CTA (Simplified)
          ════════════════════════════════════════ */}
      <section className="py-40 bg-stone-50 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-4">Get Started</p>
          <h2 className="text-4xl md:text-6xl font-bold serif mb-12">Experience Autonomous Content.</h2>
          <Link
            to="/pipeline"
            className="inline-block bg-purple-600 text-white px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-200"
          >
            Create New Blog →
          </Link>
        </div>
      </section>

    </div>
  );
}
