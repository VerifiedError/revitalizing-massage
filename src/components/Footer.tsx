import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import styles from './Footer.module.css';

interface BusinessSettings {
  businessName: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
}

interface FooterProps {
  businessSettings: BusinessSettings;
}

export default function Footer({ businessSettings }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.logo}>{businessSettings.businessName}</h3>
            <p className={styles.description}>
              Professional massage therapy services in {businessSettings.addressCity}, {businessSettings.addressState}. Helping you relax, recover, and revitalize.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/alannahsrevitalizingmassage" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
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
              <a href={`tel:${businessSettings.phone.replace(/\D/g, '')}`} className={styles.contactItem}>
                <Phone size={16} />
                <span>{businessSettings.phoneDisplay}</span>
              </a>
              <a href={`mailto:${businessSettings.email}`} className={styles.contactItem}>
                <Mail size={16} />
                <span>{businessSettings.email}</span>
              </a>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>{businessSettings.addressStreet}<br />{businessSettings.addressCity}, {businessSettings.addressState} {businessSettings.addressZip}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} {businessSettings.businessName}. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
