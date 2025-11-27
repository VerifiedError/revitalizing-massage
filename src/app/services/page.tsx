import { Metadata } from 'next';
import ServiceCard from '@/components/ServiceCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Services | Revitalizing Massage',
  description: 'Explore our full range of massage therapy services including Swedish, Deep Tissue, Hot Stone, Prenatal, and Sports massage.',
};

const services = [
  {
    id: 'swedish-massage',
    title: 'Swedish Massage',
    description: 'Our signature relaxation massage uses long, flowing strokes to ease muscle tension, improve circulation, and promote overall relaxation. Perfect for stress relief and general wellness.',
    duration: '60 min',
    price: '$85',
    slug: 'swedish-massage',
  },
  {
    id: 'deep-tissue',
    title: 'Deep Tissue Massage',
    description: 'Targeted deep pressure work to release chronic muscle tension, break up adhesions, and address problem areas. Ideal for those with chronic pain or muscle tightness.',
    duration: '60 min',
    price: '$95',
    slug: 'deep-tissue',
  },
  {
    id: 'hot-stone',
    title: 'Hot Stone Massage',
    description: 'Smooth, heated basalt stones are placed on key points and used during massage to melt away tension. The warmth penetrates deep into muscles for ultimate relaxation.',
    duration: '75 min',
    price: '$110',
    slug: 'hot-stone',
  },
  {
    id: 'prenatal',
    title: 'Prenatal Massage',
    description: 'A gentle, nurturing massage designed specifically for expecting mothers. Helps relieve common pregnancy discomforts including back pain, swelling, and fatigue.',
    duration: '60 min',
    price: '$90',
    slug: 'prenatal',
  },
  {
    id: 'sports',
    title: 'Sports Massage',
    description: 'Designed for athletes and active individuals. Focuses on areas of the body that are overused and stressed from repetitive movements. Helps prevent injuries and enhances performance.',
    duration: '60 min',
    price: '$100',
    slug: 'sports',
  },
  {
    id: 'aromatherapy',
    title: 'Aromatherapy Massage',
    description: 'Combines the therapeutic benefits of massage with essential oils selected for your specific needs. The aromatic oils enhance relaxation and promote emotional well-being.',
    duration: '60 min',
    price: '$95',
    slug: 'aromatherapy',
  },
  {
    id: 'couples',
    title: 'Couples Massage',
    description: 'Share the relaxation experience with a partner, friend, or family member. Both receive massages simultaneously in our spacious couples suite.',
    duration: '60 min',
    price: '$170',
    slug: 'couples',
  },
  {
    id: 'reflexology',
    title: 'Reflexology',
    description: 'A focused foot massage that applies pressure to specific points believed to correspond to different body organs and systems. Promotes overall balance and wellness.',
    duration: '45 min',
    price: '$65',
    slug: 'reflexology',
  },
  {
    id: 'chair-massage',
    title: 'Chair Massage',
    description: 'A quick, convenient massage performed while you sit in a specially designed chair. Perfect for workplace wellness events or when you\'re short on time.',
    duration: '30 min',
    price: '$45',
    slug: 'chair-massage',
  },
  {
    id: 'lymphatic-drainage',
    title: 'Lymphatic Drainage',
    description: 'A gentle massage technique designed to stimulate the lymphatic system and promote the natural drainage of lymph. Helps reduce swelling and boost immune function.',
    duration: '60 min',
    price: '$95',
    slug: 'lymphatic-drainage',
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Our Services</h1>
          <p className={styles.subtitle}>
            Discover our comprehensive range of massage therapy services, each designed to address your unique wellness needs.
          </p>
        </div>
      </section>

      <section className={styles.services}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.info}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>First Time?</h3>
              <p>
                New clients receive a complimentary consultation before their first massage to discuss health history, concerns, and goals.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Custom Sessions</h3>
              <p>
                Need a longer session? We offer 90-minute and 120-minute options for most services. Contact us for pricing.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Gift Cards</h3>
              <p>
                Give the gift of relaxation! Gift cards are available in any amount and can be purchased online or in person.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
