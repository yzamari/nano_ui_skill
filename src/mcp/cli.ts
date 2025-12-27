#!/usr/bin/env node
/**
 * Nano UI MCP Server CLI
 * Entry point for the Model Context Protocol server
 */

import { MCP_MANIFEST, handleMCPTool, MCP_TOOLS } from './server';

interface MCPRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPToolCall {
  name: string;
  arguments: Record<string, string>;
}

/**
 * Main MCP server loop
 */
async function main() {
  const stdin = process.stdin;
  const stdout = process.stdout;

  stdin.setEncoding('utf8');

  let buffer = '';

  stdin.on('data', async (chunk: string) => {
    buffer += chunk;

    // Try to parse complete JSON-RPC messages
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const request: MCPRequest = JSON.parse(line);
        const response = await handleRequest(request);
        stdout.write(JSON.stringify(response) + '\n');
      } catch (error) {
        const errorResponse = {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32700,
            message: 'Parse error',
            data: error instanceof Error ? error.message : 'Unknown error',
          },
        };
        stdout.write(JSON.stringify(errorResponse) + '\n');
      }
    }
  });

  stdin.on('end', () => {
    process.exit(0);
  });

  // Log startup
  console.error('Nano UI MCP Server started');
}

/**
 * Handle MCP request
 */
async function handleRequest(request: MCPRequest) {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            prompts: {},
          },
          serverInfo: {
            name: MCP_MANIFEST.name,
            version: MCP_MANIFEST.version,
          },
        },
      };

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS.map((tool) => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
          })),
        },
      };

    case 'tools/call': {
      const toolCall = params as unknown as MCPToolCall;
      const result = await handleMCPTool(toolCall.name, toolCall.arguments || {});

      return {
        jsonrpc: '2.0',
        id,
        result,
      };
    }

    case 'prompts/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          prompts: MCP_MANIFEST.prompts,
        },
      };

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
