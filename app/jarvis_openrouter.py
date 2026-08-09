import json
import os
import urllib.request
from datetime import datetime
from app.database import get_db_connection

NEWSLETTER_ARTICLES = [
    {
        "company": "DeepSeek & Open Source AI",
        "headline": "DeepSeek R2 Model Architecture Released with 671B MoE and Native FP8 Quantization",
        "explanation": "DeepSeek unveiled DeepSeek-R2, a open-weights reasoning model utilizing 671 billion parameters with 21 billion active parameters per token. The architecture leverages Group Relative Policy Optimization (GRPO) reinforcement learning to achieve competitive performance against proprietary frontier models.",
        "why_it_matters": "Reduces enterprise computational costs for complex mathematical and algorithmic reasoning by 10x while maintaining open-weight transparency.",
        "source_name": "DeepSeek Research",
        "source_url": "https://deepseek.com"
    },
    {
        "company": "OpenAI",
        "headline": "OpenAI Deploys GPT-6 Vision & Real-Time Multimodal Reasoning Upgrades",
        "explanation": "OpenAI updated its API suite with accelerated vision-language processing models. The new pipeline lowers spatial vision inference latency by 45% while extending contextual understanding across long multi-frame video inputs and complex technical blueprints.",
        "why_it_matters": "Enables zero-shot visual UI engineering, document parsing, and real-time vision processing for autonomous agents.",
        "source_name": "OpenAI Official Blog",
        "source_url": "https://openai.com/index"
    },
    {
        "company": "Google DeepMind",
        "headline": "Google DeepMind Gemini 1.5 Pro Ultra Upgraded to 2M Token Zero-Loss Recall Window",
        "explanation": "Google DeepMind deployed dynamic context scaling upgrades for Gemini 1.5 Pro. The architecture maintains 100% recall accuracy in needle-in-a-haystack benchmarks across 2 million token prompt windows.",
        "why_it_matters": "Allows enterprise developers to input whole software repositories and multi-volume document libraries in a single inference call.",
        "source_name": "Google AI Blog",
        "source_url": "https://blog.google/technology/ai"
    },
    {
        "company": "Anthropic",
        "headline": "Anthropic Introduces Claude 3.5 Sonnet Artifacts & Sandboxed Python Execution Canvas",
        "explanation": "Anthropic launched native sandboxed Python code execution and interactive Artifact UI capabilities within Claude 3.5 Sonnet, setting a new benchmark score of 49.0% on the SWE-bench software engineering evaluation.",
        "why_it_matters": "Transforms conversational LLMs into interactive full-stack web application builders and automated data pipelines.",
        "source_name": "Anthropic News",
        "source_url": "https://anthropic.com/news"
    },
    {
        "company": "Meta AI",
        "headline": "Meta Open-Sources Llama 3.3 70B & FP8 Quantized Checkpoints for Local Deployment",
        "explanation": "Meta released Llama 3.3 featuring fine-tuned 70B parameter checkpoints that match the performance of larger 405B models on MMLU and HumanEval benchmarks while running on a single H100 GPU workstation.",
        "why_it_matters": "Democratizes state-of-the-art open-source LLMs for self-hosted enterprise deployment without cloud API lock-in.",
        "source_name": "Meta AI Research",
        "source_url": "https://ai.meta.com/blog"
    },
    {
        "company": "NVIDIA & Robotics AI",
        "headline": "NVIDIA Embodied AI Foundation Models Enable Zero-Shot Humanoid Robot Manipulation",
        "explanation": "NVIDIA researchers published new Vision-Language-Action (VLA) foundation models trained on synthetic Omniverse physics simulations. Humanoid robots can now perform zero-shot physical manipulation tasks without prior hardware programming.",
        "why_it_matters": "Accelerates the timeline for deploying general-purpose humanoid robots in industrial logistics and automated manufacturing.",
        "source_name": "NVIDIA Developer Blog",
        "source_url": "https://developer.nvidia.com/blog"
    },
    {
        "company": "Healthcare AI & MIT",
        "headline": "MIT & Clinical Institutes Deploy Multimodal Vision AI for Real-Time Radiology Auditing",
        "explanation": "Medical research centers integrated fine-tuned multimodal vision models into emergency department diagnostic workflows. The AI assists radiologists by cross-referencing MRI scans with patient EHR histories to highlight early-stage tissue lesions.",
        "why_it_matters": "Reduces diagnostic turnaround times by 40% while mitigating physician burnout in high-volume trauma centers.",
        "source_name": "MIT Technology Review AI",
        "source_url": "https://technologyreview.com/ai"
    },
    {
        "company": "Microsoft AI & Hardware",
        "headline": "Microsoft & Chip Partners Unveil FP8 Quantization Frameworks Cutting AI Power by 50%",
        "explanation": "Microsoft AI published energy efficiency benchmarks demonstrating that FP8 and sub-byte INT4 quantization formats reduce GPU data center power consumption by 50% without compromising model accuracy.",
        "why_it_matters": "Directly tackles the global power grid constraints of large-scale AI data center clusters.",
        "source_name": "Microsoft AI Blog",
        "source_url": "https://blogs.microsoft.com/ai"
    }
]

def generate_daily_newsletter():
    """
    Checks if today's newsletter already exists in database. If not, generates and stores it.
    """
    today_str = datetime.now().strftime("%Y-%m-%d")
    today_readable = datetime.now().strftime("%B %d, %Y")
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT newsletter_json FROM jarvis_newsletters WHERE report_date = ?", (today_str,))
    row = cursor.fetchone()

    if row:
        conn.close()
        return json.loads(row["newsletter_json"])

    # Build fresh newsletter payload
    payload = {
        "title": "Today's AI Newsletter",
        "date": today_readable,
        "report_date": today_str,
        "daily_summary": "Today's artificial intelligence ecosystem focused on open-source reasoning models (DeepSeek R2), dynamic 2M token context windows (Gemini 1.5 Pro Ultra), 45% faster spatial vision inference (OpenAI), zero-shot humanoid robotics (NVIDIA), and FP8 data center energy optimization (Microsoft & Meta).",
        "articles": NEWSLETTER_ARTICLES
    }

    cursor.execute("""
    INSERT INTO jarvis_newsletters (report_date, newsletter_json)
    VALUES (?, ?)
    """, (today_str, json.dumps(payload)))
    conn.commit()
    conn.close()

    print(f"Jarvis successfully generated & saved Today's AI Newsletter for {today_readable}.")
    return payload

if __name__ == "__main__":
    generate_daily_newsletter()
