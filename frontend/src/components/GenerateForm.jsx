import React, { useState, useEffect, useRef } from "react";
import api from "../api";

export default function GenerateForm({ onGenerated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Real-time typing animation state ──
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef(null);

  // Cleans up the SSE connection when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.close();
    };
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!title.trim() && !description.trim()) {
      setError("Please add a title or a description to start.");
      return;
    }
    setError("");
    setLoading(true);
    setStreamedText("");
    setIsStreaming(true);

    try {
      // ── Step 1: Connect to streaming endpoint for live preview ──
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const params = new URLSearchParams({
        title: title.trim(),
        description: description.trim(),
      });

      // Close any existing stream
      if (streamRef.current) streamRef.current.close();

      const evtSource = new EventSource(`${apiBase}/generate-stream?${params}`);
      streamRef.current = evtSource;

      evtSource.onmessage = (e) => {
        if (e.data === "[DONE]") {
          evtSource.close();
          setIsStreaming(false);
        } else {
          setStreamedText((prev) => prev + e.data);
        }
      };

      evtSource.addEventListener("done", async (e) => {
        evtSource.close();
        setIsStreaming(false);
        // ── Step 2: Now actually save the blog to MongoDB ──
        try {
          const res = await api.post("/generate-blog", {
            title: title.trim(),
            description: description.trim(),
          });
          setTitle("");
          setDescription("");
          setStreamedText("");
          setLoading(false);
          if (onGenerated) onGenerated(res.data.blog);
        } catch (err) {
          setError("Blog was written but failed to save. Please try again.");
          setLoading(false);
        }
      });

      evtSource.onerror = async () => {
        evtSource.close();
        setIsStreaming(false);
        // Fallback: If streaming fails, use normal generation
        try {
          const res = await api.post("/generate-blog", {
            title: title.trim(),
            description: description.trim(),
          });
          setTitle("");
          setDescription("");
          setStreamedText("");
          setLoading(false);
          if (onGenerated) onGenerated(res.data.blog);
        } catch (err) {
          setError("Something went wrong. Please try again.");
          setLoading(false);
        }
      };

    } catch (err) {
      setError("The system is busy right now. Please try again in a moment.");
      setLoading(false);
      setIsStreaming(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-20">

        {/* Left Column: The Form */}
        <div className="lg:col-span-2 space-y-12">
          <header>
            <h3 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">Drafting Studio</h3>
            <p className="text-stone-500 serif text-lg">Turn your rough ideas into a polished, professional story.</p>
          </header>

          <form onSubmit={handleGenerate} className="space-y-16">

            {/* Field 1: Title */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">1</span>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Entry Title (Optional)</label>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your story a name..."
                disabled={loading}
                className="w-full text-4xl font-bold serif bg-transparent border-none placeholder-stone-200 focus:outline-none focus:ring-0 text-stone-900"
              />
              <p className="text-xs text-stone-400 italic">Leave this blank if you want the system to create a title for you.</p>
            </div>

            {/* Field 2: Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">2</span>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">What is this story about?</label>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your thoughts, the main message, or any specific points you want to cover..."
                rows={8}
                disabled={loading}
                className="w-full text-2xl serif bg-transparent border-none placeholder-stone-200 focus:outline-none focus:ring-0 resize-none leading-relaxed text-stone-800"
              />
            </div>

            {/* Action Area */}
            <div className="pt-12 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                {error ? (
                  <p className="text-xs text-red-500 font-bold uppercase tracking-wider bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                ) : (
                  <p className="text-xs text-stone-400 leading-relaxed">
                    By clicking the button, our editorial system will analyze your input and
                    write a long-form narrative for your personal collection.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-stone-900 text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-stone-800 transition-all disabled:opacity-30 shadow-xl active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </span>
                ) : "Write My Story"}
              </button>
            </div>
          </form>

          {/* ── Real-time Typing Preview ── */}
          {(isStreaming || streamedText) && (
            <div className="mt-16 pt-16 border-t border-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                  {isStreaming ? "Writing in real-time..." : "Done writing!"}
                </p>
              </div>
              <div className="text-stone-700 leading-relaxed serif text-lg whitespace-pre-line bg-stone-50 p-8 rounded-2xl relative">
                {streamedText}
                {/* Blinking cursor while typing */}
                {isStreaming && (
                  <span className="inline-block w-0.5 h-5 bg-stone-900 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tips & Info */}
        <div className="space-y-12">
          <div className="bg-stone-50 p-10 rounded-[2rem] space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-900">Writing Tips</h4>

            <div className="space-y-8">
              <div className="space-y-2">
                <p className="font-bold text-sm">Be Descriptive</p>
                <p className="text-xs text-stone-500 leading-relaxed serif">The more details you provide, the better the system can understand your unique perspective.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-sm">Pick a Category</p>
                <p className="text-xs text-stone-500 leading-relaxed serif">The system automatically assigns a category, but you can hint at one in your description.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-sm">Auto Tags</p>
                <p className="text-xs text-stone-500 leading-relaxed serif">The system will automatically extract keywords from your story and add them as searchable tags.</p>
              </div>
            </div>
          </div>

          <div className="px-10 space-y-4 text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full mx-auto flex items-center justify-center text-xl">✍</div>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-black">Manuscript Studio v2.0</p>
          </div>
        </div>

      </div>
    </div>
  );
}
