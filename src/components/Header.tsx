'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
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
          <Link href="/reviews" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Reviews
          </Link>
          <Link href="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>

          {/* Mobile Auth Buttons - Only show in mobile menu */}
          <div className={styles.mobileAuth}>
            <SignedOut>
              <SignInButton mode="modal">
                <button className={styles.mobileSignInBtn} onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className={styles.mobileRegisterBtn} onClick={() => setIsMenuOpen(false)}>
                  Register
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className={styles.mobileUserSection}>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: 40,
                        height: 40
                      }
                    }
                  }}
                />
                <span className={styles.accountLabel}>My Account</span>
              </div>
            </SignedIn>
          </div>

          <Link href="/book" className={`${styles.navLink} ${styles.bookBtn}`} onClick={() => setIsMenuOpen(false)}>
            Book Now
          </Link>
        </nav>

        <div className={styles.headerActions}>
          {/* Desktop Auth Buttons */}
          <SignedOut>
            <div className={styles.desktopAuthButtons}>
              <SignInButton mode="modal">
                <button className={styles.signInBtn}>Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className={styles.registerBtn}>Register</button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className={styles.desktopUser}>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      width: 36,
                      height: 36
                    }
                  }
                }}
              />
            </div>
          </SignedIn>
          <a href="tel:+17852504599" className={styles.phoneLink} title="(785) 250-4599">
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
