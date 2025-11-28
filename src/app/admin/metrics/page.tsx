'use client';

import { BarChart3, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import styles from './page.module.css';

export default function MetricsPage() {
  // Placeholder data until real analytics are connected
  const metrics = [
    {
      title: 'Monthly Revenue',
      value: '$2,450',
      icon: DollarSign,
      color: '#10b981',
    },
    {
      title: 'Appointments',
      value: '32',
      icon: Calendar,
      color: '#3b82f6',
    },
    {
      title: 'Growth',
      value: '+12%',
      icon: TrendingUp,
      color: '#8b5cf6',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Business Metrics</h1>
        <p>Overview of business performance and statistics</p>
      </div>

      <div className={styles.statsGrid}>
        {metrics.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stat.title}</h3>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2>Revenue Overview</h2>
        <div className={styles.placeholder}>
          Chart visualization coming soon
        </div>
      </div>

      <div className={styles.section}>
        <h2>Popular Services</h2>
        <div className={styles.placeholder}>
          Service popularity breakdown coming soon
        </div>
      </div>
    </div>
  );
}
