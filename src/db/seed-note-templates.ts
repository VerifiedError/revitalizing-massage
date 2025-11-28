import { db } from './index';
import { noteTemplates } from './schema';
import { nanoid } from 'nanoid';

const defaultTemplates = [
  // Rescheduling templates
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Rescheduled - Customer Request',
    category: 'Rescheduling',
    content: 'Customer requested to reschedule appointment. ',
    tags: JSON.stringify(['rescheduling']),
    sortOrder: 10,
  },
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Rescheduled - Business Conflict',
    category: 'Rescheduling',
    content: 'Rescheduled due to business scheduling conflict. ',
    tags: JSON.stringify(['rescheduling']),
    sortOrder: 20,
  },

  // No-Show templates
  {
    id: `tpl_${nanoid(12)}`,
    name: 'No-Show - No Contact',
    category: 'No-Show',
    content: 'Customer did not show up for scheduled appointment. No prior contact made. ',
    tags: JSON.stringify(['no-show', 'follow-up']),
    sortOrder: 30,
  },
  {
    id: `tpl_${nanoid(12)}`,
    name: 'No-Show - Follow-Up Needed',
    category: 'No-Show',
    content: 'Customer no-showed. Left voicemail to reschedule. ',
    tags: JSON.stringify(['no-show', 'follow-up']),
    sortOrder: 40,
  },

  // Follow-Up templates
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Post-Appointment Check-In',
    category: 'Follow-Up',
    content: 'Following up after appointment. Asked about comfort level and any areas needing attention. ',
    tags: JSON.stringify(['follow-up']),
    sortOrder: 50,
  },
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Inactive Customer Re-engagement',
    category: 'Follow-Up',
    content: 'Reached out to customer who hasn\'t visited in 60+ days. ',
    tags: JSON.stringify(['follow-up', 're-engagement']),
    sortOrder: 60,
  },

  // Medical templates
  {
    id: `tpl_${nanoid(12)}`,
    name: 'New Medical Condition Reported',
    category: 'Medical',
    content: 'Customer reported new medical condition: ',
    tags: JSON.stringify(['medical', 'important']),
    sortOrder: 70,
  },
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Pregnancy Update',
    category: 'Medical',
    content: 'Customer is pregnant - weeks: ',
    tags: JSON.stringify(['medical', 'important', 'prenatal']),
    sortOrder: 80,
  },
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Injury or Pain Reported',
    category: 'Medical',
    content: 'Customer reported injury or pain in: ',
    tags: JSON.stringify(['medical', 'important']),
    sortOrder: 90,
  },

  // General templates
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Preferred Pressure Noted',
    category: 'General',
    content: 'Customer prefers pressure: ',
    tags: JSON.stringify([]),
    sortOrder: 100,
  },
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Focus Areas Discussed',
    category: 'General',
    content: 'Discussed focus areas for future sessions: ',
    tags: JSON.stringify([]),
    sortOrder: 110,
  },
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Special Request',
    category: 'General',
    content: 'Customer requested: ',
    tags: JSON.stringify([]),
    sortOrder: 120,
  },
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Positive Feedback',
    category: 'General',
    content: 'Customer provided positive feedback: ',
    tags: JSON.stringify(['positive']),
    sortOrder: 130,
  },
  {
    id: `tpl_${nanoid(12)}`,
    name: 'Area of Concern',
    category: 'General',
    content: 'Customer expressed concern about: ',
    tags: JSON.stringify(['important']),
    sortOrder: 140,
  },
];

async function seedNoteTemplates() {
  try {
    console.log('Seeding note templates...');

    // Check if templates already exist
    const existingTemplates = await db.select().from(noteTemplates).limit(1);

    if (existingTemplates.length > 0) {
      console.log('⚠️  Note templates already exist. Skipping seed.');
      console.log('To reseed, delete existing templates first.');
      return;
    }

    // Insert all templates
    for (const template of defaultTemplates) {
      await db.insert(noteTemplates).values(template);
    }

    console.log(`✓ Successfully seeded ${defaultTemplates.length} note templates`);
    console.log('\nTemplates by category:');
    console.log('- Rescheduling: 2');
    console.log('- No-Show: 2');
    console.log('- Follow-Up: 2');
    console.log('- Medical: 3');
    console.log('- General: 5');

  } catch (error) {
    console.error('Error seeding note templates:', error);
    throw error;
  }
}

// Run seed
seedNoteTemplates()
  .then(() => {
    console.log('Note templates seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
