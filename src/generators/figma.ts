/**
 * Figma Export Generator for Nano UI
 * Generates Figma-compatible JSON tokens and Style Dictionary format
 */

import { DesignTokens } from './tokens';

export interface FigmaVariables {
  version: string;
  collections: FigmaCollection[];
}

export interface FigmaCollection {
  name: string;
  modes: FigmaMode[];
  variables: FigmaVariable[];
}

export interface FigmaMode {
  name: string;
  modeId: string;
}

export interface FigmaVariable {
  name: string;
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, string | number | boolean>;
  description?: string;
}

/**
 * Generate Figma Variables JSON format
 */
export function generateFigmaVariables(tokens: DesignTokens): FigmaVariables {
  const colorVariables: FigmaVariable[] = Object.entries(tokens.colors).map(
    ([name, color]) => ({
      name: `color/${name}`,
      type: 'COLOR' as const,
      valuesByMode: { 'Mode 1': color.value },
      description: color.rationale,
    })
  );

  const spacingVariables: FigmaVariable[] = tokens.spacing.scale.map(
    (value, index) => ({
      name: `spacing/${index}`,
      type: 'FLOAT' as const,
      valuesByMode: { 'Mode 1': value * tokens.spacing.unit },
    })
  );

  const radiusVariables: FigmaVariable[] = Object.entries(tokens.radii)
    .filter(([key]) => key !== 'rationale')
    .map(([name, value]) => ({
      name: `radius/${name}`,
      type: 'STRING' as const,
      valuesByMode: { 'Mode 1': value },
    }));

  return {
    version: '1.0',
    collections: [
      {
        name: tokens.meta.name,
        modes: [{ name: 'Mode 1', modeId: 'mode-1' }],
        variables: [...colorVariables, ...spacingVariables, ...radiusVariables],
      },
    ],
  };
}

/**
 * Generate Style Dictionary format (compatible with Figma Tokens plugin)
 */
export function generateStyleDictionary(tokens: DesignTokens): object {
  const colorTokens: Record<string, object> = {};
  Object.entries(tokens.colors).forEach(([name, color]) => {
    colorTokens[name] = {
      value: color.value,
      type: 'color',
      description: color.rationale,
    };
  });

  const spacingTokens: Record<string, object> = {};
  tokens.spacing.scale.forEach((value, index) => {
    spacingTokens[`space-${index}`] = {
      value: `${value * tokens.spacing.unit}px`,
      type: 'spacing',
    };
  });

  const radiusTokens: Record<string, object> = {};
  Object.entries(tokens.radii)
    .filter(([key]) => key !== 'rationale')
    .forEach(([name, value]) => {
      radiusTokens[name] = {
        value,
        type: 'borderRadius',
      };
    });

  const shadowTokens: Record<string, object> = {};
  Object.entries(tokens.shadows)
    .filter(([key]) => key !== 'rationale')
    .forEach(([name, value]) => {
      shadowTokens[name] = {
        value,
        type: 'boxShadow',
      };
    });

  const typographyTokens = {
    display: {
      value: {
        fontFamily: tokens.typography.display.family,
        fontWeight: tokens.typography.display.weights[0],
      },
      type: 'typography',
      description: tokens.typography.display.rationale,
    },
    body: {
      value: {
        fontFamily: tokens.typography.body.family,
        fontWeight: tokens.typography.body.weights[0],
      },
      type: 'typography',
      description: tokens.typography.body.rationale,
    },
  };

  return {
    $metadata: {
      name: tokens.meta.name,
      version: tokens.meta.version,
      generator: 'nano-ui',
      uniquenessScore: tokens.meta.uniquenessScore,
    },
    color: colorTokens,
    spacing: spacingTokens,
    borderRadius: radiusTokens,
    boxShadow: shadowTokens,
    typography: typographyTokens,
  };
}

/**
 * Generate Figma Tokens plugin format
 */
export function generateFigmaTokens(tokens: DesignTokens): object {
  const global: Record<string, object> = {};

  // Colors
  Object.entries(tokens.colors).forEach(([name, color]) => {
    global[`color-${name}`] = {
      value: color.value,
      type: 'color',
      description: color.rationale,
    };
  });

  // Typography
  global['font-display'] = {
    value: tokens.typography.display.family,
    type: 'fontFamilies',
  };
  global['font-body'] = {
    value: tokens.typography.body.family,
    type: 'fontFamilies',
  };

  // Font weights
  tokens.typography.display.weights.forEach((weight) => {
    global[`weight-display-${weight}`] = {
      value: weight.toString(),
      type: 'fontWeights',
    };
  });
  tokens.typography.body.weights.forEach((weight) => {
    global[`weight-body-${weight}`] = {
      value: weight.toString(),
      type: 'fontWeights',
    };
  });

  // Spacing
  tokens.spacing.scale.forEach((value, index) => {
    global[`spacing-${index}`] = {
      value: `${value * tokens.spacing.unit}`,
      type: 'spacing',
    };
  });

  // Border radius
  Object.entries(tokens.radii)
    .filter(([key]) => key !== 'rationale')
    .forEach(([name, value]) => {
      global[`radius-${name}`] = {
        value,
        type: 'borderRadius',
      };
    });

  // Shadows
  Object.entries(tokens.shadows)
    .filter(([key]) => key !== 'rationale')
    .forEach(([name, value]) => {
      global[`shadow-${name}`] = {
        value,
        type: 'boxShadow',
      };
    });

  return {
    global,
    $themes: [],
    $metadata: {
      tokenSetOrder: ['global'],
    },
  };
}

/**
 * Generate all Figma export formats
 */
export function generateFigmaExports(tokens: DesignTokens): {
  'figma-variables.json': string;
  'style-dictionary.json': string;
  'figma-tokens.json': string;
} {
  return {
    'figma-variables.json': JSON.stringify(generateFigmaVariables(tokens), null, 2),
    'style-dictionary.json': JSON.stringify(generateStyleDictionary(tokens), null, 2),
    'figma-tokens.json': JSON.stringify(generateFigmaTokens(tokens), null, 2),
  };
}
