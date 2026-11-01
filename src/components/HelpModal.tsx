import React from 'react';
import { X, Sparkles, Film, Video, Cpu, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'id' | 'en';
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const isId = lang === 'id';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">
              {isId ? 'Tentang OmniMotion AI Agent Video Studio' : 'About OmniMotion AI Video Studio'}
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Model: gemini-omni-1.1-flash & gemini-3.8-flash
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1.5">
            <h4 className="font-semibold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {isId ? 'Bagaimana AI Director Agent Bekerja?' : 'How Does the AI Director Work?'}
            </h4>
            <p className="text-neutral-300">
              {isId
                ? 'OmniMotion menggunakan arsitektur agen bertingkat: Gemini 3.8 Flash bertindak sebagai Sutradara Kreatif (Director Co-Pilot) yang membedah ide Anda menjadi parameter kamera fisik (lensa 35mm, sudut pan/tilt/orbit, pencahayaan volumetrik, dan FPS), lalu menyusun master prompt sinematik untuk Gemini Omni Video (gemini-omni-1.1-flash).'
                : 'OmniMotion uses a multi-agent workflow: Gemini 3.8 Flash acts as the Creative Director Co-Pilot to translate concepts into physical cinematography parameters (lens, lighting, motion vector) and renders them via Gemini Omni Video (gemini-omni-1.1-flash).'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 space-y-1">
              <span className="font-semibold text-cyan-400 flex items-center gap-1">
                <Video className="w-3.5 h-3.5" />
                {isId ? 'Text-to-Video' : 'Text-to-Video'}
              </span>
              <p className="text-neutral-400">
                {isId
                  ? 'Ketik konsep adegan, pilih gaya sinematik (Hollywood, Anime, Cyberpunk), dan biarkan AI merender pergerakan kamera dinamis dalam rasio 16:9 atau 9:16.'
                  : 'Type any scene concept, select cinematic styles, and render dynamic camera movements in 16:9 widescreen or 9:16 vertical.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 space-y-1">
              <span className="font-semibold text-pink-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {isId ? 'Image-to-Video & Storyboard' : 'Image-to-Video & Storyboard'}
              </span>
              <p className="text-neutral-400">
                {isId
                  ? 'Unggah foto awal atau gunakan konsep template untuk menggerakkan kamera secara fisik, serta susun multi-shot sequence pada tab Storyboard.'
                  : 'Animate any starting image with physics motion prompts or construct sequential multi-scene narratives.'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 space-y-2">
            <h5 className="font-semibold text-white">
              {isId ? '💡 Tips Prompt Sinematik Terbaik:' : '💡 Pro Cinematography Tips:'}
            </h5>
            <ul className="space-y-1.5 text-neutral-400 list-disc list-inside">
              <li>{isId ? 'Sebutkan pergerakan kamera eksplisit: "slow tracking dolly in", "FPV drone ascent", "macro 120fps".' : 'Specify camera movement: "slow tracking dolly in", "FPV drone ascent", "macro 120fps".'}</li>
              <li>{isId ? 'Spesifikasikan pencahayaan: "golden hour rim lighting", "volumetric fog", "neon reflections on wet asphalt".' : 'Specify lighting: "golden hour rim lighting", "volumetric fog", "neon reflections on wet asphalt".'}</li>
              <li>{isId ? 'Gunakan tombol "Minta Arahan Sutradara AI" agar prompt ditingkatkan secara otomatis oleh AI Director!' : 'Use the "Direct Scene with AI" button to automatically optimize the prompt with Hollywood cinematography.'}</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
          >
            {isId ? 'Tutup & Mulai Berkarya' : 'Close & Start Directing'}
          </button>
        </div>
      </div>
    </div>
  );
};
