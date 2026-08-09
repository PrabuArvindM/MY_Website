from fastapi import APIRouter, HTTPException
from app.database import get_db_connection

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.get("")
def get_projects():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects ORDER BY id ASC")
    projects = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return projects

@router.get("/{slug}")
def get_project_detail(slug: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE slug = ?", (slug,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    return dict(row)
