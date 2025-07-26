# Connect to DigitalOcean Droplet - Store Monitor Deployment

Write-Host "🚀 Store Monitor - DigitalOcean Deployment Helper" -ForegroundColor Green
Write-Host ""

$dropletIP = "209.38.105.200"
$repoURL = "https://github.com/Javagic/store-monitor.git"

Write-Host "Your Droplet Details:" -ForegroundColor Yellow
Write-Host "IP Address: $dropletIP"
Write-Host "Repository: $repoURL"
Write-Host ""

Write-Host "Step 1: Connect to your droplet" -ForegroundColor Cyan
Write-Host "If you set up password authentication, you'll be prompted for the root password."
Write-Host "If you used SSH keys, make sure your private key is configured."
Write-Host ""

Write-Host "Connecting to droplet..." -ForegroundColor Green
Write-Host "Command: ssh root@$dropletIP" -ForegroundColor Gray

# Try to connect via SSH
ssh root@$dropletIP

Write-Host ""
Write-Host "Once connected to your droplet, run these commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "# 1. Update system and install Node.js" -ForegroundColor Gray
Write-Host "sudo apt update && sudo apt upgrade -y"
Write-Host "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
Write-Host "sudo apt-get install -y nodejs"
Write-Host ""
Write-Host "# 2. Install PM2 for process management" -ForegroundColor Gray
Write-Host "sudo npm install -g pm2"
Write-Host ""
Write-Host "# 3. Create app directory" -ForegroundColor Gray
Write-Host "sudo mkdir -p /var/www/store-monitor"
Write-Host "sudo chown -R `$USER:`$USER /var/www/store-monitor"
Write-Host ""
Write-Host "# 4. Clone your repository" -ForegroundColor Gray
Write-Host "git clone $repoURL /var/www/store-monitor"
Write-Host ""
Write-Host "# 5. Install dependencies" -ForegroundColor Gray
Write-Host "cd /var/www/store-monitor"
Write-Host "npm install"
Write-Host ""
Write-Host "# 6. Create environment file" -ForegroundColor Gray
Write-Host "nano .env"
Write-Host ""
Write-Host "# Add this to your .env file:" -ForegroundColor Gray
Write-Host "EMAIL_SERVICE=gmail"
Write-Host "EMAIL_USER=your-email@gmail.com"
Write-Host "EMAIL_PASS=your-app-password"
Write-Host "PORT=3000"
Write-Host "NODE_ENV=production"
Write-Host ""
Write-Host "# 7. Start the application" -ForegroundColor Gray
Write-Host "pm2 start ecosystem.config.js"
Write-Host "pm2 startup"
Write-Host "pm2 save"
Write-Host ""
Write-Host "# 8. Test if it's working" -ForegroundColor Gray
Write-Host "curl http://localhost:3000/health"
Write-Host ""
Write-Host "Your Store Monitor will then be running 24/7! 🎉" -ForegroundColor Green
