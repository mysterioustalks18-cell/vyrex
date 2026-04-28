/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  Search, 
  Mail,
  Youtube,
  BarChart3, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  Zap,
  Info,
  Download,
  LogIn,
  User as UserIcon,
  CircleDashed,
  Terminal,
  Globe,
  TrendingUp,
  DollarSign,
  Eye,
  ShieldCheck,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Target,
  AlertTriangle,
  FileText,
  Rocket,
  MessageCircle,
  Trash2,
  Package,
  Menu,
  X,
  Settings as SettingsIcon,
  LogOut,
  Moon,
  Sun,
  LayoutGrid,
  Shield,
  Layers,
  History,
  Monitor,
  Calendar,
  CreditCard,
  Flame,
  Crown,
  FolderPlus,
  LineChart,
  FolderHeart,
  Share2,
  Lock,
  ArrowRight,
  Plus
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { 
  Mode, 
  Message, 
  ViralStrategistResult, 
  HookAnalyzerResult, 
  CompetitorSpyResult, 
  MonetizationMapResult, 
  TitleForgeResult,
  ChannelLaunchpadResult,
  AssetForgeResult,
  VyrexSettings,
  AuthState,
  NodeVisibility,
  ScoreHistoryItem,
  SwipeFileItem
} from './types';
import { ChannelLaunchpadRenderer } from './components/ChannelLaunchpadRenderer';
import { IntelChatRenderer } from './components/IntelChatRenderer';
import { AssetForgeRenderer } from './components/AssetForgeRenderer';
import { TitleForgeRenderer } from './components/TitleForgeRenderer';
import { ViralStrategistRenderer } from './components/ViralStrategistRenderer';
import { HookAnalyzerRenderer } from './components/HookAnalyzerRenderer';
import { CompetitorSpyRenderer } from './components/CompetitorSpyRenderer';
import { MonetizationMapRenderer } from './components/MonetizationMapRenderer';
import { db, auth } from './lib/firebase';
import { onAuthChange, getUserData, signOut as authSignOut, deductCredits } from './lib/auth';
import AuthPage from './components/AuthPage';
import { Tooltip } from './components/Tooltip';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { ChatInput } from './components/ChatInput';
import { CollapsibleInput } from './components/CollapsibleInput';
import { executeVyrexNode } from './services/geminiService';
import { handleFirestoreError } from './lib/firestoreUtils';

const HexIcon = (props: any) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.66 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.34 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TitleForgeIcon = (props: any) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v7" />
    <path d="M8 3h8" />
    <path d="m13 10-3 5h6l-3 6" />
  </svg>
);

// --- CONSTANTS ---

const CREDIT_COSTS: Record<string, number> = {
  launchpad: 8,
  intelchat: 1,
  viral: 3,
  hook: 2,
  competitor: 4,
  monetization: 4,
  title_forge: 3,
  asset_forge: 6,
  settings: 0,
  pricing: 0
};

// --- HELPER COMPONENTS ---

const Typewriter = ({ text, speed = 18, delay = 0 }: { text: string; speed?: number; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let timeout: any;
    let i = 0;
    
    setDisplayedText('');
    
    const tick = () => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        timeout = setTimeout(tick, speed);
      }
    };
    
    const startTimeout = setTimeout(tick, delay);
    return () => {
      clearTimeout(timeout);
      clearTimeout(startTimeout);
    };
  }, [text, speed, delay]);

  return <span>{displayedText}</span>;
};

const AnimatedNumber = ({ value, duration = 1200 }: { value: number | string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const target = typeof value === 'string' ? parseFloat(value) : value;

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{(count || 0).toFixed(1)}</span>;
};

const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy}
      className="p-1.5 rounded-md border border-vy-border hover:border-vy-accent/50 hover:bg-vy-accent/5 text-vy-muted hover:text-vy-accent transition-all bg-vy-surface/50"
    >
      {copied ? <Check className="w-3 h-3 text-vy-green" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};

const ScoreRing = ({ score, label }: { score: number; label: string }) => {
  const [offset, setOffset] = useState(326.7);
  const size = 120;
  const radius = 52;
  const circumference = 2 * Math.PI * radius; // 326.7
  const renderKey = React.useMemo(() => Date.now(), [score]);
  
  const getColor = (s: number) => {
    if (s < 7.5) return '#f59e0b';
    if (s < 8.5) return '#00c8ff';
    return '#22d3a0';
  };

  const color = getColor(score);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const targetOffset = circumference * (1 - score / 10);
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / 1400, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setOffset(circumference - (circumference - targetOffset) * easeProgress);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [score, circumference]);

  return (
    <div className="flex flex-col items-center gap-1 group w-[120px] h-[120px]" key={renderKey}>
      <div className="relative w-full h-full">
        <svg width="120" height="120" viewBox="0 0 120 120" className="rotate-[-90deg]">
          <circle 
            cx="60" cy="60" r="52" 
            fill="transparent" stroke="#ffffff0f" strokeWidth="6"
          />
          <circle 
            cx="60" cy="60" r="52" 
            fill="transparent" 
            stroke={color} 
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display font-black text-[28px]" style={{ color }}>
          <AnimatedNumber value={score} />
        </div>
      </div>
      <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#4a6070] mt-1">{label}</span>
    </div>
  );
};

const LoadingOverlay = ({ status }: { status?: string }) => {
  const [progress, setProgress] = useState(0);
  const messages = [
    "SCANNING NEURAL LANDSCAPE...",
    "CONSTRUCTING SCRIPT CORE...",
    "FORGING VISUAL SEQUENCE...",
    "CALIBRATING AUDIO TONE...",
    "FINALIZING PRODUCTION PACK..."
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) return prev + Math.random() * 5;
        return prev;
      });
    }, 200);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div 
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#03050a]/95 backdrop-blur-2xl"
    >
       <div className="relative mb-12">
          <div className="w-32 h-32 border-2 border-white/5 rounded-full animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 bg-gradient-to-br from-vy-accent to-vy-accent2 rounded-3xl animate-pulse shadow-[0_0_50px_rgba(232,84,42,0.4)] rotate-45" />
          </div>
          <div className="absolute top-0 right-0">
             <Zap className="w-8 h-8 text-vy-accent fill-vy-accent animate-bounce" />
          </div>
       </div>

       <div className="text-center space-y-4">
          <h2 className="font-display font-black text-3xl text-white tracking-[0.2em] italic uppercase">
             {status || messages[msgIndex]}
          </h2>
          <p className="font-mono text-[10px] text-vy-muted tracking-[0.5em] uppercase">SYSTEM NODE :: GEMINI PRO 2.0 :: PROTOCOL ACTIVE</p>
       </div>

       <div className="w-64 h-1 bg-white/5 rounded-full mt-12 overflow-hidden relative">
          <motion.div 
            className="h-full bg-vy-accent shadow-[0_0_20px_#e8542a]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
          />
       </div>

       <div className="absolute bottom-12 flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-vy-green animate-pulse" />
          <span className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">SECURE DATA STREAM ACTIVE</span>
       </div>
    </motion.div>
  );
};

// --- DATA ---

