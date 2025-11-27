import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { businessInfo } from '@/data/services';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.logo}>Revitalizing Massage</h3>
            <p className={styles.description}>
              Professional massage therapy services in Topeka, KS. Helping you relax, recover, and revitalize.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Facebook" className={styles.socialLink}>
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <nav className={styles.links}>
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/about">About</Link>
              <Link href="/book">Book Now</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Services</h4>
            <nav className={styles.links}>
              <Link href="/services#30-minute">30 Minute Massage</Link>
              <Link href="/services#60-minute">60 Minute Massage</Link>
              <Link href="/services#90-minute">90 Minute Massage</Link>
              <Link href="/services#prenatal">Prenatal Massage</Link>
              <Link href="/services#chair">Chair Massage</Link>
            </nav>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <div className={styles.contactInfo}>
              <a href={`tel:${businessInfo.phone.replace(/\s/g, '')}`} className={styles.contactItem}>
                <Phone size={16} />
                <span>{businessInfo.phoneDisplay}</span>
              </a>
              <a href={`mailto:${businessInfo.email}`} className={styles.contactItem}>
                <Mail size={16} />
                <span>{businessInfo.email}</span>
              </a>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>{businessInfo.address.street}<br />{businessInfo.address.city}, {businessInfo.address.state} {businessInfo.address.zip}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Revitalizing Massage. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
