import Queue from "bull";
import { env } from "../../config/env";

// Queue instances
export const emailQueue = new Queue("email", env.REDIS_URL);
export const pdfQueue = new Queue("pdf", env.REDIS_URL);
export const aiQueue = new Queue("ai", env.REDIS_URL);
export const searchSyncQueue = new Queue("search-sync", env.REDIS_URL);
export const exportQueue = new Queue("export", env.REDIS_URL);
export const atsScoreQueue = new Queue("ats-score", env.REDIS_URL);

// Job types
interface EmailJob {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface PDFJob {
  type: "resume" | "report";
  data: any;
  userId: string;
}

interface AIJob {
  type: "code-review" | "resume-tailor" | "ats-score";
  payload: any;
  userId: string;
}

interface SearchSyncJob {
  entity: "job" | "user" | "company";
  action: "create" | "update" | "delete";
  id: string;
  data?: any;
}

// Add job helpers
export const queueJobs = {
  email: (job: EmailJob) => emailQueue.add(job, { attempts: 3, backoff: 5000 }),
  pdf: (job: PDFJob) => pdfQueue.add(job, { attempts: 2, backoff: 10000 }),
  ai: (job: AIJob) => aiQueue.add(job, { attempts: 2, backoff: 5000 }),
  searchSync: (job: SearchSyncJob) => searchSyncQueue.add(job, { attempts: 3, backoff: 5000 }),
  export: (userId: string) => exportQueue.add({ userId }, { attempts: 2 }),
  atsScore: (resumeVersionId: string) => atsScoreQueue.add({ resumeVersionId }, { attempts: 2 }),
};

// Health check
export async function getQueueHealth(): Promise<{ status: string; pending: number }> {
  const [emailCount, pdfCount, aiCount] = await Promise.all([
    emailQueue.getJobCounts(),
    pdfQueue.getJobCounts(),
    aiQueue.getJobCounts(),
  ]);
  const totalPending = emailCount.waiting + emailCount.delayed + emailCount.active +
                       pdfCount.waiting + pdfCount.delayed + pdfCount.active +
                       aiCount.waiting + aiCount.delayed + aiCount.active;
  return {
    status: totalPending > 100 ? "warning" : "healthy",
    pending: totalPending,
  };
}
