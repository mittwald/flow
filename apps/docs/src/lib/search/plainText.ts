import slugify from "slugify";

export interface DocHeading {
  text: string;
  level: number;
  slug?: string;
}

const stripCodeFences = (mdx: string): string =>
  mdx.replace(/```[\s\S]*?```/g, " ");

export const mdxToPlainText = (mdx: string): string => {
  let text = stripCodeFences(mdx);

  // Import/export statements
  text = text.replace(/^\s*(import|export)\s.*$/gm, " ");
  // MDX expression comments {/* ... */} and HTML comments
  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  // JSX / HTML tags (keep the inner text between them)
  text = text.replace(/<\/?[A-Za-z][^>]*>/g, " ");
  // Images and links -> keep the visible text only
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  // Heading, blockquote and list markers at the start of a line
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^\s*>\s?/gm, "");
  text = text.replace(/^\s*([*+-]|\d+\.)\s+/gm, "");
  // Table separator rows and pipes
  text = text.replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ");
  text = text.replace(/\|/g, " ");
  // Horizontal rules
  text = text.replace(/^\s*([-*_])\1{2,}\s*$/gm, " ");
  // Emphasis / inline code markers
  text = text.replace(/(\*\*|__|~~|\*|_)/g, "");
  text = text.replace(/`+/g, "");
  // Collapse whitespace
  return text.replace(/\s+/g, " ").trim();
};

export const extractHeadings = (mdx: string): DocHeading[] => {
  const headings: DocHeading[] = [];
  let currentH1: string | null = null;

  for (const rawLine of stripCodeFences(mdx).split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.startsWith("# ")) {
      const text = line.substring(2).trim();
      currentH1 = text;
      headings.push({
        text,
        level: 1,
        slug: slugify(text, { lower: true, strict: true }),
      });
    } else if (line.startsWith("## ")) {
      const text = line.substring(3).trim();
      const slugText = currentH1 ? `${currentH1} ${text}` : text;
      headings.push({
        text,
        level: 2,
        slug: slugify(slugText, { lower: true, strict: true }),
      });
    } else if (line.startsWith("### ")) {
      headings.push({ text: line.substring(4).trim(), level: 3 });
    } else if (line.startsWith("#### ")) {
      headings.push({ text: line.substring(5).trim(), level: 4 });
    }
  }

  return headings;
};
