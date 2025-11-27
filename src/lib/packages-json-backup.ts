import fs from 'fs';
import path from 'path';
import { Package, AddOnService } from '@/types/packages';

const DATA_DIR = path.join(process.cwd(), 'data');
const PACKAGES_FILE = path.join(DATA_DIR, 'packages.json');
const ADDONS_FILE = path.join(DATA_DIR, 'addons.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize packages file with default data if it doesn't exist
if (!fs.existsSync(PACKAGES_FILE)) {
  const defaultPackages: Package[] = [
    {
      id: 'pkg_001',
      name: '30 Minute Massage',
      description: 'This is typically focused on an area of complaint and does not include the whole body. This is a perfect appointment for you if you are limited on time or don\'t want full body work. Since many of us store tension in our upper back and neck, this a typical complaint and focus for a 30 minute session. This is also a good length of time to focus on shoulder complaints and work on the tight muscles of the chest, neck and upper back to help free the shoulder joint.',
      duration: '45 mins',
      basePrice: 45,
      currentPrice: 45,
      discountPercentage: 0,
      category: 'standard',
      hasAddons: false,
      isActive: true,
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pkg_002',
      name: '30 Minute Massage with add-on service of choice',
      description: 'This is typically focused on an area of complaint and does not include the whole body. This is a perfect appointment for you if you are limited on time or don\'t want full body work. Since many of us store tension in our upper back and neck, this is the perfect area of focus for a 30 minute session. This is also a good length of time to focus on shoulder complaints and work on the tight muscles of the chest, neck and upper back to help free the shoulder joint.',
      duration: '45 mins',
      basePrice: 55,
      currentPrice: 55,
      discountPercentage: 0,
      category: 'standard',
      hasAddons: true,
      isActive: true,
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pkg_003',
      name: '60 Minute Massage',
      description: 'A 60 minute session allows enough time for full body work. A typical session would involve approximately 20 minutes on the back and neck area ,7-8 minutes on each arm and leg and 10 minutes to the upper neck, scalp and face. This is an approximate time frame and varies from appointment to appointment depending on where you may have complaints that need focus work.',
      duration: '1 hr 15 mins',
      basePrice: 70,
      currentPrice: 70,
      discountPercentage: 0,
      category: 'standard',
      hasAddons: false,
      isActive: true,
      sortOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pkg_004',
      name: '60 Minute Massage with add-on service of choice',
      description: 'A 60 minute session allows enough time for full body work. A typical session would involve approximately 20 minutes on the back and neck area ,7-8 minutes on each arm and leg and 10 minutes to the upper neck, scalp and face. This is an approximate time frame and varies from appointment to appointment depending on where you may have complaints that need focus work.',
      duration: '1 hr 15 mins',
      basePrice: 80,
      currentPrice: 80,
      discountPercentage: 0,
      category: 'standard',
      hasAddons: true,
      isActive: true,
      sortOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pkg_005',
      name: '75 Minute Massage',
      description: 'Extended massage session with extra time for problem areas and full body coverage with more thorough work.',
      duration: '1 hr 15 mins',
      basePrice: 85,
      currentPrice: 85,
      discountPercentage: 0,
      category: 'standard',
      hasAddons: false,
      isActive: true,
      sortOrder: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pkg_006',
      name: '75 Minute Massage with add-on service',
      description: 'Extended massage session with extra time for problem areas and full body coverage with more thorough work, enhanced with your choice of add-on service.',
      duration: '1 hr 15 mins',
      basePrice: 95,
      currentPrice: 95,
      discountPercentage: 0,
      category: 'standard',
      hasAddons: true,
      isActive: true,
      sortOrder: 6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pkg_007',
      name: '90 Minute Massage',
      description: 'It is very much like the 60 minute session, however, it allows a little extra time for each area. This is a great for you when you feel like that last 60 minute massage "was just not long enough." About 45 minutes would be allotted to the back and neck area, or other area of complaint. Each arm and leg also has a little extra time for some focus work or deep tissue work. Many people enjoy this as it allows enough time to slow down, relax and benefit from the therapeutic effects of massage therapy.',
      duration: '1 hr 45 mins',
      basePrice: 100,
      currentPrice: 100,
      discountPercentage: 0,
      category: 'standard',
      hasAddons: false,
      isActive: true,
      sortOrder: 7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pkg_008',
      name: '90 Minute Massage with add-on service of choice',
      description: 'It is very much like the 60 minute session, however, it allows a little extra time for each area. This is a great for you when you feel like that last 60 minute massage "was just not long enough." About 45 minutes would be allotted to the back and neck area, or other area of complaint. Each arm and leg also has a little extra time for some focus work or deep tissue work. Many people enjoy this as it allows enough time to slow down, relax and benefit from the therapeutic effects of massage therapy.',
      duration: '1 hr 45 mins',
      basePrice: 110,
      currentPrice: 110,
      discountPercentage: 0,
      category: 'standard',
      hasAddons: true,
      isActive: true,
      sortOrder: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pkg_009',
      name: 'Prenatal Massage',
      description: 'Prenatal sessions include full-body massage with the added comfort of pillows to provide that added comfort and security! Prenatal sessions are light to light-medium pressure, no deep tissue will be offered.',
      duration: '1 hr 15 mins',
      basePrice: 75,
      currentPrice: 75,
      discountPercentage: 0,
      category: 'specialty',
      hasAddons: false,
      isActive: true,
      sortOrder: 9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pkg_010',
      name: '15-minute Chair Massage',
      description: 'You can come in and receive a 15 minute chair massage or for an additional travel fee I can come to you!',
      duration: '15 mins',
      basePrice: 20,
      currentPrice: 20,
      discountPercentage: 0,
      category: 'specialty',
      hasAddons: false,
      isActive: true,
      sortOrder: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(defaultPackages, null, 2));
}

// Initialize addons file with default data if it doesn't exist
if (!fs.existsSync(ADDONS_FILE)) {
  const defaultAddons: AddOnService[] = [
    {
      id: 'addon_001',
      name: 'Essential Oils',
      description: 'Aromatherapy enhancement with your choice of essential oils',
      price: 10,
      isActive: true,
      sortOrder: 1,
    },
    {
      id: 'addon_002',
      name: 'CBD Oil',
      description: 'CBD-infused massage oil for enhanced relaxation',
      price: 10,
      isActive: true,
      sortOrder: 2,
    },
    {
      id: 'addon_003',
      name: 'Exfoliation',
      description: 'Full body exfoliation treatment',
      price: 10,
      isActive: true,
      sortOrder: 3,
    },
    {
      id: 'addon_004',
      name: 'Hot Stones',
      description: 'Heated stone therapy for deep muscle relaxation',
      price: 10,
      isActive: true,
      sortOrder: 4,
    },
  ];
  fs.writeFileSync(ADDONS_FILE, JSON.stringify(defaultAddons, null, 2));
}

// Package Management Functions
export function getAllPackages(): Package[] {
  const data = fs.readFileSync(PACKAGES_FILE, 'utf-8');
  const packages = JSON.parse(data) as Package[];
  return packages.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActivePackages(): Package[] {
  return getAllPackages().filter(pkg => pkg.isActive);
}

export function getPackageById(id: string): Package | null {
  const packages = getAllPackages();
  return packages.find(pkg => pkg.id === id) || null;
}

export function createPackage(packageData: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Package {
  const packages = getAllPackages();
  const newPackage: Package = {
    ...packageData,
    id: `pkg_${Date.now()}`,
    currentPrice: packageData.basePrice * (1 - packageData.discountPercentage / 100),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  packages.push(newPackage);
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));
  return newPackage;
}

export function updatePackage(id: string, updates: Partial<Package>): Package | null {
  const packages = getAllPackages();
  const index = packages.findIndex(pkg => pkg.id === id);

  if (index === -1) return null;

  const updatedPackage: Package = {
    ...packages[index],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  };

  // Recalculate current price if basePrice or discount changed
  if (updates.basePrice !== undefined || updates.discountPercentage !== undefined) {
    updatedPackage.currentPrice = updatedPackage.basePrice * (1 - updatedPackage.discountPercentage / 100);
  }

  packages[index] = updatedPackage;
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));
  return updatedPackage;
}

export function deletePackage(id: string): boolean {
  const packages = getAllPackages();
  const filtered = packages.filter(pkg => pkg.id !== id);

  if (filtered.length === packages.length) return false;

  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// Add-on Management Functions
export function getAllAddons(): AddOnService[] {
  const data = fs.readFileSync(ADDONS_FILE, 'utf-8');
  const addons = JSON.parse(data) as AddOnService[];
  return addons.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveAddons(): AddOnService[] {
  return getAllAddons().filter(addon => addon.isActive);
}

export function updateAddon(id: string, updates: Partial<AddOnService>): AddOnService | null {
  const addons = getAllAddons();
  const index = addons.findIndex(addon => addon.id === id);

  if (index === -1) return null;

  addons[index] = { ...addons[index], ...updates };
  fs.writeFileSync(ADDONS_FILE, JSON.stringify(addons, null, 2));
  return addons[index];
}
