import { pgTable, varchar, text, integer, decimal, boolean, timestamp } from 'drizzle-orm/pg-core';

export const packages = pgTable('packages', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  duration: varchar('duration', { length: 50 }).notNull(),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal('current_price', { precision: 10, scale: 2 }).notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).notNull().default('0'),
  discountLabel: varchar('discount_label', { length: 100 }),
  category: varchar('category', { length: 20 }).notNull(), // 'standard' or 'specialty'
  hasAddons: boolean('has_addons').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(999),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const addons = pgTable('addons', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(999),
});

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
export type Addon = typeof addons.$inferSelect;
export type NewAddon = typeof addons.$inferInsert;
