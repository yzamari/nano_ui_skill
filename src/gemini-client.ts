/**
 * Gemini API Client for Nano UI
 * Uses Gemini Pro for design system generation
 */

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface DesignAnalysis {
  differentiationStrategy: string;
  avoidPatterns: string[];
  embracePatterns: string[];
  colorRecommendations: string[];
  typographyRecommendations: string[];
  uniquenessScore: number;
}

export interface ColorPalette {
  primary: ColorToken;
  secondary: ColorToken;
  accent: ColorToken;
  background: ColorToken;
  surface: ColorToken;
  text: ColorToken;
  [key: string]: ColorToken;
}

export interface ColorToken {
  value: string;
  rationale: string;
}

export interface TypographySpec {
  family: string;
  weights: number[];
  rationale: string;
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.0-flash-exp';

export class GeminiClient {
  private apiKey: string;
  private model: string;

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || DEFAULT_MODEL;
  }

  /**
   * Analyze brand and competitors to generate differentiation strategy
   */
  async analyzeBrand(input: {
    industry: string;
    personality: string[];
    competitors: string[];
    mood: string;
    references?: string;
  }): Promise<DesignAnalysis> {
    const prompt = `You are a design system expert focused on creating UNIQUE designs that avoid the generic "AI-generated look."

Analyze this brand and create a differentiation strategy:

Industry: ${input.industry}
Brand Personality: ${input.personality.join(', ')}
Competitors: ${input.competitors.join(', ')}
Desired Mood: ${input.mood}
${input.references ? `Reference Notes: ${input.references}` : ''}

CRITICAL RULES:
- NEVER recommend blue/purple gradients
- NEVER recommend default Tailwind colors (slate, blue, indigo, purple)
- NEVER recommend Inter or system fonts
- ALWAYS recommend unexpected, brand-specific choices

Respond in JSON format ONLY (no markdown, no explanation):
{
  "differentiationStrategy": "2-3 sentence strategy for standing out",
  "avoidPatterns": ["list of specific patterns competitors use to AVOID"],
  "embracePatterns": ["list of unique angles to EMBRACE"],
  "colorRecommendations": ["specific color direction with rationale"],
  "typographyRecommendations": ["specific font recommendations with rationale"],
  "uniquenessScore": 75
}`;

    const response = await this.generate(prompt, { temperature: 0.7 });
    return this.parseJSON(response);
  }

  /**
   * Generate color palette with anti-sameness rules
   */
  async generatePalette(input: {
    brand: string;
    mood: string;
    avoid: string[];
    embrace: string[];
  }): Promise<ColorPalette> {
    const prompt = `Generate a unique color palette for this brand:

Brand: ${input.brand}
Mood: ${input.mood}

MUST AVOID these patterns:
${input.avoid.map(p => `- ${p}`).join('\n')}

SHOULD EMBRACE:
${input.embrace.map(p => `- ${p}`).join('\n')}

STRICT RULES:
- NO default Tailwind colors (no slate-*, blue-*, indigo-*, purple-*)
- NO blue/purple gradients
- NO pure black (#000) or pure white (#fff)
- MUST include one "surprise" accent color that's unexpected for the industry
- MUST provide rationale for each color choice

Respond in JSON format ONLY (no markdown):
{
  "primary": { "value": "#2D5A4A", "rationale": "why this color" },
  "secondary": { "value": "#F5E6D3", "rationale": "why" },
  "accent": { "value": "#E07A5F", "rationale": "the surprise color - explain why unexpected" },
  "background": { "value": "#FFFDF8", "rationale": "why" },
  "surface": { "value": "#FAF7F2", "rationale": "why" },
  "text": { "value": "#1A1714", "rationale": "why" }
}`;

    const response = await this.generate(prompt, { temperature: 0.8 });
    return this.parseJSON(response);
  }

  /**
   * Generate typography recommendations
   */
  async generateTypography(input: {
    brand: string;
    personality: string[];
    industry: string;
  }): Promise<{ display: TypographySpec; body: TypographySpec }> {
    const prompt = `Recommend typography for this brand:

Brand: ${input.brand}
Personality: ${input.personality.join(', ')}
Industry: ${input.industry}

STRICT RULES:
- NEVER recommend Inter, Roboto, or system fonts as primary display font
- MUST recommend fonts with CHARACTER and PERSONALITY
- Display font should be distinctive and memorable
- Body font should be readable but not boring

Consider fonts like:
- Display: Fraunces, Clash Display, Cabinet Grotesk, Space Grotesk, Playfair Display, Instrument Serif, Syne
- Body: DM Sans, Plus Jakarta Sans, Outfit, Satoshi, Manrope

Respond in JSON format ONLY:
{
  "display": {
    "family": "Fraunces",
    "weights": [700, 900],
    "rationale": "Why this font has character for the brand"
  },
  "body": {
    "family": "DM Sans",
    "weights": [400, 500, 600],
    "rationale": "Why this pairs well and isn't boring"
  }
}`;

    const response = await this.generate(prompt, { temperature: 0.7 });
    return this.parseJSON(response);
  }

  /**
   * Calculate uniqueness score for a design system
   */
  async calculateUniquenessScore(designSystem: {
    colors: ColorPalette;
    typography: { display: TypographySpec; body: TypographySpec };
    competitors: string[];
  }): Promise<{
    total: number;
    breakdown: {
      colorOriginality: number;
      typographyCharacter: number;
      layoutIntentionality: number;
      brandPersonality: number;
    };
    issues: string[];
    suggestions: string[];
  }> {
    const prompt = `Score this design system for uniqueness (avoiding AI-generated look):

Colors:
${JSON.stringify(designSystem.colors, null, 2)}

Typography:
${JSON.stringify(designSystem.typography, null, 2)}

Competitors to differentiate from: ${designSystem.competitors.join(', ')}

Score each category 0-25 points:
- Color originality (no defaults, unexpected choices)
- Typography character (distinctive, not generic)
- Layout intentionality (purposeful spacing/radii implied)
- Brand personality (cohesive story)

Check for these problems:
- Any default Tailwind/Bootstrap colors? (-10 points)
- Blue/purple gradient vibes? (-15 points)
- Inter/Roboto/system fonts? (-10 points)
- No surprise/accent color? (-5 points)

Respond in JSON format ONLY:
{
  "total": 84,
  "breakdown": {
    "colorOriginality": 22,
    "typographyCharacter": 21,
    "layoutIntentionality": 20,
    "brandPersonality": 21
  },
  "issues": ["list any generic patterns detected"],
  "suggestions": ["how to improve uniqueness"]
}`;

    const response = await this.generate(prompt, { temperature: 0.3 });
    return this.parseJSON(response);
  }

  /**
   * Core text generation using Gemini
   */
  private async generate(
    prompt: string,
    options: GenerationOptions = {}
  ): Promise<string> {
    const response = await fetch(
      `${GEMINI_API_BASE}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('No response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Parse JSON from response, handling markdown code blocks
   */
  private parseJSON<T>(response: string): T {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    // Try to extract JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`Failed to parse JSON from response: ${response.substring(0, 200)}`);
    }

    return JSON.parse(jsonMatch[0]);
  }
}

/**
 * Create a Gemini client from environment variables
 */
export function createGeminiClient(): GeminiClient {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY not set.\n\n' +
      'Get your free API key at: https://aistudio.google.com/apikey\n' +
      'Then run: export GEMINI_API_KEY=your-key'
    );
  }
  return new GeminiClient({ apiKey });
}
