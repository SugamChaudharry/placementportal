export type Job = {
  id: string;
  role: string;
  company: string;
  companyColor: string;
  location: string;
  ctc: string;
  deadline: string;
  skills: string[];
  type: string;
  eligibility?: boolean;
};

export type Application = {
  id: string;
  jobId: string;
  status: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};
