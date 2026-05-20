export const getInitialsFromString = (value: string): string[] => {
  if (!value.trim()) {
    return [];
  }

  return value
    .trim()
    .split(/\s+/)
    .map((part) => {
      const normalized = part.trim();

      const match = normalized.match(/(\p{Emoji}|\p{L})/u);

      return match ? match[0].toUpperCase() : "";
    })
    .filter(Boolean)
    .slice(0, 2);
};
