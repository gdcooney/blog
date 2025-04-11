---
title: "GitHub Spellcheck Agent"
description: "AI agent to spell and grammar check my blog posts"
pubDatetime: 2025-03-29
tags: ["blog", "astra", "ai agent"]
draft: false
---

# AI Spell/Grammar Check Agent Setup

I should probably just edit these posts in some halfway decent editor, but there is something old school cool about using vi at the command line.

The obvious downside is that vi has no spell check or grammar check functions (that I'm aware of).

To overcome this, I've added an AI agent to my project. This gets executed against all .md files that are committed to my blog repo. This automatically triggers and should tidy up all my spelling and grammar mistakes (of which the draft version of this post is riddled).

## What we've done

1. Added [proofread.yml](/docs/proofread.yaml) to project_root/.github/workflows/
2. Added [fix_markdown.py](/docs/fix_markdown.py) to project_root/.github/scripts/
3. Added my OpenAI API key as a Repository Secret in GitHub.

The proof will be in the pudding here, as I've purposefully (and possibly accidentally) left a huge amount of errors in this text.

I'm expecting they'll be removed by the AI agent after my code is pushed and before the code is picked up on Vercel.

Looks good on the GitHub side:

![GitHub Agent Success](/images/git_success.png)