import 'dotenv/config';
import { db } from './index';
import { businessHours, bookingSettings } from './schema';

async function seedAvailability() {
  console.log('🌱 Seeding availability data...');

  try {
    // Seed Business Hours (7 days: Sunday-Saturday)
    console.log('Creating business hours...');

    const defaultHours = [
      // Sunday - Closed
      {
        id: 0,
        dayOfWeek: 0,
        dayName: 'Sunday',
        isOpen: false,
        openTime: null,
        closeTime: null,
        breakStartTime: null,
        breakEndTime: null,
      },
      // Monday - 9 AM to 6 PM
      {
        id: 1,
        dayOfWeek: 1,
        dayName: 'Monday',
        isOpen: true,
        openTime: '09:00 AM',
        closeTime: '06:00 PM',
        breakStartTime: null,
        breakEndTime: null,
      },
      // Tuesday - 9 AM to 6 PM
      {
        id: 2,
        dayOfWeek: 2,
        dayName: 'Tuesday',
        isOpen: true,
        openTime: '09:00 AM',
        closeTime: '06:00 PM',
        breakStartTime: null,
        breakEndTime: null,
      },
      // Wednesday - 9 AM to 6 PM
      {
        id: 3,
        dayOfWeek: 3,
        dayName: 'Wednesday',
        isOpen: true,
        openTime: '09:00 AM',
        closeTime: '06:00 PM',
        breakStartTime: null,
        breakEndTime: null,
      },
      // Thursday - 9 AM to 6 PM
      {
        id: 4,
        dayOfWeek: 4,
        dayName: 'Thursday',
        isOpen: true,
        openTime: '09:00 AM',
        closeTime: '06:00 PM',
        breakStartTime: null,
        breakEndTime: null,
      },
      // Friday - 9 AM to 6 PM
      {
        id: 5,
        dayOfWeek: 5,
        dayName: 'Friday',
        isOpen: true,
        openTime: '09:00 AM',
        closeTime: '06:00 PM',
        breakStartTime: null,
        breakEndTime: null,
      },
      // Saturday - 10 AM to 4 PM
      {
        id: 6,
        dayOfWeek: 6,
        dayName: 'Saturday',
        isOpen: true,
        openTime: '10:00 AM',
        closeTime: '04:00 PM',
        breakStartTime: null,
        breakEndTime: null,
      },
    ];

    await db.insert(businessHours).values(defaultHours).onConflictDoNothing();
    console.log('✅ Business hours created (7 days)');

    // Seed Booking Settings (singleton)
    console.log('Creating booking settings...');

    await db.insert(bookingSettings).values({
      id: 1,
      bufferMinutes: 15,
      advanceBookingDays: 60,
      minimumNoticeHours: 24,
      allowSameDayBooking: false,
      maxAppointmentsPerDay: 8,
      updatedBy: 'system',
    }).onConflictDoNothing();
    console.log('✅ Booking settings created');

    console.log('✅ Availability seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding availability data:', error);
    throw error;
  }
}

// Run the seed function
seedAvailability()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
