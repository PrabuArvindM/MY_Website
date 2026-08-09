from fastapi import APIRouter
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter(prefix="/api/resume", tags=["Resume"])

RESUME_PATH = Path(__file__).parent.parent.parent / "static" / "assets" / "docs" / "Prabu_Arvind_M_Resume.pdf"

@router.get("/download")
def download_resume():
    if RESUME_PATH.exists():
        return FileResponse(
            path=RESUME_PATH,
            filename="Prabu_Arvind_M_Resume.pdf",
            media_type="application/pdf"
        )
    return {"error": "Resume PDF not found"}
