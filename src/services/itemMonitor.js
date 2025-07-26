const axios = require('axios');
const cheerio = require('cheerio');

class ItemMonitor {
    constructor(notificationService) {
        this.notificationService = notificationService;
        this.monitoredItems = new Map();
        this.userSubscriptions = new Map(); // userId -> [itemIds]
    }

    /**
     * Add an item to monitor
     * @param {Object} itemData - Item configuration
     * @param {string} itemData.id - Unique item identifier
     * @param {string} itemData.url - URL to monitor
     * @param {string} itemData.name - Item name
     * @param {string} itemData.selector - CSS selector for availability check
     * @param {string} itemData.availableText - Text that indicates item is available
     * @param {number} itemData.maxPrice - Maximum price threshold (optional)
     * @param {string} itemData.priceSelector - CSS selector for price (optional)
     */
    addItem(itemData) {
        const item = {
            id: itemData.id || this.generateId(),
            url: itemData.url,
            name: itemData.name,
            selector: itemData.selector,
            availableText: itemData.availableText,
            maxPrice: itemData.maxPrice || null,
            priceSelector: itemData.priceSelector || null,
            lastChecked: null,
            isAvailable: false,
            currentPrice: null,
            subscribers: new Set()
        };

        this.monitoredItems.set(item.id, item);
        console.log(`Added item to monitor: ${item.name} (${item.id})`);
        return item.id;
    }

    /**
     * Remove an item from monitoring
     */
    removeItem(itemId) {
        const removed = this.monitoredItems.delete(itemId);
        if (removed) {
            console.log(`Removed item from monitoring: ${itemId}`);
        }
        return removed;
    }

    /**
     * Subscribe a user to item notifications
     */
    subscribeUser(userId, itemId, contactInfo) {
        if (!this.monitoredItems.has(itemId)) {
            throw new Error(`Item ${itemId} not found`);
        }

        const item = this.monitoredItems.get(itemId);
        item.subscribers.add(userId);

        // Store user contact info
        if (!this.userSubscriptions.has(userId)) {
            this.userSubscriptions.set(userId, {
                contactInfo: contactInfo,
                items: new Set()
            });
        }

        this.userSubscriptions.get(userId).items.add(itemId);
        console.log(`User ${userId} subscribed to item ${itemId}`);
        return true;
    }

    /**
     * Unsubscribe a user from item notifications
     */
    unsubscribeUser(userId, itemId) {
        if (this.monitoredItems.has(itemId)) {
            this.monitoredItems.get(itemId).subscribers.delete(userId);
        }

        if (this.userSubscriptions.has(userId)) {
            this.userSubscriptions.get(userId).items.delete(itemId);
        }

        console.log(`User ${userId} unsubscribed from item ${itemId}`);
        return true;
    }

