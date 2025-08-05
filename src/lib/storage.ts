// Local storage utilities with error handling

class StorageManager {
  private prefix = 'biowell-';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  public set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: Date.now(),
      });
      localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  public get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;

      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  public remove(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }

  public clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.prefix)
      );
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  public has(key: string): boolean {
    try {
      return localStorage.getItem(this.getKey(key)) !== null;
    } catch (error) {
      return false;
    }
  }

  public getWithExpiry<T>(key: string, ttl: number): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();

      if (now - parsed.timestamp > ttl) {
        this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Failed to read with expiry from localStorage:', error);
      return null;
    }
  }

  public setWithExpiry<T>(key: string, value: T, ttl: number): boolean {
    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        ttl,
      });
      localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (error) {
      console.error('Failed to save with expiry to localStorage:', error);
      return false;
    }
  }

  public getSize(): number {
    try {
      let total = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          total += localStorage.getItem(key)?.length || 0;
        }
      });
      return total;
    } catch (error) {
      return 0;
    }
  }

  public cleanup(): number {
    try {
      let cleaned = 0;
      const now = Date.now();
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const parsed = JSON.parse(item);
              if (parsed.ttl && (now - parsed.timestamp > parsed.ttl)) {
                localStorage.removeItem(key);
                cleaned++;
              }
            }
          } catch {
            // Remove corrupted items
            localStorage.removeItem(key);
            cleaned++;
          }
        }
      });
      
      return cleaned;
    } catch (error) {
      console.error('Failed to cleanup localStorage:', error);
      return 0;
    }
  }
}

// Session storage manager
class SessionStorageManager {
  private prefix = 'biowell-session-';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  public set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: Date.now(),
      });
      sessionStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
      return false;
    }
  }

  public get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(this.getKey(key));
      if (!item) return null;

      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('Failed to read from sessionStorage:', error);
      return null;
    }
  }

  public remove(key: string): boolean {
    try {
      sessionStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error);
      return false;
    }
  }

  public clear(): boolean {
    try {
      const keys = Object.keys(sessionStorage).filter(key => 
        key.startsWith(this.prefix)
      );
      keys.forEach(key => sessionStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
      return false;
    }
  }
}

// Export singleton instances
export const storage = new StorageManager();
export const sessionStore = new SessionStorageManager();

// Convenience functions
export const saveUserPreferences = (preferences: any): boolean => {
  return storage.set('user-preferences', preferences);
};

export const getUserPreferences = (): any => {
  return storage.get('user-preferences');
};

export const saveTheme = (theme: string): boolean => {
  return storage.set('theme', theme);
};

export const getTheme = (): string | null => {
  return storage.get('theme');
};

export const saveAccessibilitySettings = (settings: any): boolean => {
  return storage.set('accessibility-settings', settings);
};

export const getAccessibilitySettings = (): any => {
  return storage.get('accessibility-settings');
};

export const saveChatSession = (sessionId: string, messages: any[]): boolean => {
  return sessionStore.set(`chat-${sessionId}`, messages);
};

export const getChatSession = (sessionId: string): any[] | null => {
  return sessionStore.get(`chat-${sessionId}`);
};