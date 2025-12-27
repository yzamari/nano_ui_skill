const fs = require('fs');
const path = require('path');

const tokensJson = require('../example/test1/design-system/tokens.json');

// Inline Figma export functions
function generateFigmaVariables(tokens) {
  const colorVariables = [];
  Object.entries(tokens.colors).forEach(([name, colorObj]) => {
    if (typeof colorObj === 'object') {
      Object.entries(colorObj).forEach(([shade, value]) => {
        if (shade !== 'rationale' && typeof value === 'string' && value.startsWith('#')) {
          colorVariables.push({
            name: 'color/' + name + '/' + shade,
            type: 'COLOR',
            valuesByMode: { 'Mode 1': value },
            description: colorObj.rationale || '',
          });
        }
      });
    }
  });

  const spacingVariables = Object.entries(tokens.spacing.scale || {}).map(
    ([key, value]) => ({
      name: 'spacing/' + key,
      type: 'FLOAT',
      valuesByMode: { 'Mode 1': typeof value === 'string' ? parseFloat(value) : value },
    })
  );

  return {
    version: '1.0',
    collections: [
      {
        name: tokens.meta.name,
        modes: [{ name: 'Mode 1', modeId: 'mode-1' }],
        variables: [...colorVariables, ...spacingVariables],
      },
    ],
  };
}

function generateStyleDictionary(tokens) {
  const colorTokens = {};
  Object.entries(tokens.colors).forEach(([name, colorObj]) => {
    if (typeof colorObj === 'object') {
      colorTokens[name] = {};
      Object.entries(colorObj).forEach(([shade, value]) => {
        if (shade !== 'rationale' && typeof value === 'string' && value.startsWith('#')) {
          colorTokens[name][shade] = {
            value: value,
            type: 'color',
          };
        }
      });
      if (colorObj.rationale) {
        colorTokens[name]['$description'] = colorObj.rationale;
      }
    }
  });

  return {
    '$metadata': {
      name: tokens.meta.name,
      version: tokens.meta.version,
      generator: 'nano-ui',
      uniquenessScore: tokens.meta.uniquenessScore,
    },
    color: colorTokens,
    typography: {
      display: { value: tokens.typography.display, type: 'typography' },
      body: { value: tokens.typography.body, type: 'typography' },
    },
  };
}

function generateFigmaTokens(tokens) {
  const global = {};
  Object.entries(tokens.colors).forEach(([name, colorObj]) => {
    if (typeof colorObj === 'object') {
      Object.entries(colorObj).forEach(([shade, value]) => {
        if (shade !== 'rationale' && typeof value === 'string' && value.startsWith('#')) {
          global['color-' + name + '-' + shade] = { value: value, type: 'color' };
        }
      });
    }
  });
  return { global, '$themes': [], '$metadata': { tokenSetOrder: ['global'] } };
}

// Generate files
const figmaExports = {
  'figma-variables.json': JSON.stringify(generateFigmaVariables(tokensJson), null, 2),
  'style-dictionary.json': JSON.stringify(generateStyleDictionary(tokensJson), null, 2),
  'figma-tokens.json': JSON.stringify(generateFigmaTokens(tokensJson), null, 2),
};

for (const [filename, content] of Object.entries(figmaExports)) {
  const filePath = path.join(__dirname, '../example/test1/design-system', filename);
  fs.writeFileSync(filePath, content);
  console.log('Generated:', filename);
}

console.log('All Figma exports generated!');
