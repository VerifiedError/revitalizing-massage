'use client';

import Link from 'next/link';
import { Building2, Clock, Mail, Package, Users, FileText, MessageSquare } from 'lucide-react';
import styles from './page.module.css';

const settingsSections = [
  {
    title: 'Business Information',
    description: 'Manage business name, contact details, and address',
    icon: Building2,
    href: '/admin/settings/business',
    available: true,
  },
  {
    title: 'Website Content',
    description: 'Edit all text content on your website pages',
    icon: FileText,
    href: '/admin/settings/content',
    available: true,
  },
  {
    title: 'Note Templates',
    description: 'Manage quick note templates for customer communications',
    icon: MessageSquare,
    href: '/admin/settings/note-templates',
    available: true,
  },
  {
    title: 'Hours & Availability',
    description: 'Set business hours, blocked dates, and booking windows',
    icon: Clock,
    href: '/admin/settings/availability',
    available: false,
    comingSoon: true,
  },
  {
    title: 'Email Templates',
    description: 'Customize automated email messages to customers',
    icon: Mail,
    href: '/admin/settings/emails',
    available: false,
    comingSoon: true,
  },
  {
    title: 'Service Packages',
    description: 'Quick link to manage massage packages and pricing',
    icon: Package,
    href: '/admin/packages',
    available: true,
  },
  {
    title: 'User Management',
    description: 'Quick link to manage system users and roles',
    icon: Users,
    href: '/admin/users',
    available: true,
  },
];

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Configure your business settings and preferences</p>
      </div>

      <div className={styles.grid}>
        {settingsSections.map((section) => (
          <Link
            key={section.href}
            href={section.available ? section.href : '#'}
            className={`${styles.card} ${!section.available ? styles.disabled : ''}`}
            aria-disabled={!section.available}
          >
            <div className={styles.cardIcon}>
              <section.icon size={32} />
            </div>
            <div className={styles.cardContent}>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              {section.comingSoon && (
                <span className={styles.comingSoon}>Coming Soon</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
