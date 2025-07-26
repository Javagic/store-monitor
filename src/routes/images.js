const express = require('express');
const AIImageService = require('../services/aiImageService');

function createImageRoutes() {
    const router = express.Router();
    const aiImageService = new AIImageService();

    // Generate cleaning service image
    router.post('/generate/cleaning', async (req, res) => {
        try {
            const { serviceType, room, style } = req.body;

            if (!serviceType) {
                return res.status(400).json({
                    success: false,
                    error: 'Service type is required'
                });
            }

            console.log(`🎨 Generating cleaning image: ${serviceType} (${style || 'default'})`);

            const result = await aiImageService.generateCleaningImage(
                serviceType, 
                room || '', 
                style || 'result'
            );

            res.json(result);

        } catch (error) {
            console.error('Error in cleaning image generation:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate cleaning image'
            });
        }
    });

    // Generate marketing image
    router.post('/generate/marketing', async (req, res) => {
        try {
            const { type, customPrompt } = req.body;

            if (!type && !customPrompt) {
                return res.status(400).json({
                    success: false,
                    error: 'Type or custom prompt is required'
                });
            }

            console.log(`🎨 Generating marketing image: ${type || 'custom'}`);

            const result = await aiImageService.generateMarketingImage(
                type || 'custom', 
                customPrompt || ''
            );

            res.json(result);

        } catch (error) {
            console.error('Error in marketing image generation:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate marketing image'
            });
        }
    });

    // Generate custom image
    router.post('/generate/custom', async (req, res) => {
        try {
            const { prompt, size, quality, style } = req.body;

            if (!prompt) {
                return res.status(400).json({
                    success: false,
                    error: 'Prompt is required'
                });
            }

            console.log(`🎨 Generating custom image: "${prompt}"`);

            const result = await aiImageService.generateImage(prompt, {
                size: size || "1024x1024",
                quality: quality || "standard",
                style: style || "natural"
            });

            res.json(result);

        } catch (error) {
            console.error('Error in custom image generation:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate custom image'
            });
        }
    });

    // Get list of generated images
    router.get('/gallery', (req, res) => {
        try {
            const images = aiImageService.getGeneratedImages();
            res.json({
                success: true,
                images: images,
                count: images.length
            });
        } catch (error) {
            console.error('Error getting image gallery:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get image gallery'
            });
        }
    });

    // Get image generation status/info
    router.get('/info', (req, res) => {
        res.json({
            success: true,
            service: 'OpenAI DALL-E 3',
            supportedSizes: ['1024x1024', '1024x1792', '1792x1024'],
            supportedQualities: ['standard', 'hd'],
            supportedStyles: ['natural', 'vivid'],
            cleaningServices: ['home-cleaning', 'office-cleaning', 'deep-cleaning', 'window-cleaning'],
            styleOptions: ['before-after', 'service', 'result'],
            marketingTypes: ['hero-banner', 'team-photo', 'equipment', 'testimonial-bg', 'social-media', 'custom']
        });
    });

    return router;
}

module.exports = createImageRoutes;
