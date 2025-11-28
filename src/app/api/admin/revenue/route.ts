import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { revenueRecords } from '@/db/schema';
import { eq, and, gte, lte, desc, like } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const paymentStatus = searchParams.get('paymentStatus');
    const paymentMethod = searchParams.get('paymentMethod');
    const customerId = searchParams.get('customerId');
    const search = searchParams.get('search');

    // Build query conditions
    const conditions = [];

    if (startDate) {
      conditions.push(gte(revenueRecords.date, startDate));
    }
    if (endDate) {
      conditions.push(lte(revenueRecords.date, endDate));
    }
    if (paymentStatus) {
      conditions.push(eq(revenueRecords.paymentStatus, paymentStatus));
    }
    if (paymentMethod) {
      conditions.push(eq(revenueRecords.paymentMethod, paymentMethod));
    }
    if (customerId) {
      conditions.push(eq(revenueRecords.customerId, customerId));
    }
    if (search) {
      conditions.push(like(revenueRecords.serviceName, `%${search}%`));
    }

    // Fetch records
    let query = db.select().from(revenueRecords);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const records = await query.orderBy(desc(revenueRecords.date));

    return NextResponse.json(records);
  } catch (error) {
    console.error('Failed to fetch revenue records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue records' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Generate ID if not provided
    const id = body.id || `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate subtotal and total
    const servicePrice = parseFloat(body.servicePrice || '0');
    const addonsTotal = parseFloat(body.addonsTotal || '0');
    const discountAmount = parseFloat(body.discountAmount || '0');
    const taxAmount = parseFloat(body.taxAmount || '0');

    const subtotal = servicePrice + addonsTotal;
    const totalAmount = subtotal - discountAmount + taxAmount;

    const record = {
      id,
      appointmentId: body.appointmentId || null,
      customerId: body.customerId || null,
      date: body.date,
      serviceId: body.serviceId || null,
      serviceName: body.serviceName,
      servicePrice: servicePrice.toString(),
      addonsTotal: addonsTotal.toString(),
      discountAmount: discountAmount.toString(),
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      totalAmount: totalAmount.toString(),
      paymentStatus: body.paymentStatus || 'pending',
      paymentMethod: body.paymentMethod || null,
      paidAt: body.paidAt || null,
      notes: body.notes || null,
      createdBy: userId,
    };

    await db.insert(revenueRecords).values(record);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Failed to create revenue record:', error);
    return NextResponse.json(
      { error: 'Failed to create revenue record' },
      { status: 500 }
    );
  }
}
