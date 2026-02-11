import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FileUpload from './components/FileUpload';
import FileItem from './components/FileItem';
import DataPreview from './components/DataPreview';
import { parseExcelFile } from './services/excelService';
import { analyzeExcelData } from './services/geminiService';
import { downloadPDF } from './services/pdfService';
import { UploadedFile } from './types';
import { FileText, Sparkles, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    setGlobalLoading(true);
    const newUploadedFiles: UploadedFile[] = [];

    for (const file of selectedFiles) {
      try {
        const parsedSheets = await parseExcelFile(file);
        newUploadedFiles.push({
          id: uuidv4(),
          file,
          parsedSheets,
          isAnalyzing: false,
          isExpanded: false, // Don't expand automatically to keep list clean
          uploadDate: new Date(),
        });
      } catch (error) {
        console.error(`Failed to parse ${file.name}`, error);
        alert(`${file.name} 파일을 읽는 중 오류가 발생했습니다.`);
      }
    }

    setFiles(prev => [...prev, ...newUploadedFiles]);
    setGlobalLoading(false);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const toggleExpand = (id: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, isExpanded: !f.isExpanded } : f
    ));
  };

  const handleAnalyze = async (id: string) => {
    const fileIndex = files.findIndex(f => f.id === id);
    if (fileIndex === -1) return;

    // Set analyzing state
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, isAnalyzing: true } : f
    ));

    try {
      const summary = await analyzeExcelData(files[fileIndex].parsedSheets);
      
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, isAnalyzing: false, summary, isExpanded: true } : f
      ));
    } catch (error) {
      console.error(error);
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, isAnalyzing: false } : f
      ));
    }
  };

  const handleDownloadPDF = async (fileId: string, fileName: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // Ensure the file is expanded so the DataPreview element exists in the DOM
    if (!file.isExpanded) {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, isExpanded: true } : f
      ));
      // Small delay to allow React to render the DataPreview component
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    await downloadPDF(`preview-${fileId}`, fileName);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <FileText size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              ExcelToPDF AI
            </span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:flex items-center gap-1">
            <Sparkles size={14} className="text-amber-500" />
            <span>Powered by Gemini</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            엑셀 파일을 PDF로 스마트하게 변환
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            여러 개의 엑셀 파일을 한 번에 업로드하세요. Gemini AI가 데이터를 분석하여 요약을 추가하고 깔끔한 PDF로 변환해드립니다.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm p-1">
          <FileUpload onFilesSelected={handleFilesSelected} />
        </div>

        {/* Global Loader */}
        {globalLoading && (
           <div className="text-center py-4 text-indigo-600 font-medium animate-pulse">
             파일을 분석하고 변환할 준비를 하고 있습니다...
           </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                   <CheckCircle2 className="text-green-500" size={20} />
                   업로드된 파일 ({files.length})
                </h2>
                {files.length > 1 && (
                    <button 
                        onClick={() => setFiles([])}
                        className="text-sm text-slate-400 hover:text-red-500 transition-colors"
                    >
                        모두 지우기
                    </button>
                )}
             </div>

             <div className="grid gap-4">
                {files.map(file => (
                  <div key={file.id} className="flex flex-col gap-4">
                    <FileItem 
                      file={file} 
                      onRemove={removeFile}
                      onToggleExpand={toggleExpand}
                      onAnalyze={handleAnalyze}
                      onDownload={handleDownloadPDF}
                    />
                    
                    {/* Expandable Preview Area */}
                    {file.isExpanded && (
                      <div className="pl-0 md:pl-4 transition-all duration-500 ease-in-out">
                         <DataPreview 
                            file={file} 
                            previewId={`preview-${file.id}`}
                         />
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}

        {files.length === 0 && !globalLoading && (
           <div className="text-center py-10 opacity-50">
              <p className="text-slate-400">변환할 파일이 아직 없습니다.</p>
           </div>
        )}

      </main>
    </div>
  );
};

export default App;