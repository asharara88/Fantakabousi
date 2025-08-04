interface Resource {
  id: string;
  type: 'image' | 'component' | 'data' | 'audio';
  url?: string;
  data?: any;
  size: number;
  lastAccessed: number;
  accessCount: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class ResourceManager {
  private static instance: ResourceManager;
  private resources = new Map<string, Resource>();
  private maxMemoryUsage = 100 * 1024 * 1024; // 100MB
  private currentMemoryUsage = 0;
  private cleanupInterval: NodeJS.Timeout | null = null;

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  private constructor() {
    this.startCleanupTimer();
    this.setupMemoryMonitoring();
  }

  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredResources();
    }, 60000); // Every minute
  }

  private setupMemoryMonitoring(): void {
    setInterval(() => {
      if (this.currentMemoryUsage > this.maxMemoryUsage * 0.8) {
        this.aggressiveCleanup();
      }
    }, 30000); // Every 30 seconds
  }

  public addResource(resource: Omit<Resource, 'lastAccessed' | 'accessCount'>): void {
    const fullResource: Resource = {
      ...resource,
      lastAccessed: Date.now(),
      accessCount: 0
    };

    // Remove old resource if exists
    if (this.resources.has(resource.id)) {
      const oldResource = this.resources.get(resource.id)!;
      this.currentMemoryUsage -= oldResource.size;
    }

    // Check if we need to make space
    if (this.currentMemoryUsage + resource.size > this.maxMemoryUsage) {
      this.makeSpace(resource.size);
    }

    this.resources.set(resource.id, fullResource);
    this.currentMemoryUsage += resource.size;
  }

  public getResource(id: string): Resource | null {
    const resource = this.resources.get(id);
    if (resource) {
      resource.lastAccessed = Date.now();
      resource.accessCount++;
      return resource;
    }
    return null;
  }

  public removeResource(id: string): boolean {
    const resource = this.resources.get(id);
    if (resource) {
      this.currentMemoryUsage -= resource.size;
      
      // Cleanup resource data
      if (resource.type === 'image' && resource.url?.startsWith('blob:')) {
        URL.revokeObjectURL(resource.url);
      }
      
      return this.resources.delete(id);
    }
    return false;
  }

  private makeSpace(requiredSize: number): void {
    const sortedResources = Array.from(this.resources.entries())
      .filter(([, resource]) => resource.priority !== 'critical')
      .sort(([, a], [, b]) => {
        // Sort by priority first, then by last accessed time
        const priorityWeight = { low: 1, medium: 2, high: 3, critical: 4 };
        const priorityDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.lastAccessed - b.lastAccessed;
      });

    let freedSpace = 0;
    for (const [id, resource] of sortedResources) {
      if (freedSpace >= requiredSize) break;
      
      this.removeResource(id);
      freedSpace += resource.size;
    }
  }

  private cleanupExpiredResources(): void {
    const now = Date.now();
    const expiredIds: string[] = [];

    for (const [id, resource] of this.resources.entries()) {
      const maxAge = this.getMaxAge(resource.priority);
      if (now - resource.lastAccessed > maxAge) {
        expiredIds.push(id);
      }
    }

    expiredIds.forEach(id => this.removeResource(id));
  }

  private getMaxAge(priority: Resource['priority']): number {
    switch (priority) {
      case 'critical': return 24 * 60 * 60 * 1000; // 24 hours
      case 'high': return 4 * 60 * 60 * 1000; // 4 hours
      case 'medium': return 2 * 60 * 60 * 1000; // 2 hours
      case 'low': return 30 * 60 * 1000; // 30 minutes
    }
  }

  private aggressiveCleanup(): void {
    console.log('Performing aggressive resource cleanup...');
    
    // Remove all low priority resources
    const lowPriorityIds = Array.from(this.resources.entries())
      .filter(([, resource]) => resource.priority === 'low')
      .map(([id]) => id);
    
    lowPriorityIds.forEach(id => this.removeResource(id));

    // If still over limit, remove medium priority resources
    if (this.currentMemoryUsage > this.maxMemoryUsage * 0.7) {
      const mediumPriorityIds = Array.from(this.resources.entries())
        .filter(([, resource]) => resource.priority === 'medium')
        .map(([id]) => id);
      
      mediumPriorityIds.forEach(id => this.removeResource(id));
    }
  }

  public getStats() {
    return {
      totalResources: this.resources.size,
      memoryUsage: this.currentMemoryUsage,
      maxMemoryUsage: this.maxMemoryUsage,
      usagePercentage: (this.currentMemoryUsage / this.maxMemoryUsage) * 100,
      resourcesByType: this.getResourcesByType(),
      resourcesByPriority: this.getResourcesByPriority()
    };
  }

  private getResourcesByType() {
    const types = { image: 0, component: 0, data: 0, audio: 0 };
    for (const resource of this.resources.values()) {
      types[resource.type]++;
    }
    return types;
  }

  private getResourcesByPriority() {
    const priorities = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const resource of this.resources.values()) {
      priorities[resource.priority]++;
    }
    return priorities;
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    // Cleanup all resources
    for (const [id] of this.resources.entries()) {
      this.removeResource(id);
    }
    
    this.resources.clear();
    this.currentMemoryUsage = 0;
  }
}

export const resourceManager = ResourceManager.getInstance();