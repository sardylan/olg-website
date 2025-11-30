import { config } from './config';
import type { CodMap, SetGametypeMapRequest, Gametype } from '../models';

function computeUrl(endpoint: string): string {
    return `${config.API_PREFIX}${endpoint}`;
}

export const api = {
    async fetchMaps(): Promise<CodMap[]> {
        try {
            const response = await fetch(computeUrl('/v1/maps'));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} `);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch maps:', error);
            throw error;
        }
    },

    async setGametypeMap(gametype: Gametype, map: string): Promise<void> {
        try {
            const requestBody: SetGametypeMapRequest = {
                gametype: gametype,
                map: map,
            };

            const response = await fetch(computeUrl('/v1/server/gametype_map'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} `);
            }
        } catch (error) {
            console.error('Failed to set gametype and map:', error);
            throw error;
        }
    },

    async mapRestart(): Promise<void> {
        try {
            const response = await fetch(computeUrl('/v1/server/map_restart'));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} `);
            }
        } catch (error) {
            console.error('Failed to restart map:', error);
            throw error;
        }
    },

    async fastRestart(): Promise<void> {
        try {
            const response = await fetch(computeUrl('/v1/server/fast_restart'));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} `);
            }
        } catch (error) {
            console.error('Failed to fast restart:', error);
            throw error;
        }
    },
};

