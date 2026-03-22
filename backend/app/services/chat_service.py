import os
import requests


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def chat_with_openrouter(user_message: str, system_prompt: str = "") -> str:
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    model = os.getenv("OPENROUTER_MODEL", "google/gemma-2-2b-it")

    if not api_key:
        return "⚠️ OPENROUTER_API_KEY missing in .env"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        # Optional but recommended:
        "HTTP-Referer": "http://localhost",
        "X-Title": "TechCrunch CareChat"
    }

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})

    messages.append({"role": "user", "content": user_message})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 200,
    }

    res = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)

    if res.status_code != 200:
        return f"❌ OpenRouter Error {res.status_code}: {res.text}"

    data = res.json()
    reply = data["choices"][0]["message"]["content"]
    return reply.strip()
