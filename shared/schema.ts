import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const collections = pgTable("collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: text("batch_id").notNull(),
  collectorId: text("collector_id").notNull(),
  speciesName: text("species_name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  accuracy: real("accuracy"),
  qualityGrade: text("quality_grade").notNull(),
  moistureContent: real("moisture_content"),
  weight: real("weight").notNull(),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  synced: boolean("synced").notNull().default(false),
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
  timestamp: true,
  synced: true,
});

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;
