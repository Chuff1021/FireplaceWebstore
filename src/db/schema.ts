import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Categories table
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Products table
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  price: real("price").notNull().default(0),
  salePrice: real("sale_price"),
  sku: text("sku"),
  brand: text("brand").notNull().default(""),
  categoryId: integer("category_id"),
  image: text("image").notNull().default(""),
  images: text("images").notNull().default("[]"), // JSON array of image URLs
  specs: text("specs").notNull().default("{}"), // JSON object of specs
  features: text("features").notNull().default("[]"), // JSON array of feature strings
  inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  isNew: integer("is_new", { mode: "boolean" }).notNull().default(false),
  isSale: integer("is_sale", { mode: "boolean" }).notNull().default(false),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Admin users table (for dashboard login)
export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Admin sessions table
export const adminSessions = sqliteTable("admin_sessions", {
  id: text("id").primaryKey(), // session token
  userId: integer("user_id").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
