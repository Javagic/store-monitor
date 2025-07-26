<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Store Item Monitor - Copilot Instructions

This is a Node.js server application that monitors internet store item availability and sends notifications to users when items become available or when price thresholds are met.

## Project Structure

- `server.js` - Main Express server with API routes and scheduled monitoring
- `src/services/itemMonitor.js` - Core monitoring service that checks item availability
- `src/services/notificationService.js` - Handles email, SMS, and webhook notifications
- `src/routes/items.js` - API routes for managing monitored items and subscriptions

## Key Features

1. **Item Monitoring**: Web scraping using Cheerio to check item availability
2. **Notifications**: Email notifications via Nodemailer, with placeholder support for SMS and webhooks
3. **User Subscriptions**: Users can subscribe to multiple items with different contact methods
4. **Price Alerts**: Optional price threshold monitoring
5. **Scheduled Checks**: Automatic monitoring every 5 minutes using cron jobs
6. **REST API**: Complete API for managing items and subscriptions

## Technical Guidelines

- Use async/await for asynchronous operations
- Include proper error handling and logging
- Respect website rate limits with delays between requests
- Use CSS selectors for web scraping
- Follow REST API conventions
- Include input validation for all endpoints
- Use environment variables for configuration

## Dependencies

- Express.js for the web server
- Cheerio for HTML parsing and web scraping
- Axios for HTTP requests
- Nodemailer for email notifications
- node-cron for scheduled tasks
- dotenv for environment configuration

## Environment Variables

Configure email service, monitoring intervals, and other settings via `.env` file.

When extending this project:
- Add new notification methods in NotificationService
- Implement rate limiting for API endpoints
- Add database persistence for items and subscriptions
- Include user authentication and authorization
- Add support for more complex scraping scenarios
