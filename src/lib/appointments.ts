import { Appointment, CustomerNote } from '@/types/appointments';
import fs from 'fs';
import path from 'path';

// For now, we'll use a JSON file for data persistence
// In production, this should be replaced with a proper database
const DATA_DIR = path.join(process.cwd(), 'data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const NOTES_FILE = path.join(DATA_DIR, 'customer-notes.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeJsonFile<T>(filePath: string, data: T): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Appointments CRUD
export function getAllAppointments(): Appointment[] {
  return readJsonFile<Appointment[]>(APPOINTMENTS_FILE, []);
}

export function getAppointmentById(id: string): Appointment | undefined {
  const appointments = getAllAppointments();
  return appointments.find(a => a.id === id);
}

export function getAppointmentsByCustomerId(customerId: string): Appointment[] {
  const appointments = getAllAppointments();
  return appointments.filter(a => a.customerId === customerId);
}

export function getAppointmentsByDate(date: string): Appointment[] {
  const appointments = getAllAppointments();
  return appointments.filter(a => a.date === date);
}

export function createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
  const appointments = getAllAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  writeJsonFile(APPOINTMENTS_FILE, appointments);
  return newAppointment;
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
  const appointments = getAllAppointments();
  const index = appointments.findIndex(a => a.id === id);
  if (index === -1) return null;

  appointments[index] = {
    ...appointments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile(APPOINTMENTS_FILE, appointments);
  return appointments[index];
}

export function deleteAppointment(id: string): boolean {
  const appointments = getAllAppointments();
  const index = appointments.findIndex(a => a.id === id);
  if (index === -1) return false;

  appointments.splice(index, 1);
  writeJsonFile(APPOINTMENTS_FILE, appointments);
  return true;
}

// Customer Notes CRUD
export function getAllNotes(): CustomerNote[] {
  return readJsonFile<CustomerNote[]>(NOTES_FILE, []);
}

export function getNotesByCustomerId(customerId: string): CustomerNote[] {
  const notes = getAllNotes();
  return notes.filter(n => n.customerId === customerId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createNote(note: Omit<CustomerNote, 'id' | 'createdAt'>): CustomerNote {
  const notes = getAllNotes();
  const newNote: CustomerNote = {
    ...note,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  notes.push(newNote);
  writeJsonFile(NOTES_FILE, notes);
  return newNote;
}

export function deleteNote(id: string): boolean {
  const notes = getAllNotes();
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return false;

  notes.splice(index, 1);
  writeJsonFile(NOTES_FILE, notes);
  return true;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
