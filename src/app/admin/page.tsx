'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, Settings, TrendingUp } from 'lucide-react';
import styles from './page.module.css';

interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  customerUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    adminUsers: 0,
    customerUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const users = await response.json();
          const adminCount = users.filter((u: { role: string }) => u.role === 'admin').length;
          setStats({
            totalUsers: users.length,
            adminUsers: adminCount,
            customerUsers: users.length - adminCount,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: '#3b82f6',
    },
    {
      title: 'Admin Users',
      value: stats.adminUsers,
      icon: Settings,
      color: '#8b5cf6',
    },
    {
      title: 'Customers',
      value: stats.customerUsers,
      icon: TrendingUp,
      color: '#10b981',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome to the admin dashboard</p>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stat.title}</h3>
              <p className={styles.statValue}>
                {loading ? '...' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.quickLinks}>
        <h2>Quick Actions</h2>
        <div className={styles.linksGrid}>
          <a href="/admin/users" className={styles.linkCard}>
            <Users size={20} />
            <span>Manage Users</span>
          </a>
          <a href="/admin/changelog" className={styles.linkCard}>
            <FileText size={20} />
            <span>View Changelog</span>
          </a>
          <a href="/admin/settings" className={styles.linkCard}>
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
}
