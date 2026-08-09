import os
import sys

def main():
    print("="*65)
    print("  🤖 JARVIS PORTFOLIO REAL EMAIL DELIVERY SETUP HELPER")
    print("="*65)
    print("\nTo deliver real 6-digit OTP emails directly to visitors' Gmail")
    print("inboxes (like prabuarvindm@gmail.com), select your preferred free provider:\n")
    print("1. Resend API Key (Recommended - Free 3,000 emails/month at resend.com)")
    print("2. Gmail App Password (Free 16-character code at myaccount.google.com/apppasswords)\n")

    env_path = os.path.join(os.path.dirname(__file__), ".env")

    try:
        choice = input("Enter choice (1 or 2): ").strip()

        if choice == "1":
            resend_key = input("Paste your Resend API Key (starts with re_): ").strip()
            if resend_key:
                update_env("RESEND_API_KEY", resend_key)
                print("\n🎉 SUCCESS! Resend API Key saved to .env!")
                print("Real OTP emails will now arrive directly in visitors' Gmail inboxes.")

        elif choice == "2":
            email = input("Enter your Gmail address [prabuarvind2005@gmail.com]: ").strip() or "prabuarvind2005@gmail.com"
            app_pass = input("Paste your 16-character Gmail App Password: ").strip()
            if app_pass:
                update_env("EMAIL_USER", email)
                update_env("EMAIL_PASSWORD", app_pass)
                print("\n🎉 SUCCESS! Gmail SMTP credentials saved to .env!")
                print("Real OTP emails will now arrive directly in visitors' Gmail inboxes.")
        else:
            print("Invalid choice. Please run 'python3 setup_email.py' again.")

    except KeyboardInterrupt:
        print("\nSetup cancelled.")

def update_env(key, val):
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    lines = []
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

    updated = False
    new_lines = []
    for line in lines:
        if line.startswith(f"{key}="):
            new_lines.append(f"{key}={val}\n")
            updated = True
        else:
            new_lines.append(line)

    if not updated:
        new_lines.append(f"{key}={val}\n")

    with open(env_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)

if __name__ == "__main__":
    main()
