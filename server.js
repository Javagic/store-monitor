const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('cron');
const path = require('path');
require('dotenv').config();

const ItemMonitor = require('./src/services/itemMonitor');
const NotificationService = require('./src/services/notificationService');
const DataStorage = require('./src/services/dataStorage');
const itemRoutes = require('./src/routes/items');
const imageRoutes = require('./src/routes/images');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for dashboard
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (dashboard)
app.use(express.static(path.join(__dirname, 'public')));

// Admin dashboard route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

// Initialize services
const notificationService = new NotificationService();
const itemMonitor = new ItemMonitor(notificationService);
const dataStorage = new DataStorage();

// Routes
app.use('/api/items', itemRoutes(itemMonitor));
app.use('/api/images', imageRoutes());

// Cleaning service quote endpoint
app.post('/api/cleaning/quote', (req, res) => {
    try {
        const { name, phone, email, service, address, message } = req.body;
        
        // Save quote to persistent storage
        const savedQuote = dataStorage.saveQuote({
            name,
            phone,
            email,
            service,
            address,
            message
        });
        
        // Log the quote request
        console.log('\n🧽 CLEANING SERVICE QUOTE REQUEST');
        console.log('=====================================');
        console.log(`👤 Name: ${name}`);
        console.log(`📞 Phone: ${phone}`);
        console.log(`📧 Email: ${email}`);
        console.log(`🏠 Service: ${service}`);
        console.log(`📍 Address: ${address}`);
        console.log(`💬 Message: ${message}`);
        console.log(`💾 Saved as: ${savedQuote.id}`);
        console.log('=====================================\n');
        
        res.json({
            success: true,
            message: 'Quote request received successfully! We will contact you within 24 hours.',
            quoteId: savedQuote.id
        });
        
    } catch (error) {
        console.error('Error processing quote request:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process quote request'
        });
    }
});

// Data management endpoints
app.get('/api/data/quotes', (req, res) => {
    try {
        const quotes = dataStorage.getQuotes();
        res.json({
            success: true,
            count: quotes.length,
            quotes: quotes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve quotes'
        });
    }
});

app.get('/api/data/stats', (req, res) => {
    try {
        const stats = dataStorage.getStats();
        res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve statistics'
        });
    }
});

app.put('/api/data/quotes/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedQuote = dataStorage.updateQuoteStatus(id, status);
        
        if (updatedQuote) {
            res.json({
                success: true,
                quote: updatedQuote
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Quote not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update quote status'
        });
    }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    try {
        const contactData = req.body;
        const savedContact = dataStorage.saveContact(contactData);
        
        console.log('\n📞 CONTACT FORM SUBMISSION');
        console.log('=============================');
        console.log(`💾 Saved as: ${savedContact.id}`);
        console.log('=============================\n');
        
        res.json({
            success: true,
            message: 'Contact form submitted successfully!',
            contactId: savedContact.id
        });
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process contact form'
        });
    }
});

// Schedule data endpoint
app.post('/api/schedule/save', (req, res) => {
    try {
        const scheduleData = req.body;
        const savedSchedule = dataStorage.saveSchedule(scheduleData);
        
        console.log('\n📅 SCHEDULE DATA SAVED');
        console.log('=======================');
        console.log(`💾 Saved as: ${savedSchedule.id}`);
        console.log('=======================\n');
        
        res.json({
            success: true,
            message: 'Schedule saved successfully!',
            scheduleId: savedSchedule.id
        });
        
    } catch (error) {
        console.error('Error saving schedule:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save schedule'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    const stats = dataStorage.getStats();
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        monitored_items: itemMonitor.getMonitoredItemsCount(),
        stored_quotes: stats.totalQuotes,
        stored_contacts: stats.totalContacts
    });
});

// Dashboard route (serves the HTML dashboard)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Schedule management route (internal use)
app.get('/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'schedule.html'));
});

// Services page route (Greeny-inspired design)
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

// Quick status page
app.get('/status', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'status.html'));
});

// Live console page
app.get('/console', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'console.html'));
});

// Cleaning service page
app.get('/cleaning', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cleaning.html'));
});

// SVG to PNG converter page
app.get('/converter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'svg-converter.html'));
});

// AI Image Generator page
app.get('/ai-generator', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-generator.html'));
});

// Welcome page (home/landing page)
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Root endpoint - serve welcome page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Store Item Availability Monitor API',
        version: '1.0.0',
        description: 'Monitor online store items for availability with console notifications',
        web_interfaces: {
            dashboard: '/dashboard',
            quick_status: '/status',
            live_console: '/console',
            cleaning_service: '/cleaning'
        },
        api_endpoints: {
            health: '/health',
            items: '/api/items',
            test_notification: '/api/items/test-notification'
        },
        features: [
            'Real-time item monitoring',
            'Console-based notifications',
            'Web dashboard interface',
            'RESTful API',
            'Price threshold alerts'
        ]
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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Erix Clean Hub is running on port ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`🌍 External: http://0.0.0.0:${PORT}`);
    console.log(`📱 Welcome Hub: http://0.0.0.0:${PORT}/`);
    console.log(`🧹 Cleaning Service: http://0.0.0.0:${PORT}/cleaning`);
    console.log(`💫 Modern Services: http://0.0.0.0:${PORT}/services`);
    console.log(`📅 Schedule Manager: http://0.0.0.0:${PORT}/schedule`);
    console.log(`🤖 AI Generator: http://0.0.0.0:${PORT}/ai-generator`);
    console.log(`📊 Dashboard: http://0.0.0.0:${PORT}/dashboard`);
    
    // Start monitoring job
    monitoringJob.start();
    console.log('📡 Item monitoring scheduler started');
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
