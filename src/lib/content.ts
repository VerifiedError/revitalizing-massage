import { db } from '@/db';
import { websiteContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Fetch content for a specific section
 * @param section The section name (e.g., "homepage_hero", "about_story")
 * @returns Parsed JSON content or null if not found
 */
export async function getContentBySection(section: string) {
  try {
    const content = await db
      .select()
      .from(websiteContent)
      .where(eq(websiteContent.section, section));

    if (content.length === 0) {
      return null;
    }

    return JSON.parse(content[0].content);
  } catch (error) {
    console.error(`Error fetching content for section ${section}:`, error);
    return null;
  }
}

/**
 * Fetch all website content as a map
 * @returns Object with section names as keys and parsed content as values
 */
export async function getAllContent() {
  try {
    const allContent = await db.select().from(websiteContent);
    const contentMap: Record<string, any> = {};

    allContent.forEach((item) => {
      contentMap[item.section] = JSON.parse(item.content);
    });

    return contentMap;
  } catch (error) {
    console.error('Error fetching all content:', error);
    return {};
  }
}
