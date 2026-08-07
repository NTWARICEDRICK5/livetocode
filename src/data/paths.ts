export interface PathStep {
  title: string;
  summary: string;
  courseId?: string;
  outcomes: string[];
}

export interface LearningPath {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  level: string;
  duration: string;
  description: string;
  careers: string[];
  steps: PathStep[];
}

export const paths: LearningPath[] = [
  {
    id: "software-engineering",
    name: "Software Engineering",
    tagline: "From your first line of code to building full applications.",
    icon: "🧑‍💻",
    level: "Beginner → Advanced",
    duration: "~6 months",
    description:
      "The core engineering track. You learn programming fundamentals, then data structures and algorithms, then how to build real backend and frontend systems — finishing with system design thinking.",
    careers: ["Software Engineer", "Full-Stack Developer", "Backend Engineer"],
    steps: [
      {
        title: "Programming Fundamentals",
        summary: "Variables, control flow, functions and problem decomposition using Python.",
        courseId: "python",
        outcomes: ["Read and write clean code", "Debug logic errors", "Think in small functions"],
      },
      {
        title: "Systems Thinking with C",
        summary: "Memory, pointers and how a computer actually executes your program.",
        courseId: "c",
        outcomes: ["Understand memory layout", "Manage allocation safely", "Reason about performance"],
      },
      {
        title: "Data Structures & Algorithms",
        summary: "Arrays, lists, maps, trees, sorting and searching using C++ containers.",
        courseId: "cpp",
        outcomes: ["Pick the right structure", "Analyse complexity", "Solve interview problems"],
      },
      {
        title: "Frontend Development",
        summary: "Structure with HTML, style with CSS, add behaviour with JavaScript.",
        courseId: "html",
        outcomes: ["Build accessible pages", "Responsive layouts", "DOM interaction"],
      },
      {
        title: "Modern JavaScript & TypeScript",
        summary: "Async programming, modules, typing and safe large-codebase patterns.",
        courseId: "typescript",
        outcomes: ["Write typed code", "Handle async flows", "Structure real projects"],
      },
      {
        title: "System Design",
        summary: "APIs, databases, caching and how to scale an application.",
        outcomes: ["Design an API", "Model data", "Explain trade-offs"],
      },
    ],
  },
  {
    id: "ai-engineering",
    name: "AI & Data Engineering",
    tagline: "Build intelligent systems on top of solid programming skills.",
    icon: "🤖",
    level: "Beginner → Advanced",
    duration: "~5 months",
    description:
      "Start with Python mastery, add data handling and mathematics intuition, then work with models, prompts and AI-powered applications.",
    careers: ["AI Engineer", "Data Engineer", "ML Practitioner"],
    steps: [
      {
        title: "Python Mastery",
        summary: "The language of AI — data types, comprehensions, OOP and file I/O.",
        courseId: "python",
        outcomes: ["Fluent Python", "Work with files and APIs", "Write reusable modules"],
      },
      {
        title: "Data Handling",
        summary: "Cleaning, transforming and exploring datasets programmatically.",
        outcomes: ["Load and clean data", "Aggregate and summarise", "Spot data problems"],
      },
      {
        title: "Applied Machine Learning",
        summary: "Training, evaluating and reasoning about model quality.",
        outcomes: ["Train a model", "Evaluate honestly", "Avoid overfitting"],
      },
      {
        title: "AI Application Development",
        summary: "Wiring models into products with JavaScript/TypeScript frontends.",
        courseId: "typescript",
        outcomes: ["Call model APIs", "Stream responses", "Ship an AI feature"],
      },
    ],
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    tagline: "Run and scale the systems other engineers build.",
    icon: "☁️",
    level: "Intermediate",
    duration: "~4 months",
    description:
      "Linux, networking, servers, containers and delivery pipelines — the infrastructure half of modern engineering.",
    careers: ["DevOps Engineer", "Cloud Engineer", "SRE"],
    steps: [
      {
        title: "Scripting Foundations",
        summary: "Automate everything with Python scripts and the command line.",
        courseId: "python",
        outcomes: ["Automate tasks", "Parse logs", "Write CLI tools"],
      },
      {
        title: "Linux & Networking",
        summary: "Processes, permissions, DNS, HTTP and how machines talk.",
        outcomes: ["Navigate Linux", "Debug networking", "Understand HTTP"],
      },
      {
        title: "Containers & Deployment",
        summary: "Packaging apps, images, orchestration and rollout strategies.",
        outcomes: ["Containerise an app", "Deploy safely", "Roll back"],
      },
      {
        title: "CI/CD & Monitoring",
        summary: "Automated testing, pipelines, observability and incident response.",
        outcomes: ["Build a pipeline", "Add alerts", "Diagnose outages"],
      },
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    tagline: "Understand systems deeply enough to defend them.",
    icon: "🛡️",
    level: "Intermediate",
    duration: "~4 months",
    description:
      "Computer fundamentals, web security, secure coding and defensive engineering — built on real programming skill, not tools alone.",
    careers: ["Security Engineer", "AppSec Analyst", "Penetration Tester"],
    steps: [
      {
        title: "Computer Fundamentals",
        summary: "Memory, buffers and why low-level bugs become vulnerabilities.",
        courseId: "c",
        outcomes: ["Understand buffers", "Spot unsafe code", "Reason about memory"],
      },
      {
        title: "Web Fundamentals",
        summary: "How browsers, HTML and JavaScript execution create attack surface.",
        courseId: "javascript",
        outcomes: ["Understand the DOM", "See XSS vectors", "Sanitise input"],
      },
      {
        title: "Secure Coding",
        summary: "Validation, authentication, secrets handling and least privilege.",
        outcomes: ["Validate input", "Store secrets safely", "Design authz"],
      },
      {
        title: "Defensive Engineering",
        summary: "Threat modelling, logging, monitoring and response playbooks.",
        outcomes: ["Model threats", "Audit a system", "Respond to incidents"],
      },
    ],
  },
];

export const getPath = (id?: string) => paths.find((p) => p.id === id);
