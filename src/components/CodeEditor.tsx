import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const MonacoEditor = lazy(() =>
  import("@monaco-editor/react").then((m) => ({ default: m.default })),
);

export interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onCursorChange?: (pos: { line: number; col: number }) => void;
  height?: number | string;
}

const THEME = "codelearn-dark";

const CodeEditor = ({
  value,
  language,
  onChange,
  onRun,
  onCursorChange,
  height = "100%",
}: CodeEditorProps) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center h-full min-h-[420px] text-muted-foreground text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading editor…
      </div>
    }
  >
    <MonacoEditor
      height={height}
      language={language}
      value={value}
      theme={THEME}
      onChange={(v) => onChange(v ?? "")}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme(THEME, {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: "5b6b82", fontStyle: "italic" },
            { token: "keyword", foreground: "22d3ee" },
            { token: "string", foreground: "7ee787" },
            { token: "number", foreground: "f0a868" },
            { token: "type", foreground: "8ab4f8" },
          ],
          colors: {
            "editor.background": "#0a0f18",
            "editor.lineHighlightBackground": "#111a28",
            "editorLineNumber.foreground": "#3c4a60",
            "editorLineNumber.activeForeground": "#22d3ee",
            "editorCursor.foreground": "#22d3ee",
            "editorIndentGuide.background1": "#1b2534",
            "editorGutter.background": "#080d15",
          },
        });
        monaco.languages.typescript?.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false,
        });
      }}
      onMount={(editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun?.());
        editor.onDidChangeCursorPosition((e) =>
          onCursorChange?.({ line: e.position.lineNumber, col: e.position.column }),
        );
      }}
      options={{
        fontFamily:
          "ui-monospace, SFMono-Regular, 'JetBrains Mono', Menlo, Consolas, monospace",
        fontSize: 13,
        lineHeight: 20,
        minimap: { enabled: true, scale: 1 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        automaticLayout: true,
        scrollBeyondLastLine: false,
        tabSize: 2,
        renderWhitespace: "selection",
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        formatOnPaste: true,
        padding: { top: 12, bottom: 12 },
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
      }}
    />
  </Suspense>
);

export default CodeEditor;
