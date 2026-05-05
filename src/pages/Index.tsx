import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";
import { courses } from "@/data/courses";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";
import { ArrowDown, Code2, BookOpen, Users, Zap, Star } from "lucide-react";

const stats = [
  { label: "Programming Languages", value: "6", icon: Code2 },
  { label: "Hands-on Lessons", value: "30+", icon: BookOpen },
  { label: "Code Examples", value: "100+", icon: Zap },
  { label: "Skill Levels", value: "All", icon: Star },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/85" />
        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(185 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(185 100% 50%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Free Programming Courses — Learn by Doing
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-gradient-primary">Master Coding</span>
            <br />
            <span className="text-foreground">From Zero to Hero</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Learn <span className="text-primary font-semibold">Python</span>,{" "}
            <span className="text-accent font-semibold">C</span>,{" "}
            <span className="text-primary font-semibold">C++</span>,{" "}
            <span className="text-amber-400 font-semibold">HTML</span>,{" "}
            <span className="text-blue-400 font-semibold">CSS</span>, and{" "}
            <span className="text-yellow-400 font-semibold">JavaScript</span>{" "}
            with interactive examples, real code, and step-by-step lessons.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              to="#courses"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 bg-gradient-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all glow-cyan hover:scale-105"
            >
              🚀 Start Learning Free
            </Link>
            <Link
              to="/course/python"
              className="px-8 py-4 border border-border rounded-xl font-semibold text-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              Try Python →
            </Link>
          </div>

          {/* Language pill icons */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {courses.map((c) => (
              <Link
                key={c.id}
                to={`/course/${c.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border hover:border-primary/50 hover:bg-secondary transition-all text-sm font-medium"
              >
                <span>{c.icon}</span>
                <span className="text-muted-foreground">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-float">
          <ArrowDown className="w-6 h-6" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-extrabold text-gradient-primary mb-1">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            ALL COURSES
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Choose Your <span className="text-gradient-primary">Language</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Each course includes structured lessons, interactive code examples, and real output so you can learn by doing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              name={course.fullName}
              description={course.description}
              icon={course.icon}
              color={course.color}
              lessons={course.lessons.length}
              duration={course.duration}
              level={course.level}
              topics={course.topics}
            />
          ))}
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-card/20 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Recommended <span className="text-gradient-amber">Learning Path</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
            Not sure where to start? Follow this path from beginner to advanced.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-2 max-w-4xl mx-auto">
            {[
              { name: "HTML", icon: "🌐", color: "text-orange-400" },
              { arrow: true },
              { name: "CSS", icon: "🎨", color: "text-blue-400" },
              { arrow: true },
              { name: "JavaScript", icon: "✨", color: "text-yellow-400" },
              { arrow: true },
              { name: "Python", icon: "🐍", color: "text-green-400" },
              { arrow: true },
              { name: "C", icon: "⚙️", color: "text-slate-400" },
              { arrow: true },
              { name: "C++", icon: "⚡", color: "text-cyan-400" },
            ].map((item, i) =>
              "arrow" in item ? (
                <span key={i} className="text-muted-foreground text-xl font-bold">→</span>
              ) : (
                <Link
                  key={item.name}
                  to={`/course/${item.name?.toLowerCase()}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl card-glass hover:border-primary/50 transition-all hover:-translate-y-1 w-24"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-xs font-bold ${item.color}`}>{item.name}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto card-glass rounded-3xl p-12">
          <div className="text-5xl mb-6">🎯</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to <span className="text-gradient-primary">Start Coding?</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Pick any language and begin your journey. Every expert was once a beginner.
          </p>
          <Link
            to="/course/python"
            className="inline-block px-8 py-4 bg-gradient-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all glow-cyan hover:scale-105"
          >
            Start with Python — It's the Easiest! 🐍
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
