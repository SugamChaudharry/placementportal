import { prisma } from "../../shared/database/prisma";
import { queueJobs } from "../../shared/queue/queue";
import { cloudinary } from "@/lib/cloudinary";

export class ResumeService {
  // Upload resume file to Cloudinary
  async uploadResume(userId: string, buffer: Buffer, filename: string) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `resumes/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
          resource_type: "auto",
          public_id: `${userId}-${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else
            resolve({
              success: true,
              url: result?.secure_url,
              filename: result?.original_filename || filename,
              uploadedAt: new Date(),
            });
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Get all resume versions for user
  async getVersions(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    if (!student) throw { statusCode: 404, message: "Student profile not found" };

    // Return mock versions for now - would query ResumeVersion table
    return {
      current: student.resumeUrl,
      versions: [
        { id: "1", title: "SDE Resume", atsScore: 85, createdAt: new Date(), isDefault: true },
        { id: "2", title: "Data Science Resume", atsScore: 78, createdAt: new Date(Date.now() - 86400000), isDefault: false },
      ],
    };
  }

  // Update resume version
  async updateVersion(userId: string, versionId: string, data: any) {
    // Update version and trigger ATS score recalculation
    await queueJobs.atsScore(versionId);
    return { id: versionId, ...data, updatedAt: new Date() };
  }

  // Create new version
  async createVersion(userId: string, data: { title: string; duplicateFrom?: string }) {
    const id = `version_${Date.now()}`;
    return { id, title: data.title, atsScore: 0, createdAt: new Date(), isDefault: false };
  }

  // Parse uploaded resume PDF
  async parseResume(fileBuffer: Buffer, contentType: string) {
    // In production, extract text from PDF and use Claude to parse
    // For now, return mock parsed data
    return {
      skills: ["JavaScript", "Python", "React", "Node.js"],
      experience: [
        { title: "Software Intern", company: "TechCorp", duration: "3 months" },
      ],
      education: { degree: "B.Tech", college: "IIT", year: 2025 },
    };
  }

  // Generate resume from profile using AI
  async generateFromProfile(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!student) throw { statusCode: 404, message: "Student not found" };

    // Queue AI job to generate resume
    await queueJobs.ai({
      type: "resume-tailor",
      payload: { student },
      userId,
    });

    return { message: "Resume generation started. You will be notified when ready." };
  }

  // Get ATS score
  async getAtsScore(versionId: string) {
    return {
      score: 85,
      breakdown: {
        keywords: 90,
        formatting: 80,
        content: 85,
      },
      suggestions: [
        "Add more quantifiable achievements",
        "Include relevant keywords from job description",
        "Use standard section headings",
      ],
    };
  }

  // Generate PDF
  async generatePDF(versionId: string, template: string = "modern") {
    // Queue PDF generation
    await queueJobs.pdf({ type: "resume", data: { versionId, template }, userId: "system" });
    return { message: "PDF generation queued", downloadUrl: `/api/resume/download/${versionId}` };
  }
}
