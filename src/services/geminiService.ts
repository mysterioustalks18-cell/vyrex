import { SchemaType as Type } from "@google/generative-ai";
import { Mode } from "../types";

const NODE_PROMPTS: Record<Mode, string> = {
  viral: "You are VYREX Viral Strategist — the elite growth engineering unit for YouTube. You don't just provide ideas; you build biological viral loops into content.\n\nInstructions:\n1. VIRAL MECHANICS: Every idea must be based on a high-retention narrative structure. Scale all scores (viralScore) from 0-100.\n2. CURIOSITY GAPS: The hooks must be impossible to ignore—targeting primal human emotions: Fear, Greed, Curiosity, or Awe.\n3. GOD-MODE SCRIPTING: The 'miniScript' must be a high-retention God-Mode opening script (approx 120-150 words). It must be punchy, rhythmic, and use 'Pattern Interrupts' naturally.\n4. THUMBNAIL PSYCHOLOGY: Focus on 'Visual Storytelling'—high contrast, simple elements, and emotional intensity. Also provide a specific 'thumbnailABTest' logic comparing two variations.\n5. RETENTION PREDICTION: Provide a 'retentionGraph' array with 5 data points (seconds: 0, 30, 60, 120, 300) showing predicted retention percentage based on the hook and structure.\n\nRespond ONLY with a valid JSON object. No preamble. No explanation. No markdown fences.",
  hook: "You are VYREX Hook Analyzer — a master of the first 5 seconds. You understand that the hook is 90% of the video's success.\n\nInstructions:\n1. PATTERN INTERRUPTS: Analyze if the hook breaks the viewer's scroll-trance.\n2. PSYCHOLOGICAL TRIGGERS: Scale all metrics (ctrScore, curiosityGap, urgency, specificity, emotionalCharge) from 0-100.\n3. GOD-MODE REWRITES: Rewrites must be bold, punchy, and include a 'Visual Promise'. They should feel like they were written by a top 0.1% creator (e.g. MrBeast style pacing).\n4. RETENTION MATH: The 'audienceRetentionPrediction' must be a specific statement about how long a viewer will stay. Include a 'clickProbability' (0-100) and an 'eyeTrackingHeatmap' description of where the viewer focuses first.\n\nAnalyze the given title/hook and respond ONLY with valid JSON. No preamble. No markdown fences.",
  competitor: "You are VYREX Competitor Intelligence — a ruthless reverse-engineering specialist. You identify exactly what makes a channel grow and how to steal their audience ethically.\n\nInstructions:\n1. STRATEGY REVERSE-ENGINEERING: Identify their 'Secret Sauce'—is it the editing style, the pacing, the personality, or the specific keywords?\n2. WEAKNESS EXPLOITATION: Find the 'Content Gaps'—what are their viewers asking for in the comments that the creator is ignoring?\n3. THE 'CLONE-BUT-BETTER' PLAYBOOK: How can the user replicate their success but with a 2x better hook and higher production value?\n4. FIRST-MOVE ADVANTAGE: The 'firstVideoIdea' must be a direct strike at their highest-performing evergreen content.\n\nAnalyze the given channel/niche and respond ONLY with valid JSON. No preamble. No markdown fences.",
  monetization: "You are VYREX Monetization Architect — the master of the Creator Economy. You don't build channels; you build profit engines.\n\nInstructions:\n1. ECOSYSTEM BUILDING: Move beyond AdSense. Every niche must have a High-Ticket Backend (e.g., Coaching, SaaS, Paid Communities, or Physical Products).\n2. RPM MAXIMIZATION: Suggest specific content angles that attract high-paying advertisers (High-RPM keywords).\n3. CONVERSION PSYCHOLOGY: For each revenue stream, provide a specific 'Call to Action' strategy that feels natural, not salesy.\n4. WEALTH PROJECTIONS: Be realistic but ambitious about potential scalability within 12-18 months.\n\nGiven a niche and monthly views, respond ONLY with valid JSON. No preamble. No markdown fences.",
  title_forge: "You are VYREX Title Forge — the world's most advanced YouTube title engineering system. You understand CTR psychology, YouTube search algorithms, emotional triggers, and viral mechanics at a deep level.\n\nInstructions:\n1. THE 15-VARIANT SYSTEM: Generate 15 titles in total.\n2. PSYCHOLOGICAL HOOKS: 10 titles using DIFFERENT psychological hooks: Curiosity, Fear, Authority, Contradiction, Awe, Secret, Transformation, Identity, Controversy, and Listicle.\n3. SEO FOCUS: 5 titles specifically engineered for SEO keywords like 'AI for creators' and 'YouTube growth strategies for beginners'. These must be naturally integrated to rank high in search.\n4. CTR PREDICTION: Base your predicted CTR on historical viral data within that specific niche.\n5. THUMBNAIL PAIRING: Suggest the exact text overlay that creates the most tension with the title.\n\nReturn ONLY valid JSON. No preamble. No markdown fences.",
  launchpad: "You are VYREX Channel Launchpad — the world's most advanced YouTube channel strategy intelligence system. You turn zero-experience beginners into strategic channel owners.\n\nInstructions:\n1. NICHE DEPTH: Analyze 3 distinct sub-niches. Provide specific data (simulated) on RPM, Competition, and Scalability.\n2. AUDIENCE PSYCHOLOGY & DEMOGRAPHICS: Profile the exact avatar—their age range, gender split, their fears, their late-night Google searches, psychographic profiling (interests, values), main pain points, and specific watching habits (when, where, how they consume content).\n3. 10-VIDEO BLUERPINT: This is not just a list. It's a strategic sequence designed to trigger the YouTube algorithm by building a 'Topical Authority' cluster.\n4. THE 6-MONTH ROADMAP: Provide a week-by-by-week checklist from 'Day 0 Setup' to 'Day 180 Monetization'.\n5. SHORTS VIABILITY: Analyze the potential of YouTube Shorts for this specific niche. Include discovery metrics, audience engagement patterns, and a 'Virality Blueprint' for short-form content.\n\nReturn ONLY a valid JSON object. No preamble. No markdown fences. Be brutally specific, not generic.",
  intelchat: `You are VYREX Intel — the ultimate YouTube channel strategy advisor. You are an elite consultant who gets paid thousands an hour. Your advice is gold.

Your personality: Bold, strategic, hyper-intelligent. You don't just answer questions; you provide "Perspective Shifts". You see the patterns creators miss.

Instructions:
1. THE ELITE VOICE: Speak like a high-level executive. Be direct, authoritative, and slightly provocative.
2. ACTIONABLE DEPTH: Every response must contain a "Strategic Move"—a specific, non-obvious tactic the user can implement today.
3. ALGORITHM WHISPERER: Reference deep-level mechanics like "External Traffic sourcing", "Cohorts", and "Relative CTR".
4. THE HOOK: Start every response with a strong analytical statement. End with a question that forces the user to think like a media mogul.
5. FORMATTING: Use Markdown headers (###), bold text, and bullet points. Never write a paragraph longer than 3 lines.

You are the central brain of VYREX. You coordinate the data from Viral Strategist, Hook Analyzer, Title Forge, and Launchpad.

Respond ONLY with JSON containing an 'answer' field (Markdown string).`,
  asset_forge: "You are VYREX Asset Forge — the God-Mode YouTube script architect. You generate full-scale production asset bundles for the world's top 0.1% creators.\n\nInstructions:\n1. SCRIPT ARCHITECTURE: Provide 6-8 high-octane script sections. Every single word must serve a specific storytelling purpose. Zero generic transition filler.\n2. THE 155 WPM IRON RULE: Total duration for each section must be calculated at exactly 155 words per minute. THIS IS NON-NEGOTIABLE. Word count MUST be (Duration in Seconds / 60) * 155.\n3. MULTI-LAYER ASSETS: Provide SEO variants for titles, a high-stakes opening hook, and accurate translations in Hindi and Spanish.\n4. B-ROLL BLUEPRINTING: Map exactly what happens on screen for EVERY script segment using high-retention visual theory (Vox, MrBeast style).\n5. AUDIO SYSTEM: Recommended ElevenLabs voice, pacing speed, shift in tonal intensity, and specific music scoring cues.\n6. THUMBNAIL INTEL: Psychological triggers, color palette hex codes, and text overlay orientation.\n7. HYPER-RETENTION: Use 'Open Loops' and 'High-Tension Bridges' between every section.\n\nReturn ONLY valid JSON. No preamble. No markdown fences.",
  settings: "Settings Mode",
  pricing: "Pricing Mode"
};

