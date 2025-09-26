import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { scriptsRouter } from '../routes/scripts';
import { databaseService } from '../services/database';

// Mock database service
jest.mock('../services/database');
const mockDatabase = databaseService as jest.Mocked<typeof databaseService>;

describe('Scripts API - Acceptance Criteria Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/scripts', scriptsRouter);

    // Reset mocks
    jest.clearAllMocks();

    // Mock database responses
    (mockDatabase.query as jest.Mock) = jest.fn();
    (mockDatabase.close as jest.Mock) = jest.fn();
  });

  describe('AC1: User can select and upload PDF or plain text files through web interface', () => {
    test('should accept valid PDF file upload', async () => {
      const testPdfPath = path.join(__dirname, 'fixtures', 'test-script.pdf');

      // Mock database insert
      (mockDatabase.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: 'test-script-id',
          title: 'Test Script',
          processing_status: 'uploading',
          uploaded_at: new Date().toISOString()
        }],
        rowCount: 1
      });

      const response = await request(app)
        .post('/scripts')
        .attach('file', Buffer.from('Mock PDF content'), 'test-script.pdf')
        .expect(201);

      expect(response.body).toMatchObject({
        id: 'test-script-id',
        title: 'Test Script',
        processingStatus: 'uploading'
      });
    });

    test('should accept valid text file upload', async () => {
      const testTextContent = `FADE IN:

INT. LIVING ROOM - DAY

JOHN sits on the couch, reading a newspaper.

JOHN
This is a test script for our drama app.

FADE OUT.`;

      (mockDatabase.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: 'test-text-id',
          title: 'Test Text Script',
          processing_status: 'uploading',
          uploaded_at: new Date().toISOString()
        }],
        rowCount: 1
      });

      const response = await request(app)
        .post('/scripts')
        .attach('file', Buffer.from(testTextContent), 'test-script.txt')
        .expect(201);

      expect(response.body).toMatchObject({
        id: 'test-text-id',
        title: 'Test Text Script',
        processingStatus: 'uploading'
      });
    });

    test('should retrieve uploaded script details', async () => {
      const mockScript = {
        id: 'test-script-id',
        title: 'Test Script',
        original_text: 'Test script content',
        processing_status: 'complete',
        uploaded_at: new Date().toISOString()
      };

      (mockDatabase.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockScript]
      });

      const response = await request(app)
        .get('/scripts/test-script-id')
        .expect(200);

      expect(response.body).toMatchObject({
        id: 'test-script-id',
        title: 'Test Script',
        originalText: 'Test script content',
        processingStatus: 'complete'
      });
    });
  });

  describe('AC4: Basic error handling for unsupported file types or corrupted uploads', () => {
    test('should reject unsupported file types', async () => {
      const response = await request(app)
        .post('/scripts')
        .attach('file', Buffer.from('Invalid content'), 'test.docx')
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Invalid file type. Only PDF and text files are supported.'
      });
    });

    test('should handle missing file upload', async () => {
      const response = await request(app)
        .post('/scripts')
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'No file uploaded'
      });
    });

    test('should handle corrupted PDF files gracefully', async () => {
      const corruptedPdfContent = 'This is not a real PDF file content';

      const response = await request(app)
        .post('/scripts')
        .attach('file', Buffer.from(corruptedPdfContent), 'corrupted.pdf')
        .expect(422);

      expect(response.body).toMatchObject({
        error: 'Failed to extract text from PDF file'
      });
    });
  });

  describe('AC5: File size limit of 10MB to prevent infrastructure overload during MVP', () => {
    test('should reject files larger than 10MB', async () => {
      // Create a buffer larger than 10MB
      const largeFileContent = Buffer.alloc(11 * 1024 * 1024, 'a'); // 11MB

      const response = await request(app)
        .post('/scripts')
        .attach('file', largeFileContent, 'large-file.txt')
        .expect(413);

      expect(response.body).toMatchObject({
        error: 'File too large. Maximum size is 10MB.'
      });
    });

    test('should accept files within 10MB limit', async () => {
      // Create a buffer just under 10MB
      const validFileContent = Buffer.alloc(9 * 1024 * 1024, 'a'); // 9MB

      (mockDatabase.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: 'valid-size-id',
          title: 'Valid Size Script',
          processing_status: 'uploading',
          uploaded_at: new Date().toISOString()
        }],
        rowCount: 1
      });

      const response = await request(app)
        .post('/scripts')
        .attach('file', validFileContent, 'valid-size.txt')
        .expect(201);

      expect(response.body).toMatchObject({
        id: 'valid-size-id',
        processingStatus: 'uploading'
      });
    });
  });

  describe('AC3: Uploaded text is stored securely and displayed for user confirmation', () => {
    test('should store script with unique identifier', async () => {
      const testContent = 'Test script content for storage verification';

      (mockDatabase.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: 'secure-storage-id',
          title: 'Secure Storage Test',
          processing_status: 'uploading',
          uploaded_at: new Date().toISOString()
        }],
        rowCount: 1
      });

      const response = await request(app)
        .post('/scripts')
        .attach('file', Buffer.from(testContent), 'secure-test.txt')
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.id).toMatch(/^[a-zA-Z0-9-]+$/);

      // Verify database was called with script data
      expect(mockDatabase.query as jest.Mock).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO scripts'),
        expect.any(Array)
      );
    });

    test('should associate script with user (demo-user for MVP)', async () => {
      const testContent = 'User association test content';

      (mockDatabase.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          id: 'user-assoc-id',
          user_id: 'demo-user',
          title: 'User Association Test',
          processing_status: 'uploading',
          uploaded_at: new Date().toISOString()
        }],
        rowCount: 1
      });

      await request(app)
        .post('/scripts')
        .attach('file', Buffer.from(testContent), 'user-test.txt')
        .expect(201);

      // Verify user_id was included in database call
      const dbCall = (mockDatabase.query as jest.Mock).mock.calls[0];
      expect(dbCall[1]).toContain('demo-user');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle database connection failures', async () => {
      (mockDatabase.query as jest.Mock).mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .post('/scripts')
        .attach('file', Buffer.from('Test content'), 'db-error-test.txt')
        .expect(500);

      expect(response.body).toMatchObject({
        error: 'Internal server error'
      });
    });

    test('should handle concurrent uploads gracefully', async () => {
      const testContent = 'Concurrent upload test';

      mockDatabase.query.mockResolvedValue({
        rows: [{
          id: 'concurrent-1',
          title: 'Concurrent Test',
          processing_status: 'uploading',
          uploaded_at: new Date().toISOString()
        }],
        rowCount: 1
      });

      // Simulate multiple concurrent uploads
      const uploads = Array.from({ length: 3 }, (_, i) =>
        request(app)
          .post('/scripts')
          .attach('file', Buffer.from(testContent), `concurrent-${i}.txt`)
      );

      const responses = await Promise.all(uploads);

      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
      });
    });
  });
});