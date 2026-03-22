import os
from twilio.rest import Client


def send_sms_alert(message: str) -> bool:
    sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    token = os.getenv("TWILIO_AUTH_TOKEN", "")
    twilio_phone = os.getenv("TWILIO_PHONE", "")
    alert_phone = os.getenv("ALERT_PHONE", "")

    print("\n===== TWILIO DEBUG START =====")
    print("SID loaded:", bool(sid))
    print("TOKEN loaded:", bool(token))
    print("FROM (TWILIO_PHONE):", twilio_phone)
    print("TO (ALERT_PHONE):", alert_phone)
    print("MESSAGE:", message)
    print("===== TWILIO DEBUG END =====\n")

    if not sid or not token or not twilio_phone or not alert_phone:
        print("⚠️ Twilio not configured. Skipping SMS.")
        return False

    try:
        client = Client(sid, token)
        msg = client.messages.create(
            body=message,
            from_=twilio_phone,
            to=alert_phone,
        )
        print("✅ SMS SENT SUCCESS:", msg.sid)
        return True
    except Exception as e:
        print("❌ SMS FAILED ERROR:", e)
        return False
