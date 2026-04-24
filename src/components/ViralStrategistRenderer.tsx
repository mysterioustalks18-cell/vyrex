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
  const safeScore = score || 0;
  const color = safeScore >= 8.5 ? '#22d3a0' : safeScore >= 7.5 ? '#00c8ff' : '#f59e0b';
  
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
          animate={{ strokeDashoffset: circumference * (1 - safeScore/10) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text 
          x="60" y="65" textAnchor="middle" 
          fontFamily="Orbitron" fontWeight="900" fontSize="24" fill="white"
          transform="rotate(90 60 60)"
        >
          {safeScore.toFixed(1)}
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
