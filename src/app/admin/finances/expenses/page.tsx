'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Filter, X, Trash2, Edit2, Download, Calendar } from 'lucide-react';
import styles from './page.module.css';

interface Expense {
  id: string;
  date: string;
  category: string;
  subcategory: string | null;
  amount: string;
  vendor: string | null;
  description: string | null;
  receiptUrl: string | null;
  paymentMethod: string | null;
  taxDeductible: boolean;
  notes: string | null;
  createdAt: Date;
}

const CATEGORIES = [
  { value: 'supplies', label: 'Supplies', color: '#3b82f6' },
  { value: 'rent', label: 'Rent', color: '#8b5cf6' },
  { value: 'utilities', label: 'Utilities', color: '#10b981' },
  { value: 'marketing', label: 'Marketing', color: '#f59e0b' },
  { value: 'insurance', label: 'Insurance', color: '#ef4444' },
  { value: 'professional-services', label: 'Professional Services', color: '#06b6d4' },
  { value: 'equipment', label: 'Equipment', color: '#ec4899' },
  { value: 'software', label: 'Software', color: '#a855f7' },
  { value: 'other', label: 'Other', color: '#64748b' }
];

const PAYMENT_METHODS = ['cash', 'card', 'check', 'bank-transfer', 'other'];

const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
  { value: 'all', label: 'All Time' }
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [taxDeductibleFilter, setTaxDeductibleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Form states
  const [formData, setFormData] = useState({
    date: getTodayString(),
    category: '',
    subcategory: '',
    amount: '',
    vendor: '',
    description: '',
    receiptUrl: '',
    paymentMethod: 'card',
    taxDeductible: true,
    notes: ''
  });

  function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  function getDateRangeValues(range: string): { startDate: string | null; endDate: string | null } {
    const today = new Date();
    const todayStr = getTodayString();

    if (range === 'today') {
      return { startDate: todayStr, endDate: todayStr };
    } else if (range === 'week') {
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - diff);
      return { startDate: monday.toISOString().split('T')[0], endDate: todayStr };
    } else if (range === 'month') {
      const startOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
      return { startDate: startOfMonth, endDate: todayStr };
    } else if (range === 'year') {
      const startOfYear = `${today.getFullYear()}-01-01`;
      return { startDate: startOfYear, endDate: todayStr };
    } else if (range === 'custom' && customStartDate && customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    return { startDate: null, endDate: null };
  }

  useEffect(() => {
    fetchExpenses();
  }, [dateRange, customStartDate, customEndDate, categoryFilter, taxDeductibleFilter, searchTerm, sortBy, sortOrder]);

  async function fetchExpenses() {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      const { startDate, endDate } = getDateRangeValues(dateRange);
      if (startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      }

      if (categoryFilter && categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }

      if (taxDeductibleFilter !== 'all') {
        params.append('taxDeductible', taxDeductibleFilter);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/admin/finances/expenses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleAddExpense() {
    setEditingExpense(null);
    setFormData({
      date: getTodayString(),
      category: '',
      subcategory: '',
      amount: '',
      vendor: '',
      description: '',
      receiptUrl: '',
      paymentMethod: 'card',
      taxDeductible: true,
      notes: ''
    });
    setShowModal(true);
  }

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense);
    setFormData({
      date: expense.date,
      category: expense.category,
      subcategory: expense.subcategory || '',
      amount: expense.amount,
      vendor: expense.vendor || '',
      description: expense.description || '',
      receiptUrl: expense.receiptUrl || '',
      paymentMethod: expense.paymentMethod || 'card',
      taxDeductible: expense.taxDeductible,
      notes: expense.notes || ''
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const url = editingExpense
        ? `/api/admin/finances/expenses/${editingExpense.id}`
        : '/api/admin/finances/expenses';

      const method = editingExpense ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchExpenses();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save expense');
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
      alert('Failed to save expense');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/finances/expenses/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchExpenses();
      } else {
        alert('Failed to delete expense');
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('Failed to delete expense');
    }
  }

  function exportToCSV() {
    const headers = ['Date', 'Category', 'Subcategory', 'Vendor', 'Description', 'Amount', 'Payment Method', 'Tax Deductible'];
    const rows = expenses.map(e => [
      e.date,
      e.category,
      e.subcategory || '',
      e.vendor || '',
      e.description || '',
      e.amount,
      e.paymentMethod || '',
      e.taxDeductible ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${getTodayString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatCurrency(amount: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getCategoryColor(category: string): string {
    return CATEGORIES.find(c => c.value === category)?.color || '#64748b';
  }

  function getCategoryLabel(category: string): string {
    return CATEGORIES.find(c => c.value === category)?.label || category;
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Expense Tracker</h1>
          <p>Manage and track business expenses</p>
        </div>
        <button onClick={handleAddExpense} className={styles.addButton}>
          <Plus size={20} />
          <span>Add Expense</span>
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search vendor, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.controlButtons}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={styles.filterButton}
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>

          <button onClick={exportToCSV} className={styles.exportButton}>
            <Download size={20} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={styles.select}
              >
                {DATE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div className={styles.filterGroup}>
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <label>End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </>
            )}
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={styles.select}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Tax Deductible</label>
              <select
                value={taxDeductibleFilter}
                onChange={(e) => setTaxDeductibleFilter(e.target.value)}
                className={styles.select}
              >
                <option value="all">All</option>
                <option value="true">Tax Deductible Only</option>
                <option value="false">Non-Deductible</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split('-');
                  setSortBy(by);
                  setSortOrder(order);
                }}
                className={styles.select}
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="amount-desc">Amount (Highest First)</option>
                <option value="amount-asc">Amount (Lowest First)</option>
                <option value="category-asc">Category (A-Z)</option>
                <option value="category-desc">Category (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <DollarSign size={24} />
          <div>
            <p className={styles.summaryLabel}>Total Expenses</p>
            <p className={styles.summaryValue}>{formatCurrency(totalExpenses.toString())}</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <Calendar size={24} />
          <div>
            <p className={styles.summaryLabel}>Total Transactions</p>
            <p className={styles.summaryValue}>{expenses.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <div className={styles.empty}>
          <DollarSign size={48} />
          <h3>No expenses found</h3>
          <p>Add your first expense to start tracking your business costs.</p>
          <button onClick={handleAddExpense} className={styles.emptyButton}>
            <Plus size={20} />
            Add Expense
          </button>
        </div>
      ) : (
        <>
          {/* Mobile: Cards */}
          <div className={styles.expenseCards}>
            {expenses.map(expense => (
              <div key={expense.id} className={styles.expenseCard}>
                <div className={styles.cardHeader}>
                  <div
                    className={styles.categoryBadge}
                    style={{ backgroundColor: `${getCategoryColor(expense.category)}20`, color: getCategoryColor(expense.category) }}
                  >
                    {getCategoryLabel(expense.category)}
                  </div>
                  {expense.taxDeductible && (
                    <span className={styles.taxBadge}>Tax Deductible</span>
                  )}
                </div>

                <div className={styles.cardAmount}>
                  {formatCurrency(expense.amount)}
                </div>

                <div className={styles.cardDetails}>
                  <div className={styles.cardDetail}>
                    <span className={styles.detailLabel}>Date:</span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                  {expense.vendor && (
                    <div className={styles.cardDetail}>
                      <span className={styles.detailLabel}>Vendor:</span>
                      <span>{expense.vendor}</span>
                    </div>
                  )}
                  {expense.subcategory && (
                    <div className={styles.cardDetail}>
                      <span className={styles.detailLabel}>Subcategory:</span>
                      <span>{expense.subcategory}</span>
                    </div>
                  )}
                  {expense.description && (
                    <div className={styles.cardDetail}>
                      <span className={styles.detailLabel}>Description:</span>
                      <span>{expense.description}</span>
                    </div>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleEditExpense(expense)}
                    className={styles.editButton}
                  >
                    <Edit2 size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className={styles.deleteButton}
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Tax Deductible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.date)}</td>
                    <td>
                      <span
                        className={styles.categoryTag}
                        style={{ backgroundColor: `${getCategoryColor(expense.category)}20`, color: getCategoryColor(expense.category) }}
                      >
                        {getCategoryLabel(expense.category)}
                      </span>
                    </td>
                    <td>{expense.vendor || '-'}</td>
                    <td>{expense.description || '-'}</td>
                    <td className={styles.amountCell}>{formatCurrency(expense.amount)}</td>
                    <td>
                      {expense.taxDeductible ? (
                        <span className={styles.yesTag}>Yes</span>
                      ) : (
                        <span className={styles.noTag}>No</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className={styles.iconButton}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className={styles.iconButtonDelete}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeButton}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    placeholder="0.00"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className={styles.select}
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Subcategory</label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="e.g., massage oils, lotions"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Vendor</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="Vendor name"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the expense"
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Receipt URL</label>
                <input
                  type="url"
                  value={formData.receiptUrl}
                  onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                  placeholder="https://..."
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className={styles.select}
                >
                  {PAYMENT_METHODS.map(method => (
                    <option key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.taxDeductible}
                    onChange={(e) => setFormData({ ...formData, taxDeductible: e.target.checked })}
                    className={styles.checkbox}
                  />
                  <span>Tax Deductible</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes (optional)"
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingExpense ? 'Update' : 'Add'} Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
