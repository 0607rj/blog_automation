import React, { useState, useRef, useEffect } from "react";

const AGENT_STEPS = [
  { key: "domainDetection", label: "Domain Detection",     icon: "🔎", desc: "Auto-detecting your business domain" },
  { key: "personaLoader",   label: "Persona Loader",       icon: "📋", desc: "Loading relevant audience templates" },
  { key: "persona",         label: "Persona Agent",         icon: "👤", desc: "Synthesizing audience psychology" },
  { key: "research",        label: "Research Agent",        icon: "🔍", desc: "SEO + AI search intelligence" },
  { key: "competitor",      label: "Competitor Agent",      icon: "⚔️", desc: "Analyzing gaps & opportunities" },
  { key: "memory",          label: "Memory Agent",          icon: "🧠", desc: "Checking long-term context (MongoDB)" },
  { key: "orchestrator",    label: "Orchestrator",          icon: "🎯", desc: "Building the content strategy" },
  { key: "generator",       label: "Content Generator",     icon: "✍️", desc: "Writing optimized content" },
  { key: "validation",      label: "Validation Layer",      icon: "✅", desc: "Verifying production quality" },
];

export default function PipelineStudio({ onGenerated }) {
  // ─── Business Input State ───
  const [companyName, setCompanyName]           = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productFeatures, setProductFeatures]   = useState("");
  const [competitors, setCompetitors]           = useState("");
  const [businessGoal, setBusinessGoal]         = useState("");
  const [targetRegion, setTargetRegion]         = useState("");
  const [tonePreference, setTonePreference]     = useState("Professional");
  const [industry, setIndustry]                 = useState("");

  // ─── Pipeline State ───
  const [running,  setRunning]  = useState(false);
  const [error,    setError]    = useState("");

  const [agentStatus,   setAgentStatus]   = useState({});
  const [agentData,     setAgentData]     = useState({});
  const [expandedAgent, setExpandedAgent] = useState(null);

  const [streamedText, setStreamedText]   = useState("");
  const [isStreaming,  setIsStreaming]     = useState(false);
  const [completed,    setCompleted]      = useState(false);
  const [finalBlog,    setFinalBlog]      = useState(null);

  const abortRef  = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll as blog streams in
  useEffect(() => {
    if (isStreaming && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamedText, isStreaming]);

  function getApiBase() {
    if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    return isLocal ? "http://localhost:5000" : "https://blog-automation-1-afvy.onrender.com";
  }

  async function handleStart(e) {
    e.preventDefault();
    if (!companyName.trim() || !productDescription.trim()) {
      setError("Please provide at least Company Name and Product Description.");
      return;
    }

    setError("");
    setRunning(true);
    setAgentStatus({});
    setAgentData({});
    setStreamedText("");
    setIsStreaming(false);
    setCompleted(false);
    setFinalBlog(null);
    setExpandedAgent(null);

    const body = {
      companyName: companyName.trim(),
      productDescription: productDescription.trim(),
      productFeatures: productFeatures.split(",").map(s => s.trim()).filter(Boolean),
      competitors: competitors.split(",").map(s => s.trim()).filter(Boolean),
      businessGoal: businessGoal.trim() || "Generate SEO traffic and leads",
      targetRegion: targetRegion.trim() || "Global",
      tonePreference: tonePreference || "Professional",
      industry: industry.trim(),
    };

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch(`${getApiBase()}/api/pipeline-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;

          try {
            const msg = JSON.parse(raw);
            const { step, status, data } = msg;

            if (step === "word" && status === "streaming") {
              setIsStreaming(true);
              setStreamedText(prev => prev + (data || ""));
              continue;
            }

            if (step === "complete" && status === "done") {
              setCompleted(true);
              setRunning(false);
              setIsStreaming(false);
              setFinalBlog(data);
              if (onGenerated && data?.blogId) {
                onGenerated(
                  { _id: data.blogId, title: data.title, category: data.category },
                  data.category
                );
              }
              continue;
            }

            if (step === "error") {
              setError(data?.message || "Pipeline failed. Please try again.");
              setRunning(false);
              continue;
            }

            setAgentStatus(prev => ({ ...prev, [step]: status }));
            if (status === "done") {
              setAgentData(prev => ({ ...prev, [step]: data }));
            }
          } catch (_) {}
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Connection interrupted. The server may still be processing.");
        setRunning(false);
      }
    }
  }

  function handleReset() {
    if (abortRef.current) abortRef.current.abort();
    setRunning(false);
    setError("");
    setAgentStatus({});
    setAgentData({});
    setStreamedText("");
    setIsStreaming(false);
    setCompleted(false);
    setFinalBlog(null);
    setExpandedAgent(null);
  }

  const hasStarted = Object.keys(agentStatus).length > 0;

  const TONE_OPTIONS = ["Professional", "Motivational", "Conversational", "Authoritative", "Friendly", "Urgent", "Educational"];

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-purple-600">
            Autonomous Marketing Engine
          </p>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-stone-900 mb-4 serif">Intelligence Studio</h1>
        <p className="text-stone-500 text-lg max-w-2xl">
          9 specialized AI agents collaborate — detecting your domain, understanding audience psychology,
          researching SEO, analyzing competitors, and writing content that <em>actually ranks.</em>
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">

        {/* ── Left: Input + Progress ── */}
        <div className="lg:col-span-3 space-y-10">

          {/* ═══ Business Input Form ═══ */}
          <form onSubmit={handleStart} className="bg-gradient-to-br from-stone-50 to-purple-50/30 rounded-3xl p-10 space-y-8 border border-stone-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">🏢</span>
              <h2 className="text-lg font-black text-stone-900 uppercase tracking-wider text-[13px]">Business Intelligence</h2>
            </div>

            {/* Row 1: Company + Industry */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                num="1" label="Company / Product Name" required
                value={companyName} onChange={setCompanyName} disabled={running}
                placeholder="e.g. SkillSync AI"
              />
              <InputField
                num="2" label="Industry / Domain (Optional)"
                value={industry} onChange={setIndustry} disabled={running}
                placeholder="e.g. EdTech, Healthcare, SaaS"
              />
            </div>

            {/* Row 2: Product Description */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">
                  Product Description <span className="text-red-400">*</span>
                </label>
              </div>
              <textarea
                value={productDescription}
                onChange={e => setProductDescription(e.target.value)}
                placeholder="e.g. AI-powered interview preparation platform that uses mock interviews and resume analysis to help candidates crack technical and HR interviews"
                disabled={running}
                rows={3}
                className="w-full text-base font-medium bg-white rounded-2xl px-5 py-4 border border-stone-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all disabled:opacity-50 placeholder-stone-300 resize-none serif"
              />
            </div>

            {/* Row 3: Features + Competitors */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                num="4" label="Product Features (comma-separated)"
                value={productFeatures} onChange={setProductFeatures} disabled={running}
                placeholder="e.g. AI Mock Interview, Resume Analysis, Feedback Reports"
              />
              <InputField
                num="5" label="Competitor Websites (comma-separated)"
                value={competitors} onChange={setCompetitors} disabled={running}
                placeholder="e.g. leetcode.com, interviewbit.com"
              />
            </div>

            {/* Row 4: Business Goal + Region */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                num="6" label="Business Goal"
                value={businessGoal} onChange={setBusinessGoal} disabled={running}
                placeholder="e.g. Generate SEO traffic and leads"
              />
              <InputField
                num="7" label="Target Region"
                value={targetRegion} onChange={setTargetRegion} disabled={running}
                placeholder="e.g. India, USA, Global"
              />
            </div>

            {/* Row 5: Tone */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">8</span>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Tone Preference</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map(tone => (
                  <button
                    key={tone}
                    type="button"
                    disabled={running}
                    onClick={() => setTonePreference(tone)}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                      tonePreference === tone
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                        : "bg-white text-stone-500 border border-stone-200 hover:border-purple-300"
                    } disabled:opacity-50`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
                <p className="text-xs text-red-600 font-bold">⚠️ {error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={running}
                className="flex-1 bg-purple-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-purple-700 transition-all disabled:opacity-40 shadow-lg shadow-purple-200 active:scale-95"
              >
                {running ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="ml-1">Pipeline Running...</span>
                  </span>
                ) : completed ? "Run Again" : "Launch AI Pipeline"}
              </button>
              {(hasStarted || completed) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-5 rounded-2xl border border-stone-200 text-stone-500 text-sm font-bold hover:bg-stone-100 transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          {/* ═══ Agent Progress Timeline ═══ */}
          {hasStarted && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 px-1 mb-4">
                Pipeline Progress — {AGENT_STEPS.length} Agents
              </p>
              {AGENT_STEPS.map((agent) => {
                const status   = agentStatus[agent.key] || "waiting";
                const data     = agentData[agent.key];
                const isExpand = expandedAgent === agent.key;
                const isActive = status === "running";
                const isDone   = status === "done";

                return (
                  <div key={agent.key}>
                    <div
                      onClick={() => data && setExpandedAgent(isExpand ? null : agent.key)}
                      className={`flex items-center gap-4 p-5 rounded-2xl transition-all ${
                        isDone   ? "bg-emerald-50 border border-emerald-100 cursor-pointer hover:bg-emerald-100" :
                        isActive ? "bg-purple-50 border border-purple-200 shadow-sm" :
                        "bg-stone-50 border border-transparent opacity-40"
                      }`}
                    >
                      <span className="text-2xl">{agent.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-stone-900">{agent.label}</p>
                        <p className="text-xs text-stone-500 truncate">{agent.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isActive && (
                          <div className="flex items-center gap-2 text-purple-600">
                            <div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-bold">Running</span>
                          </div>
                        )}
                        {isDone && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                            ✓ Done {data && "· Click"}
                          </span>
                        )}
                        {status === "waiting" && (
                          <span className="text-[10px] text-stone-300 font-bold uppercase tracking-wider">Waiting</span>
                        )}
                      </div>
                    </div>

                    {/* Expandable data */}
                    {isExpand && data && (
                      <div className="mt-2 mb-2 bg-white border border-stone-200 rounded-2xl p-6 space-y-3 text-xs animate-fade-in">
                        {Object.entries(data).map(([key, val]) => {
                          if (!val || (Array.isArray(val) && val.length === 0)) return null;
                          const display = Array.isArray(val) ? val.join(" · ") : String(val);
                          return (
                            <div key={key} className="flex gap-3">
                              <span className="font-black text-stone-400 uppercase text-[9px] tracking-wider w-32 flex-shrink-0 mt-0.5">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span className="text-stone-700 leading-relaxed">{display}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Streaming step */}
              {(isStreaming || completed) && (
                <div className={`flex items-center gap-4 p-5 rounded-2xl border ${
                  isStreaming ? "bg-purple-50 border-purple-200" : "bg-emerald-50 border-emerald-100"
                }`}>
                  <span className="text-2xl">📝</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-stone-900">Streaming Content</p>
                    <p className="text-xs text-stone-500">Blog streaming word-by-word via SSE</p>
                  </div>
                  {isStreaming && (
                    <div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {completed && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">✓ Saved</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: Live Blog Output ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* How it works panel — shown before start */}
          {!hasStarted && (
            <div className="bg-gradient-to-br from-purple-50 to-stone-50 rounded-3xl p-8 border border-purple-100">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 mb-6">
                Pipeline Architecture
              </p>
              <div className="space-y-4">
                {AGENT_STEPS.map((a, i) => (
                  <div key={a.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{a.icon}</span>
                      {i < AGENT_STEPS.length - 1 && (
                        <div className="w-px h-3 bg-purple-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className="text-xs font-black text-stone-800">{a.label}</p>
                      <p className="text-[11px] text-stone-500 serif">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-purple-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-black text-purple-600">9</p>
                    <p className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">AI Agents</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-purple-600">20</p>
                    <p className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">Persona Templates</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-purple-600">∞</p>
                    <p className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">Memory Context</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Blog Output */}
          {(isStreaming || streamedText) && (
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-stone-400"}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">
                    {isStreaming ? "Writing live..." : "Generated Blog"}
                  </span>
                </div>
                {completed && finalBlog && (
                  <div className="flex items-center gap-3">
                    {finalBlog.validationScore && (
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        Quality: {finalBlog.validationScore}%
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      ✓ Saved
                    </span>
                  </div>
                )}
              </div>
              <div
                ref={scrollRef}
                className="p-8 max-h-[60vh] overflow-y-auto text-stone-700 leading-relaxed serif text-base whitespace-pre-line"
              >
                {streamedText}
                {isStreaming && (
                  <span className="inline-block w-0.5 h-5 bg-purple-600 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          )}

          {/* Success card */}
          {completed && finalBlog && (
            <div className="bg-gradient-to-br from-emerald-50 to-purple-50 border border-emerald-200 rounded-3xl p-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🎉</div>
                <p className="font-black text-stone-900 mb-1 text-sm">Blog Published!</p>
                <div className="flex items-center justify-center gap-4 text-xs text-stone-500 mb-4">
                  <span>Category: <strong>{finalBlog.category}</strong></span>
                  {finalBlog.wordCount && <span>{finalBlog.wordCount} words</span>}
                  {finalBlog.readingTime && <span>{finalBlog.readingTime} min read</span>}
                </div>
                <button
                  onClick={() => window.location.href = "/blogs"}
                  className="w-full bg-stone-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-stone-800 transition-all"
                >
                  View in Archive →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Input Component ───
function InputField({ num, label, value, onChange, disabled, placeholder, required }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">{num}</span>
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full text-base font-medium serif bg-white rounded-2xl px-5 py-3.5 border border-stone-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all disabled:opacity-50 placeholder-stone-300"
      />
    </div>
  );
}
