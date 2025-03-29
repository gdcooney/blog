# .github/scripts/fix_markdown.py

import os
import glob
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

POST_DIR = "src/data/blog"
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

prompt = """
You are an expert editor. Fix all spelling and grammar mistakes in the following Markdown blog post.
Do not change formatting, links, or tone. Return only the corrected Markdown.
"""

def clean_markdown(content):
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": content},
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        original = f.read()

    cleaned = clean_markdown(original)

    if cleaned.strip() != original.strip():
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(cleaned)
        print(f"🧠 Fixed: {filepath}")
    else:
        print(f"✅ No changes needed: {filepath}")

def main():
    files = glob.glob(f"{POST_DIR}/**/*.md", recursive=True)
    if not files:
        print("No markdown files found.")
        return

    for file in files:
        process_file(file)

if __name__ == "__main__":
    main()

