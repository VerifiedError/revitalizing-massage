import { Metadata } from 'next';
import Link from 'next/link';
import { services, addons } from '@/data/services';
import styles from './page.module.css';
import { Clock, DollarSign, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services | Revitalizing Massage',
  description: 'Explore our massage therapy services in Topeka, KS. From 30-minute focused sessions to 90-minute full body massage, prenatal massage, and chair massage.',
};

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Our Services</h1>
          <p className={styles.subtitle}>
            Professional massage therapy tailored to your needs. Choose from our range of services designed to help you relax, recover, and revitalize.
          </p>
        </div>
      </section>

      <section className={styles.services}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {services.map((service) => (
              <div key={service.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDescription}>{service.description}</p>

                  {service.hasAddons && service.addons && (
                    <div className={styles.addonsInfo}>
                      <Sparkles size={16} />
                      <span>Add-on options: {service.addons.join(', ')}</span>
                    </div>
                  )}

                  <div className={styles.cardDetails}>
                    <span className={styles.detail}>
                      <Clock size={16} />
                      {service.duration}
                    </span>
                    <span className={styles.detail}>
                      <DollarSign size={16} />
                      ${service.price}.00
                    </span>
                  </div>
                </div>
                <Link href={`/book?service=${service.id}`} className={styles.bookBtn}>
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.addons}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Add-On Services</h2>
          <p className={styles.sectionSubtitle}>
            Enhance your massage experience with our add-on services. Each add-on is $10.
          </p>
          <div className={styles.addonsGrid}>
            {addons.map((addon) => (
              <div key={addon.id} className={styles.addonCard}>
                <h3>{addon.name}</h3>
                <span className={styles.addonPrice}>+${addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.info}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>First Visit?</h3>
              <p>
                Please arrive 5-10 minutes early to complete any paperwork and discuss your needs with your therapist.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Cancellation Policy</h3>
              <p>
                Please provide at least 24 hours notice for cancellations to avoid being charged for the session.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Gift Cards</h3>
              <p>
                Give the gift of relaxation! Gift cards are available in any amount and can be purchased online.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
