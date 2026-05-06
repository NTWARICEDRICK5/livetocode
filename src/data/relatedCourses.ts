export interface RelatedCourse {
  name: string;
  description: string;
  icon: string;
  color: string;
  level: string;
  category: string;
  url: string;
  related: string[];
}

export const relatedCourses: RelatedCourse[] = [
  {
    name: "TypeScript",
    description: "Strongly-typed superset of JavaScript for safer, scalable apps.",
    icon: "🟦",
    color: "linear-gradient(135deg, #3178C6, #235A97)",
    level: "Intermediate",
    category: "Web",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    related: ["JavaScript"],
  },
  {
    name: "React",
    description: "Build modern, interactive user interfaces with components.",
    icon: "⚛️",
    color: "linear-gradient(135deg, #61DAFB, #2D8CB8)",
    level: "Intermediate",
    category: "Web",
    url: "https://react.dev/learn",
    related: ["JavaScript", "HTML", "CSS"],
  },
  {
    name: "Node.js",
    description: "Run JavaScript on the server and build powerful backends.",
    icon: "🟢",
    color: "linear-gradient(135deg, #339933, #1F6F1F)",
    level: "Intermediate",
    category: "Backend",
    url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
    related: ["JavaScript"],
  },
  {
    name: "Django",
    description: "High-level Python web framework for rapid development.",
    icon: "🎯",
    color: "linear-gradient(135deg, #092E20, #44B78B)",
    level: "Intermediate",
    category: "Backend",
    url: "https://docs.djangoproject.com/en/stable/intro/tutorial01/",
    related: ["Python"],
  },
  {
    name: "NumPy & Pandas",
    description: "The data science stack for Python — arrays, dataframes, analytics.",
    icon: "📊",
    color: "linear-gradient(135deg, #013243, #4DABCF)",
    level: "Intermediate",
    category: "Data",
    url: "https://numpy.org/learn/",
    related: ["Python"],
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework for building beautiful UIs fast.",
    icon: "🎨",
    color: "linear-gradient(135deg, #06B6D4, #0EA5E9)",
    level: "Beginner",
    category: "Web",
    url: "https://tailwindcss.com/docs/installation",
    related: ["CSS", "HTML"],
  },
  {
    name: "SQL & Databases",
    description: "Query, design and manage relational databases like a pro.",
    icon: "🗄️",
    color: "linear-gradient(135deg, #336791, #1F4060)",
    level: "Beginner",
    category: "Data",
    url: "https://www.sqltutorial.org/",
    related: ["Python", "JavaScript"],
  },
  {
    name: "Git & GitHub",
    description: "Version control essentials every developer must know.",
    icon: "🔧",
    color: "linear-gradient(135deg, #F05032, #B83A26)",
    level: "Beginner",
    category: "Tools",
    url: "https://docs.github.com/en/get-started/quickstart/hello-world",
    related: ["All"],
  },
  {
    name: "Rust",
    description: "Memory-safe systems language — a modern alternative to C/C++.",
    icon: "🦀",
    color: "linear-gradient(135deg, #DEA584, #A0522D)",
    level: "Advanced",
    category: "Systems",
    url: "https://doc.rust-lang.org/book/",
    related: ["C", "C++"],
  },
];
