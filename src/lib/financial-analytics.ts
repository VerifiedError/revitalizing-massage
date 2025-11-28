import { db } from '@/db';
import { expenses, revenueRecords } from '@/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getTodayString(): string {
  return getDateString(new Date());
}

function getStartOfMonthString(year?: number, month?: number): string {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth() + 1;
  return `${y}-${String(m).padStart(2, '0')}-01`;
}

function getEndOfMonthString(year?: number, month?: number): string {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth() + 1;
  const lastDay = new Date(y, m, 0).getDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}

// ============================================================================
// P&L CALCULATIONS
// ============================================================================

export interface ProfitLossStatement {
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
  profitMargin: number; // percentage
  comparison?: {
    previousRevenue: number;
    previousExpenses: number;
    previousProfit: number;
    revenueChange: number;
    expensesChange: number;
    profitChange: number;
  };
}

export async function getProfitLoss(startDate: string, endDate: string): Promise<ProfitLossStatement> {
  // Get revenue for period
  const revenueData = await db
    .select()
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  const serviceRevenue = revenueData.reduce((sum, r) => sum + parseFloat(r.servicePrice), 0);
  const addonsRevenue = revenueData.reduce((sum, r) => sum + parseFloat(r.addonsTotal), 0);
  const totalRevenue = revenueData.reduce((sum, r) => sum + parseFloat(r.totalAmount), 0);

  // Get expenses for period
  const expensesData = await db
    .select()
    .from(expenses)
    .where(
      and(
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    );

  const totalExpenses = expensesData.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  // Group expenses by category
  const categoryMap = new Map<string, number>();
  expensesData.forEach(e => {
    const current = categoryMap.get(e.category) || 0;
    categoryMap.set(e.category, current + parseFloat(e.amount));
  });

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return {
    startDate,
    endDate,
    revenue: {
      serviceRevenue,
      addonsRevenue,
      totalRevenue
    },
    expenses: {
      byCategory,
      totalExpenses
    },
    netProfit,
    profitMargin
  };
}

export async function getMonthlyProfitLoss(year: number, month: number): Promise<ProfitLossStatement> {
  const startDate = getStartOfMonthString(year, month);
  const endDate = getEndOfMonthString(year, month);

  const currentPL = await getProfitLoss(startDate, endDate);

  // Get previous month for comparison
  let prevYear = year;
  let prevMonth = month - 1;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = year - 1;
  }

  const prevStartDate = getStartOfMonthString(prevYear, prevMonth);
  const prevEndDate = getEndOfMonthString(prevYear, prevMonth);
  const previousPL = await getProfitLoss(prevStartDate, prevEndDate);

  // Add comparison
  currentPL.comparison = {
    previousRevenue: previousPL.revenue.totalRevenue,
    previousExpenses: previousPL.expenses.totalExpenses,
    previousProfit: previousPL.netProfit,
    revenueChange: previousPL.revenue.totalRevenue > 0
      ? ((currentPL.revenue.totalRevenue - previousPL.revenue.totalRevenue) / previousPL.revenue.totalRevenue) * 100
      : 0,
    expensesChange: previousPL.expenses.totalExpenses > 0
      ? ((currentPL.expenses.totalExpenses - previousPL.expenses.totalExpenses) / previousPL.expenses.totalExpenses) * 100
      : 0,
    profitChange: previousPL.netProfit !== 0
      ? ((currentPL.netProfit - previousPL.netProfit) / Math.abs(previousPL.netProfit)) * 100
      : 0
  };

  return currentPL;
}

export async function getQuarterlyProfitLoss(year: number, quarter: number): Promise<ProfitLossStatement> {
  const quarterMonths = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9],
    4: [10, 11, 12]
  };

  const months = quarterMonths[quarter as keyof typeof quarterMonths];
  const startDate = `${year}-${String(months[0]).padStart(2, '0')}-01`;
  const endDate = getEndOfMonthString(year, months[2]);

  return getProfitLoss(startDate, endDate);
}

export async function getAnnualProfitLoss(year: number): Promise<ProfitLossStatement> {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  return getProfitLoss(startDate, endDate);
}

export async function getCurrentMonthProfitLoss(): Promise<ProfitLossStatement> {
  const now = new Date();
  return getMonthlyProfitLoss(now.getFullYear(), now.getMonth() + 1);
}

// ============================================================================
// EXPENSE ANALYTICS
// ============================================================================

export async function getTotalExpenses(startDate: string, endDate: string): Promise<number> {
  const result = await db
    .select({ total: sql<string>`sum(${expenses.amount})` })
    .from(expenses)
    .where(
      and(
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    );

  return parseFloat(result[0]?.total || '0');
}

export async function getExpensesByCategory(startDate: string, endDate: string): Promise<Array<{
  category: string;
  amount: number;
  count: number;
  percentage: number;
}>> {
  const expensesData = await db
    .select()
    .from(expenses)
    .where(
      and(
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    );

  const total = expensesData.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const categoryMap = new Map<string, { amount: number; count: number }>();

  expensesData.forEach(e => {
    const current = categoryMap.get(e.category) || { amount: 0, count: 0 };
    categoryMap.set(e.category, {
      amount: current.amount + parseFloat(e.amount),
      count: current.count + 1
    });
  });

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      ...data,
      percentage: total > 0 ? (data.amount / total) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);
}

export async function getExpensesByMonth(year: number): Promise<Array<{
  month: number;
  monthName: string;
  amount: number;
  count: number;
}>> {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const expensesData = await db
    .select()
    .from(expenses)
    .where(
      and(
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    );

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthMap = new Map<number, { amount: number; count: number }>();

  expensesData.forEach(e => {
    const month = parseInt(e.date.split('-')[1], 10);
    const current = monthMap.get(month) || { amount: 0, count: 0 };
    monthMap.set(month, {
      amount: current.amount + parseFloat(e.amount),
      count: current.count + 1
    });
  });

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const data = monthMap.get(month) || { amount: 0, count: 0 };
    return {
      month,
      monthName: monthNames[i],
      ...data
    };
  });
}

export async function getExpensesBySubcategory(category: string, startDate: string, endDate: string): Promise<Array<{
  subcategory: string;
  amount: number;
  count: number;
}>> {
  const expensesData = await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.category, category),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    );

  const subcategoryMap = new Map<string, { amount: number; count: number }>();

  expensesData.forEach(e => {
    const sub = e.subcategory || 'Other';
    const current = subcategoryMap.get(sub) || { amount: 0, count: 0 };
    subcategoryMap.set(sub, {
      amount: current.amount + parseFloat(e.amount),
      count: current.count + 1
    });
  });

  return Array.from(subcategoryMap.entries())
    .map(([subcategory, data]) => ({ subcategory, ...data }))
    .sort((a, b) => b.amount - a.amount);
}

