/**
 * MJ Prompt Factory — Sheet Setup
 * Creates and formats the 4 core sheets with sample data
 */

function setupAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  setupTemplatesSheet_(ss);
  setupVariablesSheet_(ss);
  setupQueueSheet_(ss);
  setupPresetsSheet_(ss);
  
  // Activate Queue sheet
  const queueSheet = ss.getSheetByName(SHEET_NAMES.QUEUE);
  if (queueSheet) ss.setActiveSheet(queueSheet);
}

// ============================================
// Templates Sheet
// ============================================
function setupTemplatesSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.TEMPLATES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.TEMPLATES);
  }
  
  // Headers
  const headers = ['Template Name', 'Base Prompt', 'Fixed Params', 'Style Ref (--sref)', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader_(sheet, headers.length);
  
  // Sample data — expanded with Darlkom DNA integration
  if (sheet.getLastRow() <= 1) {
    const samples = [
      // ─── Product & Commercial ───
      [
        'Product Photo Series',
        '{subject} on {surface}, {lighting}, editorial photography, high detail --ar {ratio} --v 7',
        '--q 2 --s 750',
        '',
        '제품 촬영 기본 템플릿'
      ],
      [
        'Editorial Lookbook',
        '{subject}, {material_texture}, fashion editorial, clean background, studio setup, soft diffused light --ar 3:4 --v 7',
        '--q 2 --s 800',
        '',
        '패션/제품 룩북'
      ],
      // ─── Character & Concept Art ───
      [
        'Character Concept Art',
        '{character} in {environment}, {art_style}, dramatic composition --ar 2:3 --v 7',
        '--q 2 --s 800',
        '',
        '캐릭터 컨셉 아트'
      ],
      [
        'D&D Character Sheet',
        'full body character design of {character}, {art_style}, RPG character sheet layout, multiple poses, white background --ar 3:4 --v 7',
        '--q 2 --s 850',
        '',
        'TRPG 캐릭터 시트'
      ],
      // ─── Cinematic & Landscape ───
      [
        'Landscape Cinematic',
        '{scene}, cinematic wide shot, {mood} atmosphere, {time_of_day}, volumetric lighting --ar 16:9 --v 7',
        '--q 2 --s 900',
        '',
        '시네마틱 풍경'
      ],
      [
        'Film Still',
        'cinematic film still, {scene}, shot on Arri Alexa, anamorphic lens flare, {mood}, color graded --ar 21:9 --v 7',
        '--q 2 --s 900',
        '',
        '영화 스틸컷'
      ],
      // ─── Darlkom DNA Styles ───
      [
        '🧬 DNA: Papercraft Shadow-Box',
        'macro product photography of {dna_object} constructed from multi-layered matte cardstock in a shadow-box diorama, subsurface scattering paper texture, chiaroscuro lighting with tyndall rays, deep distinct focal planes, 8k, octane render --ar 16:9 --v 7',
        '--q 2 --s 900',
        '',
        '🧬 Darlkom DNA_NB_CRAFT — 페이퍼크래프트'
      ],
      [
        '🧬 DNA: Bauhaus Grid',
        '{subject}, bauhaus style, {dna_palette}, geometric shapes, modular grid composition, matte texture, screen print aesthetic, bold artistic --ar 16:9 --v 7',
        '--q 2 --s 800',
        '',
        '🧬 Darlkom DNA_002 — 바우하우스'
      ],
      [
        '🧬 DNA: Cyberpunk Neon Rain',
        '{subject}, cyberpunk city at night, neon rain, {dna_palette}, reflection on wet pavement, futuristic UI overlay, glowing accents, cinematic --ar 16:9 --v 7',
        '--q 2 --s 850',
        '',
        '🧬 Darlkom DNA_003 — 사이버펑크'
      ],
      [
        '🧬 DNA: Doodle Notebook',
        '{subject}, hand-drawn doodle style, blue ink on lined paper, notebook sketch aesthetic, raw and authentic, creative brainstorming visuals, white paper texture --ar 4:3 --v 7',
        '--q 2 --s 700',
        '',
        '🧬 Darlkom DNA_001 — 노트북 낙서'
      ],
      [
        '🧬 DNA: Watercolor Fantasy Map',
        '{scene}, watercolor painting, fantasy map style, soft edges, {dna_palette}, delicate washes, parchment texture, hand-painted feel --ar 16:9 --v 7',
        '--q 2 --s 850',
        '',
        '🧬 Darlkom DNA_013 — 수채화 판타지'
      ],
      [
        '🧬 DNA: Clay Stopmotion',
        '{subject}, claymation style, stopmotion aesthetic, miniature set, warm studio lighting, handcrafted feel, cute and tactile --ar 1:1 --v 7',
        '--q 2 --s 800',
        '',
        '🧬 Darlkom DNA_007 — 클레이 스톱모션'
      ],
      // ─── Typography & Design ───
      [
        'Typography Poster',
        'typographic poster design, "{text_content}", {art_style}, {dna_palette}, bold composition, editorial layout --ar 2:3 --v 7',
        '--q 2 --s 850',
        '',
        '타이포그래피 포스터'
      ],
      [
        'Logo Concept',
        'minimalist logo design for {subject}, {art_style}, vector, clean lines, professional, white background --ar 1:1 --v 7',
        '--q 2 --s 600',
        '',
        '로고 컨셉'
      ],
    ];
    sheet.getRange(2, 1, samples.length, samples[0].length).setValues(samples);
  }
  
  // Column widths
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 500);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 200);
}

