'use client';

import { useState, useEffect } from 'react';
import { formatPhoneNumber } from '@/lib/business-settings';
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

const US_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Phoenix', label: 'Arizona Time (MST)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
];

export default function BusinessSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [formData, setFormData] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch business settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings/business');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showNotification('error', 'Failed to load business settings');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (field: keyof BusinessSettings, value: string) => {
    if (!formData) return;

    // Handle phone number formatting
    if (field === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData({
        ...formData,
        phone: value.replace(/\D/g, ''), // Store only digits
        phoneDisplay: formatted,
      });
      return;
    }

    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData) return false;

    // Required field validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.addressStreet.trim()) {
      newErrors.addressStreet = 'Street address is required';
    }

    if (!formData.addressCity.trim()) {
      newErrors.addressCity = 'City is required';
    }

    if (!formData.addressState.trim()) {
      newErrors.addressState = 'State is required';
    } else if (formData.addressState.length !== 2) {
      newErrors.addressState = 'State must be 2 characters (e.g., KS)';
    }

    if (!formData.addressZip.trim()) {
      newErrors.addressZip = 'Zip code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.addressZip)) {
      newErrors.addressZip = 'Invalid zip code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!formData || !validateForm()) return;

    try {
      setSaving(true);

      const response = await fetch('/api/admin/settings/business', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setFormData(updatedSettings);
      showNotification('success', 'Business settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Failed to save settings'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (settings) {
      setFormData(settings);
      setErrors({});
      showNotification('success', 'Changes reverted');
    }
  };

  const hasChanges = () => {
    if (!settings || !formData) return false;
    return JSON.stringify(settings) !== JSON.stringify(formData);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading business settings...</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Failed to load business settings</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Business Settings</h1>
          <p>Manage your business information and contact details</p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`${styles.notification} ${
            notification.type === 'success'
              ? styles.notificationSuccess
              : styles.notificationError
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Form */}
      <div className={styles.form}>
        {/* Business Information Section */}
        <section className={styles.section}>
          <h2>Business Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="businessName">
              Business Name <span className={styles.required}>*</span>
            </label>
            <input
              id="businessName"
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className={errors.businessName ? styles.inputError : ''}
            />
            {errors.businessName && (
              <span className={styles.errorText}>{errors.businessName}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone">
                Phone Number <span className={styles.required}>*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phoneDisplay}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(785) 250-4599"
                className={errors.phone ? styles.inputError : ''}
              />
              {errors.phone && (
                <span className={styles.errorText}>{errors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </div>
          </div>
        </section>

        {/* Address Section */}
        <section className={styles.section}>
          <h2>Business Address</h2>

          <div className={styles.formGroup}>
            <label htmlFor="addressStreet">
              Street Address <span className={styles.required}>*</span>
            </label>
            <input
              id="addressStreet"
              type="text"
              value={formData.addressStreet}
              onChange={(e) => handleInputChange('addressStreet', e.target.value)}
              className={errors.addressStreet ? styles.inputError : ''}
            />
            {errors.addressStreet && (
              <span className={styles.errorText}>{errors.addressStreet}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="addressCity">
                City <span className={styles.required}>*</span>
              </label>
              <input
                id="addressCity"
                type="text"
                value={formData.addressCity}
                onChange={(e) => handleInputChange('addressCity', e.target.value)}
                className={errors.addressCity ? styles.inputError : ''}
              />
              {errors.addressCity && (
                <span className={styles.errorText}>{errors.addressCity}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="addressState">
                State <span className={styles.required}>*</span>
              </label>
              <input
                id="addressState"
                type="text"
                value={formData.addressState}
                onChange={(e) =>
                  handleInputChange('addressState', e.target.value.toUpperCase())
                }
                maxLength={2}
                placeholder="KS"
                className={errors.addressState ? styles.inputError : ''}
              />
              {errors.addressState && (
                <span className={styles.errorText}>{errors.addressState}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="addressZip">
                Zip Code <span className={styles.required}>*</span>
              </label>
              <input
                id="addressZip"
                type="text"
                value={formData.addressZip}
                onChange={(e) => handleInputChange('addressZip', e.target.value)}
                placeholder="66614"
                className={errors.addressZip ? styles.inputError : ''}
              />
              {errors.addressZip && (
                <span className={styles.errorText}>{errors.addressZip}</span>
              )}
            </div>
          </div>

          {/* Address Preview */}
          <div className={styles.preview}>
            <strong>Full Address Preview:</strong>
            <p>
              {formData.addressStreet}, {formData.addressCity},{' '}
              {formData.addressState} {formData.addressZip}
            </p>
          </div>
        </section>

        {/* Regional Settings Section */}
        <section className={styles.section}>
          <h2>Regional Settings</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
              >
                {US_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="taxRate">Tax Rate (%)</label>
            <input
              id="taxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.taxRate}
              onChange={(e) => handleInputChange('taxRate', e.target.value)}
            />
            <span className={styles.helpText}>
              Enter the tax rate as a percentage (e.g., 8.5 for 8.5%)
            </span>
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          className={styles.cancelBtn}
          onClick={handleCancel}
          disabled={!hasChanges() || saving}
        >
          Cancel
        </button>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!hasChanges() || saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