const WELCOME_DATA: Record<Mode, any> = {
  viral: {
    videoTitle: "You're Using AI Tools Wrong — Here's Why",
    viralScore: 8.9,
    hook: "You're using AI tools wrong — here's why your competitors are getting 10x more done.",
    miniScript: "Most creators think AI saves time. It doesn't. Not unless you use it in this specific sequence that 99% of people skip entirely. Here is the framework...\n\n### STEP 1: DECONSTRUCTION\nFirst, you don't start with a prompt. You start with a pattern. AI doesn't know your audience; you do.\n\n### STEP 2: THE SYNC\nYou sync the AI to your specific voice mapping. This is what we call 'Biological Prompting'.",
    thumbnailStrategy: {
      mainText: "STOP USING AI",
      emotion: "Shock + Curiosity",
      visualConcept: "Creator looking frustrated at screen, bold red X over AI logo, dark cinematic lighting",
      bgGradient: "from-vy-accent/20 to-black"
    },
    tags: ["ai tools", "youtube growth", "productivity", "creator tips"],
    uploadTiming: "Tuesday · 2PM–5PM IST",
    competitorGap: "No one in the AI productivity space is targeting creators who feel overwhelmed.",
    retentionGraph: [
      { second: 0, percentage: 100 },
      { second: 30, percentage: 82 },
      { second: 60, percentage: 74 },
      { second: 120, percentage: 68 },
      { second: 300, percentage: 55 }
    ],
    thumbnailABTest: {
      variantA: "STOP USING AI",
      variantB: "AI KILLED MY CHANNEL",
      logic: "Variant A targets efficiency, Variant B targets loss aversion. Testing shows B often wins in growth-heavy niches."
    }
  },
  hook: {
    ctrScore: 8.2,
    psychologyBreakdown: {
      primaryTrigger: "Negative Frame",
      curiosityGap: 9,
      urgency: 7,
      specificity: 8,
      emotionalCharge: 8
    },
    weaknesses: ["Too long for mobile display", "Vague subject reference"],
    rewrites: [
      { version: "Shock", title: "AI Is Killing Your Channel" },
      { version: "Curiosity", title: "The Secret AI Framework" },
      { version: "Authority", title: "How 1% Of Creators Use AI" }
    ],
    verdict: "High potential if the visual contrast matches the negative curiosity.",
    clickProbability: 84,
    eyeTrackingHeatmap: "Expect initial focus on the word 'STOP' followed by the frustrated expression. High focal tension on the central red X.",
    audienceRetentionPrediction: "85% of viewers will survive the first 30 seconds if the rapid B-roll matches the energy of the opening hook."
  },
  competitor: {
    channelProfile: {
      contentPillars: ["AI Reviews", "Efficiency Guides", "Tech News"],
      uploadPattern: "3x Weekly (Mon/Wed/Fri)",
      thumbnailStyle: "Minimalist, High Saturation",
      hookFormula: "Call-out → Rapid Visual → Conflict"
    },
    topContentPatterns: [
      { pattern: "Top 10 Tools", whyItWorks: "Listicles reduce cognitive load" }
    ],
    contentGaps: ["Emotional AI case studies", "AI Workflow live audits"],
    cloneStrategy: "Focus on the struggle of implementation rather than just the tools.",
    cloneDifficulty: 8.5,
    cloneVerdict: "High difficulty but massive blue ocean potential if you nail the personality.",
    firstVideoIdea: {
      title: "My AI Mistake Cost Me $1000",
      angle: "Authentic failure narrative vs their polished success"
    }
  },
  monetization: {
    estimatedMonthlyRevenue: {
      adSense: "$400 - $1,200",
      totalPotential: "$8,500 - $12,000"
    },
    revenueStreams: [
      { name: "YouTube AdSense", type: "Passive", potentialMonthly: "$400–$1,200", effort: "Low", implementation: "Reach 1K subs + 4K watch hours. Enable monetization in YouTube Studio. Focus on 10+ minute videos for mid-roll ads." },
      { name: "Brand Sponsorships", type: "Active", potentialMonthly: "$500–$3,000", effort: "Medium", implementation: "Pitch brands in your niche at 5K subscribers. Use email templates targeting DTC brands spending on YouTube." },
      { name: "Digital Products", type: "Scalable", potentialMonthly: "$1,000–$4,000", effort: "High", implementation: "Create a paid notion template, ebook, or mini-course. Sell via Gumroad. Promote in video descriptions and end screens." },
      { name: "Affiliate Marketing", type: "Passive", potentialMonthly: "$200–$800", effort: "Low", implementation: "Join Amazon Associates, Zerodha affiliate, or niche SaaS programs. Add links in first 3 lines of description." },
      { name: "Channel Memberships", type: "Scalable", potentialMonthly: "$300–$1,500", effort: "Medium", implementation: "Launch at 30K subscribers with 3 membership tiers. Offer exclusive content, early access, Discord access." },
      { name: "Consulting / 1:1 Calls", type: "Active", potentialMonthly: "$500–$2,500", effort: "High", implementation: "Offer 30-min paid strategy calls via Calendly at ₹2,999 each. Add booking link to channel about section." }
    ],
    quickWin: "Start affiliate marketing on day 1 — add 3 relevant affiliate links to every video description immediately. Zero subscriber requirement, instant passive income from first views.",
    longTermAsset: "Build a paid digital product (template or mini-course) that you sell in every video. At 50K subscribers this compounds to ₹2-4L/month with zero additional work.",
    warningZones: [
      "Accepting undisclosed sponsorships violates YouTube policy and ASCI guidelines in India — always add #ad or #sponsored",
      "Pricing sponsorships based on subscribers instead of CPM — charge per 1000 views, not per follower count"
    ]
  },
  title_forge: {
    videoCore: "A deep dive into how Ancient Rome's concrete is still standing while modern buildings fail.",
    titles: [
      {
        rank: 1,
        title: "Modern Engineering is FRAUD: Why Roman Concrete Lasts 2,000 Years",
        psychTrigger: "Shock",
        predictedCTR: "8.4–10.2%",
        ctrScore: 9,
        seoKeyword: "Roman Concrete",
        thumbnailText: "THEY LIED.",
        why: "Uses a controversial 'Fraud' hook to challenge audience assumptions about modern progress.",
        bestFor: "Browse features"
      },
      {
         rank: 2,
         title: "The Impossible Secret of Ancient Roman Concrete",
         psychTrigger: "Curiosity Gap",
         predictedCTR: "7.1–9.0%",
         ctrScore: 8,
         seoKeyword: "Ancient Roman Concrete Secret",
         thumbnailText: "2,000 YEAR SECRET",
         why: "Positions the topic as a hidden secret that science is only just re-discovering.",
         bestFor: "Suggested feed"
      }
    ],
    abTestPairs: [
      {
        pairLabel: "Shock vs Curiosity",
        titleA: "Title #1",
        titleB: "Title #2",
        recommendation: "Run Title #1 first — it has a stronger emotional valence."
      }
    ],
    descriptionOpener: "Modern buildings crumble in decades, but Roman Concrete has survived for millennia. We reveal the exact chemical reaction that allows ancient piers to stand against the salt sea.",
    avoidMistakes: ["Don't use generic titles like 'History of Rome'", "Avoid passive phrasing like 'Concrete was made by Romans'"]
  },
  launchpad: {
    recommendedNiche: "Personal Finance India",
    readinessScore: { 
      score: 78, 
      verdict: "Strong foundation — niche selection is smart, execution discipline will determine success.", 
      strengthSignal: "High-demand niche with proven monetization and massive underserved audience", 
      gapToFill: "Need consistent upload schedule and thumbnail system before launch" 
    },
    nicheRecommendations: [
      { nicheName: "Personal Finance India", nicheScore: 9.2, demandLevel: "Explosive", competitionLevel: "Competitive", avgRPM: "$3–$7 USD", whyItWorks: "India's middle class is growing at 8% annually with massive demand for financial literacy. English + Hindi hybrid content reaches 400M+ addressable viewers.", biggestRisk: "Several established channels like Pranjal Kamra already have 3M+ subs", timeToMonetization: "7–10 months" },
      { nicheName: "AI Tools for Indian Creators", nicheScore: 8.7, demandLevel: "Explosive", competitionLevel: "Blue Ocean", avgRPM: "$5–$10 USD", whyItWorks: "Near-zero competition in the Indian market for practical AI tool tutorials. Global English audience also reachable.", biggestRisk: "Niche evolves rapidly — content has shorter shelf life", timeToMonetization: "5–8 months" },
      { nicheName: "Indian Business Case Studies", nicheScore: 8.4, demandLevel: "High", competitionLevel: "Moderate", avgRPM: "$4–$8 USD", whyItWorks: "Startup culture boom in India creates huge appetite for real business stories. Faceless format works perfectly.", biggestRisk: "Research-heavy — requires 8-12 hours per video", timeToMonetization: "8–12 months" }
    ],
    competitionLandscape: {
      topChannels: [
        { channelName: "Pranjal Kamra", estimatedSubs: "5.4M", whatTheyDoWell: "Stock market simplicity", theirWeakness: "Lacks focus on Gen-Z specific tax and crypto education" },
        { channelName: "Asset Yogi", estimatedSubs: "4.1M", whatTheyDoWell: "Deep real estate analysis", theirWeakness: "Slightly complex for absolute beginners" },
        { channelName: "CA Rachana Phadke Ranade", estimatedSubs: "4.8M", whatTheyDoWell: "Academic clarity", theirWeakness: "Too formal for modern content consumers" }
      ],
      overallSaturation: "While the 'General Finance' space is crowded, specific sub-niches like 'Tax Strategy for Content Creators' or 'Indian ETF Investing' are wide open.",
      newCreatorAdvantage: "Established creators are locked into their existing formats; you can move faster toward emerging trends like AI-automated investing."
    },
    audienceProfile: {
      primaryAge: "18–34",
      gender: "75% Male / 25% Female Split",
      psychographics: [
        "Aspirant Class: Seeking rapid financial independence",
        "Utility Focused: Values speed of information over high production",
        "Community Oriented: Follows trust-based influencer cohorts",
        "Mobile-First Tech Enthusiasts"
      ],
      painPoints: [
        "Overwhelmed by academic financial jargon/CFA level complexity",
        "Intense FOMO regarding emerging asset classes (Crypto/AI)",
        "Lack of actionable 'Day 1' investment frameworks",
        "Distrust in legacy banking institutional advice"
      ],
      watchingHabits: "Primarily active between 9 PM and 11:30 PM (Pre-sleep research phase). 65% of consumption occurs via mobile in vertical format. High retention for 'Chaptered' educational content with on-screen data visualization.",
      whatMakesThemSubscribe: "A single piece of counter-intuitive advice that yields an immediate ROI or tax saving."
    },
    differentiationAngle: {
      uniquePositioning: "The raw, unfiltered financial advisor for India's Gen-Z gig economy.",
      contentPersonality: "Energetic Challenger",
      visualIdentity: "Dark mode, high-contrast neon accents with rapid-fire data visualization.",
      tagline: "Unlocking Wealth For The New Bharat"
    },
    channelNameIdeas: [
      { name: "GenZ Paisa", reason: "Direct and relatable to the target age group" },
      { name: "Bharat Budget", reason: "Broad appeal and patriotic undertone" },
      { name: "The Fin-Indian", reason: "Clever play on words focusing on finance" },
      { name: "Rich Bharat", reason: "Aspirational and outcomes-oriented" },
      { name: "Money Muscle India", reason: "Strong, energetic branding" }
    ],
    first10VideoIdeas: [
      { order: 1, title: "I Saved ₹10,000 In 30 Days: Here's Exactly How", type: "Both", viralScore: 9.4, whyFirst: "Immediate authority and proof of concept", hook: "Everyone says saving money in India is hard. They're wrong." },
      { order: 2, title: "The Hidden Tax Every Indian Creator Forgets", type: "Long-form", viralScore: 8.9, whyFirst: "Targets a high-value sub-niche", hook: "If you're making money from YouTube or Instagram, you're probably breaking this law." },
      { order: 3, title: "Stocks vs Crypto: Where To Put Your First ₹1000", type: "Both", viralScore: 9.1, whyFirst: "High search volume and evergreen", hook: "₹1000 in your pocket is losing value. Here's how to multiply it." },
      { order: 4, title: "Why Most Indians Will Never Be Rich", type: "Long-form", viralScore: 8.7, whyFirst: "Controversial and high curiosity", hook: "Your parents' advice is actually keeping you broke." },
      { order: 5, title: "My Top 5 Indian Apps For Free Investing", type: "Short", viralScore: 8.5, whyFirst: "Low barrier to entry for viewers", hook: "Stop keeping your money in a savings account. Use these apps." },
      { order: 6, title: "How To Buy A Home Before You're 30 in India", type: "Long-form", viralScore: 8.2, whyFirst: "High aspiration goal", hook: "Real estate is a scam for our generation. Unless you do this." },
      { order: 7, title: "The Truth About Indian Credit Cards", type: "Both", viralScore: 8.4, whyFirst: "Monetizable through affiliate links", hook: "This piece of plastic is either your best friend or your worst enemy." },
      { order: 8, title: "Side Hustles That Pay ₹50,000/Month in India", type: "Long-form", viralScore: 9.3, whyFirst: "Extreme high demand", hook: "Your 9-to-5 isn't enough. Here's how to build a second income engine." },
      { order: 9, title: "Stop Buying These 5 Things In Your 20s", type: "Short", viralScore: 8.8, whyFirst: "Negative hook, high shareability", hook: "You're spending ₹2000 a month on this and it's killing your future." },
      { order: 10, title: "The 30-Day Indian Wealth Challenge", type: "Both", viralScore: 9.0, whyFirst: "Community building and retention", hook: "I'm giving you the exact blueprint to fix your finances in 30 days." }
    ],
    launchRoadmap: {
      week1: "Select your first 3 case studies and record 'The ₹10,000 Saving' video.",
      week2to4: "Establish consistent 2-videos-per-week cadence and build raw-style thumbnails.",
      month2to3: "Launch community discord and start affiliate outreach.",
      month4to6: "Scale to 3 videos per week and introduce digital products."
    },
    shortsViability: {
      viabilityScore: 9.5,
      discoveryPotential: "Massive / Explosive",
      engagementPatterns: "Gen-Z in India prefers high-speed, fact-dense financial shorts with clear on-screen captions. Average completion rates approach 85% for listicle formats.",
      viralityBestPractices: [
        "Use 'The Number Hook' for first 1.5 seconds",
        "High-contrast yellow/black captions",
        "Rapid pattern interrupts every 3 seconds",
        "Looping conclusion trick"
      ]
    },
    survivalWarnings: [
      "Avoid being too academic — this is entertainment, not a CA lecture.",
      "Don't give specific stock tips — focus on frameworks to avoid legal issues.",
      "Never fake your results — the Indian audience values authenticity above all."
    ]
  },
  intelchat: {
    welcome: true
  },
  asset_forge: {
    videoTitle: "How The Mughal Empire Collapsed In 50 Years",
    seoVariants: [
      "Why Did The Mughal Empire Fall? The Shocking Truth",
      "5 Reasons The Mughal Empire Collapsed Overnight",
      "The Mughal Empire Was Destroyed From The Inside — Here's How",
      "Mughal Empire Fall: The History No One Teaches You"
    ],
    openingHook: "In 1700, the Mughal Empire controlled 25% of the global GDP—out-earning all of Europe combined. But in a shocking 50-year freefall, they lost 98% of their territory and every single gram of their gold. This wasn't just a defeat... it was the fastest economic erasure in human history.",
    languages: [
      { language: "Hindi", translation: "1700 में, मुगल साम्राज्य ने वैश्विक सकल घरेलू उत्पाद का 25% हिस्सा नियंत्रित किया—जो पूरे यूरोप की संयुक्त कमाई से अधिक था।" },
      { language: "Spanish", translation: "En 1700, el Imperio Mughal controlaba el 25% del PIB mundial, ganando más que toda Europa junta." }
    ],
    scriptOutline: [
      { section: 1, title: "The Empire At Its Peak", duration: "90 sec", purpose: "Establish scale so the fall hits harder", keyPoints: ["150 million subjects", "$90B equivalent GDP", "Military dominance across subcontinent"], narrativeScript: "In 1700, the Mughal Empire wasn't just a kingdom; it was a global superpower. Holding 25% of the world's GDP, it was the wealthiest entity on Earth. Imagine a land where gold was so common it was used to pave courtyard stones.", wordCount: 232, transitionLine: "But empires this powerful don't just fall — they are destroyed from within." },
      { section: 2, title: "Aurangzeb's Fatal Decisions", duration: "2 min", purpose: "Introduce the human catalyst", keyPoints: ["Religious persecution reversal", "Endless Deccan wars draining treasury", "Alienating Hindu Rajput allies"], narrativeScript: "It started with Aurangzeb. A ruler of absolute discipline, but zero flexibility. He reversed centuries of religious tolerance, sparking internal fires that no army could extinguish. His obsession with the Deccan wars lasted 27 years.", wordCount: 310, transitionLine: "Every war he fought to expand the empire was actually killing it." },
      { section: 3, title: "The Treasury Runs Dry", duration: "90 sec", purpose: "Economic collapse — make it visceral", keyPoints: ["Military costs exceeded 90% of revenue", "Famine ignored while wars funded", "Provincial governors stopped sending tribute"], narrativeScript: "By 1707, the treasury was empty. The silver was gone. The gold was gone. Provinces that once sent tribute now sent silence. The central nerve system of the empire had been severed.", wordCount: 232, transitionLine: "When the money runs out, loyalty runs out with it." },
      { section: 4, title: "The Vultures Circle", duration: "2 min", purpose: "External threats accelerating collapse", keyPoints: ["Maratha empire expanding rapidly", "Persian invasion of 1739", "British East India Company establishing footholds"], narrativeScript: "Then came the invaders. From the South, the Marathas. From the West, the Persians. And from the seas, a small trading company from Britain. They didn't see an empire; they saw a corpse ready for picking.", wordCount: 310, transitionLine: "Three enemies. One dying empire. Only one outcome was possible." },
      { section: 5, title: "The Last Emperor", duration: "90 sec", purpose: "Emotional payoff — humanize the end", keyPoints: ["Bahadur Shah Zafar exiled to Rangoon", "Wrote poetry in prison about lost glory", "Died alone, empire gone"], narrativeScript: "The end was quiet. Bahadur Shah Zafar, the last Mughal, was exiled to a small room in Rangoon. He had no empire left to rule, only the poems he wrote on the walls of his prison.", wordCount: 232, transitionLine: "The lesson history doesn't teach you about why empires really fall." },
      { section: 6, title: "What Actually Killed The Mughals", duration: "2 min", purpose: "Insight delivery — the real takeaway", keyPoints: ["Overextension is always the real killer", "Religious unity was the foundation — breaking it broke everything", "No succession plan = no future"], narrativeScript: "The Mughals didn't fall because of a lost battle. They fell because they lost their soul. They broke the very unity that built them. And that, is the pattern of every collapse.", wordCount: 310, transitionLine: "And this pattern has repeated with every great empire since." }
    ],
    thumbnailBrief: {
      mainText: "EMPIRE KILLER",
      emotion: "Shock + Awe",
      layout: "Bold white text left-aligned, historical map faded in background, red crack/fracture effect across center",
      colorPalette: ["#1a0a02", "#8b1a1a", "#c8a850"],
      referenceStyle: "Dark cinematic, Oversimplified meets Vox documentary"
    },
    voiceoverGuide: {
      recommendedVoice: "Adam",
      speed: "0.87x",
      tone: "Calm authoritative narrator, rising urgency in sections 3-4, somber in section 5",
      emphasisWords: ["collapsed", "destroyed", "wealth", "alone", "pattern"],
      emotionalArc: "Confident → Ominous → Urgent → Somber → Insightful"
    },
    stockFootage: {
      openingShots: ["Mughal architecture aerial drone", "ancient Indian map historical", "gold coins falling cinematic", "Red Fort Delhi sunset"],
      sectionTerms: [
        { section: 1, terms: ["Mughal palace interior", "Indian emperor historical"] },
        { section: 2, terms: ["battle formation historical", "ancient warfare cavalry"] },
        { section: 3, terms: ["empty treasury room", "drought historical famine"] }
      ],
      styleGuide: "Desaturated cinematic — avoid bright stock colors. Use slow panning shots only. No modern footage.",
      avoidTerms: ["generic India", "colorful festival", "modern Delhi"]
    },
    musicDirection: {
      intro: "Slow orchestral build, tabla undertone, mysterious and grand",
      build: "Escalating tension strings, war drums entering in section 3-4",
      outro: "Melancholic solo sitar fading to silence",
      avoidGenres: ["upbeat electronic", "pop", "generic epic trailer music"]
    },
    bRollBlueprint: [
      { section: 1, visualCues: ["Close-up of golden Mughal coin", "Map morphing from full color to grey"], motionType: "Slow Pan", overlayIdea: "25% GLOBAL GDP" },
      { section: 2, visualCues: ["Stylized portrait of Aurangzeb", "Flickering candle in a storm"], motionType: "Zoom", overlayIdea: "THE CATALYST" },
      { section: 3, visualCues: ["Persian scrolls being torn", "Dusty battlefield at sunset"], motionType: "Rapid Cut", overlayIdea: "THE INVASION" },
      { section: 4, visualCues: ["Empty throne in a ruined hall", "British flag slowly rising"], motionType: "Static", overlayIdea: "TOTAL COLLAPSE" }
    ],
    uploadChecklist: [
      "Add all 4 SEO variant titles to YouTube description A/B test",
      "Upload thumbnail and test against plain text variant for 48 hours",
      "Set ElevenLabs Adam voice at 0.87x speed, add 300ms pause at transition lines",
      "Tag video with: mughal empire, mughal history, indian history, empire collapse",
      "Schedule upload for Tuesday or Thursday 2PM–5PM IST for maximum reach"
    ]
  },
  settings: {},
  pricing: {}
};

const NODES: { id: Mode; label: string; icon: any; placeholder: string; badge?: string; tooltip: string }[] = [
  { id: 'launchpad', label: 'Launchpad', icon: Rocket, placeholder: 'Briefly describe your interest + region + goals...', badge: 'NEW', tooltip: 'Full channel architecture & strategy blueprint' },
  { id: 'asset_forge', label: 'Asset Forge', icon: Package, placeholder: 'Enter video topic...', badge: 'PRO', tooltip: 'Advanced channel visual asset generation' },
  { id: 'intelchat', label: 'Intel Chat', icon: MessageCircle, placeholder: 'Ask anything about YouTube growth...', badge: 'LIVE', tooltip: 'Real-time competitive intelligence workspace' },
  { id: 'viral', label: 'Viral Strategist', icon: Zap, placeholder: 'Enter niche or content goal...', badge: 'HOT', tooltip: 'Engineered viral concepts with script hooks' },
  { id: 'hook', label: 'Hook Analyzer', icon: BarChart3, placeholder: 'Enter your title or hook idea...', badge: 'HOT', tooltip: 'Retention-optimized script analysis' },
  { id: 'competitor', label: 'Competitor Spy', icon: Eye, placeholder: 'Enter a channel name or niche...', tooltip: 'Channel analysis and strategy reverse-engineering' },
  { id: 'monetization', label: 'Monetization Map', icon: HexIcon, placeholder: 'Enter niche + estimated monthly views...', badge: 'HOT', tooltip: 'Multi-stream revenue roadmap' },
  { id: 'title_forge', label: 'Title Forge', icon: TitleForgeIcon, placeholder: 'Describe your video idea...', badge: 'HOT', tooltip: 'CTR-maximized title generation' },
];

const nodeLiveLabels: Record<string, string> = {
  launchpad: 'CHANNEL LAUNCHPAD',
  asset_forge: 'ASSET FORGE',
  intelchat: 'INTEL CHAT',
  viral: 'VIRAL STRATEGIST',
  hook: 'HOOK ANALYZER',
  competitor: 'COMPETITOR SPY',
  monetization: 'MONETIZATION MAP',
  title_forge: 'TITLE FORGE'
};

