/**
 * Represents a Call of Duty map
 * Named "CodMap" to avoid conflicts with JavaScript's built-in Map
 */
export interface CodMap {
    /** Unique identifier/tag for the map */
    tag: string;
    /** Display name of the map */
    name: string;
    /** Whether the map is currently active/available */
    active: boolean;
}

