import 'dotenv/config';
import { db } from './index';
import { customers, customerHealthInfo, customerPreferences, appointments } from './schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

/**
 * Seed script to migrate customers from existing appointments
 * Extracts unique customers from appointments and creates customer records
 */

async function seedCustomers() {
  try {
    console.log('🌱 Starting customer migration from appointments...\n');

    // Get all appointments
    const allAppointments = await db.select().from(appointments);
    console.log(`Found ${allAppointments.length} appointments\n`);

    if (allAppointments.length === 0) {
      console.log('No appointments found. Nothing to migrate.');
      return;
    }

    // Extract unique customers by email
    const customerMap = new Map<string, any>();

    allAppointments.forEach(apt => {
      if (apt.customerEmail) {
        const email = apt.customerEmail.toLowerCase();

        if (!customerMap.has(email)) {
          // Extract first and last name from customerName
          const nameParts = apt.customerName.trim().split(' ');
          const firstName = nameParts[0] || 'Unknown';
          const lastName = nameParts.slice(1).join(' ') || 'Customer';

          customerMap.set(email, {
            firstName,
            lastName,
            email: apt.customerEmail,
            phone: apt.customerPhone || null,
          });
        }
      }
    });

    console.log(`Found ${customerMap.size} unique customers\n`);

    // Create customer records
    const createdCustomers: string[] = [];

    for (const [email, customerData] of customerMap) {
      try {
        // Check if customer already exists
        const [existing] = await db
          .select()
          .from(customers)
          .where(eq(customers.email, email));

        if (existing) {
          console.log(`⏭️  Customer already exists: ${customerData.email}`);
          createdCustomers.push(existing.id);
          continue;
        }

        // Create customer
        const customerId = nanoid(16);
        await db.insert(customers).values({
          id: customerId,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          status: 'active',
          marketingOptIn: false,
        });

        // Create default health info record
        await db.insert(customerHealthInfo).values({
          id: nanoid(16),
          customerId,
        });

        // Create default preferences record
        await db.insert(customerPreferences).values({
          id: nanoid(16),
          customerId,
        });

        console.log(`✅ Created customer: ${customerData.firstName} ${customerData.lastName} (${email})`);
        createdCustomers.push(customerId);
      } catch (error) {
        console.error(`❌ Error creating customer ${email}:`, error);
      }
    }

    console.log(`\n✅ Successfully created/verified ${createdCustomers.length} customers\n`);

    // Now update appointments to link to customer IDs
    console.log('🔗 Linking appointments to customers...\n');

    let linkedCount = 0;

    for (const apt of allAppointments) {
      if (apt.customerEmail) {
        try {
          // Find customer by email
          const [customer] = await db
            .select()
            .from(customers)
            .where(eq(customers.email, apt.customerEmail));

          if (customer) {
            // Update appointment with customer ID
            await db
              .update(appointments)
              .set({ customerId: customer.id })
              .where(eq(appointments.id, apt.id));

            linkedCount++;
          }
        } catch (error) {
          console.error(`❌ Error linking appointment ${apt.id}:`, error);
        }
      }
    }

    console.log(`✅ Linked ${linkedCount} appointments to customers\n`);

    // Calculate customer stats
    console.log('📊 Calculating customer statistics...\n');

    for (const customerId of createdCustomers) {
      try {
        // Get completed appointments for this customer
        const customerAppointments = await db
          .select()
          .from(appointments)
          .where(eq(appointments.customerId, customerId));

        const completedAppointments = customerAppointments.filter(
          apt => apt.status === 'completed'
        );

        // Calculate stats
        const totalVisits = completedAppointments.length;

        const totalSpent = completedAppointments.reduce((sum, apt) => {
          const servicePrice = parseFloat(apt.servicePrice);
          const addonsTotal = parseFloat(apt.addonsTotal);
          return sum + servicePrice + addonsTotal;
        }, 0);

        // Find most recent appointment date
        let lastVisit: string | null = null;
        if (completedAppointments.length > 0) {
          const sortedAppointments = [...completedAppointments].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          lastVisit = sortedAppointments[0].date;
        }

        // Update customer record
        await db
          .update(customers)
          .set({
            totalVisits,
            totalSpent: totalSpent.toFixed(2),
            lastVisit,
          })
          .where(eq(customers.id, customerId));

        console.log(`📊 Updated stats for customer ID ${customerId}`);
      } catch (error) {
        console.error(`❌ Error calculating stats for customer ${customerId}:`, error);
      }
    }

    console.log('\n✅ Customer migration completed successfully!\n');
    console.log('Summary:');
    console.log(`- Total customers created/verified: ${createdCustomers.length}`);
    console.log(`- Appointments linked: ${linkedCount}`);
    console.log(`- Customer stats calculated: ${createdCustomers.length}\n`);
  } catch (error) {
    console.error('❌ Error during customer migration:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedCustomers();
