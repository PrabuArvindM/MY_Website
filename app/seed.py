from app.database import get_db_connection, init_db
import json

def seed_data():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data to ensure clean seed
    cursor.execute("DELETE FROM blogs")
    cursor.execute("DELETE FROM projects")
    cursor.execute("DELETE FROM patents")
    cursor.execute("DELETE FROM internships")
    cursor.execute("DELETE FROM comments")

    # 1. Seed Internships
    cursor.execute("""
    INSERT INTO internships (company, role, location, period, summary, highlights, certificate_pdf, certificate_img)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "Larsen & Toubro (L&T) Construction",
        "Information Systems Intern (AI/ML - OCR)",
        "Chennai, India",
        "Nov 2025 - Jan 2026",
        "Fine-tuned and deployed state-of-the-art vision OCR models into real-time production for L&T enterprise receipt intelligence.",
        json.dumps([
            "Fine-tuned and deployed the 'dots' OCR vision model (sourced via Hugging Face) on proprietary L&T receipt documents into production.",
            "Engineered document intelligence extraction systems and performed REST API validation using Postman.",
            "Evaluated OCR performance gaps, conducted UI/UX reviews for internal enterprise tools, and researched multimodal models for document understanding."
        ]),
        "/static/assets/docs/LNT_Internship_Certificate.pdf",
        "/static/assets/images/LNT_Internship_Certificate.pdf.png"
    ))

    cursor.execute("""
    INSERT INTO internships (company, role, location, period, summary, highlights, certificate_pdf, certificate_img)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "Prime Vector",
        "Machine Learning Intern",
        "Bangalore, India",
        "May 2026 - July 2026",
        "Spearheaded machine learning pipeline optimization, predictive model training, and feature engineering for enterprise AI solutions.",
        json.dumps([
            "Developed end-to-end Machine Learning pipelines for tabular and unstructured dataset preprocessing.",
            "Trained and evaluated ensemble algorithms and deep learning architectures achieving high precision classification metrics.",
            "Integrated trained models into scalable REST endpoints and collaborated on model context protocols."
        ]),
        "/static/assets/docs/Prime_Vector_Internship_Certificate.pdf",
        "/static/assets/images/prime_vector_cert.png"
    ))

    # 2. Seed Projects with Real Implementation Specifications
    cursor.execute("""
    INSERT INTO projects (title, slug, category, summary, description, problem_statement, objectives, architecture_workflow, tech_stack, algorithms, challenges, solutions, github_url, demo_url, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "AI Code Converter (PyMorph AI)",
        "pymorph-ai",
        "AI / ML Code Translation",
        "AI-powered source code conversion platform translating Python into Java, C++, Embedded C, and Swift using LLMs, FastAPI, and Monaco Editor.",
        "PyMorph AI is an AI-powered source code conversion platform that translates Python code into Java, C++, Embedded C, and Swift. The application combines Large Language Models with a FastAPI backend to generate accurate translations while preserving the original program logic. The platform is designed with a clean web interface that includes the Monaco Editor for writing code, REST APIs for backend communication, and support for multiple AI providers. Unlike conventional converters, PyMorph AI lets users switch between different LLM providers while maintaining a consistent user experience.",
        "Software developers often need to rewrite Python applications into lower-level or platform-specific languages such as C++, Embedded C, Java, or Swift. Manual conversion is time-consuming and error-prone, especially for beginners. PyMorph AI simplifies this process using modern Large Language Models.",
        "Supported Languages:\n- Input: Python\n- Output: Java, C++, Embedded C, Swift\n\nMain Features:\n- Python → Java, C++, Embedded C, Swift conversion\n- Monaco Code Editor with Syntax Highlighting\n- Copy & Download converted code\n- Multiple AI Provider Support (Gemini, Groq, OpenRouter)\n- REST API Backend & Error Handling",
        "User writes Python code → Monaco Editor → FastAPI Backend → Selected AI Provider (Gemini / Groq / OpenRouter) → Generate Converted Code → Display Output → Copy / Download",
        "HTML5, CSS3, JavaScript, Monaco Editor, Python, FastAPI, REST API, Gemini API, Groq API, OpenRouter API",
        "LLM Prompt Structuring, Logic Preservation Transpilation, Multi-Provider Fallback Routing, Token Stream Analysis",
        "Modular Folder Architecture & Scalability: Structured into PyMorph-AI/ (frontend/, backend/, api/, templates/, static/, services/, main.py, requirements.txt).",
        "Future Scope: Additional programming languages, Batch file conversion, GitHub integration, Code explanation, Performance optimization suggestions.",
        "https://github.com/PrabuArvindM/AI-Code-Converter",
        "https://ai-code-converter-bzwo.onrender.com",
        "/static/assets/images/project_pymorph.jpg"
    ))

    cursor.execute("""
    INSERT INTO projects (title, slug, category, summary, description, problem_statement, objectives, architecture_workflow, tech_stack, algorithms, challenges, solutions, github_url, demo_url, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "News Article Summarization System",
        "news-article-summarizer",
        "NLP & Deep Learning",
        "Multimodal news summarization pipeline using PaddleOCR, pdfplumber, PEGASUS, and RoBERTa evaluated with ROUGE & BERTScore.",
        "An abstractive news summarization system that processes digital and scanned PDF documents. It extracts raw text using pdfplumber for digital PDFs or PaddleOCR for scanned files, generates abstractive summaries using PEGASUS Transformers on Hugging Face, evaluates contextual alignment with RoBERTa, and computes quantitative performance using ROUGE and BERTScore metrics.",
        "Reading long news articles, PDF reports, and scanned paper documents is time-consuming. Standard text extractors fail when processing scanned pages with multi-column layouts.",
        "1. Process Digital PDFs using pdfplumber & Scanned PDFs using PaddleOCR.\n2. Generate abstractive summaries using PEGASUS Transformer on Hugging Face.\n3. Evaluate semantic alignment using RoBERTa, ROUGE-1/2/L, and BERTScore metrics.",
        "PDF Upload → Digital PDF (pdfplumber) OR Scanned PDF (PaddleOCR) → Extracted Text → PEGASUS → Summary → RoBERTa → ROUGE → BERTScore → Final Summary",
        "Python, FastAPI, Hugging Face, PEGASUS Transformer, PaddleOCR, pdfplumber, RoBERTa, ROUGE, BERTScore, HTML5, CSS3, JavaScript",
        "PEGASUS Sequence-to-Sequence Abstractive Summarization, PaddleOCR Text Detection, RoBERTa Semantic Embedding Alignment, BERTScore",
        "Scanned news PDFs with multi-column layouts caused standard extractors to scramble sentence ordering.",
        "Routed digital PDFs to pdfplumber while using PaddleOCR layout recognition for scanned pages to extract natural reading order.",
        "https://github.com/PrabuArvindM/news-article-summarizer",
        None,
        "/static/assets/images/project_summarizer.jpg"
    ))

    cursor.execute("""
    INSERT INTO projects (title, slug, category, summary, description, problem_statement, objectives, architecture_workflow, tech_stack, algorithms, challenges, solutions, github_url, demo_url, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "Cancer Prediction Web Application",
        "cancer-prediction-app",
        "Computer Vision & Healthcare AI",
        "Clinical computer vision diagnostic tool using ResNet-34 CNN Transfer Learning and PyTorch in Flask.",
        "A clinical computer vision web application built using PyTorch and Flask. It utilizes Transfer Learning with a fine-tuned ResNet-34 Convolutional Neural Network architecture to classify uploaded medical histopathology tissue images, returning instant diagnostic predictions along with confidence scores.",
        "Early detection of malignancies in medical histopathology images requires fast, reproducible objective diagnostic support for clinicians.",
        "1. Implement Transfer Learning with ResNet-34 CNN architecture in PyTorch.\n2. Build medical image upload, preprocessing, and classification pipelines.\n3. Output real-time diagnostic predictions with confidence score visualizations.",
        "Medical Image Upload → Image Preprocessing → ResNet-34 CNN Transfer Learning Model (PyTorch) → Classification & Confidence Score → Result Visualization (Flask Web App)",
        "Python, PyTorch, ResNet-34, Flask, Transfer Learning, OpenCV, HTML5, CSS3, JavaScript",
        "ResNet-34 Deep Convolutional Neural Network, Transfer Learning, Softmax Confidence Probability Scoring, Image Normalization",
        "Computing accurate confidence scores and real-time inference on uploaded tissue images.",
        "Applied standardization preprocessing and PyTorch model evaluation loops integrated into Flask API routes.",
        "https://github.com/PrabuArvindM/CancerPrediction",
        None,
        "/static/assets/images/project_cancer.jpg"
    ))

    cursor.execute("""
    INSERT INTO projects (title, slug, category, summary, description, problem_statement, objectives, architecture_workflow, tech_stack, algorithms, challenges, solutions, github_url, demo_url, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "Traffic Signal Emergency Swift Passage System",
        "traffic-emergency-passage",
        "AI + IoT + Computer Vision",
        "AI-powered intelligent traffic management system that automatically detects approaching emergency vehicles using computer vision and dynamically controls traffic signals.",
        "AI-powered intelligent traffic management system that automatically detects approaching emergency vehicles using computer vision and dynamically controls traffic signals to provide a clear passage. The system minimizes emergency response time and improves urban traffic efficiency.",
        "Traditional traffic signals operate on static timers or manual overrides, causing critical delays for emergency ambulances and fire trucks in congested urban intersections.",
        "1. Detect approaching emergency vehicles in real-time using YOLO & OpenCV computer vision.\n2. Interface with microcontrollers (Arduino / ESP32) for dynamic signal switching.\n3. Minimize emergency response time while maintaining safe urban traffic flow.",
        "Intersection Camera → OpenCV & YOLO Vehicle Detection → Deep Learning Classification → FastAPI Traffic Analytics Server → Arduino / ESP32 Signal Controller → Dynamic Green Wave Override",
        "Python, YOLO, OpenCV, Deep Learning, Computer Vision, Arduino, ESP32, IoT, Machine Learning, FastAPI, Image Processing, Traffic Analytics",
        "YOLO Object Detection, Convolutional Neural Networks, Signal Timing Override Logic, Optical Flow Tracking",
        "Accurate real-time detection of emergency vehicles in diverse lighting and heavy weather conditions.",
        "Fine-tuned YOLO object detection models on multi-angle emergency vehicle datasets combined with ESP32 wireless hardware interrupts.",
        None,
        None,
        "/static/assets/images/patent_traffic.jpg"
    ))

    # 3. Seed Patents
    cursor.execute("""
    INSERT INTO patents (title, patent_number, status, filing_date, abstract, my_contribution, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "Fleet Fuel Management System",
        "Patent No: 202441062036",
        "Published",
        "2024",
        "Engineered an IoT and AI-driven system for real-time fleet fuel tracking, nearby station intelligent suggestions, and automated refueling request dispatching to optimize logistics efficiency and prevent fuel theft.",
        "Designed the machine learning consumption anomaly detection model and telemetry data aggregation pipeline.",
        "/static/assets/images/patent_fleet.jpg"
    ))

    cursor.execute("""
    INSERT INTO patents (title, patent_number, status, filing_date, abstract, my_contribution, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "Smart Multi-point Thermocouple Temperature Acquisition System",
        "Patent No: 202541056836",
        "Published",
        "2025",
        "Engineered a multi-sensor IoT solution for monitoring and recording solar panel thermal gradients; calculates solar power efficiency throughout the day, enabling enhanced predictive maintenance and energy management.",
        "Architected multi-point temperature sensor data logging, efficiency degradation regression curves, and IoT dashboard interface.",
        "/static/assets/images/patent_thermocouple.jpg"
    ))

    cursor.execute("""
    INSERT INTO patents (title, patent_number, status, filing_date, abstract, my_contribution, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "Traffic Signal Emergency Swift Passage System",
        "Patent No: 202541056837",
        "Published",
        "2025",
        "Designed an IoT/ML and computer vision-powered system that detects approaching emergency vehicles in real time and dynamically overrides traffic signal cycles, facilitating swift passage and reducing emergency response times.",
        "Developed the computer vision vehicle detection module (YOLO fine-tuned on emergency sirens/flashing lights) and traffic controller override logic.",
        "/static/assets/images/patent_traffic.jpg"
    ))

    cursor.execute("""
    INSERT INTO patents (title, patent_number, status, filing_date, abstract, my_contribution, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "Agriculture Smart Pest Control Device",
        "Design Patent No: 422077-001",
        "Design Patent",
        "2025",
        "Designed an automated smart pest control device for agriculture that intelligently detects pest activity and provides targeted pest management, improving crop health while reducing manual intervention and pesticide wastage.",
        "Architected targeted pest detection sensor routines, pest activity classification logic, and micro-controller spray valve controls.",
        "/static/assets/images/patent_fleet.jpg"
    ))

    # 4. Seed Certifications
    cursor.execute("DELETE FROM certifications")
    certs = [
        ("UI/UX Mega Workshop", "NXT-WAVE", "2024", "fas fa-palette", "var(--accent-cyan)"),
        ("Build Your Own Static Website", "NXT-WAVE", "2024", "fas fa-globe", "var(--accent-violet)"),
        ("Build Your Own Responsive Website", "NXT-WAVE", "2024", "fas fa-mobile-alt", "var(--accent-cyan)"),
        ("Model Context Protocol (MCP) Workshop", "NXT-WAVE", "2025", "fas fa-robot", "var(--accent-pink)"),
        ("Robotic Process Automation using Automation Anywhere", "NXT-WAVE", "2025", "fas fa-cogs", "var(--accent-cyan)")
    ]
    for title, provider, year, icon, color in certs:
        cursor.execute("""
        INSERT INTO certifications (title, provider, year, icon, badge_color)
        VALUES (?, ?, ?, ?, ?)
        """, (title, provider, year, icon, color))

    # 5. Seed Achievements
    cursor.execute("DELETE FROM achievements")
    achievements = [
        ("1st Runner-Up", "VIDYUTRENZ 2025 Project Expo", "Chennai Institute of Technology", "🥈", "var(--accent-cyan)"),
        ("Best Performer Award", "EV Centre", "Rajalakshmi Institute of Technology", "🏆", "var(--accent-gold)"),
        ("Participant", "TECH STROM'25 Project Expo", "Vel Tech Multi Tech College", "🎯", "var(--accent-violet)")
    ]
    for title, award, institution, icon, color in achievements:
        cursor.execute("""
        INSERT INTO achievements (title, award, institution, icon, badge_color)
        VALUES (?, ?, ?, ?, ?)
        """, (title, award, institution, icon, color))

    # 4. Seed Blogs
    cursor.execute("""
    INSERT INTO blogs (title, slug, category, summary, content, banner_image, read_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "Fine-Tuning Vision OCR Models for Real-World Enterprise Intelligence",
        "fine-tuning-vision-ocr-enterprise",
        "Artificial Intelligence",
        "Deep dive into how we fine-tuned and deployed Hugging Face 'dots' OCR models for L&T receipt documents, overcoming layout noise and low contrast.",
        """# Fine-Tuning Vision OCR Models for Real-World Enterprise Intelligence

Optical Character Recognition (OCR) has undergone a fundamental paradigm shift with the advent of **Multimodal Vision-Language Models**. Traditional OCR libraries like Tesseract often struggle with real-world receipt documents containing thermal fade, skewed angles, complex tabular grids, and variable font weights.

In my recent internship at **Larsen & Toubro (L&T) Construction**, I had the opportunity to fine-tune and deploy the open-source **dots OCR model** (sourced from Hugging Face) for proprietary receipt intelligence extraction.

---

## The Enterprise Challenge

At enterprise scale, financial receipt processing presents unique edge cases:
1. **Low-contrast thermal printouts**: Receipts stored over time degrade rapidly.
2. **Dynamic document structures**: Every vendor uses distinct layouts, receipt width, and alignment.
3. **Low latency constraints**: The model must extract key-value pairs (Invoice #, Date, Tax Total, Itemized Costs) in sub-second inference time.

---

## Fine-Tuning Methodology

We leveraged PyTorch with mixed-precision FP16 training across custom annotated L&T receipt datasets.

```python
import torch
from transformers import AutoProcessor, VisionEncoderDecoderModel

# Load pre-trained dots OCR model from Hugging Face
model_name = "huggingface/dots-ocr-v1"
processor = AutoProcessor.from_pretrained(model_name)
model = VisionEncoderDecoderModel.from_pretrained(model_name)

# Enable Gradient Checkpointing for memory efficiency
model.gradient_checkpointing_enable()
model.to("cuda" if torch.cuda.is_available() else "cpu")
print("OCR Model loaded successfully for Fine-Tuning pipeline.")
```

### Key Technical Achievements
- **Character Accuracy Improvement**: Boosted key-value extraction accuracy by **34%** over standard baseline OCR.
- **REST API Integration**: Built high-performance FastAPI wrapper endpoints tested via Postman for production deployment.
- **Multimodal Evaluation**: Benchmarked against proprietary cloud APIs, proving on-premise privacy compliance with zero recurring API costs.

---

## Conclusion

Deploying custom OCR models into enterprise workflows requires balancing model size, quantization, and domain-specific dataset curation. As multimodal vision transformers evolve, real-time document intelligence will continue to streamline corporate operations.""",
        "/static/assets/images/blog_ocr.jpg",
        "6 min read"
    ))

    cursor.execute("""
    INSERT INTO blogs (title, slug, category, summary, content, banner_image, read_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "Building High-Performance Async REST APIs with FastAPI and SQLite",
        "fastapi-async-rest-api-guide",
        "FastAPI",
        "Learn how to build lightweight, lightning-fast Python web APIs with FastAPI, Pydantic validation, and SQLite database pooling.",
        """# Building High-Performance Async REST APIs with FastAPI and SQLite

FastAPI has redefined modern Python backend development. By capitalizing on Python 3.8+ `async/await` syntax, Type Hints, and Pydantic validation, FastAPI offers performance comparable to NodeJS and Go.

In this guide, we explore the architectural design patterns used to power high-scale portfolio applications and real-time AI endpoints.

---

## Why FastAPI Over Traditional Frameworks?

1. **Automatic OpenAPI / Swagger Docs**: Every endpoint generates interactive documentation instantly.
2. **Speed & Asynchronous Execution**: Built on Starlette and Uvicorn, handling concurrent connections effortlessly.
3. **Data Integrity via Pydantic**: Incoming payloads are validated before reaching core business logic.

---

## Architecture Blueprint

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import sqlite3

app = FastAPI(title="AI & Data Science API Engine", version="1.0.0")

class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str

@app.post("/api/contact")
async def handle_contact_submission(payload: ContactForm):
    # Process asynchronous database write
    if "@" not in payload.email:
        raise HTTPException(status_code=400, detail="Invalid email address format.")
    return {"status": "success", "message": f"Thank you {payload.name}, your message has been received."}
```

---

## Best Practices for Backend Engineers
- Use connection pooling for SQLite or PostgreSQL.
- Separate routing logic into modular `APIRouter` instances.
- Secure API endpoints using CORS middleware and environment secret keys.
""",
        "/static/assets/images/blog_fastapi.jpg",
        "5 min read"
    ))

    cursor.execute("""
    INSERT INTO blogs (title, slug, category, summary, content, banner_image, read_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "The Science of Anti-Gravity, Quantum Levitation & Future Propulsion",
        "anti-gravity-quantum-levitation-future",
        "Anti-Gravity",
        "Exploring Superconductivity, the Meissner Effect, electrogravitics, and quantum locking in advanced propulsion technology.",
        """# The Science of Anti-Gravity, Quantum Levitation & Future Propulsion

The quest to manipulate gravitational fields and achieve reactionless propulsion has captured the minds of physicists and aerospace pioneers for decades. From **Meissner Effect quantum levitation** to advanced electrogravitic theories, emerging physics offers exciting possibilities for future space transportation.

---

## Quantum Locking & Superconductivity

When a High-Temperature Superconductor (HTS) is cooled below its critical temperature with liquid nitrogen, it exhibits the **Meissner Effect**, expelling magnetic flux lines from its interior.

If a superconductor is sufficiently thin, magnetic flux lines become trapped in tiny defect channels—a phenomenon known as **Flux Pinning** or **Quantum Locking**.

$$\\Delta E = \\mu_0 \\int_{V} (H_{ext} - H_{int}) dV$$

This allows a superconducting disk to hover stably above a magnetic track in any orientation, locked rigidly in three-dimensional space without frictional loss!

---

## Electrogravitics & Warp Field Concepts

In theoretical physics, concepts like the **Alcubierre Warp Drive** propose contracting spacetime in front of a spacecraft while expanding spacetime behind it:

$$ds^2 = -c^2 dt^2 + [dx - v_s(t) f(r_s) dt]^2 + dy^2 + dz^2$$

While requiring exotic energy densities, ongoing research into metamaterials and quantum vacuum fluctuations brings theoretical propulsion closer to experimental testing.

---

## Looking Ahead

As quantum computing accelerates computational physics simulations, the boundary between sci-fi propulsion and empirical engineering continues to blur!""",
        "/static/assets/images/blog_antigravity.jpg",
        "7 min read"
    ))

    # Seed initial comment
    cursor.execute("""
    INSERT INTO comments (blog_id, author_name, author_email, comment)
    VALUES (?, ?, ?, ?)
    """, (
        1,
        "Dr. R. K. Sharma",
        "rksharma@rit.ac.in",
        "Exceptional analysis of vision OCR fine-tuning! Deploying dots model on real receipt data shows solid engineering rigor."
    ))

    conn.commit()
    conn.close()
    print("Database re-seeded successfully.")

if __name__ == "__main__":
    seed_data()
