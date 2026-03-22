import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_risk_email(subject: str, body: str) -> bool:
    mail_user = os.getenv("MAIL_USER", "")
    mail_pass = os.getenv("MAIL_PASS", "")
    alert_to = os.getenv("ALERT_TO_EMAIL", "")

    print("\n===== EMAIL DEBUG START =====")
    print("MAIL_USER:", mail_user)
    print("MAIL_PASS exists:", bool(mail_pass))
    print("ALERT_TO_EMAIL:", alert_to)
    print("SUBJECT:", subject)
    print("===== EMAIL DEBUG END =====\n")

    if not mail_user or not mail_pass or not alert_to:
        print("⚠️ Email not configured. Skipping email alert.")
        return False

    msg = MIMEMultipart()
    msg["From"] = mail_user
    msg["To"] = alert_to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.ehlo()

        server.login(mail_user, mail_pass)
        server.sendmail(mail_user, alert_to, msg.as_string())
        server.quit()

        print("✅ Email sent successfully!")
        return True

    except Exception as e:
        print("❌ Email error:", repr(e))
        return False
