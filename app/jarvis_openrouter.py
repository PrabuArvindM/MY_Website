import json
import os
import urllib.request
from datetime import datetime
from app.database import get_db_connection
from app.services.news_service import generate_live_newsletter_payload

NEWSLETTER_ARTICLES = []

def generate_daily_newsletter(force_refresh=False):
    """
    Checks if today's newsletter exists in database and is live.
    If force_refresh is True or no valid live payload exists, fetches real-time AI news and updates database.
    """
    today_str = datetime.now().strftime("%Y-%m-%d")
    today_readable = datetime.now().strftime("%B %d, %Y")
    conn = get_db_connection()
    cursor = conn.cursor()

    if not force_refresh:
        cursor.execute("SELECT newsletter_json FROM jarvis_newsletters WHERE report_date = ?", (today_str,))
        row = cursor.fetchone()
        if row:
            try:
                cached_data = json.loads(row["newsletter_json"])
                if cached_data.get("is_live", False):
                    conn.close()
                    return cached_data
            except Exception:
                pass

    # Build fresh live newsletter payload from real-time feeds
    payload = generate_live_newsletter_payload()

    cursor.execute("""
    INSERT INTO jarvis_newsletters (report_date, newsletter_json)
    VALUES (?, ?)
    ON CONFLICT(report_date) DO UPDATE SET newsletter_json=excluded.newsletter_json
    """, (today_str, json.dumps(payload)))
    conn.commit()
    conn.close()

    print(f"Jarvis successfully generated & saved Live AI Newsletter for {today_readable}.")
    return payload

if __name__ == "__main__":
    generate_daily_newsletter()
