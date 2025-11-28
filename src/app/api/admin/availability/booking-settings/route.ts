import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getBookingSettings, updateBookingSettings } from '@/lib/availability';

// GET /api/admin/availability/booking-settings
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getBookingSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[BOOKING_SETTINGS_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch booking settings' }, { status: 500 });
  }
}

// PATCH /api/admin/availability/booking-settings
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates = await request.json();

    const result = await updateBookingSettings(updates, userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update booking settings' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[BOOKING_SETTINGS_PATCH]', error);
    return NextResponse.json({ error: 'Failed to update booking settings' }, { status: 500 });
  }
}
