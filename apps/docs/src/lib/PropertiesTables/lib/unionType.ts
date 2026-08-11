/** `Iterable<A | B> | null` yields two members, not three. */
export const splitUnion = (type: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (const char of type) {
    if ("<([{".includes(char)) {
      depth++;
    } else if (">)]}".includes(char)) {
      depth--;
    }

    if (char === "|" && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current.trim());

  return parts.filter(Boolean);
};

const stringLiteralPattern = /^["'](.*)["']$/;

export const unquote = (member: string): string =>
  member.replace(stringLiteralPattern, "$1");
