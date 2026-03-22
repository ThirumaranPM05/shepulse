import os
import requests

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def chat_with_openrouter(user_message: str, system_prompt: str = "") -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    model = os.getenv("OPENROUTER_MODEL", "google/gemma-2-2b-it")

    # ✅ FIXED MESSAGE (no .env confusion)
    if not api_key:
        return "⚠️ Server config error: API key not set"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://shepulse-bymv.onrender.com",  # ✅ updated
        "X-Title": "ShePulse CareChat"
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

    try:
        res = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=30
        )

        if res.status_code != 200:
            return f"❌ OpenRouter Error {res.status_code}: {res.text}"

        data = res.json()

        return data["choices"][0]["message"]["content"].strip()

    except Exception as e:
        print("Chat error:", e)
        return "⚠️ Chat service failed. Try again."