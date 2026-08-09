import sqlite3
import os
from pathlib import Path

DB_PATH = Path(__file__).parent / "data" / "portfolio.db"

def get_db_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Blog Posts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        banner_image TEXT NOT NULL,
        author TEXT DEFAULT 'Prabu Arvind M',
        read_time TEXT DEFAULT '5 min read',
        difficulty TEXT DEFAULT 'Intermediate',
        tech_badges TEXT DEFAULT 'AI, Python',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        views INTEGER DEFAULT 0
    )
    """)

    # Comments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blog_id INTEGER NOT NULL,
        author_name TEXT NOT NULL,
        author_email TEXT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (blog_id) REFERENCES blogs (id) ON DELETE CASCADE
    )
    """)

    # Contact Messages Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Projects Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        summary TEXT NOT NULL,
        description TEXT NOT NULL,
        problem_statement TEXT,
        objectives TEXT,
        architecture_workflow TEXT,
        tech_stack TEXT NOT NULL,
        algorithms TEXT,
        challenges TEXT,
        solutions TEXT,
        github_url TEXT,
        demo_url TEXT,
        image_url TEXT NOT NULL
    )
    """)

    # Patents Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        patent_number TEXT NOT NULL,
        status TEXT NOT NULL,
        filing_date TEXT,
        abstract TEXT NOT NULL,
        my_contribution TEXT NOT NULL,
        image_url TEXT NOT NULL
    )
    """)

    # Internships Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        location TEXT NOT NULL,
        period TEXT NOT NULL,
        summary TEXT NOT NULL,
        highlights TEXT NOT NULL,
        certificate_pdf TEXT,
        certificate_img TEXT
    )
    """)

    # Certifications Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        provider TEXT NOT NULL,
        year TEXT NOT NULL,
        icon TEXT NOT NULL,
        badge_color TEXT DEFAULT 'var(--accent-cyan)'
    )
    """)

    # Achievements Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        award TEXT NOT NULL,
        institution TEXT NOT NULL,
        icon TEXT NOT NULL,
        badge_color TEXT DEFAULT 'var(--accent-cyan)'
    )
    """)

    # JARVIS AI Newsletter Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS jarvis_newsletters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_date TEXT UNIQUE NOT NULL,
        newsletter_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Email OTP Verification Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS email_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        otp_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        attempts INTEGER DEFAULT 0,
        is_verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
