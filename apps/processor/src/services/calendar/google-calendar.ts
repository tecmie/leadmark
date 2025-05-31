import { google } from "googleapis";
import { supabase } from "../supabase/client";

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export interface AvailableTimeSlot {
  start: string;
  end: string;
}

export class GoogleCalendarService {
  private calendar: any;

  constructor(private accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    this.calendar = google.calendar({ version: "v3", auth });
  }

  /**
   * Check user's availability for a given date range
   */
  async getAvailableSlots(
    startDate: Date,
    endDate: Date,
    duration: number = 60, // in minutes
    timeZone: string = "UTC"
  ): Promise<AvailableTimeSlot[]> {
    try {
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          timeZone,
          items: [{ id: "primary" }],
        },
      });

      const busySlots = response.data.calendars?.primary?.busy || [];
      return this.calculateFreeSlots(
        startDate,
        endDate,
        busySlots,
        duration,
        timeZone
      );
    } catch (error) {
      console.error("Error checking calendar availability:", error);
      throw error;
    }
  }

  /**
   * Create a calendar event
   */
  async createEvent(event: CalendarEvent): Promise<string | undefined> {
    try {
      const response = await this.calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
        sendUpdates: "all",
      });

      return response.data.id;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      throw error;
    }
  }

  /**
   * Update an existing calendar event
   */
  async updateEvent(
    eventId: string,
    event: Partial<CalendarEvent>
  ): Promise<void> {
    try {
      await this.calendar.events.patch({
        calendarId: "primary",
        eventId,
        requestBody: event,
        sendUpdates: "all",
      });
    } catch (error) {
      console.error("Error updating calendar event:", error);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: "primary",
        eventId,
        sendUpdates: "all",
      });
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      throw error;
    }
  }

  /**
   * Calculate free time slots based on busy periods
   */
  private calculateFreeSlots(
    startDate: Date,
    endDate: Date,
    busySlots: Array<{ start: string; end: string }>,
    duration: number,
    timeZone: string
  ): AvailableTimeSlot[] {
    const freeSlots: AvailableTimeSlot[] = [];
    const workingHours = { start: 9, end: 17 }; // 9 AM to 5 PM

    // Sort busy slots by start time
    const sortedBusySlots = busySlots.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    let currentTime = new Date(startDate);

    // Set to start of working hours
    currentTime.setHours(workingHours.start, 0, 0, 0);

    for (const busySlot of sortedBusySlots) {
      const busyStart = new Date(busySlot.start);
      const busyEnd = new Date(busySlot.end);

      // Check if there's a free slot before this busy period
      if (currentTime < busyStart) {
        const slotEnd = new Date(
          Math.min(
            busyStart.getTime(),
            currentTime.getTime() + duration * 60000
          )
        );

        if (slotEnd.getTime() - currentTime.getTime() >= duration * 60000) {
          freeSlots.push({
            start: currentTime.toISOString(),
            end: slotEnd.toISOString(),
          });
        }
      }

      // Move current time to end of busy period
      currentTime = new Date(
        Math.max(currentTime.getTime(), busyEnd.getTime())
      );
    }

    // Check for free slot after last busy period
    const workingHoursEnd = new Date(currentTime);
    workingHoursEnd.setHours(workingHours.end, 0, 0, 0);

    if (currentTime < workingHoursEnd && currentTime < endDate) {
      const slotEnd = new Date(
        Math.min(workingHoursEnd.getTime(), endDate.getTime())
      );

      if (slotEnd.getTime() - currentTime.getTime() >= duration * 60000) {
        freeSlots.push({
          start: currentTime.toISOString(),
          end: slotEnd.toISOString(),
        });
      }
    }

    return freeSlots;
  }

  /**
   * Format available slots for AI consumption
   */
  formatAvailableSlots(slots: AvailableTimeSlot[]): string {
    if (slots.length === 0) {
      return "No available time slots found.";
    }

    return slots
      .map((slot, index) => {
        const start = new Date(slot.start);
        const end = new Date(slot.end);
        return `${index + 1}. ${start.toLocaleString()} - ${end.toLocaleString()}`;
      })
      .join("\n");
  }
}

/**
 * Factory function to create GoogleCalendarService instance
 */
export function createCalendarService(
  accessToken: string
): GoogleCalendarService {
  return new GoogleCalendarService(accessToken);
}

/**
 * Get user's calendar access token from database
 */
export async function getUserCalendarToken(
  userId: string
): Promise<string | null> {
  try {
    const { data: user, error } = await supabase
      .from("profiles")
      .select("google_calendar_token")
      .eq("id", userId)
      .single();

    if (error || !user?.google_calendar_token) {
      console.log(`No calendar token found for user ${userId}`);
      return null;
    }

    return user.google_calendar_token;
  } catch (error) {
    console.error("Error retrieving calendar token:", error);
    return null;
  }
}
