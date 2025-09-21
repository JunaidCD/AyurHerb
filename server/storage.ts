import { type Collection, type InsertCollection } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCollection(id: string): Promise<Collection | undefined>;
  getCollections(): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: string, collection: Partial<Collection>): Promise<Collection | undefined>;
}

export class MemStorage implements IStorage {
  private collections: Map<string, Collection>;

  constructor() {
    this.collections = new Map();
  }

  async getCollection(id: string): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = randomUUID();
    const collection: Collection = { 
      ...insertCollection,
      accuracy: insertCollection.accuracy ?? null,
      moistureContent: insertCollection.moistureContent ?? null,
      notes: insertCollection.notes ?? null,
      photoUrl: insertCollection.photoUrl ?? null,
      id,
      timestamp: new Date(),
      synced: true,
    };
    this.collections.set(id, collection);
    return collection;
  }

  async updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | undefined> {
    const collection = this.collections.get(id);
    if (!collection) return undefined;
    
    const updated = { ...collection, ...updates };
    this.collections.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
