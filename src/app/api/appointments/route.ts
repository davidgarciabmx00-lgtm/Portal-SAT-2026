import { NextRequest, NextResponse } from 'next/server';
import { calendar, isAuthorized, refreshTokensIfNeeded } from '@/lib/google-calendar';
import { tempAppointments } from './events/temp-storage';
import nodemailer from 'nodemailer';

interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  description: string;
  dateTime: string; // ISO string
}

export async function POST(request: NextRequest) {
  try {
    console.log('Received appointment request');
    const body: AppointmentData = await request.json();
    const { name, email, phone, description, dateTime } = body;

    console.log('Appointment data:', { name, email, phone, description, dateTime });

    if (!name || !email || !phone || !description || !dateTime) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const startDate = new Date(dateTime);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // 1 hour appointment

    console.log('Creating event with dates:', { startDate: startDate.toISOString(), endDate: endDate.toISOString() });

    // Create event in Google Calendar
    const event = {
      summary: `Cita Técnica - ${name}`,
      description: `Cliente: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nDescripción: ${description}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Mexico_City', // Adjust timezone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Mexico_City',
      },
      // Note: Attendees removed to avoid Domain-Wide Delegation requirement
      // attendees: [{ email }],
    };

    console.log('Inserting event into Google Calendar...');
    if (isAuthorized()) {
      try {
        await refreshTokensIfNeeded();
        const eventResponse = await calendar.events.insert({
          calendarId: 'admin@alfredsmart.com',
          requestBody: event,
        });
        console.log('Event created successfully:', eventResponse.data.id);

        // Also store temporarily for immediate display
        tempAppointments.push({
          id: eventResponse.data.id,
          summary: event.summary,
          description: event.description,
          start: event.start,
          end: event.end,
        });
      } catch (calendarError) {
        console.error('Google Calendar API Error:', calendarError);
        console.log('Continuing without calendar integration - appointment will be stored locally only');

        // Store locally even if calendar fails
        const localId = `local-${Date.now()}`;
        tempAppointments.push({
          id: localId,
          summary: event.summary,
          description: event.description,
          start: event.start,
          end: event.end,
        });
      }
    } else {
      console.log('Not authorized for Google Calendar - storing locally only');
      const localId = `local-${Date.now()}`;
      tempAppointments.push({
        id: localId,
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
      });
    }

    // Send confirmation email (placeholder)
    console.log('Sending confirmation email to:', email);
    // const transporter = nodemailer.createTransporter({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: 'Confirmación de Cita Técnica',
    //   text: `Hola ${name},\n\nTu cita ha sido agendada para ${startDate.toLocaleString('es-MX')}.\n\nDescripción: ${description}\n\nGracias.`,
    // };

    // await transporter.sendMail(mailOptions);

    const eventId = tempAppointments[tempAppointments.length - 1]?.id || `appointment-${Date.now()}`;
    return NextResponse.json({ success: true, eventId });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}