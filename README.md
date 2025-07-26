# Store Item Availability Monitor

A Node.js server application that monitors internet store item availability and sends notifications to users when items become available or meet price criteria.

## Features

- 🔍 **Web Scraping**: Monitor any website for item availability using CSS selectors
- 📧 **Email Notifications**: Automatic email alerts when items become available
- 💰 **Price Monitoring**: Set price thresholds and get notified when prices drop
- ⏰ **Scheduled Checks**: Automatic monitoring every 5 minutes
- 👥 **Multi-User Support**: Multiple users can subscribe to the same items
- 🌐 **REST API**: Complete API for managing items and subscriptions
- 🔗 **Webhook Support**: Send notifications to external services
- 📱 **SMS Ready**: Placeholder for SMS notifications (requires service integration)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd your-project-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   copy .env.example .env
   ```
   Edit `.env` file with your email configuration (optional for basic functionality):
   ```env
   # Email notifications (optional)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the API**
   Open `http://localhost:3000` in your browser to see the API documentation.

## API Usage

### 1. Add an Item to Monitor

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "url": "https://store.example.com/iphone-15-pro",
    "selector": ".availability-status",
    "availableText": "In Stock",
    "priceSelector": ".price",
    "maxPrice": 999
  }'
```

### 2. Subscribe to Notifications

```bash
curl -X POST http://localhost:3000/api/items/{itemId}/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "email": "user@example.com"
  }'
```

### 3. Check Item Availability

```bash
# Check specific item
curl -X POST http://localhost:3000/api/items/{itemId}/check

# Check all items
curl -X POST http://localhost:3000/api/items/check-all
```

### 4. View Monitored Items

```bash
curl http://localhost:3000/api/items
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `EMAIL_SERVICE` | Email service (gmail, outlook, etc.) | - |
| `EMAIL_USER` | Email username | - |
| `EMAIL_PASS` | Email password/app password | - |
| `CHECK_INTERVAL_MINUTES` | Monitoring interval | 5 |

### Email Setup

For Gmail:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `EMAIL_PASS`

## Item Configuration

When adding items to monitor, you need to provide:

- **name**: Human-readable item name
- **url**: The webpage URL to monitor
- **selector**: CSS selector for the availability element
- **availableText**: Text that indicates the item is available
- **priceSelector** (optional): CSS selector for price element
- **maxPrice** (optional): Maximum price threshold for alerts

### Example CSS Selectors

```javascript
// Common availability selectors
".availability"           // Class selector
"#stock-status"          // ID selector
"[data-testid='status']" // Attribute selector
".price .current"        // Nested selector

// Text content examples
"In Stock"
"Available"
"Add to Cart"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/api/items` | List all monitored items |
| POST | `/api/items` | Add new item |
| DELETE | `/api/items/:id` | Remove item |
| POST | `/api/items/:id/check` | Check specific item |
| POST | `/api/items/check-all` | Check all items |
| POST | `/api/items/:id/subscribe` | Subscribe to item |
| DELETE | `/api/items/:id/subscribe/:userId` | Unsubscribe |
| GET | `/api/items/user/:userId` | User subscriptions |
| POST | `/api/items/test-notification` | Test notifications |

## Project Structure

```
├── server.js                          # Main server file
├── src/
│   ├── services/
│   │   ├── itemMonitor.js             # Item monitoring logic
│   │   └── notificationService.js     # Notification handling
│   └── routes/
│       └── items.js                   # API routes
├── .env                               # Environment configuration
├── .env.example                       # Environment template
├── package.json                       # Dependencies
└── README.md                          # This file
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This starts the server with nodemon for automatic restarts on file changes.

### Testing Notifications

Use the test endpoint to verify your notification setup:

```bash
curl -X POST http://localhost:3000/api/items/test-notification \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

## Extending the Application

### Adding New Notification Methods

1. Edit `src/services/notificationService.js`
2. Implement new methods (e.g., SMS, Slack, Discord)
3. Update the `sendNotification` method

### Adding Database Persistence

Currently, all data is stored in memory. To add persistence:

1. Choose a database (MongoDB, PostgreSQL, SQLite)
2. Install appropriate driver
3. Create data models
4. Update ItemMonitor to use database storage

### Adding Authentication

1. Install authentication middleware (e.g., JWT)
2. Protect API endpoints
3. Associate items and subscriptions with authenticated users

## Common Use Cases

1. **Limited Edition Drops**: Monitor sneaker/clothing releases
2. **Electronics**: Track GPU/console availability
3. **Tickets**: Monitor event ticket sales
4. **Deals**: Watch for price drops on specific items
5. **Restocks**: Get notified when sold-out items return

## Troubleshooting

### Common Issues

1. **Items not being detected as available**
   - Verify the CSS selector is correct
   - Check that `availableText` matches exactly
   - Test the selector in browser dev tools

2. **Email notifications not working**
   - Verify email credentials in `.env`
   - Check spam folder
   - Ensure app passwords for Gmail

3. **Website blocking requests**
   - The app includes User-Agent headers
   - Add delays between requests (built-in)
   - Some sites may require additional headers

### Debugging

Enable detailed logging by setting:
```env
NODE_ENV=development
```

Check server logs for detailed error messages and monitoring activity.

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## Support

- Check existing issues before creating new ones
- Provide detailed information about your setup
- Include error logs and configuration (without sensitive data)
