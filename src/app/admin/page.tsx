'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, Settings, TrendingUp, Package, DollarSign, Calendar } from 'lucide-react';
import styles from './page.module.css';

interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  customerUsers: number;
}

interface RevenueStats {
  today: number;
  week: number;
  month: number;
  year: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    adminUsers: 0,
    customerUsers: 0,
  });
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, todayRes, weekRes, monthRes, yearRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/revenue/stats?period=today'),
          fetch('/api/admin/revenue/stats?period=week'),
          fetch('/api/admin/revenue/stats?period=month'),
          fetch('/api/admin/revenue/stats?period=year'),
        ]);

        if (usersRes.ok) {
          const users = await usersRes.json();
          const adminCount = users.filter((u: { role: string }) => u.role === 'admin').length;
          setStats({
            totalUsers: users.length,
            adminUsers: adminCount,
            customerUsers: users.length - adminCount,
          });
        }

        if (todayRes.ok && weekRes.ok && monthRes.ok && yearRes.ok) {
          const today = await todayRes.json();
          const week = await weekRes.json();
          const month = await monthRes.json();
          const year = await yearRes.json();

          setRevenueStats({
            today: today.revenue || 0,
            week: week.revenue || 0,
            month: month.revenue || 0,
            year: year.revenue || 0,
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

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: '#3b82f6',
      format: 'number',
    },
    {
      title: 'Admin Users',
      value: stats.adminUsers,
      icon: Settings,
      color: '#8b5cf6',
      format: 'number',
    },
    {
      title: 'Customers',
      value: stats.customerUsers,
      icon: TrendingUp,
      color: '#10b981',
      format: 'number',
    },
  ];

  const revenueCards = [
    {
      title: "Today's Revenue",
      value: revenueStats.today,
      icon: DollarSign,
      color: '#10b981',
      format: 'currency',
    },
    {
      title: "This Week's Revenue",
      value: revenueStats.week,
      icon: Calendar,
      color: '#3b82f6',
      format: 'currency',
    },
    {
      title: "This Month's Revenue",
      value: revenueStats.month,
      icon: TrendingUp,
      color: '#8b5cf6',
      format: 'currency',
    },
    {
      title: "This Year's Revenue",
      value: revenueStats.year,
      icon: TrendingUp,
      color: '#f59e0b',
      format: 'currency',
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

      <div className={styles.revenueSection}>
        <h2>Revenue Overview</h2>
        <div className={styles.statsGrid}>
          {revenueCards.map((stat) => (
            <div key={stat.title} className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className={styles.statContent}>
                <h3>{stat.title}</h3>
                <p className={styles.statValue}>
                  {loading ? '...' : formatCurrency(stat.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.quickLinks}>
        <h2>Quick Actions</h2>
        <div className={styles.linksGrid}>
          <a href="/admin/packages" className={styles.linkCard}>
            <Package size={20} />
            <span>Manage Packages</span>
          </a>
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
