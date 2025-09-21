const CACHE_NAME = 'herb-collector-v1';
const urlsToCache = [
  '/',
  '/src/main.jsx',
  '/src/index.css',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  try {
    // This would normally sync with your backend
    console.log('Background sync triggered');
    
    // Open IndexedDB and sync pending collections
    const request = indexedDB.open('HerbCollectorDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['collections'], 'readonly');
      const store = transaction.objectStore('collections');
      const index = store.index('synced');
      
      const getRequest = index.getAll(false); // Get unsynced items
      
      getRequest.onsuccess = async () => {
        const pendingCollections = getRequest.result;
        
        for (const collection of pendingCollections) {
          try {
            await syncSingleCollection(collection);
            
            // Mark as synced
            const updateTransaction = db.transaction(['collections'], 'readwrite');
            const updateStore = updateTransaction.objectStore('collections');
            collection.synced = true;
            updateStore.put(collection);
          } catch (error) {
            console.error('Failed to sync collection:', error);
          }
        }
      };
    };
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncSingleCollection(collection) {
  const formData = new FormData();
  
  // Append collection data
  Object.keys(collection).forEach(key => {
    if (key !== 'id' && key !== 'synced' && key !== 'isDraft' && collection[key] !== null) {
      formData.append(key, collection[key]);
    }
  });
  
  const response = await fetch('/api/collection', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Push notification handling (for future enhancement)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Default notification body',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'herb-collector-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification('Herb Collector', options)
  );
});
