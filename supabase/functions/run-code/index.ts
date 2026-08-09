// Secure code execution proxy.
//
// Security model:
// - Code is NEVER executed in this function or on any app server. It is forwarded to an
//   isolated third-party sandbox (Wandbox) that runs each program in a throwaway jail with
//   no filesystem persistence and no inbound network access.
// - Hard wall-clock timeout per run (abort controller) so a hung program cannot pin a worker.
// - Payload limits: max code length, max request body size, max output size returned.
// - Per-client rate limiting (sliding window, per minute + per hour) keyed by user id or IP.
// - Only an allow-listed set of languages/compilers can be reached; no user-controlled
//   compiler, options, or shell arguments are forwarded.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Language = "python" | "c" | "cpp";

const COMPILERS: Record<Language, string> = {
  python: "cpython-3.13.8",
  c: "gcc-13.2.0-c",
  cpp: "gcc-13.2.0",
};

// Fixed, server-side only. Never taken from the request.
const COMPILER_OPTIONS: Partial<Record<Language, string>> = {
  cpp: "warning,gnu++2b",
  c: "warning,c17",
};

// ---- Limits -----------------------------------------------------------------
const MAX_BODY_BYTES = 128 * 1024; // 128 KB request body
const MAX_CODE_LENGTH = 40_000; // characters
const MAX_OUTPUT_CHARS = 20_000; // characters returned to the client
const RUN_TIMEOUT_MS = 8_000; // wall clock per sandbox call
const TOTAL_TIMEOUT_MS = 15_000; // including the single retry
const RATE_PER_MINUTE = 15;
const RATE_PER_HOUR = 150;

// ---- Result cache -----------------------------------------------------------
const cache = new Map<string, { output: string; status: string; at: number }>();
const CACHE_TTL = 1000 * 60 * 10;
const CACHE_MAX = 500;

// ---- Rate limiting (in-memory, per instance) --------------------------------
const hits = new Map<string, number[]>();
const HITS_MAX_KEYS = 5_000;

const rateLimit = (key: string) => {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < 3_600_000);
  const lastMinute = list.filter((t) => now - t < 60_000).length;

  if (lastMinute >= RATE_PER_MINUTE) {
    return { ok: false as const, retryAfter: 60 };
  }
  if (list.length >= RATE_PER_HOUR) {
    return { ok: false as const, retryAfter: 600 };
  }

  list.push(now);
  if (hits.size > HITS_MAX_KEYS) hits.clear();
  hits.set(key, list);
  return { ok: true as const, retryAfter: 0 };
};

const clientKey = (req: Request) => {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  // Use the JWT subject when present (stable per user), otherwise the source IP.
  try {
    if (token.split(".").length === 3) {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload?.sub) return `u:${payload.sub}`;
    }
  } catch {
    // fall through to IP
  }
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  return `ip:${ip}`;
};

const json = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...extraHeaders },
  });

const clamp = (text: string) =>
  text.length > MAX_OUTPUT_CHARS
    ? text.slice(0, MAX_OUTPUT_CHARS) + `\n\n… output truncated at ${MAX_OUTPUT_CHARS} characters.`
    : text;

const runInSandbox = async (language: Language, code: string, signal: AbortSignal) => {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), RUN_TIMEOUT_MS);

  try {
    const res = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: COMPILERS[language],
        code,
        options: COMPILER_OPTIONS[language] ?? "",
        "compiler-option-raw": "",
        "runtime-option-raw": "",
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Runner service returned ${res.status}`);

    const data = await res.json();
    const output = [data?.compiler_error, data?.compiler_output, data?.program_output, data?.program_error]
      .filter(Boolean)
      .join("\n")
      .trim();

    return {
      output: clamp(output || "(no output)"),
      status: data?.status === "0" ? "ok" : "error",
    };
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Use POST to run code." }, 405);
  }

  const limit = rateLimit(clientKey(req));
  if (!limit.ok) {
    return json(
      { error: "Too many runs. Please wait a moment before running again." },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  const started = Date.now();
  const overall = new AbortController();
  const overallTimer = setTimeout(() => overall.abort(), TOTAL_TIMEOUT_MS);

  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ error: "Request too large." }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const payload = body as { language?: unknown; code?: unknown };
    const language = payload.language;
    const code = typeof payload.code === "string" ? payload.code : "";

    if (typeof language !== "string" || !Object.hasOwn(COMPILERS, language)) {
      return json({ error: "Unsupported language." }, 400);
    }

    if (!code.trim()) {
      return json({ output: "(no code to run)", status: "ok", ms: 0 });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return json({ error: "Code is too long. Please keep it under 40,000 characters." }, 413);
    }

    const key = `${language}:${code}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.at < CACHE_TTL) {
      return json({ output: cached.output, status: cached.status, cached: true, ms: Date.now() - started });
    }

    let result;
    try {
      result = await runInSandbox(language as Language, code, overall.signal);
    } catch (firstError) {
      if (overall.signal.aborted) throw firstError;
      result = await runInSandbox(language as Language, code, overall.signal);
    }

    if (cache.size > CACHE_MAX) cache.clear();
    cache.set(key, { ...result, at: Date.now() });
    return json({ ...result, ms: Date.now() - started });
  } catch (error) {
    const aborted = overall.signal.aborted || (error instanceof Error && error.name === "AbortError");
    const message = aborted
      ? "Execution timed out. Your program ran too long — check for infinite loops."
      : error instanceof Error
        ? error.message
        : "Failed to run code.";

    return json({ error: message }, aborted ? 408 : 500);
  } finally {
    clearTimeout(overallTimer);
  }
});
