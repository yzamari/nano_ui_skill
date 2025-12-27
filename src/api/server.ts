/**
 * Premium API Server for Nano UI
 * Express-based backend for premium features
 */

import { createGeminiClient, DesignAnalysis, ColorPalette } from '../gemini-client';
import { generateTokens, generateAllFiles, DesignTokens } from '../generators/tokens';
import { generateCode, Framework } from '../generators/code';
import { generateVisuals, VisualResult } from '../generators/visuals';
import { generateFigmaExports } from '../generators/figma';

export interface APIConfig {
  port?: number;
  corsOrigins?: string[];
  rateLimitPerMinute?: number;
}

export interface GenerateRequest {
  name: string;
  industry: string;
  personality: string[];
  competitors: string[];
  mood: string;
  references?: string;
  framework?: Framework | 'all';
  tier: 'free' | 'indie' | 'team' | 'agency';
  apiKey?: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: {
    tokens: DesignTokens;
    files: Record<string, string>;
    visuals?: VisualResult[];
    figma?: Record<string, string>;
    uniquenessScore: number;
    analysis: DesignAnalysis;
  };
  error?: string;
}

/**
 * Tier feature matrix
 */
const TIER_FEATURES = {
  free: {
    maxColors: 6,
    frameworks: 1,
    visuals: false,
    figmaExport: false,
    maxGenerationsPerDay: 5,
  },
  indie: {
    maxColors: 12,
    frameworks: 2,
    visuals: true,
    figmaExport: false,
    maxGenerationsPerDay: 50,
  },
  team: {
    maxColors: 20,
    frameworks: 4,
    visuals: true,
    figmaExport: true,
    maxGenerationsPerDay: 200,
  },
  agency: {
    maxColors: 50,
    frameworks: 4,
    visuals: true,
    figmaExport: true,
    maxGenerationsPerDay: -1, // unlimited
  },
};

/**
 * Generate design system based on tier
 */
export async function handleGenerate(request: GenerateRequest): Promise<GenerateResponse> {
  try {
    const tierConfig = TIER_FEATURES[request.tier];

    // Create Gemini client
    const client = createGeminiClient();

    // Step 1: Analyze brand
    const analysis = await client.analyzeBrand({
      industry: request.industry,
      personality: request.personality,
      competitors: request.competitors,
      mood: request.mood,
      references: request.references,
    });

    // Step 2: Generate palette
    const colors = await client.generatePalette({
      brand: request.name,
      mood: request.mood,
      avoid: analysis.avoidPatterns,
      embrace: analysis.embracePatterns,
    });

    // Step 3: Generate typography
    const typography = await client.generateTypography({
      brand: request.name,
      personality: request.personality,
      industry: request.industry,
    });

    // Step 4: Calculate uniqueness
    const score = await client.calculateUniquenessScore({
      colors,
      typography,
      competitors: request.competitors,
    });

    // Step 5: Generate tokens
    const tokens = generateTokens({
      name: request.name,
      colors,
      typography,
      uniquenessScore: score.total,
      framework: request.framework,
    });

    // Step 6: Generate files
    const files = generateAllFiles({
      name: request.name,
      colors,
      typography,
      uniquenessScore: score.total,
      framework: request.framework,
    });

    // Step 7: Generate code for frameworks
    if (request.framework) {
      const codeFiles = generateCode(tokens, request.framework);
      Object.assign(files, codeFiles);
    }

    // Step 8: Generate visuals (premium)
    let visuals: VisualResult[] | undefined;
    if (tierConfig.visuals) {
      visuals = await generateVisuals({ tokens, style: 'all' });
    }

    // Step 9: Generate Figma exports (premium)
    let figma: Record<string, string> | undefined;
    if (tierConfig.figmaExport) {
      figma = generateFigmaExports(tokens);
    }

    return {
      success: true,
      data: {
        tokens,
        files,
        visuals,
        figma,
        uniquenessScore: score.total,
        analysis,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate API key and get tier
 */
export async function validateApiKey(
  apiKey: string
): Promise<{ valid: boolean; tier?: 'free' | 'indie' | 'team' | 'agency'; error?: string }> {
  // In production, this would validate against a database
  // For now, we check format and return mock tier

  if (!apiKey || apiKey.length < 20) {
    return { valid: false, error: 'Invalid API key format' };
  }

  // Mock tier detection based on key prefix
  if (apiKey.startsWith('nui_agency_')) {
    return { valid: true, tier: 'agency' };
  }
  if (apiKey.startsWith('nui_team_')) {
    return { valid: true, tier: 'team' };
  }
  if (apiKey.startsWith('nui_indie_')) {
    return { valid: true, tier: 'indie' };
  }
  if (apiKey.startsWith('nui_free_')) {
    return { valid: true, tier: 'free' };
  }

  return { valid: false, error: 'Unknown API key prefix' };
}

/**
 * Rate limiting check
 */
export function checkRateLimit(
  userId: string,
  tier: keyof typeof TIER_FEATURES
): { allowed: boolean; remaining: number; resetAt: Date } {
  const config = TIER_FEATURES[tier];

  // In production, this would check a Redis cache
  // For now, always allow
  return {
    allowed: true,
    remaining: config.maxGenerationsPerDay === -1 ? 999 : config.maxGenerationsPerDay,
    resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

/**
 * Create Express-like request handler (for serverless)
 */
export function createHandler() {
  return async (req: { method: string; body: GenerateRequest; headers: Record<string, string> }) => {
    if (req.method !== 'POST') {
      return { status: 405, body: { error: 'Method not allowed' } };
    }

    // Validate API key
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    if (!apiKey) {
      return { status: 401, body: { error: 'API key required' } };
    }

    const validation = await validateApiKey(apiKey);
    if (!validation.valid) {
      return { status: 401, body: { error: validation.error } };
    }

    // Check rate limit
    const rateLimit = checkRateLimit('user-id', validation.tier!);
    if (!rateLimit.allowed) {
      return {
        status: 429,
        body: { error: 'Rate limit exceeded', resetAt: rateLimit.resetAt },
      };
    }

    // Generate
    const result = await handleGenerate({
      ...req.body,
      tier: validation.tier!,
    });

    if (!result.success) {
      return { status: 500, body: { error: result.error } };
    }

    return {
      status: 200,
      body: result.data,
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-Uniqueness-Score': result.data?.uniquenessScore.toString() || '0',
      },
    };
  };
}
