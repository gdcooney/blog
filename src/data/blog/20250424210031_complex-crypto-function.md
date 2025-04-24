---
title: "Complex crypto function"
description: "This lambda is a complicated beast"
pubDatetime: 2025-04-24 21:00:31
tags: ["Blog", "lambda"]
draft: false
---

User generates a private key on the client
We register public key on server
We take a payload from the client. 
We hash the filw

&#x1F4AC; Tina: We hash the file


We add some metadata + hash to create a json payload 
User signs the payload 
User sends us the file and the payload 

We retrieve users public key
We verify the client's signature 
We recreate the hash of the file
Now we know the file has definitely come from the user and that it hasn't been changed.

Now to get that working in a lambda function...