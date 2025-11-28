'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import styles from './CalendarView.module.css';

interface Appointment {
  id: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  addons: string[];
  addonsTotal: number;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  createdAt: string;
  createdBy: 'customer' | 'admin';
}

interface CalendarViewProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

type CalendarMode = 'month' | 'week';

const statusColors: Record<Appointment['status'], string> = {
  scheduled: '#3b82f6',
  confirmed: '#10b981',
  completed: '#6b7280',
  cancelled: '#ef4444',
  'no-show': '#f59e0b',
};

export default function CalendarView({ appointments, onAppointmentClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mode, setMode] = useState<CalendarMode>('month');

  // Navigation functions
  const goToPrevious = () => {
    if (mode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const goToNext = () => {
    if (mode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  // Month view helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Add previous month's days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push(day);
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  // Week view helpers
  const getWeekDays = (date: Date): Date[] => {
    const day = date.getDay();
    const diff = date.getDate() - day; // Start of week (Sunday)
    const weekStart = new Date(date);
    weekStart.setDate(diff);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
  ];

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatWeekRange = (date: Date): string => {
    const weekDays = getWeekDays(date);
    const start = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <div className={styles.calendarView}>
      {/* Calendar Header */}
      <div className={styles.calendarHeader}>
        <div className={styles.calendarNav}>
          <button onClick={goToPrevious} className={styles.navBtn} title="Previous">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goToToday} className={styles.todayBtn}>
            Today
          </button>
          <button onClick={goToNext} className={styles.navBtn} title="Next">
            <ChevronRight size={20} />
          </button>
          <h2 className={styles.calendarTitle}>
            {mode === 'month' ? formatMonthYear(currentDate) : formatWeekRange(currentDate)}
          </h2>
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${mode === 'month' ? styles.active : ''}`}
            onClick={() => setMode('month')}
          >
            Month
          </button>
          <button
            className={`${styles.toggleBtn} ${mode === 'week' ? styles.active : ''}`}
            onClick={() => setMode('week')}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Body */}
      {mode === 'month' ? (
        <div className={styles.monthView}>
          {/* Day headers */}
          <div className={styles.dayHeaders}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={styles.dayHeader}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className={styles.monthGrid}>
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayAppointments = getAppointmentsForDate(date);
              const isTodayDate = isToday(date);
              const isCurrentMonthDate = isCurrentMonth(date);

              return (
                <div
                  key={index}
                  className={`${styles.dayCell} ${!isCurrentMonthDate ? styles.otherMonth : ''} ${isTodayDate ? styles.today : ''}`}
                >
                  <div className={styles.dayNumber}>{date.getDate()}</div>
                  <div className={styles.dayAppointments}>
                    {dayAppointments.slice(0, 3).map(apt => (
                      <div
                        key={apt.id}
                        className={styles.appointmentBadge}
                        style={{ backgroundColor: statusColors[apt.status] }}
                        onClick={() => onAppointmentClick(apt)}
                        title={`${apt.time} - ${apt.customerName} - ${apt.serviceName}`}
                      >
                        <span className={styles.aptTime}>{apt.time}</span>
                        <span className={styles.aptName}>{apt.customerName}</span>
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className={styles.moreAppointments}>
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.weekView}>
          {/* Time column header */}
          <div className={styles.weekGrid}>
            <div className={styles.timeColumn}>
              <div className={styles.timeColumnHeader}></div>
              {timeSlots.map(time => (
                <div key={time} className={styles.timeSlot}>
                  {time}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {getWeekDays(currentDate).map((date, dayIndex) => {
              const dayAppointments = getAppointmentsForDate(date);
              const isTodayDate = isToday(date);

              return (
                <div key={dayIndex} className={styles.dayColumn}>
                  <div className={`${styles.dayColumnHeader} ${isTodayDate ? styles.today : ''}`}>
                    <div className={styles.dayName}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={styles.dayDate}>{date.getDate()}</div>
                  </div>

                  <div className={styles.daySlotsContainer}>
                    {timeSlots.map(time => (
                      <div key={time} className={styles.daySlot}></div>
                    ))}

                    {/* Appointments overlay */}
                    {dayAppointments.map(apt => {
                      const timeIndex = timeSlots.indexOf(apt.time);
                      if (timeIndex === -1) return null;

                      return (
                        <div
                          key={apt.id}
                          className={styles.weekAppointment}
                          style={{
                            top: `${timeIndex * 60}px`,
                            height: `${(apt.duration / 30) * 30}px`,
                            backgroundColor: statusColors[apt.status],
                          }}
                          onClick={() => onAppointmentClick(apt)}
                        >
                          <div className={styles.weekAptTime}>
                            <Clock size={12} /> {apt.time}
                          </div>
                          <div className={styles.weekAptCustomer}>{apt.customerName}</div>
                          <div className={styles.weekAptService}>{apt.serviceName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
