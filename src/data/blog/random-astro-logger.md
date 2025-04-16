---
title: "Logging thoughts and progress"
description: "Random Astro form added"
pubDatetime: 2025-04-07
tags: ["blog", "astro"]
draft: false
---

# Another random project! 

For a bigger project, I've been pondering how we can use different AI personas to help manage different aspects of ones life.
Like all things AI, we're going to need data for this. Lots of data.
Tonight, I wired up a basic page to help me collect and post my thoughts. See the log page now on the main blog nav bar.

I needed three files for this:
- src/components/HabitForm.astro - the main component defining the input boxes etc
- src/pages/log.astro - the log page that renders the HabitForm
- src/pages/api/save-log.ts - the API that handles the save button action.

Currently, this is writing .md files to content/logs. I think I'll update this process to write to either S3 or Github so that I can create and access logs from anywhere.

I'll also need to work out a better format for the markdown files, or potentially define a more AI friendly format.
