import os
import json
import logging
import smtplib
import urllib.request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

# Setup file logging
LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "contact_emails.log")

logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format="%(asctime)s - %(message)s")

def send_otp_email(target_email: str, otp_code: str) -> bool:
    email_subject = "Your Verification Code"
    email_body = f"""Hello,

Your verification code is:

{otp_code}

This code expires in 5 minutes.

If you did not request this verification,
please ignore this email.

Regards,

Jarvis AI Assistant
"""
    logging.info(f"DISPATCHING OTP TO {target_email}:\n{email_body}\n" + "="*50)

    # 1. Try Resend API if configured
    if settings.RESEND_API_KEY:
        try:
            req_data = json.dumps({
                "from": "Jarvis AI Assistant <onboarding@resend.dev>",
                "to": [target_email],
                "subject": email_subject,
                "text": email_body
            }).encode('utf-8')

            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=req_data,
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            with urllib.request.urlopen(req) as resp:
                if resp.status in (200, 201):
                    print(f"OTP email sent via Resend API to {target_email}!")
                    return True
        except Exception as e:
            print(f"Resend API dispatch failed: {e}. Falling back to SMTP / logging...")

    # 2. Try SMTP if EMAIL_USER and EMAIL_PASSWORD exist
    if settings.EMAIL_USER and settings.EMAIL_PASSWORD:
        try:
            msg_mime = MIMEMultipart()
            msg_mime["From"] = f"Jarvis AI <{settings.EMAIL_USER}>"
            msg_mime["To"] = target_email
            msg_mime["Subject"] = email_subject
            msg_mime.attach(MIMEText(email_body, "plain"))

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.EMAIL_USER.strip(), settings.EMAIL_PASSWORD.strip().replace(" ", ""))
            server.sendmail(settings.EMAIL_USER.strip(), target_email.strip(), msg_mime.as_string())
            server.quit()
            print(f"SUCCESS: OTP email sent via Gmail SMTP to {target_email}!")
            return True
        except Exception as e:
            print(f"ERROR: Gmail SMTP dispatch failed: {e}")

    print(f"\n" + "="*60)
    print(f"📩 OTP CODE GENERATED FOR: {target_email}")
    print(f"🔑 YOUR 6-DIGIT VERIFICATION CODE IS: {otp_code}")
    print(f"ℹ️  To deliver emails directly to Gmail inboxes, please set:")
    print(f"    EMAIL_PASSWORD=your_16_digit_app_password in .env")
    print("="*60 + "\n")
    return True

def send_contact_notification_email(name: str, email: str, subject: str, message: str, timestamp_str: str, client_ip: str = "127.0.0.1", user_agent: str = "Browser") -> bool:
    email_subject = "New Contact Request from Portfolio"
    email_body = f"""Name: {name}
Email: {email}
Subject: {subject}
Message: {message}

Time: {timestamp_str}
Browser: {user_agent}
IP Address: {client_ip}
"""
    target_admin = "prabuarvind2005@gmail.com"
    logging.info(f"DISPATCHING CONTACT NOTIFICATION TO {target_admin}:\n{email_body}\n" + "="*50)

    # 1. Try Resend API if configured
    if settings.RESEND_API_KEY:
        try:
            req_data = json.dumps({
                "from": "Portfolio Contact <onboarding@resend.dev>",
                "to": [target_admin],
                "subject": email_subject,
                "text": email_body
            }).encode('utf-8')

            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=req_data,
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            with urllib.request.urlopen(req) as resp:
                if resp.status in (200, 201):
                    return True
        except Exception as e:
            print(f"Resend API contact dispatch failed: {e}")

    # 2. Try SMTP
    if settings.EMAIL_USER and settings.EMAIL_PASSWORD:
        try:
            msg_mime = MIMEMultipart()
            msg_mime["From"] = settings.EMAIL_USER
            msg_mime["To"] = target_admin
            msg_mime["Subject"] = email_subject
            msg_mime.attach(MIMEText(email_body, "plain"))

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(settings.EMAIL_USER, settings.EMAIL_PASSWORD)
            server.sendmail(settings.EMAIL_USER, target_admin, msg_mime.as_string())
            server.quit()
            return True
        except Exception as e:
            print(f"Gmail SMTP contact dispatch failed: {e}")

    return True