const SCHEMAS: Record<Mode, any> = {
  viral: {
    type: Type.OBJECT,
    properties: {
      videoTitle: { type: Type.STRING },
      viralScore: { type: Type.NUMBER },
      hook: { type: Type.STRING },
      miniScript: { type: Type.STRING },
      thumbnailStrategy: {
        type: Type.OBJECT,
        properties: {
          mainText: { type: Type.STRING },
          emotion: { type: Type.STRING },
          visualConcept: { type: Type.STRING },
          bgGradient: { type: Type.STRING },
        },
        required: ["mainText", "emotion", "visualConcept", "bgGradient"],
      },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      uploadTiming: { type: Type.STRING },
      competitorGap: { type: Type.STRING },
      retentionGraph: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            second: { type: Type.NUMBER },
            percentage: { type: Type.NUMBER },
          },
          required: ["second", "percentage"],
        },
      },
      thumbnailABTest: {
        type: Type.OBJECT,
        properties: {
          variantA: { type: Type.STRING },
          variantB: { type: Type.STRING },
          logic: { type: Type.STRING },
        },
        required: ["variantA", "variantB", "logic"],
      },
    },
    required: ["videoTitle", "viralScore", "hook", "miniScript", "thumbnailStrategy", "tags", "uploadTiming", "competitorGap", "retentionGraph", "thumbnailABTest"],
  },
  hook: {
    type: Type.OBJECT,
    properties: {
      ctrScore: { type: Type.NUMBER },
      psychologyBreakdown: {
        type: Type.OBJECT,
        properties: {
          primaryTrigger: { type: Type.STRING },
          curiosityGap: { type: Type.NUMBER },
          urgency: { type: Type.NUMBER },
          specificity: { type: Type.NUMBER },
          emotionalCharge: { type: Type.NUMBER },
        },
        required: ["primaryTrigger", "curiosityGap", "urgency", "specificity", "emotionalCharge"],
      },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      rewrites: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            version: { type: Type.STRING },
            title: { type: Type.STRING },
          },
          required: ["version", "title"],
        },
      },
      verdict: { type: Type.STRING },
      clickProbability: { type: Type.NUMBER },
      eyeTrackingHeatmap: { type: Type.STRING },
      audienceRetentionPrediction: { type: Type.STRING },
    },
    required: ["ctrScore", "psychologyBreakdown", "weaknesses", "rewrites", "verdict", "clickProbability", "eyeTrackingHeatmap", "audienceRetentionPrediction"],
  },
  competitor: {
    type: Type.OBJECT,
    properties: {
      channelProfile: {
        type: Type.OBJECT,
        properties: {
          contentPillars: { type: Type.ARRAY, items: { type: Type.STRING } },
          uploadPattern: { type: Type.STRING },
          thumbnailStyle: { type: Type.STRING },
          hookFormula: { type: Type.STRING },
        },
        required: ["contentPillars", "uploadPattern", "thumbnailStyle", "hookFormula"],
      },
      topContentPatterns: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            pattern: { type: Type.STRING },
            whyItWorks: { type: Type.STRING },
          },
          required: ["pattern", "whyItWorks"],
        },
      },
      contentGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
      cloneStrategy: { type: Type.STRING },
      cloneDifficulty: { type: Type.NUMBER },
      cloneVerdict: { type: Type.STRING },
      firstVideoIdea: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          angle: { type: Type.STRING },
        },
        required: ["title", "angle"],
      },
    },
    required: ["channelProfile", "topContentPatterns", "contentGaps", "cloneStrategy", "cloneDifficulty", "cloneVerdict", "firstVideoIdea"],
  },
  monetization: {
    type: Type.OBJECT,
    properties: {
      estimatedMonthlyRevenue: {
        type: Type.OBJECT,
        properties: {
          adSense: { type: Type.STRING },
          totalPotential: { type: Type.STRING },
        },
        required: ["adSense", "totalPotential"],
      },
      revenueStreams: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            type: { type: Type.STRING },
            potentialMonthly: { type: Type.STRING },
            effort: { type: Type.STRING },
            implementation: { type: Type.STRING },
          },
          required: ["name", "type", "potentialMonthly", "effort", "implementation"],
        },
      },
      quickWin: { type: Type.STRING },
      longTermAsset: { type: Type.STRING },
      warningZones: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["estimatedMonthlyRevenue", "revenueStreams", "quickWin", "longTermAsset", "warningZones"],
  },
  title_forge: {
    type: Type.OBJECT,
    properties: {
      videoCore: { type: Type.STRING },
      titles: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            rank: { type: Type.NUMBER },
            title: { type: Type.STRING },
            psychTrigger: { type: Type.STRING },
            predictedCTR: { type: Type.STRING },
            ctrScore: { type: Type.NUMBER },
            seoKeyword: { type: Type.STRING },
            thumbnailText: { type: Type.STRING },
            why: { type: Type.STRING },
            bestFor: { type: Type.STRING },
          },
          required: ["rank", "title", "psychTrigger", "predictedCTR", "ctrScore", "seoKeyword", "thumbnailText", "why", "bestFor"],
        },
      },
      abTestPairs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            pairLabel: { type: Type.STRING },
            titleA: { type: Type.STRING },
            titleB: { type: Type.STRING },
            recommendation: { type: Type.STRING },
          },
          required: ["pairLabel", "titleA", "titleB", "recommendation"],
        },
      },
      descriptionOpener: { type: Type.STRING },
      avoidMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["videoCore", "titles", "abTestPairs", "descriptionOpener", "avoidMistakes"],
  },
  launchpad: {
    type: Type.OBJECT,
    properties: {
      nicheRecommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            nicheName: { type: Type.STRING },
            nicheScore: { type: Type.NUMBER },
            demandLevel: { type: Type.STRING },
            competitionLevel: { type: Type.STRING },
            avgRPM: { type: Type.STRING },
            whyItWorks: { type: Type.STRING },
            biggestRisk: { type: Type.STRING },
            timeToMonetization: { type: Type.STRING },
          },
          required: ["nicheName", "nicheScore", "demandLevel", "competitionLevel", "avgRPM", "whyItWorks", "biggestRisk", "timeToMonetization"],
        },
      },
      recommendedNiche: { type: Type.STRING },
      competitionLandscape: {
        type: Type.OBJECT,
        properties: {
          topChannels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                channelName: { type: Type.STRING },
                estimatedSubs: { type: Type.STRING },
                whatTheyDoWell: { type: Type.STRING },
                theirWeakness: { type: Type.STRING },
              },
              required: ["channelName", "estimatedSubs", "whatTheyDoWell", "theirWeakness"],
            },
          },
          overallSaturation: { type: Type.STRING },
          newCreatorAdvantage: { type: Type.STRING },
        },
        required: ["topChannels", "overallSaturation", "newCreatorAdvantage"],
      },
      audienceProfile: {
        type: Type.OBJECT,
        properties: {
          primaryAge: { type: Type.STRING },
          gender: { type: Type.STRING },
          psychographics: { type: Type.ARRAY, items: { type: Type.STRING } },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          watchingHabits: { type: Type.STRING },
          whatMakesThemSubscribe: { type: Type.STRING },
        },
        required: ["primaryAge", "gender", "psychographics", "painPoints", "watchingHabits", "whatMakesThemSubscribe"],
      },
      differentiationAngle: {
        type: Type.OBJECT,
        properties: {
          uniquePositioning: { type: Type.STRING },
          contentPersonality: { type: Type.STRING },
          visualIdentity: { type: Type.STRING },
          tagline: { type: Type.STRING },
        },
        required: ["uniquePositioning", "contentPersonality", "visualIdentity", "tagline"],
      },
      channelNameIdeas: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            reason: { type: Type.STRING },
          },
          required: ["name", "reason"],
        },
      },
      first10VideoIdeas: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            order: { type: Type.NUMBER },
            title: { type: Type.STRING },
            type: { type: Type.STRING },
            viralScore: { type: Type.NUMBER },
            whyFirst: { type: Type.STRING },
            hook: { type: Type.STRING },
          },
          required: ["order", "title", "type", "viralScore", "whyFirst", "hook"],
        },
      },
      launchRoadmap: {
        type: Type.OBJECT,
        properties: {
          week1: { type: Type.STRING },
          week2to4: { type: Type.STRING },
          month2to3: { type: Type.STRING },
          month4to6: { type: Type.STRING },
        },
        required: ["week1", "week2to4", "month2to3", "month4to6"],
      },
      survivalWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
      shortsViability: {
        type: Type.OBJECT,
        properties: {
          viabilityScore: { type: Type.NUMBER },
          discoveryPotential: { type: Type.STRING },
          engagementPatterns: { type: Type.STRING },
          viralityBestPractices: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["viabilityScore", "discoveryPotential", "engagementPatterns", "viralityBestPractices"],
      },
      readinessScore: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          verdict: { type: Type.STRING },
          strengthSignal: { type: Type.STRING },
          gapToFill: { type: Type.STRING },
        },
        required: ["score", "verdict", "strengthSignal", "gapToFill"],
      },
    },
    required: ["nicheRecommendations", "recommendedNiche", "competitionLandscape", "audienceProfile", "differentiationAngle", "channelNameIdeas", "first10VideoIdeas", "launchRoadmap", "survivalWarnings", "readinessScore"],
  },
  intelchat: {
    type: Type.OBJECT,
    properties: {
      answer: { type: Type.STRING },
    },
    required: ["answer"],
  },
  asset_forge: {
    type: Type.OBJECT,
    properties: {
      videoTitle: { type: Type.STRING },
      seoVariants: { type: Type.ARRAY, items: { type: Type.STRING } },
      openingHook: { type: Type.STRING },
      languages: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            language: { type: Type.STRING },
            translation: { type: Type.STRING },
          },
          required: ["language", "translation"],
        },
      },
      scriptOutline: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            section: { type: Type.NUMBER },
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            purpose: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            narrativeScript: { type: Type.STRING },
            wordCount: { type: Type.NUMBER },
            transitionLine: { type: Type.STRING },
          },
          required: ["section", "title", "duration", "purpose", "keyPoints", "narrativeScript", "wordCount", "transitionLine"],
        },
      },
      thumbnailBrief: {
        type: Type.OBJECT,
        properties: {
          mainText: { type: Type.STRING },
          emotion: { type: Type.STRING },
          layout: { type: Type.STRING },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
          referenceStyle: { type: Type.STRING },
        },
        required: ["mainText", "emotion", "layout", "colorPalette", "referenceStyle"],
      },
      voiceoverGuide: {
        type: Type.OBJECT,
        properties: {
          recommendedVoice: { type: Type.STRING },
          speed: { type: Type.STRING },
          tone: { type: Type.STRING },
          emphasisWords: { type: Type.ARRAY, items: { type: Type.STRING } },
          emotionalArc: { type: Type.STRING },
        },
        required: ["recommendedVoice", "speed", "tone", "emphasisWords", "emotionalArc"],
      },
      stockFootage: {
        type: Type.OBJECT,
        properties: {
          openingShots: { type: Type.ARRAY, items: { type: Type.STRING } },
          sectionTerms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.NUMBER },
                terms: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["section", "terms"],
            },
          },
          styleGuide: { type: Type.STRING },
          avoidTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["openingShots", "sectionTerms", "styleGuide", "avoidTerms"],
      },
      musicDirection: {
        type: Type.OBJECT,
        properties: {
          intro: { type: Type.STRING },
          build: { type: Type.STRING },
          outro: { type: Type.STRING },
          avoidGenres: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["intro", "build", "outro", "avoidGenres"],
      },
      bRollBlueprint: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            section: { type: Type.NUMBER },
            visualCues: { type: Type.ARRAY, items: { type: Type.STRING } },
            motionType: { type: Type.STRING, enum: ["Static", "Slow Pan", "Rapid Cut", "Zoom"] },
            overlayIdea: { type: Type.STRING },
          },
          required: ["section", "visualCues", "motionType", "overlayIdea"],
        },
      },
      uploadChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["videoTitle", "seoVariants", "openingHook", "scriptOutline", "thumbnailBrief", "voiceoverGuide", "stockFootage", "musicDirection", "bRollBlueprint", "uploadChecklist"],
  },
  settings: { type: Type.OBJECT, properties: {} },
  pricing: { type: Type.OBJECT, properties: {} }
};

