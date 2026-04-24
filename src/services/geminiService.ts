import { GoogleGenAI, Type } from "@google/genai";
import { Mode } from "../types";

let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const NODE_PROMPTS: Record<Mode, string> = {
  viral: "You are VYREX Viral Strategist — the world's most advanced YouTube content intelligence engine.\n\nWhen given a niche or content goal, respond ONLY with a valid JSON object. No preamble. No explanation. No markdown fences.",
  hook: "You are VYREX Hook Analyzer — a YouTube CTR psychology expert.\n\nAnalyze the given title/hook and respond ONLY with valid JSON. No preamble. No markdown fences.",
  competitor: "You are VYREX Competitor Intelligence — a YouTube channel reverse-engineering expert.\n\nAnalyze the given channel/niche and respond ONLY with valid JSON. No preamble. No markdown fences.",
  monetization: "You are VYREX Monetization Architect — an expert in YouTube creator revenue systems.\n\nGiven a niche and monthly views, respond ONLY with valid JSON. No preamble. No markdown fences.",
  title_forge: "You are VYREX Title Forge — the world's most advanced YouTube title engineering system. You understand CTR psychology, YouTube search algorithms, emotional triggers, and viral mechanics at a deep level.\n\nGiven a video idea/topic and niche, generate 10 scientifically engineered title variants. Return ONLY valid JSON:\n\n{\n  \"videoCore\": \"string — the core idea in one sentence\",\n  \"titles\": [\n    {\n      \"rank\": number 1-10,\n      \"title\": \"string — the complete YouTube title\",\n      \"psychTrigger\": \"string — primary psychological mechanism: Curiosity Gap | Fear of Missing Out | Shock | Authority | Controversy | Nostalgia | Greed | Awe | Validation | Urgency\",\n      \"predictedCTR\": \"string — estimated CTR range e.g. '6.2–8.1%'\",\n      \"ctrScore\": number 1-10,\n      \"seoKeyword\": \"string — the primary search keyword embedded in this title\",\n      \"thumbnailText\": \"string — 2-4 word thumbnail overlay that pairs with this title\",\n      \"why\": \"string — one sentence on why this title works psychologically\",\n      \"bestFor\": \"string — e.g. 'Suggested feed', 'YouTube search', 'Shorts shelf', 'Browse features'\"\n    }\n  ],\n  \"abTestPairs\": [\n    {\n      \"pairLabel\": \"string — e.g. 'Curiosity vs Authority'\",\n      \"titleA\": \"string — title index reference e.g. 'Title #1'\",\n      \"titleB\": \"string — title index reference e.g. 'Title #4'\",\n      \"recommendation\": \"string — which to test first and why\"\n    }\n  ],\n  \"descriptionOpener\": \"string — first 2 sentences of the video description optimized for YouTube search, using the top keyword naturally\",\n  \"avoidMistakes\": [\"string — title mistake 1 specific to this topic\", \"string — mistake 2\"]\n}\n\nReturn ONLY the JSON. No preamble. No markdown fences. All 10 titles must be meaningfully different — different psychological triggers, different structures.",
  launchpad: "You are VYREX Channel Launchpad — the world's most advanced YouTube channel strategy intelligence system for first-time creators.\n\nGiven someone's interests, target region, and content style preference, you will perform a complete channel launch analysis and return ONLY a valid JSON object. No preamble. No markdown fences. Be brutally specific, not generic.",
  intelchat: `You are VYREX Intel — an elite YouTube channel strategy advisor built into the VYREX intelligence platform. You are talking to a YouTube creator or someone planning to start a YouTube channel.

Your personality: Direct, sharp, confident. You give concrete actionable answers — never vague. You think like a combination of MrBeast's growth strategist, a top YouTube MCN consultant, and a viral content psychologist. You have deep knowledge of:
- YouTube algorithm mechanics (CTR, AVD, impressions, suggested feed)
- Niche selection and validation
- Channel naming and branding
- Content pillars and topic research  
- Hook writing and thumbnail strategy
- Monetization (AdSense RPM by niche, sponsorships, digital products)
- Competition analysis and gap identification
- Growth roadmaps for 0 to 100K subscribers
- Faceless channel production workflows
- Shorts vs long-form strategy
- Indian YouTube market specifically (Hindi, Telugu, Tamil niches)
- Global English content strategy

Rules:
- Keep responses concise but complete — use short paragraphs, not walls of text
- Use bullet points when listing multiple items (3+ items always become bullets)
- Bold the most important word or phrase in each response using bold
- When suggesting channel names, give 3-5 options with one-line reasons
- When suggesting video topics, give them as ready-to-use titles
- When someone asks for feedback on an idea, be honest — praise what works, directly call out what doesn't
- Never say "great question" or use filler phrases
- End responses with a single follow-up question to keep the conversation moving (only when it feels natural)
- If someone seems confused or overwhelmed, simplify and give them ONE clear next action

You are inside the VYREX app which has these other nodes: Viral Strategist (generates video ideas with hooks and thumbnails), Hook Analyzer (CTR scoring), Competitor Spy, Monetization Map, Title Forge (psychological title engineering), and Channel Launchpad (full starter analysis).
You can reference these nodes when relevant.

Respond ONLY with JSON containing an 'answer' field (Markdown string).`,
  asset_forge: "You are VYREX Asset Forge — a pre-production intelligence system for faceless YouTube creators. You generate complete production asset bundles.\n\nGiven a video topic, niche, and format, return ONLY valid JSON in the specified structure. Provide 5-7 script sections. Be hyper-specific to the exact topic — zero generic advice. Return ONLY the JSON. No preamble. No markdown fences.",
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
    },
    required: ["videoTitle", "viralScore", "hook", "miniScript", "thumbnailStrategy", "tags", "uploadTiming", "competitorGap"],
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
    },
    required: ["ctrScore", "psychologyBreakdown", "weaknesses", "rewrites", "verdict"],
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
      firstVideoIdea: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          angle: { type: Type.STRING },
        },
        required: ["title", "angle"],
      },
    },
    required: ["channelProfile", "topContentPatterns", "contentGaps", "cloneStrategy", "firstVideoIdea"],
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
            transitionLine: { type: Type.STRING },
          },
          required: ["section", "title", "duration", "purpose", "keyPoints", "transitionLine"],
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
      uploadChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["videoTitle", "seoVariants", "openingHook", "scriptOutline", "thumbnailBrief", "voiceoverGuide", "stockFootage", "musicDirection", "uploadChecklist"],
  },
  settings: { type: Type.OBJECT, properties: {} },
  pricing: { type: Type.OBJECT, properties: {} }
};

