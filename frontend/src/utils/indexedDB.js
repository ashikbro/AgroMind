/**
 * Advanced IndexedDB Manager for Offline Farm Data Storage
 * Provides robust offline capabilities with data synchronization
 */

class IndexedDBManager {
  constructor() {
    this.dbName = 'AgroMindDB';
    this.dbVersion = 3;
    this.db = null;
    this.stores = {
      farmData: 'farmData',
      sensorData: 'sensorData',
      marketPrices: 'marketPrices',
      analytics: 'analytics',
      alerts: 'alerts',
      crops: 'crops',
      diagnoses: 'diagnoses',
      syncQueue: 'syncQueue',
      userPreferences: 'userPreferences',
      offlineActions: 'offlineActions'
    };
  }

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        this.createStores(db);
      };
    });
  }

  // Create object stores
  createStores(db) {
    // Farm Data Store
    if (!db.objectStoreNames.contains(this.stores.farmData)) {
      const farmStore = db.createObjectStore(this.stores.farmData, { keyPath: 'id' });
      farmStore.createIndex('userId', 'userId', { unique: false });
      farmStore.createIndex('createdAt', 'createdAt', { unique: false });
    }

    // Sensor Data Store
    if (!db.objectStoreNames.contains(this.stores.sensorData)) {
      const sensorStore = db.createObjectStore(this.stores.sensorData, { keyPath: 'id', autoIncrement: true });
      sensorStore.createIndex('farmId', 'farmId', { unique: false });
      sensorStore.createIndex('sensorType', 'sensorType', { unique: false });
      sensorStore.createIndex('timestamp', 'timestamp', { unique: false });
    }

    // Market Prices Store
    if (!db.objectStoreNames.contains(this.stores.marketPrices)) {
      const marketStore = db.createObjectStore(this.stores.marketPrices, { keyPath: 'id', autoIncrement: true });
      marketStore.createIndex('crop', 'crop', { unique: false });
      marketStore.createIndex('timestamp', 'timestamp', { unique: false });
      marketStore.createIndex('region', 'region', { unique: false });
    }

    // Analytics Store
    if (!db.objectStoreNames.contains(this.stores.analytics)) {
      const analyticsStore = db.createObjectStore(this.stores.analytics, { keyPath: 'id', autoIncrement: true });
      analyticsStore.createIndex('farmId', 'farmId', { unique: false });
      analyticsStore.createIndex('reportType', 'reportType', { unique: false });
      analyticsStore.createIndex('timeframe', 'timeframe', { unique: false });
    }

    // Alerts Store
    if (!db.objectStoreNames.contains(this.stores.alerts)) {
      const alertsStore = db.createObjectStore(this.stores.alerts, { keyPath: 'id', autoIncrement: true });
      alertsStore.createIndex('farmId', 'farmId', { unique: false });
      alertsStore.createIndex('severity', 'severity', { unique: false });
      alertsStore.createIndex('read', 'read', { unique: false });
    }

    // Crops Store
    if (!db.objectStoreNames.contains(this.stores.crops)) {
      const cropsStore = db.createObjectStore(this.stores.crops, { keyPath: 'id', autoIncrement: true });
      cropsStore.createIndex('farmId', 'farmId', { unique: false });
      cropsStore.createIndex('cropType', 'cropType', { unique: false });
      cropsStore.createIndex('plantingDate', 'plantingDate', { unique: false });
    }

    // Diagnoses Store
    if (!db.objectStoreNames.contains(this.stores.diagnoses)) {
      const diagnosesStore = db.createObjectStore(this.stores.diagnoses, { keyPath: 'id', autoIncrement: true });
      diagnosesStore.createIndex('farmId', 'farmId', { unique: false });
      diagnosesStore.createIndex('cropId', 'cropId', { unique: false });
      diagnosesStore.createIndex('timestamp', 'timestamp', { unique: false });
    }

    // Sync Queue Store
    if (!db.objectStoreNames.contains(this.stores.syncQueue)) {
      const syncStore = db.createObjectStore(this.stores.syncQueue, { keyPath: 'id', autoIncrement: true });
      syncStore.createIndex('action', 'action', { unique: false });
      syncStore.createIndex('priority', 'priority', { unique: false });
      syncStore.createIndex('timestamp', 'timestamp', { unique: false });
    }

    // User Preferences Store
    if (!db.objectStoreNames.contains(this.stores.userPreferences)) {
      db.createObjectStore(this.stores.userPreferences, { keyPath: 'key' });
    }

    // Offline Actions Store
    if (!db.objectStoreNames.contains(this.stores.offlineActions)) {
      const offlineStore = db.createObjectStore(this.stores.offlineActions, { keyPath: 'id', autoIncrement: true });
      offlineStore.createIndex('actionType', 'actionType', { unique: false });
      offlineStore.createIndex('timestamp', 'timestamp', { unique: false });
    }
  }

  // Generic CRUD operations
  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.add({
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName, indexName = null, query = null) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const source = indexName ? store.index(indexName) : store;
    
    return new Promise((resolve, reject) => {
      const request = query ? source.getAll(query) : source.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put({
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Specialized methods for farm analytics
  async saveSensorData(farmId, sensorData) {
    const data = {
      farmId,
      ...sensorData,
      timestamp: new Date().toISOString()
    };
    
    await this.add(this.stores.sensorData, data);
    await this.cleanupOldSensorData(farmId);
  }

  async getSensorData(farmId, sensorType = null, timeRange = null) {
    let data = await this.getAll(this.stores.sensorData, 'farmId', farmId);
    
    if (sensorType) {
      data = data.filter(item => item.sensorType === sensorType);
    }
    
    if (timeRange) {
      const { start, end } = timeRange;
      data = data.filter(item => {
        const timestamp = new Date(item.timestamp);
        return timestamp >= start && timestamp <= end;
      });
    }
    
    return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async saveMarketData(marketData) {
    const data = {
      ...marketData,
      timestamp: new Date().toISOString()
    };
    
    await this.add(this.stores.marketPrices, data);
    await this.cleanupOldMarketData();
  }

  async getMarketData(crop = null, region = null) {
    let data = await this.getAll(this.stores.marketPrices);
    
    if (crop) {
      data = data.filter(item => item.crop === crop);
    }
    
    if (region) {
      data = data.filter(item => item.region === region);
    }
    
    return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async saveAnalyticsReport(farmId, reportData) {
    const data = {
      farmId,
      ...reportData,
      timestamp: new Date().toISOString()
    };
    
    return await this.add(this.stores.analytics, data);
  }

  async getAnalyticsReports(farmId, reportType = null) {
    let data = await this.getAll(this.stores.analytics, 'farmId', farmId);
    
    if (reportType) {
      data = data.filter(item => item.reportType === reportType);
    }
    
    return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Offline action queue management
  async addOfflineAction(action) {
    const actionData = {
      ...action,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    return await this.add(this.stores.offlineActions, actionData);
  }

  async getOfflineActions() {
    return await this.getAll(this.stores.offlineActions);
  }

  async markActionSynced(actionId) {
    const action = await this.get(this.stores.offlineActions, actionId);
    if (action) {
      action.synced = true;
      action.syncedAt = new Date().toISOString();
      await this.update(this.stores.offlineActions, action);
    }
  }

  async clearSyncedActions() {
    const transaction = this.db.transaction([this.stores.offlineActions], 'readwrite');
    const store = transaction.objectStore(storeName);
    const index = store.index('synced');
    
    return new Promise((resolve, reject) => {
      const request = index.openCursor(true);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Data cleanup methods
  async cleanupOldSensorData(farmId, daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const transaction = this.db.transaction([this.stores.sensorData], 'readwrite');
    const store = transaction.objectStore(storeName);
    const index = store.index('farmId');
    
    return new Promise((resolve, reject) => {
      const request = index.openCursor(farmId);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const data = cursor.value;
          if (new Date(data.timestamp) < cutoffDate) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async cleanupOldMarketData(daysToKeep = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const transaction = this.db.transaction([this.stores.marketPrices], 'readwrite');
    const store = transaction.objectStore(storeName);
    const index = store.index('timestamp');
    
    return new Promise((resolve, reject) => {
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffDate.toISOString()));
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Export/Import for backup
  async exportData() {
    const exportData = {};
    
    for (const storeName of Object.values(this.stores)) {
      exportData[storeName] = await this.getAll(storeName);
    }
    
    return {
      version: this.dbVersion,
      timestamp: new Date().toISOString(),
      data: exportData
    };
  }

  async importData(importData) {
    const { version, data } = importData;
    
    // Clear existing data
    for (const storeName of Object.values(this.stores)) {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      await new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
    
    // Import new data
    for (const [storeName, storeData] of Object.entries(data)) {
      if (this.stores[storeName] && Array.isArray(storeData)) {
        for (const item of storeData) {
          await this.add(storeName, item);
        }
      }
    }
  }

  // Database size and stats
  async getDatabaseStats() {
    const stats = {};
    
    for (const storeName of Object.values(this.stores)) {
      const data = await this.getAll(storeName);
      stats[storeName] = {
        count: data.length,
        size: new Blob([JSON.stringify(data)]).size
      };
    }
    
    return stats;
  }
}

// Singleton instance
const dbManager = new IndexedDBManager();

export default dbManager;
