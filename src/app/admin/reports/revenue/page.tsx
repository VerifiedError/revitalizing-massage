'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, CreditCard, Calendar, Download, ArrowUp, ArrowDown } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import styles from './page.module.css';

interface RevenueStats {
  revenue: number;
  count?: number;
  average?: number;
  byDay?: Array<{ date: string; revenue: number; count: number }>;
  averageTransaction: number;
  byService: Array<{ serviceName: string; revenue: number; count: number; percentage: number }>;
  byPaymentMethod: Array<{ paymentMethod: string; revenue: number; count: number; percentage: number }>;
  byDayOfWeek: Array<{ dayOfWeek: number; dayName: string; revenue: number; count: number }>;
  topServices: Array<{ serviceName: string; revenue: number; count: number }>;
  forecast: {
    predicted: number;
    historicalAverage: number;
    trend: 'up' | 'down' | 'stable';
    confidence: 'high' | 'medium' | 'low';
  };
}

interface RevenueRecord {
  id: string;
  date: string;
  serviceName: string;
  totalAmount: string;
  paymentStatus: string;
  paymentMethod: string | null;
}

export default function RevenueReportsPage() {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [records, setRecords] = useState<RevenueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange, customStartDate, customEndDate]);

  async function fetchRevenueData() {
    setLoading(true);
    try {
      let statsUrl = `/api/admin/revenue/stats?period=${dateRange}`;
      let recordsUrl = `/api/admin/revenue?`;

      if (dateRange === 'custom' && customStartDate && customEndDate) {
        statsUrl += `&startDate=${customStartDate}&endDate=${customEndDate}`;
        recordsUrl += `startDate=${customStartDate}&endDate=${customEndDate}`;
      }

      const [statsRes, recordsRes] = await Promise.all([
        fetch(statsUrl),
        fetch(recordsUrl)
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (recordsRes.ok) {
        const recordsData = await recordsRes.json();
        setRecords(recordsData);
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  function exportToCSV() {
    if (records.length === 0) return;

    const headers = ['Date', 'Service', 'Amount', 'Payment Status', 'Payment Method'];
    const rows = records.map(r => [
      r.date,
      r.serviceName,
      r.totalAmount,
      r.paymentStatus,
      r.paymentMethod || 'N/A'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  const filteredRecords = records.filter(r => {
    if (filterStatus !== 'all' && r.paymentStatus !== filterStatus) return false;
    if (filterMethod !== 'all' && r.paymentMethod !== filterMethod) return false;
    return true;
  });

  const totalRevenue = filteredRecords.reduce((sum, r) => sum + parseFloat(r.totalAmount), 0);
  const transactionCount = filteredRecords.length;
  const averageValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;

  // Calculate comparison with previous period (mock for now)
  const previousPeriodRevenue = stats ? stats.revenue * 0.9 : 0;
  const revenueChange = previousPeriodRevenue > 0
    ? ((stats?.revenue || 0) - previousPeriodRevenue) / previousPeriodRevenue * 100
    : 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading revenue data...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Revenue Reports</h1>
          <button onClick={exportToCSV} className={styles.exportButton}>
            <Download size={20} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Date Range Selector */}
        <div className={styles.dateRangeSelector}>
          <button
            onClick={() => setDateRange('today')}
            className={dateRange === 'today' ? styles.active : ''}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={dateRange === 'week' ? styles.active : ''}
          >
            This Week
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={dateRange === 'month' ? styles.active : ''}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange('year')}
            className={dateRange === 'year' ? styles.active : ''}
          >
            This Year
          </button>
          <button
            onClick={() => setDateRange('custom')}
            className={dateRange === 'custom' ? styles.active : ''}
          >
            Custom
          </button>
        </div>

        {dateRange === 'custom' && (
          <div className={styles.customDateRange}>
            <div className={styles.dateInput}>
              <label>Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div className={styles.dateInput}>
              <label>End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Revenue</h3>
            <p className={styles.statValue}>{formatCurrency(totalRevenue)}</p>
            <div className={styles.statTrend}>
              {revenueChange >= 0 ? (
                <span className={styles.trendUp}>
                  <ArrowUp size={16} />
                  {revenueChange.toFixed(1)}%
                </span>
              ) : (
                <span className={styles.trendDown}>
                  <ArrowDown size={16} />
                  {Math.abs(revenueChange).toFixed(1)}%
                </span>
              )}
              <span className={styles.trendLabel}>vs previous period</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Average Transaction</h3>
            <p className={styles.statValue}>{formatCurrency(averageValue)}</p>
            <p className={styles.statSubtext}>Per appointment</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Transactions</h3>
            <p className={styles.statValue}>{transactionCount}</p>
            <p className={styles.statSubtext}>Completed appointments</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}>
            <CreditCard size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Forecast Next Month</h3>
            <p className={styles.statValue}>
              {stats?.forecast ? formatCurrency(stats.forecast.predicted) : '$0.00'}
            </p>
            <p className={styles.statSubtext}>
              {stats?.forecast?.trend === 'up' && 'Trending up'}
              {stats?.forecast?.trend === 'down' && 'Trending down'}
              {stats?.forecast?.trend === 'stable' && 'Stable trend'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        {/* Revenue Over Time */}
        {stats?.byDay && stats.byDay.length > 0 && (
          <div className={styles.chartCard}>
            <h2>Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.byDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: '14px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Revenue by Service */}
        {stats?.byService && stats.byService.length > 0 && (
          <div className={styles.chartCard}>
            <h2>Revenue by Service</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byService.slice(0, 10)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="serviceName"
                  width={120}
                  fontSize={11}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: '14px' }}
                />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Revenue by Payment Method */}
        {stats?.byPaymentMethod && stats.byPaymentMethod.length > 0 && (
          <div className={styles.chartCard}>
            <h2>Revenue by Payment Method</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.byPaymentMethod}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.paymentMethod}: ${entry.percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {stats.byPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: '14px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Revenue by Day of Week */}
        {stats?.byDayOfWeek && stats.byDayOfWeek.length > 0 && (
          <div className={styles.chartCard}>
            <h2>Revenue by Day of Week</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byDayOfWeek}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="dayName"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: '14px' }}
                />
                <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Revenue Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2>Revenue Records</h2>
          <div className={styles.filters}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filter}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className={styles.filter}
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="check">Check</option>
              <option value="venmo">Venmo</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Mobile: Card Layout */}
        <div className={styles.mobileCards}>
          {filteredRecords.map((record) => (
            <div key={record.id} className={styles.recordCard}>
              <div className={styles.recordCardHeader}>
                <span className={styles.recordDate}>{record.date}</span>
                <span className={`${styles.recordStatus} ${styles[record.paymentStatus]}`}>
                  {record.paymentStatus}
                </span>
              </div>
              <div className={styles.recordCardBody}>
                <h3>{record.serviceName}</h3>
                <p className={styles.recordAmount}>{formatCurrency(parseFloat(record.totalAmount))}</p>
                <p className={styles.recordMethod}>
                  {record.paymentMethod ? `Paid by ${record.paymentMethod}` : 'No payment method'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table Layout */}
        <div className={styles.desktopTable}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.serviceName}</td>
                  <td className={styles.amount}>{formatCurrency(parseFloat(record.totalAmount))}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[record.paymentStatus]}`}>
                      {record.paymentStatus}
                    </span>
                  </td>
                  <td>{record.paymentMethod || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className={styles.emptyState}>
            <p>No revenue records found for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
}
