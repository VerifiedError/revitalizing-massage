'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, ArrowLeft, Calendar, Package, Ban, UserCog, TrendingUp, BarChart3, DollarSign, PieChart, Menu, X } from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    emailAddresses: { emailAddress: string }[];
  };
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/availability', label: 'Availability', icon: Ban },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/reports/revenue', label: 'Revenue Reports', icon: TrendingUp },
  { href: '/admin/reports/appointments', label: 'Appointment Analytics', icon: BarChart3 },
  { href: '/admin/finances/expenses', label: 'Expense Tracker', icon: DollarSign },
  { href: '/admin/finances/reports', label: 'Financial Reports', icon: PieChart },
  { href: '/admin/users', label: 'System Users', icon: UserCog },
  { href: '/admin/changelog', label: 'Changelog', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
          <p className={styles.userEmail}>
            {user.firstName || user.emailAddresses[0]?.emailAddress}
          </p>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={18} />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
