import { Pool } from 'pg';

class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'scripteam',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection on startup
    this.testConnection();
  }

  private async testConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log('✅ Database connected successfully');
      client.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      // For MVP, we'll continue without database - could use in-memory storage
    }
  }

  async query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number }> {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log(`Query executed in ${duration}ms:`, text.substring(0, 50));
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getClient() {
    return this.pool.connect();
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  // Initialize database schema for development
  async initializeSchema(): Promise<void> {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createScriptsTable = `
      CREATE TABLE IF NOT EXISTS scripts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        original_text TEXT NOT NULL,
        detected_language VARCHAR(10) CHECK (detected_language IN ('es', 'en', 'mixed', 'unknown')),
        primary_language VARCHAR(2) CHECK (primary_language IN ('es', 'en')),
        processing_status VARCHAR(20) DEFAULT 'uploading' CHECK (processing_status IN
          ('uploading', 'analyzing', 'language_detection', 'generating_voices', 'generating_avatars', 'complete', 'error')),
        file_metadata JSONB DEFAULT '{}',
        processed_content JSONB DEFAULT '{}',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createCharactersTable = `
      CREATE TABLE IF NOT EXISTS characters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        ai_profile JSONB DEFAULT '{}',
        voice_settings JSONB DEFAULT '{}',
        avatar JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id);
      CREATE INDEX IF NOT EXISTS idx_scripts_status ON scripts(processing_status);
      CREATE INDEX IF NOT EXISTS idx_characters_script_id ON characters(script_id);
    `;

    try {
      await this.query(createUsersTable);
      await this.query(createScriptsTable);
      await this.query(createCharactersTable);
      await this.query(createIndexes);

      // Create demo user if it doesn't exist
      const createDemoUser = `
        INSERT INTO users (id, email, name)
        VALUES ('00000000-0000-4000-8000-000000000001', 'demo@scripteam.local', 'Demo User')
        ON CONFLICT (id) DO NOTHING;
      `;
      await this.query(createDemoUser);

      console.log('✅ Database schema initialized');
    } catch (error) {
      console.error('❌ Failed to initialize database schema:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();