    /**
     * Check availability of a specific item
     */
    async checkItem(itemId) {
        const item = this.monitoredItems.get(itemId);
        if (!item) {
            throw new Error(`Item ${itemId} not found`);
        }

        try {
            console.log(`Checking availability for: ${item.name}`);
            
            const response = await axios.get(item.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000
            });

            const $ = cheerio.load(response.data);
            
            // Debug: Log page title to verify we got the right page
            const pageTitle = $('title').text().trim();
            console.log(`Page title: ${pageTitle}`);
            
            // Check availability
            const availabilityElement = $(item.selector).first();
            const availabilityText = availabilityElement.text().trim().toLowerCase();
            const wasAvailable = item.isAvailable;
            
            // Debug: Log what we found with the original selector
            console.log(`Original selector "${item.selector}" found: "${availabilityText}"`);
            console.log(`Looking for availability text: "${item.availableText}"`);
            
            // Also check for common availability indicators
            const addToCartButton = $('button:contains("ADD TO CART"), button:contains("კალათაში დამატება"), .add-to-cart').length > 0;
            const checkoutButton = $('button:contains("CHECKOUT"), button:contains("შეკვეთა")').length > 0;
            const onlyLeftText = $('.quantity-message, .stock-message').text().toLowerCase();
            
            // Check for quantity controls (strong indicator of availability)
            const quantityButtons = $('button:contains("Increase quantity"), button:contains("Decrease quantity")').length > 0;
            const quantityInput = $('input[name*="quantity"], input[type="number"]').length > 0;
            
            // Look for any purchase-related buttons/links
            const allButtons = $('button').map((i, el) => $(el).text().trim()).get();
            const buttonTexts = allButtons.join(' ').toLowerCase();
            const hasPurchaseButtons = buttonTexts.includes('add') || buttonTexts.includes('cart') || 
                                     buttonTexts.includes('buy') || buttonTexts.includes('order') ||
                                     buttonTexts.includes('increase') || buttonTexts.includes('decrease');
            
            // Debug: Log button detection
            console.log(`ADD TO CART buttons found: ${addToCartButton}`);
            console.log(`CHECKOUT buttons found: ${checkoutButton}`);
            console.log(`Quantity controls found: ${quantityButtons}`);
            console.log(`Quantity input found: ${quantityInput}`);
            console.log(`Purchase-related button text detected: ${hasPurchaseButtons}`);
            console.log(`Stock message text: "${onlyLeftText}"`);
            console.log(`All buttons on page: ${JSON.stringify(allButtons.slice(0, 10))}...`); // Limit for readability
            
            // Item is available if we find any purchase indicators
            item.isAvailable = availabilityText.includes(item.availableText.toLowerCase()) || 
                              addToCartButton || 
                              checkoutButton ||
                              quantityButtons ||
                              quantityInput ||
                              hasPurchaseButtons ||
                              onlyLeftText.includes('only') ||
                              onlyLeftText.includes('left');
                              
            console.log(`Final availability decision: ${item.isAvailable}`);

            // Check price if selector is provided
            if (item.priceSelector) {
                const priceElement = $(item.priceSelector).first();
                const priceText = priceElement.text().trim();
                const priceMatch = priceText.match(/[\d,]+\.?\d*/);
                if (priceMatch) {
                    item.currentPrice = parseFloat(priceMatch[0].replace(/,/g, ''));
                }
            }

            item.lastChecked = new Date();

            // Send notifications if item became available
            if (item.isAvailable && !wasAvailable) {
                await this.notifySubscribers(item);
            }

            // Also notify if price dropped below threshold
            if (item.maxPrice && item.currentPrice && item.currentPrice <= item.maxPrice) {
                await this.notifySubscribers(item, 'price_alert');
            }

            return {
                itemId: item.id,
                name: item.name,
                isAvailable: item.isAvailable,
                currentPrice: item.currentPrice,
                lastChecked: item.lastChecked,
                url: item.url
            };

        } catch (error) {
            console.error(`Error checking item ${item.name}:`, error.message);
            item.lastChecked = new Date();
            throw error;
        }
    }

    /**
     * Check all monitored items
     */
    async checkAllItems() {
        const results = [];
        
        for (const [itemId] of this.monitoredItems) {
            try {
                const result = await this.checkItem(itemId);
                results.push(result);
                
                // Add delay between requests to be respectful
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                results.push({
                    itemId: itemId,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Notify all subscribers of an item
     */
    async notifySubscribers(item, type = 'availability') {
        for (const userId of item.subscribers) {
            const user = this.userSubscriptions.get(userId);
            if (user) {
                try {
                    const message = type === 'availability' 
                        ? `Good news! "${item.name}" is now available at ${item.url}`
                        : `Price alert! "${item.name}" is now $${item.currentPrice} (below your threshold of $${item.maxPrice}) at ${item.url}`;

                    await this.notificationService.sendNotification(user.contactInfo, {
                        subject: type === 'availability' ? 'Item Available!' : 'Price Alert!',
                        message: message,
                        item: item
                    });
                } catch (error) {
                    console.error(`Failed to notify user ${userId}:`, error.message);
                }
            }
        }
    }

    /**
     * Get all monitored items
     */
    getMonitoredItems() {
        return Array.from(this.monitoredItems.values()).map(item => ({
            id: item.id,
            name: item.name,
            url: item.url,
            isAvailable: item.isAvailable,
            currentPrice: item.currentPrice,
            lastChecked: item.lastChecked,
            subscriberCount: item.subscribers.size
        }));
    }

    /**
     * Get count of monitored items
     */
    getMonitoredItemsCount() {
        return this.monitoredItems.size;
    }

    /**
     * Get user subscriptions
     */
    getUserSubscriptions(userId) {
        const user = this.userSubscriptions.get(userId);
        if (!user) return [];

        return Array.from(user.items).map(itemId => {
            const item = this.monitoredItems.get(itemId);
            return item ? {
                id: item.id,
                name: item.name,
                url: item.url,
                isAvailable: item.isAvailable,
                lastChecked: item.lastChecked
            } : null;
        }).filter(Boolean);
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

module.exports = ItemMonitor;
