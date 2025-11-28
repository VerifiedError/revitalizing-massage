'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle, Building2, Clock, Globe } from 'lucide-react';
import styles from './page.module.css';

interface Setting {
  key: string;
  value: string;
  category: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data: Setting[] = await res.json();
        const settingsMap: Record<string, string> = {};
        data.forEach(s => {
          settingsMap[s.key] = s.value;
        });
        setSettings(settingsMap);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (category: string, keys: string[]) => {
    setSaving(true);
    setMessage('');
    
    try {
      const promises = keys.map(key => 
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            value: settings[key],
            category
          })
        })
      );

      await Promise.all(promises);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Global Settings</h1>
        <p>Manage business information, hours, and site configuration.</p>
      </div>

      {message && (
        <div className={styles.successMessage}>
          <CheckCircle size={20} />
          {message}
        </div>
      )}

      {/* Business Information */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <Building2 className="inline-block mr-2 mb-1" size={20} />
          Business Information
        </div>
        
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Business Name</label>
            <input
              className={styles.input}
              value={settings['business_name'] || ''}
              onChange={e => handleChange('business_name', e.target.value)}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              className={styles.input}
              value={settings['business_email'] || ''}
              onChange={e => handleChange('business_email', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number (Internal)</label>
            <input
              className={styles.input}
              value={settings['business_phone'] || ''}
              onChange={e => handleChange('business_phone', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Display</label>
            <input
              className={styles.input}
              value={settings['business_phone_display'] || ''}
              onChange={e => handleChange('business_phone_display', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Street Address</label>
          <input
            className={styles.input}
            value={settings['business_address_street'] || ''}
            onChange={e => handleChange('business_address_street', e.target.value)}
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input
              className={styles.input}
              value={settings['business_address_city'] || ''}
              onChange={e => handleChange('business_address_city', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>State</label>
            <input
              className={styles.input}
              value={settings['business_address_state'] || ''}
              onChange={e => handleChange('business_address_state', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Zip Code</label>
            <input
              className={styles.input}
              value={settings['business_address_zip'] || ''}
              onChange={e => handleChange('business_address_zip', e.target.value)}
            />
          </div>
        </div>

        <button 
          className={styles.button}
          onClick={() => handleSave('business', [
            'business_name', 'business_email', 'business_phone', 
            'business_phone_display', 'business_address_street',
            'business_address_city', 'business_address_state', 'business_address_zip'
          ])}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Business Info'}
        </button>
      </section>

      {/* Hours of Operation */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <Clock className="inline-block mr-2 mb-1" size={20} />
          Hours of Operation (Display Text)
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Weekdays</label>
          <input
            className={styles.input}
            value={settings['business_hours_weekdays'] || ''}
            onChange={e => handleChange('business_hours_weekdays', e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Saturday</label>
          <input
            className={styles.input}
            value={settings['business_hours_saturday'] || ''}
            onChange={e => handleChange('business_hours_saturday', e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Sunday</label>
          <input
            className={styles.input}
            value={settings['business_hours_sunday'] || ''}
            onChange={e => handleChange('business_hours_sunday', e.target.value)}
          />
        </div>

        <button 
          className={styles.button}
          onClick={() => handleSave('business', [
            'business_hours_weekdays', 'business_hours_saturday', 'business_hours_sunday'
          ])}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Hours'}
        </button>
      </section>
    </div>
  );
}
