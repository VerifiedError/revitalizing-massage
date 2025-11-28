import { db } from '@/db';
import { appointments } from '@/db/schema';
import { eq, and, gte, lte, sql, count } from 'drizzle-orm';

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

function getPreviousPeriodDates(startDate: string, endDate: string): { start: string; end: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - diffDays);

  return {
    start: getDateString(prevStart),
    end: getDateString(prevEnd)
  };
}

// ============================================================================
// COMPLETION & PERFORMANCE METRICS
// ============================================================================

export async function getCompletionRate(startDate?: string, endDate?: string): Promise<{
  total: number;
  completed: number;
  rate: number;
}> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;
  const total = allAppointments.length;
  const completed = allAppointments.filter(a => a.status === 'completed').length;
  const rate = total > 0 ? (completed / total) * 100 : 0;

  return { total, completed, rate };
}

export async function getNoShowRate(startDate?: string, endDate?: string): Promise<{
  total: number;
  noShows: number;
  rate: number;
}> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;
  const total = allAppointments.length;
  const noShows = allAppointments.filter(a => a.status === 'no-show').length;
  const rate = total > 0 ? (noShows / total) * 100 : 0;

  return { total, noShows, rate };
}

export async function getCancellationRate(startDate?: string, endDate?: string): Promise<{
  total: number;
  cancelled: number;
  rate: number;
}> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;
  const total = allAppointments.length;
  const cancelled = allAppointments.filter(a => a.status === 'cancelled').length;
  const rate = total > 0 ? (cancelled / total) * 100 : 0;

  return { total, cancelled, rate };
}

export async function getConfirmationRate(startDate?: string, endDate?: string): Promise<{
  scheduled: number;
  confirmed: number;
  rate: number;
}> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;
  const scheduled = allAppointments.filter(a => a.status === 'scheduled').length;
  const confirmed = allAppointments.filter(a => a.status === 'confirmed' || a.status === 'completed').length;
  const total = scheduled + confirmed;
  const rate = total > 0 ? (confirmed / total) * 100 : 0;

  return { scheduled, confirmed, rate };
}

// ============================================================================
// APPOINTMENT COUNTS
// ============================================================================

export async function getTodayAppointments(): Promise<{
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}> {
  const today = getTodayString();

  const todayAppts = await db
    .select()
    .from(appointments)
    .where(eq(appointments.date, today));

  return {
    total: todayAppts.length,
    scheduled: todayAppts.filter(a => a.status === 'scheduled').length,
    confirmed: todayAppts.filter(a => a.status === 'confirmed').length,
    completed: todayAppts.filter(a => a.status === 'completed').length,
    cancelled: todayAppts.filter(a => a.status === 'cancelled').length,
    noShow: todayAppts.filter(a => a.status === 'no-show').length,
  };
}

export async function getWeekAppointments(): Promise<{
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}> {
  const startOfWeek = getStartOfWeekString();
  const today = getTodayString();

  const weekAppts = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.date, startOfWeek),
        lte(appointments.date, today)
      )
    );

  return {
    total: weekAppts.length,
    scheduled: weekAppts.filter(a => a.status === 'scheduled').length,
    confirmed: weekAppts.filter(a => a.status === 'confirmed').length,
    completed: weekAppts.filter(a => a.status === 'completed').length,
    cancelled: weekAppts.filter(a => a.status === 'cancelled').length,
    noShow: weekAppts.filter(a => a.status === 'no-show').length,
  };
}

export async function getMonthAppointments(): Promise<{
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}> {
  const startOfMonth = getStartOfMonthString();
  const today = getTodayString();

  const monthAppts = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.date, startOfMonth),
        lte(appointments.date, today)
      )
    );

  return {
    total: monthAppts.length,
    scheduled: monthAppts.filter(a => a.status === 'scheduled').length,
    confirmed: monthAppts.filter(a => a.status === 'confirmed').length,
    completed: monthAppts.filter(a => a.status === 'completed').length,
    cancelled: monthAppts.filter(a => a.status === 'cancelled').length,
    noShow: monthAppts.filter(a => a.status === 'no-show').length,
  };
}

export async function getYearAppointments(): Promise<{
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}> {
  const startOfYear = getStartOfYearString();
  const today = getTodayString();

  const yearAppts = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.date, startOfYear),
        lte(appointments.date, today)
      )
    );

  return {
    total: yearAppts.length,
    scheduled: yearAppts.filter(a => a.status === 'scheduled').length,
    confirmed: yearAppts.filter(a => a.status === 'confirmed').length,
    completed: yearAppts.filter(a => a.status === 'completed').length,
    cancelled: yearAppts.filter(a => a.status === 'cancelled').length,
    noShow: yearAppts.filter(a => a.status === 'no-show').length,
  };
}

