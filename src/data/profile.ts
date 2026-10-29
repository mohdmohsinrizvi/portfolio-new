export type SkillGroup = {
  label: string;
  items: string[];
};

export const profile = {
  displayName: "MOHSIN",
  legalName: "Syed Mohd Mohsin Rizvi",
  roles: ["Creative Developer", "Full-Stack Engineer", "AI & ML Explorer"],
  location: "Lucknow, Uttar Pradesh, India",
  timezoneLabel: "IST · UTC+5:30",
  education: {
    degree: "B.Tech, Computer Science and Engineering",
    university: "Integral University, Lucknow",
    period: "2024 — 2028",
  },
  tagline: "Developer. Explorer. Builder.",
  intro:
    "I build digital experiences and explore the systems behind them.",
  statement:
    "A computer science undergraduate working across software engineering, artificial intelligence and interactive digital experiences — turning questions into systems that actually run.",
  headline: "Curiosity is the starting point.",
  subhead:
    "I like understanding how things work — and building things that work better.",
  closingHeadline: "Have something worth building?",
  closingCopy:
    "Let's turn an interesting idea into something real.",
  social: {
    linkedin: "https://www.linkedin.com/in/mohd-mohsin-rizvi",
    github: "https://github.com/mohdmohsinrizvi",
  },
  // No public e-mail address has been verified, so none is published.
  email: null as string | null,
  resumeUrl: null as string | null,
} as const;

export const responsibilities = [
  {
    role: "Campus Ambassador",
    org: "E-Cell, IIT Bombay",
    note: "Student representative role run through E-Cell's campus programme. Not an employment or enrolment at IIT Bombay.",
    kind: "community" as const,
  },
  {
    role: "Student Coordinator",
    org: "Placement Cell, Integral University",
    note: "Coordinating campus placement activity and student communication.",
    kind: "community" as const,
  },
  {
    role: "Freelance Developer",
    org: "Independent",
    note: "Website and web-application development for small businesses and student platforms.",
    kind: "work" as const,
  },
];

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Kotlin", "Java", "C++", "SQL"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Three.js"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "REST APIs", "FastAPI"],
  },
  {
    label: "AI / ML",
    items: [
      "Pandas",
      "NumPy",
      "scikit-learn",
      "Entity resolution",
      "Bipartite matching",
      "Evolutionary search",
    ],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "SQLite", "Firebase"],
  },
  {
    label: "Tools",
    items: ["Git", "Vite", "Android Studio", "Gradle", "Playwright"],
  },
  {
    label: "Cloud",
    items: ["AWS (foundations)", "Oracle Cloud (foundations)", "Netlify", "Render"],
  },
  {
    label: "Hardware / IoT",
    items: ["ESP32", "Arduino", "BLE", "Sensors", "UDP telemetry"],
  },
];

export const interests = [
  "Software Engineering",
  "Full-Stack Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Research",
  "Cybersecurity",
  "Cloud Computing",
  "IoT",
  "Creative Web Development",
  "Entrepreneurship",
];
