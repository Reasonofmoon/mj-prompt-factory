# MJ Prompt Factory

미드저니 V7 배치 프롬프트 관리 시스템 — Google Sheets + Apps Script

## 기능

- **조합 엔진**: 템플릿 x 변수 풀 = N개 프롬프트 자동 생성 (Cartesian / 1:1 / Random)
- **Claude AI 확장**: 한국어 콘셉트 → 미드저니 V7 최적화 영문 프롬프트
- **순차 복사 시스템**: 사이드바에서 Copy & Next → 미드저니 웹에 빠르게 투입
- **진행 관리**: 대기/복사/완료/스킵 상태 추적 + 프로그레스 바
- **키보드 단축키**: Space(복사), ←→(이동), S(스킵), D(완료)

## 설치 방법

### 1. Google Sheets 생성
1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트 생성
2. 이름: `MJ Prompt Factory`

### 2. Apps Script 에디터 열기
1. **확장 프로그램** > **Apps Script** 클릭
2. 기본 `Code.gs` 파일의 내용을 삭제

### 3. 파일 복사
Apps Script 에디터에서 다음 파일들을 생성하고 내용을 복사:

| 파일 | 용도 |
|------|------|
| `Code.gs` | 메인 진입점, 커스텀 메뉴 |
| `SheetSetup.gs` | 시트 구조 초기화 |
| `PromptEngine.gs` | 조합 엔진 |
| `ClaudeApi.gs` | Claude API 연동 |
| `QueueManager.gs` | 큐 상태 관리 |
| `Sidebar.html` | 사이드바 UI |

> `.gs` 파일: **+** > **스크립트** 로 추가  
> `.html` 파일: **+** > **HTML** 로 추가 (확장자 제외하고 `Sidebar`만 입력)

### 4. 실행
1. Apps Script 에디터에서 **실행** > `onOpen` 함수 실행 (최초 1회 권한 허용)
2. 스프레드시트로 돌아가면 **🎨 MJ Prompt Factory** 메뉴가 나타남
3. **Initialize Sheets** 클릭 → 4개 시트 + 샘플 데이터 생성

### 5. Claude AI 사용 (선택사항)
1. [Anthropic Console](https://console.anthropic.com/)에서 API 키 발급
2. **MJ Prompt Factory** > **Claude AI** > **Set API Key** 에서 입력

## 사용법

### 기본 워크플로
1. **Templates** 시트에 프롬프트 템플릿 작성 (`{subject}`, `{style}` 등 플레이스홀더 사용)
2. **Variables** 시트에 변수값 입력
3. **MJ Prompt Factory** > **Generate Prompts** > 모드 선택
4. **Open Sidebar** → 사이드바에서 순차 복사
5. 미드저니 웹에 붙여넣기 → Enter

### 사이드바 사용
- **COPY** 버튼: 현재 프롬프트 클립보드 복사 → 다음으로 이동
- **Prev / Next**: 프롬프트 탐색
- **Skip**: 현재 프롬프트 건너뛰기
- **Mark Done**: 완료 표시

## 시트 구조

| 시트 | 용도 |
|------|------|
| Templates | 프롬프트 템플릿 + 고정 파라미터 + 스타일 참조 |
| Variables | `{placeholder}` 별 값 목록 |
| Queue | 생성된 프롬프트 큐 + 상태 관리 |
| Presets | 재사용 가능한 스타일/카메라/조명 프리셋 |

## 기술 스택

- Google Apps Script (서버 사이드)
- HTML Service (사이드바 UI)
- Anthropic Claude API (AI 프롬프트 확장)
