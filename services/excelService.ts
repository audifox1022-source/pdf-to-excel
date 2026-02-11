import * as XLSX from 'xlsx';
import { ParsedSheet } from '../types';

export const parseExcelFile = async (file: File): Promise<ParsedSheet[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error("File is empty"));
          return;
        }

        const workbook = XLSX.read(data, { type: 'array' });
        const sheets: ParsedSheet[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          // Convert to JSON (array of arrays)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length > 0) {
            // Assume first row is headers if strings, otherwise generate Header 1, Header 2...
            const headers = jsonData[0].map((cell: any, index: number) => 
              typeof cell === 'string' ? cell : `Column ${index + 1}`
            );
            
            // Remove empty rows at the end
            const cleanData = jsonData.filter(row => row.length > 0);

            sheets.push({
              sheetName,
              data: cleanData, // Keep headers in data for display purposes
              headers
            });
          }
        });

        resolve(sheets);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};