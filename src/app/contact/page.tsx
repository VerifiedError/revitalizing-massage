'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import styles from './page.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you within 24 hours.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Have questions? We'd love to hear from you. Reach out and we'll respond as soon as we can.
          </p>
        </div>
      </section>

      <section className={styles.contact}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.info}>
              <h2>Get in Touch</h2>
              <p className={styles.infoText}>
                Whether you have a question about our services, need to reschedule an appointment, or want to share feedback, we're here to help.
              </p>

              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3>Phone</h3>
                    <a href="tel:+1234567890">(123) 456-7890</a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3>Email</h3>
                    <a href="mailto:info@revitalizingmassage.com">info@revitalizingmassage.com</a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3>Location</h3>
                    <p>123 Wellness Street<br />Your City, State 12345</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3>Hours</h3>
                    <p>Mon - Fri: 9:00 AM - 7:00 PM<br />Sat: 10:00 AM - 5:00 PM<br />Sun: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formWrapper}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Send a Message</h2>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Question</option>
                      <option value="services">Services Information</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="How can we help you?"
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.map}>
        <div className={styles.mapPlaceholder}>
          <MapPin size={48} />
          <p>Map will be displayed here</p>
          <span>123 Wellness Street, Your City, State 12345</span>
        </div>
      </section>
    </div>
  );
}
