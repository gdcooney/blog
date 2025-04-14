---
title: "Setting Up WhatsApp Messaging with Meta and AWS"
description: "How I built a working WhatsApp bot using Meta Cloud API and AWS Lambda."
pubDatetime: 2025-04-13
tags: ["whatsapp", "serverless", "lambda", "meta", "messaging"]
draft: false
---

Another random idea from some random comment on a podcast this morning; "Can I do some AI genertaed response to a Whatsapp message?". Turns out - yep, you can and the test setup is quite easy. The setup I got workingfor the WhatsApp bot using the Meta Cloud API, AWS Lambda, and API Gateway. 

I'm documenting the exact steps here for future reference, or if I want to rebuild this somewhere else.

---

## What I Built

A WhatsApp bot that:
- Responds automatically to incoming messages with a Hello Gee message
- Is deployed as a Python function in AWS Lambda
- Sends messages back through the Meta Cloud API
- Uses a test number provided by Meta (for now)

---

## Stack

- **WhatsApp Cloud API** (via Meta)
- **AWS Lambda (Python 3.13)**
- **API Gateway (REST + proxy integration)**
- **requests** for outbound calls to Meta

---

## Step-by-Step Setup

### 1. Meta Developer Setup

- Created a Meta Developer App
- Enabled the **WhatsApp product**
- Got:
  - A test number
  - A temporary access token (valid 23h)
  - Phone number ID
- Added my personal number as a **test recipient**
  - Verified it by entering the code Meta sent via WhatsApp

---

### 2. Created the Lambda Function

Used Python 3.13.

```bash
mkdir teambot-lambda
cd teambot-lambda
pip install requests -t .
```

Wrote `lambda_function.py` to:
- Handle GET requests (for webhook verification)
- Parse POST requests from Meta
- Send back a `"hello gee"` message via Meta’s messaging API

Zipped it:

```bash
zip -r function.zip .
```

Uploaded to AWS Lambda.

Set environment variables:
- `WHATSAPP_TOKEN`
- `PHONE_NUMBER_ID`

---

### 3. API Gateway Setup

Important: used **REST API**, not HTTP API.

- Created a new resource: `/webhook`
- Method: `ANY`
- Enabled **Lambda proxy integration**
- Deployed to `/prod` stage

Endpoint looked like:

```
https://abc123.execute-api.us-west-2.amazonaws.com/prod/webhook
```

---

### 4. Webhook Verification

In Meta Developer Portal:
- Went to WhatsApp > Configuration > Webhooks
- Entered:
  - Callback URL: the API Gateway URL
  - Verify Token: `teambot123`

Added webhook GET logic in the Lambda to echo back `hub.challenge`.

Meta confirmed the webhook ✅

---

### 5. Subscribed to Message Events

In Webhooks → Manage:
- Subscribed to `messages`
- Also added `message_status`

---

### 6. Test Message Loop

Sent “hi” to the test number.

Lambda received the message and replied with:
> `"hello gee"`

Confirmed everything working via:
- WhatsApp test chat
- CloudWatch logs (good visibility into events + response status codes)

## Next Steps

Will expand this to:
- Pull input data from Google Sheets
- Add OpenAI GPT Response

But for now — the core pipeline is live. WhatsApp in, Lambda logic, WhatsApp out.

---

TeamBot is alive. 🧠📲
