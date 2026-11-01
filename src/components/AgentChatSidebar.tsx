import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Wand2, Copy, Check, ChevronRight, X } from 'lucide-react';
import { ChatMessage } from '../types';

interface AgentChatSidebarProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onApplyPrompt: (prompt: string) => void;
  isLoading: boolean;
  lang: 'id' | 'en';
}

export const AgentChatSidebar: React.FC<AgentChatSidebarProps> = ({
  messages,
  onSendMessage,
  onApplyPrompt,
  isLoading,
  lang
}) => {
  const isId = lang === 'id';
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  };

  const quickPrompts = isId
    ? [
        'Percepat gerakan kamera & buat lebih dinamis',
        'Tambahkan efek kabut neon & pantulan basah',
        'Ubah sudut pandang jadi close-up dramatis',
        'Buat suasana lebih hangat dengan golden hour'
      ]
    : [
        'Speed up camera motion & add dynamic energy',
        'Add neon fog & wet surface reflections',
        'Switch camera to dramatic macro close-up',
        'Warm cinematic look with golden hour lighting'
      ];

  const renderMessageContent = (content: string, msgId: string) => {
    // Check if there is a ```prompt ... ``` block
    const promptMatch = content.match(/```(?:prompt)?\s*([\s\S]*?)\s*```/);
    if (promptMatch) {
      const promptText = promptMatch[1].trim();
      const textBefore = content.split('```')[0].trim();
      const textAfter = content.split('```').slice(2).join('```').trim();

      return (
        <div className="space-y-2">
          {textBefore && <p className="leading-relaxed whitespace-pre-wrap">{textBefore}</p>}
          <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-200">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-purple-500/20 text-[10px] text-purple-400 uppercase font-sans">
              <span>Saran Prompt Video</span>
              <button
                onClick={() => onApplyPrompt(promptText)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {isId ? 'Terapkan' : 'Apply'}
              </button>
            </div>
            <p className="leading-relaxed">{promptText}</p>
          </div>
          {textAfter && <p className="leading-relaxed whitespace-pre-wrap">{textAfter}</p>}
        </div>
      );
    }

    return <p className="leading-relaxed whitespace-pre-wrap">{content}</p>;
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/60 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="px-4 py-3 bg-neutral-950/70 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-xs text-white">
              {isId ? 'Konsultasi Sutradara AI' : 'Director AI Co-Pilot'}
            </h3>
            <p className="text-[10px] text-neutral-400">
              {isId ? 'Diskusi ide & minta revisi visual' : 'Brainstorm & refine scenes'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
        {messages.map((m) => {
          const isModel = m.role === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isModel ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] ${
                  isModel
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                    : 'bg-neutral-800 text-neutral-300 border border-white/10'
                }`}
              >
                {isModel ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3 rounded-xl max-w-[85%] text-xs ${
                  isModel
                    ? 'bg-neutral-950/80 border border-white/5 text-neutral-200'
                    : 'bg-purple-600 text-white shadow-sm'
                }`}
              >
                {renderMessageContent(m.content, m.id)}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-start">
            <div className="w-6 h-6 rounded-lg bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/5 text-xs text-neutral-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span>{isId ? 'Sutradara AI sedang mengetik arahan...' : 'Director is formulating instructions...'}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="px-3 py-2 bg-neutral-950/40 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(qp)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-purple-900/40 hover:text-white text-neutral-400 border border-white/5 text-[10px] transition-colors disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-neutral-950/80 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isId
              ? 'Tanya atau minta revisi ke Sutradara AI...'
              : 'Ask director or request visual tweaks...'
          }
          className="flex-1 px-3 py-2 text-xs bg-neutral-900 border border-white/10 rounded-xl text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
