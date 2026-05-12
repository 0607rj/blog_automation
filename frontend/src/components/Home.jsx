import React from "react";
import { Link } from "react-router-dom";

const PIPELINE_STEPS = [
  { icon: "📊", title: "Opportunity Analysis", desc: "Dual-model scoring across 3 audience categories using Gemini + DeepSeek R1. Selects highest-opportunity segment every 15 days.", model: "Gemini + DeepSeek R1" },
  { icon: "👤", title: "Persona Intelligence", desc: "Semi-dynamic 12-section persona enrichment with location awareness, trend injection, and competitor messaging context.", model: "Gemini" },
  { icon: "🔍", title: "Research Intelligence", desc: "8-methodology behavioral research combining emotional search intent with analytical SEO gap analysis.", model: "Gemini + DeepSeek R1" },
  { icon: "⚔️", title: "Competitor Intelligence", desc: "7-framework analysis of 9 hardcoded competitors: SWOT, emotional gaps, trust gaps, SEO gaps, messaging weaknesses.", model: "DeepSeek R1" },
  { icon: "🧠", title: "Self-Learning Memory", desc: "MongoDB-backed continuous learning from successful hooks, personas, competitor gaps, and location patterns.", model: "MongoDB" },
  { icon: "🎯", title: "Orchestrator Brain", desc: "Central intelligence synthesizing 5 sources into a precise content blueprint with localized SEO strategy.", model: "Groq" },
  { icon: "✍️", title: "Content Generation", desc: "Psychology-driven, conversion-oriented content writing with location-specific context and emotional depth.", model: "Groq" },
  { icon: "✅", title: "7-Dim Validation", desc: "Multi-dimension quality assessment ensuring production-grade output meets all SEO and psychological standards.", model: "Groq" },
];

const LOCATIONS = [
  { city: "Kolkata", state: "West Bengal", status: "Active", detail: "Strong B.Com enrollment, CA coaching culture, BPO accounting demand" },
  { city: "Lucknow", state: "Uttar Pradesh", status: "Active", detail: "Growing IT sector, GST practitioner demand, government job vs private career" },
  { city: "Bangalore", state: "Karnataka", status: "Upcoming", detail: "IT capital, finance professionals in tech companies" },
  { city: "Delhi", state: "Delhi NCR", status: "Upcoming", detail: "Largest job market, maximum accounting openings" },
  { city: "Patna", state: "Bihar", status: "Upcoming", detail: "Growing education hub, aspirational career seekers" },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* ── Hero Section ── */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600">
            Autonomous · Multi-Model · Location-Aware
          </p>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-stone-900 leading-[1.1] mb-8 serif max-w-4xl">
          AI Content Intelligence<br />
          <span className="text-emerald-600">for Accounting Education</span>
        </h1>
        <p className="text-stone-500 text-lg md:text-xl serif max-w-2xl leading-relaxed mb-12">
          A production-level autonomous system that researches, analyzes, identifies opportunities, 
          generates, validates, and publishes — without requiring a single manual prompt.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/dashboard"
            className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95">
            Open Dashboard →
          </Link>
          <Link to="/blogs"
            className="border border-stone-200 text-stone-700 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-stone-50 transition-all">
            View Archive
          </Link>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-stone-100 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10", label: "AI Agents" },
            { value: "3", label: "AI Models" },
            { value: "15d", label: "Auto Cycle" },
            { value: "5", label: "Target Cities" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-4xl font-black text-emerald-600">{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Agent Pipeline ── */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600 mb-4">Autonomous Pipeline Architecture</p>
        <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-16 serif">Every blog is the output of<br />8 specialized agents.</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={i} className="group bg-stone-50 rounded-3xl p-6 border border-stone-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{step.icon}</span>
                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{step.model}</span>
              </div>
              <h3 className="font-black text-stone-900 text-sm mb-2">{step.title}</h3>
              <p className="text-xs text-stone-500 serif leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Location Intelligence ── */}
      <section className="bg-stone-950 text-white py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400 mb-4">Location Intelligence</p>
          <h2 className="text-4xl md:text-5xl font-black mb-16 serif">Content adapts to where<br />your audience lives.</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOCATIONS.map(loc => (
              <div key={loc.city} className={`rounded-3xl p-6 border ${loc.status === "Active" ? "border-emerald-500/30 bg-emerald-950/30" : "border-stone-800 bg-stone-900/50 opacity-60"}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-lg">{loc.city}</h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${loc.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-stone-800 text-stone-500"}`}>{loc.status}</span>
                </div>
                <p className="text-xs text-stone-400 mb-2">{loc.state}</p>
                <p className="text-xs text-stone-500 serif leading-relaxed">{loc.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Multi-Model Architecture ── */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600 mb-4">Multi-Model Architecture</p>
        <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-16 serif">Three AI models,<br />each with a purpose.</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Gemini", role: "Contextual Understanding", agents: "Persona Agent, Research (Broad), Opportunity Analysis", desc: "Broad emotional and contextual intelligence. Understands WHY users search, not just what they search." },
            { name: "DeepSeek R1", role: "Analytical Reasoning", agents: "Competitor Agent, Research (Analytical), Opportunity Scoring", desc: "Deep analytical reasoning via OpenRouter. Structured gap analysis, quantitative scoring, and strategic intelligence." },
            { name: "Groq", role: "Fast Execution", agents: "Orchestrator, Content Generation, Validation", desc: "High-speed generation for content writing and validation. Existing proven pipeline preserved." },
          ].map(m => (
            <div key={m.name} className="bg-gradient-to-br from-stone-50 to-emerald-50/30 rounded-3xl p-8 border border-stone-100">
              <h3 className="text-2xl font-black text-stone-900 mb-2">{m.name}</h3>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4">{m.role}</p>
              <p className="text-sm text-stone-600 serif leading-relaxed mb-4">{m.desc}</p>
              <p className="text-[10px] text-stone-400"><strong>Agents:</strong> {m.agents}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-emerald-600 py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 serif">The system is live.</h2>
        <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto serif">
          Every 15 days, the pipeline automatically identifies the highest-opportunity audience, 
          generates psychology-driven content, and publishes — autonomously.
        </p>
        <Link to="/dashboard"
          className="bg-white text-emerald-700 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all shadow-lg active:scale-95 inline-block">
          Open Dashboard →
        </Link>
      </section>
    </div>
  );
}
