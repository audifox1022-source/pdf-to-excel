import React from 'react';
import { UploadedFile } from '../types';
import { 
  FileSpreadsheet, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Download, 
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface FileItemProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onAnalyze: (id: string) => void;
  onDownload: (fileId: string, fileName: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ 
  file, 
  onRemove, 
  onToggleExpand, 
  onAnalyze,
  onDownload 
}) => {
  return (
    <div className={`
      border rounded-xl transition-all duration-300 overflow-hidden
      ${file.isExpanded ? 'border-indigo-200 shadow-md bg-white' : 'border-slate-200 bg-white hover:border-indigo-300'}
      ${file.error ? 'border-red-200 bg-red-50/10' : ''}
    `}>
      {/* File Header Bar */}
      <div className="flex items-center justify-between p-4">
        <div 
          className="flex items-center space-x-4 cursor-pointer flex-1"
          onClick={() => onToggleExpand(file.id)}
        >
          <div className={`
            p-2 rounded-lg
            ${file.error ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}
          `}>
            {file.error ? <AlertCircle size={24} /> : <FileSpreadsheet size={24} />}
          </div>
          <div>
            <h4 className="font-medium text-slate-800 truncate max-w-[200px] md:max-w-md">
              {file.file.name}
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span>{(file.file.size / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span>{file.parsedSheets.length} Sheets</span>
              </div>
              {file.error && (
                <span className="text-red-500 font-medium flex items-center mt-1 sm:mt-0">
                  <span className="hidden sm:inline mx-1">•</span>
                  {file.error}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Analyze Button */}
          {!file.summary && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze(file.id);
              }}
              disabled={file.isAnalyzing}
              className={`
                flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${file.isAnalyzing 
                  ? 'bg-indigo-50 text-indigo-400 cursor-not-allowed' 
                  : file.error 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }
              `}
            >
              {file.isAnalyzing ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span className="hidden sm:inline">분석 중...</span>
                </>
              ) : file.error ? (
                <>
                  <RefreshCw size={12} />
                  <span>재시도</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  <span>AI 요약</span>
                </>
              )}
            </button>
          )}

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(file.id, file.file.name.replace(/\.[^/.]+$/, ""));
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Download size={12} />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(file.id);
            }}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(file.id);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {file.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileItem;