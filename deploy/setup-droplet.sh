#!/bin/bash

# DigitalOcean Droplet Setup Script for Store Monitor
# Run this script on your Ubuntu droplet after creation

echo "🚀 Setting up Store Monitor on DigitalOcean..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Create application directory
sudo mkdir -p /var/www/store-monitor
sudo chown -R $USER:$USER /var/www/store-monitor

# Clone your repository (you'll need to replace with your actual repo)
echo "📂 Clone your repository to /var/www/store-monitor"
echo "Example: git clone https://github.com/yourusername/store-monitor.git /var/www/store-monitor"

echo "📝 Next steps:"
echo "1. Clone your repository to /var/www/store-monitor"
echo "2. cd /var/www/store-monitor"
echo "3. npm install"
echo "4. Create .env file with your email settings"
echo "5. Run: pm2 start ecosystem.config.js"
echo "6. Run: pm2 startup"
echo "7. Run: pm2 save"
echo "8. Configure Nginx (optional)"

echo "✅ Base setup complete!"
