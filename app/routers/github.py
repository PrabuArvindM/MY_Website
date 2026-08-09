from fastapi import APIRouter

router = APIRouter(prefix="/api/github", tags=["GitHub"])

@router.get("")
def get_github_repos():
    # Return ONLY real curated GitHub repositories for Prabu Arvind M
    return [
        {
            "name": "AI Code Converter (PyMorph AI)",
            "description": "Multi-provider AI Python code converter with AST fallback transpiler, Monaco Editor, and FastAPI backend.",
            "language": "Python",
            "stars": 18,
            "forks": 5,
            "url": "https://github.com/PrabuArvindM/AI-Code-Converter",
            "topics": ["fastapi", "gemini-api", "monaco-editor", "ast-transpiler", "code-conversion"],
            "updated_at": "2026-07-28"
        },
        {
            "name": "News Article Summarization System",
            "description": "Abstractive summarization pipeline combining PaddleOCR, PEGASUS Transformer, and RoBERTa contextual evaluation.",
            "language": "Python",
            "stars": 14,
            "forks": 3,
            "url": "https://github.com/PrabuArvindM/news-article-summarizer",
            "topics": ["nlp", "pegasus-transformer", "paddleocr", "roberta", "bertscore"],
            "updated_at": "2026-07-15"
        },
        {
            "name": "Cancer Prediction Web Application",
            "description": "Clinical diagnostic web application utilizing ResNet-34 CNN trained on 2.7 lakh tissue samples.",
            "language": "Python",
            "stars": 22,
            "forks": 7,
            "url": "https://github.com/PrabuArvindM/CancerPrediction",
            "topics": ["computer-vision", "resnet34", "pytorch", "flask-api", "clinical-ai"],
            "updated_at": "2026-06-30"
        }
    ]
