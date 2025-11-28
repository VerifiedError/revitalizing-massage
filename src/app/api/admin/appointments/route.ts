import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
} from '@/lib/appointments';
import { db } from '@/db';
import { revenueRecords } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function verifyAdmin() {
  const user = await currentUser();
  if (!user) return { error: 'Unauthorized', status: 401 };

  const role = user.publicMetadata?.role as string | undefined;
  if (role !== 'admin') return { error: 'Forbidden', status: 403 };

  return { user };
}

// GET - Fetch all appointments
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const date = searchParams.get('date');

    let appointments = await getAllAppointments();

    if (customerId) {
      appointments = appointments.filter(a => a.customerId === customerId);
    }

    if (date) {
      appointments = appointments.filter(a => a.date === date);
    }

    // Sort by date and time, most recent first
    appointments.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();

    const requiredFields = ['customerName', 'serviceId', 'serviceName', 'servicePrice', 'date', 'time', 'duration'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const appointment = await createAppointment({
      customerId: body.customerId || null,
      customerName: body.customerName,
      customerEmail: body.customerEmail || '',
      customerPhone: body.customerPhone || '',
      serviceId: body.serviceId,
      serviceName: body.serviceName,
      servicePrice: body.servicePrice,
      addons: body.addons || [],
      addonsTotal: body.addonsTotal || 0,
      date: body.date,
      time: body.time,
      duration: body.duration,
      status: body.status || 'scheduled',
      notes: body.notes || '',
      createdBy: 'admin',
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

// PATCH - Update appointment
export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
    }

    const { id, ...updates } = body;

    // Get the old appointment to check status change
    const oldAppointment = await getAppointmentById(id);

    if (!oldAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Update appointment
    const appointment = await updateAppointment(id, updates);

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // If status changed to 'completed', create revenue record
    if (updates.status === 'completed' && oldAppointment.status !== 'completed') {
      try {
        // Check if revenue record already exists
        const existing = await db
          .select()
          .from(revenueRecords)
          .where(eq(revenueRecords.appointmentId, id));

        if (existing.length === 0) {
          // Calculate totals
          const servicePrice = parseFloat(appointment.servicePrice);
          const addonsTotal = parseFloat(appointment.addonsTotal || '0');
          const subtotal = servicePrice + addonsTotal;
          const totalAmount = subtotal;

          // Create revenue record
          const revenueRecord = {
            id: `rev_${id}`,
            appointmentId: id,
            customerId: appointment.customerId,
            date: appointment.date,
            serviceId: appointment.serviceId,
            serviceName: appointment.serviceName,
            servicePrice: appointment.servicePrice,
            addonsTotal: appointment.addonsTotal,
            discountAmount: '0',
            subtotal: subtotal.toString(),
            taxAmount: '0',
            totalAmount: totalAmount.toString(),
            paymentStatus: 'paid' as const,
            paymentMethod: null,
            paidAt: new Date(),
            notes: appointment.notes,
            createdBy: 'admin',
          };

          await db.insert(revenueRecords).values(revenueRecord);

          console.log(`✅ Created revenue record for appointment ${id} - $${totalAmount.toFixed(2)}`);
        }
      } catch (revenueError) {
        console.error('Failed to create revenue record:', revenueError);
        // Don't fail the appointment update if revenue creation fails
      }
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// DELETE - Delete appointment
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
    }

    const success = await deleteAppointment(id);

    if (!success) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete appointment:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
