import { NextResponse } from 'next/server';
import { getActivePackages, getActiveAddons } from '@/lib/packages';

// GET /api/packages - Public endpoint for active packages
export async function GET() {
  try {
    const packages = getActivePackages();
    const addons = getActiveAddons();

    return NextResponse.json({ packages, addons });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