// ============================================================================
// DISTRIBUTION ANALYSIS
// ============================================================================

export async function getAppointmentsByService(startDate?: string, endDate?: string): Promise<Array<{
  serviceName: string;
  count: number;
  percentage: number;
}>> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;
  const total = allAppointments.length;

  const byServiceMap = new Map<string, number>();
  allAppointments.forEach(a => {
    const count = byServiceMap.get(a.serviceName) || 0;
    byServiceMap.set(a.serviceName, count + 1);
  });

  return Array.from(byServiceMap.entries())
    .map(([serviceName, count]) => ({
      serviceName,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getAppointmentsByDayOfWeek(startDate?: string, endDate?: string): Promise<Array<{
  dayOfWeek: number;
  dayName: string;
  count: number;
}>> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const byDayMap = new Map<number, number>();

  allAppointments.forEach(a => {
    const date = new Date(a.date);
    const dayOfWeek = date.getDay();
    const count = byDayMap.get(dayOfWeek) || 0;
    byDayMap.set(dayOfWeek, count + 1);
  });

  return Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    dayName: dayNames[i],
    count: byDayMap.get(i) || 0
  }));
}

export async function getAppointmentsByTimeOfDay(startDate?: string, endDate?: string): Promise<{
  morning: number;
  afternoon: number;
  evening: number;
}> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;
  let morning = 0;
  let afternoon = 0;
  let evening = 0;

  allAppointments.forEach(a => {
    const time = a.time.toLowerCase();
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('pm');
    const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);

    if (hour24 < 12) {
      morning++;
    } else if (hour24 < 17) {
      afternoon++;
    } else {
      evening++;
    }
  });

  return { morning, afternoon, evening };
}

export async function getAppointmentsByHour(startDate?: string, endDate?: string): Promise<Array<{
  hour: number;
  hourDisplay: string;
  count: number;
}>> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;
  const byHourMap = new Map<number, number>();

  allAppointments.forEach(a => {
    const time = a.time.toLowerCase();
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('pm');
    const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);

    const count = byHourMap.get(hour24) || 0;
    byHourMap.set(hour24, count + 1);
  });

  // Create array for business hours (9 AM - 6 PM)
  return Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9; // Start at 9 AM
    const hour12 = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return {
      hour,
      hourDisplay: `${hour12}:00 ${ampm}`,
      count: byHourMap.get(hour) || 0
    };
  });
}

export async function getAppointmentsByStatus(startDate?: string, endDate?: string): Promise<Array<{
  status: string;
  count: number;
  percentage: number;
}>> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;
  const total = allAppointments.length;

  const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'];
  const byStatusMap = new Map<string, number>();

  allAppointments.forEach(a => {
    const count = byStatusMap.get(a.status) || 0;
    byStatusMap.set(a.status, count + 1);
  });

  return statuses.map(status => ({
    status,
    count: byStatusMap.get(status) || 0,
    percentage: total > 0 ? ((byStatusMap.get(status) || 0) / total) * 100 : 0
  }));
}

// ============================================================================
// TREND ANALYSIS
// ============================================================================

export async function getAppointmentTrends(startDate: string, endDate: string): Promise<Array<{
  date: string;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  total: number;
}>> {
  const allAppointments = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    )
    .orderBy(appointments.date);

  // Group by date
  const byDateMap = new Map<string, {
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
  }>();

  allAppointments.forEach(a => {
    const existing = byDateMap.get(a.date) || {
      scheduled: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0
    };

    if (a.status === 'scheduled') existing.scheduled++;
    else if (a.status === 'confirmed') existing.confirmed++;
    else if (a.status === 'completed') existing.completed++;
    else if (a.status === 'cancelled') existing.cancelled++;
    else if (a.status === 'no-show') existing.noShow++;

    byDateMap.set(a.date, existing);
  });

  return Array.from(byDateMap.entries())
    .map(([date, data]) => ({
      date,
      ...data,
      total: data.scheduled + data.confirmed + data.completed + data.cancelled + data.noShow
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getMonthOverMonthComparison(): Promise<{
  thisMonth: number;
  lastMonth: number;
  percentChange: number;
}> {
  const startOfThisMonth = getStartOfMonthString();
  const today = getTodayString();

  const thisMonthAppts = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.date, startOfThisMonth),
        lte(appointments.date, today)
      )
    );

  const thisMonth = thisMonthAppts.length;

  // Get last month dates
  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfLastMonth = getDateString(lastMonthDate);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const endOfLastMonthStr = getDateString(endOfLastMonth);

  const lastMonthAppts = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.date, startOfLastMonth),
        lte(appointments.date, endOfLastMonthStr)
      )
    );

  const lastMonth = lastMonthAppts.length;
  const percentChange = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  return { thisMonth, lastMonth, percentChange };
}

