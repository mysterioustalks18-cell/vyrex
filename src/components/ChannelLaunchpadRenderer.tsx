import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  TrendingUp, 
  Zap, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Copy, 
  Check, 
  Target, 
  ShieldCheck, 
  AlertTriangle, 
  Download,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ChannelLaunchpadResult } from '../types';
import { Tooltip } from './Tooltip';

// Mock components that are usually passed or global
const ScoreRing = ({ score = 0, label }: { score?: number; label: string }) => {
  const safeScore = score || 0;
  return (
    <div className="flex flex-col items-center">
      <Tooltip 
        content={
          safeScore >= 0.85 ? "Optimal high-tier performance potential" : 
          safeScore >= 0.75 ? "Strong market-ready performance" : 
          "Significant optimization recommended"
        } 
        position="top"
      >
        <div style={{position:'relative', display:'inline-block'}} className="cursor-help">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" stroke="#ffffff0f" strokeWidth="8" fill="none"/>
            <motion.circle 
              cx="60" cy="60" r="52" 
              stroke={safeScore >= 0.85 ? '#22d3a0' : safeScore >= 0.75 ? '#00c8ff' : '#f59e0b'}
              strokeWidth="8" fill="none"
              strokeDasharray="326.7"
              initial={{ strokeDashoffset: 326.7 }}
              animate={{ strokeDashoffset: 326.7 * (1 - safeScore) }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{filter:`drop-shadow(0 0 8px ${safeScore >= 0.85 ? '#22d3a0' : '#00c8ff'})`}}
            />
            <text x="60" y="65" textAnchor="middle" 
              fontFamily="Orbitron" fontWeight="900" fontSize="22" fill="white">
              {(safeScore * 10).toFixed(1)}
            </text>
          </svg>
        </div>
      </Tooltip>
        {/* Label OUTSIDE the SVG */}
        <div style={{
          textAlign:'center', marginTop:'6px',
          fontFamily:'JetBrains Mono, monospace',
          fontSize:'8px', letterSpacing:'0.2em', color:'#4a6070'
        }}>{label}</div>
      </div>
  );
};

const ResultCard = ({ index, children, accentColor, className, showShimmer, style }: { index: number; children: any; accentColor?: string; className?: string; showShimmer?: boolean; style?: React.CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    className={cn("bg-[#0e1118] border border-[#1c2030] rounded-2xl overflow-hidden shadow-2xl relative", showShimmer && "shimmer-card", className)}
    style={{ ...style, borderTop: accentColor ? `2px solid ${accentColor}` : (style?.borderTop || undefined) }}
  >
    {children}
  </motion.div>
);

const CardHeader = ({ icon: Icon, title, right }: { icon: any; title: string; right?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1c2030]">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-vy-accent/10 rounded-lg">
        {typeof Icon === 'string' ? <span className="text-sm">{Icon}</span> : <Icon className="w-3.5 h-3.5 text-[#e8542a] fill-current" />}
      </div>
      <h4 className="font-display text-xs font-black text-white uppercase tracking-wider">{title}</h4>
    </div>
    {right}
  </div>
);

const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-vy-muted group-hover:text-white" />}
    </button>
  );
};

