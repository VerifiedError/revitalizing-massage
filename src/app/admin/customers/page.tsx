'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, UserPlus, Mail, Phone, Calendar, DollarSign, Filter, X } from 'lucide-react';
import styles from './page.module.css';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: string;
  totalVisits: number;
  totalSpent: string;
  lastVisit: string | null;
  createdAt: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('lastName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, [searchQuery, statusFilter, sortBy, sortOrder]);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/admin/customers?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleCustomerClick(customerId: string) {
    router.push(`/admin/customers/${customerId}`);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'blocked':
        return styles.statusBlocked;
      default:
        return styles.statusActive;
    }
  }

  function formatCurrency(amount: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Customers</h1>
            <p className={styles.subtitle}>Manage customer profiles and information</p>
          </div>
          <button
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            <span className={styles.addButtonText}>Add Customer</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearchQuery('')}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <button
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>Filters</span>
          {(statusFilter || sortBy !== 'lastName') && (
            <span className={styles.filterBadge}>Active</span>
          )}
        </button>

        {/* Filters */}
        <div className={`${styles.filters} ${showFilters ? styles.filtersVisible : ''}`}>
          <div className={styles.filterGroup}>
            <label htmlFor="status" className={styles.filterLabel}>Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="sortBy" className={styles.filterLabel}>Sort By</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="lastName">Last Name</option>
              <option value="firstName">First Name</option>
              <option value="email">Email</option>
              <option value="totalVisits">Total Visits</option>
              <option value="totalSpent">Total Spent</option>
              <option value="lastVisit">Last Visit</option>
              <option value="createdAt">Date Added</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="sortOrder" className={styles.filterLabel}>Order</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className={styles.filterSelect}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(statusFilter || sortBy !== 'lastName' || sortOrder !== 'asc') && (
            <button
              className={styles.clearFilters}
              onClick={() => {
                setStatusFilter('');
                setSortBy('lastName');
                setSortOrder('asc');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading customers...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <div className={styles.empty}>
          <UserPlus size={64} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>
            {searchQuery || statusFilter ? 'No customers found' : 'No customers yet'}
          </h2>
          <p className={styles.emptyText}>
            {searchQuery || statusFilter
              ? 'Try adjusting your search or filters'
              : 'Add your first customer to get started'}
          </p>
          {!searchQuery && !statusFilter && (
            <button
              className={styles.emptyButton}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={20} />
              Add Customer
            </button>
          )}
        </div>
      )}

      {/* Customer List */}
      {!loading && customers.length > 0 && (
        <>
          {/* Stats Summary */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Customers</span>
              <span className={styles.statValue}>{customers.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Active</span>
              <span className={styles.statValue}>
                {customers.filter(c => c.status === 'active').length}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Revenue</span>
              <span className={styles.statValue}>
                {formatCurrency(
                  customers.reduce((sum, c) => sum + parseFloat(c.totalSpent), 0).toFixed(2)
                )}
              </span>
            </div>
          </div>

          {/* Customer Cards */}
          <div className={styles.customerList}>
            {customers.map((customer) => (
              <div
                key={customer.id}
                className={styles.customerCard}
                onClick={() => handleCustomerClick(customer.id)}
              >
                <div className={styles.customerHeader}>
                  <div className={styles.customerName}>
                    <span className={styles.name}>
                      {customer.firstName} {customer.lastName}
                    </span>
                    <span className={`${styles.statusBadge} ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </div>
                </div>

                <div className={styles.customerDetails}>
                  {customer.email && (
                    <div className={styles.detailRow}>
                      <Mail size={16} className={styles.detailIcon} />
                      <span className={styles.detailText}>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className={styles.detailRow}>
                      <Phone size={16} className={styles.detailIcon} />
                      <span className={styles.detailText}>{customer.phone}</span>
                    </div>
                  )}
                </div>

                <div className={styles.customerStats}>
                  <div className={styles.statItem}>
                    <Calendar size={16} className={styles.statIcon} />
                    <div className={styles.statContent}>
                      <span className={styles.statNumber}>{customer.totalVisits}</span>
                      <span className={styles.statLabel}>visits</span>
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <DollarSign size={16} className={styles.statIcon} />
                    <div className={styles.statContent}>
                      <span className={styles.statNumber}>
                        {formatCurrency(customer.totalSpent)}
                      </span>
                      <span className={styles.statLabel}>spent</span>
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <Calendar size={16} className={styles.statIcon} />
                    <div className={styles.statContent}>
                      <span className={styles.statNumber}>
                        {formatDate(customer.lastVisit)}
                      </span>
                      <span className={styles.statLabel}>last visit</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Customer Modal (placeholder - would need full implementation) */}
      {showAddModal && (
        <div className={styles.modal} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Customer</h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowAddModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Customer creation form would go here...</p>
              <p className={styles.note}>
                Note: This is a placeholder. Full form implementation would include
                fields for name, email, phone, and other customer details.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className={styles.saveButton}>
                <Plus size={18} />
                Create Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
