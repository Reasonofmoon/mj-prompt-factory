# Midjourney Prompt Factory

An agent skill that turns Korean concepts into English Midjourney prompts. It is a prompt-writing package only: the agent does not call Midjourney or any image API, and the user does not need an API key.

Default model: **Midjourney V8.2**, the current official default at the time this package was written (see [Version](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version)). V7 is available as an optional compatibility path.

This skill is a repackaging of the prompt-design rules from [Reasonofmoon/mj-prompt-factory](https://github.com/Reasonofmoon/mj-prompt-factory), originally a Google Sheets + Apps Script factory.

## What it does

- Converts a single Korean (or mixed) concept into several distinct English Midjourney V8.2 prompts.
- Accepts batch input from CSV, TSV, or a pasted spreadsheet, including reference-image columns.
- Maps legacy character references to the current official flags: V6 `--cref` / `--cw` → V7 `--oref` / `--ow` → V8.1/V8.2 `--edit` (up to four images). Style references (`--sref`, `--sw`), image prompts (`--iw`), Personalization (`--p` / `--p pID` / `--p mID`), HD (`--hd`), and Raw (`--raw`) follow official V8.2 docs.
- Leaves `--stylize` and `--quality` off unless the user asks for them.

## Install in your agent

1. Copy the `skill/mj-prompt-factory/` folder into your agent's skills directory, or zip this folder and upload it where your agent loads skills.
2. Confirm the folder name is `mj-prompt-factory` and that it contains `SKILL.md`.
3. Restart or reload the agent if needed, then ask it to write Midjourney prompts from a Korean concept.

Claude Code, Codex, and Cursor all load the same `SKILL.md` format. You do not need a Midjourney API key for this skill. Paste the finished prompts into midjourney.com or Discord yourself.

## Agensi listing blurb

Use or adapt this text when listing the skill on [Agensi](https://www.agensi.io/sell):

> Midjourney Prompt Factory turns Korean concepts into copy-paste English Midjourney V8.2 prompts. It supports single ideas and CSV or spreadsheet batches, and it maps character, style, and image references to the current official parameters (`--edit`, `--sref`, `--iw`), with an optional V7 path for `--oref`. No API key and no image-API calls — your agent writes the prompts, you run them in Midjourney.

Suggested listing details (edit before you publish):

- Title: Midjourney Prompt Factory
- Type: single skill (one `SKILL.md`)
- Price: your choice; listing on Agensi is free
- Language: Korean input, English Midjourney output
- Package to upload: zip the `mj-prompt-factory` folder so `SKILL.md` is inside the archive

This repository does not register the listing for you. Zip, upload, and set the price in Agensi's seller flow when you are ready.

## Package layout

```text
mj-prompt-factory/
├── SKILL.md
├── README.md
├── LICENSE
└── references/
    ├── parameters.md    # official version and parameter rules
    └── templates.md     # worked examples and a batch header row
```

Agensi finds `SKILL.md` at any depth, accepts a supporting `references/` folder, and reads optional frontmatter such as `summary`, `version`, `tags`, `keywords`, `use_cases`, and `docs_url` into the listing form. See [Package your skill](https://www.agensi.io/docs/packaging).

## Optional: original Google Sheets version

The Apps Script factory is unchanged. To use it, copy the `.gs` and `Sidebar.html` files from the repository root into a Google Sheet, run `onOpen`, then **MJ Prompt Factory > Initialize Sheets**. That path can still call Claude or Gemini if you add your own API keys. Tutorial: [TUTORIAL.md](https://github.com/Reasonofmoon/mj-prompt-factory/blob/main/TUTORIAL.md).

## Official Midjourney sources

Parameter rules in this skill come from Midjourney docs, including:

- https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version
- https://updates.midjourney.com/version-8-2/
- https://docs.midjourney.com/hc/en-us/articles/48495453462797-Edit-Model
- https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference
- https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference
- https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts
- https://docs.midjourney.com/hc/en-us/articles/33329788681101-Legacy-Features

## License

This package and the repository are licensed under the MIT License, Copyright (c) 2026 Reasonofmoon. See `LICENSE`.
