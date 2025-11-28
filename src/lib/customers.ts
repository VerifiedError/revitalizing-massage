import { db } from '@/db';
import {
  customers,
  customerHealthInfo,
  customerPreferences,
  appointments,
  customerNotes,
  Customer,
  CustomerHealthInfo,
  CustomerPreferences,
  NewCustomer,
  NewCustomerHealthInfo,
  NewCustomerPreferences,
  Appointment,
  CustomerNote
} from '@/db/schema';
import { eq, desc, asc, like, or, and, sql, SQL } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export interface CustomerWithStats extends Customer {
  // Already includes totalVisits, totalSpent, lastVisit from schema
}

export interface CustomerDetails {
  customer: Customer;
  healthInfo: CustomerHealthInfo | null;
  preferences: CustomerPreferences | null;
  appointments: Appointment[];
  notes: CustomerNote[];
}

export interface GetCustomersOptions {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Get all customers with optional search, filter, and sort
 */
export async function getAllCustomers(options: GetCustomersOptions = {}): Promise<Customer[]> {
  const {
    search,
    status,
    sortBy = 'lastName',
    sortOrder = 'asc',
    limit,
    offset = 0
  } = options;

  // Build the query conditions
  const conditions: SQL[] = [];

  // Search by name, email, or phone
  if (search) {
    const searchPattern = `%${search}%`;
    conditions.push(
      or(
        like(customers.firstName, searchPattern),
        like(customers.lastName, searchPattern),
        like(customers.email, searchPattern),
        like(customers.phone, searchPattern)
      )!
    );
  }

  // Filter by status
  if (status) {
    conditions.push(eq(customers.status, status));
  }

  // Build WHERE clause
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Determine sort column
  let orderByColumn: any;
  switch (sortBy) {
    case 'firstName':
      orderByColumn = customers.firstName;
      break;
    case 'lastName':
      orderByColumn = customers.lastName;
      break;
    case 'email':
      orderByColumn = customers.email;
      break;
    case 'totalVisits':
      orderByColumn = customers.totalVisits;
      break;
    case 'totalSpent':
      orderByColumn = customers.totalSpent;
      break;
    case 'lastVisit':
      orderByColumn = customers.lastVisit;
      break;
    case 'createdAt':
      orderByColumn = customers.createdAt;
      break;
    default:
      orderByColumn = customers.lastName;
  }

  // Build query
  let query = db.select().from(customers);

  if (whereClause) {
    query = query.where(whereClause) as any;
  }

  // Apply sorting
  if (sortOrder === 'desc') {
    query = query.orderBy(desc(orderByColumn)) as any;
  } else {
    query = query.orderBy(asc(orderByColumn)) as any;
  }

  // Apply pagination
  if (limit) {
    query = query.limit(limit) as any;
  }
  if (offset > 0) {
    query = query.offset(offset) as any;
  }

  return await query;
}

/**
 * Get customer by ID with all related data
 */
export async function getCustomerById(id: string): Promise<CustomerDetails | null> {
  const [customer] = await db.select().from(customers).where(eq(customers.id, id));

  if (!customer) {
    return null;
  }

  // Get health info
  const [healthInfo] = await db.select()
    .from(customerHealthInfo)
    .where(eq(customerHealthInfo.customerId, id));

  // Get preferences
  const [preferences] = await db.select()
    .from(customerPreferences)
    .where(eq(customerPreferences.customerId, id));

  // Get appointments
  const customerAppointments = await db.select()
    .from(appointments)
    .where(eq(appointments.customerId, id))
    .orderBy(desc(appointments.date));

  // Parse addons for each appointment
  const parsedAppointments = customerAppointments.map(apt => ({
    ...apt,
    addons: JSON.parse(apt.addons as string) as string[],
  })) as unknown as Appointment[];

  // Get notes
  const notes = await db.select()
    .from(customerNotes)
    .where(eq(customerNotes.customerId, id))
    .orderBy(desc(customerNotes.createdAt));

  return {
    customer,
    healthInfo: healthInfo || null,
    preferences: preferences || null,
    appointments: parsedAppointments,
    notes
  };
}

/**
 * Create a new customer with default health info and preferences
 */
export async function createCustomer(data: Omit<NewCustomer, 'id'>): Promise<Customer> {
  const customerId = nanoid(16);

  // Create customer
  const [customer] = await db.insert(customers).values({
    id: customerId,
    ...data,
  }).returning();

  // Create default health info record
  await db.insert(customerHealthInfo).values({
    id: nanoid(16),
    customerId,
  });

  // Create default preferences record
  await db.insert(customerPreferences).values({
    id: nanoid(16),
    customerId,
  });

  return customer;
}

/**
 * Update customer information
 */
export async function updateCustomer(id: string, data: Partial<Omit<NewCustomer, 'id'>>): Promise<Customer | null> {
  const [updated] = await db.update(customers)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, id))
    .returning();

  return updated || null;
}