export async function executeVyrexNodeInternal(mode: Mode, input: string, history: any[] = [], sessionContext: string = '') {
  try {
    const contents: any[] = history.length > 0 ? history : [{ parts: [{ text: input }] }];
    
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: NODE_PROMPTS[mode] + (sessionContext ? `\n\nSESSION CONTEXT: ${sessionContext}` : ''),
        responseMimeType: "application/json",
        responseSchema: SCHEMAS[mode],
        temperature: 0.7,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error(`VYREX Node [${mode}] Error:`, error);
    throw error;
  }
}

export async function executeVyrexNode(mode: Mode, input: string, history: any[] = [], sessionContext: string = '') {
  // Client-side proxy to server
  try {
    const userId = (window as any).VYREX_USER_ID; // We'll need to set this in App.tsx
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, input, history, context: sessionContext, userId })
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Intelligence sync failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Client API Error:", error);
    throw error;
  }
}

export async function generateThumbnailInternal(prompt: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: `YouTube Thumbnail: ${prompt}. High contrast, vibrant, professional YouTube style, eye-catching.` }] }],
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
}

export async function generateThumbnail(prompt: string) {
  // Client-side proxy to server
  try {
    const userId = (window as any).VYREX_USER_ID;
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userId })
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Image generation failed');
    }
    
    const { imageUrl } = await response.json();
    return imageUrl;
  } catch (error) {
    console.error("Client Image API Error:", error);
    throw error;
  }
}
