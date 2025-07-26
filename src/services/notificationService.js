const nodemailer = require('nodemailer');

class NotificationService {
    constructor() {
        this.emailTransporter = null;
        console.log('📧 Email notifications disabled - console logging only');
    }

    /**
     * Initialize email service (DISABLED)
     */
    initializeEmailService() {
        console.log('📧 Email service disabled - notifications will be logged to console only');
        console.log('💡 All item availability changes will be displayed in the terminal');
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
        
        // 🎯 CONSOLE NOTIFICATION ONLY (Email disabled)
        console.log('\n🚨 ITEM AVAILABILITY ALERT!');
        console.log('===============================');
        console.log(`⏰ Time: ${new Date().toLocaleString()}`);
        console.log(`📧 Would notify: ${contactInfo.email || contactInfo.phone || 'Unknown'}`);
        console.log(`📝 Subject: ${notification.subject}`);
        console.log(`💬 Message: ${notification.message}`);
        
        if (notification.item) {
            console.log(`🛍️  Item: ${notification.item.name}`);
            console.log(`🔗 URL: ${notification.item.url}`);
            if (notification.item.price) {
                console.log(`💰 Price: $${notification.item.price}`);
            }
        }
        console.log('===============================\n');

        // Note: Email functionality has been removed
        console.log('📧 Email notifications are disabled - check console for alerts');

        return true;
    }

    /**
     * Send email notification (DISABLED - Console only)
     */
    async sendEmail(email, notification) {
        console.log(`📧 [Email Disabled] Would send to: ${email}`);
        console.log(`📝 Subject: ${notification.subject}`);
        console.log(`💬 Message: ${notification.message}`);
        return { messageId: 'console-only', accepted: [email] };
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
