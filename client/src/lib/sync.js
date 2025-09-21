import { useState, useEffect } from "react";
import { saveCollection, getPendingCollections, markAsSynced, deleteCollection, triggerLocalCollectionsUpdate } from "./storage";
import { apiRequest } from "./queryClient";

// Re-export for components
export { getPendingCollections } from "./storage";

export const saveOfflineCollection = async (collection) => {
  return await saveCollection(collection);
};

export const syncPendingCollections = async (queryClient = null) => {
  const pending = await getPendingCollections();
  let success = 0;
  let failed = 0;

  for (const item of pending) {
    try {
      await syncSingleCollection(item);
      await markAsSynced(item.id);
      success++;
    } catch (error) {
      console.error(`Failed to sync collection ${item.id}:`, error);
      failed++;
    }
  }

  // Trigger update after sync is complete
  if (success > 0) {
    triggerLocalCollectionsUpdate();
    
    // Also invalidate server collections query if queryClient is provided
    if (queryClient) {
      queryClient.invalidateQueries({ queryKey: ['/api/collections'] });
    }
  }

  return { success, failed };
};

export const retrySync = async (itemId) => {
  const pending = await getPendingCollections();
  const item = pending.find(p => p.id === itemId);
  
  if (!item) {
    throw new Error('Item not found');
  }

  await syncSingleCollection(item);
  await markAsSynced(item.id);
};

const syncSingleCollection = async (collection) => {
  const formData = new FormData();
  
  // Append all form fields except internal ones
  const { id, synced, isDraft, photoFile, ...collectionData } = collection;
  
  Object.keys(collectionData).forEach(key => {
    if (collectionData[key] !== null && collectionData[key] !== undefined) {
      formData.append(key, collectionData[key].toString());
    }
  });
  
  // Append photo if exists
  if (photoFile) {
    formData.append('photo', photoFile);
  }
  
  const response = await apiRequest('POST', '/api/collection', formData);
  return response.json();
};

export const usePendingSync = () => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updateCount = async () => {
      try {
        const pending = await getPendingCollections();
        setPendingCount(pending.length);
      } catch (error) {
        console.error('Failed to get pending count:', error);
      }
    };

    updateCount();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      updateCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check periodically
    const interval = setInterval(updateCount, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return { pendingCount };
};

// Auto-sync when coming online
export const setupAutoSync = () => {
  window.addEventListener('online', async () => {
    try {
      console.log('Connection restored, syncing pending collections...');
      await syncPendingCollections();
    } catch (error) {
      console.error('Auto-sync failed:', error);
    }
  });
};
