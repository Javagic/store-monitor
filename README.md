# 🎯 Store Item Monitor

A Node.js application that monitors online store items for availability with a beautiful web dashboard and console notifications.

## ✨ Features

- **📊 Web Dashboard**: Beautiful interface to manage items and view status
- **🖥️ Live Console**: Real-time console log viewer in your browser  
- **📱 Quick Status**: Mobile-friendly status overview
- **🔔 Console Notifications**: All alerts displayed in terminal and web console
- **🛍️ Item Management**: Add, monitor, and track multiple store items
- **💰 Price Tracking**: Optional price threshold monitoring
- **👥 Subscriber Management**: Multiple users can subscribe to item alerts

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**: http://localhost:3000

## 🌐 Web Interfaces

### 📊 **Main Dashboard** - http://localhost:3000/dashboard
- Full-featured web interface
- Add new items to monitor
- View all monitored items and their status
- Real-time statistics and updates
- Subscriber management

### 📱 **Quick Status** - http://localhost:3000/status  
- Mobile-friendly status overview
- Quick stats and system health
- Test notification button
- Auto-refreshing data

### 🖥️ **Live Console** - http://localhost:3000/console
- Real-time console log viewer
- See all notifications as they happen
- Terminal-style interface in your browser
- Test alerts and view system events

## 📧 Notifications

**Console-Based**: All notifications appear in both your terminal and the web console viewer.

When items become available, you'll see alerts like:
```
🚨 ITEM AVAILABILITY ALERT!
===============================
⏰ Time: 7/26/2025, 9:54:05 PM
📧 Would notify: user@example.com
📝 Subject: Item Available!
💬 Message: Your monitored item is now in stock!
🛍️ Item: Gaming Chair
🔗 URL: https://store.com/gaming-chair
💰 Price: $299.99
===============================
```

## 🔗 API Endpoints

### Items Management
- `GET /api/items` - List all monitored items
- `POST /api/items` - Add new item to monitor
- `GET /api/items/:id` - Get specific item details
- `DELETE /api/items/:id` - Remove item from monitoring

### Subscriptions  
- `POST /api/items/:id/subscribe` - Subscribe to item notifications
- `DELETE /api/items/:id/subscribe/:userId` - Unsubscribe from notifications

### System
- `GET /health` - System health check
- `POST /api/items/test-notification` - Send test notification
- `GET /api` - API information and documentation

## 🛠️ Usage Examples

### Adding an Item via Web Dashboard
1. Go to http://localhost:3000
2. Click "➕ Add New Item to Monitor" 
3. Fill in the product details
4. Click "Add Item"

### Adding an Item via API
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Chair",
    "url": "https://example-store.com/product",
    "selector": ".availability",
    "availableText": "In Stock",
    "maxPrice": 299.99,
    "priceSelector": ".price"
  }'
```

### Subscribe to Notifications
```bash
curl -X POST http://localhost:3000/api/items/ITEM_ID/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "email": "user@example.com"
  }'
```

## 📁 Project Structure

```
public/
├── index.html      # Main dashboard interface
├── status.html     # Quick status page  
└── console.html    # Live console viewer
src/
├── routes/items.js          # API routes
├── services/
│   ├── itemMonitor.js       # Core monitoring logic
│   └── notificationService.js # Console notification handler
└── config/storeExamples.js  # Example configurations
```

## ⚙️ Configuration

Edit `.env` file:
```env
PORT=3000
CHECK_INTERVAL_MINUTES=5
```

## 🎯 Why This Approach?

- **🚀 Simple Setup**: No email configuration needed
- **📱 Multi-Interface**: Terminal, web dashboard, and mobile views
- **⚡ Real-time**: Live updates and console viewing
- **🔧 No Dependencies**: Works completely offline
- **🎨 Beautiful UI**: Modern web interface for easy management
- **📊 Visual Analytics**: See stats and trends at a glance

## 📊 Monitoring

The server automatically checks all monitored items every 5 minutes. You can:
- Watch the terminal for console alerts
- View live updates in the web console at `/console`
- Check the dashboard for visual status updates
- Use the mobile-friendly status page for quick checks

## 🎨 Screenshots

- **Dashboard**: Full-featured web interface with item management
- **Live Console**: Terminal-style real-time log viewer  
- **Quick Status**: Mobile-optimized status overview
- **Notifications**: Beautiful console alerts with full details

## 🚀 Deployment

For 24/7 monitoring, deploy to any cloud service:
- **DigitalOcean**: Use the included deployment scripts
- **Heroku**: Works out of the box
- **AWS/Vercel**: Deploy easily with standard Node.js setup

The web interfaces will be available at your deployed URL, and console output will be viewable in your deployment logs.

## 🛡️ Features

- ✅ Real-time item monitoring
- ✅ Beautiful web dashboard
- ✅ Mobile-responsive design  
- ✅ Live console log viewer
- ✅ Price threshold alerts
- ✅ Multiple subscriber support
- ✅ RESTful API
- ✅ No external dependencies
- ✅ Easy deployment
- ✅ Console and web notifications

Perfect for monitoring gaming gear, electronics, sneaker drops, or any online store items! 🎯
