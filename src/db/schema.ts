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

// Customer tables (defined before appointments to allow foreign key reference)
export const customers = pgTable('customers', {
  id: varchar('id', { length: 50 }).primaryKey(),
  clerkUserId: varchar('clerk_user_id', { length: 100 }).unique(), // nullable - if they have an account
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 50 }),
  dateOfBirth: varchar('date_of_birth', { length: 20 }), // YYYY-MM-DD
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastVisit: varchar('last_visit', { length: 20 }), // YYYY-MM-DD - computed from appointments
  totalVisits: integer('total_visits').notNull().default(0), // computed
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).notNull().default('0'), // computed
  status: varchar('status', { length: 20 }).notNull().default('active'), // 'active', 'inactive', 'blocked'
  referralSource: varchar('referral_source', { length: 100 }), // "Google", "Facebook", "Friend", etc.
  marketingOptIn: boolean('marketing_opt_in').notNull().default(false),
}, (table) => ({
  emailIdx: index('customers_email_idx').on(table.email),
  statusIdx: index('customers_status_idx').on(table.status),
  lastVisitIdx: index('customers_last_visit_idx').on(table.lastVisit),
}));

export const customerHealthInfo = pgTable('customer_health_info', {
  id: varchar('id', { length: 50 }).primaryKey(),
  customerId: varchar('customer_id', { length: 50 }).notNull().references(() => customers.id, { onDelete: 'cascade' }),
  allergies: text('allergies'),
  medicalConditions: text('medical_conditions'),
  medications: text('medications'),
  injuries: text('injuries'),
  pregnancyStatus: boolean('pregnancy_status'),
  pregnancyWeeks: integer('pregnancy_weeks'),
  pressurePreference: varchar('pressure_preference', { length: 20 }), // 'light', 'medium', 'firm', 'deep'
  focusAreas: text('focus_areas'), // JSON array of areas
  avoidAreas: text('avoid_areas'), // JSON array of areas
  specialRequests: text('special_requests'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  customerIdx: index('health_info_customer_idx').on(table.customerId),
}));

export const customerPreferences = pgTable('customer_preferences', {
  id: varchar('id', { length: 50 }).primaryKey(),
  customerId: varchar('customer_id', { length: 50 }).notNull().references(() => customers.id, { onDelete: 'cascade' }),
  preferredDay: integer('preferred_day'), // 0-6, null for no preference
  preferredTime: varchar('preferred_time', { length: 20 }), // 'morning', 'afternoon', 'evening', 'any'
  preferredServices: text('preferred_services'), // JSON array of service IDs
  tableHeatingPreference: varchar('table_heating_preference', { length: 20 }), // 'warm', 'cool', 'no-preference'
  musicPreference: varchar('music_preference', { length: 100 }),
  aromatherapyPreference: boolean('aromatherapy_preference'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  customerIdx: index('preferences_customer_idx').on(table.customerId),
}));

export const appointments = pgTable('appointments', {
  id: varchar('id', { length: 50 }).primaryKey(),
  customerId: varchar('customer_id', { length: 50 }).references(() => customers.id), // References customers table
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

export const customerCommunications = pgTable('customer_communications', {
  id: varchar('id', { length: 50 }).primaryKey(),
  customerId: varchar('customer_id', { length: 50 }).notNull().references(() => customers.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull().default('note'), // 'note', 'email', 'phone', 'sms', 'in-person'
  subject: varchar('subject', { length: 255 }), // For emails or categorization
  content: text('content').notNull(),
  direction: varchar('direction', { length: 10 }), // 'inbound', 'outbound', null for notes
  tags: text('tags'), // JSON array of tags like ["important", "follow-up", "medical"]
  createdBy: varchar('created_by', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  metadata: text('metadata'), // JSON for additional data (call duration, email read status, etc.)
}, (table) => ({
  customerIdx: index('communications_customer_idx').on(table.customerId),
  typeIdx: index('communications_type_idx').on(table.type),
  createdAtIdx: index('communications_created_at_idx').on(table.createdAt),
}));

export const noteTemplates = pgTable('note_templates', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // "Rescheduling", "No-show", "Follow-up", "Medical", "General"
  content: text('content').notNull(),
  tags: text('tags'), // JSON array of default tags
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(999),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  isActiveIdx: index('templates_is_active_idx').on(table.isActive),
  categoryIdx: index('templates_category_idx').on(table.category),
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

export const businessHours = pgTable('business_hours', {
  id: integer('id').primaryKey(), // 0-6 for Sunday-Saturday
  dayOfWeek: integer('day_of_week').notNull(), // 0=Sunday, 1=Monday, ..., 6=Saturday
  dayName: varchar('day_name', { length: 20 }).notNull(), // "Sunday", "Monday", etc.
  isOpen: boolean('is_open').notNull().default(true),
  openTime: varchar('open_time', { length: 10 }), // "09:00 AM"
  closeTime: varchar('close_time', { length: 10 }), // "06:00 PM"
  breakStartTime: varchar('break_start_time', { length: 10 }), // "12:00 PM" (nullable for no break)
  breakEndTime: varchar('break_end_time', { length: 10 }), // "01:00 PM" (nullable for no break)
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const bookingSettings = pgTable('booking_settings', {
  id: integer('id').primaryKey().default(1), // Singleton pattern
  bufferMinutes: integer('buffer_minutes').notNull().default(15), // Time between appointments
  advanceBookingDays: integer('advance_booking_days').notNull().default(60), // How far ahead can book
  minimumNoticeHours: integer('minimum_notice_hours').notNull().default(24), // Minimum time before appointment
  allowSameDayBooking: boolean('allow_same_day_booking').notNull().default(false),
  maxAppointmentsPerDay: integer('max_appointments_per_day').notNull().default(8),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: varchar('updated_by', { length: 100 }),
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
export type CustomerCommunication = typeof customerCommunications.$inferSelect;
export type NewCustomerCommunication = typeof customerCommunications.$inferInsert;
export type NoteTemplate = typeof noteTemplates.$inferSelect;
export type NewNoteTemplate = typeof noteTemplates.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
export type BlockedDate = typeof blockedDates.$inferSelect;
export type NewBlockedDate = typeof blockedDates.$inferInsert;
export type BusinessHours = typeof businessHours.$inferSelect;
export type NewBusinessHours = typeof businessHours.$inferInsert;
export type BookingSettings = typeof bookingSettings.$inferSelect;
export type NewBookingSettings = typeof bookingSettings.$inferInsert;
export const websiteContent = pgTable('website_content', {
  id: varchar('id', { length: 50 }).primaryKey(),
  section: varchar('section', { length: 100 }).notNull().unique(), // "homepage_hero", "homepage_benefits", "about_story", etc.
  content: text('content').notNull(), // JSON stringified content
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: varchar('updated_by', { length: 100 }),
});

export type BusinessSettings = typeof businessSettings.$inferSelect;
export type NewBusinessSettings = typeof businessSettings.$inferInsert;
export type WebsiteContent = typeof websiteContent.$inferSelect;
export type NewWebsiteContent = typeof websiteContent.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type CustomerHealthInfo = typeof customerHealthInfo.$inferSelect;
export type NewCustomerHealthInfo = typeof customerHealthInfo.$inferInsert;
export type CustomerPreferences = typeof customerPreferences.$inferSelect;
export type NewCustomerPreferences = typeof customerPreferences.$inferInsert;
