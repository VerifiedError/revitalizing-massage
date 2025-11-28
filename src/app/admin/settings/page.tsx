'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle, Building2, DollarSign, Globe } from 'lucide-react';
import styles from './page.module.css';

interface BusinessSettings {
  id: number;
  businessName: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressFull: string;
  timezone: string;
  taxRate: string;
  currency: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<BusinessSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/business');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      } else {
        setError('Failed to load business settings');
      }
    } catch (error) {
      console.error('Failed to load settings', error);
      setError('Failed to load business settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof BusinessSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/settings/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        setMessage('Business settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Business Settings</h1>
        <p>Manage your business contact information and configuration</p>
      </div>

      {message && (
        <div className={styles.successMessage}>
          <CheckCircle size={20} />
          {message}
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Business Information */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <Building2 size={20} />
          <span>Business Information</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Business Name *</label>
            <input
              type="text"
              className={styles.input}
              value={settings.businessName || ''}
              onChange={e => handleChange('businessName', e.target.value)}
              placeholder="Revitalizing Massage"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address *</label>
            <input
              type="email"
              className={styles.input}
              value={settings.email || ''}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="contact@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number (Full) *</label>
            <input
              type="tel"
              className={styles.input}
              value={settings.phone || ''}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="+1 785-250-4599"
            />
            <small className={styles.helpText}>Include country code and area code</small>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Display Format *</label>
            <input
              type="text"
              className={styles.input}
              value={settings.phoneDisplay || ''}
              onChange={e => handleChange('phoneDisplay', e.target.value)}
              placeholder="(785) 250-4599"
            />
            <small className={styles.helpText}>How the phone number appears on the website</small>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Street Address *</label>
          <input
            type="text"
            className={styles.input}
            value={settings.addressStreet || ''}
            onChange={e => handleChange('addressStreet', e.target.value)}
            placeholder="2900 SW Atwood"
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>City *</label>
            <input
              type="text"
              className={styles.input}
              value={settings.addressCity || ''}
              onChange={e => handleChange('addressCity', e.target.value)}
              placeholder="Topeka"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>State *</label>
            <input
              type="text"
              className={styles.input}
              value={settings.addressState || ''}
              onChange={e => handleChange('addressState', e.target.value)}
              placeholder="KS"
              maxLength={2}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Zip Code *</label>
            <input
              type="text"
              className={styles.input}
              value={settings.addressZip || ''}
              onChange={e => handleChange('addressZip', e.target.value)}
              placeholder="66614"
            />
          </div>
        </div>
      </section>

      {/* Business Configuration */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <Globe size={20} />
          <span>Business Configuration</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Timezone</label>
            <select
              className={styles.input}
              value={settings.timezone || 'America/Chicago'}
              onChange={e => handleChange('timezone', e.target.value)}
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="America/Anchorage">Alaska Time</option>
              <option value="Pacific/Honolulu">Hawaii Time</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Currency</label>
            <select
              className={styles.input}
              value={settings.currency || 'USD'}
              onChange={e => handleChange('currency', e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              className={styles.input}
              value={settings.taxRate || '0'}
              onChange={e => handleChange('taxRate', e.target.value)}
              placeholder="0.00"
            />
            <small className={styles.helpText}>For future invoicing features</small>
          </div>
        </div>
      </section>

      <div className={styles.saveSection}>
        <button
          className={styles.button}
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
