/**
 * Sandboxed in-browser JS/TS runner.
 *
 * The learner's code runs inside a dedicated Web Worker created from a blob URL, so:
 * - it has no access to the DOM, cookies, or localStorage of the app,
 * - it can be hard-stopped at any time (worker.terminate()),
 * - it is killed automatically after a wall-clock timeout (runaway loops),
 * - console output is captured and capped in size.
 */

const MAX_OUTPUT_CHARS = 20_000;
const MAX_LOG_LINES = 2_000;
export const BROWSER_TIMEOUT_MS = 8_000;

const WORKER_SOURCE = `
const logs = [];
const MAX_LINES = ${MAX_LOG_LINES};
const fmt = (a) => {
  if (typeof a === "string") return a;
  try { return JSON.stringify(a); } catch { return String(a); }
};
const push = (prefix, args) => {
  if (logs.length >= MAX_LINES) return;
  logs.push(prefix + args.map(fmt).join(" "));
};
const sandboxConsole = {
  log: (...a) => push("", a),
  info: (...a) => push("", a),
  debug: (...a) => push("", a),
  warn: (...a) => push("[warn] ", a),
  error: (...a) => push("[error] ", a),
  table: (...a) => push("", a),
};
self.console = sandboxConsole;
// Remove network + storage capabilities from the sandbox.
try { self.fetch = () => { throw new Error("Network access is disabled in the sandbox."); }; } catch {}
try { self.XMLHttpRequest = function () { throw new Error("Network access is disabled in the sandbox."); }; } catch {}
try { self.importScripts = () => { throw new Error("importScripts is disabled in the sandbox."); }; } catch {}

self.onmessage = (e) => {
  const src = e.data && e.data.code;
  try {
    const fn = new Function("console", '"use strict";\\n' + src);
    const result = fn(sandboxConsole);
    if (result !== undefined) push("", [result]);
  } catch (err) {
    push("", ["Error: " + (err && err.message ? err.message : String(err))]);
  }
  self.postMessage({ output: logs.join("\\n") });
};
`;

export interface BrowserRunHandle {
  promise: Promise<string>;
  stop: () => void;
}

export const runJsSandboxed = (code: string): BrowserRunHandle => {
  const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  const worker = new Worker(url);
  let settled = false;

  const cleanup = () => {
    worker.terminate();
    URL.revokeObjectURL(url);
  };

  let stopFn = () => {};

  const promise = new Promise<string>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(`Execution timed out after ${BROWSER_TIMEOUT_MS / 1000}s — check for infinite loops.`));
    }, BROWSER_TIMEOUT_MS);

    const finish = (value: string) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanup();
      const out = value.length > MAX_OUTPUT_CHARS
        ? value.slice(0, MAX_OUTPUT_CHARS) + "\n\n… output truncated."
        : value;
      resolve(out || "(no output)");
    };

    worker.onmessage = (e: MessageEvent<{ output: string }>) => finish(e.data?.output ?? "");
    worker.onerror = (e) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanup();
      reject(new Error(e.message || "Sandbox error"));
    };

    stopFn = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanup();
      const err = new Error("Run stopped.");
      err.name = "AbortError";
      reject(err);
    };

    worker.postMessage({ code });
  });

  return { promise, stop: () => stopFn() };
};
