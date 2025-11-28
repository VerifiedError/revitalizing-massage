'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  User,
  Heart,
  Settings as SettingsIcon,
  Clock,
  FileText
} from 'lucide-react';
import styles from './page.module.css';

interface CustomerDetails {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    dateOfBirth: string | null;
    status: string;
    totalVisits: number;
    totalSpent: string;
    lastVisit: string | null;
    referralSource: string | null;
    marketingOptIn: boolean;
    createdAt: string;
  };
  healthInfo: {
    allergies: string | null;
    medicalConditions: string | null;
    medications: string | null;
    injuries: string | null;
    pregnancyStatus: boolean | null;
    pregnancyWeeks: number | null;
    pressurePreference: string | null;
    focusAreas: string | null;
    avoidAreas: string | null;
    specialRequests: string | null;
  } | null;
  preferences: {
    preferredDay: number | null;
    preferredTime: string | null;
    preferredServices: string | null;
    tableHeatingPreference: string | null;
    musicPreference: string | null;
    aromatherapyPreference: boolean | null;
  } | null;
  appointments: any[];
  notes: any[];
}

type TabType = 'overview' | 'appointments' | 'health' | 'preferences' | 'notes';

export default function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    fetchCustomerDetails();
  }, [resolvedParams.id]);

  async function fetchCustomerDetails() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/customers/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomerDetails(data);
      } else {
        router.push('/admin/customers');
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      router.push('/admin/customers');
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'blocked':
        return styles.statusBlocked;
      default:
        return styles.statusActive;
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading customer...</p>
      </div>
    );
  }

  if (!customerDetails) {
    return (
      <div className={styles.empty}>
        <p>Customer not found</p>
      </div>
    );
  }

  const { customer, healthInfo, preferences, appointments, notes } = customerDetails;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => router.push('/admin/customers')}
        >
          <ArrowLeft size={20} />
          <span>Back to Customers</span>
        </button>

        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.customerName}>
              {customer.firstName} {customer.lastName}
            </h1>
            <span className={`${styles.statusBadge} ${getStatusColor(customer.status)}`}>
              {customer.status}
            </span>
          </div>

          <div className={styles.contactInfo}>
            {customer.email && (
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>{customer.email}</span>
              </div>
            )}
            {customer.phone && (
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>{customer.phone}</span>
              </div>
            )}
          </div>

          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <Calendar size={20} className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{customer.totalVisits}</span>
                <span className={styles.statLabel}>Total Visits</span>
              </div>
            </div>
            <div className={styles.quickStat}>
              <DollarSign size={20} className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{formatCurrency(customer.totalSpent)}</span>
                <span className={styles.statLabel}>Total Spent</span>
              </div>
            </div>
            <div className={styles.quickStat}>
              <Clock size={20} className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{formatDate(customer.lastVisit)}</span>
                <span className={styles.statLabel}>Last Visit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <User size={18} />
          <span>Overview</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'appointments' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={18} />
          <span>Appointments</span>
          {appointments.length > 0 && (
            <span className={styles.badge}>{appointments.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'health' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('health')}
        >
          <Heart size={18} />
          <span>Health Info</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'preferences' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <SettingsIcon size={18} />
          <span>Preferences</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'notes' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <FileText size={18} />
          <span>Notes</span>
          {notes.length > 0 && (
            <span className={styles.badge}>{notes.length}</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Customer Information</h2>
                <button className={styles.editButton}>
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{customer.email || 'Not provided'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phone</span>
                  <span className={styles.infoValue}>{customer.phone || 'Not provided'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Date of Birth</span>
                  <span className={styles.infoValue}>
                    {customer.dateOfBirth ? formatDate(customer.dateOfBirth) : 'Not provided'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Referral Source</span>
                  <span className={styles.infoValue}>{customer.referralSource || 'Unknown'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Marketing Opt-in</span>
                  <span className={styles.infoValue}>{customer.marketingOptIn ? 'Yes' : 'No'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Customer Since</span>
                  <span className={styles.infoValue}>{formatDate(customer.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className={styles.appointmentsTab}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Appointment History</h2>
            </div>
            {appointments.length === 0 ? (
              <div className={styles.emptyState}>
                <Calendar size={48} className={styles.emptyIcon} />
                <p>No appointments yet</p>
              </div>
            ) : (
              <div className={styles.appointmentList}>
                {appointments.map((apt) => (
                  <div key={apt.id} className={styles.appointmentCard}>
                    <div className={styles.appointmentHeader}>
                      <span className={styles.appointmentDate}>
                        {formatDate(apt.date)} at {apt.time}
                      </span>
                      <span className={`${styles.appointmentStatus} ${styles[`status${apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}`]}`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className={styles.appointmentDetails}>
                      <p className={styles.appointmentService}>{apt.serviceName}</p>
                      <p className={styles.appointmentPrice}>
                        {formatCurrency(apt.servicePrice)}
                        {parseFloat(apt.addonsTotal) > 0 && ` + ${formatCurrency(apt.addonsTotal)} add-ons`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Health Info Tab */}
        {activeTab === 'health' && (
          <div className={styles.healthTab}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Health Information</h2>
                <button className={styles.editButton}>
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Allergies</span>
                  <span className={styles.infoValue}>{healthInfo?.allergies || 'None reported'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Medical Conditions</span>
                  <span className={styles.infoValue}>
                    {healthInfo?.medicalConditions || 'None reported'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Medications</span>
                  <span className={styles.infoValue}>{healthInfo?.medications || 'None reported'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Injuries</span>
                  <span className={styles.infoValue}>{healthInfo?.injuries || 'None reported'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Pressure Preference</span>
                  <span className={styles.infoValue}>
                    {healthInfo?.pressurePreference || 'Not specified'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Special Requests</span>
                  <span className={styles.infoValue}>
                    {healthInfo?.specialRequests || 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className={styles.preferencesTab}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Customer Preferences</h2>
                <button className={styles.editButton}>
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Preferred Time</span>
                  <span className={styles.infoValue}>
                    {preferences?.preferredTime || 'No preference'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Table Heating</span>
                  <span className={styles.infoValue}>
                    {preferences?.tableHeatingPreference || 'No preference'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Music</span>
                  <span className={styles.infoValue}>
                    {preferences?.musicPreference || 'No preference'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Aromatherapy</span>
                  <span className={styles.infoValue}>
                    {preferences?.aromatherapyPreference ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className={styles.notesTab}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Customer Notes</h2>
            </div>
            {notes.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={48} className={styles.emptyIcon} />
                <p>No notes yet</p>
              </div>
            ) : (
              <div className={styles.noteList}>
                {notes.map((note) => (
                  <div key={note.id} className={styles.noteCard}>
                    <p className={styles.noteText}>{note.note}</p>
                    <div className={styles.noteMeta}>
                      <span>{formatDate(note.createdAt)}</span>
                      <span>by {note.createdBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
