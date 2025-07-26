# Quick Setup Instructions for Your Store Monitor

## Your Droplet Details:
- **IP Address**: 209.38.105.200
- **GitHub Username**: Javagic

## Step 1: Create GitHub Repository

1. Go to https://github.com/Javagic
2. Click "New" to create a new repository
3. Name it: `store-monitor`
4. Make it **Public** (so the droplet can clone it easily)
5. Don't initialize with README (we already have files)
6. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, run these commands in your VS Code terminal:

```bash
git push -u origin main
```

## Step 3: Connect to Your Droplet

Open PowerShell or Command Prompt and connect to your droplet:

```bash
ssh root@209.38.105.200
```

## Step 4: Upload Setup Script

From your local machine (in a new terminal window):

```bash
scp deploy/setup-droplet.sh root@209.38.105.200:/root/
```

## Step 5: Run Setup on Droplet

On the droplet:

```bash
chmod +x setup-droplet.sh
./setup-droplet.sh
```

## Step 6: Deploy Your Application

```bash
git clone https://github.com/Javagic/store-monitor.git /var/www/store-monitor
cd /var/www/store-monitor
npm install
```

## Step 7: Configure Environment

```bash
nano .env
```

Add your email configuration:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
NODE_ENV=production
```

## Step 8: Start the Application

```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## Step 9: Test Your Setup

From any computer, test if it's working:
```bash
curl http://209.38.105.200:3000/health
```

## 🎉 Your Monitor Will Be Live!

Once completed, your store monitor will run 24/7 at:
- **API**: http://209.38.105.200:3000
- **Health Check**: http://209.38.105.200:3000/health

You can add items to monitor and receive email notifications even when your computer is off!
