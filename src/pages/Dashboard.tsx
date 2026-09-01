import AchievementIcon from "@/components/AchievementIcon";
import TechIcon from "@/components/TechIcon";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { courses } from "@/data/courses";
import { useLearner } from "@/hooks/useLearner";
import { ACHIEVEMENTS } from "@/lib/gamification";
import {
  Award,
  Flame,
  GraduationCap,
  Trophy,
  ArrowRight,
  Zap,
  Clock,
  Target,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { user, loading, profile, stats, continueLearning, daily, activity, achievements, progress } =
    useLearner();

  const name =
    profile?.full_name || profile?.display_name || user?.email?.split("@")[0] || "learner";

  const dailyGoal = profile?.daily_goal_minutes ?? 20;
  const weeklyGoal = profile?.weekly_goal_minutes ?? 120;
  const dailyPct = Math.min(100, Math.round((stats.minutesToday / Math.max(dailyGoal, 1)) * 100));
  const weeklyPct = Math.min(100, Math.round((stats.minutesWeek / Math.max(weeklyGoal, 1)) * 100));

  const courseRows = courses.map((c) => {
    const done = progress.filter((r) => r.course_id === c.id && r.completed).length;
    const next = c.lessons.find((l) => !progress.some((r) => r.lesson_id === l.id && r.completed)) ?? c.lessons[0];
    return { course: c, done, pct: Math.round((done / c.lessons.length) * 100), next };
  });

  const recommended = courseRows
    .filter((r) => r.pct < 100)
    .sort((a, b) => (b.pct > 0 ? 1 : 0) - (a.pct > 0 ? 1 : 0) || b.pct - a.pct)
    .slice(0, 3);

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-24 text-center">
          <h1 className="text-4xl font-extrabold mb-3">
            Your <span className="text-gradient-primary">Quadrant</span> dashboard
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to save your progress, earn XP, build streaks and pick up exactly where you stopped.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold glow-cyan"
          >
            Sign in to start <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-20">
        <header className="mb-8">
          <p className="text-sm text-primary font-semibold mb-1">Welcome back</p>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Hello, <span className="text-gradient-primary">{name}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Level {stats.level.level} · {stats.xp} XP · {stats.streak.current}-day streak
          </p>
        </header>

        {/* Continue learning */}
        <section aria-labelledby="continue-heading" className="mb-10">
          <h2 id="continue-heading" className="text-xl font-bold mb-4">
            Continue learning
          </h2>
          {continueLearning ? (
            <div className="card-glass rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-5">
              <span className="w-14 h-14 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center shrink-0"><TechIcon name={continueLearning.course.id} className="w-8 h-8" /></span>
              <div className="flex-1">
                <div className="font-bold text-lg">{continueLearning.course.fullName}</div>
                <div className="text-sm text-muted-foreground">
                  Lesson · {continueLearning.lesson.title}
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden mt-3 max-w-md">
                  <div
                    className="h-full bg-gradient-primary transition-all"
                    style={{ width: `${continueLearning.percent}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {continueLearning.percent}% complete
                </div>
              </div>
              <Link
                to={`/course/${continueLearning.course.id}?lesson=${continueLearning.lesson.id}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold glow-cyan"
              >
                <PlayCircle className="w-4 h-4" /> Resume learning
              </Link>
            </div>
          ) : (
            <div className="card-glass rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <p className="flex-1 text-muted-foreground">
                You haven't started a lesson yet. Python is the friendliest place to begin.
              </p>
              <Link
                to="/course/python"
                className="px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold"
              >
                Start your first lesson
              </Link>
            </div>
          )}
        </section>

        {/* Goals + XP */}
        <section className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="card-glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
              <Target className="w-4 h-4 text-primary" /> Today's goal
            </div>
            <div className="text-2xl font-extrabold text-gradient-primary">
              {stats.minutesToday}/{dailyGoal} min
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden mt-3">
              <div className="h-full bg-gradient-primary" style={{ width: `${dailyPct}%` }} />
            </div>
          </div>
          <div className="card-glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
              <Clock className="w-4 h-4 text-primary" /> Weekly goal
            </div>
            <div className="text-2xl font-extrabold text-gradient-primary">
              {stats.minutesWeek}/{weeklyGoal} min
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden mt-3">
              <div className="h-full bg-gradient-primary" style={{ width: `${weeklyPct}%` }} />
            </div>
          </div>
          <div className="card-glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
              <Zap className="w-4 h-4 text-accent" /> Level {stats.level.level}
            </div>
            <div className="text-2xl font-extrabold text-gradient-primary">{stats.xp} XP</div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden mt-3">
              <div className="h-full bg-gradient-primary" style={{ width: `${stats.level.percent}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.level.needed} XP to level {stats.level.level + 1}
            </div>
          </div>
        </section>

        {/* Stat tiles */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Current streak", value: `${stats.streak.current}d`, icon: Flame },
            { label: "Lessons completed", value: `${stats.lessonsCompleted}`, icon: GraduationCap },
            { label: "Quiz average", value: `${stats.quizAverage}%`, icon: Trophy },
            { label: "Certificates", value: `${stats.certificates}`, icon: Award },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-glass rounded-2xl p-5">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <div className="text-2xl font-extrabold text-gradient-primary">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </section>

        {/* Analytics */}
        <section aria-labelledby="analytics-heading" className="mb-12">
          <h2 id="analytics-heading" className="text-xl font-bold mb-4">
            Learning analytics
          </h2>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="card-glass rounded-2xl p-5">
              <div className="text-sm font-semibold mb-4">Study minutes — last 14 days</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={daily}>
                    <defs>
                      <linearGradient id="mins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      stroke="hsl(var(--primary))"
                      fill="url(#mins)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card-glass rounded-2xl p-5">
              <div className="text-sm font-semibold mb-4">XP earned — last 14 days</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="xp" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              ["Total study time", `${Math.round(stats.minutesTotal / 60)}h ${stats.minutesTotal % 60}m`],
              ["This month", `${stats.minutesMonth} min`],
              ["Courses started", `${stats.coursesTouched}/${courses.length}`],
              ["Courses completed", `${stats.coursesCompleted}`],
            ].map(([label, value]) => (
              <div key={label} className="card-glass rounded-2xl p-4">
                <div className="text-lg font-extrabold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section aria-labelledby="ach-heading" className="mb-12">
          <h2 id="ach-heading" className="text-xl font-bold mb-4">
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = achievements.includes(a.code);
              return (
                <div
                  key={a.code}
                  title={a.description}
                  className={`card-glass rounded-2xl p-4 text-center transition-all ${
                    unlocked ? "border-primary/40" : "opacity-40 grayscale"
                  }`}
                >
                  <div className="flex justify-center mb-2 text-primary"><AchievementIcon name={a.icon} className="w-7 h-7" /></div>
                  <div className="text-xs font-bold">{a.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {unlocked ? "Unlocked" : "Locked"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommended + recent activity */}
        <section className="grid lg:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="text-xl font-bold mb-4">Recommended for you</h2>
            <div className="space-y-3">
              {recommended.map(({ course, next, pct }) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}?lesson=${next.id}`}
                  className="card-glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
                >
                  <span className="text-2xl">{course.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{next.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {course.fullName} · {pct}% done
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Recent activity</h2>
            <div className="card-glass rounded-2xl divide-y divide-border/50">
              {activity.slice(0, 8).map((a) => (
                <div key={a.id} className="p-4 flex items-center gap-3">
                  <Zap className="w-4 h-4 text-accent" />
                  <div className="flex-1 text-sm">
                    {a.label || a.kind}
                    <div className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleString()}
                    </div>
                  </div>
                  {a.xp > 0 && <span className="text-xs font-bold text-primary">+{a.xp} XP</span>}
                </div>
              ))}
              {activity.length === 0 && (
                <div className="p-6 text-sm text-muted-foreground text-center">
                  No activity yet — complete a lesson to start earning XP.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Courses */}
        <h2 className="text-xl font-bold mb-4">Your courses</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {courseRows.map(({ course, done, pct, next }) => (
            <div key={course.id} className="card-glass rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{course.icon}</span>
                <div className="flex-1">
                  <div className="font-bold">{course.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {done} of {course.lessons.length} lessons · {course.level}
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4">
                <div className="h-full bg-gradient-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/course/${course.id}?lesson=${next.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-primary text-primary-foreground"
                >
                  {done === 0 ? "Start course" : done === course.lessons.length ? "Review" : "Continue"}
                </Link>
                <Link
                  to={`/certify/${course.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                >
                  Take certification test
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
