import { db } from '@/db';
import { appointments, Appointment, NewAppointment } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Re-export customer note functions from communications lib for backward compatibility
export { getNotesByCustomerId, createCustomerNote, deleteCustomerNote } from './communications';

// Appointments CRUD using database
export async function getAllAppointments(): Promise<Appointment[]> {
  const allAppointments = await db.select().from(appointments).orderBy(desc(appointments.date), desc(appointments.time));

  // Parse JSON addons field for each appointment
  return allAppointments.map(apt => ({
    ...apt,
    addons: JSON.parse(apt.addons as string) as string[],
  })) as unknown as Appointment[];
}

export async function getAppointmentById(id: string): Promise<Appointment | undefined> {
  const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));

  if (!appointment) return undefined;

  return {
    ...appointment,
    addons: JSON.parse(appointment.addons as string) as string[],
  } as unknown as Appointment;
}

export async function getAppointmentsByCustomerId(customerId: string): Promise<Appointment[]> {
  const customerAppointments = await db.select()
    .from(appointments)
    .where(eq(appointments.customerId, customerId))
    .orderBy(desc(appointments.date));

  return customerAppointments.map(apt => ({
    ...apt,
    addons: JSON.parse(apt.addons as string) as string[],
  })) as unknown as Appointment[];
}

export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  const dateAppointments = await db.select()
    .from(appointments)
    .where(eq(appointments.date, date))
    .orderBy(appointments.time);

  return dateAppointments.map(apt => ({
    ...apt,
    addons: JSON.parse(apt.addons as string) as string[],
  })) as unknown as Appointment[];
}

export interface CreateAppointmentInput {
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  addons: string[];
  addonsTotal: number;
  date: string;
  time: string;
  duration: string;
  status: string;
  notes: string;
  createdBy: string;
}

export async function createAppointment(data: CreateAppointmentInput): Promise<Appointment> {
  const id = `apt_${nanoid(12)}`;

  const newAppointment: NewAppointment = {
    id,
    customerId: data.customerId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    servicePrice: data.servicePrice.toString(),
    addons: JSON.stringify(data.addons),
    addonsTotal: data.addonsTotal.toString(),
    date: data.date,
    time: data.time,
    duration: data.duration,
    status: data.status,
    notes: data.notes,
    createdBy: data.createdBy,
  };

  const [created] = await db.insert(appointments).values(newAppointment).returning();

  return {
    ...created,
    addons: JSON.parse(created.addons as string) as string[],
  } as unknown as Appointment;
}

export async function updateAppointment(id: string, updates: Partial<CreateAppointmentInput>): Promise<Appointment | null> {
  const updateData: Partial<NewAppointment> = {};

  if (updates.customerName !== undefined) updateData.customerName = updates.customerName;
  if (updates.customerEmail !== undefined) updateData.customerEmail = updates.customerEmail;
  if (updates.customerPhone !== undefined) updateData.customerPhone = updates.customerPhone;
  if (updates.serviceId !== undefined) updateData.serviceId = updates.serviceId;
  if (updates.serviceName !== undefined) updateData.serviceName = updates.serviceName;
  if (updates.servicePrice !== undefined) updateData.servicePrice = updates.servicePrice.toString();
  if (updates.addons !== undefined) updateData.addons = JSON.stringify(updates.addons);
  if (updates.addonsTotal !== undefined) updateData.addonsTotal = updates.addonsTotal.toString();
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.time !== undefined) updateData.time = updates.time;
  if (updates.duration !== undefined) updateData.duration = updates.duration;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  const [updated] = await db.update(appointments)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(appointments.id, id))
    .returning();

  if (!updated) return null;

  return {
    ...updated,
    addons: JSON.parse(updated.addons as string) as string[],
  } as unknown as Appointment;
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const result = await db.delete(appointments).where(eq(appointments.id, id));
  return result.rowCount !== null && result.rowCount > 0;
}

// Customer Notes functions moved to communications.ts
// See re-export at top of file for backward compatibility
