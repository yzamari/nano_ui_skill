/**
 * Nano UI Test Suite
 * Comprehensive tests for all phases
 */

import { describe, it, expect } from 'vitest';
import type { ColorPalette } from '../gemini-client';

// Helper to create a complete color palette
function createTestPalette(overrides: Partial<ColorPalette> = {}): ColorPalette {
  return {
    primary: { value: '#3D8F64', rationale: 'Test primary' },
    secondary: { value: '#F5A623', rationale: 'Test secondary' },
    accent: { value: '#E05A47', rationale: 'Test accent' },
    background: { value: '#FFFCF9', rationale: 'Test background' },
    surface: { value: '#FFFFFF', rationale: 'Test surface' },
    text: { value: '#25221E', rationale: 'Test text' },
    ...overrides,
  };
}

// Phase 1: Core functionality tests
describe('Phase 1: Core Functionality', () => {
  describe('Tier Manager', () => {
    it('should check API key status', async () => {
      const { checkApiKey } = await import('../tier-manager');
      const status = checkApiKey();
      expect(status).toHaveProperty('hasKey');
      expect(status).toHaveProperty('keyType');
    });

    it('should provide setup instructions', async () => {
      const { getSetupInstructions } = await import('../tier-manager');
      const instructions = getSetupInstructions();
      expect(instructions).toContain('GEMINI_API_KEY');
      expect(instructions).toContain('aistudio.google.com');
    });

    it('should get status message', async () => {
      const { getStatusMessage } = await import('../tier-manager');
      const message = getStatusMessage();
      expect(typeof message).toBe('string');
    });
  });

  describe('Token Generator', () => {
    it('should generate tokens from options', async () => {
      const { generateTokens } = await import('../generators/tokens');
      const tokens = generateTokens({
        name: 'Test Brand',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Fraunces', weights: [600, 700], rationale: 'Test' },
          body: { family: 'Source Sans 3', weights: [400, 500], rationale: 'Test' },
        },
        uniquenessScore: 82,
      });

      expect(tokens.meta.name).toBe('Test Brand Design System');
      expect(tokens.meta.uniquenessScore).toBe(82);
      expect(tokens.colors.primary.value).toBe('#3D8F64');
    });

    it('should generate CSS variables', async () => {
      const { generateTokens, generateCSSVariables } = await import('../generators/tokens');
      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const css = generateCSSVariables(tokens);
      expect(css).toContain(':root');
      expect(css).toContain('--color-primary');
      expect(css).toContain('#3D8F64');
    });

    it('should generate Tailwind config', async () => {
      const { generateTokens, generateTailwindConfig } = await import('../generators/tokens');
      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const config = generateTailwindConfig(tokens);
      expect(config).toContain('module.exports');
      expect(config).toContain('theme');
      expect(config).toContain('colors');
    });
  });
});

