import { db } from '@/db';
import { revenueRecords } from '@/db/schema';
import { eq, and, gte, lte, desc, sql, count } from 'drizzle-orm';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getTodayString(): string {
  return getDateString(new Date());
}

function getStartOfWeekString(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0, Sunday = 6
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  return getDateString(monday);
}

function getStartOfMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function getStartOfYearString(): string {
  const now = new Date();
  return `${now.getFullYear()}-01-01`;
}

function getLastYearString(): string {
  const now = new Date();
  return `${now.getFullYear() - 1}-01-01`;
}

function getLastYearEndString(): string {
  const now = new Date();
  return `${now.getFullYear() - 1}-12-31`;
}

// ============================================================================
// DASHBOARD WIDGETS
// ============================================================================

export async function getTodayRevenue(): Promise<number> {
  const today = getTodayString();

  const result = await db
    .select({ total: sql<string>`sum(${revenueRecords.totalAmount})` })
    .from(revenueRecords)
    .where(
      and(
        eq(revenueRecords.date, today),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  return parseFloat(result[0]?.total || '0');
}

export async function getWeekRevenue(): Promise<number> {
  const startOfWeek = getStartOfWeekString();
  const today = getTodayString();

  const result = await db
    .select({ total: sql<string>`sum(${revenueRecords.totalAmount})` })
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, startOfWeek),
        lte(revenueRecords.date, today),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  return parseFloat(result[0]?.total || '0');
}

export async function getMonthRevenue(): Promise<number> {
  const startOfMonth = getStartOfMonthString();
  const today = getTodayString();

  const result = await db
    .select({ total: sql<string>`sum(${revenueRecords.totalAmount})` })
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, startOfMonth),
        lte(revenueRecords.date, today),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  return parseFloat(result[0]?.total || '0');
}

export async function getYearRevenue(): Promise<number> {
  const startOfYear = getStartOfYearString();
  const today = getTodayString();

  const result = await db
    .select({ total: sql<string>`sum(${revenueRecords.totalAmount})` })
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, startOfYear),
        lte(revenueRecords.date, today),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  return parseFloat(result[0]?.total || '0');
}

export async function getYearOverYearComparison(): Promise<{
  currentYear: number;
  lastYear: number;
  percentChange: number;
}> {
  const currentYear = await getYearRevenue();

  const lastYearStart = getLastYearString();
  const lastYearEnd = getLastYearEndString();

  const lastYearResult = await db
    .select({ total: sql<string>`sum(${revenueRecords.totalAmount})` })
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, lastYearStart),
        lte(revenueRecords.date, lastYearEnd),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  const lastYear = parseFloat(lastYearResult[0]?.total || '0');
  const percentChange = lastYear > 0 ? ((currentYear - lastYear) / lastYear) * 100 : 0;

  return { currentYear, lastYear, percentChange };
}

// ============================================================================
// REVENUE BY PERIOD
// ============================================================================

export async function getRevenueBetweenDates(startDate: string, endDate: string): Promise<{
  total: number;
  count: number;
  average: number;
  byDay: Array<{ date: string; revenue: number; count: number }>;
}> {
  const records = await db
    .select()
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    )
    .orderBy(revenueRecords.date);

  const total = records.reduce((sum, r) => sum + parseFloat(r.totalAmount), 0);
  const countVal = records.length;
  const average = countVal > 0 ? total / countVal : 0;

  // Group by day
  const byDayMap = new Map<string, { revenue: number; count: number }>();
  records.forEach(r => {
    const existing = byDayMap.get(r.date) || { revenue: 0, count: 0 };
    byDayMap.set(r.date, {
      revenue: existing.revenue + parseFloat(r.totalAmount),
      count: existing.count + 1
    });
  });

  const byDay = Array.from(byDayMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { total, count: countVal, average, byDay };
}

export async function getRevenueByMonth(year: number): Promise<Array<{
  month: number;
  monthName: string;
  revenue: number;
  count: number;
}>> {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const records = await db
    .select()
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const byMonthMap = new Map<number, { revenue: number; count: number }>();

  records.forEach(r => {
    const month = parseInt(r.date.split('-')[1], 10);
    const existing = byMonthMap.get(month) || { revenue: 0, count: 0 };
    byMonthMap.set(month, {
      revenue: existing.revenue + parseFloat(r.totalAmount),
      count: existing.count + 1
    });
  });

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const data = byMonthMap.get(month) || { revenue: 0, count: 0 };
    return {
      month,
      monthName: monthNames[i],
      ...data
    };
  });
}

