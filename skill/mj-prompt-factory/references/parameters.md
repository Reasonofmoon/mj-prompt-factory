# Midjourney parameter reference (official docs)

Checked on 2026-11-14 against Midjourney documentation. Do not invent flags or ranges that are not listed here.

## Current version

The current default Midjourney version is **V8.2**.

| Version | Official status | Dates from official docs |
| --- | --- | --- |
| V8.2 | Current default. Use `--v 8.2`. Focus: aesthetics, image quality, and Personalization. Introduces the Edit Model, which replaces Omni Reference, Character Reference, and the Retexture tool. | Released as the default on 2026-07-24. |
| V8.1 | Still documented. Faster standard jobs; stronger prompt adherence and small-detail hold. Raw removes default styling. HD 2K via `--hd` / `--sd`. | Released 2026-04-14. Default from 2026-06-10 to 2026-07-23. |
| V8.0 | No longer available for use. Do not emit `--v 8` or `--v 8.0`. | Early-access alpha 2026-03-17 until 2026-07-24. |
| V7 | Optional compatibility path. Use `--v 7` only when the user asks. Introduced Draft Mode and Omni Reference. | Released 2025-04-03. Default from 2025-06-17 to 2026-06-09. |
| V6 / V6.1 / Niji 6 | Legacy path for Character Reference (`--cref`). Use only when the user asks. | V6.1 default until 2025-06-16. |

