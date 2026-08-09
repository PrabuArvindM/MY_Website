from fastapi import APIRouter
from app.database import get_db_connection

router = APIRouter(prefix="/api/certifications", tags=["Certifications"])

@router.get("")
def get_certifications():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM certifications ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
