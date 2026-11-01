import React, { useState } from 'react';
import { FileText, Sparkles, Check, ArrowRight, ArrowLeft, Edit3, Volume2, Clock } from 'lucide-react';
import { ScriptOption, BrainstormIdea } from '../types';

interface Step2ScriptSelectProps {
  scripts: ScriptOption[];
  chosenIdea: BrainstormIdea | null;
  onSelectScript: (script: ScriptOption) => void;
  selectedScript: ScriptOption | null;
  onBackToStep1: () => void;
  isLoading: boolean;
  onRegenerateScripts: () => Promise<void>;
  lang: 'id' | 'en';
}

export const Step2ScriptSelect: React.FC<Step2ScriptSelectProps> = ({
  scripts,
  chosenIdea,
  onSelectScript,
  selectedScript,
  onBackToStep1,
  isLoading,
  onRegenerateScripts,
  lang
}) => {
  const isId = lang === 'id';
  const [editingScriptId, setEditingScriptId] = useState<string | null>(null);
  const [editedVoiceovers, setEditedVoiceovers] = useState<Record<string, string>>({});

  const handleEditChange = (scriptId: string, val: string) => {
    setEditedVoiceovers((prev) => ({ ...prev, [scriptId]: val }));
  };

  const handleConfirmSelect = (script: ScriptOption) => {
    const customizedScript = {
      ...script,
      fullVoiceover: editedVoiceovers[script.id] || script.fullVoiceover
    };
    onSelectScript(customizedScript);
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6 bg-neutral-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              {isId ? 'Langkah 2: Pilih Naskah Script Cerita' : 'Step 2: Choose Story Script'}
            </h2>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'AI telah menyusun 3 alternatif script lengkap. Pilih script terbaik atau sesuaikan teksnya.'
                : 'AI has drafted 3 script variations. Select the best version or customize the voiceover.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStep1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors border border-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isId ? 'Ubah Ide (Kembali)' : 'Back to Ideas'}</span>
          </button>

          <button
            onClick={onRegenerateScripts}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isId ? 'Buat Script Baru' : 'Re-generate'}</span>
          </button>
        </div>
      </div>

      {/* Chosen Concept Reminder */}
      {chosenIdea && (
        <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-white/5 flex items-start justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-purple-400 font-semibold block mb-0.5">
              {isId ? 'Konsep Terpilih:' : 'Selected Concept:'}
            </span>
            <div className="font-semibold text-white">{chosenIdea.title}</div>
            <div className="text-neutral-400 text-[11px] mt-0.5">{chosenIdea.angleDescription}</div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 shrink-0">
            {chosenIdea.recommendedStyle}
          </span>
        </div>
      )}

      {/* Scripts Options List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {scripts.map((script, idx) => {
          const isSelected = selectedScript?.id === script.id;
          const isEditing = editingScriptId === script.id;
          const activeVoiceover = editedVoiceovers[script.id] || script.fullVoiceover;
          const estimatedSeconds = Math.round((script.estimatedWordCount || 75) / 2.5);

          return (
            <div
              key={script.id || idx}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/40 shadow-xl'
                  : 'border-white/10 bg-neutral-950/60 hover:border-purple-500/30'
              }`}
            >
              <div>
                {/* Script Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    Opsi 0{idx + 1}: {script.toneLabel}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{estimatedSeconds}s
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-white mb-2 leading-tight">
                  {script.title}
                </h3>

                {/* Hook Box */}
                <div className="p-2.5 rounded-lg bg-pink-950/20 border border-pink-500/20 text-[11px] text-pink-200 mb-3">
                  <span className="font-semibold block text-pink-300 text-[10px] uppercase font-mono mb-0.5">
                    🎯 Hook Pembuka:
                  </span>
                  "{script.hook}"
                </div>

                {/* Script Body */}
                <div className="text-xs text-neutral-300 space-y-2 mb-3 leading-relaxed">
                  <p className="line-clamp-4">{script.body}</p>
                </div>

                {/* Call To Action */}
                <div className="p-2 rounded-lg bg-neutral-900 border border-white/5 text-[11px] text-neutral-400 mb-3">
                  <span className="font-semibold text-neutral-300 block text-[10px] uppercase font-mono mb-0.5">
                    📢 Penutup / Pesan:
                  </span>
                  "{script.callToAction}"
                </div>

                {/* Voiceover Text Area (Editable) */}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <span className="font-semibold text-neutral-300 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                      {isId ? 'Naskah Narasi Lengkap:' : 'Full Narration Script:'}
                    </span>
                    <button
                      onClick={() => setEditingScriptId(isEditing ? null : script.id)}
                      className="text-purple-400 hover:text-purple-300 text-[10px] flex items-center gap-0.5"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditing ? (isId ? 'Selesai Edit' : 'Done') : (isId ? 'Edit Teks' : 'Edit')}</span>
                    </button>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={activeVoiceover}
                      onChange={(e) => handleEditChange(script.id, e.target.value)}
                      rows={4}
                      className="w-full p-2 text-xs font-mono bg-neutral-900 border border-purple-500/50 rounded-lg text-purple-200 focus:outline-none resize-none"
                    />
                  ) : (
                    <p className="text-[11px] text-neutral-400 line-clamp-3 italic bg-neutral-900/50 p-2 rounded-lg">
                      "{activeVoiceover}"
                    </p>
                  )}
                </div>
              </div>

              {/* Select Button */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleConfirmSelect(script)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'bg-neutral-800 hover:bg-purple-600 text-neutral-200 hover:text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {isSelected
                      ? (isId ? 'Script Terpilih • Lanjut ke Storyboard' : 'Script Selected • Continue')
                      : (isId ? 'Pilih Script Ini & Lanjut' : 'Select Script & Continue')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
