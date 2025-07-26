# 🚀 Erix Clean Hub - Production Deployment Guide

## 📋 Pre-Deployment Checklist ✅

- ✅ Welcome page created as main hub
- ✅ AI Image Service with proper error handling  
- ✅ Schedule management system
- ✅ Modern services page (Greeny Home-inspired)
- ✅ All testing files cleaned up
- ✅ Code committed to GitHub
- ✅ OpenAI API integration ready

## 🔧 **Option 1: Deploy via SSH (Recommended)**

### Step 1: Connect to Your Droplet
```bash
# Use password authentication if SSH keys aren't set up
ssh root@209.38.105.200
# Enter your droplet password when prompted
```

### Step 2: Navigate to App Directory
```bash
cd /var/www/store-monitor
```

### Step 3: Pull Latest Changes from GitHub
```bash
# Pull the latest code with all your improvements
git pull origin main

# Or if it's a fresh deployment:
# git clone https://github.com/Javagic/store-monitor.git .
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Configure Environment
```bash
# Copy and edit environment file
cp .env.example .env
nano .env

# Set your OpenAI API key and other settings:
# OPENAI_API_KEY=sk-proj-your-actual-key-here
# NODE_ENV=production
# PORT=3000
```

### Step 6: Restart the Application
```bash
# Stop existing process
pm2 stop store-monitor
pm2 delete store-monitor

# Start with new configuration
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
```

## 🔧 **Option 2: Deploy via File Upload**

If SSH isn't working, you can use a file manager or FTP client:

### Files to Upload:
```
├── server.js
├── package.json  
├── package-lock.json
├── ecosystem.config.js
├── src/
│   ├── services/
│   │   ├── aiImageService.js
│   │   ├── itemMonitor.js
│   │   └── notificationService.js
│   └── routes/
│       ├── items.js
│       └── images.js
├── public/
│   ├── welcome.html
│   ├── cleaning.html
│   ├── services.html
│   ├── schedule.html
│   ├── ai-generator.html
│   └── assets/
└── .env.example
```

### After Upload:
1. Connect via SSH: `ssh root@209.38.105.200`
2. `cd /var/www/store-monitor`
3. `npm install`
4. Create `.env` file with your settings
5. `pm2 restart ecosystem.config.js`

## 🌐 **Option 3: Alternative Hosting Platforms**

If DigitalOcean SSH is problematic, consider these alternatives:

### **Vercel (Recommended for Node.js)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy directly from your project folder
vercel

# Follow the prompts to deploy
```

### **Railway**
1. Go to https://railway.app
2. Connect your GitHub repository (Javagic/store-monitor)
3. It will auto-deploy from your main branch
4. Add environment variables in the dashboard

### **Render**
1. Go to https://render.com
2. Connect GitHub and select your repository
3. Choose "Web Service"
4. Set build command: `npm install`
5. Set start command: `npm start`

## 🔑 **Environment Variables for Production**

Make sure to set these in your `.env` file:

```bash
# Server Configuration
NODE_ENV=production
PORT=3000

# OpenAI Configuration (REQUIRED for AI features)
OPENAI_API_KEY=sk-proj-your-actual-openai-key-here

# Cleaning Service Configuration
COMPANY_NAME=Erix Clean
COMPANY_PHONE=+995 555 123 456
COMPANY_EMAIL=info@erixclean.ge
COMPANY_ADDRESS=Tbilisi, Georgia

# Monitoring Configuration
CHECK_INTERVAL_MINUTES=5
```

## 🎯 **What Will Be Live After Deployment**

### **Main Pages:**
1. **Welcome Hub**: `https://your-domain.com/` - Main landing page
2. **Cleaning Service**: `https://your-domain.com/cleaning` - Business page
3. **Modern Services**: `https://your-domain.com/services` - Calculator & testimonials
4. **Schedule Manager**: `https://your-domain.com/schedule` - Internal staff management
5. **AI Generator**: `https://your-domain.com/ai-generator` - Image generation
6. **Store Monitor**: `https://your-domain.com/dashboard` - Original monitoring

### **API Endpoints:**
- `POST /api/cleaning/quote` - Quote requests
- `POST /api/images/generate/*` - AI image generation
- `GET /api/images/gallery` - Generated images
- `GET /health` - Health check

## ✅ **Post-Deployment Checklist**

1. **Test Welcome Page**: Visit your domain root
2. **Test AI Generation**: Visit `/ai-generator` and try generating an image
3. **Test Quote System**: Submit a quote request on `/cleaning`
4. **Test Schedule System**: Check `/schedule` functionality
5. **Test Services Page**: Use calculator on `/services`
6. **Check Logs**: `pm2 logs store-monitor`

## 🔧 **Troubleshooting**

### If Welcome Page Doesn't Load:
```bash
# Check if server is running
pm2 status

# Check logs for errors
pm2 logs store-monitor

# Restart if needed
pm2 restart store-monitor
```

### If AI Generation Fails:
1. Check your OpenAI API key in `.env`
2. Verify API key has billing enabled
3. Check logs for specific error messages

### If Images Don't Display:
```bash
# Check if assets directory exists
ls -la /var/www/store-monitor/public/assets/

# Create if missing
mkdir -p /var/www/store-monitor/public/assets/generated
```

## 🎉 **Success! Your Erix Clean Hub is Live!**

After successful deployment, you'll have:
- ✅ Professional business website with welcome hub
- ✅ AI-powered image generation for marketing
- ✅ Internal schedule management system  
- ✅ Modern services page with calculator
- ✅ Complete quote and contact system
- ✅ Mobile-responsive design
- ✅ All original store monitoring features

Your comprehensive business platform is ready for customers! 🚀

---

**Need Help?** Check PM2 logs with `pm2 logs store-monitor` for any deployment issues.