export async function getRevenueByWeek(year: number, month: number): Promise<Array<{
  week: number;
  startDate: string;
  endDate: string;
  revenue: number;
  count: number;
}>> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const records = await db
    .select()
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  // Group by week (simplified: every 7 days)
  const weeks: Array<{ week: number; startDate: string; endDate: string; revenue: number; count: number }> = [];
  let currentWeekStart = 1;
  let weekNum = 1;

  while (currentWeekStart <= lastDay) {
    const currentWeekEnd = Math.min(currentWeekStart + 6, lastDay);
    const weekStart = `${year}-${String(month).padStart(2, '0')}-${String(currentWeekStart).padStart(2, '0')}`;
    const weekEnd = `${year}-${String(month).padStart(2, '0')}-${String(currentWeekEnd).padStart(2, '0')}`;

    const weekRecords = records.filter(r => r.date >= weekStart && r.date <= weekEnd);
    const revenue = weekRecords.reduce((sum, r) => sum + parseFloat(r.totalAmount), 0);

    weeks.push({
      week: weekNum,
      startDate: weekStart,
      endDate: weekEnd,
      revenue,
      count: weekRecords.length
    });

    currentWeekStart += 7;
    weekNum++;
  }

  return weeks;
}

export async function getRevenueByDay(year: number, month: number): Promise<Array<{
  day: number;
  date: string;
  revenue: number;
  count: number;
}>> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const records = await db
    .select()
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  const byDayMap = new Map<string, { revenue: number; count: number }>();
  records.forEach(r => {
    const existing = byDayMap.get(r.date) || { revenue: 0, count: 0 };
    byDayMap.set(r.date, {
      revenue: existing.revenue + parseFloat(r.totalAmount),
      count: existing.count + 1
    });
  });

  return Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const data = byDayMap.get(date) || { revenue: 0, count: 0 };
    return { day, date, ...data };
  });
}

// ============================================================================
// REVENUE BY CATEGORY
// ============================================================================

