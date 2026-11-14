# Input / output examples and batch templates

The prompts below are skill output examples. They are not Midjourney job results. Image URLs are placeholders; replace them with the user's real, rights-cleared URLs.

## Example 1 — single Korean concept (default V8.2)

User:

> 달빛 아래 서울 골목길 레트로 감성, 프롬프트 3개

Output:

```text
1. narrow Seoul alley at night under a full moon, wet pavement reflecting neon and paper lanterns, retro 1980s Korean street signs, cinematic film still --ar 16:9 --v 8.2
2. low-angle view of a retro Seoul backstreet, moonlight on tiled roofs, warm shop-window glow, film grain, nostalgic atmosphere --ar 16:9 --v 8.2
3. quiet midnight hanok alley in Seoul, moonlight and long shadows, vintage enamel signs, puddles, moody blue hour leftover --ar 3:4 --v 8.2
```

Notes: Chose cinematic `16:9` for two shots and a taller `3:4` street frame for variety. No stylize or quality flags, because none were requested.

## Example 2 — V8.2 with Edit Model and Style Reference

User:

> 짧은 회색 머리의 젊은 여전사가 안개 낀 숲에서 검을 들고 서 있는 장면. 캐릭터는 https://example.com/warrior.png 를 유지하고, 스타일은 https://example.com/ink-wash.png 를 참고해. --sw 200, 세로 구도.

Output:

```text
1. a young woman warrior with short gray hair standing in a misty forest, holding a sword, ink-wash atmosphere, soft fog, dramatic side light --edit https://example.com/warrior.png --sref https://example.com/ink-wash.png --sw 200 --ar 2:3 --v 8.2
2. close three-quarter portrait of a young gray-haired warrior in foggy woods, sword at rest, wet leaves, painterly ink textures --edit https://example.com/warrior.png --sref https://example.com/ink-wash.png --sw 200 --ar 2:3 --v 8.2
3. wide shot of a young woman warrior with short gray hair on a forest path, sword lowered, rolling mist, monochrome ink-wash mood --edit https://example.com/warrior.png --sref https://example.com/ink-wash.png --sw 200 --ar 2:3 --v 8.2
```

Notes: Used `--edit` (V8.2 default for character likeness), not `--cref` or `--oref`. Style weight `200` is inside the official `--sw` range of 0–1000.

## Example 3 — batch CSV, including a legacy column remap

User pastes:

```csv
concept,ar,edit_url,sref_url,sw,cref_url,image_url,iw,raw
달빛 아래 서울 골목길 레트로 감성,16:9,,, ,,,
흰 스니커즈 제품 컷,4:3,,https://example.com/studio-style.png,80,,,
짧은 회색 머리 여전사,2:3,,,https://example.com/warrior.png,,,
안개 낀 산골짜기 시네마틱,21:9,,,,,https://example.com/valley-mood.png,1.5,true
```

Output:

```text
1. narrow Seoul alley at night under a full moon, wet pavement reflecting neon and paper lanterns, retro street signs, cinematic atmosphere --ar 16:9 --v 8.2
2. white sneakers on a marble surface, soft studio lighting, editorial product photography, high detail, clean background --sref https://example.com/studio-style.png --sw 80 --ar 4:3 --v 8.2
3. a young woman warrior with short gray hair, dramatic character portrait, misty backlight, detailed costume --edit https://example.com/warrior.png --ar 2:3 --v 8.2
4. https://example.com/valley-mood.png misty mountain valley, cinematic wide shot, volumetric light, quiet atmosphere --iw 1.5 --raw --ar 21:9 --v 8.2
```

Notes:

- Row 3 supplied `cref_url` while the target version is V8.2, so it was remapped to `--edit`. `--cref` / `--cw` were not emitted. Official Edit Model docs do not define a weight flag, and none was provided.
- Row 4 placed the image-prompt URL at the start and kept `--iw 1.5` (inside the official Version 8.1 range of 0–3; the Image Prompts table has no separate V8.2 row). `--raw` was requested.
- `21:9` is within the official SD maximum of `14:1`.

## Example 4 — optional V7 compatibility with Omni Reference

User:

> V7로 뽑아줘. 캐릭터는 https://example.com/character.png, 가중치 250.

Output:

```text
1. illustration of a young woman with short gray hair standing in a quiet library aisle, soft window light, detailed costume --oref https://example.com/character.png --ow 250 --ar 2:3 --v 7
2. close portrait of a young woman with short gray hair, comic-book ink and color, strong jawline, indoor rim light --oref https://example.com/character.png --ow 250 --ar 3:4 --v 7
3. full-body view of a young woman with short gray hair on a rain-soaked street, editorial fashion framing --oref https://example.com/character.png --ow 250 --ar 2:3 --v 7
```

