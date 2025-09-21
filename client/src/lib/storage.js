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

export const saveCollection = async (collection) => {
  try {
    const id = await db.collections.add({
      ...collection,
      timestamp: new Date(),
      synced: false,
      isDraft: collection.isDraft || false,
    });
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
