import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import {
  getNoteTemplates,
  getAllNoteTemplates,
  createNoteTemplate,
  updateNoteTemplate,
  deleteNoteTemplate,
} from '@/lib/communications';

async function verifyAdmin() {
  const user = await currentUser();
  if (!user) return { error: 'Unauthorized', status: 401 };

  const role = user.publicMetadata?.role as string | undefined;
  if (role !== 'admin') return { error: 'Forbidden', status: 403 };

  return { user };
}

// GET - List all templates (optionally filter by category)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const all = searchParams.get('all') === 'true'; // Get all including inactive

    const templates = all
      ? await getAllNoteTemplates()
      : await getNoteTemplates(category);

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// POST - Create new template
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();

    if (!body.name || !body.category || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, content' },
        { status: 400 }
      );
    }

    const template = await createNoteTemplate({
      name: body.name,
      category: body.category,
      content: body.content,
      tags: body.tags,
      isActive: body.isActive,
      sortOrder: body.sortOrder,
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Failed to create template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

// PATCH - Update template
export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Missing template id' }, { status: 400 });
    }

    const template = await updateNoteTemplate(body.id, {
      name: body.name,
      category: body.category,
      content: body.content,
      tags: body.tags,
      isActive: body.isActive,
      sortOrder: body.sortOrder,
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Failed to update template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

// DELETE - Delete template
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing template id' }, { status: 400 });
    }

    const success = await deleteNoteTemplate(id);

    if (!success) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
