import Link from 'next/link';
import styles from './Hero.module.css';

interface HeroProps {
  title: string;
  subtitle: string;
  showCta?: boolean;
  backgroundImage?: string;
}

export default function Hero({ title, subtitle, showCta = true, backgroundImage }: HeroProps) {
  return (
    <section
      className={styles.hero}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        {showCta && (
          <div className={styles.cta}>
            <Link href="/book" className={styles.primaryBtn}>
              Book Appointment
            </Link>
            <Link href="/services" className={styles.secondaryBtn}>
              View Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
