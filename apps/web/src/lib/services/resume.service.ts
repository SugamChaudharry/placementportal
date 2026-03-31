import { api } from "../api";

export interface ResumeVersion {
  id: string;
  title: string;
  atsScore: number;
  createdAt: string;
  isDefault?: boolean;
}

export interface ResumeData {
  personal?: {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    location?: string;
  };
  summary?: string;
  experience?: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    cgpa?: number;
  }>;
  skills?: {
    technical?: string[];
    soft?: string[];
    languages?: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

export const resumeService = {
  getVersions: async () => {
    return api.get("/api/resume/versions");
  },

  updateVersion: async (id: string, data: ResumeData) => {
    return api.put(`/api/resume/versions/${id}`, data);
  },

  createVersion: async (title: string, duplicateFrom?: string) => {
    return api.post("/api/resume/versions", { title, duplicateFrom });
  },

  parseResume: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/resume/parse", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  generateFromProfile: async () => {
    return api.post("/api/resume/generate", {});
  },

  getAtsScore: async (versionId: string) => {
    return api.get(`/api/resume/ats-score/${versionId}`);
  },

  renderPDF: async (versionId: string, template?: string) => {
    return api.post("/api/resume/render-pdf", { versionId, template });
  },
};

export const aiResumeService = {
  tailor: async (jobDescription: string, resumeData?: ResumeData) => {
    return api.post("/api/ai/resume/tailor", {
      jobDescription,
      resumeData,
    });
  },

  improveBullet: async (bulletText: string) => {
    return api.post("/api/ai/resume/improve-bullet", { bulletText });
  },
};
