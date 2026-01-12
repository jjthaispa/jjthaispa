#!/bin/bash

# JJ Thai Spa - Deployment Script
# Usage: ./deploy.sh [target]
# Targets: all (default), hosting, functions

set -e  # Exit on any error

PROJECT="jjthaispa-new"
TARGET=${1:-all}

echo "🚀 Starting deployment to project: $PROJECT"

# Build the frontend
echo "📦 Building frontend..."
npm run build

# Build the functions
echo "⚙️  Building functions..."
cd functions && npm run build && cd ..

# Deploy based on target
case $TARGET in
    hosting)
        echo "🌐 Deploying hosting only..."
        firebase deploy --only hosting --project $PROJECT
        ;;
    functions)
        echo "⚡ Deploying functions only..."
        firebase deploy --only functions --project $PROJECT
        ;;
    all)
        echo "🌐 Deploying hosting and functions..."
        firebase deploy --only hosting,functions --project $PROJECT
        ;;
    *)
        echo "❌ Unknown target: $TARGET"
        echo "Usage: ./deploy.sh [all|hosting|functions]"
        exit 1
        ;;
esac

echo "✅ Deployment complete!"