// ============================================
// Variables Sheet
// ============================================
function setupVariablesSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.VARIABLES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.VARIABLES);
  }
  
  // Headers
  const headers = ['Variable Name', 'Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader_(sheet, headers.length);
  
  // Sample data — expanded with Darlkom DNA variables
  if (sheet.getLastRow() <= 1) {
    const samples = [
      // ─── Core Variables ───
      ['{subject}', 'white sneakers', 'black leather handbag', 'gold wristwatch', 'ceramic vase', 'perfume bottle'],
      ['{surface}', 'marble surface', 'dark wood table', 'concrete floor', 'silk fabric', 'wet stone'],
      ['{lighting}', 'soft studio lighting', 'golden hour sunlight', 'neon glow', 'dramatic side light', 'natural window light'],
      ['{ratio}', '4:3', '1:1', '3:4', '16:9', '21:9'],
      ['{character}', 'a wise old wizard', 'a cyber samurai', 'a forest elf', 'a space explorer', 'a steampunk inventor'],
      ['{environment}', 'ancient library', 'neon-lit city', 'enchanted forest', 'space station', 'underwater ruins'],
      ['{art_style}', 'oil painting style', 'digital concept art', 'watercolor', 'anime style', 'vector illustration'],
      ['{scene}', 'misty mountain valley', 'abandoned cathedral', 'alien planet surface', 'underwater ruins', 'floating sky islands'],
      ['{mood}', 'ethereal', 'mysterious', 'peaceful', 'apocalyptic', 'whimsical'],
      ['{time_of_day}', 'sunrise', 'blue hour', 'midnight', 'golden hour', 'overcast noon'],
      // ─── Darlkom DNA Variables ───
      ['{dna_object}', 'stacked paper books and graduation cap', 'paper telescope and star maps', 'paper chef hat and recipe cards', 'paper camera and video frame', 'abstract 3D paper data-cube'],
      ['{dna_palette}', 'cream #F8F1E7 + sky blue #4A90E2', 'black #1A1A1A + gold #FFD700', 'dark blue #050510 + cyan #00FFFF', 'blue ink #0000CD on white', 'teal #4ECDC4 + yellow #FFE66D'],
      ['{material_texture}', 'matte cardstock, paper grain', 'wet asphalt, neon reflection', 'lined paper, ink bleed', 'screen print, slight grain', 'parchment, watercolor wash'],
      ['{text_content}', 'DESIGN DNA', 'FUTURE NOW', 'CREATE MORE', 'THINK VISUAL', 'MAKE BOLD'],
    ];
    sheet.getRange(2, 1, samples.length, samples[0].length).setValues(samples);
  }
  
  // Column widths
  sheet.setColumnWidth(1, 160);
  for (let i = 2; i <= 6; i++) {
    sheet.setColumnWidth(i, 200);
  }
  
  // Highlight variable names
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 1)
      .setFontWeight('bold')
      .setFontColor('#7B68AE')
      .setBackground('#F0EBF8');
  }
}

// ============================================
// Queue Sheet
// ============================================
function setupQueueSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.QUEUE);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.QUEUE);
  }
  
  // Headers
  const headers = ['#', 'Prompt', 'Status', 'Copied At', 'Tags/Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader_(sheet, headers.length);
  
  // Column widths
  sheet.setColumnWidth(1, 50);
  sheet.setColumnWidth(2, 550);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 180);
  
  // Freeze header
  sheet.setFrozenRows(1);
}

