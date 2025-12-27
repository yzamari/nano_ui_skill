---
name: anti-sameness
description: Detect and avoid generic AI-generated UI patterns. Use when generating design systems, color palettes, or reviewing existing designs for the "Claude aesthetic" problem.
---

# Anti-Sameness Engine

## Purpose

Prevent design systems from looking like every other AI-generated UI. The "Claude aesthetic" is everywhere - this skill ensures your designs are unique and distinctive.

## The Problem: AI Sameness

AI-generated UIs share these patterns:

### Visual Clichés to AVOID
- Blue/purple gradients (the "AI gradient")
- Slate/gray color schemes
- Perfectly rounded corners everywhere (rounded-xl on everything)
- Generic hero sections with centered text
- Card-based layouts with identical shadows
- Minimalist to the point of having no personality
- Default Tailwind color palette
- Stock illustration styles (Humaaans, unDraw aesthetic)

### Layout Clichés to AVOID
- Centered everything
- Perfect symmetry
- 3-column feature grids
- Hero → Features → Testimonials → CTA
- Identical card heights/widths
- Cookie-cutter pricing tables

## Anti-Sameness Rules

When generating any design element, enforce these rules:

### 1. Color Rules
```
❌ NEVER use default Tailwind colors (slate, blue, indigo, purple)
❌ NEVER use blue-to-purple gradients
✓ ALWAYS derive colors from brand personality
✓ ALWAYS provide color rationale ("why this color?")
✓ CONSIDER warm tones, earth tones, unexpected combinations
✓ REQUIRE at least one "surprising" accent color
```

### 2. Typography Rules
```
❌ NEVER use Inter/System UI as primary font
❌ NEVER use only one font weight
✓ ALWAYS pair fonts with personality contrast
✓ CONSIDER display fonts for headlines
✓ REQUIRE typographic hierarchy with character
```

### 3. Layout Rules
```
❌ NEVER center everything
❌ NEVER use perfect symmetry exclusively
✓ ALWAYS introduce intentional asymmetry
✓ CONSIDER unconventional grid systems
✓ REQUIRE at least one "breaking the grid" element
```

### 4. Component Rules
```
❌ NEVER use identical border-radius on all elements
❌ NEVER use default shadow values
✓ ALWAYS vary corner treatments
✓ CONSIDER organic shapes, custom illustrations
✓ REQUIRE brand-specific component personality
```

## Uniqueness Scoring

Rate each design 0-100:

| Score | Meaning | Action |
|-------|---------|--------|
| 90-100 | Highly distinctive | Ship it |
| 70-89 | Good uniqueness | Minor tweaks |
| 50-69 | Some generic elements | Regenerate problem areas |
| 0-49 | Too generic | Full regeneration |

### Scoring Criteria
- Color originality: 25 points
- Typography character: 25 points
- Layout uniqueness: 25 points
- Overall personality: 25 points

## Competitor Differentiation

When user provides competitors:

1. **Analyze** their design patterns
2. **List** what to explicitly AVOID
3. **Identify** gaps/opportunities they missed
4. **Generate** deliberately different approaches

Example:
```
Competitors: Stripe, Linear, Notion

AVOID:
- Stripe: Blue/purple, heavy gradients, glassmorphism
- Linear: Minimal purple, dark mode default, tight spacing
- Notion: Black/white, serif headlines, emoji-heavy

OPPORTUNITY:
- Warm color palette (they're all cool-toned)
- More organic/playful shapes (they're all geometric)
- Bold typography (they're all restrained)
```

## Generation Prompts

### For Gemini Pro 3 (Analysis)
```
Analyze this brand and generate a differentiation strategy:
- Brand: {brand_description}
- Industry: {industry}
- Competitors: {competitors}
- Personality: {personality_words}

Identify:
1. What visual patterns to AVOID (competitor overlap)
2. What unique angles to EMBRACE (differentiation)
3. Specific color/type/layout recommendations
4. A "uniqueness strategy" in 2-3 sentences
```

### For Nano Banana 3 (Visuals)
```
NEGATIVE PROMPT (always include):
generic, corporate, template, stock photo, AI-generated look,
blue gradient, purple gradient, Tailwind default, boring,
centered layout, symmetrical, clipart, flat illustration

STYLE ANCHORS (derive from brand):
{extracted_style_dna}
```

## Quick Reference

When generating designs, always ask:

1. "Would this blend in on a landing page template site?" → If yes, more unique
2. "Could I identify the brand from just the colors?" → If no, more distinctive
3. "Does the typography have personality?" → If no, bolder choices
4. "Is there anything unexpected here?" → If no, add surprise element
