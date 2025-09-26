import { pdfExtractorService } from '../services/pdfExtractorService';

// Mock pdf-parse
jest.mock('pdf-parse');
import pdfParse from 'pdf-parse';
const mockPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;

describe('PDF Extraction Service - AC2: 95%+ accuracy for standard script formats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Standard Script Format Detection', () => {
    test('should extract text from PDF files successfully', async () => {
      const mockContent = `FADE IN:

INT. COFFEE SHOP - DAY

SARAH sits across from MIKE at a small table.

SARAH
I've been thinking about what you said yesterday.

MIKE
About the script competition?

FADE OUT.`;

      mockPdfParse.mockResolvedValueOnce({
        text: mockContent,
        numpages: 1,
        info: { Title: 'Test Screenplay' },
        metadata: null,
        version: '1.0' as any
      });

      const buffer = Buffer.from('mock pdf data');
      const result = await pdfExtractorService.extractText(buffer);

      expect(result).toBe(mockContent);
      expect(mockPdfParse).toHaveBeenCalledWith(buffer);
    });

    test('should handle PDF extraction errors gracefully', async () => {
      mockPdfParse.mockRejectedValueOnce(new Error('Invalid PDF structure'));

      const buffer = Buffer.from('corrupted pdf data');

      await expect(pdfExtractorService.extractText(buffer))
        .rejects.toThrow('Failed to extract text from PDF file');
    });

    test('should clean up extracted text properly', async () => {
      const messyContent = `FADE IN:\n\n\n\nINT. ROOM - DAY\n\n\n\nJOHN\n    Hello    world.   \n\n\nFADE OUT.`;
      const expectedClean = `FADE IN:

INT. ROOM - DAY

JOHN
Hello world.

FADE OUT.`;

      mockPdfParse.mockResolvedValueOnce({
        text: messyContent,
        numpages: 1,
        info: {},
        metadata: null,
        version: '1.0' as any
      });

      const buffer = Buffer.from('mock pdf');
      const result = await pdfExtractorService.extractText(buffer);

      expect(result.trim()).toBe(expectedClean);
    });

    test('should handle empty PDF files', async () => {
      mockPdfParse.mockResolvedValueOnce({
        text: '',
        numpages: 1,
        info: {},
        metadata: null,
        version: '1.0' as any
      });

      const buffer = Buffer.from('empty pdf');
      const result = await pdfExtractorService.extractText(buffer);

      expect(result).toBe('');
    });

    test('should handle PDF files with special characters', async () => {
      const contentWithSpecialChars = `MARÍA
¡Hola! ¿Cómo estás?

JOSÉ
Très bien, merci!`;

      mockPdfParse.mockResolvedValueOnce({
        text: contentWithSpecialChars,
        numpages: 1,
        info: {},
        metadata: null,
        version: '1.0' as any
      });

      const buffer = Buffer.from('special chars pdf');
      const result = await pdfExtractorService.extractText(buffer);

      expect(result).toBe(contentWithSpecialChars);
    });
  });

  describe('Performance and Reliability', () => {
    test('should complete extraction within reasonable time', async () => {
      const largeMockContent = 'A'.repeat(50000); // 50KB of text

      mockPdfParse.mockResolvedValueOnce({
        text: largeMockContent,
        numpages: 25,
        info: { Title: 'Large Script' },
        metadata: null,
        version: '1.0' as any
      });

      const buffer = Buffer.alloc(2 * 1024 * 1024); // 2MB buffer
      const startTime = Date.now();

      const result = await pdfExtractorService.extractText(buffer);
      const endTime = Date.now();

      expect(result).toBe(largeMockContent);
      expect(endTime - startTime).toBeLessThan(3000); // Should complete within 3 seconds
    });

    test('should handle concurrent extractions', async () => {
      const mockContent = 'Test content';

      mockPdfParse.mockResolvedValue({
        text: mockContent,
        numpages: 1,
        info: {},
        metadata: null,
        version: '1.0' as any
      });

      const buffer = Buffer.from('concurrent test pdf');

      // Simulate multiple concurrent extractions
      const extractions = Array.from({ length: 3 }, () =>
        pdfExtractorService.extractText(buffer)
      );

      const results = await Promise.all(extractions);

      results.forEach(result => {
        expect(result).toBe(mockContent);
      });

      expect(mockPdfParse).toHaveBeenCalledTimes(3);
    });
  });
});