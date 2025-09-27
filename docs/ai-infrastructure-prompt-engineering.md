# AI Infrastructure Prompt Engineering Strategies

## Overview
This document outlines prompt engineering strategies, templates, and optimization techniques for the ScripTeam AI infrastructure. Focused on maximizing accuracy, consistency, and cost-effectiveness for solopreneur development.

## Core Prompt Engineering Principles

### 1. Structured Output Prompts
**Strategy:** Always specify exact JSON schemas for AI responses to ensure parsing reliability.

**Template Pattern:**
```typescript
const STRUCTURED_PROMPT_TEMPLATE = `
You are a {ROLE_DESCRIPTION}. {TASK_DESCRIPTION} and return ONLY valid JSON in this exact format:

{JSON_SCHEMA}

{SPECIFIC_INSTRUCTIONS}

Return only the JSON, no other text.
`;
```

**Implementation Example:**
```typescript
const CHARACTER_DETECTION_PROMPT = `
You are a script analysis expert. Extract character information from this script text and return ONLY valid JSON in this exact format:

{
  "characters": [
    {
      "name": "CHARACTER_NAME",
      "lineCount": number,
      "personalityTraits": ["trait1", "trait2"],
      "emotionalRange": ["emotion1", "emotion2"],
      "age": "young/middle/older",
      "gender": "male/female/neutral"
    }
  ]
}

Analyze the script for:
1. Character names (usually in CAPS before dialogue)
2. Approximate line count per character
3. Personality traits from dialogue style
4. Emotional range from context
5. Estimated age and gender

Return only the JSON, no other text.
`;
```

### 2. Temperature Optimization Strategies

**Task-Specific Temperature Settings:**
```typescript
const TEMPERATURE_MAPPING = {
  'character-detection': 0.1,      // High accuracy, low creativity
  'voice-direction': 0.2,          // Slight creativity for personality
  'script-summary': 0.3,           // Balanced accuracy and readability
  'creative-writing': 0.7,         // High creativity for content generation
  'error-correction': 0.0          // Maximum determinism for fixes
};
```

**Adaptive Temperature Logic:**
```typescript
function getOptimalTemperature(taskType: string, complexityScore: number): number {
  const baseTemp = TEMPERATURE_MAPPING[taskType] || 0.3;

  // Reduce temperature for complex tasks requiring precision
  if (complexityScore > 0.8) {
    return Math.max(0.0, baseTemp - 0.1);
  }

  // Increase slightly for simple tasks that benefit from variety
  if (complexityScore < 0.3) {
    return Math.min(1.0, baseTemp + 0.1);
  }

  return baseTemp;
}
```

### 3. Context Window Management

**Progressive Context Strategies:**
```typescript
class ContextManager {
  private maxTokens = 8000; // GPT-4 context limit buffer

  async optimizeContext(fullText: string, taskType: string): Promise<string> {
    const tokenCount = this.estimateTokens(fullText);

    if (tokenCount <= this.maxTokens) {
      return fullText;
    }

    switch (taskType) {
      case 'character-detection':
        return this.extractDialogueSamples(fullText);
      case 'voice-analysis':
        return this.focusOnCharacterSections(fullText);
      default:
        return this.intelligentTruncation(fullText);
    }
  }

  private extractDialogueSamples(text: string): string {
    // Extract representative dialogue samples for each character
    const dialogueBlocks = this.parseDialogue(text);
    return dialogueBlocks
      .map(block => this.getRepresentativeSample(block))
      .join('\n\n');
  }
}
```

## Advanced Prompt Templates

### 1. Character Analysis with Chain-of-Thought
```typescript
const ADVANCED_CHARACTER_ANALYSIS = `
You are a character psychology expert and voice direction specialist. Analyze this script using the following methodology:

STEP 1: CHARACTER IDENTIFICATION
- Scan for character names (typically in CAPS before dialogue)
- Count speaking instances per character
- Note any stage directions or character descriptions

STEP 2: PERSONALITY ANALYSIS
- Analyze dialogue patterns (formal/casual, emotional/logical, etc.)
- Identify recurring speech patterns or verbal tics
- Assess character relationships and power dynamics

STEP 3: VOICE CHARACTERISTICS
- Determine age range from dialogue style and content
- Assess emotional range from context and reactions
- Map personality traits to voice characteristics

STEP 4: OUTPUT GENERATION
Return ONLY this exact JSON format:

{
  "characters": [
    {
      "name": "CHARACTER_NAME",
      "analysis": {
        "lineCount": number,
        "dialogueStyle": "formal|casual|mixed",
        "emotionalVolatility": "low|medium|high",
        "dominanceLevel": "submissive|neutral|dominant"
      },
      "personalityTraits": ["specific_trait_1", "specific_trait_2", "specific_trait_3"],
      "emotionalRange": ["primary_emotion", "secondary_emotion"],
      "demographics": {
        "age": "young|middle|older",
        "gender": "male|female|neutral"
      },
      "voiceDirection": {
        "pacePreference": "slow|normal|fast",
        "tonalQuality": "warm|neutral|cold",
        "authorityLevel": "low|medium|high"
      }
    }
  ],
  "overallTone": "comedy|drama|thriller|romance|mixed",
  "castComplexity": "simple|moderate|complex"
}

