import { db } from '@/db';
import { blockedDates, businessHours, bookingSettings, type BlockedDate, type BusinessHours, type BookingSettings } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

// ===== BLOCKED DATES =====

export async function getBlockedDates() {
  try {
    return await db.select().from(blockedDates).orderBy(desc(blockedDates.date));
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return [];
  }
}

export async function addBlockedDate(date: string, reason?: string, createdBy: string = 'admin') {
  try {
    await db.insert(blockedDates).values({
      id: crypto.randomUUID(),
      date,
      reason,
      createdBy,
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding blocked date:', error);
    return { success: false, error };
  }
}

export async function removeBlockedDate(id: string) {
  try {
    await db.delete(blockedDates).where(eq(blockedDates.id, id));
    return { success: true };
  } catch (error) {
    console.error('Error removing blocked date:', error);
    return { success: false, error };
  }
}

export async function isDateBlocked(date: string): Promise<boolean> {
  try {
    const result = await db.select().from(blockedDates).where(eq(blockedDates.date, date));
    return result.length > 0;
  } catch (error) {
    console.error('Error checking if date is blocked:', error);
    return false;
  }
}

// ===== BUSINESS HOURS =====

export async function getBusinessHours(): Promise<BusinessHours[]> {
  try {
    return await db.select().from(businessHours).orderBy(asc(businessHours.dayOfWeek));
  } catch (error) {
    console.error('Error fetching business hours:', error);
    return [];
  }
}

export async function updateBusinessHours(dayOfWeek: number, updates: Partial<BusinessHours>) {
  try {
    await db.update(businessHours)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businessHours.dayOfWeek, dayOfWeek));
    return { success: true };
  } catch (error) {
    console.error('Error updating business hours:', error);
    return { success: false, error };
  }
}

// ===== BOOKING SETTINGS =====

export async function getBookingSettings(): Promise<BookingSettings | null> {
  try {
    const result = await db.select().from(bookingSettings).where(eq(bookingSettings.id, 1));
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching booking settings:', error);
    return null;
  }
}

export async function updateBookingSettings(updates: Partial<BookingSettings>, updatedBy: string) {
  try {
    await db.update(bookingSettings)
      .set({ ...updates, updatedAt: new Date(), updatedBy })
      .where(eq(bookingSettings.id, 1));
    return { success: true };
  } catch (error) {
    console.error('Error updating booking settings:', error);
    return { success: false, error };
  }
}

// ===== AVAILABILITY CHECKS =====

export async function isTimeAvailable(date: string, time: string): Promise<boolean> {
  try {
    // Check if date is blocked
    const dateBlocked = await isDateBlocked(date);
    if (dateBlocked) return false;

    // Parse the date to get day of week (0=Sunday, 1=Monday, etc.)
    const dateObj = new Date(date + 'T12:00:00');
    const dayOfWeek = dateObj.getDay();

    // Get business hours for this day
    const hours = await db.select().from(businessHours).where(eq(businessHours.dayOfWeek, dayOfWeek));
    if (hours.length === 0) return false;

    const dayHours = hours[0];

    // Check if closed on this day
    if (!dayHours.isOpen) return false;

    // TODO: Add time range validation (is time within open/close hours?)
    // TODO: Add break time validation (is time during break?)
    // This will require parsing time strings and comparing

    return true;
  } catch (error) {
    console.error('Error checking if time is available:', error);
    return false;
  }
}