export async function getTopVendors(limit: number = 10, startDate?: string, endDate?: string): Promise<Array<{
  vendor: string;
  amount: number;
  count: number;
}>> {
  let query = db.select().from(expenses);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    ) as any;
  }

  const expensesData = await query;

  const vendorMap = new Map<string, { amount: number; count: number }>();

  expensesData.forEach(e => {
    const vendor = e.vendor || 'Unknown';
    const current = vendorMap.get(vendor) || { amount: 0, count: 0 };
    vendorMap.set(vendor, {
      amount: current.amount + parseFloat(e.amount),
      count: current.count + 1
    });
  });

  return Array.from(vendorMap.entries())
    .map(([vendor, data]) => ({ vendor, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export async function getTaxDeductibleExpenses(year: number): Promise<number> {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const result = await db
    .select({ total: sql<string>`sum(${expenses.amount})` })
    .from(expenses)
    .where(
      and(
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
        eq(expenses.taxDeductible, true)
      )
    );

  return parseFloat(result[0]?.total || '0');
}

// ============================================================================
// TREND ANALYSIS
// ============================================================================

export async function getExpenseTrends(startDate: string, endDate: string): Promise<Array<{
  date: string;
  amount: number;
  count: number;
}>> {
  const expensesData = await db
    .select()
    .from(expenses)
    .where(
      and(
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    )
    .orderBy(expenses.date);

  const dateMap = new Map<string, { amount: number; count: number }>();

  expensesData.forEach(e => {
    const current = dateMap.get(e.date) || { amount: 0, count: 0 };
    dateMap.set(e.date, {
      amount: current.amount + parseFloat(e.amount),
      count: current.count + 1
    });
  });

  return Array.from(dateMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getProfitTrends(startDate: string, endDate: string): Promise<Array<{
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}>> {
  // Get revenue by day
  const revenueData = await db
    .select()
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.date, startDate),
        lte(revenueRecords.date, endDate),
        eq(revenueRecords.paymentStatus, 'paid')
      )
    );

  const revenueMap = new Map<string, number>();
  revenueData.forEach(r => {
    const current = revenueMap.get(r.date) || 0;
    revenueMap.set(r.date, current + parseFloat(r.totalAmount));
  });

  // Get expenses by day
  const expensesData = await db
    .select()
    .from(expenses)
    .where(
      and(
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    );

  const expensesMap = new Map<string, number>();
  expensesData.forEach(e => {
    const current = expensesMap.get(e.date) || 0;
    expensesMap.set(e.date, current + parseFloat(e.amount));
  });

  // Combine all dates
  const allDates = new Set([...revenueMap.keys(), ...expensesMap.keys()]);

  return Array.from(allDates)
    .map(date => {
      const revenue = revenueMap.get(date) || 0;
      const expensesAmount = expensesMap.get(date) || 0;
      return {
        date,
        revenue,
        expenses: expensesAmount,
        profit: revenue - expensesAmount
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getMonthOverMonthExpenses(): Promise<{
  thisMonth: number;
  lastMonth: number;
  percentChange: number;
}> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let lastYear = currentYear;
  let lastMonth = currentMonth - 1;
  if (lastMonth === 0) {
    lastMonth = 12;
    lastYear = currentYear - 1;
  }

  const thisMonthStart = getStartOfMonthString(currentYear, currentMonth);
  const thisMonthEnd = getTodayString(); // Only up to today
  const lastMonthStart = getStartOfMonthString(lastYear, lastMonth);
  const lastMonthEnd = getEndOfMonthString(lastYear, lastMonth);

  const thisMonth = await getTotalExpenses(thisMonthStart, thisMonthEnd);
  const lastMonthTotal = await getTotalExpenses(lastMonthStart, lastMonthEnd);

  const percentChange = lastMonthTotal > 0
    ? ((thisMonth - lastMonthTotal) / lastMonthTotal) * 100
    : 0;

  return {
    thisMonth,
    lastMonth: lastMonthTotal,
    percentChange
  };
}

export async function getYearOverYearExpenses(): Promise<{
  thisYear: number;
  lastYear: number;
  percentChange: number;
}> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const lastYear = currentYear - 1;

  const thisYearStart = `${currentYear}-01-01`;
  const thisYearEnd = getTodayString(); // Only up to today
  const lastYearStart = `${lastYear}-01-01`;
  const lastYearEnd = `${lastYear}-12-31`;

  const thisYearTotal = await getTotalExpenses(thisYearStart, thisYearEnd);
  const lastYearTotal = await getTotalExpenses(lastYearStart, lastYearEnd);

  const percentChange = lastYearTotal > 0
    ? ((thisYearTotal - lastYearTotal) / lastYearTotal) * 100
    : 0;

  return {
    thisYear: thisYearTotal,
    lastYear: lastYearTotal,
    percentChange
  };
}

// ============================================================================
// DASHBOARD STATS (for admin dashboard widgets)
// ============================================================================

export async function getCurrentMonthFinancialStats(): Promise<{
  monthRevenue: number;
  monthExpenses: number;
  monthProfit: number;
  profitMargin: number;
  taxDeductibleYTD: number;
}> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const monthStart = getStartOfMonthString(year, month);
  const today = getTodayString();

  // Get current month P&L
  const pl = await getProfitLoss(monthStart, today);

  // Get YTD tax deductible
  const taxDeductibleYTD = await getTaxDeductibleExpenses(year);

  return {
    monthRevenue: pl.revenue.totalRevenue,
    monthExpenses: pl.expenses.totalExpenses,
    monthProfit: pl.netProfit,
    profitMargin: pl.profitMargin,
    taxDeductibleYTD
  };
}
