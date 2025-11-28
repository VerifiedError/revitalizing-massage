import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getTodayAppointments,
  getWeekAppointments,
  getMonthAppointments,
  getCompletionRate,
  getNoShowRate,
  getUtilizationRate
} from '@/lib/appointment-analytics';

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch quick stats for dashboard widgets
    const [
      today,
      week,
      month,
      completionRate,
      noShowRate,
      utilizationRate
    ] = await Promise.all([
      getTodayAppointments(),
      getWeekAppointments(),
      getMonthAppointments(),
      getCompletionRate(),
      getNoShowRate(),
      getUtilizationRate()
    ]);

    return NextResponse.json({
      today: today.total,
      todayDetails: today,
      week: week.total,
      weekDetails: week,
      month: month.total,
      monthDetails: month,
      completionRate: completionRate.rate,
      noShowRate: noShowRate.rate,
      utilizationRate: utilizationRate.utilizationRate
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment stats' },
      { status: 500 }
    );
  }
}
