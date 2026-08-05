import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { courses } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import { pullProgress } from "@/lib/progressSync";
import { supabase } from "@/integrations/supabase/client";
import { Award, Flame, GraduationCap, Trophy, ArrowRight } from "lucide-react";

const COMPLETE_KEY = "codelearn_progress";

interface CertRow {
  id: string;
  course_id: string;
  course_name: string;
  learner_name: string;
  score: number;
  total: number;
  issued_at: string;
}

const readComplete = (): Record<string, string[]> => {
  try {
    return JSON.parse(localStorage.getItem(COMPLETE_KEY) || "{}");
  } catch {
    return {};
  }
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [complete, setComplete] = useState<Record<string, string[]>>(readComplete);
  const [certs, setCerts] = useState<CertRow[]>([]);

  useEffect(() => {
    const refresh = () => setComplete(readComplete());
    window.addEventListener("progress-synced", refresh);
    if (user) {
      pullProgress(user.id).then(refresh);
      supabase
        .from("certificates")
        .select("id, course_id, course_name, learner_name, score, total, issued_at")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false })
        .then(({ data }) => setCerts((data as CertRow[]) ?? []));
    }
    return () => window.removeEventListener("progress-synced", refresh);
  }, [user]);

  const rows = useMemo(
    () =>
      courses.map((c) => {
        const done = (complete[c.id] || []).filter((l) => c.lessons.some((x) => x.id === l));
        const pct = Math.round((done.length / c.lessons.length) * 100);
        const next = c.lessons.find((l) => !done.includes(l.id)) ?? c.lessons[0];
        return { course: c, done: done.length, pct, next };
      }),
    [complete]
  );

  const totalLessons = rows.reduce((a, r) => a + r.course.lessons.length, 0);
  const totalDone = rows.reduce((a, r) => a + r.done, 0);
  const started = rows.filter((r) => r.done > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-20">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Your <span className="text-gradient-primary">Learning Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            {user
              ? `Welcome back, ${user.user_metadata?.full_name || user.email}. Your progress syncs across devices.`
              : "You're browsing as a guest — progress is saved on this device only."}
          </p>
          {!user && !loading && (
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold glow-cyan"
            >
              Sign in to sync &amp; earn certificates <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Lessons completed", value: `${totalDone}/${totalLessons}`, icon: GraduationCap },
            { label: "Courses started", value: `${started}/${courses.length}`, icon: Flame },
            { label: "Overall progress", value: `${Math.round((totalDone / totalLessons) * 100)}%`, icon: Trophy },
            { label: "Certificates", value: `${certs.length}`, icon: Award },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-glass rounded-2xl p-5">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <div className="text-2xl font-extrabold text-gradient-primary">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">Courses</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-14">
          {rows.map(({ course, done, pct, next }) => (
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

        <h2 className="text-xl font-bold mb-4">Certificates</h2>
        {certs.length === 0 ? (
          <div className="card-glass rounded-2xl p-8 text-center text-muted-foreground">
            No certificates yet — pass a certification test with 70% or more to earn your first one.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((c) => (
              <Link key={c.id} to={`/verify/${c.id}`} className="card-glass rounded-2xl p-5 hover:-translate-y-1 transition-transform">
                <Award className="w-6 h-6 text-accent mb-2" />
                <div className="font-bold">{c.course_name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Score {Math.round((c.score / c.total) * 100)}% · {new Date(c.issued_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-primary mt-3">View &amp; share →</div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
