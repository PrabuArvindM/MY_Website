#!/usr/bin/env bash
# ==============================================================================
# PRABU ARVIND M PORTFOLIO - AWS APP RUNNER DEPLOYMENT SCRIPT
# ==============================================================================

set -e

export PATH=/opt/homebrew/bin:"$PATH"

# Configuration
REGION="us-east-1"
REPO_NAME="prabu-portfolio"
SERVICE_NAME="portfolio-service"

echo "======================================================================"
echo "🚀 STARTING AWS APP RUNNER DEPLOYMENT"
echo "======================================================================"

# 1. Check AWS CLI installation & login status
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI is not installed."
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || true)

if [ -z "$ACCOUNT_ID" ]; then
    echo "📌 AWS CLI authentication required."
    echo "👉 Please run: aws configure"
    exit 1
fi

echo "📌 Active AWS Account ID: $ACCOUNT_ID"

# 2. Create ECR Repository
echo "📦 Ensuring ECR repository exists..."
aws ecr create-repository --repository-name "$REPO_NAME" --region "$REGION" || true

ECR_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME"

# 3. Docker Login to AWS ECR
echo "🔐 Logging into AWS ECR..."
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

# 4. Build & Push Docker Image
echo "🔨 Building Docker image..."
docker build -t "$REPO_NAME" .

echo "🏷️ Tagging image..."
docker tag "$REPO_NAME:latest" "$ECR_URI:latest"

echo "🚀 Pushing image to AWS ECR..."
docker push "$ECR_URI:latest"

echo "======================================================================"
echo "🎉 CONTAINER IMAGE PUSHED TO AWS ECR SUCCESSFUL!"
echo "👉 ECR Image URI: $ECR_URI:latest"
echo "👉 Create App Runner service in AWS Console: https://console.aws.amazon.com/apprunner/"
echo "======================================================================"
