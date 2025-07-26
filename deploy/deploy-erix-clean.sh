#!/bin/bash

# 🚀 Erix Clean Hub - Quick Deployment Script
# Run this on your DigitalOcean droplet

echo "🚀 Deploying Erix Clean Hub..."
echo "=================================="

# Navigate to app directory
cd /var/www/store-monitor || exit 1

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create logs directory if it doesn't exist
mkdir -p logs

# Create assets directory for AI images
mkdir -p public/assets/generated

# Stop existing PM2 process
echo "🛑 Stopping existing application..."
pm2 stop store-monitor 2>/dev/null || true
pm2 delete store-monitor 2>/dev/null || true

# Start the application
echo "🚀 Starting Erix Clean Hub..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Show status
pm2 status

echo ""
echo "✅ Deployment Complete!"
echo "=================================="
echo "🌐 Your Erix Clean Hub is now live!"
echo ""
echo "📋 Available Pages:"
echo "   • Welcome Hub: http://209.38.105.200/"
echo "   • Cleaning Service: http://209.38.105.200/cleaning"
echo "   • Modern Services: http://209.38.105.200/services"
echo "   • Schedule Manager: http://209.38.105.200/schedule"
echo "   • AI Generator: http://209.38.105.200/ai-generator"
echo "   • Store Monitor: http://209.38.105.200/dashboard"
echo ""
echo "🔧 Management Commands:"
echo "   • View logs: pm2 logs store-monitor"
echo "   • Restart: pm2 restart store-monitor"
echo "   • Stop: pm2 stop store-monitor"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Set up your .env file with OpenAI API key"
echo "   2. Configure your domain name (optional)"
echo "   3. Set up SSL certificate (optional)"
echo ""
