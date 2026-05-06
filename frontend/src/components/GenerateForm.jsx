import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function GenerateForm({ onGenerated }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();
    if (!title.trim() && !description.trim()) {
      setError("Please add a title or a description to start.");
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
      setError("The system is busy right now. Please try again in a moment.");
    } finally {
      setLoading(false);
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
                    Drafting Narrative...
                  </span>
                ) : "Write My Story"}
              </button>
            </div>
          </form>
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
                <p className="font-bold text-sm">Bullet Points</p>
                <p className="text-xs text-stone-500 leading-relaxed serif">The system will automatically add key takeaways to your post to make it more readable.</p>
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
