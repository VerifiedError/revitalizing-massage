'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

interface Appointment {
  id: string;
  date: string;
  time: string;
  serviceName: string;
  servicePrice: string;
  status: string;
  notes: string;
}

interface Note {
  id: string;
  note: string;
  createdAt: string;
}

interface ClientDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  totalSpend: number;
  appointments: Appointment[];
  notes: Note[];
}

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchClientDetails(params.id as string);
    }
  }, [params.id]);

  const fetchClientDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/clients/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data);
      } else {
        // Handle 404
      }
    } catch (error) {
      console.error('Failed to fetch client details', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (!client) return <div className={styles.container}>Client not found</div>;

  return (
    <div className={styles.container}>
      <div className="mb-6">
        <Link href="/admin/clients" className="flex items-center text-gray-600 hover:text-teal-600 mb-4">
          <ArrowLeft size={18} className="mr-2" />
          Back to Clients
        </Link>
      </div>

      <div className={styles.header}>
        <div>
          <h1>{client.name}</h1>
          <div className="text-gray-500">
            {client.email} • {client.phone}
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Lifetime Value</div>
          <div className={styles.statValue}>${client.totalSpend.toFixed(2)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Visits</div>
          <div className={styles.statValue}>{client.totalAppointments}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>First Visit</div>
          <div className="text-lg font-semibold">
            {client.appointments.length > 0 
              ? new Date(client.appointments[client.appointments.length - 1].date).toLocaleDateString() 
              : 'N/A'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Appointment History</div>
            <div className={styles.timeline}>
              {client.appointments.map((apt) => (
                <div key={apt.id} className={styles.appointmentCard}>
                  <div>
                    <div className={styles.aptDate}>
                      {new Date(apt.date).toLocaleDateString()} at {apt.time}
                    </div>
                    <div className={styles.aptService}>{apt.serviceName}</div>
                    {apt.notes && <div className="text-sm text-gray-500 mt-1">"{apt.notes}"</div>}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${parseFloat(apt.servicePrice).toFixed(2)}</div>
                    <span className={`${styles.statusBadge} ${styles[`status_${apt.status.replace('-', '_')}`]}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Admin Notes</div>
            <div className={styles.notesList}>
              {client.notes.length === 0 ? (
                <p className="text-gray-400 italic">No notes recorded.</p>
              ) : (
                client.notes.map((note) => (
                  <div key={note.id} className={styles.noteCard}>
                    <div className={styles.noteDate}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                    <div>{note.note}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
