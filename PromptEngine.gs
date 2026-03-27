/**
 * MJ Prompt Factory — Prompt Engine
 * Combinatorial prompt generation from templates + variables
 */

/**
 * Main generation function
 * @param {number} templateRow - Row number in Templates sheet
 * @param {string} mode - 'cartesian' | 'oneToOne' | 'random'
 * @param {number} [randomN] - Number of random prompts (for 'random' mode)
 * @returns {number} Number of generated prompts
 */
function generatePrompts(templateRow, mode, randomN) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Read template
  const templateSheet = ss.getSheetByName(SHEET_NAMES.TEMPLATES);
  const templateData = templateSheet.getRange(templateRow, 1, 1, 5).getValues()[0];
  const templateName = templateData[0];
  const basePrompt = templateData[1];
  const fixedParams = templateData[2] || '';
  const styleRef = templateData[3] || '';
  
  // Find placeholders in template
  const placeholders = findPlaceholders_(basePrompt);
  
  if (placeholders.length === 0) {
    // No placeholders — just add the template as-is
    const fullPrompt = buildFullPrompt_(basePrompt, fixedParams, styleRef);
    appendToQueue([fullPrompt], templateName);
    return 1;
  }
  
  // Read variables
  const variableMap = readVariables_(ss, placeholders);
  
  // Generate based on mode
  let prompts = [];
  
  switch (mode) {
    case 'cartesian':
      prompts = generateCartesian_(basePrompt, variableMap);
      break;
    case 'oneToOne':
      prompts = generateOneToOne_(basePrompt, variableMap);
      break;
    case 'random':
      prompts = generateRandom_(basePrompt, variableMap, randomN || 10);
      break;
    default:
      throw new Error('Unknown mode: ' + mode);
  }
  
  // Append fixed params and style ref
  const fullPrompts = prompts.map(p => buildFullPrompt_(p, fixedParams, styleRef));
  
  // Write to Queue
  appendToQueue(fullPrompts, templateName);
  
  return fullPrompts.length;
}

/**
 * Generate prompts from sidebar (called via google.script.run)
 * @param {number} templateIndex - 1-based template index
 * @param {string} mode - Generation mode
 * @param {number} randomN - Number for random mode
 * @returns {Object} Result with count
 */
function generateFromSidebar(templateIndex, mode, randomN) {
  const templateRow = templateIndex + 1; // +1 for header
  const count = generatePrompts(templateRow, mode, randomN);
  return { count: count };
}

/**
 * Get list of template names for sidebar
 * @returns {Array<Object>} Template list
 */
function getTemplateList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.TEMPLATES);
  if (!sheet || sheet.getLastRow() <= 1) return [];
  
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  return data.map((row, i) => ({
    index: i + 1,
    name: row[0],
    prompt: row[1],
  }));
}

// ============================================
// Generation Modes
// ============================================

/**
 * Cartesian product — all combinations
 */
function generateCartesian_(template, variableMap) {
  const keys = Object.keys(variableMap);
  if (keys.length === 0) return [template];
  
  // Build arrays of values for each variable
  const valueSets = keys.map(k => variableMap[k]);
  
  // Cartesian product
  const combinations = cartesianProduct_(valueSets);
  
  return combinations.map(combo => {
    let result = template;
    keys.forEach((key, i) => {
      result = result.replace(new RegExp(escapeRegex_(key), 'g'), combo[i]);
    });
    return result;
  });
}

/**
 * 1:1 matching — same index across all variables
 */
function generateOneToOne_(template, variableMap) {
  const keys = Object.keys(variableMap);
  if (keys.length === 0) return [template];
  
  const maxLen = Math.max(...keys.map(k => variableMap[k].length));
  const results = [];
  
  for (let i = 0; i < maxLen; i++) {
    let result = template;
    keys.forEach(key => {
      const values = variableMap[key];
      const value = values[i % values.length]; // Wrap around if shorter
      result = result.replace(new RegExp(escapeRegex_(key), 'g'), value);
    });
    results.push(result);
  }
  
  return results;
}

/**
 * Random N — randomly sample N combinations
 */
function generateRandom_(template, variableMap, n) {
  const keys = Object.keys(variableMap);
  if (keys.length === 0) return [template];
  
  const results = [];
  
  for (let i = 0; i < n; i++) {
    let result = template;
    keys.forEach(key => {
      const values = variableMap[key];
      const randomValue = values[Math.floor(Math.random() * values.length)];
      result = result.replace(new RegExp(escapeRegex_(key), 'g'), randomValue);
    });
    results.push(result);
  }
  
  // Deduplicate
  return [...new Set(results)];
}

// ============================================
// Helpers
// ============================================

/**
 * Find all {placeholder} patterns in a template string
 */
function findPlaceholders_(template) {
  const matches = template.match(/\{[^}]+\}/g);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Read variable values from Variables sheet
 */
function readVariables_(ss, placeholders) {
  const sheet = ss.getSheetByName(SHEET_NAMES.VARIABLES);
  if (!sheet || sheet.getLastRow() <= 1) return {};
  
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const map = {};
  
  placeholders.forEach(ph => {
    const row = data.find(r => r[0] === ph);
    if (row) {
      // Get non-empty values from columns B onwards
      const values = row.slice(1).filter(v => v !== '' && v !== null && v !== undefined);
      if (values.length > 0) {
        map[ph] = values.map(String);
      }
    }
  });
  
  return map;
}

/**
 * Build final prompt with fixed params and style ref
 */
function buildFullPrompt_(prompt, fixedParams, styleRef) {
  let full = prompt.trim();
  if (fixedParams) full += ' ' + fixedParams.trim();
  if (styleRef) full += ' ' + styleRef.trim();
  return full;
}

/**
 * Append prompts to Queue sheet
 * @param {string[]} prompts - Array of prompt strings
 * @param {string} [tag] - Optional tag
 */
function appendToQueue(prompts, tag) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAMES.QUEUE);
  if (!sheet) {
    setupAllSheets();
    sheet = ss.getSheetByName(SHEET_NAMES.QUEUE);
  }
  
  const startNum = sheet.getLastRow(); // Current last row = next number
  
  const rows = prompts.map((p, i) => [
    startNum + i, // #
    p,             // Prompt
    STATUS.PENDING, // Status
    '',            // Copied At
    tag || '',     // Tags
  ]);
  
  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
    
    // Color the status column
    const statusRange = sheet.getRange(sheet.getLastRow() - rows.length + 1, 3, rows.length, 1);
    statusRange.setBackground(COLORS.PENDING);
  }
}

/**
 * Cartesian product of arrays
 */
function cartesianProduct_(arrays) {
  if (arrays.length === 0) return [[]];
  
  return arrays.reduce((acc, curr) => {
    const result = [];
    acc.forEach(a => {
      curr.forEach(b => {
        result.push([...a, b]);
      });
    });
    return result;
  }, [[]]);
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex_(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
