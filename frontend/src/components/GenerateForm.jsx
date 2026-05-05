import React, { useState } from "react";
import api from "../api";

export default function GenerateForm({ onGenerated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();
    if (!title.trim() && !description.trim()) {
      setError("Please provide at least a title or a description.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/generate-blog", { 
        title: title.trim(),
        description: description.trim()
      });
      onGenerated(res.data.blog);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("The editor is away. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="mb-12">
        <h3 className="text-3xl font-bold serif mb-2">Write a New Blog</h3>
        <p className="text-stone-400 text-sm">Give your blog a title and describe what you want to write about.</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-12">
        {/* Title Input */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">1. Blog Title (Optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title..."
            className="w-full text-4xl font-bold serif bg-transparent border-none placeholder-stone-200 focus:outline-none focus:ring-0 text-stone-900"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">2. What is this blog about?</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your topic here..."
            rows={6}
            disabled={loading}
            className="w-full text-2xl serif bg-transparent border-none placeholder-stone-200 focus:outline-none focus:ring-0 resize-none leading-relaxed text-stone-800"
          />
        </div>

        <div className="flex items-center justify-between pt-12 border-t border-stone-100">
          <div className="max-w-[200px]">
            {error && <p className="text-xs text-red-500 font-bold uppercase tracking-wider">{error}</p>}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-stone-900 disabled:opacity-30"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-stone-900 rounded-full animate-bounce" />
                AI is writing...
              </span>
            ) : (
              <>
                Write Blog
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
