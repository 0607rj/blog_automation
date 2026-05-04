import React from "react";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogCard({ blog, isNew }) {
  return (
    <article className={`group animate-fade-in relative ${isNew ? 'bg-stone-50/50 -mx-4 px-4 py-8 rounded-2xl' : ''}`}>
      {isNew && (
        <span className="absolute -top-3 left-6 px-3 py-1 bg-stone-900 text-[10px] text-white font-bold uppercase tracking-widest rounded-full shadow-lg">
          Recently Published
        </span>
      )}
      
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
          {blog.category}
        </span>
        <span className="w-1 h-1 bg-stone-300 rounded-full" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
          {formatDate(blog.createdAt)}
        </span>
      </div>

      <h2 className="text-3xl md:text-5xl font-bold serif mb-6 leading-[1.1] text-stone-900 group-hover:text-stone-700 transition-colors">
        {blog.title}
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1">
          <p className="text-stone-500 text-lg leading-relaxed mb-8 font-medium italic border-l-2 border-stone-100 pl-6">
            {blog.summary}
          </p>

          <div className="prose prose-stone max-w-none prose-lg">
            <p className="text-stone-700 text-lg leading-[1.8] whitespace-pre-line">
              {blog.content}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-b border-stone-100" />
    </article>
  );
}
