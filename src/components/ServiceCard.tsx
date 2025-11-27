import Link from 'next/link';
import { Clock, DollarSign, Tag } from 'lucide-react';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  title: string;
  description: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  discountLabel?: string;
  slug: string;
}

export default function ServiceCard({
  title,
  description,
  duration,
  price,
  originalPrice,
  discountPercentage,
  discountLabel,
  slug
}: ServiceCardProps) {
  const hasDiscount = discountPercentage && discountPercentage > 0;

  return (
    <div className={styles.card}>
      {hasDiscount && (
        <div className={styles.discountBadge}>
          <Tag size={14} />
          <span>{discountPercentage}% OFF</span>
        </div>
      )}

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        {hasDiscount && discountLabel && (
          <div className={styles.discountLabel}>
            {discountLabel}
          </div>
        )}

        <div className={styles.details}>
          <span className={styles.detail}>
            <Clock size={16} />
            {duration}
          </span>
          <span className={styles.detail}>
            <DollarSign size={16} />
            {hasDiscount && originalPrice ? (
              <span className={styles.pricing}>
                <span className={styles.originalPrice}>${originalPrice}</span>
                <span className={styles.currentPrice}>${price}</span>
              </span>
            ) : (
              <span>${price}</span>
            )}
          </span>
        </div>
      </div>
      <Link href={`/book?service=${slug}`} className={styles.bookBtn}>
        Book Now
      </Link>
    </div>
  );
}
