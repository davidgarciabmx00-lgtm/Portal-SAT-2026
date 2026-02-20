import { NextRequest, NextResponse } from 'next/server';
import { calendar } from '@/lib/google-calendar';
import { tempAppointments } from './temp-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get('timeMin');
    const timeMax = searchParams.get('timeMax');

    // Try to get events from Google Calendar
    try {
      const eventsResponse = await calendar.events.list({
        calendarId: 'admin@alfredsmart.com',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = eventsResponse.data.items || [];
      return NextResponse.json({ events });
    } catch (calendarError) {
      console.warn('Google Calendar error, using temporary storage:', calendarError);
      // Fallback to temporary storage if Google Calendar fails
      return NextResponse.json({ events: tempAppointments });
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}