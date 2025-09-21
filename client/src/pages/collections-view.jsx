import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/app-header";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function CollectionsView() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: collections = [], isLoading, error } = useQuery({
    queryKey: ['/api/collections'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/collections');
      return response.json();
    },
  });

  const filteredCollections = collections.filter(collection => 
    collection.speciesName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.collectorId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getQualityBadgeVariant = (grade) => {
    switch (grade) {
      case 'premium': return 'default';
      case 'standard': return 'secondary';
      case 'commercial': return 'outline';
      case 'low': return 'destructive';
      default: return 'outline';
    }
  };

  const getQualityLabel = (grade) => {
    switch (grade) {
      case 'premium': return 'Premium (A+)';
      case 'standard': return 'Standard (A)';
      case 'commercial': return 'Commercial (B)';
      case 'low': return 'Low Grade (C)';
      default: return grade;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AppHeader />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
              <p className="text-lg text-muted-foreground">Loading collections...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AppHeader />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
              <p className="text-lg text-muted-foreground">Failed to load collections</p>
              <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <i className="fas fa-database mr-3 text-primary"></i>
              Submitted Collections
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your herb collection data
            </p>
          </div>
          
          <Button 
            onClick={() => setLocation('/')}
            className="touch-target"
          >
            <i className="fas fa-plus mr-2"></i>
            New Collection
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <Input
              type="text"
              placeholder="Search by species name, batch ID, or collector ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 touch-target"
            />
          </div>
        </div>

        {/* Collections Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCollections.length} of {collections.length} collections
          </p>
        </div>

        {/* Collections Grid */}
        {filteredCollections.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-leaf text-6xl text-muted-foreground/50 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">
              {collections.length === 0 ? 'No Collections Yet' : 'No Matching Collections'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {collections.length === 0 
                ? 'Start by creating your first herb collection record.'
                : 'Try adjusting your search terms to find collections.'
              }
            </p>
            {collections.length === 0 && (
              <Button onClick={() => setLocation('/')}>
                <i className="fas fa-plus mr-2"></i>
                Create First Collection
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCollections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-primary">
                        {collection.speciesName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Batch: {collection.batchId}
                      </p>
                    </div>
                    <Badge variant={getQualityBadgeVariant(collection.qualityGrade)}>
                      {getQualityLabel(collection.qualityGrade)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Photo */}
                  {collection.photoUrl && (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={collection.photoUrl} 
                        alt={`${collection.speciesName} photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Collection Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <i className="fas fa-user w-4 mr-2"></i>
                      <span>Collector: {collection.collectorId}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <i className="fas fa-weight w-4 mr-2"></i>
                      <span>Weight: {collection.weight} kg</span>
                    </div>
                    
                    {collection.moistureContent && (
                      <div className="flex items-center text-muted-foreground">
                        <i className="fas fa-tint w-4 mr-2"></i>
                        <span>Moisture: {collection.moistureContent}%</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-muted-foreground">
                      <i className="fas fa-map-marker-alt w-4 mr-2"></i>
                      <span>
                        {collection.latitude.toFixed(4)}°, {collection.longitude.toFixed(4)}°
                      </span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <i className="fas fa-clock w-4 mr-2"></i>
                      <span>{formatDate(collection.timestamp)}</span>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  {collection.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        <i className="fas fa-sticky-note mr-2"></i>
                        {collection.notes}
                      </p>
                    </div>
                  )}
                  
                  {/* Sync Status */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-xs">
                      {collection.synced ? (
                        <span className="text-green-600 flex items-center">
                          <i className="fas fa-check-circle mr-1"></i>
                          Synced
                        </span>
                      ) : (
                        <span className="text-yellow-600 flex items-center">
                          <i className="fas fa-sync-alt mr-1"></i>
                          Pending Sync
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
