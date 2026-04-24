import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  MousePointer2,
  Brain,
  AlertTriangle,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { HookAnalyzerResult } from '../types';

const MetricBar = ({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-end">
      <span className="font-mono text-[9px] text-vy-muted uppercase tracking-widest">{label}</span>
      <span className={cn("font-display font-black text-xs", color)}>{value}%</span>
    </div>
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        className={cn("h-full", color.replace('text-', 'bg-'))}
      />
    </div>
  </div>
);

export const HookAnalyzerRenderer = ({ data, isExample }: { data: HookAnalyzerResult; isExample?: boolean }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const scoreColor = data.ctrScore >= 85 ? 'text-vy-green' : data.ctrScore >= 70 ? 'text-vy-cyan' : 'text-vy-accent';

  return (
    <div className="space-y-8 animate-fade-up">
      {/* SCORE CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0e1118] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <TrendingUp className="w-48 h-48 text-white" />
          </div>
          
          <div className="relative shrink-0 flex flex-col items-center">
            <div className="relative">
              <svg width="160" height="160" viewBox="0 0 120 120" className="rotate-[-90deg]">
                <circle cx="60" cy="60" r="54" stroke="#ffffff0f" strokeWidth="6" fill="none"/>
                <motion.circle 
                  cx="60" cy="60" r="54" 
                  stroke={data.ctrScore >= 85 ? '#22d3a0' : data.ctrScore >= 70 ? '#00c8ff' : '#e8542a'}
                  strokeWidth="6" fill="none"
                  strokeDasharray="339.3"
                  initial={{ strokeDashoffset: 339.3 }}
                  animate={{ strokeDashoffset: 339.3 * (1 - data.ctrScore/100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center rotate-[90deg]">
                <span className={cn("font-display font-black text-4xl mb-1", scoreColor)}>{data.ctrScore}</span>
                <span className="font-mono text-[10px] text-vy-muted font-bold tracking-widest uppercase">CTR SCORE</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 relative">
             <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-vy-violet fill-current" />
                <span className="font-mono text-[10px] font-black text-vy-violet uppercase tracking-[0.2em]">PSYCHOLOGY VERDICT</span>
             </div>
             <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase italic leading-tight">
               "{data.verdict}"
             </h2>
             <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-vy-green/10 border border-vy-green/30 rounded font-mono text-[9px] font-black text-vy-green uppercase tracking-widest">ALGORITHM CERTIFIED</span>
                <span className="px-2 py-0.5 bg-vy-cyan/10 border border-vy-cyan/30 rounded font-mono text-[9px] font-black text-vy-cyan uppercase tracking-widest">HOOK VALIDATED</span>
             </div>
          </div>
        </div>

        {/* METRICS PANEL */}
        <div className="bg-[#0e1118] border border-white/5 rounded-3xl p-6 space-y-5">
           <MetricBar label="PRIMARY TRIGGER" value={data.psychologyBreakdown.curiosityGap} color="text-vy-green" delay={0.2} />
           <MetricBar label="CURIOSITY GAP" value={data.psychologyBreakdown.curiosityGap} color="text-vy-cyan" delay={0.3} />
           <MetricBar label="URGENCY" value={data.psychologyBreakdown.urgency} color="text-vy-violet" delay={0.4} />
           <MetricBar label="SPECIFICITY" value={data.psychologyBreakdown.specificity} color="text-vy-accent" delay={0.5} />
           <MetricBar label="EMOTIONAL CHARGE" value={data.psychologyBreakdown.emotionalCharge} color="text-vy-white" delay={0.6} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WEAKNESSES */}
        <div className="bg-[#0e1118] border border-white/5 border-l-4 border-l-vy-accent rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-vy-accent fill-current" />
            <span className="font-mono text-[10px] font-black text-vy-accent uppercase tracking-widest">CRITICAL LEAKS</span>
          </div>
          <div className="space-y-3">
             {data.weaknesses.map((w, i) => (
                <div key={i} className="flex gap-3 items-start group">
                   <div className="w-1.5 h-1.5 rounded-full bg-vy-accent mt-2 group-hover:scale-150 transition-transform" />
                   <p className="text-sm font-medium text-[#c8dce8] leading-relaxed uppercase tracking-tight italic">{w}</p>
                </div>
             ))}
          </div>
        </div>

        {/* REWRITES */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 pl-2">
              <Sparkles className="w-4 h-4 text-vy-cyan fill-current" />
              <span className="font-mono text-[10px] font-black text-vy-cyan uppercase tracking-widest">ALGORITHM-TUNED REWRITES</span>
           </div>
           <div className="space-y-3">
              {data.rewrites.map((r, i) => (
                 <div key={i} className="bg-[#0e1118] border border-white/5 hover:border-vy-cyan/30 rounded-2xl p-4 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                       <span className="px-2 py-0.5 bg-vy-cyan/10 border border-vy-cyan/30 rounded text-[8px] font-black text-vy-cyan uppercase tracking-widest">{r.version}</span>
                       <button 
                          onClick={() => handleCopy(r.title, `rewrite-${i}`)}
                          className="p-1.5 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                          {copiedField === `rewrite-${i}` ? <Check className="w-3 h-3 text-vy-green" /> : <Copy className="w-3 h-3 text-vy-muted" />}
                       </button>
                    </div>
                    <p className="font-display font-bold text-white text-sm uppercase italic leading-snug">"{r.title}"</p>
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-vy-cyan/5 -rotate-45 translate-x-8 translate-y-8 pointer-events-none" />
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-[#0e1118] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-vy-violet/10 border border-vy-violet/20 flex items-center justify-center">
               <MousePointer2 className="w-6 h-6 text-vy-violet" />
            </div>
            <div>
               <div className="font-mono text-[9px] text-vy-muted uppercase tracking-widest">PREDICTED CTR CLIMB</div>
               <div className="font-display font-black text-xl text-white">+14.2% POTENTIAL</div>
            </div>
         </div>
         <button className="px-6 py-3 bg-vy-violet font-display font-black text-[10px] text-white uppercase tracking-widest rounded-xl hover:scale-105 transition-transform">
            GENERATE A/B TEST PAIRS
         </button>
      </div>
    </div>
  );
};
