import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Camera,
  Film,
  Sparkles,
  Volume1,
  Share2,
  Sliders
} from 'lucide-react';
import { VideoItem } from '../types';

interface VideoStudioPlayerProps {
  currentVideo: VideoItem | null;
  isGenerating: boolean;
  onExtendScene?: (video: VideoItem) => void;
  lang: 'id' | 'en';
}

export const VideoStudioPlayer: React.FC<VideoStudioPlayerProps> = ({
  currentVideo,
  isGenerating,
  onExtendScene,
  lang
}) => {
  const isId = lang === 'id';
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isVoiceoverPlaying, setIsVoiceoverPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [copied, setCopied] = useState(false);

  // Sync video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setIsVoiceoverPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        if (currentVideo?.voiceoverAudioUrl && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
          setIsVoiceoverPlaying(true);
        }
      }).catch(err => {
        console.error('Play error:', err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextRate = speeds[nextIdx];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Snapshot frame into PNG
  const captureFrame = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = imgData;
        a.download = `OmniMotion-frame-${Date.now()}.png`;
        a.click();
      }
    } catch (err) {
      console.error('Snapshot failed:', err);
    }
  };

  // Download video file
  const downloadVideo = () => {
    if (!currentVideo?.videoUrl) return;
    const a = document.createElement('a');
    a.href = currentVideo.videoUrl;
    a.download = `OmniMotion-${currentVideo.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.mp4`;
    a.target = '_blank';
    a.click();
  };

  // Copy prompt
  const copyPrompt = () => {
    if (!currentVideo?.prompt) return;
    navigator.clipboard.writeText(currentVideo.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isVertical = currentVideo?.aspectRatio === '9:16';

  return (
    <div className="flex flex-col bg-neutral-900/80 rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Top Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950/60 border-b border-white/5 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <Film className="w-3 h-3 text-purple-400" />
            {currentVideo?.aspectRatio || '16:9'}
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 text-neutral-300">
            {currentVideo?.resolution || '720p'}
          </span>
          {currentVideo?.genre && (
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
              {currentVideo.genre}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {currentVideo && (
            <>
              <button
                onClick={copyPrompt}
                title={isId ? 'Salin Prompt Lengkap' : 'Copy Full Prompt'}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors text-[11px]"
              >
                <Share2 className="w-3 h-3 text-purple-400" />
                <span>{copied ? (isId ? 'Disalin!' : 'Copied!') : (isId ? 'Salin Prompt' : 'Copy Prompt')}</span>
              </button>

              <button
                onClick={captureFrame}
                title={isId ? 'Tangkap Foto Frame Saat Ini (PNG)' : 'Snapshot Current Frame'}
                className="p-1.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={downloadVideo}
                title={isId ? 'Unduh Video MP4' : 'Download MP4'}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors text-[11px] shadow-sm"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">{isId ? 'Unduh MP4' : 'Download'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        className="relative w-full bg-black flex items-center justify-center min-h-[320px] sm:min-h-[420px] max-h-[580px] overflow-hidden group select-none"
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Viewfinder Overlay Guides */}
        <div className="absolute inset-0 pointer-events-none opacity-20 border-[16px] border-transparent">
          <div className="w-full h-full border border-dashed border-white/40 grid grid-cols-3 grid-rows-3">
            <div className="border-r border-b border-white/20"></div>
            <div className="border-r border-b border-white/20"></div>
            <div className="border-b border-white/20"></div>
            <div className="border-r border-b border-white/20"></div>
            <div className="border-r border-b border-white/20"></div>
            <div className="border-b border-white/20"></div>
          </div>
        </div>

        {/* Viewfinder Crosshairs */}
        <div className="absolute top-4 left-4 font-mono text-[9px] text-white/40 tracking-wider pointer-events-none">
          REC • 24.00 FPS • PRORES 422
        </div>
        <div className="absolute top-4 right-4 font-mono text-[9px] text-white/40 tracking-wider pointer-events-none">
          {currentVideo?.aspectRatio === '9:16' ? '9:16 VERTICAL' : '16:9 CINEMASCOPE'}
        </div>

        {/* If Video is Generating */}
        {isGenerating && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-6 text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center animate-spin">
                <Film className="w-8 h-8 text-purple-400" />
              </div>
              <Sparkles className="w-5 h-5 text-pink-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <h4 className="text-base font-display font-semibold text-white mb-1">
              {isId ? 'Gemini Omni Flash Sedang Merender Video...' : 'Gemini Omni Flash is Generating Video...'}
            </h4>
            <p className="text-xs text-neutral-400 max-w-sm">
              {isId
                ? 'Model AI sedang mensintesis frame beresolusi tinggi, lintasan kamera fisik, dan pencahayaan sinematik.'
                : 'Synthesizing high-fidelity frames, physical camera trajectories, and photorealistic lighting.'}
            </p>
          </div>
        )}

        {/* Video Element */}
        {currentVideo?.videoUrl ? (
          <div className={`relative flex items-center justify-center w-full h-full ${isVertical ? 'max-w-[340px] aspect-[9/16]' : 'aspect-video'}`}>
            <video
              ref={videoRef}
              src={currentVideo.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
              loop
              playsInline
              className="w-full h-full object-contain rounded-lg shadow-2xl cursor-pointer"
            />

            {/* Play Button Overlay (when paused) */}
            {!isPlaying && !isGenerating && (
              <button
                onClick={togglePlay}
                className="absolute flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/90 text-white hover:bg-purple-500 hover:scale-105 transition-all shadow-xl shadow-purple-900/50 backdrop-blur-sm"
              >
                <Play className="w-7 h-7 ml-1 fill-white" />
              </button>
            )}

            {/* Voiceover hidden audio element */}
            {currentVideo.voiceoverAudioUrl && (
              <audio ref={audioRef} src={currentVideo.voiceoverAudioUrl} />
            )}
          </div>
        ) : (
          /* Empty / Standby State */
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-4 text-neutral-500">
              <Film className="w-8 h-8 text-neutral-400" />
            </div>
            <h4 className="text-base font-display font-semibold text-neutral-200 mb-1">
              {isId ? 'Studio Viewfinder Siap' : 'Studio Viewfinder Ready'}
            </h4>
            <p className="text-xs text-neutral-400 mb-4">
              {isId
                ? 'Ketik ide video Anda di panel kiri atau pilih dari galeri preset untuk langsung memutar dan mengedit video.'
                : 'Enter your video concept in the director panel or select from preset reels to preview and edit.'}
            </p>
          </div>
        )}

        {/* Player Controls Bar (Bottom) */}
        {currentVideo && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Scrubber Progress Bar */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.05"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      setCurrentTime(0);
                      videoRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Time Display */}
                <span className="font-mono text-[11px] text-neutral-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Voiceover indicator toggle */}
                {currentVideo.voiceover && (
                  <div
                    title={currentVideo.voiceover}
                    className="hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20"
                  >
                    <Volume1 className="w-3 h-3" />
                    <span>VO Script</span>
                  </div>
                )}

                {/* Speed Toggle */}
                <button
                  onClick={changeSpeed}
                  className="px-2 py-0.5 rounded text-[11px] font-mono text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  {playbackRate}x
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Details & Meta Footer */}
      {currentVideo && (
        <div className="p-4 bg-neutral-950/70 border-t border-white/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-semibold text-sm text-white">
                {currentVideo.title}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-2 mt-0.5">
                {currentVideo.prompt}
              </p>
            </div>

            {onExtendScene && (
              <button
                onClick={() => onExtendScene(currentVideo)}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isId ? 'Lanjutkan / Edit Adegan' : 'Extend / Edit Scene'}</span>
              </button>
            )}
          </div>

          {/* Director Notes & Sound cues */}
          {(currentVideo.directorNotes || currentVideo.soundtrackCues) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
              {currentVideo.directorNotes && (
                <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-white/5">
                  <span className="font-semibold text-purple-400 block mb-0.5">
                    🎬 {isId ? 'Catatan Sutradara' : 'Director Notes'}
                  </span>
                  <p className="text-neutral-300 leading-relaxed">
                    {currentVideo.directorNotes}
                  </p>
                </div>
              )}

              {currentVideo.soundtrackCues && (
                <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-white/5">
                  <span className="font-semibold text-pink-400 block mb-0.5">
                    🎵 {isId ? 'Desain Suara & Musik' : 'Sound Design Cues'}
                  </span>
                  <p className="text-neutral-300 leading-relaxed">
                    {currentVideo.soundtrackCues}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
