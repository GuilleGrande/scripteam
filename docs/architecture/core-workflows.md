# Core Workflows

The following sequence diagrams illustrate key system workflows combining frontend user interactions, backend API coordination, and AI processing pipelines:

## Script Upload and AI Processing Workflow

```mermaid
sequenceDiagram
    participant User as Mobile User
    participant App as React Native App
    participant API as API Gateway
    participant N8N as n8n Workflows
    participant GPT as GPT-OSS
    participant EL as ElevenLabs API
    participant DB as PostgreSQL
    participant CDN as Hostinger CDN

    User->>App: Upload script file (PDF/TXT)
    App->>API: POST /scripts (multipart/form-data)
    API->>DB: Store script metadata
    API->>App: Script uploaded (processing queued)
    App->>User: Show "AI Magic Revelation" loading

    API->>N8N: Trigger script analysis workflow
    N8N->>GPT: Analyze script for characters
    GPT->>N8N: Character list + personalities
    N8N->>DB: Store character analysis

    N8N->>GPT: Detect script language
    GPT->>N8N: Language: 'es' (Spanish)
    N8N->>DB: Update script language

    User->>App: Confirm language selection
    App->>API: POST /scripts/{id}/process
    API->>N8N: Trigger voice generation workflow

    N8N->>EL: Generate Spanish voices for characters
    EL->>N8N: Audio files for each character
    N8N->>CDN: Store audio files
    N8N->>DB: Update processing status: complete

    N8N->>API: Webhook: workflow complete
    API->>App: Push notification: processing done
    App->>User: Show character selection screen
```

## Practice Session Workflow

```mermaid
sequenceDiagram
    participant User as Mobile User
    participant App as React Native App
    participant API as API Gateway
    participant DB as PostgreSQL
    participant CDN as Hostinger CDN
    participant Cache as Local Audio Cache

    User->>App: Select character & familiarity level
    App->>API: POST /practice/sessions
    API->>DB: Create practice session record
    API->>App: Session started with audio URLs

    App->>CDN: Download character audio files
    CDN->>Cache: Cache audio locally
    Cache->>App: Audio ready for offline play

    User->>App: Start scene practice
    App->>Cache: Play AI character audio
    Cache->>User: Audio playback (75ms latency)

    User->>App: Speak user lines
    App->>App: Record timing metrics
    App->>Cache: Play next AI character response

    User->>App: Complete scene
    App->>API: POST session analytics
    API->>DB: Store performance metrics
    API->>App: Progress updates & recommendations
    App->>User: Session completion + skill progression
```

## Language Error Handling Workflow

```mermaid
sequenceDiagram
    participant User as Mobile User
    participant App as React Native App
    participant API as API Gateway
    participant N8N as n8n Workflows
    participant GPT as GPT-OSS

    User->>App: Upload mixed language script
    App->>API: POST /scripts (expectedLanguage: auto)
    API->>N8N: Trigger language detection
    N8N->>GPT: Analyze script language
    GPT->>N8N: Result: 'mixed' (Spanish + English)
    N8N->>API: Language detection complete

    API->>App: Language selection required
    App->>User: Show language choice dialog
    User->>App: Select "Spanish" as primary
    App->>API: POST /scripts/{id}/process (confirmLanguage: es)

    API->>N8N: Trigger Spanish voice generation
    N8N->>N8N: Validate language consistency
    N8N->>API: Error: English sections detected
    API->>App: Language mismatch error
    App->>User: Show error: "Script contains English dialogue"

    User->>App: Choose to edit script or accept Spanish-only
    App->>User: Provide editing guidance or continue
```