export async function getRevenueByService(startDate?: string, endDate?: string): Promise<Array<{
  serviceName: string;
  revenue: number;
  count: number;
  percentage: number;
}>> {
  let query = db.select().from(revenueRecords);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    ) as any;
  } else {
    query = query.where(eq(revenueRecords.paymentStatus, 'paid')) as any;
  }

  const records = await query;

  const byServiceMap = new Map<string, { revenue: number; count: number }>();
  let totalRevenue = 0;

  records.forEach(r => {
    const revenue = parseFloat(r.totalAmount);
    totalRevenue += revenue;

    const existing = byServiceMap.get(r.serviceName) || { revenue: 0, count: 0 };
    byServiceMap.set(r.serviceName, {
      revenue: existing.revenue + revenue,
      count: existing.count + 1
    });
  });

  return Array.from(byServiceMap.entries())
    .map(([serviceName, data]) => ({
      serviceName,
      ...data,
      percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export async function getRevenueByPaymentMethod(startDate?: string, endDate?: string): Promise<Array<{
  paymentMethod: string;
  revenue: number;
  count: number;
  percentage: number;
}>> {
  let query = db.select().from(revenueRecords);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    ) as any;
  } else {
    query = query.where(eq(revenueRecords.paymentStatus, 'paid')) as any;
  }

  const records = await query;

  const byMethodMap = new Map<string, { revenue: number; count: number }>();
  let totalRevenue = 0;

  records.forEach(r => {
    const revenue = parseFloat(r.totalAmount);
    totalRevenue += revenue;
    const method = r.paymentMethod || 'unknown';

    const existing = byMethodMap.get(method) || { revenue: 0, count: 0 };
    byMethodMap.set(method, {
      revenue: existing.revenue + revenue,
      count: existing.count + 1
    });
  });

  return Array.from(byMethodMap.entries())
    .map(([paymentMethod, data]) => ({
      paymentMethod,
      ...data,
      percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export async function getRevenueByDayOfWeek(startDate?: string, endDate?: string): Promise<Array<{
  dayOfWeek: number;
  dayName: string;
  revenue: number;
  count: number;
}>> {
  let query = db.select().from(revenueRecords);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    ) as any;
  } else {
    query = query.where(eq(revenueRecords.paymentStatus, 'paid')) as any;
  }

  const records = await query;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const byDayMap = new Map<number, { revenue: number; count: number }>();

  records.forEach(r => {
    const date = new Date(r.date);
    const dayOfWeek = date.getDay();
    const revenue = parseFloat(r.totalAmount);

    const existing = byDayMap.get(dayOfWeek) || { revenue: 0, count: 0 };
    byDayMap.set(dayOfWeek, {
      revenue: existing.revenue + revenue,
      count: existing.count + 1
    });
  });

  return Array.from({ length: 7 }, (_, i) => {
    const data = byDayMap.get(i) || { revenue: 0, count: 0 };
    return {
      dayOfWeek: i,
      dayName: dayNames[i],
      ...data
    };
  });
}

// ============================================================================
// BUSINESS METRICS
// ============================================================================

export async function getAverageTransactionValue(startDate?: string, endDate?: string): Promise<number> {
  let query = db.select().from(revenueRecords);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    ) as any;
  } else {
    query = query.where(eq(revenueRecords.paymentStatus, 'paid')) as any;
  }

  const records = await query;

  if (records.length === 0) return 0;

  const total = records.reduce((sum, r) => sum + parseFloat(r.totalAmount), 0);
  return total / records.length;
}

export async function getRevenuePerCustomer(startDate?: string, endDate?: string): Promise<Array<{
  customerId: string | null;
  customerName: string;
  revenue: number;
  visitCount: number;
  averagePerVisit: number;
}>> {
  let query = db.select().from(revenueRecords);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    ) as any;
  } else {
    query = query.where(eq(revenueRecords.paymentStatus, 'paid')) as any;
  }

  const records = await query;

  const byCustomerMap = new Map<string, { customerId: string | null; revenue: number; visitCount: number }>();

  records.forEach(r => {
    const key = r.customerId || 'unknown';
    const revenue = parseFloat(r.totalAmount);

    const existing = byCustomerMap.get(key) || { customerId: r.customerId, revenue: 0, visitCount: 0 };
    byCustomerMap.set(key, {
      customerId: r.customerId,
      revenue: existing.revenue + revenue,
      visitCount: existing.visitCount + 1
    });
  });

  return Array.from(byCustomerMap.entries())
    .map(([key, data]) => ({
      ...data,
      customerName: key === 'unknown' ? 'Unknown Customer' : `Customer ${key}`,
      averagePerVisit: data.visitCount > 0 ? data.revenue / data.visitCount : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export async function getTopServices(limit: number = 10, startDate?: string, endDate?: string): Promise<Array<{
  serviceName: string;
  revenue: number;
  count: number;
}>> {
  const serviceData = await getRevenueByService(startDate, endDate);
  return serviceData.slice(0, limit);
}

export async function getTopCustomers(limit: number = 10, startDate?: string, endDate?: string): Promise<Array<{
  customerId: string | null;
  customerName: string;
  revenue: number;
  visitCount: number;
  averagePerVisit: number;
}>> {
  const customerData = await getRevenuePerCustomer(startDate, endDate);
  return customerData.slice(0, limit);
}

// ============================================================================
// FORECASTING
// ============================================================================

export async function predictNextMonthRevenue(): Promise<{
  predicted: number;
  historicalAverage: number;
  trend: 'up' | 'down' | 'stable';
  confidence: 'high' | 'medium' | 'low';
}> {
  // Get last 12 months of data
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const startDate = getDateString(oneYearAgo);
  const endDate = getTodayString();

  const monthlyData = await getRevenueByMonth(now.getFullYear());
  const lastYearData = await getRevenueByMonth(now.getFullYear() - 1);

  // Combine data
  const allMonthlyRevenue = [...lastYearData, ...monthlyData].filter(m => m.revenue > 0);

  if (allMonthlyRevenue.length === 0) {
    return {
      predicted: 0,
      historicalAverage: 0,
      trend: 'stable',
      confidence: 'low'
    };
  }

  // Calculate historical average
  const historicalAverage = allMonthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / allMonthlyRevenue.length;

  // Simple linear regression for trend
  const recentMonths = allMonthlyRevenue.slice(-6); // Last 6 months
  if (recentMonths.length < 3) {
    return {
      predicted: historicalAverage,
      historicalAverage,
      trend: 'stable',
      confidence: 'low'
    };
  }

  const avgRecent = recentMonths.reduce((sum, m) => sum + m.revenue, 0) / recentMonths.length;
  const trend = avgRecent > historicalAverage * 1.1 ? 'up' : avgRecent < historicalAverage * 0.9 ? 'down' : 'stable';

  // Predicted is weighted average of recent and historical
  const predicted = (avgRecent * 0.7) + (historicalAverage * 0.3);

  const confidence = allMonthlyRevenue.length >= 12 ? 'high' : allMonthlyRevenue.length >= 6 ? 'medium' : 'low';

  return {
    predicted,
    historicalAverage,
    trend,
    confidence
  };
}
