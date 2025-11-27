import { NextRequest, NextResponse } from 'next/server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';

// GET - Fetch all users
export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = user.publicMetadata?.role as string | undefined;
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const client = await clerkClient();
    const usersResponse = await client.users.getUserList({ limit: 100 });

    const users = usersResponse.data.map((u) => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress || '',
      firstName: u.firstName,
      lastName: u.lastName,
      imageUrl: u.imageUrl,
      role: (u.publicMetadata?.role as string) || 'customer',
      createdAt: u.createdAt,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// PATCH - Update user role
export async function PATCH(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = user.publicMetadata?.role as string | undefined;
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, role: newRole } = await request.json();

    if (!userId || !newRole) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
    }

    if (!['customer', 'admin'].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: newRole },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
