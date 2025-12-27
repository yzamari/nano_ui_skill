/**
 * Nano UI Upgrade Module
 * Analyzes existing projects and generates migration paths to unique design systems
 * @module generators/upgrade
 */

import type { ColorPalette, TypographyPalette } from '../gemini-client';

// Generic AI colors to detect (Tailwind defaults, common AI choices)
const GENERIC_COLORS = [
  // Tailwind blue (most common)
  '#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd',
  // Tailwind indigo
  '#6366f1', '#4f46e5', '#4338ca', '#818cf8', '#a5b4fc',
  // Tailwind purple
  '#8b5cf6', '#7c3aed', '#6d28d9', '#a78bfa', '#c4b5fd',
  // Tailwind slate/gray
  '#64748b', '#475569', '#334155', '#94a3b8', '#cbd5e1',
  // Common AI gradients
  '#667eea', '#764ba2', '#6b8dd6', '#8e37d7',
];

// Generic fonts to detect
const GENERIC_FONTS = [
  'Inter', 'system-ui', 'ui-sans-serif', 'Segoe UI', 'Roboto',
  'Helvetica Neue', 'Arial', 'sans-serif', 'SF Pro',
];

/**
 * Result of scanning CSS content
 */
export interface CSSScanResult {
  colors: string[];
  fonts: string[];
  variables: Record<string, string>;
  spacing: string[];
}

/**
 * Issue detected in design
 */
export interface DesignIssue {
  type: 'generic-color' | 'generic-font' | 'low-contrast' | 'bland-palette';
  severity: 'high' | 'medium' | 'low';
  description: string;
  value: string;
  suggestion: string;
}

/**
 * Result of pattern analysis
 */
export interface PatternAnalysis {
  score: number;
  issues: DesignIssue[];
  strengths: string[];
}

/**
 * Tailwind config scan result
 */
export interface TailwindScanResult {
  colors: Record<string, string>;
  fonts: string[];
  spacing: Record<string, string>;
}

/**
 * Migration map for upgrading design system
 */
export interface Migration {
  colorMappings: Record<string, string>;
  fontMappings: Record<string, string>;
  cssReplacements: Array<{ from: string; to: string }>;
}

/**
 * Project analysis report
 */
export interface ProjectReport {
  currentScore: number;
  issues: DesignIssue[];
  recommendations: string[];
  extractedTokens: {
    colors: Record<string, string>;
    fonts: string[];
  };
}

/**
 * Upgrade generation options
 */
export interface UpgradeOptions {
  files: Record<string, string>;
  preserveColors?: string[];
  preserveFonts?: string[];
  industry?: string;
  mood?: string;
}

/**
 * Upgrade generation result
 */
export interface UpgradeResult {
  migration: Migration;
  newTokens: {
    colors: ColorPalette;
    typography: TypographyPalette;
  };
  report: ProjectReport;
}

/**
 * Scan CSS content and extract design tokens
 * @param css - CSS content to scan
 * @returns Extracted colors, fonts, and variables
 */
