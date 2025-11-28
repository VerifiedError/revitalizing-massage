import 'dotenv/config';
import { db } from './index';
import { appointments, revenueRecords } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Revenue Migration Script
 *
 * This script migrates existing completed appointments to revenue records.
 * Run with: npm run db:seed:revenue
 */

async function seedRevenueFromAppointments() {
  console.log('🚀 Starting revenue migration from appointments...\n');

  try {
    // Fetch all completed appointments
    const completedAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.status, 'completed'));

    console.log(`📊 Found ${completedAppointments.length} completed appointments\n`);

    if (completedAppointments.length === 0) {
      console.log('✅ No completed appointments to migrate');
      return;
    }

    let created = 0;
    let skipped = 0;

    for (const appointment of completedAppointments) {
      // Check if revenue record already exists for this appointment
      const existing = await db
        .select()
        .from(revenueRecords)
        .where(eq(revenueRecords.appointmentId, appointment.id));

      if (existing.length > 0) {
        console.log(`⏭️  Skipping appointment ${appointment.id} - revenue record already exists`);
        skipped++;
        continue;
      }

      // Calculate totals
      const servicePrice = parseFloat(appointment.servicePrice);
      const addonsTotal = parseFloat(appointment.addonsTotal || '0');
      const subtotal = servicePrice + addonsTotal;
      const totalAmount = subtotal; // No tax or discount for now

      // Create revenue record
      const revenueRecord = {
        id: `rev_${appointment.id}`,
        appointmentId: appointment.id,
        customerId: appointment.customerId,
        date: appointment.date,
        serviceId: appointment.serviceId,
        serviceName: appointment.serviceName,
        servicePrice: appointment.servicePrice,
        addonsTotal: appointment.addonsTotal,
        discountAmount: '0',
        subtotal: subtotal.toString(),
        taxAmount: '0',
        totalAmount: totalAmount.toString(),
        paymentStatus: 'paid', // Assume completed appointments are paid
        paymentMethod: null, // Unknown for historical data
        paidAt: appointment.updatedAt || appointment.createdAt,
        notes: appointment.notes,
        createdBy: appointment.createdBy,
      };

      await db.insert(revenueRecords).values(revenueRecord);

      console.log(`✅ Created revenue record for appointment ${appointment.id}`);
      console.log(`   📅 Date: ${appointment.date}`);
      console.log(`   💼 Service: ${appointment.serviceName}`);
      console.log(`   💰 Total: $${totalAmount.toFixed(2)}\n`);

      created++;
    }

    console.log('\n🎉 Revenue migration completed!');
    console.log(`   ✅ Created: ${created} records`);
    console.log(`   ⏭️  Skipped: ${skipped} records (already exist)`);
    console.log(`   📊 Total: ${completedAppointments.length} appointments processed\n`);

    // Display revenue summary
    const totalRevenue = completedAppointments.reduce((sum, apt) => {
      const servicePrice = parseFloat(apt.servicePrice);
      const addonsTotal = parseFloat(apt.addonsTotal || '0');
      return sum + servicePrice + addonsTotal;
    }, 0);

    console.log(`💵 Total Revenue from Migrated Records: $${totalRevenue.toFixed(2)}`);
    console.log(`💰 Average Transaction Value: $${(totalRevenue / completedAppointments.length).toFixed(2)}\n`);

  } catch (error) {
    console.error('❌ Error during revenue migration:', error);
    throw error;
  }
}

// Run the migration
seedRevenueFromAppointments()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
