export interface Package {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g., "45 mins", "1 hr 15 mins"
  basePrice: number;
  currentPrice: number; // Price after discount
  discountPercentage: number; // 0-100
  discountLabel?: string; // e.g., "Holiday Special", "Limited Time"
  category: 'standard' | 'specialty' | 'addon';
  hasAddons: boolean;
  isActive: boolean; // Can be toggled on/off
  sortOrder: number; // For ordering on website
  createdAt: string;
  updatedAt: string;
}

export interface AddOnService {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
}

export interface CreatePackageDTO {
  name: string;
  description: string;
  duration: string;
  basePrice: number;
  discountPercentage?: number;
  discountLabel?: string;
  category: 'standard' | 'specialty' | 'addon';
  hasAddons: boolean;
  isActive?: boolean;
}

export interface UpdatePackageDTO extends Partial<CreatePackageDTO> {
  id: string;
}
