#!/bin/bash

# KHUSHBOO.E.IRAM - GitHub Push Script
# Run this script in Replit Shell

echo "🚀 Starting GitHub push process..."

# Remove git lock if exists
rm -f .git/index.lock

# Add your GitHub repository
git remote remove origin 2>/dev/null
git remote add origin https://github.com/kametiapps-droid/khushboo.e.iram.git

# Stage all files
echo "📦 Adding files..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "Initial commit: KHUSHBOO.E.IRAM Luxury Perfume E-Commerce Platform" || echo "Already committed"

# Set branch name
git branch -M main

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main --force

echo "✅ Done! Check your repository at:"
echo "https://github.com/kametiapps-droid/khushboo.e.iram"
