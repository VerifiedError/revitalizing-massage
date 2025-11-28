import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getBusinessHours, updateBusinessHours } from '@/lib/availability';

// GET /api/admin/availability/hours
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const hours = await getBusinessHours();
    return NextResponse.json(hours);
  } catch (error) {
    console.error('[BUSINESS_HOURS_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch business hours' }, { status: 500 });
  }
}

// PATCH /api/admin/availability/hours
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { dayOfWeek, updates } = body;

    if (dayOfWeek === undefined || !updates) {
      return NextResponse.json({ error: 'dayOfWeek and updates are required' }, { status: 400 });
    }

    const result = await updateBusinessHours(dayOfWeek, updates);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update business hours' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[BUSINESS_HOURS_PATCH]', error);
    return NextResponse.json({ error: 'Failed to update business hours' }, { status: 500 });
  }
}
