#!/bin/bash

# 🔧 Quick Fix for Erix Clean Hub External Access
# Run this on your DigitalOcean droplet

echo "🔧 Fixing Erix Clean Hub external access..."
echo "========================================="

# Step 1: Open firewall for port 3000
echo "1. Opening firewall for port 3000..."
sudo ufw allow 3000
sudo ufw status

echo ""
echo "2. Stopping current server..."
pm2 stop store-monitor 2>/dev/null || true
pm2 delete store-monitor 2>/dev/null || true

echo ""
echo "3. Pulling latest code with fix..."
cd /var/www/store-monitor
git pull origin main

echo ""
echo "4. Installing/updating dependencies..."
npm install

echo ""
echo "5. Starting server with external binding..."
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "6. Checking if server is accessible..."
sleep 3
echo "Testing local connection..."
curl -s -I http://localhost:3000 | head -n 1

echo ""
echo "7. Server status:"
pm2 status

echo ""
echo "✅ Fix Applied!"
echo "=========================="
echo "Your Erix Clean Hub should now be accessible at:"
echo "🌍 http://209.38.105.200:3000/"
echo ""
echo "If it still doesn't work, also try:"
echo "- sudo ufw allow 80"  
echo "- sudo ufw allow 443"
echo ""
echo "📋 All your pages:"
echo "   • Welcome Hub: http://209.38.105.200:3000/"
echo "   • Cleaning Service: http://209.38.105.200:3000/cleaning"
echo "   • Modern Services: http://209.38.105.200:3000/services" 
echo "   • Schedule Manager: http://209.38.105.200:3000/schedule"
echo "   • AI Generator: http://209.38.105.200:3000/ai-generator"
echo "   • Dashboard: http://209.38.105.200:3000/dashboard"
