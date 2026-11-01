import React, { useState } from 'react';
import { Film, Play, Download, Sparkles, Tag, Check, Trash2, ExternalLink } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoGalleryProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  activeVideoId?: string;
  onDeleteVideo?: (id: string) => void;
  lang: 'id' | 'en';
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  onSelectVideo,
  activeVideoId,
  onDeleteVideo,
  lang
}) => {
  const isId = lang === 'id';
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Collect all unique tags
  const tags = ['All', ...Array.from(new Set(videos.map((v) => v.genre).filter(Boolean)))];

  const filteredVideos = selectedTag === 'All'
    ? videos
    : videos.filter((v) => v.genre === selectedTag);

  return (
    <div className="flex flex-col gap-4 p-5 bg-neutral-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              {isId ? 'Galeri Video & Koleksi Master' : 'Video Gallery & Master Reels'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                {videos.length} Video
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Jelajahi video yang telah dirender dan preset sinematik resolusi tinggi'
                : 'Browse rendered clips and high-resolution master video presets'}
            </p>
          </div>
        </div>

        {/* Tag Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedTag === t
                  ? 'bg-purple-600 text-white'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
              }`}
            >
              {t === 'All' ? (isId ? 'Semua' : 'All') : t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => {
          const isActive = video.id === activeVideoId;
          return (
            <div
              key={video.id}
              className={`group flex flex-col rounded-xl overflow-hidden border transition-all ${
                isActive
                  ? 'border-purple-500 bg-neutral-900 ring-2 ring-purple-500/30'
                  : 'border-white/10 bg-neutral-950/60 hover:border-purple-500/50'
              }`}
            >
              {/* Thumbnail / Video Preview Box */}
              <div
                onClick={() => onSelectVideo(video)}
                className="relative aspect-video bg-black cursor-pointer overflow-hidden flex items-center justify-center"
              >
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <video
                    src={video.videoUrl}
                    muted
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Badges on video */}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/70 text-purple-300 font-semibold backdrop-blur-sm">
                    {video.aspectRatio}
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/70 text-neutral-300 backdrop-blur-sm">
                    {video.duration}
                  </span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 ml-0.5 fill-white" />
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-display font-semibold text-xs text-white line-clamp-1">
                      {video.title}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 shrink-0">
                      {video.genre}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                    {video.prompt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                  <button
                    onClick={() => onSelectVideo(video)}
                    className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>{isActive ? (isId ? 'Sedang Diputar' : 'Now Playing') : (isId ? 'Buka di Studio' : 'Open in Studio')}</span>
                  </button>

                  {video.isCustom && onDeleteVideo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVideo(video.id);
                      }}
                      className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors"
                      title={isId ? 'Hapus Video' : 'Delete Video'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