// ============================================
// Presets Sheet
// ============================================
function setupPresetsSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.PRESETS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.PRESETS);
  }
  
  // Headers
  const headers = ['Category', 'Preset Name', 'Value', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader_(sheet, headers.length);
  
  // Sample data — expanded with Darlkom DNA-sourced presets
  if (sheet.getLastRow() <= 1) {
    const samples = [
      // ─── Camera ───
      ['Camera', 'Wide Angle', 'shot on 24mm lens, wide angle perspective', '광각 렌즈'],
      ['Camera', 'Portrait', 'shot on 85mm lens, shallow depth of field, f/1.4', '인물 촬영'],
      ['Camera', 'Macro', 'macro photography, extreme close-up, sharp focus', '접사 촬영'],
      ['Camera', 'Tilt-Shift', 'tilt-shift photography, miniature effect, selective focus', '미니어처 효과'],
      // ─── Lighting ───
      ['Lighting', 'Studio', 'professional studio lighting, softbox, clean background', '스튜디오'],
      ['Lighting', 'Golden Hour', 'golden hour sunlight, warm tones, long shadows', '골든아워'],
      ['Lighting', 'Neon', 'neon lighting, cyberpunk atmosphere, colorful reflections', '네온'],
      ['Lighting', 'Chiaroscuro', 'chiaroscuro lighting, tyndall rays, dramatic shadows', '🧬 명암대비 (DNA)'],
      // ─── Style ───
      ['Style', 'Photorealistic', 'photorealistic, hyperrealistic, 8k, ultra detailed', '사진급'],
      ['Style', 'Oil Painting', 'oil painting style, visible brushstrokes, rich textures', '유화풍'],
      ['Style', 'Watercolor', 'watercolor painting, soft edges, delicate colors, paper texture', '수채화'],
      ['Style', 'Flat Vector', 'flat illustration, vector art, clean lines, material design', '🧬 플랫 벡터 (DNA)'],
      // ─── Darlkom DNA Materials ───
      ['🧬 DNA Material', 'Papercraft', 'multi-layered matte cardstock, subsurface scattering paper texture, die-cut details', '🧬 DNA_NB_CRAFT'],
      ['🧬 DNA Material', 'Clay/Stopmotion', 'claymation style, handcrafted, miniature set, warm studio lighting', '🧬 DNA_007'],
      ['🧬 DNA Material', 'Blueprint', 'blueprint style, white lines on blue paper, architectural drafting, technical drawing', '🧬 DNA_010'],
      ['🧬 DNA Material', 'Notebook Doodle', 'hand-drawn blue ink on lined paper, notebook sketch, coffee stain, ink bleed', '🧬 DNA_001'],
      ['🧬 DNA Material', 'Ukiyo-e', 'ukiyo-e woodblock print style, flat illustration, traditional Japanese aesthetic', '🧬 DNA_015'],
      // ─── Mood ───
      ['Mood', 'Ethereal', 'ethereal, dreamlike, soft glow, otherworldly', '몽환적'],
      ['Mood', 'Dark', 'dark and moody, dramatic shadows, noir atmosphere', '다크'],
      ['Mood', 'Vibrant', 'vibrant colors, high saturation, energetic, dynamic', '생동감'],
      ['Mood', 'Whimsical', 'whimsical, playful, narrative composition, storybook feel', '🧬 동화적'],
      // ─── MJ Params ───
      ['MJ Params', 'Quality Max', '--q 2 --s 1000', '최대 퀄리티'],
      ['MJ Params', 'Fast Draft', '--q 1 --s 250', '빠른 드래프트'],
      ['MJ Params', 'Balanced', '--q 2 --s 750', '균형 설정'],
      ['MJ Params', 'Creative', '--q 2 --s 900 --c 30', '크리에이티브'],
      // ─── Negative Prompts ───
      ['Negative', 'General Clean', '--no text, watermark, noise, grunge, low resolution', '범용 네거티브'],
      ['Negative', 'DNA Papercraft', '--no glossy, metallic, 3d render artifacts, dark background', '🧬 페이퍼크래프트용'],
      ['Negative', 'DNA Cyberpunk', '--no daylight, sun, nature, wood, paper, flat design', '🧬 사이버펑크용'],
    ];
    sheet.getRange(2, 1, samples.length, samples[0].length).setValues(samples);
  }
  
  // Column widths
  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 160);
  sheet.setColumnWidth(3, 420);
  sheet.setColumnWidth(4, 150);
}

// ============================================
// Formatting Helpers
// ============================================

function formatHeader_(sheet, numCols) {
  const headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange
    .setBackground(COLORS.HEADER_BG)
    .setFontColor(COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
}
