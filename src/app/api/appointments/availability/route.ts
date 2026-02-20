import { NextRequest, NextResponse } from 'next/server';
import { calendar, isAuthorized, refreshTokensIfNeeded } from '@/lib/google-calendar';
import { tempAppointments } from '../events/temp-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json({ error: 'Start and end dates required' }, { status: 400 });
    }

    // Get busy times from Google Calendar
    let busyTimes: any[] = [];
    if (isAuthorized()) {
      try {
        await refreshTokensIfNeeded();
        const freebusyResponse = await calendar.freebusy.query({
          requestBody: {
            timeMin: new Date(start).toISOString(),
            timeMax: new Date(end).toISOString(),
            items: [{ id: 'admin@alfredsmart.com' }],
          },
        });
        busyTimes = freebusyResponse.data.calendars?.['admin@alfredsmart.com']?.busy || [];
      } catch (calendarError) {
        console.error('Google Calendar API Error for availability:', calendarError);
        console.log('Using empty busy times (no calendar integration)');
        busyTimes = [];
      }
    } else {
      console.log('Not authorized for Google Calendar - using local appointments only');
      busyTimes = [];
    }

    // Add local appointments as busy times
    const localBusyTimes = tempAppointments.map(appointment => ({
      start: appointment.start.dateTime,
      end: appointment.end.dateTime,
    }));
    busyTimes = [...busyTimes, ...localBusyTimes];

    // Schedule:
    // Mon-Thu: 9:00-17:00 (lunch block 14:00-15:00)
    // Fri: 9:00-14:00
    const availableSlots: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      // Determine end hour: Friday ends at 14, Mon-Thu ends at 18
      const dayEndHour = dayOfWeek === 5 ? 14 : 18;

      for (let hour = 9; hour < dayEndHour; hour++) {
        // Mon-Thu: skip lunch break 14:00-15:00
        if (dayOfWeek >= 1 && dayOfWeek <= 4 && hour === 14) continue;

        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        // Check if slot is free in Google Calendar
        const isBusy = busyTimes.some((busy: any) => {
          const busyStart = new Date(busy.start);
          const busyEnd = new Date(busy.end);
          return slotStart < busyEnd && slotEnd > busyStart;
        });

        if (!isBusy) {
          availableSlots.push(slotStart.toISOString());
        }
      }
    }

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}