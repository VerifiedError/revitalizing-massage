import Link from 'next/link';
import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import styles from './page.module.css';
import { Clock, Award, Heart, CheckCircle } from 'lucide-react';

const featuredServices = [
  {
    title: 'Swedish Massage',
    description: 'A gentle, relaxing massage using long strokes to ease tension and promote overall relaxation.',
    duration: '60 min',
    price: '$85',
    slug: 'swedish-massage',
  },
  {
    title: 'Deep Tissue Massage',
    description: 'Targeted pressure to relieve chronic muscle tension and break up knots in deeper muscle layers.',
    duration: '60 min',
    price: '$95',
    slug: 'deep-tissue',
  },
  {
    title: 'Hot Stone Massage',
    description: 'Heated stones placed on key points to melt away tension and promote deep relaxation.',
    duration: '75 min',
    price: '$110',
    slug: 'hot-stone',
  },
];

const benefits = [
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book appointments that fit your busy lifestyle with our easy online booking.',
  },
  {
    icon: Award,
    title: 'Licensed Therapists',
    description: 'All our massage therapists are fully licensed and experienced professionals.',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Every session is tailored to your specific needs and preferences.',
  },
];

export default function Home() {
  return (
    <>
      <Hero
        title="Relax. Restore. Revitalize."
        subtitle="Experience the healing power of professional massage therapy. Let us help you release tension, reduce stress, and restore balance to your body and mind."
      />

      {/* Services Section */}
      <section className={styles.services}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <p className={styles.sectionSubtitle}>
            Choose from our range of therapeutic massage services designed to meet your wellness needs.
          </p>
          <div className={styles.servicesGrid}>
            {featuredServices.map((service) => (
              <ServiceCard key={service.slug} {...service} />
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link href="/services" className={styles.viewAllBtn}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Us</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <div key={benefit.title} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <benefit.icon size={32} />
                </div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className={styles.aboutPreview}>
        <div className={styles.container}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <h2 className={styles.sectionTitle}>Your Wellness Journey Starts Here</h2>
              <p className={styles.aboutDescription}>
                At Revitalizing Massage, we believe everyone deserves to feel their best. Our skilled therapists combine years of experience with a genuine passion for healing to provide you with exceptional massage therapy services.
              </p>
              <ul className={styles.aboutList}>
                <li>
                  <CheckCircle size={20} />
                  <span>Customized treatments for your needs</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>Clean, relaxing environment</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>Premium oils and products</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>Convenient online booking</span>
                </li>
              </ul>
              <Link href="/about" className={styles.aboutBtn}>
                Learn More About Us
              </Link>
            </div>
            <div className={styles.aboutImage}>
              <div className={styles.imagePlaceholder}>
                <span>Relaxing Spa Environment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to Feel Your Best?</h2>
          <p className={styles.ctaText}>
            Book your massage appointment today and start your journey to relaxation and wellness.
          </p>
          <Link href="/book" className={styles.ctaBtn}>
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
