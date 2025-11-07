import MarkdownIt from "markdown-it";

// html: false blocks raw HTML in the source for safety.
// Set to true ONLY if you fully trust the content source.
export const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

export function renderMd(source: string): string {
  return md.render(source);
}

// utils/text.ts
export function dedentMarkdown(input: string): string {
  // Trim leading/trailing blank lines first
  const trimmed = input.replace(/^\n+|\n+$/g, "");
  const lines = trimmed.split("\n");

  // Ignore fully empty first/last lines when computing indent
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  const indents = nonEmpty.map((l) => (l.match(/^ +/)?.[0].length ?? 0));
  const minIndent = indents.length ? Math.min(...indents) : 0;

  return lines.map((l) => l.slice(minIndent)).join("\n");
}