Apply this methodology to the following script:
`;
```

### 2. Voice Parameter Optimization
```typescript
const VOICE_PARAMETER_PROMPT = `
You are a voice synthesis expert specializing in ElevenLabs voice optimization. Given character analysis, determine optimal voice parameters.

CHARACTER ANALYSIS:
{CHARACTER_DATA}

VOICE PARAMETER MAPPING RULES:
1. STABILITY (0.0-1.0):
   - Calm, authoritative characters: 0.7-1.0
   - Nervous, excited characters: 0.1-0.4
   - Balanced personalities: 0.4-0.7

2. SIMILARITY_BOOST (0.0-1.0):
   - Always use 0.75 for optimal voice cloning
   - Adjust only for specific voice design needs

3. STYLE (0.0-1.0):
   - Dramatic, expressive characters: 0.6-1.0
   - Subdued, gentle characters: 0.0-0.4
   - Balanced expression: 0.4-0.6

4. USE_SPEAKER_BOOST:
   - Always true for character voices
   - Improves consistency and clarity

Return ONLY this JSON format:

{
  "voiceId": "RECOMMENDED_ELEVENLABS_VOICE_ID",
  "voiceSettings": {
    "stability": number,
    "similarity_boost": 0.75,
    "style": number,
    "use_speaker_boost": true
  },
  "reasoning": {
    "voiceSelection": "Brief explanation for voice ID choice",
    "stabilityJustification": "Why this stability value",
    "styleJustification": "Why this style value"
  },
  "sampleText": "Character-appropriate sample for voice testing"
}
`;
```

### 3. Error Recovery and Validation
```typescript
const ERROR_RECOVERY_PROMPT = `
You are an AI output validator and error recovery specialist. The following AI response failed validation:

ORIGINAL_RESPONSE:
{FAILED_RESPONSE}

VALIDATION_ERROR:
{ERROR_MESSAGE}

EXPECTED_FORMAT:
{EXPECTED_SCHEMA}

Your task:
1. Identify why the original response failed
2. Extract any valid data from the failed response
3. Generate a corrected response that meets the expected format
4. Ensure all required fields are present and properly formatted

Return ONLY the corrected JSON response, no explanations:
`;
```

## Prompt Optimization Techniques

### 1. A/B Testing Framework
```typescript
class PromptTester {
  async testPromptVariants(
    basePrompt: string,
    variants: string[],
    testData: any[],
    evaluationMetric: string
  ): Promise<PromptTestResult> {
    const results = [];

    for (const variant of [basePrompt, ...variants]) {
      const responses = await Promise.all(
        testData.map(data => this.executePrompt(variant, data))
      );

      const score = await this.evaluateResponses(responses, evaluationMetric);
      results.push({ prompt: variant, score, responses });
    }

    return this.selectBestPrompt(results);
  }

  private async evaluateResponses(responses: any[], metric: string): Promise<number> {
    switch (metric) {
      case 'json_validity':
        return this.calculateJSONValidityScore(responses);
      case 'accuracy':
        return this.calculateAccuracyScore(responses);
      case 'consistency':
        return this.calculateConsistencyScore(responses);
      default:
        throw new Error(`Unknown evaluation metric: ${metric}`);
    }
  }
}
```

### 2. Dynamic Prompt Adaptation
```typescript
class AdaptivePromptManager {
  private promptHistory: Map<string, PromptPerformance[]> = new Map();

  async getOptimizedPrompt(taskType: string, context: any): Promise<string> {
    const basePrompt = this.getBasePrompt(taskType);
    const performance = this.promptHistory.get(taskType) || [];

    if (performance.length < 10) {
      return basePrompt; // Not enough data for optimization
    }

    const adaptations = this.analyzePerformancePatterns(performance);
    return this.applyAdaptations(basePrompt, adaptations, context);
  }

  async recordPerformance(
    taskType: string,
    prompt: string,
    response: any,
    userFeedback?: number
  ): Promise<void> {
    const performance: PromptPerformance = {
      prompt,
      timestamp: new Date(),
      responseQuality: this.assessResponseQuality(response),
      userFeedback,
      parseSuccess: this.isValidJSON(response),
      executionTime: response.executionTime
    };

    const history = this.promptHistory.get(taskType) || [];
    history.push(performance);

    // Keep only recent performance data
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }

    this.promptHistory.set(taskType, history);
  }
}
```