// Phase 2: Premium features tests
describe('Phase 2: Premium Features', () => {
  describe('Visual Generator', () => {
    it('should generate SVG palette', async () => {
      const { generateVisuals } = await import('../generators/visuals');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const visuals = await generateVisuals({ tokens, style: 'palette' });
      expect(visuals.length).toBeGreaterThan(0);
      expect(visuals[0].format).toBe('svg');
      expect(visuals[0].content).toContain('<svg');
    });

    it('should generate typography specimen', async () => {
      const { generateVisuals } = await import('../generators/visuals');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Fraunces', weights: [700], rationale: 'Test' },
          body: { family: 'Source Sans 3', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const visuals = await generateVisuals({ tokens, style: 'typography' });
      expect(visuals[0].content).toContain('Fraunces');
    });

    it('should generate component showcase', async () => {
      const { generateVisuals } = await import('../generators/visuals');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const visuals = await generateVisuals({ tokens, style: 'components' });
      expect(visuals[0].content).toContain('BUTTONS');
    });

    it('should generate HTML mockup', async () => {
      const { generateVisuals } = await import('../generators/visuals');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test Brand',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const visuals = await generateVisuals({ tokens, style: 'mockup' });
      expect(visuals[0].format).toBe('html');
      expect(visuals[0].content).toContain('<!DOCTYPE html>');
    });
  });

  describe('MCP Server', () => {
    it('should have valid tools', async () => {
      const { MCP_TOOLS } = await import('../mcp/server');
      expect(MCP_TOOLS.length).toBeGreaterThan(0);
      expect(MCP_TOOLS.find((t) => t.name === 'nano_ui_status')).toBeDefined();
      expect(MCP_TOOLS.find((t) => t.name === 'nano_ui_generate')).toBeDefined();
    });

    it('should handle status tool', async () => {
      const { handleMCPTool } = await import('../mcp/server');
      const response = await handleMCPTool('nano_ui_status', {});
      expect(response.content).toBeDefined();
      expect(response.content[0].type).toBe('text');
    });

    it('should generate MCP config', async () => {
      const { generateMCPConfig } = await import('../mcp/server');
      const config = generateMCPConfig();
      expect(config).toContain('mcpServers');
      expect(config).toContain('nano-ui');
    });
  });

  describe('Premium API', () => {
    it('should validate API key format', async () => {
      const { validateApiKey } = await import('../api/server');

      const invalid = await validateApiKey('short');
      expect(invalid.valid).toBe(false);

      const validFree = await validateApiKey('nui_free_1234567890123456');
      expect(validFree.valid).toBe(true);
      expect(validFree.tier).toBe('free');

      const validAgency = await validateApiKey('nui_agency_1234567890123456');
      expect(validAgency.valid).toBe(true);
      expect(validAgency.tier).toBe('agency');
    });

    it('should check rate limits', async () => {
      const { checkRateLimit } = await import('../api/server');

      const limit = checkRateLimit('test-user', 'free');
      expect(limit.allowed).toBe(true);
      expect(limit.remaining).toBeDefined();
    });
  });
});

// Phase 3: Export features tests
describe('Phase 3: Export Features', () => {
  describe('Code Generator', () => {
    it('should generate React components', async () => {
      const { generateCode } = await import('../generators/code');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const code = generateCode(tokens, 'react');
      expect(Object.keys(code)).toContain('components/Button.tsx');
      expect(code['components/Button.tsx']).toContain('React');
    });

    it('should generate Vue components', async () => {
      const { generateCode } = await import('../generators/code');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const code = generateCode(tokens, 'vue');
      expect(Object.keys(code)).toContain('components/Button.vue');
      expect(code['components/Button.vue']).toContain('<template>');
    });

    it('should generate Svelte components', async () => {
      const { generateCode } = await import('../generators/code');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const code = generateCode(tokens, 'svelte');
      expect(Object.keys(code)).toContain('components/Button.svelte');
      expect(code['components/Button.svelte']).toContain('<script');
    });

    it('should generate all framework components', async () => {
      const { generateCode } = await import('../generators/code');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const code = generateCode(tokens, 'all');
      expect(Object.keys(code)).toContain('components/Button.tsx');
      expect(Object.keys(code)).toContain('components/Button.vue');
      expect(Object.keys(code)).toContain('components/Button.svelte');
      expect(Object.keys(code)).toContain('components/components.css');
    });
  });

  describe('Figma Export', () => {
    it('should generate Figma variables', async () => {
      const { generateFigmaVariables } = await import('../generators/figma');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const figma = generateFigmaVariables(tokens);
      expect(figma.version).toBe('1.0');
      expect(figma.collections.length).toBeGreaterThan(0);
    });

    it('should generate Style Dictionary format', async () => {
      const { generateStyleDictionary } = await import('../generators/figma');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const sd = generateStyleDictionary(tokens);
      expect(sd).toHaveProperty('$metadata');
      expect(sd).toHaveProperty('color');
      expect(sd).toHaveProperty('typography');
    });

    it('should generate Figma Tokens plugin format', async () => {
      const { generateFigmaTokens } = await import('../generators/figma');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const ft = generateFigmaTokens(tokens);
      expect(ft).toHaveProperty('global');
      expect(ft).toHaveProperty('$themes');
      expect(ft).toHaveProperty('$metadata');
    });

    it('should generate all Figma exports', async () => {
      const { generateFigmaExports } = await import('../generators/figma');
      const { generateTokens } = await import('../generators/tokens');

      const tokens = generateTokens({
        name: 'Test',
        colors: createTestPalette(),
        typography: {
          display: { family: 'Test', weights: [700], rationale: 'Test' },
          body: { family: 'Test Body', weights: [400], rationale: 'Test' },
        },
        uniquenessScore: 80,
      });

      const exports = generateFigmaExports(tokens);
      expect(exports).toHaveProperty('figma-variables.json');
      expect(exports).toHaveProperty('style-dictionary.json');
      expect(exports).toHaveProperty('figma-tokens.json');
    });
  });
});
