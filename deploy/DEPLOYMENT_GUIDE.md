# DigitalOcean Deployment Guide for Store Monitor

## Prerequisites
1. Create a DigitalOcean account
2. Create a Droplet (recommended: Ubuntu 22.04, $5/month Basic plan)
3. Have your email service credentials ready

## Step 1: Create a Droplet

1. Log in to DigitalOcean
2. Click "Create" → "Droplets"
3. Choose:
   - **Image**: Ubuntu 22.04 (LTS) x64
   - **Plan**: Basic ($5/month, 1GB RAM, 1 vCPU)
   - **Datacenter**: Choose closest to your location
   - **Authentication**: SSH key (recommended) or Password
4. Give it a name like "store-monitor"
5. Click "Create Droplet"

## Step 2: Connect to Your Droplet

```bash
# Replace YOUR_DROPLET_IP with actual IP
ssh root@YOUR_DROPLET_IP
```

## Step 3: Run Setup Script

Copy the `setup-droplet.sh` script to your droplet and run it:

```bash
# Upload the setup script (from your local machine)
scp deploy/setup-droplet.sh root@YOUR_DROPLET_IP:/root/

# On the droplet, make it executable and run
chmod +x setup-droplet.sh
./setup-droplet.sh
```

## Step 4: Deploy Your Application

```bash
# Clone your repository
git clone https://github.com/yourusername/store-monitor.git /var/www/store-monitor

# Navigate to app directory
cd /var/www/store-monitor

# Install dependencies
npm install

# Create environment file
nano .env
```

### Environment Variables (.env)
```env
# Email Configuration (choose one method)

# Method 1: Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Method 2: Custom SMTP
# SMTP_HOST=smtp.your-provider.com
# SMTP_PORT=587
# SMTP_SECURE=false
# EMAIL_USER=your-email@domain.com
# EMAIL_PASS=your-password

# Server Configuration
PORT=3000
NODE_ENV=production
```

## Step 5: Start the Application

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Set PM2 to start on boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs store-monitor
```

## Step 6: Configure Nginx (Optional - for domain/SSL)

```bash
# Copy nginx configuration
sudo cp deploy/nginx.conf /etc/nginx/sites-available/store-monitor

# Edit the configuration to use your domain
sudo nano /etc/nginx/sites-available/store-monitor

# Enable the site
sudo ln -s /etc/nginx/sites-available/store-monitor /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Step 7: Set Up SSL (Optional but recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com
```

## Step 8: Test Your Deployment

1. **Check if server is running**:
   ```bash
   curl http://YOUR_DROPLET_IP:3000/health
   ```

2. **Test API endpoints**:
   ```bash
   # Add an item to monitor
   curl -X POST http://YOUR_DROPLET_IP:3000/api/items \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Item",
       "url": "https://example.com/product",
       "selector": ".price",
       "userContact": {
         "email": "your-email@example.com"
       }
     }'
   ```

## Step 9: Monitor and Maintain

```bash
# View logs
pm2 logs store-monitor

# Restart application
pm2 restart store-monitor

# Update application
cd /var/www/store-monitor
git pull origin main
npm install
pm2 restart store-monitor
```

## Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## Cost Estimate
- **Basic Droplet**: $5/month
- **Domain** (optional): $10-15/year
- **Total**: ~$5/month + optional domain cost

## Useful Commands

```bash
# Check droplet resources
htop
df -h

# View application logs
pm2 logs

# Monitor system logs
sudo journalctl -u nginx -f

# Check open ports
sudo netstat -tlnp
```

## Backup Strategy

1. **Regular code backups**: Use Git repository
2. **Environment file backup**: Store `.env` securely
3. **DigitalOcean Snapshots**: Enable automatic backups ($1/month)

## Troubleshooting

1. **Application won't start**:
   ```bash
   pm2 logs store-monitor
   ```

2. **Can't access from outside**:
   ```bash
   sudo ufw status
   sudo netstat -tlnp | grep 3000
   ```

3. **Email not working**:
   - Check `.env` file configuration
   - Verify email credentials
   - Check application logs

Your store monitor will now run 24/7 on DigitalOcean! 🚀
