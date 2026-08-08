import { courses as fullCourses } from "@/data/courses";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type CatalogCategory =
  | "Languages"
  | "Web & Frontend"
  | "Backend & Frameworks"
  | "Databases"
  | "DevOps & Cloud"
  | "Data & AI"
  | "Cybersecurity"
  | "Computer Science";

export interface CatalogModule {
  title: string;
  lessons: string[];
}

export interface CatalogCourse {
  id: string;
  name: string;
  icon: string;
  category: CatalogCategory;
  difficulty: Difficulty;
  estimatedHours: number;
  description: string;
  skills: string[];
  prerequisites: string[];
  outcomes: string[];
  modules: CatalogModule[];
  /** "full" = interactive lessons available, "outline" = curriculum published, content in progress */
  status: "full" | "outline";
}

/* ------------------------------------------------------------------ */
/* Metadata for the 7 courses that already have full interactive content */
/* ------------------------------------------------------------------ */

interface FullMeta {
  category: CatalogCategory;
  difficulty: Difficulty;
  skills: string[];
  prerequisites: string[];
  outcomes: string[];
}

const FULL_META: Record<string, FullMeta> = {
  python: {
    category: "Languages",
    difficulty: "Beginner",
    skills: ["Python", "Programming basics", "OOP", "Automation"],
    prerequisites: [],
    outcomes: [
      "Write and run Python programs from scratch",
      "Use lists, dictionaries, functions and classes confidently",
      "Read and write files and handle errors safely",
    ],
  },
  c: {
    category: "Languages",
    difficulty: "Intermediate",
    skills: ["C", "Memory management", "Pointers", "Systems programming"],
    prerequisites: ["Basic programming logic"],
    outcomes: [
      "Understand how memory and pointers really work",
      "Build small command-line programs in C",
      "Compile, link and debug C code",
    ],
  },
  cpp: {
    category: "Languages",
    difficulty: "Intermediate",
    skills: ["C++", "OOP", "STL", "RAII"],
    prerequisites: ["C or another compiled language"],
    outcomes: [
      "Model problems with classes and templates",
      "Use the STL containers and algorithms",
      "Manage resources safely with smart pointers",
    ],
  },
  html: {
    category: "Web & Frontend",
    difficulty: "Beginner",
    skills: ["HTML", "Semantics", "Accessibility", "SEO"],
    prerequisites: [],
    outcomes: [
      "Structure any page with semantic HTML",
      "Build accessible forms and media",
      "Apply on-page SEO fundamentals",
    ],
  },
  css: {
    category: "Web & Frontend",
    difficulty: "Beginner",
    skills: ["CSS", "Flexbox", "Grid", "Responsive design"],
    prerequisites: ["HTML"],
    outcomes: [
      "Lay out any interface with Flexbox and Grid",
      "Design responsive, mobile-first pages",
      "Use variables, transitions and animation",
    ],
  },
  javascript: {
    category: "Languages",
    difficulty: "Beginner",
    skills: ["JavaScript", "DOM", "Async", "ES6+"],
    prerequisites: ["HTML", "CSS"],
    outcomes: [
      "Make pages interactive with the DOM",
      "Work with promises, async/await and fetch",
      "Write modern ES6+ JavaScript",
    ],
  },
  typescript: {
    category: "Languages",
    difficulty: "Intermediate",
    skills: ["TypeScript", "Static typing", "Generics", "Tooling"],
    prerequisites: ["JavaScript"],
    outcomes: [
      "Type real-world JavaScript codebases",
      "Use interfaces, unions and generics",
      "Catch bugs before they reach the browser",
    ],
  },
};

const CHUNK = 5;

const fromFullCourses = (): CatalogCourse[] =>
  fullCourses.map((c) => {
    const meta = FULL_META[c.id] ?? {
      category: "Languages" as CatalogCategory,
      difficulty: "Beginner" as Difficulty,
      skills: c.topics.slice(0, 4),
      prerequisites: [],
      outcomes: c.whyLearn.slice(0, 3),
    };
    const modules: CatalogModule[] = [];
    for (let i = 0; i < c.lessons.length; i += CHUNK) {
      const slice = c.lessons.slice(i, i + CHUNK);
      modules.push({
        title: `Module ${modules.length + 1} — ${slice[0].title}`,
        lessons: slice.map((l) => l.title),
      });
    }
    return {
      id: c.id,
      name: c.name,
      icon: c.icon,
      category: meta.category,
      difficulty: meta.difficulty,
      estimatedHours: parseInt(c.duration, 10) || 8,
      description: c.description,
      skills: meta.skills,
      prerequisites: meta.prerequisites,
      outcomes: meta.outcomes,
      modules,
      status: "full" as const,
    };
  });

/* ------------------------------------------------------------------ */
/* Outline courses — full curriculum metadata, lesson content in progress */
/* ------------------------------------------------------------------ */

type OutlineInput = [
  id: string,
  name: string,
  icon: string,
  category: CatalogCategory,
  difficulty: Difficulty,
  hours: number,
  description: string,
  skills: string[],
  prerequisites: string[],
  outcomes: string[],
  modules: [string, string[]][],
];

