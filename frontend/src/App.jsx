import React, { useState, useEffect, useMemo } from "react";
import api from "./api";
import GenerateForm from "./components/GenerateForm";
import BlogCard from "./components/BlogCard";

export default function App() {
  const [blogs, setBlogs] = useState([]);
  const [newestId, setNewestId] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      setFetching(true);
      const res = await api.get("/blogs");
      setBlogs(res.data.blogs);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setFetching(false);
    }
  }

  function handleGenerated(newBlog) {
    setNewestId(newBlog._id);
    setBlogs((prev) => [newBlog, ...prev]);
    setIsDrafting(false); // Close the form after generation
    setTimeout(() => setNewestId(null), 10000);
  }

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;
    const query = searchQuery.toLowerCase();
    return blogs.filter(b => 
      b.title.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query) ||
      b.content.toLowerCase().includes(query)
    );
  }, [blogs, searchQuery]);

  return (
    <div className="min-h-screen pb-32">
      {/* ── Simple Navigation ── */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-stone-100 z-50 px-6 lg:px-12 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          My Personal Blog
        </h1>
        
        <div className="flex items-center gap-6">
          <div className="relative group hidden sm:block">
            <input 
              type="text" 
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-transparent focus:border-stone-300 text-sm py-1 outline-none w-32 focus:w-64 transition-all duration-500"
            />
          </div>
          <button 
            onClick={() => setIsDrafting(!isDrafting)}
            className="text-xs font-bold uppercase tracking-widest bg-stone-900 text-white px-5 py-2.5 rounded-full hover:bg-stone-800 transition-all active:scale-95 shadow-sm"
          >
            {isDrafting ? "Cancel" : "Create Blog"}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto pt-40 px-6">
        {/* ── New Blog Form ── */}
        {isDrafting && (
          <section className="mb-24 animate-fade-in">
            <GenerateForm onGenerated={handleGenerated} />
            <div className="mt-12 mb-20 border-b border-stone-100" />
          </section>
        )}

        {/* ── Header ── */}
        {!isDrafting && !searchQuery && (
          <header className="mb-24 text-center">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6 serif">
              Thoughts & <br/><span className="italic text-stone-400">ideas</span> written by AI.
            </h2>
          </header>
        )}

        {/* ── Search State ── */}
        {searchQuery && (
          <header className="mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-stone-400 mb-2">Showing results for</p>
            <h3 className="text-3xl font-bold serif">"{searchQuery}"</h3>
          </header>
        )}

        {/* ── Blog Feed ── */}
        <section className="space-y-32">
          {fetching && blogs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-bounce mb-4 text-stone-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <p className="text-lg text-stone-400 animate-pulse serif">Loading your blog posts...</p>
              
              <div className="mt-12 space-y-24 max-w-2xl mx-auto text-left">
                {[1, 2].map(i => (
                  <div key={i} className="animate-pulse space-y-4 opacity-30">
                    <div className="h-4 w-20 bg-stone-200 rounded" />
                    <div className="h-10 w-3/4 bg-stone-200 rounded" />
                    <div className="h-24 bg-stone-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-40 text-center">
              <p className="serif text-2xl text-stone-300 italic">No posts found.</p>
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} isNew={blog._id === newestId} />
            ))
          )}
        </section>
      </main>

      <footer className="mt-40 py-20 border-t border-stone-100 text-center">
        <p className="text-xs uppercase tracking-widest text-stone-300 font-bold">
          © {new Date().getFullYear()} AI Blog Website
        </p>
      </footer>
    </div>

  );
}
