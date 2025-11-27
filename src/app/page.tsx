import Link from 'next/link';
import Hero from '@/components/Hero';
import { services, businessInfo } from '@/data/services';
import styles from './page.module.css';
import { Clock, Award, Heart, CheckCircle, DollarSign } from 'lucide-react';

const featuredServices = services.slice(0, 3);

const benefits = [
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book appointments that fit your busy lifestyle. By appointment only for your convenience.',
  },
  {
    icon: Award,
    title: 'Licensed Therapist',
    description: 'Professional, licensed massage therapist with years of experience and training.',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Every session is tailored to your specific needs, areas of concern, and preferences.',
  },
];

export default function Home() {
  return (
    <>
      <Hero
        title="Relax. Restore. Revitalize."
        subtitle="Experience the healing power of professional massage therapy in Topeka, KS. Let us help you release tension, reduce stress, and restore balance to your body and mind."
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
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>
                    {service.description.substring(0, 150)}...
                  </p>
                  <div className={styles.serviceDetails}>
                    <span className={styles.detail}>
                      <Clock size={16} />
                      {service.duration}
                    </span>
                    <span className={styles.detail}>
                      <DollarSign size={16} />
                      ${service.price}
                    </span>
                  </div>
                </div>
                <Link href={`/book?service=${service.id}`} className={styles.serviceBtn}>
                  Book Now
                </Link>
              </div>
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
                At Revitalizing Massage, we believe everyone deserves to feel their best. Located in Topeka, KS, we provide professional massage therapy services in a clean, relaxing environment designed to help you escape the stresses of daily life.
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
                  <span>Add-on services available (Essential Oils, CBD, Hot Stones)</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>Convenient location in Topeka</span>
                </li>
              </ul>
              <Link href="/about" className={styles.aboutBtn}>
                Learn More About Us
              </Link>
            </div>
            <div className={styles.aboutImage}>
              <div className={styles.imagePlaceholder}>
                <span>Relaxing Massage Environment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className={styles.location}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Visit Us</h2>
          <div className={styles.locationContent}>
            <div className={styles.locationInfo}>
              <p className={styles.locationAddress}>
                <strong>{businessInfo.name}</strong><br />
                {businessInfo.address.street}<br />
                {businessInfo.address.city}, {businessInfo.address.state} {businessInfo.address.zip}
              </p>
              <p className={styles.locationContact}>
                <a href={`tel:${businessInfo.phone.replace(/\s/g, '')}`}>{businessInfo.phoneDisplay}</a><br />
                <a href={`mailto:${businessInfo.email}`}>{businessInfo.email}</a>
              </p>
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
