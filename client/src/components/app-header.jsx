import { useOffline } from "@/hooks/use-offline";
import { useGPS } from "@/hooks/use-gps";
import { usePendingSync } from "@/lib/sync";

export default function AppHeader() {
  const { isOffline } = useOffline();
  const { hasGPS } = useGPS();
  const { pendingCount } = usePendingSync();

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <i className="fas fa-leaf text-2xl"></i>
            <div>
              <h1 className="text-lg font-semibold">AyurHerb</h1>
              <p className="text-xs opacity-90">Ayurvedic Field Data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* GPS Status */}
            <div className="flex items-center space-x-1">
              <i className={`fas fa-map-marker-alt ${hasGPS ? 'text-success status-online' : 'text-muted-foreground'}`}></i>
              <span className="text-xs">GPS</span>
            </div>
            
            {/* Sync Status */}
            <div className="flex items-center space-x-1">
              <i className={`fas ${isOffline ? 'fa-wifi-slash text-warning' : 'fa-wifi text-success'}`}></i>
              <span className="text-xs">{isOffline ? 'Offline' : 'Online'}</span>
            </div>
            
            {/* Pending Sync Counter */}
            {pendingCount > 0 && (
              <div className="bg-warning text-warning-foreground rounded-full px-2 py-1 text-xs font-medium">
                <span data-testid="text-pending-count">{pendingCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
