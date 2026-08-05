export interface Template {
  id: string;
  name: string;
  category: "Landing" | "Portfolio" | "Dashboard" | "Component" | "Form" | "Blog";
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  tags: string[];
  code: string;
}

export const templates: Template[] = [
  {
    id: "hero-landing",
    name: "Startup Landing Page",
    category: "Landing",
    level: "Beginner",
    description: "A responsive hero section with navigation, headline, call-to-action buttons and feature cards.",
    tags: ["flexbox", "grid", "responsive", "gradient"],
    code: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Nova — Ship faster</title>
<style>
  :root { --bg:#0b1220; --card:#121a2b; --text:#e6edf7; --muted:#93a4c0; --accent:#22d3ee; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family: system-ui, sans-serif; background:var(--bg); color:var(--text); }
  nav { display:flex; justify-content:space-between; align-items:center; padding:20px 32px; }
  .logo { font-weight:800; font-size:20px; }
  .logo span { color:var(--accent); }
  nav a { color:var(--muted); text-decoration:none; margin-left:20px; font-size:14px; }
  nav a:hover { color:var(--text); }
  header { text-align:center; padding:90px 24px; }
  header h1 { font-size:clamp(32px, 6vw, 60px); line-height:1.05; margin-bottom:18px; }
  header h1 em { font-style:normal; color:var(--accent); }
  header p { color:var(--muted); max-width:560px; margin:0 auto 30px; font-size:18px; }
  .btn { display:inline-block; padding:14px 26px; border-radius:12px; font-weight:700; text-decoration:none; }
  .btn.primary { background:var(--accent); color:#06202a; box-shadow:0 12px 40px rgba(34,211,238,.28); }
  .btn.ghost { border:1px solid #26344d; color:var(--muted); margin-left:10px; }
  .features { display:grid; gap:18px; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); padding:0 32px 80px; max-width:1080px; margin:0 auto; }
  .card { background:var(--card); border:1px solid #1e2a41; border-radius:16px; padding:24px; }
  .card h3 { margin-bottom:8px; font-size:17px; }
  .card p { color:var(--muted); font-size:14px; line-height:1.6; }
</style>
</head>
<body>
  <nav>
    <div class="logo">Nova<span>.</span></div>
    <div><a href="#">Product</a><a href="#">Pricing</a><a href="#">Docs</a></div>
  </nav>
  <header>
    <h1>Build and ship <em>10x faster</em></h1>
    <p>Everything your team needs to design, build and deploy modern products — in one place.</p>
    <a class="btn primary" href="#">Get started free</a>
    <a class="btn ghost" href="#">Live demo</a>
  </header>
  <section class="features">
    <div class="card"><h3>⚡ Fast</h3><p>Instant builds and previews so you never wait on your tools.</p></div>
    <div class="card"><h3>🔒 Secure</h3><p>Best-practice security defaults on every project you create.</p></div>
    <div class="card"><h3>🌍 Global</h3><p>Deployed to the edge in 30+ regions with a single click.</p></div>
  </section>
</body>
</html>`,
  },
  {
    id: "portfolio",
    name: "Developer Portfolio",
    category: "Portfolio",
    level: "Beginner",
    description: "A personal portfolio with avatar, bio, skill chips and a project grid.",
    tags: ["grid", "cards", "personal-site"],
    code: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Alex Doe — Developer</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:system-ui,sans-serif; background:#0f1117; color:#eef2f8; padding:48px 24px; }
  .wrap { max-width:880px; margin:0 auto; }
  .top { display:flex; gap:22px; align-items:center; flex-wrap:wrap; }
  .avatar { width:88px; height:88px; border-radius:50%; background:linear-gradient(135deg,#22d3ee,#6366f1); display:grid; place-items:center; font-size:32px; font-weight:800; color:#0b1220; }
  h1 { font-size:30px; }
  .role { color:#8fa0bd; margin-top:4px; }
  .chips { margin:26px 0 40px; display:flex; flex-wrap:wrap; gap:8px; }
  .chip { padding:6px 12px; border-radius:999px; background:#171b26; border:1px solid #242a3a; font-size:13px; color:#b9c6dd; }
  h2 { font-size:18px; margin-bottom:14px; }
  .grid { display:grid; gap:16px; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); }
  .proj { background:#141824; border:1px solid #222836; border-radius:14px; padding:18px; transition:.2s; }
  .proj:hover { transform:translateY(-4px); border-color:#22d3ee66; }
  .proj h3 { font-size:16px; margin-bottom:6px; }
  .proj p { color:#8fa0bd; font-size:14px; line-height:1.6; }
  footer { margin-top:48px; color:#63718c; font-size:13px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div class="avatar">A</div>
      <div>
        <h1>Alex Doe</h1>
        <div class="role">Full-stack developer · Kigali, Rwanda</div>
      </div>
    </div>
    <div class="chips">
      <span class="chip">Python</span><span class="chip">TypeScript</span>
      <span class="chip">C++</span><span class="chip">HTML/CSS</span><span class="chip">SQL</span>
    </div>
    <h2>Selected projects</h2>
    <div class="grid">
      <div class="proj"><h3>TaskFlow</h3><p>A realtime kanban board built with TypeScript and websockets.</p></div>
      <div class="proj"><h3>PixelSort</h3><p>Image processing tool written in C++ with a web front-end.</p></div>
      <div class="proj"><h3>StudyBuddy</h3><p>Spaced-repetition flashcards with offline support.</p></div>
    </div>
    <footer>© 2026 Alex Doe · alex@example.com</footer>
  </div>
</body>
</html>`,
  },
  {
    id: "pricing",
    name: "Pricing Table",
    category: "Component",
    level: "Intermediate",
    description: "Three-tier pricing cards with a highlighted plan and feature lists.",
    tags: ["grid", "pricing", "cards"],
    code: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Pricing</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:system-ui,sans-serif; background:#f7f8fb; color:#101828; padding:56px 20px; }
  h1 { text-align:center; font-size:34px; margin-bottom:8px; }
  .sub { text-align:center; color:#667085; margin-bottom:40px; }
  .plans { display:grid; gap:20px; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); max-width:1000px; margin:0 auto; }
  .plan { background:#fff; border:1px solid #e4e7ec; border-radius:18px; padding:28px; }
  .plan.featured { border:2px solid #0ea5b7; transform:scale(1.03); box-shadow:0 20px 50px rgba(14,165,183,.15); }
  .badge { display:inline-block; font-size:12px; font-weight:700; color:#0ea5b7; background:#e6fbfd; padding:4px 10px; border-radius:999px; margin-bottom:12px; }
  .price { font-size:38px; font-weight:800; margin:10px 0 4px; }
  .price small { font-size:14px; font-weight:500; color:#667085; }
  ul { list-style:none; margin:18px 0 24px; }
  li { padding:7px 0; color:#475467; font-size:14px; }
  li::before { content:"✓ "; color:#0ea5b7; font-weight:800; }
  button { width:100%; padding:12px; border:0; border-radius:10px; font-weight:700; cursor:pointer; background:#101828; color:#fff; }
  .featured button { background:#0ea5b7; }
</style>
</head>
<body>
  <h1>Simple, transparent pricing</h1>
  <p class="sub">Start free. Upgrade when you grow.</p>
  <div class="plans">
    <div class="plan">
      <div class="badge">Starter</div>
      <div class="price">$0 <small>/mo</small></div>
      <ul><li>3 projects</li><li>Community support</li><li>1 GB storage</li></ul>
      <button>Get started</button>
    </div>
    <div class="plan featured">
      <div class="badge">Pro · popular</div>
      <div class="price">$19 <small>/mo</small></div>
      <ul><li>Unlimited projects</li><li>Priority support</li><li>100 GB storage</li><li>Custom domain</li></ul>
      <button>Start free trial</button>
    </div>
    <div class="plan">
      <div class="badge">Team</div>
      <div class="price">$49 <small>/mo</small></div>
      <ul><li>Everything in Pro</li><li>10 seats</li><li>SSO &amp; audit logs</li></ul>
      <button>Contact sales</button>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: "login-form",
    name: "Login Form",
    category: "Form",
    level: "Beginner",
    description: "A centered glass login card with inputs, validation styles and a social button.",
    tags: ["forms", "flexbox", "glassmorphism"],
    code: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Sign in</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { min-height:100vh; display:grid; place-items:center; font-family:system-ui,sans-serif;
         background:radial-gradient(1000px 600px at 20% 10%, #1b2a4a, #070b14); color:#e8eefb; padding:24px; }
  .card { width:100%; max-width:380px; padding:32px; border-radius:20px;
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12); backdrop-filter:blur(14px); }
  h1 { font-size:24px; margin-bottom:6px; }
  p.sub { color:#93a4c0; font-size:14px; margin-bottom:24px; }
  label { display:block; font-size:13px; margin:14px 0 6px; color:#b7c4da; }
  input { width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3550; background:#0d1424; color:#e8eefb; outline:none; }
  input:focus { border-color:#22d3ee; box-shadow:0 0 0 3px rgba(34,211,238,.18); }
  button { width:100%; margin-top:22px; padding:13px; border:0; border-radius:10px; font-weight:700;
           background:#22d3ee; color:#06202a; cursor:pointer; }
  .alt { margin-top:12px; width:100%; padding:12px; border-radius:10px; background:transparent;
         border:1px solid #2a3550; color:#cbd6e8; cursor:pointer; }
  .foot { margin-top:18px; text-align:center; font-size:13px; color:#93a4c0; }
  .foot a { color:#22d3ee; text-decoration:none; }
</style>
</head>
<body>
  <form class="card" onsubmit="event.preventDefault(); alert('Signed in!')">
    <h1>Welcome back</h1>
    <p class="sub">Sign in to continue learning.</p>
    <label for="email">Email</label>
    <input id="email" type="email" placeholder="you@example.com" required />
    <label for="pw">Password</label>
    <input id="pw" type="password" placeholder="••••••••" required />
    <button type="submit">Sign in</button>
    <button class="alt" type="button">Continue with Google</button>
    <div class="foot">No account? <a href="#">Create one</a></div>
  </form>
</body>
</html>`,
  },
  {
    id: "dashboard",
    name: "Analytics Dashboard",
    category: "Dashboard",
    level: "Advanced",
    description: "Sidebar layout with stat cards and a pure-CSS bar chart.",
    tags: ["grid", "sidebar", "charts", "layout"],
    code: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dashboard</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:system-ui,sans-serif; background:#0b0f1a; color:#e7edf8; display:grid; grid-template-columns:220px 1fr; min-height:100vh; }
  aside { background:#0e1424; border-right:1px solid #1c2438; padding:24px 16px; }
  .brand { font-weight:800; margin-bottom:26px; }
  .brand span { color:#22d3ee; }
  nav a { display:block; padding:10px 12px; border-radius:9px; color:#93a4c0; text-decoration:none; font-size:14px; margin-bottom:4px; }
  nav a.active, nav a:hover { background:#161e31; color:#e7edf8; }
  main { padding:28px; }
  h1 { font-size:22px; margin-bottom:20px; }
  .stats { display:grid; gap:16px; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); margin-bottom:26px; }
  .stat { background:#111828; border:1px solid #1e2739; border-radius:14px; padding:18px; }
  .stat .k { color:#8fa0bd; font-size:13px; }
  .stat .v { font-size:26px; font-weight:800; margin-top:6px; }
  .stat .d { font-size:12px; color:#34d399; margin-top:4px; }
  .panel { background:#111828; border:1px solid #1e2739; border-radius:14px; padding:20px; }
  .chart { display:flex; align-items:flex-end; gap:12px; height:180px; margin-top:18px; }
  .bar { flex:1; background:linear-gradient(180deg,#22d3ee,#3b82f6); border-radius:8px 8px 0 0; position:relative; }
  .bar span { position:absolute; bottom:-22px; width:100%; text-align:center; font-size:11px; color:#8fa0bd; }
</style>
</head>
<body>
  <aside>
    <div class="brand">Pulse<span>.</span></div>
    <nav>
      <a class="active" href="#">Overview</a><a href="#">Users</a>
      <a href="#">Revenue</a><a href="#">Settings</a>
    </nav>
  </aside>
  <main>
    <h1>Overview</h1>
    <div class="stats">
      <div class="stat"><div class="k">Active users</div><div class="v">12,480</div><div class="d">▲ 8.2%</div></div>
      <div class="stat"><div class="k">Revenue</div><div class="v">$38.2k</div><div class="d">▲ 3.1%</div></div>
      <div class="stat"><div class="k">Courses done</div><div class="v">2,914</div><div class="d">▲ 12%</div></div>
      <div class="stat"><div class="k">Churn</div><div class="v">1.4%</div><div class="d">▼ 0.3%</div></div>
    </div>
    <div class="panel">
      <strong>Weekly signups</strong>
      <div class="chart">
        <div class="bar" style="height:45%"><span>Mon</span></div>
        <div class="bar" style="height:70%"><span>Tue</span></div>
        <div class="bar" style="height:55%"><span>Wed</span></div>
        <div class="bar" style="height:88%"><span>Thu</span></div>
        <div class="bar" style="height:64%"><span>Fri</span></div>
        <div class="bar" style="height:98%"><span>Sat</span></div>
        <div class="bar" style="height:38%"><span>Sun</span></div>
      </div>
    </div>
  </main>
</body>
</html>`,
  },
  {
    id: "blog",
    name: "Blog Article Layout",
    category: "Blog",
    level: "Intermediate",
    description: "Readable article page with typography scale, cover image and author footer.",
    tags: ["typography", "article", "readability"],
    code: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Learning to code in 2026</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:Georgia, serif; background:#fbfaf7; color:#1f2933; line-height:1.75; }
  .cover { height:220px; background:linear-gradient(120deg,#0ea5b7,#6366f1); }
  article { max-width:680px; margin:-60px auto 60px; background:#fff; padding:44px; border-radius:16px; box-shadow:0 20px 50px rgba(16,24,40,.08); }
  .kicker { font-family:system-ui,sans-serif; text-transform:uppercase; letter-spacing:.12em; font-size:12px; color:#0ea5b7; font-weight:700; }
  h1 { font-size:38px; line-height:1.15; margin:10px 0 14px; }
  .meta { font-family:system-ui,sans-serif; font-size:14px; color:#667085; margin-bottom:28px; }
  h2 { font-size:24px; margin:32px 0 10px; }
  p { margin-bottom:18px; }
  blockquote { border-left:4px solid #0ea5b7; padding-left:18px; color:#475467; font-style:italic; margin:22px 0; }
  code { font-family:ui-monospace,monospace; background:#f2f4f7; padding:2px 6px; border-radius:5px; font-size:.9em; }
  .author { display:flex; gap:12px; align-items:center; margin-top:36px; padding-top:22px; border-top:1px solid #eaecf0; font-family:system-ui,sans-serif; }
  .dot { width:44px; height:44px; border-radius:50%; background:#0ea5b7; color:#fff; display:grid; place-items:center; font-weight:800; }
</style>
</head>
<body>
  <div class="cover"></div>
  <article>
    <div class="kicker">Learning</div>
    <h1>How to actually learn to code in 2026</h1>
    <div class="meta">8 min read · August 5, 2026</div>
    <p>Most people quit programming not because it is hard, but because they never build anything. The fastest path is a loop: learn a concept, use it immediately, then teach it back to yourself.</p>
    <h2>Start with output, not theory</h2>
    <p>Type <code>print("hello")</code> before reading a chapter on interpreters. Feedback keeps motivation alive.</p>
    <blockquote>Read less, run more. A single working program teaches more than ten tutorials.</blockquote>
    <h2>Build in public</h2>
    <p>Ship small projects weekly and share them. Constraints and deadlines do more for skill than any curriculum.</p>
    <div class="author"><div class="dot">C</div><div><strong>NTWARI Cedrick</strong><br /><span style="color:#667085;font-size:14px">Founder, CodeLearn</span></div></div>
  </article>
</body>
</html>`,
  },
];

export const templateCategories = ["All", "Landing", "Portfolio", "Dashboard", "Component", "Form", "Blog"] as const;
