import type { FastifyInstance } from "fastify";

const DUMMY_APPLICATIONS = [
  {
    id: "2",
    title: "Frontend Developer",
    description: "Create beautiful, responsive, and high-performance user interfaces for our flagship product.",
    location: "Remote",
    ctc: "18 LPA",
    type: "Internship",
    skills: ["React", "CSS", "Tailwind", "Next.js"],
    deadline: "2026-04-15",
    minCgpa: 8.0,
    branches: ["CS", "IT"],
    maxBacklogs: 0,
    status: "Active",
    company: { id: "c2", name: "Meta", color: "#0668E1" }
  },
  {
    id: "3",
    title: "Data Scientist",
    description: "Build advanced machine learning models to derive insights from vast amounts of data.",
    location: "Hyderabad",
    ctc: "22 LPA",
    type: "Full-time",
    skills: ["Python", "PyTorch", "SQL", "Scikit-Learn"],
    deadline: "2026-04-30",
    minCgpa: 8.5,
    branches: ["CS", "Mathematics"],
    maxBacklogs: 0,
    status: "Active",
    company: { id: "c3", name: "Amazon", color: "#FF9900" }
  }
];

export async function applicationsRoutes(app: FastifyInstance) {
  app.get("/", { 
    handler: async () => ({ 
      data: DUMMY_APPLICATIONS, 
      total: DUMMY_APPLICATIONS.length 
    }) 
  });
}
