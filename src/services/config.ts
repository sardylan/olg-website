interface AppConfig {
    API_PREFIX: string;
    IMAGES_PREFIX: string;
}

let configCache: AppConfig | null = null;

export async function loadConfig(): Promise<AppConfig> {
    if (configCache) {
        return configCache;
    }

    try {
        const response = await fetch('/config.json');
        if (!response.ok) {
            throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
        }
        const loadedConfig = await response.json();
        configCache = {
            API_PREFIX: loadedConfig.API_PREFIX.replace(/\/$/, ''),
            IMAGES_PREFIX: loadedConfig.IMAGES_PREFIX.replace(/\/$/, ''),
        };
    } catch (error) {
        console.error('Error loading config, using defaults:', error);
        configCache = {
            API_PREFIX: '/api/public',
            IMAGES_PREFIX: '/usermaps_images',
        };
    }

    return configCache as AppConfig;
}

export function getConfig(): AppConfig {
    if (!configCache) {
        throw new Error('Config not loaded yet. Call loadConfig() first.');
    }
    return configCache;
}

// For backward compatibility - this will be populated after loadConfig() is called
export const config = new Proxy({} as AppConfig, {
    get(_target, prop) {
        if (!configCache) {
            throw new Error('Config not loaded yet. Call loadConfig() first in main.ts');
        }
        return configCache[prop as keyof AppConfig];
    }
});

