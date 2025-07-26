#!/bin/bash

# Quick deployment script for updating your DigitalOcean app
# Run this script after making changes to your local code

echo "🚀 Deploying Store Monitor updates..."

# Configuration - Update these with your details
DROPLET_IP="YOUR_DROPLET_IP"
APP_PATH="/var/www/store-monitor"
USER="root"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if DROPLET_IP is set
if [ "$DROPLET_IP" = "YOUR_DROPLET_IP" ]; then
    print_error "Please update DROPLET_IP in this script with your actual droplet IP"
    exit 1
fi

print_status "Deploying to $DROPLET_IP..."

# Pull latest changes on the droplet
print_status "Pulling latest changes..."
ssh $USER@$DROPLET_IP "cd $APP_PATH && git pull origin main"

# Install dependencies (in case package.json changed)
print_status "Installing dependencies..."
ssh $USER@$DROPLET_IP "cd $APP_PATH && npm install --production"

# Restart the application
print_status "Restarting application..."
ssh $USER@$DROPLET_IP "pm2 restart store-monitor"

# Check status
print_status "Checking application status..."
ssh $USER@$DROPLET_IP "pm2 status store-monitor"

print_status "Deployment complete! ✅"
print_warning "Check logs with: ssh $USER@$DROPLET_IP 'pm2 logs store-monitor'"
