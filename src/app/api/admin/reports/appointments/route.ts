import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getAppointmentsByService,
  getAppointmentsByDayOfWeek,
  getAppointmentsByTimeOfDay,
  getAppointmentsByHour,
  getAppointmentsByStatus,
  getAppointmentTrends,
  getCompletionRate,
  getNoShowRate,
  getCancellationRate,
  getConfirmationRate,
  getUtilizationRate,
  getAverageAppointmentsPerDay,
  getPeakBookingTimes,
  getTopServices,
  getAverageBookingLeadTime,
  getMonthOverMonthComparison,
  getYearOverYearComparison
} from '@/lib/appointment-analytics';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'month';
    const customStartDate = searchParams.get('startDate');
    const customEndDate = searchParams.get('endDate');

    // Calculate date range based on type
    let startDate: string | undefined;
    let endDate: string | undefined;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch (type) {
      case 'today':
        startDate = todayStr;
        endDate = todayStr;
        break;

      case 'week':
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(today);
        monday.setDate(today.getDate() - diff);
        startDate = monday.toISOString().split('T')[0];
        endDate = todayStr;
        break;

      case 'month':
        startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        endDate = todayStr;
        break;

      case 'year':
        startDate = `${today.getFullYear()}-01-01`;
        endDate = todayStr;
        break;

      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = customStartDate;
          endDate = customEndDate;
        } else {
          return NextResponse.json(
            { error: 'Custom date range requires startDate and endDate' },
            { status: 400 }
          );
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    // Fetch all analytics data
    const [
      completionRate,
      noShowRate,
      cancellationRate,
      confirmationRate,
      byService,
      byDayOfWeek,
      byTimeOfDay,
      byHour,
      byStatus,
      trends,
      utilizationRate,
      avgAppointmentsPerDay,
      peakTimes,
      topServices,
      avgLeadTime,
      monthComparison,
      yearComparison
    ] = await Promise.all([
      getCompletionRate(startDate, endDate),
      getNoShowRate(startDate, endDate),
      getCancellationRate(startDate, endDate),
      getConfirmationRate(startDate, endDate),
      getAppointmentsByService(startDate, endDate),
      getAppointmentsByDayOfWeek(startDate, endDate),
      getAppointmentsByTimeOfDay(startDate, endDate),
      getAppointmentsByHour(startDate, endDate),
      getAppointmentsByStatus(startDate, endDate),
      getAppointmentTrends(startDate, endDate),
      getUtilizationRate(startDate, endDate),
      getAverageAppointmentsPerDay(startDate, endDate),
      getPeakBookingTimes(startDate, endDate),
      getTopServices(10, startDate, endDate),
      getAverageBookingLeadTime(startDate, endDate),
      getMonthOverMonthComparison(),
      getYearOverYearComparison()
    ]);

    // Return comprehensive analytics data
    return NextResponse.json({
      period: {
        type,
        startDate,
        endDate
      },
      metrics: {
        completionRate,
        noShowRate,
        cancellationRate,
        confirmationRate,
        utilizationRate,
        avgAppointmentsPerDay,
        avgLeadTime
      },
      distribution: {
        byService,
        byDayOfWeek,
        byTimeOfDay,
        byHour,
        byStatus
      },
      trends,
      peakTimes,
      topServices,
      comparisons: {
        monthOverMonth: monthComparison,
        yearOverYear: yearComparison
      }
    });
  } catch (error) {
    console.error('Error fetching appointment analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment analytics' },
      { status: 500 }
    );
  }
}
