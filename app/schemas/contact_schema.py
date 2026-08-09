from pydantic import BaseModel, Field

class ContactSchema(BaseModel):
    name: str = Field(..., min_length=1, description="Full name")
    email: str = Field(..., description="Email address")
    subject: str = Field(..., min_length=1, description="Subject")
    message: str = Field(..., min_length=20, description="Message body (min 20 chars)")