const OUTLINES: OutlineInput[] = [
  [
    "java", "Java", "☕", "Languages", "Intermediate", 14,
    "The enterprise workhorse — strongly typed, object-oriented, and everywhere from Android to banking systems.",
    ["Java", "OOP", "Collections", "JVM"], ["Basic programming logic"],
    ["Write idiomatic object-oriented Java", "Use collections, streams and generics", "Handle exceptions and build with Maven/Gradle"],
    [
      ["Java Foundations", ["Setting up the JDK", "Variables and types", "Control flow", "Methods", "Arrays"]],
      ["Object-Oriented Java", ["Classes and objects", "Inheritance", "Interfaces", "Abstract classes", "Records"]],
      ["Collections & Streams", ["List, Set, Map", "Iterators", "Generics", "Streams API", "Optional"]],
      ["Real Java", ["Exceptions", "File I/O", "Concurrency basics", "Maven & Gradle", "Unit testing with JUnit"]],
    ],
  ],
  [
    "csharp", "C#", "🎯", "Languages", "Intermediate", 13,
    "Microsoft's modern language powering .NET web APIs, desktop apps, and Unity games.",
    ["C#", ".NET", "LINQ", "Async"], ["Basic programming logic"],
    ["Build console and web apps with .NET", "Query data with LINQ", "Use async/await properly"],
    [
      ["C# Basics", ["Hello .NET", "Types and variables", "Control flow", "Methods", "Namespaces"]],
      ["OOP in C#", ["Classes and structs", "Properties", "Interfaces", "Inheritance", "Records"]],
      ["Working with Data", ["Collections", "LINQ queries", "Nullable types", "JSON serialization", "File I/O"]],
      ["Modern .NET", ["Async and tasks", "Dependency injection", "Minimal APIs", "Testing", "Publishing"]],
    ],
  ],
  [
    "go", "Go", "🐹", "Languages", "Intermediate", 10,
    "Google's fast, simple language for cloud services, CLIs and high-concurrency backends.",
    ["Go", "Concurrency", "APIs", "CLI tools"], ["Any programming experience"],
    ["Write idiomatic Go programs", "Use goroutines and channels safely", "Build an HTTP API with the standard library"],
    [
      ["Go Fundamentals", ["Installing Go", "Variables and types", "Functions", "Structs", "Slices and maps"]],
      ["Go Idioms", ["Methods and interfaces", "Error handling", "Packages and modules", "Pointers", "Generics"]],
      ["Concurrency", ["Goroutines", "Channels", "select", "sync package", "Context"]],
      ["Building Services", ["net/http basics", "JSON APIs", "Middleware", "Testing", "Deploying a Go binary"]],
    ],
  ],
  [
    "rust", "Rust", "🦀", "Languages", "Advanced", 16,
    "Memory-safe systems programming without a garbage collector — loved by developers worldwide.",
    ["Rust", "Ownership", "Traits", "Cargo"], ["C, C++ or another systems language"],
    ["Understand ownership, borrowing and lifetimes", "Model data with enums and traits", "Ship a Rust crate with Cargo"],
    [
      ["Getting Started", ["Cargo and rustc", "Variables and mutability", "Types", "Functions", "Control flow"]],
      ["Ownership", ["Ownership rules", "Borrowing", "Slices", "Lifetimes", "Smart pointers"]],
      ["Rust Types", ["Structs", "Enums and pattern matching", "Traits", "Generics", "Error handling"]],
      ["Real Rust", ["Modules and crates", "Collections", "Testing", "Concurrency with threads", "async/await"]],
    ],
  ],
  [
    "php", "PHP", "🐘", "Languages", "Beginner", 9,
    "Still powering most of the web — from WordPress to modern Laravel applications.",
    ["PHP", "Server-side", "Forms", "Sessions"], ["HTML basics"],
    ["Build dynamic server-rendered pages", "Handle forms, sessions and cookies", "Talk to a database with PDO"],
    [
      ["PHP Basics", ["Syntax and echo", "Variables and types", "Control flow", "Functions", "Arrays"]],
      ["Web PHP", ["Forms and $_POST", "Validation", "Sessions and cookies", "File uploads", "Includes and templates"]],
      ["PHP with Data", ["PDO and MySQL", "Prepared statements", "CRUD app", "Errors and logging", "JSON APIs"]],
      ["Modern PHP", ["Composer", "Namespaces", "OOP in PHP", "PSR standards", "Testing with PHPUnit"]],
    ],
  ],
  [
    "ruby", "Ruby", "💎", "Languages", "Beginner", 9,
    "An elegant, developer-happy language and the heart of Ruby on Rails.",
    ["Ruby", "Blocks", "Gems", "Scripting"], [],
    ["Write expressive Ruby scripts", "Use blocks, procs and lambdas", "Structure code with modules and gems"],
    [
      ["Ruby Basics", ["irb and your first script", "Variables", "Strings and symbols", "Control flow", "Methods"]],
      ["Collections & Blocks", ["Arrays", "Hashes", "Blocks", "Enumerable", "Procs and lambdas"]],
      ["Ruby Objects", ["Classes", "Modules and mixins", "Attribute accessors", "Exceptions", "Metaprogramming intro"]],
      ["Ruby Tooling", ["Gems and Bundler", "File I/O", "RSpec testing", "Rake tasks", "Building a CLI"]],
    ],
  ],
  [
    "kotlin", "Kotlin", "🟣", "Languages", "Intermediate", 11,
    "Concise, null-safe JVM language and the official choice for Android development.",
    ["Kotlin", "Android", "Coroutines", "Null safety"], ["Java or another OOP language"],
    ["Write concise, null-safe Kotlin", "Use coroutines for async work", "Build your first Android screen"],
    [
      ["Kotlin Basics", ["Setup", "val vs var", "Null safety", "Functions", "Control flow"]],
      ["Kotlin Types", ["Classes and data classes", "Sealed classes", "Extension functions", "Collections", "Lambdas"]],
      ["Coroutines", ["Suspend functions", "Scopes", "Flows", "Error handling", "Testing coroutines"]],
      ["Android Intro", ["Project structure", "Activities", "Jetpack Compose basics", "State", "Networking"]],
    ],
  ],
  [
    "swift", "Swift", "🕊️", "Languages", "Intermediate", 11,
    "Apple's modern language for iOS, macOS, watchOS and server-side development.",
    ["Swift", "iOS", "SwiftUI", "Optionals"], ["Any programming experience"],
    ["Write safe, expressive Swift", "Model data with structs, enums and protocols", "Build a SwiftUI screen"],
    [
      ["Swift Basics", ["Playgrounds", "Constants and variables", "Optionals", "Functions", "Control flow"]],
      ["Swift Types", ["Structs and classes", "Enums", "Protocols", "Extensions", "Generics"]],
      ["Working with Data", ["Collections", "Codable and JSON", "Error handling", "Closures", "Concurrency"]],
      ["SwiftUI Intro", ["Views and modifiers", "State and bindings", "Lists", "Navigation", "Networking in SwiftUI"]],
    ],
  ],
  [
    "react", "React", "⚛️", "Web & Frontend", "Intermediate", 14,
    "The most-used UI library on the web — build component-driven interfaces that scale.",
    ["React", "Components", "Hooks", "State management"], ["JavaScript"],
    ["Build UIs from reusable components", "Manage state with hooks", "Fetch data and handle loading/errors"],
    [
      ["React Foundations", ["Why React", "JSX", "Components and props", "Rendering lists", "Conditional rendering"]],
      ["State & Effects", ["useState", "Events", "useEffect", "Forms", "Lifting state up"]],
      ["Hooks in Depth", ["useRef", "useMemo and useCallback", "Custom hooks", "useContext", "useReducer"]],
      ["Real Apps", ["Routing", "Data fetching", "Error boundaries", "Performance", "Testing components"]],
    ],
  ],
  [
    "nextjs", "Next.js", "▲", "Web & Frontend", "Advanced", 12,
    "The production React framework: routing, server rendering, and full-stack APIs in one.",
    ["Next.js", "SSR", "Routing", "Full-stack React"], ["React"],
    ["Build multi-page React apps with file routing", "Choose between server and client rendering", "Ship API routes and server actions"],
    [
      ["Next Basics", ["Project setup", "App router", "Pages and layouts", "Linking and navigation", "Metadata"]],
      ["Rendering", ["Server vs client components", "Static generation", "Streaming", "Caching", "Loading states"]],
      ["Data", ["Fetching in server components", "Route handlers", "Server actions", "Forms", "Validation"]],
      ["Production", ["Images and fonts", "SEO", "Middleware", "Auth patterns", "Deployment"]],
    ],
  ],
  [
    "vue", "Vue", "💚", "Web & Frontend", "Intermediate", 10,
    "A progressive framework with a gentle learning curve and a delightful developer experience.",
    ["Vue", "Reactivity", "Components", "Pinia"], ["JavaScript"],
    ["Build reactive components with the Composition API", "Manage app state with Pinia", "Route between views"],
    [
      ["Vue Basics", ["Setup with Vite", "Template syntax", "Reactivity", "Directives", "Events"]],
      ["Components", ["Props and emits", "Slots", "Lifecycle", "Composition API", "Composables"]],
      ["App Structure", ["Vue Router", "Pinia state", "Forms", "Async data", "Transitions"]],
      ["Production", ["Testing", "Performance", "TypeScript with Vue", "SSR intro", "Deployment"]],
    ],
  ],
  [
    "angular", "Angular", "🅰️", "Web & Frontend", "Advanced", 14,
    "A complete, opinionated framework for large enterprise front-ends.",
    ["Angular", "RxJS", "DI", "TypeScript"], ["TypeScript"],
    ["Structure apps with modules and components", "Use dependency injection and services", "Handle async streams with RxJS"],
    [
      ["Angular Basics", ["CLI and workspace", "Components", "Templates", "Data binding", "Directives"]],
      ["Services & DI", ["Services", "Dependency injection", "HttpClient", "Interceptors", "Signals"]],
      ["Reactive Angular", ["Observables", "RxJS operators", "Forms", "Validation", "State patterns"]],
      ["Scale", ["Routing and guards", "Lazy loading", "Testing", "Performance", "Build and deploy"]],
    ],
  ],
  [
    "tailwind", "Tailwind CSS", "🌬️", "Web & Frontend", "Beginner", 6,
    "Utility-first CSS that lets you design directly in your markup — fast and consistent.",
    ["Tailwind", "Utility CSS", "Design systems", "Responsive"], ["CSS"],
    ["Style interfaces without writing custom CSS", "Build responsive, themeable designs", "Extract reusable component patterns"],
    [
      ["Getting Started", ["Why utility-first", "Installation", "Core utilities", "Spacing and sizing", "Colors"]],
      ["Layout", ["Flex utilities", "Grid utilities", "Responsive prefixes", "Positioning", "Container queries"]],
      ["Design System", ["Theme configuration", "Design tokens", "Dark mode", "Typography plugin", "Custom utilities"]],
      ["In Practice", ["Component patterns", "Animations", "Forms", "Accessibility", "Optimizing output"]],
    ],
  ],
  [
    "nodejs", "Node.js", "🟩", "Backend & Frameworks", "Intermediate", 12,
    "Run JavaScript on the server and build fast, event-driven backends.",
    ["Node.js", "Express", "REST APIs", "npm"], ["JavaScript"],
    ["Build a REST API from scratch", "Work with files, streams and the event loop", "Structure and deploy a Node service"],
    [
      ["Node Basics", ["Runtime and event loop", "Modules", "npm", "File system", "Environment variables"]],
      ["HTTP & Express", ["http module", "Express routing", "Middleware", "REST design", "Error handling"]],
      ["Data & Auth", ["Connecting a database", "Validation", "Sessions and JWT", "File uploads", "Logging"]],
      ["Production", ["Testing", "Streams", "Performance", "Security headers", "Deployment"]],
    ],
  ],
  [
    "django", "Django", "🎸", "Backend & Frameworks", "Intermediate", 13,
    "Python's batteries-included web framework — admin, ORM, auth and security out of the box.",
    ["Django", "ORM", "Templates", "Auth"], ["Python"],
    ["Model data with the Django ORM", "Build views, templates and forms", "Ship an authenticated web app"],
    [
      ["Django Basics", ["Project and apps", "URLs and views", "Templates", "Static files", "Settings"]],
      ["Models", ["ORM basics", "Migrations", "Relationships", "Querysets", "Admin site"]],
      ["Forms & Auth", ["Forms", "Validation", "User model", "Login and permissions", "Messages"]],
      ["Going Live", ["Django REST Framework intro", "Testing", "Caching", "Security checklist", "Deployment"]],
    ],
  ],
  [
    "fastapi", "FastAPI", "⚡", "Backend & Frameworks", "Intermediate", 8,
    "Modern, high-performance Python APIs with automatic docs and type-driven validation.",
    ["FastAPI", "Pydantic", "Async Python", "OpenAPI"], ["Python"],
    ["Build typed REST APIs quickly", "Validate requests with Pydantic", "Secure and document your endpoints"],
    [
      ["First API", ["Setup and uvicorn", "Path and query params", "Request bodies", "Response models", "Auto docs"]],
      ["Validation", ["Pydantic models", "Custom validators", "Error responses", "Dependencies", "Settings"]],
      ["Data & Auth", ["SQLAlchemy integration", "Async database access", "OAuth2 and JWT", "Background tasks", "File uploads"]],
      ["Production", ["Testing with httpx", "CORS", "Middleware", "Performance", "Deployment"]],
    ],
  ],
  [
    "laravel", "Laravel", "🔺", "Backend & Frameworks", "Intermediate", 12,
    "The PHP framework for artisans — elegant syntax, Eloquent ORM, and a huge ecosystem.",
    ["Laravel", "Eloquent", "Blade", "Artisan"], ["PHP"],
    ["Build MVC apps with Laravel", "Query with Eloquent relationships", "Handle auth, queues and mail"],
    [
      ["Laravel Basics", ["Installation", "Routing", "Controllers", "Blade templates", "Artisan"]],
      ["Eloquent", ["Migrations", "Models", "Relationships", "Seeding and factories", "Query builder"]],
      ["App Features", ["Validation", "Authentication", "Middleware", "File storage", "Mail and notifications"]],
      ["Scale", ["Queues and jobs", "Events", "API resources", "Testing", "Deployment"]],
    ],
  ],
  [
    "spring-boot", "Spring Boot", "🍃", "Backend & Frameworks", "Advanced", 14,
    "The industry standard for Java microservices and enterprise APIs.",
    ["Spring Boot", "REST", "JPA", "Dependency injection"], ["Java"],
    ["Build production REST services in Java", "Persist data with Spring Data JPA", "Secure endpoints with Spring Security"],
    [
      ["Spring Basics", ["Spring Initializr", "Beans and DI", "Configuration", "Profiles", "Actuator"]],
      ["Web Layer", ["REST controllers", "Request mapping", "Validation", "Exception handling", "DTOs"]],
      ["Data Layer", ["Spring Data JPA", "Entities and relationships", "Repositories", "Transactions", "Migrations with Flyway"]],
      ["Production", ["Spring Security", "JWT auth", "Testing", "Observability", "Docker deployment"]],
    ],
  ],
  [
    "sql", "SQL", "🗃️", "Databases", "Beginner", 8,
    "The universal language of data — query, filter, join and aggregate anything.",
    ["SQL", "Joins", "Aggregation", "Schema design"], [],
    ["Write confident SELECT queries", "Join multiple tables correctly", "Design normalized schemas"],
    [
      ["Query Basics", ["SELECT and FROM", "WHERE filters", "ORDER BY and LIMIT", "Operators", "NULL handling"]],
      ["Combining Data", ["INNER JOIN", "LEFT and RIGHT JOIN", "UNION", "Subqueries", "CTEs"]],
      ["Aggregation", ["COUNT, SUM, AVG", "GROUP BY", "HAVING", "Window functions", "Ranking"]],
      ["Designing Data", ["Tables and types", "Primary and foreign keys", "Normalization", "Indexes", "Transactions"]],
    ],
  ],
  [
    "postgresql", "PostgreSQL", "🐘", "Databases", "Intermediate", 10,
    "The world's most advanced open-source database — JSON, full-text search, extensions and more.",
    ["PostgreSQL", "Indexes", "JSONB", "Performance"], ["SQL"],
    ["Model and query data in Postgres", "Speed up queries with the right indexes", "Use advanced Postgres features"],
    [
      ["Postgres Basics", ["Installation and psql", "Data types", "Schemas", "Constraints", "Roles"]],
      ["Power Features", ["JSONB", "Arrays", "Full-text search", "Views and materialized views", "Extensions"]],
      ["Performance", ["EXPLAIN ANALYZE", "Index types", "Query tuning", "Partitioning", "Vacuum"]],
      ["Operations", ["Backups", "Replication basics", "Row-level security", "Migrations", "Monitoring"]],
    ],
  ],
  [
    "mysql", "MySQL", "🐬", "Databases", "Beginner", 8,
    "The most widely deployed open-source relational database, behind countless web apps.",
    ["MySQL", "Relational modeling", "Indexes", "Backups"], ["SQL"],
    ["Administer MySQL databases", "Write efficient queries", "Back up and restore data safely"],
    [
      ["Getting Started", ["Installing MySQL", "Clients and Workbench", "Databases and tables", "Data types", "Users and grants"]],
      ["Querying", ["CRUD statements", "Joins", "Aggregation", "Stored procedures", "Triggers"]],
      ["Performance", ["Indexes", "EXPLAIN", "Query cache patterns", "Storage engines", "Schema tuning"]],
      ["Operations", ["Backups with mysqldump", "Replication", "Security hardening", "Monitoring", "Upgrades"]],
    ],
  ],
  [
    "mongodb", "MongoDB", "🍃", "Databases", "Beginner", 7,
    "A flexible document database for rapidly evolving application data.",
    ["MongoDB", "Documents", "Aggregation", "Indexing"], ["Any programming language"],
    ["Model data as documents", "Query and aggregate collections", "Index for performance"],
    [
      ["Document Basics", ["Databases and collections", "Insert and find", "Update and delete", "Data types", "Schema design"]],
      ["Querying", ["Query operators", "Projection", "Sorting and paging", "Embedded documents", "Arrays"]],
      ["Aggregation", ["Pipeline stages", "$group and $match", "$lookup", "Faceted search", "Performance tips"]],
      ["Production", ["Indexes", "Transactions", "Replica sets", "Atlas basics", "Security"]],
    ],
  ],
  [
    "redis", "Redis", "🧱", "Databases", "Intermediate", 5,
    "Blazing-fast in-memory data store for caching, queues, sessions and real-time features.",
    ["Redis", "Caching", "Pub/Sub", "Rate limiting"], ["Basic backend experience"],
    ["Cache expensive work correctly", "Use Redis data structures well", "Build queues and rate limiters"],
    [
      ["Redis Basics", ["Installation and redis-cli", "Keys and expiry", "Strings", "Hashes", "Lists"]],
      ["Data Structures", ["Sets and sorted sets", "Streams", "Bitmaps", "HyperLogLog", "Geospatial"]],
      ["Patterns", ["Cache-aside", "Rate limiting", "Session storage", "Pub/Sub", "Distributed locks"]],
      ["Operations", ["Persistence", "Eviction policies", "Clustering", "Monitoring", "Security"]],
    ],
  ],
  [
    "git", "Git", "🌿", "DevOps & Cloud", "Beginner", 5,
    "Version control every developer must know — commit, branch, merge and never lose work.",
    ["Git", "Branching", "Merging", "Version control"], [],
    ["Track changes with confidence", "Branch and merge without fear", "Recover from mistakes"],
    [
      ["Git Basics", ["Repositories", "Staging and commits", "Status and log", "Ignoring files", "Diffs"]],
      ["Branching", ["Creating branches", "Merging", "Conflicts", "Rebasing", "Stashing"]],
      ["Remotes", ["Clone, push, pull", "Tracking branches", "Tags", "Fetch vs pull", "Forks"]],
      ["Recovery", ["Reset vs revert", "Reflog", "Cherry-pick", "Bisect", "Hooks"]],
    ],
  ],
  [
    "github", "GitHub", "🐙", "DevOps & Cloud", "Beginner", 4,
    "Collaborate like a professional team: pull requests, reviews, issues and CI.",
    ["GitHub", "Pull requests", "Code review", "Actions"], ["Git"],
    ["Collaborate through pull requests", "Automate checks with Actions", "Run an open-source-style workflow"],
    [
      ["Collaboration", ["Repos and README", "Issues", "Pull requests", "Reviews", "Projects"]],
      ["Workflow", ["Branch protection", "Conventional commits", "Templates", "Releases", "Discussions"]],
      ["Automation", ["Actions basics", "Workflow syntax", "CI for tests", "Secrets", "Deploy workflows"]],
      ["Presence", ["GitHub Pages", "Profile README", "Open source etiquette", "Licensing", "Security advisories"]],
    ],
  ],
  [
    "linux", "Linux", "🐧", "DevOps & Cloud", "Beginner", 9,
    "Command the operating system that runs the internet.",
    ["Linux", "Bash", "Permissions", "Systemd"], [],
    ["Navigate and script the shell", "Manage users, permissions and processes", "Administer a Linux server"],
    [
      ["The Shell", ["Filesystem layout", "Navigation commands", "Files and directories", "Pipes and redirection", "grep, sed, awk"]],
      ["Users & Permissions", ["Users and groups", "chmod and chown", "sudo", "SSH", "Environment"]],
      ["Processes & Services", ["ps and top", "Signals", "systemd units", "Cron jobs", "Logs"]],
      ["Bash Scripting", ["Variables", "Conditionals and loops", "Functions", "Arguments", "Practical scripts"]],
    ],
  ],
  [
    "networking", "Networking", "🌐", "DevOps & Cloud", "Beginner", 8,
    "How data actually travels — IP, DNS, TCP, HTTP and everything between the browser and the server.",
    ["Networking", "TCP/IP", "DNS", "HTTP"], [],
    ["Explain what happens when you load a URL", "Troubleshoot connectivity issues", "Understand ports, DNS and TLS"],
    [
      ["Foundations", ["OSI and TCP/IP models", "IP addressing", "Subnets", "Routing", "NAT"]],
      ["Core Protocols", ["TCP vs UDP", "Ports and sockets", "DNS", "DHCP", "ICMP and ping"]],
      ["The Web", ["HTTP/HTTPS", "TLS handshake", "Cookies and headers", "CDNs", "Load balancing"]],
      ["Troubleshooting", ["dig and nslookup", "traceroute", "netstat and ss", "tcpdump basics", "Firewalls"]],
    ],
  ],
  [
    "docker", "Docker", "🐳", "DevOps & Cloud", "Intermediate", 8,
    "Package any application into a portable container that runs identically everywhere.",
    ["Docker", "Containers", "Dockerfile", "Compose"], ["Linux basics"],
    ["Containerize any application", "Write efficient Dockerfiles", "Orchestrate services with Compose"],
    [
      ["Container Basics", ["Images vs containers", "docker run", "Ports and volumes", "Logs", "Cleanup"]],
      ["Building Images", ["Dockerfile syntax", "Layers and caching", "Multi-stage builds", "Image size", "Registries"]],
      ["Compose", ["docker compose up", "Services and networks", "Volumes", "Environment config", "Dev workflows"]],
      ["Production", ["Health checks", "Security scanning", "Resource limits", "Logging drivers", "CI integration"]],
    ],
  ],
  [
    "kubernetes", "Kubernetes", "☸️", "DevOps & Cloud", "Advanced", 14,
    "Orchestrate containers at scale — the backbone of modern cloud infrastructure.",
    ["Kubernetes", "Pods", "Helm", "Scaling"], ["Docker"],
    ["Deploy applications to a cluster", "Configure services, ingress and storage", "Scale and roll out safely"],
    [
      ["Cluster Basics", ["Architecture", "kubectl", "Pods", "ReplicaSets", "Deployments"]],
      ["Networking & Config", ["Services", "Ingress", "ConfigMaps", "Secrets", "Namespaces"]],
      ["State & Scaling", ["Volumes", "StatefulSets", "Autoscaling", "Jobs and CronJobs", "Rolling updates"]],
      ["Operations", ["Helm charts", "RBAC", "Monitoring", "Troubleshooting pods", "GitOps intro"]],
    ],
  ],
  [
    "cloud", "Cloud Fundamentals", "☁️", "DevOps & Cloud", "Beginner", 8,
    "Understand compute, storage, networking and billing across AWS, Azure and Google Cloud.",
    ["Cloud", "IaaS", "Serverless", "Cost control"], [],
    ["Choose the right cloud service for a workload", "Deploy a simple app to the cloud", "Control cost and access"],
    [
      ["Cloud Concepts", ["What is the cloud", "IaaS, PaaS, SaaS", "Regions and zones", "Shared responsibility", "Pricing models"]],
      ["Core Services", ["Virtual machines", "Object storage", "Managed databases", "Networking and VPCs", "Load balancers"]],
      ["Modern Cloud", ["Serverless functions", "Containers in the cloud", "Queues and events", "Managed identity", "Secrets management"]],
      ["Running It Well", ["Monitoring", "Cost optimization", "Backups", "Well-architected principles", "Deploying a real app"]],
    ],
  ],
  [
    "devops", "DevOps", "🔁", "DevOps & Cloud", "Intermediate", 10,
    "Ship faster and safer with CI/CD, automation, observability and a healthy engineering culture.",
    ["CI/CD", "Automation", "Monitoring", "Release engineering"], ["Git", "Linux basics"],
    ["Design a CI/CD pipeline", "Automate builds, tests and deploys", "Monitor systems and respond to incidents"],
    [
      ["DevOps Culture", ["Why DevOps", "Value stream", "Trunk-based development", "Environments", "Feature flags"]],
      ["CI/CD", ["Pipeline design", "Automated testing", "Artifacts", "Deployment strategies", "Rollbacks"]],
      ["Observability", ["Logs", "Metrics", "Tracing", "Alerting", "SLOs"]],
      ["Reliability", ["Incident response", "Postmortems", "Capacity planning", "Chaos basics", "Security in the pipeline"]],
    ],
  ],
  [
    "terraform", "Terraform", "🏗️", "DevOps & Cloud", "Advanced", 9,
    "Infrastructure as code — declare your cloud and version it like software.",
    ["Terraform", "IaC", "Modules", "State"], ["Cloud fundamentals"],
    ["Provision infrastructure declaratively", "Structure reusable modules", "Manage state safely in a team"],
    [
      ["Terraform Basics", ["Install and init", "Providers", "Resources", "Variables", "Outputs"]],
      ["Real Configurations", ["Data sources", "Expressions and functions", "Loops with for_each", "Conditionals", "Local values"]],
      ["Modules & State", ["Writing modules", "Registry modules", "Remote state", "State locking", "Workspaces"]],
      ["Team Practice", ["Plan reviews in CI", "Secrets handling", "Drift detection", "Importing resources", "Testing infrastructure"]],
    ],
  ],
  [
    "data-science", "Data Science", "📊", "Data & AI", "Intermediate", 14,
    "Turn raw data into insight: clean, analyze, visualize and communicate findings.",
    ["Data analysis", "Statistics", "Visualization", "Storytelling"], ["Python"],
    ["Run a full analysis from raw data to insight", "Apply core statistics correctly", "Communicate results with clear visuals"],
    [
      ["Foundations", ["The data science workflow", "Jupyter notebooks", "Data types", "Loading data", "Exploratory analysis"]],
      ["Statistics", ["Descriptive statistics", "Distributions", "Sampling", "Hypothesis testing", "Correlation vs causation"]],
      ["Wrangling", ["Missing data", "Outliers", "Feature engineering", "Joining datasets", "Time series basics"]],
      ["Communication", ["Matplotlib", "Seaborn", "Dashboards", "Reporting", "Case study project"]],
    ],
  ],
  [
    "numpy", "NumPy", "🔢", "Data & AI", "Beginner", 5,
    "The numerical foundation of Python — fast arrays and vectorized math.",
    ["NumPy", "Arrays", "Vectorization", "Linear algebra"], ["Python"],
    ["Work with n-dimensional arrays", "Replace loops with vectorized operations", "Do linear algebra in Python"],
    [
      ["Arrays", ["Creating arrays", "dtypes", "Shapes", "Indexing", "Slicing"]],
      ["Operations", ["Vectorized math", "Broadcasting", "Aggregations", "Boolean masks", "Sorting"]],
      ["Advanced", ["Reshaping", "Stacking and splitting", "Random numbers", "Linear algebra", "Performance"]],
    ],
  ],
  [
    "pandas", "Pandas", "🐼", "Data & AI", "Beginner", 7,
    "The go-to Python library for tabular data — load, clean, reshape and summarize.",
    ["Pandas", "DataFrames", "Cleaning", "GroupBy"], ["Python"],
    ["Load and clean messy datasets", "Reshape and aggregate data", "Prepare data for modelling"],
    [
      ["DataFrames", ["Series and DataFrames", "Reading CSV/Excel", "Selecting data", "Filtering", "Adding columns"]],
      ["Cleaning", ["Missing values", "Duplicates", "Type conversion", "String operations", "Dates"]],
      ["Reshaping", ["GroupBy", "Pivot tables", "Merging and joining", "Melt and stack", "Apply"]],
      ["Analysis", ["Summary statistics", "Time series", "Plotting", "Exporting", "Mini project"]],
    ],
  ],
  [
    "machine-learning", "Machine Learning", "🤖", "Data & AI", "Advanced", 16,
    "Train models that learn from data — regression, classification, evaluation and deployment.",
    ["ML", "scikit-learn", "Model evaluation", "Feature engineering"], ["Python", "Pandas"],
    ["Train and evaluate supervised models", "Avoid overfitting and data leakage", "Deploy a model behind an API"],
    [
      ["ML Foundations", ["What is ML", "Supervised vs unsupervised", "Train/test split", "Bias-variance", "Metrics"]],
      ["Core Algorithms", ["Linear regression", "Logistic regression", "Decision trees", "Random forests", "Gradient boosting"]],
      ["Practice", ["Feature engineering", "Pipelines", "Cross-validation", "Hyperparameter tuning", "Imbalanced data"]],
      ["Beyond Training", ["Unsupervised learning", "Model interpretation", "Serving models", "Monitoring drift", "Capstone project"]],
    ],
  ],
  [
    "deep-learning", "Deep Learning", "🧠", "Data & AI", "Advanced", 16,
    "Neural networks from the ground up — vision, sequences and modern architectures.",
    ["Neural networks", "PyTorch", "CNNs", "Transformers"], ["Machine Learning"],
    ["Build and train neural networks", "Apply CNNs and transformers", "Fine-tune pretrained models"],
    [
      ["Neural Basics", ["Perceptrons", "Activation functions", "Backpropagation", "Loss functions", "Optimizers"]],
      ["Training Well", ["Datasets and loaders", "Regularization", "Batch normalization", "Learning rate schedules", "GPU training"]],
      ["Architectures", ["CNNs", "RNNs and LSTMs", "Attention", "Transformers", "Autoencoders"]],
      ["Applied", ["Transfer learning", "Fine-tuning", "Evaluation", "Deployment", "Project"]],
    ],
  ],
  [
    "generative-ai", "Generative AI", "✨", "Data & AI", "Intermediate", 10,
    "Build applications on top of modern generative models — text, images, audio and agents.",
    ["Generative AI", "Prompting", "RAG", "Agents"], ["Any programming language"],
    ["Design effective prompts", "Ground models with your own data", "Build a working AI feature end to end"],
    [
      ["Foundations", ["How generative models work", "Tokens and context", "Temperature and sampling", "Modalities", "Limitations"]],
      ["Prompt Engineering", ["Instruction design", "Few-shot prompting", "Structured output", "Evaluation", "Guardrails"]],
      ["Grounding", ["Embeddings", "Vector search", "RAG pipelines", "Chunking strategies", "Citations"]],
      ["Applications", ["Tool calling", "Agents", "Streaming UX", "Cost and latency", "Shipping an AI feature"]],
    ],
  ],
  [
    "llms", "Large Language Models", "📚", "Data & AI", "Advanced", 12,
    "Go deeper on LLMs: architecture, fine-tuning, evaluation and production serving.",
    ["LLMs", "Fine-tuning", "Evaluation", "Inference"], ["Deep Learning"],
    ["Explain transformer-based LLM internals", "Fine-tune and evaluate a model", "Serve models efficiently"],
    [
      ["Architecture", ["Transformer recap", "Attention in depth", "Positional encoding", "Scaling laws", "Tokenizers"]],
      ["Training", ["Pretraining", "Instruction tuning", "RLHF and preference tuning", "LoRA and PEFT", "Datasets"]],
      ["Evaluation", ["Benchmarks", "LLM-as-judge", "Hallucination testing", "Safety evaluation", "Regression suites"]],
      ["Serving", ["Quantization", "Batching and KV cache", "Latency tuning", "Observability", "Cost management"]],
    ],
  ],
  [
    "cybersecurity", "Cybersecurity", "🛡️", "Cybersecurity", "Beginner", 12,
    "The fundamentals of protecting systems, data and people from attack.",
    ["Security", "Threat modeling", "Risk", "Hardening"], [],
    ["Speak the language of security", "Identify and rank real threats", "Harden systems and accounts"],
    [
      ["Security Basics", ["CIA triad", "Threats vs vulnerabilities", "Attack surface", "Risk management", "Security policies"]],
      ["Identity", ["Authentication", "Authorization", "MFA", "Password security", "Zero trust"]],
      ["Protecting Systems", ["Endpoint hardening", "Patch management", "Network security", "Backups", "Encryption basics"]],
      ["People & Process", ["Social engineering", "Security awareness", "Compliance overview", "Incident basics", "Career paths"]],
    ],
  ],
  [
    "ethical-hacking", "Ethical Hacking", "🕵️", "Cybersecurity", "Advanced", 14,
    "Think like an attacker — legally. Reconnaissance, exploitation and reporting.",
    ["Pentesting", "Recon", "Exploitation", "Reporting"], ["Networking", "Linux"],
    ["Run a structured penetration test", "Use industry tooling responsibly", "Write a professional findings report"],
    [
      ["Methodology", ["Rules of engagement", "Legal and ethics", "Kill chain", "Lab setup", "Reporting basics"]],
      ["Reconnaissance", ["OSINT", "Port scanning", "Service enumeration", "Web enumeration", "Vulnerability scanning"]],
      ["Exploitation", ["Common web exploits", "Password attacks", "Privilege escalation", "Pivoting", "Post-exploitation"]],
      ["Professional Practice", ["Evidence collection", "Risk scoring", "Remediation advice", "Client communication", "Capstone engagement"]],
    ],
  ],
  [
    "web-security", "Web Security", "🔒", "Cybersecurity", "Intermediate", 10,
    "Defend web applications against the OWASP Top 10 and beyond.",
    ["OWASP", "XSS", "SQL injection", "Secure coding"], ["Web development basics"],
    ["Find and fix common web vulnerabilities", "Apply secure coding practices", "Configure browser security controls"],
    [
      ["Attack Surface", ["HTTP security model", "Same-origin policy", "Cookies and sessions", "Threat modeling a web app", "Recon"]],
      ["OWASP Top 10", ["Injection", "Broken access control", "XSS", "SSRF", "Insecure design"]],
      ["Defenses", ["Input validation", "Output encoding", "CSP", "CSRF protection", "Secure headers"]],
      ["Operations", ["Dependency security", "Secrets management", "Logging and monitoring", "Pentest workflow", "Secure SDLC"]],
    ],
  ],
  [
    "cryptography", "Cryptography", "🔐", "Cybersecurity", "Advanced", 10,
    "The math and practice behind encryption, hashing, signatures and secure protocols.",
    ["Cryptography", "Encryption", "Hashing", "PKI"], ["Basic math", "Programming"],
    ["Choose the right primitive for a problem", "Avoid classic crypto mistakes", "Explain how TLS protects traffic"],
    [
      ["Foundations", ["History and terminology", "Randomness", "XOR and one-time pad", "Kerckhoffs's principle", "Threat models"]],
      ["Symmetric Crypto", ["Block ciphers", "AES", "Modes of operation", "Stream ciphers", "Authenticated encryption"]],
      ["Asymmetric Crypto", ["RSA", "Diffie-Hellman", "Elliptic curves", "Digital signatures", "PKI and certificates"]],
      ["Applied", ["Hashing and HMAC", "Password hashing", "TLS in depth", "Key management", "Common pitfalls"]],
    ],
  ],
  [
    "soc", "SOC Analyst", "📟", "Cybersecurity", "Intermediate", 12,
    "Work the blue-team front line: monitor, triage, investigate and respond.",
    ["SIEM", "Triage", "Incident response", "Threat intel"], ["Networking", "Cybersecurity basics"],
    ["Triage alerts like a tier-1 analyst", "Investigate incidents with logs", "Escalate and document properly"],
    [
      ["SOC Foundations", ["SOC roles and tiers", "Alert lifecycle", "Log sources", "Ticketing", "Metrics"]],
      ["Detection", ["SIEM basics", "Writing detection rules", "MITRE ATT&CK", "Threat intelligence", "False positives"]],
      ["Investigation", ["Windows event logs", "Network logs", "Endpoint telemetry", "Malware triage", "Timeline building"]],
      ["Response", ["Containment", "Eradication and recovery", "Reporting", "Tabletop exercises", "Continuous improvement"]],
    ],
  ],
  [
    "defensive-security", "Defensive Security", "🛠️", "Cybersecurity", "Intermediate", 11,
    "Build defenses that hold: hardening, detection engineering and resilient architecture.",
    ["Blue team", "Hardening", "Detection engineering", "Resilience"], ["Cybersecurity basics"],
    ["Harden systems against real attacks", "Engineer useful detections", "Design defense in depth"],
    [
      ["Defense Strategy", ["Defense in depth", "Asset inventory", "Baselines", "Least privilege", "Segmentation"]],
      ["Hardening", ["OS hardening", "Application hardening", "Cloud hardening", "Patch strategy", "Configuration management"]],
      ["Detection Engineering", ["Telemetry design", "Detection rules", "Tuning", "Deception", "Purple teaming"]],
      ["Resilience", ["Backups and recovery", "Business continuity", "Disaster recovery drills", "Ransomware readiness", "Program maturity"]],
    ],
  ],
  [
    "algorithms", "Algorithms", "🧮", "Computer Science", "Intermediate", 14,
    "The problem-solving toolkit behind every technical interview and efficient program.",
    ["Algorithms", "Complexity", "Recursion", "Problem solving"], ["Any programming language"],
    ["Analyze time and space complexity", "Apply the right algorithmic pattern", "Solve interview-level problems"],
    [
      ["Complexity", ["Big-O notation", "Time vs space", "Best/average/worst case", "Amortized analysis", "Benchmarking"]],
      ["Core Techniques", ["Searching", "Sorting", "Two pointers", "Sliding window", "Recursion"]],
      ["Advanced Patterns", ["Divide and conquer", "Greedy algorithms", "Dynamic programming", "Backtracking", "Graph algorithms"]],
      ["Interview Practice", ["Pattern recognition", "Edge cases", "Optimizing solutions", "Explaining your approach", "Mock problems"]],
    ],
  ],
  [
    "data-structures", "Data Structures", "🗂️", "Computer Science", "Intermediate", 12,
    "Choose the right structure and everything else gets easier.",
    ["Data structures", "Trees", "Graphs", "Hashing"], ["Any programming language"],
    ["Implement core data structures from scratch", "Pick the right structure per problem", "Reason about trade-offs"],
    [
      ["Linear Structures", ["Arrays", "Linked lists", "Stacks", "Queues", "Deques"]],
      ["Hashing", ["Hash functions", "Hash maps", "Collision handling", "Sets", "Caches"]],
      ["Trees", ["Binary trees", "Traversals", "BSTs", "Heaps", "Tries"]],
      ["Graphs", ["Representations", "BFS and DFS", "Shortest paths", "Union-Find", "Topological sort"]],
    ],
  ],
  [
    "system-design", "System Design", "🏛️", "Computer Science", "Advanced", 14,
    "Design systems that scale to millions of users — and explain them in interviews.",
    ["System design", "Scalability", "Caching", "Distributed systems"], ["Backend basics", "Databases"],
    ["Design scalable architectures", "Reason about trade-offs and bottlenecks", "Ace the system design interview"],
    [
      ["Building Blocks", ["Client-server model", "Load balancers", "Caching", "CDNs", "Queues"]],
      ["Data at Scale", ["SQL vs NoSQL", "Replication", "Sharding", "Consistency models", "CAP theorem"]],
      ["Reliability", ["Rate limiting", "Idempotency", "Retries and backoff", "Circuit breakers", "Observability"]],
      ["Case Studies", ["URL shortener", "News feed", "Chat system", "Video streaming", "Interview framework"]],
    ],
  ],
  [
    "software-engineering", "Software Engineering", "🧭", "Computer Science", "Beginner", 10,
    "Everything around the code: testing, reviews, architecture, teamwork and craft.",
    ["Engineering practice", "Testing", "Clean code", "Agile"], ["Any programming language"],
    ["Write maintainable, tested code", "Collaborate effectively on a team", "Take a feature from idea to production"],
    [
      ["Craft", ["Clean code principles", "Naming and structure", "Refactoring", "Code smells", "Documentation"]],
      ["Testing", ["Unit tests", "Integration tests", "Test doubles", "TDD", "Coverage that matters"]],
      ["Design", ["SOLID principles", "Design patterns", "Layered architecture", "API design", "Technical debt"]],
      ["Teamwork", ["Agile and scrum", "Code review", "Estimation", "Incident culture", "Career growth"]],
    ],
  ],
];

const outlineCourses: CatalogCourse[] = OUTLINES.map(
  ([id, name, icon, category, difficulty, estimatedHours, description, skills, prerequisites, outcomes, modules]) => ({
    id,
    name,
    icon,
    category,
    difficulty,
    estimatedHours,
    description,
    skills,
    prerequisites,
    outcomes,
    modules: modules.map(([title, lessons]) => ({ title, lessons })),
    status: "outline" as const,
  })
);

export const catalog: CatalogCourse[] = [...fromFullCourses(), ...outlineCourses];

export const catalogCategories: CatalogCategory[] = [
  "Languages",
  "Web & Frontend",
  "Backend & Frameworks",
  "Databases",
  "DevOps & Cloud",
  "Data & AI",
  "Cybersecurity",
  "Computer Science",
];

export const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export const getCatalogCourse = (id?: string) => catalog.find((c) => c.id === id);

export const lessonCount = (c: CatalogCourse) =>
  c.modules.reduce((n, m) => n + m.lessons.length, 0);
