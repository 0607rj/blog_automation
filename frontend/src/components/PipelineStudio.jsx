import React, { useState, useRef, useEffect } from "react";

const AGENT_STEPS = [
  { key: "persona",      label: "Persona Agent",     icon: "👤", desc: "Understanding your audience deeply" },
  { key: "research",     label: "Research Agent",     icon: "🔍", desc: "Analyzing trends & search intent" },
  { key: "competitor",   label: "Competitor Agent",   icon: "⚔️", desc: "Finding content gaps & opportunities" },
  { key: "memory",       label: "Memory Agent",       icon: "🧠", desc: "Checking content history (MongoDB)" },
  { key: "orchestrator", label: "Orchestrator",       icon: "🎯", desc: "Building the final content strategy" },
  { key: "generator",    label: "Blog Generator",     icon: "✍️", desc: "Writing your audience-aware blog" },
];

export default function PipelineStudio({ onGenerated }) {
  const [audience, setAudience] = useState("");
  const [niche,    setNiche]    = useState("");
  const [running,  setRunning]  = useState(false);
  const [error,    setError]    = useState("");

  const [agentStatus,   setAgentStatus]   = useState({});
  const [agentData,     setAgentData]     = useState({});
  const [expandedAgent, setExpandedAgent] = useState(null);

  const [streamedText, setStreamedText]   = useState("");
  const [isStreaming,  setIsStreaming]    = useState(false);
  const [completed,    setCompleted]      = useState(false);
  const [finalBlog,    setFinalBlog]      = useState(null);

  const streamRef   = useRef(null);
  const scrollRef   = useRef(null);

  // Auto-scroll as blog streams in
  useEffect(() => {
    if (isStreaming && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamedText, isStreaming]);

  useEffect(() => {
    return () => { if (streamRef.current) streamRef.current.close(); };
  }, []);

  function getApiBase() {
    if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    return isLocal ? "http://localhost:5000" : "https://blog-automation-1-afvy.onrender.com";
  }

  function handleStart(e) {
    e.preventDefault();
    if (!audience.trim() || !niche.trim()) {
      setError("Please fill in both Target Audience and Niche to start the pipeline.");
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

    const params = new URLSearchParams({ audience: audience.trim(), niche: niche.trim() });
    if (streamRef.current) streamRef.current.close();

    const evtSource = new EventSource(`${getApiBase()}/api/pipeline-stream?${params}`);
    streamRef.current = evtSource;

    evtSource.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        const { step, status, data } = msg;

        if (step === "word" && status === "streaming") {
          setIsStreaming(true);
          setStreamedText(prev => prev + (data || ""));
          return;
        }

        if (step === "complete" && status === "done") {
          setCompleted(true);
          setRunning(false);
          setIsStreaming(false);
          setFinalBlog(data);
          evtSource.close();
          if (onGenerated && data?.blogId) {
            onGenerated({ _id: data.blogId, title: data.title, category: data.category });
          }
          return;
        }

        if (step === "error") {
          setError(data?.message || "Pipeline failed. Please try again.");
          setRunning(false);
          evtSource.close();
          return;
        }

        // Update agent step status
        setAgentStatus(prev => ({ ...prev, [step]: status }));
        if (status === "done") {
          setAgentData(prev => ({ ...prev, [step]: data }));
        }
      } catch (_) {}
    };

    evtSource.addEventListener("done", () => evtSource.close());

    evtSource.onerror = () => {
      if (!completed) {
        setError("Connection interrupted. The server may still be processing — check the Archive in a moment.");
        setRunning(false);
      }
      evtSource.close();
    };
  }

  function handleReset() {
    if (streamRef.current) streamRef.current.close();
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

  const currentStep = AGENT_STEPS.findIndex(a => agentStatus[a.key] === "running");
  const hasStarted  = Object.keys(agentStatus).length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2.5 h-2.5 bg-stone-400 rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-600">
            Editorial Workflow
          </p>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-stone-900 mb-4 serif">Intelligence Studio</h1>
        <p className="text-stone-500 text-lg max-w-xl">
          6 AI agents collaborate in sequence — understanding your audience, researching trends, 
          analyzing competitors, and writing data-driven content.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">

        {/* ── Left: Input + Progress ── */}
        <div className="lg:col-span-3 space-y-10">

          {/* Input Form */}
          <form onSubmit={handleStart} className="bg-stone-50 rounded-3xl p-10 space-y-10">

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black">1</span>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">
                  Target Audience
                </label>
              </div>
              <input
                type="text"
                value={audience}
                onChange={e => setAudience(e.target.value)}
                placeholder="e.g. Accounting students preparing for internships"
                disabled={running}
                className="w-full text-xl font-semibold serif bg-white rounded-2xl px-6 py-4 border border-stone-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all disabled:opacity-50 placeholder-stone-300"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black">2</span>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">
                  Niche / Industry
                </label>
              </div>
              <input
                type="text"
                value={niche}
                onChange={e => setNiche(e.target.value)}
                placeholder="e.g. Finance, EdTech, SaaS, Healthcare"
                disabled={running}
                className="w-full text-xl font-semibold serif bg-white rounded-2xl px-6 py-4 border border-stone-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all disabled:opacity-50 placeholder-stone-300"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
                <p className="text-xs text-red-600 font-bold">⚠️ {error}</p>
              </div>
            )}

            <div className="flex gap-4">
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
                ) : completed ? "Run Again" : "Create New Blog"}
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

          {/* ── Agent Progress Timeline ── */}
          {hasStarted && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 px-1 mb-4">
                Pipeline Progress
              </p>
              {AGENT_STEPS.map((agent, idx) => {
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
                            ✓ Done {data && "· Click to view"}
                          </span>
                        )}
                        {status === "waiting" && (
                          <span className="text-[10px] text-stone-300 font-bold uppercase tracking-wider">Waiting</span>
                        )}
                      </div>
                    </div>

                    {/* Expandable data */}
                    {isExpand && data && (
                      <div className="mt-2 mb-2 bg-white border border-stone-200 rounded-2xl p-6 space-y-3 text-xs">
                        {Object.entries(data).map(([key, val]) => {
                          if (!val || (Array.isArray(val) && val.length === 0)) return null;
                          const display = Array.isArray(val) ? val.join(" · ") : String(val);
                          return (
                            <div key={key} className="flex gap-3">
                              <span className="font-black text-stone-400 uppercase text-[9px] tracking-wider w-28 flex-shrink-0 mt-0.5">
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
                How It Works
              </p>
              <div className="space-y-5">
                {AGENT_STEPS.map((a, i) => (
                  <div key={a.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xl">{a.icon}</span>
                      {i < AGENT_STEPS.length - 1 && (
                        <div className="w-px h-4 bg-purple-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className="text-xs font-black text-stone-800">{a.label}</p>
                      <p className="text-[11px] text-stone-500 serif">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-purple-100 text-center">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-black">
                  The Manuscript Editorial Engine
                </p>
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
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    ✓ Saved to Archive
                  </span>
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
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center">
              <div className="text-3xl mb-3">🎉</div>
              <p className="font-black text-stone-900 mb-1 text-sm">Blog Published!</p>
              <p className="text-xs text-stone-500 mb-4">
                Category: <strong>{finalBlog.category}</strong>
              </p>
              <button
                onClick={() => window.location.href = "/blogs"}
                className="w-full bg-stone-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-stone-800 transition-all"
              >
                View in Archive →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
