import pdfParse from 'pdf-parse';

export class PDFExtractorService {
  async extractText(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      let text = data.text;

      // Clean up common PDF text extraction issues
      text = this.cleanExtractedText(text);

      // Validate that we got meaningful text
      if (text.trim().length < 50) {
        throw new Error('PDF appears to contain insufficient text content');
      }

      return text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private cleanExtractedText(text: string): string {
    // Remove excessive whitespace and normalize line breaks
    text = text.replace(/\r\n/g, '\n')
               .replace(/\r/g, '\n')
               .replace(/\n{3,}/g, '\n\n')
               .replace(/[ \t]{2,}/g, ' ');

    // Handle common script formatting issues
    text = this.fixCommonScriptFormats(text);

    return text.trim();
  }

  private fixCommonScriptFormats(text: string): string {
    // Handle character names that might be split across lines
    text = text.replace(/([A-Z][A-Z\s]+)\n+([A-Z][a-z])/g, '$1 $2');

    // Fix dialogue formatting where speaker and dialogue are on same line
    text = text.replace(/^([A-Z][A-Z\s]+):\s*(.+)$/gm, '$1\n$2');

    // Handle stage directions in parentheses or brackets
    text = text.replace(/\(\s*([^)]+)\s*\)/g, '($1)');
    text = text.replace(/\[\s*([^\]]+)\s*\]/g, '[$1]');

    return text;
  }

  async validateScriptFormat(text: string): Promise<{
    isValid: boolean;
    confidence: number;
    detectedFormat: string;
    issues: string[];
  }> {
    const issues: string[] = [];
    let confidence = 0;
    let detectedFormat = 'unknown';

    // Check for common script elements
    const hasCharacterNames = /^[A-Z][A-Z\s]+$/m.test(text);
    const hasDialogue = text.split('\n').filter(line =>
      line.trim() && !line.match(/^[A-Z][A-Z\s]+$/)
    ).length > 10;

    const hasStageDirections = /\([^)]+\)|\[[^\]]+\]/.test(text);

    if (hasCharacterNames) {
      confidence += 30;
      if (/INT\.|EXT\.|FADE IN|FADE OUT/i.test(text)) {
        detectedFormat = 'screenplay';
        confidence += 20;
      } else {
        detectedFormat = 'stage_play';
        confidence += 15;
      }
    } else {
      issues.push('No clear character names detected');
    }

    if (hasDialogue) {
      confidence += 25;
    } else {
      issues.push('Insufficient dialogue content detected');
    }

    if (hasStageDirections) {
      confidence += 15;
    }

    // Check for minimum content requirements
    if (text.length < 500) {
      issues.push('Script appears too short for meaningful practice');
      confidence -= 20;
    }

    // Check for language content
    const englishWords = (text.match(/\b(the|and|is|was|are|were|have|has|will|would|could|should)\b/gi) || []).length;
    const spanishWords = (text.match(/\b(el|la|los|las|es|son|de|en|con|por|para|que|pero|como)\b/gi) || []).length;

    if (englishWords + spanishWords < 5) {
      issues.push('Language detection may be difficult');
      confidence -= 10;
    }

    return {
      isValid: confidence >= 50 && issues.length < 3,
      confidence: Math.max(0, Math.min(100, confidence)),
      detectedFormat,
      issues
    };
  }
}

export const pdfExtractorService = new PDFExtractorService();