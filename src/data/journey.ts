export type MilestoneKind =
  | "education"
  | "work"
  | "community"
  | "recognition"
  | "credential";

export type Milestone = {
  id: string;
  period: string;
  year?: string;
  kind: MilestoneKind;
  title: string;
  org: string;
  body: string;
  evidence?: { label: string; href?: string };
  featured?: boolean;
};

export const kindLabels: Record<MilestoneKind, string> = {
  education: "Education",
  work: "Experience",
  community: "Community",
  recognition: "Recognition",
  credential: "Credentials",
};

export const milestones: Milestone[] = [
  {
    id: "btech",
    period: "2024 — 2028",
    year: "2024",
    kind: "education",
    title: "B.Tech, Computer Science & Engineering",
    org: "Integral University, Lucknow",
    body: "Four-year undergraduate programme. Coursework across algorithms, data structures, databases, operating systems and machine learning, running alongside everything being built outside the classroom.",
    featured: true,
  },
  {
    id: "freelance",
    period: "Ongoing",
    kind: "work",
    title: "Freelance web & web-app development",
    org: "Independent",
    body: "Building websites and web applications for small businesses and student platforms on a freelance basis — from information sites through to applications with real data and accounts.",
    featured: true,
  },
  {
    id: "ecell",
    period: "Ongoing",
    kind: "community",
    title: "Campus Ambassador",
    org: "E-Cell, IIT Bombay",
    body: "Representing E-Cell's entrepreneurship programme on campus. A student representative role — not employment at, or enrolment in, IIT Bombay.",
    evidence: { label: "LinkedIn", href: "https://www.linkedin.com/in/mohd-mohsin-rizvi" },
    featured: true,
  },
  {
    id: "placement-cell",
    period: "Ongoing",
    kind: "community",
    title: "Student Coordinator",
    org: "Placement Cell, Integral University",
    body: "Coordinating placement activity and student communication on campus — scheduling, briefings and day-to-day logistics for the cell.",
    evidence: { label: "LinkedIn", href: "https://www.linkedin.com/in/mohd-mohsin-rizvi" },
  },
  {
    id: "chakravyuh",
    period: "Chakravyuh 1.0",
    kind: "recognition",
    title: "First Prize — Safety & Security, and overall First Prize",
    org: "Bansal Institute of Engineering & Technology, Lucknow",
    body: "Won both the Safety & Security domain prize and the overall first prize at Chakravyuh 1.0, an eight-hour hackathon.",
    evidence: { label: "LinkedIn", href: "https://www.linkedin.com/in/mohd-mohsin-rizvi" },
    featured: true,
  },
  {
    id: "amazon-ml",
    period: "2026",
    year: "2026",
    kind: "recognition",
    title: "Amazon ML Challenge — approx. top 3%",
    org: "Amazon machine learning challenge",
    body: "Four-person team, roughly 72 hours, large-scale business entity resolution. Score moved from 0.559 to 0.939309. A competition entry — not a win, and not advancement to a later round.",
    evidence: { label: "Case study", href: "/work/amazon-ml-challenge" },
    featured: true,
  },
  {
    id: "sih",
    period: "2026",
    year: "2026",
    kind: "recognition",
    title: "Smart India Hackathon — internal round",
    org: "Problem statement #26069",
    body: "Team ResQSix qualified through the Integral University internal selection round with a National Weather Big Data Analytics Platform. Not a national finalist result.",
    evidence: { label: "Case study", href: "/work/weather-big-data" },
  },
  {
    id: "research",
    period: "2026",
    year: "2026",
    kind: "work",
    title: "Independent research — Algorithm Discovery Lab",
    org: "Self-directed",
    body: "An ongoing open-source research platform for automated algorithm discovery: evolutionary search, exhaustive verification and statistical benchmarking, published under the MIT licence.",
    evidence: { label: "Repository", href: "https://github.com/mohdmohsinrizvi/algorithm-discovery-engine" },
  },
];

export type Credential = {
  name: string;
  issuer: string;
  type: "Certification" | "Job simulation" | "Virtual experience" | "Course";
  note?: string;
};

export const credentials: Credential[] = [
  {
    name: "Oracle Cloud Infrastructure AI Foundations Associate",
    issuer: "Oracle",
    type: "Certification",
  },
  {
    name: "Transformer-Based Natural Language Processing",
    issuer: "NVIDIA",
    type: "Course",
  },
  {
    name: "Introduction to Generative AI",
    issuer: "Google",
    type: "Course",
  },
  {
    name: "Solutions Architecture Job Simulation",
    issuer: "AWS",
    type: "Job simulation",
    note: "A simulated work experience, not an AWS employment or AWS certification.",
  },
  {
    name: "Technology & Cyber Job Simulations",
    issuer: "Deloitte",
    type: "Job simulation",
    note: "Simulated engagements, not employment at Deloitte.",
  },
  {
    name: "Software Engineering Job Simulation",
    issuer: "JPMorganChase",
    type: "Job simulation",
    note: "A simulated work experience, not employment at JPMorganChase.",
  },
];
