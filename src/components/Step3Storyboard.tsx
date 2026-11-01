import React, { useState } from 'react';
import { Clapperboard, Sparkles, Layers, ArrowRight, ArrowLeft, Copy, Check, Edit2, Film, Camera, Sliders } from 'lucide-react';
import { StoryboardPackage, StoryboardScene, ScriptOption } from '../types';

interface Step3StoryboardProps {
  storyboard: StoryboardPackage | null;
  script: ScriptOption | null;
  sceneCount: number;
  setSceneCount: (count: number) => void;
  visualStyle: string;
  setVisualStyle: (style: string) => void;
  onGenerateStoryboard: (count: number, style: string) => Promise<void>;
  onUpdateScenePrompt: (sceneNumber: number, newPrompt: string) => void;
  onProceedToGenerate: () => void;
  onBackToStep2: () => void;
  isLoading: boolean;
  lang: 'id' | 'en';
}

export const Step3Storyboard: React.FC<Step3StoryboardProps> = ({
  storyboard,
  script,
  sceneCount,
  setSceneCount,
  visualStyle,
  setVisualStyle,
  onGenerateStoryboard,
  onUpdateScenePrompt,
  onProceedToGenerate,
  onBackToStep2,
  isLoading,
  lang
}) => {
  const isId = lang === 'id';
  const [copiedScene, setCopiedScene] = useState<number | null>(null);

  const sceneCountOptions = [3, 4, 5, 6, 8];

  const styleOptions = [
    'Hollywood 35mm Film',
    'Studio Ghibli Anime',
    'Cyberpunk Neon 4K',
    'BBC Earth Nature',
    'Pixar 3D Animation',
    'Luxury Brand Commercial',
    'Vintage 1970s Kodachrome'
  ];

  const handleCopyPrompt = (sceneNum: number, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedScene(sceneNum);
    setTimeout(() => setCopiedScene(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6 bg-neutral-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              {isId ? 'Langkah 3: Storyboard & Master Prompt Tiap Adegan' : 'Step 3: Storyboard & Scene Prompts'}
            </h2>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Tentukan berapa adegan yang diinginkan, lalu AI akan merancang prompt visual untuk setiap shot'
                : 'Select number of scenes, and AI will craft production-grade video prompts for every shot'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStep2}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors border border-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isId ? 'Kembali ke Script' : 'Back to Scripts'}</span>
          </button>
        </div>
      </div>

      {/* Script Summary Box */}
      {script && (
        <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-purple-400 font-semibold block mb-0.5">
              {isId ? 'Script Terpilih:' : 'Selected Script:'}
            </span>
            <div className="font-semibold text-white">{script.title}</div>
            <div className="text-neutral-400 text-[11px] mt-0.5 line-clamp-1 italic">"{script.hook}"</div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 shrink-0 self-start sm:self-auto">
            {script.toneLabel}
          </span>
        </div>
      )}

      {/* Storyboard Settings: Scene Count & Visual Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-950/50 border border-white/5">
        {/* Scene Count Selector */}
        <div>
          <label className="text-xs font-semibold text-neutral-200 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              {isId ? 'Mau Berapa Adegan dalam 1 Storyboard?' : 'How many scenes in this storyboard?'}
            </span>
            <span className="font-mono text-purple-400 text-xs font-bold">
              {sceneCount} {isId ? 'Adegan' : 'Scenes'}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {sceneCountOptions.map((num) => (
              <button
                key={num}
                onClick={() => setSceneCount(num)}
                className={`flex-1 min-w-[60px] py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  sceneCount === num
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {num} {isId ? 'Shot' : 'Scenes'}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Style Selector */}
        <div>
          <label className="text-xs font-semibold text-neutral-200 mb-2 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-pink-400" />
            {isId ? 'Gaya Sinematik Visual:' : 'Cinematic Visual Style:'}
          </label>
          <select
            value={visualStyle}
            onChange={(e) => setVisualStyle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/10 rounded-lg text-neutral-200 focus:outline-none focus:border-purple-500"
          >
            {styleOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Button: Generate Storyboard */}
      <div>
        <button
          onClick={() => onGenerateStoryboard(sceneCount, visualStyle)}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>
            {isLoading
              ? (isId ? `AI Sedang Merancang ${sceneCount} Adegan Storyboard...` : `AI is Designing ${sceneCount} Storyboard Scenes...`)
              : (isId ? `Susun Storyboard & Master Prompt (${sceneCount} Adegan)` : `Generate Storyboard & Prompts (${sceneCount} Scenes)`)}
          </span>
        </button>
      </div>

      {/* Storyboard Scenes Output */}
      {storyboard && storyboard.scenes.length > 0 && (
        <div className="mt-4 pt-5 border-t border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-base text-white">
                {storyboard.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {storyboard.overallVision}
              </p>
            </div>

            <button
              onClick={onProceedToGenerate}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/30"
            >
              <span>{isId ? 'Lanjut ke Generate Video' : 'Proceed to Generate Video'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scene Cards Grid */}
          <div className="space-y-4">
            {storyboard.scenes.map((scene) => (
              <div
                key={scene.sceneNumber}
                className="p-4 rounded-xl bg-neutral-950/70 border border-white/10 space-y-3"
              >
                {/* Scene Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40">
                      ADEGAN #{scene.sceneNumber}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {scene.shotType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/20">
                      🎥 {scene.cameraMotion}
                    </span>
                    <button
                      onClick={() => handleCopyPrompt(scene.sceneNumber, scene.masterVideoPrompt)}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    >
                      {copiedScene === scene.sceneNumber ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{isId ? 'Tersalin' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-purple-400" />
                          <span>{isId ? 'Salin Prompt' : 'Copy Prompt'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Scene Content Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Action */}
                  <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/5">
                    <span className="text-[10px] font-semibold text-purple-400 block uppercase font-mono mb-1">
                      🎬 Visual Action:
                    </span>
                    <p className="text-neutral-300 leading-relaxed">
                      {scene.sceneAction}
                    </p>
                  </div>

                  {/* Voiceover Segment */}
                  <div className="p-3 rounded-lg bg-pink-950/20 border border-pink-500/20">
                    <span className="text-[10px] font-semibold text-pink-300 block uppercase font-mono mb-1">
                      🎙️ Narasi Voiceover Adegan:
                    </span>
                    <p className="text-neutral-300 italic leading-relaxed">
                      "{scene.voiceoverSegment}"
                    </p>
                  </div>
                </div>

                {/* Camera Specs Bar */}
                {scene.cameraSpecs && (
                  <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400 font-mono">
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/5">
                      Lensa: <b className="text-neutral-200">{scene.cameraSpecs.lens}</b>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/5">
                      Lighting: <b className="text-neutral-200">{scene.cameraSpecs.lighting}</b>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/5">
                      Speed: <b className="text-neutral-200">{scene.cameraSpecs.speed}</b>
                    </span>
                  </div>
                )}

                {/* Master Video Prompt for Gemini Omni */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                    <span>{isId ? 'Master Prompt Sinematik (Gemini Omni Flash):' : 'Master Video Prompt:'}</span>
                    <span className="text-[10px] text-purple-400">{isId ? 'Dapat diedit' : 'Editable'}</span>
                  </label>
                  <textarea
                    value={scene.masterVideoPrompt}
                    onChange={(e) => onUpdateScenePrompt(scene.sceneNumber, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-xs font-mono bg-neutral-900 border border-purple-500/30 rounded-lg text-purple-200 focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Proceed Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={onProceedToGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-emerald-900/40"
            >
              <span>{isId ? 'Semua Storyboard Siap • Lanjut ke Generate Video' : 'All Scenes Ready • Proceed to Generate Video'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
