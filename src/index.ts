/**
 * Nano UI - Design System Generator
 * Creates unique design systems that don't look AI-generated
 *
 * @packageDocumentation
 */

// Gemini Client
export {
  GeminiClient,
  createGeminiClient,
  type GeminiConfig,
  type GenerationOptions,
  type DesignAnalysis,
  type ColorPalette,
  type ColorToken,
  type TypographySpec,
} from './gemini-client';

// API Key Management
export {
  checkApiKey,
  getSetupInstructions,
  requireApiKey,
  getStatusMessage,
  type ApiKeyStatus,
} from './tier-manager';

// Token Generation
export {
  generateTokens,
  generateCSSVariables,
  generateTailwindConfig,
  generateReadme,
  generateAllFiles,
  type DesignTokens,
  type GeneratorOptions,
} from './generators/tokens';

// Code Generation
export { generateCode, type Framework, type ComponentSpec } from './generators/code';

/**
 * Main entry point for generating a design system
 */
export async function generateDesignSystem(options: {
  name: string;
  industry: string;
  personality: string[];
  competitors: string[];
  mood: string;
  references?: string;
  framework?: 'react' | 'vue' | 'svelte' | 'vanilla' | 'all';
}): Promise<{
  files: Record<string, string>;
  uniquenessScore: number;
  analysis: import('./gemini-client').DesignAnalysis;
}> {
  const { createGeminiClient } = await import('./gemini-client');
  const { generateAllFiles } = await import('./generators/tokens');

  const client = createGeminiClient();

  // Step 1: Analyze brand for differentiation
  const analysis = await client.analyzeBrand({
    industry: options.industry,
    personality: options.personality,
    competitors: options.competitors,
    mood: options.mood,
    references: options.references,
  });

  // Step 2: Generate color palette
  const colors = await client.generatePalette({
    brand: options.name,
    mood: options.mood,
    avoid: analysis.avoidPatterns,
    embrace: analysis.embracePatterns,
  });

  // Step 3: Generate typography
  const typography = await client.generateTypography({
    brand: options.name,
    personality: options.personality,
    industry: options.industry,
  });

  // Step 4: Calculate uniqueness score
  const score = await client.calculateUniquenessScore({
    colors,
    typography,
    competitors: options.competitors,
  });

  // Step 5: Generate all files
  const files = generateAllFiles({
    name: options.name,
    colors,
    typography,
    uniquenessScore: score.total,
    framework: options.framework,
  });

  return {
    files,
    uniquenessScore: score.total,
    analysis,
  };
}
