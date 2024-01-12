type variants = 1 | 2 | 3 | 4;

export const getVariantFromInitials = (initials: string[]): variants => {
  if (initials.length < 1) {
    return 1;
  }
  return ((initials[0].charCodeAt(0) % 4) + 1) as variants;
};
