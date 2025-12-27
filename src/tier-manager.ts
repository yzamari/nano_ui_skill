/**
 * Tier Manager for Nano UI
 * Simplified for free tier - just checks for Gemini API key
 */

export interface ApiKeyStatus {
  hasKey: boolean;
  keyType: 'gemini' | 'none';
}

/**
 * Check if Gemini API key is configured
 */
export function checkApiKey(): ApiKeyStatus {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey && geminiKey.length > 10) {
    return { hasKey: true, keyType: 'gemini' };
  }

  return { hasKey: false, keyType: 'none' };
}

/**
 * Get setup instructions if no API key
 */
export function getSetupInstructions(): string {
  return `
🔑 Gemini API Key Required

To use Nano UI, you need a free Gemini API key from Google.

1. Go to: https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key
4. Add to your environment:

   export GEMINI_API_KEY=your-api-key-here

   Or in Claude Code:
   claude config set GEMINI_API_KEY your-api-key-here

Then run the command again!
`;
}

/**
 * Validate API key is present, throw if not
 */
export function requireApiKey(): void {
  const status = checkApiKey();
  if (!status.hasKey) {
    throw new Error(getSetupInstructions());
  }
}

/**
 * Get current status message
 */
export function getStatusMessage(): string {
  const status = checkApiKey();

  if (status.hasKey) {
    return `✓ Gemini API key configured - ready to generate!`;
  }

  return getSetupInstructions();
}
