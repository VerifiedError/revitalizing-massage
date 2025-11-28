import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { revenueRecords } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const records = await db
      .select()
      .from(revenueRecords)
      .where(eq(revenueRecords.id, id));

    if (records.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(records[0]);
  } catch (error) {
    console.error('Failed to fetch revenue record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue record' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Check if record exists
    const existing = await db
      .select()
      .from(revenueRecords)
      .where(eq(revenueRecords.id, id));

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Update allowed fields
    const updates: any = {};

    if (body.paymentStatus !== undefined) {
      updates.paymentStatus = body.paymentStatus;
    }
    if (body.paymentMethod !== undefined) {
      updates.paymentMethod = body.paymentMethod;
    }
    if (body.paidAt !== undefined) {
      updates.paidAt = body.paidAt;
    }
    if (body.notes !== undefined) {
      updates.notes = body.notes;
    }

    // If payment status changed to 'paid', set paidAt
    if (updates.paymentStatus === 'paid' && !updates.paidAt) {
      updates.paidAt = new Date().toISOString();
    }

    await db
      .update(revenueRecords)
      .set(updates)
      .where(eq(revenueRecords.id, id));

    // Fetch updated record
    const updated = await db
      .select()
      .from(revenueRecords)
      .where(eq(revenueRecords.id, id));

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Failed to update revenue record:', error);
    return NextResponse.json(
      { error: 'Failed to update revenue record' },
      { status: 500 }
    );
  }
}
