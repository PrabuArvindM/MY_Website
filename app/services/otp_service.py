import random
import hashlib
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from app.config import settings
from app.database import get_db_connection
from app.services.email_service import send_otp_email

OTP_REQUEST_LOG = {}
MAX_OTP_REQUESTS_PER_HOUR = 5

def hash_otp(email: str, otp: str) -> str:
    salt = settings.SECRET_KEY
    return hashlib.sha256(f"{email.lower().strip()}:{otp.strip()}:{salt}".encode('utf-8')).hexdigest()

def check_otp_rate_limit(email: str, client_ip: str):
    if not settings.ENABLE_RATE_LIMIT:
        return

    now = datetime.now()
    cutoff = now - timedelta(hours=1)
    key = f"{email.lower().strip()}:{client_ip}"

    if key not in OTP_REQUEST_LOG:
        OTP_REQUEST_LOG[key] = []

    OTP_REQUEST_LOG[key] = [ts for ts in OTP_REQUEST_LOG[key] if ts > cutoff]

    if len(OTP_REQUEST_LOG[key]) >= MAX_OTP_REQUESTS_PER_HOUR:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Maximum 5 OTP requests per hour allowed."
        )

    OTP_REQUEST_LOG[key].append(now)

def generate_and_store_otp(email: str, client_ip: str = "127.0.0.1"):
    clean_email = email.strip().lower()
    if "@" not in clean_email or "." not in clean_email:
        raise HTTPException(status_code=400, detail="Invalid email address.")

    check_otp_rate_limit(clean_email, client_ip)

    # Generate random 6-digit numeric OTP code
    otp_code = f"{random.randint(100000, 999999)}"
    hashed_otp = hash_otp(clean_email, otp_code)
    expires_at = datetime.now() + timedelta(minutes=5)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Clean old unverified records for this email
    cursor.execute("DELETE FROM email_verifications WHERE email = ? AND is_verified = 0", (clean_email,))
    
    # Store record
    cursor.execute("""
    INSERT INTO email_verifications (email, otp_hash, expires_at, attempts, is_verified)
    VALUES (?, ?, ?, 0, 0)
    """, (clean_email, hashed_otp, expires_at.strftime("%Y-%m-%d %H:%M:%S")))

    conn.commit()
    conn.close()

    # Dispatch email
    sent = send_otp_email(clean_email, otp_code)
    if not sent:
        raise HTTPException(status_code=500, detail="Failed to send email.")

    return {
        "status": "success",
        "message": "OTP sent successfully.",
        "expires_in_seconds": 300
    }

def verify_otp_code(email: str, otp: str):
    clean_email = email.strip().lower()
    clean_otp = otp.strip()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, otp_hash, expires_at, attempts, is_verified FROM email_verifications WHERE email = ?", (clean_email,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid email address.")

    v_id, stored_hash, expires_at_str, attempts, is_verified = row["id"], row["otp_hash"], row["expires_at"], row["attempts"], row["is_verified"]

    if is_verified:
        conn.close()
        return {"status": "success", "message": "OTP verification successful."}

    # Check expiration (5 minutes)
    expires_at = datetime.strptime(expires_at_str, "%Y-%m-%d %H:%M:%S")
    if datetime.now() > expires_at:
        conn.close()
        raise HTTPException(status_code=400, detail="OTP expired.")

    # Check maximum invalid attempts (3 attempts)
    if attempts >= 3:
        conn.close()
        raise HTTPException(status_code=400, detail="Too many requests.")

    # Verify Hash
    input_hash = hash_otp(clean_email, clean_otp)
    if input_hash != stored_hash:
        new_attempts = attempts + 1
        cursor.execute("UPDATE email_verifications SET attempts = ? WHERE id = ?", (new_attempts, v_id))
        conn.commit()
        conn.close()
        raise HTTPException(status_code=400, detail="Incorrect OTP.")

    # Mark Verified & Delete OTP entry to prevent replay attacks
    cursor.execute("UPDATE email_verifications SET is_verified = 1 WHERE id = ?", (v_id,))
    cursor.execute("DELETE FROM email_verifications WHERE id = ?", (v_id,))
    
    # Store temporary verification token record
    cursor.execute("INSERT OR REPLACE INTO email_verifications (email, otp_hash, expires_at, attempts, is_verified) VALUES (?, 'VERIFIED', ?, 0, 1)", 
                   (clean_email, (datetime.now() + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "OTP verification successful."
    }
