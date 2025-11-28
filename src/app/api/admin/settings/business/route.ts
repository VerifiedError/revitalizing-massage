import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { businessSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch business settings (public endpoint for website display)
export async function GET() {
  try {
    const settings = await db.select().from(businessSettings).where(eq(businessSettings.id, 1));

    if (settings.length === 0) {
      // Return fallback values if no settings in database
      return NextResponse.json({
        id: 1,
        businessName: 'Revitalizing Massage',
        phone: '+1 785-250-4599',
        phoneDisplay: '(785) 250-4599',
        email: 'alannahsrevitalizingmassage@gmail.com',
        addressStreet: '2900 SW Atwood',
        addressCity: 'Topeka',
        addressState: 'KS',
        addressZip: '66614',
        addressFull: '2900 SW Atwood, Topeka, KS 66614',
        timezone: 'America/Chicago',
        taxRate: '0',
        currency: 'USD',
        updatedAt: new Date(),
        updatedBy: null,
      });
    }

    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error('Error fetching business settings:', error);
    // Return fallback on error to ensure site doesn't break
    return NextResponse.json({
      id: 1,
      businessName: 'Revitalizing Massage',
      phone: '+1 785-250-4599',
      phoneDisplay: '(785) 250-4599',
      email: 'alannahsrevitalizingmassage@gmail.com',
      addressStreet: '2900 SW Atwood',
      addressCity: 'Topeka',
      addressState: 'KS',
      addressZip: '66614',
      addressFull: '2900 SW Atwood, Topeka, KS 66614',
      timezone: 'America/Chicago',
      taxRate: '0',
      currency: 'USD',
      updatedAt: new Date(),
      updatedBy: null,
    });
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
