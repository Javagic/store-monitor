const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('cron');
require('dotenv').config();

const ItemMonitor = require('./src/services/itemMonitor');
const NotificationService = require('./src/services/notificationService');
const itemRoutes = require('./src/routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize services
const notificationService = new NotificationService();
const itemMonitor = new ItemMonitor(notificationService);

// Routes
app.use('/api/items', itemRoutes(itemMonitor));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        monitored_items: itemMonitor.getMonitoredItemsCount()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Store Item Availability Monitor API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            items: '/api/items'
        }
    });
});

// Start periodic monitoring (every 5 minutes)
const monitoringJob = new cron.CronJob('*/5 * * * *', () => {
    console.log('Running scheduled item availability check...');
    itemMonitor.checkAllItems();
}, null, false, 'America/New_York');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} for API information`);
    
    // Start monitoring job
    monitoringJob.start();
    console.log('Item monitoring scheduler started');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    monitoringJob.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    monitoringJob.stop();
    process.exit(0);
});
