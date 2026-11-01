import React, { useState } from 'react';
import { Video, Play, Download, Sparkles, Volume2, ArrowLeft, ArrowRight, Save, Layers, Film } from 'lucide-react';
import { StoryboardPackage, StoryboardScene, VideoItem } from '../types';
import { VideoStudioPlayer } from './VideoStudioPlayer';

interface Step4GenerateVideoProps {
  storyboard: StoryboardPackage | null;
  currentVideo: VideoItem | null;
  onRenderScene: (scene: StoryboardScene) => Promise<void>;
  onRenderAllScenes: () => Promise<void>;
  onGenerateVoiceover: (text: string) => Promise<void>;
  onSelectVideoToPlay: (video: VideoItem) => void;
  renderedVideos: VideoItem[];
  isGenerating: boolean;
  isVoiceoverGenerating: boolean;
  onProceedToSave: () => void;
  onBackToStep3: () => void;
  lang: 'id' | 'en';
}

export const Step4GenerateVideo: React.FC<Step4GenerateVideoProps> = ({
  storyboard,
  currentVideo,
  onRenderScene,
  onRenderAllScenes,
  onGenerateVoiceover,
  onSelectVideoToPlay,
  renderedVideos,
  isGenerating,
  isVoiceoverGenerating,
  onProceedToSave,
  onBackToStep3,
  lang
}) => {
  const isId = lang === 'id';
  const [selectedSceneNum, setSelectedSceneNum] = useState<number>(1);

  const scenes = storyboard?.scenes || [];

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6 bg-neutral-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              {isId ? 'Langkah 4: Studio Render Video (Gemini Omni Flash)' : 'Step 4: Video Generation Studio'}
            </h2>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Render setiap adegan storyboard menjadi video sinematik dengan kendali kamera dan audio voiceover'
                : 'Render each storyboard shot into cinematic video with physical camera motion and voiceover'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStep3}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors border border-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isId ? 'Kembali ke Storyboard' : 'Back to Storyboard'}</span>
          </button>

          <button
            onClick={onProceedToSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isId ? 'Simpan / Ekspor Project' : 'Save Project File'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Main Studio Area: Video Player on top, Scene queue below */}
      <div className="space-y-6">
        {/* Studio Player */}
        <VideoStudioPlayer
          currentVideo={currentVideo}
          isGenerating={isGenerating}
          lang={lang}
        />

        {/* Global Render Actions & Voiceover */}
        <div className="p-4 rounded-xl bg-neutral-950/70 border border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onRenderAllScenes}
              disabled={isGenerating || scenes.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isId ? '⚡ Render Semua Adegan Sekaligus' : '⚡ Render All Scenes (Batch)'}</span>
            </button>

            {storyboard && (
              <button
                onClick={() => {
                  const combinedVo = scenes.map((s) => s.voiceoverSegment).filter(Boolean).join(' ');
                  if (combinedVo) onGenerateVoiceover(combinedVo);
                }}
                disabled={isVoiceoverGenerating}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 text-xs font-medium transition-colors disabled:opacity-50"
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {isVoiceoverGenerating
                    ? (isId ? 'Membuat Voiceover...' : 'Generating Audio...')
                    : (isId ? 'Sinkronkan Voiceover Narasi (TTS)' : 'Generate Full Voiceover (TTS)')}
                </span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-neutral-400 font-mono text-center sm:text-right">
            Total {scenes.length} {isId ? 'Adegan Storyboard' : 'Storyboard Scenes'}
          </div>
        </div>

        {/* Scenes List with individual render triggers */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            {isId ? 'Daftar Render Adegan Storyboard:' : 'Storyboard Scenes Render Queue:'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {scenes.map((scene) => {
              const matchedVideo = renderedVideos.find((v) => v.sceneNumber === scene.sceneNumber);
              const isPlaying = currentVideo?.sceneNumber === scene.sceneNumber;

              return (
                <div
                  key={scene.sceneNumber}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isPlaying
                      ? 'border-purple-500 bg-purple-950/30 ring-2 ring-purple-500/30'
                      : 'border-white/5 bg-neutral-950/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        SHOT #{scene.sceneNumber}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400">
                        🎥 {scene.cameraMotion}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-1.5">
                      {scene.shotType}
                    </h4>

                    <p className="text-xs text-neutral-400 leading-relaxed mb-2.5 line-clamp-2">
                      {scene.sceneAction}
                    </p>

                    {scene.voiceoverSegment && (
                      <p className="text-[11px] text-pink-300/90 italic bg-pink-950/20 p-2 rounded-lg border border-pink-500/10 mb-3">
                        "{scene.voiceoverSegment}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    {matchedVideo ? (
                      <button
                        onClick={() => onSelectVideoToPlay(matchedVideo)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{isId ? 'Putar Video Adegan Ini' : 'Play Scene Video'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onRenderScene(scene)}
                        disabled={isGenerating}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-neutral-800 hover:bg-purple-600 text-neutral-200 hover:text-white text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>{isId ? 'Render Video Adegan Ini' : 'Render This Scene'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
