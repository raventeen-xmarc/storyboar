import React, { useState } from 'react';
import { Lightbulb, Sparkles, Wand2, ArrowRight, Smartphone, MonitorPlay, Compass, Tag } from 'lucide-react';
import { VideoFormatType, VideoCategoryType, BrainstormIdea, AspectRatioType } from '../types';

interface Step1BrainstormProps {
  theme: string;
  setTheme: (t: string) => void;
  format: VideoFormatType;
  setFormat: (f: VideoFormatType) => void;
  category: VideoCategoryType;
  setCategory: (c: VideoCategoryType) => void;
  aspectRatio: AspectRatioType;
  setAspectRatio: (ar: AspectRatioType) => void;
  brainstormIdeas: BrainstormIdea[];
  onBrainstorm: () => Promise<void>;
  onSelectIdea: (idea: BrainstormIdea) => void;
  selectedIdea: BrainstormIdea | null;
  isLoading: boolean;
  lang: 'id' | 'en';
}

export const Step1Brainstorm: React.FC<Step1BrainstormProps> = ({
  theme,
  setTheme,
  format,
  setFormat,
  category,
  setCategory,
  aspectRatio,
  setAspectRatio,
  brainstormIdeas,
  onBrainstorm,
  onSelectIdea,
  selectedIdea,
  isLoading,
  lang
}) => {
  const isId = lang === 'id';

  const categories: { label: VideoCategoryType; desc: string; icon: string }[] = [
    { label: 'Edukasi', desc: 'Fakta sains, sejarah, konsep ilmiah mendalam', icon: '🧠' },
    { label: 'Informasi', desc: 'Berita teknologi terkini, wawasan dan tren dunia', icon: '📰' },
    { label: 'Hiburan', desc: 'Komedi, parodi, storytelling ringan & seru', icon: '🎭' },
    { label: 'Sinematik Fiksi', desc: 'Sci-fi, fantasi, aksi luar angkasa, naga, robot', icon: '🌌' },
    { label: 'Komersial & Promosi', desc: 'Iklan produk mewah, kuliner, fesyen, aesthetic', icon: '✨' },
    { label: 'Misteri & Horor', desc: 'Cerita horor seram, urban legend, enigma misterius', icon: '👻' },
    { label: 'Motivasi & Cerita', desc: 'Refleksi kehidupan, inspirasi & perjalanan emosional', icon: '🌟' }
  ];

  const quickThemeIdeas = isId
    ? [
        { theme: 'Sejarah kopi tertua di Indonesia', category: 'Edukasi' as VideoCategoryType },
        { theme: 'Misteri apa yang terjadi di dalam lubang hitam', category: 'Informasi' as VideoCategoryType },
        { theme: 'Kucing oranye menjadi kapten stasiun luar angkasa', category: 'Sinematik Fiksi' as VideoCategoryType },
        { theme: 'Kenapa kita suka menunda pekerjaan (Prokrastinasi)', category: 'Edukasi' as VideoCategoryType },
        { theme: 'Iklan sinematik minuman matcha artisan Jepang', category: 'Komersial & Promosi' as VideoCategoryType }
      ]
    : [
        { theme: 'History of artisan coffee in Indonesia', category: 'Edukasi' as VideoCategoryType },
        { theme: 'What truly lies beyond the Event Horizon of Black Holes', category: 'Informasi' as VideoCategoryType },
        { theme: 'Orange tabby cat commanding a deep-space station', category: 'Sinematik Fiksi' as VideoCategoryType },
        { theme: 'The psychology behind why humans procrastinate', category: 'Edukasi' as VideoCategoryType },
        { theme: 'Cinematic luxury Japanese matcha drink commercial', category: 'Komersial & Promosi' as VideoCategoryType }
      ];

  const handleSelectFormat = (f: VideoFormatType) => {
    setFormat(f);
    if (f === 'short') {
      setAspectRatio('9:16');
    } else {
      setAspectRatio('16:9');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6 bg-neutral-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              {isId ? 'Langkah 1: Brainstorm Tema & Format Video' : 'Step 1: Brainstorm Theme & Video Format'}
            </h2>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Masukkan tema apapun, pilih bentuk format dan kategori, lalu minta AI membedah sudut pandang kreatif'
                : 'Enter your topic, choose video format and genre, then let AI brainstorm compelling narrative angles'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Tema */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-200 flex items-center justify-between">
          <span>{isId ? '1. Masukkan Tema / Ide Pokok Video:' : '1. Enter Video Topic / Core Idea:'}</span>
          <span className="text-[11px] text-purple-400 font-mono">Input Bebas</span>
        </label>
        <div className="relative">
          <textarea
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            rows={3}
            placeholder={
              isId
                ? 'Contoh: Kisah penemuan biji kopi pertama kali oleh seorang penggembala kambing di Abisinia, atau Misteri kota bawah laut Atlantis...'
                : 'Example: The origin story of how coffee was first discovered by goat herders in Ethiopia, or The secrets of sunken Atlantis...'
            }
            className="w-full px-4 py-3 text-xs sm:text-sm bg-neutral-950/80 border border-white/10 rounded-xl text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed resize-none"
          />
        </div>

        {/* Quick Inspiration Chips */}
        <div className="pt-1">
          <span className="text-[11px] text-neutral-400 block mb-1.5 flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5 text-pink-400" />
            {isId ? 'Contoh tema populer (klik untuk isi otomatis):' : 'Popular topic ideas (click to auto-fill):'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickThemeIdeas.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTheme(item.theme);
                  setCategory(item.category);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-purple-900/40 hover:text-white text-neutral-300 border border-white/5 transition-all text-left"
              >
                ✨ {item.theme}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Format Selection (Short vs Story) */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-neutral-200 block">
          {isId ? '2. Pilih Bentuk Hasil Video:' : '2. Select Output Video Format:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleSelectFormat('short')}
            className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
              format === 'short'
                ? 'border-purple-500 bg-purple-950/30 text-white shadow-md'
                : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:bg-neutral-800/40'
            }`}
          >
            <div className={`p-2 rounded-lg ${format === 'short' ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {isId ? 'Short AI / Reel / TikTok' : 'Short AI / Reel / TikTok'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  9:16 Vertikal
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                {isId
                  ? 'Hook 3 detik pertama sangat cepat, ritme dinamis, cocok untuk konsumsi media sosial viral.'
                  : 'Fast 3-second hook, high-tempo retention, tailored for viral social reels.'}
              </p>
            </div>
          </button>

          <button
            onClick={() => handleSelectFormat('story')}
            className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
              format === 'story'
                ? 'border-purple-500 bg-purple-950/30 text-white shadow-md'
                : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:bg-neutral-800/40'
            }`}
          >
            <div className={`p-2 rounded-lg ${format === 'story' ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
              <MonitorPlay className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {isId ? 'Cerita Sinematik / Mini-Doc' : 'Cinematic Story / Mini-Doc'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  16:9 Sinematik
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                {isId
                  ? 'Storytelling mendalam, komposisi layar lebar ala bioskop, suasana atmosferik dan naratif kuat.'
                  : 'Deep narrative arc, cinematic widescreen composition, immersive atmospheric pacing.'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-neutral-200 block">
          {isId ? '3. Pilih Kategori / Tujuan Konten:' : '3. Select Content Category / Purpose:'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {categories.map((cat) => {
            const isSelected = category === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-600/20 text-white shadow-sm'
                    : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                <span className="text-lg mb-1">{cat.icon}</span>
                <span className="text-xs font-bold text-neutral-200 line-clamp-1">{cat.label}</span>
                <span className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{cat.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button: Brainstorm Ide */}
      <div>
        <button
          onClick={onBrainstorm}
          disabled={isLoading || !theme.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>
            {isLoading
              ? (isId ? 'AI Sedang Membedah & Mengembangkan Ide...' : 'AI is Brainstorming Creative Angles...')
              : (isId ? 'Brainstorm Ide Cerita dengan AI' : 'Brainstorm Story Angles with AI')}
          </span>
        </button>
      </div>

      {/* Brainstorm Result Cards */}
      {brainstormIdeas.length > 0 && (
        <div className="mt-4 pt-5 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Compass className="w-4 h-4 text-purple-400" />
              {isId ? 'Pilih 1 dari 3 Sudut Pandang Cerita:' : 'Choose 1 of 3 Creative Angles:'}
            </span>
            <span className="text-[11px] text-purple-400">
              {isId ? 'Klik kartu untuk memproses naskah' : 'Click card to generate scripts'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {brainstormIdeas.map((idea, idx) => {
              const isSelected = selectedIdea?.id === idea.id;
              return (
                <div
                  key={idea.id || idx}
                  onClick={() => onSelectIdea(idea)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/40 shadow-xl'
                      : 'border-white/10 bg-neutral-950/60 hover:border-purple-500/40 hover:bg-neutral-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                        Sudut Pandang #{idx + 1}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {idea.recommendedStyle}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-sm text-white mb-2 leading-tight">
                      {idea.title}
                    </h3>

                    {/* Hook Preview */}
                    <div className="p-2 rounded-lg bg-neutral-900/80 border border-white/5 text-[11px] text-pink-300 mb-2.5 font-medium leading-relaxed">
                      🔥 "{idea.hook}"
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                      {idea.angleDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-medium text-purple-400">
                    <span className="text-[10px] text-neutral-400">
                      🎨 {idea.visualMood}
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>{isId ? 'Pilih Sudut Ini' : 'Select'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
