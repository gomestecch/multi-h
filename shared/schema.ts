import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Lookup job schema
export const lookupJobs = pgTable("lookup_jobs", {
  id: serial("id").primaryKey(),
  sourceFileName: text("source_file_name").notNull(),
  lookupFileName: text("lookup_file_name").notNull(),
  sourceKeyColumn: text("source_key_column").notNull(),
  lookupKeyColumn: text("lookup_key_column").notNull(),
  sourceColumns: text("source_columns").array().notNull(),
  lookupColumns: text("lookup_columns").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertLookupJobSchema = createInsertSchema(lookupJobs).omit({
  id: true,
  createdAt: true,
});

// Results schema
export const lookupResults = pgTable("lookup_results", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => lookupJobs.id).notNull(),
  results: jsonb("results").notNull(),
  totalMatches: integer("total_matches").notNull(),
  totalNonMatches: integer("total_non_matches").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLookupResultSchema = createInsertSchema(lookupResults).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LookupJob = typeof lookupJobs.$inferSelect;
export type InsertLookupJob = z.infer<typeof insertLookupJobSchema>;
export type LookupResult = typeof lookupResults.$inferSelect;
export type InsertLookupResult = z.infer<typeof insertLookupResultSchema>;

// File processing types
export type FileData = {
  columns: string[];
  rows: Record<string, any>[];
};

export type LookupOptions = {
  sourceKeyColumn: string;
  lookupKeyColumn: string;
  sourceColumns: string[];
  lookupColumns: string[];
};

export type LookupResultData = {
  results: Record<string, any>[];
  totalMatches: number;
  totalNonMatches: number;
};
