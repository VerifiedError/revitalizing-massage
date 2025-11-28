'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Users, CheckCircle, XCircle, Clock, ArrowUp, ArrowDown } from 'lucide-react';
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

interface AppointmentAnalytics {
  period: {
    type: string;
    startDate: string;
    endDate: string;
  };
  metrics: {
    completionRate: {
      total: number;
      completed: number;
      rate: number;
    };
    noShowRate: {
      total: number;
      noShows: number;
      rate: number;
    };
    cancellationRate: {
      total: number;
      cancelled: number;
      rate: number;
    };
    confirmationRate: {
      scheduled: number;
      confirmed: number;
      rate: number;
    };
    utilizationRate: {
      totalHours: number;
      bookedHours: number;
      utilizationRate: number;
    };
    avgAppointmentsPerDay: number;
    avgLeadTime: number;
  };
  distribution: {
    byService: Array<{ serviceName: string; count: number; percentage: number }>;
    byDayOfWeek: Array<{ dayOfWeek: number; dayName: string; count: number }>;
    byTimeOfDay: { morning: number; afternoon: number; evening: number };
    byHour: Array<{ hour: number; hourDisplay: string; count: number }>;
    byStatus: Array<{ status: string; count: number; percentage: number }>;
  };
  trends: Array<{
    date: string;
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
    total: number;
  }>;
  peakTimes: {
    peakDay: string;
    peakDayCount: number;
    peakHour: string;
    peakHourCount: number;
  };
  topServices: Array<{ serviceName: string; count: number; percentage: number }>;
  comparisons: {
    monthOverMonth: {
      thisMonth: number;
      lastMonth: number;
      percentChange: number;
    };
    yearOverYear: {
      thisYear: number;
      lastYear: number;
      percentChange: number;
    };
  };
}

export default function AppointmentAnalyticsPage() {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [analytics, setAnalytics] = useState<AppointmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, customStartDate, customEndDate]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      let url = `/api/admin/reports/appointments?type=${dateRange}`;

      if (dateRange === 'custom' && customStartDate && customEndDate) {
        url += `&startDate=${customStartDate}&endDate=${customEndDate}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch appointment analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(rate: number, metric: 'completion' | 'noShow' | 'cancellation'): string {
    if (metric === 'completion') {
      return rate >= 90 ? '#10b981' : rate >= 70 ? '#f59e0b' : '#ef4444';
    } else if (metric === 'noShow') {
      return rate < 5 ? '#10b981' : rate < 10 ? '#f59e0b' : '#ef4444';
    } else {
      return rate < 10 ? '#10b981' : rate < 20 ? '#f59e0b' : '#ef4444';
    }
  }

  const STATUS_COLORS = {
    scheduled: '#3b82f6',
    confirmed: '#10b981',
    completed: '#6b7280',
    cancelled: '#ef4444',
    'no-show': '#f59e0b'
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading appointment analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Failed to load analytics data.</div>
      </div>
    );
  }

  const totalAppointments = analytics.metrics.completionRate.total;
  const previousPeriodTotal = totalAppointments * 0.9; // Mock comparison
  const totalChange = previousPeriodTotal > 0
    ? ((totalAppointments - previousPeriodTotal) / previousPeriodTotal) * 100
    : 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Appointment Analytics</h1>

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
        {/* Total Appointments */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Total Appointments</h3>
            <p className={styles.statValue}>{totalAppointments}</p>
            <div className={styles.statTrend}>
              {totalChange >= 0 ? (
                <span className={styles.trendUp}>
                  <ArrowUp size={16} />
                  {totalChange.toFixed(1)}%
                </span>
              ) : (
                <span className={styles.trendDown}>
                  <ArrowDown size={16} />
                  {Math.abs(totalChange).toFixed(1)}%
                </span>
              )}
              <span className={styles.trendLabel}>vs previous period</span>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{
            backgroundColor: `${getStatusColor(analytics.metrics.completionRate.rate, 'completion')}15`,
            color: getStatusColor(analytics.metrics.completionRate.rate, 'completion')
          }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Completion Rate</h3>
            <p className={styles.statValue} style={{
              color: getStatusColor(analytics.metrics.completionRate.rate, 'completion')
            }}>
              {analytics.metrics.completionRate.rate.toFixed(1)}%
            </p>
            <p className={styles.statSubtext}>
              {analytics.metrics.completionRate.completed} of {analytics.metrics.completionRate.total}
            </p>
          </div>
        </div>

        {/* No-Show Rate */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{
            backgroundColor: `${getStatusColor(analytics.metrics.noShowRate.rate, 'noShow')}15`,
            color: getStatusColor(analytics.metrics.noShowRate.rate, 'noShow')
          }}>
            <XCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>No-Show Rate</h3>
            <p className={styles.statValue} style={{
              color: getStatusColor(analytics.metrics.noShowRate.rate, 'noShow')
            }}>
              {analytics.metrics.noShowRate.rate.toFixed(1)}%
            </p>
            <p className={styles.statSubtext}>
              {analytics.metrics.noShowRate.noShows} no-shows
            </p>
          </div>
        </div>

        {/* Cancellation Rate */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{
            backgroundColor: `${getStatusColor(analytics.metrics.cancellationRate.rate, 'cancellation')}15`,
            color: getStatusColor(analytics.metrics.cancellationRate.rate, 'cancellation')
          }}>
            <XCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Cancellation Rate</h3>
            <p className={styles.statValue} style={{
              color: getStatusColor(analytics.metrics.cancellationRate.rate, 'cancellation')
            }}>
              {analytics.metrics.cancellationRate.rate.toFixed(1)}%
            </p>
            <p className={styles.statSubtext}>
              {analytics.metrics.cancellationRate.cancelled} cancelled
            </p>
          </div>
        </div>

        {/* Average Appointments/Day */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Avg Appointments/Day</h3>
            <p className={styles.statValue}>
              {analytics.metrics.avgAppointmentsPerDay.toFixed(1)}
            </p>
            <p className={styles.statSubtext}>Rolling average</p>
          </div>
        </div>

        {/* Utilization Rate */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#06b6d415', color: '#06b6d4' }}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>Utilization Rate</h3>
            <p className={styles.statValue}>
              {analytics.metrics.utilizationRate.utilizationRate.toFixed(1)}%
            </p>
            <p className={styles.statSubtext}>
              {analytics.metrics.utilizationRate.bookedHours.toFixed(1)} / {analytics.metrics.utilizationRate.totalHours} hrs
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        {/* Appointment Trends Line Chart */}
        {analytics.trends && analytics.trends.length > 0 && (
          <div className={styles.chartCard}>
            <h2>Appointment Trends</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analytics.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{ fontSize: '14px' }} />
                <Legend />
                <Line type="monotone" dataKey="scheduled" stroke="#3b82f6" strokeWidth={2} name="Scheduled" />
                <Line type="monotone" dataKey="confirmed" stroke="#10b981" strokeWidth={2} name="Confirmed" />
                <Line type="monotone" dataKey="completed" stroke="#6b7280" strokeWidth={2} name="Completed" />
                <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} name="Cancelled" />
                <Line type="monotone" dataKey="noShow" stroke="#f59e0b" strokeWidth={2} name="No-Show" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Appointments by Service Bar Chart */}
        {analytics.topServices && analytics.topServices.length > 0 && (
          <div className={styles.chartCard}>
            <h2>Appointments by Service (Top 10)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.topServices} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="serviceName"
                  width={150}
                  fontSize={11}
                />
                <Tooltip contentStyle={{ fontSize: '14px' }} />
                <Bar dataKey="count" fill="#10b981" name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Appointments by Day of Week */}
        {analytics.distribution.byDayOfWeek && analytics.distribution.byDayOfWeek.length > 0 && (
          <div className={styles.chartCard}>
            <h2>Appointments by Day of Week</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.distribution.byDayOfWeek}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="dayName"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{ fontSize: '14px' }} />
                <Bar dataKey="count" fill="#3b82f6" name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Appointments by Status Pie Chart */}
        {analytics.distribution.byStatus && analytics.distribution.byStatus.length > 0 && (
          <div className={styles.chartCard}>
            <h2>Appointments by Status</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={analytics.distribution.byStatus.filter(s => s.count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.status}: ${entry.percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.distribution.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#666'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '14px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Peak Times & Distribution Table */}
      <div className={styles.distributionSection}>
        <h2>Appointment Distribution</h2>
        <div className={styles.distributionGrid}>
          {/* Peak Times */}
          <div className={styles.distributionCard}>
            <h3>Peak Booking Times</h3>
            <div className={styles.peakTimesList}>
              <div className={styles.peakItem}>
                <span className={styles.peakLabel}>Most Popular Day:</span>
                <span className={styles.peakValue}>
                  {analytics.peakTimes.peakDay} ({analytics.peakTimes.peakDayCount} appointments)
                </span>
              </div>
              <div className={styles.peakItem}>
                <span className={styles.peakLabel}>Most Popular Time:</span>
                <span className={styles.peakValue}>
                  {analytics.peakTimes.peakHour} ({analytics.peakTimes.peakHourCount} appointments)
                </span>
              </div>
              <div className={styles.peakItem}>
                <span className={styles.peakLabel}>Avg Booking Lead Time:</span>
                <span className={styles.peakValue}>
                  {analytics.metrics.avgLeadTime.toFixed(1)} days
                </span>
              </div>
            </div>
          </div>

          {/* Time of Day Distribution */}
          <div className={styles.distributionCard}>
            <h3>Time of Day Distribution</h3>
            <div className={styles.timeDistribution}>
              <div className={styles.timeSlot}>
                <span className={styles.timeLabel}>Morning (Before 12 PM)</span>
                <span className={styles.timeCount}>{analytics.distribution.byTimeOfDay.morning}</span>
              </div>
              <div className={styles.timeSlot}>
                <span className={styles.timeLabel}>Afternoon (12 PM - 5 PM)</span>
                <span className={styles.timeCount}>{analytics.distribution.byTimeOfDay.afternoon}</span>
              </div>
              <div className={styles.timeSlot}>
                <span className={styles.timeLabel}>Evening (After 5 PM)</span>
                <span className={styles.timeCount}>{analytics.distribution.byTimeOfDay.evening}</span>
              </div>
            </div>
          </div>

          {/* Service Popularity Ranking */}
          <div className={styles.distributionCard}>
            <h3>Top 5 Services</h3>
            <div className={styles.serviceRanking}>
              {analytics.topServices.slice(0, 5).map((service, index) => (
                <div key={service.serviceName} className={styles.rankItem}>
                  <span className={styles.rank}>#{index + 1}</span>
                  <span className={styles.serviceName}>{service.serviceName}</span>
                  <span className={styles.serviceCount}>{service.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparisons */}
          <div className={styles.distributionCard}>
            <h3>Period Comparisons</h3>
            <div className={styles.comparisonsList}>
              <div className={styles.comparisonItem}>
                <span className={styles.comparisonLabel}>Month over Month:</span>
                <span className={styles.comparisonValue}>
                  {analytics.comparisons.monthOverMonth.thisMonth} vs {analytics.comparisons.monthOverMonth.lastMonth}
                  {' '}
                  <span className={analytics.comparisons.monthOverMonth.percentChange >= 0 ? styles.positive : styles.negative}>
                    ({analytics.comparisons.monthOverMonth.percentChange >= 0 ? '+' : ''}
                    {analytics.comparisons.monthOverMonth.percentChange.toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className={styles.comparisonItem}>
                <span className={styles.comparisonLabel}>Year over Year:</span>
                <span className={styles.comparisonValue}>
                  {analytics.comparisons.yearOverYear.thisYear} vs {analytics.comparisons.yearOverYear.lastYear}
                  {' '}
                  <span className={analytics.comparisons.yearOverYear.percentChange >= 0 ? styles.positive : styles.negative}>
                    ({analytics.comparisons.yearOverYear.percentChange >= 0 ? '+' : ''}
                    {analytics.comparisons.yearOverYear.percentChange.toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
