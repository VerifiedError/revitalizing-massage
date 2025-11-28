'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, Settings, Trash2, Plus, Save } from 'lucide-react';
import styles from './page.module.css';

interface BusinessHours {
  id: number;
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  breakStartTime: string | null;
  breakEndTime: string | null;
}

interface BookingSettings {
  id: number;
  bufferMinutes: number;
  advanceBookingDays: number;
  minimumNoticeHours: number;
  allowSameDayBooking: boolean;
  maxAppointmentsPerDay: number;
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
}

export default function AvailabilityPage() {
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Blocked dates form state
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBusinessHours(),
        fetchBookingSettings(),
        fetchBlockedDates(),
      ]);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessHours = async () => {
    try {
      const res = await fetch('/api/admin/availability/hours');
      if (res.ok) {
        const data = await res.json();
        setBusinessHours(data);
      }
    } catch (error) {
      console.error('Failed to fetch business hours', error);
    }
  };

  const fetchBookingSettings = async () => {
    try {
      const res = await fetch('/api/admin/availability/booking-settings');
      if (res.ok) {
        const data = await res.json();
        setBookingSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch booking settings', error);
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch('/api/admin/availability/blocked-dates');
      if (res.ok) {
        const data = await res.json();
        setBlockedDates(data);
      }
    } catch (error) {
      console.error('Failed to fetch blocked dates', error);
    }
  };

  const handleBusinessHoursUpdate = async (dayOfWeek: number, updates: Partial<BusinessHours>) => {
    setSaving(`hours-${dayOfWeek}`);
    try {
      const res = await fetch('/api/admin/availability/hours', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayOfWeek, updates }),
      });

      if (res.ok) {
        await fetchBusinessHours();
      } else {
        alert('Failed to update business hours');
      }
    } catch (error) {
      console.error('Failed to update business hours', error);
      alert('Failed to update business hours');
    } finally {
      setSaving(null);
    }
  };

  const handleBookingSettingsUpdate = async () => {
    if (!bookingSettings) return;

    setSaving('booking-settings');
    try {
      const res = await fetch('/api/admin/availability/booking-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingSettings),
      });

      if (res.ok) {
        await fetchBookingSettings();
        alert('Booking settings updated successfully');
      } else {
        alert('Failed to update booking settings');
      }
    } catch (error) {
      console.error('Failed to update booking settings', error);
      alert('Failed to update booking settings');
    } finally {
      setSaving(null);
    }
  };

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    setSaving('block-date');
    try {
      const res = await fetch('/api/admin/availability/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, reason: newReason }),
      });

      if (res.ok) {
        await fetchBlockedDates();
        setNewDate('');
        setNewReason('');
      } else {
        alert('Failed to block date');
      }
    } catch (error) {
      console.error('Failed to block date', error);
      alert('Failed to block date');
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteBlockedDate = async (id: string) => {
    if (!confirm('Are you sure you want to unblock this date?')) return;

    setSaving(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/availability/blocked-dates?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchBlockedDates();
      } else {
        alert('Failed to delete blocked date');
      }
    } catch (error) {
      console.error('Failed to delete blocked date', error);
      alert('Failed to delete blocked date');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading availability settings...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Availability Management</h1>
        <p>Manage your weekly schedule, booking settings, and blocked dates</p>
      </div>

      {/* WEEKLY SCHEDULE SECTION */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Clock className={styles.icon} />
          <h2>Weekly Schedule</h2>
        </div>
        <p className={styles.sectionDesc}>Set your business hours for each day of the week</p>

        <div className={styles.weeklyGrid}>
          {businessHours.map((day) => (
            <div key={day.id} className={styles.dayCard}>
              <div className={styles.dayHeader}>
                <h3>{day.dayName}</h3>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={day.isOpen}
                    onChange={(e) => {
                      const isOpen = e.target.checked;
                      handleBusinessHoursUpdate(day.dayOfWeek, { isOpen });
                    }}
                  />
                  <span className={styles.toggleSlider}></span>
                  <span className={styles.toggleLabel}>{day.isOpen ? 'Open' : 'Closed'}</span>
                </label>
              </div>

              {day.isOpen && (
                <div className={styles.timeInputs}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Open Time</label>
                    <input
                      type="time"
                      className={styles.input}
                      value={day.openTime ? convertTo24Hour(day.openTime) : ''}
                      onChange={(e) => {
                        const openTime = convertTo12Hour(e.target.value);
                        handleBusinessHoursUpdate(day.dayOfWeek, { openTime });
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Close Time</label>
                    <input
                      type="time"
                      className={styles.input}
                      value={day.closeTime ? convertTo24Hour(day.closeTime) : ''}
                      onChange={(e) => {
                        const closeTime = convertTo12Hour(e.target.value);
                        handleBusinessHoursUpdate(day.dayOfWeek, { closeTime });
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Break Start (Optional)</label>
                    <input
                      type="time"
                      className={styles.input}
                      value={day.breakStartTime ? convertTo24Hour(day.breakStartTime) : ''}
                      onChange={(e) => {
                        const breakStartTime = e.target.value ? convertTo12Hour(e.target.value) : null;
                        handleBusinessHoursUpdate(day.dayOfWeek, { breakStartTime });
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Break End (Optional)</label>
                    <input
                      type="time"
                      className={styles.input}
                      value={day.breakEndTime ? convertTo24Hour(day.breakEndTime) : ''}
                      onChange={(e) => {
                        const breakEndTime = e.target.value ? convertTo12Hour(e.target.value) : null;
                        handleBusinessHoursUpdate(day.dayOfWeek, { breakEndTime });
                      }}
                    />
                  </div>
                </div>
              )}

              {saving === `hours-${day.dayOfWeek}` && (
                <div className={styles.savingIndicator}>Saving...</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING SETTINGS SECTION */}
      {bookingSettings && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Settings className={styles.icon} />
            <h2>Booking Settings</h2>
          </div>
          <p className={styles.sectionDesc}>Configure appointment booking rules and limits</p>

          <div className={styles.settingsGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Buffer Between Appointments (minutes)</label>
              <input
                type="number"
                className={styles.input}
                min="0"
                max="60"
                value={bookingSettings.bufferMinutes}
                onChange={(e) => setBookingSettings({
                  ...bookingSettings,
                  bufferMinutes: parseInt(e.target.value) || 0
                })}
              />
              <small className={styles.hint}>Time gap between appointments for cleanup</small>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Advance Booking Window (days)</label>
              <input
                type="number"
                className={styles.input}
                min="1"
                max="365"
                value={bookingSettings.advanceBookingDays}
                onChange={(e) => setBookingSettings({
                  ...bookingSettings,
                  advanceBookingDays: parseInt(e.target.value) || 1
                })}
              />
              <small className={styles.hint}>How far in advance clients can book</small>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Minimum Notice Required (hours)</label>
              <input
                type="number"
                className={styles.input}
                min="0"
                max="168"
                value={bookingSettings.minimumNoticeHours}
                onChange={(e) => setBookingSettings({
                  ...bookingSettings,
                  minimumNoticeHours: parseInt(e.target.value) || 0
                })}
              />
              <small className={styles.hint}>Minimum time before appointment can be booked</small>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Max Appointments Per Day</label>
              <input
                type="number"
                className={styles.input}
                min="1"
                max="20"
                value={bookingSettings.maxAppointmentsPerDay}
                onChange={(e) => setBookingSettings({
                  ...bookingSettings,
                  maxAppointmentsPerDay: parseInt(e.target.value) || 1
                })}
              />
              <small className={styles.hint}>Maximum bookings allowed per day</small>
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={bookingSettings.allowSameDayBooking}
                  onChange={(e) => setBookingSettings({
                    ...bookingSettings,
                    allowSameDayBooking: e.target.checked
                  })}
                />
                <span className={styles.toggleSlider}></span>
                <span className={styles.toggleLabel}>Allow Same-Day Booking</span>
              </label>
              <small className={styles.hint}>Let clients book appointments for today</small>
            </div>
          </div>

          <button
            className={styles.saveButton}
            onClick={handleBookingSettingsUpdate}
            disabled={saving === 'booking-settings'}
          >
            <Save size={20} />
            {saving === 'booking-settings' ? 'Saving...' : 'Save Booking Settings'}
          </button>
        </section>
      )}

      {/* BLOCKED DATES SECTION */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Calendar className={styles.icon} />
          <h2>Blocked Dates</h2>
        </div>
        <p className={styles.sectionDesc}>Block specific dates for vacation, holidays, or time off</p>

        <div className={styles.blockedDatesLayout}>
          <div className={styles.blockDateForm}>
            <h3 className={styles.formTitle}>Block a New Date</h3>
            <form onSubmit={handleBlockDate}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Select Date</label>
                <input
                  type="date"
                  className={styles.input}
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Reason (Optional)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g., Vacation, Holiday, Personal Day"
                />
              </div>
              <button
                type="submit"
                className={styles.blockButton}
                disabled={saving === 'block-date'}
              >
                <Plus size={20} />
                {saving === 'block-date' ? 'Blocking...' : 'Block Date'}
              </button>
            </form>
          </div>

          <div className={styles.blockedDatesList}>
            <h3 className={styles.listTitle}>Currently Blocked Dates</h3>
            {blockedDates.length === 0 ? (
              <p className={styles.emptyState}>No blocked dates. All dates are available for booking.</p>
            ) : (
              <div className={styles.datesList}>
                {blockedDates.map((item) => (
                  <div key={item.id} className={styles.blockedDateItem}>
                    <div className={styles.dateInfo}>
                      <div className={styles.dateText}>
                        {new Date(item.date + 'T12:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      {item.reason && (
                        <div className={styles.reasonText}>{item.reason}</div>
                      )}
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteBlockedDate(item.id)}
                      disabled={saving === `delete-${item.id}`}
                      title="Unblock date"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper functions to convert between 12-hour and 24-hour time formats
function convertTo24Hour(time12h: string): string {
  if (!time12h) return '';
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (period === 'PM' && hours !== '12') {
    hours = String(parseInt(hours) + 12);
  } else if (period === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
}

function convertTo12Hour(time24h: string): string {
  if (!time24h) return '';
  let [hours, minutes] = time24h.split(':');
  const hoursNum = parseInt(hours);
  const period = hoursNum >= 12 ? 'PM' : 'AM';
  const hours12 = hoursNum === 0 ? 12 : hoursNum > 12 ? hoursNum - 12 : hoursNum;

  return `${hours12.toString().padStart(2, '0')}:${minutes} ${period}`;
}
