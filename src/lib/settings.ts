import { db } from '@/db';
import { settings, type Setting } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getSettings(category?: string) {
  try {
    const query = db.select().from(settings);
    
    if (category) {
      // @ts-ignore - where clause type inference can be tricky
      return await query.where(eq(settings.category, category));
    }
    
    return await query;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return [];
  }
}

export async function getSetting(key: string) {
  try {
    const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

export async function updateSetting(key: string, value: any, category: string = 'general') {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    await db
      .insert(settings)
      .values({
        key,
        value: stringValue,
        category,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value: stringValue,
          category,
          updatedAt: new Date(),
        },
      });
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return { success: false, error };
  }
}

export const defaultBusinessInfo = {
  name: "Revitalizing Massage",
  phone: "+1 785-250-4599",
  phoneDisplay: "(785) 250-4599",
  email: "alannahsrevitalizingmassage@gmail.com",
  address: {
    street: "2900 SW Atwood",
    city: "Topeka",
    state: "KS",
    zip: "66614",
  },
  hours: {
    weekdays: "By Appointment",
    saturday: "By Appointment",
    sunday: "Closed"
  }
};

export async function initializeDefaultSettings() {
  // Check if settings exist, if not, populate with defaults
  const existing = await getSettings('business');
  if (existing.length === 0) {
    console.log('Initializing default settings...');
    const batch = [
      updateSetting('business_name', defaultBusinessInfo.name, 'business'),
      updateSetting('business_phone', defaultBusinessInfo.phone, 'business'),
      updateSetting('business_phone_display', defaultBusinessInfo.phoneDisplay, 'business'),
      updateSetting('business_email', defaultBusinessInfo.email, 'business'),
      updateSetting('business_address_street', defaultBusinessInfo.address.street, 'business'),
      updateSetting('business_address_city', defaultBusinessInfo.address.city, 'business'),
      updateSetting('business_address_state', defaultBusinessInfo.address.state, 'business'),
      updateSetting('business_address_zip', defaultBusinessInfo.address.zip, 'business'),
      updateSetting('business_hours_weekdays', defaultBusinessInfo.hours.weekdays, 'business'),
      updateSetting('business_hours_saturday', defaultBusinessInfo.hours.saturday, 'business'),
      updateSetting('business_hours_sunday', defaultBusinessInfo.hours.sunday, 'business'),
    ];
    await Promise.all(batch);
  }
}
