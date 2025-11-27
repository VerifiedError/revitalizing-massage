import Link from 'next/link';
import { Clock, DollarSign } from 'lucide-react';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  title: string;
  description: string;
  duration: string;
  price: string;
  slug: string;
}

export default function ServiceCard({ title, description, duration, price, slug }: ServiceCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.details}>
          <span className={styles.detail}>
            <Clock size={16} />
            {duration}
          </span>
          <span className={styles.detail}>
            <DollarSign size={16} />
            {price}
          </span>
        </div>
      </div>
      <Link href={`/book?service=${slug}`} className={styles.bookBtn}>
        Book Now
      </Link>
    </div>
  );
}
