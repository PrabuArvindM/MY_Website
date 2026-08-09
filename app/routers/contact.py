import html
from datetime import datetime
from fastapi import APIRouter, HTTPException, Request, status
from app.schemas.contact_schema import ContactSchema
from app.database import get_db_connection
from app.services.email_service import send_contact_notification_email

router = APIRouter(prefix="/api", tags=["Contact"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

@router.post("/contact")
def submit_contact(payload: ContactSchema, request: Request):
    clean_email = payload.email.strip().lower()

    # Check if email is verified
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT is_verified FROM email_verifications WHERE email = ?", (clean_email,))
    row = cursor.fetchone()

    if not row or not row["is_verified"]:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address has not been verified. Please verify your email first."
        )

    # Input Sanitization
    clean_name = html.escape(payload.name.strip())
    clean_subject = html.escape(payload.subject.strip())
    clean_message = html.escape(payload.message.strip())

    if len(clean_message) < 20:
        conn.close()
        raise HTTPException(status_code=400, detail="Message is too short. Minimum 20 characters required.")

    timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "Unknown Browser")

    # Store Message
    cursor.execute("""
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
    """, (clean_name, clean_email, clean_subject, clean_message))
    conn.commit()
    msg_id = cursor.lastrowid

    # Clear verification status after successful delivery
    cursor.execute("DELETE FROM email_verifications WHERE email = ?", (clean_email,))
    conn.commit()
    conn.close()

    # Dispatch email notification to prabuarvind2005@gmail.com
    send_contact_notification_email(clean_name, clean_email, clean_subject, clean_message, timestamp_str, client_ip, user_agent)

    return {
        "status": "success",
        "id": msg_id,
        "message": "🎉 Message sent successfully! Thank you for reaching out."
    }

@router.get("/contact")
def get_contact_messages():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY id DESC")
    messages = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return messages
