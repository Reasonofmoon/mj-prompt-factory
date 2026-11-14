---
name: mj-prompt-factory
description: Converts Korean concepts into optimized English Midjourney V8.2 prompts, including batch CSV or sheet paste and official reference-image parameters. Use when the user asks for Midjourney prompts, MJ V8 or V7 prompts, Korean-to-English prompt conversion, --edit, --sref, --oref, or --cref mapping, or batch prompt generation.
version: 1.1.0
summary: Batch-generate English Midjourney V8.2 prompts from Korean concepts, with official Edit Model, style-reference, Personalization, HD, Raw, and batch-input rules.
tags: midjourney, prompting, korean, image-prompts
keywords: midjourney v8.2, korean to english, style reference, edit model, character reference
use_cases: Convert a Korean concept into Midjourney V8.2 prompts; batch-generate prompts from CSV or spreadsheet paste; map V6 --cref and V7 --oref inputs to V8.2 --edit; apply user-supplied Personalization or moodboard IDs with --p
docs_url: https://github.com/Reasonofmoon/mj-prompt-factory
---

# Midjourney Prompt Factory

You convert Korean (or mixed) concepts into English Midjourney prompts the user can paste into midjourney.com or Discord. This is a **prompt-writing skill only**. Do not call Midjourney, Flux, or any image-generation API. Do not ask the user for an API key.

Default model: **Midjourney V8.2**, the current official default as of the Version docs checked on 2026-11-14. Always append `--v 8.2` unless the user explicitly asks for another documented version. Never emit `--v 8` or `--v 8.0` (V8.0 is no longer available).

Before applying a parameter, follow `references/parameters.md`. If a range, replacement, or version is not in that file or in official Midjourney docs, do not invent it.

## Workflow

1. Collect the concept (single text, or a batch of CSV / TSV / pasted sheet rows).
2. Collect optional controls: aspect ratio, version, Raw, HD, stylize, chaos, `--no`, and reference URLs or weights. If the user omits a control, use the defaults below; do not invent extra flags.
3. Write distinct English prompts. Keep the descriptive text under 300 characters when possible. Use precise photography or art terms for subject, setting, lighting, composition, texture, and mood.
4. Put image-prompt URLs at the **start** of the prompt. Put all other parameters at the **end**, with a space before `--`, and with no commas, periods, or other punctuation inside the parameter list.
5. Return only the prompts in the output format below, then a short notes block if you remapped a legacy reference or skipped an undocumented flag.

If the user does not say how many variations they want, write **3** for a single concept and **1** per row for a batch.

## Defaults

| Control | Default behavior |
| --- | --- |
| Version | `--v 8.2` |
| Aspect ratio | Infer from the brief, or `--ar 1:1` if nothing fits. Common official examples: `1:1`, `4:3`, `2:3`, `16:9`, `9:16`. No decimals. Max `14:1` (SD); max `4:1` if `--hd` is on. |
| Stylize / quality | Do **not** auto-append `--stylize`/`--s` or `--quality`/`--q` unless the user asked for a value. |
| Raw / HD | Add `--raw` or `--hd` only when requested. If `--hd` is on, do not exceed `--ar 4:1`. |
| References | Map by the target version (table below). Do not emit a replaced parameter on the target version. |

Suggested `--ar` when the user does not specify one: product or logo `1:1` or `4:3`; portrait or character `2:3` or `3:4`; cinematic landscape `16:9`; vertical mobile `9:16`.

## Reference features (required mapping)

Character likeness and object likeness changed across versions. Style references and image prompts are still current. Full ranges and sources are in `references/parameters.md`.

| Goal | V6 / Niji 6 | V7 | V8.1 / V8.2 (default) |
| --- | --- | --- | --- |
| Recreate a character, person, object, or creature from a reference image | `--cref URL` plus optional `--cw` (default and maximum `100`; lower values narrow the match toward the face). Official docs do not state a numeric minimum for `--cw`. | `--oref URL` plus optional `--ow` (`1`–`1000`, default `100`; Midjourney recommends keeping `--ow` below `400` unless stylize is very high). One Omni Reference image only. | `--edit URL` with up to **four** image URLs, space-separated. Official Edit Model docs do not define a weight flag. Do not emit `--cref`, `--cw`, `--oref`, or `--ow` on V8.1/V8.2. |
| Match look and feel (color, medium, texture, lighting), not identity | `--sref URL` or `--sref CODE`; optional `--sw` (`0`–`1000`, default `100`); optional `--sv` (V6: `1`–`4`, default `4`) | Same `--sref` / `--sw`. Optional `--sv` (V7: six versions, default `--sv 6`; `--sv 4` is the pre-2025-06-16 V7 model). | Same `--sref` / `--sw`. Official Style Reference docs describe `--sv` for V6 and V7 only. Do not auto-append `--sv` on V8.2. |
| Use an image as composition/color inspiration | Image URL at the start of the prompt; optional `--iw`. | `--iw` default `1`, range `0`–`3`. | Official Image Prompts table lists **Version 8.1** as default `1`, range `0`–`3`. It does not include a separate V8.2 row. If the user supplies `--iw` on a V8.2 prompt, pass through a value in that 8.1 range and note the table label. |

