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

const COMPILER_OPTIONS: Partial<Record<Language, string>> = {
  cpp: "warning,gnu++2b",
  c: "warning,c17",
};

const cache = new Map<string, { output: string; status: string; at: number }>();
const CACHE_TTL = 1000 * 60 * 10;
const MAX_CODE_LENGTH = 40_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const runWithWandbox = async (language: Language, code: string) => {
  const compiler = COMPILERS[language];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compiler, code, options: COMPILER_OPTIONS[language] ?? "" }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Runner service returned ${res.status}`);
    }

    const data = await res.json();
    const output = [data?.compiler_error, data?.compiler_output, data?.program_output, data?.program_error]
      .filter(Boolean)
      .join("\n")
      .trim();

    return {
      output: output || "(no output)",
      status: data?.status === "0" ? "ok" : "error",
    };
  } finally {
    clearTimeout(timeout);
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Use POST to run code." }, 405);
  }

  try {
    const body = await req.json();
    const language = body?.language as Language;
    const code = typeof body?.code === "string" ? body.code : "";

    if (!Object.hasOwn(COMPILERS, language)) {
      return json({ error: "Unsupported language." }, 400);
    }

    if (!code.trim()) {
      return json({ output: "(no code to run)", status: "ok" });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return json({ error: "Code is too long. Please keep it under 40,000 characters." }, 413);
    }

    const key = `${language}:${code}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.at < CACHE_TTL) {
      return json({ output: cached.output, status: cached.status, cached: true });
    }

    let result;
    try {
      result = await runWithWandbox(language, code);
    } catch (_firstError) {
      result = await runWithWandbox(language, code);
    }

    cache.set(key, { ...result, at: Date.now() });
    return json(result);
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError"
      ? "Runner timed out. Try a smaller program or run again."
      : error instanceof Error
        ? error.message
        : "Failed to run code.";

    return json({ error: message }, 500);
  }
});
