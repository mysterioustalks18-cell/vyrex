import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  ChevronRight,
  TrendingDown,
  ArrowUpRight,
  Zap,
  Target,
  Clock,
  Briefcase,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MonetizationMapResult } from '../types';

export const MonetizationMapRenderer = ({ data, isExample }: { data: MonetizationMapResult; isExample?: boolean }) => {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* REVENUE HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0e1118] border border-white/5 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
              <DollarSign className="w-48 h-48 text-vy-green" />
           </div>
           <div className="relative z-10 space-y-4">
              <div className="font-mono text-[10px] text-vy-green font-black uppercase tracking-[0.4em]">● ADSENSE ESTIMATE (BASE)</div>
              <div className="flex items-baseline gap-2">
                 <span className="font-display font-black text-5xl text-white tracking-tighter uppercase">{data.estimatedMonthlyRevenue.adSense}</span>
                 <span className="font-mono text-vy-muted text-xs uppercase">/ MO</span>
              </div>
              <p className="text-xs font-semibold text-vy-muted uppercase tracking-widest italic">Based on industry average CPM and performance depth.</p>
           </div>
        </div>

        <div className="bg-[#0e1118] border border-white/5 border-l-4 border-l-vy-violet rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
              <TrendingUp className="w-48 h-48 text-vy-violet" />
           </div>
           <div className="relative z-10 space-y-4">
              <div className="font-mono text-[10px] text-vy-violet font-black uppercase tracking-[0.4em]">● TOTAL REVENUE POTENTIAL</div>
              <div className="flex items-baseline gap-2">
                 <span className="font-display font-black text-5xl text-vy-violet tracking-tighter uppercase">{data.estimatedMonthlyRevenue.totalPotential}</span>
                 <span className="font-mono text-vy-muted text-xs uppercase">/ MO</span>
              </div>
              <div className="flex gap-2">
                 <div className="px-2 py-0.5 bg-vy-violet/10 border border-vy-violet/30 rounded text-[9px] font-black text-vy-violet uppercase tracking-widest">ECOSYSTEM TOTAL</div>
                 <div className="px-2 py-0.5 bg-vy-green/10 border border-vy-green/30 rounded text-[9px] font-black text-vy-green uppercase tracking-widest">+420% UPLIFT</div>
              </div>
           </div>
        </div>
      </div>

      {/* REVENUE STREAMS */}
      <div className="space-y-4">
         <div className="flex items-center gap-2 pl-2">
            <Briefcase className="w-4 h-4 text-vy-cyan fill-current" />
            <span className="font-mono text-[10px] font-black text-vy-cyan uppercase tracking-widest">STRATEGIC REVENUE STREAMS</span>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.revenueStreams.map((stream, i) => (
               <div key={i} className="bg-[#0e1118] border border-white/5 rounded-2xl p-6 space-y-5 hover:border-vy-cyan/30 transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start">
                     <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                        stream.type === 'Active' ? 'bg-vy-accent/10 border border-vy-accent/30 text-vy-accent' :
                        stream.type === 'Passive' ? 'bg-vy-green/10 border border-vy-green/30 text-vy-green' :
                        'bg-vy-violet/10 border border-vy-violet/30 text-vy-violet'
                     )}>{stream.type}</span>
                     <div className="font-mono text-[10px] text-vy-cyan font-black italic">{stream.potentialMonthly}</div>
                  </div>

                  <div className="space-y-1">
                     <h4 className="font-display font-black text-white text-lg uppercase tracking-tight italic group-hover:text-vy-cyan transition-colors">{stream.name}</h4>
                     <p className="text-[11px] font-medium text-[#c8dce8] opacity-70 leading-relaxed uppercase tracking-tight">{stream.implementation}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-1.5 font-mono text-[9px] text-vy-muted uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> EFFORT: {stream.effort}
                     </div>
                     <ArrowUpRight className="w-4 h-4 text-vy-muted group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  
                  <div className="absolute top-0 right-0 w-12 h-12 bg-white/[0.02] -rotate-45 translate-x-6 -translate-y-6 pointer-events-none" />
               </div>
            ))}
         </div>
      </div>

      {/* STRATEGIC ASSETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-[#0e1118] border border-white/5 rounded-3xl p-6 border-l-4 border-l-vy-green relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-vy-green/10 border border-vy-green/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-vy-green" />
               </div>
               <span className="font-mono text-[11px] font-black text-vy-green uppercase tracking-[0.3em]">QUICK WIN PROTOCOL</span>
            </div>
            <p className="font-display font-bold text-white text-xl uppercase italic leading-tight group-hover:translate-x-2 transition-transform duration-500">
               {data.quickWin}
            </p>
         </div>

         <div className="bg-[#0e1118] border border-white/5 rounded-3xl p-6 border-l-4 border-l-vy-violet relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-vy-violet/10 border border-vy-violet/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-vy-violet" />
               </div>
               <span className="font-mono text-[11px] font-black text-vy-violet uppercase tracking-[0.3em]">LONG-TERM ASSET BUILD</span>
            </div>
            <p className="font-display font-bold text-white text-xl uppercase italic leading-tight group-hover:translate-x-2 transition-transform duration-500">
               {data.longTermAsset}
            </p>
         </div>
      </div>

      {/* WARNING ZONES */}
      <div className="space-y-4">
         <div className="flex items-center gap-2 pl-2">
            <AlertTriangle className="w-4 h-4 text-vy-accent fill-current" />
            <span className="font-mono text-[10px] font-black text-vy-accent uppercase tracking-widest">MONETIZATION TRAPS</span>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.warningZones.map((warning, i) => (
               <div key={i} className="p-5 border border-red-500/20 bg-red-500/5 rounded-2xl flex gap-4 items-start group">
                  <span className="font-mono text-[11px] font-black text-red-500">#{i + 1}</span>
                  <p className="text-xs font-bold text-[#c8dce8] uppercase tracking-tight italic leading-relaxed group-hover:text-white transition-colors">{warning}</p>
               </div>
            ))}
         </div>
      </div>

      <div className="bg-[#0e1118] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-center gap-8">
         <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-vy-violet fill-current" />
            <span className="font-mono text-[10px] font-black text-vy-violet uppercase tracking-[0.2em]">ALGORITHM REVENUE MULTIPLIER ACTIVE</span>
         </div>
         <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
         <div className="flex items-center gap-4">
            <div className="text-right">
               <div className="font-mono text-[9px] text-vy-muted uppercase tracking-widest leading-none">EFFICIENCY RATING</div>
               <div className="font-display font-black text-xl text-vy-green">ALPHA-9</div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-vy-green p-1 flex items-center justify-center">
               <div className="w-full h-full rounded-full bg-vy-green/20 animate-pulse" />
            </div>
         </div>
      </div>
    </div>
  );
};