/**
 * Delete customer (cascades to health info, preferences)
 */
export async function deleteCustomer(id: string): Promise<boolean> {
  const result = await db.delete(customers).where(eq(customers.id, id));
  return true;
}

/**
 * Get customer health info
 */
export async function getCustomerHealthInfo(customerId: string): Promise<CustomerHealthInfo | null> {
  const [healthInfo] = await db.select()
    .from(customerHealthInfo)
    .where(eq(customerHealthInfo.customerId, customerId));

  return healthInfo || null;
}

/**
 * Update customer health info
 */
export async function updateCustomerHealthInfo(
  customerId: string,
  data: Partial<NewCustomerHealthInfo>
): Promise<CustomerHealthInfo | null> {
  // Check if health info exists
  const existing = await getCustomerHealthInfo(customerId);

  if (!existing) {
    // Create new health info record
    const [created] = await db.insert(customerHealthInfo).values({
      id: nanoid(16),
      customerId,
      ...data,
    }).returning();
    return created;
  }

  // Update existing record
  const [updated] = await db.update(customerHealthInfo)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(customerHealthInfo.customerId, customerId))
    .returning();

  return updated || null;
}

/**
 * Get customer preferences
 */
export async function getCustomerPreferences(customerId: string): Promise<CustomerPreferences | null> {
  const [preferences] = await db.select()
    .from(customerPreferences)
    .where(eq(customerPreferences.customerId, customerId));

  return preferences || null;
}

/**
 * Update customer preferences
 */
export async function updateCustomerPreferences(
  customerId: string,
  data: Partial<NewCustomerPreferences>
): Promise<CustomerPreferences | null> {
  // Check if preferences exist
  const existing = await getCustomerPreferences(customerId);

  if (!existing) {
    // Create new preferences record
    const [created] = await db.insert(customerPreferences).values({
      id: nanoid(16),
      customerId,
      ...data,
    }).returning();
    return created;
  }

  // Update existing record
  const [updated] = await db.update(customerPreferences)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(customerPreferences.customerId, customerId))
    .returning();

  return updated || null;
}

/**
 * Get customer appointments
 */
export async function getCustomerAppointments(customerId: string): Promise<Appointment[]> {
  const customerAppointments = await db.select()
    .from(appointments)
    .where(eq(appointments.customerId, customerId))
    .orderBy(desc(appointments.date));

  return customerAppointments.map(apt => ({
    ...apt,
    addons: JSON.parse(apt.addons as string) as string[],
  })) as unknown as Appointment[];
}

/**
 * Update customer stats (totalVisits, totalSpent, lastVisit) based on appointments
 */
export async function updateCustomerStats(customerId: string): Promise<void> {
  // Get all completed appointments for this customer
  const completedAppointments = await db.select()
    .from(appointments)
    .where(
      and(
        eq(appointments.customerId, customerId),
        eq(appointments.status, 'completed')
      )
    );

  // Calculate stats
  const totalVisits = completedAppointments.length;

  const totalSpent = completedAppointments.reduce((sum, apt) => {
    const servicePrice = parseFloat(apt.servicePrice);
    const addonsTotal = parseFloat(apt.addonsTotal);
    return sum + servicePrice + addonsTotal;
  }, 0);

  // Find most recent appointment date
  let lastVisit: string | null = null;
  if (completedAppointments.length > 0) {
    // Sort by date descending and get first
    const sortedAppointments = [...completedAppointments].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    lastVisit = sortedAppointments[0].date;
  }

  // Update customer record
  await db.update(customers)
    .set({
      totalVisits,
      totalSpent: totalSpent.toFixed(2),
      lastVisit,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, customerId));
}

/**
 * Search customers by email (for finding existing customers during appointment creation)
 */
export async function findCustomerByEmail(email: string): Promise<Customer | null> {
  const [customer] = await db.select()
    .from(customers)
    .where(eq(customers.email, email));

  return customer || null;
}

/**
 * Get customer count by status
 */
export async function getCustomerCountByStatus(): Promise<Record<string, number>> {
  const allCustomers = await db.select().from(customers);

  const counts: Record<string, number> = {
    active: 0,
    inactive: 0,
    blocked: 0,
    total: allCustomers.length
  };

  allCustomers.forEach(customer => {
    counts[customer.status] = (counts[customer.status] || 0) + 1;
  });

  return counts;
}
