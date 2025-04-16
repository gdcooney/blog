---
title: "Starting to hate this blog setup!"
description: "round in circles trying to make a simple change"
pubDatetime: 2025-04-13
tags: ["blog", "AI logging"]
draft: false
---

# Hours Losr

I had a plan for a Saturday night nerd out. I thought it was a simple plan, a plan I was going to execute in 1 maybe 2 hours.  In this case I was very, very wrong. 

## Background

Up until last night my Astro blog was displaying only static content. Everything was displaying nicely locally, and when pushed to Git it would deploy on Vercel ok. Static content = OK.

I have a basic form working to submit data to a Supabase database via a API endpoint. This is an ealy test for a wider idea I have going on. It looks awful, but did the basic function I needed.

## The Plan

I decided that Saturday night would be a fine time to jazz up the basic form. I had a conceptual circular wheel design I wanted which was going to need some dynamic content and React componnets. Eventually, I want to be able to submit video, images and other media + a variety of text note types. For Saturday, I planned to limit it to one text component only. 

The firat bit was easy and fun. I skecthed out my concept in my notebook, took a photo and uploaded it to chat GPT explaining what I wanted to build. After a bit of a Q&A design session we agreed on a plan. To implement this we needed:

- src/components/RadialMenu.jsx
→ The main wheel interface with radial buttons like "Note", "Photo", etc.

- src/components/NoteModal.jsx
→ A modal popup triggered by the wheel to capture and submit a text note. 

AI coded the two components for me which I added as instructed. This is where the fun started!

## What went wrong

I needed to add another adapter to my Astro config to support the React components. After a few errors and some back and forth with the AI, we got the main wheel interface running. After a bit more troubleshooting, we got the note capturing and submitting function working as well. It looked nice! Not exactly the same as I'd visualized, but I was happy with how things looked. Now to push to Vercel....

```bash
pnpm install     # we need to do this before pushing content to avoid a lock file issue on vercel
git add .
git commit -m "new logging interface built. deploy to vercel"
git push origin master
```

The commit and push goes fine, then we hit errors when Vercel tries to deploy things. The errors suggest we're missing adapters for rendering the react componnets on Vercel. This seemed like it should have been an easy fix - add the required module and redeploy.  

Now we get this warning on the local dev environment (everything still runs OK):

```bash
[WARN] [config] This project contains server-rendered routes, but no adapter is installed.
This is fine for development, but an adapter will be required to build your site for production.
```

And errors in the Vercel logs:

```bash
[NoAdapterInstalled] Cannot use server-rendered pages without an adapter.
Cannot read properties of undefined (reading 'toString') 
```

## The fix

Well, there wasn't one. Sadly. I went around in circles for close to 3 hours. I reinstalled modules, changed adapters, edited probably 70% of the layout files and Astro config files. It just would not work.
I got rage. I started questioning my sanity. I got stubborn. I got a little bit snippy to the AI. I was ready to burn the Astro blog to the ground! Eventually after about the 5th iteration of a similar change, i decided enough was enough. I went to bed hoping something would come to me the next day.   

It all seemed so simple after a decent sleep. I'll keep Astro for a blog server only. I'll find some other platform for anything that requires SSR. Backup restored, current form updated and deployed to both local dev and Vercel.

## The lesson

If its not working and you're getting nowhere and angry, down tools and go to bed. A path forward is always clearer after a sleep!

