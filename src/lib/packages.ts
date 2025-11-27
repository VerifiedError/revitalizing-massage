import { db } from '@/db';
import { packages, addons } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Package, AddOnService } from '@/types/packages';

// Package Management Functions
export async function getAllPackages(): Promise<Package[]> {
  const result = await db
    .select()
    .from(packages)
    .orderBy(packages.sortOrder);

  return result.map(pkg => ({
    ...pkg,
    basePrice: parseFloat(pkg.basePrice),
    currentPrice: parseFloat(pkg.currentPrice),
    discountPercentage: parseFloat(pkg.discountPercentage),
    discountLabel: pkg.discountLabel || undefined,
    category: pkg.category as 'standard' | 'specialty' | 'addon',
    createdAt: pkg.createdAt.toISOString(),
    updatedAt: pkg.updatedAt.toISOString(),
  }));
}

export async function getActivePackages(): Promise<Package[]> {
  const result = await db
    .select()
    .from(packages)
    .where(eq(packages.isActive, true))
    .orderBy(packages.sortOrder);

  return result.map(pkg => ({
    ...pkg,
    basePrice: parseFloat(pkg.basePrice),
    currentPrice: parseFloat(pkg.currentPrice),
    discountPercentage: parseFloat(pkg.discountPercentage),
    discountLabel: pkg.discountLabel || undefined,
    category: pkg.category as 'standard' | 'specialty' | 'addon',
    createdAt: pkg.createdAt.toISOString(),
    updatedAt: pkg.updatedAt.toISOString(),
  }));
}

export async function getPackageById(id: string): Promise<Package | null> {
  const result = await db
    .select()
    .from(packages)
    .where(eq(packages.id, id))
    .limit(1);

  if (result.length === 0) return null;

  const pkg = result[0];
  return {
    ...pkg,
    basePrice: parseFloat(pkg.basePrice),
    currentPrice: parseFloat(pkg.currentPrice),
    discountPercentage: parseFloat(pkg.discountPercentage),
    discountLabel: pkg.discountLabel || undefined,
    category: pkg.category as 'standard' | 'specialty' | 'addon',
    createdAt: pkg.createdAt.toISOString(),
    updatedAt: pkg.updatedAt.toISOString(),
  };
}

export async function createPackage(packageData: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Promise<Package> {
  const currentPrice = packageData.basePrice * (1 - packageData.discountPercentage / 100);

  const newPackage = {
    id: `pkg_${Date.now()}`,
    ...packageData,
    currentPrice: currentPrice.toString(),
    basePrice: packageData.basePrice.toString(),
    discountPercentage: packageData.discountPercentage.toString(),
  };

  await db.insert(packages).values(newPackage);

  return {
    ...newPackage,
    basePrice: parseFloat(newPackage.basePrice),
    currentPrice: parseFloat(newPackage.currentPrice.toString()),
    discountPercentage: parseFloat(newPackage.discountPercentage),
    discountLabel: newPackage.discountLabel || undefined,
    category: newPackage.category as 'standard' | 'specialty' | 'addon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updatePackage(id: string, updates: Partial<Package>): Promise<Package | null> {
  const existing = await getPackageById(id);
  if (!existing) return null;

  // Recalculate current price if basePrice or discount changed
  let currentPrice = existing.currentPrice;
  const basePrice = updates.basePrice !== undefined ? updates.basePrice : existing.basePrice;
  const discountPercentage = updates.discountPercentage !== undefined ? updates.discountPercentage : existing.discountPercentage;

  if (updates.basePrice !== undefined || updates.discountPercentage !== undefined) {
    currentPrice = basePrice * (1 - discountPercentage / 100);
  }

  const updateData: any = {
    ...updates,
    updatedAt: new Date(),
  };

  if (updates.basePrice !== undefined) {
    updateData.basePrice = updates.basePrice.toString();
  }
  if (updates.discountPercentage !== undefined) {
    updateData.discountPercentage = updates.discountPercentage.toString();
  }
  if (currentPrice !== existing.currentPrice) {
    updateData.currentPrice = currentPrice.toString();
  }

  await db
    .update(packages)
    .set(updateData)
    .where(eq(packages.id, id));

  return getPackageById(id);
}

export async function deletePackage(id: string): Promise<boolean> {
  const result = await db
    .delete(packages)
    .where(eq(packages.id, id));

  return true;
}

// Add-on Management Functions
export async function getAllAddons(): Promise<AddOnService[]> {
  const result = await db
    .select()
    .from(addons)
    .orderBy(addons.sortOrder);

  return result.map(addon => ({
    ...addon,
    price: parseFloat(addon.price),
    description: addon.description || undefined,
  }));
}

export async function getActiveAddons(): Promise<AddOnService[]> {
  const result = await db
    .select()
    .from(addons)
    .where(eq(addons.isActive, true))
    .orderBy(addons.sortOrder);

  return result.map(addon => ({
    ...addon,
    price: parseFloat(addon.price),
    description: addon.description || undefined,
  }));
}

export async function updateAddon(id: string, updates: Partial<AddOnService>): Promise<AddOnService | null> {
  const updateData: any = { ...updates };

  if (updates.price !== undefined) {
    updateData.price = updates.price.toString();
  }

  await db
    .update(addons)
    .set(updateData)
    .where(eq(addons.id, id));

  const result = await db
    .select()
    .from(addons)
    .where(eq(addons.id, id))
    .limit(1);

  if (result.length === 0) return null;

  return {
    ...result[0],
    price: parseFloat(result[0].price),
    description: result[0].description || undefined,
  };
}
