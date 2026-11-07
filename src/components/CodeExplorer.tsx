import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  CheckCircle2,
  FolderTree,
  Filter,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { PROJECT_FILES, ProjectFile } from '../data/projectFiles';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const filteredFiles = PROJECT_FILES.filter((file) => {
    if (filterCategory === 'all') return true;
    return file.category === filterCategory;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'tauri': return 'Tauri 2';
      case 'rust': return 'Rust Crate';
      case 'android': return 'Android Kotlin';
      case 'gradle': return 'Gradle & Manifest';
      case 'ci': return 'CI/CD & Scripts';
      default: return cat;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-sky-400" />
            <span>مرورگر فایل‌های سورس پروژه Tauri 2 و اندروید</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            بررسی و کپی مستقیم کدهای منبع، ساختار Gradle، تنظیمات وب‌ویو و مانیفست
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'tauri', 'rust', 'android', 'gradle', 'ci'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'همه فایل‌ها' : getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body: File List + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: File List (4 cols) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-l border-slate-800 bg-slate-950/60 p-3 space-y-1 overflow-y-auto max-h-[580px]">
          {filteredFiles.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-right p-2.5 rounded-xl transition-all flex items-start gap-2.5 text-xs ${
                  isSelected
                    ? 'bg-sky-500/15 border border-sky-500/30 text-white'
                    : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                <div className="flex-1 truncate">
                  <div className="font-semibold truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{file.path}</div>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono shrink-0">
                  {file.language}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Code Viewer & Description (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950">
          {/* File Title Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-400">
                  {selectedFile.path}
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                  {getCategoryLabel(selectedFile.category)}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {selectedFile.description}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>کپی کد</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code View with Line Numbers (Forced LTR for programming code) */}
          <div className="flex-1 p-4 overflow-auto max-h-[500px] font-mono text-xs text-slate-300 leading-relaxed bg-[#0b101b] text-left" dir="ltr">
            <pre className="whitespace-pre font-mono">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
