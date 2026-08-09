from fastapi import APIRouter, Request
from app.schemas.otp_schema import SendOTPSchema, VerifyOTPSchema
from app.services.otp_service import generate_and_store_otp, verify_otp_code

router = APIRouter(prefix="/api", tags=["OTP Verification"])

@router.post("/send-otp")
def send_otp(payload: SendOTPSchema, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    return generate_and_store_otp(payload.email, client_ip)

@router.post("/verify-otp")
def verify_otp(payload: VerifyOTPSchema):
    return verify_otp_code(payload.email, payload.otp)