const DEFAULT_SETTINGS: VyrexSettings = {
  workspace: {
    channelName: 'Tech Stuff',
    niche: 'Tech',
    language: 'English',
    region: 'Global',
    frequency: 'Weekly'
  },
  profile: {
    name: 'Operator',
    photoURL: null
  },
  ai: {
    viralThreshold: 7.5,
    responseStyle: 'DETAILED',
    autoGenerateExamples: true,
    outputLanguage: 'English',
    scriptStyle: 'STORYTELLER'
  },
  appearance: {
    theme: 'VOID',
    accentColor: '#e8542a',
    sidebarWidth: 'NORMAL'
  },
  visibility: {
    launchpad: true,
    asset_forge: true,
    intelchat: true,
    viral: true,
    hook: true,
    competitor: true,
    monetization: true,
    title_forge: true
  }
};


// ============================================================
// GOOGLE G SVG — reuse in both buttons
// ============================================================
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" style={{marginRight:'8px', flexShrink:0}}>
    <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
    <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"/>
    <path d="M4.5 10.48A4.8 4.8 0 014.5 7.5V5.43H1.83a8 8 0 000 7.14L4.5 10.48z" fill="#FBBC05"/>
    <path d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.95.99 12.14.2 8.98.2A8 8 0 001.83 5.43L4.5 7.5c.68-2 2.54-3.92 4.48-3.92z" fill="#EA4335"/>
  </svg>
);