export async function getYearOverYearComparison(): Promise<{
  thisYear: number;
  lastYear: number;
  percentChange: number;
}> {
  const startOfThisYear = getStartOfYearString();
  const today = getTodayString();

  const thisYearAppts = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.date, startOfThisYear),
        lte(appointments.date, today)
      )
    );

  const thisYear = thisYearAppts.length;

  // Get last year dates
  const now = new Date();
  const lastYearStart = `${now.getFullYear() - 1}-01-01`;
  const lastYearEnd = `${now.getFullYear() - 1}-12-31`;

  const lastYearAppts = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.date, lastYearStart),
        lte(appointments.date, lastYearEnd)
      )
    );

  const lastYear = lastYearAppts.length;
  const percentChange = lastYear > 0 ? ((thisYear - lastYear) / lastYear) * 100 : 0;

  return { thisYear, lastYear, percentChange };
}

// ============================================================================
// UTILIZATION METRICS
// ============================================================================

export async function getUtilizationRate(startDate?: string, endDate?: string): Promise<{
  totalHours: number;
  bookedHours: number;
  utilizationRate: number;
}> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;

  // Calculate booked hours (assume average appointment is 1.25 hours)
  const bookedHours = allAppointments.length * 1.25;

  // Calculate total available hours (assume 9 AM - 6 PM, 5 days a week)
  const daysInPeriod = startDate && endDate
    ? Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 30; // default to 30 days if no period specified

  const workDays = Math.floor(daysInPeriod * (5 / 7)); // 5 day work week
  const hoursPerDay = 9; // 9 AM - 6 PM
  const totalHours = workDays * hoursPerDay;

  const utilizationRate = totalHours > 0 ? (bookedHours / totalHours) * 100 : 0;

  return { totalHours, bookedHours, utilizationRate };
}

export async function getAverageAppointmentsPerDay(startDate?: string, endDate?: string): Promise<number> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;

  const daysInPeriod = startDate && endDate
    ? Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 30;

  return allAppointments.length / daysInPeriod;
}

export async function getPeakBookingTimes(startDate?: string, endDate?: string): Promise<{
  peakDay: string;
  peakDayCount: number;
  peakHour: string;
  peakHourCount: number;
}> {
  const byDay = await getAppointmentsByDayOfWeek(startDate, endDate);
  const byHour = await getAppointmentsByHour(startDate, endDate);

  const peakDayData = byDay.reduce((max, day) => day.count > max.count ? day : max, byDay[0]);
  const peakHourData = byHour.reduce((max, hour) => hour.count > max.count ? hour : max, byHour[0]);

  return {
    peakDay: peakDayData?.dayName || 'N/A',
    peakDayCount: peakDayData?.count || 0,
    peakHour: peakHourData?.hourDisplay || 'N/A',
    peakHourCount: peakHourData?.count || 0
  };
}

// ============================================================================
// SERVICE METRICS
// ============================================================================

export async function getTopServices(limit: number = 10, startDate?: string, endDate?: string): Promise<Array<{
  serviceName: string;
  count: number;
  percentage: number;
}>> {
  const serviceData = await getAppointmentsByService(startDate, endDate);
  return serviceData.slice(0, limit);
}

export async function getAverageBookingLeadTime(startDate?: string, endDate?: string): Promise<number> {
  let query = db.select().from(appointments);

  if (startDate && endDate) {
    query = query.where(
      and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      )
    ) as any;
  }

  const allAppointments = await query;

  if (allAppointments.length === 0) return 0;

  const leadTimes = allAppointments.map(a => {
    const appointmentDate = new Date(a.date);
    const createdDate = new Date(a.createdAt);
    const diffTime = appointmentDate.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  });

  const avgLeadTime = leadTimes.reduce((sum, days) => sum + days, 0) / leadTimes.length;
  return avgLeadTime;
}
