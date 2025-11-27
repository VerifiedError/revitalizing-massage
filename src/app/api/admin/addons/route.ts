import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getAllAddons, updateAddon } from '@/lib/packages';

// GET /api/admin/addons
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const addons = getAllAddons();
    return NextResponse.json(addons);
  } catch (error) {
    console.error('Error fetching addons:', error);
    return NextResponse.json({ error: 'Failed to fetch addons' }, { status: 500 });
  }
}

// PATCH /api/admin/addons
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Addon ID is required' }, { status: 400 });
    }

    const updatedAddon = updateAddon(id, updates);

    if (!updatedAddon) {
      return NextResponse.json({ error: 'Addon not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAddon);
  } catch (error) {
    console.error('Error updating addon:', error);
    return NextResponse.json({ error: 'Failed to update addon' }, { status: 500 });
  }
}
