import { db } from '@/db';
import { blockedDates, type BlockedDate } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

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
      // @ts-ignore - id is auto-generated if not provided? No, schema says varchar(50). I need to generate ID.
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
