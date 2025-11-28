'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Download, Calendar } from 'lucide-react';
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

interface ProfitLossData {
  profitLoss: {
    startDate: string;
    endDate: string;
    revenue: {
      serviceRevenue: number;
      addonsRevenue: number;
      totalRevenue: number;
    };
    expenses: {
      byCategory: Array<{
        category: string;
        amount: number;
        percentage: number;
      }>;
      totalExpenses: number;
    };
    netProfit: number;
    profitMargin: number;
    comparison?: {
      previousRevenue: number;
      previousExpenses: number;
      previousProfit: number;
      revenueChange: number;
      expensesChange: number;
      profitChange: number;
    };
  };
  trends: Array<{
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  expenseBreakdown: Array<{
    category: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  'supplies': '#3b82f6',
  'rent': '#8b5cf6',
  'utilities': '#10b981',
  'marketing': '#f59e0b',
  'insurance': '#ef4444',
  'professional-services': '#06b6d4',
  'equipment': '#ec4899',
  'software': '#a855f7',
  'other': '#64748b'
};

export default function FinancialReportsPage() {
  const [data, setData] = useState<ProfitLossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('month');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(Math.ceil((new Date().getMonth() + 1) / 3));
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    fetchReport();
  }, [reportType, year, month, quarter, customStartDate, customEndDate]);

