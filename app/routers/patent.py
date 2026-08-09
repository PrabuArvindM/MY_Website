from fastapi import APIRouter
from app.database import get_db_connection

router = APIRouter(prefix="/api/patents", tags=["Patents"])

@router.get("")
def get_patents():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patents ORDER BY id ASC")
    patents = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return patents
