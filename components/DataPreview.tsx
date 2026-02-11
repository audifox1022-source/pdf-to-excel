import React from 'react';
import { UploadedFile } from '../types';
import { Sparkles, FileText } from 'lucide-react';

interface DataPreviewProps {
  file: UploadedFile;
  previewId: string; // ID used for HTML2Canvas
}

const DataPreview: React.FC<DataPreviewProps> = ({ file, previewId }) => {
  const sheet = file.parsedSheets[0]; // Currently showing first sheet for simplicity

  if (!sheet) return <div className="text-center p-4 text-slate-400">데이터가 없습니다.</div>;

  return (
    <div id={previewId} className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 min-w-full">
      {/* Header Section for PDF */}
      <div className="mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <FileText className="text-indigo-600" />
               {file.file.name}
            </h1>
            <span className="text-sm text-slate-400">
                {file.uploadDate.toLocaleDateString()}
            </span>
        </div>
        <p className="text-slate-500 mt-1 text-sm">
            Sheet: {sheet.sheetName} | Rows: {sheet.data.length}
        </p>
      </div>

      {/* Gemini AI Summary Section */}
      {file.summary && (
        <div className="mb-8 bg-indigo-50 rounded-lg p-5 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3 text-indigo-700 font-semibold">
            <Sparkles size={18} />
            <h3>Gemini AI 스마트 요약</h3>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {file.summary}
          </p>
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-x-auto pdf-table-section">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              {sheet.data[0]?.map((header: any, index: number) => (
                <th key={index} scope="col" className="px-4 py-3 font-medium border-b border-slate-200">
                  {header || `-`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Show first 50 rows only for preview performance, unless printing behavior overrides CSS */}
            {sheet.data.slice(1, 51).map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white border-b hover:bg-slate-50">
                {row.map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} className="px-4 py-3 border-slate-100 border-b">
                    {cell !== null && cell !== undefined ? String(cell) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {sheet.data.length > 50 && (
          <div className="text-center py-4 text-xs text-slate-400 italic">
            ... (총 {sheet.data.length}행 중 50행만 미리보기에 표시됩니다. 전체 데이터는 원본 파일을 확인하세요) ...
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPreview;