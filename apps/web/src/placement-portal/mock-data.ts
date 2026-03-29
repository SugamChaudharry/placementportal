import type { LucideIcon } from "lucide-react";
import {
  Video,
  Code2,
  CheckCircle,
  Award,
  Info,
  MessageSquare,
} from "lucide-react";

export const JOBS = [
  {
    id: 1,
    company: "Google",
    logo: "G",
    color: "#4285F4",
    role: "Software Engineer",
    location: "Bangalore",
    ctc: "28–35 LPA",
    deadline: "Feb 15",
    skills: ["DSA", "System Design", "Python", "Go"],
    eligible: true,
    type: "Full-time",
    desc: "Join Google's Core Engineering team building scalable systems used by billions.",
  },
  {
    id: 2,
    company: "Microsoft",
    logo: "M",
    color: "#00A4EF",
    role: "SDE-2",
    location: "Hyderabad",
    ctc: "24–30 LPA",
    deadline: "Feb 18",
    skills: ["C++", "Azure", "Distributed Systems", "SQL"],
    eligible: true,
    type: "Full-time",
    desc: "Work on Azure Cloud infrastructure with the world's best engineers.",
  },
  {
    id: 3,
    company: "Amazon",
    logo: "A",
    color: "#FF9900",
    role: "SDE-1",
    location: "Pune",
    ctc: "20–26 LPA",
    deadline: "Feb 10",
    skills: ["Java", "AWS", "OOP", "LLD"],
    eligible: false,
    type: "Full-time",
    desc: "Build customer-facing features for Amazon's e-commerce platform.",
  },
  {
    id: 4,
    company: "Flipkart",
    logo: "F",
    color: "#2874F0",
    role: "Data Analyst",
    location: "Bangalore",
    ctc: "12–16 LPA",
    deadline: "Feb 22",
    skills: ["Python", "SQL", "Tableau", "Statistics"],
    eligible: true,
    type: "Full-time",
    desc: "Drive insights from massive datasets to shape product strategy.",
  },
  {
    id: 5,
    company: "Zomato",
    logo: "Z",
    color: "#E23744",
    role: "Product Intern",
    location: "Gurgaon",
    ctc: "₹60k/mo",
    deadline: "Feb 12",
    skills: ["Product Thinking", "SQL", "Figma"],
    eligible: true,
    type: "Internship",
    desc: "Work directly with the product team on restaurant discovery features.",
  },
  {
    id: 6,
    company: "Groww",
    logo: "GW",
    color: "#00D09C",
    role: "Backend Engineer",
    location: "Bangalore",
    ctc: "18–22 LPA",
    deadline: "Feb 28",
    skills: ["Node.js", "Kafka", "PostgreSQL", "Redis"],
    eligible: true,
    type: "Full-time",
    desc: "Build the financial infrastructure for India's next-gen investment platform.",
  },
];

export const APPS = [
  {
    id: 1,
    company: "Google",
    logo: "G",
    color: "#4285F4",
    role: "Software Engineer",
    date: "Jan 20",
    updated: "2d ago",
    status: "Interview Scheduled",
    drive: "2025 Batch",
  },
  {
    id: 2,
    company: "Microsoft",
    logo: "M",
    color: "#00A4EF",
    role: "SDE-2",
    date: "Jan 18",
    updated: "5d ago",
    status: "Test Completed",
    drive: "2025 Batch",
  },
  {
    id: 3,
    company: "Flipkart",
    logo: "F",
    color: "#2874F0",
    role: "Data Analyst",
    date: "Jan 15",
    updated: "1w ago",
    status: "Shortlisted",
    drive: "2025 Batch",
  },
  {
    id: 4,
    company: "Zomato",
    logo: "Z",
    color: "#E23744",
    role: "Product Intern",
    date: "Jan 10",
    updated: "2w ago",
    status: "Applied",
    drive: "Summer 2025",
  },
  {
    id: 5,
    company: "Paytm",
    logo: "P",
    color: "#002970",
    role: "ML Engineer",
    date: "Jan 5",
    updated: "3w ago",
    status: "Rejected",
    drive: "2025 Batch",
  },
  {
    id: 6,
    company: "Groww",
    logo: "GW",
    color: "#00D09C",
    role: "Backend Engineer",
    date: "Dec 28",
    updated: "1mo ago",
    status: "Offered",
    drive: "2025 Batch",
  },
];

