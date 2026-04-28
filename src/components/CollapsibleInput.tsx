import React, { memo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Zap, 
  BarChart3, 
  Eye, 
  MessageCircle, 
  Package, 
  ChevronUp, 
  CornerDownLeft,
  DollarSign
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Mode } from '../types';

interface CollapsibleInputProps {
  activeNode: Mode;
  isOpen: boolean;
  onToggle: () => void;
  isLoading: boolean;
  credits: number;
  creditCosts: Record<string, number>;
  
  // Inputs & Handlers
  launchpadInput: { interests: string; region: string; style: string };
  setLaunchpadInput: (val: any) => void;
  handleLaunchpadSubmit: () => void;
  
  viralInput: string;
  setViralInput: (val: string) => void;
  handleViralSubmit: () => void;
  
  hookInput: string;
  setHookInput: (val: string) => void;
  handleHookSubmit: () => void;
  
  competitorInput: string;
  setCompetitorInput: (val: string) => void;
  handleCompetitorSubmit: () => void;
  
  monetizationInput: { niche: string; views: string };
  setMonetizationInput: (val: any) => void;
  handleMonetizationSubmit: () => void;
  
  titleInput: { idea: string; niche: string };
  setTitleInput: (val: any) => void;
  handleTitleSubmit: () => void;
  
  assetInput: { topic: string; niche: string; format: string; desiredDuration: string };
  setAssetInput: (val: any) => void;
  handleAssetSubmit: () => void;

  deepContext: string;
  setDeepContext: (val: string) => void;
}

const ToggleHeader = memo(({ 
  isOpen, 
  onToggle, 
  activeNode, 
  credits 
}: { 
  isOpen: boolean; 
  onToggle: () => void; 
  activeNode: string; 
  credits: number;
}) => (
  <div
    id="toggle-header"
    role="button"
    tabIndex={0}
    onClick={onToggle}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    }}
    aria-expanded={isOpen}
    aria-controls="input-panel"
    aria-label={`${isOpen ? 'Close' : 'Open'} ${activeNode} input panel`}
    className={cn(
      "flex items-center justify-between px-6 py-4 cursor-pointer select-none transition-all duration-300",
      "hover:bg-vy-accent/5 focus:outline-none focus:bg-vy-accent/5 group",
      isOpen ? "bg-vy-accent/10" : "bg-transparent"
    )}
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-1.5 h-1.5 rounded-full transition-all duration-500",
        isOpen ? "bg-vy-accent shadow-[0_0_12px_#e8542a] scale-125" : "bg-vy-muted scale-100"
      )}/>
      <span className={cn(
        "font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-300",
        isOpen ? "text-vy-accent font-bold" : "text-vy-muted group-hover:text-white"
      )}>
        {isOpen ? `${activeNode.toUpperCase()} · ACTIVE INPUT` : `CLICK TO OPEN ${activeNode.toUpperCase()} INTERFACE`}
      </span>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 px-3 py-1 bg-vy-cyan/5 border border-vy-cyan/10 rounded-full">
        <Zap className="w-3 h-3 text-vy-cyan fill-vy-cyan/20" />
        <span className="font-mono text-[10px] text-vy-cyan font-bold tracking-wider">
          {credits} CREDITS
        </span>
      </div>
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-500",
        isOpen ? "rotate-180 border-vy-accent/40 text-vy-accent bg-vy-accent/5" : "rotate-0 border-white/10 text-vy-muted group-hover:border-white/20"
      )}>
        <ChevronUp className="w-4 h-4" />
      </div>
    </div>
  </div>
));

ToggleHeader.displayName = 'ToggleHeader';

