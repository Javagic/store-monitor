const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class AIImageService {
    constructor() {
        // Check if API key is available
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey || apiKey === 'your-openai-api-key-here') {
            console.warn('⚠️  OpenAI API key not configured. AI image generation will not work.');
            console.warn('💡 To enable AI features, set OPENAI_API_KEY in your .env file');
            this.openai = null;
        } else {
            this.openai = new OpenAI({
                apiKey: apiKey
            });
            console.log('✅ OpenAI API configured successfully');
        }
        
        // Create directories for generated images
        this.imageDir = path.join(__dirname, '../../public/assets/generated');
        this.ensureDirectoryExists(this.imageDir);
    }

    ensureDirectoryExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    /**
     * Generate an image using OpenAI DALL-E
     * @param {string} prompt - Description of the image to generate
     * @param {object} options - Generation options
     * @returns {Promise<object>} Generated image data
     */
    async generateImage(prompt, options = {}) {
        try {
            // Check if OpenAI is configured
            if (!this.openai) {
                return {
                    success: false,
                    error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.'
                };
            }

            console.log(`🎨 Generating image: "${prompt}"`);
            
            const {
                size = "1024x1024",
                quality = "standard",
                style = "natural",
                n = 1
            } = options;

            const response = await this.openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: n,
                size: size,
                quality: quality,
                style: style
            });

            const imageData = response.data[0];
            const filename = await this.downloadAndSaveImage(imageData.url, prompt);
            
            console.log(`✅ Image generated successfully: ${filename}`);
            
            return {
                success: true,
                imageUrl: imageData.url,
                localPath: `/assets/generated/${filename}`,
                prompt: prompt,
                revisedPrompt: imageData.revised_prompt || prompt,
                filename: filename
            };

        } catch (error) {
            console.error('❌ Error generating image:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Download and save generated image locally
     */
    async downloadAndSaveImage(imageUrl, prompt) {
        try {
            const response = await axios({
                method: 'get',
                url: imageUrl,
                responseType: 'stream'
            });

            // Create filename from prompt
            const sanitizedPrompt = prompt
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50);
            
            const timestamp = Date.now();
            const filename = `${sanitizedPrompt}-${timestamp}.png`;
            const filepath = path.join(this.imageDir, filename);

            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(filename));
                writer.on('error', reject);
            });

        } catch (error) {
            console.error('Error downloading image:', error);
            throw error;
        }
    }

    /**
     * Generate cleaning service specific images
     */
    async generateCleaningImage(serviceType, room = '', style = 'before-after') {
        const prompts = {
            'home-cleaning': {
                'before-after': `Split screen before and after photo of ${room || 'living room'} cleaning: left side messy and dirty, right side spotlessly clean and organized, professional cleaning service result, bright natural lighting, modern home interior`,
                'service': `Professional house cleaner in uniform cleaning ${room || 'a modern home'}, using eco-friendly cleaning products, bright and clean environment, photorealistic style`,
                'result': `Perfectly clean and organized ${room || 'living room'}, sparkling surfaces, everything in place, professional cleaning service result, bright natural lighting`
            },
            'office-cleaning': {
                'before-after': `Split screen before and after office cleaning: left side cluttered messy office, right side clean organized workspace, professional commercial cleaning, bright office lighting`,
                'service': `Professional office cleaner cleaning modern workplace, organized desks, clean floors, bright office environment, commercial cleaning service`,
                'result': `Spotlessly clean modern office space, organized desks, clean floors and windows, professional business environment`
            },
            'deep-cleaning': {
                'before-after': `Extreme before and after deep cleaning transformation: left side very dirty neglected space, right side completely transformed spotless interior, dramatic cleaning difference`,
                'service': `Professional deep cleaning service in action, detailed cleaning of every surface, multiple cleaning tools and products, thorough cleaning process`,
                'result': `Completely transformed space after deep cleaning, every detail spotless, like-new condition, professional cleaning excellence`
            },
            'window-cleaning': {
                'before-after': `Before and after window cleaning: left side dirty streaky windows, right side crystal clear sparkling clean windows, natural light streaming through`,
                'service': `Professional window cleaner cleaning large windows with squeegee, crystal clear results, bright natural lighting`,
                'result': `Crystal clear spotless windows, perfect transparency, natural light flooding through, professional window cleaning result`
            }
        };

        const servicePrompts = prompts[serviceType] || prompts['home-cleaning'];
        const prompt = servicePrompts[style] || servicePrompts['result'];

        return await this.generateImage(prompt, {
            size: "1024x1024",
            quality: "standard",
            style: "natural"
        });
    }

    /**
     * Generate marketing images
     */
    async generateMarketingImage(type, customPrompt = '') {
        const marketingPrompts = {
            'hero-banner': 'Professional cleaning service team in Erix Clean uniforms, modern Tbilisi apartment background, bright and welcoming, cleaning equipment visible, professional photography style',
            'team-photo': 'Friendly professional cleaning team of 3-4 people in matching Erix Clean uniforms, smiling, modern Tbilisi setting, professional corporate photography',
            'equipment': 'Professional cleaning equipment and eco-friendly products arranged beautifully, Erix Clean branding, clean white background, product photography style',
            'testimonial-bg': 'Happy satisfied customer in clean modern home, smiling, bright natural lighting, clean organized space in background',
            'social-media': 'Eye-catching cleaning tips infographic style image, bright colors, modern design, cleaning icons and text space',
            'custom': customPrompt
        };

        const prompt = marketingPrompts[type] || customPrompt;
        
        return await this.generateImage(prompt, {
            size: "1024x1024",
            quality: "hd",
            style: "natural"
        });
    }

    /**
     * Get list of generated images
     */
    getGeneratedImages() {
        try {
            const files = fs.readdirSync(this.imageDir);
            return files
                .filter(file => file.endsWith('.png'))
                .map(file => ({
                    filename: file,
                    path: `/assets/generated/${file}`,
                    created: fs.statSync(path.join(this.imageDir, file)).mtime
                }))
                .sort((a, b) => b.created - a.created);
        } catch (error) {
            console.error('Error reading generated images:', error);
            return [];
        }
    }
}

module.exports = AIImageService;
