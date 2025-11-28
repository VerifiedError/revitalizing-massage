import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Award, Users, Heart } from 'lucide-react';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Us | Revitalizing Massage',
  description: 'Learn about Revitalizing Massage, our experienced therapists, and our commitment to your wellness journey.',
};

const values = [
  {
    icon: Heart,
    title: 'Compassionate Care',
    description: 'We treat every client with genuine care and attention, creating a nurturing environment for healing.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Our therapists maintain the highest standards of professionalism and continually advance their skills.',
  },
  {
    icon: Users,
    title: 'Client-Centered',
    description: 'Your wellness goals guide every session. We listen, adapt, and personalize our approach for you.',
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>About Revitalizing Massage</h1>
          <p className={styles.subtitle}>
            Dedicated to helping you achieve optimal wellness through the healing power of touch.
          </p>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyContent}>
            <div className={styles.storyText}>
              <h2>Our Story</h2>
              <p>
                Revitalizing Massage was founded with a simple mission: to provide exceptional massage therapy services that help clients feel their best. Everyone deserves access to quality bodywork that addresses their unique needs.
              </p>
              <p>
                What started as a passion for healing has grown into a dedicated wellness practice, built on core values of compassion, excellence, and personalized care. The focus is on creating a peaceful sanctuary where you can escape the stresses of daily life and focus on your well-being.
              </p>
              <p>
                As a certified massage therapist, I bring together diverse training and specializations, ensuring I can address a wide range of conditions and preferences. Whether you're seeking relief from chronic pain, recovering from an injury, or simply want to relax, I have the expertise to help.
              </p>
            </div>
            <div className={styles.storyImage}>
              <img
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=1600&fit=crop"
                alt="Peaceful massage therapy room"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <div key={value.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <value.icon size={32} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.commitment}>
        <div className={styles.container}>
          <div className={styles.commitmentContent}>
            <h2>Our Commitment to You</h2>
            <ul className={styles.commitmentList}>
              <li>
                <CheckCircle size={24} />
                <div>
                  <strong>Certified Professional</strong>
                  <p>Our massage therapist is fully certified, insured, and undergoes regular continuing education.</p>
                </div>
              </li>
              <li>
                <CheckCircle size={24} />
                <div>
                  <strong>Clean & Safe Environment</strong>
                  <p>We maintain the highest standards of cleanliness and follow all health and safety protocols.</p>
                </div>
              </li>
              <li>
                <CheckCircle size={24} />
                <div>
                  <strong>Premium Products</strong>
                  <p>We use only high-quality, hypoallergenic oils and lotions to ensure your comfort and safety.</p>
                </div>
              </li>
              <li>
                <CheckCircle size={24} />
                <div>
                  <strong>Personalized Service</strong>
                  <p>Every session is tailored to your specific needs, preferences, and wellness goals.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2>Experience the Difference</h2>
          <p>
            We'd love to welcome you to Revitalizing Massage. Book your first appointment and discover why our clients keep coming back.
          </p>
          <Link href="/book" className={styles.ctaBtn}>
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
