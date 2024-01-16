export const getVariantFromInitials = (initials: string[]): number => {
  if (initials.length < 1) {
    return 1;
  }
  return (initials[0].charCodeAt(0) % 4) + 1;
};