export type NotifItem = {
  id: number;
  type: string;
  icon: LucideIcon;
  color: string;
  title: string;
  msg: string;
  time: string;
  unread: boolean;
  action: string | null;
};

export const NOTIFS: NotifItem[] = [
  {
    id: 1,
    type: "interview",
    icon: Video,
    color: "#7c3aed",
    title: "Interview Scheduled",
    msg: "Google SDE interview confirmed for Feb 5 at 10:00 AM",
    time: "2h ago",
    unread: true,
    action: "Join Meeting",
  },
  {
    id: 2,
    type: "test",
    icon: Code2,
    color: "#f59e0b",
    title: "Test Reminder",
    msg: "Microsoft SDE-2 coding test starts in 2 hours",
    time: "4h ago",
    unread: true,
    action: "View Test",
  },
  {
    id: 3,
    type: "shortlist",
    icon: CheckCircle,
    color: "#10b981",
    title: "Shortlisted!",
    msg: "You've been shortlisted for Flipkart Data Analyst drive",
    time: "1d ago",
    unread: true,
    action: "View Details",
  },
  {
    id: 4,
    type: "offer",
    icon: Award,
    color: "#4f46e5",
    title: "Offer Received 🎉",
    msg: "Groww has extended a full-time offer for Backend Engineer",
    time: "3d ago",
    unread: false,
    action: "View Offer",
  },
  {
    id: 5,
    type: "system",
    icon: Info,
    color: "#3b82f6",
    title: "Profile 80% Complete",
    msg: "Add 2 more projects to complete your profile and boost ATS score",
    time: "5d ago",
    unread: false,
    action: null,
  },
  {
    id: 6,
    type: "chat",
    icon: MessageSquare,
    color: "#6366f1",
    title: "New Message",
    msg: "Recruiter from Amazon: 'Your profile looks strong! Can you...'",
    time: "1w ago",
    unread: false,
    action: "Reply",
  },
];

export const CHAT_MSGS = [
  {
    id: 1,
    sender: "Amazon HR",
    avatar: "A",
    color: "#FF9900",
    text: "Hi Arjun! I'm reaching out about your application for SDE-1 role.",
    time: "10:02 AM",
    mine: false,
  },
  {
    id: 2,
    sender: "me",
    avatar: "AK",
    color: "#4f46e5",
    text: "Hello! Thank you for getting in touch. I'm very interested in the opportunity.",
    time: "10:05 AM",
    mine: true,
  },
  {
    id: 3,
    sender: "Amazon HR",
    avatar: "A",
    color: "#FF9900",
    text: "Great! We'd like to schedule a technical screening. Are you available this Thursday or Friday at 2–4 PM IST?",
    time: "10:07 AM",
    mine: false,
  },
  {
    id: 4,
    sender: "me",
    avatar: "AK",
    color: "#4f46e5",
    text: "Thursday 2 PM works perfectly for me!",
    time: "10:09 AM",
    mine: true,
  },
  {
    id: 5,
    sender: "Amazon HR",
    avatar: "A",
    color: "#FF9900",
    text: "Perfect! I'll send the calendar invite and Chime link to your registered email shortly. Please ensure your system and internet are stable. All the best! 🚀",
    time: "10:11 AM",
    mine: false,
  },
];

