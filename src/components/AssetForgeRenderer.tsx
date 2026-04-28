import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, 
  Check, 
  ChevronDown, 
  Music, 
  Camera, 
  Mic2, 
  Image as ImageIcon, 
  FileText, 
  CheckSquare,
  Package,
  Clock,
  Zap,
  Globe,
  Settings2,
  Lock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Play
} from 'lucide-react';
import { AssetForgeResult } from '../types';
import { cn } from '../lib/utils';

interface AssetForgeRendererProps {
  data: AssetForgeResult;
  isExample?: boolean;
}

type ForgeTab = 'dashboard' | 'script' | 'visuals' | 'audio' | 'launch';

export const AssetForgeRenderer = ({ data, isExample }: AssetForgeRendererProps) => {
  const [activeTab, setActiveTab] = useState<ForgeTab>('dashboard');
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([1]));
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExport = () => {
    setIsDownloading(true);
    const content = `
VYREX ASSET FORGE - PRODUCTION PACKAGE
Topic: ${data.videoTitle}

[TITLE VARIANT]
${data.seoVariants.join('\n')}

[OPENING HOOK]
${data.openingHook}

[SCRIPT SECTIONS]
${data.scriptOutline.map(s => `
SECTION ${s.section}: ${s.title} (${s.duration})
Script: ${s.narrativeScript}
Word Count: ${s.wordCount}
`).join('\n')}

[THUMBNAIL INTEL]
Main Text: ${data.thumbnailBrief.mainText}
Colors: ${data.thumbnailBrief.colorPalette.join(', ')}
Style: ${data.thumbnailBrief.referenceStyle}

[VOICEOVER]
Recommended: ${data.voiceoverGuide.recommendedVoice}
Tone: ${data.voiceoverGuide.tone}

[UPLOAD CHECKLIST]
${data.uploadChecklist.map(c => `- ${c}`).join('\n')}

Generated via Vyrex.ai
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vyrex_Asset_Forge_${data.videoTitle.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setIsDownloading(false), 2000);
  };

  const toggleSection = (id: number) => {
    const newSet = new Set(openSections);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setOpenSections(newSet);
  };

  const toggleCheck = (index: number) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setCheckedItems(newSet);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const tabs: { id: ForgeTab; label: string; icon: any; color: string }[] = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutGrid, color: 'text-vy-cyan' },
    { id: 'script', label: 'SCRIPT CORE', icon: FileText, color: 'text-vy-white' },
    { id: 'visuals', label: 'VISUAL FORGE', icon: Camera, color: 'text-vy-accent' },
    { id: 'audio', label: 'AUDIO LAB', icon: Music, color: 'text-vy-violet' },
    { id: 'launch', label: 'DEPLOYMENT', icon: Zap, color: 'text-vy-green' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* HEADER COMMAND BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#080b15]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-vy-accent/20 rounded-2xl flex items-center justify-center border border-vy-accent/30 shadow-[0_0_30px_rgba(255,107,0,0.2)] shrink-0">
            <Package className="w-7 h-7 text-vy-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase">ASSET FORGE <span className="text-vy-accent">GOD-MODE</span></h2>
              {isExample && (
                <span className="px-2 py-0.5 bg-white/10 border border-white/10 rounded font-mono text-[8px] text-vy-muted font-bold tracking-[0.2em]">SIMULATION</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] text-vy-cyan uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-vy-cyan animate-pulse" />
                Intelligence Node Sync: Stable
              </span>
              <div className="h-3 w-px bg-white/10" />
              <span className="font-mono text-[9px] text-[#6a8a9a] uppercase tracking-widest">Calculated Pacing: 155 WPM</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 md:flex-none flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-[10px] font-black tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-white/10 text-white border border-white/10 shadow-[0_4px_15px_rgba(255,255,255,0.05)]" 
                  : "text-vy-muted hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? tab.color : "text-vy-muted")} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="min-h-[500px]"
        >
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* CORE INTEL CARD */}
                <div className="bg-[#0a0d14] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <TrendingUp className="w-32 h-32 text-vy-cyan" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-vy-cyan/10 border border-vy-cyan/20 rounded-full font-mono text-[9px] text-vy-cyan font-bold tracking-widest">PROJECT CORE</div>
                      <div className="font-mono text-[9px] text-vy-muted uppercase tracking-widest italic">{data.seoVariants.length} VARIANTS GENERATED</div>
                    </div>
                    <h1 className="font-display font-black text-4xl text-white leading-[1.1] pr-12">{data.videoTitle}</h1>
                    <div className="flex flex-wrap gap-3">
                      {data.seoVariants.slice(0, 3).map((v, i) => (
                        <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-display font-medium text-xs text-vy-muted">
                          {v}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SCRIPT FLOW OVERVIEW */}
                <div className="bg-[#0a0d14] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <FileText className="w-5 h-5 text-vy-white" />
                       <h3 className="font-display font-black text-sm text-white uppercase italic tracking-widest">Script Flow Analysis</h3>
                    </div>
                    <span className="font-mono text-[10px] text-vy-muted uppercase tracking-widest">{(data.scriptOutline?.length || 0)} NODES</span>
                  </div>
                  
                  <div className="relative pt-4 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex gap-4 min-w-[600px]">
                      {(data.scriptOutline || []).map((section, idx) => (
                        <div key={idx} className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 min-w-[160px]">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-vy-cyan font-bold">Node {section.section}</span>
                            <span className="font-mono text-[8px] text-vy-muted uppercase">{section.duration}</span>
                          </div>
                          <h4 className="font-display font-bold text-[11px] text-white uppercase leading-tight line-clamp-2">{section.title}</h4>
                          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-vy-cyan/50" style={{ width: `${(section.wordCount / 400) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* PRODUCTION STATS */}
                <div className="bg-vy-accent/[0.03] border border-vy-accent/20 rounded-3xl p-8 space-y-6">
                  <h3 className="font-display font-black text-xs text-vy-accent uppercase italic tracking-widest flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    PRODUCTION PARAMS
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Voice Model', val: data.voiceoverGuide.recommendedVoice, color: 'text-vy-violet' },
                      { label: 'Narrative Style', val: 'Storyteller', color: 'text-white' },
                      { label: 'Pacing Target', val: '155 WPM', color: 'text-vy-green' },
                      { label: 'Visual Style', val: data.stockFootage.styleGuide, color: 'text-vy-cyan' }
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="font-mono text-[8px] text-vy-muted uppercase tracking-tighter">{stat.label}</span>
                        <span className={cn("font-display font-black text-[13px] uppercase italic tracking-wide", stat.color)}>{stat.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LANGUAGES QUICK-SWITCH */}
                {data.languages && data.languages.length > 0 && (
                  <div className="bg-[#0a0d14] border border-white/5 rounded-3xl p-8 space-y-6">
                    <h3 className="font-display font-black text-xs text-white uppercase italic tracking-widest flex items-center gap-2">
                      <Globe className="w-4 h-4 text-vy-cyan" />
                      GLOBAL SYNC
                    </h3>
                    <div className="space-y-3">
                      {data.languages.map((lang, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 gap-2 flex flex-col group hover:border-vy-cyan/40 transition-all cursor-crosshair">
                          <span className="font-mono text-[9px] text-vy-cyan font-bold uppercase">{lang.language}</span>
                          <p className="text-[10px] text-vy-white/70 italic leading-relaxed">"{lang.translation}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCRIPT CORE VIEW */}
          {activeTab === 'script' && (
            <div className="space-y-6">
              <div className="bg-[#0a0d14] border border-vy-white/5 rounded-3xl p-8 space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <Zap className="w-5 h-5 text-vy-accent fill-vy-accent" />
                       <span className="font-mono text-[10px] text-vy-accent font-black uppercase tracking-[0.3em]">GOD-MODE HOOK</span>
                    </div>
                    <p className="font-display font-black text-3xl italic text-white leading-tight uppercase pr-8 tracking-tighter">"{data.openingHook}"</p>
                  </div>
                  <button onClick={() => copyToClipboard(data.openingHook)} className="group flex items-center gap-3 px-6 py-4 bg-vy-accent/10 border border-vy-accent/20 rounded-2xl font-mono text-[10px] text-vy-accent font-black tracking-widest hover:bg-vy-accent/20 transition-all">
                    <Copy className="w-4 h-4" />
                    COPY HOOK
                  </button>
                </div>

                <div className="space-y-4">
                  {(data.scriptOutline || []).map((section) => (
                    <div key={section.section} className={cn(
                      "bg-vy-surface/30 border border-vy-border rounded-3xl transition-all overflow-hidden",
                      openSections.has(section.section) && "border-white/10 ring-1 ring-white/5 shadow-2xl bg-[#0a0d14]"
                    )}>
                      <button 
                        onClick={() => toggleSection(section.section)}
                        className="w-full px-8 py-6 flex items-center gap-6 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-lg italic border transition-all",
                          openSections.has(section.section) ? "bg-vy-accent border-vy-accent text-white" : "bg-white/5 border-white/10 text-vy-muted"
                        )}>
                          {section.section}
                        </div>
                        <div className="flex-1">
                          <h4 className={cn(
                            "font-display font-black text-sm uppercase tracking-widest italic transition-colors",
                            openSections.has(section.section) ? "text-white" : "text-vy-muted"
                          )}>
                            {section.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="font-mono text-[9px] text-[#6a8a9a] uppercase tracking-widest">{section.duration}</span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="font-mono text-[9px] text-[#6a8a9a] uppercase tracking-widest">{section.wordCount} WORDS</span>
                          </div>
                        </div>
                        <ChevronDown className={cn("w-5 h-5 text-vy-muted transition-transform", openSections.has(section.section) && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {openSections.has(section.section) && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 pb-8 space-y-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                  <div className="space-y-3">
                                    <label className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-widest flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-vy-accent" />
                                      Section Intent
                                    </label>
                                    <p className="text-xs text-vy-muted leading-relaxed font-medium">"{section.purpose}"</p>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-widest flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-vy-accent" />
                                      Key Payload Points
                                    </label>
                                    <div className="space-y-2">
                                      {section.keyPoints.map((p, i) => (
                                        <div key={i} className="flex gap-3 text-[11px] text-[#c8dce8] font-medium leading-relaxed">
                                          <span className="text-vy-accent font-bold">»</span>
                                          {p}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-5">
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="font-mono text-[9px] text-white font-black uppercase tracking-widest flex items-center gap-2">
                                      <Mic2 className="w-3.5 h-3.5 text-vy-violet" />
                                      Production Script
                                    </label>
                                    <button onClick={() => copyToClipboard(section.narrativeScript)} className="font-mono text-[8px] text-vy-muted hover:text-vy-accent transition-colors flex items-center gap-1.5">
                                      <Copy className="w-3 h-3" />
                                      COPY
                                    </button>
                                  </div>
                                  <div className="p-6 bg-black/40 border border-white/5 rounded-3xl font-serif text-[13px] text-[#c8dce8] leading-relaxed whitespace-pre-wrap relative italic">
                                    {section.narrativeScript}
                                    <div className="absolute top-2 right-4 font-mono text-[8px] text-white/5">155 WPM SYNC</div>
                                  </div>
                                  <div className="p-4 bg-vy-accent/5 border border-vy-accent/10 rounded-2xl flex items-center gap-4">
                                     <div className="w-8 h-8 rounded-xl bg-vy-accent/10 flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-4 h-4 text-vy-accent" />
                                     </div>
                                     <div className="flex-1">
                                        <span className="font-mono text-[8px] text-vy-accent uppercase font-black block tracking-widest mb-0.5">TENSION BRIDGE</span>
                                        <p className="text-[10px] text-vy-accent font-bold">{section.transitionLine}</p>
                                     </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VISUAL FORGE VIEW */}
          {activeTab === 'visuals' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* B-ROLL BLUEPRINT TIMELINE */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-[#0a0d14] border border-white/5 rounded-3xl p-8 space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                       <Camera className="w-6 h-6 text-vy-accent" />
                       <h3 className="font-display font-black text-lg text-white uppercase italic tracking-widest">B-ROLL BLUEPRINT</h3>
                    </div>
                    <div className="px-4 py-1.5 bg-vy-white/5 rounded-full font-mono text-[9px] text-vy-muted uppercase tracking-widest">TIMELINE SEQUENCE</div>
                  </div>

                  <div className="space-y-6">
                    {(data.bRollBlueprint || []).map((bp, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-xl bg-vy-accent/20 border border-vy-accent/40 flex items-center justify-center font-mono text-[10px] text-vy-accent font-black mb-2">{bp.section}</div>
                          <div className="flex-1 w-0.5 bg-white/5 group-last:bg-transparent" />
                        </div>
                        <div className="flex-1 pb-10 space-y-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                             <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] text-white font-black uppercase tracking-widest">MOTION:</span>
                                <span className="px-3 py-1 bg-white/5 rounded-lg font-mono text-[9px] text-vy-cyan font-bold tracking-widest border border-white/10 uppercase italic">{bp.motionType}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] text-vy-muted uppercase font-black uppercase">Overlay IDEA:</span>
                                <span className="px-3 py-1 bg-vy-violet/10 text-vy-violet rounded-lg font-display font-black text-[10px] italic border border-vy-violet/20">{bp.overlayIdea}</span>
                             </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bp.visualCues.map((cue, i) => (
                              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group/cue hover:border-vy-accent/30 transition-all cursor-pointer">
                                <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center shrink-0">
                                   <Play className="w-4 h-4 text-white/20 group-hover/cue:text-vy-accent transition-colors" />
                                </div>
                                <p className="text-[11px] text-[#c8dce8] font-medium leading-relaxed italic">"{cue}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STOCK FOOTAGE DIRECTORY */}
                <div className="bg-[#0a0d14] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-vy-cyan" />
                    <h3 className="font-display font-black text-sm text-white uppercase italic tracking-widest">Neural Stock Search Directory</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="font-mono text-[9px] text-[#6a8a9a] uppercase font-black tracking-widest block">Opening Master Shots</label>
                        <div className="flex flex-wrap gap-2">
                          {data.stockFootage.openingShots.map((shot, i) => (
                            <Chip key={i} text={shot} color="cyan" />
                          ))}
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.stockFootage.sectionTerms.map((s, i) => (
                          <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                             <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-vy-white/10 flex items-center justify-center font-mono text-[8px] text-white">S{s.section}</div>
                                <span className="font-mono text-[9px] text-vy-muted uppercase tracking-widest">Query Node</span>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {s.terms.map((t, j) => (
                                  <Chip key={j} text={t} color="white" />
                                ))}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>

              {/* VISUAL STYLE GUIDE SIDEBAR */}
              <div className="space-y-6">
                <div className="bg-vy-accent/[0.03] border border-vy-accent/20 rounded-3xl p-8 space-y-8">
                  <div className="space-y-3">
                    <label className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-widest flex items-center gap-2">
                      <Settings2 className="w-4 h-4" />
                      STYLE PROTOCOL
                    </label>
                    <div className="p-4 bg-black/40 border border-vy-accent/20 rounded-2xl font-display font-medium text-xs text-vy-white leading-relaxed italic">
                      "{data.stockFootage.styleGuide}"
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="font-mono text-[9px] text-vy-red font-black uppercase tracking-widest flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      BLOCKLIST PROTOCOL
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {data.stockFootage.avoidTerms.map((term, i) => (
                        <div key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl font-mono text-[9px] text-red-500 font-black uppercase tracking-widest flex items-center gap-2">
                          <span className="text-[10px]">✕</span> {term}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <label className="font-mono text-[9px] text-vy-muted uppercase tracking-widest block text-center">Neural Search Engines</label>
                    <div className="flex flex-col gap-2">
                       <a href="https://pexels.com" target="_blank" className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-[10px] font-bold text-white hover:bg-white/10 transition-all">PEXELS <ExternalLink className="w-3 h-3 text-vy-muted" /></a>
                       <a href="https://pixabay.com" target="_blank" className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-[10px] font-bold text-white hover:bg-white/10 transition-all">PIXABAY <ExternalLink className="w-3 h-3 text-vy-muted" /></a>
                       <a href="https://storyblocks.com" target="_blank" className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-[10px] font-bold text-white hover:bg-white/10 transition-all">STORYBLOCKS <ExternalLink className="w-3 h-3 text-vy-muted" /></a>
                    </div>
                  </div>
                </div>

                {/* THUMBNAIL INTEL */}
                <div className="bg-[#0a0d14] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-vy-accent" />
                    <h3 className="font-display font-black text-sm text-white uppercase italic tracking-widest">THUMBNAIL INTEL</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">CORE TEXT</label>
                       <p className="font-display font-black text-2xl text-white italic tracking-tighter uppercase">{data.thumbnailBrief.mainText}</p>
                    </div>
                    <div className="space-y-2">
                       <label className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">EMOTIONAL CHARGE</label>
                       <div className="px-3 py-1 bg-vy-accent/10 border border-vy-accent/30 rounded-lg text-vy-accent text-[10px] font-black uppercase tracking-widest inline-block">{data.thumbnailBrief.emotion}</div>
                    </div>
                    <div className="space-y-4">
                       <label className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">PALETTE MAPPING</label>
                       <div className="flex gap-2">
                         {data.thumbnailBrief.colorPalette.map((c, i) => (
                           <div key={i} className="w-8 h-8 rounded-lg border border-white/10 shadow-lg" style={{ backgroundColor: c }} title={c} />
                         ))}
                       </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                       <label className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">LAYOUT LOGIC</label>
                       <p className="text-[10px] text-vy-white/70 italic leading-relaxed">"{data.thumbnailBrief.layout}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AUDIO LAB VIEW */}
          {activeTab === 'audio' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* VOICEOVER ENGINE */}
                <div className="bg-[#0a0d14] border border-white/5 rounded-3xl p-10 space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                      <Mic2 className="w-40 h-40 text-vy-violet" />
                   </div>
                   <div className="text-center space-y-4 relative z-10">
                      <div className="font-mono text-[10px] text-vy-muted uppercase tracking-[0.4em]">ElevenLabs Master Node</div>
                      <h2 className="font-display font-black text-6xl text-vy-violet italic tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">{data.voiceoverGuide.recommendedVoice}</h2>
                      <div className="flex justify-center items-center gap-8 pt-4">
                         <div className="flex flex-col items-center">
                            <span className="font-mono text-[8px] text-vy-muted uppercase mb-1">SPEED SYNC</span>
                            <span className="font-display font-black text-2xl text-white italic">{data.voiceoverGuide.speed}</span>
                         </div>
                         <div className="h-10 w-px bg-white/10" />
                         <div className="flex flex-col items-center">
                            <span className="font-mono text-[8px] text-vy-muted uppercase mb-1">TONE PROTOCOL</span>
                            <span className="font-display font-black text-2xl text-vy-violet italic tracking-tighter uppercase">{data.voiceoverGuide.tone.split(' ')[0]}</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-4 pt-6">
                      <label className="font-mono text-[9px] text-vy-muted uppercase font-black tracking-widest block text-center">Emphasis Stress Points</label>
                      <div className="flex flex-wrap justify-center gap-3">
                         {data.voiceoverGuide.emphasisWords.map((word, i) => (
                           <div key={i} className="px-4 py-2 bg-vy-violet/10 border border-vy-violet/30 rounded-2xl font-display font-black text-sm text-vy-violet shadow-lg uppercase italic">{word}</div>
                         ))}
                      </div>
                   </div>

                   <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                      <label className="font-mono text-[9px] text-vy-muted uppercase tracking-widest block text-center">Emotional Pacing Arc</label>
                      <div className="relative h-1 w-full bg-white/5 rounded-full mt-10">
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2">
                           {data.voiceoverGuide.emotionalArc.split('→').map((e, i) => (
                             <div key={i} className="flex flex-col items-center group">
                                <div className="w-3 h-3 rounded-full bg-vy-violet shadow-[0_0_15px_rgba(139,92,246,0.6)] mb-4 ring-4 ring-black" />
                                <span className="font-mono text-[9px] text-white font-black uppercase tracking-widest">{e.trim()}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>

                {/* MUSIC ENGINE */}
                <div className="bg-[#0a0d14] border border-white/5 rounded-3xl p-10 space-y-10">
                  <div className="flex items-center gap-3">
                    <Music className="w-6 h-6 text-vy-cyan" />
                    <h3 className="font-display font-black text-lg text-white uppercase italic tracking-widest">Music Scoring Protocol</h3>
                  </div>

                  <div className="space-y-6">
                    {[
                      { label: 'INTRO SCORE', val: data.musicDirection.intro, color: 'text-vy-cyan' },
                      { label: 'MID-REACH BUILD', val: data.musicDirection.build, color: 'text-vy-accent' },
                      { label: 'OUTRO RESOLUTION', val: data.musicDirection.outro, color: 'text-vy-green' }
                    ].map((m, i) => (
                      <div key={i} className="space-y-3 p-6 bg-white/5 border border-white/5 rounded-3xl relative group hover:border-white/10 transition-all cursor-pointer">
                        <label className={cn("font-mono text-[9px] font-black uppercase tracking-widest block", m.color)}>{m.label}</label>
                        <p className="font-display font-medium text-sm text-[#c8dce8] leading-relaxed italic">"{m.val}"</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4">
                     <label className="font-mono text-[9px] text-vy-red font-black uppercase tracking-widest block text-center">Genre Infringement Blocklist</label>
                     <div className="flex flex-wrap justify-center gap-2">
                        {data.musicDirection.avoidGenres.map((g, i) => (
                          <div key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl font-mono text-[9px] text-red-500 font-black uppercase tracking-widest uppercase">
                            {g}
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEPLOYMENT VIEW */}
          {activeTab === 'launch' && (
            <div className="max-w-2xl mx-auto space-y-10">
               <div className="bg-[#0a0d14] border border-white/5 rounded-[40px] p-12 space-y-10 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-vy-accent/5 to-transparent pointer-events-none" />
                  
                  <div className="space-y-4 relative z-10">
                     <div className="w-20 h-20 bg-vy-accent/20 rounded-[30px] flex items-center justify-center border border-vy-accent/30 mx-auto mb-6 shadow-[0_0_50px_rgba(255,107,0,0.2)]">
                        <Zap className="w-10 h-10 text-vy-accent fill-vy-accent" />
                     </div>
                     <h2 className="font-display font-black text-5xl text-white tracking-tighter uppercase italic pr-2">DEPLOYMENT READY</h2>
                     <p className="font-mono text-[11px] text-vy-muted uppercase tracking-[0.5em]">Neural Assembly Completed</p>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-end">
                      <span className="font-mono text-[10px] text-vy-white font-black uppercase tracking-widest">ASSET VERIFICATION</span>
                      <span className="font-mono text-[10px] text-vy-accent font-black">
                        {Math.round((checkedItems.size / (data.uploadChecklist?.length || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden p-1">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(checkedItems.size / (data.uploadChecklist?.length || 1)) * 100}%` }}
                         className={cn(
                           "h-full rounded-full transition-colors duration-500",
                           checkedItems.size === (data.uploadChecklist?.length || 0) ? "bg-[#22d3a0] shadow-[0_0_20px_rgba(34,211,160,0.4)]" : "bg-vy-accent"
                         )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-6 text-left relative z-10">
                    {(data.uploadChecklist || []).map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => toggleCheck(i)}
                        className={cn(
                          "group flex items-center gap-6 p-6 rounded-3xl border transition-all cursor-pointer",
                          checkedItems.has(i) 
                            ? "bg-white/5 border-vy-green/20 opacity-60" 
                            : "bg-white/5 border-white/5 hover:border-vy-accent/30 hover:bg-white/[0.07]"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-2xl flex items-center justify-center border-2 transition-all",
                          checkedItems.has(i) ? "bg-vy-green border-vy-green text-white" : "bg-black/40 border-white/5 text-transparent"
                        )}>
                           <Check className="w-5 h-5" />
                        </div>
                        <span className={cn(
                          "font-display font-bold text-[13px] uppercase tracking-wide transition-all",
                          checkedItems.has(i) ? "text-vy-muted line-through" : "text-white"
                        )}>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-10">
                    <button 
                      onClick={handleExport}
                      disabled={isDownloading}
                      className={cn(
                        "w-full py-6 flex items-center justify-center gap-4 rounded-[30px] font-display font-black text-sm uppercase tracking-[0.4em] transition-all relative overflow-hidden",
                        isDownloading ? "bg-vy-cyan text-black" : "bg-white text-black hover:scale-[1.02] active:scale-[0.98]"
                      )}
                    >
                      {isDownloading ? (
                        <>GENERATING BUNDLE... <Zap className="w-5 h-5 animate-pulse" /></>
                      ) : (
                        <>📦 DOWNLOAD PRODUCTION PACK <ChevronRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Chip = ({ text, color }: { text: string, color: 'cyan' | 'white' | 'orange' }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[9px] uppercase font-black border transition-all active:scale-95 group",
        color === 'cyan' ? "bg-vy-cyan/5 border-vy-cyan/20 text-vy-cyan hover:bg-vy-cyan/10" :
        color === 'orange' ? "bg-vy-accent/5 border-vy-accent/20 text-vy-accent hover:bg-vy-accent/10" :
        "bg-white/5 border-white/10 text-vy-muted hover:border-white/20 hover:text-white"
      )}
    >
      <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-3 h-3" /></span>
      {copied ? "COPIED" : text}
    </button>
  );
};
