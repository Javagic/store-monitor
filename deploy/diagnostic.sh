#!/bin/bash

# 🔍 Erix Clean Hub - Deployment Diagnostic Script
# Run this on your DigitalOcean droplet to diagnose connection issues

echo "🔍 Erix Clean Hub - Deployment Diagnostics"
echo "=========================================="

# Check if server is running
echo "1. Checking if Node.js server is running..."
if pm2 list | grep -q "store-monitor"; then
    echo "✅ PM2 process is running"
    pm2 status
else
    echo "❌ PM2 process not found"
    echo "Starting the server..."
    cd /var/www/store-monitor
    pm2 start ecosystem.config.js
fi

echo ""
echo "2. Checking server logs..."
pm2 logs store-monitor --lines 10

echo ""
echo "3. Checking if port 3000 is listening..."
if netstat -tlnp | grep -q ":3000"; then
    echo "✅ Port 3000 is listening"
    netstat -tlnp | grep ":3000"
else
    echo "❌ Port 3000 is not listening"
fi

echo ""
echo "4. Testing local connection..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
if [ $? -eq 0 ]; then
    echo " ✅ Local connection works"
else
    echo " ❌ Local connection failed"
fi

echo ""
echo "5. Checking firewall status..."
ufw status

echo ""
echo "6. Checking if nginx is running..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
    echo "Nginx sites enabled:"
    ls -la /etc/nginx/sites-enabled/
else
    echo "❌ Nginx is not running"
fi

echo ""
echo "7. Checking server binding..."
echo "Server should bind to 0.0.0.0:3000, not 127.0.0.1:3000"

echo ""
echo "🔧 Quick Fixes:"
echo "=================================="
echo "If port 3000 not accessible from outside:"
echo "  sudo ufw allow 3000"
echo ""
echo "If you want to use port 80 (recommended):"
echo "  sudo ufw allow 80"
echo "  # Then configure nginx proxy"
echo ""
echo "To restart the server:"
echo "  cd /var/www/store-monitor"
echo "  pm2 restart store-monitor"
echo ""
echo "To check detailed logs:"
echo "  pm2 logs store-monitor"
