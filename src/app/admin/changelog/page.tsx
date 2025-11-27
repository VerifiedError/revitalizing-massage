import { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { changelog, getLatestVersion } from '@/data/changelog';
import styles from './page.module.css';
import {
  GitBranch,
  Calendar,
  Sparkles,
  Bug,
  RefreshCw,
  Shield,
  AlertTriangle,
  Rocket,
  User
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Changelog | Admin - Revitalizing Massage',
  description: 'Project changelog and version history for administrators.',
  robots: 'noindex, nofollow',
};

const typeConfig = {
  initial: { icon: Rocket, color: '#8b5cf6', label: 'Initial' },
  feature: { icon: Sparkles, color: '#10b981', label: 'Feature' },
  fix: { icon: Bug, color: '#ef4444', label: 'Bug Fix' },
  update: { icon: RefreshCw, color: '#3b82f6', label: 'Update' },
  security: { icon: Shield, color: '#f59e0b', label: 'Security' },
  breaking: { icon: AlertTriangle, color: '#dc2626', label: 'Breaking' },
};

export default async function ChangelogPage() {
  const user = await currentUser();
  const latestVersion = getLatestVersion();
  const reversedChangelog = [...changelog].reverse();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <GitBranch size={32} />
            <h1>Project Changelog</h1>
          </div>
          <p className={styles.subtitle}>
            Complete version history and project updates
          </p>
          <div className={styles.headerMeta}>
            <div className={styles.versionBadge}>
              Current Version: <strong>v{latestVersion}</strong>
            </div>
            {user && (
              <div className={styles.userBadge}>
                <User size={14} />
                <span>{user.firstName || user.emailAddresses[0]?.emailAddress}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{changelog.length}</span>
            <span className={styles.statLabel}>Total Updates</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {changelog.filter(c => c.type === 'feature').length}
            </span>
            <span className={styles.statLabel}>Features</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {changelog.filter(c => c.type === 'fix').length}
            </span>
            <span className={styles.statLabel}>Bug Fixes</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>v{latestVersion}</span>
            <span className={styles.statLabel}>Latest</span>
          </div>
        </div>

        <div className={styles.timeline}>
          {reversedChangelog.map((entry, index) => {
            const config = typeConfig[entry.type];
            const IconComponent = config.icon;

            return (
              <div key={entry.version} className={styles.entry}>
                <div className={styles.entryLine}>
                  <div
                    className={styles.entryDot}
                    style={{ backgroundColor: config.color }}
                  >
                    <IconComponent size={16} />
                  </div>
                  {index < reversedChangelog.length - 1 && (
                    <div className={styles.connector} />
                  )}
                </div>

                <div className={styles.entryContent}>
                  <div className={styles.entryHeader}>
                    <div className={styles.entryMeta}>
                      <span
                        className={styles.typeBadge}
                        style={{ backgroundColor: `${config.color}20`, color: config.color }}
                      >
                        {config.label}
                      </span>
                      <span className={styles.version}>v{entry.version}</span>
                      <span className={styles.date}>
                        <Calendar size={14} />
                        {entry.date}
                      </span>
                    </div>
                    <h2 className={styles.entryTitle}>{entry.title}</h2>
                  </div>

                  <p className={styles.entryDescription}>{entry.description}</p>

                  <ul className={styles.changesList}>
                    {entry.changes.map((change, changeIndex) => (
                      <li key={changeIndex}>{change}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <p>
            This changelog is for administrative purposes only.
            All changes are tracked and documented for project maintenance.
          </p>
        </div>
      </div>
    </div>
  );
}
