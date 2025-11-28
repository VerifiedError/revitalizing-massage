import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const allAppointments = await db.select().from(appointments).orderBy(desc(appointments.date));

    const clientsMap = new Map();

    allAppointments.forEach(apt => {
      // Create a unique key for the client
      // Prioritize ID (if auth user) -> Email -> Phone -> Name
      const key = apt.customerId || apt.customerEmail || apt.customerPhone || apt.customerName;
      
      if (!clientsMap.has(key)) {
        clientsMap.set(key, {
          id: key,
          name: apt.customerName,
          email: apt.customerEmail || '',
          phone: apt.customerPhone || '',
          totalAppointments: 0,
          totalSpend: 0,
          lastVisit: apt.date,
          appointments: []
        });
      }

      const client = clientsMap.get(key);
      client.totalAppointments += 1;
      
      // Calculate spend
      const servicePrice = parseFloat(apt.servicePrice as unknown as string) || 0;
      const addonsTotal = parseFloat(apt.addonsTotal as unknown as string) || 0;
      
      // Only count completed appointments for revenue? 
      // For now, let's count all 'completed' status, or maybe just sum all for "Potential Value"
      // Let's stick to completed for strict revenue, but maybe Alannah wants to see total booked value.
      // Let's count everything for now, but maybe add a 'paid' flag later.
      if (apt.status === 'completed') {
        client.totalSpend += (servicePrice + addonsTotal);
      }

      // Update last visit if this appointment is more recent (and we are sorting by date desc, so first one found might be latest if we iterate right? No, list is desc)
      // Actually, we are iterating. If list is desc, first one is latest.
      // But we need to check dates.
      if (new Date(apt.date) > new Date(client.lastVisit)) {
        client.lastVisit = apt.date;
      }
      
      client.appointments.push(apt);
    });

    const clients = Array.from(clientsMap.values()).sort((a, b) => b.totalSpend - a.totalSpend);

    return NextResponse.json(clients);
  } catch (error) {
    console.error('[CLIENTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
