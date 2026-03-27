/**
 * MJ Prompt Factory — Main Entry Point
 * Google Apps Script for Midjourney V7 Batch Prompt Management
 */

// ============================================
// Constants
// ============================================
const SHEET_NAMES = {
  TEMPLATES: 'Templates',
  VARIABLES: 'Variables',
  QUEUE: 'Queue',
  PRESETS: 'Presets',
};

const STATUS = {
  PENDING: '⏳ 대기',
  COPIED: '📋 복사됨',
  DONE: '✅ 완료',
  SKIPPED: '❌ 스킵',
};

const COLORS = {
  HEADER_BG: '#1a1a2e',
  HEADER_TEXT: '#e0e0ff',
  PENDING: '#fef3c7',
  COPIED: '#dbeafe',
  DONE: '#d1fae5',
  SKIPPED: '#fee2e2',
};

// ============================================
// Menu & Sidebar
// ============================================

/**
 * Adds custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎨 MJ Prompt Factory')
    .addItem('📋 Open Sidebar', 'showSidebar')
    .addSeparator()
    .addItem('🏗️ Initialize Sheets', 'initializeSheets')
    .addSeparator()
    .addSubMenu(ui.createMenu('🧬 Generate Prompts')
      .addItem('Cartesian (All Combinations)', 'generateCartesian')
      .addItem('1:1 Matching', 'generateOneToOne')
      .addItem('Random N', 'generateRandomN'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🤖 Claude AI')
      .addItem('Expand Selected Concept', 'expandSelectedConcept')
      .addItem('Set API Key', 'setClaudeApiKey'))
    .addSubMenu(ui.createMenu('💎 Gemini AI')
      .addItem('Expand with Gemini 2.5 Flash', 'expandSelectedConceptGeminiFlash')
      .addItem('Expand with Gemini 2.5 Pro', 'expandSelectedConceptGeminiPro')
      .addItem('Set API Key', 'setGeminiApiKey'))
    .addSeparator()
    .addItem('🗑️ Clear Queue', 'clearQueue')
    .addToUi();
}

/**
 * Opens the sidebar UI
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('MJ Prompt Factory')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Web App entry point — serves full-page UI
 * Deploy: 배포 > 새 배포 > 웹 앱
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('MJ Prompt Factory')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Initialize all sheet structures
 */
function initializeSheets() {
  setupAllSheets();
  SpreadsheetApp.getActiveSpreadsheet().toast('시트 초기화 완료!', 'MJ Prompt Factory', 3);
}

// ============================================
// Menu Action Wrappers
// ============================================

function generateCartesian() {
  const templateRow = getSelectedTemplateRow_();
  if (!templateRow) return;
  const count = generatePrompts(templateRow, 'cartesian');
  SpreadsheetApp.getActiveSpreadsheet().toast(
    `${count}개 프롬프트가 Queue에 추가되었습니다.`, 'Generate Complete', 3
  );
}

function generateOneToOne() {
  const templateRow = getSelectedTemplateRow_();
  if (!templateRow) return;
  const count = generatePrompts(templateRow, 'oneToOne');
  SpreadsheetApp.getActiveSpreadsheet().toast(
    `${count}개 프롬프트가 Queue에 추가되었습니다.`, 'Generate Complete', 3
  );
}

function generateRandomN() {
  const ui = SpreadsheetApp.getUi();
  const templateRow = getSelectedTemplateRow_();
  if (!templateRow) return;
  
  const response = ui.prompt('Random N', '생성할 프롬프트 개수를 입력하세요:', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const n = parseInt(response.getResponseText(), 10);
  if (isNaN(n) || n <= 0) {
    ui.alert('유효한 숫자를 입력하세요.');
    return;
  }
  
  const count = generatePrompts(templateRow, 'random', n);
  SpreadsheetApp.getActiveSpreadsheet().toast(
    `${count}개 프롬프트가 Queue에 추가되었습니다.`, 'Generate Complete', 3
  );
}

function expandSelectedConcept() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Claude AI 프롬프트 확장',
    '한국어 콘셉트를 입력하세요 (예: "네온 도시를 걷는 사이버펑크 고양이"):',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const concept = response.getResponseText().trim();
  if (!concept) return;
  
  const countResponse = ui.prompt(
    '변형 개수',
    '몇 개의 변형을 만들까요? (기본: 5)',
    ui.ButtonSet.OK_CANCEL
  );
  
  let count = 5;
  if (countResponse.getSelectedButton() === ui.Button.OK) {
    const parsed = parseInt(countResponse.getResponseText(), 10);
    if (!isNaN(parsed) && parsed > 0) count = parsed;
  }
  
  try {
    const prompts = expandWithClaude(concept, count);
    appendToQueue(prompts);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `Claude가 ${prompts.length}개 프롬프트를 생성했습니다.`, 'AI Generate', 5
    );
  } catch (e) {
    ui.alert('오류: ' + e.message);
  }
}