export const ChannelLaunchpadRenderer = ({ data, isExample }: { data: ChannelLaunchpadResult; isExample?: boolean }) => {
  const [expandedVideos, setExpandedVideos] = useState<number[]>([1, 2, 3]);

  const toggleVideo = (order: number) => {
    setExpandedVideos(prev => 
      prev.includes(order) ? prev.filter(o => o !== order) : [...prev, order]
    );
  };

  return (
    <div className="space-y-16 pb-32">
      {/* SECTION 1: READINESS SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ResultCard index={0} accentColor="#e8542a" className="lg:col-span-2 p-8 md:p-10 bg-gradient-to-br from-vy-accent/5 to-[#0d1525]" showShimmer={isExample}>
          <div className="font-mono text-[10px] text-[#e8542a] font-bold uppercase tracking-[0.2em] mb-8">🎯 CHANNEL READINESS ASSESSMENT</div>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="shrink-0">
              <ScoreRing score={data.readinessScore.score / 10} label="READINESS %" />
            </div>
            <div className="space-y-6">
              <h3 
                className="font-display font-black text-white uppercase italic"
                style={{
                  fontSize: 'clamp(14px, 2vw, 20px)',
                  lineHeight: 1.3,
                  fontWeight: 800
                }}
              >
                {data.readinessScore.verdict}
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-green-400">✓ {data.readinessScore.strengthSignal}</p>
                </div>
                <div className="flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-[#e8542a] shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-[#ff8c42]">⚠ {data.readinessScore.gapToFill}</p>
                </div>
              </div>
            </div>
          </div>
        </ResultCard>

        {/* NICHE VALIDATION SCORE CARD */}
        <ResultCard 
          index={0.5} 
          accentColor="#00c8ff" 
          className="p-8 flex flex-col justify-between" 
          showShimmer={isExample}
          style={{
            background: '#0d1525',
            border: '1px solid rgba(0,200,255,0.2)',
            borderLeft: '3px solid #00c8ff',
            borderRadius: '10px',
            padding: '18px 20px',
            boxShadow: '0 0 20px rgba(0,200,255,0.05)'
          }}
        >
          <div>
            <div className="font-mono text-[9px] text-vy-cyan font-black uppercase tracking-widest mb-6">NICHE VALIDATION SCORE</div>
            <div className="space-y-4">
               {[
                 { label: 'Market Demand', val: 92, color: 'text-vy-green', barColor: '#22d3a0' },
                 { label: 'Cloning Difficulty', val: 78, color: 'text-vy-cyan', barColor: '#00c8ff' },
                 { label: 'CPM / Potential', val: 88, color: 'text-vy-violet', barColor: '#22d3a0' },
                 { label: 'Viral Probability', val: 84, color: 'text-vy-accent', barColor: '#00c8ff' }
               ].map((stat, i) => (
                 <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-end">
                       <span className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">{stat.label}</span>
                       <span className={cn("font-display font-black text-xs", stat.color)}>{stat.val}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${stat.val}%` }}
                         className={cn("h-full", stat.color.replace('text-', 'bg-'))}
                         style={{ boxShadow: `0 0 6px ${stat.barColor}` }}
                       />
                    </div>
                 </div>
               ))}
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 mt-6">
             <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-vy-muted uppercase tracking-widest">Global Legitimacy</span>
                <span className="px-2 py-0.5 bg-vy-green/10 border border-vy-green/30 text-[8px] font-black text-vy-green rounded uppercase">VALIDATED</span>
             </div>
          </div>
        </ResultCard>
      </div>

      {/* SECTION 2: NICHE RECOMMENDATIONS */}
      {isExample && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
           {[1, 2, 3].map((_, i) => (
             <div key={i} className="h-48 bg-vy-surface/40 border border-vy-border rounded-2xl shimmer-card" />
           ))}
        </div>
      )}
      {!isExample && (
        <div className="space-y-6">
          <div className="font-mono text-[10px] text-[#e8542a] font-bold uppercase tracking-[0.2em]">NICHE RECOMMENDATIONS</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.nicheRecommendations.map((niche, i) => {
              const isRecommended = niche.nicheName === data.recommendedNiche;
              return (
                <ResultCard 
                  key={i} 
                  index={i + 1} 
                  className={cn(
                    "p-6 bg-[#0d1525] border border-white/5 space-y-4 hover:-translate-y-1 transition-all group",
                    isRecommended && "border-[#e8542a]/40 shadow-[0_0_20px_rgba(232,84,42,0.1)]"
                  )}
                >
                  {isRecommended && (
                    <div className="absolute top-0 right-0 px-2 py-1 bg-[#e8542a] text-white text-[8px] font-black uppercase rounded-bl-lg">★ RECOMMENDED</div>
                  )}
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-display font-bold text-white uppercase leading-tight">{niche.nicheName}</h4>
                    <div className="text-[#e8542a] font-display text-[11px] font-bold">{niche.nicheScore} ✦</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-black uppercase text-black",
                      niche.demandLevel === 'Explosive' ? 'bg-[#00e5a0]' :
                      niche.demandLevel === 'High' ? 'bg-[#00c8ff]' :
                      niche.demandLevel === 'Medium' ? 'bg-[#ff8c42]' : 'bg-[#e8542a] text-white'
                    )}>{niche.demandLevel} DEMAND</div>
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-black uppercase text-white",
                      niche.competitionLevel === 'Blue Ocean' ? 'bg-[#00e5a0] text-black' :
                      niche.competitionLevel === 'Moderate' ? 'bg-[#00c8ff] text-black' :
                      niche.competitionLevel === 'Competitive' ? 'bg-[#ff8c42] text-black' : 'bg-[#e8542a]'
                    )}>{niche.competitionLevel}</div>
                    <div className="px-2 py-0.5 rounded bg-[#00c8ff] text-black text-[8px] font-black uppercase">{niche.avgRPM} RPM</div>
                  </div>
                  <p className="text-[13px] text-[#c8dce8] leading-relaxed font-medium">{niche.whyItWorks}</p>
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[#5a6070]">
                      <Clock className="w-3 h-3" /> {niche.timeToMonetization}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[#ff8c42]">
                      <AlertTriangle className="w-3 h-3" /> {niche.biggestRisk}
                    </div>
                  </div>
                </ResultCard>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: COMPETITION LANDSCAPE */}
      <div className="space-y-8">
        <div className="font-mono text-[10px] text-[#e8542a] font-bold uppercase tracking-[0.2em]">⚔ COMPETITION MAP</div>
        <ResultCard index={4} className="p-6 bg-[#0e1118]/50 border border-[#1c2030]" showShimmer={isExample}>
          <p className="text-sm font-medium text-[#d4d8e8]/80 italic leading-relaxed">{data.competitionLandscape.overallSaturation}</p>
        </ResultCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.competitionLandscape.topChannels.map((channel, i) => (
            <ResultCard key={i} index={i + 5} className="p-6 space-y-5 bg-[#0d1525]" showShimmer={isExample}>
              <div className="flex justify-between items-center">
                <h5 className="text-base font-display font-bold text-white uppercase">{channel.channelName}</h5>
                <div className="font-mono text-[9px] text-[#5a6070] uppercase">{channel.estimatedSubs} SUBS</div>
              </div>
              <div className="space-y-3">
                <div className="bg-[#00e5a0]/5 border border-[#00e5a0]/20 p-3 rounded-lg">
                  <div className="font-mono text-[8px] text-[#00e5a0] font-bold uppercase mb-1">WHAT THEY DO WELL</div>
                  <p className="text-xs text-[#d4d8e8]/90 font-medium leading-relaxed">{channel.whatTheyDoWell}</p>
                </div>
                <div className="bg-[#e8542a]/5 border border-[#e8542a]/20 p-3 rounded-lg">
                  <div className="font-mono text-[8px] text-[#e8542a] font-bold uppercase mb-1">THEIR WEAKNESS</div>
                  <p className="text-xs text-[#d4d8e8]/90 font-medium leading-relaxed italic">"{channel.theirWeakness}"</p>
                </div>
              </div>
            </ResultCard>
          ))}
        </div>
        <ResultCard index={8} className="p-8 border-l-4 border-[#00e5a0] bg-[#00e5a0]/5" showShimmer={isExample}>
          <div className="font-mono text-[10px] text-[#00e5a0] font-bold uppercase tracking-[0.2em] mb-3">YOUR ENTRY ADVANTAGE</div>
          <p className="text-xl font-display font-bold text-white leading-relaxed uppercase">{data.competitionLandscape.newCreatorAdvantage}</p>
        </ResultCard>
      </div>

      {/* SECTION 4: AUDIENCE PROFILE */}
      <div className="space-y-8">
        <div className="font-mono text-[10px] text-[#e8542a] font-bold uppercase tracking-[0.2em]">AUDIENCE INSIGHTS</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultCard index={9} accentColor="#e8542a" className="p-6" showShimmer={isExample}>
            <CardHeader icon={UserIcon} title="DEMOGRAPHICS" />
            <div className="mt-4 flex flex-col gap-2">
               <div className="text-2xl font-display font-black text-white">{data.audienceProfile.primaryAge}</div>
               <div className="text-lg font-bold text-[#5a6070] italic uppercase leading-none">{data.audienceProfile.gender}</div>
            </div>
          </ResultCard>
          <ResultCard index={10} accentColor="#00c8ff" className="p-6" showShimmer={isExample}>
            <CardHeader icon={Target} title="PSYCHOGRAPHICS" />
            <div className="mt-4 space-y-2">
               {data.audienceProfile.psychographics.map((trait, i) => (
                 <div key={i} className="flex gap-2 items-center text-xs font-semibold text-[#d4d8e8]/90 uppercase">
                    <ChevronRight className="w-3 h-3 text-[#00c8ff]" /> {trait}
                 </div>
               ))}
            </div>
          </ResultCard>
          <ResultCard index={11} accentColor="#f59e0b" className="p-6" showShimmer={isExample}>
            <CardHeader icon={AlertTriangle} title="PAIN POINTS" />
            <div className="mt-4 space-y-2">
               {data.audienceProfile.painPoints.map((point, i) => (
                 <div key={i} className="flex gap-2 items-start text-xs font-semibold text-[#ff8c42] uppercase">
                    <span className="text-[#e8542a]">✗</span> {point}
                 </div>
               ))}
            </div>
          </ResultCard>
          <ResultCard index={12} accentColor="#8b5cf6" className="p-6" showShimmer={isExample}>
            <CardHeader icon={Clock} title="HABITS & TRIGGERS" />
            <div className="mt-4 space-y-4">
              <div>
                <div className="font-mono text-[8px] text-[#5a6070] uppercase mb-1">WATCHING HABITS</div>
                <p className="text-xs font-bold text-white">{data.audienceProfile.watchingHabits}</p>
              </div>
              <div>
                <div className="font-mono text-[8px] text-[#8b5cf6] font-bold uppercase mb-1">SUBSCRIBE TRIGGER</div>
                <p className="text-xs font-bold text-[#d4d8e8]/90 italic">"{data.audienceProfile.whatMakesThemSubscribe}"</p>
              </div>
            </div>
          </ResultCard>
        </div>
      </div>

      {/* SECTION 5: DIFFERENTIATION ANGLE */}
      <ResultCard index={13} accentColor="#8b5cf6" className="p-10 border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 text-center space-y-8" showShimmer={isExample}>
        <div className="space-y-4">
          <div className="font-mono text-[10px] text-[#8b5cf6] font-bold uppercase tracking-[0.3em]">STRATEGIC DIFFERENTIATION</div>
          <h2 className="text-3xl font-display font-black text-white uppercase italic leading-tight drop-shadow-xl">"{data.differentiationAngle.uniquePositioning}"</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
           <div className="px-4 py-1.5 rounded bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest">{data.differentiationAngle.contentPersonality}</div>
           <p className="text-sm font-medium text-[#d4d8e8]/80">{data.differentiationAngle.visualIdentity}</p>
        </div>
        <div className="pt-10">
           <div className="text-3xl font-display font-black italic text-[#8b5cf6] tracking-tighter uppercase">
              {data.differentiationAngle.tagline}
           </div>
        </div>
      </ResultCard>

      {/* SECTION 6: CHANNEL NAME IDEAS */}
      <div className="space-y-6">
        <div className="font-mono text-[10px] text-[#e8542a] font-bold uppercase tracking-[0.2em]">CHANNEL NAME IDEAS</div>
        <div className="flex overflow-x-auto gap-4 custom-scrollbar pb-4 -mx-10 px-10">
           {data.channelNameIdeas.map((idea, i) => (
             <ResultCard key={i} index={i} className="min-w-[240px] p-6 bg-[#080d18] border border-white/5 space-y-3 group hover:border-[#e8542a] transition-all shrink-0" showShimmer={isExample}>
                <div className="flex justify-between items-start">
                   <h6 className="text-xl font-display font-black text-white tracking-widest uppercase">{idea.name}</h6>
                   <CopyButton content={idea.name} />
                </div>
                <p className="font-mono text-[9px] text-[#5a6070] uppercase leading-relaxed font-bold">{idea.reason}</p>
             </ResultCard>
           ))}
        </div>
      </div>

      {/* SECTION 7: FIRST 10 VIDEO IDEAS */}
      <div className="space-y-8">
        <div className="font-mono text-[10px] text-[#e8542a] font-bold uppercase tracking-[0.2em]">LAUNCH SEQUENCE: FIRST 10 VIDEOS</div>
        <div className="space-y-4">
           {data.first10VideoIdeas.map((video, i) => {
             const isExpanded = expandedVideos.includes(video.order);
             return (
               <ResultCard key={i} index={i} className="overflow-hidden bg-[#0d1525] border border-white/5 hover:border-white/10 transition-all" showShimmer={isExample}>
                  <div 
                    className="p-5 flex items-center gap-6 cursor-pointer group"
                    onClick={() => toggleVideo(video.order)}
                  >
                     <div className="w-10 h-10 rounded-full border-2 border-[#e8542a] flex items-center justify-center font-display font-black text-[#e8542a] shrink-0 group-hover:scale-110 transition-transform">
                        {video.order.toString().padStart(2, '0')}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                           <div className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-black text-white uppercase tracking-widest">{video.type}</div>
                           <div className="text-[10px] font-mono text-[#e8542a] font-black tracking-widest">{video.viralScore} ✦</div>
                        </div>
                        <h5 className="text-base font-display font-bold text-white uppercase italic">{video.title}</h5>
                     </div>
                     <div className="flex items-center gap-4">
                        <CopyButton content={`Title: ${video.title}\nHook: ${video.hook}`} />
                        <ChevronRight className={cn("w-5 h-5 text-[#5a6070] transition-transform", isExpanded && "rotate-90")} />
                     </div>
                  </div>
                  <AnimatePresence>
                     {isExpanded && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden bg-black/30 border-t border-white/5"
                       >
                         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                               <div className="font-mono text-[8px] text-[#e8542a] font-bold uppercase">STRATEGIC PLACEMENT</div>
                               <p className="text-xs font-semibold text-[#d4d8e8]/80 leading-relaxed font-medium uppercase tracking-tight">{video.whyFirst}</p>
                            </div>
                            <div className="space-y-2">
                               <div className="font-mono text-[8px] text-[#00e5a0] font-bold uppercase">THE HOOK</div>
                               <p className="text-xs font-bold text-white italic leading-relaxed">"{video.hook}"</p>
                            </div>
                         </div>
                       </motion.div>
                     )}
                  </AnimatePresence>
               </ResultCard>
             );
           })}
        </div>
      </div>

      {/* SECTION 8: LAUNCH ROADMAP */}
      <div className="space-y-10">
        <div className="font-mono text-[10px] text-[#e8542a] font-bold uppercase tracking-[0.2em]">90-DAY LAUNCH ROADMAP</div>
        <div className="px-4">
           <div className="relative">
              {/* Connector line */}
              <div className="absolute top-6 inset-x-0 h-1 bg-gradient-to-r from-[#e8542a] to-[#ff8c42]/20 rounded-full" />
              
              <div className="grid grid-cols-4 gap-4 relative">
                 <div className="space-y-10 flex flex-col items-center">
                    <div className="p-1.5 rounded-full bg-[#e8542a] shadow-[0_0_20px_rgba(232,84,42,0.6)] relative z-10 w-12 h-12 flex items-center justify-center font-display font-black text-[10px] text-white">W1</div>
                    <div className="text-center">
                       <div className="font-display text-[10px] font-black text-[#e8542a] uppercase tracking-widest mb-3">WEEK 01</div>
                       <p className="text-[11px] font-bold text-white leading-relaxed bg-[#e8542a]/5 p-3 rounded-xl border border-[#e8542a]/20">
                          {data.launchRoadmap.week1}
                       </p>
                    </div>
                 </div>
                 <div className="space-y-10 flex flex-col items-center">
                    <div className="p-1.5 rounded-full bg-[#1c2030] border-2 border-[#5a6070]/30 relative z-10 w-12 h-12 flex items-center justify-center font-display font-black text-[10px] text-[#5a6070]">M1</div>
                    <div className="text-center">
                       <div className="font-display text-[10px] font-black text-[#5a6070] uppercase tracking-widest mb-3">MONTH 01</div>
                       <p className="text-[11px] font-bold text-[#d4d8e8]/60 leading-relaxed border border-[#1c2030] p-3 rounded-xl">
                          {data.launchRoadmap.week2to4}
                       </p>
                    </div>
                 </div>
                 <div className="space-y-10 flex flex-col items-center">
                    <div className="p-1.5 rounded-full bg-[#1c2030] border-2 border-[#5a6070]/30 relative z-10 w-12 h-12 flex items-center justify-center font-display font-black text-[10px] text-[#5a6070]">M2-3</div>
                    <div className="text-center">
                       <div className="font-display text-[10px] font-black text-[#5a6070] uppercase tracking-widest mb-3">SCALING</div>
                       <p className="text-[11px] font-bold text-[#d4d8e8]/60 leading-relaxed border border-[#1c2030] p-3 rounded-xl">
                          {data.launchRoadmap.month2to3}
                       </p>
                    </div>
                 </div>
                 <div className="space-y-10 flex flex-col items-center">
                    <div className="p-1.5 rounded-full bg-[#1c2030] border-2 border-[#5a6070]/30 relative z-10 w-12 h-12 flex items-center justify-center font-display font-black text-[10px] text-[#5a6070]">M4-6</div>
                    <div className="text-center">
                       <div className="font-display text-[10px] font-black text-[#5a6070] uppercase tracking-widest mb-3">REVENUE</div>
                       <p className="text-[11px] font-bold text-[#d4d8e8]/60 leading-relaxed border border-[#1c2030] p-3 rounded-xl">
                          {data.launchRoadmap.month4to6}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* SECTION 9: SURVIVAL WARNINGS */}
      <div className="space-y-4">
        <div className="font-mono text-[10px] text-[#e8542a] font-bold uppercase tracking-[0.2em] mb-4">SURVIVAL PROTOCOL</div>
        {data.survivalWarnings.map((warning, i) => (
          <ResultCard key={i} index={i} className="p-6 border-l-4 border-red-500 bg-red-500/5" showShimmer={isExample}>
             <div className="font-mono text-[10px] text-red-500 font-bold uppercase tracking-widest mb-2">☠ WARNING #0{i+1}:</div>
             <p className="text-sm font-semibold text-[#c8dce8] leading-relaxed uppercase">{warning}</p>
          </ResultCard>
        ))}
      </div>

      {/* EXPORT BUTTON */}
      <div className="flex justify-center pt-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-3 px-10 py-5 bg-[#0e1118] border border-[#1c2030] rounded-2xl font-display font-black text-xs uppercase tracking-[0.3em] text-white hover:border-[#e8542a] hover:text-[#e8542a] transition-all group"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          EXPORT FULL REPORT
        </button>
      </div>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .ResultCard { border: 1px solid #eee !important; break-inside: avoid; }
          .bg-vy-bg { background: white !important; }
          aside, header, #input-zone { display: none !important; }
          main { overflow: visible !important; height: auto !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .max-w-4xl { max-width: 100% !important; margin: 0 !important; }
          .text-vy-white { color: #111 !important; }
          .text-vy-muted { color: #666 !important; }
          .bg-vy-accent { background: #e8542a !important; color: white !important; }
          .bg-vy-accent\\/5 { background: #fff8f5 !important; }
          .md\\:grid-cols-2, .md\\:grid-cols-3, .md\\:grid-cols-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