Notes: User asked for V7, so `--oref` / `--ow` were used. `250` is inside `1`–`1000` and below Midjourney's suggested comfort range of `400`.

## Example 5 — V6 Character Reference only when requested

User:

> 예전 버전 6 캐릭터 레퍼런스로. https://example.com/hero.png , 얼굴 위주로 cw를 낮게.

Output:

```text
1. a cyber samurai in a neon-lit alley, night rain, cinematic side light, detailed face --cref https://example.com/hero.png --cw 50 --ar 2:3 --v 6
```

Notes: `--cw 50` is below the official default and maximum of `100`, which official docs say narrows the match toward the face. No official minimum is published. This path is only for an explicit V6 request.

## Batch header row (copy-paste)

```csv
concept,ar,version,edit_url,sref_url,sw,sv,image_url,iw,raw,hd,stylize,chaos,no,count,p,oref_url,ow,cref_url,cw
```

## Template expansion (optional)

If the concept is a template from the original Sheets tool, expand `{placeholders}` first.

Template:

```text
{subject} on {surface}, {lighting}, editorial photography, high detail
```

Variables:

- `{subject}`: white sneakers, gold wristwatch
- `{surface}`: marble surface, dark wood table
- `{lighting}`: soft studio lighting

Cartesian mode yields six base prompts, then attach that row's `--ar`, `--v`, and any references. One-to-one mode pairs items by index (wrapping shorter lists). Random mode samples N unique combinations.

## Example 6 — Personalization (user-supplied ID only)

User:

> 내 퍼스널라이제이션 프로필 써줘. ID는 pID야. 흰 스니커즈 제품 사진, 세로.

Output:

```text
1. white sneakers on a marble surface, soft studio lighting, editorial product photography, clean background --p pID --ar 3:4 --v 8.2
2. white sneakers on dark wood, natural window light, close three-quarter product view, shallow depth of field --p pID --ar 3:4 --v 8.2
3. white sneakers on wet stone, soft side light, editorial still life, generous negative space --p pID --ar 3:4 --v 8.2
```

Notes: `--p pID` is a placeholder for the ID the user supplied. This skill never invents a profile or moodboard ID. Official docs: the V7 Global Profile works on V8.2; `--p` without an ID would apply the user's default, but only after their Global Profile is unlocked. If a moodboard ID (`mID`) is used, do not also add `--sw` or `--sv`.

## Example 7 — HD, Raw, and chaos

User:

> 안개 낀 산골짜기를 와이드로, Raw랑 HD로, 결과 네 장이 좀 더 다양하게 chaos 20.

Output:

```text
1. misty mountain valley, cinematic wide shot, volumetric light, quiet atmosphere --raw --hd --chaos 20 --ar 16:9 --v 8.2
2. fog moving through a pine valley, pale dawn, distant ridge lines, still air --raw --hd --chaos 20 --ar 16:9 --v 8.2
3. high overlook of a mist-filled mountain basin, cool color grade, thin sunlight --raw --hd --chaos 20 --ar 16:9 --v 8.2
```

Notes: `--hd` is documented for V8.1 and listed under V8.1 & V8.2; official max aspect ratio for HD is `4:1`, and `16:9` is within that limit. `--raw` reduces default styling. `--chaos 20` is inside the official `0`–`100` range (default `0`).

## Example 8 — four Edit Model reference images

User:

> 소년이 야생에서 괴물을 만나는 장면. 레퍼런스 네 장: 소년, 괴물, 숲, 검.

Output:

```text
1. a boy meeting a monster in the wilderness, tense standoff, mossy ground, overcast light --edit https://example.com/boy.png https://example.com/monster.png https://example.com/forest.png https://example.com/sword.png --ar 16:9 --v 8.2
2. a boy meeting a monster in the wilderness, closer three-quarter view, wet ferns, dramatic side light --edit https://example.com/boy.png https://example.com/monster.png https://example.com/forest.png https://example.com/sword.png --ar 16:9 --v 8.2
3. a boy meeting a monster in the wilderness, wide establishing shot, ancient trees, pale mist --edit https://example.com/boy.png https://example.com/monster.png https://example.com/forest.png https://example.com/sword.png --ar 16:9 --v 8.2
```

Notes: Official Edit Model docs allow up to four reference images and do not define a weight flag. URLs here are placeholders. If character attributes mix across subjects, official docs suggest combining characters into a single reference image.

