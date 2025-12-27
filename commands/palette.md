---
description: Quick color palette generation with anti-sameness scoring. Fast way to get unique brand colors.
allowed-tools: Read, Write, AskUserQuestion
---

# Quick Palette Generator

Generate a distinctive color palette in under a minute.

## Process

1. Ask: "Describe your brand in one sentence"

2. Ask mood:
   - Warm & Inviting
   - Cool & Professional
   - Bold & Energetic
   - Calm & Minimal
   - Luxurious & Rich

3. Generate 5 colors with rationale:
   - Primary (main brand color)
   - Secondary (supporting color)
   - Accent (the "surprise" - must be unexpected)
   - Background
   - Text

4. Score uniqueness (reject if <70)

5. Output as:
   - CSS variables
   - Tailwind config snippet
   - tokens.json

## Anti-Sameness Check

Before outputting, verify:
- [ ] No default Tailwind blue/purple/indigo
- [ ] No generic grays (slate-*)
- [ ] Accent color is genuinely surprising
- [ ] Colors have personality rationale

## Example

```
🎨 Palette: "Artisan Coffee Brand"

Primary:   #3D2C29 (Espresso)     - Rich, grounded authority
Secondary: #D4A574 (Caramel)      - Warm, inviting sweetness
Accent:    #7B9E6B (Sage)         - Unexpected freshness, organic
Background:#FDF8F3 (Cream)        - Warm white, not cold
Text:      #1A1614 (Dark Roast)   - Deep but not pure black

Uniqueness: 82/100 ✓
```
