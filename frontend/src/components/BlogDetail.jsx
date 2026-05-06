import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await api.get(`/blogs`);
        const found = res.data.blogs.find(b => b._id === id);
        setBlog(found);

        // Fetch related blogs (same category)
        if (found) {
          const relRes = await api.get(`/blogs/${found._id}/related`);
          setRelated(relRes.data.related || []);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  const handleRate = async (type) => {
    try {
      const res = await api.patch(`/blogs/${blog._id}/rate`, { type });
      setBlog(res.data.blog);
    } catch (err) {
      console.error("Failed to rate:", err);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto py-40 px-6 text-center">
      <p className="text-stone-400 animate-pulse serif text-2xl">Loading the article...</p>
    </div>
  );

  if (!blog) return (
    <div className="max-w-4xl mx-auto py-40 px-6 text-center">
      <h2 className="text-3xl font-bold mb-6">Article not found.</h2>
      <Link to="/blogs" className="text-stone-500 underline">Back to Feed</Link>
    </div>
  );

  // Calculate reading time (avg 200 words/min)
  const wordCount = blog.content?.split(" ").length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="max-w-4xl mx-auto py-20 px-6 animate-fade-in">
      <Link to="/blogs" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors mb-12">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Feed
      </Link>

      <header className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">{blog.category}</span>
          <span className="w-1 h-1 bg-stone-300 rounded-full" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          <span className="w-1 h-1 bg-stone-300 rounded-full" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
            {readingTime} min read
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-stone-900 leading-tight serif mb-8">
          {blog.title}
        </h1>
        <p className="text-2xl text-stone-500 italic serif leading-relaxed border-l-4 border-stone-100 pl-8">
          {blog.summary}
        </p>

        {/* ── Auto Tags ── */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-500 px-3 py-1.5 rounded-full hover:bg-stone-900 hover:text-white transition-all cursor-default"
              >
                # {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-stone max-w-none">
        <div className="text-xl text-stone-800 leading-[1.9] whitespace-pre-line space-y-8 serif">
          {blog.content}
        </div>
      </div>

      <footer className="mt-32 pt-16 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">E</div>
          <div>
            <p className="text-sm font-bold">The Manuscript Editor</p>
            <p className="text-xs text-stone-400">Digital Publication System</p>
          </div>
        </div>

        {/* Rating Buttons */}
        <div className="flex items-center gap-8">
          <button onClick={() => handleRate("like")} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-stone-50 transition-all">
              <svg className="w-6 h-6 text-stone-400 group-hover:text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.708C19.746 10 20.621 10.875 20.621 11.958c0 .504-.192.983-.542 1.346l-4.708 4.708a2 2 0 01-1.414.586H9a2 2 0 01-2-2v-9a2 2 0 01.586-1.414L11.172 2.586a2 2 0 012.828 0 2 2 0 01.586 1.414V10z"></path></svg>
            </div>
            <span className="text-xs font-bold text-stone-400 group-hover:text-stone-900">{blog.likes || 0} Likes</span>
          </button>

          <button onClick={() => handleRate("dislike")} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-stone-50 transition-all">
              <svg className="w-6 h-6 text-stone-400 group-hover:text-stone-900 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.708C19.746 10 20.621 10.875 20.621 11.958c0 .504-.192.983-.542 1.346l-4.708 4.708a2 2 0 01-1.414.586H9a2 2 0 01-2-2v-9a2 2 0 01.586-1.414L11.172 2.586a2 2 0 012.828 0 2 2 0 01.586 1.414V10z"></path></svg>
            </div>
            <span className="text-xs font-bold text-stone-400 group-hover:text-stone-900">{blog.dislikes || 0} Dislikes</span>
          </button>
        </div>

        <Link to="/blogs" className="text-sm font-bold uppercase tracking-widest text-stone-900 hover:underline">
          Read More Posts
        </Link>
      </footer>

      {/* ── Related Blogs Section ── */}
      {related.length > 0 && (
        <section className="mt-24 pt-16 border-t border-stone-100">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400 mb-10">
            More from {blog.category}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {related.map((r) => (
              <Link
                key={r._id}
                to={`/blog/${r._id}`}
                className="group block p-6 rounded-2xl hover:bg-stone-50 transition-all border border-stone-100 hover:border-stone-200"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 block">
                  {r.category}
                </span>
                <h4 className="font-bold text-stone-900 leading-snug group-hover:underline serif text-lg mb-2 line-clamp-2">
                  {r.title}
                </h4>
                <p className="text-xs text-stone-400 line-clamp-2 serif">
                  {r.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </article>
  );
}
