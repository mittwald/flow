import { partition } from "remeda";

/** `Iterable<A | B> | null` yields two members, not three. */
const splitUnion = (type: string): string[] => {
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
  /** Union members in display order — the default value first. */
  members: string[];
  /** True when the first member is the default value. */
  includesDefault: boolean;
}

export const formatType = (
  type: string,
  defaultValue?: string | null,
): FormattedType => {
  const members = splitUnion(type).map(unquote);
  const trimmedDefault = defaultValue?.trim();
  const normalizedDefault = trimmedDefault ? unquote(trimmedDefault) : null;
  const [defaultMembers, otherMembers] = partition(
    members,
    (member) => member === normalizedDefault,
  );

  return {
    members: [...defaultMembers, ...otherMembers],
    includesDefault: defaultMembers.length > 0,
  };
};