function handleGeminiError(error: any, context: string) {
  console.error(`[VYREX ERROR] ${context}:`, error);
  
  const message = error.message?.toLowerCase() || "";
  
  if (message.includes("fetch failed") || message.includes("network") || message.includes("unreachable")) {
    throw new Error("COMMUNICATION SEVERED: The intelligence node is unreachable. Verify your network uplink.");
  }
  
  if (message.includes("quota") || message.includes("429") || message.includes("rate limit")) {
    throw new Error("RESOURCES EXHAUSTED: Intelligence cycles depleted. Please wait for node refresh (Rate Limit).");
  }
  
  if (message.includes("safety") || message.includes("blocked")) {
    throw new Error("PROTOCOL BREACH: Safety filters engaged. This request violates core intelligence directives.");
  }
  
  if (message.includes("api key") || message.includes("auth") || message.includes("401") || message.includes("403")) {
    throw new Error("AUTH CRITICAL: Intelligence key rejected on backend. System access denied.");
  }

  if (message.includes("invalid") || message.includes("bad request") || message.includes("400")) {
    throw new Error("MALFORMED UPLINK: The intelligence node rejected the request structure.");
  }
  
  throw new Error(`INTELLIGENCE ANOMALY [${context}]: ${error.message || "Unknown error during sync."}`);
}