// ============================================================
// FULL LANDING PAGE COMPONENT
// ============================================================
const LandingPage = ({ onSignIn, onEmailSignIn }: { onSignIn: () => void, onEmailSignIn: (email: string, pass: string) => void }) => {
  const [billing, setBilling] = React.useState('monthly');
  const [showEmailLogin, setShowEmailLogin] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const isINR = Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Calcutta') ||
                Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Kolkata') ||
                navigator.language === 'en-IN';

  const price = (inr: string, usd: string) => isINR ? inr : usd;

  return (
    <div style={{background:'#03050a', color:'#d8e4f0', minHeight:'100vh', overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #03050a; }

        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 16px 6%;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(3,5,10,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lp-nav-logo {
          font-family: Orbitron, monospace; font-weight: 900; font-size: 20px;
          background: linear-gradient(135deg, #fff, #e8542a);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lp-nav-links { display: flex; gap: 32px; align-items: center; }
        .lp-nav-link {
          font-family: JetBrains Mono, monospace; font-size: 11px;
          color: #4a6070; text-decoration: none; letter-spacing: 0.1em;
          text-transform: uppercase; cursor: pointer;
          transition: color 0.2s;
        }
        .lp-nav-link:hover { color: #d8e4f0; }
        .lp-btn-google {
          display: flex; align-items: center;
          background: white; color: #111; border: none;
          padding: 10px 22px; border-radius: 8px; cursor: pointer;
          font-family: Syne, sans-serif; font-size: 14px; font-weight: 700;
          transition: all 0.2s; box-shadow: 0 4px 16px rgba(255,255,255,0.1);
        }
        .lp-btn-google:hover { background: #f0f0f0; transform: translateY(-1px); }

        .email-login-overlay {
          position: fixed; inset: 0; background: rgba(3,5,10,0.9);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
        }
        .email-card {
          background: #080d18; border: 1px solid rgba(232,84,42,0.3);
          border-radius: 16px; padding: 32px; width: 100%; max-width: 400px;
          box-shadow: 0 0 40px rgba(232,84,42,0.1);
        }
        .email-input {
          width: 100%; background: #03050a; border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 16px; border-radius: 8px; color: white;
          font-family: JetBrains Mono, monospace; font-size: 13px; margin-bottom: 16px;
        }
        .email-submit {
          width: 100%; background: #e8542a; color: white; border: none;
          padding: 14px; border-radius: 8px; font-family: Syne, sans-serif;
          font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s;
        }
        .email-submit:hover { background: #ff8c42; }

        .lp-hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 120px 6% 80px;
          position: relative; overflow: hidden;
        }
        .lp-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
        }
        .lp-glow-1 {
          position: absolute; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(232,84,42,0.07) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          pointer-events: none;
        }
        .lp-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 18px; border-radius: 20px;
          border: 1px solid rgba(232,84,42,0.35);
          background: rgba(232,84,42,0.08);
          font-family: JetBrains Mono, monospace; font-size: 10px;
          color: #ff8c42; letter-spacing: 0.18em; margin-bottom: 28px;
          position: relative; z-index: 1;
        }
        .lp-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #e8542a;
          box-shadow: 0 0 8px #e8542a;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%,100%{box-shadow:0 0 4px #e8542a}
          50%{box-shadow:0 0 12px #e8542a, 0 0 24px rgba(232,84,42,0.4)}
        }
        .lp-title {
          font-family: Orbitron, monospace; font-weight: 900;
          font-size: clamp(72px, 12vw, 120px); letter-spacing: 0.06em;
          background: linear-gradient(135deg, #ffffff 0%, #d8e4f0 40%, #e8542a 85%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 0.9; margin-bottom: 24px;
          position: relative; z-index: 1;
        }
        .lp-subtitle {
          font-family: Syne, sans-serif; font-size: clamp(16px,2.5vw,21px);
          font-weight: 400; color: #6a8a9a; max-width: 520px;
          line-height: 1.6; margin-bottom: 44px;
          position: relative; z-index: 1;
        }
        .lp-subtitle strong { color: #c8dce8; font-weight: 600; }
        .lp-actions {
          display: flex; gap: 14px; flex-wrap: wrap;
          justify-content: center; margin-bottom: 64px;
          position: relative; z-index: 1;
        }
        .lp-btn-primary {
          display: flex; align-items: center;
          background: white; color: #111; border: none;
          padding: 15px 36px; border-radius: 10px; cursor: pointer;
          font-family: Syne, sans-serif; font-size: 15px; font-weight: 700;
          transition: all 0.2s;
          box-shadow: 0 8px 32px rgba(255,255,255,0.15);
        }
        .lp-btn-primary:hover {
          background: #f5f5f5; transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255,255,255,0.2);
        }
        .lp-btn-secondary {
          padding: 15px 36px; border-radius: 10px; cursor: pointer;
          background: transparent; border: 1px solid rgba(255,255,255,0.15);
          color: #c8dce8; font-family: Syne, sans-serif;
          font-size: 15px; font-weight: 600; transition: all 0.2s;
        }
        .lp-btn-secondary:hover { border-color: rgba(255,255,255,0.35); }

        .lp-stats {
          display: flex; gap: 0; align-items: center;
          position: relative; z-index: 1;
        }
        .lp-stat { text-align: center; padding: 0 40px; }
        .lp-stat-num {
          font-family: Orbitron, monospace; font-weight: 700;
          font-size: 28px; color: white; display: block;
        }
        .lp-stat-label {
          font-family: JetBrains Mono, monospace; font-size: 9px;
          color: #4a6070; letter-spacing: 0.18em; text-transform: uppercase;
          margin-top: 4px;
        }
        .lp-divider {
          width: 1px; height: 40px; background: rgba(255,255,255,0.1);
        }

        .lp-section { padding: 100px 6%; }
        .lp-section-label {
          font-family: JetBrains Mono, monospace; font-size: 10px;
          letter-spacing: 0.25em; color: #e8542a; text-transform: uppercase;
          text-align: center; margin-bottom: 12px;
        }
        .lp-section-title {
          font-family: Syne, sans-serif; font-weight: 800;
          font-size: clamp(28px, 4vw, 44px); text-align: center;
          margin-bottom: 14px; line-height: 1.1;
        }
        .lp-section-sub {
          font-family: Syne, sans-serif; font-size: 16px; color: #6a8a9a;
text-align: center; max-width: 480px; margin: 0 auto 56px;
          line-height: 1.6;
        }

        .lp-features-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 16px; max-width: 1100px; margin: 0 auto;
        }
        @media(max-width:900px){ .lp-features-grid{ grid-template-columns: repeat(2,1fr); } }
        @media(max-width:500px){ .lp-features-grid{ grid-template-columns: 1fr; } }

        .lp-feat-card {
          background: #080d18; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 22px 18px;
          transition: all 0.25s; cursor: default;
        }
        .lp-feat-card:hover { transform: translateY(-4px); border-color: rgba(232,84,42,0.25); }
        .lp-feat-icon { font-size: 24px; margin-bottom: 12px; }
        .lp-feat-name {
          font-family: Syne, sans-serif; font-weight: 700; font-size: 14px;
          color: white; margin-bottom: 6px;
        }
        .lp-feat-desc {
          font-family: JetBrains Mono, monospace; font-size: 11px;
          color: #4a6070; line-height: 1.5; margin-bottom: 10px;
        }
        .lp-feat-credit {
          font-family: JetBrains Mono, monospace; font-size: 9px;
          color: #00c8ff; letter-spacing: 0.1em;
        }

        .lp-steps {
          display: flex; gap: 0; align-items: flex-start;
          max-width: 800px; margin: 0 auto; position: relative;
        }
        .lp-step { flex: 1; text-align: center; padding: 0 20px; position: relative; }
        .lp-step-num {
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, #e8542a, #ff8c42);
          display: flex; align-items: center; justify-content: center;
          font-family: Orbitron, monospace; font-weight: 900; font-size: 16px;
          color: white; margin: 0 auto 16px;
        }
        .lp-step-title {
          font-family: Syne, sans-serif; font-weight: 700; font-size: 15px;
          color: white; margin-bottom: 8px;
        }
        .lp-step-desc {
          font-family: JetBrains Mono, monospace; font-size: 11px;
          color: #4a6070; line-height: 1.5;
        }
        .lp-step-arrow {
          font-size: 24px; color: #e8542a; margin-top: 14px;
          flex-shrink: 0; padding-top: 14px;
        }

        .lp-pricing-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 20px; max-width: 960px; margin: 0 auto 32px;
        }
        @media(max-width:768px){ .lp-pricing-grid{ grid-template-columns:1fr; } }

        .lp-plan {
          background: #080d18; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 32px 28px;
          transition: all 0.2s;
        }
        .lp-plan.featured {
          border-color: rgba(232,84,42,0.45);
          background: linear-gradient(135deg, rgba(232,84,42,0.06), #080d18);
          box-shadow: 0 0 40px rgba(232,84,42,0.12);
          transform: scale(1.03);
        }
        @media(max-width:768px){ .lp-plan.featured{ transform:none; } }
        .lp-plan-badge {
          font-family: JetBrains Mono, monospace; font-size: 9px;
          letter-spacing: 0.2em; margin-bottom: 10px;
        }
        .lp-plan-name {
          font-family: Orbitron, monospace; font-weight: 900;
          font-size: 22px; color: white; margin-bottom: 16px;
        }
        .lp-plan-price {
          font-family: Orbitron, monospace; font-weight: 900;
          font-size: 38px; color: white;
        }
        .lp-plan-period {
          font-family: JetBrains Mono, monospace; font-size: 10px;
          color: #4a6070; margin-bottom: 28px; margin-top: 4px;
        }
        .lp-plan-credits {
          font-family: Orbitron, monospace; font-weight: 700;
          font-size: 16px; margin-bottom: 20px;
        }
        .lp-plan-features { list-style: none; margin-bottom: 28px; }
        .lp-plan-features li {
          font-family: JetBrains Mono, monospace; font-size: 11px;
          color: #8a9aaa; padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          display: flex; align-items: center; gap: 8px;
        }
        .lp-plan-features li.off { opacity: 0.4; }
        .lp-plan-btn {
          width: 100%; padding: 13px; border-radius: 8px;
          font-family: Syne, sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.05em;
        }
        .lp-plan-btn.outline {
          background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #c8dce8;
        }
        .lp-plan-btn.outline:hover { border-color: rgba(232,84,42,0.5); color: #e8542a; }
        .lp-plan-btn.solid {
          background: #e8542a; border: none; color: white;
          box-shadow: 0 4px 24px rgba(232,84,42,0.4);
        }
        .lp-plan-btn.solid:hover { background: #ff8c42; transform: translateY(-1px); }

        .lp-founding {
          max-width: 960px; margin: 0 auto;
          background: linear-gradient(135deg, rgba(232,84,42,0.08), rgba(8,13,24,0.9));
          border: 2px solid rgba(232,84,42,0.4); border-radius: 16px;
          padding: 28px 32px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
        }
        .lp-founding-left { flex: 1; }
        .lp-founding-badge {
          font-family: JetBrains Mono, monospace; font-size: 10px;
          color: #ff8c42; letter-spacing: 0.2em; margin-bottom: 8px;
        }
        .lp-founding-title {
          font-family: Syne, sans-serif; font-weight: 800; font-size: 18px;
          color: white; margin-bottom: 6px;
        }
        .lp-founding-desc {
          font-family: JetBrains Mono, monospace; font-size: 11px; color: #6a8a9a;
        }
        .lp-founding-spots {
          font-family: JetBrains Mono, monospace; font-size: 10px;
          color: #22d3a0; margin-top: 6px;
        }

        .lp-cta-section {
          padding: 100px 6%; text-align: center;
          position: relative; overflow: hidden;
        }
        .lp-cta-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, rgba(232,84,42,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-cta-title {
          font-family: Orbitron, monospace; font-weight: 900;
          font-size: clamp(28px, 5vw, 52px);
          background: linear-gradient(135deg, #fff, #e8542a);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 16px; position: relative; z-index: 1;
        }
        .lp-cta-sub {
          font-family: Syne, sans-serif; font-size: 17px; color: #6a8a9a;
          margin-bottom: 40px; position: relative; z-index: 1;
        }
        .lp-cta-note {
          font-family: JetBrains Mono, monospace; font-size: 10px;
          color: #3a4a5a; margin-top: 16px; letter-spacing: 0.1em;
          position: relative; z-index: 1;
        }

        .lp-footer {
          padding: 36px 6%;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .lp-footer-logo {
          font-family: Orbitron, monospace; font-weight: 700;
          font-size: 14px; color: #3a4a5a;
        }
        .lp-footer-copy {
          font-family: JetBrains Mono, monospace; font-size: 9px;
          color: #3a4a5a; letter-spacing: 0.1em;
        }
        .lp-footer-links { display: flex; gap: 24px; }
        .lp-footer-link {
          font-family: JetBrains Mono, monospace; font-size: 9px;
          color: #3a4a5a; text-decoration: none; letter-spacing: 0.1em;
          cursor: pointer; transition: color 0.2s;
        }
        .lp-footer-link:hover { color: #6a8a9a; }

        @media(max-width:768px){
          .lp-nav-links { display: none; }
          .lp-actions { flex-direction: column; align-items: center; }
          .lp-stats { gap: 0; }
          .lp-stat { padding: 0 20px; }
          .lp-stat-num { font-size: 22px; }
          .lp-steps { flex-direction: column; align-items: center; }
          .lp-step-arrow { transform: rotate(90deg); margin: 0; padding: 0; }
          .lp-footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="lp-nav">
        <div className="lp-nav-logo">VYREX</div>
        <div className="lp-nav-links">
          <span className="lp-nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>Features</span>
          <span className="lp-nav-link" onClick={() => document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>How It Works</span>
          <span className="lp-nav-link" onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Pricing</span>
        </div>
        <button className="lp-btn-google" onClick={onSignIn}>
          <GoogleIcon />Sign in with Google
        </button>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        {showEmailLogin && (
          <div className="email-login-overlay" onClick={() => setShowEmailLogin(false)}>
            <div className="email-card" onClick={e => e.stopPropagation()}>
               <h2 style={{fontFamily:'Orbitron', fontSize:'18px', marginBottom:'20px', color:'white'}}>AGENT ACCESS</h2>
               <p style={{fontFamily:'JetBrains Mono', fontSize:'10px', color:'#6a8a9a', marginBottom:'24px'}}>Enter credentials to sync with Vyrex layer</p>
               <input className="email-input" placeholder="EMAIL ADDRESS" value={email} onChange={e => setEmail(e.target.value)} />
               <input className="email-input" placeholder="PASSKEY" type="password" value={pass} onChange={e => setPass(e.target.value)} />
               <button className="email-submit" onClick={() => onEmailSignIn(email, pass)}>INITIALIZED CONNECTION</button>
               <button style={{width:'100%', marginTop:'12px', background:'transparent', border:'none', color:'#4a6070', fontSize:'10px', fontFamily:'JetBrains Mono', cursor:'pointer'}} onClick={() => setShowEmailLogin(false)}>CANCEL</button>
            </div>
          </div>
        )}
        <div className="lp-grid-bg"/>
        <div className="lp-glow-1"/>
        <div className="lp-badge">
          <div className="lp-badge-dot"/>
          INSTANT INTELLIGENCE ENGINE FOR YOUTUBE CREATORS
        </div>
        <h1 className="lp-title">VYREX</h1>
        <p className="lp-subtitle">
          The YouTube Intelligence Engine built for creators who <strong>play to win.</strong>
        </p>
        <div className="lp-actions">
          <button className="lp-btn-primary" onClick={onSignIn} style={{background:'#fff', color:'#111', border:'none'}}>
            <GoogleIcon />Sign in with Google
          </button>
          <button className="lp-btn-primary" onClick={() => setShowEmailLogin(true)} style={{background:'rgba(232,84,42,0.1)', color:'#e8542a', border:'1px solid rgba(232,84,42,0.3)', boxShadow:'none'}}>
            <Mail style={{marginRight:'10px', width:'18px'}} />Sign in with Email
          </button>
        </div>
        <div className="lp-stats">
          <div className="lp-stat">
            <span className="lp-stat-num">8</span>
            <div className="lp-stat-label">Intelligence Nodes</div>
          </div>
          <div className="lp-divider"/>
          <div className="lp-stat">
            <span className="lp-stat-num">Neural</span>
            <div className="lp-stat-label">AI Powered</div>
          </div>
          <div className="lp-divider"/>
          <div className="lp-stat">
            <span className="lp-stat-num">India</span>
            <div className="lp-stat-label">Built For You</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-section" id="features" style={{background:'linear-gradient(180deg,#03050a,#060a12,#03050a)'}}>
        <div className="lp-section-label">What VYREX Does</div>
        <h2 className="lp-section-title">Eight intelligence nodes. One platform.</h2>
        <p className="lp-section-sub">Stop guessing. Start creating with data-driven precision.</p>
        <div className="lp-features-grid">
          {[
            {icon:'🚀', name:'Channel Launchpad', desc:'Full channel analysis for creators starting from zero', credits:'8 credits', border:'#e8542a'},
            {icon:'🎬', name:'Asset Forge', desc:'Complete pre-production pack from one topic input', credits:'6 credits', border:'#8b5cf6'},
            {icon:'💬', name:'Intel Chat', desc:'Conversational AI advisor for any YouTube question', credits:'1 credit/msg', border:'#00c8ff'},
            {icon:'⚡', name:'Viral Strategist', desc:'Viral ideas with hooks, scripts and thumbnails', credits:'3 credits', border:'#e8542a'},
            {icon:'📊', name:'Hook Analyzer', desc:'CTR score + psychology breakdown + 3 rewrites', credits:'2 credits', border:'#f59e0b'},
            {icon:'👁', name:'Competitor Spy', desc:'Reverse-engineer any channel\'s content strategy', credits:'4 credits', border:'#00c8ff'},
            {icon:'◈', name:'Monetization Map', desc:'Revenue architecture built for your niche', credits:'4 credits', border:'#22d3a0'},
            {icon:'✦', name:'Title Forge', desc:'10 psychologically engineered title variants with CTR scores', credits:'3 credits', border:'#e8542a'},].map(f => (
            <div className="lp-feat-card" key={f.name} style={{borderTop:`2px solid ${f.border}`}}>
              <div className="lp-feat-icon">{f.icon}</div>
              <div className="lp-feat-name">{f.name}</div>
              <div className="lp-feat-desc">{f.desc}</div>
              <div className="lp-feat-credit">⚡ {f.credits}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-section" id="how">
        <div className="lp-section-label">Process</div>
        <h2 className="lp-section-title">Three steps to intelligence.</h2>
        <p className="lp-section-sub" style={{marginBottom:'48px'}}>No learning curve. Results in seconds.</p>
        <div className="lp-steps">
          <div className="lp-step">
            <div className="lp-step-num">01</div>
            <div className="lp-step-title">Pick a Node</div>
            <div className="lp-step-desc">Choose your intelligence module based on what you need right now</div>
          </div>
          <div className="lp-step-arrow">→</div>
          <div className="lp-step">
            <div className="lp-step-num">02</div>
            <div className="lp-step-title">Enter Your Goal</div>
            <div className="lp-step-desc">Type your niche, topic, channel name or question</div>
          </div>
          <div className="lp-step-arrow">→</div>
          <div className="lp-step">
            <div className="lp-step-num">03</div>
            <div className="lp-step-title">Get Intelligence</div>
            <div className="lp-step-desc">Receive structured AI analysis with actionable outputs instantly</div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="lp-section" id="pricing" style={{background:'linear-gradient(180deg,#03050a,#060a12,#03050a)'}}>
        <div className="lp-section-label">Pricing</div>
        <h2 className="lp-section-title">Simple pricing. Serious intelligence.</h2>
        <p className="lp-section-sub">Start free. Upgrade when ready.</p>

        {/* Billing toggle */}
        <div style={{display:'flex', justifyContent:'center', gap:'8px', marginBottom:'40px', alignItems:'center'}}>
          {['monthly','yearly'].map(b => (
            <button key={b} onClick={() => setBilling(b as 'monthly' | 'yearly')} style={{
              padding:'8px 20px', borderRadius:'6px', cursor:'pointer',
              fontFamily:'JetBrains Mono, monospace', fontSize:'10px',
              letterSpacing:'0.15em', textTransform:'uppercase',
              border: billing===b ? '1px solid #e8542a' : '1px solid rgba(255,255,255,0.1)',
              background: billing===b ? 'rgba(232,84,42,0.15)' : 'transparent',
              color: billing===b ? '#e8542a' : '#4a6070', transition:'all 0.2s'
            }}>{b}{b==='yearly'?' — SAVE 33%':''}</button>
          ))}
        </div>

        <div className="lp-pricing-grid">
          {/* SPARK */}
          <div className="lp-plan">
            <div className="lp-plan-badge" style={{color:'#4a6070'}}>FREE FOREVER</div>
            <div className="lp-plan-name">SPARK</div>
            <div className="lp-plan-price">{price('₹0','$0')}</div>
            <div className="lp-plan-period">/month · no card needed</div>
            <div className="lp-plan-credits" style={{color:'#00c8ff'}}>50 credits/month</div>
            <ul className="lp-plan-features">
              <li>✓ All 8 intelligence nodes</li>
              <li>✓ 50 AI credits per month</li>
              <li>✓ 3 Intel Chat msgs/day</li>
              <li className="off">✗ Export (watermarked)</li>
              <li className="off">✗ Session history</li>
            </ul>
            <button className="lp-plan-btn outline" onClick={onSignIn}>START FREE →</button>
          </div>

          {/* CREATOR */}
          <motion.div 
            className="lp-plan featured"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1.03, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
          >
            <div className="lp-plan-badge" style={{color:'#e8542a'}}>MOST POPULAR</div>
            <div className="lp-plan-name" style={{color:'#e8542a'}}>CREATOR</div> 
            <div className="lp-plan-price" style={{color:'#e8542a'}}>
              {billing==='monthly' ? price('₹499','$9') : price('₹3,999','$79')}
            </div>
            <div className="lp-plan-period">
              {billing==='yearly' ? `billed yearly · ${isINR?'Save ₹1,989':'Save $29'}` : '/month'}
            </div>
            <div className="lp-plan-credits" style={{color:'#22d3a0'}}>500 credits/month</div>
            <ul className="lp-plan-features">
              <li>✓ All 8 intelligence nodes</li>
              <li>✓ 500 AI credits/month</li>
              <li>✓ Unlimited Intel Chat</li>
              <li>✓ Full export (no watermark)</li>
              <li>✓ 30-day session history</li>
              <li>✓ Priority AI speed</li>
            </ul>
            <button className="lp-plan-btn solid" onClick={onSignIn}>START CREATOR →</button>
          </motion.div>

          {/* EMPIRE */}
          <div className="lp-plan">
            <div className="lp-plan-badge" style={{color:'#8b5cf6'}}>POWER TIER</div>
            <div className="lp-plan-name" style={{color:'#8b5cf6'}}>EMPIRE</div>
            <div className="lp-plan-price" style={{color:'#8b5cf6'}}>
              {billing==='monthly' ? price('₹1,499','$29') : price('₹11,999','$229')}
            </div>
            <div className="lp-plan-period">
              {billing==='yearly' ? `billed yearly · ${isINR?'Save ₹5,989':'Save $119'}` : '/month'}
            </div>
            <div className="lp-plan-credits" style={{color:'#8b5cf6'}}>2,000 credits/month</div>
            <ul className="lp-plan-features">
              <li>✓ Everything in Creator</li>
              <li>✓ 2,000 AI credits/month</li>
              <li>✓ 5 channel workspaces</li>
              <li>✓ Custom AI channel memory</li>
              <li>✓ API access (coming soon)</li>
              <li>✓ Discord priority support</li>
            </ul>
            <button className="lp-plan-btn outline" style={{borderColor:'rgba(139,92,246,0.4)',color:'#8b5cf6'}}
              onClick={onSignIn}>GO EMPIRE →</button>
          </div>
        </div>

        {/* Founding member */}
        <div className="lp-founding" style={{marginTop:'24px'}}>
          <div className="lp-founding-left">
            <div className="lp-founding-badge">🔥 LIMITED OFFER — FOUNDING MEMBER</div>
            <div className="lp-founding-title">Lifetime Creator access — one payment, forever.</div>
            <div className="lp-founding-desc">Lock in before prices increase. Full Creator tier, no monthly fees.</div>
            <div className="lp-founding-spots">● Only 347 spots remaining</div>
          </div>
          <div style={{textAlign:'right', flexShrink:0}}>
            <div style={{fontFamily:'Orbitron,monospace', fontWeight:900, fontSize:'32px', color:'white', marginBottom:'8px'}}>
              {price('₹2,999','$49')}
            </div>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:'9px', color:'#4a6070', marginBottom:'14px'}}>ONE-TIME PAYMENT · LIFETIME ACCESS</div>
            <button className="lp-plan-btn solid" style={{width:'auto', padding:'12px 28px'}} onClick={onSignIn}>
              CLAIM LIFETIME ACCESS →
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-cta-section">
        <div className="lp-cta-glow"/>
        <h2 className="lp-cta-title">Stop creating blind.<br/>Start creating with intelligence.</h2>
        <p className="lp-cta-sub">Join thousands of creators using VYREX to grow faster.</p>
        <button className="lp-btn-primary" onClick={onSignIn} style={{margin:'0 auto', display:'flex'}}>
          <GoogleIcon />Sign in with Google — It's Free
        </button>
        <p className="lp-cta-note">No credit card required · Free forever plan available · Cancel anytime</p>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">VYREX</div>
<div className="lp-footer-copy">© 2026 VYREX · INTELLIGENCE LAYER · POWERED BY AI</div>
        <div className="lp-footer-links">
          <span className="lp-footer-link">Privacy</span>
          <span className="lp-footer-link">Terms</span>
          <span className="lp-footer-link">Contact</span>
        </div>
      </footer>
    </div>
  );
};

// --- APP COMPONENT ---

export default function App() {
  const [authState, setAuthState] = useState<'loading' | 'auth' | 'app'>('loading');
  const [settings, setSettings] = useState<VyrexSettings>(() => {
    const saved = localStorage.getItem('vyrex_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure new fields are present
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          ai: { ...DEFAULT_SETTINGS.ai, ...parsed.ai }
        };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('vyrex_settings', JSON.stringify(settings));
  }, [settings]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('vyrex_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('vyrex_sidebar_collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const [prevNode, setPrevNode] = useState<Mode | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    if (user?.uid) {
      (window as any).VYREX_USER_ID = user.uid;
    } else {
      (window as any).VYREX_USER_ID = null;
    }
  }, [user]);

  const [activeNode, setActiveNode] = useState<Mode>('launchpad');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Collapsible Input States
  const [inputOpen, setInputOpen] = useState(() => {
    const saved = localStorage.getItem('vyrex_input_open');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('vyrex_input_open', inputOpen.toString());
  }, [inputOpen]);

  const [credits, setCredits] = useState(50);
  const [creditsLoaded, setCreditsLoaded] = useState(false);
  const creditsRef = useRef(50);
  const [showPricing, setShowPricing] = useState(false);
  const [showLowCredits, setShowLowCredits] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // Session-based history and swipe file
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>([]);
  const [swipeFile, setSwipeFile] = useState<SwipeFileItem[]>([]);
  const [showSwipeFile, setShowSwipeFile] = useState(false);
  const [sessionFlash, setSessionFlash] = useState<string | null>(null);

  const [nodeResults, setNodeResults] = useState<Record<Mode, any[]>>({
    launchpad: [],
    intelchat: [],
    viral: [],
    hook: [],
    competitor: [],
    monetization: [],
    title_forge: [],
    asset_forge: [],
    settings: [],
    pricing: []
  });
  
  // Dynamic Page Padding to prevent hiding behind input zone
  const contentPadding = activeNode === 'intelchat' ? 'pb-24' : (inputOpen ? 'pb-[450px]' : 'pb-24');

  // Collapsible Input States moved up

  // Reset to closed whenever node changes (optional, but requested in snippet)
  useEffect(() => {
    // If it's intelchat, we don't use the collapsible panel anyway
    if (activeNode !== 'intelchat') {
       // Just keep it as it is or toggle based on user preference
    }
  }, [activeNode]);

  // Multi-input states for specific nodes (Refactored)
  const [launchpadInput, setLaunchpadInput] = useState({ interests: '', region: '', style: '' });
  const [monetizationInput, setMonetizationInput] = useState({ niche: '', views: '' });
  const [titleInput, setTitleInput] = useState({ idea: '', niche: '' });
  const [assetInput, setAssetInput] = useState({ topic: '', niche: 'Ancient History', format: 'Long-form', desiredDuration: '' });
  const [viralInput, setViralInput] = useState('');
  const [hookInput, setHookInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');

  const [inputMain, setInputMain] = useState('');
  const [inputSub1, setInputSub1] = useState('');
  const [inputSub2, setInputSub2] = useState('');
  const [assetForgeTab, setAssetForgeTab] = useState<'topic' | 'url'>('topic');

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    // Apply accent color
    document.documentElement.style.setProperty('--vy-accent', settings.appearance.accentColor);
  }, [settings.appearance.accentColor]);

  useEffect(() => {
    if (activeNode === 'asset_forge') {
      setInputSub1('Ancient History');
      setInputSub2('Long-form (10-20 min)');
    } else {
      setInputSub1('');
      setInputSub2('');
    }
    setInputMain('');
  }, [activeNode]);
  
  const [nodeLoading, setNodeLoading] = useState<Record<string, boolean>>({});
  const [loadingStatus, setLoadingStatus] = useState<string>('INITIALIZING...');
  const isLoading = !!nodeLoading[activeNode];
  
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      const statuses = [
        'SYNCHRONIZING NEURAL LAYER...',
        'CONSTRUCTING SCRIPT CORE...',
        'FORGING VISUAL SEQUENCE...',
        'CALIBRATING AUDIO TONE...',
        'FINALIZING PRODUCTION PACK...'
      ];
      let i = 0;
      setLoadingStatus(statuses[0]);
      interval = setInterval(() => {
        i = (i + 1) % statuses.length;
        setLoadingStatus(statuses[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const setNodeIsLoading = (nodeId: string, val: boolean) => {
    setNodeLoading(prev => ({ ...prev, [nodeId]: val }));
  };
  const [nodeError, setNodeError] = useState<Record<string, string | null>>({});
  const error = nodeError[activeNode];
  const setNodeErrorMsg = (nodeId: string, msg: string | null) => {
    setNodeError(prev => ({ ...prev, [nodeId]: msg }));
  };
  
  const [deepContexts, setDeepContexts] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('vyrex_deep_contexts');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('vyrex_deep_contexts', JSON.stringify(deepContexts));
  }, [deepContexts]);

  const [lastUsedNode, setLastUsedNode] = useState<Mode | null>(null);
  const [isClearingSession, setIsClearingSession] = useState(false);
  
  const contentEndRef = useRef<HTMLDivElement>(null);
  const [lastAttemptedInput, setLastAttemptedInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeNode !== 'intelchat') {
      setLastUsedNode(activeNode);
    }
  }, [activeNode]);

  useEffect(() => {
    if (contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [nodeResults]);

  useEffect(() => {
    // Listen for auth state changes — persists across refreshes
    const unsubscribe = onAuthChange(async (u) => {
      if (u) {
        setUser(u);
        setAuthState('app');
      } else {
        setUser(null);
        setUserData(null);
        setAuthState('auth');
        setCreditsLoaded(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-close input when switching to intelchat
  useEffect(() => {
    if (activeNode === 'intelchat') {
      setInputOpen(false);
    }
  }, [activeNode]);

  // Real-time user data sync
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserData(data);
        // Only update local credits if they are different and we are not currently deducting
        // (to avoid race conditions with local state updates)
        if (data.credits !== undefined) {
          setCredits(data.credits);
          creditsRef.current = data.credits;
        }
        if (data.settings) {
          setSettings(data.settings);
        } else {
          setSettings(prev => ({
            ...prev,
            profile: {
              name: data.name || user.displayName || 'Operator',
              photoURL: data.photoURL || user.photoURL || null
            }
          }));
        }
        setCreditsLoaded(true);
      } else {
        // New user or missing record
        setCreditsLoaded(true);
      }
    }, (err) => {
      try {
        handleFirestoreError(err, 'get', `users/${user.uid}`, auth);
      } catch (formattedErr: any) {
        console.error('User snapshot error:', formattedErr.message);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleAuthSuccess = (u: any, data: any) => {
    setUser(u);
    setUserData(data);
    setCredits(data?.credits || 50);
    creditsRef.current = data?.credits || 50;
    if (data?.settings) setSettings(data.settings);
    setCreditsLoaded(true);
    setAuthState('app');
  };

  const handleSignOut = async () => {
    await authSignOut();
    setUser(null);
    setUserData(null);
    setAuthState('auth');
    setCredits(50);
    setNodeResults({
      launchpad: [],
      intelchat: [],
      viral: [],
      hook: [],
      competitor: [],
      monetization: [],
      title_forge: [],
      asset_forge: [],
      settings: [],
      pricing: []
    });
  };

  const copyToClipboard = (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('FAILED TO COPY:', err);
    }
  };

  // --- APP HANDLERS ---
  const handleReset = () => {
    setNodeResults({
      launchpad: [],
      intelchat: [],
      viral: [],
      hook: [],
      competitor: [],
      monetization: [],
      title_forge: [],
      asset_forge: [],
      settings: [],
      pricing: []
    });
    setScoreHistory([]);
    setSessionFlash('SESSION CLEARED');
    setTimeout(() => setSessionFlash(null), 1500);
    
    setInputMain('');
    setInputSub1('');
    setInputSub2('');
    setNodeErrorMsg(activeNode, null);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (!user) return;
    
    setIsProcessing(true);
    // Simulate checkout processing
    await new Promise(resolve => setTimeout(resolve, 1800));

    let topUp = 0;
    if (planId === 'creator') topUp = 500;
    if (planId === 'empire') topUp = 2000;
    if (planId === 'founding') topUp = 1000; // Founding initial boost
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const newCredits = credits + topUp;
      await setDoc(userRef, { 
        credits: newCredits,
        plan: planId,
        lastUpgrade: serverTimestamp()
      }, { merge: true });
      
      setCredits(newCredits);
      creditsRef.current = newCredits;
      setUserData(prev => ({ ...prev, plan: planId, credits: newCredits }));
      setSessionFlash(planId === 'founding' ? "🔥 WELCOME FOUNDING MEMBER!" : `🚀 UPGRADED TO ${planId.toUpperCase()}!`);
      setShowPricing(false);
      
      if (activeNode === 'pricing') {
        setActiveNode(prevNode || 'launchpad');
      }
    } catch (err) {
      console.error("PLAN_UPGRADE_ERR:", err);
      try {
        handleFirestoreError(err, 'update', `users/${user.uid}`, auth);
      } catch (formattedErr: any) {
        setNodeErrorMsg(activeNode, formattedErr.message);
        return;
      }
      setNodeErrorMsg(activeNode, "Plan upgrade failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTopUp = async (amount: number) => {
    if (!user) return;

    setIsProcessing(true);
    // Simulate checkout processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const userRef = doc(db, 'users', user.uid);
      const newCredits = credits + amount;
      await setDoc(userRef, { 
        credits: newCredits,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      setCredits(newCredits);
      creditsRef.current = newCredits;
      setUserData(prev => ({ ...prev, credits: newCredits }));
      setSessionFlash(`💰 ADDED ${amount} CREDITS!`);
      setShowPricing(false);
    } catch (err) {
      console.error("TOPUP_ERR:", err);
      try {
        handleFirestoreError(err, 'update', `users/${user.uid}`, auth);
      } catch (formattedErr: any) {
        setNodeErrorMsg(activeNode, formattedErr.message);
        return;
      }
      setNodeErrorMsg(activeNode, "Top-up failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (directMessage?: string) => {
    const nodeAtStart = activeNode;
    const textInput = directMessage || inputMain;
    if (!textInput.trim() || nodeLoading[nodeAtStart]) return;

    setLastAttemptedInput(textInput);

    const cost = (nodeAtStart as string) === 'intelchat' ? 1 : (CREDIT_COSTS[nodeAtStart as string] || 0);
    
    if (credits < cost) {
      setShowPricing(true);
      return;
    }

    setNodeIsLoading(nodeAtStart, true);
    setNodeErrorMsg(nodeAtStart, null);
    setShowLowCredits(false);

    try {
      // Deduct credits in Firestore
      if (user) {
        const result = await deductCredits(user.uid, cost);
        if (!result.success) {
          setNodeErrorMsg(nodeAtStart, result.error || "Credit deduction failed");
          setNodeIsLoading(nodeAtStart, false);
          return;
        }
        setCredits(result.remainingCredits || 0);
        creditsRef.current = result.remainingCredits || 0;
        if ((result.remainingCredits || 0) < 10) {
          setShowLowCredits(true);
        }
      } else {
        // Fallback for non-auth (shouldn't happen with our logic)
        setCredits(prev => prev - cost);
      }

      let prompt = textInput;
      let history: any[] = [];
      let context = deepContexts[nodeAtStart] || '';

      if (nodeAtStart === 'monetization') {
        prompt = `Niche: ${textInput}, Views: ${inputSub1}`;
      } else if (nodeAtStart === 'title_forge') {
        prompt = `Topic: ${textInput}, Niche: ${inputSub1}`;
      } else if (nodeAtStart === 'launchpad') {
        prompt = `Interests: ${textInput}, Region: ${inputSub1}, Style: ${inputSub2}`;
      } else if (nodeAtStart === 'asset_forge') {
        if (assetForgeTab === 'topic') {
          prompt = `Topic: ${textInput}, Niche: ${inputSub1}, Format: ${inputSub2}`;
        } else {
          prompt = `URL (Topic reference): ${textInput}`;
        }
      }
      
      const data = await executeVyrexNode(nodeAtStart as any, prompt, history, context);
      
      if (nodeAtStart === 'viral' && data.viralScore) {
        setScoreHistory(prev => [{
          title: data.videoTitle,
          score: data.viralScore,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 5));
      }
      
      if (nodeAtStart === 'intelchat') {
        const assistantMessage = { role: 'assistant', content: data.answer, timestamp: Date.now() };
        setNodeResults(prev => ({
          ...prev,
          intelchat: [...prev.intelchat, assistantMessage]
        }));
      } else {
        setNodeResults(prev => ({
          ...prev,
          [nodeAtStart]: [data, ...prev[nodeAtStart]]
        }));
        // Only clear input if we're still on the same node
        if (activeNode === nodeAtStart) {
          setInputMain('');
        }
      }

      // Record to Firestore
      if (user) {
        addDoc(collection(db, 'interactions'), {
          userId: user.uid,
          node: nodeAtStart,
          prompt: textInput,
          result: data,
          timestamp: serverTimestamp()
        }).catch(err => {
          try {
            handleFirestoreError(err, 'create', 'interactions', auth);
          } catch (formattedErr: any) {
            console.error('Firestore log error:', formattedErr.message);
          }
        });
      }
    } catch (err: any) {
      console.error(err);
      setNodeErrorMsg(nodeAtStart, `NEURAL PARSE ERROR: ${err.message || 'The engine failed to process this request.'}`);
    } finally {
      setNodeIsLoading(nodeAtStart, false);
    }
  };

  // --- WRAPPER HANDLERS FOR COLLAPSIBLE INPUT ---
  const handleLaunchpadSubmit = useCallback(() => {
    const prompt = `Interests: ${launchpadInput.interests}, Region: ${launchpadInput.region}, Style: ${launchpadInput.style}`;
    handleSubmit(prompt);
    setInputOpen(false);
  }, [launchpadInput, handleSubmit]);

  const handleViralSubmit = useCallback(() => {
    handleSubmit(viralInput);
    setInputOpen(false);
  }, [viralInput, handleSubmit]);

  const handleHookSubmit = useCallback(() => {
    handleSubmit(hookInput);
    setInputOpen(false);
  }, [hookInput, handleSubmit]);

  const handleCompetitorSubmit = useCallback(() => {
    handleSubmit(competitorInput);
    setInputOpen(false);
  }, [competitorInput, handleSubmit]);

  const handleMonetizationSubmit = useCallback(() => {
    const prompt = `Niche: ${monetizationInput.niche}, Views: ${monetizationInput.views}`;
    handleSubmit(prompt);
    setInputOpen(false);
  }, [monetizationInput, handleSubmit]);

  const handleTitleSubmit = useCallback(() => {
    const prompt = `Topic: ${titleInput.idea}, Niche: ${titleInput.niche}`;
    handleSubmit(prompt);
    setInputOpen(false);
  }, [titleInput, handleSubmit]);

  const handleAssetSubmit = useCallback(() => {
    const prompt = `Topic: ${assetInput.topic}, Niche: ${assetInput.niche}, Format: ${assetInput.format}${assetInput.desiredDuration ? `, Desired Duration: ${assetInput.desiredDuration}` : ''}`;
    handleSubmit(prompt);
    setInputOpen(false);
  }, [assetInput, handleSubmit]);

  // LOADING STATE
  if (authState === 'loading') {
    return (
      <div style={{
        background:'#03050a', height:'100vh', width:'100vw',
        display:'flex', alignItems:'center', justifyContent:'center',
        flexDirection:'column', gap:'20px'
      }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{
          width:'52px', height:'52px',
          background:'linear-gradient(135deg,#e8542a,#ff8c42)',
          clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          animation:'spin 1s linear infinite'
        }}/>
        <div style={{fontFamily:'monospace',fontSize:'11px',color:'#3a4a5a',letterSpacing:'0.2em'}}>
          LOADING VYREX...
        </div>
      </div>
    );
  }

  // AUTH STATE — show login page
  if (authState === 'auth') {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (activeNode === 'pricing' || showPricing) {
    return (
      <PricingPage 
        onBack={() => { setShowPricing(false); if (activeNode === 'pricing') setActiveNode(prevNode || 'launchpad'); }}
        currentCredits={credits}
        onSelectPlan={handleSelectPlan}
        onTopUp={handleTopUp}
        currentPlan={userData?.plan}
        isProcessing={isProcessing}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#03050a] text-vy-text overflow-hidden font-sans selection:bg-vy-accent/30 selection:text-white">
      {/* MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] animate-fade-in" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={cn(
        "bg-[#050810] border-r border-vy-border flex flex-col p-0 shrink-0 transition-all duration-500 z-[110] relative",
        isMobile 
          ? cn("fixed inset-y-0 left-0 w-[85%] max-w-[280px] transform", isSidebarOpen ? "translate-x-0" : "-translate-x-full")
          : sidebarCollapsed ? "w-20" : settings.appearance.sidebarWidth === 'WIDE' ? "w-80" : "w-72"
      )}>
        {/* Toggle Button for Desktop */}
        {!isMobile && (
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-24 w-6 h-6 bg-[#050810] border border-vy-border rounded-full flex items-center justify-center text-vy-muted hover:text-vy-accent hover:border-vy-accent/50 z-20 transition-all shadow-lg"
          >
            {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 rotate-180" />}
          </button>
        )}

        <div className="p-5 md:p-8 flex items-center justify-between border-b border-vy-border/40 shrink-0 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-vy-accent to-vy-accent2 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(232,84,42,0.4)] shrink-0">
               <span className="text-white font-display font-black text-xl transform -skew-x-12">V</span>
            </div>
            <div className={cn("transition-all duration-500", sidebarCollapsed && !isMobile ? "opacity-0 w-0" : "opacity-100")}>
              <h1 className="font-display text-lg font-black text-white italic tracking-tighter leading-none">VYREX</h1>
              <p className="font-mono text-[9px] text-vy-accent font-bold uppercase tracking-widest mt-1">Intelligence Layer</p>
            </div>
          </div>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-vy-muted hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-6 space-y-3">
          {/* USER STATUS - Integrated into nav top */}
          {!sidebarCollapsed && (
            <div className="px-1 mb-6">
              <div className="p-4 bg-vy-accent/5 border border-vy-accent/10 rounded-2xl space-y-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vy-accent to-vy-accent2 flex items-center justify-center font-display font-black text-white text-sm shadow-[0_0_15px_rgba(232,84,42,0.3)]">
                    {settings.profile.name?.[0] || user?.displayName?.[0] || 'O'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-black text-white uppercase truncate">{settings.profile.name || user?.displayName || 'OPERATOR'}</div>
                    <div className="text-[8px] font-bold text-vy-green uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      <div className="w-1 h-1 rounded-full bg-vy-green animate-pulse" />
                      SECURE CONNECTION
                    </div>
                  </div>
                </div>
                <div className="h-px bg-white/5 w-full" />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono text-[7px] text-vy-muted uppercase tracking-tighter">QUOTA BALANCE</span>
                    <span className="font-display font-black text-[13px] text-white italic">{credits} CREDITS</span>
                  </div>
                  <button 
                    onClick={() => { setShowPricing(true); if (isMobile) setIsSidebarOpen(false); }}
                    className="p-2 bg-vy-accent/10 border border-vy-accent/20 rounded-lg text-vy-accent hover:bg-vy-accent transition-all hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {NODES.filter(n => settings.visibility[n.id as keyof NodeVisibility] !== false).map((node, index) => {
            const isActive = activeNode === node.id;
            const isCompact = sidebarCollapsed && !isMobile;
            const isLoadingNode = !!nodeLoading[node.id];
            
            return (
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={node.id}
                onClick={() => {
                  setActiveNode(node.id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-vy-accent/10 shadow-[inset_0_0_20px_rgba(232,84,42,0.1)]" 
                    : "text-vy-muted hover:text-vy-white hover:bg-white/5",
                  isLoadingNode && "border-r-2 border-vy-accent/30"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-marker"
                    className="absolute left-0 top-2 bottom-2 w-1.5 bg-vy-accent rounded-r-full shadow-[2px_0_15px_rgba(232,84,42,0.6)]"
                  />
                )}
                <Tooltip content={node.tooltip} position="right" className="ml-4">
                  <div className="relative">
                    <node.icon className={cn(
                      "w-5 h-5 shrink-0 transition-all duration-300",
                      isActive ? "text-vy-accent scale-110" : "group-hover:text-vy-accent group-hover:scale-110"
                    )} />
                    {isLoadingNode && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-vy-accent rounded-full border-2 border-[#050810] animate-pulse" />
                    )}
                  </div>
                </Tooltip>
                <span className={cn(
                  "font-display text-[10px] font-black uppercase tracking-widest flex-1 text-left transition-all duration-300 whitespace-nowrap",
                  isCompact ? "opacity-0 invisible w-0 ml-0" : "opacity-100 visible ml-0"
                )}>
                  {node.label}
                </span>

                {isLoadingNode && !isCompact && (
                  <div className="font-mono text-[7px] text-vy-accent font-black animate-pulse bg-vy-accent/10 px-1 py-0.5 rounded border border-vy-accent/20">
                    SYNCING...
                  </div>
                )}
                
                {!isCompact && !isLoadingNode && node.badge && (
                  <Tooltip 
                    content={
                      node.badge === 'PRO' ? "Unlocked for Creator Tier" : 
                      node.badge === 'HOT' ? "High demand intelligence" : 
                      node.badge === 'NEW' ? "Recently integrated node" : 
                      "Active connection"
                    } 
                    position="top"
                  >
                    <div className={cn(
                      "text-[8px] px-1.5 py-0.5 rounded-md border font-black tracking-tighter shrink-0",
                      node.badge === 'PRO' ? "bg-vy-violet/20 text-vy-violet border-vy-violet/30" : 
                      node.badge === 'LIVE' ? "bg-vy-green/20 text-vy-green border-vy-green/30" :
                      "bg-vy-accent/20 text-vy-accent border-vy-accent/30"
                    )}>
                      {node.badge}
                    </div>
                  </Tooltip>
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-vy-border/40 p-4 bg-[#050810]/80 backdrop-blur-xl shrink-0 space-y-2">
          <button 
            onClick={() => {
              setPrevNode(activeNode);
              setActiveNode('settings');
              if (isMobile) setIsSidebarOpen(false);
            }}
            className={cn(
               "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all border border-transparent hover:bg-white/5",
               activeNode === 'settings' ? "bg-white/5 border-white/10 text-vy-accent" : "text-vy-muted hover:text-white"
            )}
          >
             <SettingsIcon className={cn("w-5 h-5", activeNode === 'settings' && "animate-spin-slow")} />
             {(sidebarCollapsed === false || isMobile) && <span className="font-display font-black text-[11px] uppercase tracking-widest italic pt-0.5">Control Center</span>}
          </button>

          <button 
            onClick={handleSignOut} 
            className="w-full flex items-center justify-center gap-4 py-3 text-[10px] font-black text-vy-muted hover:text-red-400 border border-vy-border/40 rounded-xl hover:bg-red-500/5 hover:border-red-500/20 transition-all uppercase tracking-[0.3em]"
          >
            <LogOut className="w-4 h-4" />
            {(sidebarCollapsed === false || isMobile) && <span>TERMINAL EXIT</span>}
          </button>
          
          {!sidebarCollapsed && (
            <div className="mt-4 px-4 pt-4 border-t border-white/5 bg-gradient-to-t from-black/20 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-vy-accent animate-pulse shadow-[0_0_8px_rgba(232,84,42,0.8)]" />
                <span className="font-mono text-[7px] text-[#3a4a5a] uppercase tracking-[0.5em]">VYREX CORE v1.4.2</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col bg-[#03050a] relative overflow-hidden">
        {/* Persistent Mesh Gradient Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3a4a5a 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-vy-accent/5 blur-[150px] -translate-y-1/2 translate-x-1/3 rounded-full pointer-events-none" />
        
        {activeNode === 'settings' ? (
          <SettingsPage 
            settings={settings} 
            onUpdate={setSettings} 
            onBack={() => setActiveNode(prevNode || 'launchpad')} 
            user={user}
          />
        ) : (
          <>
            {/* Top Navigation */}
            <header className="px-4 md:px-8 py-4 border-b border-white/5 flex items-center justify-between bg-[#03050a]/60 backdrop-blur-3xl z-40 shrink-0 relative">
              {/* Header Scanner Line */}
              <div className="absolute bottom-[-1px] left-0 h-[1px] bg-gradient-to-r from-transparent via-vy-accent/50 to-transparent w-full animate-pulse" />
              
              <div className="flex items-center gap-3 md:gap-5">
                {isMobile && (
                  <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-1 text-vy-muted hover:text-white transition-colors group">
                    <Menu className="w-5 h-5 group-hover:scale-110" />
                  </button>
                )}
                <div className="flex flex-col">
                  <span className="font-display text-[10px] md:text-[11px] text-vy-white font-black tracking-[0.2em] uppercase truncate">
                    {nodeLiveLabels[activeNode] || activeNode.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-vy-green animate-pulse" />
                    <span className="font-mono text-[8px] text-vy-green uppercase tracking-widest font-black">LINK_ESTABLISHED :: {activeNode.toUpperCase()}_v.4.2</span>
                  </div>
                </div>
              </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-black tracking-widest text-[#f0f6ff] uppercase">{userData?.name || user?.displayName || 'OPERATOR'}</div>
              <div className="text-[8px] font-black text-vy-accent uppercase tracking-widest opacity-60">
                {(userData?.plan || 'SPARK').toUpperCase()} LEVEL ASSET
              </div>
            </div>
            
            <div className="h-8 w-px bg-white/5 mx-1" />

            {/* Credit Counter */}
            <Tooltip content="Replenish Intelligence Credits" position="bottom">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPricing(true)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2 rounded-xl font-mono text-[11px] font-black transition-all border border-white/5 bg-[#080d18] relative group overflow-hidden",
                  credits < 10 ? "text-red-500 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]" : "text-vy-cyan hover:border-vy-cyan/50"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Zap className={cn("w-3.5 h-3.5 fill-current", credits < 10 && "animate-pulse")} />
                <span>{credits} CR</span>
              </motion.button>
            </Tooltip>

            {activeNode === 'intelchat' ? (
              isClearingSession ? (
                <div className="flex items-center gap-3 px-4 py-2 bg-vy-accent/10 border border-vy-accent/20 rounded-xl">
                  <span className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-widest">WIPE_DATA?</span>
                  <button onClick={() => { setNodeResults(prev => ({...prev, intelchat: []})); setIsClearingSession(false); }} className="text-[10px] font-black text-vy-accent hover:underline">YES</button>
                  <button onClick={() => setIsClearingSession(false)} className="text-[10px] font-black text-vy-muted hover:text-white transition-colors">NO</button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsClearingSession(true)}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-vy-muted hover:text-red-500 hover:border-red-500/50 transition-all group"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-110" />
                </button>
              )
            ) : (
              <button 
                onClick={handleReset}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-vy-muted hover:text-vy-accent hover:border-vy-accent transition-all group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Output Area */}
        <div className={cn("flex-1 overflow-y-auto custom-scrollbar px-6 md:px-10 py-12 relative bg-[radial-gradient(circle_at_50%_0%,rgba(0,200,255,0.01),transparent_50%)]", contentPadding)}>
            <AnimatePresence>
              {isLoading && activeNode !== 'intelchat' && <LoadingOverlay status={loadingStatus} />}
            </AnimatePresence>

          <div className={cn("max-w-4xl mx-auto", activeNode === 'intelchat' ? "h-full" : "space-y-12")}>
            {error && (
              <div className="bg-[#03050a] border border-red-500/30 rounded-2xl p-10 text-center space-y-8 animate-fade-up relative overflow-hidden">
                <div className="absolute inset-0 bg-red-500/5" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-wider italic italic-bold">INTELLIGENCE SYNC DISRUPTED</h3>
                    <p className="text-vy-muted font-mono text-[12px] leading-relaxed max-w-lg mx-auto italic">
                      {error.includes("NEURAL PARSE ERROR") ? error : `SYSTEM ALERT: ${error}`}
                    </p>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-500/30 to-transparent mx-auto pt-4" />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                    <button 
                      onClick={() => handleSubmit(lastAttemptedInput)} 
                      className="px-10 py-4 bg-red-500 text-white font-display font-black text-[11px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-500/40 hover:shadow-red-500/60"
                    >
                      REBOOT & RETRY
                    </button>
                    <button 
                      onClick={() => {
                        setNodeErrorMsg(activeNode, null);
                        if (activeNode === 'intelchat') {
                          setInputMain(lastAttemptedInput);
                        }
                      }} 
                      className="px-8 py-4 bg-white/5 border border-white/10 text-vy-muted font-display font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all hover:text-white"
                    >
                      DISMISS & EDIT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeNode === 'intelchat' ? (
              <IntelChatRenderer 
                history={nodeResults.intelchat} 
                isLoading={isLoading} 
                onSendMessage={(msg) => handleSubmit(msg)}
                onPopulateInput={(msg) => {
                  setInputMain(msg);
                  setTimeout(() => {
                    if (chatInputRef.current) {
                      chatInputRef.current.focus();
                      chatInputRef.current.style.height = 'auto';
                      chatInputRef.current.style.height = `${Math.min(chatInputRef.current.scrollHeight, 120)}px`;
                    }
                  }, 50);
                }}
              />
            ) : (
              <>
                {!isLoading && !error && nodeResults[activeNode].length === 0 && (
                  <div className="space-y-8 animate-fade-up">
                    <NodeOutput node={activeNode} data={WELCOME_DATA[activeNode]} isExample={true} />
                  </div>
                )}

                {!isLoading && !error && nodeResults[activeNode].map((data, i) => (
                  <NodeOutput key={i} node={activeNode} data={data} />
                ))}
              </>
            )}

            <div ref={contentEndRef} />
          </div>
        </div>

        {/* Sticky Input Zone */}
        {((activeNode as string) !== 'settings' && (activeNode as string) !== 'pricing' && !showPricing) && (
          <div className="shrink-0 z-[60]">
            {activeNode === 'intelchat' ? (
              <div className="px-4 md:px-10 py-6 border-t border-vy-border bg-[#080d18]/95 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto">
                  <ChatInput
                    value={inputMain}
                    onChange={setInputMain}
                    onSend={() => handleSubmit()}
                    isLoading={isLoading}
                    placeholder="Ask about niches, channel names, topics, competition, monetization..."
                    suggestions={[
                      "Refine my Hook Sequence",
                      "Reverse engineer this idea",
                      "Audit my monetization map",
                      "Predict CTR for this title"
                    ]}
                    showSuggestions={showSuggestions}
                    onToggleSuggestions={() => setShowSuggestions(!showSuggestions)}
                    onSelectSuggestion={(s) => {
                      setInputMain(s);
                      setShowSuggestions(false);
                    }}
                  />
                </div>
              </div>
            ) : (
              <CollapsibleInput
                activeNode={activeNode}
                isOpen={inputOpen}
                onToggle={() => setInputOpen(!inputOpen)}
                isLoading={isLoading}
                credits={credits}
                creditCosts={CREDIT_COSTS}
                
                launchpadInput={launchpadInput}
                setLaunchpadInput={setLaunchpadInput}
                handleLaunchpadSubmit={handleLaunchpadSubmit}
                
                viralInput={viralInput}
                setViralInput={setViralInput}
                handleViralSubmit={handleViralSubmit}
                
                hookInput={hookInput}
                setHookInput={setHookInput}
                handleHookSubmit={handleHookSubmit}
                
                competitorInput={competitorInput}
                setCompetitorInput={setCompetitorInput}
                handleCompetitorSubmit={handleCompetitorSubmit}
                
                monetizationInput={monetizationInput}
                setMonetizationInput={setMonetizationInput}
                handleMonetizationSubmit={handleMonetizationSubmit}
                
                titleInput={titleInput}
                setTitleInput={setTitleInput}
                handleTitleSubmit={handleTitleSubmit}
                
                assetInput={assetInput}
                setAssetInput={setAssetInput}
                handleAssetSubmit={handleAssetSubmit}

                deepContext={deepContexts[activeNode] || ''}
                setDeepContext={(val: string) => setDeepContexts(prev => ({ ...prev, [activeNode]: val }))}
              />
            )}
          </div>
        )}
      </>
    )}
  </main>
      {/* MODALS & TOASTS */}
      <AnimatePresence mode="wait">
        {showLowCredits && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed bottom-32 right-8 z-[100] bg-[#080d18] border border-orange-500/30 p-5 rounded-2xl shadow-2xl flex items-center gap-6"
          >
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                   <Zap className="w-5 h-5 text-orange-500 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                   <div className="font-mono text-[10px] text-orange-500 font-bold uppercase tracking-widest">Running low</div>
                   <motion.div 
                     animate={{ opacity: [1, 0.6, 1] }} 
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                     className="text-xs font-bold text-white tracking-widest"
                   >
                     ⚡ {credits} credits remaining
                   </motion.div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setShowPricing(true); setShowLowCredits(false); }}
                  className="px-4 py-2 bg-orange-500 text-[#03050a] font-display font-black text-[9px] uppercase tracking-widest rounded-lg hover:bg-orange-400 transition-colors"
                >
                   UPGRADE →
                </button>
                <button onClick={() => setShowLowCredits(false)} className="text-vy-muted hover:text-white transition-colors">
                   <X className="w-4 h-4" />
                </button>
             </div>
          </motion.div>
        )}
        {credits <= 0 && authState === 'app' && (
          <UpgradeModal onUpgrade={() => setShowPricing(true)} />
        )}
      </AnimatePresence>
    </div>
  );
}

const ResultCard = ({ index, children, accentColor, className, showShimmer }: { index: number; children: any; accentColor?: string; className?: string; showShimmer?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={cn(
        "bg-[#0a0f1d]/80 backdrop-blur-3xl border border-white/5 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group",
        className
      )}
      style={{ borderLeft: accentColor ? `2px solid ${accentColor}` : undefined }}
    >
      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
        <Sparkles className="w-24 h-24 rotate-12" />
      </div>
      
      {/* Scanline Animation */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan pointer-events-none z-20" />
      
      {/* Glow Effect */}
      {accentColor && (
        <div 
          className="absolute -left-20 -top-20 w-40 h-40 blur-[80px] opacity-10 rounded-full pointer-events-none group-hover:opacity-20 transition-opacity"
          style={{ backgroundColor: accentColor }}
        />
      )}
      
      {children}
    </motion.div>
  );
};

// --- NODE OUTPUT RENDERERS ---

const SettingsPage = ({ settings, onUpdate, onBack, user }: { settings: VyrexSettings, onUpdate: (s: VyrexSettings) => void, onBack: () => void, user: User | null }) => {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaveStatus('... SAVING');
      await updateDoc(doc(db, 'users', user.uid), {
        settings: settings,
        photoURL: settings.profile.photoURL,
        name: settings.profile.name
      });
      setSaveStatus('✓ SETTINGS SAVED');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      try {
        handleFirestoreError(error, 'update', `users/${user.uid}`, auth);
      } catch (formattedErr: any) {
        setSaveStatus('✕ ERROR: ' + formattedErr.message);
        return;
      }
      setSaveStatus('✕ ERROR SAVING');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const updateSetting = (category: keyof VyrexSettings, key: string, value: any) => {
    onUpdate({
      ...settings,
      [category]: {
        ...(settings[category] as any),
        [key]: value
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File size too large (max 1MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSetting('profile', 'photoURL', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAvatar = () => {
    const seed = settings.profile.name || user?.email || 'vyrex';
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
    updateSetting('profile', 'photoURL', avatarUrl);
  };

  return (
    <div className="min-h-screen bg-vy-bg pb-24 animate-fade-in">
      <div className="sticky top-0 z-40 bg-vy-bg/80 backdrop-blur-xl border-b border-vy-border px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="font-mono text-[10px] text-vy-accent uppercase tracking-[0.3em]">NODE: <span className="text-white">SETTINGS</span></div>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-vy-border rounded-xl text-[10px] font-black text-vy-muted hover:text-white hover:border-white/20 transition-all uppercase tracking-widest"
        >
          <RefreshCw className="w-3 h-3" /> ↩ BACK TO DASHBOARD
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-12">
        {/* SECTION 0: USER PROFILE */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-[0.2em] whitespace-nowrap">USER PROFILE</div>
            <div className="h-[1px] flex-1 bg-vy-border" />
          </div>
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start p-8 bg-vy-surface/30 border border-vy-border rounded-3xl">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-2 border-vy-border bg-vy-bg overflow-hidden flex items-center justify-center transition-all group-hover:border-vy-accent/50">
                {settings.profile.photoURL ? (
                  <img src={settings.profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-vy-muted" />
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-vy-accent text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Display Name</label>
                  <input 
                    type="text" 
                    value={settings.profile.name}
                    onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                    placeholder="Operator Name"
                    className="w-full bg-vy-surface border border-vy-border rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="text" 
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-vy-surface/50 border border-vy-border rounded-xl px-4 py-3 text-sm text-vy-muted cursor-not-allowed outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={generateAvatar}
                  className="px-4 py-2 bg-vy-accent/10 border border-vy-accent/30 rounded-xl text-[10px] font-black text-vy-accent hover:bg-vy-accent/20 transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate AI Avatar
                </button>
                <button 
                  onClick={() => updateSetting('profile', 'photoURL', null)}
                  className="px-4 py-2 bg-white/5 border border-vy-border rounded-xl text-[10px] font-black text-vy-muted hover:text-white transition-all uppercase tracking-widest"
                >
                  Remove Photo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WORKSPACE */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-[0.2em] whitespace-nowrap">WORKSPACE</div>
            <div className="h-[1px] flex-1 bg-vy-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Channel Name</label>
              <input 
                type="text" 
                value={settings.workspace.channelName}
                onChange={(e) => updateSetting('workspace', 'channelName', e.target.value)}
                placeholder="Your YouTube channel name"
                className="w-full bg-vy-surface border border-vy-border rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Niche</label>
              <select 
                value={settings.workspace.niche}
                onChange={(e) => updateSetting('workspace', 'niche', e.target.value)}
                className="w-full bg-vy-surface border border-vy-border rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
              >
                {['Ancient History', 'Personal Finance', 'Tech', 'True Crime', 'Business', 'AI Tools', 'Motivation', 'Other'].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Primary Language</label>
              <select 
                value={settings.workspace.language}
                onChange={(e) => updateSetting('workspace', 'language', e.target.value)}
                className="w-full bg-vy-surface border border-vy-border rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
              >
                {['English', 'Hindi', 'Telugu', 'Tamil', 'Mixed'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Target Region</label>
              <select 
                value={settings.workspace.region}
                onChange={(e) => updateSetting('workspace', 'region', e.target.value)}
                className="w-full bg-vy-surface border border-vy-border rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
              >
                {['India', 'Global', 'US', 'Southeast Asia'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Upload Frequency</label>
              <select 
                value={settings.workspace.frequency}
                onChange={(e) => updateSetting('workspace', 'frequency', e.target.value)}
                className="w-full bg-vy-surface border border-vy-border rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
              >
                {['Daily', '3x/week', '2x/week', 'Weekly', 'Irregular'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 2: AI PREFERENCES */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-[0.2em] whitespace-nowrap">AI PREFERENCES</div>
            <div className="h-[1px] flex-1 bg-vy-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Default Viral Score Threshold</label>
                <span className="font-mono text-[10px] text-vy-accent font-black">{(settings?.ai?.viralThreshold || 7.5).toFixed(1)} minimum</span>
              </div>
              <input 
                type="range" min="6.0" max="10.0" step="0.1"
                value={settings.ai.viralThreshold}
                onChange={(e) => updateSetting('ai', 'viralThreshold', parseFloat(e.target.value))}
                className="w-full accent-vy-accent bg-white/5 h-1 rounded-full outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1 block mb-2">Response Style</label>
              <div className="flex bg-vy-surface p-1 border border-vy-border rounded-xl">
                {['CONCISE', 'DETAILED'].map(s => (
                  <button 
                    key={s}
                    onClick={() => updateSetting('ai', 'responseStyle', s)}
                    className={cn(
                      "flex-1 py-2 rounded-lg font-mono text-[10px] font-black tracking-widest transition-all",
                      settings.ai.responseStyle === s ? "bg-vy-accent text-white shadow-lg" : "text-vy-muted hover:text-white"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-vy-surface border border-vy-border rounded-xl">
              <div className="space-y-0.5">
                <label className="font-display font-bold text-xs text-white uppercase tracking-wide">Auto-generate Examples</label>
                <p className="text-[10px] text-vy-muted font-medium">Show welcome state live examples</p>
              </div>
              <button 
                onClick={() => updateSetting('ai', 'autoGenerateExamples', !settings.ai.autoGenerateExamples)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-300",
                  settings.ai.autoGenerateExamples ? "bg-vy-accent shadow-[0_0_15px_rgba(232,84,42,0.4)]" : "bg-vy-border"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                  settings.ai.autoGenerateExamples ? "left-7 shadow-lg" : "left-1"
                )} />
              </button>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Language for AI outputs</label>
              <select 
                value={settings.ai.outputLanguage}
                onChange={(e) => updateSetting('ai', 'outputLanguage', e.target.value)}
                className="w-full bg-vy-surface border border-vy-border rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
              >
                {['English', 'Hindi', 'Hinglish', 'Telugu', 'Tamil', 'Spanish', 'French', 'German'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Script Style</label>
              <select 
                value={settings.ai.scriptStyle || 'STORYTELLER'}
                onChange={(e) => updateSetting('ai', 'scriptStyle', e.target.value)}
                className="w-full bg-vy-surface border border-vy-border rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
              >
                {['STORYTELLER', 'TECHNICAL', 'HYPER-GROWTH', 'CINEMATIC', 'MINIMALIST'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 3: APPEARANCE */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-[0.2em] whitespace-nowrap">APPEARANCE</div>
            <div className="h-[1px] flex-1 bg-vy-border" />
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'VOID', label: 'VOID', color: '#03050a' },
                { id: 'MIDNIGHT', label: 'MIDNIGHT', color: '#050a14' },
                { id: 'CARBON', label: 'CARBON', color: '#000000' }
              ].map(t => (
                <div 
                  key={t.id}
                  onClick={() => updateSetting('appearance', 'theme', t.id as any)}
                  className={cn(
                    "p-4 bg-vy-surface border-2 rounded-2xl cursor-pointer transition-all group relative overflow-hidden",
                    settings.appearance.theme === t.id ? "border-vy-accent" : "border-vy-border hover:border-white/20"
                  )}
                >
                  <div className="w-full h-12 rounded-lg mb-3 border border-white/5" style={{ backgroundColor: t.color }} />
                  <div className="font-mono text-[10px] font-black text-white tracking-widest uppercase">{t.label}</div>
                  {t.id !== 'VOID' && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="font-mono text-[8px] text-vy-accent font-bold tracking-widest">COMING SOON</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1">Accent Color</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: 'Orange', hex: '#e8542a' },
                  { name: 'Cyan', hex: '#00c8ff' },
                  { name: 'Violet', hex: '#8b5cf6' },
                  { name: 'Green', hex: '#22d3a0' },
                  { name: 'Red', hex: '#ef4444' }
                ].map(c => (
                  <button 
                    key={c.name}
                    onClick={() => updateSetting('appearance', 'accentColor', c.hex)}
                    className={cn(
                      "w-12 h-12 rounded-full border-4 transition-all hover:scale-110",
                      settings.appearance.accentColor === c.hex ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "border-transparent"
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] text-vy-muted uppercase tracking-widest ml-1 block mb-2">Sidebar Width</label>
              <div className="flex bg-vy-surface p-1 border border-vy-border rounded-xl max-w-sm">
                {['COMPACT', 'NORMAL', 'WIDE'].map(w => (
                  <button 
                    key={w}
                    onClick={() => updateSetting('appearance', 'sidebarWidth', w as any)}
                    className={cn(
                      "flex-1 py-2 rounded-lg font-mono text-[10px] font-black tracking-widest transition-all",
                      settings.appearance.sidebarWidth === w ? "bg-vy-accent text-white shadow-lg" : "text-vy-muted hover:text-white"
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: NODE VISIBILITY */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-[0.2em] whitespace-nowrap">NODE VISIBILITY — Show/hide nodes from sidebar</div>
            <div className="h-[1px] flex-1 bg-vy-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NODES.map(node => (
              <div key={node.id} className="flex items-center justify-between p-4 bg-vy-surface border border-vy-border rounded-xl">
                <div className="flex items-center gap-3">
                  <node.icon className="w-4 h-4 text-vy-accent" />
                  <span className="font-display font-bold text-xs text-white uppercase tracking-wide">{node.label}</span>
                  <span className="text-vy-accent">●</span>
                </div>
                <button 
                  onClick={() => {
                    const newVis = { ...settings.visibility, [node.id]: !settings.visibility[node.id as keyof NodeVisibility] };
                    updateSetting('appearance', '', ''); // Just to trigger state update if needed, better to have a direct setter
                    onUpdate({ ...settings, visibility: newVis });
                  }}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-300",
                    settings.visibility[node.id as keyof NodeVisibility] ? "bg-vy-accent shadow-[0_0_15px_rgba(232,84,42,0.4)]" : "bg-vy-border"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                    settings.visibility[node.id as keyof NodeVisibility] ? "left-7 shadow-lg" : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-vy-muted uppercase tracking-widest">Warning note: Hiding a node only affects display. Your data is not deleted.</p>
        </section>

        {/* SECTION 5: EXPORT & DATA */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-[0.2em] whitespace-nowrap">EXPORT & DATA</div>
            <div className="h-[1px] flex-1 bg-vy-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => {
                navigator.clipboard.writeText("VYREX Session History Export...");
                handleSave();
              }}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-vy-surface border border-vy-border rounded-2xl hover:border-vy-accent transition-all group"
            >
              <Copy className="w-6 h-6 text-vy-muted group-hover:text-vy-accent" />
              <span className="font-display font-black text-[9px] text-white uppercase tracking-widest">EXPORT SESSION HISTORY</span>
            </button>
            <button 
              onClick={() => {
                window.location.reload();
              }}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-vy-surface border border-red-500/30 rounded-2xl hover:border-red-500 transition-all group"
            >
              <Trash2 className="w-6 h-6 text-red-400 group-hover:text-red-500" />
              <span className="font-display font-black text-[9px] text-red-500 uppercase tracking-widest">CLEAR ALL SESSION DATA</span>
            </button>
            <button 
              onClick={() => {
                const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'vyrex-config.txt';
                a.click();
              }}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-vy-surface border border-vy-border rounded-2xl hover:border-vy-accent transition-all group"
            >
              <Download className="w-6 h-6 text-vy-muted group-hover:text-vy-accent" />
              <span className="font-display font-black text-[9px] text-white uppercase tracking-widest">DOWNLOAD VYREX CONFIG</span>
            </button>
          </div>
        </section>

        {/* SECTION 6: ABOUT */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-[0.2em] whitespace-nowrap">ABOUT VYREX</div>
            <div className="h-[1px] flex-1 bg-vy-border" />
          </div>
          <div className="p-8 bg-vy-surface border border-vy-border rounded-3xl space-y-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="font-mono text-[8px] text-vy-muted uppercase mb-1">Version</div>
                  <div className="text-xs font-bold text-white tracking-wide">VYREX v2.0 — Intelligence Layer</div>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-vy-muted uppercase mb-1">Build</div>
                  <div className="text-xs font-bold text-white tracking-wide">Production · April 2026</div>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-vy-muted uppercase mb-1">Stack</div>
                  <div className="text-xs font-bold text-white tracking-wide">Neural Core · React · Vyrex API</div>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-vy-muted uppercase mb-1">Nodes Active</div>
                  <div className="text-xs font-bold text-white tracking-wide">{Object.values(settings.visibility).filter(Boolean).length} / 8</div>
                </div>
             </div>
             <p className="font-display italic text-lg text-[#6a8a9a] text-center pt-4">"Built for YouTube creators who play to win."</p>
          </div>
        </section>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50">
        <button 
          onClick={handleSave}
          className="w-full py-5 bg-gradient-to-r from-vy-accent to-vy-accent2 text-white font-display font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-2xl shadow-vy-accent/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {saveStatus || 'SAVE CONFIGURATION'}
        </button>
      </div>
    </div>
  );
};

const isIndian = typeof navigator !== 'undefined' && (
  navigator.language === 'en-IN' || 
  Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Calcutta') ||
  Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Kolkata')
);

const currency = isIndian ? 'INR' : 'USD';

const PricingPage = ({ onBack, currentCredits, onSelectPlan, onTopUp, currentPlan, isProcessing }: { 
  onBack: () => void, 
  currentCredits: number,
  onSelectPlan: (planId: string) => void,
  onTopUp: (amount: number) => void,
  currentPlan?: string,
  isProcessing?: boolean
}) => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      id: 'spark',
      name: 'SPARK',
      tagline: 'Get your bearings in the lab.',
      price: isIndian ? '₹0' : '$0',
      period: '/ month',
      credits: '50 Credits',
      creditMsg: 'Refilled every month',
      features: [
        'All 8 Intelligence Nodes',
        'Basic Viral Strategy access',
        'Standard processing speed',
        '3 Intel Chat threads',
        'Watermarked outputs',
      ],
      cta: 'Current Tier',
      variant: 'outline'
    },
    {
      id: 'creator',
      name: 'CREATOR',
      tagline: 'The sweet spot for growth.',
      price: isYearly 
        ? (isIndian ? '₹3,999' : '$79') 
        : (isIndian ? '₹499' : '$9'),
      period: isYearly ? '/ year' : '/ month',
      savings: isYearly ? (isIndian ? 'Save ₹1,989/year' : 'Save $29/year') : null,
      credits: '500 Credits',
      creditMsg: 'Refilled every month',
      featured: true,
      features: [
        'Everything in Spark Tier',
        'Unlimited Intel Chat threads',
        'No watermarks on assets',
        'Priority Node processing',
        '30-day Managed History',
        '1:1 Creator Strategy Support',
      ],
      cta: 'BUY CREATOR PLAN',
      variant: 'filled-orange'
    },
    {
      id: 'empire',
      name: 'EMPIRE',
      tagline: 'Scale without boundaries.',
      price: isYearly 
        ? (isIndian ? '₹11,999' : '$229') 
        : (isIndian ? '₹1,499' : '$29'),
      period: isYearly ? '/ year' : '/ month',
      credits: '2,000 Credits',
      creditMsg: 'Refilled every month',
      features: [
        'Everything in Creator Tier',
        'Advanced Competitor Spy',
        '5 Dedicated Workspaces',
        'Custom AI Brand Memory',
        'Discord Priority Support',
        'API Access (Coming Soon)',
      ],
      cta: 'BUY EMPIRE PASS',
      variant: 'filled-violet'
    }
  ];

  return (
    <div className="min-h-screen bg-[#03050a] text-vy-white py-16 px-4 md:py-24 md:px-8 animate-fade-in relative overflow-x-hidden">
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center space-y-8"
          >
             <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-vy-accent/20 border-t-vy-accent animate-spin" />
                <Flame className="absolute inset-0 m-auto w-8 h-8 text-vy-accent animate-pulse" />
             </div>
             <div className="text-center space-y-2">
                <h3 className="font-display font-black text-2xl text-white uppercase italic tracking-tighter">Initializing Secure Checkout</h3>
                <p className="text-vy-muted font-medium animate-pulse">Contacting lab uplink protocols...</p>
             </div>
             <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-vy-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-vy-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-vy-accent animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-vy-accent/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-vy-accent2/5 blur-[120px] rounded-full" />
      </div>

      <div className="absolute top-6 left-6 md:top-12 md:left-12 z-20">
         <button 
           onClick={onBack}
           className="flex items-center gap-3 text-vy-muted hover:text-white transition-all group px-4 py-2 bg-vy-surface/40 border border-vy-border rounded-full backdrop-blur-md"
         >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display font-black text-[10px] uppercase tracking-[0.2em]">Return to Lab</span>
         </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-vy-accent/10 border border-vy-accent/20 rounded-full mb-2">
             <Rocket className="w-3 h-3 text-vy-accent" />
             <span className="text-[9px] font-black text-vy-accent uppercase tracking-widest">Select your gear</span>
           </div>
           <h1 className="font-display font-black text-[clamp(28px,6vw,56px)] text-white uppercase italic leading-[1.05] tracking-tighter">
             Plan your scaling.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-vy-accent to-vy-accent2">Direct Purchase Options.</span>
           </h1>
           <p className="font-display font-medium text-base md:text-lg text-vy-muted px-4 max-w-2xl mx-auto">
             Select a plan to initiate checkout. Instant activation via secure processing.
           </p>

           {/* Toggle */}
           <div className="flex items-center justify-center gap-4 pt-6">
              <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", !isYearly ? "text-white" : "text-vy-muted")}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="w-12 h-6 bg-vy-surface rounded-full p-1 border border-vy-border relative"
              >
                 <motion.div 
                   animate={{ x: isYearly ? 24 : 0 }}
                   className="w-4 h-4 bg-vy-accent rounded-full shadow-[0_0_10px_rgba(232,84,42,0.5)]"
                 />
              </button>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", isYearly ? "text-white" : "text-vy-muted")}>Yearly</span>
                <span className="px-2 py-0.5 bg-vy-green/10 border border-vy-green/20 rounded text-[8px] font-black text-vy-green uppercase tracking-tighter">SAVE 33%</span>
              </div>
           </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
           {plans.map((plan, index) => {
             const isCurrent = plan.id === (currentPlan || 'spark');
             return (
               <motion.div 
                 key={plan.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className={cn(
                   "relative flex flex-col p-8 md:p-10 rounded-[32px] bg-[#080d18] border transition-all duration-500",
                   plan.featured 
                     ? "border-vy-accent shadow-[0_30px_60px_-12px_rgba(232,84,42,0.15)] lg:scale-[1.05] z-10" 
                     : "border-white/5 shadow-2xl shadow-black/50",
                   isCurrent && "ring-2 ring-vy-green/50 ring-offset-4 ring-offset-[#03050a]"
                 )}
               >
                  {plan.featured && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                      <div className="px-6 py-2 bg-gradient-to-r from-vy-accent to-vy-accent2 text-white font-display font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-xl shadow-vy-accent/30 animate-bounce">
                        SECURE CHECKOUT
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={cn(
                        "font-display font-black text-2xl uppercase italic tracking-tight",
                        plan.id === 'creator' ? "text-vy-accent" : plan.id === 'empire' ? "text-violet-400" : "text-white"
                      )}>{plan.name}</h3>
                      {isCurrent && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-vy-green/10 border border-vy-green/20 rounded text-[8px] font-black text-vy-green uppercase">
                          ACTIVE
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-vy-muted font-medium mb-6">{plan.tagline}</p>
                    
                    <div className="flex items-baseline gap-1.5 mb-2">
                       <span className="text-4xl font-display font-black text-white">{plan.price}</span>
                       <span className="text-vy-muted font-bold text-xs uppercase tracking-tight">{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <div className="text-[10px] font-black text-vy-green uppercase tracking-widest">{plan.savings}</div>
                    )}
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl mb-8">
                    <div className="text-[10px] font-black text-vy-muted uppercase tracking-[0.2em] mb-1 opacity-50">Monthly Allocation</div>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-display font-black text-white italic">{plan.credits}</div>
                      <div className="text-[9px] font-bold text-vy-accent uppercase tracking-tighter">{plan.creditMsg}</div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                     {plan.features.map((feature, i) => (
                       <li key={i} className="flex gap-3 items-center">
                          <div className="w-4 h-4 rounded-full bg-vy-green/10 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-vy-green" strokeWidth={3} />
                          </div>
                          <span className="text-xs font-medium text-vy-muted group-hover:text-white transition-colors capitalize">
                            {feature}
                          </span>
                       </li>
                     ))}
                  </ul>

                  <div className="space-y-4">
                    <button 
                      onClick={() => !isCurrent && onSelectPlan(plan.id)}
                      disabled={isCurrent}
                      className={cn(
                        "w-full py-5 rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] transition-all relative overflow-hidden group/btn",
                        plan.variant === 'filled-orange' 
                          ? "bg-vy-accent text-white shadow-xl shadow-vy-accent/20 hover:shadow-vy-accent/40 active:scale-95" 
                          : plan.variant === 'filled-violet'
                          ? "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white shadow-xl shadow-[#8b5cf6]/20 active:scale-95"
                          : "border border-white/20 text-white hover:bg-white/5 active:scale-95",
                        isCurrent && "opacity-50 cursor-default pointer-events-none grayscale"
                      )}
                    >
                       <span className="relative z-10">{isCurrent ? 'Current Plan' : plan.cta}</span>
                       {!isCurrent && (
                         <motion.div 
                           className="absolute inset-0 bg-white/10 translate-y-full transition-transform group-hover/btn:translate-y-0"
                           initial={false}
                         />
                       )}
                    </button>
                    
                    {!isCurrent && (
                      <div className="flex items-center justify-center gap-3 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                        <div className="w-6 h-4 bg-white/10 rounded flex items-center justify-center text-[6px] font-black">VISA</div>
                        <div className="w-6 h-4 bg-white/10 rounded flex items-center justify-center text-[6px] font-black">MC</div>
                        <div className="w-6 h-4 bg-white/10 rounded flex items-center justify-center text-[6px] font-black uppercase">UPI</div>
                      </div>
                    )}
                  </div>
               </motion.div>
             );
           })}
        </div>

        {/* Founding Member (Sticky/Featured CTA) */}
        <div className="pt-12">
          <section className="bg-gradient-to-br from-[#080d18] to-[#0a0f20] border border-vy-accent/30 rounded-[40px] p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform rotate-12 transition-transform duration-1000 group-hover:rotate-6">
               <Crown className="w-64 h-64 text-vy-accent" />
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
               <div className="flex-1 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-vy-accent/10 border border-vy-accent/20 rounded-full">
                    <Flame className="w-3 h-3 text-vy-accent animate-pulse" />
                    <span className="text-[9px] font-black text-vy-accent uppercase tracking-widest">One-time Buy Option</span>
                  </div>
                  <h4 className="font-display font-black text-3xl md:text-4xl text-white uppercase italic leading-tight tracking-tighter">
                    Lifetime Buyout Out.<br/>
                    <span className="text-vy-accent">Founding Membership</span> is active.
                  </h4>
                  <p className="text-vy-muted font-medium text-sm md:text-base max-w-xl mx-auto lg:mx-0">
                    Buy once, keep forever. Skip all future subscription fees and get permanent Creator status injected into your laboratory profile.
                  </p>
                  <div className="flex items-center gap-4 justify-center lg:justify-start">
                     <span className="text-3xl font-display font-black text-white">{isIndian ? '₹2,999' : '$49'}</span>
                     <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                        347/500 SLOTS REMAINING
                     </span>
                  </div>
               </div>
               
               <button 
                  onClick={() => onSelectPlan('founding')}
                  className="px-10 py-6 bg-vy-accent text-white font-display font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-vy-accent/30 hover:-translate-y-1 hover:shadow-vy-accent/50 active:scale-95 transition-all whitespace-nowrap"
               >
                  CLAIM YOUR SLOT →
               </button>
            </div>

            {/* Glowing lines */}
            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-vy-accent to-transparent opacity-50" />
            <div className="absolute -top-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
          </section>
        </div>

        {/* Credit Top-up (Cards) */}
        <section className="space-y-12">
           <div className="text-center space-y-2">
              <h2 className="font-display font-black text-3xl text-white uppercase italic tracking-tighter">Instant Buy Credits</h2>
              <p className="text-vy-muted font-medium">Out of credits? Fuel your engine immediately with a one-time purchase.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { amount: 100, price: isIndian ? '₹99' : '$1.99', label: 'STARTER PACK', color: 'text-vy-cyan' },
                { amount: 500, price: isIndian ? '₹399' : '$7.99', label: 'CREATOR BUNDLE', popular: true, color: 'text-vy-green' },
                { amount: 1000, price: isIndian ? '₹699' : '$13.99', label: 'EMPIRE FUEL', color: 'text-violet-400' },
              ].map((pack) => (
                <div key={pack.amount} className="bg-white/5 border border-white/10 p-10 rounded-[32px] text-center space-y-8 hover:bg-white/[0.08] transition-all relative group">
                   {pack.popular && (
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-vy-green text-black font-display font-black text-[8px] uppercase rounded-full shadow-lg shadow-vy-green/20">
                       POPULAR BUY
                     </div>
                   )}
                   <div className="space-y-1">
                      <div className="font-display font-black text-5xl text-white italic tracking-tighter leading-none">{pack.amount}</div>
                      <div className={cn("font-mono text-[10px] font-bold uppercase tracking-[0.2em]", pack.color)}>Credits</div>
                   </div>
                   <div className="text-2xl font-display font-black text-white leading-none">{pack.price}</div>
                   <button 
                      onClick={() => onTopUp(pack.amount)}
                      className="w-full py-4 border border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-black group-hover:scale-105"
                   >
                      BUY NOW
                   </button>
                   <div className="flex items-center justify-center gap-2 opacity-30 mt-2">
                     <ShieldCheck className="w-3 h-3" />
                     <span className="text-[7px] font-black uppercase">One-time Buy</span>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Trust Signals */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 py-10 opacity-30">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-display font-black text-[10px] uppercase tracking-[0.2em]">Secured by Lab Protocols</span>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6" />
            <span className="font-display font-black text-[10px] uppercase tracking-[0.2em]">Instant Credit Injection</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-6 h-6" />
            <span className="font-display font-black text-[10px] uppercase tracking-[0.2em]">Verified Creator Toolset</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpgradeModal = ({ onUpgrade }: { onUpgrade: () => void }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#03050a]/95 backdrop-blur-xl animate-fade-in">
       <div className="max-w-4xl w-full text-center space-y-12 animate-fade-up">
          <div className="space-y-4">
             <h2 className="font-display font-black text-5xl md:text-7xl text-vy-accent uppercase italic leading-none tracking-tighter">
               ⚡ OUT OF CREDITS
             </h2>
             <p className="font-display font-medium text-xl text-vy-muted">
               Upgrade to keep the intelligence flowing.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-8 bg-[#080d18] border border-white/5 rounded-3xl space-y-4 hover:border-vy-white/20 transition-all cursor-pointer group" onClick={onUpgrade}>
                <div className="font-mono text-[10px] text-vy-muted uppercase">SPARK</div>
                <div className="text-3xl font-display font-black text-white italic">FREE</div>
                <div className="text-[10px] font-bold text-vy-cyan uppercase">50 CR / MO</div>
             </div>
             <div className="p-8 bg-[#080d18] border border-vy-accent rounded-3xl space-y-4 scale-105 shadow-2xl shadow-vy-accent/10 cursor-pointer" onClick={onUpgrade}>
                <div className="font-mono text-[10px] text-vy-accent uppercase">CREATOR</div>
                <div className="text-3xl font-display font-black text-white italic">{isIndian ? '₹499' : '$9'}</div>
                <div className="text-[10px] font-bold text-vy-green uppercase">500 CR / MO</div>
             </div>
             <div className="p-8 bg-[#080d18] border border-white/5 rounded-3xl space-y-4 hover:border-vy-white/20 transition-all cursor-pointer group" onClick={onUpgrade}>
                <div className="font-mono text-[10px] text-vy-muted uppercase text-[#8b5cf6]">EMPIRE</div>
                <div className="text-3xl font-display font-black text-white italic">{isIndian ? '₹1,499' : '$29'}</div>
                <div className="text-[10px] font-bold text-[#8b5cf6] uppercase">2000 CR / MO</div>
             </div>
          </div>

          <button 
            onClick={onUpgrade}
            className="font-mono text-[10px] font-black text-vy-cyan uppercase tracking-[0.4em] hover:text-vy-white transition-colors"
          >
            TOP UP INSTEAD →
          </button>
       </div>
    </div>
  );
};

const NodeOutput = ({ node, data, isExample }: { node: Mode; data: any; isExample?: boolean }) => {
  // Use a key to trigger animations on new data
  const renderKey = React.useMemo(() => JSON.stringify(data), [data]);
  
  return (
    <div key={renderKey} className="space-y-6">
      {(() => {
        const nodeLabel = nodeLiveLabels[node] || node.toUpperCase();
        return (
          <>
            {isExample && (
              <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-center gap-3">
                  <div className="pulse-dot" />
                  <span className="font-mono text-[9px] text-vy-green font-bold uppercase tracking-widest leading-none">LIVE EXAMPLE — {nodeLabel}</span>
                </div>
                <div style={{
                  fontFamily:'JetBrains Mono, monospace',
                  fontSize:'9px', color:'#3a4a5a',
                  letterSpacing:'0.15em', marginTop:'4px'
                }}>
                  {node === 'asset_forge' ? 'ENTER YOUR TOPIC BELOW TO GENERATE REAL ASSETS' : 'ENTER YOUR INTERESTS BELOW TO GENERATE REAL INTELLIGENCE'}
                </div>
              </div>
            )}
            {(() => {
              switch (node) {
                case 'viral': return <ViralStrategistRenderer data={data} isExample={isExample} />;
                case 'hook': return <HookAnalyzerRenderer data={data} isExample={isExample} />;
                case 'competitor': return <CompetitorSpyRenderer data={data} isExample={isExample} />;
                case 'monetization': return <MonetizationMapRenderer data={data} isExample={isExample} />;
                case 'title_forge': return <TitleForgeRenderer data={data} />;
                case 'launchpad': return <ChannelLaunchpadRenderer data={data} isExample={isExample} />;
                case 'asset_forge': return <AssetForgeRenderer data={data} isExample={isExample} />;
                default: return null;
              }
            })()}
          </>
        );
      })()}
    </div>
  );
};

const CardHeader = ({ icon: Icon, title, right }: { icon: any; title: string; right?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b border-vy-border">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-vy-accent/10 rounded-lg">
        {typeof Icon === 'string' ? <span className="text-sm">{Icon}</span> : <Icon className="w-3.5 h-3.5 text-vy-accent fill-current" />}
      </div>
      <h4 className="font-display text-xs font-black text-vy-white uppercase tracking-wider">{title}</h4>
    </div>
    {right}
  </div>
);

