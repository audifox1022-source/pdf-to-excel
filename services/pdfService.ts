import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFOptions } from '../types';

/**
 * Captures a DOM element and saves it as a PDF.
 * This approach is used to ensure Korean fonts are rendered correctly 
 * (WYSIWYG) without needing to embed heavy font files in the JS bundle.
 */
export const downloadPDF = async (elementId: string, fileName: string, options: PDFOptions) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    // Wait for images or layouts to stabilize
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // If "Summary Only" is selected, hide the table section
        if (options.content === 'summary') {
          const tableSection = clonedDoc.querySelector('.pdf-table-section');
          if (tableSection instanceof HTMLElement) {
            tableSection.style.display = 'none';
          }
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Determine orientation settings
    const isLandscape = options.orientation === 'landscape';
    const orientation = isLandscape ? 'l' : 'p';
    
    // A4 dimensions in mm
    // Portrait: 210 x 297
    // Landscape: 297 x 210
    const pdfWidth = isLandscape ? 297 : 210;
    const pdfHeight = isLandscape ? 210 : 297;
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF(orientation, 'mm', 'a4');
    
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Additional pages if the content is long
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("PDF Generation failed", error);
    alert("PDF 생성 중 오류가 발생했습니다.");
  }
};