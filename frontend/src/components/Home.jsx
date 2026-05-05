import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white text-stone-900">
      
      {/* ── SECTION 1: HERO (The Big Intro) ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="max-w-4xl space-y-10 animate-fade-in">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">
            Where Writing <br/>
            Begins to <span className="text-stone-300 italic serif font-normal">Feel.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-500 leading-relaxed max-w-2xl mx-auto font-medium serif">
            The Manuscript is a simple blog system that helps you turn your 
            thoughts into long, interesting stories—instantly.
          </p>



          <div className="pt-10 flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/blogs" 
              className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-stone-800 transition-all shadow-2xl hover:-translate-y-1"
            >
              Explore the Archive
            </Link>
            <button 
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-stone-200 text-stone-900 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:border-stone-900 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: HOW IT WORKS ── */}
      <section id="how-it-works" className="py-40 bg-stone-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-stone-400 mb-4">The Workflow</h2>
            <p className="text-4xl md:text-6xl font-bold serif">Simple. Intelligent. Seamless.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-20">
            <div className="space-y-6">
              <span className="text-6xl font-black text-stone-200">01</span>
              <h3 className="text-2xl font-bold">The Seed</h3>
              <p className="text-stone-500 leading-relaxed serif">
                Input a simple title or a rough description of what's on your mind. 
                No need for complex prompts.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-6xl font-black text-stone-200">02</span>
              <h3 className="text-2xl font-bold">The Writing</h3>
              <p className="text-stone-500 leading-relaxed serif">
                Our system takes your idea and expands it into 
                a long, structured article using simple words.
              </p>
            </div>


            <div className="space-y-6">
              <span className="text-6xl font-black text-stone-200">03</span>
              <h3 className="text-2xl font-bold">The Archive</h3>
              <p className="text-stone-500 leading-relaxed serif">
                Every generated piece is instantly formatted, categorized, and 
                permanently stored in your digital collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FEATURES GRID ── */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-7xl font-bold leading-[1.1]">
              Built for the <br/>
              <span className="text-stone-400">Next Era</span> of Writing.
            </h2>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-stone-100 rounded-2xl shrink-0 flex items-center justify-center font-bold">✦</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Human-Like Tone</h4>
                  <p className="text-stone-500 serif">We skip the robotic talk and focus on professional, engaging language that resonates with real readers.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-stone-100 rounded-2xl shrink-0 flex items-center justify-center font-bold">⚡</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Incredible Speed</h4>
                  <p className="text-stone-500 serif">Powered by optimized inference technology, generation happens in seconds, not minutes.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-stone-100 rounded-2xl shrink-0 flex items-center justify-center font-bold">☁</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Cloud Infrastructure</h4>
                  <p className="text-stone-500 serif">Built on MongoDB Atlas and Render, ensuring your stories are always online and secure.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-900 rounded-[3rem] p-12 aspect-square flex flex-col justify-center text-white space-y-8 shadow-3xl">
             <div className="space-y-2">
                <div className="h-2 w-20 bg-stone-700 rounded-full" />
                <h3 className="text-4xl font-bold serif italic">"The future of publishing is not just more content, but better content, faster."</h3>
             </div>
             <p className="text-stone-400 text-sm uppercase tracking-widest font-black">— The Editorial System</p>
          </div>

        </div>
      </section>

      {/* ── SECTION 4: FINAL CTA ── */}
      <section className="py-40 bg-stone-900 text-white text-center px-6 overflow-hidden relative">
        <div className="max-w-3xl mx-auto space-y-12 relative z-10">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter">Ready to start <br/>your collection?</h2>
          <Link 
            to="/blogs" 
            className="inline-block bg-white text-stone-900 px-16 py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-stone-100 transition-all hover:scale-110"
          >
            Go to Archive
          </Link>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-stone-800 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-800 rounded-full translate-x-1/2 translate-y-1/2 opacity-50" />
      </section>

    </div>
  );
}
