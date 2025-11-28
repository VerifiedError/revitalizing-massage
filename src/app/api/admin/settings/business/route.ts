import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { businessSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch business settings
export async function GET() {
  try {
    const session = await auth();
    const role = (session.sessionClaims?.metadata as { role?: string })?.role;

    // Admin-only endpoint
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const settings = await db.select().from(businessSettings).where(eq(businessSettings.id, 1));

    if (settings.length === 0) {
      return NextResponse.json({ error: 'Business settings not found' }, { status: 404 });
    }

    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error('Error fetching business settings:', error);
    return NextResponse.json({ error: 'Failed to fetch business settings' }, { status: 500 });
  }
}

// PATCH - Update business settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const role = (session.sessionClaims?.metadata as { role?: string })?.role;
    const userId = session.userId;

    // Admin-only endpoint
    if (role !== 'admin' || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.businessName || !body.phone || !body.email || !body.addressStreet ||
        !body.addressCity || !body.addressState || !body.addressZip) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct full address
    const addressFull = `${body.addressStreet}, ${body.addressCity}, ${body.addressState} ${body.addressZip}`;

    // Update business settings
    const updatedSettings = await db.update(businessSettings)
      .set({
        businessName: body.businessName,
        phone: body.phone,
        phoneDisplay: body.phoneDisplay || body.phone,
        email: body.email,
        addressStreet: body.addressStreet,
        addressCity: body.addressCity,
        addressState: body.addressState,
        addressZip: body.addressZip,
        addressFull: addressFull,
        timezone: body.timezone || 'America/Chicago',
        taxRate: body.taxRate || '0',
        currency: body.currency || 'USD',
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(eq(businessSettings.id, 1))
      .returning();

    if (updatedSettings.length === 0) {
      return NextResponse.json({ error: 'Failed to update business settings' }, { status: 500 });
    }

    return NextResponse.json(updatedSettings[0]);
  } catch (error) {
    console.error('Error updating business settings:', error);
    return NextResponse.json({ error: 'Failed to update business settings' }, { status: 500 });
  }
}
