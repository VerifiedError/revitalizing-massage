import * as dotenv from 'dotenv';

// Load environment variables FIRST before importing db
dotenv.config({ path: '.env.local' });

import { db } from './index';
import { businessSettings } from './schema';

async function seedBusinessSettings() {
  console.log('🌱 Seeding business settings...');

  try {
    // Insert or update the single business settings record
    await db.insert(businessSettings).values({
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
    }).onConflictDoUpdate({
      target: businessSettings.id,
      set: {
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
        updatedAt: new Date(),
      },
    });

    console.log('✅ Business settings seeded successfully!');
    console.log('   - Business Name: Revitalizing Massage');
    console.log('   - Phone: (785) 250-4599');
    console.log('   - Email: alannahsrevitalizingmassage@gmail.com');
    console.log('   - Address: 2900 SW Atwood, Topeka, KS 66614');
  } catch (error) {
    console.error('❌ Error seeding business settings:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedBusinessSettings()
    .then(() => {
      console.log('✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

export { seedBusinessSettings };
