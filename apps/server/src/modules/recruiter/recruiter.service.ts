import { prisma } from "../../shared/database/prisma";
import { redis } from "../../shared/database/redis";
import { queueJobs } from "../../shared/queue/queue";
import { AIService } from "../ai/ai.service";

const aiService = new AIService();

export class RecruiterService {
  // Get dashboard stats
  async getDashboardStats(recruiterId: string) {
    const recruiter = await prisma.recruiter.findUnique({
      where: { id: recruiterId },
      include: {
        jobs: {
          include: {
            applications: true,
          },
        },
      },
    });

    if (!recruiter) throw { statusCode: 404, message: "Recruiter not found" };

    const totalApplicants = recruiter.jobs.reduce((sum: number, job: any) => sum + job.applications.length, 0);
    const shortlisted = recruiter.jobs.reduce((sum: number, job: any) => sum + job.applications.filter((a: any) => ["SHORTLISTED", "TEST_SCHEDULED", "TEST_COMPLETED", "INTERVIEW_SCHEDULED"].includes(a.status)).length, 0);
    const offers = recruiter.jobs.reduce((sum: number, job: any) => sum + job.applications.filter((a: any) => a.status === "OFFERED").length, 0);

    return {
      totalApplicants,
      shortlisted,
      offers,
      acceptanceRate: offers > 0 ? Math.round((offers / shortlisted) * 100) : 0,
      activeDrives: recruiter.jobs.filter((j: any) => j.status === "OPEN").length,
    };
  }

  // Get candidates for a drive
  async getDriveCandidates(driveId: string, filters: any) {
    const applications = await prisma.application.findMany({
      where: { jobId: driveId },
      include: {
        student: {
          include: { user: true },
        },
        job: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return applications.map((app: any) => ({
      id: app.id,
      studentId: app.studentId,
      name: app.student.user.name,
      email: app.student.user.email,
      branch: app.student.branch,
      cgpa: app.student.cgpa,
      skills: app.student.skills,
      status: app.status,
      appliedAt: app.createdAt,
    }));
  }

  // Bulk status update
  async bulkUpdateStatus(candidateIds: string[], newStatus: string) {
    await prisma.application.updateMany({
      where: { id: { in: candidateIds } },
      data: { status: newStatus as any },
    });

    // Send notifications
    for (const id of candidateIds) {
      await queueJobs.email({
        to: "student@example.com",
        subject: "Application Status Updated",
        html: `<p>Your application status has been updated to: ${newStatus}</p>`,
      });
    }

    return { updated: candidateIds.length };
  }

  // AI shortlisting
  async aiShortlist(driveId: string, weights: { cgpa: number; skills: number; projects: number }) {
    const candidates = await this.getDriveCandidates(driveId, {});

    const ranked = await aiService.rankCandidates(
      candidates.map((c: any) => ({
        id: c.id,
        name: c.name,
        cgpa: c.cgpa,
        skills: c.skills,
        projects: [], // Would fetch from resume
      })),
      weights
    );

    return ranked;
  }

  // Schedule batch interviews
  async scheduleBatch(driveId: string, candidateIds: string[], duration: number, slots: Date[]) {
    const schedule = candidateIds.map((candidateId, index) => ({
      candidateId,
      slot: slots[index % slots.length],
      duration,
      meetingLink: `https://place-me.daily.co/interview_${candidateId}_${Date.now()}`,
    }));

    // Create meetings in database
    for (const item of schedule) {
      await prisma.meeting.create({
        data: {
          title: "Interview",
          type: "TECHNICAL",
          scheduledAt: item.slot,
          durationMinutes: item.duration,
          roomCode: item.meetingLink.split("/").pop()!,
          status: "SCHEDULED",
        },
      });
    }

    return { schedule, totalScheduled: schedule.length };
  }
}
