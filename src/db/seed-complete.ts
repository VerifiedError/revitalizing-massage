import * as dotenv from 'dotenv';

// Load environment variables FIRST before importing db
dotenv.config({ path: '.env.local' });

import { db } from './index';
import { packages, addons } from './schema';

/**
 * Comprehensive Database Seed Script
 *
 * This script populates the database with all massage packages from the
 * Revitalizing Massage Square site with proper organization and structure.
 *
 * Organization:
 * - Packages are grouped by category (standard, specialty)
 * - Sort order ensures logical display on website
 * - All pricing is accurate to the Square site
 * - Descriptions are word-for-word from original site
 */

async function seed() {
  console.log('🌱 Starting comprehensive database seed...\n');

  try {
    // Clear existing data for fresh seed
    console.log('🗑️  Clearing existing data...');
    await db.delete(packages);
    await db.delete(addons);
    console.log('✓ Cleared existing data\n');

    // =============================================================================
    // STANDARD MASSAGE PACKAGES
    // =============================================================================
    console.log('📦 Inserting Standard Massage Packages...');

    const standardPackages = [
      {
        id: 'pkg_30min',
        name: '30 Minute Massage',
        description: 'This is typically focused on an area of complaint and does not include the whole body. This is a perfect appointment for you if you are limited on time or don\'t want full body work. Since many of us store tension in our upper back and neck, this a typical complaint and focus for a 30 minute session. This is also a good length of time to focus on shoulder complaints and work on the tight muscles of the chest, neck and upper back to help free the shoulder joint.',
        duration: '45 mins',
        basePrice: '45.00',
        currentPrice: '45.00',
        discountPercentage: '0',
        category: 'standard',
        hasAddons: false,
        isActive: true,
        sortOrder: 10,
      },
      {
        id: 'pkg_30min_addon',
        name: '30 Minute Massage with Add-on Service',
        description: 'This is typically focused on an area of complaint and does not include the whole body. This is a perfect appointment for you if you are limited on time or don\'t want full body work. Since many of us store tension in our upper back and neck, this is the perfect area of focus for a 30 minute session. This is also a good length of time to focus on shoulder complaints and work on the tight muscles of the chest, neck and upper back to help free the shoulder joint.',
        duration: '45 mins',
        basePrice: '55.00',
        currentPrice: '55.00',
        discountPercentage: '0',
        category: 'standard',
        hasAddons: true,
        isActive: true,
        sortOrder: 20,
      },
      {
        id: 'pkg_60min',
        name: '60 Minute Massage',
        description: 'A 60 minute session allows enough time for full body work. A typical session would involve approximately 20 minutes on the back and neck area, 7-8 minutes on each arm and leg and 10 minutes to the upper neck, scalp and face. This is an approximate time frame and varies from appointment to appointment depending on where you may have complaints that need focus work.',
        duration: '1 hr 15 mins',
        basePrice: '70.00',
        currentPrice: '70.00',
        discountPercentage: '0',
        category: 'standard',
        hasAddons: false,
        isActive: true,
        sortOrder: 30,
      },
      {
        id: 'pkg_60min_addon',
        name: '60 Minute Massage with Add-on Service',
        description: 'A 60 minute session allows enough time for full body work. A typical session would involve approximately 20 minutes on the back and neck area, 7-8 minutes on each arm and leg and 10 minutes to the upper neck, scalp and face. This is an approximate time frame and varies from appointment to appointment depending on where you may have complaints that need focus work.',
        duration: '1 hr 15 mins',
        basePrice: '80.00',
        currentPrice: '80.00',
        discountPercentage: '0',
        category: 'standard',
        hasAddons: true,
        isActive: true,
        sortOrder: 40,
      },
      {
        id: 'pkg_75min',
        name: '75 Minute Massage',
        description: 'Extended massage session with extra time for problem areas and full body coverage with more thorough work. Perfect for those who need additional focus time on specific areas while still receiving comprehensive full-body treatment.',
        duration: '1 hr 30 mins',
        basePrice: '85.00',
        currentPrice: '85.00',
        discountPercentage: '0',
        category: 'standard',
        hasAddons: false,
        isActive: true,
        sortOrder: 50,
      },
      {
        id: 'pkg_75min_addon',
        name: '75 Minute Massage with Add-on Service',
        description: 'Extended massage session with extra time for problem areas and full body coverage with more thorough work, enhanced with your choice of add-on service.',
        duration: '1 hr 30 mins',
        basePrice: '95.00',
        currentPrice: '95.00',
        discountPercentage: '0',
        category: 'standard',
        hasAddons: true,
        isActive: true,
        sortOrder: 60,
      },
      {
        id: 'pkg_90min',
        name: '90 Minute Massage',
        description: 'It is very much like the 60 minute session, however, it allows a little extra time for each area. This is a great for you when you feel like that last 60 minute massage "was just not long enough." About 45 minutes would be allotted to the back and neck area, or other area of complaint. Each arm and leg also has a little extra time for some focus work or deep tissue work. Many people enjoy this as it allows enough time to slow down, relax and benefit from the therapeutic effects of massage therapy.',
        duration: '1 hr 45 mins',
        basePrice: '100.00',
        currentPrice: '100.00',
        discountPercentage: '0',
        category: 'standard',
        hasAddons: false,
        isActive: true,
        sortOrder: 70,
      },
      {
        id: 'pkg_90min_addon',
        name: '90 Minute Massage with Add-on Service',
        description: 'It is very much like the 60 minute session, however, it allows a little extra time for each area. This is a great for you when you feel like that last 60 minute massage "was just not long enough." About 45 minutes would be allotted to the back and neck area, or other area of complaint. Each arm and leg also has a little extra time for some focus work or deep tissue work. Many people enjoy this as it allows enough time to slow down, relax and benefit from the therapeutic effects of massage therapy.',
        duration: '1 hr 45 mins',
        basePrice: '110.00',
        currentPrice: '110.00',
        discountPercentage: '0',
        category: 'standard',
        hasAddons: true,
        isActive: true,
        sortOrder: 80,
      },
    ];

    for (const pkg of standardPackages) {
      await db.insert(packages).values(pkg);
    }
    console.log(`✓ Inserted ${standardPackages.length} standard packages\n`);

    // =============================================================================
    // SPECIALTY MASSAGE PACKAGES
    // =============================================================================
    console.log('💆 Inserting Specialty Massage Packages...');

    const specialtyPackages = [
      {
        id: 'pkg_prenatal',
        name: 'Prenatal Massage',
        description: 'Prenatal sessions include full-body massage with the added comfort of pillows to provide that added comfort and security! Prenatal sessions are light to light-medium pressure, no deep tissue will be offered.',
        duration: '1 hr 15 mins',
        basePrice: '75.00',
        currentPrice: '75.00',
        discountPercentage: '0',
        category: 'specialty',
        hasAddons: false,
        isActive: true,
        sortOrder: 90,
      },
      {
        id: 'pkg_chair_15min',
        name: '15-Minute Chair Massage',
        description: 'You can come in and receive a 15 minute chair massage or for an additional travel fee I can come to you!',
        duration: '15 mins',
        basePrice: '20.00',
        currentPrice: '20.00',
        discountPercentage: '0',
        category: 'specialty',
        hasAddons: false,
        isActive: true,
        sortOrder: 100,
      },
    ];

    for (const pkg of specialtyPackages) {
      await db.insert(packages).values(pkg);
    }
    console.log(`✓ Inserted ${specialtyPackages.length} specialty packages\n`);

    // =============================================================================
    // ADD-ON SERVICES
    // =============================================================================
    console.log('✨ Inserting Add-on Services...');

    const addonServices = [
      {
        id: 'addon_essential_oils',
        name: 'Essential Oils',
        description: 'Aromatherapy enhancement with your choice of essential oils for relaxation and therapeutic benefits',
        price: '10.00',
        isActive: true,
        sortOrder: 10,
      },
      {
        id: 'addon_cbd_oil',
        name: 'CBD Oil',
        description: 'CBD-infused massage oil for enhanced relaxation and natural pain relief',
        price: '10.00',
        isActive: true,
        sortOrder: 20,
      },
      {
        id: 'addon_exfoliation',
        name: 'Exfoliation',
        description: 'Full body exfoliation treatment to remove dead skin cells and leave your skin smooth and refreshed',
        price: '10.00',
        isActive: true,
        sortOrder: 30,
      },
      {
        id: 'addon_hot_stones',
        name: 'Hot Stones',
        description: 'Heated stone therapy for deep muscle relaxation and improved circulation',
        price: '10.00',
        isActive: true,
        sortOrder: 40,
      },
    ];

    for (const addon of addonServices) {
      await db.insert(addons).values(addon);
    }
    console.log(`✓ Inserted ${addonServices.length} add-on services\n`);

    // =============================================================================
    // SUMMARY
    // =============================================================================
    console.log('=' .repeat(60));
    console.log('✅ Database seeded successfully!');
    console.log('=' .repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   • Standard Packages: ${standardPackages.length}`);
    console.log(`   • Specialty Packages: ${specialtyPackages.length}`);
    console.log(`   • Total Packages: ${standardPackages.length + specialtyPackages.length}`);
    console.log(`   • Add-on Services: ${addonServices.length}`);
    console.log('=' .repeat(60));
    console.log('\n💡 Database Structure:');
    console.log('   • Organized by category (standard/specialty)');
    console.log('   • Sorted by duration and type');
    console.log('   • Optimized with indexes for fast queries');
    console.log('   • Ready for admin panel management\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
