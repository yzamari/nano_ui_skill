/**
 * MCP Server for Nano UI
 * Model Context Protocol server for Claude Code integration
 */

import { generateDesignSystem } from '../index';
import { checkApiKey, getStatusMessage } from '../tier-manager';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export interface MCPResponse {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/**
 * Available MCP tools for Nano UI
 */
export const MCP_TOOLS: MCPTool[] = [
  {
    name: 'nano_ui_status',
    description: 'Check Nano UI configuration status and API key',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'nano_ui_generate',
    description: 'Generate a unique design system with anti-sameness engine',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Brand/project name',
        },
        industry: {
          type: 'string',
          description: 'Industry (e.g., SaaS, Fintech, Healthcare, E-commerce)',
        },
        personality: {
          type: 'string',
          description: 'Comma-separated personality words (e.g., "modern, trustworthy, innovative")',
        },
        competitors: {
          type: 'string',
          description: 'Comma-separated competitor names (e.g., "Stripe, Linear, Notion")',
        },
        mood: {
          type: 'string',
          description: 'Desired mood/feeling',
          enum: [
            'Professional & Trustworthy',
            'Bold & Innovative',
            'Warm & Friendly',
            'Minimal & Elegant',
            'Playful & Fun',
            'Luxurious & Premium',
          ],
        },
        framework: {
          type: 'string',
          description: 'Target framework',
          enum: ['react', 'vue', 'svelte', 'vanilla', 'all'],
        },
      },
      required: ['name', 'industry', 'personality', 'competitors', 'mood'],
    },
  },
  {
    name: 'nano_ui_palette',
    description: 'Generate just a color palette with anti-sameness rules',
    inputSchema: {
      type: 'object',
      properties: {
        brand: {
          type: 'string',
          description: 'Brand name',
        },
        mood: {
          type: 'string',
          description: 'Desired mood',
        },
        avoid: {
          type: 'string',
          description: 'Comma-separated colors/patterns to avoid',
        },
      },
      required: ['brand', 'mood'],
    },
  },
  {
    name: 'nano_ui_review',
    description: 'Review existing design for AI-generated patterns and uniqueness score',
    inputSchema: {
      type: 'object',
      properties: {
        cssFile: {
          type: 'string',
          description: 'Path to CSS file to analyze',
        },
        tokensFile: {
          type: 'string',
          description: 'Path to design tokens JSON file',
        },
      },
      required: [],
    },
  },
];

/**
 * Handle MCP tool calls
 */
export async function handleMCPTool(
  toolName: string,
  args: Record<string, string>
): Promise<MCPResponse> {
  try {
    switch (toolName) {
      case 'nano_ui_status':
        return handleStatus();

      case 'nano_ui_generate':
        return await handleGenerate(args);

      case 'nano_ui_palette':
        return await handlePalette(args);

      case 'nano_ui_review':
        return handleReview(args);

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle status check
 */
function handleStatus(): MCPResponse {
  const status = checkApiKey();
  const message = getStatusMessage();

  return {
    content: [
      {
        type: 'text',
        text: `Nano UI Status\n${'='.repeat(40)}\n\n${message}\n\nAPI Key: ${status.hasKey ? '✓ Configured' : '✗ Not set'}\nKey Type: ${status.keyType}`,
      },
    ],
  };
}

/**
 * Handle design system generation
 */
async function handleGenerate(args: Record<string, string>): Promise<MCPResponse> {
  const result = await generateDesignSystem({
    name: args.name,
    industry: args.industry,
    personality: args.personality.split(',').map((p) => p.trim()),
    competitors: args.competitors.split(',').map((c) => c.trim()),
    mood: args.mood,
    framework: (args.framework as 'react' | 'vue' | 'svelte' | 'vanilla' | 'all') || 'react',
  });

  const fileList = Object.keys(result.files).join('\n  - ');

  return {
    content: [
      {
        type: 'text',
        text: `Design System Generated!
${'='.repeat(40)}

Uniqueness Score: ${result.uniquenessScore}/100

Strategy: ${result.analysis.differentiationStrategy}

Generated Files:
  - ${fileList}

To save files, use the Write tool with the file contents from the result.`,
      },
    ],
  };
}

/**
 * Handle palette generation
 */
async function handlePalette(args: Record<string, string>): Promise<MCPResponse> {
  const { createGeminiClient } = await import('../gemini-client');
  const client = createGeminiClient();

  const avoid = args.avoid ? args.avoid.split(',').map((a) => a.trim()) : [];

  const palette = await client.generatePalette({
    brand: args.brand,
    mood: args.mood,
    avoid,
    embrace: [],
  });

  const colorList = Object.entries(palette)
    .map(([name, color]) => `${name}: ${color.value}\n  → ${color.rationale}`)
    .join('\n\n');

  return {
    content: [
      {
        type: 'text',
        text: `Color Palette Generated
${'='.repeat(40)}

${colorList}`,
      },
    ],
  };
}

/**
 * Handle design review
 */
function handleReview(_args: Record<string, string>): MCPResponse {
  // This would analyze provided files for AI patterns
  return {
    content: [
      {
        type: 'text',
        text: `Design Review
${'='.repeat(40)}

To review a design, provide either:
- cssFile: Path to a CSS file
- tokensFile: Path to design tokens JSON

The review will check for:
- Default Tailwind colors (generic)
- Blue/purple gradients (AI aesthetic)
- Inter/system fonts (safe but boring)
- Identical border-radius values
- Generic shadow values

And provide a uniqueness score with improvement suggestions.`,
      },
    ],
  };
}

/**
 * MCP Server manifest
 */
export const MCP_MANIFEST = {
  name: 'nano-ui',
  version: '1.0.0',
  description: 'Generate unique design systems that avoid the AI-generated look',
  tools: MCP_TOOLS,
  prompts: [
    {
      name: 'design-system',
      description: 'Generate a complete design system',
      arguments: [
        { name: 'brand', description: 'Brand name', required: true },
        { name: 'industry', description: 'Industry type', required: true },
      ],
    },
    {
      name: 'quick-palette',
      description: 'Generate a quick color palette',
      arguments: [
        { name: 'mood', description: 'Desired mood', required: true },
      ],
    },
  ],
};

/**
 * Export MCP configuration file content
 */
export function generateMCPConfig(): string {
  return JSON.stringify(
    {
      mcpServers: {
        'nano-ui': {
          command: 'npx',
          args: ['nano-ui-mcp'],
          env: {
            GEMINI_API_KEY: '${GEMINI_API_KEY}',
          },
        },
      },
    },
    null,
    2
  );
}
