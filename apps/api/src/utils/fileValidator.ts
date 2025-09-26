import { Buffer } from 'buffer';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: string;
}

export class FileValidator {
  private static readonly PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46]; // %PDF
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly MIN_FILE_SIZE = 10; // 10 bytes minimum
  private static readonly ALLOWED_MIME_TYPES = ['text/plain', 'application/pdf'];

  /**
   * Validate file based on multiple security criteria
   */
  static validateFile(buffer: Buffer, originalName: string, mimeType: string): FileValidationResult {
    // Size validation
    if (buffer.length > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    if (buffer.length < this.MIN_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File is too small to be valid'
      };
    }

    // MIME type validation
    if (!this.ALLOWED_MIME_TYPES.includes(mimeType)) {
      return {
        isValid: false,
        error: 'Invalid file type. Only PDF and text files are supported.'
      };
    }

    // File extension validation
    const extensionValidation = this.validateFileExtension(originalName, mimeType);
    if (!extensionValidation.isValid) {
      return extensionValidation;
    }

    // Content-based validation
    const contentValidation = this.validateFileContent(buffer, mimeType);
    if (!contentValidation.isValid) {
      return contentValidation;
    }

    // Additional security checks
    const securityValidation = this.performSecurityChecks(buffer, originalName);
    if (!securityValidation.isValid) {
      return securityValidation;
    }

    return {
      isValid: true,
      detectedType: mimeType
    };
  }

  /**
   * Validate file extension matches MIME type
   */
  private static validateFileExtension(filename: string, mimeType: string): FileValidationResult {
    const extension = filename.toLowerCase().split('.').pop();

    const validExtensions = {
      'application/pdf': ['pdf'],
      'text/plain': ['txt', 'text']
    };

    const allowedExtensions = validExtensions[mimeType as keyof typeof validExtensions];

    if (!allowedExtensions || !extension || !allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File extension .${extension} does not match declared type ${mimeType}`
      };
    }

    return { isValid: true };
  }

  /**
   * Validate file content matches declared type
   */
  private static validateFileContent(buffer: Buffer, mimeType: string): FileValidationResult {
    if (mimeType === 'application/pdf') {
      return this.validatePdfContent(buffer);
    } else if (mimeType === 'text/plain') {
      return this.validateTextContent(buffer);
    }

    return {
      isValid: false,
      error: 'Unsupported file type for content validation'
    };
  }

  /**
   * Validate PDF file content
   */
  private static validatePdfContent(buffer: Buffer): FileValidationResult {
    // Check PDF magic bytes
    if (buffer.length < 4) {
      return {
        isValid: false,
        error: 'File too small to be a valid PDF'
      };
    }

    const header = buffer.subarray(0, 4);
    const isPdfMagic = this.PDF_MAGIC_BYTES.every((byte, index) => header[index] === byte);

    if (!isPdfMagic) {
      return {
        isValid: false,
        error: 'File does not appear to be a valid PDF'
      };
    }

    // Check for PDF trailer
    const trailerPattern = Buffer.from('%%EOF');
    const hasTrailer = buffer.includes(trailerPattern);

    if (!hasTrailer) {
      return {
        isValid: false,
        error: 'PDF file appears to be corrupted or incomplete'
      };
    }

    return { isValid: true };
  }

  /**
   * Validate text file content
   */
  private static validateTextContent(buffer: Buffer): FileValidationResult {
    try {
      // Try to decode as UTF-8
      const text = buffer.toString('utf-8');

      // Check for null bytes (binary content)
      if (text.includes('\0')) {
        return {
          isValid: false,
          error: 'Text file contains binary data'
        };
      }

      // Check for reasonable text content
      const printableCharCount = text.replace(/[\r\n\t\s]/g, '').length;
      const totalLength = text.length;

      if (totalLength > 0 && printableCharCount / totalLength < 0.1) {
        return {
          isValid: false,
          error: 'File does not appear to contain readable text'
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Unable to decode file as text'
      };
    }
  }

  /**
   * Perform additional security checks
   */
  private static performSecurityChecks(buffer: Buffer, filename: string): FileValidationResult {
    // Check for suspicious filename patterns
    const suspiciousPatterns = [
      /\.\./,           // Directory traversal
      /[<>:"|?*]/,      // Invalid filename characters
      /\.exe$/i,        // Executable files
      /\.scr$/i,        // Screen saver files
      /\.bat$/i,        // Batch files
      /\.cmd$/i,        // Command files
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(filename)) {
        return {
          isValid: false,
          error: 'Filename contains suspicious characters or patterns'
        };
      }
    }

    // Check for null bytes separately
    if (filename.includes('\0')) {
      return {
        isValid: false,
        error: 'Filename contains null bytes'
      };
    }

    // Check filename length
    if (filename.length > 255) {
      return {
        isValid: false,
        error: 'Filename is too long'
      };
    }

    // Check for embedded scripts in text content
    if (buffer.includes(Buffer.from('<script')) ||
        buffer.includes(Buffer.from('javascript:')) ||
        buffer.includes(Buffer.from('data:text/html'))) {
      return {
        isValid: false,
        error: 'File content contains potentially malicious scripts'
      };
    }

    return { isValid: true };
  }

  /**
   * Sanitize filename for safe storage
   */
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')  // Replace special chars with underscore
      .replace(/_{2,}/g, '_')           // Replace multiple underscores with single
      .slice(0, 100);                  // Limit length
  }
}