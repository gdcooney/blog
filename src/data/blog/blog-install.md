---
title: "Blog is live (kinda)"
description: "Its been a long frustrating day"
pubDatetime: 2025-03-29
tags: ["blog", "astra"]
draft: false
---

# Astra is live (and some lessons learnt)

I thought it'd be a super quick win to get this blog software running. it wasn't. I'm embarrassed it took as long as it did but here we are.

## What we've done

1. Install Astro with a template
2. Write a blog post

this should have been a slam dunk, easy win, but after a long frustrating conversation with Chat GPT, Cursor saving the day, then cursor ruining everything, 3 reinstalls, I'm finally about to post my first ever blog.

### Commands:

```bash
npm create astro@latest
# Select: "Use a template" → "AstroPaper"
cd astro-paper
npm install

# Start the dev server
npm run dev
```

It should have been that easy :-(

I should have installed the defauts instead of asking Chat GPT to do somthing that seemed pretty basic. The basic config really didn't change anything major over when you get with the default install. 
We ended up getting in a loop of error > fix > error... bad time.
I cracked it with the Chat GPT process and imported the blog code into Cursor. Claude fixed it up pretty easily and I could get the dev server started. 
Now I get a bunch of config errors, more error loops with Chat GPT. After no less than 3 hours I had a working Astro config and a test post completed.

This point would have been a nice time to commit the code. I thought about it, then decided I'd try add support for images which looked like a 1 line change. Didn't work, more errors, rage, cursing... I threw an empty drink can accross my office. Nothing worked. 

I removed everything and reinstalled using the default steps. It was up and running within 10 minutes. 10 MINUTES!!!! after wasting my Saturday afternoon!!! 

Anyway, time to commit and move on. What a day!



