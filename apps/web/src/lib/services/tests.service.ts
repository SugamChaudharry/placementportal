import { api } from "../api";

export interface Test {
  id: string;
  name: string;
  durationMinutes: number;
  scheduledAt: string;
  endsAt: string;
  languages: string[];
  cameraRequired: boolean;
  status: string;
}

export interface TestQuestion {
  id: string;
  title: string;
  difficulty: string;
  marks: number;
}

export interface CodeSubmission {
  code: string;
  language: string;
  questionId: string;
}

export interface CodeResult {
  stdout: string;
  stderr: string;
  status: string;
  time?: string;
  memory?: string;
}

export const testsService = {
  getCandidateTests: async () => {
    return api.get("/api/tests/candidate");
  },

  getTest: async (id: string) => {
    return api.get(`/api/tests/${id}`);
  },

  startTest: async (id: string) => {
    return api.post(`/api/tests/${id}/start`, {});
  },

  runCode: async (testId: string, data: CodeSubmission): Promise<CodeResult> => {
    return api.post(`/api/tests/${testId}/run`, data);
  },

  submitQuestion: async (testId: string, data: CodeSubmission) => {
    return api.post(`/api/tests/${testId}/submit-question`, data);
  },

  flagViolation: async (testId: string, type: string, timestamp: string) => {
    return api.post(`/api/tests/${testId}/flag`, { type, timestamp });
  },

  finishTest: async (id: string) => {
    return api.post(`/api/tests/${id}/finish`, {});
  },

  getResult: async (id: string) => {
    return api.get(`/api/tests/${id}/result`);
  },
};
