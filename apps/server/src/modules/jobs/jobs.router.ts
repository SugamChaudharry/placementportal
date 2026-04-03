import type { FastifyInstance } from "fastify";

const DUMMY_JOBS = [
  {
    id: "1",
    title: "Software Engineer",
    description: "Join our core platform team to build scalable services and tackle complex architectural challenges.",
    location: "Bangalore",
    ctc: "25 LPA",
    type: "Full-time",
    skills: ["Node.js", "TypeScript", "PostgreSQL", "Redis"],
    deadline: "2026-05-01",
    minCgpa: 7.5,
    branches: ["CS", "IT", "ECE"],
    maxBacklogs: 0,
    status: "Active",
    company: { id: "c1", name: "Google", color: "#4285F4" }
  },
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
  },
  {
    id: "4",
    title: "Cloud Architect",
    description: "Design and implement scalable cloud infrastructure for enterprise customers.",
    location: "Mumbai",
    ctc: "30 LPA",
    type: "Full-time",
    skills: ["AWS", "Terraform", "Kubernetes", "Go"],
    deadline: "2026-05-15",
    minCgpa: 7.0,
    branches: ["CS", "IT", "EE"],
    maxBacklogs: 1,
    status: "Active",
    company: { id: "c4", name: "Microsoft", color: "#00A4EF" }
  }
];

export async function jobsRoutes(app: FastifyInstance) {
  app.get("/", { handler: async () => ({ data: DUMMY_JOBS, total: DUMMY_JOBS.length }) });
  
  app.get("/saved", { 
    handler: async () => ({ 
      data: [DUMMY_JOBS[0]], 
      total: 1 
    }) 
  });

  app.post("/:id/save", {
    handler: async (req, reply) => reply.send({ success: true })
  });

  app.delete("/:id/save", {
    handler: async (req, reply) => reply.send({ success: true })
  });

  app.post("/:id/apply", {
    handler: async (req, reply) => reply.send({ success: true })
  });
}