export async function executeVyrexNode(mode: Mode, input: string, history: any[] = [], sessionContext: string = '') {
  try {
    const contents: any[] = history.map(h => ({
      role: h.role,
      parts: Array.isArray(h.parts) ? h.parts : [{ text: h.content || h.parts }]
    }));
    
    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: input }] });
    }
    
    let vySettings: any = {};
    try {
      const savedSettings = localStorage.getItem('vyrex_settings');
      vySettings = savedSettings ? JSON.parse(savedSettings) : {};
    } catch (e) {
      console.warn("Vyrex settings parse failed, using defaults");
    }
    const outputLang = vySettings.ai?.outputLanguage || 'English';
    const scriptStyle = vySettings.ai?.scriptStyle || 'STORYTELLER';

    const basePrompt = NODE_PROMPTS[mode];
    const configInstruction = `\n\n[OUTPUT_CONFIG]\nLanguage: ${outputLang}\nStyle: ${scriptStyle}\nEnsure the response content strictly follows these parameters.`;
    
    // Inject config instruction BEFORE the final "Return ONLY valid JSON" instruction
    let finalSystemInstruction = basePrompt;
    const jsonInstructionIdx = basePrompt.lastIndexOf("Return ONLY valid JSON");
    if (jsonInstructionIdx !== -1) {
      finalSystemInstruction = basePrompt.slice(0, jsonInstructionIdx) + configInstruction + "\n\n" + basePrompt.slice(jsonInstructionIdx);
    } else {
      finalSystemInstruction = basePrompt + configInstruction;
    }

    if (sessionContext) {
      finalSystemInstruction += `\n\n[SESSION_CONTEXT]\n${sessionContext}`;
    }

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        input,
        history: contents,
        sessionContext,
        systemInstruction: finalSystemInstruction,
        responseSchema: SCHEMAS[mode]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    handleGeminiError(error, `Node:${mode}`);
  }
}

export async function generateThumbnail(prompt: string) {
  try {
    const response = await fetch("/api/ai/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Forge failed");
    }

    const data = await response.json();
    // Since direct image generation might be tricky on basic models, we use a placeholder or the description
    // In a real app we'd get a base64 or URL
    return data.url || `https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop`;
  } catch (error: any) {
    handleGeminiError(error, "AssetForge");
  }
}
