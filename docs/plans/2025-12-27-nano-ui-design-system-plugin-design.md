# Nano UI Design System Plugin - Design Document

**Date:** 2025-12-27
**Status:** Approved
**Author:** Claude Code + User

## Overview

A Claude Code plugin that uses Gemini Pro 3 and Nano Banana 3 to generate unique design systems that avoid the generic "AI-generated look" (the Claude aesthetic).

## Problem Statement

Too many AI-generated UIs look the same:
- Same blue/purple gradients
- Identical card layouts
- Generic hero sections
- Safe, sanitized, personality-free designs

This plugin creates **distinctive, unique design systems** with real brand personality.

## Architecture

**Approach:** Tiered Hybrid (Free BYOK + Premium API)

### Tiers

| Feature | Free (BYOK) | Premium (API) |
|---------|-------------|---------------|
| Color palette | 5 colors | 12+ colors |
| Typography | 1 pairing | Multiple options |
| Anti-sameness | Basic | Full engine |
| Visual mockups | ❌ | ✓ Nano Banana |
| Frameworks | Single | All |
| Figma export | ❌ | ✓ |

### Pricing (Premium)
- Indie: $19/mo
- Team: $49/mo
- Agency: $149/mo

## Core Components

### 1. Anti-Sameness Engine
- Detection layer (flags generic patterns)
- Uniqueness rules (enforces differentiation)
- Style DNA extraction (from references)
- Generation guardrails (negative prompts)
- Uniqueness score (0-100, regenerate if <70)

### 2. Plugin Structure
```
nano-ui-skill/
├── .claude-plugin/plugin.json
├── commands/
│   ├── design-system.md
│   ├── palette.md
│   └── review.md
├── skills/anti-sameness/
│   ├── SKILL.md
│   ├── PATTERNS.md
│   └── UNIQUENESS.md
├── agents/design-critic.json
├── src/
│   ├── gemini-client.ts
│   ├── tier-manager.ts
│   └── generators/
│       ├── tokens.ts
│       ├── visuals.ts
│       └── code.ts
└── .mcp.json
```

### 3. User Flow
1. Brand Discovery (guided questions)
2. Anti-Sameness Analysis (competitor differentiation)
3. Generation (tokens, code, visuals)
4. Review & Iterate (uniqueness score + adjustments)

## Technical Stack

### Free Tier
- Direct Gemini Pro 3 API (user's key)
- Local file generation

### Premium Tier
- Backend: Node.js API (Vercel/Railway)
- Payments: Stripe
- Database: PostgreSQL
- Cache: Redis
- APIs: Gemini Pro 3 + Nano Banana 3

## Roadmap

### Phase 1: MVP (~2 weeks)
- Plugin structure
- Anti-sameness skill
- Free tier generation
- Basic token output

### Phase 2: Premium Backend (~3 weeks)
- Backend API
- Stripe integration
- MCP server
- Visual generation

### Phase 3: Polish (~2 weeks)
- Multi-framework support
- Additional commands
- Figma export

## Success Criteria

- Uniqueness score system working
- Clear differentiation from competitors
- Smooth upgrade path free → premium
- Design systems that don't look "AI-generated"
