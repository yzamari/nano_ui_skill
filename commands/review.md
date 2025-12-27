---
description: Analyze existing UI for "AI-generated look" problems. Get specific recommendations to make designs more unique.
allowed-tools: Read, Write, AskUserQuestion
---

# UI Sameness Review

Analyze an existing design and identify generic patterns to fix.

## Process

1. Ask user to describe or provide:
   - Screenshot path
   - URL to analyze
   - Or describe current design

2. Check against Anti-Sameness patterns:
   - Color patterns (AI gradients, default palettes)
   - Typography patterns (system fonts, boring weights)
   - Layout patterns (centered everything, 3-column grids)
   - Component patterns (same border-radius, generic shadows)

3. Generate report:

```
🔍 Sameness Analysis

Overall Score: X/100 (higher = more generic)

Issues Found:

🚨 HIGH PRIORITY
1. Blue/purple gradient in hero - Classic AI look
   → Fix: Replace with brand-derived solid or unexpected gradient

2. Inter font throughout - Zero personality
   → Fix: Add display font for headlines

⚠️ MEDIUM PRIORITY
3. All cards have rounded-xl - Monotonous
   → Fix: Vary radii, some sharp, some rounded

4. Perfect 3-column feature grid - Template feel
   → Fix: Asymmetric layout or varying card sizes

💡 LOW PRIORITY
5. Generic shadow-md on cards
   → Fix: Custom shadows with brand color tint

Uniqueness Potential: If all fixed, could reach 75-80/100
```

4. Offer to generate replacement tokens for specific issues

## Quick Checks

Run through this checklist:

- [ ] Default Tailwind colors? → Replace with custom palette
- [ ] Blue/purple gradients? → Warm tones or brand-derived
- [ ] Inter/System fonts? → Characterful display font
- [ ] All same border-radius? → Mix sharp and rounded
- [ ] Centered hero section? → Add asymmetry
- [ ] 3-column feature grid? → Vary sizes
- [ ] Generic card shadows? → Custom or colored shadows
- [ ] No accent color surprise? → Add unexpected pop

## Severity Levels

| Score | Severity | Meaning |
|-------|----------|---------|
| 80-100 | 🚨 Critical | Full "AI template" look, major overhaul needed |
| 60-79 | ⚠️ High | Clearly generic, several key changes needed |
| 40-59 | 💡 Medium | Some generic elements, targeted fixes |
| 20-39 | ✓ Good | Minor polish, already distinctive |
| 0-19 | ⭐ Excellent | Highly unique, no action needed |
