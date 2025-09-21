import Dexie from 'dexie';

// IndexedDB database for offline storage
class HerbCollectorDB extends Dexie {
  constructor() {
    super('HerbCollectorDB');
    this.version(1).stores({
      collections: '++id, speciesName, timestamp, synced, isDraft',
    });
  }
}

export const db = new HerbCollectorDB();

// Helper function to trigger local collections update event
export const triggerLocalCollectionsUpdate = () => {
  window.dispatchEvent(new CustomEvent('localCollectionsUpdated'));
};

export const saveCollection = async (collection) => {
  try {
    const id = await db.collections.add({
      ...collection,
      timestamp: new Date(),
      synced: false,
      isDraft: collection.isDraft || false,
    });
    triggerLocalCollectionsUpdate();
    return id;
  } catch (error) {
    console.error('Failed to save collection:', error);
    throw error;
  }
};

export const getPendingCollections = async () => {
  try {
    return await db.collections.filter(item => !item.synced).toArray();
  } catch (error) {
    console.error('Failed to get pending collections:', error);
    throw error;
  }
};

export const markAsSynced = async (id) => {
  try {
    await db.collections.update(id, { synced: true });
    triggerLocalCollectionsUpdate();
  } catch (error) {
    console.error('Failed to mark as synced:', error);
    throw error;
  }
};

export const deleteCollection = async (id) => {
  try {
    await db.collections.delete(id);
  } catch (error) {
    console.error('Failed to delete collection:', error);
    throw error;
  }
};

export const getAllLocalCollections = async () => {
  try {
    return await db.collections.orderBy('timestamp').reverse().toArray();
  } catch (error) {
    console.error('Failed to get all local collections:', error);
    throw error;
  }
};

export const getLocalCollectionById = async (id) => {
  try {
    return await db.collections.get(id);
  } catch (error) {
    console.error('Failed to get local collection by id:', error);
    throw error;
  }
};

// Clear all data for fresh start
export const clearAllData = async () => {
  try {
    // Clear IndexedDB collections
    await db.collections.clear();
    
    // Clear localStorage auth data
    localStorage.removeItem('ayurherb_auth_token');
    localStorage.removeItem('ayurherb_user_data');
    localStorage.removeItem('ayurherb_app_initialized');
    
    console.log('All application data cleared');
    triggerLocalCollectionsUpdate();
  } catch (error) {
    console.error('Failed to clear all data:', error);
    throw error;
  }
};

// Simple initialization - just for app setup, no automatic clearing
export const initializeApp = async () => {
  try {
    console.log('AyurHerb app initialized');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
};

