import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight, { type Options as RehypeHighlightOptions } from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

type RichContentProps = {
  text: string;
  inline?: boolean;
  className?: string;
};

const inlineComponents: Components = {
  p: ({ children }) => <>{children}</>,
};
const highlightOptions: RehypeHighlightOptions = { detect: true };

export function RichContent({ text, inline = false, className }: RichContentProps) {
  const content = normalizeMathDelimiters(text);
  const classes = ["rich-content", inline ? "inline-rich-content" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  if (inline) {
    return (
      <span className={classes}>
        <ReactMarkdown
          components={inlineComponents}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, [rehypeHighlight, highlightOptions]]}
        >
          {content}
        </ReactMarkdown>
      </span>
    );
  }

  return (
    <div className={classes}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, [rehypeHighlight, highlightOptions]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function normalizeMathDelimiters(text: string) {
  return text
    .replace(/\\\[([\s\S]+?)\\\]/g, (_match, math: string) => {
      return `\n\n$$\n${math.trim()}\n$$\n\n`;
    })
    .replace(/\\\(([\s\S]+?)\\\)/g, (_match, math: string) => `$${math}$`);
}
