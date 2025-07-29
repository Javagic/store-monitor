const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('cron');
const path = require('path');
const session = require('express-session');
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

// Session middleware for admin protection
app.use(session({
    secret: process.env.SESSION_SECRET || 'erix-clean-admin-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Admin protection with rate limiting
const adminAttempts = new Map(); // Store failed attempts by IP
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this!
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

function isIPLocked(ip) {
    const attempts = adminAttempts.get(ip);
    if (!attempts) return false;
    
    if (attempts.count >= MAX_ATTEMPTS) {
        const timePassed = Date.now() - attempts.lastAttempt;
        if (timePassed < LOCKOUT_TIME) {
            return true;
        } else {
            // Reset attempts after lockout period
            adminAttempts.delete(ip);
            return false;
        }
    }
    return false;
}

function recordFailedAttempt(ip) {
    const attempts = adminAttempts.get(ip) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    adminAttempts.set(ip, attempts);
}

function resetAttempts(ip) {
    adminAttempts.delete(ip);
}

// Serve static files (dashboard)
app.use(express.static(path.join(__dirname, 'public')));

// Admin authentication routes
app.get('/admin', (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    // Check if IP is locked
    if (isIPLocked(clientIP)) {
        const attempts = adminAttempts.get(clientIP);
        const timeLeft = Math.ceil((LOCKOUT_TIME - (Date.now() - attempts.lastAttempt)) / 60000);
        return res.status(429).send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
                <h2>🔒 Access Temporarily Blocked</h2>
                <p>Too many failed attempts. Please try again in ${timeLeft} minutes.</p>
                <p style="color: #666; font-size: 0.9em;">Your IP: ${clientIP}</p>
            </div>
        `);
    }
    
    // Check if already authenticated
    if (req.session.adminAuth) {
        return res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
    }
    
    // Show login form
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Admin Login - Erix Clean Hub</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0; padding: 0; min-height: 100vh;
                    display: flex; align-items: center; justify-content: center;
                }
                .login-container {
                    background: white; padding: 40px; border-radius: 15px;
                    box-shadow: 0 10px 50px rgba(0,0,0,0.3); width: 100%; max-width: 400px;
                }
                h2 { text-align: center; margin-bottom: 30px; color: #333; }
                .input-group {
                    position: relative; margin: 10px 0;
                }
                input { 
                    width: 100%; padding: 15px; border: 1px solid #ddd;
                    border-radius: 8px; font-size: 16px; box-sizing: border-box;
                    padding-right: 50px;
                }
                .password-toggle {
                    position: absolute; right: 15px; top: 50%;
                    transform: translateY(-50%); cursor: pointer;
                    color: #666; font-size: 18px; user-select: none;
                }
                .password-toggle:hover { color: #333; }
                button { 
                    width: 100%; padding: 15px; background: #667eea; color: white;
                    border: none; border-radius: 8px; font-size: 16px; cursor: pointer;
                    transition: background 0.3s ease; margin-top: 10px;
                }
                button:hover { background: #5a6fd8; }
                .error { color: #d32f2f; text-align: center; margin: 10px 0; }
                .attempts { color: #666; font-size: 0.9em; text-align: center; margin-top: 15px; }
                .password-hint { color: #888; font-size: 0.8em; text-align: center; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h2>🔐 Admin Access</h2>
                <form method="post" action="/admin/login">
                    <div class="input-group">
                        <input type="password" id="password" name="password" placeholder="Enter admin password" required autofocus>
                        <span class="password-toggle" onclick="togglePassword()">👁️</span>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div class="password-hint">
                    Click the eye icon to show/hide password
                </div>
                <div class="attempts">
                    ${adminAttempts.get(clientIP) ? 
                        `Failed attempts: ${adminAttempts.get(clientIP).count}/${MAX_ATTEMPTS}` : 
                        'Enter your admin password to continue'
                    }
                </div>
            </div>
            
            <script>
                function togglePassword() {
                    const passwordInput = document.getElementById('password');
                    const toggleIcon = document.querySelector('.password-toggle');
                    
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        toggleIcon.textContent = '🙈';
                        toggleIcon.title = 'Hide password';
                    } else {
                        passwordInput.type = 'password';
                        toggleIcon.textContent = '👁️';
                        toggleIcon.title = 'Show password';
                    }
                }
                
                // Add keyboard shortcut for password toggle
                document.addEventListener('keydown', function(e) {
                    if (e.ctrlKey && e.key === ' ') {
                        e.preventDefault();
                        togglePassword();
                    }
                });
            </script>
        </body>
        </html>
    `);
});

app.post('/admin/login', (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    // Check if IP is locked
    if (isIPLocked(clientIP)) {
        return res.status(429).json({ error: 'Too many attempts. Access temporarily blocked.' });
    }
    
    const { password } = req.body;
    
    if (password === ADMIN_PASSWORD) {
        // Successful login
        req.session.adminAuth = true;
        resetAttempts(clientIP);
        console.log(`🔐 Admin login successful from IP: ${clientIP}`);
        res.redirect('/admin');
    } else {
        // Failed login
        recordFailedAttempt(clientIP);
        const attempts = adminAttempts.get(clientIP);
        const remaining = MAX_ATTEMPTS - attempts.count;
        
        console.log(`🚨 Failed admin login attempt from IP: ${clientIP} (${attempts.count}/${MAX_ATTEMPTS})`);
        
        if (remaining > 0) {
            res.status(401).send(`
                <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
                    <h2>❌ Invalid Password</h2>
                    <p>Attempts remaining: ${remaining}</p>
                    <a href="/admin" style="color: #667eea;">Try Again</a>
                </div>
            `);
        } else {
            res.status(429).send(`
                <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
                    <h2>🔒 Access Blocked</h2>
                    <p>Too many failed attempts. Access blocked for 15 minutes.</p>
                </div>
            `);
        }
    }
});

app.post('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
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

// Get schedule data endpoint
app.get('/api/schedule/data', (req, res) => {
    try {
        const schedules = dataStorage.getSchedules();
        
        // Organize schedules by type
        const organizedData = {
            appointments: schedules.filter(s => s.type === 'appointment').map(s => s.data),
            cleaners: schedules.filter(s => s.type === 'cleaner').map(s => s.data),
            clients: schedules.filter(s => s.type === 'client').map(s => s.data)
        };
        
        res.json({
            success: true,
            data: organizedData
        });
        
    } catch (error) {
        console.error('Error loading schedule data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load schedule data'
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