function setClaudeApiKey() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Anthropic API Key 설정',
    'API 키를 입력하세요 (sk-ant-...):',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const key = response.getResponseText().trim();
  if (!key) return;
  
  PropertiesService.getScriptProperties().setProperty('ANTHROPIC_API_KEY', key);
  ui.alert('Claude API 키가 저장되었습니다.');
}

function setGeminiApiKey() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Google Gemini API Key 설정',
    'API 키를 입력하세요 (AI Studio에서 발급):',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const key = response.getResponseText().trim();
  if (!key) return;
  
  PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', key);
  ui.alert('Gemini API 키가 저장되었습니다.');
}

function expandSelectedConceptGeminiFlash() {
  expandSelectedConceptGemini_('gemini-2.5-flash');
}

function expandSelectedConceptGeminiPro() {
  expandSelectedConceptGemini_('gemini-2.5-pro');
}

function expandSelectedConceptGemini_(modelKey) {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Gemini AI 프롬프트 확장',
    '한국어 콘셉트를 입력하세요 (예: "네온 도시를 걷는 사이버펑크 고양이"):',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const concept = response.getResponseText().trim();
  if (!concept) return;
  
  const countResponse = ui.prompt(
    '변형 개수',
    '몇 개의 변형을 만들까요? (기본: 5)',
    ui.ButtonSet.OK_CANCEL
  );
  
  let count = 5;
  if (countResponse.getSelectedButton() === ui.Button.OK) {
    const parsed = parseInt(countResponse.getResponseText(), 10);
    if (!isNaN(parsed) && parsed > 0) count = parsed;
  }
  
  try {
    const prompts = expandWithGemini(concept, count, modelKey);
    appendToQueue(prompts, 'Gemini: ' + concept.substring(0, 30));
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `Gemini가 ${prompts.length}개 프롬프트를 생성했습니다.`, 'AI Generate', 5
    );
  } catch (e) {
    ui.alert('오류: ' + e.message);
  }
}

function clearQueue() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Queue 초기화',
    'Queue의 모든 프롬프트를 삭제하시겠습니까?',
    ui.ButtonSet.YES_NO
  );
  if (response !== ui.Button.YES) return;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.QUEUE);
  if (sheet && sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }
  ss.toast('Queue가 초기화되었습니다.', 'MJ Prompt Factory', 3);
}

// ============================================
// Helpers
// ============================================

/**
 * Gets the selected template row number from Templates sheet
 * @returns {number|null}
 */
function getSelectedTemplateRow_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();
  
  if (sheet.getName() !== SHEET_NAMES.TEMPLATES) {
    // Ask user to select a template
    const templateSheet = ss.getSheetByName(SHEET_NAMES.TEMPLATES);
    if (!templateSheet || templateSheet.getLastRow() <= 1) {
      ui.alert('Templates 시트에 템플릿을 먼저 추가하세요.');
      return null;
    }
    
    const data = templateSheet.getRange(2, 1, templateSheet.getLastRow() - 1, 1).getValues();
    const names = data.map((r, i) => `${i + 1}. ${r[0]}`).join('\n');
    
    const response = ui.prompt(
      '템플릿 선택',
      `사용할 템플릿 번호를 입력하세요:\n\n${names}`,
      ui.ButtonSet.OK_CANCEL
    );
    if (response.getSelectedButton() !== ui.Button.OK) return null;
    
    const idx = parseInt(response.getResponseText(), 10);
    if (isNaN(idx) || idx < 1 || idx > data.length) {
      ui.alert('유효한 번호를 입력하세요.');
      return null;
    }
    return idx + 1; // +1 for header row
  }
  
  const row = sheet.getActiveRange().getRow();
  if (row <= 1) {
    ui.alert('템플릿 행을 선택하세요 (헤더 제외).');
    return null;
  }
  return row;
}
