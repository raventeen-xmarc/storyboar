import React, { useState, useRef } from 'react';
import { Save, Download, Upload, FileJson, Check, Copy, ArrowLeft, RefreshCw, FolderDown, ShieldCheck, Sparkles, Film } from 'lucide-react';
import { ProjectData } from '../types';

interface Step5ProjectExportProps {
  projectData: ProjectData;
  onImportProject: (imported: ProjectData) => void;
  onSaveToLocal: () => void;
  onBackToStep4: () => void;
  lang: 'id' | 'en';
}

export const Step5ProjectExport: React.FC<Step5ProjectExportProps> = ({
  projectData,
  onImportProject,
  onSaveToLocal,
  onBackToStep4,
  lang
}) => {
  const isId = lang === 'id';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [copiedAll, setCopiedAll] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Download project as JSON file
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projectData, null, 2));
    const safeName = (projectData.theme || 'project')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase()
      .slice(0, 30);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `OmniMotion-Project-${safeName}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON project file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.theme && !parsed.storyboard) {
          throw new Error('Format file bukan project OmniMotion yang valid.');
        }
        onImportProject(parsed);
      } catch (err: any) {
        console.error('Import error:', err);
        setImportError(err.message || 'Gagal membaca file JSON project.');
      }
    };
    reader.readAsText(file);
  };

  // Copy all storyboard prompts combined
  const handleCopyAllPrompts = () => {
    const scenes = projectData.storyboard?.scenes || [];
    if (scenes.length === 0) return;

    const fullText = scenes
      .map(
        (s) =>
          `=== SCENE ${s.sceneNumber}: ${s.shotType} ===\nCamera: ${s.cameraMotion}\nVoiceover: "${s.voiceoverSegment}"\nMaster Prompt: ${s.masterVideoPrompt}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleManualSave = () => {
    onSaveToLocal();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6 bg-neutral-900/60 rounded-2xl border border-white/10 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Save className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              {isId ? 'Langkah 5: Simpan & Cadangkan Project' : 'Step 5: Save & Backup Project'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Safe & Portable
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Simpan project jika credit/kuota belum cukup untuk digunakan kembali di lain waktu atau di akun lain'
                : 'Save project files if credit is low to resume anytime or across different accounts'}
            </p>
          </div>
        </div>

        <button
          onClick={onBackToStep4}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors border border-white/5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isId ? 'Kembali ke Studio' : 'Back to Studio'}</span>
        </button>
      </div>

      {/* Credit / Re-use Banner Notification */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-purple-200">
            {isId ? 'Solusi Fleksibel Saat Credit / Kuota Terbatas:' : 'Flexible Backup for Credit Optimization:'}
          </div>
          <p className="text-neutral-300 leading-relaxed">
            {isId
              ? 'Seluruh proses brainstorm, naskah script, dan master prompt tiap adegan storyboard telah dirancang lengkap. Anda dapat mengunduh file `.json` ini sekarang. Kapan pun credit video siap (atau saat beralih ke akun lain), cukup klik "Impor File Project" untuk melanjutkan render tanpa perlu merancang ulang dari awal!'
              : 'All brainstorm ideas, scripts, and multi-scene storyboard prompts are fully packaged. Download this .json file now and import it anytime on any account to render your videos!'}
          </p>
        </div>
      </div>

      {/* Primary Actions: Download File vs Import File */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export / Download File Box */}
        <div className="p-5 rounded-xl bg-neutral-950/70 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FolderDown className="w-5 h-5 text-purple-400" />
              <h3 className="font-display font-bold text-sm text-white">
                {isId ? '1. Unduh File Project (.json)' : '1. Export Project File (.json)'}
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              {isId
                ? 'Simpan seluruh naskah cerita, parameter kamera, dan prompt tiap adegan dalam format file ringan yang siap dibuka kembali kapan saja.'
                : 'Download all scripts, camera settings, and scene prompts in a lightweight file ready to resume.'}
            </p>

            <div className="p-2.5 rounded-lg bg-neutral-900 border border-white/5 text-[11px] font-mono text-neutral-400 space-y-1">
              <div>Tema: <b className="text-white">{projectData.theme || '-'}</b></div>
              <div>Format: <b className="text-purple-300">{projectData.format} ({projectData.aspectRatio})</b></div>
              <div>Adegan: <b className="text-cyan-300">{projectData.storyboard?.scenes.length || projectData.sceneCount} Shots</b></div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExportJson}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/30"
            >
              <Download className="w-4 h-4" />
              <span>{isId ? 'Unduh File Project (.json)' : 'Download Project File (.json)'}</span>
            </button>

            <button
              onClick={handleManualSave}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-colors border border-white/5"
            >
              <Check className={`w-3.5 h-3.5 ${saveSuccess ? 'text-emerald-400' : 'text-purple-400'}`} />
              <span>{saveSuccess ? (isId ? 'Tersimpan di Browser!' : 'Saved to Browser!') : (isId ? 'Simpan ke Browser (Auto-Save)' : 'Save to Browser Cache')}</span>
            </button>
          </div>
        </div>

        {/* Import File Box */}
        <div className="p-5 rounded-xl bg-neutral-950/70 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-bold text-sm text-white">
                {isId ? '2. Impor File Project (Buka Proyek Lain)' : '2. Import Project File (Resume Work)'}
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              {isId
                ? 'Punya file project yang pernah disimpan sebelumnya di perangkat atau akun lain? Unggah di sini untuk memuat seluruh storyboard secara instan.'
                : 'Have a project file saved earlier? Upload it here to immediately restore your entire storyboard and scenes.'}
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 hover:border-purple-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-900/40 hover:bg-neutral-900/80 group"
            >
              <FileJson className="w-8 h-8 text-neutral-500 group-hover:text-purple-400 mx-auto mb-2 transition-colors" />
              <div className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                {isId ? 'Klik untuk memilih file project .json' : 'Click to select project .json file'}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                {isId ? 'Atau seret dan lepas file ke sini' : 'Or drag and drop file here'}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {importError && (
              <p className="text-[11px] text-rose-400 mt-2 bg-rose-950/30 p-2 rounded-lg border border-rose-500/20">
                {importError}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all border border-white/10"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>{isId ? 'Pilih File dari Komputer / HP' : 'Select File from Device'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batch Prompts Copy & Overview */}
      {projectData.storyboard && projectData.storyboard.scenes.length > 0 && (
        <div className="p-4 rounded-xl bg-neutral-950/50 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono">
              📋 {isId ? 'Ringkasan Master Prompt Seluruh Adegan:' : 'Master Prompts Summary:'}
            </h4>

            <button
              onClick={handleCopyAllPrompts}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-purple-300 hover:text-white text-xs font-semibold transition-colors border border-white/5"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? (isId ? 'Semua Tersalin!' : 'All Copied!') : (isId ? 'Salin Semua Prompt' : 'Copy All Prompts')}</span>
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {projectData.storyboard.scenes.map((s) => (
              <div key={s.sceneNumber} className="p-2.5 rounded-lg bg-neutral-900/70 border border-white/5 text-[11px] font-mono">
                <span className="text-purple-400 font-bold block mb-0.5">
                  Shot #{s.sceneNumber} ({s.shotType}) - {s.cameraMotion}:
                </span>
                <p className="text-neutral-300 select-all leading-relaxed">{s.masterVideoPrompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
