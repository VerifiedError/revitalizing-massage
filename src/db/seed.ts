import * as dotenv from 'dotenv';

// Load environment variables FIRST before importing db
dotenv.config({ path: '.env.local' });

import { db } from './index';
import { packages, addons } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed packages
  const packageData = [
    {
      id: 'pkg_001',
      name: '30 Minute Massage',
      description: 'This is typically focused on an area of complaint and does not include the whole body. This is a perfect appointment for you if you are limited on time or don\'t want full body work. Since many of us store tension in our upper back and neck, this a typical complaint and focus for a 30 minute session. This is also a good length of time to focus on shoulder complaints and work on the tight muscles of the chest, neck and upper back to help free the shoulder joint.',
      duration: '45 mins',
      basePrice: '45.00',
      currentPrice: '45.00',
      discountPercentage: '0',
      category: 'standard',
      hasAddons: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      id: 'pkg_002',
      name: '30 Minute Massage with add-on service of choice',
      description: 'This is typically focused on an area of complaint and does not include the whole body. This is a perfect appointment for you if you are limited on time or don\'t want full body work. Since many of us store tension in our upper back and neck, this is the perfect area of focus for a 30 minute session. This is also a good length of time to focus on shoulder complaints and work on the tight muscles of the chest, neck and upper back to help free the shoulder joint.',
      duration: '45 mins',
      basePrice: '55.00',
      currentPrice: '55.00',
      discountPercentage: '0',
      category: 'standard',
      hasAddons: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      id: 'pkg_003',
      name: '60 Minute Massage',
      description: 'A 60 minute session allows enough time for full body work. A typical session would involve approximately 20 minutes on the back and neck area ,7-8 minutes on each arm and leg and 10 minutes to the upper neck, scalp and face. This is an approximate time frame and varies from appointment to appointment depending on where you may have complaints that need focus work.',
      duration: '1 hr 15 mins',
      basePrice: '70.00',
      currentPrice: '70.00',
      discountPercentage: '0',
      category: 'standard',
      hasAddons: false,
      isActive: true,
      sortOrder: 3,
    },
    {
      id: 'pkg_004',
      name: '60 Minute Massage with add-on service of choice',
      description: 'A 60 minute session allows enough time for full body work. A typical session would involve approximately 20 minutes on the back and neck area ,7-8 minutes on each arm and leg and 10 minutes to the upper neck, scalp and face. This is an approximate time frame and varies from appointment to appointment depending on where you may have complaints that need focus work.',
      duration: '1 hr 15 mins',
      basePrice: '80.00',
      currentPrice: '80.00',
      discountPercentage: '0',
      category: 'standard',
      hasAddons: true,
      isActive: true,
      sortOrder: 4,
    },
    {
      id: 'pkg_005',
      name: '75 Minute Massage',
      description: 'Extended massage session with extra time for problem areas and full body coverage with more thorough work.',
      duration: '1 hr 15 mins',
      basePrice: '85.00',
      currentPrice: '85.00',
      discountPercentage: '0',
      category: 'standard',
      hasAddons: false,
      isActive: true,
      sortOrder: 5,
    },
    {
      id: 'pkg_006',
      name: '75 Minute Massage with add-on service',
      description: 'Extended massage session with extra time for problem areas and full body coverage with more thorough work, enhanced with your choice of add-on service.',
      duration: '1 hr 15 mins',
      basePrice: '95.00',
      currentPrice: '95.00',
      discountPercentage: '0',
      category: 'standard',
      hasAddons: true,
      isActive: true,
      sortOrder: 6,
    },
    {
      id: 'pkg_007',
      name: '90 Minute Massage',
      description: 'It is very much like the 60 minute session, however, it allows a little extra time for each area. This is a great for you when you feel like that last 60 minute massage "was just not long enough." About 45 minutes would be allotted to the back and neck area, or other area of complaint. Each arm and leg also has a little extra time for some focus work or deep tissue work. Many people enjoy this as it allows enough time to slow down, relax and benefit from the therapeutic effects of massage therapy.',
      duration: '1 hr 45 mins',
      basePrice: '100.00',
      currentPrice: '100.00',
      discountPercentage: '0',
      category: 'standard',
      hasAddons: false,
      isActive: true,
      sortOrder: 7,
    },
    {
      id: 'pkg_008',
      name: '90 Minute Massage with add-on service of choice',
      description: 'It is very much like the 60 minute session, however, it allows a little extra time for each area. This is a great for you when you feel like that last 60 minute massage "was just not long enough." About 45 minutes would be allotted to the back and neck area, or other area of complaint. Each arm and leg also has a little extra time for some focus work or deep tissue work. Many people enjoy this as it allows enough time to slow down, relax and benefit from the therapeutic effects of massage therapy.',
      duration: '1 hr 45 mins',
      basePrice: '110.00',
      currentPrice: '110.00',
      discountPercentage: '0',
      category: 'standard',
      hasAddons: true,
      isActive: true,
      sortOrder: 8,
    },
    {
      id: 'pkg_009',
      name: 'Prenatal Massage',
      description: 'Prenatal sessions include full-body massage with the added comfort of pillows to provide that added comfort and security! Prenatal sessions are light to light-medium pressure, no deep tissue will be offered.',
      duration: '1 hr 15 mins',
      basePrice: '75.00',
      currentPrice: '75.00',
      discountPercentage: '0',
      category: 'specialty',
      hasAddons: false,
      isActive: true,
      sortOrder: 9,
    },
    {
      id: 'pkg_010',
      name: '15-minute Chair Massage',
      description: 'You can come in and receive a 15 minute chair massage or for an additional travel fee I can come to you!',
      duration: '15 mins',
      basePrice: '20.00',
      currentPrice: '20.00',
      discountPercentage: '0',
      category: 'specialty',
      hasAddons: false,
      isActive: true,
      sortOrder: 10,
    },
  ];

  console.log('📦 Inserting packages...');
  for (const pkg of packageData) {
    await db.insert(packages).values(pkg).onConflictDoNothing();
  }
  console.log(`✓ Inserted ${packageData.length} packages`);

  // Seed addons
  const addonData = [
    {
      id: 'addon_001',
      name: 'Essential Oils',
      description: 'Aromatherapy enhancement with your choice of essential oils',
      price: '10.00',
      isActive: true,
      sortOrder: 1,
    },
    {
      id: 'addon_002',
      name: 'CBD Oil',
      description: 'CBD-infused massage oil for enhanced relaxation',
      price: '10.00',
      isActive: true,
      sortOrder: 2,
    },
    {
      id: 'addon_003',
      name: 'Exfoliation',
      description: 'Full body exfoliation treatment',
      price: '10.00',
      isActive: true,
      sortOrder: 3,
    },
    {
      id: 'addon_004',
      name: 'Hot Stones',
      description: 'Heated stone therapy for deep muscle relaxation',
      price: '10.00',
      isActive: true,
      sortOrder: 4,
    },
  ];

  console.log('✨ Inserting addons...');
  for (const addon of addonData) {
    await db.insert(addons).values(addon).onConflictDoNothing();
  }
  console.log(`✓ Inserted ${addonData.length} addons`);

  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
