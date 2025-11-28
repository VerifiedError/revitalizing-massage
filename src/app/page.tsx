import Link from 'next/link';
import Hero from '@/components/Hero';
import Reviews from '@/components/Reviews';
import { businessInfo } from '@/data/services';
import { getAllPackages } from '@/lib/packages';
import styles from './page.module.css';
import { Clock, Award, Heart, CheckCircle, Phone, MapPin, Star } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book appointments that fit your busy lifestyle',
  },
  {
    icon: Award,
    title: 'Certified Therapist',
    description: 'Certified professional with years of experience',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Every session tailored to your needs',
  },
];

export default async function Home() {
  const allPackages = await getAllPackages();
  const activePackages = allPackages.filter(pkg => pkg.isActive);
  const featuredPackages = activePackages.slice(0, 3);

  return (
    <>
      <Hero
        title="Relax. Restore. Revitalize."
        subtitle="Experience professional massage therapy in Topeka, KS. Release tension, reduce stress, and restore balance."
      />

      {/* Quick Contact Strip - Mobile Optimized */}
      <section className={styles.quickContact}>
        <div className={styles.contactStrip}>
          <a href="tel:+17852504599" className={styles.quickContactBtn}>
            <Phone size={20} />
            <div>
              <span className={styles.quickLabel}>Call Now</span>
              <span className={styles.quickValue}>(785) 250-4599</span>
            </div>
          </a>
          <Link href="/book" className={styles.quickContactBtn}>
            <Calendar size={20} />
            <div>
              <span className={styles.quickLabel}>Book</span>
              <span className={styles.quickValue}>Appointment</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Services - Mobile First */}
      <section className={styles.services}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Popular Services</h2>
            <p>Choose from our most requested massage services</p>
          </div>

          <div className={styles.servicesGrid}>
            {featuredPackages.map((pkg) => (
              <div key={pkg.id} className={styles.serviceCard}>
                {pkg.discountPercentage > 0 && (
                  <div className={styles.discountBadge}>
                    {pkg.discountPercentage}% OFF
                  </div>
                )}
                <div className={styles.serviceHeader}>
                  <h3>{pkg.name}</h3>
                  <div className={styles.serviceMeta}>
                    <span className={styles.duration}>
                      <Clock size={16} />
                      {pkg.duration}
                    </span>
                  </div>
                </div>
                <p className={styles.serviceDescription}>
                  {pkg.description.length > 120
                    ? `${pkg.description.substring(0, 120)}...`
                    : pkg.description}
                </p>
                <div className={styles.serviceFooter}>
                  <div className={styles.priceSection}>
                    {pkg.discountPercentage > 0 ? (
                      <>
                        <span className={styles.originalPrice}>${pkg.basePrice.toFixed(2)}</span>
                        <span className={styles.currentPrice}>${pkg.currentPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className={styles.price}>${pkg.currentPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <Link href={`/book?service=${pkg.id}`} className={styles.bookNowBtn}>
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.viewAllSection}>
            <Link href="/services" className={styles.viewAllBtn}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits - Simplified for Mobile */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why Choose Us</h2>
          </div>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <div key={benefit.title} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <benefit.icon size={28} />
                </div>
                <div className={styles.benefitContent}>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Facebook & Google */}
      <Reviews />

      {/* Location - Mobile Optimized */}
      <section className={styles.location}>
        <div className={styles.container}>
          <div className={styles.locationContent}>
            <div className={styles.locationInfo}>
              <h2>Visit Us</h2>
              <div className={styles.locationDetails}>
                <div className={styles.locationItem}>
                  <MapPin size={20} />
                  <div>
                    <strong>Address</strong>
                    <p>{businessInfo.address.full}</p>
                  </div>
                </div>
                <div className={styles.locationItem}>
                  <Clock size={20} />
                  <div>
                    <strong>Hours</strong>
                    <p>By Appointment</p>
                    <p className={styles.closedDay}>Closed Sundays</p>
                  </div>
                </div>
                <div className={styles.locationItem}>
                  <Phone size={20} />
                  <div>
                    <strong>Phone</strong>
                    <p>
                      <a href={`tel:${businessInfo.phone.replace(/\D/g, '')}`} className={styles.phoneNumber}>
                        {businessInfo.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Mobile First */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Feel Better?</h2>
            <p>Book your appointment today and start your journey to wellness</p>
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

function Calendar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
