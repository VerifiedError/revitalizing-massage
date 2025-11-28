import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, customerCommunications, type CustomerCommunication } from '@/db/schema';
import { eq, desc, or } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await context.params;
    const clientId = decodeURIComponent(id);

    // Fetch appointments matching email or customerId or name
    // We assume ID passed is either an email or a Clerk ID or a Name
    // Ideally we should be consistent. The list API used "email || name".
    
    const clientAppointments = await db.select()
      .from(appointments)
      .where(
        or(
          eq(appointments.customerEmail, clientId),
          eq(appointments.customerId, clientId),
          eq(appointments.customerName, clientId)
        )
      )
      .orderBy(desc(appointments.date));

    if (clientAppointments.length === 0) {
      return new NextResponse('Client not found', { status: 404 });
    }

    const firstApt = clientAppointments[0];
    const clientInfo = {
      id: clientId,
      name: firstApt.customerName,
      email: firstApt.customerEmail,
      phone: firstApt.customerPhone,
      totalAppointments: clientAppointments.length,
      totalSpend: clientAppointments.reduce((sum, apt) => 
        sum + (parseFloat(apt.servicePrice as unknown as string) || 0) + (parseFloat(apt.addonsTotal as unknown as string) || 0), 0
      ),
      appointments: clientAppointments
    };

    // Fetch notes if we have a customerId (which might be the clientId or found in appointments)
    let notes: any[] = [];
    // We need a consistent customerId to fetch notes. 
    // If the clientId passed is an email, we might not find notes if they are keyed by Clerk ID.
    // We'll search notes by the customerId found in the appointments (if any).
    const distinctCustomerIds = Array.from(new Set(clientAppointments.map(a => a.customerId).filter(Boolean)));
    
    if (distinctCustomerIds.length > 0) {
       // Fetch notes for all associated IDs (usually just one)
       // @ts-ignore
       const notesList = await db.select().from(customerCommunications).where(eq(customerCommunications.customerId, distinctCustomerIds[0]));
       notes = notesList.map(n => ({
         ...n,
         type: 'general'
       }));
    }

    // Also include notes from appointments
    clientAppointments.forEach(apt => {
      if (apt.notes) {
        notes.push({
          id: `apt_${apt.id}`,
          customerId: apt.customerId || clientId,
          note: `[Appointment ${apt.date}] ${apt.notes}`,
          createdAt: apt.updatedAt || apt.createdAt,
          type: 'appointment'
        });
      }
    });

    // Sort all notes by date descending
    notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ ...clientInfo, notes });
  } catch (error) {
    console.error('[CLIENT_DETAILS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
