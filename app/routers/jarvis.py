from fastapi import APIRouter, HTTPException, Header, Query, Response
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import json
from app.database import get_db_connection
from app.jarvis_agent import run_jarvis_daily_report
from app.jarvis_openrouter import generate_daily_newsletter

router = APIRouter(prefix="/api/jarvis", tags=["Jarvis AI Agent"])
ADMIN_SECRET = "PrabuAI2026AdminPass"

@router.get("/dashboard")
def get_jarvis_dashboard(response: Response = Response(), date: Optional[str] = Query(None), refresh: bool = Query(False)):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"


    if refresh:
        run_jarvis_daily_report(force_today=True)
        generate_daily_newsletter(force_refresh=True)


    conn = get_db_connection()
    cursor = conn.cursor()

    target_date = date if (date and isinstance(date, str)) else datetime.now().strftime("%Y-%m-%d")


    cursor.execute("SELECT * FROM jarvis_daily_reports WHERE report_date = ?", (target_date,))
    row = cursor.fetchone()

    if not row:
        run_jarvis_daily_report()
        cursor.execute("SELECT * FROM jarvis_daily_reports ORDER BY report_date DESC LIMIT 1")
        row = cursor.fetchone()

    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="No Jarvis Daily Report available.")

    report = dict(row)

    return {
        "status": "ONLINE",
        "agent_name": "Jarvis AI Agent",
        "report_date": report["report_date"],
        "last_scan_time": report["last_scan_time"],
        "next_scan_in": "30 minutes",
        "trending_company": report["trending_company"],
        "trending_model": report["trending_model"],
        "stories_count": report["stories_count"],
        "papers_count": report["papers_count"],
        "top_news": json.loads(report["top_news_json"]),
        "model_releases": json.loads(report["model_releases_json"]),
        "research_papers": json.loads(report["research_papers_json"]),
        "daily_tool": json.loads(report["daily_tool_json"]),
        "daily_term": json.loads(report["daily_term_json"]),
        "full_report_md": report["full_report_md"]
    }

@router.get("/archives")
def get_jarvis_archives():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT report_date, last_scan_time, trending_model FROM jarvis_daily_reports ORDER BY report_date DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@router.post("/trigger")
def trigger_jarvis_manually(x_admin_passcode: Optional[str] = Header(None)):
    if x_admin_passcode != ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized admin action.")
    
    run_jarvis_daily_report(force_today=True)
    generate_daily_newsletter(force_refresh=True)
    return {"status": "success", "message": "Jarvis AI Agent report generated & database updated!"}

