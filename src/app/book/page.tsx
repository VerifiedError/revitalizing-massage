'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { services, addons } from '@/data/services';
import styles from './page.module.css';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function BookPage() {
  const [formData, setFormData] = useState({
    service: '',
    selectedAddons: [] as string[],
    date: getTodayDate(),
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would integrate with Square or another booking system
    alert('Thank you for your booking request! We will confirm your appointment shortly.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddonToggle = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(addonId)
        ? prev.selectedAddons.filter(id => id !== addonId)
        : [...prev.selectedAddons, addonId]
    }));
  };

  const selectedService = services.find(s => s.id === formData.service);
  const addonTotal = formData.selectedAddons.length * 10;
  const total = selectedService ? selectedService.price + addonTotal : 0;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Book Your Appointment</h1>
          <p className={styles.subtitle}>
            Select your preferred service, date, and time. We&apos;ll confirm your appointment via email.
          </p>
        </div>
      </section>

      <section className={styles.booking}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Select Service</h2>
              <div className={styles.serviceGrid}>
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`${styles.serviceOption} ${formData.service === service.id ? styles.selected : ''}`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={service.id}
                      checked={formData.service === service.id}
                      onChange={handleChange}
                      className={styles.radioInput}
                    />
                    <span className={styles.serviceName}>{service.title}</span>
                    <span className={styles.serviceDetails}>
                      {service.duration} &bull; ${service.price}
                    </span>
                    {service.hasAddons && (
                      <span className={styles.hasAddons}>
                        <Sparkles size={12} /> Includes add-on
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {selectedService?.hasAddons && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Select Add-on Service</h2>
                <p className={styles.sectionNote}>Choose your add-on service (+$10 each)</p>
                <div className={styles.addonsGrid}>
                  {addons.map((addon) => (
                    <label
                      key={addon.id}
                      className={`${styles.addonOption} ${formData.selectedAddons.includes(addon.id) ? styles.selected : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedAddons.includes(addon.id)}
                        onChange={() => handleAddonToggle(addon.id)}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.addonName}>{addon.name}</span>
                      <span className={styles.addonPrice}>+${addon.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Choose Date & Time</h2>
              <div className={styles.dateTimeGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="date" className={styles.label}>
                    <Calendar size={18} />
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="time" className={styles.label}>
                    <Clock size={18} />
                    Time
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Your Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name" className={styles.label}>
                    <User size={18} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>
                    <Mail size={18} />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    <Phone size={18} />
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label htmlFor="notes" className={styles.label}>
                    <MessageSquare size={18} />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Any areas of focus, health concerns, or special requests..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {selectedService && (
              <div className={styles.summary}>
                <h3>Booking Summary</h3>
                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>{selectedService.title}</span>
                    <span>${selectedService.price}.00</span>
                  </div>
                  <p className={styles.summaryDuration}>{selectedService.duration}</p>
                  {formData.selectedAddons.length > 0 && (
                    <div className={styles.summaryAddons}>
                      {formData.selectedAddons.map(addonId => {
                        const addon = addons.find(a => a.id === addonId);
                        return addon ? (
                          <div key={addon.id} className={styles.summaryRow}>
                            <span>{addon.name}</span>
                            <span>+${addon.price}.00</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                  {formData.date && (
                    <p className={styles.summaryDate}>
                      {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                  {formData.time && <p className={styles.summaryTime}>{formData.time}</p>}
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${total}.00</span>
                </div>
              </div>
            )}

            <button type="submit" className={styles.submitBtn}>
              Request Appointment
            </button>

            <p className={styles.disclaimer}>
              By submitting this form, you agree to our cancellation policy. Appointments cancelled less than 24 hours in advance may be charged the full session price.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
