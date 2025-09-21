import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGPS } from "@/hooks/use-gps";
import { useCamera } from "@/lib/camera";
import { saveOfflineCollection, syncPendingCollections } from "@/lib/sync";
import { useOffline } from "@/hooks/use-offline";
import { apiRequest } from "@/lib/queryClient";
import { insertCollectionSchema } from "@shared/schema";
import { z } from "zod";

const formSchema = insertCollectionSchema.extend({
  qualityGrade: z.enum(["premium", "standard", "commercial", "low"]),
});

export default function CollectionForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isOffline } = useOffline();
  const { coordinates, accuracy, refreshLocation } = useGPS();
  const { capturePhoto, selectFromGallery } = useCamera();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchId: "",
      collectorId: "",
      speciesName: "",
      latitude: coordinates?.latitude || 0,
      longitude: coordinates?.longitude || 0,
      accuracy: accuracy || 0,
      qualityGrade: "",
      moistureContent: 0,
      weight: 0,
      notes: "",
      photoUrl: "",
    },
  });

  // Update form when GPS coordinates change
  useEffect(() => {
    if (coordinates) {
      form.setValue("latitude", coordinates.latitude);
      form.setValue("longitude", coordinates.longitude);
      form.setValue("accuracy", accuracy || 0);
    }
  }, [coordinates, accuracy, form]);

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key].toString());
        }
      });
      
      // Append photo if exists
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      
      const response = await apiRequest('POST', '/api/collection', formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Collection Submitted!",
        description: "Your data has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/collections'] });
      form.reset();
      setPhotoFile(null);
      setPhotoPreview(null);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data) => {
    if (isOffline) {
      // Save to IndexedDB for offline sync
      await saveOfflineCollection({
        ...data,
        photoFile,
      });
      toast({
        title: "Collection Saved Offline!",
        description: "Data will sync when connection is restored.",
      });
      form.reset();
      setPhotoFile(null);
      setPhotoPreview(null);
    } else {
      submitMutation.mutate(data);
    }
  };

  const saveDraft = async () => {
    const data = form.getValues();
    await saveOfflineCollection({
      ...data,
      photoFile,
      isDraft: true,
    });
    toast({
      title: "Draft Saved!",
      description: "Your data is stored safely offline.",
    });
  };

  const handlePhotoCapture = async () => {
    try {
      const file = await capturePhoto();
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    } catch (error) {
      toast({
        title: "Camera Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGallerySelect = async () => {
    try {
      const file = await selectFromGallery();
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    } catch (error) {
      toast({
        title: "Gallery Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Collection Details Card */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-clipboard-list mr-2 text-primary"></i>
            Collection Details
          </h2>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                id="batchId"
                {...form.register("batchId")}
                placeholder="Enter batch identifier"
                className="field-input touch-target"
                data-testid="input-batch-id"
              />
              {form.formState.errors.batchId && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.batchId.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="collectorId">Collector ID</Label>
              <Input
                id="collectorId"
                {...form.register("collectorId")}
                placeholder="Your collector ID"
                className="field-input touch-target"
                data-testid="input-collector-id"
              />
              {form.formState.errors.collectorId && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.collectorId.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="speciesName">Species Name</Label>
              <Input
                id="speciesName"
                {...form.register("speciesName")}
                placeholder="Scientific or common name"
                className="field-input touch-target"
                data-testid="input-species-name"
              />
              {form.formState.errors.speciesName && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.speciesName.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Location & Time Card */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
            Location & Time
          </h2>
          
          <div className="grid gap-4">
            <div className="bg-muted rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">GPS Coordinates</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={refreshLocation}
                  className="text-primary hover:text-primary/80 touch-target"
                  data-testid="button-refresh-location"
                >
                  <i className="fas fa-sync-alt mr-1"></i>
                  Refresh
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div data-testid="text-latitude">
                  Latitude: {coordinates ? `${coordinates.latitude.toFixed(6)}°` : 'Getting location...'}
                </div>
                <div data-testid="text-longitude">
                  Longitude: {coordinates ? `${coordinates.longitude.toFixed(6)}°` : 'Getting location...'}
                </div>
                <div data-testid="text-accuracy">
                  Accuracy: {accuracy ? `±${accuracy.toFixed(0)} meters` : 'Unknown'}
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-md p-4">
              <span className="text-sm font-medium block mb-1">Collection Time</span>
              <div className="text-sm text-muted-foreground" data-testid="text-timestamp">
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quality Metrics Card */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-star mr-2 text-primary"></i>
            Quality Assessment
          </h2>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="qualityGrade">Quality Grade</Label>
              <Select onValueChange={(value) => form.setValue("qualityGrade", value)}>
                <SelectTrigger className="field-input touch-target" data-testid="select-quality-grade">
                  <SelectValue placeholder="Select grade..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium (A+)</SelectItem>
                  <SelectItem value="standard">Standard (A)</SelectItem>
                  <SelectItem value="commercial">Commercial (B)</SelectItem>
                  <SelectItem value="low">Low Grade (C)</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.qualityGrade && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.qualityGrade.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="moistureContent">Moisture Content (%)</Label>
              <Input
                id="moistureContent"
                type="number"
                min="0"
                max="100"
                step="0.1"
                {...form.register("moistureContent", { valueAsNumber: true })}
                placeholder="0.0"
                className="field-input touch-target"
                data-testid="input-moisture-content"
              />
            </div>
            
            <div>
              <Label htmlFor="weight">Collection Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.01"
                {...form.register("weight", { valueAsNumber: true })}
                placeholder="0.00"
                className="field-input touch-target"
                data-testid="input-weight"
              />
              {form.formState.errors.weight && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.weight.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                {...form.register("notes")}
                placeholder="Any observations or special conditions..."
                className="field-input resize-none"
                data-testid="textarea-notes"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Photo Upload Card */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-camera mr-2 text-primary"></i>
            Photo Documentation
          </h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/50">
              <div className="space-y-3">
                {photoPreview && (
                  <div className="mx-auto bg-input rounded-lg overflow-hidden max-w-xs">
                    <img 
                      src={photoPreview}
                      alt="Captured photo preview" 
                      className="photo-preview w-full rounded-lg"
                      data-testid="img-photo-preview"
                    />
                  </div>
                )}
                
                <div className="flex justify-center space-x-3">
                  <Button 
                    type="button" 
                    onClick={handlePhotoCapture}
                    className="bg-primary text-primary-foreground touch-target hover:bg-primary/90"
                    data-testid="button-capture-photo"
                  >
                    <i className="fas fa-camera mr-2"></i>
                    Take Photo
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={handleGallerySelect}
                    className="touch-target"
                    data-testid="button-select-gallery"
                  >
                    <i className="fas fa-images mr-2"></i>
                    Gallery
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Optional: Upload photos of harvested herbs
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Form Actions */}
      <div className="space-y-3">
        <Button 
          type="button" 
          variant="secondary"
          onClick={saveDraft}
          className="w-full py-4 text-lg touch-target"
          data-testid="button-save-draft"
        >
          <i className="fas fa-save mr-2"></i>
          Save Draft
        </Button>
        
        <Button 
          type="submit" 
          disabled={submitMutation.isPending}
          className="w-full py-4 text-lg touch-target"
          data-testid="button-submit-collection"
        >
          {submitMutation.isPending ? (
            <i className="fas fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fas fa-check-circle mr-2"></i>
          )}
          Submit Collection
        </Button>
        
        {isOffline && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-2 text-warning">
              <i className="fas fa-wifi-slash"></i>
              <span className="text-sm font-medium">Offline Mode - Data will sync when connected</span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
