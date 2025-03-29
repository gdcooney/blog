---
title: "Github Spellcheck Agent"
description: "AI agent to spell and grammar check my blob posts"
pubDatetime: 2025-03-29
tags: ["blog", "astra","ai agent"]
draft: false
---

# AI Spell/Grammar Check Agent Setup

I should probably just edit these posts in some halfway decent editor, but there is something old school cool about using vi at the commaand line.

The obvious downside is that vi has no spell check or grammar check founctions (that I'm aware of).

to overcome this, I've added an AI agent to my project. This gets executed agaisnt all .md files that are committed to my blog repo. This automatically trigegres and should tidy up all my spelling and grammer mistakes (of which the draft vberson of this post is riddled with).

## What we've done

1. Added [proofread.yml](/docs/proofread.yaml) to project_root/.github/workflows/
2. Added [fix_markdown.py](/docs/fix_markdown.py) to project_root/.github/scripts/
3. Added my openAI API key as a Repository Secret in Github.

the proof will be in the pie here, as i've purposefully (and possibly accidently) left a huge amount of errors in this text.

I'm expecting they'll be removed by the AI agent after my code is pushed and before the code is picked ip on Vercel.