export function scanCSS(css: string): CSSScanResult {
  const colors: string[] = [];
  const fonts: string[] = [];
  const variables: Record<string, string> = {};
  const spacing: string[] = [];

  // Extract CSS variables
  const varRegex = /--([\w-]+):\s*([^;]+);/g;
  let match;
  while ((match = varRegex.exec(css)) !== null) {
    const [, name, value] = match;
    variables[`--${name}`] = value.trim();

    // Categorize values
    if (value.includes('#') || value.includes('rgb') || value.includes('hsl')) {
      const hexMatch = value.match(/#[0-9a-fA-F]{3,8}/g);
      if (hexMatch) {
        colors.push(...hexMatch.map(c => c.toLowerCase()));
      }
    }
    if (name.includes('font') || name.includes('family')) {
      // Extract font names
      const fontMatch = value.match(/["']?([A-Za-z\s]+)["']?/g);
      if (fontMatch) {
        fontMatch.forEach(f => {
          const fontName = f.replace(/["']/g, '').trim();
          if (fontName && !fonts.includes(fontName)) {
            fonts.push(fontName);
          }
        });
      }
    }
    if (name.includes('spacing') || name.includes('space') || name.includes('gap')) {
      spacing.push(value.trim());
    }
  }

  // Also scan for inline hex colors
  const inlineHexRegex = /#[0-9a-fA-F]{3,8}/g;
  let hexMatch;
  while ((hexMatch = inlineHexRegex.exec(css)) !== null) {
    const hex = hexMatch[0].toLowerCase();
    if (!colors.includes(hex)) {
      colors.push(hex);
    }
  }

  return { colors, fonts, variables, spacing };
}

/**
 * Analyze CSS for generic AI patterns
 * @param css - CSS content to analyze
 * @returns Pattern analysis with score and issues
 */
export function analyzeForGenericPatterns(css: string): PatternAnalysis {
  const scan = scanCSS(css);
  const issues: DesignIssue[] = [];
  const strengths: string[] = [];
  let score = 100;

  // Check for generic colors
  scan.colors.forEach(color => {
    const normalizedColor = color.toLowerCase();
    if (GENERIC_COLORS.includes(normalizedColor)) {
      issues.push({
        type: 'generic-color',
        severity: 'high',
        description: `Generic AI color detected: ${color}`,
        value: color,
        suggestion: 'Replace with a brand-derived color with clear rationale',
      });
      score -= 15;
    }
  });

  // Check for generic fonts
  scan.fonts.forEach(font => {
    if (GENERIC_FONTS.some(gf => font.toLowerCase().includes(gf.toLowerCase()))) {
      issues.push({
        type: 'generic-font',
        severity: 'medium',
        description: `Generic font detected: ${font}`,
        value: font,
        suggestion: 'Consider a characterful font like Fraunces, DM Sans, or Source Serif',
      });
      score -= 10;
    }
  });

  // Check for bland palette (all colors too similar)
  if (scan.colors.length > 0 && scan.colors.length < 3) {
    issues.push({
      type: 'bland-palette',
      severity: 'medium',
      description: 'Limited color palette detected',
      value: scan.colors.join(', '),
      suggestion: 'Add accent colors and ensure primary/secondary/accent variety',
    });
    score -= 10;
  }

  // Identify strengths
  const uniqueColors = scan.colors.filter(c => !GENERIC_COLORS.includes(c.toLowerCase()));
  if (uniqueColors.length > 0) {
    strengths.push(`${uniqueColors.length} unique colors found`);
  }

  const uniqueFonts = scan.fonts.filter(f =>
    !GENERIC_FONTS.some(gf => f.toLowerCase().includes(gf.toLowerCase()))
  );
  if (uniqueFonts.length > 0) {
    strengths.push(`Characterful fonts: ${uniqueFonts.join(', ')}`);
  }

  return {
    score: Math.max(0, score),
    issues,
    strengths,
  };
}

/**
 * Scan Tailwind config and extract design tokens
 * @param config - Tailwind config content
 * @returns Extracted colors and fonts
 */
export function scanTailwindConfig(config: string): TailwindScanResult {
  const colors: Record<string, string> = {};
  const fonts: string[] = [];
  const spacing: Record<string, string> = {};

  // Extract colors - handle both flat and nested structures
  // Use a more robust approach: find 'colors:' and then match balanced braces
  const colorsStart = config.indexOf('colors:');
  let colorBlock = '';

  if (colorsStart !== -1) {
    const afterColors = config.slice(colorsStart);
    const braceStart = afterColors.indexOf('{');
    if (braceStart !== -1) {
      let depth = 0;
      let end = braceStart;
      for (let i = braceStart; i < afterColors.length; i++) {
        if (afterColors[i] === '{') depth++;
        if (afterColors[i] === '}') depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
      colorBlock = afterColors.slice(braceStart + 1, end);
    }
  }

  if (colorBlock) {

    // First handle nested colors (before flat colors to avoid false matches)
    // Match nested colors: brand: { 50: '#hex', 500: '#hex' }
    const nestedRegex = /(\w+):\s*\{([\s\S]*?)\}/g;
    let match;
    while ((match = nestedRegex.exec(colorBlock)) !== null) {
      const prefix = match[1];
      const nested = match[2];
      // Match values like: 50: '#fef2f2' or '500': '#ef4444'
      const nestedColors = /['"]?(\d+)['"]?:\s*['"]?(#[0-9a-fA-F]{3,8})['"]?/g;
      let nestedMatch;
      while ((nestedMatch = nestedColors.exec(nested)) !== null) {
        colors[`${prefix}-${nestedMatch[1]}`] = nestedMatch[2];
      }
    }

    // Match flat colors: primary: '#hex' (not followed by {)
    const flatColorRegex = /(\w+):\s*['"]?(#[0-9a-fA-F]{3,8})['"]?(?!\s*\})/g;
    while ((match = flatColorRegex.exec(colorBlock)) !== null) {
      // Skip if this key was already added as nested
      if (!colors[match[1]] && !Object.keys(colors).some(k => k.startsWith(match[1] + '-'))) {
        colors[match[1]] = match[2];
      }
    }
  }

  // Extract fonts
  const fontBlockRegex = /fontFamily:\s*\{([^}]+)\}/s;
  const fontMatch = config.match(fontBlockRegex);

  if (fontMatch) {
    const fontBlock = fontMatch[1];
    const fontRegex = /['"]([A-Za-z\s]+)['"],?/g;
    let match;
    while ((match = fontRegex.exec(fontBlock)) !== null) {
      const fontName = match[1].trim();
      if (fontName && !fonts.includes(fontName) && !GENERIC_FONTS.slice(1).includes(fontName)) {
        fonts.push(fontName);
      }
    }
  }

  return { colors, fonts, spacing };
}

/**
 * Generate migration map from current to improved design
 * @param current - Current extracted tokens
 * @param improved - New improved design tokens
 * @returns Migration map with replacements
 */
export function generateMigration(
  current: { colors: Record<string, string>; fonts: string[] },
  improved: { colors: ColorPalette; typography: TypographyPalette }
): Migration {
  const colorMappings: Record<string, string> = {};
  const fontMappings: Record<string, string> = {};
  const cssReplacements: Array<{ from: string; to: string }> = [];

  // Map colors by semantic role
  const colorValues = Object.values(current.colors);
  const improvedColors = {
    primary: improved.colors.primary.value,
    secondary: improved.colors.secondary.value,
    accent: improved.colors.accent.value,
    background: improved.colors.background.value,
    surface: improved.colors.surface.value,
    text: improved.colors.text.value,
  };

  // Map generic colors to improved ones
  colorValues.forEach((color, index) => {
    const normalizedColor = color.toLowerCase();
    if (GENERIC_COLORS.includes(normalizedColor)) {
      // Map to appropriate improved color based on role
      const roles = Object.keys(improvedColors) as Array<keyof typeof improvedColors>;
      const targetRole = roles[index % roles.length];
      colorMappings[normalizedColor] = improvedColors[targetRole];

      cssReplacements.push({
        from: normalizedColor,
        to: improvedColors[targetRole],
      });
    }
  });

  // Map fonts
  current.fonts.forEach(font => {
    if (GENERIC_FONTS.some(gf => font.toLowerCase().includes(gf.toLowerCase()))) {
      fontMappings[font] = improved.typography.body.family;
      cssReplacements.push({
        from: font,
        to: improved.typography.body.family,
      });
    }
  });

  return { colorMappings, fontMappings, cssReplacements };
}

/**
 * Generate sed-style replacement commands
 * @param migration - Migration map
 * @returns Shell commands for find/replace
 */
export function generateReplacementCommands(migration: Migration): string {
  const commands: string[] = [
    '# Nano UI Migration Commands',
    '# Run these in your project root',
    '',
  ];

  // Color replacements
  Object.entries(migration.colorMappings).forEach(([from, to]) => {
    commands.push(`# Replace ${from} with ${to}`);
    commands.push(`find . -type f \\( -name "*.css" -o -name "*.scss" -o -name "*.tsx" -o -name "*.jsx" \\) -exec sed -i '' 's/${from}/${to}/g' {} +`);
  });

  // Font replacements
  Object.entries(migration.fontMappings).forEach(([from, to]) => {
    commands.push(`# Replace font ${from} with ${to}`);
    commands.push(`find . -type f \\( -name "*.css" -o -name "*.scss" -o -name "*.tsx" -o -name "*.jsx" \\) -exec sed -i '' 's/${from}/${to}/g' {} +`);
  });

  return commands.join('\n');
}

/**
 * Analyze a project's design files
 * @param files - Map of filename to content
 * @returns Project analysis report
 */
export async function analyzeProject(files: Record<string, string>): Promise<ProjectReport> {
  const allColors: Record<string, string> = {};
  const allFonts: string[] = [];
  const allIssues: DesignIssue[] = [];
  let totalScore = 0;
  let fileCount = 0;

  for (const [filename, content] of Object.entries(files)) {
    if (filename.endsWith('.css') || filename.endsWith('.scss')) {
      const scan = scanCSS(content);
      const analysis = analyzeForGenericPatterns(content);

      scan.colors.forEach((c, i) => {
        allColors[`color-${Object.keys(allColors).length}`] = c;
      });
      allFonts.push(...scan.fonts.filter(f => !allFonts.includes(f)));
      allIssues.push(...analysis.issues);
      totalScore += analysis.score;
      fileCount++;
    } else if (filename.includes('tailwind.config')) {
      const scan = scanTailwindConfig(content);
      Object.assign(allColors, scan.colors);
      allFonts.push(...scan.fonts.filter(f => !allFonts.includes(f)));
    }
  }

  const avgScore = fileCount > 0 ? Math.round(totalScore / fileCount) : 50;

  const recommendations: string[] = [];
  if (allIssues.some(i => i.type === 'generic-color')) {
    recommendations.push('Replace generic Tailwind colors with brand-derived palette');
  }
  if (allIssues.some(i => i.type === 'generic-font')) {
    recommendations.push('Consider characterful fonts like Fraunces, DM Sans, or Source Serif');
  }
  if (avgScore < 60) {
    recommendations.push('Run /nano-ui:design-system to generate a unique design system');
  }

  return {
    currentScore: avgScore,
    issues: allIssues,
    recommendations,
    extractedTokens: {
      colors: allColors,
      fonts: allFonts,
    },
  };
}

/**
 * Generate a complete upgrade package
 * @param options - Upgrade options
 * @returns Complete upgrade result with migration and new tokens
 */
export async function generateUpgrade(options: UpgradeOptions): Promise<UpgradeResult> {
  const report = await analyzeProject(options.files);

  // Generate improved colors (simplified - in real use, this would call Gemini)
  const improvedColors: ColorPalette = {
    primary: { value: '#3D8F64', rationale: 'Warm forest green for trust and growth' },
    secondary: { value: '#F5A623', rationale: 'Warm amber for energy and approachability' },
    accent: { value: '#E05A47', rationale: 'Coral accent for calls to action' },
    background: { value: '#FFFCF9', rationale: 'Warm off-white for comfort' },
    surface: { value: '#FFFFFF', rationale: 'Clean white for content areas' },
    text: { value: '#25221E', rationale: 'Warm dark brown for readability' },
  };

  const improvedTypography: TypographyPalette = {
    display: { family: 'Fraunces', weights: [600, 700], rationale: 'Quirky serif for personality' },
    body: { family: 'Source Sans 3', weights: [400, 500, 600], rationale: 'Readable and professional' },
  };

  // Filter out preserved colors
  const filteredColors = { ...report.extractedTokens.colors };
  if (options.preserveColors) {
    for (const [key, value] of Object.entries(filteredColors)) {
      if (options.preserveColors.includes(value)) {
        delete filteredColors[key];
      }
    }
  }

  // Filter out preserved fonts
  const filteredFonts = report.extractedTokens.fonts.filter(
    f => !options.preserveFonts?.includes(f)
  );

  const migration = generateMigration(
    { colors: filteredColors, fonts: filteredFonts },
    { colors: improvedColors, typography: improvedTypography }
  );

  return {
    migration,
    newTokens: {
      colors: improvedColors,
      typography: improvedTypography,
    },
    report,
  };
}
