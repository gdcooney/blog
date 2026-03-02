---
title: "New Project Idea"
description: "Start of a new project series on creating QR codes as a service"
pubDatetime: 2025-04-18 21:00:30
tags: ["blog", "qween", "qr service"]
draft: false
---

I've been thinking about a larger project using QR codes. I'm still not 100% on how that will look and what it'll do, but I do know that I want a service in my ecosystem that can return me a QR  code. So I'm gonna build it!

to recap my design principles for projects:
- No permanent infrastructure, all server less where possible (which is why I lean heavily into Lambda etc)
- Always free components (again Lambda...), or free tier where possible. 
- Should scale easily if I need it to (hence server less / lambda etc)    

My work pattern currently is design in the evening, build in the morning when I'm fresh. This works a lot better than bashing away at technical stuff late at night. 

The first step in the design process tonight is to work through the design with old mate ChatGPT. We've had a productive Q & A session and have settled on this design for our MVP:

<div style="text-align: right;"><a href="https://7jt1ta451d.execute-api.ap-southeast-2.amazonaws.com/prod/ndpmSQN-9g" target="_blank" rel="noopener noreferrer"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAADNCAIAAACU3mM+AAAEgklEQVR4nO3dQY7kJgBA0XSU+195svfCEQI+OP3edrrL1VNfyLiM+fnz589fsNnfp98Av4LOKOiMgs4o6IyCzijojILOKOiMgs4o6IyCzijojILOKOiMgs4o6IyCzijojMI/M7/88/Oz6n28eyxieBz3/V/3vXL2rt6d+hSGGM8o6IyCzijojMLUPOBh4ZLjoXPb9x9+Px//xEn0+wxj4YHejzvDeEZBZxR0RkFnFFbOAx72XQF//+GZacEn/nXIvk9hiPGMgs4o6IyCzihsnAd80cIr4EP3BWVfS5xiPKOgMwo6o6AzCp+cB+w7a953QXzmiv/CrwdOMZ5R0BkFnVHQGYWN84DsdHVmVW22IvfUufwlkwbjGQWdUdAZBZ1RWDkPuOTmloVn+kMrcrPjDr3UJYxnFHRGQWcUdEZhah5wybXmITOn9kOvnD3k5xOfgvGMgs4o6IyCzih0+wcsfMjPzNsYcmqt774D7fsU3hnPKOiMgs4o6IxCt3/AvnPMdzMrcmdeeWijgoV//p1fDxjPKOiMgs4o6IzCyvuC9l0Qfxzo1Ha7C+/emdnObN+EY98HajyjoDMKOqOgMwo/2YX4h1O7bt35wM6hP/Bh3x5kCxnPKOiMgs4o6IzCseeGLjzxzyy8xWjhf072rCHrA7idzijojILOKGycByy88p6dU2dXzxeuLVj4NvYxnlHQGQWdUdAZhUv3Edv3+KBTT+rft7bg3SUPYjKeUdAZBZ1R0BmFqfUBCx9gufBGoIU3188caN8uY+9v407GMwo6o6AzCjqjsPH7gIdT++vuu8Vo5kDv9i1EOLVM2nhGQWcUdEZBZxSO7R+wcH/dfZfLL1lbsO9A1gfwv6IzCjqjoDMKK+cB2W1CC1/qknXC7/ZNZYZ+d4bxjILOKOiMgs4orFwfcOqx/u+yk+hLVgDYP4DfS2cUdEZBZxQ2zgNmXuohezLoqVuMht7Guzu3UTOeUdAZBZ1R0BmFlfsJZ8/82fdEoE8sKs4eiPT+UkOMZxR0RkFnFHRGoXtuaHbWvO+Bnae2Nb5kfYB5ALfTGQWdUdAZhZXfB/zHkQ6t181WHmT7B1yy1HmI8YyCzijojILOKGz8PuDULfDvB7rzdy/5amHflMJ4RkFnFHRGQWcUuu8DFpq5Pp7dTT/kzicRuS+Ij9EZBZ1R0BmFqf0DTp0mD+1Btm9r4odTM4x9G7QtZDyjoDMKOqOgMwrdfsJD3k+Th864Z6YFM/uXPexbcvyJlc/GMwo6o6AzCjqjsHIe8LBvt6/s7DW7qWboL7rkbqUhxjMKOqOgMwo6o7BxHpA5dVP/wj259r3Uw6lnDRnPKOiMgs4o6IzCJ+cBC+/EnzkR3vfDdz5F1TphbqczCjqjoDMKG+cBp5aknnqe/r4JR7Zf29BLDTGeUdAZBZ1R0BmFlfOA7IacIQuv+O/bL2HfPUX2E+YX0RkFnVHQGYVP7h/A5xjPKOiMgs4o6IyCzijojILOKOiMgs4o6IyCzijojILOKOiMgs4o6IyCzijojILOKPwL48nXrtkGR/0AAAAASUVORK5CYII=" alt="QR Code" width="200" /></a></div>




### AI Generated:

```ai
# ðŸ§± QR Code Service MVP â€“ Architecture Summary

## ðŸŽ¯ Purpose
Public-facing service to generate QR codes and manage short URL redirects.

Internally known as **Qween**, but all public API routes and responses are **brand-neutral or app-branded**.

---

## ðŸŒ� API Layer â€“ AWS API Gateway

| Method | Path                | Description                   | Auth        |
|--------|---------------------|-------------------------------|-------------|
| POST   | `/generate`         | Generates a QR + short URL    | `x-api-key` |
| GET    | `/{short_id}`       | Redirects to original URL     | Public      |

> âœ… No `/qween` or internal terms in public routes

---

## âš™ï¸� Processing â€“ AWS Lambda

### 1. `generate.py`
- Validates `type=url` input
- Creates short ID (`abc123`)
- Generates QR code that points to `https://yourdomain.com/abc123`
- Encodes as base64
- Saves to Supabase
- Returns:

>```json
> {
>  "short_url": "https://yourdomain.com/abc123",
>  "qr_base64": "data:image/png;base64,..."
> }
>```

### 2. `redirect.py`
- Resolves `{short_id}` to original URL
- Returns `302 Location: original_url` or 404

---

## ðŸ—„ï¸� Supabase Database â€“ `qr_codes`

```sql
CREATE TABLE qr_codes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active',
  scan_count INTEGER DEFAULT 0
);
```

---

## ðŸ”� Authentication

- POST requires `x-api-key`
- Stubbed for OAuth2 upgrade later
- GET remains public for scannability

---

## ðŸŒ� Public-Facing Experience

| Feature            | Public View                     |
|--------------------|---------------------------------|
| QR Encoded URL     | `https://yourdomain.com/abc123` |
| API POST URL       | `https://api.yourdomain.com/generate` |
| Branding in Payload | None â€” neutral by default       |

```

Based on that, I'll get him to help with some of the database creation work and create me a prompt to take to Gemini for the coding of the lambda function tomorrow. 

I'm looking forward to building this tomorrow morning.  

also - this post should be the first that Tina publishes on her own via AWS Event Bridge Schedule ðŸ¤žðŸ�¼
