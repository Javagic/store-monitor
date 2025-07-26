#!/bin/bash

# 🚨 Emergency Fix for Git Merge Conflict
# Run this on your DigitalOcean droplet to resolve the current issue

echo "🚨 Fixing Git merge conflict..."
echo "=============================="

# Navigate to the app directory
cd /var/www/store-monitor

# Check current status
echo "📋 Current Git status:"
git status

# Stash any local changes
echo "💾 Stashing local changes..."
git add .
git stash push -m "Emergency stash - package-lock.json conflict $(date)"

# Now pull the latest code
echo "📥 Pulling latest code..."
git pull origin main

# Check if we have the welcome.html file
if [ -f "public/welcome.html" ]; then
    echo "✅ Welcome page found!"
else
    echo "❌ Welcome page missing, something went wrong"
fi

# Restart the application
echo "🔄 Restarting application..."
pm2 stop store-monitor 2>/dev/null || true
pm2 start ecosystem.config.js

# Show status
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ Emergency Fix Complete!"
echo "========================="
echo ""
echo "🌐 Test your site now:"
echo "   http://209.38.105.200:3000/"
echo ""
echo "If you see the welcome page, everything is working!"
echo "If you still see the old API response, try:"
echo "   pm2 restart store-monitor"
echo ""
echo "📋 To check logs: pm2 logs store-monitor"
