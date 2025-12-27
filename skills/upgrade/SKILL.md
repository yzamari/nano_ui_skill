---
name: upgrade
description: Analyze existing project UI and generate migration path to unique design system. Use when updating an existing project's design to be more distinctive.
---

# Nano UI Upgrade

## Purpose

Transform existing generic UIs into distinctive design systems. Analyzes current CSS/Tailwind tokens, scores uniqueness, and generates a migration path to a more memorable design.

## When to Use

- Converting an existing project from generic to distinctive
- Refactoring a Tailwind project with default colors
- Upgrading a design system that looks "AI-generated"
- Migrating from one design system to Nano UI tokens

## Workflow

### Step 1: Gather Project Files

Ask the user to provide or locate:
- `*.css` or `*.scss` files with design tokens
- `tailwind.config.js` or `tailwind.config.ts`
- Any existing `tokens.json` or design token files

### Step 2: Scan & Analyze

Use the upgrade module to analyze:

```typescript
import { analyzeProject, analyzeForGenericPatterns, scanCSS, scanTailwindConfig } from './generators/upgrade';

// Analyze CSS files
const cssResult = scanCSS(cssContent);
const patterns = analyzeForGenericPatterns(cssContent);

// Analyze Tailwind config
const tailwindResult = scanTailwindConfig(tailwindConfig);

// Full project analysis
const report = await analyzeProject(files);
```

### Step 3: Present Report

Show the user:

```
📊 Current Design Score: {score}/100

🚨 Issues Found:
- {issue.description} [{issue.severity}]
  → Suggestion: {issue.suggestion}

✓ Strengths:
- {strength}

📋 Recommendations:
1. {recommendation}
```

### Step 4: Generate Migration

If user approves, generate the migration:

```typescript
import { generateUpgrade, generateReplacementCommands } from './generators/upgrade';

const result = await generateUpgrade({
  files: projectFiles,
  preserveColors: ['#brand-color'], // Keep brand colors
  industry: 'fintech',
  mood: 'professional',
});

// Generate shell commands for migration
const commands = generateReplacementCommands(result.migration);
```

### Step 5: Apply Changes

Options for applying:
1. **Manual**: Provide replacement map for user to apply
2. **Script**: Generate sed/find commands
3. **Full Replace**: Generate new token files to replace existing

## Generic Patterns to Detect

### Colors (High Priority)
```
Generic Tailwind Blues: #3b82f6, #2563eb, #1d4ed8, #60a5fa
Generic Tailwind Indigo: #6366f1, #4f46e5, #4338ca
Generic Tailwind Purple: #8b5cf6, #7c3aed
Generic Tailwind Slate: #64748b, #475569, #334155
AI Gradient Colors: #667eea, #764ba2
```

### Fonts (Medium Priority)
```
Generic Sans: Inter, system-ui, Roboto, Helvetica Neue, Arial
Generic System: ui-sans-serif, SF Pro, Segoe UI
```

### Layout Patterns (Low Priority)
```
- Centered everything
- Perfect symmetry
- 3-column feature grids
- Identical card shadows
```

## Preservation Rules

When user specifies colors/fonts to preserve:

1. **Brand Colors**: Never replace colors marked as brand assets
2. **Accessible Pairs**: Don't break WCAG contrast ratios
3. **Semantic Tokens**: Map to equivalent semantic roles

## Output Formats

### Migration Map
```json
{
  "colorMappings": {
    "#3b82f6": "#3D8F64",
    "#64748b": "#25221E"
  },
  "fontMappings": {
    "Inter": "Source Sans 3"
  },
  "cssReplacements": [
    { "from": "--color-primary: #3b82f6", "to": "--color-primary: #3D8F64" }
  ]
}
```

### Shell Commands
```bash
# Replace color #3b82f6 with #3D8F64
find . -type f \( -name "*.css" -o -name "*.scss" \) -exec sed -i '' 's/#3b82f6/#3D8F64/g' {} +
```

### New Token Files
- `tokens.json` - Complete design tokens
- `variables.css` - CSS custom properties
- `tailwind.config.js` - Updated Tailwind config

## Integration with Design System

After upgrade, user can run `/nano-ui:design-system` for full generation with:
- Brand discovery kept from original
- Only problematic tokens replaced
- Continuous uniqueness scoring

## Quick Reference

```
/nano-ui:upgrade
  ├── Scan project files
  ├── Analyze for generic patterns
  ├── Score current uniqueness (0-100)
  ├── Identify issues & strengths
  ├── Generate migration plan
  └── Output replacement options
```
