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
  isAnalyzing: boolean;
  isExpanded: boolean;
  uploadDate: Date;
}

export interface AIAnalysisConfig {
  model: string;
  temperature: number;
}