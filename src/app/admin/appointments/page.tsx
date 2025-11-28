'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  ChevronDown,
  X,
  Edit2,
  Trash2,
  RefreshCw,
  Filter,
  List,
  CalendarDays,
} from 'lucide-react';
import { Package, AddOnService } from '@/types/packages';
import CalendarView from '@/components/admin/CalendarView';
import styles from './page.module.css';

interface Appointment {
  id: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  addons: string[];
  addonsTotal: number;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  createdAt: string;
  createdBy: 'customer' | 'admin';
}

interface CustomerNote {
  id: string;
  customerId: string;
  appointmentId?: string;
  note?: string; // For backward compatibility
  content?: string;
  createdAt: string;
}

const statusColors: Record<Appointment['status'], string> = {
  scheduled: '#3b82f6',
  confirmed: '#10b981',
  completed: '#6b7280',
  cancelled: '#ef4444',
  'no-show': '#f59e0b',
};

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
];

type DateFilterType = 'today' | 'tomorrow' | 'yesterday' | 'week' | 'month' | 'all' | 'custom';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<AddOnService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [quickDateFilter, setQuickDateFilter] = useState<DateFilterType>('today');
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    date: '',
    time: '',
    status: 'scheduled' as Appointment['status'],
    notes: '',
    addons: [] as string[],
  });

  useEffect(() => {
    fetchAppointments();
    fetchPackagesAndAddons();
    // Set today's date as default filter
    const today = new Date().toISOString().split('T')[0];
    setDateFilter(today);
  }, []);

  async function fetchPackagesAndAddons() {
    try {
      const [packagesRes, addonsRes] = await Promise.all([
        fetch('/api/admin/packages'),
        fetch('/api/admin/addons')
      ]);

      if (packagesRes.ok && addonsRes.ok) {
        const packagesData = await packagesRes.json();
        const addonsData = await addonsRes.json();
        setPackages(packagesData);
        setAddons(addonsData);
      }
    } catch (error) {
      console.error('Failed to fetch packages/addons:', error);
    }
  }

  // Helper function to get date range based on quick filter
  function getDateRange(filterType: DateFilterType): { start: string; end: string } | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filterType) {
      case 'today': {
        const dateStr = today.toISOString().split('T')[0];
        return { start: dateStr, end: dateStr };
      }
      case 'tomorrow': {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        return { start: dateStr, end: dateStr };
      }
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split('T')[0];
        return { start: dateStr, end: dateStr };
      }
      case 'week': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return {
          start: startOfWeek.toISOString().split('T')[0],
          end: endOfWeek.toISOString().split('T')[0],
        };
      }
      case 'month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          start: startOfMonth.toISOString().split('T')[0],
          end: endOfMonth.toISOString().split('T')[0],
        };
      }
      default:
        return null;
    }
  }

  // Handle quick date filter clicks
  function handleQuickDateFilter(filterType: DateFilterType) {
    setQuickDateFilter(filterType);

    if (filterType === 'all') {
      setDateFilter('');
    } else if (filterType === 'custom') {
      // Keep current dateFilter value for custom
    } else {
      const range = getDateRange(filterType);
      if (range) {
        // For single day filters, set the exact date
        if (filterType === 'today' || filterType === 'tomorrow' || filterType === 'yesterday') {
          setDateFilter(range.start);
        } else {
          // For week/month, we'll use the start date but filter by range
          setDateFilter(range.start);
        }
      }
    }
  }

  async function fetchAppointments() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomerNotes(customerId: string) {
    try {
      const response = await fetch(`/api/admin/notes?customerId=${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setCustomerNotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }

  function calculateAddonsTotal(addonNames: string[]): number {
    return addonNames.reduce((total, addonName) => {
      const addon = addons.find(a => a.name === addonName);
      return total + (addon?.price || 0);
    }, 0);
  }

  async function handleSaveAppointment() {
    const selectedPackage = packages.find(p => p.id === formData.serviceId);
    if (!selectedPackage) {
      alert('Please select a service');
      return;
    }

    const addonsTotal = calculateAddonsTotal(formData.addons);

    const appointmentData = {
      ...formData,
      serviceName: selectedPackage.name,
      servicePrice: selectedPackage.currentPrice,
      duration: parseInt(selectedPackage.duration),
      addonsTotal,
    };

    try {
      const method = editingAppointment ? 'PATCH' : 'POST';
      const body = editingAppointment
        ? { id: editingAppointment.id, ...appointmentData }
        : appointmentData;

      const response = await fetch('/api/admin/appointments', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchAppointments();
        closeModal();
      } else {
        const error = await response.json();
        alert(`Failed to save appointment: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to save appointment:', error);
      alert('Failed to save appointment');
    }
  }

  async function handleDeleteAppointment(id: string) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`/api/admin/appointments?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAppointments();
      } else {
        const error = await response.json();
        alert(`Failed to delete appointment: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  }

  async function handleUpdateStatus(id: string, status: Appointment['status']) {
    try {
      const response = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setAppointments(appointments.map(a =>
          a.id === id ? { ...a, status } : a
        ));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  async function handleAddNote() {
    if (!selectedCustomerId || !newNote.trim()) return;

    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          note: newNote,
        }),
      });

      if (response.ok) {
        setNewNote('');
        fetchCustomerNotes(selectedCustomerId);
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  }

  async function handleDeleteNote(noteId: string) {
    try {
      const response = await fetch(`/api/admin/notes?id=${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok && selectedCustomerId) {
        fetchCustomerNotes(selectedCustomerId);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }

  function openCreateModal() {
    setEditingAppointment(null);
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      serviceId: '',
      date: today,
      time: '',
      status: 'scheduled',
      notes: '',
      addons: [],
    });
    setShowModal(true);
  }

  function openEditModal(appointment: Appointment) {
    setEditingAppointment(appointment);
    setFormData({
      customerId: appointment.customerId || '',
      customerName: appointment.customerName,
      customerEmail: appointment.customerEmail,
      customerPhone: appointment.customerPhone,
      serviceId: appointment.serviceId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes,
      addons: appointment.addons || [],
    });
    setShowModal(true);
  }

  function openNotesModal(customerId: string, customerName: string) {
    setSelectedCustomerId(customerId);
    setShowNotesModal(true);
    fetchCustomerNotes(customerId);
  }

  function closeModal() {
    setShowModal(false);
    setEditingAppointment(null);
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch =
      appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

    // Handle date filtering based on quick filter type
    let matchesDate = true;
    if (quickDateFilter !== 'all') {
      const range = getDateRange(quickDateFilter);
      if (range) {
        const appointmentDate = appointment.date;
        if (quickDateFilter === 'week' || quickDateFilter === 'month') {
          matchesDate = appointmentDate >= range.start && appointmentDate <= range.end;
        } else {
          matchesDate = appointmentDate === range.start;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const selectedPackage = packages.find(p => p.id === formData.serviceId);

  return (
    <div className={styles.appointmentsPage}>
      <div className={styles.header}>
        <div>
          <h1>Appointments</h1>
          <p>Manage all customer appointments</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`${styles.viewBtn} ${viewMode === 'calendar' ? styles.active : ''}`}
              title="Calendar View"
            >
              <CalendarDays size={18} />
            </button>
          </div>
          <button onClick={fetchAppointments} className={styles.refreshBtn} disabled={loading}>
            <RefreshCw size={18} className={loading ? styles.spinning : ''} />
          </button>
          <button onClick={openCreateModal} className={styles.createBtn}>
            <Plus size={18} />
            New Appointment
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Date Filters */}
      <div className={styles.quickDateFilters}>
        <button
          className={`${styles.quickFilterBtn} ${quickDateFilter === 'yesterday' ? styles.active : ''}`}
          onClick={() => handleQuickDateFilter('yesterday')}
        >
          Yesterday
        </button>
        <button
          className={`${styles.quickFilterBtn} ${quickDateFilter === 'today' ? styles.active : ''}`}
          onClick={() => handleQuickDateFilter('today')}
        >
          Today
        </button>
        <button
          className={`${styles.quickFilterBtn} ${quickDateFilter === 'tomorrow' ? styles.active : ''}`}
          onClick={() => handleQuickDateFilter('tomorrow')}
        >
          Tomorrow
        </button>
        <button
          className={`${styles.quickFilterBtn} ${quickDateFilter === 'week' ? styles.active : ''}`}
          onClick={() => handleQuickDateFilter('week')}
        >
          This Week
        </button>
        <button
          className={`${styles.quickFilterBtn} ${quickDateFilter === 'month' ? styles.active : ''}`}
          onClick={() => handleQuickDateFilter('month')}
        >
          This Month
        </button>
        <button
          className={`${styles.quickFilterBtn} ${quickDateFilter === 'all' ? styles.active : ''}`}
          onClick={() => handleQuickDateFilter('all')}
        >
          All
        </button>
      </div>

      {viewMode === 'list' && (
        <div className={styles.stats}>
          <span>{filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {viewMode === 'calendar' ? (
        loading ? (
          <div className={styles.loading}>Loading appointments...</div>
        ) : (
          <CalendarView
            appointments={filteredAppointments}
            onAppointmentClick={openEditModal}
          />
        )
      ) : (
        <div className={styles.appointmentsList}>
          {loading ? (
            <div className={styles.loading}>Loading appointments...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className={styles.empty}>
              {searchTerm || statusFilter !== 'all' || dateFilter
                ? 'No appointments match your filters'
                : 'No appointments yet. Create your first appointment!'}
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
            <div key={appointment.id} className={styles.appointmentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.customerInfo}>
                  <h3>{appointment.customerName}</h3>
                  <div className={styles.contactInfo}>
                    {appointment.customerEmail && (
                      <span><Mail size={14} /> {appointment.customerEmail}</span>
                    )}
                    {appointment.customerPhone && (
                      <span><Phone size={14} /> {appointment.customerPhone}</span>
                    )}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleUpdateStatus(appointment.id, e.target.value as Appointment['status'])}
                    className={styles.statusSelect}
                    style={{ borderColor: statusColors[appointment.status] }}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                  <button
                    onClick={() => openEditModal(appointment)}
                    className={styles.iconBtn}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  {appointment.customerId && (
                    <button
                      onClick={() => openNotesModal(appointment.customerId!, appointment.customerName)}
                      className={styles.iconBtn}
                      title="Customer Notes"
                    >
                      <FileText size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.serviceInfo}>
                  <strong>{appointment.serviceName}</strong>
                  <span className={styles.price}>
                    ${appointment.servicePrice + appointment.addonsTotal}
                    {appointment.addonsTotal > 0 && (
                      <small> (+ ${appointment.addonsTotal} addons)</small>
                    )}
                  </span>
                </div>

                <div className={styles.dateTimeInfo}>
                  <span><Calendar size={14} /> {formatDate(appointment.date)}</span>
                  <span><Clock size={14} /> {appointment.time}</span>
                  <span>{appointment.duration} mins</span>
                </div>

                {appointment.addons && appointment.addons.length > 0 && (
                  <div className={styles.addonsInfo}>
                    <strong>Add-ons:</strong> {appointment.addons.join(', ')}
                  </div>
                )}

                {appointment.notes && (
                  <div className={styles.notesPreview}>
                    <FileText size={14} />
                    <span>{appointment.notes}</span>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.createdBy}>
                  Created by {appointment.createdBy}
                </span>
                <span
                  className={styles.statusBadge}
                  style={{ backgroundColor: `${statusColors[appointment.status]}20`, color: statusColors[appointment.status] }}
                >
                  {appointment.status}
                </span>
              </div>
            </div>
          ))
        )}
        </div>
      )}

      {/* Create/Edit Appointment Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</h2>
              <button onClick={closeModal} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formSection}>
                <h3>Customer Information</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Customer name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="customer@email.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Service Details</h3>
                <div className={styles.formGroup}>
                  <label>Service *</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  >
                    <option value="">Select a service</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.currentPrice.toFixed(2)} ({pkg.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPackage?.hasAddons && (
                  <div className={styles.formGroup}>
                    <label>Add-ons (+$10 each)</label>
                    <div className={styles.addonsGrid}>
                      {addons.filter(a => a.isActive).map((addon) => (
                        <label key={addon.id} className={styles.addonCheckbox}>
                          <input
                            type="checkbox"
                            checked={formData.addons.includes(addon.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, addons: [...formData.addons, addon.name] });
                              } else {
                                setFormData({ ...formData, addons: formData.addons.filter(a => a !== addon.name) });
                              }
                            }}
                          />
                          <span>{addon.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formSection}>
                <h3>Schedule</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Time *</label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>Notes</h3>
                <div className={styles.formGroup}>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any notes about this appointment..."
                    rows={3}
                  />
                </div>
              </div>

              {selectedPackage && (
                <div className={styles.priceSummary}>
                  <div className={styles.priceRow}>
                    <span>Service:</span>
                    <span>${selectedPackage.currentPrice.toFixed(2)}</span>
                  </div>
                  {formData.addons.length > 0 && (
                    <div className={styles.priceRow}>
                      <span>Add-ons ({formData.addons.length}):</span>
                      <span>${calculateAddonsTotal(formData.addons).toFixed(2)}</span>
                    </div>
                  )}
                  <div className={`${styles.priceRow} ${styles.total}`}>
                    <span>Total:</span>
                    <span>${(selectedPackage.currentPrice + calculateAddonsTotal(formData.addons)).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleSaveAppointment} className={styles.saveBtn}>
                {editingAppointment ? 'Update Appointment' : 'Create Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Notes Modal */}
      {showNotesModal && selectedCustomerId && (
        <div className={styles.modalOverlay} onClick={() => setShowNotesModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Customer Notes</h2>
              <button onClick={() => setShowNotesModal(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.addNoteSection}>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this customer..."
                  rows={3}
                />
                <button onClick={handleAddNote} className={styles.addNoteBtn} disabled={!newNote.trim()}>
                  Add Note
                </button>
              </div>

              <div className={styles.notesList}>
                {customerNotes.length === 0 ? (
                  <div className={styles.noNotes}>No notes yet for this customer</div>
                ) : (
                  customerNotes.map((note) => (
                    <div key={note.id} className={styles.noteItem}>
                      <div className={styles.noteContent}>
                        <p>{note.content || note.note}</p>
                        <span className={styles.noteDate}>
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className={styles.deleteNoteBtn}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
