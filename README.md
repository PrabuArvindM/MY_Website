# 🚀 Prabu Arvind M - Portfolio & AI Agent (Google Cloud Run Ready)

A production-grade, containerized FastAPI web application featuring an integrated **Voice AI Agent ("Jarvis")**, **Today's AI Intelligence Hub**, **OCR/PEGASUS Learning Guides**, and a **Secure 6-Digit OTP Email Verification System**.

Designed for high performance, zero downtime, and low-cost scaling on **Google Cloud Run** (under 5,000 visitors/month run on the 100% Free Tier).

---

## 📁 Repository Structure

```text
MY_Website/
├── app/
│   ├── main.py                  # Production FastAPI application & middleware
│   ├── config.py                # Environment configuration settings
│   ├── database.py              # SQLite database initialization
│   ├── routers/                 # Modular API routers (contact, otp, blogs, projects, etc.)
│   ├── services/                # Business logic (email_service, otp_service)
│   └── schemas/                 # Pydantic validation models
├── static/                      # Production CSS, JS, Images, and PDF Resume
├── index.html                   # High-density Responsive Single Page UI
├── Dockerfile                   # Python 3.12 slim container image setup
├── .dockerignore                # Production image exclusions
├── .env.example                 # Environment variables template
├── deploy_cloudrun.sh           # Automated Cloud Run deployment script
├── requirements.txt             # Pinned production dependencies
└── README.md                    # Full documentation & deployment guide
```

---

## ⚙️ Environment Variables (`.env`)

Copy `.env.example` to `.env` or configure secrets directly in **Google Cloud Run Console / Secret Manager**:

```env
# OpenRouter AI API Credentials (Jarvis Assistant)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Email Dispatch Configuration (Gmail SMTP or Resend API)
EMAIL_USER=prabuarvind2005@gmail.com
EMAIL_PASSWORD=dadj usli dhpm jtrh
RESEND_API_KEY=your_resend_api_key_here

# Security & Server Settings
SECRET_KEY=antigravity_secure_secret_key_2026
PORT=8080
GOOGLE_CLOUD_PROJECT=your_gcp_project_id

# Rate Limiting Controls
ENABLE_RATE_LIMIT=true
RATE_LIMIT_PER_HOUR=5
```

---

## 💻 Local Development

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start local FastAPI dev server
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Access the app locally at: **`http://127.0.0.1:8000`**

---

## 🐳 Local Docker Build & Execution

```bash
# 1. Build Docker image
docker build -t portfolio-app .

# 2. Run Docker container locally
docker run -p 8080:8080 --env-file .env portfolio-app
```

Access the containerized app at: **`http://localhost:8080`**

---

## ☁️ Google Cloud Run Deployment (Step-by-Step)

### Step 1: Install Google Cloud SDK & Login
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Enable GCP Services
```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

### Step 3: Create Artifact Registry Repository
```bash
gcloud artifacts repositories create portfolio-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for Prabu Arvind M Portfolio"
```

### Step 4: Build & Push Image
```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/portfolio-repo/portfolio:latest .
```

### Step 5: Deploy to Cloud Run
```bash
gcloud run deploy portfolio-service \
    --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/portfolio-repo/portfolio:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --min-instances 0 \
    --max-instances 3 \
    --cpu 1 \
    --memory 512Mi \
    --set-env-vars "PORT=8080,EMAIL_USER=prabuarvind2005@gmail.com,EMAIL_PASSWORD=dadj usli dhpm jtrh,ENABLE_RATE_LIMIT=true"
```

### Or 1-Click Script Deployment:
```bash
./deploy_cloudrun.sh
```

---

## 🌐 Custom Domain Setup (`www.prabuarvind.tech`)

To map a custom domain (e.g., `www.prabuarvind.tech`):

1. Go to **Google Cloud Console** -> **Cloud Run** -> **Domain Mappings**.
2. Click **Add Mapping** -> Select service `portfolio-service`.
3. Enter custom domain `www.prabuarvind.tech`.
4. Copy the generated `CNAME` / `A` records and add them to your domain DNS provider (Namecheap, GoDaddy, Cloudflare).
5. Google Cloud automatically issues a **free managed SSL/TLS certificate** for your domain!
