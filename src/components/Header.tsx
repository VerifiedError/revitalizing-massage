'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Revitalizing Massage</span>
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/services" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Services
          </Link>
          <Link href="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link href="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
          <Link href="/book" className={`${styles.navLink} ${styles.bookBtn}`} onClick={() => setIsMenuOpen(false)}>
            Book Now
          </Link>
        </nav>

        <div className={styles.headerActions}>
          <a href="tel:+1234567890" className={styles.phoneLink}>
            <Phone size={20} />
          </a>
          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
