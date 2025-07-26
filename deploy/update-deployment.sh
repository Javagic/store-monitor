#!/bin/bash

# 🔄 Quick Update Script for Erix Clean Hub
# Run this on your DigitalOcean droplet to get the latest code

echo "🔄 Updating Erix Clean Hub to latest version..."
echo "=============================================="

# Navigate to the app directory
cd /var/www/store-monitor

# Stop the current application
echo "⏹️  Stopping current application..."
pm2 stop store-monitor 2>/dev/null || true

# Handle local changes that might conflict
echo "🔧 Handling local changes..."
git add .
git stash push -m "Auto-stash before deployment $(date)"

# Pull latest code from GitHub
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install any new dependencies
echo "📦 Installing dependencies..."
npm install

# Start the application
echo "🚀 Starting updated application..."
pm2 start ecosystem.config.js

# Show status
echo "📊 Application status:"
pm2 status

echo ""
echo "✅ Update Complete!"
echo "==================="
echo "🌐 Your Erix Clean Hub is now updated!"
echo ""
echo "🔗 Available at:"
echo "   • Welcome Hub: http://209.38.105.200:3000/"
echo "   • Cleaning Service: http://209.38.105.200:3000/cleaning"
echo "   • Modern Services: http://209.38.105.200:3000/services"
echo "   • Schedule Manager: http://209.38.105.200:3000/schedule"
echo "   • AI Generator: http://209.38.105.200:3000/ai-generator"
echo "   • Dashboard: http://209.38.105.200:3000/dashboard"
echo ""
echo "📋 To check logs: pm2 logs store-monitor"
