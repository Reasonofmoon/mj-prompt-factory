/**
 * MJ Prompt Factory — Queue Manager
 * Handles reading, updating, and statistics for the Queue sheet
 */

/**
 * Get current queue statistics
 * @returns {Object} Stats object
 */
function getQueueStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.QUEUE);
  
  if (!sheet || sheet.getLastRow() <= 1) {
    return { total: 0, pending: 0, copied: 0, done: 0, skipped: 0 };
  }
  
  const statuses = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat();
  
  return {
    total: statuses.length,
    pending: statuses.filter(s => s === STATUS.PENDING).length,
    copied: statuses.filter(s => s === STATUS.COPIED).length,
    done: statuses.filter(s => s === STATUS.DONE).length,
    skipped: statuses.filter(s => s === STATUS.SKIPPED).length,
  };
}

/**
 * Get a specific prompt by index (0-based)
 * @param {number} index - 0-based index in queue
 * @returns {Object|null} Prompt data
 */
function getPromptAt(index) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.QUEUE);
  
  if (!sheet || sheet.getLastRow() <= 1) return null;
  
  const row = index + 2; // +2 for 0-based index and header row
  if (row > sheet.getLastRow()) return null;
  
  const data = sheet.getRange(row, 1, 1, 5).getValues()[0];
  
  return {
    index: index,
    row: row,
    number: data[0],
    prompt: data[1],
    status: data[2],
    copiedAt: data[3],
    tags: data[4],
    charCount: data[1] ? data[1].toString().length : 0,
  };
}

/**
 * Get the index of the next pending prompt
 * @param {number} [fromIndex=0] - Start searching from this index
 * @returns {number} Index of next pending, or -1 if none
 */
function getNextPendingIndex(fromIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.QUEUE);
  
  if (!sheet || sheet.getLastRow() <= 1) return -1;
  
  const statuses = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat();
  const start = fromIndex || 0;
  
  for (let i = start; i < statuses.length; i++) {
    if (statuses[i] === STATUS.PENDING) return i;
  }
  
  // Wrap around
  for (let i = 0; i < start; i++) {
    if (statuses[i] === STATUS.PENDING) return i;
  }
  
  return -1;
}

/**
 * Update the status of a queue item
 * @param {number} index - 0-based index
 * @param {string} newStatus - One of STATUS constants
 */
function updateQueueStatus(index, newStatus) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.QUEUE);
  
  if (!sheet) return;
  
  const row = index + 2;
  if (row > sheet.getLastRow()) return;
  
  // Update status
  const statusCell = sheet.getRange(row, 3);
  statusCell.setValue(newStatus);
  
  // Set background color based on status
  switch (newStatus) {
    case STATUS.PENDING:
      statusCell.setBackground(COLORS.PENDING);
      break;
    case STATUS.COPIED:
      statusCell.setBackground(COLORS.COPIED);
      sheet.getRange(row, 4).setValue(new Date());
      break;
    case STATUS.DONE:
      statusCell.setBackground(COLORS.DONE);
      break;
    case STATUS.SKIPPED:
      statusCell.setBackground(COLORS.SKIPPED);
      break;
  }
}

/**
 * Mark current as copied and return the next pending prompt data
 * Called from sidebar for the "Copy & Next" workflow
 * @param {number} currentIndex - Current 0-based index
 * @returns {Object} { current, next, stats }
 */
function copyAndNext(currentIndex) {
  // Mark current as copied
  updateQueueStatus(currentIndex, STATUS.COPIED);
  
  // Find next pending
  const nextIndex = getNextPendingIndex(currentIndex + 1);
  const nextPrompt = nextIndex >= 0 ? getPromptAt(nextIndex) : null;
  const stats = getQueueStats();
  
  return {
    nextIndex: nextIndex,
    nextPrompt: nextPrompt,
    stats: stats,
  };
}

/**
 * Mark as done (after pasting into Midjourney)
 * @param {number} index
 */
function markDone(index) {
  updateQueueStatus(index, STATUS.DONE);
  return getQueueStats();
}

/**
 * Skip a prompt
 * @param {number} currentIndex
 * @returns {Object} Next prompt data
 */
function skipPrompt(currentIndex) {
  updateQueueStatus(currentIndex, STATUS.SKIPPED);
  
  const nextIndex = getNextPendingIndex(currentIndex + 1);
  const nextPrompt = nextIndex >= 0 ? getPromptAt(nextIndex) : null;
  const stats = getQueueStats();
  
  return {
    nextIndex: nextIndex,
    nextPrompt: nextPrompt,
    stats: stats,
  };
}

/**
 * Get initial data for sidebar load
 * @returns {Object} Initial state
 */
function getSidebarInitData() {
  const stats = getQueueStats();
  const firstPendingIndex = getNextPendingIndex(0);
  const currentPrompt = firstPendingIndex >= 0 ? getPromptAt(firstPendingIndex) : null;
  const templates = getTemplateList();
  const apiKeySet = hasApiKey();
  const geminiApiKeySet = hasGeminiApiKey();
  
  return {
    stats: stats,
    currentIndex: firstPendingIndex,
    currentPrompt: currentPrompt,
    templates: templates,
    apiKeySet: apiKeySet,
    geminiApiKeySet: geminiApiKeySet,
  };
}
