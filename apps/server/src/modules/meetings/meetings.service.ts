import { prisma } from "../../shared/database/prisma";
import { env } from "../../config/env";
import axios from "axios";

export class MeetingsService {
  // Get upcoming meetings for user
  async getUpcoming(userId: string) {
    const now = new Date();
    const meetings = await prisma.meeting.findMany({
      where: {
        scheduledAt: { gte: now },
        status: { in: ["SCHEDULED", "LIVE"] },
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        job: {
          include: { company: true },
        },
      },
    });
    return meetings;
  }

  // Get meeting details
  async getById(meetingId: string) {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        job: {
          include: { company: true },
        },
      },
    });
    if (!meeting) throw { statusCode: 404, message: "Meeting not found" };
    return meeting;
  }

  // Join meeting - returns Daily.co token
  async joinMeeting(userId: string, meetingId: string) {
    const meeting = await this.getById(meetingId);

    // Check if within join window (15 min before to end)
    const now = new Date();
    const startTime = new Date(meeting.scheduledAt);
    const endTime = new Date(startTime.getTime() + meeting.durationMinutes * 60000);

    if (now < new Date(startTime.getTime() - 15 * 60000)) {
      throw { statusCode: 400, message: "Meeting hasn't started yet. Join 15 minutes before scheduled time." };
    }

    if (now > endTime) {
      throw { statusCode: 400, message: "Meeting has ended" };
    }

    // Generate Daily.co meeting token (mock for now)
    const roomUrl = env.DAILY_API_KEY
      ? await this.createDailyRoom(meeting.roomCode)
      : `https://place-me.daily.co/${meeting.roomCode}`;

    return {
      roomUrl,
      token: "mock_token",
      meeting: {
        id: meeting.id,
        title: meeting.title,
        scheduledAt: meeting.scheduledAt,
        duration: meeting.durationMinutes,
      },
    };
  }

  // Submit feedback
  async submitFeedback(userId: string, meetingId: string, data: {
    rating: number;
    notes?: string;
    privateScorecard?: any;
  }) {
    // Store feedback (would have a separate Feedback model)
    return { success: true };
  }

  // Reschedule meeting
  async reschedule(userId: string, meetingId: string, newTime: Date, reason: string) {
    const meeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        scheduledAt: newTime,
        status: "SCHEDULED",
      },
    });

    // Notify other party
    return { message: "Reschedule request sent", meeting };
  }

  private async createDailyRoom(roomCode: string): Promise<string> {
    if (!env.DAILY_API_KEY) return `https://place-me.daily.co/${roomCode}`;

    try {
      const response = await axios.post(
        "https://api.daily.co/v1/rooms",
        {
          name: roomCode,
          privacy: "public",
          properties: {
            max_participants: 10,
            enable_screenshare: true,
            enable_chat: true,
            start_audio_off: true,
            start_video_off: false,
          },
        },
        {
          headers: { Authorization: `Bearer ${env.DAILY_API_KEY}` },
        }
      );
      return response.data.url;
    } catch {
      return `https://place-me.daily.co/${roomCode}`;
    }
  }
}
