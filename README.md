# Nano UI - Design System Generator

A Claude Code plugin that generates **unique design systems** that don't look AI-generated.

## The Problem

Too many AI-generated UIs look the same:
- Same blue/purple gradients
- Same Tailwind default colors
- Same Inter font everywhere
- Same generic card layouts
- Same boring SaaS templates

**Nano UI fixes this** with an anti-sameness engine that ensures your designs are distinctive and memorable.

## Quick Start

### 1. Get a Gemini API Key (Free)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key

### 2. Add API Key to Claude Code

```bash
# Open Claude Code settings
claude config set GEMINI_API_KEY your-api-key-here

# Or add to your shell profile (~/.zshrc or ~/.bashrc)
export GEMINI_API_KEY=your-api-key-here
```

### 3. Install the Plugin

#### Option A: Install Globally (Recommended)

```bash
# Clone the repository
git clone https://github.com/yahavzamari/nano_ui_skill.git
cd nano_ui_skill

# Install dependencies and build
npm install
npm run build

# Copy to Claude Code plugins cache
mkdir -p ~/.claude/plugins/cache/inline/nano-ui/1.0.0
cp -r dist skills .mcp.json package.json ~/.claude/plugins/cache/inline/nano-ui/1.0.0/

# Add to installed_plugins.json (or edit manually)
# Add this entry under "plugins":
# "nano-ui@inline": [{
#   "scope": "user",
#   "installPath": "~/.claude/plugins/cache/inline/nano-ui/1.0.0",
#   "version": "1.0.0",
#   "isLocal": true
# }]

# Enable in settings.json
# Add to "enabledPlugins":
# "nano-ui@inline": true
```

#### Option B: Run with Plugin Directory

```bash
# Clone and run with the plugin directory
git clone https://github.com/yahavzamari/nano_ui_skill.git
cd nano_ui_skill
npm install && npm run build

# Run Claude Code with the plugin
claude --plugin-dir ./
```

### 4. Generate Your First Design System

```
/nano-ui:design-system
```

## Commands

### `/nano-ui:design-system`
Full guided design system generation:
1. **Brand Discovery** - Industry, personality, competitors, mood
2. **Anti-Sameness Analysis** - What to avoid, what to embrace
3. **Generation** - Tokens, CSS, Tailwind config, documentation
4. **Review & Iterate** - Uniqueness score + adjustments

### `/nano-ui:palette`
Quick color palette generation in under a minute.

### `/nano-ui:review`
Analyze existing UI for "AI-generated look" patterns.

## What You Get

```
design-system/
├── tokens.json           # Design tokens with rationale
├── variables.css         # CSS custom properties
├── tailwind.config.js    # Tailwind configuration
├── README.md             # Usage documentation
├── visuals/              # Visual previews (Phase 2)
│   ├── palette.svg       # Color palette visualization
│   ├── typography.svg    # Font showcase
│   ├── components.svg    # UI component examples
│   └── mockup.html       # Interactive HTML preview
└── figma/                # Figma exports (Phase 3)
    ├── figma-variables.json    # Figma Variables format
    ├── style-dictionary.json   # Style Dictionary format
    └── figma-tokens.json       # Figma Tokens plugin format
```

## Visual Generation (Nano Banana)

Generate visual previews of your design system:

```bash
# Generate visuals from tokens.json
node scripts/generate-visuals.js ./design-system/tokens.json

# Or use the skill command
/nano-ui:design-system  # Visuals are auto-generated
```

**Generated visuals:**
- **palette.svg** - Color swatches with hex values
- **typography.svg** - Font family showcase
- **components.svg** - Buttons, cards, badges, inputs
- **mockup.html** - Interactive HTML preview page

## Figma Export

Export your design tokens for Figma:

```bash
# Generate Figma-compatible files
node scripts/generate-figma.cjs

# Output formats:
# - figma-variables.json (Figma Variables API)
# - style-dictionary.json (Style Dictionary)
# - figma-tokens.json (Figma Tokens plugin)
```

**Import to Figma:**
1. Install the [Figma Tokens plugin](https://www.figma.com/community/plugin/843461159747178978)
2. Open plugin → Import → Select `figma-tokens.json`
3. Your tokens are now available as Figma Variables

## Anti-Sameness Engine

The plugin enforces rules to avoid generic AI look:

**NEVER generates:**
- Blue/purple gradients
- Default Tailwind colors (slate, blue, indigo)
- Inter or system fonts as primary
- Cookie-cutter layouts

**ALWAYS generates:**
- Brand-derived color rationale
- Characterful typography
- Uniqueness score (0-100)
- Differentiation strategy

## Uniqueness Score

| Score | Meaning |
|-------|---------|
| 90-100 | Highly distinctive - ship it |
| 70-89 | Good uniqueness - minor tweaks |
| 50-69 | Some generic elements - regenerate |
| 0-49 | Too generic - full regeneration |

## Requirements

- **Claude Code** (latest version)
- **Gemini API Key** (free from Google AI Studio)

## Example Output

```
✨ Design System Generated

📊 Uniqueness Score: 84/100
   ├── Color originality: 22/25
   ├── Typography character: 21/25
   ├── Layout intentionality: 20/25
   └── Brand personality: 21/25

🎨 Color Palette:
   Primary: #2D5A4A (Deep Forest)
   Secondary: #F5E6D3 (Warm Cream)
   Accent: #E07A5F (Terracotta) ← The surprise!

📝 Typography:
   Display: Fraunces (quirky serif)
   Body: DM Sans (readable, not boring)
```

## License

MIT

---

**Stop shipping generic UI. Start standing out.**
