import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  output?: string;
  language?: string;
}

const CodeBlock = ({ code, output, language = "code" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border/50 shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[hsl(220_25%_5%)] border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-muted-foreground font-mono">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary/50"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="bg-[hsl(220_25%_5%)] p-5 overflow-x-auto">
        <pre className="text-sm font-mono text-foreground leading-relaxed whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>

      {/* Output */}
      {output && (
        <div className="border-t border-border/30">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="flex items-center gap-2 w-full px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors bg-[hsl(220_25%_7%)] hover:bg-[hsl(220_25%_9%)]"
          >
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>{showOutput ? "Hide" : "Show"} Output</span>
          </button>
          {showOutput && (
            <div className="bg-[hsl(220_25%_3%)] px-5 py-4 border-t border-border/30">
              <pre className="text-sm font-mono text-green-400 leading-relaxed whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
