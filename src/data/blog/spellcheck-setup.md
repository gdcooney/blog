---
title: "Automated Spelling & Grammar Checks on Blog Posts 2.0"
pubDatetime: 2025-04-17
description: "Linting, spellcheck, and auto-correction for Markdown posts using Vale, Codespell, and pre-commit hooks."
tags: [vale, codespell, markdown, astro, git]
---

## Sunnary 

I wrote a post a while back on how I setup an AI agent to run when I pushed files to Git. While this was cool, there were 2 major issues with it:
1. Posts weren't getting checked locally and would be different to the live copies
2. The AI agent was using tokens for calling the Open AI API, so a bit of an unnecessary expense. 

After rebuilding my Astro setup over the weekened, I noticed my live posts are still riddled with spelling errors. Turns out deleting the entire blog folder might have been a bit rash. The AI script and config that Git was using had gone.

Tonight I took the opportunity to save myself a few tokens and use a local spelling and grammar check instead. The AI generated output below outlines what was setup.

--- 

## ChatGPT summary:

I recently wired up a clean, automated system to catch and fix typos, passive voice, and lazy phrasing in my Markdown blog posts. It now runs **automatically before every commit**, and even **auto-corrects spelling** where possible.

Here’s how I set it up using:

- [`vale`](https://vale.sh/) for grammar and style
- [`codespell`](https://github.com/codespell-project/codespell) for spell-checking
- [`pre-commit`](https://pre-commit.com/) to run it all before every Git commit

---

## ✅ Step 1: Add Vale for Grammar & Style

In the project root, I created a `.vale.ini` file:

```ini
StylesPath = styles
MinAlertLevel = suggestion

[*.md]
BasedOnStyles = write-good, spelling
```

Then I added a spelling config under `styles/spelling/Spelling.yml`:

```yaml
extends: spelling
message: "'%s' may be a misspelling"
level: warning
```

And an ignore list for valid custom terms in `styles/spelling/accept.txt`:

```
ProveItsMe
Astro
Vercel
Supabase
Figma
CLI
```

Vale uses this to flag passive voice, weasel words, E-Prime violations, and unknown words.

---

## ✅ Step 2: Use Codespell to Auto-Fix Typos

To auto-correct spelling mistakes, I installed [`codespell`](https://github.com/codespell-project/codespell):

```bash
pipx install codespell
```

I also created `.codespell-ignore` to avoid flagging terms like product names:

```
ProveItsMe
Supabase
Astro
```

To auto-fix, I ran:

```bash
codespell --ignore-words=.codespell-ignore -w src/data/blog/
```

This corrected things like:

- `sould` → `should`
- `depoy` → `deploy`

---

## ✅ Step 3: Automate It with pre-commit

To make this automatic before every Git commit, I set up [`pre-commit`](https://pre-commit.com/):

```bash
pipx install pre-commit
pre-commit install
```

Then I added this `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/codespell-project/codespell
    rev: v2.2.6
    hooks:
      - id: codespell
        args: ["--ignore-words=.codespell-ignore", "-w"]
        files: ^src/data/blog/.*\.md$

  - repo: https://github.com/errata-ai/vale
    rev: v3.0.0
    hooks:
      - id: vale
        name: Vale Linter
        entry: vale
        language: system
        types: [markdown]
```

---

## 📋 Logging

To see all grammar/spelling issues:

```bash
vale src/data/blog/ > vale.log
```

You can also use `--output=JSON` if you want to parse the output later or generate dashboards.

---

## 🔧 Common Fixes I Made

- Fixed `depoy` → `deploy`
- Fixed `sould` → `should`
- Removed `.vale.yml` syntax errors (`ignore:` is not valid inside YAML config)
- Fixed `PATH` issues after installing `pre-commit` and `pipx` (`pipx ensurepath`)

---

## 🎯 Result

Now every time I commit:

- 🧠 Grammar issues are flagged
- ✍️ Spelling mistakes are auto-fixed
- 🚫 I don’t accidentally publish typos or lazy writing

It’s fast, reliable, and doesn’t depend on GPT or cloud APIs.

---

