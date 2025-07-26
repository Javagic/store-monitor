/**
 * Sample item configurations for popular stores
 * These are examples - you'll need to verify selectors work for specific items
 */

const sampleConfigurations = {
  // Amazon
  amazon: {
    name: "Sample Amazon Product",
    url: "https://amazon.com/dp/PRODUCT-ID",
    selector: "#availability span",
    availableText: "In Stock",
    priceSelector: ".a-price-whole",
    notes: "Amazon frequently changes their selectors"
  },

  // Best Buy
  bestbuy: {
    name: "Sample Best Buy Product", 
    url: "https://bestbuy.com/site/product/PRODUCT-ID.p",
    selector: ".fulfillment-add-to-cart-button",
    availableText: "Add to Cart",
    priceSelector: ".pricing-price__range .sr-only",
    notes: "Look for 'Add to Cart' button availability"
  },

  // Target
  target: {
    name: "Sample Target Product",
    url: "https://target.com/p/PRODUCT-ID",
    selector: "[data-test='orderPickupButton'], [data-test='shipItButton']",
    availableText: "Add to cart",
    priceSelector: "[data-test='product-price']",
    notes: "Check for pickup or shipping buttons"
  },

  // Walmart
  walmart: {
    name: "Sample Walmart Product",
    url: "https://walmart.com/ip/PRODUCT-ID",
    selector: "[data-automation-id='add-to-cart-button']",
    availableText: "Add to cart",
    priceSelector: "[data-automation-id='product-price']",
    notes: "Look for add to cart button"
  },

  // Newegg
  newegg: {
    name: "Sample Newegg Product",
    url: "https://newegg.com/p/PRODUCT-ID",
    selector: ".product-buy-box .product-inventory",
    availableText: "In stock",
    priceSelector: ".price-current",
    notes: "Tech products, check inventory status"
  },

  // B&H Photo
  bhphoto: {
    name: "Sample B&H Product",
    url: "https://bhphotovideo.com/c/product/PRODUCT-ID",
    selector: ".availability",
    availableText: "In Stock",
    priceSelector: "[data-selenium='productPrice']",
    notes: "Camera and tech equipment"
  },

  // Generic e-commerce patterns
  generic: {
    name: "Generic Store Product",
    url: "https://store.example.com/product-page",
    selector: ".availability, .stock-status, .add-to-cart",
    availableText: "In Stock",
    priceSelector: ".price, .cost, .amount",
    notes: "Common patterns for most stores"
  }
};

/**
 * Common availability text patterns
 */
const commonAvailabilityTexts = [
  "In Stock",
  "Available",
  "Add to Cart",
  "Add to Basket", 
  "Buy Now",
  "In stock",
  "Available now",
  "Ready to ship",
  "Ships today"
];

/**
 * Common unavailability text patterns  
 */
const commonUnavailabilityTexts = [
  "Out of Stock",
  "Unavailable",
  "Sold Out", 
  "Coming Soon",
  "Pre-order",
  "Notify me",
  "Out of stock",
  "Currently unavailable",
  "Temporarily out of stock"
];

/**
 * Common CSS selectors for different elements
 */
const commonSelectors = {
  availability: [
    ".availability",
    ".stock-status", 
    ".inventory",
    "#availability",
    "[data-testid='availability']",
    ".add-to-cart",
    ".buy-button"
  ],
  
  price: [
    ".price",
    ".cost",
    ".amount",
    ".price-current",
    "#price",
    "[data-testid='price']",
    ".price-box .price"
  ],

  buttons: [
    ".add-to-cart",
    ".buy-now", 
    ".add-to-basket",
    "#add-to-cart-button",
    "[data-testid='add-to-cart']"
  ]
};

module.exports = {
  sampleConfigurations,
  commonAvailabilityTexts,
  commonUnavailabilityTexts,
  commonSelectors
};
