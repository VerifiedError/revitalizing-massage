import { db } from './index';
import { businessSettings } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Seed business settings with initial data
 * This creates or updates the singleton business settings record
 */
async function seedBusinessSettings() {
  console.log('Seeding business settings...');

  try {
    // Check if settings already exist
    const existing = await db.select().from(businessSettings).where(eq(businessSettings.id, 1));

    const defaultSettings = {
      id: 1,
      businessName: 'Revitalizing Massage',
      phone: '+17852504599',
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

    if (existing.length === 0) {
      // Insert new settings
      await db.insert(businessSettings).values(defaultSettings);
      console.log('✓ Business settings created');
    } else {
      console.log('✓ Business settings already exist');
    }
  } catch (error) {
    console.error('Error seeding business settings:', error);
    throw error;
  }
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedBusinessSettings()
    .then(() => {
      console.log('Business settings seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Business settings seeding failed:', error);
      process.exit(1);
    });
}

export { seedBusinessSettings };