const InputPanel = memo(({ 
  activeNode, 
  isLoading,
  launchpadInput, setLaunchpadInput, handleLaunchpadSubmit,
  viralInput, setViralInput, handleViralSubmit,
  hookInput, setHookInput, handleHookSubmit,
  competitorInput, setCompetitorInput, handleCompetitorSubmit,
  monetizationInput, setMonetizationInput, handleMonetizationSubmit,
  titleInput, setTitleInput, handleTitleSubmit,
  assetInput, setAssetInput, handleAssetSubmit,
  deepContext, setDeepContext
}: any) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [showDeepContext, setShowDeepContext] = React.useState(!!deepContext);

  return (
    <div 
      id="input-panel"
      className="px-6 pb-6 pt-2 border-t border-white/5 bg-gradient-to-b from-vy-accent/5 to-transparent"
    >
      <div className="max-w-3xl mx-auto">
        {/* Deep Context Toggle */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", deepContext ? "bg-vy-cyan animate-pulse" : "bg-vy-muted")} />
            <span className="font-mono text-[9px] text-vy-muted uppercase tracking-[0.2em]">Extended Intelligence Context</span>
          </div>
          <button 
            onClick={() => setShowDeepContext(!showDeepContext)}
            className={cn(
              "font-mono text-[8px] px-2 py-1 rounded border transition-all uppercase tracking-widest",
              showDeepContext ? "border-vy-accent text-vy-accent bg-vy-accent/10" : "border-white/10 text-vy-muted hover:text-white"
            )}
          >
            {showDeepContext ? 'Hide Research Layer' : 'Add Research Layer'}
          </button>
        </div>

        <AnimatePresence>
          {showDeepContext && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 bg-[#0a0f1d] border border-vy-cyan/20 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-[0.05] pointer-events-none">
                  <BarChart3 className="w-12 h-12 text-vy-cyan" />
                </div>
                <label className="block font-mono text-[9px] text-vy-cyan uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  Neural Research Context (Deep Layer)
                </label>
                <textarea
                  value={deepContext}
                  onChange={e => setDeepContext(e.target.value)}
                  placeholder="Provide extra context: 'Analyze in the style of MrBeast', 'Reference Veratasium channels', 'Focus on 5-10 minute video formats', etc."
                  rows={2}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-vy-white focus:border-vy-cyan transition-all outline-none resize-none placeholder:text-vy-muted/50"
                />
                <p className="mt-2 font-mono text-[7px] text-vy-muted uppercase tracking-tight">
                  This context is applied globally to current node computations to refine results.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {activeNode === 'launchpad' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                Interest & Passion Matrix
              </label>
              <textarea
                value={launchpadInput.interests}
                onChange={e => setLaunchpadInput({...launchpadInput, interests: e.target.value})}
                placeholder="e.g. 'personal finance, Indian history, AI tools, fitness, true crime'"
                rows={2}
                className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                  Target Region
                </label>
                <input
                  value={launchpadInput.region}
                  onChange={e => setLaunchpadInput({...launchpadInput, region: e.target.value})}
                  placeholder="e.g. 'India - Hindi'"
                  className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                  Content Style
                </label>
                <input
                  value={launchpadInput.style}
                  onChange={e => setLaunchpadInput({...launchpadInput, style: e.target.value})}
                  placeholder="e.g. 'Faceless'"
                  className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleLaunchpadSubmit}
              disabled={isLoading || !launchpadInput.interests}
              className="w-full py-4 mt-2 bg-gradient-to-r from-vy-accent to-orange-400 text-white font-display font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-[0_4px_20px_rgba(232,84,42,0.3)] hover:shadow-[0_8px_30px_rgba(232,84,42,0.5)] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-40 disabled:grayscale"
            >
              {isLoading ? 'ANALYZING NEURAL DATA...' : '🚀 LAUNCH INTELLIGENCE ANALYSIS'}
            </button>
          </div>
        )}

        {activeNode === 'viral' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pt-2">
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                Your Niche or Content Goal
              </label>
              <input
                value={viralInput}
                onChange={e => setViralInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleViralSubmit()}
                placeholder="Enter niche — e.g. 'personal finance Gen Z India'"
                className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-vy-accent transition-all outline-none"
              />
            </div>
            <button
              onClick={handleViralSubmit}
              disabled={isLoading || !viralInput}
              className="w-full py-4 bg-gradient-to-r from-vy-accent to-orange-500 text-white font-display font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg hover:scale-[1.01] transition-all disabled:opacity-40"
            >
              {isLoading ? 'GENERATING STRATEGY...' : '⚡ GENERATE VIRAL STRATEGY'}
            </button>
          </div>
        )}

        {activeNode === 'hook' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pt-2">
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                Your Video Title or Hook Line
              </label>
              <textarea
                value={hookInput}
                onChange={e => setHookInput(e.target.value)}
                placeholder="Paste your hook here..."
                rows={3}
                className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none resize-none"
              />
            </div>
            <button
              onClick={handleHookSubmit}
              disabled={isLoading || !hookInput}
              className="w-full py-4 bg-gradient-to-r from-vy-accent to-orange-500 text-white font-display font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg hover:scale-[1.01] transition-all disabled:opacity-40"
            >
              {isLoading ? 'ANALYZING HOOK...' : '📊 ANALYZE HOOK'}
            </button>
          </div>
        )}

        {activeNode === 'competitor' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pt-2">
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                Target Channel or Niche
              </label>
              <input
                value={competitorInput}
                onChange={e => setCompetitorInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCompetitorSubmit()}
                placeholder="Enter channel name..."
                className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-vy-accent transition-all outline-none"
              />
            </div>
            <button
              onClick={handleCompetitorSubmit}
              disabled={isLoading || !competitorInput}
              className="w-full py-4 bg-gradient-to-r from-vy-accent to-orange-500 text-white font-display font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg hover:scale-[1.01] transition-all disabled:opacity-40"
            >
              {isLoading ? 'INFILTRATING...' : '👁 SPY ON COMPETITOR'}
            </button>
          </div>
        )}

        {activeNode === 'monetization' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                  Channel Niche
                </label>
                <input
                  value={monetizationInput.niche}
                  onChange={e => setMonetizationInput({...monetizationInput, niche: e.target.value})}
                  placeholder="e.g. 'personal finance'"
                  className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                  Monthly Views
                </label>
                <input
                  value={monetizationInput.views}
                  onChange={e => setMonetizationInput({...monetizationInput, views: e.target.value})}
                  placeholder="e.g. '100000'"
                  className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleMonetizationSubmit}
              disabled={isLoading || !monetizationInput.niche}
              className="w-full py-4 bg-gradient-to-r from-vy-cyan to-blue-500 text-[#03050a] font-display font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-[0_4px_20px_rgba(0,200,255,0.3)] hover:scale-[1.01] transition-all disabled:opacity-40"
            >
              {isLoading ? 'MAPPING REVENUE...' : '◈ MAP REVENUE STREAMS'}
            </button>
          </div>
        )}

        {activeNode === 'title_forge' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pt-2">
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                Video Idea
              </label>
              <textarea
                value={titleInput.idea}
                onChange={e => setTitleInput({...titleInput, idea: e.target.value})}
                placeholder="Describe your video idea..."
                rows={2}
                className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none resize-none"
              />
            </div>
            <input
              value={titleInput.niche}
              onChange={e => setTitleInput({...titleInput, niche: e.target.value})}
              placeholder="Niche Category..."
              className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
            />
            <button
              onClick={handleTitleSubmit}
              disabled={isLoading || !titleInput.idea}
              className="w-full py-4 bg-gradient-to-r from-vy-accent to-orange-500 text-white font-display font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg hover:scale-[1.01] transition-all disabled:opacity-40"
            >
              {isLoading ? 'FORGING...' : '✦ FORGE TITLES'}
            </button>
          </div>
        )}

        {activeNode === 'asset_forge' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pt-2">
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                Video Topic
              </label>
              <input
                value={assetInput.topic}
                onChange={e => setAssetInput({...assetInput, topic: e.target.value})}
                placeholder="Enter topic..."
                className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={assetInput.niche}
                onChange={e => setAssetInput({...assetInput, niche: e.target.value})}
                className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-vy-accent outline-none"
              >
                <option>Ancient History</option>
                <option>Personal Finance</option>
                <option>Tech</option>
                <option>True Crime</option>
                <option>Business</option>
              </select>
              <select
                value={assetInput.format}
                onChange={e => setAssetInput({...assetInput, format: e.target.value})}
                className="w-full bg-[#03050a]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-vy-accent outline-none"
              >
                <option>Long-form</option>
                <option>Short (60s)</option>
                <option>Custom Duration</option>
              </select>
            </div>
            {assetInput.format === 'Custom Duration' && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="block font-mono text-[9px] text-vy-muted uppercase tracking-widest ml-1">
                  Manual Duration (e.g. 15 min, 45 sec)
                </label>
                <input
                  value={assetInput.desiredDuration}
                  onChange={e => setAssetInput({...assetInput, desiredDuration: e.target.value})}
                  placeholder="e.g. 7 minutes"
                  className="w-full bg-[#03050a]/80 border border-vy-accent/30 rounded-xl px-4 py-3 text-sm text-white focus:border-vy-accent transition-all outline-none"
                />
              </div>
            )}
            <button
              onClick={handleAssetSubmit}
              disabled={isLoading || !assetInput.topic}
              className="w-full py-4 bg-gradient-to-r from-vy-violet to-indigo-600 text-white font-display font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:scale-[1.01] transition-all disabled:opacity-40"
            >
              {isLoading ? 'FORGING...' : '⚙ FORGE ASSETS'}
            </button>
          </div>
        )}

        {/* Bottom meta info */}
        <div className="mt-6 flex justify-between items-center opacity-40 group-focus-within:opacity-100 transition-opacity">
          <div className="flex items-center gap-4 font-mono text-[8px] text-vy-muted uppercase tracking-widest">
            <span>NETWORK SECURE (AES-256)</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CornerDownLeft className="w-3 h-3 text-vy-muted" />
            <span className="font-mono text-[8px] text-vy-muted uppercase">Return to Execute</span>
          </div>
        </div>
      </div>
    </div>
  );
});

InputPanel.displayName = 'InputPanel';

export const CollapsibleInput = ({
  activeNode,
  isOpen,
  onToggle,
  isLoading,
  credits,
  ...inputProps
}: CollapsibleInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[60] bg-[#080d18]/98 backdrop-blur-3xl border-t border-white/10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pb-[env(safe-area-inset-bottom)]",
        isOpen ? "shadow-[0_-10px_50px_rgba(0,0,0,0.8)]" : "shadow-none"
      )}
      style={{
        willChange: 'transform',
      }}
    >
      <ToggleHeader 
        isOpen={isOpen} 
        onToggle={onToggle} 
        activeNode={activeNode} 
        credits={credits} 
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="input-panel"
            role="region"
            aria-labelledby="toggle-header"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <InputPanel 
              activeNode={activeNode} 
              isLoading={isLoading} 
              {...inputProps} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