Sources: [Version](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version), [Version 8.2 announcement](https://updates.midjourney.com/version-8-2/).

V8.2, relative to V7 (from the Version and Edit Model docs, not invented):

- Default model is V8.2, not V7.
- Edit Model replaces Omni Reference, Character Reference, and Retexture, and supports up to four reference images.
- HD images (2048px) exist for V8.1 and V8.2; max aspect ratio is `14:1` for SD and `4:1` for HD.
- V8.2 is described as more creative, bold, sophisticated, and edgy, with improved Personalization.
- V8.0 cannot be selected.

## Parameter placement

From the [Parameter List](https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List):

1. Put parameters after the prompt text.
2. Put a space before the dashes.
3. Do not use commas, periods, or other punctuation marks in the parameters.
4. Do not put prompt text after the parameters.

Exception: image-prompt URLs go at the **beginning** of the prompt, not in the parameter list.

## Core parameters for this skill

| Parameter | Official rule | Use in this skill |
| --- | --- | --- |
| `--version` / `--v` | Selects the model. Current default is V8.2. | Default `--v 8.2`. Optional `--v 7` or `--v 6` when requested. Never `--v 8` / `--v 8.0`. |
| `--aspect` / `--ar` | Default `1:1`. No decimals (`139:100` not `1.39:1`). Official examples include `1:1`, `4:3`, `2:3`, `16:9`, `9:16`. Max `14:1` on V6/V7/V8 SD; `4:1` for V8 HD. | Always include a ratio. |
| `--stylize` / `--s` | `0`–`1000`, default `100`, for the latest Midjourney versions. Low = more literal; high = more artistic. | Append only if the user (or a batch cell) sets it. |
| `--raw` | Compatible with versions 5.1 and later. Turns off automatic styling. Simple prompts tend to look more photographic; detailed style prompts get more control. Official V8.1 notes also mention Raw for prompt adherence. | Append only if requested. |
| `--hd` / `--sd` | Higher-resolution 2K (`--hd`) or standard 1024px (`--sd`). Documented for V8.1; the Version compatibility chart lists HD Images under **V8.1 & V8.2**. The [Upscalers](https://docs.midjourney.com/hc/en-us/articles/32804058614669-Upscalers) article gives V8.2 SD/HD pixel sizes (e.g. 1:1 SD 1024×1024, HD 2048×2048). HD max aspect ratio is `4:1`. | Append `--hd` only if requested. |
| `--chaos` / `--c` | Also called Variety. Default `0`, range `0`–`100`. Higher values increase difference across the four images and may wander from the prompt. | Append only if the user sets it. The Chaos article does not version-gate the flag. Compatibility-chart icons on the Version page did not survive text extraction, so this skill does not claim a V8.2-only support change. |
| `--quality` / `--q` | The [Quality](https://docs.midjourney.com/hc/en-us/articles/32176522101773-Quality) article documents **version 7** values: default `1`, also `2` or `4` (more GPU time). There is no `--q 3` in V7 (`--q 3` becomes `--q 4`). `--q 4` is not compatible with Omni Reference. The Version chart lists quality values for V6 (`0.5, 1, 2`) and V7 (`1, 2, 4`) and does not list values in the extracted V8.1 & V8.2 column. | Do not auto-append `--q` on V8.2. On an explicit V7 request, use only `1`, `2`, or `4`, and only if the user asked. |
| `--no` | Tells Midjourney what to leave out. | Include when the user or a `no` column provides a list. |
| `--seed` | For testing and experimenting. Version chart notes V8.1/V8.2 seeds are "99% identical". | Include only if the user supplies a seed. |
| `--tile` | Seamless repeating patterns. Official Edit Model docs: not currently compatible with `--tile`. | Include only if requested, and not together with `--edit`. |
| `--profile` / `--p` | Personalization profiles and moodboards. V7 Global Personalization Profile is described as compatible with V8.2 on Midjourney documentation category text. | Include only if the user supplies a profile code. Do not invent codes. |

## Reference parameters

### Edit Model (`--edit`) — default path on V8.1 / V8.2

Source: [Edit Model](https://docs.midjourney.com/hc/en-us/articles/48495453462797-Edit-Model).

- Compatible with Midjourney versions 8.1 and 8.2.
- Replaces Omni Reference and Character Reference for generating with reference images.
- Up to **four** reference images.
- Discord form: `--edit` followed by one or more image URLs, separated by spaces.
- Can be combined with Image Prompts, Style References, Moodboards, Personalization, and `--hd`.
- Not currently compatible with `--tile`. Edit model results are not currently compatible with Remix.
- Default aspect ratio follows the first uploaded image unless `--ar` is set. Website default aspect settings do not apply automatically.
- Official docs do **not** define a weight parameter for `--edit`. Do not invent one.
- `--raw` is recommended in the official article when more precise control is needed.

### Omni Reference (`--oref`, `--ow`) — V7 only

Source: [Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference).

- Compatible with Midjourney version 7 only. On V8.X, official docs say to use the Edit Model instead.
- One reference image only.
- Discord form: `--oref URL`.
- `--ow` range `1`–`1000`, default `100`. Midjourney recommends keeping the weight below `400` unless stylize is very high.
- Must be paired with a text prompt.
- Can be combined with Style References and Image Prompts.
- Not compatible with Fast Mode, Draft Mode, Conversational Mode, or `--q 4`. Costs 2× GPU time versus regular V7 images.

### Character Reference (`--cref`, `--cw`) — V6 / Niji 6 legacy

Source: [Legacy Features](https://docs.midjourney.com/hc/en-us/articles/33329788681101-Legacy-Features).

- Compatible with Midjourney and Niji version 6.
- Replaced by Omni Reference in V7, and by the Edit Model in V8.X.
- Discord form: `--cref URL`.
- `--cw` default is `100`, which official docs call the maximum. Lower values narrow the match toward the face. Official docs do **not** state a numeric minimum. Do not invent one.
- Do not emit `--cref` or `--cw` on V7 or V8.2 prompts.

### Style Reference (`--sref`, `--sw`, `--sv`)

Source: [Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference).

- Compatible with Midjourney versions 6 and later (includes V8.2).
- Matches look and feel (colors, medium, textures, lighting), not objects or people.
- Discord form: `--sref URL` (multiple URLs separated by spaces) or `--sref <code>` or `--sref random`.
- `--sw` range `0`–`1000`, default `100`. Not compatible with Moodboards.
- `--sv` is documented for **V7** (six versions, default `--sv 6`; `--sv 4` is the old V7 sref model prior to 2025-06-16) and **V6** (four versions, default `--sv 4`). Official docs do not describe `--sv` values for V8.2. Do not auto-append `--sv` on V8.2.
- Style Reference can be combined with Edit Model references and Image Prompts.
- File extensions: `.png`, `.gif`, `.webp`, `.jpg`, or `.jpeg`.
- A text prompt is required in combination with a Style Reference.

### Image Prompts (`--iw`)

Source: [Image Prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts).

- Paste image URLs at the beginning of the prompt. Multiple URLs are separated by spaces.
- Needs either multiple image prompts, or one image prompt plus text.
- Official `--iw` table:

| | Version 8.1 | Version 7 | Niji 7 |
| --- | --- | --- | --- |
| Default | 1 | 1 | 1 |
| Range | 0–3 | 0–3 | 0–2 |

The Image Prompts article links to the V8.2 Version page but does **not** include a V8.2 row in that table. Do not invent a separate V8.2 range. If a user supplies `--iw` on a V8.2 prompt, pass through a value in the documented 8.1 range and note the table label.

## Official sources

- [Version](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version)
- [Version 8.2 announcement](https://updates.midjourney.com/version-8-2/)
- [Parameter List](https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List)
- [Aspect Ratio](https://docs.midjourney.com/hc/en-us/articles/31894244298125-Aspect-Ratio)
- [Stylize](https://docs.midjourney.com/hc/en-us/articles/32196176868109-Stylize)
- [Raw](https://docs.midjourney.com/hc/en-us/articles/32634113811853-Raw)
- [Chaos / Variety](https://docs.midjourney.com/hc/en-us/articles/32099348346765-Chaos-Variety)
- [Quality](https://docs.midjourney.com/hc/en-us/articles/32176522101773-Quality)
- [Edit Model](https://docs.midjourney.com/hc/en-us/articles/48495453462797-Edit-Model)
- [Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference)
- [Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference)
- [Image Prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts)
- [Legacy Features (Character Reference)](https://docs.midjourney.com/hc/en-us/articles/33329788681101-Legacy-Features)
- [Upscalers (V8.2 SD/HD sizes)](https://docs.midjourney.com/hc/en-us/articles/32804058614669-Upscalers)
- [Image Size & Resolution](https://docs.midjourney.com/hc/en-us/articles/33329374594957-Image-Size-Resolution)
