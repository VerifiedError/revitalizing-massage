export interface Appointment {
  id: string;
  customerId: string | null; // null for walk-ins or admin-created without customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  addons: string[];
  addonsTotal: number;
  date: string; // ISO date string
  time: string;
  duration: number; // minutes
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: 'customer' | 'admin';
}

export interface CustomerNote {
  id: string;
  customerId: string;
  appointmentId?: string;
  note: string;
  createdAt: string;
  createdBy: string; // admin user id
}

export interface CustomerProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone?: string;
  notes: CustomerNote[];
  appointments: Appointment[];
  totalAppointments: number;
  totalSpent: number;
}
