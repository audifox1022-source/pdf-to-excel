import { GoogleGenAI } from "@google/genai";
import { ParsedSheet } from "../types";

// Initialize Gemini Client
// IMPORTANT: In a real production app, never expose API keys in frontend code.
// This is for demonstration based on the provided environment variable instructions.
const apiKey = process.env.API_KEY || ''; 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeExcelData = async (sheets: ParsedSheet[]): Promise<string> => {
  if (!ai) {
    throw new Error("API Key가 설정되지 않았습니다. .env 파일을 확인해주세요.");
  }

  try {
    // Prepare a sample of data to send to Gemini (avoid token limits)
    // We take the first 10 rows of the first sheet as a sample.
    const firstSheet = sheets[0];
    if (!firstSheet) throw new Error("데이터가 비어있습니다.");

    const sampleRows = firstSheet.data.slice(0, 15).map(row => row.join(", ")).join("\n");
    const headerStr = firstSheet.headers.join(", ");

    const prompt = `
      다음은 엑셀 파일의 데이터 샘플입니다.
      시트 이름: ${firstSheet.sheetName}
      헤더: ${headerStr}
      데이터 샘플 (처음 15행):
      ${sampleRows}

      이 데이터가 어떤 내용을 담고 있는지 3-4문장으로 전문적인 한국어 요약을 작성해주세요. 
      주요 트렌드나 눈에 띄는 숫자가 있다면 언급해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    if (!response.text) {
        throw new Error("AI 응답을 생성할 수 없습니다.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // Provide a cleaner error message for the UI
    throw new Error(error.message || "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};