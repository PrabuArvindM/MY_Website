import json
from datetime import datetime, timedelta
from app.database import get_db_connection
from app.services.news_service import generate_live_dashboard_payload

def generate_report_payload(date_str):
    """
    Generates a dynamic real-world Jarvis Daily Intelligence Report for a given date_str.
    """
    return generate_live_dashboard_payload(date_str)

def run_jarvis_daily_report(force_today=False):
    """
    Checks and generates daily reports in SQLite database.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    today_str = datetime.now().strftime("%Y-%m-%d")
    yesterday_str = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    last_week_str = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

    dates_to_ensure = [today_str, yesterday_str, last_week_str]

    for d in dates_to_ensure:
        cursor.execute("SELECT id FROM jarvis_daily_reports WHERE report_date = ?", (d,))
        row = cursor.fetchone()
        if not row or (d == today_str and force_today):
            if row and force_today:
                cursor.execute("DELETE FROM jarvis_daily_reports WHERE report_date = ?", (d,))
            
            payload = generate_report_payload(d)
            cursor.execute("""
            INSERT INTO jarvis_daily_reports 
            (report_date, last_scan_time, trending_company, trending_model, stories_count, papers_count, top_news_json, model_releases_json, research_papers_json, daily_tool_json, daily_term_json, full_report_md)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                payload["report_date"], payload["last_scan_time"], payload["trending_company"], payload["trending_model"],
                payload["stories_count"], payload["papers_count"], payload["top_news_json"], payload["model_releases_json"],
                payload["research_papers_json"], payload["daily_tool_json"], payload["daily_term_json"], payload["full_report_md"]
            ))

    conn.commit()
    conn.close()
    print("Jarvis AI Agent successfully processed daily reports pipeline.")

if __name__ == "__main__":
    run_jarvis_daily_report(force_today=True)
