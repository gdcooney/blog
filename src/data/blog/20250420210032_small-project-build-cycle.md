---
title: "Small Project Build Cycle"
description: "In this blog post, the author shares their effective methodology for handling small projects, leveraging AI tools like ChatGPT and Gemini. They outline a structured process from brainstorming with ChatGPT to generating coding prompts for Gemini, emphasizing the importance of clear communication and detailed scoping. The post delves into the author's experience with AI collaboration, highlighting the efficiency gains and challenges faced during the development and deployment phases. With insights on refining prompts, managing AI tasks, and ensuring thorough documentation, this post offers a valuable perspective on integrating AI into project workflows for successful outcomes."
pubDatetime: 2025-04-20 21:00:32
tags: ["blog", "ai", "builds"]
draft: false
---

I think I've got a pretty decent methodology going on for small projects now. This has worked well for the last few builds I've done, and is getting smoother each time. I'm not sure if this is the AI improving or me improving the way I work with the AI. AT a high level, my process usually follows something like this:

1. Brainstorm it with ChatGPT. I always start a new chat session here and give him directives at the start of the session e.g. "you're my co-architect, I want your help to design a solution for xyz. When we are done, I will take our design to a coding AI for development.  Please don't suggest any code during this session". The last bit is important otherwise he's always just a bit to eager and spews out heaps of code I'm never going to use. 

2. When we have worked out all of the details and clearly scoped our MVP. I usually stop and go to bed. Design at night, build in the morning.  

3. Usually I'll have a few clarifications or additions we'll add in the next day before the build session. Once we've iterated through these I'll ask for a summary document and a prompt to take to the coding AI.  He does well at capturing the design decisions and MVP scope and this is always given to the next AI in the process (usually unchanged). I haven't yet got him to produce a prompt good enough to pass on to another AI, so my next step is manually editing his attempt at a prompt or sometimes starting again.

4. The prompt for the coding AI is usually pretty easy after we've nutted out our design. It'll typically take me an hour or two to add enough detail and give me an opportunity to make changes or additions if I need to.  With a complete prompt in hand, I'll take it to Gemini.   I have been using Cursor a bit also which is pretty amazing for vibe coding projects quickly, but I find the code base gets out of hand very quickly if we give it very broad prompts. My preference at the moment (and this might change), is to break my builds down into smaller tasks and micro manage the AIs. This is a bit more work up front, but I think it saves a lot of hassle down the line.

5. My last line on the build prompts for Cursor or Gemini is always something like - "please ask if you have questions, feel free to suggest changes/improvements". Gemini and I usually go through 1 or 2 rounds of questions and when he's happy, he codes for me like a champ.  Qween needed a single Lambda function in python, but it was pretty complex. He created this and gave me excellent documentation for building the agent, setting up the Lambda function, API gateway config etc.

6. Deploy and test! Today was a one shot build. I iterated over a few things during the Q & A with Gemini, but after we were done he gave me code I did not need to change at all.  I had a minor issue with the database connectivity, but this was 100% my fault for putting an incorrect url in the Lambda environment variables.   

7. Documentation; Gemini mad me an Open AI/swagger document + a super detailed build and deployment guide in a few seconds.