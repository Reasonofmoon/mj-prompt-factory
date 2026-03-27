/**
 * MJ Prompt Factory — Gemini API Integration
 * Expands Korean concepts into Midjourney-optimized English prompts using Google Gemini
 */

const GEMINI_MODELS = {
  'gemini-2.5-flash': 'gemini-2.5-flash',
  'gemini-2.5-pro': 'gemini-2.5-pro',
};

/**
 * Expand a concept into multiple MJ prompts using Gemini
 * @param {string} concept - Korean concept description
 * @param {number} count - Number of variations to generate
 * @param {string} [modelKey] - Model key from GEMINI_MODELS
 * @returns {string[]} Array of prompt strings
 */
function expandWithGemini(concept, count, modelKey) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error(
      'Gemini API 키가 설정되지 않았습니다.\n' +
      'MJ Prompt Factory > AI Settings > Set Gemini API Key에서 설정하세요.'
    );
  }
  
  const modelId = GEMINI_MODELS[modelKey] || GEMINI_MODELS['gemini-2.5-flash'];
  
  const systemInstruction = `You are a Midjourney V7 prompt expert. Your task is to convert Korean concepts into highly detailed, optimized Midjourney V7 prompts in English.

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
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
  
  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [{
      parts: [{ text: userMessage }]
    }],
    generationConfig: {
      temperature: 1.0,
      maxOutputTokens: 2000,
    },
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const statusCode = response.getResponseCode();
  
  if (statusCode !== 200) {
    const errorBody = response.getContentText();
    
    if (statusCode === 400) {
      throw new Error('요청 오류: API 키 또는 모델명을 확인하세요.\n' + errorBody.substring(0, 200));
    } else if (statusCode === 403) {
      throw new Error('API 키가 유효하지 않거나 Gemini API가 활성화되지 않았습니다.');
    } else if (statusCode === 429) {
      throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.');
    } else {
      throw new Error(`Gemini API 오류 (${statusCode}): ${errorBody.substring(0, 200)}`);
    }
  }
  
  const result = JSON.parse(response.getContentText());
  
  // Extract text from Gemini response
  if (!result.candidates || result.candidates.length === 0) {
    throw new Error('Gemini 응답이 비어있습니다. 다시 시도하세요.');
  }
  
  const candidate = result.candidates[0];
  if (candidate.finishReason === 'SAFETY') {
    throw new Error('Gemini 안전 필터에 의해 차단되었습니다. 콘셉트를 수정하세요.');
  }
  
  const text = candidate.content.parts.map(p => p.text).join('\n');
  
  // Parse numbered prompts (reuse the same parser)
  const prompts = parseNumberedPromptsGemini_(text);
  
  if (prompts.length === 0) {
    throw new Error('Gemini 응답에서 프롬프트를 파싱할 수 없습니다.');
  }
  
  return prompts;
}

/**
 * Expand from sidebar using Gemini
 * @param {string} concept - Korean concept
 * @param {number} count - Number of variations
 * @param {string} modelKey - Model key
 * @returns {Object} Result with prompts array and count
 */
function expandFromSidebarGemini(concept, count, modelKey) {
  const prompts = expandWithGemini(concept, count, modelKey);
  appendToQueue(prompts, 'Gemini: ' + concept.substring(0, 30));
  return { prompts: prompts, count: prompts.length };
}

/**
 * Check if Gemini API key is configured
 * @returns {boolean}
 */
function hasGeminiApiKey() {
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  return !!key;
}

/**
 * Save Gemini API key from sidebar
 * @param {string} key
 */
function saveGeminiApiKey(key) {
  PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', key.trim());
  return { success: true };
}

/**
 * Get available Gemini models
 * @returns {Array<Object>}
 */
function getGeminiModels() {
  return Object.keys(GEMINI_MODELS).map(key => ({
    key: key,
    name: key,
    id: GEMINI_MODELS[key],
  }));
}

// ============================================
// Helpers
// ============================================

/**
 * Parse numbered list from Gemini response
 */
function parseNumberedPromptsGemini_(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const prompts = [];
  
  for (const line of lines) {
    // Match patterns: "1. ...", "1) ...", "1: ...", "**1.** ..."
    const match = line.match(/^\*{0,2}\d+[\.\)\:]\*{0,2}\s*(.+)/);
    if (match) {
      let prompt = match[1].trim();
      // Remove surrounding quotes and bold markers
      prompt = prompt.replace(/^\*{1,2}|^\*{1,2}$/g, '');
      prompt = prompt.replace(/^["']|["']$/g, '').trim();
      if (prompt.length > 0) {
        prompts.push(prompt);
      }
    }
  }
  
  return prompts;
}
