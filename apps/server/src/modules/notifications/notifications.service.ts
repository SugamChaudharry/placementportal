import { prisma } from "../../shared/database/prisma";
import { queueJobs } from "../../shared/queue/queue";

export class NotificationsService {
  // Get notifications for user
  async getNotifications(userId: string, options: {
    unreadOnly?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = { userId };
    if (options.unreadOnly) where.read = false;
    if (options.type) where.type = options.type.toUpperCase();

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: ((options.page || 1) - 1) * (options.limit || 20),
        take: options.limit || 20,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    return { notifications, total, unreadCount };
  }

  // Mark as read
  async markAsRead(userId: string, notificationIds?: string[]) {
    if (notificationIds && notificationIds.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: notificationIds }, userId },
        data: { read: true },
      });
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
    }

    return { success: true };
  }

  // Create notification (internal use)
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
  }) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
      },
    });

    // Send real-time notification via WebSocket if connected
    return notification;
  }

  // Get notification settings
  async getSettings(userId: string) {
    // Would fetch from NotificationSettings model
    return {
      email: {
        applicationUpdates: true,
        interviewReminders: true,
        testResults: true,
        newJobs: false,
      },
      sms: {
        interviewReminders: true,
        urgentOnly: true,
      },
      push: {
        all: true,
      },
    };
  }

  // Update notification settings
  async updateSettings(userId: string, settings: any) {
    // Would update NotificationSettings model
    return { success: true, settings };
  }
}
