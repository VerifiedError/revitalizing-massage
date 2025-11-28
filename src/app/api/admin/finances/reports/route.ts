import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getProfitLoss,
  getMonthlyProfitLoss,
  getQuarterlyProfitLoss,
  getAnnualProfitLoss,
  getCurrentMonthProfitLoss,
  getExpensesByCategory,
  getProfitTrends
} from '@/lib/financial-analytics';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'month'; // month, quarter, year, custom
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const quarter = searchParams.get('quarter');

    let profitLoss;
    let trends;
    let expenseBreakdown;

    if (type === 'custom' && startDate && endDate) {
      profitLoss = await getProfitLoss(startDate, endDate);
      trends = await getProfitTrends(startDate, endDate);
      expenseBreakdown = await getExpensesByCategory(startDate, endDate);
    } else if (type === 'month') {
      const y = year ? parseInt(year) : new Date().getFullYear();
      const m = month ? parseInt(month) : new Date().getMonth() + 1;
      profitLoss = await getMonthlyProfitLoss(y, m);

      // Get trends for the month
      const startOfMonth = `${y}-${String(m).padStart(2, '0')}-01`;
      const lastDay = new Date(y, m, 0).getDate();
      const endOfMonth = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      trends = await getProfitTrends(startOfMonth, endOfMonth);
      expenseBreakdown = await getExpensesByCategory(startOfMonth, endOfMonth);
    } else if (type === 'quarter' && year && quarter) {
      const y = parseInt(year);
      const q = parseInt(quarter);
      profitLoss = await getQuarterlyProfitLoss(y, q);

      // Get trends for the quarter
      const quarterMonths = {
        1: [1, 3],
        2: [4, 6],
        3: [7, 9],
        4: [10, 12]
      };
      const [startMonth, endMonth] = quarterMonths[q as keyof typeof quarterMonths];
      const startOfQuarter = `${y}-${String(startMonth).padStart(2, '0')}-01`;
      const lastDay = new Date(y, endMonth + 1, 0).getDate();
      const endOfQuarter = `${y}-${String(endMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      trends = await getProfitTrends(startOfQuarter, endOfQuarter);
      expenseBreakdown = await getExpensesByCategory(startOfQuarter, endOfQuarter);
    } else if (type === 'year') {
      const y = year ? parseInt(year) : new Date().getFullYear();
      profitLoss = await getAnnualProfitLoss(y);

      // Get trends for the year
      const startOfYear = `${y}-01-01`;
      const endOfYear = `${y}-12-31`;
      trends = await getProfitTrends(startOfYear, endOfYear);
      expenseBreakdown = await getExpensesByCategory(startOfYear, endOfYear);
    } else {
      profitLoss = await getCurrentMonthProfitLoss();

      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth() + 1;
      const startOfMonth = `${y}-${String(m).padStart(2, '0')}-01`;
      const today = now.toISOString().split('T')[0];
      trends = await getProfitTrends(startOfMonth, today);
      expenseBreakdown = await getExpensesByCategory(startOfMonth, today);
    }

    return NextResponse.json({
      profitLoss,
      trends,
      expenseBreakdown
    });
  } catch (error) {
    console.error('Failed to generate financial report:', error);
    return NextResponse.json({ error: 'Failed to generate financial report' }, { status: 500 });
  }
}
