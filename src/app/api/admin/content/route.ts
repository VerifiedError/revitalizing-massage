import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db';
import { websiteContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch content by section (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      const content = await db
        .select()
        .from(websiteContent)
        .where(eq(websiteContent.section, section));

      return NextResponse.json(content[0] || null);
    }

    // Get all content
    const allContent = await db.select().from(websiteContent);
    return NextResponse.json(allContent);
  } catch (error) {
    console.error('Error fetching website content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// PATCH - Update content (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role as string;

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { section, content } = body;

    if (!section || !content) {
      return NextResponse.json({ error: 'Section and content required' }, { status: 400 });
    }

    // Check if content exists
    const existing = await db
      .select()
      .from(websiteContent)
      .where(eq(websiteContent.section, section));

    if (existing.length > 0) {
      // Update
      const updated = await db
        .update(websiteContent)
        .set({
          content: JSON.stringify(content),
          updatedAt: new Date(),
          updatedBy: userId,
        })
        .where(eq(websiteContent.section, section))
        .returning();

      return NextResponse.json(updated[0]);
    } else {
      // Insert
      const inserted = await db
        .insert(websiteContent)
        .values({
          id: `content_${Date.now()}`,
          section,
          content: JSON.stringify(content),
          updatedBy: userId,
        })
        .returning();

      return NextResponse.json(inserted[0]);
    }
  } catch (error) {
    console.error('Error updating website content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
