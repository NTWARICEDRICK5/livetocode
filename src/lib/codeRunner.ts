import { supabase } from "@/integrations/supabase/client";

export type RemoteCodeLanguage = "python" | "c" | "cpp";

export interface RunCodeResult {
  output: string;
  status?: "ok" | "error";
  cached?: boolean;
  ms?: number;
}

export const CLIENT_TIMEOUT_MS = 20_000;
export const MAX_CODE_LENGTH = 40_000;

class AbortError extends Error {
  constructor() {
    super("Run stopped.");
    this.name = "AbortError";
  }
}

const timeout = (ms: number, signal?: AbortSignal) =>
  new Promise<never>((_, reject) => {
    const t = window.setTimeout(
      () => reject(new Error("Runner timed out. Please try again.")),
      ms,
    );
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(t);
        reject(new AbortError());
      },
      { once: true },
    );
  });

export const runRemoteCode = async (
  language: RemoteCodeLanguage,
  code: string,
  signal?: AbortSignal,
): Promise<RunCodeResult> => {
  if (code.length > MAX_CODE_LENGTH) {
    throw new Error("Code is too long. Please keep it under 40,000 characters.");
  }

  try {
    const result = await Promise.race([
      supabase.functions.invoke<RunCodeResult & { error?: string }>("run-code", {
        body: { language, code },
      }),
      timeout(CLIENT_TIMEOUT_MS, signal),
    ]);

    if ("error" in result && result.error) {
      throw new Error(result.error.message || "Code runner failed.");
    }

    if (!result.data) {
      throw new Error("No output returned from the runner.");
    }

    if (typeof result.data.error === "string") {
      throw new Error(result.data.error);
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    const message = error instanceof Error ? error.message : "Code runner failed.";
    throw new Error(
      message.includes("Failed to fetch")
        ? "Runner connection failed. Please run again."
        : message,
    );
  }
};
