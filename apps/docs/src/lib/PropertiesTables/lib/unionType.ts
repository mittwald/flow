/** `Iterable<A | B> | null` yields two members, not three. */
export const splitUnion = (type: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  let previousChar = "";

  for (const char of type) {
    // The ">" of an arrow function type closes nothing.
    const isArrow = char === ">" && previousChar === "=";
    previousChar = char;

    if ("<([{".includes(char)) {
      depth++;
    } else if (">)]}".includes(char) && !isArrow) {
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

const unquote = (member: string): string =>
  member.replace(stringLiteralPattern, "$1");

export interface FormattedType {
  members: string[];
  /** The member the default value refers to, if the type names one. */
  defaultMember: string | null;
}

export const formatType = (
  type: string,
  defaultValue?: string | null,
): FormattedType => {
  const members = splitUnion(type).map(unquote);
  const trimmedDefault = defaultValue?.trim();
  const normalizedDefault = trimmedDefault ? unquote(trimmedDefault) : null;

  return {
    members,
    defaultMember:
      members.find((member) => member === normalizedDefault) ?? null,
  };
};
