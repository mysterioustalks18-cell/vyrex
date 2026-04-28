import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Copy, 
  Check, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Sparkles,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ViralStrategistResult } from '../types';

const ScoreRing = ({ score = 0, size = 100 }: { score?: number; size?: number }) => {
  const circumference = 2 * Math.PI * 52;
  const displayScore = score <= 10 ? score * 10 : score;
  const color = displayScore >= 85 ? '#22d3a0' : displayScore >= 75 ? '#00c8ff' : '#f59e0b';
  
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 120 120" className="rotate-[-90deg]">
        <circle cx="60" cy="60" r="52" stroke="#ffffff0f" strokeWidth="8" fill="none"/>
        <motion.circle 
          cx="60" cy="60" r="52" 
          stroke={color}
          strokeWidth="8" fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - displayScore/100) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text 
          x="60" y="65" textAnchor="middle" 
          fontFamily="Orbitron" fontWeight="900" fontSize="24" fill="white"
          transform="rotate(90 60 60)"
        >
          {(displayScore / 10).toFixed(1)}
        </text>
      </svg>
    </div>
  );
};

export const ViralStrategistRenderer = ({ data, isExample }: { data: ViralStrategistResult; isExample?: boolean }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Title & Viral Score Card */}
      <div className="bg-[#0e1118] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12 transition-transform group-hover:scale-110 pointer-events-none">
          <TrendingUp className="w-48 h-48 text-vy-accent" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          <div className="shrink-0">
            <ScoreRing score={data.viralScore} size={140} />
          </div>
          
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] text-vy-accent font-black uppercase tracking-[0.4em]">● {data.tags[0]} · VIRAL ARCHITECTURE</span>
              <h1 className="font-display font-black text-2xl md:text-4xl text-white leading-tight tracking-tight uppercase italic">
                {data.videoTitle}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {data.tags.map((tag, i) => (
                <div key={i} className="px-3 py-1 bg-vy-cyan/5 border border-vy-cyan/20 rounded-full text-[9px] font-black text-vy-cyan uppercase tracking-widest">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hook Card */}
        <div className="bg-[#0e1118] border border-white/5 border-l-4 border-l-vy-accent rounded-2xl p-6 space-y-4 group">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-vy-accent fill-current" />
              <span className="font-mono text-[10px] font-black text-vy-accent uppercase tracking-widest">THE HOOK</span>
            </div>
            <button 
              onClick={() => handleCopy(data.hook, 'hook')}
              className="p-2 hover:bg-white/5 rounded-lg transition-all"
            >
              {copiedField === 'hook' ? <Check className="w-4 h-4 text-vy-green" /> : <Copy className="w-4 h-4 text-vy-muted group-hover:text-white" />}
            </button>
          </div>
          <p className="text-lg font-display font-bold text-[#c8dce8] italic leading-relaxed">
            "{data.hook}"
          </p>
        </div>

        {/* Competitor Gap Card */}
        <div className="bg-[#0e1118] border border-white/5 border-l-4 border-l-amber-500 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 fill-current" />
            <span className="font-mono text-[10px] font-black text-amber-500 uppercase tracking-widest">💡 GAP EXPLOIT</span>
          </div>
          <p className="text-sm font-medium text-[#c8dce8] leading-relaxed">
            {data.competitorGap}
          </p>
        </div>
      </div>

      {/* Mini Script Card */}
      <div className="bg-[#0e1118] border border-white/5 border-l-4 border-l-vy-cyan rounded-2xl p-6 space-y-4 group">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-vy-cyan fill-current" />
            <span className="font-mono text-[10px] font-black text-vy-cyan uppercase tracking-widest">MINI SCRIPT STRUCTURE</span>
            <div className="px-2 py-0.5 bg-vy-cyan/10 border border-vy-cyan/20 rounded font-mono text-[8px] text-vy-cyan uppercase">
              {Math.round((data.miniScript.split(/\s+/).length / 155) * 60)}S @ 155 WPM
            </div>
          </div>
          <button 
            onClick={() => handleCopy(data.miniScript, 'script')}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            {copiedField === 'script' ? <Check className="w-4 h-4 text-vy-green" /> : <Copy className="w-4 h-4 text-vy-muted group-hover:text-white" />}
          </button>
        </div>
        <p className="font-mono text-[13px] text-[#c8dce8] leading-loose whitespace-pre-wrap">
          {data.miniScript}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Retention Graph */}
        {data.retentionGraph && (
          <div className="bg-[#0e1118] border border-white/5 rounded-2xl p-6 space-y-4">
             <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-vy-cyan" />
                <span className="font-mono text-[10px] font-black text-vy-cyan uppercase tracking-widest">PREDICTED RETENTION CURVE</span>
             </div>
             <div className="h-32 w-full flex items-end gap-1 px-2 relative overflow-hidden">
                {/* Background grid */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/5 w-full" />
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/5 w-full" />
                
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                   <motion.path 
                     d={`M ${data.retentionGraph.map((p, i) => {
                       const x = data.retentionGraph!.length > 1 ? (i / (data.retentionGraph!.length - 1)) * 100 : 0;
                       return `${x}% ${100 - p.percentage}%`;
                     }).join(' L ')}`}
                     fill="none"
                     stroke="#00c8ff"
                     strokeWidth="2"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     transition={{ duration: 1.5 }}
                   />
                   <motion.path 
                     d={`M 0 100 L ${data.retentionGraph.map((p, i) => {
                        const x = data.retentionGraph!.length > 1 ? (i / (data.retentionGraph!.length - 1)) * 100 : 0;
                        return `${x}% ${100 - p.percentage}%`;
                     }).join(' L ')} L 100 100 Z`}
                     fill="url(#retention-grad)"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 1 }}
                   />
                   <defs>
                      <linearGradient id="retention-grad" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.2" />
                         <stop offset="100%" stopColor="#00c8ff" stopOpacity="0" />
                      </linearGradient>
                   </defs>
                </svg>

                {data.retentionGraph.map((p, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center group relative z-10 transition-all">
                      <div 
                        className="w-1.5 h-1.5 rounded-full bg-vy-cyan shadow-[0_0_8px_#00c8ff] absolute"
                        style={{ bottom: `${p.percentage}%` }}
                      />
                      <span className="font-mono text-[7px] text-vy-muted mt-auto pt-2">{p.second}s</span>
                      
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-vy-cyan text-black font-black text-[8px] px-1.5 py-0.5 rounded pointer-events-none">
                        {p.percentage}%
                      </div>
                   </div>
                ))}
             </div>
             <p className="text-[10px] text-vy-muted italic text-center">Calculated based on pattern interrupts and script density.</p>
          </div>
        )}

        {/* Thumbnail A/B Test */}
        {data.thumbnailABTest && (
          <div className="bg-[#0e1118] border border-white/5 rounded-2xl p-6 space-y-4">
             <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-vy-accent" />
                <span className="font-mono text-[10px] font-black text-vy-accent uppercase tracking-widest">THUMBNAIL A/B LOGIC</span>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                   <span className="text-[8px] font-black text-vy-cyan uppercase tracking-widest">VARIANT A</span>
                   <p className="text-[10px] font-bold text-white uppercase italic">{data.thumbnailABTest.variantA}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                   <span className="text-[8px] font-black text-vy-accent uppercase tracking-widest">VARIANT B</span>
                   <p className="text-[10px] font-bold text-white uppercase italic">{data.thumbnailABTest.variantB}</p>
                </div>
             </div>
             <div className="p-3 bg-vy-accent/5 border border-vy-accent/20 rounded-xl">
                <p className="text-[10px] text-vy-accent italic font-medium leading-relaxed">
                   {data.thumbnailABTest.logic}
                </p>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thumbnail Preview */}
        <div className="space-y-4">
          <span className="font-mono text-[10px] font-black text-vy-muted uppercase tracking-[0.3em] ml-2">THUMBNAIL STRATEGY</span>
          <div className="aspect-video bg-gradient-to-br from-[#0e1118] to-black border border-white/10 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-8 text-center shadow-2xl group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
             <div className="absolute inset-0 bg-gradient-to-br from-vy-accent/5 to-transparent opacity-50" />
             
             <h2 className="relative z-10 font-display font-black text-2xl md:text-3xl text-white uppercase italic leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] max-w-xs group-hover:scale-105 transition-transform duration-500">
               {data.thumbnailStrategy.mainText}
             </h2>

             <div className="absolute bottom-4 left-4 bg-vy-accent px-3 py-1 rounded text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                {data.thumbnailStrategy.emotion}
             </div>
             
             <div className="absolute top-4 right-4 bg-black/80 px-2 py-1 rounded font-mono text-[10px] text-white border border-white/10">
                10:47
             </div>

             <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/5 transition-all rounded-3xl" />
          </div>
          <p className="text-xs text-vy-muted italic text-center px-4">
            Visual Concept: {data.thumbnailStrategy.visualConcept}
          </p>
        </div>

        {/* Upload Timing */}
        <div className="space-y-6">
          <div className="bg-vy-surface border border-vy-border rounded-2xl p-6 space-y-6 relative overflow-hidden">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/5 rounded-xl">
                      <Clock className="w-5 h-5 text-vy-white" />
                   </div>
                   <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-vy-muted uppercase tracking-widest">Ideal Upload Window</span>
                      <span className="font-display font-black text-lg text-white">{data.uploadTiming}</span>
                   </div>
                </div>
                <div className="px-3 py-1 bg-vy-green/10 border border-vy-green/30 rounded-lg animate-pulse">
                   <span className="text-[9px] font-black text-vy-green uppercase tracking-widest">ALGORITHM PEAK</span>
                </div>
             </div>

             <div className="h-[2px] bg-white/5 w-full relative">
                <div className="absolute top-0 left-[60%] w-[20%] h-full bg-vy-green shadow-[0_0_10px_#22d3a0]" />
             </div>

             <div className="grid grid-cols-4 gap-2">
                {['M','T','W','T'].map((day, i) => (
                  <div key={i} className={cn(
                    "h-12 rounded-xl border flex items-center justify-center font-mono text-xs font-black",
                    i === 1 ? "bg-vy-accent/20 border-vy-accent text-vy-accent" : "bg-white/5 border-white/5 text-vy-muted"
                  )}>
                    {day}
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-[#0e1118] border border-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                   <TrendingUp className="w-4 h-4 text-vy-muted" />
                </div>
                <span className="font-display font-black text-[11px] text-vy-white uppercase tracking-widest">📈 SCORE HISTORY</span>
             </div>
             <Check className="w-4 h-4 text-vy-muted group-hover:rotate-90 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
