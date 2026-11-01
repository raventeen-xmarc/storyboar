import React from 'react';
import { Film, Clapperboard, Sparkles, Video, Image as ImageIcon, Layers, RefreshCw, Globe, HelpCircle, Save, Upload } from 'lucide-react';

interface NavbarProps {
  activeTab: 'pipeline' | 'image2video' | 'gallery';
  setActiveTab: (tab: 'pipeline' | 'image2video' | 'gallery') => void;
  lang: 'id' | 'en';
  setLang: (lang: 'id' | 'en') => void;
  onNewProject: () => void;
  onExportClick: () => void;
  isGenerating: boolean;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onNewProject,
  onExportClick,
  isGenerating,
  onOpenHelp
}) => {
  const isId = lang === 'id';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-950/85 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-lg shadow-purple-900/30">
            <Film className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
                OmniMotion AI
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                Pipeline Agent
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              {isId ? 'Brainstorm Ide • Script Cerita • Storyboard Adegan • Video Studio' : 'Brainstorming • Story Scripting • Scene Storyboard • Video Studio'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center p-1 bg-neutral-900/90 rounded-xl border border-white/5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'pipeline'
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>{isId ? 'Alur Pembuatan Video' : 'Video Creator Pipeline'}</span>
          </button>

          <button
            onClick={() => setActiveTab('image2video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'image2video'
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isId ? 'Animasi Gambar' : 'Image to Video'}</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'gallery'
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{isId ? 'Galeri' : 'Gallery'}</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Save / Export Project */}
          <button
            onClick={onExportClick}
            title={isId ? 'Simpan atau Ekspor File Project' : 'Save / Export Project File'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-300 hover:text-white bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 transition-all"
          >
            <Save className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">{isId ? 'Simpan Project' : 'Save Project'}</span>
          </button>

          {/* New Project */}
          <button
            onClick={onNewProject}
            disabled={isGenerating}
            title={isId ? 'Mulai Proyek Video Baru' : 'New Video Project'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 border border-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isId ? 'Reset' : 'Reset'}</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLang(isId ? 'en' : 'id')}
            title={isId ? 'Ganti Bahasa ke English' : 'Switch to Bahasa Indonesia'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 border border-white/5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span className="uppercase font-mono">{lang}</span>
          </button>

          {/* Guide / Info */}
          <button
            onClick={onOpenHelp}
            title={isId ? 'Panduan & Info Model' : 'Guide & Model Info'}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
