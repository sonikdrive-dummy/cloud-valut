import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  jobTitle: text("job_title"),
  avatar: text("avatar"),
  plan: text("plan").default("free"),
  storageUsed: integer("storage_used").default(0),
  storageLimit: integer("storage_limit").default(5368709120), // 5GB in bytes
  preferences: jsonb("preferences").default({
    theme: "dark",
    emailNotifications: true,
    desktopNotifications: false
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // file, folder
  mimeType: text("mime_type"),
  size: integer("size").default(0),
  path: text("path").notNull(),
  parentId: varchar("parent_id"),
  ownerId: varchar("owner_id").notNull(),
  isStarred: boolean("is_starred").default(false),
  isShared: boolean("is_shared").default(false),
  isDeleted: boolean("is_deleted").default(false),
  thumbnail: text("thumbnail"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shares = pgTable("shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileId: varchar("file_id").notNull(),
  sharedBy: varchar("shared_by").notNull(),
  sharedWith: varchar("shared_with"),
  permissions: text("permissions").default("read"), // read, write, admin
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  fileId: varchar("file_id"),
  action: text("action").notNull(), // upload, download, delete, share, etc.
  details: jsonb("details").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShareSchema = createInsertSchema(shares).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertShare = z.infer<typeof insertShareSchema>;
export type Share = typeof shares.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
