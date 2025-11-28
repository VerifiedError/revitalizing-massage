import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import * as analytics from '@/lib/revenue-analytics';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period'); // 'today', 'week', 'month', 'year', 'custom'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let stats: any = {};

    // Get revenue for requested period
    if (period === 'today') {
      const revenue = await analytics.getTodayRevenue();
      stats.revenue = revenue;
    } else if (period === 'week') {
      const revenue = await analytics.getWeekRevenue();
      stats.revenue = revenue;
    } else if (period === 'month') {
      const revenue = await analytics.getMonthRevenue();
      stats.revenue = revenue;
    } else if (period === 'year') {
      const revenue = await analytics.getYearRevenue();
      stats.revenue = revenue;
    } else if (period === 'custom' && startDate && endDate) {
      const data = await analytics.getRevenueBetweenDates(startDate, endDate);
      stats = {
        revenue: data.total,
        count: data.count,
        average: data.average,
        byDay: data.byDay,
      };
    } else {
      // Default: current month
      const revenue = await analytics.getMonthRevenue();
      stats.revenue = revenue;
    }

    // Get additional stats
    const [
      averageTransaction,
      byService,
      byPaymentMethod,
      byDayOfWeek,
      topServices,
      forecast
    ] = await Promise.all([
      analytics.getAverageTransactionValue(startDate || undefined, endDate || undefined),
      analytics.getRevenueByService(startDate || undefined, endDate || undefined),
      analytics.getRevenueByPaymentMethod(startDate || undefined, endDate || undefined),
      analytics.getRevenueByDayOfWeek(startDate || undefined, endDate || undefined),
      analytics.getTopServices(10, startDate || undefined, endDate || undefined),
      analytics.predictNextMonthRevenue()
    ]);

    return NextResponse.json({
      ...stats,
      averageTransaction,
      byService,
      byPaymentMethod,
      byDayOfWeek,
      topServices,
      forecast
    });
  } catch (error) {
    console.error('Failed to fetch revenue stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue stats' },
      { status: 500 }
    );
  }
}
