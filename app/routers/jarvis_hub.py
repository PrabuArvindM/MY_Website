from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from app.database import get_db_connection
from app.jarvis_openrouter import generate_daily_newsletter

router = APIRouter(prefix="/api/jarvis-hub", tags=["JARVIS AI Knowledge Hub"])

@router.get("/newsletter")
def get_daily_newsletter():
    return generate_daily_newsletter()

@router.get("/ocr-roadmap")
def get_ocr_roadmap():
    return {
        "title": "OCR Learning Hub",
        "subtitle": "Complete OCR Learning Roadmap — From Image Preprocessing to Multimodal Document AI",
        "read_time": "18 min read",
        "difficulty": "Beginner to Advanced",
        "overview": "Optical Character Recognition (OCR) is the foundational technology that enables machines to extract, decode, and digitize visual text from static images, scanned documents, handwritten notes, and camera scenes into actionable structured data.",
        "pipeline_diagram": """Raw Image / Document 
    │
    ▼
Image Preprocessing (Grayscale, Gaussian Blur, Otsu Binarization, Deskewing, Contrast Adjust)
    │
    ▼
Text Detection (DBNet / CRAFT / Bounding Box Localization)
    │
    ▼
Text Recognition (CRNN / TrOCR / Vision Transformer Attention)
    │
    ▼
Post-Processing (Language Model Lexicon Matching, Regex Rules, Pydantic Schema Parsing)
    │
    ▼
Structured Data (JSON / Searchable PDF / Database Record)""",
        "history_and_evolution": [
            "1. 1910s - Optophone: Early light-sensitive acoustic devices translating printed characters into tones for the blind.",
            "2. 1970s - Ray Kurzweil OCR: Introduction of omni-font OCR engines capable of reading standard printed books.",
            "3. 2000s - Rule-Based & ML OCR (Tesseract v3): Feature extraction using HOG/SVM combined with strict lexicon dictionaries.",
            "4. 2016s - Deep Learning OCR (PaddleOCR, EasyOCR): Convolutional Neural Networks paired with BiLSTM sequence models and Connectionist Temporal Classification (CTC) loss.",
            "5. 2024s - Multimodal Vision Transformers & Document AI (TrOCR, Donut, Nougat, LayoutLM, Gemini Document AI): End-to-end vision-language encoders parsing layout structure, key-value tables, and cursive handwriting without intermediate CTC loss."
        ],
        "domain_types": [
            {"domain": "Document OCR", "description": "Parsing multi-page PDF contracts, reports, and books."},
            {"domain": "Invoice & Receipt OCR", "description": "Key-value pair extraction for vendor names, tax amounts, line items, and total prices."},
            {"domain": "Passport & ID Card OCR", "description": "Machine Readable Zone (MRZ) verification and identity card text decoding."},
            {"domain": "Medical OCR", "description": "Deciphering doctor prescriptions, clinical lab results, and patient EHR records."},
            {"domain": "Handwritten OCR (ICR)", "description": "Intelligent Character Recognition for cursive and unconstrained human handwriting."},
            {"domain": "Scene Text OCR", "description": "Detecting text on outdoor street signs, billboards, and vehicle license plates."},
            {"domain": "Math & Table OCR", "description": "Extracting complex LaTeX mathematical formulas and nested spreadsheet tables (Nougat/Donut)."}
        ],
        "comparison_table": [
            {"engine": "PaddleOCR", "paradigm": "DBNet + PP-LCNet + CRNN", "speed": "Ultra Fast (~15ms)", "accuracy": "98.5%", "best_for": "Production REST APIs & Multi-lingual Documents"},
            {"engine": "TrOCR", "paradigm": "Vision Transformer (ViT) + RoBERTa", "speed": "Moderate (~120ms)", "accuracy": "99.2%", "best_for": "Handwritten & Historical Document Intelligence"},
            {"engine": "EasyOCR", "paradigm": "CRAFT + ResNet + LSTM + CTC", "speed": "Fast (~45ms)", "accuracy": "96.5%", "best_for": "Python Rapid Prototyping & PyTorch Pipelines"},
            {"engine": "Tesseract 5", "paradigm": "LSTM Neural Net + Legacy Rule Engine", "speed": "Fast (~30ms)", "accuracy": "95.0%", "best_for": "C++ Embedded & Desktop CLI Utilities"},
            {"engine": "Google Vision OCR", "paradigm": "Cloud Vision Deep Neural Net", "speed": "Cloud API (~200ms)", "accuracy": "99.4%", "best_for": "Enterprise Cloud Document Automation"},
            {"engine": "Azure OCR", "paradigm": "Azure Form Recognizer Models", "speed": "Cloud API (~220ms)", "accuracy": "99.1%", "best_for": "Enterprise Form & PDF Layout Extraction"},
            {"engine": "Gemini OCR", "paradigm": "Multimodal Vision Large Language Model", "speed": "Cloud API (~300ms)", "accuracy": "99.6%", "best_for": "Zero-Shot Key-Value Pair & Form Extraction"},
            {"engine": "DocTR", "paradigm": "Mindee ViT / ResNet + Transformer", "speed": "Fast (~35ms)", "accuracy": "97.8%", "best_for": "PyTorch/TensorFlow Document Layout Analysis"},
            {"engine": "Donut & Nougat", "paradigm": "OCR-free Transformer (Swin / ViT)", "speed": "Moderate (~150ms)", "accuracy": "98.7%", "best_for": "Math Formulas, Academic Papers & Tables"},
            {"engine": "LayoutLM v3", "paradigm": "Multimodal 2D Text-Layout Transformer", "speed": "Fast (~60ms)", "accuracy": "98.9%", "best_for": "Complex Invoice & Receipt Structured Parsing"}
        ],
        "code_example": """# Python PaddleOCR Production Example
from paddleocr import PaddleOCR

# Initialize PaddleOCR engine with English & Direction Classifier
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Perform OCR on input document image
image_path = 'sample_invoice.jpg'
result = ocr.ocr(image_path, cls=True)

# Parse detected bounding boxes & confidence scores
for line in result[0]:
    bbox, (text, confidence) = line
    print(f"Detected Text: '{text}' (Confidence: {confidence:.2f})")
""",
        "advantages": "1. Automates manual data entry with 99%+ accuracy.\n2. Converts static paper archives into searchable digital databases.\n3. Enables real-time document search and accessibility screen readers.",
        "limitations": "1. Extreme motion blur, low lighting, or poor resolution impairs recognition.\n2. Highly unconstrained cursive handwriting still requires domain-specific fine-tuning."
    }

