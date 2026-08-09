from fastapi import APIRouter
from app.database import get_db_connection

router = APIRouter(prefix="/api/achievements", tags=["Achievements"])

@router.get("")
def get_achievements():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM achievements ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
