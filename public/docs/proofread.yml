name: 🧠 AI Proofreader for Blog Posts

on:
  push:
    paths:
      - 'src/data/blog/**/*.md'
  workflow_dispatch:

jobs:
  proofread:
    name: Run AI Spellcheck & Commit Fixes
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v3

      - name: 🧠 Run AI Fixer
        run: |
          npm install openai glob
          node .github/scripts/fix-markdown.js
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: 📤 Commit fixed posts
        run: |
          git config user.name "Gee's AI Agent"
          git config user.email "gee@bot.local"
          git add src/data/blog/*.md
          git commit -m "🤖 Auto-proofread blog posts"
          git push
        continue-on-error: true

