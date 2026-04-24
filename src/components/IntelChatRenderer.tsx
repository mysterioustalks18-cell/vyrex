import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, 
  Check, 
  MessageCircle,
  ChevronRight,
  Info,
  Search
} from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const exampleConversations = [
  {
    userMsg: "I want to start a YouTube channel about Indian history but I don't know if it's too competitive",
    aiPreview: "Indian history is competitive at the surface level, but cinematically-told regional history is almost completely untapped...",
    fullAi: "Indian history is competitive at the surface level, but cinematically-told regional history is almost completely untapped. Most current channels focus on broad national history or mythology. A niche like 'History of South Indian Kingdoms' or 'Unsolved Mysteries of Ancient Indian Architecture' would have massive potential for growth today."
  },
  {
    userMsg: "Give me 5 channel names for a personal finance channel targeting college students in India",
    aiPreview: "Here are 5 names that balance credibility with Gen Z energy: RupeeSense, ZeroToWealth, PaisaLogic...",
    fullAi: "Here are 5 names that balance credibility with Gen Z energy:\n\n1. **RupeeSense** - Playful and direct\n2. **ZeroToWealth** - Aspiration-focused\n3. **PaisaLogic** - Practical and grounded\n4. **The Fin-Indian** - High authority\n5. **Budget Bharat** - Accessible and patriotic"
  },
  {
    userMsg: "How long does it realistically take to get 1000 subscribers in the finance niche?",
    aiPreview: "Honest answer: 6–14 months for most new channels in finance, but there's a wide variance based on...",
    fullAi: "Honest answer: 6–14 months for most new channels in finance, but there's a wide variance based on your upload frequency and viral potential. In high-RPM niches like finance, individual views matter more than raw sub count for revenue, so focus on high-retention topics from day one."
  }
];

const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col gap-2 max-w-[85%] group relative",
        isAssistant ? "self-start" : "self-end items-end"
      )}
    >
      <div className={cn(
        "px-5 py-3 rounded-2xl text-[14px] leading-relaxed shadow-lg font-medium",
        isAssistant 
          ? "bg-vy-surface border border-vy-border text-[#c8dce8]" 
          : "bg-vy-accent text-white"
      )}>
        {isAssistant ? (
          <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5">
            <Markdown>{message.content}</Markdown>
          </div>
        ) : (
          message.content
        )}
      </div>

      {isAssistant && (
        <button 
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 bg-vy-surface2/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-vy-border"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-vy-green" /> : <Copy className="w-3.5 h-3.5 text-vy-muted" />}
        </button>
      )}

      <div className="px-2 font-mono text-[8px] text-vy-muted uppercase tracking-wider">
        {isAssistant ? 'VYREX INTEL' : 'OPERATOR'} · {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </motion.div>
  );
};

export const TypingIndicator = () => (
  <div className="flex flex-col gap-2 self-start py-3 px-5 bg-vy-surface border border-vy-border rounded-2xl shadow-lg">
    <div className="flex gap-1.5 items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="w-1.5 h-1.5 rounded-full bg-vy-accent"
        />
      ))}
    </div>
    <div className="font-mono text-[9px] text-[#4a6070] uppercase">VYREX INTEL PROCESSING...</div>
  </div>
);

export const IntelChatRenderer = ({ 
  history, 
  isLoading,
  onSendMessage,
  onPopulateInput
}: { 
  history: ChatMessage[]; 
  isLoading: boolean;
  onSendMessage: (msg: string) => void;
  onPopulateInput: (msg: string) => void;
}) => {
  const [expandedExample, setExpandedExample] = useState<number | null>(null);

  const exportChat = () => {
    const text = history.map(m => `[${m.role.toUpperCase()}] (${new Date(m.timestamp).toLocaleTimeString()}):\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vyrex-intel-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (history.length === 0) {
    return (
      <div className="space-y-12 py-8 px-4">
        <div className="text-center space-y-4 max-w-xl mx-auto px-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-vy-accent/10 border border-vy-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
            <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-vy-accent" />
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-black text-vy-white uppercase italic">NEURAL INTEL CHAT</h3>
          <p className="text-[#c8dce8] text-sm leading-relaxed font-medium">
            Connect directly to the VYREX core. Ask anything about niches, branding, competition, or high-velocity growth strategies.
          </p>

          <div className="pt-4">
            <button 
              onClick={() => onPopulateInput('Help me find the best YouTube niche for ')}
              className="px-6 py-3 bg-vy-accent/10 border border-vy-accent/30 text-vy-accent rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-vy-accent hover:text-white transition-all shadow-lg shadow-vy-accent/5 flex items-center gap-2 mx-auto"
            >
              <Search className="w-4 h-4" />
              Find my Niche
            </button>
          </div>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[1px] flex-1 bg-vy-border" />
            <div className="font-mono text-[9px] text-vy-accent font-black uppercase tracking-[0.2em] px-4">EXAMPLE CONVERSATIONS</div>
            <div className="h-[1px] flex-1 bg-vy-border" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {exampleConversations.map((ex, i) => (
              <div 
                key={i}
                className="bg-vy-surface/40 border border-vy-border rounded-2xl p-5 border-l-2 border-l-vy-accent/30 hover:border-vy-accent/40 cursor-pointer transition-all group"
                onClick={() => setExpandedExample(expandedExample === i ? null : i)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 pr-6 text-left">
                    <div className="text-xs font-bold text-vy-white uppercase italic">"{ex.userMsg}"</div>
                    {!expandedExample && (
                      <div className="text-[11px] text-vy-muted font-medium truncate max-w-[500px]">
                        {ex.aiPreview}
                      </div>
                    )}
                  </div>
                  <ChevronRight className={cn("w-4 h-4 text-vy-muted transition-transform mt-1", expandedExample === i && "rotate-90")} />
                </div>
                
                <AnimatePresence>
                  {expandedExample === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-vy-border text-xs text-[#c8dce8] leading-relaxed font-medium">
                         {ex.fullAi}
                         <div className="mt-4 flex justify-end">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onSendMessage(ex.userMsg);
                              }}
                              className="px-4 py-1.5 bg-vy-accent text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-vy-accent/20"
                            >
                              Send Prompt
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-vy-accent/5 border border-vy-accent/10 rounded-2xl flex gap-4 max-w-3xl mx-auto items-start">
           <Info className="w-5 h-5 text-vy-accent shrink-0" />
           <p className="text-[11px] text-[#c8dce8]/80 leading-relaxed font-medium">
             VYREX Intel Chat maintains session context. It knows what you've searched for in other nodes. Try asking: <span className="text-vy-accent">\"Give me more ideas based on the launchpad results\"</span>
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-8 px-2 relative">
      <div className="flex justify-end mb-2">
        <button 
          onClick={exportChat}
          className="flex items-center gap-2 px-3 py-1.5 bg-vy-surface border border-vy-border rounded-lg font-mono text-[9px] text-vy-muted uppercase tracking-widest hover:text-vy-white hover:border-vy-accent/30 transition-all"
        >
          <Copy className="w-3 h-3" /> {history.length > 0 ? (window.innerWidth < 640 ? 'EXPORT' : 'EXPORT CONVERSATION') : 'EXPORT'}
        </button>
      </div>
      {history.map((msg, i) => (
        <ChatBubble key={i} message={msg} />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
};
