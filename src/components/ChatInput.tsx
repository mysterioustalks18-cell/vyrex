import React, { useRef, useEffect } from "react";
import { Send, Zap, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
  showSuggestions?: boolean;
  onToggleSuggestions?: () => void;
  onSelectSuggestion?: (suggestion: string) => void;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  placeholder = "Type a message...",
  suggestions = [],
  showSuggestions = false,
  onToggleSuggestions,
  onSelectSuggestion,
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      if (!value) textareaRef.current.style.height = "40px";
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-3 w-full max-w-4xl mx-auto", className)}>
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && !value.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1"
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onSelectSuggestion?.(s)}
                className="px-3 py-1.5 bg-vy-accent/5 border border-white/5 rounded-lg font-mono text-[9px] text-vy-muted uppercase tracking-widest whitespace-nowrap hover:border-vy-accent/30 hover:text-vy-accent transition-all"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group bg-[#0a0f1a] border border-white/10 rounded-2xl focus-within:border-vy-accent focus-within:shadow-[0_0_30px_rgba(232,84,42,0.15)] transition-all overflow-hidden duration-300">
        <div className="flex items-end p-2 sm:p-3">
          {onToggleSuggestions && (
            <button
              onClick={onToggleSuggestions}
              className={cn(
                "p-2 rounded-xl flex items-center justify-center transition-all mb-0.5",
                showSuggestions ? "text-vy-accent bg-vy-accent/10" : "text-vy-muted hover:text-white hover:bg-white/5"
              )}
              title="Show Suggestions"
            >
              <Zap className="w-4 h-4" />
            </button>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[#c8dce8] font-sans outline-none resize-none min-h-[40px] max-h-[200px] custom-scrollbar"
            autoFocus
          />

          <button
            onClick={onSend}
            disabled={isLoading || !value.trim()}
            className={cn(
              "p-2 rounded-xl transition-all mb-0.5 flex items-center justify-center",
              value.trim() 
                ? "bg-vy-accent text-white shadow-lg shadow-vy-accent/20 hover:scale-105 active:scale-95" 
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="px-4 pb-2 flex justify-between items-center bg-black/20">
          <div className="flex gap-4 items-center">
            <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Vyrex Neural Engine v2.5</span>
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-vy-accent/10 border border-vy-accent/20 rounded-full animate-pulse">
              <div className="w-1 h-1 bg-vy-accent rounded-full" />
              <span className="font-mono text-[7px] text-vy-accent uppercase tracking-tighter font-bold">Addictive Mode Active</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 opacity-30 group-focus-within:opacity-100 transition-opacity">
            <CornerDownLeft className="w-2.5 h-2.5 text-vy-muted" />
            <span className="font-mono text-[8px] text-vy-muted uppercase">Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};
