#!/bin/bash

# 🔍 Complete Diagnostic and Fix Script for Erix Clean Hub
# This will diagnose and fix all possible issues

echo "🔍 COMPLETE DIAGNOSTIC AND FIX"
echo "=============================="
echo "Checking everything step by step..."
echo ""

# Navigate to app directory
echo "📁 1. Checking app directory..."
cd /var/www/store-monitor || {
    echo "❌ ERROR: /var/www/store-monitor directory not found!"
    echo "Creating directory and cloning repository..."
    mkdir -p /var/www/store-monitor
    cd /var/www/store-monitor
    git clone https://github.com/Javagic/store-monitor.git .
}

# Check current git status
echo "📋 2. Git repository status..."
git status
echo ""

# Force clean update
echo "🧹 3. Force cleaning local changes..."
git reset --hard HEAD
git clean -fd
echo "✅ Local changes cleaned"
echo ""

# Pull latest code
echo "📥 4. Pulling latest code..."
git fetch origin
git reset --hard origin/main
echo "✅ Latest code pulled"
echo ""

# Check if key files exist
echo "📂 5. Checking key files..."
if [ -f "server.js" ]; then
    echo "✅ server.js found"
else
    echo "❌ server.js missing!"
fi

if [ -f "public/welcome.html" ]; then
    echo "✅ welcome.html found"
else
    echo "❌ welcome.html missing!"
fi

if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json missing!"
fi
echo ""

# Install dependencies
echo "📦 6. Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check if .env file exists and create if needed
echo "⚙️  7. Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit .env file to add your OpenAI API key!"
    echo "   nano .env"
fi
echo ""

# Create necessary directories
echo "📁 8. Creating necessary directories..."
mkdir -p logs
mkdir -p public/assets/generated
echo "✅ Directories created"
echo ""

# Stop any existing PM2 processes
echo "⏹️  9. Stopping existing processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
echo "✅ Existing processes stopped"
echo ""

# Start the application
echo "🚀 10. Starting Erix Clean Hub..."
pm2 start ecosystem.config.js
pm2 save
echo "✅ Application started"
echo ""

# Check PM2 status
echo "📊 11. PM2 Status:"
pm2 status
echo ""

# Check if port 3000 is listening
echo "🔌 12. Checking port 3000..."
if netstat -tlnp | grep -q ":3000"; then
    echo "✅ Port 3000 is listening"
    netstat -tlnp | grep ":3000"
else
    echo "❌ Port 3000 is not listening"
    echo "Let's try to start on a different port..."
    PORT=3001 pm2 start server.js --name store-monitor-alt
fi
echo ""

# Test local connection
echo "🧪 13. Testing local connection..."
echo "Testing http://localhost:3000..."
response=$(curl -s -w "%{http_code}" -o /tmp/test_response http://localhost:3000)
if [ "$response" = "200" ]; then
    echo "✅ Local connection works (HTTP 200)"
    echo "Response preview:"
    head -c 100 /tmp/test_response
    echo "..."
else
    echo "❌ Local connection failed (HTTP $response)"
    echo "Checking alternative port 3001..."
    response2=$(curl -s -w "%{http_code}" -o /tmp/test_response2 http://localhost:3001)
    if [ "$response2" = "200" ]; then
        echo "✅ Alternative port 3001 works!"
    fi
fi
echo ""

# Check firewall
echo "🔥 14. Checking firewall..."
ufw status
echo "Opening required ports..."
ufw allow 3000
ufw allow 3001
echo "✅ Firewall configured"
echo ""

# Check recent logs
echo "📝 15. Recent application logs:"
pm2 logs store-monitor --lines 10 --nostream
echo ""

# Final status
echo "🎯 DIAGNOSTIC COMPLETE!"
echo "======================"
echo ""
echo "🌐 Test your site now:"
echo "   Primary:     http://209.38.105.200:3000/"
echo "   Alternative: http://209.38.105.200:3001/"
echo ""
echo "📋 Your pages should be:"
echo "   • Welcome Hub: http://209.38.105.200:3000/"
echo "   • Cleaning Service: http://209.38.105.200:3000/cleaning"
echo "   • Modern Services: http://209.38.105.200:3000/services"
echo "   • Schedule Manager: http://209.38.105.200:3000/schedule"
echo "   • AI Generator: http://209.38.105.200:3000/ai-generator"
echo "   • Dashboard: http://209.38.105.200:3000/dashboard"
echo ""
echo "🔧 If still not working:"
echo "   • Check logs: pm2 logs store-monitor"
echo "   • Restart: pm2 restart store-monitor"
echo "   • Check status: pm2 status"
echo "   • Check processes: ps aux | grep node"
echo ""
echo "📞 Manual commands to try:"
echo "   pm2 restart all"
echo "   pm2 logs store-monitor --lines 20"
echo "   curl -I http://localhost:3000"