### 3. Cost-Aware Prompt Engineering
```typescript
class CostOptimizedPromptManager {
  private tokenCosts = {
    'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
    'llama-3.1-8b': { input: 0.0, output: 0.0 } // self-hosted
  };

  async selectOptimalModel(
    prompt: string,
    expectedResponseLength: number,
    accuracyRequirement: number
  ): Promise<string> {
    const promptTokens = this.estimateTokens(prompt);
    const responseTokens = expectedResponseLength;

    const gpt4Cost = this.calculateCost('gpt-4', promptTokens, responseTokens);
    const llamaCost = this.calculateCost('llama-3.1-8b', promptTokens, responseTokens);

    // Use Llama for simple tasks or when cost is critical
    if (accuracyRequirement < 0.8 || gpt4Cost > 0.10) {
      return 'llama-3.1-8b';
    }

    return 'gpt-4';
  }

  optimizePromptForCost(prompt: string): string {
    // Remove unnecessary words while preserving meaning
    return prompt
      .replace(/\b(please|kindly|if you would|if possible)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
```

## Model-Specific Strategies

### GPT-4 Optimization
```typescript
const GPT4_BEST_PRACTICES = {
  systemPromptLength: 'Keep under 500 tokens for optimal performance',
  responseFormat: 'Always specify JSON mode for structured outputs',
  temperature: 'Use 0.0-0.3 for analytical tasks, 0.4-0.7 for creative tasks',
  maxTokens: 'Set conservative limits to avoid incomplete responses',

  promptTemplate: `
System: {CONCISE_ROLE_DEFINITION}

Task: {SPECIFIC_TASK_DESCRIPTION}

Format: {EXACT_OUTPUT_FORMAT}

Input: {USER_DATA}
  `
};
```

### Llama 3.1 8B Optimization
```typescript
const LLAMA_OPTIMIZATION = {
  promptFormat: 'Use Llama chat template format',
  contextLength: 'Optimize for 8K context window',
  repetitionPenalty: 'Use 1.1 to avoid repetitive outputs',

  promptTemplate: `
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{SYSTEM_PROMPT}

<|eot_id|><|start_header_id|>user<|end_header_id|>

{USER_PROMPT}

<|eot_id|><|start_header_id|>assistant<|end_header_id|>
  `
};
```

## Quality Assurance Patterns

### 1. Response Validation
```typescript
class ResponseValidator {
  validateCharacterDetection(response: any): ValidationResult {
    const errors: string[] = [];

    if (!response.characters || !Array.isArray(response.characters)) {
      errors.push('Missing or invalid characters array');
    }

    response.characters?.forEach((char: any, index: number) => {
      if (!char.name || typeof char.name !== 'string') {
        errors.push(`Character ${index}: Missing or invalid name`);
      }

      if (!char.personalityTraits || !Array.isArray(char.personalityTraits)) {
        errors.push(`Character ${index}: Invalid personality traits`);
      }

      if (!['young', 'middle', 'older'].includes(char.age)) {
        errors.push(`Character ${index}: Invalid age category`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      score: Math.max(0, 1 - (errors.length * 0.1))
    };
  }
}
```

### 2. Fallback Strategies
```typescript
class PromptFallbackManager {
  async executeWithFallback(
    primaryPrompt: string,
    fallbackPrompts: string[],
    data: any,
    validator: (response: any) => boolean
  ): Promise<any> {
    const prompts = [primaryPrompt, ...fallbackPrompts];

    for (let i = 0; i < prompts.length; i++) {
      try {
        const response = await this.executePrompt(prompts[i], data);

        if (validator(response)) {
          if (i > 0) {
            // Log fallback usage for analysis
            this.logFallbackUsage(prompts[i], i);
          }
          return response;
        }
      } catch (error) {
        console.warn(`Prompt attempt ${i + 1} failed:`, error);
      }
    }

    throw new Error('All prompt attempts failed');
  }
}
```

## Performance Monitoring

### Prompt Performance Metrics
```typescript
interface PromptMetrics {
  taskType: string;
  model: string;
  prompt: string;
  avgResponseTime: number;
  successRate: number;
  avgTokenUsage: number;
  avgCost: number;
  userSatisfactionScore: number;
  lastUpdated: Date;
}

class PromptMetricsCollector {
  async recordExecution(
    taskType: string,
    model: string,
    prompt: string,
    response: any,
    executionTime: number,
    cost: number
  ): Promise<void> {
    const metrics = await this.getMetrics(taskType, model);

    metrics.avgResponseTime = this.updateAverage(
      metrics.avgResponseTime,
      executionTime,
      metrics.executionCount
    );

    metrics.successRate = this.updateSuccessRate(
      metrics.successRate,
      this.isSuccessfulResponse(response),
      metrics.executionCount
    );

    metrics.avgCost = this.updateAverage(
      metrics.avgCost,
      cost,
      metrics.executionCount
    );

    await this.saveMetrics(metrics);
  }
}
```

This comprehensive prompt engineering documentation provides the foundation for optimizing AI interactions while maintaining cost efficiency and high accuracy in the ScripTeam platform.