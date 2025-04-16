---
title: "Typescript Nightmare"
description: "I'll knowck up a quick form, shouldn't take more than an hour..."
pubDatetime: 2025-04-16
tags: ["blog", "typescript", "vercel","tina"]
draft: false
---

# Nightmare Troubleshooting Session

I had a plan this morning for a project. A fun little project with a new AI agent named Tina. More to come on Tina later. I had a design mostly solved and decided to work on a small piece of it while I finalized the remaining pieces. I needed a quick form to send a new file to a S3 bucket - nice and easy, or so I thought.

The bucket setup was super easy, I got caught out a little with the CORS policy and initial permissions, but no big drama.

The form itself was easy to build; ChatGPT build me a form brah?  Easy.  I decided to host this on my Astro blog which required a couple of files:

- src/pages/submit.astro - the layout and html form components to capture few text fields and turn a larger one into a text file and send to my API.
- api/get-presigned-url.ts - the API logic to submit the file to S3. This recieves the data form the form, makes a POST to AWS to retrieve a presigned URL, then sends the file to the bucket using the presigned URL.

ChatGPT made a pretty sad effort at a URL design. I started to try and prompt the changes I needed but decided to try something new. I sketched out the layout I wanted on paper, took a photo and then gave it to chatGPT asking him tp make the form closer to the diagram. BooM! worked a treat! 

Now time to work on the submission bit. After a bit of troubleshooting we got it working. Form my dev server, I could fill in a form which ends up on S3 as a file. Nice!  

Now, I'll push it to vercel and we're done.

15 seconds into the vercel build and it fails. This seems like so long ago now, I don't even remember the initial error.  The logs showed that the astro check command (part of the vercel build script) was finding numerous TypeScript errors, preventing the build from completing.

So, around in cicles we go for hours and hours and hours. The build works perfectly on my dev instance, but fails when pushing to vercel. to more closly simulate the Vercel build, i started running:

```bash
pnpm run build```

This was listing 34 errors all simialr to this:

```bash
src/utils/getSortedPosts.ts:2:24 - error ts(2835): Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './postFilter.js'?

2 import postFilter from "./postFilter";
                         ~~~~~~~~~~~~~~
```
Both Gemini and ChatGPT sent me around in circles for hours. I ended up rage quitting and taking the dog out for a walk. This was around 6pm. At this stage, I'd been bashing at this for around 8 hours. With a clearer and calmer head after an hours walk, I came back to the problem. Rather than repeating the same steps I'd done already many, many times, I asked both Gemini and ChatGPT "can you give me a succint summary of the promlem we're facing suitable for an Internet search". After a bit of Google action, I stumbled on some random Reddit post, the gist of one of the comments was "don't even bother with custom path aliases, hardcode instead". This was the pointer i needed.

The end "fix" was:

1.  add this to tsconfig.json:

```bash
    "allowImportingTsExtensions": true,
```

2.  for each of the listed files, change:

```bash
import { SITE } from "@/config";
to
import { SITE } from "src/config.ts";
```

I had a few other random errors to fix up, but the above changes got past the vercel depoyement issue. I've now got a working form on both my local dev and vercel (prod). 

I'm happy this is finally working, but damn what a ridiculously long and painful effort to get a "simple" form to work. Tomorrow, I'll start on the actual fin bit - Tina....

