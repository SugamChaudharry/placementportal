import { prisma } from "../../shared/database/prisma";
import { redis, redisKeys } from "../../shared/database/redis";
import { queueJobs } from "../../shared/queue/queue";
import { env } from "../../config/env";
import type { UpdateProfileDto, OnboardingDto, RecruiterOnboardingDto } from "./users.schema";
import axios from "axios";

export class UsersService {
  // Get user profile with details
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        student: {
          include: {
            applications: {
              take: 5,
              orderBy: { createdAt: "desc" },
              include: { job: { include: { company: true } } },
            },
          },
        },
        recruiter: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) throw { statusCode: 404, message: "User not found" };
    return user;
  }

  // Update profile (partial update)
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Calculate profile completion
    const profileComplete = this.calculateProfileComplete(dto);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        avatar: dto.avatar,
        student: {
          upsert: {
            create: {
              phone: dto.phone,
              linkedinUrl: dto.linkedinUrl,
              githubUrl: dto.githubUrl,
              bio: dto.bio,
              college: dto.college,
              branch: dto.branch,
              degree: dto.degree,
              cgpa: dto.cgpa,
              graduationYear: dto.graduationYear,
              skills: dto.skills || [],
              backlogs: dto.backlogs,
              profileComplete,
            },
            update: {
              phone: dto.phone,
              linkedinUrl: dto.linkedinUrl,
              githubUrl: dto.githubUrl,
              bio: dto.bio,
              college: dto.college,
              branch: dto.branch,
              degree: dto.degree,
              cgpa: dto.cgpa,
              graduationYear: dto.graduationYear,
              skills: dto.skills,
              backlogs: dto.backlogs,
              profileComplete,
            },
          },
        },
      },
      select: { id: true, name: true, email: true, avatar: true, student: true },
    });

    // Sync to search index if Meilisearch is configured
    if (env.MEILISEARCH_URL) {
      await queueJobs.searchSync({ entity: "user", action: "update", id: userId, data: user });
    }

    return user;
  }

  // Complete onboarding (all 5 steps)
  async completeOnboarding(userId: string, dto: OnboardingDto) {
    // Validate resume URL is provided and accessible
    if (!dto.resume?.url) {
      throw { statusCode: 400, message: "Resume URL is required" };
    }

    try {
      const response = await axios.head(dto.resume.url, { timeout: 5000 });
      if (response.status !== 200) {
        throw new Error("Resume URL not accessible");
      }
    } catch (error: any) {
      throw {
        statusCode: 400,
        message: "Invalid resume URL or file not accessible",
      };
    }

    const profileComplete = 100;

    // Check for username collision if username is being updated
    if (dto.username) {
      const existing = await prisma.user.findFirst({
        where: { username: dto.username, NOT: { id: userId } }
      });
      if (existing) {
        throw { statusCode: 409, message: "Username already taken" };
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.personal.name,
        username: dto.username,
        student: {
          upsert: {
            create: {
              phone: dto.personal.phone,
              linkedinUrl: dto.personal.linkedinUrl,
              githubUrl: dto.personal.githubUrl,
              bio: dto.personal.bio,
              college: dto.academic.college,
              branch: dto.academic.branch,
              degree: dto.academic.degree,
              cgpa: dto.academic.cgpa,
              graduationYear: dto.academic.graduationYear,
              backlogs: dto.academic.backlogs,
              skills: dto.skills.technical || [],
              resumeUrl: dto.resume.url,
              profileComplete,
            },
            update: {
              phone: dto.personal.phone,
              linkedinUrl: dto.personal.linkedinUrl,
              githubUrl: dto.personal.githubUrl,
              bio: dto.personal.bio,
              college: dto.academic.college,
              branch: dto.academic.branch,
              degree: dto.academic.degree,
              cgpa: dto.academic.cgpa,
              graduationYear: dto.academic.graduationYear,
              backlogs: dto.academic.backlogs,
              skills: dto.skills.technical || [],
              resumeUrl: dto.resume.url,
              profileComplete,
            },
          },
        },
      },
      include: { student: true },
    });

    return { user, message: "Onboarding completed successfully" };
  }

  // Complete recruiter onboarding (creates company and recruiter profile with PENDING status)
  async completeRecruiterOnboarding(userId: string, dto: RecruiterOnboardingDto) {
    // Check for username collision if username is being updated
    if (dto.username) {
      const existing = await prisma.user.findFirst({
        where: { username: dto.username, NOT: { id: userId } }
      });
      if (existing) {
        throw { statusCode: 409, message: "Username already taken" };
      }
    }

    // First, create or find the company
    let companyId: string | undefined;

    if (dto.company.name) {
      // Try to find existing company by name
      let company = await prisma.company.findFirst({
        where: { name: { equals: dto.company.name, mode: "insensitive" } }
      });

      if (!company) {
        // Create new company
        company = await prisma.company.create({
          data: {
            name: dto.company.name,
            slug: dto.company.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
            website: dto.company.website,
            industry: dto.company.industry,
            size: dto.company.size,
            logo: dto.company.logo,
          }
        });
      }
      companyId = company.id;
    }

    // Update user name and username, create recruiter profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.personal.name,
        username: dto.username,
        recruiter: {
          upsert: {
            create: {
              ...(companyId ? { company: { connect: { id: companyId } } } : {}),
              designation: dto.designation,
              verificationStatus: "PENDING",
              submittedAt: new Date(),
            },
            update: {
              ...(companyId ? { company: { connect: { id: companyId } } } : {}),
              designation: dto.designation,
            },
          },
        },
      },
      include: { recruiter: { include: { company: true } } },
    });

    // Notify admins about new recruiter verification request
    if (env.RESEND_API_KEY) {
      await queueJobs.email({
        to: env.SUPER_ADMIN_EMAIL || "admin@placementportal.com",
        subject: "New Recruiter Verification Request",
        html: `<p>A new recruiter (${dto.personal.name} - ${dto.company.name}) has submitted their profile for verification.</p><p>Please review in the admin panel.</p>`
      });
    }

    return { user, message: "Profile submitted for verification. You will be notified once approved." };
  }

  // Upload profile photo (presigned URL for S3)
  async getProfilePhotoUploadUrl(userId: string, contentType: string) {
    // In production, this would generate an S3 presigned URL
    // For now, return a mock URL
    const key = `avatars/${userId}/${Date.now()}.jpg`;
    return {
      uploadUrl: `${env.CLIENT_URL}/api/upload/mock?key=${key}`,
      cdnUrl: `${env.CLIENT_URL}/uploads/${key}`,
    };
  }

  // Get public profile (respects privacy)
  async getPublicProfile(username: string) {
    const user = await prisma.user.findFirst({
      where: { name: { contains: username, mode: "insensitive" } },
      select: {
        id: true,
        name: true,
        avatar: true,
        student: {
          select: {
            college: true,
            branch: true,
            degree: true,
            graduationYear: true,
            skills: true,
            bio: true,
          },
        },
      },
    });

    if (!user) throw { statusCode: 404, message: "User not found" };
    return user;
  }

  // Get activity timeline
  async getActivity(userId: string) {
    const applications = await prisma.application.findMany({
      where: { student: { userId } },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { job: { include: { company: true } } },
    });

    return applications.map(app => ({
      id: app.id,
      type: "application",
      title: `Applied to ${app.job.title} at ${app.job.company.name}`,
      status: app.status,
      date: app.createdAt,
    }));
  }

  // Request data export
  async exportData(userId: string) {
    await queueJobs.export(userId);
    return { message: "Data export queued. You will receive an email when ready." };
  }

  // Get colleges list (cached)
  async getColleges() {
    const cached = await redis.get("colleges:list");
    if (cached) return JSON.parse(cached);

    const colleges = [
      "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kharagpur", "IIT Kanpur",
      "IIT Roorkee", "IIT Guwahati", "IIT Hyderabad", "NIT Trichy", "NIT Surathkal",
      "NIT Warangal", "NIT Calicut", "BITS Pilani", "BITS Goa", "BITS Hyderabad",
      "IIIT Hyderabad", "IIIT Bangalore", "VIT Vellore", "SRM University", "Manipal Institute of Technology",
    ];

    await redis.setex("colleges:list", 3600, JSON.stringify(colleges));
    return colleges;
  }

  private calculateProfileComplete(dto: UpdateProfileDto): number {
    let score = 0;
    if (dto.name) score += 10;
    if (dto.phone) score += 10;
    if (dto.bio) score += 10;
    if (dto.college) score += 15;
    if (dto.branch) score += 10;
    if (dto.cgpa) score += 10;
    if (dto.graduationYear) score += 10;
    if (dto.skills && dto.skills.length > 0) score += 15;
    return Math.min(100, score);
  }
}
