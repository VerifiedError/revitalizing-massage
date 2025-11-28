'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { businessInfo } from '@/data/services';
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
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>
            Have questions? I&apos;d love to hear from you. Reach out and I&apos;ll respond as soon as possible.
          </p>
        </div>
      </section>

      <section className={styles.contact}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.info}>
              <div className={styles.infoImage}>
                <img
                  src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=1200&h=800&fit=crop"
                  alt="Contact Revitalizing Massage"
                />
              </div>
              <h2>Contact Information</h2>
              <p className={styles.infoText}>
                Whether you have a question about services, need to reschedule an appointment, or want to share feedback, I&apos;m here to help.
              </p>

              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3>Phone</h3>
                    <a href={`tel:${businessInfo.phone.replace(/\s/g, '')}`}>{businessInfo.phoneDisplay}</a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3>Email</h3>
                    <a href={`mailto:${businessInfo.email}`}>{businessInfo.email}</a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3>Location</h3>
                    <p>{businessInfo.address.street}<br />{businessInfo.address.city}, {businessInfo.address.state} {businessInfo.address.zip}</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3>Hours</h3>
                    <p>By Appointment Only<br />Please call or book online</p>
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
        <div className={styles.mapContainer}>
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=2400&h=800&fit=crop"
            alt="Topeka, Kansas location"
            className={styles.mapImage}
          />
          <div className={styles.mapOverlay}>
            <MapPin size={48} />
            <p>{businessInfo.address.full}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
