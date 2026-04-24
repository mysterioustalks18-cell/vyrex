import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Copy, 
  Check, 
  Zap, 
  Search,
  MessageCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TitleForgeResult } from '../types';

export const TitleForgeRenderer = ({ data }: { data: TitleForgeResult }) => {
  const [expandedTitles, setExpandedTitles] = useState<number[]>(data.titles.slice(0, 3).map(t => t.rank));
  const [selectedForTest, setSelectedForTest] = useState<number[]>([]);

  const toggleTitle = (rank: number) => {
    setExpandedTitles(prev => 
      prev.includes(rank) ? prev.filter(r => r !== rank) : [...prev, rank]
    );
  };

  const toggleTestSelection = (rank: number) => {
    setSelectedForTest(prev => {
      if (prev.includes(rank)) return prev.filter(r => r !== rank);
      if (prev.length >= 2) return [prev[1], rank];
      return [...prev, rank];
    });
  };

  const getTriggerColor = (trigger: string) => {
    const t = trigger.toLowerCase();
    if (t.includes('curiosity')) return 'bg-vy-cyan/10 border-vy-cyan/30 text-vy-cyan';
    if (t.includes('shock')) return 'bg-vy-accent/10 border-vy-accent/30 text-vy-accent';
    if (t.includes('fear')) return 'bg-red-500/10 border-red-500/30 text-red-500';
    if (t.includes('authority')) return 'bg-vy-violet/10 border-vy-violet/30 text-vy-violet';
    if (t.includes('greed')) return 'bg-amber-500/10 border-amber-500/30 text-amber-500';
    if (t.includes('awe')) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500';
    return 'bg-vy-muted/10 border-vy-border text-vy-muted';
  };

  const getCTRColor = (ctr: string) => {
    const val = parseFloat(ctr.split('-')[1] || ctr);
    if (val < 5) return 'text-red-500';
    if (val < 7) return 'text-amber-500';
    return 'text-vy-green';
  };

  const getCTRBarColor = (ctr: string) => {
    const val = parseFloat(ctr.split('-')[1] || ctr);
    if (val < 5) return 'bg-red-500';
    if (val < 7) return 'bg-amber-500';
    return 'bg-vy-green';
  };

  const CopyButton = ({ content }: { content: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <button onClick={handleCopy} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors group relative z-10">
        {copied ? <Check className="w-3.5 h-3.5 text-vy-green" /> : <Copy className="w-3.5 h-3.5 text-vy-muted group-hover:text-vy-white" />}
      </button>
    );
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* TITLE A/B TESTER UI — SEARCH SIMULATOR */}
      <AnimatePresence>
        {selectedForTest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#03050a] border border-vy-cyan/30 rounded-[32px] p-8 shadow-[0_0_50px_rgba(0,200,255,0.1)] relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Search className="w-48 h-48 text-vy-cyan" />
             </div>
             
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-vy-cyan animate-pulse" />
                   <h3 className="font-display font-black text-xl text-white uppercase italic tracking-tighter">SEARCH SIMULATOR</h3>
                </div>
                <button 
                  onClick={() => setSelectedForTest([])}
                  className="font-mono text-[9px] text-vy-muted hover:text-white uppercase tracking-widest"
                >
                  [ CLEAR SELECTION ]
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-x-0 md:divide-x divide-white/5">
                {[0, 1].map((idx) => {
                  const titleIdx = selectedForTest[idx];
                  const title = data.titles.find(t => t.rank === titleIdx);
                  
                  return (
                    <div key={idx} className={cn("space-y-6", idx === 1 && "md:pl-8")}>
                       <div className="font-mono text-[8px] text-vy-muted uppercase tracking-widest flex justify-between">
                          <span>VARIANT 0{idx + 1}</span>
                          {title && <span className="text-vy-green font-black">{title.predictedCTR} CTR</span>}
                       </div>
                       
                       {title ? (
                         <div className="space-y-4">
                            <div className="aspect-video bg-vy-surface rounded-xl border border-vy-border relative overflow-hidden flex flex-col justify-center items-center px-8 text-center group">
                               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                               <span className="relative z-10 font-display font-black text-sm md:text-lg text-white uppercase italic leading-tight drop-shadow-xl">{title.thumbnailText}</span>
                               <div className="absolute bottom-3 right-3 px-1.5 py-0.5 bg-black/80 text-white text-[8px] font-mono rounded">12:45</div>
                            </div>
                            <h4 className="text-sm font-sans font-extrabold text-white leading-snug line-clamp-2">
                               {title.title}
                            </h4>
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-vy-surface border border-vy-border shrink-0" />
                               <div className="space-y-1">
                                  <div className="h-2 w-24 bg-white/10 rounded" />
                                  <div className="h-2 w-16 bg-white/5 rounded" />
                               </div>
                            </div>
                         </div>
                       ) : (
                         <div className="aspect-video rounded-xl border border-dashed border-white/5 flex items-center justify-center">
                            <span className="font-mono text-[9px] text-vy-muted uppercase animate-pulse">Select title below...</span>
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Section: Video Core */}
      <div className="bg-[#0e1118]/80 border border-white/5 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 transition-transform group-hover:scale-110">
            <Sparkles className="w-24 h-24 text-vy-accent" />
         </div>
         <div className="font-mono text-[9px] font-black text-vy-accent uppercase tracking-[0.3em] mb-2">TOPIC DECODED:</div>
         <h1 className="font-display font-semibold text-lg text-vy-white leading-snug tracking-tight max-w-2xl relative z-10">
           {data.videoCore}
         </h1>
      </div>

      {/* Titles Section */}
      <div className="space-y-4">
        {data.titles.map((title) => (
          <div key={title.rank} className="bg-[#0e1118] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all shadow-xl group">
             <div className="p-5 flex gap-5 items-start">
               {/* Rank badge */}
               <div className="w-10 h-10 rounded-full border border-vy-accent/30 bg-vy-accent/5 flex items-center justify-center shrink-0 mt-1">
                 <span className="font-display font-bold text-sm text-vy-accent tracking-tighter">
                   {title.rank.toString().padStart(2, '0')}
                 </span>
               </div>

               {/* Content */}
               <div className="flex-1 space-y-4">
                 <div className="flex justify-between items-start gap-4">
                   <h2 className="font-display font-bold text-base md:text-lg text-white leading-tight tracking-tight pr-8">
                     {title.title}
                   </h2>
                   <div className="flex items-center gap-2 shrink-0">
                     <button 
                       onClick={() => toggleTestSelection(title.rank)}
                       className={cn(
                         "px-2 py-1 rounded text-[7px] font-black uppercase tracking-widest border transition-all",
                         selectedForTest.includes(title.rank) 
                           ? "bg-vy-cyan text-vy-bg border-vy-cyan" 
                           : "bg-vy-cyan/5 text-vy-cyan border-vy-cyan/20 hover:bg-vy-cyan hover:text-vy-bg"
                       )}
                     >
                       {selectedForTest.includes(title.rank) ? 'Selected' : 'A/B Test'}
                     </button>
                     <CopyButton content={title.title} />
                   </div>
                 </div>

                 {/* Chips row */}
                 <div className="flex flex-wrap gap-2">
                   <div className={cn("px-2.5 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-widest", getTriggerColor(title.psychTrigger))}>
                     {title.psychTrigger}
                   </div>
                   <div className={cn("px-2.5 py-0.5 rounded-md border border-white/10 bg-white/5 text-[9px] font-mono font-bold uppercase tracking-widest", getCTRColor(title.predictedCTR))}>
                     CTR: {title.predictedCTR}
                   </div>
                   <div className="px-2.5 py-0.5 rounded-md border border-white/5 bg-white/5 text-[9px] font-mono text-vy-muted font-bold uppercase tracking-widest">
                     {title.bestFor}
                   </div>
                   <div className="px-2.5 py-0.5 rounded-md border border-vy-cyan/20 bg-vy-cyan/5 text-[9px] font-mono text-vy-cyan font-bold uppercase tracking-widest">
                     🔍 {title.seoKeyword}
                   </div>
                 </div>

                 {/* CTR Bar */}
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(title.ctrScore / 10) * 100}%` }}
                     className={cn("h-full", getCTRBarColor(title.predictedCTR))}
                   />
                 </div>
               </div>

               <button 
                 onClick={() => toggleTitle(title.rank)}
                 className="p-1 hover:bg-white/5 rounded-lg transition-all"
               >
                 <ChevronRight className={cn("w-5 h-5 text-vy-muted transition-transform", expandedTitles.includes(title.rank) && "rotate-90")} />
               </button>
             </div>

             {/* Expansion */}
             <AnimatePresence>
               {expandedTitles.includes(title.rank) && (
                 <motion.div
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden bg-[#0a0d14] border-t border-white/5"
                 >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                       <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                             <Zap className="w-3.5 h-3.5 text-vy-accent fill-current" />
                             <span className="font-mono text-[9px] font-black text-vy-white uppercase tracking-widest">ENGINEERING LOGIC:</span>
                          </div>
                          <p className="text-xs text-vy-muted leading-relaxed italic font-medium">
                            "{title.why}"
                          </p>
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <Sparkles className="w-3.5 h-3.5 text-vy-cyan fill-current" />
                               <span className="font-mono text-[9px] font-black text-vy-white uppercase tracking-widest">THUMBNAIL PAIRING:</span>
                            </div>
                            <CopyButton content={title.thumbnailText} />
                          </div>
                          <div className="bg-vy-surface border border-vy-border p-4 rounded-xl relative group/thumb overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-vy-violet/5 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                             <div className="font-display font-black text-sm text-white uppercase italic tracking-tighter leading-none relative z-10">
                               {title.thumbnailText}
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

      {/* A/B Test Section */}
      <div className="space-y-4">
        <h3 className="font-mono text-[10px] font-black text-vy-accent uppercase tracking-[0.4em] ml-1">⚔ A/B TEST PAIRINGS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.abTestPairs.map((pair, i) => (
            <div key={i} className="bg-vy-bg border border-white/5 rounded-2xl p-5 space-y-4 relative overflow-hidden group">
               <div className="absolute -top-4 -right-4 w-20 h-20 bg-vy-accent/5 rounded-full blur-2xl group-hover:bg-vy-accent/10 transition-colors" />
               <div className="font-mono text-[9px] font-black text-vy-white uppercase tracking-widest mb-1">{pair.pairLabel}</div>
               
               <div className="space-y-2.5">
                  <div className="p-3 bg-[#0a0d14] border border-white/5 rounded-lg text-[11px] font-medium text-vy-muted leading-tight border-l-2 border-l-vy-cyan">
                    <span className="text-[8px] font-black text-vy-cyan block mb-1">A</span>
                    {pair.titleA}
                  </div>
                  <div className="p-3 bg-[#0a0d14] border border-white/5 rounded-lg text-[11px] font-medium text-vy-muted leading-tight border-l-2 border-l-vy-violet">
                    <span className="text-[8px] font-black text-vy-violet block mb-1">B</span>
                    {pair.titleB}
                  </div>
               </div>

               <div className="p-3 bg-vy-accent/5 rounded-xl border border-vy-accent/10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Zap className="w-2.5 h-2.5 text-vy-accent fill-current" />
                    <span className="text-[8px] font-black text-vy-accent uppercase tracking-widest">RECOMMENDATION:</span>
                  </div>
                  <p className="text-[10px] text-amber-500 italic font-bold leading-relaxed">{pair.recommendation}</p>
               </div>
               
               <button 
                 onClick={() => {
                   navigator.clipboard.writeText(`Test A: ${pair.titleA}\nTest B: ${pair.titleB}`);
                 }}
                 className="w-full py-2.5 bg-vy-surface hover:bg-vy-surface/80 border border-vy-border rounded-xl text-[9px] font-black text-vy-white uppercase tracking-widest transition-all mt-2"
               >
                 COPY BOTH
               </button>
            </div>
          ))}
        </div>
      </div>

      {/* Description Opener Section */}
      <div className="bg-[#22d3a0]/5 border-l-[3px] border-[#22d3a0] rounded-r-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <MessageCircle className="w-4 h-4 text-[#22d3a0] fill-current" />
             <h3 className="font-mono text-[10px] font-black text-[#22d3a0] uppercase tracking-[0.4em]">📝 DESCRIPTION OPENER</h3>
           </div>
           <CopyButton content={data.descriptionOpener} />
        </div>
        <p className="font-mono text-[11px] text-[#c8dce8] leading-loose whitespace-pre-wrap">
          {data.descriptionOpener}
        </p>
      </div>

      {/* Avoid Mistakes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.avoidMistakes.map((mistake, i) => (
          <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 relative group overflow-hidden">
             <div className="absolute -top-4 -right-4 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <AlertCircle className="w-16 h-16 text-red-500" />
             </div>
             <div className="font-mono text-[9px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
               <AlertCircle className="w-3.5 h-3.5" />
               TITLE MISTAKE #{i + 1}
             </div>
             <p className="text-[13px] text-vy-white font-medium leading-relaxed italic">
               {mistake}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
};
