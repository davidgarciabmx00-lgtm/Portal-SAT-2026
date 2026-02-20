import { NextRequest, NextResponse } from 'next/server';
import { calendar } from '@/lib/google-calendar';

interface ManualEventData {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  technicianName?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ManualEventData = await request.json();
    const { title, description, startDateTime, endDateTime, technicianName, clientName, clientEmail, clientPhone } = body;

    if (!title || !startDateTime || !endDateTime) {
      return NextResponse.json({ error: 'Title, start and end date/time are required' }, { status: 400 });
    }

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    // Build description
    let fullDescription = description || '';
    if (technicianName) fullDescription += `\nTécnico: ${technicianName}`;
    if (clientName) fullDescription += `\nCliente: ${clientName}`;
    if (clientEmail) fullDescription += `\nEmail: ${clientEmail}`;
    if (clientPhone) fullDescription += `\nTeléfono: ${clientPhone}`;

    // Create event in Google Calendar
    const event = {
      summary: title,
      description: fullDescription.trim(),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Mexico_City',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Mexico_City',
      },
      // Note: Attendees removed to avoid Domain-Wide Delegation requirement
      // attendees: clientEmail ? [{ email: clientEmail }] : [],
    };

    console.log('Creating manual event:', event);

    const eventResponse = await calendar.events.insert({
      calendarId: 'admin@alfredsmart.com',
      requestBody: event,
    });

    console.log('Manual event created:', eventResponse.data.id);

    return NextResponse.json({
      success: true,
      eventId: eventResponse.data.id,
      event: eventResponse.data
    });
  } catch (error) {
    console.error('Error creating manual event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}