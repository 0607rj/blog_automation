import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const PIPELINE_STEPS = [
  { icon: "🔎", label: "Domain Detection",   desc: "Auto-detects your business domain using semantic AI analysis" },
  { icon: "👤", label: "Persona Agent",        desc: "Synthesizes unified audience models — pain points, fears, and emotional triggers" },
  { icon: "🔍", label: "Research Agent",       desc: "Finds trending keywords, SEO data & AI-search queries" },
  { icon: "⚔️", label: "Competitor Agent",     desc: "Analyzes competitor websites for content gaps & ranking opportunities" },
  { icon: "🧠", label: "Memory Agent",         desc: "Retrieves past strategies from MongoDB — avoids repetition" },
  { icon: "🎯", label: "Orchestrator",         desc: "Combines all intelligence into a precise content strategy" },
  { icon: "✍️", label: "Content Generator",    desc: "Writes SEO + AI-search optimized, audience-aware content" },
  { icon: "✅", label: "Validation Layer",     desc: "Verifies quality, keyword integration & production readiness" },
];

const FEATURES = [
  {
    icon: "🏢",
    title: "Business Intelligence Input",
    desc: "Provide your company, product, and goals — the system understands your business architecture automatically.",
    tag: "Domain Detection · Semantic AI",
  },
  {
    icon: "🤖",
    title: "Multi-Agent Orchestration",
    desc: "Specialized agents collaborate in sequence. Each passes enriched intelligence to the next before a single word is written.",
    tag: "Multi-Agent Systems",
  },
  {
    icon: "👤",
    title: "Adaptive Audience Models",
    desc: "Deep psychological profiles that adapt to your specific niche. No generic targeting — our models understand human desires.",
    tag: "Psychological Intelligence",
  },
  {
    icon: "🧠",
    title: "Long-Term Memory",
    desc: "The system persists every narrative and strategy. The Memory Agent reads this history to ensure your brand voice evolves.",
    tag: "Context Persistence",
  },
  {
    icon: "⚔️",
    title: "Competitor Analysis",
    desc: "Provide competitor landscapes and the system finds keyword gaps and ranking opportunities others miss.",
    tag: "Competitive Intelligence",
  },
  {
    icon: "✅",
    title: "Validation Layer",
    desc: "Every manuscript is validated for narrative flow, structure quality, and production readiness before publishing.",
    tag: "Quality Assurance",
  },
  {
    icon: "🌐",
    title: "Search Optimization",
    desc: "Content is optimized for modern search landscapes — ensuring visibility across both traditional and AI platforms.",
    tag: "AEO + SEO",
  },
  {
    icon: "⚡",
    title: "Real-Time Synthesis",
    desc: "Watch your manuscript come to life with real-time streaming. No loading spinners — intelligence types itself live.",
    tag: "Live Streaming",
  },
];

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

      {/* SECTION 1: HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-stone-50 rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="max-w-5xl space-y-10 relative z-10">
          <div className="pt-20"></div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-stone-900">
            The Soul <br />
            <span className="text-stone-300 italic serif font-normal">of Your Narrative.</span>
          </h1>

          <p className="text-xl md:text-2xl text-stone-500 leading-relaxed max-w-3xl mx-auto font-medium serif italic">
            Stop generating content. Start crafting connection. We've built an intelligence engine that understands 
            human psychology to tell stories that move the world.
          </p>

          {/* Live Stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 py-8 border-t border-b border-stone-100">
            <div className="text-center">
              <p className="text-5xl font-black text-stone-900">{blogCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">Stories Crafted</p>
            </div>
            <div className="w-px h-12 bg-stone-100" />
            <div className="text-center">
              <p className="text-5xl font-black text-stone-900">{categoryCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">Niches Explored</p>
            </div>
            <div className="w-px h-12 bg-stone-100" />
            <div className="text-center">
              <p className="text-5xl font-black text-stone-900">∞</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">Persona Models</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/pipeline"
              className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Write Your Manuscript
            </Link>
            <Link
              to="/blogs"
              className="border-2 border-stone-200 text-stone-900 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:border-stone-900 transition-all"
            >
              The Archive
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: ARCHITECTURE */}
      <section className="py-40 bg-stone-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-4">The Architecture</p>
            <h2 className="text-4xl md:text-6xl font-bold serif mb-6">Built for Depth.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              {PIPELINE_STEPS.map((step, idx) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                    idx === activeStep ? "bg-white shadow-lg border border-stone-200 scale-[1.02]" : "bg-white border border-stone-100 opacity-50"
                  }`}
                >
                  <span className="text-xl">{step.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-stone-900 text-sm">{step.label}</p>
                    <p className="text-[11px] text-stone-500 serif leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-stone-900 rounded-[2.5rem] p-12 text-white flex flex-col justify-between">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Strategic Reasoning</p>
                <h3 className="text-3xl font-bold serif italic leading-relaxed">
                  "Single-prompt AI is generic. Multi-agent intelligence is{" "}
                  <span className="text-stone-400">authoritative.</span>"
                </h3>
              </div>
              <div className="mt-10 space-y-4 text-sm text-stone-400 serif">
                 <div className="flex items-start gap-3"><span>→</span><span>Deep psychological modeling replaces random generation</span></div>
                 <div className="flex items-start gap-3"><span>→</span><span>Competitor landscapes are analyzed for ranking gaps</span></div>
                 <div className="flex items-start gap-3"><span>→</span><span>Memory systems ensure brand voice evolution</span></div>
              </div>
              <div className="mt-10 pt-6 border-t border-stone-800">
                <Link to="/pipeline" className="inline-block bg-white text-stone-900 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-stone-200 transition-all">
                  Write Your Manuscript →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES GRID */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold serif">Built for Production.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group bg-stone-50 hover:bg-white border border-stone-100 hover:border-stone-200 hover:shadow-xl rounded-3xl p-8 transition-all duration-300">
                <div className="w-12 h-12 bg-white border border-stone-200 rounded-2xl flex items-center justify-center text-2xl mb-6">{f.icon}</div>
                <h3 className="font-bold text-stone-900 mb-3">{f.title}</h3>
                <p className="text-stone-500 serif text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE NARRATIVE SOUL */}
      <section className="py-40 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-4">The Editorial Soul</p>
             <h2 className="text-4xl md:text-6xl font-bold serif">Narrative over Perspective.</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="space-y-6 p-10 bg-stone-50 rounded-[2.5rem] border border-stone-100">
              <div className="text-3xl">🌿</div>
              <h4 className="font-bold text-stone-900 text-xl">Human Nuance</h4>
              <p className="text-sm text-stone-500 serif leading-relaxed">We capture the subtle emotional triggers that turn readers into followers.</p>
            </div>
            <div className="space-y-6 p-10 bg-stone-50 rounded-[2.5rem] border border-stone-100">
              <div className="text-3xl">🕯️</div>
              <h4 className="font-bold text-stone-900 text-xl">Atmospheric Tone</h4>
              <p className="text-sm text-stone-500 serif leading-relaxed">Every blog maintains a consistent, high-end editorial tone.</p>
            </div>
            <div className="space-y-6 p-10 bg-stone-50 rounded-[2.5rem] border border-stone-100">
              <div className="text-3xl">📖</div>
              <h4 className="font-bold text-stone-900 text-xl">Lasting Narrative</h4>
              <p className="text-sm text-stone-500 serif leading-relaxed">We build a cohesive collection of thoughts that grow with your brand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className="py-40 bg-stone-50 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold serif mb-12">Experience Autonomous Content.</h2>
          <Link to="/pipeline" className="inline-block bg-stone-900 text-white px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl">
            Write Your Manuscript →
          </Link>
        </div>
      </section>
    </div>
  );
}