@router.get("/pegasus-roadmap")
def get_pegasus_roadmap():
    return {
        "title": "PEGASUS AI Guide",
        "subtitle": "Transformer Based Abstractive Text Summarization & Practical Implementation",
        "read_time": "20 min read",
        "difficulty": "Advanced NLP",
        "overview": "PEGASUS (Pre-training with Extracted Gap-sentences for Abstractive Summarizing) is a Google Transformer model designed explicitly for abstractive text summarization. Unlike standard language models, PEGASUS uses Gap Sentence Generation (GSG) to train Transformer encoder-decoders specifically for document compression.",
        "architecture_diagram": """Input Document Text 
    │
    ▼
Transformer Encoder (Self-Attention Layer Stack)
    │
    ▼
Gap Sentence Generation (GSG) Masking Objective
    │  (Top ROUGE principal sentences extracted & masked)
    ▼
Transformer Decoder (Cross-Attention Stack)
    │
    ▼
Abstractive Summary Output (Newly Formulated Fluent Sentences)""",
        "extractive_vs_abstractive": [
            {"type": "Extractive Summarization", "mechanism": "Selects and copies verbatim key sentences directly from the source text (e.g. TextRank, LexRank).", "pros": "Fast, mathematically safe from hallucination.", "cons": "Rigid, verbose, produces disconnected sentences."},
            {"type": "Abstractive Summarization", "mechanism": "Synthesizes concepts and generates brand new paraphrased sentences using PEGASUS / GPT-4o.", "pros": "Fluent, concise, human-like summaries.", "cons": "Requires strict decoding parameter tuning to prevent hallucinations."}
        ],
        "evaluation_metrics": [
            {"metric": "ROUGE-1 / ROUGE-2 / ROUGE-L", "description": "Measures n-gram overlap between generated summary and reference ground-truth summaries."},
            {"metric": "BERTScore", "description": "Computes semantic vector embedding similarity using pre-trained BERT contextual representations."},
            {"metric": "BLEU Score", "description": "Evaluates precision of n-gram token matches, traditionally used in translation and summarization."}
        ],
        "model_comparison": [
            {"model": "PEGASUS", "architecture": "Encoder-Decoder", "objective": "Gap Sentence Generation (GSG)", "rouge_score": "47.2 (SOTA)", "best_for": "Domain Abstractive Summarization"},
            {"model": "BART", "architecture": "Encoder-Decoder", "objective": "Text Infilling & Sentence Shuffling", "rouge_score": "45.1", "best_for": "General Seq2Seq Paraphrasing"},
            {"model": "T5", "architecture": "Encoder-Decoder", "objective": "Span Corruption (Text-to-Text)", "rouge_score": "43.5", "best_for": "Multi-task NLP Benchmarks"},
            {"model": "BERT", "architecture": "Encoder-Only", "objective": "Masked Language Model (MLM)", "rouge_score": "N/A (Extractive)", "best_for": "Classification & NER"},
            {"model": "GPT-4o", "architecture": "Decoder-Only", "objective": "Causal Autoregressive Next-Token", "rouge_score": "High (Zero-shot)", "best_for": "Conversational Q&A"}
        ],
        "my_project_implementation": {
            "title": "Prabu Arvind M's Real-World PEGASUS Project Implementation",
            "subtitle": "News Article Summarization System using PEGASUS, PaddleOCR & RoBERTa",
            "tech_stack": "Python, PEGASUS Transformer, PaddleOCR, pdfplumber, RoBERTa, BERTScore, ROUGE, PyTorch, HuggingFace, FastAPI",
            "document_flow_diagram": """Scanned PDF / News Document 
    │
    ▼
pdfplumber / PaddleOCR Layout Extraction
    │
    ▼
Text Preprocessing & Sentence Tokenization
    │
    ▼
Fine-Tuned PEGASUS Model (google/pegasus-xsum)
    │
    ▼
Abstractive Summary Generation (Beam Search = 4)
    │
    ▼
Evaluation Pipeline (ROUGE-1, ROUGE-2, BERTScore Validation)
    │
    ▼
FastAPI REST Endpoint Response""",
            "code_snippet": """# Prabu's PyTorch PEGASUS Summarization Code
import torch
from transformers import PegasusForConditionalGeneration, PegasusTokenizer

device = "cuda" if torch.cuda.is_available() else "cpu"
model_name = "google/pegasus-xsum"

tokenizer = PegasusTokenizer.from_pretrained(model_name)
model = PegasusForConditionalGeneration.from_pretrained(model_name).to(device)

def summarize_text(input_text: str) -> str:
    tokens = tokenizer(input_text, truncation=True, padding="longest", max_length=512, return_tensors="pt").to(device)
    summary_ids = model.generate(**tokens, num_beams=4, max_length=128, early_stopping=True)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)
""",
            "deployment_architecture": "Containerized with Docker, deployed on cloud PaaS with FastAPI asynchronous streaming endpoints."
        }
    }
