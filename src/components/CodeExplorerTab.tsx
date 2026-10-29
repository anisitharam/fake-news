import React, { useState } from 'react';
import { 
  FileCode, 
  FolderTree, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import { PROJECT_FILES, ProjectFile, downloadProjectZip } from '../data/projectFiles';

export const CodeExplorerTab: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadProjectZip();
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileIcon = (file: ProjectFile) => {
    if (file.name.endsWith('.py')) return <FileCode className="w-4 h-4 text-blue-500" />;
    if (file.name.endsWith('.html')) return <FileCode className="w-4 h-4 text-orange-500" />;
    if (file.name.endsWith('.css')) return <FileCode className="w-4 h-4 text-cyan-500" />;
    if (file.name.endsWith('.csv')) return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Download CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Project Source Code & Files</h1>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
              Ready for VS Code
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse the complete, production-ready Python Flask and Scikit-Learn source code, or download the full project archive.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all shadow-md shadow-indigo-100 cursor-pointer shrink-0 disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Packaging Files...' : 'Download Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Main File Explorer Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Sidebar: Folder Tree */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              <FolderTree className="w-4 h-4 text-slate-500" />
              <span>Project Directory</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-700 px-2.5 py-1 flex items-center gap-1.5">
                <span className="text-indigo-600">📁</span>
                <span className="font-mono">fake_news_detection/</span>
              </div>

              <div className="pl-4 space-y-1">
                {PROJECT_FILES.map((file) => {
                  const isSelected = selectedFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200/60'
                      }`}
                    >
                      {getFileIcon(file)}
                      <span className="truncate font-mono">{file.path}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 text-[11px] text-slate-400 space-y-1 px-2">
            <p className="font-semibold text-slate-600">Local Structure:</p>
            <p>Runs on Python 3.9+ with Flask 3.0 & Scikit-learn 1.4.</p>
          </div>
        </div>

        {/* Right Pane: Code Viewer */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col bg-slate-950 text-slate-100">
          {/* File Tab Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              {getFileIcon(selectedFile)}
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">
                {selectedFile.path}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                &bull; {selectedFile.description}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer Body */}
          <div className="p-5 flex-1 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 max-h-[600px] overflow-y-auto selection:bg-indigo-900 selection:text-white">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
