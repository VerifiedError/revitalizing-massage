import { db } from '@/db';
import { businessSettings, BusinessSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Fetch business settings from the database
 * Returns the singleton business settings record
 */
export async function getBusinessSettings(): Promise<BusinessSettings | null> {
  try {
    const settings = await db.select().from(businessSettings).where(eq(businessSettings.id, 1));
    return settings.length > 0 ? settings[0] : null;
  } catch (error) {
    console.error('Error fetching business settings:', error);
    return null;
  }
}

/**
 * Get business settings with fallback to hardcoded values
 * This ensures the site never breaks if database is unavailable
 */
export async function getBusinessSettingsWithFallback(): Promise<BusinessSettings> {
  const settings = await getBusinessSettings();

  if (settings) {
    return settings;
  }

  // Fallback to hardcoded values (from original src/data/services.ts)
  return {
    id: 1,
    businessName: 'Revitalizing Massage',
    phone: '+1 785-250-4599',
    phoneDisplay: '(785) 250-4599',
    email: 'alannahsrevitalizingmassage@gmail.com',
    addressStreet: '2900 SW Atwood',
    addressCity: 'Topeka',
    addressState: 'KS',
    addressZip: '66614',
    addressFull: '2900 SW Atwood, Topeka, KS 66614',
    timezone: 'America/Chicago',
    taxRate: '0',
    currency: 'USD',
    updatedAt: new Date(),
    updatedBy: null,
  };
}

/**
 * Format phone number for display
 * Converts +1 785-250-4599 to (785) 250-4599
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If it starts with 1 (country code), remove it
  const localDigits = digits.startsWith('1') ? digits.slice(1) : digits;

  // Format as (XXX) XXX-XXXX
  if (localDigits.length === 10) {
    return `(${localDigits.slice(0, 3)}) ${localDigits.slice(3, 6)}-${localDigits.slice(6)}`;
  }

  // Return as-is if not 10 digits
  return phone;
}
