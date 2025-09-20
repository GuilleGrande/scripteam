# API Specification

Based on the REST + Webhooks API style from our Tech Stack, here's the comprehensive API specification for ScripTeam's fullstack architecture:

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: ScripTeam API
  version: 1.0.0
  description: AI-powered acting practice platform API with Spanish/English language support
servers:
  - url: https://api.scripteam.com
    description: Production server
  - url: https://staging-api.scripteam.com
    description: Staging server

paths:
  /auth/login:
    post:
      summary: User authentication via Auth0
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
                provider:
                  type: string
                  enum: [auth0, google, apple, institutional]
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'

  /scripts:
    post:
      summary: Upload and analyze script
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                title:
                  type: string
                expectedLanguage:
                  type: string
                  enum: [es, en, auto]
      responses:
        '201':
          description: Script uploaded successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Script'
        '400':
          description: Invalid file or unsupported language
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /scripts/{scriptId}/process:
    post:
      summary: Trigger AI processing workflow via n8n
      security:
        - bearerAuth: []
      parameters:
        - name: scriptId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                confirmLanguage:
                  type: string
                  enum: [es, en]
                voicePreferences:
                  type: object
                  properties:
                    region:
                      type: string
                      enum: [spain, mexico, us, uk]
      responses:
        '202':
          description: Processing started
          content:
            application/json:
              schema:
                type: object
                properties:
                  workflowId:
                    type: string
                  estimatedDuration:
                    type: number

  /scripts/{scriptId}/characters:
    get:
      summary: Get processed characters with voice profiles
      security:
        - bearerAuth: []
      parameters:
        - name: scriptId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Characters retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Character'

  /practice/sessions:
    post:
      summary: Start practice session
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                scriptId:
                  type: string
                selectedCharacter:
                  type: string
                familiarityLevel:
                  type: string
                  enum: [first_read, know_some_lines, know_most_lines, know_all_lines]
      responses:
        '201':
          description: Practice session started
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PracticeSession'

  /webhooks/n8n/workflow-complete:
    post:
      summary: n8n workflow completion webhook
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                workflowId:
                  type: string
                workflowType:
                  type: string
                status:
                  type: string
                  enum: [completed, failed]
                outputData:
                  type: object
                errorDetails:
                  type: string
      responses:
        '200':
          description: Webhook processed successfully

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
        profile:
          $ref: '#/components/schemas/UserProfile'
        preferences:
          $ref: '#/components/schemas/UserPreferences'

    UserProfile:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
        institution:
          type: string
        skillLevel:
          type: string
          enum: [beginner, intermediate, advanced]
        preferredLanguage:
          type: string
          enum: [es, en]

    UserPreferences:
      type: object
      properties:
        language:
          type: string
          enum: [es, en]
        voiceSettings:
          type: object
          properties:
            playbackSpeed:
              type: number
            volume:
              type: number
            accentPreference:
              type: string
              enum: [spain, mexico, us, uk]

    Script:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        detectedLanguage:
          type: string
          enum: [es, en, mixed, unknown]
        primaryLanguage:
          type: string
          enum: [es, en]
        processingStatus:
          type: string
          enum: [uploading, analyzing, language_detection, generating_voices, generating_avatars, complete, error]

    Character:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        aiProfile:
          $ref: '#/components/schemas/CharacterProfile'
        voiceSettings:
          $ref: '#/components/schemas/VoiceProfile'

    CharacterProfile:
      type: object
      properties:
        personality:
          type: array
          items:
            type: string
        age:
          type: string
        gender:
          type: string
        speakingStyle:
          type: string

    VoiceProfile:
      type: object
      properties:
        language:
          type: string
          enum: [es, en]
        region:
          type: string
          enum: [spain, mexico, us, uk]
        elevenLabsVoiceId:
          type: string
        characteristics:
          type: object

    PracticeSession:
      type: object
      properties:
        id:
          type: string
        scriptId:
          type: string
        selectedCharacter:
          type: string
        sessionLanguage:
          type: string
          enum: [es, en]
        status:
          type: string
          enum: [active, paused, completed, abandoned]

    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
        timestamp:
          type: string
        requestId:
          type: string
```
