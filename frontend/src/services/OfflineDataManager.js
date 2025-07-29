// Offline Data Manager for AgroMind Platform
// Handles offline data storage, synchronization, and conflict resolution

class OfflineDataManager {
  constructor() {
    this.dbName = 'AgroMindOfflineDB';
    this.dbVersion = 1;
    this.db = null;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.conflictQueue = [];
    this.syncInProgress = false;
    this.lastSyncTimestamp = null;
    
    // Store configurations
    this.stores = {
      crops: { keyPath: 'id', autoIncrement: false },
      iotData: { keyPath: 'id', autoIncrement: false },
      weatherData: { keyPath: 'id', autoIncrement: false },
      marketData: { keyPath: 'id', autoIncrement: false },
      userActions: { keyPath: 'id', autoIncrement: true },
      syncQueue: { keyPath: 'id', autoIncrement: true },
      conflicts: { keyPath: 'id', autoIncrement: true },
      settings: { keyPath: 'key', autoIncrement: false },
      chatMessages: { keyPath: 'id', autoIncrement: false },
      communityPosts: { keyPath: 'id', autoIncrement: false },
      diagnoses: { keyPath: 'id', autoIncrement: false },
      farmPlans: { keyPath: 'id', autoIncrement: false }
    };

    this.initialize();
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  async initialize() {
    try {
      await this.openDatabase();
      this.setupEventListeners();
      this.loadSyncQueue();
      this.startPeriodicSync();
      
      console.log('Offline Data Manager initialized');
    } catch (error) {
      console.error('Failed to initialize Offline Data Manager:', error);
    }
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        Object.entries(this.stores).forEach(([storeName, config]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, config);
            
            // Add indices based on store type
            this.createIndices(store, storeName);
          }
        });
      };
    });
  }

  createIndices(store, storeName) {
    switch (storeName) {
      case 'crops':
        store.createIndex('farmId', 'farmId', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        break;
      case 'iotData':
        store.createIndex('deviceId', 'deviceId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('sensorType', 'sensorType', { unique: false });
        break;
      case 'weatherData':
        store.createIndex('location', 'location', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        break;
      case 'marketData':
        store.createIndex('cropType', 'cropType', { unique: false });
        store.createIndex('location', 'location', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        break;
      case 'userActions':
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
        break;
      case 'chatMessages':
        store.createIndex('conversationId', 'conversationId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
        break;
      case 'communityPosts':
        store.createIndex('authorId', 'authorId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
        break;
    }
  }

  setupEventListeners() {
    // Network status changes
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Connection restored, starting sync...');
      this.syncAllData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Connection lost, switching to offline mode');
    });

    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncAllData();
      }
    });
  }

  // =============================================================================
  // DATA STORAGE OPERATIONS
  // =============================================================================

  async storeData(storeName, data, options = {}) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    // Add metadata
    const enrichedData = {
      ...data,
      updatedAt: Date.now(),
      synced: this.isOnline,
      offline: !this.isOnline,
      version: data.version ? data.version + 1 : 1
    };

    try {
      const result = await this.promisifyRequest(store.put(enrichedData));
      
      // Queue for sync if offline or explicit sync requested
      if (!this.isOnline || options.requiresSync) {
        await this.queueForSync(storeName, 'update', enrichedData);
      }

      return result;
    } catch (error) {
      console.error(`Failed to store data in ${storeName}:`, error);
      throw error;
    }
  }

  async getData(storeName, key) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    try {
      return await this.promisifyRequest(store.get(key));
    } catch (error) {
      console.error(`Failed to get data from ${storeName}:`, error);
      throw error;
    }
  }

  async getAllData(storeName, filter = null) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    try {
      const allData = await this.promisifyRequest(store.getAll());
      
      if (filter) {
        return allData.filter(filter);
      }
      
      return allData;
    } catch (error) {
      console.error(`Failed to get all data from ${storeName}:`, error);
      throw error;
    }
  }

  async queryData(storeName, indexName, query) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);

    try {
      if (typeof query === 'object' && query.range) {
        const range = IDBKeyRange.bound(query.range.lower, query.range.upper);
        return await this.promisifyRequest(index.getAll(range));
      } else {
        return await this.promisifyRequest(index.getAll(query));
      }
    } catch (error) {
      console.error(`Failed to query data from ${storeName}:`, error);
      throw error;
    }
  }

  async deleteData(storeName, key, options = {}) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    try {
      await this.promisifyRequest(store.delete(key));
      
      // Queue deletion for sync if needed
      if (!this.isOnline || options.requiresSync) {
        await this.queueForSync(storeName, 'delete', { id: key });
      }
    } catch (error) {
      console.error(`Failed to delete data from ${storeName}:`, error);
      throw error;
    }
  }

  // =============================================================================
  // CROP DATA MANAGEMENT
  // =============================================================================

  async storeCropData(cropData) {
    return this.storeData('crops', {
      ...cropData,
      localId: cropData.localId || this.generateLocalId(),
      lastModified: Date.now()
    });
  }

  async getCropData(farmId = null) {
    if (farmId) {
      return this.queryData('crops', 'farmId', farmId);
    }
    return this.getAllData('crops');
  }

  async updateCropStage(cropId, newStage, notes = '') {
    const crop = await this.getData('crops', cropId);
    if (crop) {
      const updatedCrop = {
        ...crop,
        currentStage: newStage,
        stageHistory: [
          ...(crop.stageHistory || []),
          {
            stage: newStage,
            timestamp: Date.now(),
            notes
          }
        ]
      };
      return this.storeData('crops', updatedCrop, { requiresSync: true });
    }
    throw new Error('Crop not found');
  }

  // =============================================================================
  // IOT DATA MANAGEMENT
  // =============================================================================

  async storeIoTData(sensorData) {
    return this.storeData('iotData', {
      ...sensorData,
      id: `${sensorData.deviceId}_${sensorData.timestamp}`,
      localTimestamp: Date.now()
    });
  }

  async getIoTData(deviceId, timeRange = null) {
    let data = await this.queryData('iotData', 'deviceId', deviceId);
    
    if (timeRange) {
      data = data.filter(reading => 
        reading.timestamp >= timeRange.start && 
        reading.timestamp <= timeRange.end
      );
    }
    
    return data.sort((a, b) => b.timestamp - a.timestamp);
  }

  async getLatestIoTReading(deviceId) {
    const readings = await this.getIoTData(deviceId);
    return readings.length > 0 ? readings[0] : null;
  }

  // =============================================================================
  // WEATHER DATA MANAGEMENT
  // =============================================================================

  async storeWeatherData(weatherData) {
    return this.storeData('weatherData', {
      ...weatherData,
      id: `${weatherData.location}_${weatherData.timestamp}`,
      cachedAt: Date.now()
    });
  }

  async getWeatherData(location, maxAge = 3600000) { // 1 hour default
    const allWeather = await this.queryData('weatherData', 'location', location);
    const recent = allWeather.filter(data => 
      Date.now() - data.cachedAt < maxAge
    );
    
    return recent.sort((a, b) => b.timestamp - a.timestamp);
  }

  // =============================================================================
  // MARKET DATA MANAGEMENT
  // =============================================================================

  async storeMarketData(marketData) {
    return this.storeData('marketData', {
      ...marketData,
      id: `${marketData.cropType}_${marketData.location}_${marketData.timestamp}`,
      cachedAt: Date.now()
    });
  }

  async getMarketData(cropType, location = null) {
    if (location) {
      const allData = await this.getAllData('marketData');
      return allData.filter(data => 
        data.cropType === cropType && data.location === location
      ).sort((a, b) => b.timestamp - a.timestamp);
    }
    
    return this.queryData('marketData', 'cropType', cropType);
  }

  // =============================================================================
  // CHAT DATA MANAGEMENT
  // =============================================================================

  async storeChatMessage(messageData) {
    return this.storeData('chatMessages', {
      ...messageData,
      localTimestamp: Date.now(),
      synced: false
    }, { requiresSync: true });
  }

  async getChatMessages(conversationId, limit = 50) {
    const allMessages = await this.queryData('chatMessages', 'conversationId', conversationId);
    return allMessages
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // =============================================================================
  // COMMUNITY DATA MANAGEMENT
  // =============================================================================

  async storeCommunityPost(postData) {
    return this.storeData('communityPosts', {
      ...postData,
      localId: postData.localId || this.generateLocalId(),
      synced: false
    }, { requiresSync: true });
  }

  async getCommunityPosts(authorId = null, limit = 20) {
    let posts;
    if (authorId) {
      posts = await this.queryData('communityPosts', 'authorId', authorId);
    } else {
      posts = await this.getAllData('communityPosts');
    }
    
    return posts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // =============================================================================
  // SYNC QUEUE MANAGEMENT
  // =============================================================================

  async queueForSync(storeName, operation, data) {
    const syncItem = {
      storeName,
      operation,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };

    await this.storeData('syncQueue', syncItem);
    this.syncQueue.push(syncItem);
  }

  async loadSyncQueue() {
    this.syncQueue = await this.getAllData('syncQueue');
    console.log(`Loaded ${this.syncQueue.length} items for sync`);
  }

  async processSyncQueue() {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      for (const item of this.syncQueue) {
        try {
          await this.syncItem(item);
          await this.deleteData('syncQueue', item.id);
          this.syncQueue = this.syncQueue.filter(i => i.id !== item.id);
        } catch (error) {
          console.error('Sync item failed:', error);
          
          item.retryCount++;
          if (item.retryCount >= item.maxRetries) {
            console.error('Max retries reached for sync item:', item);
            await this.moveToConflictQueue(item, error);
            await this.deleteData('syncQueue', item.id);
            this.syncQueue = this.syncQueue.filter(i => i.id !== item.id);
          } else {
            await this.storeData('syncQueue', item);
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  async syncItem(item) {
    const { storeName, operation, data } = item;
    
    let endpoint;
    let method;
    
    switch (storeName) {
      case 'crops':
        endpoint = `/api/crops${operation === 'delete' ? `/${data.id}` : ''}`;
        method = operation === 'delete' ? 'DELETE' : 'PUT';
        break;
      case 'chatMessages':
        endpoint = '/api/chat/messages';
        method = 'POST';
        break;
      case 'communityPosts':
        endpoint = '/api/community/posts';
        method = 'POST';
        break;
      default:
        throw new Error(`Unknown sync store: ${storeName}`);
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: operation !== 'delete' ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Update local data with server response
    if (operation !== 'delete' && result.id) {
      const updatedData = { ...data, ...result, synced: true };
      await this.storeData(storeName, updatedData);
    }
  }

  // =============================================================================
  // CONFLICT RESOLUTION
  // =============================================================================

  async moveToConflictQueue(syncItem, error) {
    const conflictItem = {
      ...syncItem,
      error: error.message,
      timestamp: Date.now()
    };
    
    await this.storeData('conflicts', conflictItem);
    this.conflictQueue.push(conflictItem);
  }

  async getConflicts() {
    return this.getAllData('conflicts');
  }

  async resolveConflict(conflictId, resolution) {
    const conflict = await this.getData('conflicts', conflictId);
    if (!conflict) {
      throw new Error('Conflict not found');
    }

    switch (resolution.strategy) {
      case 'use_local':
        await this.queueForSync(conflict.storeName, conflict.operation, conflict.data);
        break;
      case 'use_remote':
        // Fetch remote data and update local
        await this.fetchAndUpdateFromRemote(conflict);
        break;
      case 'merge':
        // Implement merge logic based on data type
        await this.mergeConflictData(conflict, resolution.mergedData);
        break;
    }

    await this.deleteData('conflicts', conflictId);
    this.conflictQueue = this.conflictQueue.filter(c => c.id !== conflictId);
  }

  async fetchAndUpdateFromRemote(conflict) {
    // Implementation depends on the specific data type and API
    console.log('Fetching remote data for conflict resolution:', conflict);
  }

  async mergeConflictData(conflict, mergedData) {
    await this.storeData(conflict.storeName, mergedData, { requiresSync: true });
  }

  // =============================================================================
  // PERIODIC SYNC
  // =============================================================================

  startPeriodicSync() {
    // Sync every 5 minutes when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncAllData();
      }
    }, 5 * 60 * 1000);
  }

  async syncAllData() {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }

    console.log('Starting full data sync...');
    
    try {
      await this.processSyncQueue();
      await this.syncCriticalData();
      
      this.lastSyncTimestamp = Date.now();
      await this.storeData('settings', {
        key: 'lastSyncTimestamp',
        value: this.lastSyncTimestamp
      });
      
      console.log('Full data sync completed');
    } catch (error) {
      console.error('Full data sync failed:', error);
    }
  }

  async syncCriticalData() {
    // Sync critical data that should always be up to date
    const criticalEndpoints = [
      { endpoint: '/api/weather/current', store: 'weatherData' },
      { endpoint: '/api/iot/alerts', store: 'iotData' },
      { endpoint: '/api/market/latest', store: 'marketData' }
    ];

    for (const { endpoint, store } of criticalEndpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            for (const item of data) {
              await this.storeData(store, item);
            }
          } else {
            await this.storeData(store, data);
          }
        }
      } catch (error) {
        console.error(`Failed to sync ${endpoint}:`, error);
      }
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  generateLocalId() {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage,
        quota: estimate.quota,
        percentage: (estimate.usage / estimate.quota) * 100
      };
    }
    return null;
  }

  async clearOldData(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days
    const cutoff = Date.now() - maxAge;
    
    for (const storeName of Object.keys(this.stores)) {
      if (storeName === 'settings' || storeName === 'syncQueue') continue;
      
      const allData = await this.getAllData(storeName);
      const oldData = allData.filter(item => 
        item.updatedAt && item.updatedAt < cutoff
      );
      
      for (const item of oldData) {
        await this.deleteData(storeName, item.id);
      }
      
      console.log(`Cleared ${oldData.length} old items from ${storeName}`);
    }
  }

  async exportData() {
    const exportData = {};
    
    for (const storeName of Object.keys(this.stores)) {
      exportData[storeName] = await this.getAllData(storeName);
    }
    
    return exportData;
  }

  async importData(importData) {
    for (const [storeName, data] of Object.entries(importData)) {
      if (this.stores[storeName]) {
        for (const item of data) {
          await this.storeData(storeName, item);
        }
      }
    }
  }
}

// Singleton instance
const offlineDataManager = new OfflineDataManager();

export default offlineDataManager;
