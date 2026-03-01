/**
 * Safe wrapper for LocalStorage to prevent crashes on corrupted data.
 */
export const SafeStorage = {
    get: <T>(key: string, defaultValue: T): T => {
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Error reading from LocalStorage for key "${key}":`, error);
            return defaultValue;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving to LocalStorage for key "${key}":`, error);
        }
    }
};
