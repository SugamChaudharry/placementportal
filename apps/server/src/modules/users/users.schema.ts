import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
  phone: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  college: z.string().optional(),
  branch: z.string().optional(),
  degree: z.string().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  graduationYear: z.number().int().min(2000).max(2030).optional(),
  skills: z.array(z.string()).optional(),
  backlogs: z.number().int().min(0).default(0),
});

export const onboardingSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  personal: z.object({
    name: z.string().min(2),
    phone: z.string(),
    linkedinUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    bio: z.string().max(300).optional(),
  }),
  academic: z.object({
    college: z.string(),
    branch: z.string().optional(),
    degree: z.string().optional(),
    cgpa: z.number().min(0).max(10).optional(),
    graduationYear: z.number().int().optional(),
    backlogs: z.number().int().default(0),
  }),
  skills: z.object({
    technical: z.array(z.string()).optional(),
    soft: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
  }),
  resume: z.object({
    url: z.string().url().optional(),
    parsedData: z.record(z.any()).optional(),
  }).optional(),
  preferences: z.object({
    jobTypes: z.array(z.enum(["FULL_TIME", "INTERNSHIP", "PPO"])),
    preferredLocations: z.array(z.string()).optional(),
    expectedCtc: z.string().optional(),
  }),
});

export const recruiterOnboardingSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  personal: z.object({
    name: z.string().min(2),
    phone: z.string(),
    workEmail: z.string().optional().transform(val => val === "" ? undefined : val).pipe(z.string().email().optional()),
  }),
  company: z.object({
    name: z.string(),
    website: z.string().url().optional(),
    industry: z.string().optional(),
    size: z.string().optional(),
    logo: z.string().url().optional(),
  }),
  designation: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type OnboardingDto = z.infer<typeof onboardingSchema>;
export type RecruiterOnboardingDto = z.infer<typeof recruiterOnboardingSchema>;
