from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel
from typing import Optional, List
import json
import re
from app.database import get_db_connection

router = APIRouter(prefix="/api/blogs", tags=["Blog"])

# Admin Security Key (Simple secret for demo admin actions)
ADMIN_SECRET = "PrabuAI2026AdminPass"

class BlogCreate(BaseModel):
    title: str
    category: str
    summary: str
    content: str
    banner_image: str
    read_time: Optional[str] = "5 min read"

class CommentCreate(BaseModel):
    author_name: str
    author_email: str
    comment: str

class AdminAuth(BaseModel):
    passcode: str

def generate_slug(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug

@router.get("")
def get_all_blogs(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT id, title, slug, category, summary, banner_image, author, read_time, difficulty, tech_badges, created_at, views FROM blogs WHERE 1=1"
    params = []

    if category and category.lower() != "all":
        query += " AND LOWER(category) = LOWER(?)"
        params.append(category)

    if search:
        query += " AND (LOWER(title) LIKE LOWER(?) OR LOWER(summary) LIKE LOWER(?) OR LOWER(content) LIKE LOWER(?))"
        term = f"%{search}%"
        params.extend([term, term, term])

    query += " ORDER BY id DESC"
    cursor.execute(query, params)
    blogs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return blogs

@router.get("/{slug}")
def get_blog_by_slug(slug: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Update view count
    cursor.execute("UPDATE blogs SET views = views + 1 WHERE slug = ?", (slug,))
    conn.commit()

    cursor.execute("SELECT * FROM blogs WHERE slug = ?", (slug,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    blog = dict(row)

    # Fetch Comments
    cursor.execute("SELECT id, author_name, comment, created_at FROM comments WHERE blog_id = ? ORDER BY id DESC", (blog["id"],))
    comments = [dict(r) for r in cursor.fetchall()]
    blog["comments"] = comments

    # Fetch Related Articles
    cursor.execute("SELECT id, title, slug, category, banner_image, read_time FROM blogs WHERE category = ? AND slug != ? LIMIT 3", (blog["category"], slug))
    related = [dict(r) for r in cursor.fetchall()]
    blog["related_articles"] = related

    conn.close()
    return blog

@router.post("")
def create_blog(blog: BlogCreate, x_admin_passcode: Optional[str] = Header(None)):
    if x_admin_passcode != ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized admin action. Invalid admin passcode.")

    slug = generate_slug(blog.title)
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
        INSERT INTO blogs (title, slug, category, summary, content, banner_image, read_time)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (blog.title, slug, blog.category, blog.summary, blog.content, blog.banner_image, blog.read_time))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return {"status": "success", "id": new_id, "slug": slug, "message": "Blog post created successfully!"}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Error creating post: {str(e)}")

@router.delete("/{blog_id}")
def delete_blog(blog_id: int, x_admin_passcode: Optional[str] = Header(None)):
    if x_admin_passcode != ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized admin action.")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM blogs WHERE id = ?", (blog_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Blog post deleted successfully."}

@router.post("/{blog_id}/comments")
def add_comment(blog_id: int, comment: CommentCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM blogs WHERE id = ?", (blog_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Blog post not found")

    cursor.execute("""
    INSERT INTO comments (blog_id, author_name, author_email, comment)
    VALUES (?, ?, ?, ?)
    """, (blog_id, comment.author_name, comment.author_email, comment.comment))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"status": "success", "id": new_id, "message": "Comment posted successfully!"}

@router.post("/auth")
def verify_admin(auth: AdminAuth):
    if auth.passcode == ADMIN_SECRET:
        return {"status": "success", "authenticated": True, "token": ADMIN_SECRET}
    else:
        raise HTTPException(status_code=401, detail="Invalid admin passcode.")
