import { NextResponse } from 'next/server';
import { getSettings, updateSetting, initializeDefaultSettings } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Ensure defaults exist
    await initializeDefaultSettings();
    
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[SETTINGS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { key, value, category } = body;

    if (!key || value === undefined) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const result = await updateSetting(key, value, category);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return new NextResponse('Failed to update setting', { status: 500 });
    }
  } catch (error) {
    console.error('[SETTINGS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
