import { prisma } from "../../shared/database/prisma";
import { queueJobs } from "../../shared/queue/queue";
import { startOfDay, endOfDay, isAfter } from "date-fns";

export class CalendarService {
  // Get events in date range
  async getEvents(userId: string, start: Date, end: Date, types?: string[]) {
    const events = await prisma.meeting.findMany({
      where: {
        scheduledAt: { gte: start, lte: end },
        // Add type filter if provided
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        job: { include: { company: true } },
      },
    });

    return events.map((e: any) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      date: e.scheduledAt,
      duration: e.durationMinutes,
      status: e.status,
      company: e.job?.company?.name,
    }));
  }

  // Create event (admin/recruiter only)
  async createEvent(userId: string, userRole: string, data: {
    title: string;
    type: string;
    scheduledAt: Date;
    durationMinutes: number;
    jobId?: string;
  }) {
    if (userRole === "student") throw { statusCode: 403, message: "Only recruiters and admins can create events" };

    const event = await prisma.meeting.create({
      data: {
        title: data.title,
        type: data.type as any,
        scheduledAt: data.scheduledAt,
        durationMinutes: data.durationMinutes,
        jobId: data.jobId,
        roomCode: `room_${Date.now()}`,
        status: "SCHEDULED",
      },
    });

    // Send notifications to eligible students
    await queueJobs.email({
      to: "students@example.com",
      subject: `New Event: ${data.title}`,
      html: `<p>A new event has been scheduled: ${data.title} on ${data.scheduledAt}</p>`,
    });

    return event;
  }

  // Update event
  async updateEvent(userId: string, eventId: string, data: any) {
    const event = await prisma.meeting.update({
      where: { id: eventId },
      data,
    });

    // Notify attendees of changes
    return event;
  }

  // Delete/Cancel event
  async deleteEvent(userId: string, eventId: string) {
    const event = await prisma.meeting.update({
      where: { id: eventId },
      data: { status: "CANCELLED" },
    });

    // Send cancellation notifications
    return event;
  }
}
