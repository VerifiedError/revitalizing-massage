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
  FileText,
  MessageSquare,
  Send,
  PhoneCall,
  Smartphone,
  Users,
  Plus,
  X,
  Trash2,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import styles from './page.module.css';

interface Communication {
  id: string;
  customerId: string;
  type: string;
  subject: string | null;
  content: string;
  direction: string | null;
  tags: string[];
  createdBy: string;
  createdAt: string;
  metadata: any;
}

interface NoteTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  tags: string[];
}

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
  healthInfo: any;
  preferences: any;
  appointments: any[];
  communications: Communication[];
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
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [showAddForm, setShowAddForm] = useState(false);
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  const [formData, setFormData] = useState({
    type: 'note',
    subject: '',
    content: '',
    direction: '',
    tags: [] as string[],
  });

  useEffect(() => {
    fetchCustomerDetails();
    fetchTemplates();
  }, [resolvedParams.id]);

  async function fetchCustomerDetails() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/customers/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        // Fetch communications separately
        const commResponse = await fetch(`/api/admin/communications?customerId=${resolvedParams.id}`);
        if (commResponse.ok) {
          data.communications = await commResponse.json();
        }
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

  async function fetchTemplates() {
    try {
      const response = await fetch('/api/admin/note-templates');
      if (response.ok) {
        setTemplates(await response.json());
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }

  async function handleSubmitCommunication(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.content.trim() || !customerDetails) return;

    try {
      const response = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerDetails.customer.id,
          type: formData.type,
          subject: formData.subject || null,
          content: formData.content,
          direction: formData.direction || null,
          tags: formData.tags,
        }),
      });

      if (response.ok) {
        setFormData({ type: 'note', subject: '', content: '', direction: '', tags: [] });
        setShowAddForm(false);
        fetchCustomerDetails();
      }
    } catch (error) {
      console.error('Error creating communication:', error);
    }
  }

  async function handleDeleteCommunication(id: string) {
    if (!confirm('Delete this communication?')) return;

    try {
      const response = await fetch(`/api/admin/communications?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCustomerDetails();
      }
    } catch (error) {
      console.error('Error deleting communication:', error);
    }
  }

  function loadTemplate(templateId: string) {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        content: template.content,
        tags: [...template.tags],
      }));
    }
  }

  function toggleTag(tag: string) {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case 'email': return Mail;
      case 'phone': return PhoneCall;
      case 'sms': return Smartphone;
      case 'in-person': return Users;
      default: return MessageSquare;
    }
  }

  function getTypeClass(type: string) {
    switch (type) {
      case 'email': return styles.typeEmail;
      case 'phone': return styles.typePhone;
      case 'sms': return styles.typeSms;
      case 'in-person': return styles.typeInPerson;
      default: return styles.typeNote;
    }
  }

  function getTagClass(tag: string) {
    if (tag === 'important') return styles.tagImportant;
    if (tag === 'follow-up') return styles.tagFollowUp;
    if (tag === 'medical') return styles.tagMedical;
    return styles.tagDefault;
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
      case 'active': return styles.statusActive;
      case 'inactive': return styles.statusInactive;
      case 'blocked': return styles.statusBlocked;
      default: return styles.statusActive;
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

  const { customer, healthInfo, preferences, appointments, communications = [] } = customerDetails;

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
          <span>Communications</span>
          {communications.length > 0 && (
            <span className={styles.badge}>{communications.length}</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Notes/Communications Tab */}
        {activeTab === 'notes' && (
          <div className={styles.notesTab}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Communication Timeline</h2>
              <button
                className={styles.editButton}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? <X size={16} /> : <Plus size={16} />}
                <span>{showAddForm ? 'Cancel' : 'Add'}</span>
              </button>
            </div>

            {/* Add Communication Form */}
            {showAddForm && (
              <div className={styles.addCommunicationForm}>
                <h3 className={styles.formTitle}>Add Communication</h3>
                <form onSubmit={handleSubmitCommunication}>
                  <div className={styles.formGrid}>
                    {/* Type Select */}
                    <div className={styles.formGroup}>
                      <label htmlFor="type" className={styles.formLabel}>Type</label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className={styles.formSelect}
                      >
                        <option value="note">Note</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="sms">SMS</option>
                        <option value="in-person">In-Person</option>
                      </select>
                    </div>

                    {/* Template Select */}
                    {formData.type === 'note' && templates.length > 0 && (
                      <div className={`${styles.formGroup} ${styles.templateSelect}`}>
                        <label htmlFor="template" className={styles.formLabel}>Load Template</label>
                        <select
                          id="template"
                          onChange={(e) => e.target.value && loadTemplate(e.target.value)}
                          className={styles.formSelect}
                          defaultValue=""
                        >
                          <option value="">Select template...</option>
                          {templates.map(template => (
                            <option key={template.id} value={template.id}>
                              {template.category} - {template.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Direction (for email, phone, sms) */}
                    {['email', 'phone', 'sms'].includes(formData.type) && (
                      <div className={styles.formGroup}>
                        <label htmlFor="direction" className={styles.formLabel}>Direction</label>
                        <select
                          id="direction"
                          value={formData.direction}
                          onChange={(e) => setFormData(prev => ({ ...prev, direction: e.target.value }))}
                          className={styles.formSelect}
                        >
                          <option value="">None</option>
                          <option value="inbound">Inbound</option>
                          <option value="outbound">Outbound</option>
                        </select>
                      </div>
                    )}

                    {/* Subject (for email) */}
                    {formData.type === 'email' && (
                      <div className={`${styles.formGroup} ${styles.templateSelect}`}>
                        <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                        <input
                          type="text"
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                          className={styles.formInput}
                          placeholder="Email subject..."
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className={`${styles.formGroup} ${styles.templateSelect}`}>
                      <label htmlFor="content" className={styles.formLabel}>Content</label>
                      <textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className={styles.formTextarea}
                        placeholder="Enter communication content..."
                        required
                      />
                      <div className={styles.charCount}>{formData.content.length} characters</div>
                    </div>

                    {/* Quick Tags */}
                    <div className={`${styles.formGroup} ${styles.templateSelect}`}>
                      <label className={styles.formLabel}>Tags</label>
                      <div className={styles.quickTags}>
                        {['important', 'follow-up', 'medical', 'positive', 'concern'].map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`${styles.quickTagButton} ${formData.tags.includes(tag) ? styles.active : ''}`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setFormData({ type: 'note', subject: '', content: '', direction: '', tags: [] });
                      }}
                      className={`${styles.formButton} ${styles.cancelButton}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`${styles.formButton} ${styles.submitButton}`}
                      disabled={!formData.content.trim()}
                    >
                      <Plus size={18} />
                      Add Communication
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Communications Timeline */}
            {communications.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={48} className={styles.emptyIcon} />
                <p>No communications yet</p>
              </div>
            ) : (
              <div className={styles.communicationTimeline}>
                {communications.map((comm) => {
                  const TypeIcon = getTypeIcon(comm.type);
                  return (
                    <div key={comm.id} className={styles.communicationCard}>
                      <div className={styles.communicationHeader}>
                        <div className={styles.communicationMeta}>
                          <div className={`${styles.typeIcon} ${getTypeClass(comm.type)}`}>
                            <TypeIcon size={16} />
                          </div>
                          {comm.direction && (
                            <span className={`${styles.directionBadge} ${comm.direction === 'inbound' ? styles.directionInbound : styles.directionOutbound}`}>
                              {comm.direction === 'inbound' ? <ArrowDown size={10} /> : <ArrowUp size={10} />}
                              {comm.direction}
                            </span>
                          )}
                        </div>
                      </div>

                      {comm.subject && (
                        <h4 className={styles.communicationSubject}>{comm.subject}</h4>
                      )}

                      <p className={styles.communicationContent}>{comm.content}</p>

                      {comm.tags && comm.tags.length > 0 && (
                        <div className={styles.communicationTags}>
                          {comm.tags.map((tag, idx) => (
                            <span key={idx} className={`${styles.tag} ${getTagClass(tag)}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className={styles.communicationFooter}>
                        <div>
                          <span className={styles.timeAgo}>{formatTimeAgo(comm.createdAt)}</span>
                          <span className={styles.createdBy}> • by {comm.createdBy}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteCommunication(comm.id)}
                          className={styles.deleteButton}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Other tabs remain the same */}
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Customer Information</h2>
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
      </div>
    </div>
  );
}
