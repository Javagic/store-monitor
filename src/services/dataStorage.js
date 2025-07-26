const fs = require('fs');
const path = require('path');

class DataStorage {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.quotesFile = path.join(this.dataDir, 'quotes.json');
        this.contactsFile = path.join(this.dataDir, 'contacts.json');
        this.schedulesFile = path.join(this.dataDir, 'schedules.json');
        
        // Create data directory if it doesn't exist
        this.ensureDirectoryExists(this.dataDir);
        
        // Initialize data files
        this.initializeFile(this.quotesFile, []);
        this.initializeFile(this.contactsFile, []);
        this.initializeFile(this.schedulesFile, []);
    }

    ensureDirectoryExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    initializeFile(filePath, defaultData) {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
        }
    }

    // Save cleaning quote request
    saveQuote(quoteData) {
        try {
            const quotes = this.loadData(this.quotesFile);
            const newQuote = {
                id: `QUOTE-${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: 'new',
                ...quoteData
            };
            
            quotes.push(newQuote);
            this.saveData(this.quotesFile, quotes);
            
            console.log(`💾 Quote saved: ${newQuote.id}`);
            return newQuote;
        } catch (error) {
            console.error('Error saving quote:', error);
            throw error;
        }
    }

    // Save contact form submission
    saveContact(contactData) {
        try {
            const contacts = this.loadData(this.contactsFile);
            const newContact = {
                id: `CONTACT-${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: 'new',
                ...contactData
            };
            
            contacts.push(newContact);
            this.saveData(this.contactsFile, contacts);
            
            console.log(`💾 Contact saved: ${newContact.id}`);
            return newContact;
        } catch (error) {
            console.error('Error saving contact:', error);
            throw error;
        }
    }

    // Save schedule data
    saveSchedule(scheduleData) {
        try {
            const schedules = this.loadData(this.schedulesFile);
            const newSchedule = {
                id: `SCHEDULE-${Date.now()}`,
                timestamp: new Date().toISOString(),
                ...scheduleData
            };
            
            schedules.push(newSchedule);
            this.saveData(this.schedulesFile, schedules);
            
            console.log(`💾 Schedule saved: ${newSchedule.id}`);
            return newSchedule;
        } catch (error) {
            console.error('Error saving schedule:', error);
            throw error;
        }
    }

    // Get all quotes
    getQuotes() {
        return this.loadData(this.quotesFile);
    }

    // Get all contacts
    getContacts() {
        return this.loadData(this.contactsFile);
    }

    // Get all schedules
    getSchedules() {
        return this.loadData(this.schedulesFile);
    }

    // Update quote status
    updateQuoteStatus(quoteId, status) {
        try {
            const quotes = this.loadData(this.quotesFile);
            const quote = quotes.find(q => q.id === quoteId);
            
            if (quote) {
                quote.status = status;
                quote.lastUpdated = new Date().toISOString();
                this.saveData(this.quotesFile, quotes);
                return quote;
            }
            
            return null;
        } catch (error) {
            console.error('Error updating quote status:', error);
            throw error;
        }
    }

    // Private helper methods
    loadData(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error loading data from ${filePath}:`, error);
            return [];
        }
    }

    saveData(filePath, data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error saving data to ${filePath}:`, error);
            throw error;
        }
    }

    // Get statistics
    getStats() {
        const quotes = this.getQuotes();
        const contacts = this.getContacts();
        const schedules = this.getSchedules();
        
        return {
            totalQuotes: quotes.length,
            newQuotes: quotes.filter(q => q.status === 'new').length,
            totalContacts: contacts.length,
            totalSchedules: schedules.length,
            recentQuotes: quotes.slice(-5).reverse()
        };
    }
}

module.exports = DataStorage;
