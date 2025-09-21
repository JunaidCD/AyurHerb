import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import * as storage from "@/lib/storage";
import { useOffline } from "./use-offline";

export const useCollections = () => {
  const { isOffline } = useOffline();
  const [localCollections, setLocalCollections] = useState([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // Fetch server collections
  const { 
    data: serverCollections = [], 
    isLoading: isLoadingServer, 
    error: serverError,
    refetch: refetchServer
  } = useQuery({
    queryKey: ['/api/collections'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/collections');
      return response.json();
    },
    enabled: !isOffline, // Only fetch when online
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch local collections
  useEffect(() => {
    const fetchLocalCollections = async () => {
      try {
        setIsLoadingLocal(true);
        const local = await storage.getAllLocalCollections();
        setLocalCollections(local || []);
      } catch (error) {
        console.error('Failed to fetch local collections:', error);
        setLocalCollections([]);
      } finally {
        setIsLoadingLocal(false);
      }
    };

    fetchLocalCollections();

    // Listen for custom events when local data changes
    const handleLocalUpdate = () => {
      fetchLocalCollections();
      // Also refetch server data after a short delay to ensure sync is complete
      setTimeout(() => {
        if (!isOffline) {
          refetchServer();
        }
      }, 1000);
    };

    window.addEventListener('localCollectionsUpdated', handleLocalUpdate);

    return () => {
      window.removeEventListener('localCollectionsUpdated', handleLocalUpdate);
    };
  }, [isOffline, refetchServer]);

  // Combine and deduplicate collections
  const combinedCollections = useMemo(() => {
    const collections = [];
    const seenBatchIds = new Set();

    // Add server collections first (they have priority)
    if (Array.isArray(serverCollections)) {
      serverCollections.forEach(collection => {
        collections.push({
          ...collection,
          source: 'server',
          synced: true
        });
        // Track batch IDs to avoid duplicates
        if (collection.batchId) {
          seenBatchIds.add(collection.batchId);
        }
      });
    }

    // Add local collections
    if (Array.isArray(localCollections)) {
      localCollections.forEach(collection => {
        // Skip if we already have this collection from server (based on batchId and collectorId)
        const isDuplicateInServer = collection.batchId && 
          seenBatchIds.has(collection.batchId) &&
          serverCollections.some(serverCol => 
            serverCol.batchId === collection.batchId && 
            serverCol.collectorId === collection.collectorId &&
            serverCol.speciesName === collection.speciesName
          );

        if (isDuplicateInServer) {
          return;
        }

        // Add all local collections (both synced and unsynced)
        // This ensures we show data even during the sync transition
        collections.push({
          ...collection,
          id: `local_${collection.id}`,
          source: 'local',
          synced: collection.synced || false
        });
      });
    }

    // Sort by timestamp (newest first)
    return collections.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  }, [serverCollections, localCollections]);

  const isLoading = isLoadingServer || isLoadingLocal;
  const error = serverError;

  const refetch = async () => {
    try {
      await refetchServer();
      const local = await storage.getAllLocalCollections();
      setLocalCollections(local || []);
    } catch (error) {
      console.error('Failed to refresh collections:', error);
    }
  };

  const localCount = Array.isArray(localCollections) ? localCollections.filter(c => !c.synced).length : 0;
  const serverCount = Array.isArray(serverCollections) ? serverCollections.length : 0;

  return {
    collections: combinedCollections,
    isLoading,
    error,
    refetch,
    localCount,
    serverCount,
    totalCount: combinedCollections.length
  };
};
