import Hero from '@/components/Hero';
import Reviews from '@/components/Reviews';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Reviews | Revitalizing Massage',
  description: 'Read what our clients say about their massage therapy experience at Revitalizing Massage in Topeka, KS. Real reviews from Facebook and Google.',
};

export default function ReviewsPage() {
  return (
    <>
      <Hero
        title="Client Reviews"
        subtitle="See what people are saying about their experience with Revitalizing Massage"
        backgroundImage="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=2400&h=900&fit=crop"
      />

      <Reviews showTitle={false} maxReviews={12} layout="grid" />

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Experience the Difference?</h2>
            <p>Join our satisfied clients and book your massage today</p>
            <div className={styles.ctaButtons}>
              <Link href="/book" className={styles.ctaPrimary}>
                Book Appointment
              </Link>
              <Link href="/services" className={styles.ctaSecondary}>
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
