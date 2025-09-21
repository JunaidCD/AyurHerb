import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getPendingCollections, syncPendingCollections, retrySync } from "@/lib/sync";

export default function PendingSyncList() {
  const [pendingItems, setPendingItems] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    loadPendingItems();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadPendingItems();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadPendingItems = async () => {
    try {
      const items = await getPendingCollections();
      setPendingItems(items);
    } catch (error) {
      console.error('Failed to load pending items:', error);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const result = await syncPendingCollections(queryClient);
      
      if (result.success > 0) {
        toast({
          title: "Sync Successful!",
          description: `${result.success} collections synced successfully.`,
        });
        loadPendingItems();
      }
      
      if (result.failed > 0) {
        toast({
          title: "Partial Sync",
          description: `${result.failed} collections failed to sync.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRetryItem = async (itemId) => {
    try {
      await retrySync(itemId);
      toast({
        title: "Retry Successful!",
        description: "Collection synced successfully.",
      });
      loadPendingItems();
    } catch (error) {
      toast({
        title: "Retry Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Always show sync interface for testing, even when no pending items
  const showSyncInterface = pendingItems.length > 0 || import.meta.env.DEV;
  
  if (!showSyncInterface) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <i className="fas fa-clock mr-2 text-warning"></i>
          Pending Sync (<span data-testid="text-pending-sync-count">{pendingItems.length}</span>)
        </h3>
        
        <div className="space-y-3">
          {pendingItems.length > 0 ? (
            pendingItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-muted rounded-md p-3 flex items-center justify-between"
                data-testid={`card-pending-${item.id}`}
              >
                <div>
                  <div className="font-medium text-sm" data-testid={`text-species-${item.id}`}>
                    {item.speciesName}
                  </div>
                  <div className="text-xs text-muted-foreground" data-testid={`text-timestamp-${item.id}`}>
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-warning text-warning-foreground px-2 py-1 rounded text-xs">
                    {item.isDraft ? 'Draft' : 'Queued'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRetryItem(item.id)}
                    className="text-muted-foreground hover:text-foreground touch-target"
                    data-testid={`button-retry-${item.id}`}
                  >
                    <i className="fas fa-sync-alt"></i>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-muted/50 rounded-md p-4 text-center text-muted-foreground">
              <i className="fas fa-check-circle text-success mb-2 text-lg block"></i>
              <p className="text-sm">No pending collections to sync</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button 
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="w-full touch-target"
            data-testid="button-sync-all"
          >
            {isSyncing ? (
              <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fas fa-cloud-upload-alt mr-2"></i>
            )}
            Sync All Pending
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
