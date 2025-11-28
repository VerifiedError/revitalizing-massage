import { db } from '@/db';
import { customerCommunications, noteTemplates, CustomerCommunication, NoteTemplate, NewCustomerCommunication, NewNoteTemplate } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Customer Communications CRUD

export interface GetCommunicationsOptions {
  type?: string;
  tags?: string[];
  limit?: number;
}

export async function getCustomerCommunications(
  customerId: string,
  options?: GetCommunicationsOptions
): Promise<CustomerCommunication[]> {
  let query = db.select().from(customerCommunications).where(eq(customerCommunications.customerId, customerId)).$dynamic();

  // Add type filter if provided
  if (options?.type) {
    query = query.where(eq(customerCommunications.type, options.type));
  }

  // Add limit if provided
  const results = await query.orderBy(desc(customerCommunications.createdAt)).limit(options?.limit || 1000);

  // Parse JSON fields and filter by tags if needed
  const parsed = results.map(comm => ({
    ...comm,
    tags: comm.tags ? JSON.parse(comm.tags) : [],
    metadata: comm.metadata ? JSON.parse(comm.metadata) : null,
  }));

  // Filter by tags if provided
  if (options?.tags && options.tags.length > 0) {
    return parsed.filter(comm =>
      options.tags!.some(tag => (comm.tags as string[]).includes(tag))
    );
  }

  return parsed;
}

export interface CreateCommunicationInput {
  customerId: string;
  type: string;
  subject?: string;
  content: string;
  direction?: string;
  tags?: string[];
  createdBy: string;
  metadata?: any;
}

export async function createCommunication(data: CreateCommunicationInput): Promise<CustomerCommunication> {
  const id = `comm_${nanoid(12)}`;

  const newCommunication: NewCustomerCommunication = {
    id,
    customerId: data.customerId,
    type: data.type,
    subject: data.subject || null,
    content: data.content,
    direction: data.direction || null,
    tags: data.tags ? JSON.stringify(data.tags) : '[]',
    createdBy: data.createdBy,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
  };

  const [created] = await db.insert(customerCommunications).values(newCommunication).returning();

  return {
    ...created,
    tags: created.tags ? JSON.parse(created.tags) : [],
    metadata: created.metadata ? JSON.parse(created.metadata) : null,
  };
}

export async function deleteCommunication(id: string): Promise<boolean> {
  const result = await db.delete(customerCommunications).where(eq(customerCommunications.id, id));
  return result.rowCount !== null && result.rowCount > 0;
}

// Note Templates CRUD

export async function getNoteTemplates(category?: string): Promise<NoteTemplate[]> {
  let query = db.select().from(noteTemplates).where(eq(noteTemplates.isActive, true)).$dynamic();

  if (category) {
    query = query.where(eq(noteTemplates.category, category));
  }

  const results = await query.orderBy(noteTemplates.sortOrder, noteTemplates.name);

  return results.map(template => ({
    ...template,
    tags: template.tags ? JSON.parse(template.tags) : [],
  }));
}

export async function getAllNoteTemplates(): Promise<NoteTemplate[]> {
  const results = await db.select().from(noteTemplates).orderBy(noteTemplates.category, noteTemplates.sortOrder);

  return results.map(template => ({
    ...template,
    tags: template.tags ? JSON.parse(template.tags) : [],
  }));
}

export async function getNoteTemplateById(id: string): Promise<NoteTemplate | undefined> {
  const [template] = await db.select().from(noteTemplates).where(eq(noteTemplates.id, id));

  if (!template) return undefined;

  return {
    ...template,
    tags: template.tags ? JSON.parse(template.tags) : [],
  };
}

export interface CreateTemplateInput {
  name: string;
  category: string;
  content: string;
  tags?: string[];
  isActive?: boolean;
  sortOrder?: number;
}

export async function createNoteTemplate(data: CreateTemplateInput): Promise<NoteTemplate> {
  const id = `tpl_${nanoid(12)}`;

  const newTemplate: NewNoteTemplate = {
    id,
    name: data.name,
    category: data.category,
    content: data.content,
    tags: data.tags ? JSON.stringify(data.tags) : '[]',
    isActive: data.isActive !== undefined ? data.isActive : true,
    sortOrder: data.sortOrder !== undefined ? data.sortOrder : 999,
  };

  const [created] = await db.insert(noteTemplates).values(newTemplate).returning();

  return {
    ...created,
    tags: created.tags ? JSON.parse(created.tags) : [],
  };
}

export interface UpdateTemplateInput {
  name?: string;
  category?: string;
  content?: string;
  tags?: string[];
  isActive?: boolean;
  sortOrder?: number;
}

export async function updateNoteTemplate(id: string, updates: UpdateTemplateInput): Promise<NoteTemplate | null> {
  const updateData: Partial<NewNoteTemplate> = {
    updatedAt: new Date(),
  };

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.tags !== undefined) updateData.tags = JSON.stringify(updates.tags);
  if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
  if (updates.sortOrder !== undefined) updateData.sortOrder = updates.sortOrder;

  const [updated] = await db.update(noteTemplates)
    .set(updateData)
    .where(eq(noteTemplates.id, id))
    .returning();

  if (!updated) return null;

  return {
    ...updated,
    tags: updated.tags ? JSON.parse(updated.tags) : [],
  };
}

export async function deleteNoteTemplate(id: string): Promise<boolean> {
  const result = await db.delete(noteTemplates).where(eq(noteTemplates.id, id));
  return result.rowCount !== null && result.rowCount > 0;
}

// Legacy compatibility functions (keep these for backward compatibility)
export async function getNotesByCustomerId(customerId: string): Promise<any[]> {
  // Returns communications in the old "note" format for compatibility
  const communications = await getCustomerCommunications(customerId);

  return communications.map(comm => ({
    id: comm.id,
    customerId: comm.customerId,
    note: comm.content, // Map content back to note field
    createdBy: comm.createdBy,
    createdAt: comm.createdAt,
  }));
}

export async function createCustomerNote(customerId: string, note: string, createdBy: string): Promise<any> {
  // Create a note-type communication for backward compatibility
  const communication = await createCommunication({
    customerId,
    type: 'note',
    content: note,
    createdBy,
  });

  return {
    id: communication.id,
    customerId: communication.customerId,
    note: communication.content,
    createdBy: communication.createdBy,
    createdAt: communication.createdAt,
  };
}

export async function deleteCustomerNote(id: string): Promise<boolean> {
  return deleteCommunication(id);
}
