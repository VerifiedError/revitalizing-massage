import { pgTable, varchar, text, integer, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';

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
}, (table) => ({
  // Indexes for optimized queries
  isActiveIdx: index('packages_is_active_idx').on(table.isActive),
  sortOrderIdx: index('packages_sort_order_idx').on(table.sortOrder),
  categoryIdx: index('packages_category_idx').on(table.category),
  // Composite index for common query pattern (active packages ordered by sort)
  activeOrderIdx: index('packages_active_order_idx').on(table.isActive, table.sortOrder),
}));

export const addons = pgTable('addons', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(999),
}, (table) => ({
  // Indexes for optimized queries
  isActiveIdx: index('addons_is_active_idx').on(table.isActive),
  sortOrderIdx: index('addons_sort_order_idx').on(table.sortOrder),
}));

export const appointments = pgTable('appointments', {
  id: varchar('id', { length: 50 }).primaryKey(),
  customerId: varchar('customer_id', { length: 100 }),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  customerPhone: varchar('customer_phone', { length: 50 }),
  serviceId: varchar('service_id', { length: 50 }).notNull(),
  serviceName: varchar('service_name', { length: 255 }).notNull(),
  servicePrice: decimal('service_price', { precision: 10, scale: 2 }).notNull(),
  addons: text('addons').notNull().default('[]'), // JSON array of addon IDs
  addonsTotal: decimal('addons_total', { precision: 10, scale: 2 }).notNull().default('0'),
  date: varchar('date', { length: 20 }).notNull(), // YYYY-MM-DD format
  time: varchar('time', { length: 20 }).notNull(), // HH:MM AM/PM format
  duration: varchar('duration', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('scheduled'), // scheduled, confirmed, completed, cancelled, no-show
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 50 }).notNull(), // 'admin', 'customer', 'system'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  // Indexes for optimized queries
  customerIdIdx: index('appointments_customer_id_idx').on(table.customerId),
  dateIdx: index('appointments_date_idx').on(table.date),
  statusIdx: index('appointments_status_idx').on(table.status),
  // Composite index for common query pattern (date + status)
  dateStatusIdx: index('appointments_date_status_idx').on(table.date, table.status),
}));

export const customerNotes = pgTable('customer_notes', {
  id: varchar('id', { length: 50 }).primaryKey(),
  customerId: varchar('customer_id', { length: 100 }).notNull(),
  note: text('note').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(), // Admin user ID
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // Index for customer lookup
  customerIdIdx: index('customer_notes_customer_id_idx').on(table.customerId),
}));

export const settings = pgTable('settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(), // JSON stringified for complex objects
  category: varchar('category', { length: 50 }).notNull().default('general'),
  description: text('description'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const blockedDates = pgTable('blocked_dates', {
  id: varchar('id', { length: 50 }).primaryKey(),
  date: varchar('date', { length: 20 }).notNull().unique(), // YYYY-MM-DD
  reason: text('reason'),
  createdBy: varchar('created_by', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const businessSettings = pgTable('business_settings', {
  id: integer('id').primaryKey().default(1), // Singleton pattern - only one record
  businessName: varchar('business_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  phoneDisplay: varchar('phone_display', { length: 50 }).notNull(), // Formatted version like "(785) 250-4599"
  email: varchar('email', { length: 255 }).notNull(),
  addressStreet: varchar('address_street', { length: 255 }).notNull(),
  addressCity: varchar('address_city', { length: 100 }).notNull(),
  addressState: varchar('address_state', { length: 50 }).notNull(),
  addressZip: varchar('address_zip', { length: 20 }).notNull(),
  addressFull: text('address_full').notNull(), // Computed full address
  timezone: varchar('timezone', { length: 100 }).notNull().default('America/Chicago'),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: varchar('updated_by', { length: 100 }), // Admin user ID who last updated
});

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
export type Addon = typeof addons.$inferSelect;
export type NewAddon = typeof addons.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type CustomerNote = typeof customerNotes.$inferSelect;
export type NewCustomerNote = typeof customerNotes.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
export type BlockedDate = typeof blockedDates.$inferSelect;
export type NewBlockedDate = typeof blockedDates.$inferInsert;
export type BusinessSettings = typeof businessSettings.$inferSelect;
export type NewBusinessSettings = typeof businessSettings.$inferInsert;
