import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Award, Printer, Copy, Check } from "lucide-react";

interface CertRow {
  id: string;
  course_name: string;
  learner_name: string;
  score: number;
  total: number;
  issued_at: string;
}

const Verify = () => {
  const { certId } = useParams();
  const [cert, setCert] = useState<CertRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!certId) return;
    supabase
      .from("certificates")
      .select("id, course_name, learner_name, score, total, issued_at")
      .eq("id", certId)
      .maybeSingle()
      .then(({ data }) => {
        setCert((data as CertRow) ?? null);
        setLoading(false);
      });
  }, [certId]);

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-3xl">
        {loading ? (
          <p className="text-center text-muted-foreground">Verifying certificate…</p>
        ) : !cert ? (
          <div className="card-glass rounded-2xl p-10 text-center">
            <h1 className="text-2xl font-extrabold mb-2">Certificate not found</h1>
            <p className="text-muted-foreground mb-6">This certificate ID is not valid.</p>
            <Link to="/dashboard" className="text-primary font-semibold">Go to dashboard →</Link>
          </div>
        ) : (
          <>
            <div className="print-cert card-glass rounded-3xl p-10 md:p-14 text-center border-2 border-primary/40">
              <Award className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-xs tracking-[0.3em] text-muted-foreground mb-6">CERTIFICATE OF COMPLETION</div>
              <p className="text-muted-foreground mb-2">This certifies that</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gradient-primary mb-4">{cert.learner_name}</h1>
              <p className="text-muted-foreground mb-2">has successfully completed the course</p>
              <h2 className="text-2xl font-bold mb-6">{cert.course_name}</h2>
              <p className="text-muted-foreground">
                with a score of{" "}
                <span className="text-primary font-bold">
                  {Math.round((cert.score / cert.total) * 100)}%
                </span>{" "}
                ({cert.score}/{cert.total})
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mt-10 pt-6 border-t border-border/60 text-left text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Issued on</div>
                  <div className="font-semibold">{new Date(cert.issued_at).toLocaleDateString()}</div>
                </div>
                <div className="sm:text-right">
                  <div className="text-muted-foreground text-xs">Signed by</div>
                  <div className="font-semibold">NTWARI Cedrick · CodeLearn</div>
                </div>
              </div>
              <div className="mt-6 text-[11px] text-muted-foreground break-all">Certificate ID: {cert.id}</div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-8 no-print">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold glow-cyan"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
              <button
                onClick={share}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                {copied ? "Link copied" : "Copy share link"}
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              >
                Dashboard
              </Link>
            </div>
          </>
        )}
      </main>
      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
};

export default Verify;
