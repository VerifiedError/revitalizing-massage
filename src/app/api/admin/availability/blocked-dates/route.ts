import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getBlockedDates, addBlockedDate, removeBlockedDate } from '@/lib/availability';

// GET /api/admin/availability/blocked-dates
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dates = await getBlockedDates();
    return NextResponse.json(dates);
  } catch (error) {
    console.error('[BLOCKED_DATES_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch blocked dates' }, { status: 500 });
  }
}

// POST /api/admin/availability/blocked-dates
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, reason } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const result = await addBlockedDate(date, reason, userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to add blocked date' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[BLOCKED_DATES_POST]', error);
    return NextResponse.json({ error: 'Failed to add blocked date' }, { status: 500 });
  }
}

// DELETE /api/admin/availability/blocked-dates
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await removeBlockedDate(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to delete blocked date' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[BLOCKED_DATES_DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete blocked date' }, { status: 500 });
  }
}
