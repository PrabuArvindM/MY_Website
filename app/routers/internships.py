from fastapi import APIRouter
import json
from app.database import get_db_connection

router = APIRouter(prefix="/api/internships", tags=["Internships"])

@router.get("")
def get_internships():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM internships ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    
    internships = []
    for r in rows:
        item = dict(r)
        if item.get("highlights"):
            try:
                item["highlights"] = json.loads(item["highlights"])
            except Exception:
                pass
        internships.append(item)
    return internships
