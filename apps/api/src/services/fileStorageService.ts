import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export class FileStorageService {
  private readonly uploadsDir = process.env.UPLOADS_DIR || './uploads';

  constructor() {
    this.ensureUploadsDirectory();
  }

  private async ensureUploadsDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  async storeFile(file: Express.Multer.File): Promise<string> {
    await this.ensureUploadsDirectory();

    const fileId = randomUUID();
    const extension = this.getFileExtension(file.originalname);
    const filename = `${fileId}${extension}`;
    const filePath = path.join(this.uploadsDir, filename);

    try {
      await fs.writeFile(filePath, file.buffer);

      // Return a relative URL that can be served by the API
      return `/uploads/${filename}`;
    } catch (error) {
      console.error('File storage error:', error);
      throw new Error('Failed to store uploaded file');
    }
  }

  async getFile(fileUrl: string): Promise<Buffer> {
    const filename = path.basename(fileUrl);
    const filePath = path.join(this.uploadsDir, filename);

    try {
      return await fs.readFile(filePath);
    } catch (error) {
      console.error('File retrieval error:', error);
      throw new Error('File not found');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const filename = path.basename(fileUrl);
    const filePath = path.join(this.uploadsDir, filename);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('File deletion error:', error);
      // Don't throw here - file might already be deleted
    }
  }

  private getFileExtension(filename: string): string {
    const ext = path.extname(filename);
    return ext || '.bin';
  }

  async getFileStats(fileUrl: string): Promise<{
    size: number;
    createdAt: Date;
    exists: boolean;
  }> {
    const filename = path.basename(fileUrl);
    const filePath = path.join(this.uploadsDir, filename);

    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        createdAt: stats.birthtime,
        exists: true
      };
    } catch {
      return {
        size: 0,
        createdAt: new Date(),
        exists: false
      };
    }
  }
}

export const fileStorageService = new FileStorageService();