/**
 * MJ Prompt Factory — Claude API Integration
 * Expands Korean concepts into Midjourney-optimized English prompts
 */

/**
 * Expand a concept into multiple MJ prompts using Claude
 * @param {string} concept - Korean concept description
 * @param {number} count - Number of variations to generate
 * @returns {string[]} Array of prompt strings
 */
function expandWithClaude(concept, count) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  
  if (!apiKey) {
    throw new Error(
      'Anthropic API 키가 설정되지 않았습니다.\n' +
      'MJ Prompt Factory > Claude AI > Set API Key에서 설정하세요.'
    );
  }
  
  const systemPrompt = `You are a Midjourney V7 prompt expert. Your task is to convert Korean concepts into highly detailed, optimized Midjourney V7 prompts in English.

Rules:
1. Output ONLY the prompts, one per line, numbered (1. 2. 3. etc.)
2. Each prompt should be unique with different compositions, angles, styles, or moods
3. Include relevant Midjourney V7 parameters: --ar (aspect ratio), --v 7
4. Use descriptive photography/art terminology: lighting, composition, texture, atmosphere
5. Keep each prompt under 300 characters
6. Do NOT include --q or --s parameters (user will add these separately)
7. Do NOT wrap in quotes or add explanations
8. Each variation should feel distinctly different while staying true to the core concept`;

  const userMessage = `다음 콘셉트로 미드저니 V7 프롬프트 ${count}개를 만들어주세요:\n\n"${concept}"`;
  
  const payload = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userMessage }
    ],
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  
  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
  const statusCode = response.getResponseCode();
  
  if (statusCode !== 200) {
    const errorBody = response.getContentText();
    
    if (statusCode === 401) {
      throw new Error('API 키가 유효하지 않습니다. 키를 다시 확인하세요.');
    } else if (statusCode === 429) {
      throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.');
    } else {
      throw new Error(`API 오류 (${statusCode}): ${errorBody.substring(0, 200)}`);
    }
  }
  
  const result = JSON.parse(response.getContentText());
  const text = result.content[0].text;
  
  // Parse numbered prompts
  const prompts = parseNumberedPrompts_(text);
  
  if (prompts.length === 0) {
    throw new Error('Claude 응답에서 프롬프트를 파싱할 수 없습니다.');
  }
  
  return prompts;
}

/**
 * Expand a concept from sidebar
 * @param {string} concept - Korean concept
 * @param {number} count - Number of variations
 * @returns {Object} Result with prompts array and count
 */
function expandFromSidebar(concept, count) {
  const prompts = expandWithClaude(concept, count);
  appendToQueue(prompts, 'AI: ' + concept.substring(0, 30));
  return { prompts: prompts, count: prompts.length };
}

/**
 * Check if API key is configured
 * @returns {boolean}
 */
function hasApiKey() {
  const key = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  return !!key;
}

/**
 * Save API key from sidebar
 * @param {string} key
 */
function saveApiKey(key) {
  PropertiesService.getScriptProperties().setProperty('ANTHROPIC_API_KEY', key.trim());
  return { success: true };
}

// ============================================
// Helpers
// ============================================

/**
 * Parse numbered list from Claude response
 * Handles formats like "1. prompt", "1) prompt", etc.
 */
function parseNumberedPrompts_(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const prompts = [];
  
  for (const line of lines) {
    // Match patterns: "1. ...", "1) ...", "1: ..."
    const match = line.match(/^\d+[\.\)\:]\s*(.+)/);
    if (match) {
      const prompt = match[1].trim();
      // Remove surrounding quotes if present
      const cleaned = prompt.replace(/^["']|["']$/g, '').trim();
      if (cleaned.length > 0) {
        prompts.push(cleaned);
      }
    }
  }
  
  return prompts;
}