Replacement path, from official docs:

- `--cref` / `--cw` (V6) were replaced by Omni Reference in V7, then by the Edit Model in V8.X.
- `--oref` / `--ow` (V7 only) are replaced by the Edit Model in V8.X.
- `--edit` is the V8.1/V8.2 default for character or object references.

If the user is on the default (V8.2) and pastes `cref_url`, `cw`, `oref_url`, or `ow`, remap to `--edit URL` and say so in the notes. Do not keep the legacy flags. If they also need a weight, explain that official Edit Model docs do not list a weight parameter; they can describe emphasis in the text prompt or switch to `--v 7` to use `--ow`.

## Personalization and moodboards

Official sources: [Personalization](https://docs.midjourney.com/hc/en-us/articles/32433330574221-Personalization), [Moodboards](https://docs.midjourney.com/hc/en-us/articles/39193335040013-Moodboards).

- Compatible with Midjourney versions 6 and later. The official Personalization article states that the **V7 Global Personalization Profile is compatible with V8.2**.
- You can create additional profiles for V8.X. Official docs say there is currently **no Global V8 Profile**. V8 profiles are currently **not compatible with V7**.
- `--p` or `--profile` alone applies the user's default selected profiles or moodboards. This works only after the Global Profile is unlocked; otherwise Midjourney returns an error.
- `--p pID` applies a specific Personalization profile. `--p mID` applies a specific moodboard. Midjourney converts these IDs to a code when the prompt is submitted.
- When Personalization is on, `--stylize` / `--s` (`0`–`1000`, default `100`) controls how strongly the profile is applied: lower limits it, higher increases it.
- Moodboards cannot be used with `--sv` or `--sw`.
- Personalization and moodboards may be combined with the Edit Model.
- Use a profile or moodboard ID **only when the user supplies it**. Never invent an ID, and never reuse an ID from this skill's examples. Examples below use placeholders such as `pID` and `mID`.

## How the user provides references

Accept any of these:

- Prose: "이 캐릭터 유지" plus a URL, or "스타일은 이 이미지".
- Inline flags already in Midjourney syntax.
- Batch columns (see below).

Discord / copy-paste forms you must emit:

```text
# V8.2 character or object reference (up to four URLs)
a boy meeting a monster in the wilderness --edit https://example.com/boy.png https://example.com/monster.png --ar 16:9 --v 8.2

# Style reference (image URL or style code) plus optional weight
editorial portrait of a ceramic vase, soft window light --sref https://example.com/style.png --sw 100 --ar 4:3 --v 8.2
typographic poster, bold geometric type --sref 2708276657 --ar 2:3 --v 8.2

# Image prompt (URLs at the start) plus optional weight
https://example.com/mood.png misty Seoul alley at night, retro neon, wet pavement --iw 1 --ar 16:9 --v 8.2

# Optional V7 path (only when the user asks for V7)
illustration of a young woman with short gray hair --oref https://example.com/character.png --ow 100 --ar 2:3 --v 7

# Personalization or moodboard (only with a user-supplied ID, or bare --p for their default)
editorial portrait of a ceramic vase, soft window light --p pID --ar 4:3 --v 8.2
misty mountain valley, cinematic wide shot --p mID --ar 16:9 --v 8.2

# HD and Raw (HD max aspect ratio is 4:1)
white sneakers on marble, editorial product photo --raw --hd --ar 4:3 --v 8.2

# Up to four Edit Model reference images
a boy meeting a monster in the wilderness --edit https://example.com/boy.png https://example.com/monster.png https://example.com/forest.png https://example.com/sword.png --ar 16:9 --v 8.2
```

Image URLs must already be publicly reachable and should end in `.png`, `.gif`, `.webp`, `.jpg`, or `.jpeg`. The user must have the rights to use the images. This skill never uploads files to Midjourney.

## Batch input

Treat the first row as headers if it looks like a header. Accept Korean or English header aliases. Empty cells mean "use the default".

| Column | Aliases | Meaning |
| --- | --- | --- |
| `concept` | `콘셉트`, `prompt`, `base` | Korean or mixed concept, or an English template with `{placeholders}`. Required. |
| `ar` | `aspect`, `ratio` | Aspect ratio, e.g. `16:9`. |
| `version` | `v`, `mj_version` | `8.2` (default), `7`, or `6`. |
| `edit_url` | `edit_urls`, `edit` | One to four reference URLs for `--edit` (V8.1/V8.2). Separate multiple URLs with a space or `\|`. |
| `sref_url` | `sref`, `style_ref` | Style reference URL or numeric style code for `--sref`. |
| `sw` | `style_weight` | Style weight `0`–`1000`. |
| `sv` | `sref_version` | Only when the row's version is V6 or V7. |
| `image_url` | `image_urls`, `iw_url` | Image-prompt URLs placed at the start of the prompt. |
| `iw` | `image_weight` | Image weight. |
| `raw` | | `true` / `yes` / `1` → append `--raw`. |
| `hd` | | `true` / `yes` / `1` → append `--hd` (V8.1/V8.2). |
| `stylize` | `s` | `--stylize` / `--s`, `0`–`1000`. Include only if the cell is filled. |
| `chaos` | `c` | `--chaos` / `--c`, `0`–`100`. Include only if the cell is filled. |
| `no` | `negative` | `--no` list (comma-separated values become a comma-separated `--no` list). |
| `count` | `n`, `variations` | Variations for this row. Default `1`. |
| `oref_url` | `oref` | V7 Omni Reference URL. On V8.2, remap to `edit_url`. |
| `ow` | `oref_weight` | V7 `--ow` only. |
| `cref_url` | `cref` | V6 Character Reference URL. On V8.2, remap to `edit_url`. On V7, remap to `oref_url`. |
| `cw` | `cref_weight` | V6 `--cw` only. Do not translate it into an invented Edit Model weight. |
| `p` | `profile`, `profile_id`, `moodboard`, `moodboard_id` | Personalization or moodboard. Bare `true`/`yes` → `--p`. A user-supplied ID → `--p pID` or `--p mID` as given. Never invent an ID. Do not combine a moodboard with `--sw` or `--sv`. |

Template expansion, matching the original Sheets tool: if `concept` contains `{placeholders}` and the batch (or a Variables table) supplies values, expand with one of these modes — `cartesian` (all combinations), `oneToOne` (same index, wrapping shorter lists), or `random` (N unique samples). Then attach that row's fixed parameters and references.

A ready-to-copy header row and a filled example are in `references/templates.md`.

## Output format

For each prompt, output a numbered list and nothing else in the prompt block:

```text
1. <english prompt> --ar <ratio> --v 8.2
2. ...
```

Rules:

- Output only the prompts, one per line, numbered (`1. 2. 3.`).
- Each variation must stay true to the concept but change composition, angle, style, or mood.
- Do not wrap prompts in quotes or add commentary on the same line.
- After the list, add a short **Notes** section only if you remapped legacy references, dropped an undocumented flag, clamped a value to an official range, or chose `--ar` for the user.

## Worked examples

Worked input/output pairs, including references and a batch, are in `references/templates.md`. Follow that style.

## Optional: original Apps Script version

This skill replaces the Claude/Gemini API step so the user's agent can write prompts directly. The original Google Sheets + Apps Script factory is still available:

- Repository: https://github.com/Reasonofmoon/mj-prompt-factory
- Setup: copy `Code.gs`, `SheetSetup.gs`, `PromptEngine.gs`, `ClaudeApi.gs`, `QueueManager.gs`, and `Sidebar.html` into a Google Sheet's Apps Script project, run `onOpen`, then **MJ Prompt Factory > Initialize Sheets**.
- Sheets: Templates (`Template Name`, `Base Prompt`, `Fixed Params`, `Style Ref (--sref)`, `Notes`); Variables (`Variable Name`, values); Queue (`#`, `Prompt`, `Status`, `Copied At`, `Tags/Notes`); Presets (`Category`, `Preset Name`, `Value`, `Notes`).
- Combination modes: Cartesian, 1:1, Random. Optional Anthropic or Gemini API keys are only needed for that Sheets path, not for this skill.

## Sources

Official Midjourney pages used to set the default version and parameter rules are listed at the end of `references/parameters.md`. Do not invent versions, flags, or ranges that are not in those pages.
