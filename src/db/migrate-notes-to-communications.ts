import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

// Migration script to rename customer_notes to customer_communications and add new columns
async function migrateNotesToCommunications() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('Starting migration: customer_notes -> customer_communications...');

  try {
    // Step 1: Rename the table
    console.log('Step 1: Renaming table...');
    await sql`ALTER TABLE customer_notes RENAME TO customer_communications`;
    console.log('✓ Table renamed successfully');

    // Step 2: Add new columns
    console.log('Step 2: Adding new columns...');

    await sql`ALTER TABLE customer_communications
              ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'note'`;

    await sql`ALTER TABLE customer_communications
              ADD COLUMN IF NOT EXISTS subject VARCHAR(255)`;

    await sql`ALTER TABLE customer_communications
              ADD COLUMN IF NOT EXISTS direction VARCHAR(10)`;

    await sql`ALTER TABLE customer_communications
              ADD COLUMN IF NOT EXISTS tags TEXT DEFAULT '[]'`;

    await sql`ALTER TABLE customer_communications
              ADD COLUMN IF NOT EXISTS metadata TEXT`;

    console.log('✓ New columns added successfully');

    // Step 3: Rename the 'note' column to 'content'
    console.log('Step 3: Renaming note column to content...');
    await sql`ALTER TABLE customer_communications RENAME COLUMN note TO content`;
    console.log('✓ Column renamed successfully');

    // Step 4: Update customer_id length constraint (from 100 to 50) and add foreign key
    console.log('Step 4: Updating customer_id constraint...');
    await sql`ALTER TABLE customer_communications
              ALTER COLUMN customer_id TYPE VARCHAR(50)`;
    console.log('✓ customer_id type updated');

    // Add foreign key constraint if it doesn't exist
    try {
      await sql`ALTER TABLE customer_communications
                ADD CONSTRAINT customer_communications_customer_id_fkey
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE`;
      console.log('✓ Foreign key constraint added');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('✓ Foreign key constraint already exists');
      } else {
        throw error;
      }
    }

    // Step 5: Drop old index and create new indexes
    console.log('Step 5: Updating indexes...');

    // Drop old index
    try {
      await sql`DROP INDEX IF EXISTS customer_notes_customer_id_idx`;
      console.log('✓ Old index dropped');
    } catch (error) {
      console.log('✓ Old index not found (skipping)');
    }

    // Create new indexes
    await sql`CREATE INDEX IF NOT EXISTS communications_customer_idx ON customer_communications(customer_id)`;
    await sql`CREATE INDEX IF NOT EXISTS communications_type_idx ON customer_communications(type)`;
    await sql`CREATE INDEX IF NOT EXISTS communications_created_at_idx ON customer_communications(created_at)`;
    console.log('✓ New indexes created successfully');

    // Step 6: Set default values for existing records
    console.log('Step 6: Setting default values for existing records...');
    await sql`UPDATE customer_communications
              SET type = 'note',
                  tags = '[]'
              WHERE type IS NULL OR tags IS NULL`;
    console.log('✓ Default values set');

    // Step 7: Make type column NOT NULL
    console.log('Step 7: Setting type column to NOT NULL...');
    await sql`ALTER TABLE customer_communications
              ALTER COLUMN type SET NOT NULL`;
    console.log('✓ type column set to NOT NULL');

    console.log('\n✅ Migration completed successfully!');
    console.log('Summary:');
    console.log('- Table renamed from customer_notes to customer_communications');
    console.log('- Column renamed from note to content');
    console.log('- New columns added: type, subject, direction, tags, metadata');
    console.log('- Indexes updated');
    console.log('- Foreign key constraint added');

    const result = await sql`SELECT COUNT(*) as count FROM customer_communications`;
    console.log(`- Total records migrated: ${result[0].count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateNotesToCommunications()
  .then(() => {
    console.log('Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
