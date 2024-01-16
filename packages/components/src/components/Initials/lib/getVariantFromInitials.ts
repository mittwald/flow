type Variants = number;

export const getVariantFromInitials = (initials: string[]): Variants => {
  if (initials.length < 1) {
    return 1;
  }
  return ((initials[0].charCodeAt(0) % 4) + 1) as Variants;
};
