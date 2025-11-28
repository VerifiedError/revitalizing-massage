import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getCustomerCommunications, createCommunication, deleteCommunication } from '@/lib/communications';

async function verifyAdmin() {
  const user = await currentUser();
  if (!user) return { error: 'Unauthorized', status: 401 };

  const role = user.publicMetadata?.role as string | undefined;
  if (role !== 'admin') return { error: 'Forbidden', status: 403 };

  return { user };
}

// GET - Fetch communications for a customer
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const type = searchParams.get('type') || undefined;
    const tagsParam = searchParams.get('tags');
    const limitParam = searchParams.get('limit');

    if (!customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
    }

    const options: any = {};
    if (type) options.type = type;
    if (tagsParam) options.tags = tagsParam.split(',');
    if (limitParam) options.limit = parseInt(limitParam, 10);

    const communications = await getCustomerCommunications(customerId, options);
    return NextResponse.json(communications);
  } catch (error) {
    console.error('Failed to fetch communications:', error);
    return NextResponse.json({ error: 'Failed to fetch communications' }, { status: 500 });
  }
}

// POST - Create new communication
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();

    if (!body.customerId || !body.content) {
      return NextResponse.json({ error: 'Missing customerId or content' }, { status: 400 });
    }

    if (!body.type) {
      body.type = 'note'; // Default to note type
    }

    const communication = await createCommunication({
      customerId: body.customerId,
      type: body.type,
      subject: body.subject,
      content: body.content,
      direction: body.direction,
      tags: body.tags,
      createdBy: auth.user.id,
      metadata: body.metadata,
    });

    return NextResponse.json(communication, { status: 201 });
  } catch (error) {
    console.error('Failed to create communication:', error);
    return NextResponse.json({ error: 'Failed to create communication' }, { status: 500 });
  }
}

// DELETE - Delete communication
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing communication id' }, { status: 400 });
    }

    const success = await deleteCommunication(id);

    if (!success) {
      return NextResponse.json({ error: 'Communication not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete communication:', error);
    return NextResponse.json({ error: 'Failed to delete communication' }, { status: 500 });
  }
}