  async function fetchReport() {
    try {
      setLoading(true);
      const params = new URLSearchParams({ type: reportType });

      if (reportType === 'month') {
        params.append('year', year.toString());
        params.append('month', month.toString());
      } else if (reportType === 'quarter') {
        params.append('year', year.toString());
        params.append('quarter', quarter.toString());
      } else if (reportType === 'year') {
        params.append('year', year.toString());
      } else if (reportType === 'custom' && customStartDate && customEndDate) {
        params.append('startDate', customStartDate);
        params.append('endDate', customEndDate);
      }

      const res = await fetch(`/api/admin/finances/reports?${params.toString()}`);
      if (res.ok) {
        const reportData = await res.json();
        setData(reportData);
      }
    } catch (error) {
      console.error('Failed to fetch financial report:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  function getCategoryLabel(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function exportToCSV() {
    if (!data) return;

    const { profitLoss } = data;
    const rows = [
      ['Profit & Loss Statement'],
      [`Period: ${profitLoss.startDate} to ${profitLoss.endDate}`],
      [''],
      ['REVENUE'],
      ['Service Revenue', formatCurrency(profitLoss.revenue.serviceRevenue)],
      ['Add-ons Revenue', formatCurrency(profitLoss.revenue.addonsRevenue)],
      ['Total Revenue', formatCurrency(profitLoss.revenue.totalRevenue)],
      [''],
      ['EXPENSES'],
      ...profitLoss.expenses.byCategory.map(cat => [
        getCategoryLabel(cat.category),
        formatCurrency(cat.amount)
      ]),
      ['Total Expenses', formatCurrency(profitLoss.expenses.totalExpenses)],
      [''],
      ['NET PROFIT/LOSS', formatCurrency(profitLoss.netProfit)],
      ['Profit Margin', `${profitLoss.profitMargin.toFixed(2)}%`]
    ];

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pl_statement_${profitLoss.startDate}_${profitLoss.endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Financial Reports</h1>
          <p>Profit & Loss statements and financial analytics</p>
        </div>
        <button onClick={exportToCSV} className={styles.exportButton} disabled={!data}>
          <Download size={20} />
          <span>Export P&L</span>
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.reportTypeSelector}>
          <button
            onClick={() => setReportType('month')}
            className={reportType === 'month' ? styles.reportTypeActive : styles.reportTypeButton}
          >
            This Month
          </button>
          <button
            onClick={() => setReportType('quarter')}
            className={reportType === 'quarter' ? styles.reportTypeActive : styles.reportTypeButton}
          >
            Quarter
          </button>
          <button
            onClick={() => setReportType('year')}
            className={reportType === 'year' ? styles.reportTypeActive : styles.reportTypeButton}
          >
            Year
          </button>
          <button
            onClick={() => setReportType('custom')}
            className={reportType === 'custom' ? styles.reportTypeActive : styles.reportTypeButton}
          >
            Custom
          </button>
        </div>

        <div className={styles.dateControls}>
          {reportType === 'month' && (
            <>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className={styles.select}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className={styles.select}
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </>
          )}

          {reportType === 'quarter' && (
            <>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className={styles.select}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={quarter}
                onChange={(e) => setQuarter(parseInt(e.target.value))}
                className={styles.select}
              >
                <option value={1}>Q1 (Jan-Mar)</option>
                <option value={2}>Q2 (Apr-Jun)</option>
                <option value={3}>Q3 (Jul-Sep)</option>
                <option value={4}>Q4 (Oct-Dec)</option>
              </select>
            </>
          )}

          {reportType === 'year' && (
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className={styles.select}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}

          {reportType === 'custom' && (
            <>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className={styles.input}
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className={styles.input}
              />
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading financial data...</div>
      ) : !data ? (
        <div className={styles.empty}>No data available for this period</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon} style={{ backgroundColor: '#96deeb15', color: '#6bc4d4' }}>
                  <DollarSign size={24} />
                </div>
                <h3>Total Revenue</h3>
              </div>
              <p className={styles.cardValue}>{formatCurrency(data.profitLoss.revenue.totalRevenue)}</p>
              {data.profitLoss.comparison && (
                <p className={styles.cardChange} style={{
                  color: data.profitLoss.comparison.revenueChange >= 0 ? '#10b981' : '#ef4444'
                }}>
                  {data.profitLoss.comparison.revenueChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{formatPercentage(data.profitLoss.comparison.revenueChange)} vs previous</span>
                </p>
              )}
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon} style={{ backgroundColor: '#ef444415', color: '#ef4444' }}>
                  <DollarSign size={24} />
                </div>
                <h3>Total Expenses</h3>
              </div>
              <p className={styles.cardValue}>{formatCurrency(data.profitLoss.expenses.totalExpenses)}</p>
              {data.profitLoss.comparison && (
                <p className={styles.cardChange} style={{
                  color: data.profitLoss.comparison.expensesChange <= 0 ? '#10b981' : '#ef4444'
                }}>
                  {data.profitLoss.comparison.expensesChange <= 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                  <span>{formatPercentage(data.profitLoss.comparison.expensesChange)} vs previous</span>
                </p>
              )}
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon} style={{
                  backgroundColor: data.profitLoss.netProfit >= 0 ? '#10b98115' : '#ef444415',
                  color: data.profitLoss.netProfit >= 0 ? '#10b981' : '#ef4444'
                }}>
                  <TrendingUp size={24} />
                </div>
                <h3>Net Profit/Loss</h3>
              </div>
              <p className={styles.cardValue} style={{
                color: data.profitLoss.netProfit >= 0 ? '#10b981' : '#ef4444'
              }}>
                {formatCurrency(data.profitLoss.netProfit)}
              </p>
              {data.profitLoss.comparison && (
                <p className={styles.cardChange} style={{
                  color: data.profitLoss.comparison.profitChange >= 0 ? '#10b981' : '#ef4444'
                }}>
                  {data.profitLoss.comparison.profitChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{formatPercentage(data.profitLoss.comparison.profitChange)} vs previous</span>
                </p>
              )}
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon} style={{
                  backgroundColor: data.profitLoss.profitMargin >= 30 ? '#10b98115' :
                                  data.profitLoss.profitMargin >= 10 ? '#f59e0b15' : '#ef444415',
                  color: data.profitLoss.profitMargin >= 30 ? '#10b981' :
                         data.profitLoss.profitMargin >= 10 ? '#f59e0b' : '#ef4444'
                }}>
                  <TrendingUp size={24} />
                </div>
                <h3>Profit Margin</h3>
              </div>
              <p className={styles.cardValue} style={{
                color: data.profitLoss.profitMargin >= 30 ? '#10b981' :
                       data.profitLoss.profitMargin >= 10 ? '#f59e0b' : '#ef4444'
              }}>
                {data.profitLoss.profitMargin.toFixed(1)}%
              </p>
              <p className={styles.cardSubtext}>
                {data.profitLoss.profitMargin >= 30 ? 'Excellent' :
                 data.profitLoss.profitMargin >= 10 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className={styles.chartsGrid}>
            {/* Profit/Loss Trend Line Chart */}
            <div className={styles.chartCard}>
              <h3>Profit/Loss Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value + 'T12:00:00');
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => {
                      const date = new Date(label + 'T12:00:00');
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#96deeb" name="Revenue" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" name="Net Profit" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown Pie Chart */}
            <div className={styles.chartCard}>
              <h3>Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.expenseBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={getCategoryLabel}
                  />
                  <Legend formatter={getCategoryLabel} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Expense Categories Bar Chart */}
            <div className={styles.chartCard}>
              <h3>Top Expense Categories</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.expenseBreakdown.slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fontSize: 12 }}
                    tickFormatter={getCategoryLabel}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={getCategoryLabel}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* P&L Statement Table */}
          <div className={styles.plStatement}>
            <h2>Profit & Loss Statement</h2>
            <p className={styles.plPeriod}>
              Period: {new Date(data.profitLoss.startDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(data.profitLoss.endDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>

            <div className={styles.plSection}>
              <h3>Revenue</h3>
              <div className={styles.plRow}>
                <span>Service Revenue</span>
                <span>{formatCurrency(data.profitLoss.revenue.serviceRevenue)}</span>
              </div>
              <div className={styles.plRow}>
                <span>Add-ons Revenue</span>
                <span>{formatCurrency(data.profitLoss.revenue.addonsRevenue)}</span>
              </div>
              <div className={`${styles.plRow} ${styles.plTotal}`}>
                <span>Total Revenue</span>
                <span>{formatCurrency(data.profitLoss.revenue.totalRevenue)}</span>
              </div>
            </div>

            <div className={styles.plSection}>
              <h3>Expenses</h3>
              {data.profitLoss.expenses.byCategory.map((cat, index) => (
                <div key={index} className={styles.plRow}>
                  <span>{getCategoryLabel(cat.category)}</span>
                  <span>{formatCurrency(cat.amount)}</span>
                </div>
              ))}
              <div className={`${styles.plRow} ${styles.plTotal}`}>
                <span>Total Expenses</span>
                <span>{formatCurrency(data.profitLoss.expenses.totalExpenses)}</span>
              </div>
            </div>

            <div className={styles.plSection}>
              <div className={`${styles.plRow} ${styles.plNetProfit}`} style={{
                color: data.profitLoss.netProfit >= 0 ? '#10b981' : '#ef4444'
              }}>
                <span>Net Profit/Loss</span>
                <span>{formatCurrency(data.profitLoss.netProfit)}</span>
              </div>
              <div className={styles.plRow}>
                <span>Profit Margin</span>
                <span style={{
                  color: data.profitLoss.profitMargin >= 30 ? '#10b981' :
                         data.profitLoss.profitMargin >= 10 ? '#f59e0b' : '#ef4444'
                }}>
                  {data.profitLoss.profitMargin.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
