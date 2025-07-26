const nodemailer = require('nodemailer');

class NotificationService {
    constructor() {
        this.emailTransporter = null;
        this.initializeEmailService();
    }

    /**
     * Initialize email service
     */
    initializeEmailService() {
        // Configure email transporter
        if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            this.emailTransporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE, // 'gmail', 'hotmail', 'yahoo', etc.
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            console.log(`Email service initialized: ${process.env.EMAIL_SERVICE}`);
        } else if (process.env.SMTP_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Custom SMTP configuration
            this.emailTransporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            console.log(`Custom SMTP service initialized: ${process.env.SMTP_HOST}`);
        } else {
            console.log('Email service not configured - notifications will be logged only');
            console.log('Supported services: gmail, hotmail, yahoo, or custom SMTP');
        }
    }

    /**
     * Send notification to user
     * @param {Object} contactInfo - User contact information
     * @param {string} contactInfo.email - User email
     * @param {string} contactInfo.phone - User phone (for future SMS implementation)
     * @param {Object} notification - Notification data
     * @param {string} notification.subject - Email subject
     * @param {string} notification.message - Notification message
     * @param {Object} notification.item - Item data
     */
    async sendNotification(contactInfo, notification) {
        const timestamp = new Date().toISOString();
        
        // Log notification (always)
        console.log(`[${timestamp}] NOTIFICATION:`, {
            recipient: contactInfo.email || contactInfo.phone,
            subject: notification.subject,
            message: notification.message
        });

        // Send email if configured
        if (this.emailTransporter && contactInfo.email) {
            try {
                await this.sendEmail(contactInfo.email, notification);
                console.log(`Email sent to ${contactInfo.email}`);
            } catch (error) {
                console.error(`Failed to send email to ${contactInfo.email}:`, error.message);
                throw error;
            }
        }

        // Future: Add SMS, webhook, or other notification methods here
        if (contactInfo.phone) {
            await this.sendSMS(contactInfo.phone, notification);
        }

        if (contactInfo.webhook) {
            await this.sendWebhook(contactInfo.webhook, notification);
        }

        return true;
    }

    /**
     * Send email notification
     */
    async sendEmail(email, notification) {
        if (!this.emailTransporter) {
            throw new Error('Email service not configured');
        }

        const htmlContent = this.generateEmailHTML(notification);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: notification.subject,
            text: notification.message,
            html: htmlContent
        };

        return await this.emailTransporter.sendMail(mailOptions);
    }

    /**
     * Generate HTML email content
     */
    generateEmailHTML(notification) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${notification.subject}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                .item-info { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
                .price { font-size: 1.2em; font-weight: bold; color: #2196F3; }
                .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
                .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${notification.subject}</h1>
            </div>
            <div class="content">
                <p>${notification.message}</p>
                
                ${notification.item ? `
                <div class="item-info">
                    <h3>${notification.item.name}</h3>
                    ${notification.item.currentPrice ? `<p class="price">Current Price: $${notification.item.currentPrice}</p>` : ''}
                    <p><strong>Status:</strong> ${notification.item.isAvailable ? '✅ Available' : '❌ Not Available'}</p>
                    <p><strong>Last Checked:</strong> ${new Date(notification.item.lastChecked).toLocaleString()}</p>
                    <a href="${notification.item.url}" class="button">View Item</a>
                </div>
                ` : ''}
                
                <p>This is an automated notification from your Store Item Monitor.</p>
            </div>
            <div class="footer">
                <p>Store Item Availability Monitor | ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Send SMS notification (placeholder for future implementation)
     */
    async sendSMS(phone, notification) {
        // Placeholder for SMS implementation
        // You could integrate with Twilio, AWS SNS, or other SMS services
        console.log(`[SMS] To ${phone}: ${notification.message}`);
        return true;
    }

    /**
     * Send webhook notification
     */
    async sendWebhook(webhookUrl, notification) {
        try {
            const axios = require('axios');
            await axios.post(webhookUrl, {
                timestamp: new Date().toISOString(),
                subject: notification.subject,
                message: notification.message,
                item: notification.item
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });
            console.log(`Webhook sent to ${webhookUrl}`);
        } catch (error) {
            console.error(`Failed to send webhook to ${webhookUrl}:`, error.message);
            throw error;
        }
    }

    /**
     * Test notification service
     */
    async testNotification(contactInfo) {
        const testNotification = {
            subject: 'Test Notification - Store Monitor',
            message: 'This is a test notification from your Store Item Monitor service.',
            item: {
                name: 'Test Item',
                url: 'https://example.com',
                isAvailable: true,
                currentPrice: 99.99,
                lastChecked: new Date()
            }
        };

        return await this.sendNotification(contactInfo, testNotification);
    }
}

module.exports = NotificationService;
