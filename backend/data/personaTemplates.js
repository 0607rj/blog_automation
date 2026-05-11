/**
 * PERSONA TEMPLATE LIBRARY
 * 5 curated, hyper-deep psychological audience profiles.
 * Each contains deep psychological marketing intelligence.
 */

const PERSONA_TEMPLATES = [
  {
    id: "unemployed-graduate",
    label: "Unemployed Graduate",
    domains: ["career", "job search", "edtech", "ai interview", "upskilling"],
    
    characterSnapshot: {
      name: "Rahul",
      age: 23,
      region: "Tier 2/3 City, India",
      identityHeadline: "The capable but overlooked graduate",
      definingQuote: "\"I did everything I was supposed to do, but nobody is giving me a chance to prove myself.\""
    },
    
    lifeSituation: {
      education: "B.Tech/Degree from a non-premium college",
      income: "Dependent on parents, feeling the guilt of taking pocket money at 23",
      familyPressure: "High. Relatives ask 'what are you doing now?' at every gathering",
      financialCondition: "Strained. Cannot afford expensive courses, needs ROI immediately",
      influenceSystem: "Peers who got placed, YouTube tech influencers, strict parents",
      dependencyLevel: "Financially dependent, emotionally isolated",
      livingEnvironment: "Living at home, studying from a small desk in their bedroom"
    },
    
    psychologyLayer: {
      identityBelief: "I am smart enough, but I don't have the 'tag' or the connections.",
      hiddenInsecurity: "What if I am fundamentally not good enough for the tech industry?",
      emotionalFrustration: "Applying to 100s of jobs on LinkedIn and getting zero replies; feeling invisible.",
      fearOfFailure: "Permanent unemployment and having to take a low-paying non-tech job to survive.",
      emotionalMotivation: "To see the pride in their parents' eyes and finally be financially independent.",
      selfWorthIssues: "Rejections feel like personal attacks on their intelligence.",
      successVisualization: "Walking into an office with a laptop bag, getting that first salary text from the bank."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "Resume gets rejected by ATS",
        hiddenReason: "Feels their projects aren't 'real' enough and they are an imposter.",
        manifestation: "Rewriting the resume 50 times but never feeling it's good enough.",
        consequence: "Paralysis by analysis; stops applying out of fear of rejection."
      },
      {
        visibleSymptom: "Failing technical interviews",
        hiddenReason: "Panic kicks in when put on the spot because they lack real-world confidence.",
        manifestation: "Going blank when asked a question they actually know the answer to.",
        consequence: "Deep shame and avoiding interviews for weeks afterward."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["Is it too late for 2023 passouts?", "How to get a job off-campus?", "My resume is getting 0 traction."],
      hinglishPatterns: ["Bhai, off-campus scene bohot tough hai", "Koi referral de do", "ATS friendly resume kaise banaye"],
      emotionalLanguage: ["Frustrated", "Stuck", "Desperate", "Hopeless but trying"],
      googleSearch: ["why am I not getting interview calls", "best skills to learn for freshers to get a job fast"],
      youtubeSearch: ["how I got a job as a fresher with no experience", "mock interview for freshers"],
      friendConversation: "Everyone is moving forward except me. I don't even feel like hanging out anymore."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Needs to see someone exactly like them (same college tier) who succeeded.",
      emotionalHesitation: "What if I buy this and still don't get a job? I'll waste my parents' money.",
      researchBehavior: "Binge-watches free content for weeks before making a ₹500 purchase.",
      emotionalTriggers: ["Guaranteed outcomes", "Step-by-step handholding", "Empathy for their situation"],
      purchaseBlockers: ["High price", "Long duration (needs a job NOW)"],
      urgencyTriggers: ["Upcoming hiring season", "Limited seats for mentorship"]
    },
    
    objectionStack: [
      {
        visibleObjection: "I don't have money for this.",
        hiddenFear: "I am afraid this is another scam that will take my money and leave me jobless.",
        counterResponse: "Show exact ROI, provide a money-back guarantee based on effort, and show testimonials of broke students who made it."
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Vulnerability from the creator, showing exact screenshots of offer letters, admitting the market is tough.",
      destroysTrust: "Flashy cars, 'get rich quick' vibes, toxic positivity ('just work harder').",
      influencesDecisions: "YouTube mentors, successful seniors, affordable price tags.",
      proofRequired: "Screenshots of real emails, LinkedIn profiles of past students."
    },
    
    contentHabits: {
      platformBehavior: "Lurks on LinkedIn but rarely posts. Active on Discord/Telegram groups.",
      formatsTrusted: "Long-form raw podcasts, screen-sharing tutorials, 'Day in the life' vlogs.",
      activeConsumptionTiming: "Late at night (11 PM - 2 AM) when anxiety hits.",
      emotionalEngagement: "Saves posts that give them a sudden burst of hope or clear roadmaps."
    },
    
    transformationDesire: {
      beforeState: "Dependent, anxious, feeling invisible, 'the unemployed friend'.",
      afterState: "Independent, confident, respected professional, 'the successful one'.",
      emotionalGoal: "To feel employable, respected, and worthy of sitting in a corporate office."
    }
  },
  {
    id: "career-switcher",
    label: "Career Switcher",
    domains: ["career", "technology", "upskilling", "edtech", "ai", "coding"],
    
    characterSnapshot: {
      name: "Priya",
      age: 29,
      region: "Metro City, India/Global",
      identityHeadline: "The ambitious but trapped professional",
      definingQuote: "\"I am too smart to be stuck doing this mundane work for the rest of my life.\""
    },
    
    lifeSituation: {
      education: "Non-tech degree (B.Com, BBA, Arts) or stagnant engineering branch",
      income: "Stable but low/average. Barely covering living costs in a tier-1 city.",
      familyPressure: "Pressure to settle down/marry or buy a house, making risks scary.",
      financialCondition: "Can afford EMIs, but a career gap is financially terrifying.",
      influenceSystem: "Successful LinkedIn peers, tech-bro narratives on Twitter.",
      dependencyLevel: "Independent, but trapped by financial obligations.",
      livingEnvironment: "Rented apartment, commuting 2 hours a day."
    },
    
    psychologyLayer: {
      identityBelief: "I missed the boat. Everyone else figured it out in college.",
      hiddenInsecurity: "Am I too old to learn coding? Will 22-year-olds manage me?",
      emotionalFrustration: "Feeling unchallenged and undervalued in their current role.",
      fearOfFailure: "Quitting their job, failing at tech, and having to crawl back to their old career.",
      emotionalMotivation: "To have a career that commands respect and a high salary.",
      selfWorthIssues: "Feeling intellectually superior to their current job but lacking the skills to escape it.",
      successVisualization: "Working remotely from a cafe, commanding a 1.5L/month salary, doing creative work."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "No clarity on which new career to choose (Data vs AI vs Web Dev)",
        hiddenReason: "Terrified of making the wrong choice and wasting another 2 years.",
        manifestation: "Watching 50 'roadmap' videos but never writing a single line of code.",
        consequence: "Analysis paralysis and staying in the hated job for another year."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["Is it too late to switch to IT?", "How to explain career gap?", "Will companies hire a 30-year-old fresher?"],
      hinglishPatterns: ["Non-IT se IT me switch kaise kare", "Current job me growth nahi hai"],
      emotionalLanguage: ["Stagnant", "Overwhelmed", "Regretful", "Determined"],
      googleSearch: ["best career switch options for 30 year olds", "how to transition from sales to tech"],
      youtubeSearch: ["non tech to tech transition story", "day in the life of a self taught developer"],
      friendConversation: "I can't do this job anymore. It's draining my soul, but I don't know how to leave."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Needs logical proof. Wants to see the syllabus, the mentors, and career transition statistics.",
      emotionalHesitation: "I don't have the energy to study after a 9-to-5 job.",
      researchBehavior: "Compares 5 different platforms, reads Reddit reviews, looks for alumni on LinkedIn.",
      emotionalTriggers: ["'It's never too late'", "Structured time-saving paths", "Mentorship from industry experts"],
      purchaseBlockers: ["Vague promises", "Lack of 1-on-1 support"],
      urgencyTriggers: ["The feeling of time running out", "Upcoming salary appraisals (or lack thereof)"]
    },
    
    objectionStack: [
      {
        visibleObjection: "I don't have a tech background.",
        hiddenFear: "I will be the dumbest person in the room and will fail the course.",
        counterResponse: "Emphasize 'zero to hero' curricula, showcase non-tech transition stories (e.g., 'From B.Com to Data Scientist')."
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Honesty about the difficulty, clear structured paths, instructors with real industry experience.",
      destroysTrust: "Guaranteed job in 30 days claims, overly technical jargon that alienates them.",
      influencesDecisions: "Career counselors, detailed curriculum PDFs, success stories of people over 28.",
      proofRequired: "Before/after salary slips, LinkedIn profile transformations."
    },
    
    contentHabits: {
      platformBehavior: "Reads Medium articles, highly active on LinkedIn, asks questions on Reddit (r/careerguidance).",
      formatsTrusted: "In-depth case studies, detailed roadmaps, webinars.",
      activeConsumptionTiming: "During commute, lunch breaks, and weekend mornings.",
      emotionalEngagement: "Engages with stories of resilience and late-bloomer success."
    },
    
    transformationDesire: {
      beforeState: "Unfulfilled, trapped, underpaid, dreading Mondays.",
      afterState: "Intellectually stimulated, financially abundant, proud of their title.",
      emotionalGoal: "To feel smart, respected, and in control of their destiny."
    }
  },
  {
    id: "startup-founder",
    label: "Startup Founder",
    domains: ["startup", "saas", "marketing", "business", "technology", "ai"],
    
    characterSnapshot: {
      name: "Arjun",
      age: 32,
      region: "Tech Hub (Bangalore, SF, London)",
      identityHeadline: "The visionary drowning in execution",
      definingQuote: "\"I have a great product, but I'm burning cash and I can't figure out distribution.\""
    },
    
    lifeSituation: {
      education: "Highly educated (Engineer/MBA) or college dropout",
      income: "Taking a massive pay cut to build their dream. Cash poor, equity rich.",
      familyPressure: "Spouse/parents subtly asking when the startup will 'take off'.",
      financialCondition: "Constant anxiety about runway and next month's payroll.",
      influenceSystem: "Y Combinator content, Paul Graham essays, VC Twitter.",
      dependencyLevel: "The weight of their team's livelihood is on their shoulders.",
      livingEnvironment: "Living in a modest apartment, working 14-hour days."
    },
    
    psychologyLayer: {
      identityBelief: "I am a builder, but I am failing at marketing.",
      hiddenInsecurity: "What if I'm building something nobody actually wants?",
      emotionalFrustration: "Competitors with worse products are getting more traction because of better marketing.",
      fearOfFailure: "Having to shut down, fire the team, and go back to a corporate job as a 'failed founder'.",
      emotionalMotivation: "To build something massive, achieve freedom, and prove the doubters wrong.",
      selfWorthIssues: "Tying their entire ego and self-worth to the company's MRR (Monthly Recurring Revenue).",
      successVisualization: "Ringing the bell at an IPO, or getting acquired and writing a viral 'How we did it' thread."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "Burning cash on ads with low ROI",
        hiddenReason: "Doesn't understand marketing psychology, just throwing money at Facebook/Google.",
        manifestation: "Obsessively refreshing the Stripe dashboard and seeing no new MRR.",
        consequence: "Runway shrinking, panic setting in, pivoting the product unnecessarily."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["How to get first 100 customers", "Reduce CAC", "Organic growth strategies for SaaS"],
      hinglishPatterns: ["Marketing scale nahi ho rahi", "CAC bohot high hai bhai"],
      emotionalLanguage: ["Burnout", "Hustle", "Traction", "Pivot", "Runway"],
      googleSearch: ["B2B SaaS go to market strategy", "how to do SEO for a new startup"],
      youtubeSearch: ["YC startup school marketing", "how we grew from 0 to 1M ARR"],
      friendConversation: "We're launching on Product Hunt next week. If this doesn't work, we might have to raise a bridge round."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Skeptical of agencies. Wants tools that give them leverage (1 person doing the work of 5).",
      emotionalHesitation: "I don't have the time to learn a new complex tool.",
      researchBehavior: "Looks for tools mentioned by other successful founders on Twitter.",
      emotionalTriggers: ["Automation", "Cost-saving", "Unfair advantage", "Speed to execution"],
      purchaseBlockers: ["Complex onboarding", "Requires a dedicated team member to run"],
      urgencyTriggers: ["Competitor launching a new feature", "Runway dropping below 6 months"]
    },
    
    objectionStack: [
      {
        visibleObjection: "It's too expensive.",
        hiddenFear: "I can't justify this expense to my co-founder/investors if it doesn't yield immediate ROI.",
        counterResponse: "Frame the cost as a replacement for a full-time hire. 'For the cost of an intern, get the output of a senior marketer.'"
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Data, case studies from similar stage startups, clean UI, founder-led sales.",
      destroysTrust: "Enterprise sales bloat, hidden pricing, 'schedule a demo' for simple tools.",
      influencesDecisions: "Other founders in their network, tech influencers.",
      proofRequired: "Case studies detailing exact CAC reduction or traffic growth percentages."
    },
    
    contentHabits: {
      platformBehavior: "Lives on Twitter/X, reads Hacker News, consumes high-signal newsletters.",
      formatsTrusted: "Deep-dive Twitter threads, transparent 'building in public' updates, tactical guides.",
      activeConsumptionTiming: "Early morning over coffee, or late night when the team is asleep.",
      emotionalEngagement: "Resonates with the struggle of building and raw honesty."
    },
    
    transformationDesire: {
      beforeState: "Stressed, bottlenecked, unknown, racing against the clock.",
      afterState: "Automated, scaling, recognized industry leader, cash-flow positive.",
      emotionalGoal: "To feel like a winner, to achieve product-market fit, and to breathe easily."
    }
  },
  {
    id: "content-creator",
    label: "Content Creator",
    domains: ["content", "marketing", "social media", "youtube", "digital", "ai"],
    
    characterSnapshot: {
      name: "Neha",
      age: 26,
      region: "Global",
      identityHeadline: "The burnt-out creative",
      definingQuote: "\"I love making content, but the algorithm is treating me like a machine.\""
    },
    
    lifeSituation: {
      education: "Self-taught, driven by passion",
      income: "Inconsistent. One month is great (sponsorship), next month is dry.",
      familyPressure: "Parents asking when she will get a 'real job'.",
      financialCondition: "Anxious about the feast-or-famine nature of creator income.",
      influenceSystem: "MrBeast, top niche creators, algorithm changes.",
      dependencyLevel: "Entirely dependent on platform algorithms for livelihood.",
      livingEnvironment: "Aesthetically pleasing room setup that doubles as a studio."
    },
    
    psychologyLayer: {
      identityBelief: "I am an artist, but I have to play the algorithm game.",
      hiddenInsecurity: "What if I plateau and never break 100k subscribers? Am I becoming irrelevant?",
      emotionalFrustration: "Spending 20 hours on a video that gets 500 views, while a low-effort short gets 1M.",
      fearOfFailure: "Burning out, losing passion, and having to quit the creator economy.",
      emotionalMotivation: "To build a loyal community that loves *them*, not just the niche.",
      selfWorthIssues: "Tying their self-worth directly to view counts and likes.",
      successVisualization: "Getting recognized in public, hitting the 1M plaque, launching their own product line."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "Algorithm changes killing reach",
        hiddenReason: "Feels a lack of control over their own destiny; they are at the mercy of platforms.",
        manifestation: "Obsessively checking YouTube Studio analytics every 10 minutes after posting.",
        consequence: "Emotional rollercoaster, leading to creative block and burnout."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["Algorithm is dead", "Shadowbanned", "How to increase retention rate", "Sponsorship rates"],
      hinglishPatterns: ["Views down chal rahe hain", "Reach dead ho gayi"],
      emotionalLanguage: ["Burnout", "Exhausted", "Plateau", "Authentic"],
      googleSearch: ["how to monetize a small audience", "best AI tools for video editing"],
      youtubeSearch: ["why your channel is not growing", "how I make money as a small creator"],
      friendConversation: "I'm so tired of the content treadmill. I need to figure out how to sell a product so I don't rely on AdSense."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Needs to see that the tool/course was built *by* a creator *for* creators.",
      emotionalHesitation: "Will this make my content feel fake/robotic?",
      researchBehavior: "Watches review videos from other creators before buying.",
      emotionalTriggers: ["Save time", "Beat the algorithm", "Monetize your audience", "Creative freedom"],
      purchaseBlockers: ["Subscription fatigue", "Steep learning curves"],
      urgencyTriggers: ["A sudden drop in views", "Feeling overwhelmed by editing backlog"]
    },
    
    objectionStack: [
      {
        visibleObjection: "I want my content to be 100% authentic, I don't want to use AI.",
        hiddenFear: "If I use AI or templates, my audience will know and they will turn on me.",
        counterResponse: "Position the tool as an assistant that handles the boring stuff (SEO, titles) so they can focus purely on the creative art."
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Aesthetic branding, social proof from top creators, focus on community.",
      destroysTrust: "Corporate speak, outdated advice (e.g., 'just use 30 hashtags').",
      influencesDecisions: "Creator Discord communities, viral Twitter threads from editors.",
      proofRequired: "Screenshots of analytics (hockey stick growth charts)."
    },
    
    contentHabits: {
      platformBehavior: "Chronically online. Consumes content to analyze *how* it was made, not just for entertainment.",
      formatsTrusted: "Behind-the-scenes content, breakdown of viral hooks, raw honest updates.",
      activeConsumptionTiming: "All the time, blending work and leisure.",
      emotionalEngagement: "Vents on Twitter/Threads, shares polished work on Instagram/YouTube."
    },
    
    transformationDesire: {
      beforeState: "A slave to the algorithm, burned out, inconsistent income.",
      afterState: "A business owner, financially secure, creatively fulfilled, respected brand.",
      emotionalGoal: "To reclaim their time and be valued for their unique voice."
    }
  },
  {
    id: "saas-product-manager",
    label: "SaaS Product Manager",
    domains: ["saas", "technology", "product", "ai", "business"],
    
    characterSnapshot: {
      name: "Rohan",
      age: 34,
      region: "Global",
      identityHeadline: "The strategic orchestrator",
      definingQuote: "\"Everyone wants everything yesterday, and nobody agrees on what the priority is.\""
    },
    
    lifeSituation: {
      education: "MBA or Engineering background",
      income: "High earner, comfortable.",
      familyPressure: "Low, but high pressure to maintain standard of living.",
      financialCondition: "Stable, but heavily invested in company equity.",
      influenceSystem: "Lenny's Newsletter, Marty Cagan, Silicon Valley trends.",
      dependencyLevel: "Responsible for bridging engineering, sales, and the CEO.",
      livingEnvironment: "Upscale apartment, working hybrid."
    },
    
    psychologyLayer: {
      identityBelief: "I am the CEO of the product, but without the actual authority.",
      hiddenInsecurity: "I'm making decisions based on intuition because our data is a mess.",
      emotionalFrustration: "Sales team promising features to clients that aren't on the roadmap.",
      fearOfFailure: "Launching a massive feature that took 6 months to build and nobody uses it.",
      emotionalMotivation: "To launch products that move the needle and become a VP of Product.",
      selfWorthIssues: "Feeling like a 'glorified project manager' instead of a strategic leader.",
      successVisualization: "Presenting a massive spike in user retention at the all-hands meeting."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "Feature requests overwhelming the roadmap",
        hiddenReason: "Lack of a clear, defensible product strategy to say 'no' to stakeholders.",
        manifestation: "Endless meetings debating priorities, moving Jira tickets around.",
        consequence: "Feature bloat, slow engineering velocity, and burnout."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["How to prioritize feature requests", "Reduce churn rate", "Product-led growth strategies"],
      hinglishPatterns: ["Stakeholders manage nahi ho rahe", "Engineering bandwidth nahi hai"],
      emotionalLanguage: ["Alignment", "Bottleneck", "Impact", "Prioritization", "Data-driven"],
      googleSearch: ["best product management frameworks", "how to align sales and product teams"],
      youtubeSearch: ["Lenny Rachitsky podcast", "how to build a product roadmap"],
      friendConversation: "The CEO just read a blog post about AI and now wants us to drop everything and build an LLM integration."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Needs frameworks, best practices, and integration capabilities.",
      emotionalHesitation: "Will my engineering team actually adopt this tool or hate me for buying it?",
      researchBehavior: "Reads deep-dive articles, requests sandboxes, talks to peers in Slack communities.",
      emotionalTriggers: ["Alignment", "Clarity", "Velocity", "Data-backed decisions"],
      purchaseBlockers: ["Security reviews", "Lack of integrations with Jira/Slack"],
      urgencyTriggers: ["A failed product launch", "Mandate from the CEO to 'move faster'"]
    },
    
    objectionStack: [
      {
        visibleObjection: "We already have Jira, why do we need another tool?",
        hiddenFear: "I don't want to add another tool to our tech stack that becomes a ghost town in 2 months.",
        counterResponse: "Show how it sits *on top* of Jira to provide strategic visibility that Jira lacks, making their job easier, not harder."
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Clean UI, robust API, SOC2 compliance, thought leadership content.",
      destroysTrust: "Bugs in the marketing site, buzzwords without substance.",
      influencesDecisions: "Engineering leads, VP of Product, industry newsletters.",
      proofRequired: "Case studies from recognizable SaaS brands."
    },
    
    contentHabits: {
      platformBehavior: "Active on LinkedIn, reads Substack newsletters religiously, members of private PM Slack groups.",
      formatsTrusted: "Frameworks, templates, deep-dive interviews with CPO's.",
      activeConsumptionTiming: "Morning reading time, or dedicated learning blocks.",
      emotionalEngagement: "Loves elegant solutions to complex organizational problems."
    },
    
    transformationDesire: {
      beforeState: "Reactive, overwhelmed, a 'yes-man' to sales, relying on gut feeling.",
      afterState: "Proactive, strategic, respected visionary, relying on hard data.",
      emotionalGoal: "To be recognized as the mastermind behind the company's growth."
    }
  },
  {
    id: "e-commerce-founder",
    label: "E-Commerce / D2C Founder",
    domains: ["ecommerce", "d2c", "dropshipping", "shopify", "retail"],
    
    characterSnapshot: {
      name: "Sarah",
      age: 32,
      region: "Urban/Suburban",
      identityHeadline: "The overwhelmed brand builder",
      definingQuote: "\"Sales are up but my margins are disappearing. I'm running a charity for Mark Zuckerberg with these ad costs.\""
    },
    
    lifeSituation: {
      education: "Self-taught marketer, maybe a business degree",
      income: "High top-line revenue, but surprisingly low personal take-home pay",
      familyPressure: "Trying to prove this is a 'real business' to family and friends",
      financialCondition: "Stressed about cash flow, inventory holding costs, and ad spend",
      influenceSystem: "DTC Twitter, Shopify ecosystem, e-com podcasts",
      dependencyLevel: "Highly dependent on platform algorithms (Meta/Google/TikTok)",
      livingEnvironment: "Home office filled with product samples and shipping boxes"
    },
    
    psychologyLayer: {
      identityBelief: "I have a great product, but the marketing game is rigged against small brands.",
      hiddenInsecurity: "What if one bad month of sales wipes out my entire business?",
      emotionalFrustration: "Spending hours making TikToks that get 200 views while watching dropshippers make millions.",
      fearOfFailure: "Having to liquidate inventory at a loss and go back to a 9-to-5 job.",
      emotionalMotivation: "To build a brand that people actually love and to achieve true financial freedom.",
      selfWorthIssues: "Tying self-worth directly to the daily Shopify sales dashboard.",
      successVisualization: "Selling out of a new product line organically in 24 hours without spending a dime on ads."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "Customer Acquisition Cost (CAC) is too high",
        hiddenReason: "Lack of brand differentiation; competing purely on price and algorithmic luck.",
        manifestation: "Constantly tweaking ad creatives and panicking when the ROAS drops below 2.",
        consequence: "Burning through cash reserves and halting business growth."
      },
      {
        visibleSymptom: "High cart abandonment rate",
        hiddenReason: "Customers don't trust the brand yet or shipping costs are a nasty surprise.",
        manifestation: "Installing 15 different Shopify apps to try and 'hack' conversions.",
        consequence: "A slow, clunky website that converts even worse."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["How to lower Facebook ad costs", "Best Shopify apps for conversion", "Is email marketing dead?"],
      hinglishPatterns: ["ROAS gir raha hai", "Inventory phasi hui hai", "Meta ads chalana mushkil ho gaya hai"],
      emotionalLanguage: ["Bleeding money", "Overwhelmed", "Hacking", "Scaling", "Profitability"],
      googleSearch: ["how to increase shopify conversion rate", "klaviyo email flow templates"],
      youtubeSearch: ["how to scale facebook ads", "tiktok shop tutorial"],
      friendConversation: "I made $50k last month in revenue, but after ads, shipping, and COGS, I barely made minimum wage."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Needs to see ROI projections and case studies from similar-sized brands.",
      emotionalHesitation: "If I spend $100/mo on this software, how many extra products do I need to sell to break even?",
      researchBehavior: "Asks for recommendations in private e-commerce Facebook/Discord groups.",
      emotionalTriggers: ["Automated revenue", "Cutting out the middleman", "Beating the algorithm"],
      purchaseBlockers: ["Complicated integration with Shopify", "Long onboarding processes"],
      urgencyTriggers: ["Q4/Black Friday approaching", "A sudden spike in ad costs"]
    },
    
    objectionStack: [
      {
        visibleObjection: "I can't afford another monthly subscription.",
        hiddenFear: "I have subscription fatigue and 90% of the tools I pay for don't actually generate revenue.",
        counterResponse: "Offer a performance-based guarantee or a free trial that proves ROI before they pay a dime."
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Data transparency, showing exact ROAS improvements, integration directly with Shopify/Klaviyo.",
      destroysTrust: "Gurus driving Lamborghinis, promises of 'overnight success', hidden fees.",
      influencesDecisions: "Other founders in their mastermind group, prominent DTC Twitter voices.",
      proofRequired: "Verified screenshots of Shopify dashboards showing hockey-stick growth."
    },
    
    contentHabits: {
      platformBehavior: "Constantly doom-scrolling DTC Twitter for tactics, watches YouTube while packing orders.",
      formatsTrusted: "Tear-downs of successful brands, actionable playbooks, raw behind-the-scenes.",
      activeConsumptionTiming: "Evenings or during the mid-day slump when sales are slow.",
      emotionalEngagement: "Loves 'David vs. Goliath' stories of small brands beating massive corporations."
    },
    
    transformationDesire: {
      beforeState: "Stressed, glued to the ads manager, feeling like a hamster on a wheel.",
      afterState: "Confident, profitable, leading a real team, owning an asset of value.",
      emotionalGoal: "To transition from a stressed 'operator' to a wealthy 'owner'."
    }
  },
  {
    id: "freelance-consultant",
    label: "Freelance Consultant",
    domains: ["freelance", "consulting", "agency", "solopreneur", "services"],
    
    characterSnapshot: {
      name: "David",
      age: 28,
      region: "Digital Nomad / Remote",
      identityHeadline: "The feast-or-famine solopreneur",
      definingQuote: "\"I started working for myself for freedom, but now I work 24/7 for 5 different bad bosses.\""
    },
    
    lifeSituation: {
      education: "Self-taught skills or escaped corporate professional",
      income: "Fluctuates wildly; $10k one month, $1k the next",
      familyPressure: "Parents asking when they will get a 'real job' with benefits",
      financialCondition: "Anxious about taxes, healthcare, and the lack of a steady paycheck",
      influenceSystem: "Productivity gurus, successful agency owners, LinkedIn 'solopreneurs'",
      dependencyLevel: "Highly dependent on Upwork/Fiverr or 1-2 whale clients",
      livingEnvironment: "Coffee shops, co-working spaces, or a small home office"
    },
    
    psychologyLayer: {
      identityBelief: "I am highly skilled, but I don't know how to sell myself without feeling sleazy.",
      hiddenInsecurity: "What if the AI revolution makes my skill completely obsolete in 2 years?",
      emotionalFrustration: "Clients wanting enterprise-level work for Fiverr-level budgets.",
      fearOfFailure: "Running out of cash and having to humbly ask for their old corporate job back.",
      emotionalMotivation: "To have total control over their time and work from anywhere in the world.",
      selfWorthIssues: "Undercharging because they are afraid the client will say 'no' if they raise prices.",
      successVisualization: "Waking up to an inbox full of high-ticket inbound leads who don't negotiate on price."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "Inconsistent lead generation",
        hiddenReason: "Relying entirely on referrals and word-of-mouth rather than a predictable marketing engine.",
        manifestation: "Panicking when a project ends and sending desperate DMs to old contacts.",
        consequence: "The 'feast or famine' cycle that causes chronic stress."
      },
      {
        visibleSymptom: "Scope creep",
        hiddenReason: "Lack of confidence to enforce boundaries or clear contracts with clients.",
        manifestation: "Doing 'just one more quick edit' 15 times for free.",
        consequence: "Working below minimum wage when calculating actual hours spent."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["How to get high paying clients", "Should I put pricing on my website", "How to write a proposal"],
      hinglishPatterns: ["Bhai client paise nahi de raha", "Freelance market dead ho gaya hai", "Upwork pe competition bohot hai"],
      emotionalLanguage: ["Burnout", "Hustle", "Boundaries", "Retainer", "Ghosted"],
      googleSearch: ["how to charge a retainer fee", "best cold email templates for freelancers"],
      youtubeSearch: ["how to scale from freelancer to agency", "pricing strategies for services"],
      friendConversation: "I'm so busy I haven't slept, but I still don't know how I'm paying rent next month."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Needs proven templates, scripts, and clear step-by-step systems.",
      emotionalHesitation: "If I spend time learning this system, I'm not doing billable client work.",
      researchBehavior: "Follows specific successful freelancers on Twitter/LinkedIn and buys their playbooks.",
      emotionalTriggers: ["Predictability", "High-Ticket", "Productized services", "Reclaiming time"],
      purchaseBlockers: ["Fear of sounding like a scammy marketer", "Lack of budget"],
      urgencyTriggers: ["Losing a major client", "A sudden realization of burnout"]
    },
    
    objectionStack: [
      {
        visibleObjection: "I don't have an audience, so this won't work for me.",
        hiddenFear: "I'm afraid of putting myself out there and being judged by my peers.",
        counterResponse: "Focus on outbound strategies that don't require an audience, or show how to build authority quietly."
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Sharing exact email scripts, pricing calculators, and admitting past failures.",
      destroysTrust: "Hustle-culture toxicity, dismissing the difficulty of client management.",
      influencesDecisions: "Successful peers, niche community leaders (e.g., in design, writing, coding).",
      proofRequired: "Real case studies of freelancers who doubled their rates using the system."
    },
    
    contentHabits: {
      platformBehavior: "Hyper-active on LinkedIn (trying to build personal brand) and Twitter.",
      formatsTrusted: "Notion templates, swipe files, dense Twitter threads with exact systems.",
      activeConsumptionTiming: "Procrastinating before starting a difficult client task.",
      emotionalEngagement: "Validating content that says 'you should charge more' or calls out bad client behavior."
    },
    
    transformationDesire: {
      beforeState: "Underpaid, overworked, anxious, treated like an 'order-taker'.",
      afterState: "Highly paid, in-demand, confident, treated like an 'expert partner'.",
      emotionalGoal: "To achieve total autonomy and financial security without burning out."
    }
  },
  {
    id: "online-fitness-coach",
    label: "Online Fitness Coach",
    domains: ["fitness", "coaching", "health", "nutrition", "wellness"],
    
    characterSnapshot: {
      name: "Marcus",
      age: 26,
      region: "Global/Online",
      identityHeadline: "The passionate trainer drowning in noise",
      definingQuote: "\"I know how to get people in the best shape of their lives, but I have no idea how to get them to pay me online.\""
    },
    
    lifeSituation: {
      education: "Personal training certifications, deep knowledge of biomechanics/nutrition",
      income: "Transitioning from in-person (stable but capped) to online (unstable but scalable)",
      familyPressure: "Told they should open a real gym instead of 'playing on Instagram'",
      financialCondition: "Hustling to pay for software, coaching programs, and lead gen",
      influenceSystem: "Fitness business coaches, Instagram fitness models, supplement brands",
      dependencyLevel: "Highly dependent on Instagram/TikTok algorithm for leads",
      livingEnvironment: "Lives in gym clothes, works from the gym café or a home desk"
    },
    
    psychologyLayer: {
      identityBelief: "My methods are scientifically superior, but fitness influencers with bad form are making all the money.",
      hiddenInsecurity: "I feel like a fraud when I try to 'sell' people in the DMs.",
      emotionalFrustration: "Posting 3 Reels a day and getting likes from other trainers, but zero paying clients.",
      fearOfFailure: "Having to go back to doing 5 AM in-person sessions at a commercial gym forever.",
      emotionalMotivation: "To impact thousands of lives globally while building a lucrative, location-independent business.",
      selfWorthIssues: "Tying their value to their own physique and their follower count.",
      successVisualization: "A fully automated onboarding system where clients pay $1500 upfront without a sales call."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "Lots of followers, no clients",
        hiddenReason: "Content is educational but not persuasive; they attract fans, not buyers.",
        manifestation: "Spending hours making complex infographics that don't generate leads.",
        consequence: "High effort, zero revenue, leading to content burnout."
      },
      {
        visibleSymptom: "Clients dropping off after 1 month",
        hiddenReason: "Lack of a structured coaching system; relying entirely on Excel sheets and WhatsApp.",
        manifestation: "Answering client texts at 11 PM on a Sunday.",
        consequence: "Unable to scale beyond 15 clients because fulfilling the service takes too much time."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["How to get online fitness clients", "Best app for online personal trainers", "How to transition from in-person to online"],
      hinglishPatterns: ["Online coaching kaise start kare", "Leads nahi aa rahi Instagram se", "High ticket client kaise close kare"],
      emotionalLanguage: ["Impact", "Scale", "Grind", "Algorithms", "High-ticket"],
      googleSearch: ["trainerize vs truecoach", "how to run facebook ads for fitness coaching"],
      youtubeSearch: ["how to script a fitness sales call", "instagram algorithm updates for trainers"],
      friendConversation: "I literally fixed this guy's back pain in a week, but he complained that $200 a month was too expensive."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Needs to see a system that automates the boring stuff so they can focus on coaching.",
      emotionalHesitation: "I've already bought three 'business mentorships' that were just basic marketing fluff.",
      researchBehavior: "Watches webinars from business coaches, compares software features obsessively.",
      emotionalTriggers: ["Automated fulfillment", "High-ticket closing", "Standing out in a saturated market"],
      purchaseBlockers: ["Tech overwhelm", "Skepticism of 'make money online' gurus"],
      urgencyTriggers: ["Getting physically exhausted from in-person training", "A competitor launching a successful app"]
    },
    
    objectionStack: [
      {
        visibleObjection: "I'm not a tech person, I can't set all this up.",
        hiddenFear: "If I break the software, my clients will think I'm unprofessional.",
        counterResponse: "Offer 'done-for-you' setup, one-click templates, and emphasize that it replaces complex spreadsheets."
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Showing empathy for the in-person grind, providing templates that actually work for fitness, sleek UI.",
      destroysTrust: "Overly corporate language, ignoring the nuance of coaching psychology.",
      influencesDecisions: "Successful fitness entrepreneurs (e.g., Alex Hormozi), peer recommendations.",
      proofRequired: "Screenshots of Stripe accounts from trainers who used the system."
    },
    
    contentHabits: {
      platformBehavior: "Lives on Instagram (Reels/Stories) and consumes long-form podcasts during workouts.",
      formatsTrusted: "Podcast interviews, actionable carousels, video breakdowns of sales calls.",
      activeConsumptionTiming: "Between client sessions, during cardio, or late evening.",
      emotionalEngagement: "Motivated by messages of breaking out of the 'time-for-money' trap."
    },
    
    transformationDesire: {
      beforeState: "Exhausted, underpaid, trapped in a gym, competing on price.",
      afterState: "Energized, highly paid, location-independent, recognized authority.",
      emotionalGoal: "To have a waiting list of clients who respect their time and expertise."
    }
  },
  {
    id: "corporate-hr-leader",
    label: "Corporate HR / Talent Acquisition",
    domains: ["hr", "recruitment", "talent acquisition", "b2b saas", "hiring"],
    
    characterSnapshot: {
      name: "Priya",
      age: 38,
      region: "Metro City / Corporate Hub",
      identityHeadline: "The burnt-out culture guardian",
      definingQuote: "\"Management wants me to hire top 1% talent, but they only give me a bottom 50% budget and a broken ATS.\""
    },
    
    lifeSituation: {
      education: "MBA in HR or strong corporate background",
      income: "Stable corporate salary, but feeling under-compensated for the stress",
      familyPressure: "Balancing a demanding corporate job with personal/family life",
      financialCondition: "Managing million-dollar hiring budgets but scrutinizing every software expense",
      influenceSystem: "SHRM, LinkedIn thought leaders, internal C-suite demands",
      dependencyLevel: "Highly dependent on hiring managers making decisions and candidates not ghosting",
      livingEnvironment: "Open-plan corporate office or back-to-back Zoom calls from a home office"
    },
    
    psychologyLayer: {
      identityBelief: "I am a strategic partner to the business, but management treats me like an admin.",
      hiddenInsecurity: "What if we can't fill these critical roles and it's blamed entirely on me?",
      emotionalFrustration: "Candidates ghosting after 3 rounds of interviews; hiring managers rejecting perfectly good candidates for vague reasons.",
      fearOfFailure: "A bad hire destroying company culture or a mass exodus of employees.",
      emotionalMotivation: "To build a thriving, healthy workplace culture and be seen as a strategic executive.",
      selfWorthIssues: "Feeling unappreciated because HR only gets noticed when things go wrong.",
      successVisualization: "Presenting a dashboard to the CEO showing time-to-hire halved and retention at an all-time high."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "High time-to-hire",
        hiddenReason: "Inefficient screening processes and misaligned expectations with hiring managers.",
        manifestation: "Drowning in unqualified resumes and scheduling endless follow-up interviews.",
        consequence: "Losing the best candidates to faster competitors."
      },
      {
        visibleSymptom: "Employee turnover",
        hiddenReason: "Poor onboarding and toxic team dynamics that HR can't easily fix.",
        manifestation: "Conducting depressing exit interviews on a weekly basis.",
        consequence: "Constantly having to backfill roles, preventing any strategic HR work."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["How to reduce time to hire", "Employee engagement strategies", "Best ATS for mid-size companies"],
      hinglishPatterns: ["Candidates ghost kar rahe hain", "Management budget nahi de rahi", "Notice period ka issue hai"],
      emotionalLanguage: ["Retention", "Culture", "Alignment", "Pipeline", "Burnout"],
      googleSearch: ["innovative employee retention strategies", "how to push back on unrealistic hiring managers"],
      youtubeSearch: ["future of work trends", "diversity and inclusion training strategies"],
      friendConversation: "I spent three weeks wooing this senior dev, got the offer approved, and he leveraged it to get a raise at his current job."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Needs highly professional, data-backed ROI studies to present to the CFO.",
      emotionalHesitation: "Will my team actually use this software, or will it be another tool I have to force them to log into?",
      researchBehavior: "Attends HR webinars, reads whitepapers, requests enterprise demos.",
      emotionalTriggers: ["Compliance", "Efficiency", "Employer Branding", "Data-driven insights"],
      purchaseBlockers: ["IT security approval", "Budget freezes", "Lack of integration with Workday/BambooHR"],
      urgencyTriggers: ["A sudden hiring surge", "A compliance audit", "Losing a key executive"]
    },
    
    objectionStack: [
      {
        visibleObjection: "We need to get budget approval from the CFO.",
        hiddenFear: "I don't know how to prove the financial ROI of an HR tool to a numbers guy.",
        counterResponse: "Provide a 'CFO Pitch Deck' that translates HR metrics (time-to-hire, retention) into hard dollar savings."
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Enterprise-grade security, seamless ATS integrations, professional and empathetic tone.",
      destroysTrust: "Aggressive sales tactics, lack of compliance standards, clunky UI.",
      influencesDecisions: "G2 Crowd reviews, peer networks, Gartner reports.",
      proofRequired: "Case studies from similar-sized enterprises showing measurable efficiency gains."
    },
    
    contentHabits: {
      platformBehavior: "Highly active on LinkedIn, reads Harvard Business Review and specialized HR blogs.",
      formatsTrusted: "Whitepapers, industry reports, webinars, detailed case studies.",
      activeConsumptionTiming: "During working hours as part of 'research' or on the commute.",
      emotionalEngagement: "Appreciates content that validates the difficulty of HR and offers strategic frameworks."
    },
    
    transformationDesire: {
      beforeState: "Overwhelmed admin, blamed for hiring failures, bogged down in paperwork.",
      afterState: "Strategic partner, respected by the C-suite, driving company growth.",
      emotionalGoal: "To earn a 'seat at the table' and be recognized as vital to the company's success."
    }
  },
  {
    id: "real-estate-agent",
    label: "Hustling Real Estate Agent",
    domains: ["real estate", "realtor", "property", "lead generation", "sales"],
    
    characterSnapshot: {
      name: "Michael",
      age: 45,
      region: "Suburban / Growing City",
      identityHeadline: "The high-energy market survivor",
      definingQuote: "\"I don't sell houses, I sell trust. But it's hard to build trust when Zillow is stealing my leads.\""
    },
    
    lifeSituation: {
      education: "Real estate license, street smarts, strong local network",
      income: "Commission-based; can make $30k in a month and $0 for the next three",
      familyPressure: "Needs to provide stability despite a highly volatile income stream",
      financialCondition: "Spends heavily on marketing (Zillow leads, mailers, Facebook ads) to stay relevant",
      influenceSystem: "Top-producing brokers, real estate coaching seminars (e.g., Tom Ferry), local market shifts",
      dependencyLevel: "Highly dependent on interest rates, local economy, and their sphere of influence",
      livingEnvironment: "Lives in their car, constantly driving between showings and listing appointments"
    },
    
    psychologyLayer: {
      identityBelief: "I am the local market expert, but technology is trying to cut me out of the deal.",
      hiddenInsecurity: "What if the market crashes and I have to go back to a salaried job?",
      emotionalFrustration: "Spending weekends showing 20 houses to buyers who end up 'waiting for the market to cool.'",
      fearOfFailure: "Losing a massive listing to a discount broker who charges 1%.",
      emotionalMotivation: "To become the undisputed top-producing agent in their zip code and build generational wealth.",
      selfWorthIssues: "Comparing their GCI (Gross Commission Income) to the flashy agents on Instagram.",
      successVisualization: "Putting a 'SOLD' rider on a luxury listing after a multi-offer bidding war."
    },
    
    painArchitecture: [
      {
        visibleSymptom: "Paying for low-quality online leads",
        hiddenReason: "Lack of a strong organic brand; reliant on buying leads from massive portals.",
        manifestation: "Calling 100 internet leads and getting hung up on 99 times.",
        consequence: "High marketing expenses eroding their actual commission take-home."
      },
      {
        visibleSymptom: "Fluctuating income",
        hiddenReason: "Poor pipeline management; stops prospecting when busy with active clients.",
        manifestation: "The 'real estate rollercoaster' of having 3 closings in May and none in June.",
        consequence: "Financial anxiety and inability to plan long-term."
      }
    ],
    
    voiceOfCustomer: {
      exactPhrases: ["How to generate listing leads", "Zillow flex alternatives", "Real estate script for cold calling"],
      hinglishPatterns: ["Market bohot slow hai abhi", "Client budget badha nahi raha", "Exclusive mandate nahi mil raha"],
      emotionalLanguage: ["Hustle", "Pipeline", "GCI", "Tire-kickers", "Closing"],
      googleSearch: ["best CRM for real estate agents", "how to win a listing presentation"],
      youtubeSearch: ["Tom Ferry live cold calling", "facebook ads for realtors 2024"],
      friendConversation: "I worked with them for six months, showed them 40 houses, and they bought a new build without telling me."
    },
    
    buyingBehavior: {
      trustBuildingJourney: "Needs to see exactly how a tool will save time or generate a specific number of leads.",
      emotionalHesitation: "I've bought 'magic lead generation' systems before and they were all trash.",
      researchBehavior: "Asks other agents in their brokerage what CRM or tools they use.",
      emotionalTriggers: ["More listings", "Automating follow-up", "Beating discount brokers", "Looking professional"],
      purchaseBlockers: ["Complex technology (they want it to 'just work')", "High upfront costs"],
      urgencyTriggers: ["A dry pipeline", "Seeing a rival agent get a massive listing"]
    },
    
    objectionStack: [
      {
        visibleObjection: "I'm not good with tech, I prefer relationship building.",
        hiddenFear: "I will spend hours trying to learn this software and end up feeling stupid.",
        counterResponse: "Show how the tech actually *enhances* relationship building by automating the tasks they hate, giving them more face-time with clients."
      }
    ],
    
    trustArchitecture: {
      buildsTrust: "Tools that integrate with their existing MLS, mobile-friendly apps, direct phone support.",
      destroysTrust: "Over-complicated dashboards, promises of 'guaranteed' leads.",
      influencesDecisions: "Brokerage managers, top producers in their office, real estate coaches.",
      proofRequired: "Testimonials from other agents saying 'this got me 3 extra listings this year'."
    },
    
    contentHabits: {
      platformBehavior: "Very active on Facebook and Instagram, listens to podcasts while driving.",
      formatsTrusted: "Quick video tips, scripts they can copy/paste, market update infographics.",
      activeConsumptionTiming: "In the car between showings, or early morning before prospecting.",
      emotionalEngagement: "Loves content about 'out-hustling' the competition and defending the value of a realtor."
    },
    
    transformationDesire: {
      beforeState: "Anxious hustler, chasing bad internet leads, working weekends.",
      afterState: "Respected local authority, running a referral-only business, having weekends off.",
      emotionalGoal: "To achieve the luxury lifestyle they help their clients buy."
    }
  }
];

module.exports = PERSONA_TEMPLATES;
