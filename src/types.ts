export interface ScoreHistoryItem {
  title: string;
  score: number;
  timestamp: string;
}

export interface SwipeFileItem {
  id: string;
  node: Mode;
  title: string;
  data: any;
  timestamp: number;
}

export type Mode = 'launchpad' | 'intelchat' | 'viral' | 'hook' | 'competitor' | 'monetization' | 'title_forge' | 'asset_forge' | 'settings' | 'pricing';

export type AuthState = 'landing' | 'signing-in' | 'authenticated' | 'app';

export interface WorkspaceSettings {
  channelName: string;
  niche: string;
  language: string;
  region: string;
  frequency: string;
}

export interface AiPreferences {
  viralThreshold: number;
  responseStyle: 'CONCISE' | 'DETAILED';
  autoGenerateExamples: boolean;
  outputLanguage: string;
}

export interface AppearanceSettings {
  theme: 'VOID' | 'MIDNIGHT' | 'CARBON';
  accentColor: string;
  sidebarWidth: 'COMPACT' | 'NORMAL' | 'WIDE';
}

export interface NodeVisibility {
  launchpad: boolean;
  asset_forge: boolean;
  intelchat: boolean;
  viral: boolean;
  hook: boolean;
  competitor: boolean;
  monetization: boolean;
  title_forge: boolean;
}

export interface VyrexSettings {
  workspace: WorkspaceSettings;
  ai: AiPreferences;
  appearance: AppearanceSettings;
  visibility: NodeVisibility;
}

export interface AssetForgeResult {
  videoTitle: string;
  seoVariants: string[];
  openingHook: string;
  scriptOutline: {
    section: number;
    title: string;
    duration: string;
    purpose: string;
    keyPoints: string[];
    transitionLine: string;
  }[];
  thumbnailBrief: {
    mainText: string;
    emotion: string;
    layout: string;
    colorPalette: string[];
    referenceStyle: string;
  };
  voiceoverGuide: {
    recommendedVoice: string;
    speed: string;
    tone: string;
    emphasisWords: string[];
    emotionalArc: string;
  };
  stockFootage: {
    openingShots: string[];
    sectionTerms: {
      section: number;
      terms: string[];
    }[];
    styleGuide: string;
    avoidTerms: string[];
  };
  musicDirection: {
    intro: string;
    build: string;
    outro: string;
    avoidGenres: string[];
  };
  uploadChecklist: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string; // Used for raw text or status messages
  data?: any; // The parsed JSON from Gemini
  imageUrl?: string;
  timestamp: number;
}

export interface ViralStrategistResult {
  videoTitle: string;
  viralScore: number;
  hook: string;
  miniScript: string;
  thumbnailStrategy: {
    mainText: string;
    emotion: string;
    visualConcept: string;
    bgGradient?: string;
  };
  tags: string[];
  uploadTiming: string;
  competitorGap: string;
}

export interface HookAnalyzerResult {
  ctrScore: number;
  psychologyBreakdown: {
    primaryTrigger: string;
    curiosityGap: number;
    urgency: number;
    specificity: number;
    emotionalCharge: number;
  };
  weaknesses: string[];
  rewrites: {
    version: 'Shock' | 'Curiosity' | 'Authority';
    title: string;
  }[];
  verdict: string;
}

export interface CompetitorSpyResult {
  channelProfile: {
    contentPillars: string[];
    uploadPattern: string;
    thumbnailStyle: string;
    hookFormula: string;
  };
  topContentPatterns: {
    pattern: string;
    whyItWorks: string;
  }[];
  contentGaps: string[];
  cloneStrategy: string;
  cloneDifficulty: number;
  cloneVerdict: string;
  firstVideoIdea: {
    title: string;
    angle: string;
  };
}

export interface MonetizationMapResult {
  estimatedMonthlyRevenue: {
    adSense: string;
    totalPotential: string;
  };
  revenueStreams: {
    name: string;
    type: 'Active' | 'Passive' | 'Scalable';
    potentialMonthly: string;
    effort: 'Low' | 'Medium' | 'High';
    implementation: string;
  }[];
  quickWin: string;
  longTermAsset: string;
  warningZones: string[];
}

export interface TitleForgeResult {
  videoCore: string;
  titles: {
    rank: number;
    title: string;
    psychTrigger: string;
    predictedCTR: string;
    ctrScore: number;
    seoKeyword: string;
    thumbnailText: string;
    why: string;
    bestFor: string;
  }[];
  abTestPairs: {
    pairLabel: string;
    titleA: string;
    titleB: string;
    recommendation: string;
  }[];
  descriptionOpener: string;
  avoidMistakes: string[];
}

export interface ChannelLaunchpadResult {
  nicheRecommendations: {
    nicheName: string;
    nicheScore: number;
    demandLevel: 'Explosive' | 'High' | 'Medium' | 'Emerging';
    competitionLevel: 'Red Ocean' | 'Competitive' | 'Moderate' | 'Blue Ocean';
    avgRPM: string;
    whyItWorks: string;
    biggestRisk: string;
    timeToMonetization: string;
  }[];
  recommendedNiche: string;
  competitionLandscape: {
    topChannels: {
      channelName: string;
      estimatedSubs: string;
      whatTheyDoWell: string;
      theirWeakness: string;
    }[];
    overallSaturation: string;
    newCreatorAdvantage: string;
  };
  audienceProfile: {
    primaryAge: string;
    gender: string;
    psychographics: string[];
    painPoints: string[];
    watchingHabits: string;
    whatMakesThemSubscribe: string;
  };
  differentiationAngle: {
    uniquePositioning: string;
    contentPersonality: string;
    visualIdentity: string;
    tagline: string;
  };
  channelNameIdeas: {
    name: string;
    reason: string;
  }[];
  first10VideoIdeas: {
    order: number;
    title: string;
    type: 'Long-form' | 'Short' | 'Both';
    viralScore: number;
    whyFirst: string;
    hook: string;
  }[];
  launchRoadmap: {
    week1: string;
    week2to4: string;
    month2to3: string;
    month4to6: string;
  };
  survivalWarnings: string[];
  readinessScore: {
    score: number;
    verdict: string;
    strengthSignal: string;
    gapToFill: string;
  };
}
