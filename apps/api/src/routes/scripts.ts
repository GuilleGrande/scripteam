import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { scriptService } from '../services/scriptService';
import { fileStorageService } from '../services/fileStorageService';
import { pdfExtractorService } from '../services/pdfExtractorService';
import { FileValidator } from '../utils/fileValidator';
import { uploadRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
});

// Request validation schema
const uploadScriptSchema = z.object({
  title: z.string().optional(),
  expectedLanguage: z.enum(['es', 'en', 'auto']).optional(),
});

// POST /scripts - Upload and process script
router.post('/', uploadRateLimiter.middleware(), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a PDF or TXT file'
      });
    }

    // Enhanced file validation
    const fileValidation = FileValidator.validateFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    if (!fileValidation.isValid) {
      return res.status(400).json({
        error: 'Invalid file',
        message: fileValidation.error
      });
    }

    // Validate request body
    const validationResult = uploadScriptSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validationResult.error.issues
      });
    }

    const { title, expectedLanguage } = validationResult.data;

    // Extract text from file
    let extractedText: string;
    if (req.file.mimetype === 'application/pdf') {
      extractedText = await pdfExtractorService.extractText(req.file.buffer);
    } else {
      extractedText = req.file.buffer.toString('utf-8');
    }

    // Validate extracted text
    if (!extractedText.trim()) {
      return res.status(422).json({
        error: 'Empty or corrupted file',
        message: 'Could not extract readable text from the file'
      });
    }

    // Store file
    const fileUrl = await fileStorageService.storeFile(req.file);

    // Sanitize filename and create script record
    const sanitizedFilename = FileValidator.sanitizeFilename(req.file.originalname);
    const script = await scriptService.createScript({
      title: title || sanitizedFilename.replace(/\.[^/.]+$/, ''),
      originalText: extractedText,
      expectedLanguage: expectedLanguage || 'auto',
      fileMetadata: {
        originalName: sanitizedFilename,
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: new Date(),
      },
      fileUrl,
    });

    // Start async processing (language detection, character analysis, etc.)
    scriptService.startProcessing(script.id).catch(error => {
      console.error(`Processing failed for script ${script.id}:`, error);
    });

    res.status(201).json({
      id: script.id,
      title: script.title,
      processingStatus: script.processingStatus,
      uploadedAt: script.uploadedAt,
      fileMetadata: script.fileMetadata,
    });

  } catch (error) {
    console.error('Script upload error:', error);

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'File too large',
          message: 'File size must be less than 10MB'
        });
      }
    }

    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while processing your script'
    });
  }
});

// GET /scripts/:id - Get script details
router.get('/:id', async (req, res) => {
  try {
    const script = await scriptService.getScript(req.params.id);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    res.json(script);
  } catch (error) {
    console.error('Get script error:', error);
    res.status(500).json({ error: 'Failed to retrieve script' });
  }
});

// GET /scripts - Get user's scripts
router.get('/', async (req, res) => {
  try {
    // TODO: Add user authentication and get userId from token
    const userId = req.query.userId as string || '00000000-0000-4000-8000-000000000001';
    const scripts = await scriptService.getUserScripts(userId);
    res.json(scripts);
  } catch (error) {
    console.error('Get scripts error:', error);
    res.status(500).json({ error: 'Failed to retrieve scripts' });
  }
});

export { router as scriptsRouter };