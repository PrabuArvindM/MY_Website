#!/usr/bin/env bash
# ==============================================================================
# PRABU ARVIND M PORTFOLIO - GOOGLE CLOUD RUN DEPLOYMENT SCRIPT
# ==============================================================================

set -e

# Load .env file if available
if [ -f .env ]; then
    export $(grep -v '^#' .env | grep -v 'GOOGLE_CLOUD_PROJECT' | xargs) || true
fi

PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"oceanic-antler-423909-n8"}
REGION="us-central1"
SERVICE_NAME="portfolio-service"
REPO_NAME="portfolio-repo"
IMAGE_TAG="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/portfolio:latest"

echo "======================================================================"
echo "🚀 STARTING GOOGLE CLOUD RUN DEPLOYMENT: $SERVICE_NAME"
echo "======================================================================"

# Ensure gcloud CLI is in PATH (Homebrew support)
export PATH=/opt/homebrew/share/google-cloud-sdk/bin:"$PATH"

# 1. Check gcloud CLI installation
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: Google Cloud SDK (gcloud CLI) is not installed."
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# 2. Set Active GCP Project
echo "📌 Setting active project: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

# 3. Enable Required Google Cloud APIs
echo "⚡ Enabling Cloud Run, Artifact Registry & Cloud Build APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

# 4. Create Artifact Registry Repository (if not existing)
echo "📦 Ensuring Artifact Registry repository exists..."
gcloud artifacts repositories create "$REPO_NAME" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Docker repository for Prabu Arvind M Portfolio" || true

# 5. Build and Push Container Image using Cloud Build
echo "🔨 Building container image and pushing to Artifact Registry..."
gcloud builds submit --tag "$IMAGE_TAG" .

# 6. Deploy to Google Cloud Run
echo "🚀 Deploying service to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image "$IMAGE_TAG" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --min-instances 0 \
    --max-instances 3 \
    --cpu 1 \
    --memory 512Mi \
    --set-env-vars "PORT=8080,ENABLE_RATE_LIMIT=true,RATE_LIMIT_PER_HOUR=5"

# 7. Retrieve Service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)')

echo "======================================================================"
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "👉 Portfolio Live URL: $SERVICE_URL"
echo "👉 Health Endpoint:   $SERVICE_URL/health"
echo "======================================================================"
