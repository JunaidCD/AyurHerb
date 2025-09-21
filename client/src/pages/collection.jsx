import AppHeader from "@/components/app-header";
import CollectionForm from "@/components/collection-form";
import PendingSyncList from "@/components/pending-sync-list";
import LogoutButton from "@/components/logout-button";
import { useOffline } from "@/hooks/use-offline";
import { useState, useEffect } from "react";

export default function Collection() {
  const { isOffline } = useOffline();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <CollectionForm />
        <PendingSyncList />
        
        {showInstallPrompt && (
          <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-mobile-alt text-primary text-2xl"></i>
              <div className="flex-1">
                <h4 className="font-semibold text-primary">Install App</h4>
                <p className="text-sm text-muted-foreground">Add to home screen for quick access</p>
              </div>
              <button 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium touch-target hover:bg-primary/90"
                onClick={handleInstallPWA}
                data-testid="button-install-pwa"
              >
                Install
              </button>
            </div>
          </div>
        )}
      </main>
      
      <LogoutButton />
    </div>
  );
}
