#!/usr/bin/env node

/**
 * Generate config.json from environment variables
 * This script reads environment variables and generates a config.json file
 * that will be placed in the public directory during build
 */

import {mkdirSync, writeFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default values
const defaults = {
    API_PREFIX: '/api/public',
    IMAGES_PREFIX: '/usermaps_images'
};

// Read from environment variables with fallback to defaults
const config = {
    API_PREFIX: process.env.VITE_API_PREFIX || defaults.API_PREFIX,
    IMAGES_PREFIX: process.env.VITE_IMAGES_PREFIX || defaults.IMAGES_PREFIX,
};

// Path to public directory
const publicDir = join(__dirname, '..', 'public');
const configPath = join(publicDir, 'config.json');

try {
    // Ensure public directory exists
    mkdirSync(publicDir, {recursive: true});

    // Write config.json
    writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log('✅ Generated config.json with the following values:');
    console.log(JSON.stringify(config, null, 2));
} catch (error) {
    console.error('❌ Failed to generate config.json:', error);
    process.exit(1);
}

