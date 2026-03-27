# 🎨 MJ Prompt Factory — 초간단 튜토리얼

> Midjourney V7 프롬프트를 **대량생산**하는 Google Sheets 도구

---

## 📦 STEP 1: 설치 (5분)

### 1-1. 새 Google 시트 만들기

[sheets.new](https://sheets.new) 접속 → 빈 시트 생성

### 1-2. Apps Script 에디터 열기

메뉴: **확장 프로그램 > Apps Script**

### 1-3. 파일 복사

아래 **8개 파일**을 Apps Script 에디터에 생성합니다:

| # | 파일명 | 유형 | 설명 |
|---|--------|------|------|
| 1 | `Code.gs` | 스크립트 | 메인 진입점 (이미 있음, 내용 교체) |
| 2 | `SheetSetup.gs` | 스크립트 | 시트 구조 & 샘플 데이터 |
| 3 | `PromptEngine.gs` | 스크립트 | 프롬프트 조합 엔진 |
| 4 | `QueueManager.gs` | 스크립트 | 큐 상태 관리 |
| 5 | `ClaudeApi.gs` | 스크립트 | Claude AI 연동 (선택) |
| 6 | `GeminiApi.gs` | 스크립트 | Gemini AI 연동 (선택) |
| 7 | `Sidebar.html` | HTML | 사이드바 UI |
| 8 | `README.md` | 파일 | 문서 (선택) |

> **Tip**: Apps Script에서 **+ 버튼** → "스크립트" 또는 "HTML"을 선택해서 파일 추가

### 1-4. 시트로 돌아가서 새로고침

**F5** 또는 페이지 새로고침 → 상단에 **🎨 MJ Prompt Factory** 메뉴가 나타남!

---

## 🏗 STEP 2: 초기 세팅 (1분)

```
🎨 MJ Prompt Factory > 🏗️ Initialize Sheets
```

클릭하면 **4개 시트**가 자동 생성됩니다:

| 시트 | 역할 | 예시 |
|------|------|------|
| **Templates** | 프롬프트 뼈대 | `{subject} on {surface}, {lighting}...` |
| **Variables** | 변수 값 목록 | `{subject}` = sneakers, handbag, watch... |
| **Queue** | 생성된 프롬프트 큐 | 최종 프롬프트가 쌓이는 곳 |
| **Presets** | 자주 쓰는 설정 모음 | Camera, Lighting, Style, Mood, MJ Params |

---

## 🚀 STEP 3: 프롬프트 생성 (핵심!)

### 방법 A: 메뉴에서 직접 생성

```
🎨 MJ Prompt Factory > 🧬 Generate Prompts > Cartesian (All Combinations)
```

| 모드 | 설명 | 결과 수 |
|------|------|---------|
| **Cartesian** | 모든 조합 (A×B×C) | 5×5×5 = 125개 |
| **1:1 Matching** | 순서대로 매칭 | 5개 |
| **Random N** | 랜덤 N개 추출 | 원하는 만큼 |

### 방법 B: 사이드바에서 생성

```
🎨 MJ Prompt Factory > 📋 Open Sidebar
```

사이드바가 열리면:

1. **템플릿** 선택 (드롭다운)
2. **생성** 버튼 클릭
3. 프롬프트가 Queue 시트에 자동 추가됨
4. **← →** 화살표로 프롬프트 탐색
5. **📋 Copy** 버튼으로 클립보드 복사
6. Midjourney Discord에 **Ctrl+V** 붙여넣기!

---

## 🧬 STEP 4: 나만의 템플릿 만들기

### Templates 시트에 새 행 추가

| Template Name | Base Prompt | Fixed Params |
|---------------|------------|--------------|
| My Style | `{character}, {mood} atmosphere, oil painting --ar 2:3 --v 7` | `--q 2 --s 800` |

### Variables 시트에 변수값 추가

| Variable Name | Value 1 | Value 2 | Value 3 |
|--------------|---------|---------|---------|
| `{character}` | a knight | a dancer | a wizard |
| `{mood}` | mysterious | dreamy | epic |

→ Generate 하면 **9개 프롬프트** 자동 생성! (3×3)

---

## 🤖 STEP 5: AI로 프롬프트 확장 (선택)

### 5-1. API Key 설정

```
🎨 MJ Prompt Factory > 💎 Gemini AI > Set API Key
```

또는

```
🎨 MJ Prompt Factory > 🤖 Claude AI > Set API Key
```

### 5-2. 컨셉 확장

1. Queue 시트에서 확장하고 싶은 프롬프트가 있는 셀 클릭
2. 메뉴에서 **Expand with Gemini 2.5 Flash** 선택
3. AI가 프롬프트를 더 풍부하게 확장해줌!

> **또는** 사이드바의 AI 패널에서 Provider 선택 후 **Expand** 클릭

---

## 🌐 STEP 6: 웹앱으로 배포 (선택)

사이드바뿐 아니라 **독립 웹앱**으로도 사용 가능!

1. Apps Script 에디터 → **배포 > 새 배포**
2. ⚙️ 톱니바퀴 → **웹 앱** 선택
3. 실행 사용자: **본인**
4. 액세스: **본인만**
5. **배포** 클릭 → URL 복사
6. 브라우저에서 URL 접속하면 전체화면 웹앱!

---

## 🧬 보너스: Darlkom DNA 스타일

Templates 시트에 **🧬** 표시가 된 템플릿이 있습니다:

| 스타일 | 용도 |
|--------|------|
| 🧬 Papercraft Shadow-Box | 종이공예 다이오라마 스타일 |
| 🧬 Bauhaus Grid | 기하학적 모던 디자인 |
| 🧬 Cyberpunk Neon Rain | 사이버펑크 네온 |
| 🧬 Doodle Notebook | 노트 위 낙서 느낌 |
| 🧬 Watercolor Fantasy | 수채화 판타지 맵 |
| 🧬 Clay Stopmotion | 클레이 애니메이션 |

Variables 시트의 `{dna_object}`, `{dna_palette}` 변수와 함께 사용하세요!

---

## ⌨️ 단축키

| 키 | 기능 |
|----|------|
| `→` | 다음 프롬프트 |
| `←` | 이전 프롬프트 |
| `Ctrl+C` | 현재 프롬프트 복사 |

---

## 📖 실전 시나리오: "민지의 Etsy 스티커 가게"

> 민지는 Etsy에서 감성 스티커를 판매합니다.
> 이번 주에 **귀여운 동물 카페** 컨셉으로 스티커 40장을 만들어야 합니다.
> Midjourney로 하나하나 프롬프트를 치기엔 시간이 너무 오래 걸려요...
> **MJ Prompt Factory**로 해결해봅시다! 🚀

---

### 🎬 Scene 1: 시트 열기

민지는 Google Sheets를 열고, 상단 메뉴에서 이렇게 클릭합니다:

```
🎨 MJ Prompt Factory > 🏗️ Initialize Sheets
```

💡 **결과**: Templates, Variables, Queue, Presets 시트가 자동 생성!

---

### 🎬 Scene 2: 템플릿 만들기

민지는 **Templates** 시트로 가서 새 행을 추가합니다:

| Template Name | Base Prompt | Fixed Params |
|---------------|-------------|--------------|
| 동물 카페 스티커 | `cute {animal} sitting in a {place}, holding {drink}, {art_style}, sticker design, white border, die-cut --ar 1:1 --v 7` | `--q 2 --s 800` |

> 💬 민지: "동물, 장소, 음료, 스타일만 바꾸면 수십 가지 조합이 나오겠다!"

---

### 🎬 Scene 3: 변수 채우기

**Variables** 시트로 이동해서 각 변수에 값을 넣습니다:

| Variable Name | Value 1 | Value 2 | Value 3 | Value 4 |
|--------------|---------|---------|---------|---------|
| `{animal}` | cat | bunny | bear | corgi |
| `{place}` | cozy cafe | flower garden | bookstore | bakery |
| `{drink}` | matcha latte | bubble tea | hot chocolate | iced americano |
| `{art_style}` | kawaii illustration | watercolor | flat vector | soft pastel |

> 💬 민지: "4 × 4 × 4 × 4 = **256가지** 조합이 가능하다고?!"

---

### 🎬 Scene 4: 프롬프트 대량 생성!

```
🎨 MJ Prompt Factory > 🧬 Generate Prompts > Random N
```

민지는 **40개**를 입력합니다.

💡 **결과**: Queue 시트에 40개의 완성된 프롬프트가 한 번에! 예시:

```
cute cat sitting in a cozy cafe, holding matcha latte, kawaii illustration,
sticker design, white border, die-cut --ar 1:1 --v 7 --q 2 --s 800
```

```
cute corgi sitting in a bakery, holding bubble tea, soft pastel,
sticker design, white border, die-cut --ar 1:1 --v 7 --q 2 --s 800
```

> 💬 민지: "1분 만에 40개 프롬프트 완성! 손으로 쳤으면 1시간은 걸렸을 텐데..."

---

### 🎬 Scene 5: 사이드바에서 하나씩 복사

```
🎨 MJ Prompt Factory > 📋 Open Sidebar
```

사이드바가 열리면:

1. **← →** 화살표로 프롬프트를 넘김
2. 마음에 드는 프롬프트에서 **📋 Copy** 클릭
3. Midjourney Discord로 가서 `/imagine` 입력 후 **Ctrl+V** 붙여넣기
4. 생성 완료되면 **✅ Done** 버튼으로 체크

> 💬 민지: "프롬프트를 카드 넘기듯이 하나씩 확인하니까 너무 편해!"

---

### 🎬 Scene 6: AI로 프롬프트 업그레이드 (보너스)

민지는 몇 개 프롬프트를 더 풍부하게 만들고 싶습니다.

1. Queue 시트에서 원하는 프롬프트 셀 클릭
2. 메뉴에서:
```
🎨 MJ Prompt Factory > 💎 Gemini AI > Expand with Gemini 2.5 Flash
```

💡 **결과**: AI가 프롬프트를 확장해줌!

```
[Before]
cute bunny sitting in a bookstore, holding hot chocolate, watercolor...

[After]
adorable fluffy bunny with rosy cheeks sitting cross-legged on a stack
of vintage books in a warm sunlit indie bookstore, gently cradling a
tiny ceramic cup of steaming hot chocolate with marshmallows, surrounded
by falling cherry blossom petals, delicate watercolor painting style
with soft edges and gentle color bleeding, cozy warm amber lighting...
```

> 💬 민지: "AI가 디테일을 살려주니까 결과물 퀄리티가 확 올라갔어!"

---

### 🎬 Scene 7: 🧬 Darlkom DNA로 스타일 체인지

민지는 같은 컨셉으로 **페이퍼크래프트** 느낌도 만들어보고 싶습니다.

Templates 시트에서 **🧬 DNA: Papercraft Shadow-Box** 템플릿을 선택하고,
Variables의 `{dna_object}`를 수정합니다:

| Variable Name | Value 1 | Value 2 |
|--------------|---------|---------|
| `{dna_object}` | cafe with tiny paper animals | bookshelf with paper cat reading |

```
🧬 Generate Prompts > 1:1 Matching
```

💡 **결과**: 종이공예 스타일의 완전히 다른 감성 이미지 프롬프트 생성!

> 💬 민지: "같은 컨셉인데 DNA 스타일만 바꾸니까 완전 다른 시리즈가 됐다!"

---

### 🎬 에필로그

| 일반 방법 | MJ Prompt Factory |
|-----------|-------------------|
| 프롬프트 1개에 2~3분 | 40개를 1분 만에 |
| 오타, 실수 잦음 | 변수 시스템으로 일관성 유지 |
| 스타일 변경 = 처음부터 다시 | 템플릿 교체만으로 스타일 체인지 |
| 프롬프트 관리 = 메모장 복붙 | Queue 시트에서 체계적 관리 |
| 단조로운 프롬프트 | AI 확장으로 풍부한 디테일 |

> 🎉 **핵심**: 템플릿에 뼈대를 만들고, 변수에 재료를 넣고, 버튼 하나로 대량 생산!

---

## 🔧 개발자용: clasp으로 코드 동기화

VS Code에서 수정한 코드를 Apps Script에 자동 반영하려면:

```bash
# 최초 설정 (한 번만)
npm install -g @google/clasp
clasp login

# 코드 수정 후 업로드 (매번)
cd mj-prompt-factory
clasp push
```

> 복붙 없이 `clasp push` 한 번이면 8개 파일 동시 업로드!

---

## ❓ 자주 묻는 질문

**Q: 메뉴가 안 보여요!**
→ 시트를 새로고침(F5)하세요. 처음 한 번은 권한 승인이 필요합니다.

**Q: API Key는 어디에 저장되나요?**
→ `PropertiesService`에 안전하게 저장됩니다. 코드에 노출되지 않습니다.

**Q: 변수 값을 더 추가하고 싶어요**
→ Variables 시트에서 Value 6, 7, 8... 열을 자유롭게 추가하면 됩니다.

**Q: 기존 시트를 초기화하고 싶어요**
→ 시트 탭을 삭제한 후 다시 **Initialize Sheets** 실행하세요.

**Q: clasp push가 안 돼요**
→ https://script.google.com/home/usersettings 에서 Apps Script API가 ON인지 확인하세요.
