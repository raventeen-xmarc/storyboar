import React from 'react';
import { Layers, Film, Clapperboard, Play, Sparkles, Video, ArrowRight, CheckCircle2 } from 'lucide-react';
import { StoryboardShot } from '../types';

interface StoryboardSequencerProps {
  shots: StoryboardShot[];
  onRenderShot: (shot: StoryboardShot) => void;
  onPreviewShot: (videoUrl: string) => void;
  activeVideoUrl?: string;
  isGenerating: boolean;
  lang: 'id' | 'en';
}

export const StoryboardSequencer: React.FC<StoryboardSequencerProps> = ({
  shots,
  onRenderShot,
  onPreviewShot,
  activeVideoUrl,
  isGenerating,
  lang
}) => {
  const isId = lang === 'id';

  const defaultShots: StoryboardShot[] = shots.length > 0 ? shots : [
    {
      shotNumber: 1,
      shotType: 'Establishing Wide Aerial Shot',
      description: 'Lanskap fajar megah dengan kabut tipis menyelimuti lembah gunung purba.',
      cameraMove: 'FPV Drone Slow Descend',
      mood: 'Majestic, Serene'
    },
    {
      shotNumber: 2,
      shotType: 'Medium Tracking Shot',
      description: 'Karakter utama berjalan ke tepi tebing mengamati matahari terbit berwarna emas.',
      cameraMove: 'Lateral Dolly Tracking',
      mood: 'Inspirational, Epic'
    },
    {
      shotNumber: 3,
      shotType: 'Extreme Macro Eye Close-Up',
      description: 'Pantulan matahari terbit dan dunia masa depan terpancar di retina mata karakter.',
      cameraMove: 'Push-in Macro Zoom',
      mood: 'Intense, Emotional'
    }
  ];

  return (
    <div className="flex flex-col gap-4 p-5 bg-neutral-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              {isId ? 'Storyboard & Sekuens Adegan' : 'Scene Storyboard Sequencer'}
            </h2>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Rangkaian shot terencana untuk merangkai video naratif multi-adegan'
                : 'Curated shots breakdown for sequential multi-scene narrative'}
            </p>
          </div>
        </div>
      </div>

      {/* Film Strip Timeline Bar */}
      <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/5 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-[500px]">
          {defaultShots.map((shot, idx) => (
            <React.Fragment key={shot.shotNumber}>
              <div
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  shot.videoUrl === activeVideoUrl
                    ? 'border-purple-500 bg-purple-950/30 shadow-md'
                    : 'border-white/5 bg-neutral-900/50 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                    SHOT 0{shot.shotNumber}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">5.0s</span>
                </div>
                <div className="text-xs font-semibold text-neutral-200 line-clamp-1 mb-1">
                  {shot.shotType}
                </div>
                <div className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {shot.description}
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-cyan-400 font-mono">
                    🎥 {shot.cameraMove}
                  </span>

                  {shot.videoUrl ? (
                    <button
                      onClick={() => onPreviewShot(shot.videoUrl!)}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
                    >
                      <Play className="w-2.5 h-2.5 fill-white" />
                      <span>{isId ? 'Putar' : 'Play'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onRenderShot(shot)}
                      disabled={isGenerating}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-neutral-800 hover:bg-purple-600 text-neutral-300 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                      <span>{isId ? 'Render Shot' : 'Render'}</span>
                    </button>
                  )}
                </div>
              </div>

              {idx < defaultShots.length - 1 && (
                <div className="text-neutral-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Detailed Shot Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          {isId ? 'Detail Pengarahan Setiap Shot:' : 'Directing Details per Shot:'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {defaultShots.map((shot) => (
            <div
              key={shot.shotNumber}
              className="p-4 rounded-xl bg-neutral-950/60 border border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-400 font-display">
                    Adegan #{shot.shotNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                    {shot.mood}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-white mb-1.5">
                  {shot.shotType}
                </h4>

                <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                  {shot.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-[11px] text-neutral-300 flex items-center justify-between">
                  <span className="text-neutral-500">{isId ? 'Kamera:' : 'Camera:'}</span>
                  <span className="font-mono text-cyan-300">{shot.cameraMove}</span>
                </div>

                <button
                  onClick={() => onRenderShot(shot)}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-neutral-800 hover:bg-purple-600/80 text-white text-xs font-medium transition-colors disabled:opacity-50"
                >
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  <span>
                    {shot.videoUrl
                      ? (isId ? 'Render Ulang Shot Ini' : 'Re-render Shot')
                      : (isId ? 'Render Adegan Ini' : 'Render This Scene')}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