export const PRACTICE_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "72%",
    solved: true,
    tags: ["Array", "Hash Map"],
    companies: ["G", "F", "A"],
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "34%",
    solved: true,
    tags: ["String", "Sliding Window"],
    companies: ["A", "M"],
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    acceptance: "21%",
    solved: false,
    tags: ["Binary Search", "Divide & Conquer"],
    companies: ["G"],
  },
  {
    id: 4,
    title: "Container With Most Water",
    difficulty: "Medium",
    acceptance: "48%",
    solved: false,
    tags: ["Two Pointers", "Array"],
    companies: ["F", "A"],
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    acceptance: "65%",
    solved: true,
    tags: ["Stack", "String"],
    companies: ["G", "M", "A", "F"],
  },
  {
    id: 6,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    acceptance: "18%",
    solved: false,
    tags: ["Heap", "Linked List"],
    companies: ["A"],
  },
  {
    id: 7,
    title: "Coin Change",
    difficulty: "Medium",
    acceptance: "41%",
    solved: false,
    tags: ["DP", "BFS"],
    companies: ["G", "M"],
  },
];

export type CalendarEventType = "interview" | "test" | "deadline" | "result" | "info";

export const CALENDAR_EVENTS: Record<
  number,
  { title: string; type: CalendarEventType; company: string; time: string }[]
> = {
  5: [{ title: "Google SDE Interview", type: "interview", company: "Google", time: "10:00 AM" }],
  8: [{ title: "Microsoft Coding Test", type: "test", company: "Microsoft", time: "2:00 PM" }],
  12: [{ title: "Flipkart Shortlist Result", type: "result", company: "Flipkart", time: "All day" }],
  15: [{ title: "Amazon Application Deadline", type: "deadline", company: "Amazon", time: "11:59 PM" }],
  18: [{ title: "Zomato Info Session", type: "info", company: "Zomato", time: "4:00 PM" }],
  22: [{ title: "Microsoft OA Deadline", type: "deadline", company: "Microsoft", time: "11:59 PM" }],
  25: [{ title: "Groww Offer Acceptance", type: "result", company: "Groww", time: "All day" }],
};

export const chartPlacement = [
  { month: "Aug", offers: 12 },
  { month: "Sep", offers: 28 },
  { month: "Oct", offers: 45 },
  { month: "Nov", offers: 62 },
  { month: "Dec", offers: 38 },
  { month: "Jan", offers: 74 },
];

export const chartBranch = [
  { branch: "CSE", rate: 92 },
  { branch: "IT", rate: 85 },
  { branch: "ECE", rate: 78 },
  { branch: "EEE", rate: 71 },
  { branch: "ME", rate: 58 },
  { branch: "Civil", rate: 42 },
];

export const chartRadar = [
  { subject: "Communication", A: 78, fullMark: 100 },
  { subject: "Technical", A: 85, fullMark: 100 },
  { subject: "Problem Solving", A: 72, fullMark: 100 },
  { subject: "Confidence", A: 65, fullMark: 100 },
  { subject: "Clarity", A: 80, fullMark: 100 },
];

export const chartDriveTrend = [
  { name: "Jul", tests: 120, offers: 8 },
  { name: "Aug", tests: 180, offers: 14 },
  { name: "Sep", tests: 240, offers: 22 },
  { name: "Oct", tests: 310, offers: 35 },
  { name: "Nov", tests: 280, offers: 28 },
  { name: "Dec", tests: 190, offers: 18 },
];

export const chartCompanyMix = [
  { name: "Product / SDE", value: 42 },
  { name: "Data / ML", value: 22 },
  { name: "Consulting", value: 14 },
  { name: "Finance", value: 12 },
  { name: "Other", value: 10 },
];

export const topStudentsPerf = [
  { name: "Ananya Verma", branch: "CSE", cgpa: 9.5, offers: 3, company: "Google" },
  { name: "Priya Sharma", branch: "CSE", cgpa: 9.2, offers: 2, company: "Microsoft" },
  { name: "Arjun Kumar", branch: "CSE", cgpa: 8.9, offers: 2, company: "Groww" },
  { name: "Rahul Singh", branch: "IT", cgpa: 8.4, offers: 1, company: "Amazon" },
];
