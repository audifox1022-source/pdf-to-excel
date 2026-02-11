import React, { useState } from 'react';
import { X, FileText, Layout, Columns } from 'lucide-react';
import { PDFOptions } from '../types';

interface DownloadModalProps {
  isOpen: boolean;
  fileName: string;
  onClose: () => void;
  onConfirm: (options: PDFOptions) => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ 
  isOpen, 
  fileName, 
  onClose, 
  onConfirm 
}) => {
  const [content, setContent] = useState<'full' | 'summary'>('full');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">PDF 다운로드 설정</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-1">
             <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">파일 이름</span>
             <p className="font-medium text-slate-800 truncate">{fileName}</p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* Content Selection */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText size={16} /> 포함할 내용
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setContent('full')}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                    ${content === 'full' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                      : 'border-slate-200 hover:border-indigo-200 text-slate-600'
                    }
                  `}
                >
                  <span className="font-semibold text-sm">전체 데이터</span>
                  <span className="text-[10px] opacity-70 mt-1">요약 + 데이터 테이블</span>
                </button>
                
                <button
                  onClick={() => setContent('summary')}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                    ${content === 'summary' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                      : 'border-slate-200 hover:border-indigo-200 text-slate-600'
                    }
                  `}
                >
                  <span className="font-semibold text-sm">요약만</span>
                  <span className="text-[10px] opacity-70 mt-1">AI 요약 리포트만</span>
                </button>
              </div>
            </div>

            {/* Orientation Selection */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Layout size={16} /> 페이지 방향
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOrientation('portrait')}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                    ${orientation === 'portrait' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                      : 'border-slate-200 hover:border-indigo-200 text-slate-600'
                    }
                  `}
                >
                  <div className="w-6 h-8 border-2 border-current rounded-sm mb-2 opacity-50"></div>
                  <span className="font-semibold text-sm">세로 (Portrait)</span>
                </button>
                
                <button
                  onClick={() => setOrientation('landscape')}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                    ${orientation === 'landscape' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                      : 'border-slate-200 hover:border-indigo-200 text-slate-600'
                    }
                  `}
                >
                  <div className="w-8 h-6 border-2 border-current rounded-sm mb-2 opacity-50"></div>
                  <span className="font-semibold text-sm">가로 (Landscape)</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            취소
          </button>
          <button 
            onClick={() => onConfirm({ content, orientation })}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            다운로드
          </button>
        </div>

      </div>
    </div>
  );
};

export default DownloadModal;