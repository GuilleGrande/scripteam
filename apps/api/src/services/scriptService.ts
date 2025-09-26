import { randomUUID } from 'crypto';
import { databaseService } from './database';
import { Script, ProcessingStatus, FileMetadata } from '@scripteam/shared/types/script';
import { TransactionService } from './transactionService';

interface CreateScriptParams {
  title: string;
  originalText: string;
  expectedLanguage: 'es' | 'en' | 'auto';
  fileMetadata: FileMetadata;
  fileUrl: string;
}

class ScriptService {
  // For MVP, we'll use in-memory storage as fallback if database is not available
  private scriptsCache = new Map<string, Script>();

  async createScript(params: CreateScriptParams): Promise<Script> {
    const scriptId = randomUUID();
    // Use a fixed UUID for demo user until we implement authentication
    const userId = '00000000-0000-4000-8000-000000000001'; // TODO: Get from authentication

    const script: Script = {
      id: scriptId,
      userId,
      title: params.title,
      originalText: params.originalText,
      detectedLanguage: 'unknown',
      primaryLanguage: params.expectedLanguage === 'auto' ? 'en' : params.expectedLanguage,
      characters: [],
      uploadedAt: new Date(),
      processingStatus: 'uploading',
      fileMetadata: params.fileMetadata,
    };

    try {
      // Use transaction for script creation
      await TransactionService.withTransaction(async (transactionId) => {
        await TransactionService.execute(
          transactionId,
          `INSERT INTO scripts (id, user_id, title, original_text, primary_language, processing_status, file_metadata, uploaded_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            script.id,
            script.userId,
            script.title,
            script.originalText,
            script.primaryLanguage,
            script.processingStatus,
            JSON.stringify(script.fileMetadata),
            script.uploadedAt
          ],
          // Rollback query to delete the script if needed
          `DELETE FROM scripts WHERE id = '${script.id}'`
        );

        console.log(`✅ Script ${scriptId} stored in database within transaction`);
      });
    } catch (error) {
      console.warn(`⚠️ Database storage failed for script ${scriptId}, using cache:`, error);
      // Fallback to in-memory storage
      this.scriptsCache.set(scriptId, script);
    }

    return script;
  }

  async getScript(scriptId: string): Promise<Script | null> {
    try {
      // Try database first
      const result = await databaseService.query(
        'SELECT * FROM scripts WHERE id = $1',
        [scriptId]
      );

      if (result.rows.length > 0) {
        return this.mapDatabaseRowToScript(result.rows[0]);
      }
    } catch (error) {
      console.warn('Database query failed, checking memory cache:', error);
    }

    // Fallback to memory cache
    return this.scriptsCache.get(scriptId) || null;
  }

  async getUserScripts(userId: string): Promise<Script[]> {
    try {
      // Try database first
      const result = await databaseService.query(
        'SELECT * FROM scripts WHERE user_id = $1 ORDER BY uploaded_at DESC',
        [userId]
      );

      return result.rows.map(row => this.mapDatabaseRowToScript(row));
    } catch (error) {
      console.warn('Database query failed, checking memory cache');
      // Fallback to memory cache
      return Array.from(this.scriptsCache.values())
        .filter(script => script.userId === userId)
        .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    }
  }

  async updateProcessingStatus(scriptId: string, status: ProcessingStatus): Promise<void> {
    try {
      // Update in database
      await databaseService.query(
        'UPDATE scripts SET processing_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [status, scriptId]
      );
    } catch (error) {
      // Update in memory cache
      const script = this.scriptsCache.get(scriptId);
      if (script) {
        script.processingStatus = status;
        this.scriptsCache.set(scriptId, script);
      }
    }
  }

  async startProcessing(scriptId: string): Promise<void> {
    console.log(`🚀 Starting processing for script ${scriptId}`);

    try {
      // Simulate processing pipeline
      await this.updateProcessingStatus(scriptId, 'analyzing');

      // Simulate language detection
      setTimeout(async () => {
        await this.updateProcessingStatus(scriptId, 'language_detection');

        // Simulate character analysis
        setTimeout(async () => {
          await this.updateProcessingStatus(scriptId, 'generating_voices');

          // Simulate voice generation
          setTimeout(async () => {
            await this.updateProcessingStatus(scriptId, 'complete');
            console.log(`✅ Processing complete for script ${scriptId}`);
          }, 2000);
        }, 1500);
      }, 1000);

    } catch (error) {
      console.error(`❌ Processing failed for script ${scriptId}:`, error);
      await this.updateProcessingStatus(scriptId, 'error');
    }
  }

  private mapDatabaseRowToScript(row: Record<string, unknown>): Script {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      title: row.title as string,
      originalText: row.original_text as string,
      detectedLanguage: (row.detected_language as string) || 'unknown',
      primaryLanguage: row.primary_language as 'es' | 'en',
      characters: [], // TODO: Load from characters table
      uploadedAt: new Date(row.uploaded_at as string),
      processingStatus: row.processing_status as ProcessingStatus,
      fileMetadata: typeof row.file_metadata === 'string' ? JSON.parse(row.file_metadata) : (row.file_metadata as object || {}),
      processedContent: typeof row.processed_content === 'string' ? JSON.parse(row.processed_content) : (row.processed_content as object || {}),
    };
  }
}

export const scriptService = new ScriptService();