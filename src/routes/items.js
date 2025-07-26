const express = require('express');

module.exports = (itemMonitor) => {
    const router = express.Router();

    /**
     * GET /api/items - Get all monitored items
     */
    router.get('/', (req, res) => {
        try {
            const items = itemMonitor.getMonitoredItems();
            res.json({
                success: true,
                count: items.length,
                items: items
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * POST /api/items - Add new item to monitor
     */
    router.post('/', async (req, res) => {
        try {
            const { url, name, selector, availableText, maxPrice, priceSelector } = req.body;

            // Validation
            if (!url || !name || !selector || !availableText) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: url, name, selector, availableText'
                });
            }

            const itemId = itemMonitor.addItem({
                url,
                name,
                selector,
                availableText,
                maxPrice: maxPrice ? parseFloat(maxPrice) : null,
                priceSelector
            });

            res.status(201).json({
                success: true,
                message: 'Item added successfully',
                itemId: itemId
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * DELETE /api/items/:itemId - Remove item from monitoring
     */
    router.delete('/:itemId', (req, res) => {
        try {
            const { itemId } = req.params;
            const removed = itemMonitor.removeItem(itemId);

            if (removed) {
                res.json({
                    success: true,
                    message: 'Item removed successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Item not found'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * POST /api/items/:itemId/check - Manually check item availability
     */
    router.post('/:itemId/check', async (req, res) => {
        try {
            const { itemId } = req.params;
            const result = await itemMonitor.checkItem(itemId);

            res.json({
                success: true,
                result: result
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    });

    /**
     * POST /api/items/check-all - Manually check all items
     */
    router.post('/check-all', async (req, res) => {
        try {
            const results = await itemMonitor.checkAllItems();

            res.json({
                success: true,
                message: 'Checked all items',
                results: results
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * POST /api/items/:itemId/subscribe - Subscribe to item notifications
     */
    router.post('/:itemId/subscribe', (req, res) => {
        try {
            const { itemId } = req.params;
            const { userId, email, phone, webhook } = req.body;

            // Validation
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'userId is required'
                });
            }

            if (!email && !phone && !webhook) {
                return res.status(400).json({
                    success: false,
                    error: 'At least one contact method (email, phone, webhook) is required'
                });
            }

            const contactInfo = { email, phone, webhook };
            itemMonitor.subscribeUser(userId, itemId, contactInfo);

            res.json({
                success: true,
                message: 'Successfully subscribed to item notifications'
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    });

    /**
     * DELETE /api/items/:itemId/subscribe/:userId - Unsubscribe from item notifications
     */
    router.delete('/:itemId/subscribe/:userId', (req, res) => {
        try {
            const { itemId, userId } = req.params;
            itemMonitor.unsubscribeUser(userId, itemId);

            res.json({
                success: true,
                message: 'Successfully unsubscribed from item notifications'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * GET /api/items/user/:userId - Get user subscriptions
     */
    router.get('/user/:userId', (req, res) => {
        try {
            const { userId } = req.params;
            const subscriptions = itemMonitor.getUserSubscriptions(userId);

            res.json({
                success: true,
                userId: userId,
                subscriptions: subscriptions
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * POST /api/items/test-notification - Test notification service
     */
    router.post('/test-notification', async (req, res) => {
        try {
            const { email, phone, webhook } = req.body;

            if (!email && !phone && !webhook) {
                return res.status(400).json({
                    success: false,
                    error: 'At least one contact method (email, phone, webhook) is required'
                });
            }

            const contactInfo = { email, phone, webhook };
            await itemMonitor.notificationService.testNotification(contactInfo);

            res.json({
                success: true,
                message: 'Test notification sent successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    return router;
};
