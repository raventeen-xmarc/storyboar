import React from 'react';
import { Lightbulb, FileText, Clapperboard, Video, Save, Check } from 'lucide-react';

interface StepPipelineBarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  completedSteps: number[];
  lang: 'id' | 'en';
}

export const StepPipelineBar: React.FC<StepPipelineBarProps> = ({
  currentStep,
  onSelectStep,
  completedSteps,
  lang
}) => {
  const isId = lang === 'id';

  const steps = [
    {
      step: 1,
      title: isId ? 'Brainstorm Ide' : 'Brainstorm Idea',
      sub: isId ? 'Tema & Format' : 'Theme & Format',
      icon: Lightbulb
    },
    {
      step: 2,
      title: isId ? 'Pilihan Script' : 'Script Selection',
      sub: isId ? '3 Opsi Cerita' : '3 Story Scripts',
      icon: FileText
    },
    {
      step: 3,
      title: isId ? 'Storyboard Adegan' : 'Scene Storyboard',
      sub: isId ? 'Pilih Jumlah & Prompt' : 'Scenes & Prompts',
      icon: Clapperboard
    },
    {
      step: 4,
      title: isId ? 'Generate Video' : 'Generate Video',
      sub: isId ? 'Render & Studio' : 'Render & Preview',
      icon: Video
    },
    {
      step: 5,
      title: isId ? 'Simpan / Ekspor' : 'Save / Export',
      sub: isId ? 'Cadangkan Project' : 'Backup & Import',
      icon: Save
    }
  ];

  return (
    <div className="w-full bg-neutral-900/80 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {steps.map((s, idx) => {
          const isActive = currentStep === s.step;
          const isDone = completedSteps.includes(s.step);
          const Icon = s.icon;

          return (
            <React.Fragment key={s.step}>
              <button
                onClick={() => onSelectStep(s.step)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                    : isDone
                    ? 'bg-neutral-800/90 text-purple-300 hover:bg-neutral-800 border border-purple-500/30'
                    : 'bg-neutral-950/40 text-neutral-400 hover:bg-neutral-800/40 border border-white/5'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isDone
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {isDone && !isActive ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="hidden md:block">
                  <div className="text-[10px] uppercase font-mono opacity-70 leading-none">
                    Langkah 0{s.step}
                  </div>
                  <div className="text-xs font-semibold leading-tight mt-0.5">
                    {s.title}
                  </div>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div className="hidden sm:block flex-1 h-[2px] bg-white/5 min-w-4 max-w-10" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
