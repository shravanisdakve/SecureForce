#!/usr/bin/env bash
set -e

PROJECT_ID="${1:-$GOOGLE_CLOUD_PROJECT}"
REGION="asia-south1"
SERVICE="secureforce"
IMAGE="gcr.io/${PROJECT_ID}/secureforce"

if [ -z "$PROJECT_ID" ]; then
  echo "Usage: ./deploy.sh <google-cloud-project-id>"
  echo "  (or set GOOGLE_CLOUD_PROJECT env var)"
  exit 1
fi

echo "1/4 Building client..."
(cd client && npm run build)

echo "2/4 Building container image..."
gcloud builds submit --tag "${IMAGE}" --project "${PROJECT_ID}"

echo "3/4 Deploying to Cloud Run..."
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --project "${PROJECT_ID}" \
  --set-env-vars "MONGODB_URI=${MONGODB_URI}" \
  --memory 512Mi \
  --min-instances 0

echo "4/4 Done! Your site is live."
