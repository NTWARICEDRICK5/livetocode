import { supabase } from "@/integrations/supabase/client";

export type RemoteCodeLanguage = "python" | "c" | "cpp";

interface RunCodeResult {
  output: string;
  status?: "ok" | "error";
  cached?: boolean;
}

const timeout = (ms: number) =>
  new Promise<never>((_, reject) => {
    window.setTimeout(() => reject(new Error("Runner timed out. Please try again.")), ms);
  });

export const runRemoteCode = async (language: RemoteCodeLanguage, code: string): Promise<RunCodeResult> => {
  try {
    const result = await Promise.race([
      supabase.functions.invoke<RunCodeResult>("run-code", {
        body: { language, code },
      }),
      timeout(12000),
    ]);

    if ("error" in result && result.error) {
      throw new Error(result.error.message || "Code runner failed.");
    }

    if (!result.data) {
      throw new Error("No output returned from the runner.");
    }

    if ("error" in result.data && typeof result.data.error === "string") {
      throw new Error(result.data.error);
    }

    return result.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Code runner failed.";
    throw new Error(message.includes("Failed to fetch") ? "Runner connection failed. Please run again." : message);
  }
};
