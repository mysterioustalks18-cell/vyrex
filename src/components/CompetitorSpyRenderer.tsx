import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Target, 
  ShieldAlert, 
  ChevronRight,
  User as UserIcon,
  Search,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Layout,
  MousePointer2,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CompetitorSpyResult } from '../types';

export const CompetitorSpyRenderer = ({ data, isExample }: { data: CompetitorSpyResult; isExample?: boolean }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* CHANNEL PROFILE CARD */}
      <div className="bg-[#0e1118] border border-white/5 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
           <Search className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 space-y-8">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-vy-violet/20 border border-vy-violet/30 rounded-xl">
                 <Lock className="w-5 h-5 text-vy-violet" />
              </div>
              <div className="flex flex-col">
                 <span className="font-mono text-[9px] text-vy-muted uppercase tracking-widest leading-none mb-1">INTEL CLASSIFICATION</span>
                 <span className="font-display font-black text-xs text-white uppercase tracking-[0.2em] italic underline decoration-vy-violet/50">LEVEL 4 DEEP DIVE</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                 <div className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">CONTENT PILLARS</div>
                 <div className="flex flex-wrap gap-2">
                    {data.channelProfile.contentPillars.map((p, i) => (
                       <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded font-bold text-[10px] text-white uppercase italic">{p}</span>
                    ))}
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">UPLOAD PATTERN</div>
                 <div className="text-sm font-black text-white uppercase">{data.channelProfile.uploadPattern}</div>
              </div>
              <div className="space-y-2">
                 <div className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">THUMBNAIL STYLE</div>
                 <div className="text-sm font-black text-vy-cyan uppercase">{data.channelProfile.thumbnailStyle}</div>
              </div>
              <div className="space-y-2">
                 <div className="font-mono text-[8px] text-vy-muted uppercase tracking-widest">HOOK FORMULA</div>
                 <div className="text-xs font-bold text-white italic">{data.channelProfile.hookFormula}</div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOP PATTERNS */}
        <div className="md:col-span-2 space-y-4">
           <div className="flex items-center gap-2 pl-2">
              <Zap className="w-4 h-4 text-vy-green fill-current" />
              <span className="font-mono text-[10px] font-black text-vy-green uppercase tracking-widest">REPLICABLE PATTERNS</span>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.topContentPatterns.map((p, i) => (
                 <div key={i} className="bg-[#0e1118] border border-white/5 rounded-2xl p-5 hover:border-vy-green/30 transition-all group">
                    <div className="font-display font-black text-white uppercase italic mb-2 tracking-tight">"{p.pattern}"</div>
                    <div className="h-[2px] w-8 bg-vy-green/30 mb-3 group-hover:w-full transition-all duration-500" />
                    <p className="text-xs font-medium text-[#c8dce8] leading-relaxed italic opacity-80">{p.whyItWorks}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* CONTENT GAPS */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 pl-2">
              <AlertTriangle className="w-4 h-4 text-vy-accent fill-current" />
              <span className="font-mono text-[10px] font-black text-vy-accent uppercase tracking-widest">VULNERABILITY GAPS</span>
           </div>
           <div className="bg-[#0e1118] border border-white/5 border-l-4 border-l-vy-accent rounded-2xl p-6 h-full space-y-4">
              {data.contentGaps.map((gap, i) => (
                 <div key={i} className="flex gap-3 items-start group">
                    <div className="shrink-0 w-5 h-5 rounded bg-vy-accent/10 border border-vy-accent/30 flex items-center justify-center text-[9px] font-black text-vy-accent">{i + 1}</div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight italic leading-relaxed">{gap}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* CLONE STRATEGY */}
      <div className="bg-[#0e1118] border border-white/5 rounded-3xl p-8 space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
               <div className="font-mono text-[10px] text-vy-violet font-black uppercase tracking-[0.3em]">PRO MASTERPLAN</div>
               <h2 className="text-2xl font-display font-black text-white uppercase italic leading-[1.1]">
                  {data.cloneVerdict}
               </h2>
               <p className="text-sm font-medium text-[#c8dce8] opacity-70 leading-relaxed italic">{data.cloneStrategy}</p>
            </div>
            
            <div className="shrink-0 space-y-4 w-full md:w-auto">
               <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col items-center">
                  <div className="font-mono text-[9px] text-vy-muted uppercase tracking-widest mb-2">CLONE DIFFICULTY</div>
                  <div className="flex items-end gap-1">
                     <span className="font-display font-black text-4xl text-white">{(data.cloneDifficulty || 0).toFixed(1)}</span>
                     <span className="font-mono text-vy-muted text-[10px] mb-2">/ 10</span>
                  </div>
                  <div className="flex gap-1 mt-4">
                     {[1,2,3,4,5].map(i => (
                        <div key={i} className={cn(
                           "w-6 h-1.5 rounded-full transition-all duration-500",
                           i <= data.cloneDifficulty / 2 ? "bg-vy-violet shadow-[0_0_8px_#8b5cf6]" : "bg-white/5"
                        )} />
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-4 p-5 bg-vy-violet/5 border border-vy-violet/20 rounded-2xl group cursor-pointer hover:bg-vy-violet/10 transition-all">
            <div className="w-12 h-12 rounded-full bg-vy-violet flex items-center justify-center shrink-0">
               <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
               <div className="font-mono text-[9px] text-vy-violet font-black uppercase tracking-widest">FIRST ATTACK ANGLE</div>
               <div className="font-display font-bold text-white text-base md:text-lg uppercase italic tracking-tight">
                  {data.firstVideoIdea.title}
               </div>
               <p className="text-[11px] font-medium text-[#c8dce8] italic opacity-60 uppercase tracking-tighter">{data.firstVideoIdea.angle}</p>
            </div>
            <div className="shrink-0 p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
               <ChevronRight className="w-5 h-5 text-vy-violet" />
            </div>
         </div>
      </div>
    </div>
  );
};
