import React, { useState } from 'react';
import {
  Sparkles,
  Clapperboard,
  Video,
  Camera,
  Maximize,
  Clock,
  Palette,
  Volume2,
  Wand2,
  ChevronDown,
  Layers,
  Check,
  AlertCircle,
  Film
} from 'lucide-react';
import {
  CAMERA_MOTIONS,
  STYLE_PRESETS,
  INSPIRATION_IDEAS
} from '../data/presets';
import {
  AspectRatioType,
  VideoDurationType,
  ResolutionType,
  DirectorResult
} from '../types';

interface AgentDirectorPanelProps {
  onDirectIdea: (concept: string, options: any) => Promise<DirectorResult | null>;
  onGenerateVideo: (prompt: string, options: any) => Promise<void>;
  directorResult: DirectorResult | null;
  onGenerateVoiceover: (text: string) => Promise<void>;
  isDirecting: boolean;
  isGenerating: boolean;
  isVoiceoverGenerating: boolean;
  lang: 'id' | 'en';
}

export const AgentDirectorPanel: React.FC<AgentDirectorPanelProps> = ({
  onDirectIdea,
  onGenerateVideo,
  directorResult,
  onGenerateVoiceover,
  isDirecting,
  isGenerating,
  isVoiceoverGenerating,
  lang
}) => {
  const isId = lang === 'id';

  const [concept, setConcept] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0].name);
  const [selectedMotion, setSelectedMotion] = useState(CAMERA_MOTIONS[0].label);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('16:9');
  const [duration, setDuration] = useState<VideoDurationType>('5s');
  const [resolution, setResolution] = useState<ResolutionType>('720p');
  const [editablePrompt, setEditablePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // When directorResult changes, update editablePrompt
  React.useEffect(() => {
    if (directorResult?.cinematicPrompt) {
      setEditablePrompt(directorResult.cinematicPrompt);
    }
  }, [directorResult]);

  const handleApplyInspiration = (idea: typeof INSPIRATION_IDEAS[0]) => {
    setConcept(idea.concept);
    setSelectedStyle(idea.style);
    setSelectedMotion(idea.motion);
  };

  const handleDirectClick = async () => {
    if (!concept.trim()) return;
    const result = await onDirectIdea(concept, {
      style: selectedStyle,
      cameraMotion: selectedMotion,
      duration,
      aspectRatio,
      resolution
    });
    if (result?.cinematicPrompt) {
      setEditablePrompt(result.cinematicPrompt);
    }
  };

  const handleGenerateClick = () => {
    const finalPrompt = editablePrompt.trim() || concept.trim();
    if (!finalPrompt) return;
    onGenerateVideo(finalPrompt, {
      aspectRatio,
      duration,
      resolution,
      style: selectedStyle,
      cameraMotion: selectedMotion,
      title: directorResult?.title || concept.slice(0, 30)
    });
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-neutral-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              {isId ? 'AI Video Director Agent' : 'AI Video Director Agent'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Co-Pilot
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Rancang sinematografi, pergerakan kamera, dan prompt otomatis dengan AI'
                : 'Direct cinematography, camera motion, and master prompts with AI'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Inspiration Chips */}
      <div>
        <label className="text-xs font-medium text-neutral-400 mb-2 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-purple-400" />
          {isId ? 'Inspirasi Cepat Sinematik:' : 'Quick Concept Inspirations:'}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {INSPIRATION_IDEAS.map((idea, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyInspiration(idea)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-purple-900/30 hover:border-purple-500/40 text-neutral-300 hover:text-white border border-white/5 transition-all"
            >
              ✨ {idea.title}
            </button>
          ))}
        </div>
      </div>

      {/* Concept Input */}
      <div>
        <label className="text-xs font-semibold text-neutral-200 mb-1.5 flex items-center justify-between">
          <span>{isId ? 'Ide / Konsep Adegan Video:' : 'Scene Concept / Idea:'}</span>
          <span className="text-[11px] font-normal text-neutral-400 font-mono">
            {concept.length} char
          </span>
        </label>
        <div className="relative">
          <textarea
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder={
              isId
                ? 'Contoh: Iklan kopi hitam kental menetes lambat ke cangkir keramik dengan kepulan uap hangat di kafe pagi hari...'
                : 'Example: A hypercar drifting through a rain-drenched cyberpunk metropolis with neon reflections...'
            }
            rows={3}
            className="w-full px-3.5 py-2.5 text-xs bg-neutral-950/80 border border-white/10 rounded-xl text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Style Presets Grid */}
      <div>
        <label className="text-xs font-semibold text-neutral-200 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-pink-400" />
          {isId ? 'Gaya Sinematik (Visual Style):' : 'Cinematic Style:'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STYLE_PRESETS.map((preset) => {
            const isSelected = selectedStyle === preset.name;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedStyle(preset.name)}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-purple-500 bg-purple-600/20 text-white shadow-md shadow-purple-900/20'
                    : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-300 mb-1">
                  {preset.badge}
                </span>
                <span className="text-xs font-medium text-neutral-200 leading-tight">
                  {preset.name}
                </span>
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera Motion Selector */}
      <div>
        <label className="text-xs font-semibold text-neutral-200 mb-1.5 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          {isId ? 'Pergerakan Kamera (Camera Motion):' : 'Camera Movement:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CAMERA_MOTIONS.map((motion) => {
            const isSelected = selectedMotion === motion.label;
            return (
              <button
                key={motion.id}
                onClick={() => setSelectedMotion(motion.label)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-500/80 bg-cyan-950/30 text-white'
                    : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:bg-neutral-800/40'
                }`}
              >
                <div className="text-xs font-medium text-neutral-200 mb-0.5">
                  {motion.label}
                </div>
                <div className="text-[10px] text-neutral-400 leading-tight">
                  {motion.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Format Controls: Aspect Ratio, Duration, Resolution */}
      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-neutral-950/50 border border-white/5">
        {/* Aspect Ratio */}
        <div>
          <label className="text-[11px] font-medium text-neutral-400 mb-1 block">
            {isId ? 'Rasio Aspek' : 'Aspect Ratio'}
          </label>
          <div className="flex gap-1">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                aspectRatio === '16:9'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-neutral-800/70 text-neutral-400 hover:text-white'
              }`}
            >
              16:9
            </button>
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                aspectRatio === '9:16'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-neutral-800/70 text-neutral-400 hover:text-white'
              }`}
            >
              9:16
            </button>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="text-[11px] font-medium text-neutral-400 mb-1 block">
            {isId ? 'Durasi' : 'Duration'}
          </label>
          <div className="flex gap-1">
            <button
              onClick={() => setDuration('5s')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                duration === '5s'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-neutral-800/70 text-neutral-400 hover:text-white'
              }`}
            >
              5 Detik
            </button>
            <button
              onClick={() => setDuration('10s')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                duration === '10s'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-neutral-800/70 text-neutral-400 hover:text-white'
              }`}
            >
              10 Detik
            </button>
          </div>
        </div>

        {/* Resolution */}
        <div>
          <label className="text-[11px] font-medium text-neutral-400 mb-1 block">
            {isId ? 'Resolusi' : 'Resolution'}
          </label>
          <div className="flex gap-1">
            <button
              onClick={() => setResolution('720p')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                resolution === '720p'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-neutral-800/70 text-neutral-400 hover:text-white'
              }`}
            >
              720p HD
            </button>
            <button
              onClick={() => setResolution('1080p')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                resolution === '1080p'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-neutral-800/70 text-neutral-400 hover:text-white'
              }`}
            >
              1080p FHD
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons: Direct with AI vs Generate Directly */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={handleDirectClick}
          disabled={isDirecting || !concept.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-white/10 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Sparkles className={`w-4 h-4 text-purple-400 ${isDirecting ? 'animate-spin' : ''}`} />
          <span>
            {isDirecting
              ? (isId ? 'AI Sedang Merancang Pengarahan...' : 'AI Director Planning...')
              : (isId ? '1. Minta Arahan Sutradara AI' : '1. Direct Scene with AI')}
          </span>
        </button>

        <button
          onClick={handleGenerateClick}
          disabled={isGenerating || (!concept.trim() && !editablePrompt.trim())}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Video className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
          <span>
            {isGenerating
              ? (isId ? 'Merender Video (Gemini Omni)...' : 'Rendering Video (Omni Flash)...')
              : (isId ? '2. Render Video (Omni Flash)' : '2. Render Video')}
          </span>
        </button>
      </div>

      {/* Director Result Display */}
      {directorResult && (
        <div className="mt-2 p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-display">
              <Clapperboard className="w-3.5 h-3.5 text-purple-400" />
              {directorResult.title || (isId ? 'Rancangan Sutradara AI' : 'AI Director Plan')}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Ready to Render
            </span>
          </div>

          {/* Director Notes */}
          <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-white/5 text-xs text-neutral-300 leading-relaxed">
            <span className="font-semibold text-neutral-200 block mb-0.5">
              {isId ? 'Visi Sinematik:' : 'Cinematic Vision:'}
            </span>
            {directorResult.directorNotes}
          </div>

          {/* Camera Specs Bar */}
          {directorResult.cameraSpecs && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
              <div className="p-1.5 rounded bg-neutral-900/80 border border-white/5">
                <span className="text-neutral-500 block">Lensa:</span>
                <span className="font-mono text-purple-300 font-semibold">{directorResult.cameraSpecs.lens}</span>
              </div>
              <div className="p-1.5 rounded bg-neutral-900/80 border border-white/5">
                <span className="text-neutral-500 block">Pencahayaan:</span>
                <span className="font-mono text-cyan-300 font-semibold">{directorResult.cameraSpecs.lighting}</span>
              </div>
              <div className="p-1.5 rounded bg-neutral-900/80 border border-white/5">
                <span className="text-neutral-500 block">Palet Warna:</span>
                <span className="font-mono text-amber-300 font-semibold">{directorResult.cameraSpecs.colorPalette}</span>
              </div>
              <div className="p-1.5 rounded bg-neutral-900/80 border border-white/5">
                <span className="text-neutral-500 block">FPS / Speed:</span>
                <span className="font-mono text-pink-300 font-semibold">{directorResult.cameraSpecs.fps}</span>
              </div>
            </div>
          )}

          {/* Master Video Prompt */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-300 mb-1 flex items-center justify-between">
              <span>{isId ? 'Master Prompt Sinematik (Omni Flash):' : 'Master Cinematic Prompt:'}</span>
              <span className="text-[10px] text-purple-400">{isId ? 'Dapat diedit' : 'Editable'}</span>
            </label>
            <textarea
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs font-mono bg-neutral-950 border border-purple-500/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
            />
          </div>

          {/* Voiceover Script & TTS Generator */}
          {directorResult.suggestedVoiceover && (
            <div className="p-2.5 rounded-lg bg-pink-950/15 border border-pink-500/20 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-pink-300 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  {isId ? 'Naskah Voiceover (Narasi):' : 'Suggested Voiceover:'}
                </span>
                <button
                  onClick={() => onGenerateVoiceover(directorResult.suggestedVoiceover)}
                  disabled={isVoiceoverGenerating}
                  className="px-2 py-0.5 rounded bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 border border-pink-500/30 text-[10px] font-semibold transition-colors disabled:opacity-50"
                >
                  {isVoiceoverGenerating ? (isId ? 'Membuat Audio...' : 'Generating TTS...') : (isId ? 'Generate Audio (TTS)' : 'Generate TTS Audio')}
                </button>
              </div>
              <p className="text-neutral-300 italic">
                "{directorResult.suggestedVoiceover}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
