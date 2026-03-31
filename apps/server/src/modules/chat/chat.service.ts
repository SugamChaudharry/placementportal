import { prisma } from "../../shared/database/prisma";
import { redis } from "../../shared/database/redis";

export class ChatService {
  // Get all rooms for user
  async getRooms(userId: string) {
    const rooms = await prisma.chatRoom.findMany({
      where: { type: "GROUP" },
      orderBy: { createdAt: "desc" },
    });
    return rooms;
  }

  // Get DMs for user
  async getDMs(userId: string) {
    // Query rooms of type DM where user is a member
    const dms = await prisma.chatRoom.findMany({
      where: { type: "DM" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return dms;
  }

  // Get messages in conversation
  async getMessages(roomId: string, cursor?: string, limit: number = 50) {
    const messages = await prisma.message.findMany({
      where: { roomId },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });
    return messages.reverse();
  }

  // Send message
  async sendMessage(userId: string, roomId: string, content: string, type: string = "TEXT") {
    const message = await prisma.message.create({
      data: {
        roomId,
        senderId: userId,
        content,
        type: type as any,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });
    return message;
  }

  // Search users
  async searchUsers(query: string, page: number = 1, limit: number = 20) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      skip: (page - 1) * limit,
      select: { id: true, name: true, email: true, avatar: true, role: true },
    });
    return users;
  }

  // Mark messages as read
  async markAsRead(userId: string, roomId: string, messageIds?: string[]) {
    // Update read receipts
    return { success: true };
  }
}
