'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Trash2, Ban } from 'lucide-react';
import styles from './page.module.css';

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

export default function AvailabilityPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch('/api/admin/availability');
      if (res.ok) {
        const data = await res.json();
        setBlockedDates(data);
      }
    } catch (error) {
      console.error('Failed to fetch blocked dates', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    try {
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, reason: newReason }),
      });

      if (res.ok) {
        fetchBlockedDates();
        setNewDate('');
        setNewReason('');
      }
    } catch (error) {
      console.error('Failed to block date', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to unblock this date?')) return;

    try {
      const res = await fetch(`/api/admin/availability?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchBlockedDates();
      }
    } catch (error) {
      console.error('Failed to delete blocked date', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Availability Management</h1>
        <p>Manage your schedule and block out dates for vacation or time off.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Block a Date</h2>
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
                placeholder="e.g., Vacation, Sick Day"
              />
            </div>
            <button type="submit" className={styles.button}>
              Block Date
            </button>
          </form>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Blocked Dates</h2>
          <div className={styles.list}>
            {loading ? (
              <p>Loading...</p>
            ) : blockedDates.length === 0 ? (
              <p className={styles.empty}>No blocked dates found.</p>
            ) : (
              blockedDates.map((item) => (
                <div key={item.id} className={styles.blockedItem}>
                  <div>
                    <div className={styles.blockedDate}>
                      {new Date(item.date + 'T12:00:00').toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    {item.reason && (
                      <div className={styles.blockedReason}>{item.reason}</div>
                    )}
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item.id)}
                    title="Unblock date"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
