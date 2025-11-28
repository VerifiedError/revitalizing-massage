import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCustomerHealthInfo, updateCustomerHealthInfo } from '@/lib/customers';

// GET /api/admin/customers/[id]/health - Get customer health info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const healthInfo = await getCustomerHealthInfo(id);

    if (!healthInfo) {
      return NextResponse.json({ error: 'Health info not found' }, { status: 404 });
    }

    return NextResponse.json(healthInfo);
  } catch (error) {
    console.error('Error fetching health info:', error);
    return NextResponse.json({ error: 'Failed to fetch health info' }, { status: 500 });
  }
}

// PATCH /api/admin/customers/[id]/health - Update customer health info
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await updateCustomerHealthInfo(id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update health info' }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating health info:', error);
    return NextResponse.json({ error: 'Failed to update health info' }, { status: 500 });
  }
}
