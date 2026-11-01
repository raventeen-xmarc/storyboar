import React, { useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon, Video, Wand2, RefreshCw } from 'lucide-react';
import { SAMPLE_IMAGE_FRAMES } from '../data/presets';

interface ImageToVideoPanelProps {
  onGenerateImageToVideo: (imageData: string, motionPrompt: string) => Promise<void>;
  isGenerating: boolean;
  lang: 'id' | 'en';
}

export const ImageToVideoPanel: React.FC<ImageToVideoPanelProps> = ({
  onGenerateImageToVideo,
  isGenerating,
  lang
}) => {
  const isId = lang === 'id';

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGE_FRAMES[0].url);
  const [motionPrompt, setMotionPrompt] = useState<string>(SAMPLE_IMAGE_FRAMES[0].suggestedPrompt);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomImageBase64(result);
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetFrame = (frame: typeof SAMPLE_IMAGE_FRAMES[0]) => {
    setSelectedImage(frame.url);
    setCustomImageBase64(null);
    setMotionPrompt(frame.suggestedPrompt);
  };

  const handleAnimate = async () => {
    const imageToUse = customImageBase64 || selectedImage;
    if (!imageToUse || !motionPrompt.trim()) return;
    await onGenerateImageToVideo(imageToUse, motionPrompt.trim());
  };

  const motionPresets = isId
    ? [
        { label: 'Push-in Halus', prompt: 'Kamera perlahan bergerak maju mendekati subjek dengan kedalaman ruang lembut.' },
        { label: 'Angin & Gerakan Partikel', prompt: 'Hembusan angin sepoi-sepoi menggerakkan partikel debu cahaya dan rambut subjek dengan anggun.' },
        { label: 'Slow Pan Kanan', prompt: 'Kamera meluncur mulus ke arah kanan memperlihatkan detail latar belakang secara bertahap.' },
        { label: 'Pull-back Mengungkap Pemandangan', prompt: 'Kamera mundur perlahan (pull back dolly) mengungkap skala lanskap yang lebih luas dan megah.' }
      ]
    : [
        { label: 'Smooth Push-in', prompt: 'Camera smoothly dollies in towards the subject with soft cinematic depth of field.' },
        { label: 'Gentle Breeze & Particles', prompt: 'Gentle breeze stirs hair and floating dust particles catching sunlight.' },
        { label: 'Slow Lateral Pan', prompt: 'Camera pans smoothly from left to right revealing background environmental details.' },
        { label: 'Pull-back Reveal', prompt: 'Camera dollies backward revealing the majestic surrounding scale of the scene.' }
      ];

  return (
    <div className="flex flex-col gap-5 p-5 bg-neutral-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              {isId ? 'Animasi Gambar ke Video (Image-to-Video)' : 'Image to Video Motion Animator'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Gemini Omni
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Hidupkan foto atau concept art menjadi video bergerak sinematik dengan kendali kamera'
                : 'Bring still frames or concept art to life with physical camera movements'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Image Selection & Preview */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-neutral-200 block">
            {isId ? '1. Pilih atau Unggah Frame Awal:' : '1. Select or Upload Starting Frame:'}
          </label>

          {/* Current Frame Preview Box */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center group">
            <img
              src={selectedImage}
              alt="Selected frame"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-neutral-900/90 text-white text-xs font-medium border border-white/20 hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-lg">
                <Upload className="w-3.5 h-3.5" />
                <span>{isId ? 'Ganti dengan Foto Sendiri' : 'Upload Your Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Sample Preset Frames */}
          <div>
            <span className="text-[11px] text-neutral-400 block mb-1.5">
              {isId ? 'Atau pilih dari galeri template konsep:' : 'Or pick from sample concept frames:'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_IMAGE_FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => handleSelectPresetFrame(frame)}
                  className={`relative rounded-lg overflow-hidden aspect-video border transition-all ${
                    selectedImage === frame.url
                      ? 'border-purple-500 ring-2 ring-purple-500/50'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={frame.url}
                    alt={frame.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 text-[9px] font-medium text-white px-1 py-0.5 rounded bg-black/70">
                    {frame.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Motion Prompt & Direction */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <label className="text-xs font-semibold text-neutral-200 mb-1.5 flex items-center justify-between">
              <span>{isId ? '2. Arahan Gerakan Kamera & Fisika (Motion Prompt):' : '2. Camera Motion & Physics Prompt:'}</span>
            </label>

            <textarea
              value={motionPrompt}
              onChange={(e) => setMotionPrompt(e.target.value)}
              rows={4}
              placeholder={
                isId
                  ? 'Contoh: Kamera perlahan bergerak maju (push in), kelopak bunga berterbangan tertiup angin sepoi-sepoi, dan air memantulkan cahaya berkilau...'
                  : 'Example: Camera dollies slowly forward while wind gently rustles through leaves and ripples water surface...'
              }
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-950/80 border border-white/10 rounded-xl text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
            />

            {/* Quick Motion Chips */}
            <div className="mt-2.5 space-y-1.5">
              <span className="text-[11px] font-medium text-neutral-400 block">
                {isId ? 'Preset Arahan Gerakan Cepat:' : 'Quick Motion Presets:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {motionPresets.map((mp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMotionPrompt(mp.prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-purple-900/40 text-neutral-300 hover:text-white border border-white/5 transition-colors"
                  >
                    🎯 {mp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAnimate}
            disabled={isGenerating || !motionPrompt.trim()}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Video className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
            <span>
              {isGenerating
                ? (isId ? 'Merender Animasi Video (Gemini Omni)...' : 'Rendering Video Motion...')
                : (isId ? 'Animasikan Frame Menjadi Video' : 'Animate Frame to Video')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
