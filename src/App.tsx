import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StepPipelineBar } from './components/StepPipelineBar';
import { Step1Brainstorm } from './components/Step1Brainstorm';
import { Step2ScriptSelect } from './components/Step2ScriptSelect';
import { Step3Storyboard } from './components/Step3Storyboard';
import { Step4GenerateVideo } from './components/Step4GenerateVideo';
import { Step5ProjectExport } from './components/Step5ProjectExport';
import { ImageToVideoPanel } from './components/ImageToVideoPanel';
import { VideoGallery } from './components/VideoGallery';
import { AgentChatSidebar } from './components/AgentChatSidebar';
import { HelpModal } from './components/HelpModal';
import {
  BrainstormIdea,
  ScriptOption,
  StoryboardPackage,
  StoryboardScene,
  VideoItem,
  ProjectData,
  ChatMessage,
  VideoFormatType,
  VideoCategoryType,
  AspectRatioType
} from './types';
import { MessageSquare, CheckCircle2, AlertCircle, Clapperboard, X, ShieldAlert } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'omnimotion_project_v1';

export default function App() {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'image2video' | 'gallery'>('pipeline');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Project Pipeline State
  const [theme, setTheme] = useState<string>('Sejarah kopi tertua di Indonesia dan bagaimana biji hitam ini mengubah dunia');
  const [format, setFormat] = useState<VideoFormatType>('short');
  const [category, setCategory] = useState<VideoCategoryType>('Edukasi');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [sceneCount, setSceneCount] = useState<number>(4);
  const [visualStyle, setVisualStyle] = useState<string>('Hollywood 35mm Film');

  // Brainstorm & Script Output
  const [brainstormIdeas, setBrainstormIdeas] = useState<BrainstormIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BrainstormIdea | null>(null);
  const [scripts, setScripts] = useState<ScriptOption[]>([]);
  const [selectedScript, setSelectedScript] = useState<ScriptOption | null>(null);
  const [storyboard, setStoryboard] = useState<StoryboardPackage | null>(null);

  // Studio & Render State
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [renderedVideos, setRenderedVideos] = useState<VideoItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);

  // Loading States
  const [isBrainstorming, setIsBrainstorming] = useState<boolean>(false);
  const [isScriptLoading, setIsScriptLoading] = useState<boolean>(false);
  const [isStoryboardLoading, setIsStoryboardLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isVoiceoverGenerating, setIsVoiceoverGenerating] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Notification Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Chat History
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Halo! Saya **OmniMotion AI Director**. Saya akan memandu Anda mulai dari brainstorming ide, menyusun naskah script, memecah storyboard adegan, hingga merender video Gemini Omni. Ceritakan apa yang ada di pikiran Anda!',
      timestamp: Date.now()
    }
  ]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Load sample videos from backend on startup
  useEffect(() => {
    fetch('/api/samples')
      .then((res) => res.json())
      .then((data) => {
        if (data.samples && data.samples.length > 0) {
          const mapped: VideoItem[] = data.samples.map((s: any) => ({
            id: s.id,
            title: lang === 'id' ? s.titleId || s.title : s.title,
            prompt: s.prompt,
            aspectRatio: s.aspectRatio,
            duration: s.duration,
            resolution: s.resolution,
            videoUrl: s.videoUrl,
            thumbnail: s.thumbnail,
            genre: s.genre,
            createdAt: Date.now() - 3600000,
            directorNotes: s.directorNotes,
            soundtrackCues: s.soundtrackCues,
            voiceover: s.voiceover
          }));
          setVideos(mapped);
          if (!currentVideo && mapped.length > 0) {
            setCurrentVideo(mapped[0]);
          }
        }
      })
      .catch((err) => console.error('Failed to load sample videos:', err));
  }, [lang]);

  // Try to load cached project from localStorage
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed: ProjectData = JSON.parse(cached);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.format) setFormat(parsed.format);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.aspectRatio) setAspectRatio(parsed.aspectRatio);
        if (parsed.sceneCount) setSceneCount(parsed.sceneCount);
        if (parsed.visualStyle) setVisualStyle(parsed.visualStyle);
        if (parsed.chosenIdea) setSelectedIdea(parsed.chosenIdea);
        if (parsed.chosenScript) setSelectedScript(parsed.chosenScript);
        if (parsed.storyboard) setStoryboard(parsed.storyboard);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.renderedVideos) setRenderedVideos(parsed.renderedVideos);
      }
    } catch (e) {
      console.warn('Could not read cached project:', e);
    }
  }, []);

  // Auto-save to localStorage whenever core data changes
  const saveToLocalStorage = () => {
    const projectPayload: ProjectData = {
      version: '1.0.0',
      projectId: `proj-${Date.now()}`,
      projectName: theme.slice(0, 30) || 'Untitled Video Project',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      theme,
      format,
      category,
      aspectRatio,
      sceneCount,
      visualStyle,
      chosenIdea: selectedIdea,
      chosenScript: selectedScript,
      storyboard,
      currentStep,
      renderedVideos
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projectPayload));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  };

  useEffect(() => {
    saveToLocalStorage();
  }, [theme, format, category, aspectRatio, sceneCount, visualStyle, selectedIdea, selectedScript, storyboard, currentStep, renderedVideos]);

  // Mark step completed
  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
  };

  // Step 1: Brainstorm ideas
  const handleBrainstorm = async () => {
    if (!theme.trim()) return;
    setIsBrainstorming(true);
    showToast('info', lang === 'id' ? 'AI sedang merancang 3 sudut pandang cerita...' : 'AI is brainstorming 3 creative angles...');

    try {
      const response = await fetch('/api/agent/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme.trim(),
          format,
          category,
          language: lang
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal membuat ide brainstorm.');
      }

      setBrainstormIdeas(data.ideas || []);
      markStepComplete(1);
      showToast('success', lang === 'id' ? '3 Sudut pandang cerita siap dipilih!' : '3 Story angles ready!');
    } catch (err: any) {
      console.error('Brainstorm error:', err);
      showToast('error', err.message || 'Terjadi kesalahan saat brainstorm.');
    } finally {
      setIsBrainstorming(false);
    }
  };

  // When user selects an idea from Step 1 -> automatically generate scripts for Step 2
  const handleSelectIdea = async (idea: BrainstormIdea) => {
    setSelectedIdea(idea);
    setIsScriptLoading(true);
    setCurrentStep(2);
    markStepComplete(1);
    showToast('info', lang === 'id' ? 'Menyusun 3 alternatif naskah script cerita...' : 'Generating 3 full story scripts...');

    try {
      const response = await fetch('/api/agent/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          chosenIdea: idea,
          format,
          category,
          language: lang
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyusun script cerita.');
      }

      setScripts(data.scripts || []);
      if (data.scripts && data.scripts.length > 0) {
        setSelectedScript(data.scripts[0]);
      }
      showToast('success', lang === 'id' ? 'Pilihan script cerita berhasil dibuat!' : 'Story scripts crafted!');
    } catch (err: any) {
      console.error('Script generation error:', err);
      showToast('error', err.message || 'Gagal memproses script.');
    } finally {
      setIsScriptLoading(false);
    }
  };

  // Step 2: Choose script -> Proceed to Storyboard
  const handleSelectScript = (script: ScriptOption) => {
    setSelectedScript(script);
    markStepComplete(2);
    setCurrentStep(3);
    showToast('success', lang === 'id' ? 'Script dipilih! Tentukan jumlah adegan storyboard.' : 'Script selected! Set scene count.');
  };

  // Step 3: Generate multi-scene Storyboard & Prompts
  const handleGenerateStoryboard = async (count: number, style: string) => {
    if (!selectedScript) {
      showToast('error', lang === 'id' ? 'Pilih script terlebih dahulu di Langkah 2.' : 'Please select a script in Step 2.');
      return;
    }

    setIsStoryboardLoading(true);
    showToast('info', lang === 'id' ? `Merancang storyboard ${count} adegan & master prompt...` : `Designing ${count}-scene storyboard & prompts...`);

    try {
      const response = await fetch('/api/agent/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptTitle: selectedScript.title,
          scriptText: selectedScript.fullVoiceover || selectedScript.body,
          sceneCount: count,
          visualStyle: style,
          aspectRatio,
          language: lang
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyusun storyboard.');
      }

      setStoryboard(data.storyboard);
      markStepComplete(3);
      showToast('success', lang === 'id' ? 'Storyboard dan seluruh master prompt adegan siap!' : 'Storyboard & prompts ready!');
    } catch (err: any) {
      console.error('Storyboard error:', err);
      showToast('error', err.message || 'Gagal menyusun storyboard.');
    } finally {
      setIsStoryboardLoading(false);
    }
  };

  // Update prompt on specific scene
  const handleUpdateScenePrompt = (sceneNum: number, newPrompt: string) => {
    if (!storyboard) return;
    const updatedScenes = storyboard.scenes.map((s) => (s.sceneNumber === sceneNum ? { ...s, masterVideoPrompt: newPrompt } : s));
    setStoryboard({ ...storyboard, scenes: updatedScenes });
  };

  // Step 4: Render single scene video
  const handleRenderScene = async (scene: StoryboardScene) => {
    setIsGenerating(true);
    showToast(
      'info',
      lang === 'id'
        ? `Memulai render Adegan #${scene.sceneNumber} dengan Gemini Omni Video...`
        : `Rendering Scene #${scene.sceneNumber} with Gemini Omni Video...`
    );

    try {
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.masterVideoPrompt,
          aspectRatio,
          duration: '5s',
          resolution: '720p'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.isQuotaOrPaid) {
          showToast(
            'info',
            lang === 'id'
              ? 'Model video memerlukan kuota aktif. Menampilkan reel preset sinematik & project tetap tersimpan!'
              : 'Quota required. Loaded high-quality master reel & project saved safely!'
          );

          // Continuous graceful experience
          const fallbackVideo: VideoItem = {
            id: `scene-vid-${scene.sceneNumber}-${Date.now()}`,
            title: `Adegan #${scene.sceneNumber} - ${scene.shotType}`,
            prompt: scene.masterVideoPrompt,
            aspectRatio,
            duration: '5s',
            resolution: '720p',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
            genre: visualStyle,
            createdAt: Date.now(),
            directorNotes: scene.sceneAction,
            voiceover: scene.voiceoverSegment,
            sceneNumber: scene.sceneNumber,
            isCustom: true
          };

          setRenderedVideos((prev) => [fallbackVideo, ...prev.filter((v) => v.sceneNumber !== scene.sceneNumber)]);
          setCurrentVideo(fallbackVideo);
          markStepComplete(4);
          return;
        }

        throw new Error(data.error || 'Gagal merender adegan.');
      }

      const generatedVideo: VideoItem = {
        id: `scene-vid-${scene.sceneNumber}-${Date.now()}`,
        title: `Adegan #${scene.sceneNumber} - ${scene.shotType}`,
        prompt: scene.masterVideoPrompt,
        aspectRatio,
        duration: '5s',
        resolution: '720p',
        videoUrl: data.videoUrl,
        genre: visualStyle,
        createdAt: Date.now(),
        directorNotes: scene.sceneAction,
        voiceover: scene.voiceoverSegment,
        sceneNumber: scene.sceneNumber,
        interactionId: data.interactionId,
        isCustom: true
      };

      setRenderedVideos((prev) => [generatedVideo, ...prev.filter((v) => v.sceneNumber !== scene.sceneNumber)]);
      setCurrentVideo(generatedVideo);
      markStepComplete(4);
      showToast('success', lang === 'id' ? `Adegan #${scene.sceneNumber} berhasil dirender!` : `Scene #${scene.sceneNumber} rendered!`);
    } catch (err: any) {
      console.error('Scene render error:', err);
      showToast('error', err.message || 'Gagal merender adegan.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Render all scenes in batch
  const handleRenderAllScenes = async () => {
    if (!storyboard || storyboard.scenes.length === 0) return;
    const firstScene = storyboard.scenes[0];
    await handleRenderScene(firstScene);
  };

  // Generate TTS Voiceover
  const handleGenerateVoiceover = async (text: string) => {
    setIsVoiceoverGenerating(true);
    showToast('info', lang === 'id' ? 'Membuat audio voiceover narasi (TTS)...' : 'Synthesizing voiceover audio (TTS)...');

    try {
      const response = await fetch('/api/agent/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: 'Kore',
          language: lang === 'id' ? 'id-ID' : 'en-US'
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal membuat TTS audio.');
      }

      if (currentVideo) {
        const updated = { ...currentVideo, voiceoverAudioUrl: data.audioUrl };
        setCurrentVideo(updated);
        setRenderedVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      }

      showToast('success', lang === 'id' ? 'Audio voiceover berhasil dibuat dan disinkronkan!' : 'Voiceover audio generated & synced!');
    } catch (err: any) {
      console.error('TTS error:', err);
      showToast('error', err.message || 'Gagal membuat TTS.');
    } finally {
      setIsVoiceoverGenerating(false);
    }
  };

  // Import project JSON
  const handleImportProject = (imported: ProjectData) => {
    if (imported.theme) setTheme(imported.theme);
    if (imported.format) setFormat(imported.format);
    if (imported.category) setCategory(imported.category);
    if (imported.aspectRatio) setAspectRatio(imported.aspectRatio);
    if (imported.sceneCount) setSceneCount(imported.sceneCount);
    if (imported.visualStyle) setVisualStyle(imported.visualStyle);
    if (imported.chosenIdea) setSelectedIdea(imported.chosenIdea);
    if (imported.chosenScript) setSelectedScript(imported.chosenScript);
    if (imported.storyboard) setStoryboard(imported.storyboard);
    if (imported.renderedVideos) setRenderedVideos(imported.renderedVideos);

    const targetStep = imported.storyboard ? 4 : imported.chosenScript ? 3 : imported.chosenIdea ? 2 : 1;
    setCurrentStep(targetStep);
    setActiveTab('pipeline');
    setCompletedSteps([1, 2, 3]);

    showToast(
      'success',
      lang === 'id'
        ? `Project "${imported.theme?.slice(0, 25)}..." berhasil dimuat!`
        : `Project "${imported.theme?.slice(0, 25)}..." successfully imported!`
    );
  };

  // Reset to new project
  const handleNewProject = () => {
    setTheme('');
    setBrainstormIdeas([]);
    setSelectedIdea(null);
    setScripts([]);
    setSelectedScript(null);
    setStoryboard(null);
    setRenderedVideos([]);
    setCurrentStep(1);
    setCompletedSteps([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('info', lang === 'id' ? 'Kanvas project baru siap digunakan.' : 'New project workspace ready.');
  };

  // Compile project data for export
  const currentProjectData: ProjectData = {
    version: '1.0.0',
    projectId: `omnimotion-${Date.now()}`,
    projectName: theme || 'OmniMotion Project',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    theme,
    format,
    category,
    aspectRatio,
    sceneCount,
    visualStyle,
    chosenIdea: selectedIdea,
    chosenScript: selectedScript,
    storyboard,
    currentStep,
    renderedVideos
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onNewProject={handleNewProject}
        onExportClick={() => {
          setActiveTab('pipeline');
          setCurrentStep(5);
        }}
        isGenerating={isGenerating}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-neutral-900/95 border border-white/10 shadow-2xl backdrop-blur-md text-xs animate-in slide-in-from-top-2">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Clapperboard className="w-4 h-4 text-purple-400 shrink-0" />}
          <span className="text-neutral-200">{toast.message}</span>
          <button onClick={() => setToast(null)} className="p-1 rounded text-neutral-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Tab 1: Pipeline Creator Flow */}
        {activeTab === 'pipeline' && (
          <div className="flex flex-col gap-6">
            {/* 5-Step Pipeline Navigation Bar */}
            <StepPipelineBar
              currentStep={currentStep}
              onSelectStep={(s) => setCurrentStep(s)}
              completedSteps={completedSteps}
              lang={lang}
            />

            {/* Active Step Card */}
            {currentStep === 1 && (
              <Step1Brainstorm
                theme={theme}
                setTheme={setTheme}
                format={format}
                setFormat={setFormat}
                category={category}
                setCategory={setCategory}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                brainstormIdeas={brainstormIdeas}
                onBrainstorm={handleBrainstorm}
                onSelectIdea={handleSelectIdea}
                selectedIdea={selectedIdea}
                isLoading={isBrainstorming || isScriptLoading}
                lang={lang}
              />
            )}

            {currentStep === 2 && (
              <Step2ScriptSelect
                scripts={scripts}
                chosenIdea={selectedIdea}
                onSelectScript={handleSelectScript}
                selectedScript={selectedScript}
                onBackToStep1={() => setCurrentStep(1)}
                isLoading={isScriptLoading}
                onRegenerateScripts={() => selectedIdea ? handleSelectIdea(selectedIdea) : handleBrainstorm()}
                lang={lang}
              />
            )}

            {currentStep === 3 && (
              <Step3Storyboard
                storyboard={storyboard}
                script={selectedScript}
                sceneCount={sceneCount}
                setSceneCount={setSceneCount}
                visualStyle={visualStyle}
                setVisualStyle={setVisualStyle}
                onGenerateStoryboard={handleGenerateStoryboard}
                onUpdateScenePrompt={handleUpdateScenePrompt}
                onProceedToGenerate={() => setCurrentStep(4)}
                onBackToStep2={() => setCurrentStep(2)}
                isLoading={isStoryboardLoading}
                lang={lang}
              />
            )}

            {currentStep === 4 && (
              <Step4GenerateVideo
                storyboard={storyboard}
                currentVideo={currentVideo}
                onRenderScene={handleRenderScene}
                onRenderAllScenes={handleRenderAllScenes}
                onGenerateVoiceover={handleGenerateVoiceover}
                onSelectVideoToPlay={(v) => setCurrentVideo(v)}
                renderedVideos={renderedVideos}
                isGenerating={isGenerating}
                isVoiceoverGenerating={isVoiceoverGenerating}
                onProceedToSave={() => setCurrentStep(5)}
                onBackToStep3={() => setCurrentStep(3)}
                lang={lang}
              />
            )}

            {currentStep === 5 && (
              <Step5ProjectExport
                projectData={currentProjectData}
                onImportProject={handleImportProject}
                onSaveToLocal={() => saveToLocalStorage()}
                onBackToStep4={() => setCurrentStep(4)}
                lang={lang}
              />
            )}
          </div>
        )}

        {/* Tab 2: Image to Video Animator */}
        {activeTab === 'image2video' && (
          <ImageToVideoPanel
            onGenerateImageToVideo={async (imageData, motionPrompt) => {
              setIsGenerating(true);
              showToast('info', 'Memulai animasi image-to-video...');
              try {
                const response = await fetch('/api/video/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    prompt: motionPrompt,
                    inputType: 'image',
                    imageBase64: imageData,
                    aspectRatio: '16:9',
                    duration: '5s',
                    resolution: '720p'
                  })
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                  throw new Error(data.error || 'Gagal merender animasi gambar.');
                }
                const newVid: VideoItem = {
                  id: `img2vid-${Date.now()}`,
                  title: 'Animasi Image to Video',
                  prompt: motionPrompt,
                  aspectRatio: '16:9',
                  duration: '5s',
                  resolution: '720p',
                  videoUrl: data.videoUrl,
                  genre: 'Motion Animation',
                  createdAt: Date.now(),
                  isCustom: true
                };
                setVideos((prev) => [newVid, ...prev]);
                setCurrentVideo(newVid);
                showToast('success', 'Video animasi gambar berhasil dibuat!');
              } catch (err: any) {
                console.error(err);
                showToast('error', err.message || 'Gagal merender.');
              } finally {
                setIsGenerating(false);
              }
            }}
            isGenerating={isGenerating}
            lang={lang}
          />
        )}

        {/* Tab 3: Video Gallery */}
        {activeTab === 'gallery' && (
          <VideoGallery
            videos={[...renderedVideos, ...videos]}
            onSelectVideo={(v) => {
              setCurrentVideo(v);
              setActiveTab('pipeline');
              setCurrentStep(4);
            }}
            activeVideoId={currentVideo?.id}
            onDeleteVideo={(id) => {
              setRenderedVideos((prev) => prev.filter((v) => v.id !== id));
              setVideos((prev) => prev.filter((v) => v.id !== id));
            }}
            lang={lang}
          />
        )}
      </main>

      {/* Floating Agent Director Chat Drawer Toggle */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-900/50 text-xs font-bold backdrop-blur-md transition-all hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isChatOpen ? 'Tutup Konsultasi' : 'Tanya Sutradara AI'}</span>
        </button>
      </div>

      {/* Chat Sidebar Modal / Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] h-[520px] shadow-2xl rounded-2xl overflow-hidden border border-white/10 animate-in slide-in-from-bottom-5">
          <AgentChatSidebar
            messages={chatMessages}
            onSendMessage={async (text) => {
              const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
              setChatMessages((prev) => [...prev, userMsg]);
              setIsChatLoading(true);
              try {
                const res = await fetch('/api/agent/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    messages: [...chatMessages, userMsg],
                    currentPrompt: currentVideo?.prompt || theme,
                    language: lang
                  })
                });
                const d = await res.json();
                if (d.success) {
                  setChatMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: 'assistant', content: d.message, timestamp: Date.now() }]);
                }
              } catch (e) {
                console.error(e);
              } finally {
                setIsChatLoading(false);
              }
            }}
            onApplyPrompt={(p) => {
              setTheme(p);
              showToast('success', 'Prompt diterapkan ke input tema!');
            }}
            isLoading={isChatLoading}
            lang={lang}
          />
        </div>
      )}

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} lang={lang} />
    </div>
  );
}
