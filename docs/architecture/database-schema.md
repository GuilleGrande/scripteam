# Database Schema

Based on our PostgreSQL selection and the comprehensive data models, here's the concrete database schema implementation:

```sql
-- Core user authentication and profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    auth_provider VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    institution VARCHAR(255),
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    practice_goals TEXT[],
    preferred_language VARCHAR(2) CHECK (preferred_language IN ('es', 'en'))
);

CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(2) CHECK (language IN ('es', 'en')),
    voice_settings JSONB DEFAULT '{}',
    practice_settings JSONB DEFAULT '{}',
    accessibility JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Script storage with language detection
CREATE TABLE scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    original_text TEXT NOT NULL,
    detected_language VARCHAR(10) CHECK (detected_language IN ('es', 'en', 'mixed', 'unknown')),
    primary_language VARCHAR(2) CHECK (primary_language IN ('es', 'en')),
    processing_status VARCHAR(20) DEFAULT 'uploading',
    file_metadata JSONB DEFAULT '{}',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE processed_scripts (
    script_id UUID PRIMARY KEY REFERENCES scripts(id) ON DELETE CASCADE,
    scenes JSONB NOT NULL DEFAULT '[]',
    relationships JSONB DEFAULT '[]',
    emotional_context JSONB DEFAULT '[]',
    practice_metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Character analysis and voice profiles
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    ai_profile JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE voice_profiles (
    character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
    elevenlabs_voice_id VARCHAR(100),
    playht_voice_id VARCHAR(100),
    language VARCHAR(2) CHECK (language IN ('es', 'en')),
    region VARCHAR(10) CHECK (region IN ('spain', 'mexico', 'us', 'uk')),
    characteristics JSONB DEFAULT '{}',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE character_avatars (
    character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    style VARCHAR(20) CHECK (style IN ('realistic', 'artistic', 'minimal')),
    cultural_style VARCHAR(20) CHECK (cultural_style IN ('spanish', 'english', 'neutral')),
    prompt TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audio_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    text TEXT NOT NULL,
    language VARCHAR(2) CHECK (language IN ('es', 'en')),
    duration INTEGER, -- milliseconds
    scene_id UUID,
    cached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Practice session tracking
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
    selected_character VARCHAR(255) NOT NULL,
    familiarity_level VARCHAR(20) CHECK (familiarity_level IN ('first_read', 'know_some_lines', 'know_most_lines', 'know_all_lines')),
    session_language VARCHAR(2) CHECK (session_language IN ('es', 'en')),
    duration INTEGER DEFAULT 0, -- seconds
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE session_data (
    session_id UUID PRIMARY KEY REFERENCES practice_sessions(id) ON DELETE CASCADE,
    scenes_completed TEXT[],
    total_lines INTEGER DEFAULT 0,
    user_lines INTEGER DEFAULT 0,
    accuracy_metrics JSONB DEFAULT '{}',
    difficulty_progression JSONB DEFAULT '{}',
    voice_interactions JSONB DEFAULT '[]',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI workflow tracking
CREATE TABLE n8n_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_type VARCHAR(30) NOT NULL,
    related_entity_id UUID NOT NULL,
    language VARCHAR(2) CHECK (language IN ('es', 'en')),
    input_data JSONB DEFAULT '{}',
    output_data JSONB,
    status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'retrying')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    execution_time INTEGER, -- milliseconds
    error_details TEXT,
    retry_count INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_scripts_user_id ON scripts(user_id);
CREATE INDEX idx_scripts_language ON scripts(primary_language);
CREATE INDEX idx_characters_script_id ON characters(script_id);
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_script_id ON practice_sessions(script_id);
CREATE INDEX idx_n8n_workflows_status ON n8n_workflows(status);
CREATE INDEX idx_n8n_workflows_type ON n8n_workflows(workflow_type);
CREATE INDEX idx_audio_samples_character_id ON audio_samples(character_id);
CREATE INDEX idx_audio_samples_language ON audio_samples(language);

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_active
    AFTER INSERT ON practice_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_last_active();
```
