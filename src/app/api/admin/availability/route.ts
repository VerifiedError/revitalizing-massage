import { NextResponse } from 'next/server';
import { getBlockedDates, addBlockedDate, removeBlockedDate } from '@/lib/availability';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dates = await getBlockedDates();
    return NextResponse.json(dates);
  } catch (error) {
    console.error('[AVAILABILITY_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { date, reason } = body;

    if (!date) {
      return new NextResponse('Date is required', { status: 400 });
    }

    const result = await addBlockedDate(date, reason, userId);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return new NextResponse('Failed to add blocked date', { status: 500 });
    }
  } catch (error) {
    console.error('[AVAILABILITY_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('ID is required', { status: 400 });
    }

    const result = await removeBlockedDate(id);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return new NextResponse('Failed to delete blocked date', { status: 500 });
    }
  } catch (error) {
    console.error('[AVAILABILITY_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
