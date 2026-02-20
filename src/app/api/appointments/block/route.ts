import { NextRequest, NextResponse } from 'next/server';
import { calendar } from '@/lib/google-calendar';

const CALENDAR_ID =
  'admin@alfredsmart.com';

/**
 * POST  – Block a time slot (creates a "BLOQUEADO" event)
 * Body: { dateTime: string (ISO), reason?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dateTime, reason } = body;

    if (!dateTime) {
      return NextResponse.json({ error: 'dateTime is required' }, { status: 400 });
    }

    const startDate = new Date(dateTime);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const event = {
      summary: 'BLOQUEADO',
      description: reason || 'Franja bloqueada por el administrador',
      start: { dateTime: startDate.toISOString(), timeZone: 'Europe/Madrid' },
      end: { dateTime: endDate.toISOString(), timeZone: 'Europe/Madrid' },
      colorId: '11', // red
    };

    const res = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    return NextResponse.json({ success: true, eventId: res.data.id });
  } catch (error) {
    console.error('Error blocking slot:', error);
    return NextResponse.json({ error: 'Failed to block slot' }, { status: 500 });
  }
}

/**
 * DELETE – Unblock a time slot (removes the event by id)
 * Body: { eventId: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }

    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unblocking slot:', error);
    return NextResponse.json({ error: 'Failed to unblock slot' }, { status: 500 });
  }
}

/**
 * GET – List blocked slots within a date range
 * Query: ?start=ISO&end=ISO
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json({ error: 'start and end are required' }, { status: 400 });
    }

    const res = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date(start).toISOString(),
      timeMax: new Date(end).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      q: 'BLOQUEADO',
    });

    const blocked = (res.data.items || []).map((ev) => ({
      eventId: ev.id,
      start: ev.start?.dateTime,
      end: ev.end?.dateTime,
      reason: ev.description || '',
    }));

    return NextResponse.json({ blocked });
  } catch (error) {
    console.error('Error listing blocked slots:', error);
    return NextResponse.json({ error: 'Failed to list blocked slots' }, { status: 500 });
  }
}
