import { Metadata } from 'next';
import Link from 'next/link';
import { getActivePackages, getActiveAddons } from '@/lib/packages';
import styles from './page.module.css';
import { Clock, DollarSign, Sparkles, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services | Revitalizing Massage',
  description: 'Explore our massage therapy services in Topeka, KS. From 30-minute focused sessions to 90-minute full body massage, prenatal massage, and chair massage.',
};

// Force dynamic rendering to get fresh data
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const packages = await getActivePackages();
  const addons = await getActiveAddons();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Massage Services</h1>
          <p className={styles.subtitle}>
            Professional massage therapy tailored to your needs. Choose from a range of services designed to help you relax, recover, and revitalize.
          </p>
        </div>
      </section>

      <section className={styles.services}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {packages.map((pkg) => {
              const hasDiscount = pkg.discountPercentage > 0;

              return (
                <div key={pkg.id} className={styles.card}>
                  {hasDiscount && (
                    <div className={styles.discountBadge}>
                      <Tag size={14} />
                      <span>{pkg.discountPercentage}% OFF</span>
                    </div>
                  )}

                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{pkg.name}</h3>
                    <p className={styles.cardDescription}>{pkg.description}</p>

                    {hasDiscount && pkg.discountLabel && (
                      <div className={styles.discountLabel}>
                        {pkg.discountLabel}
                      </div>
                    )}

                    {pkg.hasAddons && (
                      <div className={styles.addonsInfo}>
                        <Sparkles size={16} />
                        <span>
                          Add-on options: {addons.map(a => a.name).join(', ')}
                        </span>
                      </div>
                    )}

                    <div className={styles.cardDetails}>
                      <span className={styles.detail}>
                        <Clock size={16} />
                        {pkg.duration}
                      </span>
                      <span className={styles.detail}>
                        <DollarSign size={16} />
                        {hasDiscount ? (
                          <span className={styles.pricing}>
                            <span className={styles.originalPrice}>${pkg.basePrice.toFixed(2)}</span>
                            <span className={styles.currentPrice}>${pkg.currentPrice.toFixed(2)}</span>
                          </span>
                        ) : (
                          <span>${pkg.currentPrice.toFixed(2)}</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <Link href={`/book?service=${pkg.id}`} className={styles.bookBtn}>
                    Book Now
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.addonsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Add-On Services</h2>
          <p className={styles.sectionDescription}>
            Enhance your massage experience with our premium add-on services
          </p>

          <div className={styles.addonsGrid}>
            {addons.map((addon) => (
              <div key={addon.id} className={styles.addonCard}>
                <Sparkles className={styles.addonIcon} />
                <h4>{addon.name}</h4>
                {addon.description && <p>{addon.description}</p>}
                <span className={styles.addonPrice}>+${addon.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <p className={styles.addonNote}>
            * Available with select massage packages. Comment your choice when booking.
          </p>
        </div>
      </section>

      <section className={styles.infoCards}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardImage}>
                <img
                  src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=400&h=300&fit=crop"
                  alt="First time massage therapy visit"
                />
              </div>
              <div className={styles.infoCardContent}>
                <h3>First Time Visit?</h3>
                <p>
                  Welcome! Starting with a 60 or 90-minute massage is recommended to experience the full benefits of therapeutic massage.
                </p>
                <Link href="/book" className={styles.infoLink}>
                  Schedule Your First Visit →
                </Link>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoCardImage}>
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop"
                  alt="Custom massage therapy session"
                />
              </div>
              <div className={styles.infoCardContent}>
                <h3>Custom Sessions</h3>
                <p>
                  Not sure which service is right for you? Each session can be customized to focus on your specific needs and problem areas.
                </p>
                <Link href="/contact" className={styles.infoLink}>
                  Contact Us →
                </Link>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoCardImage}>
                <img
                  src="https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=400&h=300&fit=crop"
                  alt="Gift certificate for massage"
                />
              </div>
              <div className={styles.infoCardContent}>
                <h3>Gift Certificates</h3>
                <p>
                  Give the gift of relaxation! Gift certificates are available for any service and make the perfect present.
                </p>
                <Link href="/contact" className={styles.infoLink}>
                  Inquire About Gifts →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
