export interface ParsedSheet {
  sheetName: string;
  data: any[][]; // Array of arrays (rows)
  headers: string[];
}

export interface UploadedFile {
  id: string;
  file: File;
  parsedSheets: ParsedSheet[];
  summary?: string;
  error?: string; // Error message if analysis fails
  isAnalyzing: boolean;
  isExpanded: boolean;
  uploadDate: Date;
}

export interface AIAnalysisConfig {
  model: string;
  temperature: number;
}

export type PDFOrientation = 'portrait' | 'landscape';
export type PDFContent = 'full' | 'summary';

export interface PDFOptions {
  orientation: PDFOrientation;
  content: PDFContent;
}